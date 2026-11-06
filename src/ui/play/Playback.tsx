/**
 * Battle replay on the board itself: the engine has already resolved the battle; this walks through its
 * events (reveal, supports, attack order, hits, KO) over the board as it was before it. Pure presentation.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { battleStepCues, IMPACT_MS } from '../../audio/cues';
import { useCues } from '../../audio/react';
import type { AttackSlot, DigimonCard } from '../../engine/cards/types';
import type { CardRef, GameEvent, GameState, PlayerId } from '../../engine/game/types';
import { sessionStore, useSession } from '../../game/useSession';
import { activeView, type ActiveView, type FighterFx } from './Arena';
import { cardAt } from './util';

const SHOWN = new Set<GameEvent['type']>(['reveal', 'effect', 'attackOrder', 'crash', 'hit', 'ko', 'roundWon', 'gameOver']);

type Hit = Extract<GameEvent, { type: 'hit' }>;
type Effect = Extract<GameEvent, { type: 'effect' }>;

export interface Playback {
  /** The board to draw while the battle plays (before the battle). */
  board: GameState;
  steps: GameEvent[];
  index: number;
  step: GameEvent | undefined;
  finished: boolean;
  views: [ActiveView, ActiveView];
  fx: [FighterFx, FighterFx];
  /** Attacks once revealed (supports can change them). */
  attacks: [AttackSlot, AttackSlot] | null;
  /** Who attacks first, once the order is known. */
  first: PlayerId | null;
  rounds: [number, number];
  effect: Effect | null;
  next: () => void;
  skip: () => void;
}

type Powers = [[number, number, number], [number, number, number]];

/** HP and powers on the board once `shown` has played. */
function valuesAfter(board: GameState, shown: GameEvent[]): { hp: [number, number]; powers: Powers } {
  const hp: [number, number] = [board.players[0].hp, board.players[1].hp];
  let powers: Powers = [[...board.players[0].powers], [...board.players[1].powers]];
  for (const e of shown) {
    if ('hp' in e && Array.isArray(e.hp)) [hp[0], hp[1]] = e.hp;
    if ((e.type === 'reveal' || e.type === 'effect') && e.powers) powers = [[...e.powers[0]], [...e.powers[1]]];
  }
  return { hp, powers };
}

/** When the numbers of a step change on screen (s): on the hit for hits, with the outcome for effects. */
const CHANGE_AT: Partial<Record<GameEvent['type'], number>> = { hit: IMPACT_MS / 1000, effect: 0.7 };

/** Duration of each step, as the previous cinematic paced them. */
const DELAY: Partial<Record<GameEvent['type'], number>> = { reveal: 1300, effect: 1900, hit: 1500, ko: 1300, roundWon: 1300 };

export function usePlayback(game: GameState): Playback | null {
  const scene = useSession((s) => s.scenes[0]);
  const seq = useSession((s) => s.sceneSeq);
  const twoPlayer = useSession((s) => s.twoPlayer);
  const battle = scene?.kind === 'battle' ? scene : null;
  const board = battle?.state ?? game;
  const steps = useMemo(() => (battle ? battle.events.filter((e) => SHOWN.has(e.type)) : []), [battle]);
  const [pos, setPos] = useState({ seq: -1, i: 0 });
  const i = pos.seq === seq ? pos.i : 0;
  const finished = i >= steps.length - 1;

  const skip = useCallback(() => sessionStore.getState().popScene(), []);
  const next = useCallback(() => (finished ? skip() : setPos({ seq, i: i + 1 })), [finished, skip, seq, i]);

  useEffect(() => {
    if (!battle) return;
    const t = setTimeout(next, finished ? 2400 : (DELAY[steps[i]?.type] ?? 1100));
    return () => clearTimeout(t);
  }, [battle, next, finished, steps, i]);

  useEffect(() => {
    if (!battle) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skip();
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [battle, next, skip]);

  const playback = useMemo(() => {
    if (!battle) return null;
    const shown = steps.slice(0, i + 1);
    const step = steps[i];
    const views: [ActiveView, ActiveView] = [activeView(board, 0), activeView(board, 1)];
    // the fighters of this battle (from the hits; the board before it already has them)
    const refs: (CardRef | null)[] = [null, null];
    for (const e of battle.events)
      if (e.type === 'hit') {
        refs[e.attacker] = e.attackerCard;
        refs[e.defender] = e.defenderCard;
      }
    for (const p of [0, 1] as PlayerId[]) {
      const r = refs[p];
      if (r !== null && r >= 0) views[p] = { ...views[p], card: cardAt(board, p, r) as DigimonCard };
    }
    let attacks: [AttackSlot, AttackSlot] | null = null;
    let first: PlayerId | null = null;
    const rounds: [number, number] = [board.players[0].rounds, board.players[1].rounds];
    const ko: PlayerId[] = [];
    for (const e of shown) {
      if ('hp' in e && Array.isArray(e.hp)) {
        views[0] = { ...views[0], hp: e.hp[0] };
        views[1] = { ...views[1], hp: e.hp[1] };
      }
      if (e.type === 'reveal' || e.type === 'effect') {
        attacks = e.attacks;
        if (e.powers) {
          views[0] = { ...views[0], powers: e.powers[0] };
          views[1] = { ...views[1], powers: e.powers[1] };
        }
      }
      if (e.type === 'attackOrder') first = e.first;
      if (e.type === 'roundWon') rounds[e.player] = e.rounds;
      if (e.type === 'ko' && !e.revived) ko.push(e.player);
    }
    for (const p of [0, 1] as PlayerId[]) {
      const max = Math.max(views[p].max, ...battle.events.flatMap((e) => ('hp' in e && Array.isArray(e.hp) ? [e.hp[p]] : [])));
      views[p] = { ...views[p], max };
    }
    const hit = step?.type === 'hit' ? (step as Hit) : null;
    const delay = (step && CHANGE_AT[step.type]) ?? 0;
    const fx = ([0, 1] as PlayerId[]).map((p) => ({
      lunge: hit?.attacker === p,
      hurt: hit?.defender === p && hit.damage > 0,
      dmg: hit?.defender === p ? hit.damage : null,
      heal: hit?.attacker === p ? hit.eaten : null,
      ko: ko.includes(p),
      delay,
    })) as [FighterFx, FighterFx];
    return { board, steps, index: i, step, finished, views, fx, attacks, first, rounds, effect: step?.type === 'effect' ? (step as Effect) : null, next, skip };
  }, [battle, board, steps, i, finished, next, skip]);

  // the sound of each step, timed to its animation
  useCues(playback?.step ? `${seq}:${i}` : null, () => {
    const pb = playback!;
    return battleStepCues(pb.step!, {
      fighters: [pb.views[0].card, pb.views[1].card],
      attacks: pb.attacks,
      prev: valuesAfter(board, steps.slice(0, i)),
      max: [pb.views[0].max, pb.views[1].max],
      turn: board.turn,
      humans: twoPlayer ? [0, 1] : [0],
    });
  });

  return playback;
}
