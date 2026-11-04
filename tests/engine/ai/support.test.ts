/**
 * CPU AI — support choice (decision code 7, states 26/29): KAWSEG 0x801E5710, after the evaluation.
 * Unit tests feed hand-made evaluation tables; the last ones run the real simulation.
 */
import { describe, expect, it } from 'vitest';
import type { EvalRow } from '../../../src/engine/ai/evaluate';
import { aiSupport, chooseSupportAnswer } from '../../../src/engine/ai/support';
import { newAiMemory, type AiCtx, type AiProfile } from '../../../src/engine/ai/view';
import { buildGame, type PlayerSpec } from '../build';

const seq = (...values: number[]) => {
  let i = 0;
  return { next: () => values[Math.min(i++, values.length - 1)] };
};
const ctx = (ai3: number, ...rand: number[]): AiCtx => ({ profile: [0, 0, 0, ai3] as AiProfile, rand: seq(...(rand.length ? rand : [0])), memory: newAiMemory() });

/** Evaluation table for the CPU attack ◯ (row 0): f(i, j, t) = [cpu HP, foe HP]. */
function table(f: (i: number, j: number, t: number) => [number, number]): EvalRow[] {
  return [0, 1, 2].map((a) => ({
    status: 0,
    oppKo: 0,
    cpuKo: 0,
    cpuHpSum: 0,
    oppHpSum: 0,
    S: Array.from({ length: 5 }, (_, i) => ({
      status: -1,
      oppKo: 0,
      cpuKo: 0,
      E: Array.from({ length: 15 }, (_, k) => {
        const [cpuHp, oppHp] = a === 0 ? f(i, Math.floor(k / 3), k % 3) : [0, 0];
        return { cpuHp, oppHp };
      }),
    })),
  }));
}

function setup(p1: PlayerSpec, p0: PlayerSpec = {}) {
  const { state, refs } = buildGame({
    turn: 1,
    phase: { name: 'support', chooser: 1 },
    p0: { stack: ['Gabumon'], attack: 'circle', online: ['Agumon'], ...p0 },
    p1: { stack: ['Agumon'], attack: 'circle', online: Array(10).fill('Biyomon'), ...p1 },
  });
  return { state, ref: (name: string, k = 0) => refs[1][name][k] };
}
const answer = (s: ReturnType<typeof setup>, rows: EvalRow[], ai: AiCtx) => chooseSupportAnswer(rows, s.state, 1, ai);

describe('some support KOs the foe', () => {
  it('the only support that KOs the foe is played', () => {
    const s = setup({ hand: ['Gomamon', 'Betamon'] });
    expect(answer(s, table((i) => (i === 1 ? [500, 0] : [500, 100])), ctx(0))).toBe(s.ref('Betamon'));
  });

  it('a single KO scenario: that hand card, or nothing if it was "no support"', () => {
    const s = setup({ hand: ['Gomamon', 'Betamon'] });
    expect(answer(s, table((i, _j, t) => (i === 0 && t === 2 ? [500, 0] : [500, 100])), ctx(0))).toBe(s.ref('Gomamon'));
    expect(answer(s, table((i, _j, t) => (i === 4 && t === 2 ? [500, 0] : [500, 100])), ctx(0))).toBe(-1);
  });

  it('with several, a disruption card is preferred while the foe still has a deck', () => {
    const s = setup({ hand: ['Gomamon', 'Wizardmon'] });
    expect(answer(s, table((i) => (i < 2 ? [500, 0] : [500, 100])), ctx(0))).toBe(s.ref('Wizardmon'));
  });

  it('otherwise those leaving the most own HP; a tie goes round from rand() % 5; "no support" among them wins', () => {
    const s = setup({ hand: ['Gomamon', 'Betamon', 'Gizamon'] });
    const t = table((i) => (i === 0 || i === 2 ? [500, 0] : i === 1 ? [400, 0] : [500, 100]));
    expect(answer(s, t, ctx(0, 3))).toBe(s.ref('Gomamon')); // start 3 → 4 → 0
    expect(answer(s, t, ctx(0, 1))).toBe(s.ref('Gizamon')); // start 1 (filtered out) → 2
    expect(answer(s, table((i) => (i === 0 || i === 4 ? [500, 0] : [500, 100])), ctx(0))).toBe(-1);
  });
});

