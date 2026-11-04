/**
 * CPU AI — decision 1 (state 4): keep the hand or change all cards. KAWSEG 0x801E19EC.
 */
import { describe, expect, it } from 'vitest';
import { aiMulligan } from '../../../src/engine/ai/mulligan';
import { newAiMemory, type AiCtx, type AiProfile } from '../../../src/engine/ai/view';
import { buildGame, type PlayerSpec } from '../build';

const ctx = (ai2: number, rand = 0): AiCtx => ({ profile: [0, 0, ai2, 0] as AiProfile, rand: { next: () => rand }, memory: newAiMemory() });
const deck = (n: number, name = 'Biyomon') => Array(n).fill(name);

function change(p1: PlayerSpec, ai: AiCtx, p0: PlayerSpec = { stack: ['Gabumon'] }) {
  const { state } = buildGame({ turn: 1, phase: { name: 'mulligan' }, p0, p1 });
  return aiMulligan(state, 1, ai);
}

describe('no Digimon in play', () => {
  it('keeps a hand with a Rookie', () => {
    expect(change({ hand: ['Greymon', 'Agumon'], online: deck(20) }, ctx(0))).toBe(false);
  });

  it('without a Rookie, personality 0 changes while ≥ 3 cards per missing round remain', () => {
    expect(change({ hand: ['Greymon', 'Tyrannomon'], online: deck(9) }, ctx(0))).toBe(true);
    expect(change({ hand: ['Greymon', 'Tyrannomon'], online: deck(8) }, ctx(0))).toBe(false);
    expect(change({ hand: ['Greymon', 'Tyrannomon'], online: deck(8), rounds: 1 }, ctx(0))).toBe(true);
  });

  it('personality 1 needs 4 per round; 2 changes one time in three; 3 never', () => {
    expect(change({ hand: ['Greymon', 'Tyrannomon'], online: deck(11) }, ctx(1))).toBe(false);
    expect(change({ hand: ['Greymon', 'Tyrannomon'], online: deck(12) }, ctx(1))).toBe(true);
    expect(change({ hand: ['Greymon', 'Tyrannomon'], online: deck(20) }, ctx(2, 3))).toBe(true);
    expect(change({ hand: ['Greymon', 'Tyrannomon'], online: deck(20) }, ctx(2, 4))).toBe(false);
    expect(change({ hand: ['Greymon', 'Tyrannomon'], online: deck(20) }, ctx(3))).toBe(false);
  });

  it('keeps it when the deck has no Rookie left', () => {
    expect(change({ hand: ['Greymon', 'Tyrannomon'], online: deck(20, 'Garurumon') }, ctx(0))).toBe(false);
  });

  it('keeps it when a Digivolve Option fits (index 0 = Download: ≥ 20 DP and a Champion in hand)', () => {
    expect(change({ hand: ['Greymon', 'Tyrannomon', 'Download Digivolve'], dp: ['Agumon'], online: deck(20) }, ctx(0))).toBe(false);
    expect(change({ hand: ['Greymon', 'Tyrannomon', 'Download Digivolve'], online: deck(20) }, ctx(0))).toBe(true);
  });
});

describe('with a Digimon in play', () => {
  it('only considers changing when the foe is one round from winning', () => {
    expect(change({ stack: ['Agumon'], hand: ['WarGreymon'], online: deck(20) }, ctx(3))).toBe(false);
    expect(change({ stack: ['Agumon'], hand: ['WarGreymon'], online: deck(20) }, ctx(3), { stack: ['Gabumon'], rounds: 2 })).toBe(true);
  });

  it('keeps a recovery card unless the foe holds a voider and its Digimon has Jamming', () => {
    const p1 = { stack: ['Agumon'], hand: ['WarGreymon', 'Recovery Floppy'], online: deck(20) };
    expect(change(p1, ctx(3), { stack: ['Gabumon'], rounds: 2 })).toBe(false);
    expect(change(p1, ctx(3), { stack: ['Gabumon'], hand: ['ClearAgumon'], rounds: 2 })).toBe(false);
    expect(change(p1, ctx(3), { stack: ['Kunemon'], rounds: 2 })).toBe(false); // Jamming but no voider
    expect(change(p1, ctx(3), { stack: ['Kunemon'], hand: ['ClearAgumon'], rounds: 2 })).toBe(true);
  });

  it('keeps the hand when the next digivolution is reachable (0x801E157C returns 1)', () => {
    const foe = { stack: ['Gabumon'], rounds: 2 };
    expect(change({ stack: ['Agumon'], dp: ['Biyomon', 'Gabumon'], hand: ['Greymon'], online: deck(20) }, ctx(3), foe)).toBe(false);
    expect(change({ stack: ['Agumon'], hand: ['Greymon'], online: deck(20) }, ctx(3), foe)).toBe(true);
  });

  it('options are told apart by catalogue index (id − 293), not by type: ArmorCrush keeps the hand where Warp does not', () => {
    const foe = { stack: ['Gabumon'], rounds: 2 };
    expect(change({ stack: ['Agumon'], hand: ['WarGreymon', 'ArmorCrush Digivolve'], online: deck(20) }, ctx(3), foe)).toBe(false);
    expect(change({ stack: ['Agumon'], hand: ['WarGreymon', 'Warp Digivolve'], online: deck(20) }, ctx(3), foe)).toBe(true);
  });
});
