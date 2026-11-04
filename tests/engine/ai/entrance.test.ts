/**
 * CPU AI — which Digimon enters the Battle Slot (decision code 2, KAWSEG 0x801E2100; fallback in
 * SLUS state 8 at 0x80034D88). Expected values follow the decompiled routine.
 */
import { describe, expect, it } from 'vitest';
import { aiEntrance } from '../../../src/engine/ai/entrance';
import { newAiMemory, type AiCtx, type AiProfile } from '../../../src/engine/ai/view';
import { buildGame } from '../build';

const ctx = (ai0: number, rand = 1): AiCtx => ({ profile: [ai0, 0, 0, 0] as AiProfile, rand: { next: () => rand }, memory: newAiMemory() });

function pick(hand: string[], ai: AiCtx, online: string[] = []) {
  const { state, refs } = buildGame({ phase: { name: 'entrance' }, p0: { hand, online } });
  const ref = aiEntrance(state, 0, ai);
  const name = Object.entries(refs[0]).find(([, r]) => r.includes(ref))![0];
  return name;
}

describe('AI entrance (0x801E2100)', () => {
  it('an armor partner in hand always enters first (first one by hand slot)', () => {
    expect(pick(['Agumon', 'Patamon', 'Veemon'], ctx(0))).toBe('Patamon');
    expect(pick(['Greymon', 'Gabumon', 'Wormmon'], ctx(2))).toBe('Wormmon');
  });

  it('levels are tried R → A → C → U; a single candidate enters directly', () => {
    expect(pick(['Greymon', 'Gabumon', 'WarGreymon'], ctx(0))).toBe('Gabumon');
    expect(pick(['Greymon', 'Flamedramon'], ctx(0))).toBe('Flamedramon');
    expect(pick(['WarGreymon', 'Greymon'], ctx(0))).toBe('Greymon');
  });

  it('two or more Armor cards are skipped in favour of C/U', () => {
    expect(pick(['Flamedramon', 'Submarimon', 'Greymon'], ctx(0))).toBe('Greymon');
  });

  it('two or more Armor cards and no C/U → state 8 fallback: first Digimon by hand slot', () => {
    expect(pick(['Submarimon', 'Flamedramon'], ctx(0, 1))).toBe('Submarimon');
  });

  describe('Rookie filters (personality ai[0] = 0 or 1)', () => {
    it('1) most Armor cards of its specialty in hand', () => {
      expect(pick(['Gabumon', 'Agumon', 'Flamedramon'], ctx(0))).toBe('Agumon');
    });
    it('2) most Digimon of its specialty in the Online Deck', () => {
      expect(pick(['Gabumon', 'Agumon'], ctx(1), ['Greymon', 'Birdramon', 'Garurumon'])).toBe('Agumon');
    });
    it('3) prefers a card without support effect', () => {
      expect(pick(['Agumon', 'Solarmon'], ctx(0))).toBe('Solarmon');
    });
    it('4) ties broken with rand() % n over the hand-slot order', () => {
      expect(pick(['Agumon', 'Biyomon'], ctx(0, 1))).toBe('Biyomon');
      expect(pick(['Agumon', 'Biyomon'], ctx(0, 2))).toBe('Agumon');
    });
  });

  it('personality ai[0] = 2 picks at random among the lowest level, without filters', () => {
    expect(pick(['Gabumon', 'Agumon'], ctx(2, 1))).toBe('Agumon');
    expect(pick(['Gabumon', 'Agumon'], ctx(0, 1))).toBe('Gabumon');
  });

  describe('Champion / Ultimate filters (ai[0] = 0 or 1)', () => {
    it('1) fewest Digimon of its specialty in the Online Deck', () => {
      expect(pick(['Greymon', 'Garurumon'], ctx(0), ['Agumon', 'Biyomon', 'Gabumon'])).toBe('Garurumon');
    });
    it('2) prefers a card without support effect', () => {
      expect(pick(['Greymon', 'Tyrannomon'], ctx(0))).toBe('Tyrannomon');
    });
    it('3) highest DP required', () => {
      expect(pick(['Meramon', 'Greymon'], ctx(0))).toBe('Greymon');
    });
  });

  it('🟡 the support-effect counter is never reset: Armor candidates leak it into the C/U filter', () => {
    // A level: Flamedramon (2 effects) and Submarimon (2) are skipped but stay in the candidate records.
    // C level: Greymon 2+1 = 3, Tyrannomon 2+0 = 2 → nobody has 0 → highest DP required wins.
    expect(pick(['Flamedramon', 'Submarimon', 'Greymon', 'Tyrannomon'], ctx(0))).toBe('Greymon');
  });
});
