/**
 * Test-only scenario builder: creates a GameState directly from card names, so each test states
 * exactly the board it needs. Zone layout mirrors the game (fixed slots, "top" = lowest index).
 */
import { cards } from '../../src/engine/cards/db';
import type { DigimonCard, Level, Specialty } from '../../src/engine/cards/types';
import type { GameState, Phase, PlayerId, PlayerState, SupportChoice } from '../../src/engine/game/types';
import type { AttackSlot } from '../../src/engine/cards/types';

export function cardId(name: string): number {
  const c = cards.find((x) => x.name === name);
  if (!c) throw new Error(`unknown card ${name}`);
  return c.id;
}

export function digimon(name: string): DigimonCard {
  const c = cards[cardId(name)];
  if (c.kind !== 'digimon') throw new Error(`${name} is not a Digimon`);
  return c;
}

export interface PlayerSpec {
  /** top first */
  stack?: string[];
  hand?: string[];
  /** newest first */
  dp?: string[];
  /** top first */
  online?: string[];
  /** top first */
  offline?: string[];
  hp?: number;
  powers?: [number, number, number];
  specialty?: Specialty;
  enteredAs?: Level | null;
  rounds?: number;
  attack?: AttackSlot | null;
  /** name of a HAND card (it is placed in the hand automatically), 'gamble' or 'none' */
  support?: string | 'gamble' | 'none';
  /** flag bit 30 (default false) */
  settled?: boolean;
}

/** Instance ids of a built player, by card name (first occurrence first). */
export type Refs = Record<string, number[]>;

function slots(size: number, items: number[], fromEnd: boolean): (number | null)[] {
  const out: (number | null)[] = Array(size).fill(null);
  const start = fromEnd ? size - items.length : 0;
  items.forEach((v, i) => (out[start + i] = v));
  return out;
}

function buildPlayer(id: PlayerId, spec: PlayerSpec): { player: PlayerState; refs: Refs } {
  const ids: number[] = [];
  const refs: Refs = {};
  const add = (name: string) => {
    const inst = ids.length;
    ids.push(cardId(name));
    (refs[name] ??= []).push(inst);
    return inst;
  };
  const supportName = spec.support && spec.support !== 'gamble' && spec.support !== 'none' ? spec.support : null;
  const stack = (spec.stack ?? []).map(add);
  const hand = (spec.hand ?? []).map(add);
  const dp = (spec.dp ?? []).map(add);
  const online = (spec.online ?? []).map(add);
  const offline = (spec.offline ?? []).map(add);

  const top = stack.length ? (cards[ids[stack[0]]] as DigimonCard) : null;
  // A chosen support card has already left its zone (hand or top of the Online Deck), as in the game.
  let support: SupportChoice | null = null;
  if (spec.support === 'none') support = { kind: 'none' };
  else if (spec.support === 'gamble') support = { kind: 'gamble', card: online.shift()! };
  else if (supportName) support = { kind: 'hand', card: add(supportName) };

  const player: PlayerState = {
    id,
    cards: ids,
    online: slots(30, online, true),
    offline: slots(30, offline, true),
    hand: slots(4, hand, false),
    dp: slots(8, dp, true),
    stack: slots(3, stack, true),
    hp: spec.hp ?? top?.hp ?? 0,
    powers: spec.powers ?? (top ? [top.attacks.circle.power, top.attacks.triangle.power, top.attacks.cross.power] : [0, 0, 0]),
    specialty: spec.specialty ?? top?.specialty ?? 'fire',
    enteredAs: spec.enteredAs ?? null,
    rounds: spec.rounds ?? 0,
    attack: spec.attack ?? null,
    support,
    digivolveOption: null,
    settled: spec.settled ?? false,
    partners: [],
    partnerOf: ids.map(() => null),
  };
  return { player, refs };
}

export function buildGame(opts: { turn?: PlayerId; p0?: PlayerSpec; p1?: PlayerSpec; phase?: Phase; seed?: number }) {
  const a = buildPlayer(0, opts.p0 ?? {});
  const b = buildPlayer(1, opts.p1 ?? {});
  const state: GameState = {
    players: [a.player, b.player],
    turn: opts.turn ?? 0,
    turnNumber: 1,
    phase: opts.phase ?? { name: 'attack' },
    rng: opts.seed ?? 12345,
    winner: null,
    endReason: null,
  };
  return { state, refs: [a.refs, b.refs] as [Refs, Refs] };
}

/** Card names (ROM) of the non-empty slots of a zone, in slot order (top first). */
export function names(state: GameState, player: PlayerId, zone: 'online' | 'offline' | 'hand' | 'dp' | 'stack'): string[] {
  const p = state.players[player];
  return p[zone].filter((x): x is number => x !== null).map((inst) => cards[p.cards[inst]].name);
}
