/**
 * The game's event bus for audiovisual feedback: `gameEvents.emit('CARD_DRAWN', { player: 0 })`.
 * Cues describe what the player should notice; sound (audio/director.ts) and visual effects subscribe
 * to them. Nothing here reaches back into the rules.
 */
import type { CrossEffect } from '../engine/cards/types';
import type { PlayerId } from '../engine/game/types';
import type { ActionKind } from '../ui/vocab/actions';

export const CUE_NAMES = [
  // interface
  'UI_HOVER',
  'UI_CONFIRM',
  'UI_CANCEL',
  'UI_NAV',
  'UI_TAB',
  'PANEL_OPEN',
  'PANEL_CLOSE',
  'UI_ERROR',
  'UI_DENIED',
  'PHASE_BANNER',
  // cards
  'CARD_HOVER',
  'CARD_DRAWN',
  'CARD_SELECTED',
  'CARD_MOVED',
  'CARD_PLACED',
  'CARD_SET',
  'CARD_DISCARDED',
  'DECK_SHUFFLED',
  'CARD_REVEALED',
  'SUPPORT_ACTIVATED',
  'DP_CHARGED',
  'OPTION_PLAYED',
  // combat
  'ATTACK_SELECTED',
  'ATTACK_LOCKED',
  'ATTACK_REVEALED',
  'CLASH_START',
  'ORDER_SWAPPED',
  'ATTACK_RESOLVED',
  'HIT_TAKEN',
  'ATTACK_BLOCKED',
  'COUNTER',
  'ABILITY_ACTIVATED',
  'EFFECT_VOIDED',
  'EFFECT_FIZZLED',
  'STAT_UP',
  'STAT_DOWN',
  'HP_RECOVERED',
  'MONSTER_DEFEATED',
  'MONSTER_DEVOLVED',
  'ROUND_WON',
  // evolution
  'EVOLUTION_START',
  'EVOLUTION_CHARGE',
  'EVOLUTION_BURST',
  'MONSTER_EVOLVED',
  'EVOLUTION_STATS',
  // result
  'BATTLE_WON',
  'BATTLE_LOST',
] as const;

export type CueName = (typeof CUE_NAMES)[number];

/** Everything a cue may carry. All optional: listeners use what they understand. */
export interface CueData {
  player?: PlayerId;
  /** Attack identity: Furia, Técnica, Instinto. */
  action?: ActionKind;
  /** Instinto special effect (or the ability that fired). */
  effect?: CrossEffect;
  damage?: number;
  /** The hit leaves the defender at 0 HP. */
  lethal?: boolean;
  /** At least half the defender's HP. */
  heavy?: boolean;
  /** Good news for a human seat (round won). */
  win?: boolean;
  /** DP total after a charge. */
  dp?: number;
  /** Stat index for the evolution count (HP, ◯, △, ✕). */
  index?: number;
  source?: 'support' | 'option' | 'cross';
}

export interface Cue {
  name: CueName;
  data?: CueData;
  /** Milliseconds after the moment the cue belongs to (to land on an animation beat). */
  delay?: number;
}

type Listener = (data: CueData, name: CueName) => void;

export function createBus() {
  const map = new Map<CueName | '*', Set<Listener>>();
  return {
    on(name: CueName | '*', fn: Listener): () => void {
      if (!map.has(name)) map.set(name, new Set());
      map.get(name)!.add(fn);
      return () => void map.get(name)?.delete(fn);
    },
    emit(name: CueName, data: CueData = {}): void {
      for (const fn of map.get(name) ?? []) fn(data, name);
      for (const fn of map.get('*') ?? []) fn(data, name);
    },
  };
}

export type Bus = ReturnType<typeof createBus>;

/** The single bus of the app. */
export const gameEvents = createBus();

type Schedule = (fn: () => void, ms: number) => () => void;

const timeout: Schedule = (fn, ms) => {
  const t = setTimeout(fn, ms);
  return () => clearTimeout(t);
};

/** Emit cues on their delays (0 = now). Returns a cancel for the ones still pending. */
export function emitCues(cues: Cue[], bus: Bus = gameEvents, schedule: Schedule = timeout): () => void {
  const pending: (() => void)[] = [];
  for (const c of cues) {
    if (!c.delay) bus.emit(c.name, c.data);
    else pending.push(schedule(() => bus.emit(c.name, c.data), c.delay));
  }
  return () => pending.forEach((cancel) => cancel());
}
