/**
 * CPU AI — decision 4 (Digivolve Option, 0x801DFFD4 + 0x801E4E08) and decision 5 (digivolve,
 * 0x801E3C00). Both read the plan left by decision 3 in the same turn.
 */
import { describe, expect, it } from 'vitest';
import { aiDp } from '../../../src/engine/ai/dp';
import { aiDigivolve, aiDigivolveOption } from '../../../src/engine/ai/option';
import { newAiMemory, type AiCtx, type AiProfile } from '../../../src/engine/ai/view';
import { buildGame, type PlayerSpec } from '../build';

const ctx = (): AiCtx => ({ profile: [0, 0, 0, 0] as AiProfile, rand: { next: () => 0 }, memory: newAiMemory() });

function planned(p1: PlayerSpec) {
  const ai = ctx();
  const { state, refs } = buildGame({ turn: 1, phase: { name: 'dp' }, p0: { stack: ['Gabumon'] }, p1 });
  aiDp(state, 1, ai);
  return { state, ai, ref: (n: string, k = 0) => refs[1][n][k] };
}

describe('decision 4: Digivolve Option', () => {
  it('plays the option the plan chose', () => {
    const r = planned({ stack: ['Agumon'], hand: ['Greymon', 'Speed Digivolve', 'Gabumon'] });
    expect(aiDigivolveOption(r.state, 1, r.ai)).toBe(r.ref('Speed Digivolve'));
  });

  it('without a plan, a duplicated option is played (phase 3 of the plan)', () => {
    const r = planned({ stack: ['Flamedramon'], hand: ['Speed Digivolve', 'Speed Digivolve', 'Gabumon'] });
    expect(aiDigivolveOption(r.state, 1, r.ai)).toBe(r.ref('Speed Digivolve', 1));
  });

  it('nothing when there is no Digivolve Option in hand', () => {
    const r = planned({ stack: ['Agumon'], hand: ['Greymon', 'Gabumon'] });
    expect(aiDigivolveOption(r.state, 1, r.ai)).toBe(-1);
  });
});

describe('decision 5: digivolve', () => {
  it('without an option it only checks the DP of the planned target', () => {
    const ok = planned({ stack: ['Agumon'], dp: ['Biyomon', 'Gabumon'], hand: ['Greymon'] });
    expect(aiDigivolve(ok.state, 1, ok.ai)).toBe(ok.ref('Greymon'));
    const short = planned({ stack: ['Agumon'], dp: ['Biyomon'], hand: ['Greymon', 'Nanimon'] });
    expect(aiDigivolve(short.state, 1, short.ai)).toBe(-1);
  });

  it('with Speed Digivolve in the option slot it ignores DP', () => {
    const r = planned({ stack: ['Agumon'], hand: ['Greymon', 'Speed Digivolve', 'Gabumon'] });
    r.state.players[1].digivolveOption = r.ref('Speed Digivolve');
    r.state.players[1].hand = r.state.players[1].hand.map((x) => (x === r.ref('Speed Digivolve') ? null : x));
    expect(aiDigivolve(r.state, 1, r.ai)).toBe(r.ref('Greymon'));
  });

  it('no plan, no digivolution', () => {
    const r = planned({ stack: ['Agumon'], hand: ['Gabumon'] });
    expect(aiDigivolve(r.state, 1, r.ai)).toBe(-1);
  });
});
