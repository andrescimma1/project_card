/**
 * Engine events → cues (what the player should hear and see, and when). Pure translation; the rules
 * never see any of this.
 *
 * Two sources:
 * - `planCues`: events applied to the board (draws, entering, DP, discards…). Events that belong to a
 *   cinematic (a battle, a digivolution) are left to that scene, and whatever comes after a scene is
 *   marked to wait for it, so a draw is never heard while the battle before it is still on screen.
 * - `battleStepCues`: one step of the battle replay on the board, timed to its animation.
 */
import type { AttackSlot, CrossEffect, DigimonCard } from '../engine/cards/types';
import type { GameEvent, PlayerId } from '../engine/game/types';
import type { Cue, CueName } from './bus';

export interface PlannedCue extends Cue {
  /** How many of this batch's scenes must be shown before it plays. */
  afterScenes: number;
}

export interface PlanCtx {
  /** Seats played by people (their own picks are already heard from the board). */
  humans: PlayerId[];
}

/** Time each cue takes before the next one of the same batch starts (ms). */
const GAP: Partial<Record<CueName, number>> = {
  CARD_DRAWN: 110,
  CARD_MOVED: 230,
  CARD_PLACED: 170,
  DP_CHARGED: 220,
  OPTION_PLAYED: 220,
  CARD_SET: 200,
  CARD_DISCARDED: 140,
  DECK_SHUFFLED: 460,
  ATTACK_LOCKED: 150,
  MONSTER_DEVOLVED: 320,
};
const MAX_SPREAD = 2400;
/** Longest spread of the cues that come just before a cinematic. */
const BEFORE_SCENE = 650;

export function planCues(events: GameEvent[], ctx: PlanCtx): { cues: PlannedCue[]; scenes: number } {
  const cues: PlannedCue[] = [];
  const clock = new Map<number, number>();
  let scenes = 0;
  const push = (name: CueName, data: Cue['data'] = {}) => {
    const t = clock.get(scenes) ?? 0;
    cues.push({ name, data, delay: Math.min(t, MAX_SPREAD), afterScenes: scenes });
    clock.set(scenes, t + (GAP[name] ?? 120));
  };

  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    switch (e.type) {
      case 'draw':
        push('CARD_DRAWN', { player: e.player });
        break;
      case 'handChanged':
        push('CARD_DISCARDED', { player: e.player });
        push('DECK_SHUFFLED', { player: e.player });
        break;
      case 'enter':
        push('CARD_MOVED', { player: e.player });
        push('CARD_PLACED', { player: e.player });
        break;
      case 'dpCharged':
        push('CARD_MOVED', { player: e.player });
        push('DP_CHARGED', { player: e.player, dp: e.dpTotal });
        break;
      case 'digivolveOptionPlayed':
        push('CARD_MOVED', { player: e.player });
        push('OPTION_PLAYED', { player: e.player });
        break;
      case 'digivolved':
      case 'armorDigivolved':
        scenes++; // the digivolution cinematic plays its own cues
        break;
      case 'devolved':
        push('MONSTER_DEVOLVED', { player: e.player });
        break;
      case 'attackChosen':
        if (!ctx.humans.includes(e.player)) push('ATTACK_LOCKED', { player: e.player });
        break;
      case 'supportChosen':
        if (e.from !== 'none') push('CARD_SET', { player: e.player });
        break;
      case 'cardsDiscarded':
        push('CARD_DISCARDED', { player: e.player });
        break;
      case 'reveal': {
        // the battle replay plays its steps; what it does not show is heard once it is over
        let j = i + 1;
        while (j < events.length && events[j].type !== 'turnStart') j++;
        scenes++;
        for (let k = i + 1; k < j; k++) {
          const x = events[k];
          if (x.type === 'cardsDiscarded') push('CARD_DISCARDED', { player: x.player });
          else if (x.type === 'devolved') push('MONSTER_DEVOLVED', { player: x.player });
        }
        i = j - 1;
        break;
      }
      default:
        break;
    }
  }
  // a cinematic starts right after these: play them quickly so they do not drag over it
  for (let k = 0; k < scenes; k++) {
    const group = cues.filter((c) => c.afterScenes === k);
    const last = Math.max(0, ...group.map((c) => c.delay ?? 0));
    if (last > BEFORE_SCENE) for (const c of group) c.delay = Math.round(((c.delay ?? 0) * BEFORE_SCENE) / last);
  }
  return { cues, scenes };
}

