/**
 * Battle resolution — port of KAWSEG 0x801E6AA4 (supports, ✕ effects, attack order, damage)
 * and 0x801ECF0C (KO, revive, rounds). docs/research/04-motor-original.md §4-§6.
 */
import { CROSS_EFFECT_SPEED } from '../cards/romTables';
import type { AttackSlot } from '../cards/types';
import { VALUE_CAP } from '../rules/primitives';
import { activeCard, applyCrossEffect, cardOf, runProgram, SLOT_CODE, type BattleCtx, type Fighter } from './effects';
import type { CardRef, GameState, PlayerId, PlayerState, StepResult, SupportSource } from './types';
import { count, popTop, pushTop } from './zones';
import { ROUNDS_TO_WIN } from '../rules/primitives';

const other = (x: PlayerId): PlayerId => (x === 0 ? 1 : 0);
const activeRef = (p: PlayerState): CardRef => p.stack.find((x) => x !== null) ?? -1;
const hpOf = (ctx: BattleCtx): [number, number] => [ctx.f[0].hp, ctx.f[1].hp];
const attacksOf = (ctx: BattleCtx): [AttackSlot, AttackSlot] => [ctx.state.players[0].attack ?? 'circle', ctx.state.players[1].attack ?? 'circle'];

function freshFighter(p: PlayerState): Fighter {
  return {
    hp: p.hp,
    power: [...p.powers] as [number, number, number],
    counter: false,
    first: false,
    voidDigimon: false,
    voidOption: false,
    crash: false,
    eatUp: false,
    revive: null,
  };
}

interface EffectSlot {
  owner: PlayerId;
  source: SupportSource;
  card: CardRef;
  speed: number;
}

/** The 6 resolution slots: [option T, option O, Digimon support T, Digimon support O, ✕ T, ✕ O]. */
function buildSlots(state: GameState): (EffectSlot | null)[] {
  const t = state.turn;
  const order: PlayerId[] = [t, other(t)];
  const slots: (EffectSlot | null)[] = Array(6).fill(null);
  order.forEach((who, k) => {
    const p = state.players[who];
    if (p.support && p.support.kind !== 'none') {
      const card = cardOf(p, p.support.card);
      if (card.kind === 'option') slots[k] = { owner: who, source: 'option', card: p.support.card, speed: card.supportSpeed };
      else if (card.kind === 'digimon') slots[2 + k] = { owner: who, source: 'support', card: p.support.card, speed: card.supportSpeed };
      // a Digivolve Option has speed -1 in the game: it never resolves
    }
    const active = activeCard(p);
    const stackTop = p.stack.find((x) => x !== null);
    if (active && active.kind === 'digimon' && stackTop !== undefined && stackTop !== null) {
      slots[4 + k] = { owner: who, source: 'cross', card: stackTop, speed: CROSS_EFFECT_SPEED[active.crossEffect] };
    }
  });
  return slots;
}

function resolveEffects(ctx: BattleCtx): void {
  const slots = buildSlots(ctx.state);
  for (let speed = 3; speed >= 1; speed--) {
    slots.forEach((slot) => {
      if (!slot || slot.speed !== speed) return;
      const f = ctx.f[slot.owner];
      const p = ctx.state.players[slot.owner];
      const card = cardOf(p, slot.card);
      if (slot.source === 'cross') {
        if (p.attack !== 'cross' || card.kind !== 'digimon') return;
        applyCrossEffect(ctx, slot.owner, card.crossEffect);
        ctx.events.push({ type: 'effect', player: slot.owner, source: 'cross', card: slot.card, speed, voided: false, conditionsMet: true, hp: hpOf(ctx), attacks: attacksOf(ctx) });
        return;
      }
      const voided = slot.source === 'option' ? f.voidOption : f.voidDigimon;
      let conditionsMet = false;
      if (!voided && card.kind !== 'digivolve') conditionsMet = runProgram(ctx, slot.owner, card.support.program);
      ctx.events.push({ type: 'effect', player: slot.owner, source: slot.source, card: slot.card, speed, voided, conditionsMet, hp: hpOf(ctx), attacks: attacksOf(ctx) });
    });
  }
}

