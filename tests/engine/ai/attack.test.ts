/**
 * CPU AI — battle evaluation (KAWSEG 0x801E0CCC) and attack choice (decision code 6, 0x801E4E58).
 */
import { describe, expect, it } from 'vitest';
import { aiAttack, chooseAttackIndex } from '../../../src/engine/ai/attack';
import { evaluate, type EvalRow } from '../../../src/engine/ai/evaluate';
import { newAiMemory, type AiCtx, type AiProfile } from '../../../src/engine/ai/view';
import { buildGame } from '../build';

/** rand() stub returning the given values in order (then repeating the last). */
const seq = (...values: number[]) => {
  let i = 0;
  return { next: () => values[Math.min(i++, values.length - 1)] };
};
const ctx = (ai1: number, ...rand: number[]): AiCtx => ({ profile: [0, ai1, 0, 0] as AiProfile, rand: seq(...rand), memory: newAiMemory() });
const rows = (...h: [status: number, cpuHpSum: number, oppHpSum: number][]): EvalRow[] =>
  h.map(([status, cpuHpSum, oppHpSum]) => ({ status, oppKo: 0, cpuKo: 0, cpuHpSum, oppHpSum, S: [] }));

const { state } = buildGame({ turn: 1, p0: { stack: ['Agumon'] }, p1: { stack: ['Gigadramon'] } });

describe('attack choice (0x801E4E58) from the evaluation headers', () => {
  it('a single guaranteed-KO attack is used without randomness', () => {
    expect(chooseAttackIndex(rows([1, 0, 0], [0, 0, 0], [-1, 0, 0]), state, 1, ctx(0, 99))).toBe(1);
  });

  it('several guaranteed KOs: weighted 2/3/5 between ◯ △ ✕', () => {
    const all = rows([0, 0, 0], [0, 0, 0], [0, 0, 0]);
    expect(chooseAttackIndex(all, state, 1, ctx(0, 1))).toBe(0);
    expect(chooseAttackIndex(all, state, 1, ctx(0, 4))).toBe(1);
    expect(chooseAttackIndex(all, state, 1, ctx(0, 5))).toBe(2);
    expect(chooseAttackIndex(rows([0, 0, 0], [1, 0, 0], [0, 0, 0]), state, 1, ctx(0, 2))).toBe(2);
  });

  it('no KO: a single attack without risk of being KO\'d is used', () => {
    expect(chooseAttackIndex(rows([-1, 0, 0], [1, 0, 0], [-1, 0, 0]), state, 1, ctx(0, 99))).toBe(1);
  });

  it('several safe attacks, coin = 1: on its turn maximise own HP, otherwise minimise the foe HP', () => {
    const r = rows([1, 900, 500], [1, 1200, 300], [1, 1000, 100]);
    expect(chooseAttackIndex(r, state, 1, ctx(0, 1))).toBe(1);
    const notTurn = { ...state, turn: 0 as const };
    expect(chooseAttackIndex(r, notTurn, 1, ctx(0, 1))).toBe(2);
  });

  it('coin = 0, a tie in the smart pick, or personality ai[1] = 2: weighted random among the safe attacks', () => {
    const r = rows([1, 900, 500], [-1, 1200, 300], [1, 1000, 100]);
    expect(chooseAttackIndex(r, state, 1, ctx(0, 0, 1))).toBe(0); // w = 2 + 5, r = 1 → ◯
    expect(chooseAttackIndex(rows([1, 900, 0], [1, 900, 0], [-1, 0, 0]), state, 1, ctx(0, 1, 4))).toBe(1); // tie → w = 5, r = 4 → △
    expect(chooseAttackIndex(r, state, 1, ctx(2, 6))).toBe(2); // no coin: w = 7, r = 6 → ✕
  });

  it('every attack risks a KO: smart pick, or rand() % 3', () => {
    const r = rows([-1, 100, 0], [-1, 300, 0], [-1, 200, 0]);
    expect(chooseAttackIndex(r, state, 1, ctx(0, 1))).toBe(1);
    expect(chooseAttackIndex(r, state, 1, ctx(0, 0, 5))).toBe(2);
  });
});

describe('evaluation by simulation (0x801E0CCC)', () => {
  it('tries every own attack × opponent attack and marks guaranteed KOs', () => {
    // Gigadramon (◯900 △710 ✕550) attacks first against Agumon (570 HP, ✕ sets the foe ◯ to 0)
    const { rows: r } = evaluate(state, 1);
    expect(r.map((x) => x.status)).toEqual([1, 0, 1]);
    expect(r[1].oppKo).toBe(3);
  });

  it('returns -1 (the "both alive" status of a support is never set: dead code in the original)', () => {
    expect(evaluate(state, 1).ret).toBe(-1);
  });

  it('the CPU picks the only attack that always KOs', () => {
    expect(aiAttack(state, 1, ctx(0, 0))).toBe('triangle');
  });

  it('reads the opponent hand: its supports are part of the evaluation', () => {
    // Garurumon support "Opponent uses ◯" would turn △ into ◯, which Agumon ✕ cancels
    const withHand = buildGame({ turn: 1, p0: { stack: ['Agumon'], hand: ['Garurumon'] }, p1: { stack: ['Gigadramon'] } }).state;
    expect(evaluate(withHand, 1).rows[1].status).toBe(1);
  });
});
