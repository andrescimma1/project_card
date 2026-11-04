/**
 * CPU AI — decision code 3 (state 11): the digivolution plan and the card for the DP Slot.
 * KAWSEG 0x801E157C (hand check) → 0x801E3FF4 (plan with Digivolve Options) → 0x801E3AF8 (target)
 * → 0x801E363C (card to place). The CPU is player 1, as in the game.
 */
import { describe, expect, it } from 'vitest';
import { aiDp } from '../../../src/engine/ai/dp';
import { newAiMemory, type AiCtx, type AiProfile } from '../../../src/engine/ai/view';
import { buildGame, type PlayerSpec } from '../build';

const ctx = (ai0: number, rand = 0): AiCtx => ({ profile: [ai0, 0, 0, 0] as AiProfile, rand: { next: () => rand }, memory: newAiMemory() });

function run(p1: PlayerSpec, ai: AiCtx) {
  const { state, refs } = buildGame({ turn: 1, phase: { name: 'dp' }, p0: { stack: ['Gabumon'] }, p1 });
  const ref = aiDp(state, 1, ai);
  const nameOf = (r: number) => (r === -1 ? null : Object.entries(refs[1]).find(([, rs]) => rs.includes(r))![0]);
  return { placed: nameOf(ref), refs: refs[1], ai, nameOf };
}

describe('AI DP Slot (0x801E363C)', () => {
  it('spends nothing when the next digivolution is already payable', () => {
    expect(run({ stack: ['Agumon'], dp: ['Biyomon', 'Gabumon'], hand: ['Greymon', 'Solarmon', 'Gomamon'] }, ctx(0)).placed).toBeNull();
  });

  it('aims at the DP the plan still needs: the smallest +P that covers it', () => {
    expect(run({ stack: ['Agumon'], dp: ['Biyomon'], hand: ['Greymon', 'Palmon', 'Gabumon', 'Tentomon'] }, ctx(0)).placed).toBe('Gabumon');
  });

  it('never places the planned target nor a card worth +0', () => {
    expect(run({ stack: ['Agumon'], hand: ['Greymon', 'Nanimon'] }, ctx(0)).placed).toBeNull();
  });

  it('a single candidate is always placed, whatever the personality', () => {
    expect(run({ stack: ['Agumon'], hand: ['Gabumon'] }, ctx(3)).placed).toBe('Gabumon');
  });

  it('personality 3 never places when there is a choice; personality 2 picks rand() % n', () => {
    expect(run({ stack: ['Agumon'], hand: ['Gabumon', 'Gomamon'] }, ctx(3)).placed).toBeNull();
    expect(run({ stack: ['Agumon'], hand: ['Gabumon', 'Gomamon', 'Betamon'] }, ctx(2, 2)).placed).toBe('Betamon');
  });

  it('the target is 50 DP, or 60 with an Armor Digimon in play', () => {
    expect(run({ stack: ['Agumon'], dp: ['Biyomon', 'Gabumon'], hand: ['Garurumon', 'Gomamon'] }, ctx(0)).placed).toBe('Garurumon');
    expect(run({ stack: ['Flamedramon'], dp: ['Biyomon', 'Gabumon'], hand: ['Garurumon', 'Gomamon'] }, ctx(0)).placed).toBe('Gomamon');
  });

  it('tie-break order depends on personality ai[0] (0: largest +P first, 1: unique specialty first)', () => {
    const hand = ['Palmon', 'Tentomon', 'Gabumon'];
    expect(run({ stack: ['Agumon'], hand }, ctx(0, 1)).placed).toBe('Tentomon'); // +30 tie → same level → rand
    expect(run({ stack: ['Agumon'], hand }, ctx(1, 1)).placed).toBe('Gabumon'); // only ice card
  });
});

describe('AI digivolution plan (0x801E157C, 0x801E3FF4, 0x801E3AF8)', () => {
  it('Speed Digivolve: the target needs no DP; the plan remembers target and option', () => {
    const r = run({ stack: ['Agumon'], hand: ['Greymon', 'Speed Digivolve', 'Gabumon'] }, ctx(0));
    expect(r.placed).toBeNull();
    const plan = r.ai.memory.T[r.ai.memory.plan!];
    expect(r.nameOf(plan.card)).toBe('Greymon');
    expect(r.nameOf(plan.extra)).toBe('Speed Digivolve');
  });

  it('Special Digivolve lowers the need by 20 when a hand card covers the rest (any specialty)', () => {
    const r = run({ stack: ['Agumon'], hand: ['Garurumon', 'Special Digivolve', 'Gabumon'] }, ctx(0));
    expect(r.placed).toBe('Gabumon');
    const plan = r.ai.memory.T[r.ai.memory.plan!];
    expect([r.nameOf(plan.card), plan.need, r.nameOf(plan.extra)]).toEqual(['Garurumon', 10, 'Special Digivolve']);
  });

  it('Mutant Digivolve is only planned once the active Digimon is settled (flag bit 30)', () => {
    const spec = (settled: boolean): PlayerSpec => ({ stack: ['Greymon'], dp: ['Biyomon', 'Agumon'], hand: ['Mutant Digivolve', 'Monochromon'], settled });
    expect(run(spec(true), ctx(0)).placed).toBeNull();
    expect(run(spec(false), ctx(0)).placed).toBe('Monochromon');
  });

  it('without a plan, duplicated Digivolve Options point at each other (phase 3)', () => {
    const r = run({ stack: ['Flamedramon'], hand: ['Speed Digivolve', 'Speed Digivolve', 'Gabumon'] }, ctx(0));
    const [a, b] = r.refs['Speed Digivolve'];
    expect(r.ai.memory.plan).toBeNull();
    expect(r.ai.memory.T[0].extra).toBe(b);
    expect(r.ai.memory.T[1].extra).toBe(a);
  });
});