/** Attack order + damage (0x801E7658 onwards). */
function fight(ctx: BattleCtx): void {
  const P = ctx.state.players;
  let first: PlayerId = ctx.state.turn;
  let second: PlayerId = other(first);
  const F = ctx.f;

  if (F[second].first) {
    if (F[first].first) {
      F[first].first = false;
      F[second].first = false;
    } else [first, second] = [second, first];
  }
  if (F[first].counter) {
    if (F[second].counter) {
      for (const w of [first, second]) F[w].power = [0, 0, 0];
    } else {
      F[first].first = false;
      [first, second] = [second, first];
    }
  }
  ctx.events.push({ type: 'attackOrder', first, second });

  const slotOf = (w: PlayerId) => SLOT_CODE[P[w].attack ?? 'circle'];
  if (F[second].counter) {
    F[second].power[slotOf(second)] = F[first].power[slotOf(first)];
    F[first].power = [0, 0, 0];
  }

  // first hit
  if (F[first].crash) {
    const crashPower = F[first].hp;
    if (F[second].counter) F[second].power[slotOf(second)] = crashPower;
    else F[first].power[2] = crashPower;
    F[first].hp = 10;
    ctx.events.push({ type: 'crash', player: first, card: activeRef(P[first]), power: crashPower, hp: hpOf(ctx) });
  }
  if (!hit(ctx, first, second)) return;

  // second hit
  if (F[second].crash) {
    if (!F[second].counter) F[second].power[2] = F[second].hp;
    if (F[second].power[2] !== 0) F[second].hp = 10;
    ctx.events.push({ type: 'crash', player: second, card: activeRef(P[second]), power: F[second].power[2], hp: hpOf(ctx) });
  }
  hit(ctx, second, first);

  function hit(c: BattleCtx, attacker: PlayerId, defender: PlayerId): boolean {
    const damage = c.f[attacker].power[slotOf(attacker)];
    let eaten = 0;
    if (c.f[attacker].eatUp) {
      eaten = Math.min(damage, c.f[defender].hp);
      c.f[attacker].hp = Math.min(c.f[attacker].hp + eaten, VALUE_CAP);
    }
    c.f[defender].hp = Math.max(c.f[defender].hp - damage, 0);
    c.events.push({ type: 'hit', attacker, defender, attackerCard: activeRef(P[attacker]), defenderCard: activeRef(P[defender]), damage, eaten, hp: hpOf(c) });
    return c.f[defender].hp > 0;
  }
}

function hasDigimonInHand(p: PlayerState): boolean {
  return p.hand.some((r) => r !== null && cardOf(p, r).kind === 'digimon');
}

function endGame(state: GameState, winner: PlayerId, reason: 'rounds' | 'noDigimon', ctx: BattleCtx) {
  state.winner = winner;
  state.endReason = reason;
  state.phase = { name: 'gameOver' };
  ctx.events.push({ type: 'gameOver', winner, reason });
}

/** KO handling (0x801ECF0C + state 36). */
function handleKo(ctx: BattleCtx, loser: PlayerId): void {
  const state = ctx.state;
  const winner = other(loser);
  const L = state.players[loser];
  const W = state.players[winner];
  const revive = ctx.f[loser].revive;
  const koCard = activeRef(L);
  if (revive !== null && W.rounds !== ROUNDS_TO_WIN - 1) {
    L.hp = revive;
    ctx.events.push({ type: 'ko', player: loser, card: koCard, revived: true });
  } else {
    const gone: CardRef[] = [];
    let c: CardRef | null;
    while ((c = popTop(L.stack)) !== null) {
      pushTop(L.offline, c);
      gone.push(c);
    }
    L.enteredAs = null;
    ctx.events.push({ type: 'ko', player: loser, card: koCard, revived: false });
    ctx.events.push({ type: 'cardsDiscarded', player: loser, cards: gone, from: 'stack' });
  }
  W.rounds += 1;
  ctx.events.push({ type: 'roundWon', player: winner, rounds: W.rounds });
  if (W.rounds >= ROUNDS_TO_WIN) return endGame(state, winner, 'rounds', ctx);
  if (count(L.stack) === 0 && !hasDigimonInHand(L) && count(L.online) === 0) endGame(state, winner, 'noDigimon', ctx);
}

/**
 * Simulation mode of the resolver (KAWSEG 0x801E6AA4 called with a0 = 1 by the CPU evaluation
 * 0x801E0CCC): the same supports, ✕ effects, attack order and damage, without zone commands and
 * without randomness. Returns the final HP of both players (+0x15A, floored at 0) before KO,
 * revive and rounds. The input state is not modified.
 */
export function simulateBattle(input: GameState): [number, number] {
  const state = structuredClone(input);
  const ctx: BattleCtx = { state, f: [freshFighter(state.players[0]), freshFighter(state.players[1])], events: [], temp: 0, sim: true };
  resolveEffects(ctx);
  fight(ctx);
  return [Math.max(ctx.f[0].hp, 0), Math.max(ctx.f[1].hp, 0)];
}

/**
 * Resolve a battle whose attacks and supports are chosen. Returns the state after damage, KO,
 * rounds and discarding the support cards. Turn hand-over is done by the turn module.
 */
export function resolveBattle(input: GameState): StepResult {
  const state = structuredClone(input);
  const ctx: BattleCtx = { state, f: [freshFighter(state.players[0]), freshFighter(state.players[1])], events: [], temp: 0 };
  ctx.events.push({ type: 'reveal', attacks: [state.players[0].attack ?? 'circle', state.players[1].attack ?? 'circle'], hp: hpOf(ctx) });

  resolveEffects(ctx);
  fight(ctx);

  for (const w of [0, 1] as PlayerId[]) state.players[w].hp = ctx.f[w].hp;

  // support cards go to the Offline Pile at the end of the battle (state 37)
  for (const w of [0, 1] as PlayerId[]) {
    const p = state.players[w];
    if (p.support && p.support.kind !== 'none') {
      pushTop(p.offline, p.support.card);
      ctx.events.push({ type: 'cardsDiscarded', player: w, cards: [p.support.card], from: 'support' });
    }
    p.support = null;
    p.attack = null;
  }

  for (const w of [state.turn, other(state.turn)]) {
    if (state.winner !== null) break;
    if (state.players[w].hp === 0 && count(state.players[w].stack) > 0) handleKo(ctx, w);
  }
  if (state.winner === null) state.phase = { name: 'turnStart' };
  return { state, events: ctx.events };
}
