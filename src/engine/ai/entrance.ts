/**
 * CPU AI — decision code 2 (SLUS state 8): which Digimon enters the empty Battle Slot.
 * Port of KAWSEG 0x801E2100 plus the state-8 fallback (SLUS 0x80034D88).
 */
import { cardOf } from '../game/effects';
import type { CardRef, GameState, PlayerId, PlayerState } from '../game/types';
import {
  ARMOR_PARTNERS,
  handCountLevel,
  handCountSpecialty,
  handCountSpecLevel,
  LEVEL_CODE,
  onlineCountSpecialty,
  SPECIALTY_CODE,
  supportActionCount,
  type AiCtx,
} from './view';

/** One 8-byte candidate record on the routine's stack (sp+0x10 + i*8). */
interface Cand {
  ref: number;
  /** +2 Digimon of its specialty in hand (includes itself). */
  b2: number;
  /** +3 Armor (level A) Digimon of its specialty in hand. */
  b3: number;
  /** +4 DP required. */
  b4: number;
  /** +5 Digimon of its specialty in the Online Deck. */
  b5: number;
  /** +6 enabled support actions. Never reset by the original (see below). */
  b6: number;
}
type Key = 'b2' | 'b3' | 'b4' | 'b5' | 'b6';

/** 0x801E201C: stable filter, valid records first, `ref = -1` in the rest. Returns the count. */
function compact(cand: Cand[]): number {
  const cnt = cand.filter((c) => c.ref !== -1).length;
  for (let i = 0; i < cnt; ) {
    if (cand[i].ref !== -1) {
      i++;
      continue;
    }
    for (let j = i; j < cand.length - 1; j++) cand[j] = { ...cand[j + 1] };
    cand[cand.length - 1] = { ...cand[cand.length - 1], ref: -1 };
  }
  return cnt;
}

function keepMax(cand: Cand[], n: number, key: Key): number {
  let m = 0;
  for (let i = 0; i < n; i++) if (cand[i][key] > m) m = cand[i][key];
  for (let i = 0; i < n; i++) if (cand[i][key] < m) cand[i].ref = -1;
  return compact(cand);
}

function keepMin(cand: Cand[], n: number, key: Key): number {
  let m = 30;
  for (let i = 0; i < n; i++) if (cand[i][key] < m) m = cand[i][key];
  for (let i = 0; i < n; i++) if (cand[i][key] > m) cand[i].ref = -1;
  return compact(cand);
}

function keepZeroIfAny(cand: Cand[], n: number, key: Key): number {
  let z = 0;
  for (let i = 0; i < n; i++) if (cand[i][key] === 0) z++;
  if (z === 0) return n;
  for (let i = 0; i < n; i++) if (cand[i][key] !== 0) cand[i].ref = -1;
  return compact(cand);
}

const randomPick = (cand: Cand[], n: number, ai: AiCtx) => cand[ai.rand.next() % n].ref; // 0x801E29D4

/** Rookie branch 0x801E23E8. */
function rookie(cand: Cand[], n: number, ai: AiCtx): number {
  const k = ai.profile[0] & 3;
  if (k === 2) return randomPick(cand, n, ai);
  if (k >= 3) return -1;
  n = keepMax(cand, n, 'b3');
  if (n === 1) return cand[0].ref;
  n = keepMax(cand, n, 'b5');
  if (n === 1) return cand[0].ref;
  n = keepZeroIfAny(cand, n, 'b6');
  if (n === 1) return cand[0].ref;
  return randomPick(cand, n, ai);
}

/** Champion / Ultimate branch 0x801E2690. */
function championUltimate(cand: Cand[], n: number, ai: AiCtx): number {
  const k = ai.profile[0] & 3;
  if (k === 2) return randomPick(cand, n, ai);
  if (k >= 3) return -1;
  n = keepMin(cand, n, 'b5');
  if (n === 1) return cand[0].ref;
  n = keepZeroIfAny(cand, n, 'b2'); // no-op in practice: b2 counts the card itself (kept literally)
  if (n === 1) return cand[0].ref;
  n = keepZeroIfAny(cand, n, 'b6');
  if (n === 1) return cand[0].ref;
  n = keepMax(cand, n, 'b4');
  if (n === 1) return cand[0].ref;
  return randomPick(cand, n, ai);
}

/** KAWSEG 0x801E2100: a card ref, or -1 (the caller then applies the state-8 fallback). */
function chooseEntrance(p: PlayerState, ai: AiCtx): number {
  // 🟡 The original only ever writes `ref` when resetting the records, and increments b6 without
  // clearing it: its first value is stack garbage (modelled as 0) and Armor candidates that were
  // skipped leak their count into the C/U candidates at the same index.
  const cand: Cand[] = Array.from({ length: 4 }, () => ({ ref: -1, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 }));
  for (let level = 0; level < 4; level++) {
    if (handCountLevel(p, level) === 0) continue;
    for (const c of cand) c.ref = -1;
    let n = 0;
    for (let slot = 0; slot < 4; slot++) {
      const ref = p.hand[slot];
      if (ref === null) continue;
      const c = cardOf(p, ref);
      if (c.kind !== 'digimon') continue;
      if (ARMOR_PARTNERS.includes(c.id)) return ref; // armor partner: enters at once
      if (LEVEL_CODE[c.level] !== level) continue;
      const spec = SPECIALTY_CODE[c.specialty];
      const r = cand[n];
      r.ref = ref;
      r.b2 = handCountSpecialty(p, spec);
      r.b3 = handCountSpecLevel(p, spec, LEVEL_CODE.A);
      r.b4 = c.dpRequired;
      r.b5 = onlineCountSpecialty(p, spec);
      r.b6 += supportActionCount(c);
      n++;
    }
    if (n === 0) return -1;
    if (n === 1) return cand[0].ref;
    if (level === LEVEL_CODE.A) continue; // ≥ 2 Armor cards: no choice at this level
    return level === LEVEL_CODE.R ? rookie(cand, n, ai) : championUltimate(cand, n, ai);
  }
  return -1;
}

export function aiEntrance(state: GameState, player: PlayerId, ai: AiCtx): CardRef {
  const p = state.players[player];
  const ref = chooseEntrance(p, ai);
  if (ref !== -1) return ref;
  // SLUS 0x80034D88: the first Digimon in hand by slot
  const first = p.hand.find((r) => r !== null && cardOf(p, r).kind === 'digimon');
  if (first === undefined || first === null) throw new Error('Entrance without a Digimon in hand');
  return first;
}