export interface StepCtx {
  /** The Digimon fighting this battle. */
  fighters: [DigimonCard | null, DigimonCard | null];
  /** Attacks as revealed so far (supports can change them). */
  attacks: [AttackSlot, AttackSlot] | null;
  /** What the board showed before this step. */
  prev: { hp: [number, number]; powers: [[number, number, number], [number, number, number]] };
  max: [number, number];
  /** The turn player (attacks first unless an effect swaps it). */
  turn: PlayerId;
  humans: PlayerId[];
}

/** When the lunge reaches the defender (Arena: 0.45 s lunge, peak at about half). */
export const IMPACT_MS = 220;

const COUNTER_OF: Partial<Record<CrossEffect, AttackSlot>> = { counterCircle: 'circle', counterTriangle: 'triangle', counterCross: 'cross' };

const sum = (v: number[]) => v.reduce((a, b) => a + b, 0);

export function battleStepCues(step: GameEvent, ctx: StepCtx): Cue[] {
  switch (step.type) {
    case 'reveal':
      return [{ name: 'ATTACK_REVEALED' }, { name: 'CLASH_START', delay: 420 }];
    case 'effect': {
      const out: Cue[] = [];
      const p = step.player;
      if (step.source !== 'cross') out.push({ name: 'CARD_REVEALED', data: { player: p } });
      out.push(
        step.source === 'cross'
          ? { name: 'ABILITY_ACTIVATED', data: { player: p, effect: ctx.fighters[p]?.crossEffect, source: 'cross' }, delay: 260 }
          : { name: 'SUPPORT_ACTIVATED', data: { player: p, source: step.source }, delay: 260 },
      );
      if (step.voided) out.push({ name: 'EFFECT_VOIDED', data: { player: p }, delay: 700 });
      else if (!step.conditionsMet) out.push({ name: 'EFFECT_FIZZLED', data: { player: p }, delay: 700 });
      else
        for (const w of [0, 1] as PlayerId[]) {
          const before = ctx.prev.hp[w];
          if (step.hp[w] > before) out.push({ name: 'HP_RECOVERED', data: { player: w }, delay: 700 });
          else if (step.hp[w] < before) out.push({ name: 'HIT_TAKEN', data: { player: w, damage: before - step.hp[w], lethal: step.hp[w] <= 0 }, delay: 700 });
          if (step.powers) {
            const d = sum(step.powers[w]) - sum(ctx.prev.powers[w]);
            if (d > 0) out.push({ name: 'STAT_UP', data: { player: w }, delay: 760 });
            else if (d < 0) out.push({ name: 'STAT_DOWN', data: { player: w }, delay: 760 });
          }
        }
      return out;
    }
    case 'attackOrder':
      return step.first !== ctx.turn ? [{ name: 'ORDER_SWAPPED', data: { player: step.first } }] : [];
    case 'crash':
      return [{ name: 'ABILITY_ACTIVATED', data: { player: step.player, effect: 'crash', source: 'cross' } }];
    case 'hit': {
      const slot = step.slot;
      const effect = slot === 'cross' ? ctx.fighters[step.attacker]?.crossEffect : undefined;
      const out: Cue[] = [{ name: 'ATTACK_RESOLVED', data: { player: step.attacker, slot, effect } }];
      const theirs = ctx.attacks?.[step.defender];
      if (effect && theirs && COUNTER_OF[effect] === theirs) out.push({ name: 'COUNTER', data: { player: step.attacker }, delay: 60 });
      if (step.damage <= 0) out.push({ name: 'ATTACK_BLOCKED', data: { player: step.defender, slot }, delay: IMPACT_MS });
      else
        out.push({
          name: 'HIT_TAKEN',
          data: { player: step.defender, slot, damage: step.damage, lethal: step.hp[step.defender] <= 0, heavy: step.damage >= ctx.max[step.defender] * 0.5 },
          delay: IMPACT_MS,
        });
      if (step.eaten > 0) out.push({ name: 'HP_RECOVERED', data: { player: step.attacker }, delay: IMPACT_MS + 420 });
      return out;
    }
    case 'ko':
      return [step.revived ? { name: 'HP_RECOVERED', data: { player: step.player } } : { name: 'MONSTER_DEFEATED', data: { player: step.player } }];
    case 'roundWon':
      return [{ name: 'ROUND_WON', data: { player: step.player, win: ctx.humans.includes(step.player) } }];
    default:
      return [];
  }
}
