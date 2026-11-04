/**
 * Exact ports of small routines from the original game. Pure, deterministic, React-free.
 * Each function names the routine it reproduces (address in SLUS_013.28 or the KAWSEG overlay).
 */
import type { ArithOp, Comparator, Level } from '../cards/types';

export const VALUE_CAP = 9990;

/** arith() — KAWSEG 0x801E9ABC. */
export function arith(a: number, op: ArithOp, b: number): number {
  switch (op) {
    case 'add':
      return Math.min(a + b, VALUE_CAP);
    case 'sub':
      return Math.max(a - b, 0);
    case 'mul':
      return Math.min(a * b, VALUE_CAP);
    case 'div': {
      if (a === 0 || b === 0) return 0;
      const q = Math.max(Math.trunc(a / b), 10);
      return Math.trunc(q / 10) * 10;
    }
    case 'zero':
      return 0;
  }
}

/** compare() — KAWSEG 0x801E9BAC. Codes outside 0..5 are 'never' (always false). */
export function compare(a: number, cmp: Comparator, b: number): boolean {
  switch (cmp) {
    case '<':
      return a < b;
    case '<=':
      return a <= b;
    case '>':
      return a > b;
    case '>=':
      return a >= b;
    case '!=':
      return a !== b;
    case '==':
      return a === b;
    case 'never':
      return false;
  }
}

const LEVEL_CODE: Record<Level, number> = { R: 0, A: 1, C: 2, U: 3 };

/**
 * Stats loaded when a card is put in the Battle Slot — SLUS 0x8004080C.
 * `enteredAs` is the level the Digimon entered with directly from the hand (the "abnormal state",
 * flags bits 15-16). Entering as C halves HP and powers, as U quarters them; values are then
 * truncated to a multiple of 10. Digivolving clears the abnormal state (full stats again).
 */
export function battleStat(base: number, enteredAs: Level | null): number {
  const shift = enteredAs ? Math.max(LEVEL_CODE[enteredAs] - 1, 0) : 0;
  return Math.trunc((base >> shift) / 10) * 10;
}

export const HAND_SIZE = 4;
export const DP_SLOT_SIZE = 8;
export const DP_CAP = 90;
export const ROUNDS_TO_WIN = 3;

/** DP total = sum of +P of the cards in the DP Slot, capped at 90 — SLUS 0x8004110C. */
export function dpTotal(dpGivenOfSlotCards: number[]): number {
  return Math.min(
    dpGivenOfSlotCards.reduce((s, x) => s + x, 0),
    DP_CAP,
  );
}
