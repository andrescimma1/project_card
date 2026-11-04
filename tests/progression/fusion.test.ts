/**
 * Card Fusion — EVOSEG 0x801ECCA0 (search 0x801ED5F4), selection 0x801EABB0, Partner Fusion 0x801EB2A0
 * (docs/research/progresion/03-companero-fusion-intercambio.md §4). Expected results come from the
 * research table of all 37 401 pairs, computed independently.
 */
import { describe, expect, it } from 'vitest';
import { addCard, copiesOf } from '../../src/engine/progression/collection';
import { canFuse, fuse, fuseCards, partnerFusion, visitShop } from '../../src/engine/progression/fusion';
import { newGame } from '../../src/engine/progression/save';

const seq = (...v: number[]) => {
  let i = 0;
  return { next: () => v[Math.min(i++, v.length - 1)] };
};
const counter = () => {
  let i = 0;
  return { next: () => i++ };
};
/** First roll 99 (no mutation), then 0, 1, 2… so serial numbers can differ. */
const noMutation = () => {
  let i = -1;
  return { next: () => (i++ < 0 ? 99 : i) };
};

describe('fusion result (0x801ECCA0)', () => {
  it('specialty from the mix table, card whose Result equals the sum of Composites', () => {
    expect(fuse(115, 40, noMutation())).toEqual({ result: 2, kind: 'normal' }); // WaruMonzaemon + Zudomon = WarGreymon
    expect(fuse(40, 115, noMutation())).toEqual({ result: 2, kind: 'normal' });
    expect(fuse(27, 62, noMutation())).toEqual({ result: 96, kind: 'normal' }); // Agumon + Gabumon = MoriShellmon
  });

  it('20 fixed special fusions win (no mutation roll)', () => {
    expect(fuse(2, 37, seq(0))).toEqual({ result: 1, kind: 'special' }); // Omnimon
    expect(fuse(117, 12, seq(0))).toEqual({ result: 4, kind: 'special' }); // Paildramon
  });

  it('no card with that value: the search widens ±1, ±2… (Fire 3 → Goburimon)', () => {
    expect(fuse(32, 267, noMutation()).result).toBe(33);
  });

  it('never returns one of the two cards (WarGreymon + Golden Banana → Phoenixmon 50 %, Paildramon 25 %…)', () => {
    // each widening step draws up (35 → WarGreymon, excluded) or down at random
    expect(fuse(2, 191, seq(99, 0, 1)).result).toBe(3); // d = 2 goes down: Phoenixmon
    expect(fuse(2, 191, seq(99, 0, 0, 1)).result).toBe(4); // d = 3: Paildramon
  });

  it('Option results are drawn among the cards with that value', () => {
    const res = new Set([0, 1, 2, 3].map((r) => fuse(0, 9, seq(99, r, r, r, r)).result));
    expect([...res].every((id) => id === 194 || id === 253)).toBe(true);
  });

  it('mutation with chance ⌊S/10⌋ + 1 %: a jewel, Fake Sevens or a shifted result', () => {
    expect(fuse(115, 40, seq(3, 50)).kind).toBe('mutation');
    expect(fuse(115, 40, seq(3, 50)).result).toBe(200); // Fake Sevens
    expect(fuse(115, 40, seq(3, 10, 5)).result).toBe(273 + 5); // a Digi-jewel
    expect(fuse(115, 40, seq(4, 50)).kind).toBe('normal'); // S 35 → 4 % → rolls 0..3 only
  });
});

describe('the Fusion Shop (0x801EABB0, 0x801EBA08)', () => {
  const save = () => {
    const s = newGame(0, counter());
    for (const id of [115, 40, 29, 14, 293]) addCard(s.collection, id, 2, counter());
    return s;
  };

  it('cannot use partners, Armor, Composite-0 cards, cards above the shop level, or copies in use', () => {
    const s = save();
    expect(canFuse(s, 175, 3)).toMatch(/Partner/);
    expect(canFuse(s, 172, 3)).toMatch(/no se puede/i);
    expect(canFuse(s, 293, 3)).toMatch(/no se puede/i);
    expect(canFuse(s, 14, 0)).toMatch(/nivel/); // Greymon (C) at shop No.1
    expect(canFuse(s, 29, 0)).toBeNull(); // Biyomon (R)
    s.decks[1] = { name: 'x', cards: [115, 115, ...Array(28).fill(29)], wins: 0, losses: 0 };
    expect(canFuse(s, 115, 3)).toMatch(/mazo/);
  });

  it('fusing consumes one of each and adds the result', () => {
    const s = save();
    const r = fuseCards(s, 115, 40, 3, noMutation());
    expect(r).toMatchObject({ result: 2, kind: 'normal' });
    expect([copiesOf(s.collection, 115), copiesOf(s.collection, 40), copiesOf(s.collection, 2)]).toEqual([1, 1, 1]);
    expect(s.fusion).toEqual({ fused: 1, used: 2, mutations: 0 });
  });

  it('the shops share their data: the highest shop visited sets the level limit (R, C, any)', () => {
    const s = newGame(0, counter());
    expect(visitShop(s, 0)).toBe(0);
    expect(visitShop(s, 2)).toBe(3);
    expect(visitShop(s, 0)).toBe(3);
  });

  it('a normal result already at 6 copies is refused', () => {
    const s = save();
    addCard(s.collection, 2, 6, counter());
    expect(fuseCards(s, 115, 40, 3, noMutation())).toMatchObject({ error: expect.stringMatching(/máximo/) });
    expect(copiesOf(s.collection, 115)).toBe(2);
  });
});

describe('Partner Fusion (0x801EB2A0)', () => {
  it('one of its 5 cards teaches a Digi-Part; any other card gives EXP = its Composite', () => {
    const s = newGame(0, counter());
    addCard(s.collection, 0, 1, counter()); // Imperialdramon → Veemon: Digi-Part 9
    addCard(s.collection, 29, 1, counter());
    expect(partnerFusion(s, 0, 0, counter())).toEqual({ part: 9 });
    expect(s.ownedParts[9]).toBe(true);
    const r = partnerFusion(s, 0, 29, counter());
    expect(r.exp).toBeGreaterThan(0);
    expect(s.partners[0].exp).toBe(r.exp);
    expect(copiesOf(s.collection, 29)).toBeGreaterThanOrEqual(0);
  });
});

describe('Partner Fusion EXP', () => {
  it('adds EXP point by point with the same level-ups as battles (Veemon 1 → 2 learns its level-2 part)', () => {
    const s = newGame(0, counter());
    addCard(s.collection, 14, 1, counter()); // Greymon, Composite 12
    expect(partnerFusion(s, 0, 14, counter())).toEqual({ exp: 12, levels: 1, learned: [41] });
    expect(s.partners[0].slot.level).toBe(2);
  });
});