describe('no KO, but the CPU can survive (personality ai[3])', () => {
  const surv = (i: number): [number, number] => (i === 0 ? [300, 200] : i === 1 ? [300, 200] : [0, 400]);

  it('0: the support leaving the foe with least HP; a tie with enough deck → gamble with the top card', () => {
    const s = setup({ hand: ['Gomamon', 'Betamon'] });
    expect(answer(s, table((i) => (i === 0 ? [300, 100] : [300, 200])), ctx(0))).toBe(s.ref('Gomamon'));
    expect(answer(s, table(surv), ctx(0))).toBe(-2);
  });

  it('0: a tie with a short deck → a random surviving hand card (round from rand() % 4)', () => {
    const s = setup({ hand: ['Gomamon', 'Betamon'], online: ['Biyomon'] });
    expect(answer(s, table(surv), ctx(0, 1))).toBe(s.ref('Betamon'));
  });

  it('1: a support voider is played on a tie only if the foe deck top is a recovery or disruption card', () => {
    const s = setup({ hand: ['Gomamon', 'ClearAgumon'] }, { online: ['Recovery Floppy'] });
    expect(answer(s, table(surv), ctx(1))).toBe(s.ref('ClearAgumon'));
    const t = setup({ hand: ['Gomamon', 'ClearAgumon'] }, { online: ['Agumon'] });
    expect(answer(t, table(surv), ctx(1))).toBe('unwritten');
  });

  it('2: pure random — rand() % 6 − 2 is gamble, none or a hand position', () => {
    const s = setup({ hand: ['Gomamon', 'Betamon'] });
    expect(answer(s, table(surv), ctx(2, 0))).toBe(-2);
    expect(answer(s, table(surv), ctx(2, 1))).toBe(-1);
    expect(answer(s, table(surv), ctx(2, 3))).toBe(s.ref('Betamon'));
    expect(answer(s, table(surv), ctx(2, 5))).toBe(-1); // empty hand slot
  });
});

describe('every scenario KOs the CPU', () => {
  it('0: with enough deck it gambles with the top card; with a short deck it picks round from rand() % 5', () => {
    const s = setup({ hand: ['Gomamon', 'Betamon'] });
    expect(answer(s, table(() => [0, 300]), ctx(0))).toBe(-2);
    const short = setup({ hand: ['Gomamon', 'Betamon'], online: ['Biyomon'] });
    expect(answer(short, table(() => [0, 300]), ctx(0, 1))).toBe(short.ref('Betamon'));
  });
});

describe('information it reads', () => {
  it('once the foe has placed its support, only that column is used', () => {
    const s = setup({ hand: ['Gomamon', 'Betamon'] }, { hand: ['Gabumon'], support: 'Agumon' });
    // with the foe's real support (column 4) only Betamon KOs; with its hand card only Gomamon would
    const t = table((i, j) => ((j === 4 && i === 1) || (j === 0 && i === 0) ? [500, 0] : [500, 100]));
    expect(answer(s, t, ctx(0))).toBe(s.ref('Betamon'));
  });

  it('real simulation: Agumon (◯ +300) lets Greymon KO Tyrannomon', () => {
    const { state, refs } = buildGame({
      turn: 1,
      phase: { name: 'support', chooser: 1 },
      p0: { stack: ['Tyrannomon'], attack: 'circle', support: 'none' },
      p1: { stack: ['Greymon'], hand: ['Agumon', 'Gabumon'], attack: 'circle' },
    });
    expect(aiSupport(state, 1, ctx(0))).toEqual({ from: 'hand', card: refs[1].Agumon[0] });
  });
});
