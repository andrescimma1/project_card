/**
 * Ranks — SLUS 0x8002CC44 (thresholds in code, never going down), the PLAYER'S DATA percentages
 * (SAISEG 0x801E16B0) and the final "You're …!" title (ENDSEG 0x801DE80C).
 */
import { describe, expect, it } from 'vitest';
import { cards } from '../../src/engine/cards/db';
import { addCard, newCollection } from '../../src/engine/progression/collection';
import { collectorStats, finalTitle, percentages, rankTitles, updateRanks, type Ranks } from '../../src/engine/progression/ranks';

const zero: Ranks = { tamer: 0, collector: 0, battle2p: 0 };
const r = { next: (() => { let i = 0; return () => i++; })() };
const with_ = (over: Partial<Parameters<typeof updateRanks>[1]>) => ({ winsCom: 0, wins2p: 0, collection: newCollection(), traded: false, ...over });

describe('Tamer and 2P ranks (wins)', () => {
  it('Tamer: 10 / 25 / 50 / 100 / 200 / 300 / 500 COM wins', () => {
    expect([9, 10, 25, 49, 50, 100, 200, 300, 499, 500].map((w) => updateRanks(zero, with_({ winsCom: w })).tamer)).toEqual([0, 1, 2, 2, 3, 4, 5, 6, 6, 7]);
    expect(rankTitles(updateRanks(zero, with_({ winsCom: 500 }))).tamer).toBe('Invincible Tamer');
  });

  it('2P: 10 / 20 / 30 / 40 / 60 / 80 / 100 wins against friends', () => {
    expect([10, 59, 60, 100].map((w) => updateRanks(zero, with_({ wins2p: w })).battle2p)).toEqual([1, 4, 5, 7]);
  });

  it('ranks never go down', () => {
    expect(updateRanks({ tamer: 5, collector: 3, battle2p: 2 }, with_({})).tamer).toBe(5);
  });
});

describe('Collector rank (copies, then complete categories, then never trading)', () => {
  const fire = cards.filter((c) => c.id < 172 && c.kind === 'digimon' && c.specialty === 'fire').map((c) => c.id);

  it('100 and 200 copies; a category is complete with one copy of each of its cards', () => {
    const col = newCollection();
    for (const id of fire) addCard(col, id, 6, r);
    expect(collectorStats(col)).toEqual({ copies: 204, complete: 1 });
    expect(updateRanks(zero, with_({ collection: col })).collector).toBe(3);
  });

  it('the steps are climbed in order: complete categories do not count below 200 copies', () => {
    const col = newCollection();
    for (const id of fire) addCard(col, id, 1, r);
    expect(updateRanks(zero, with_({ collection: col })).collector).toBe(0);
  });

  it('Legendary = Perfect without ever trading', () => {
    const col = newCollection();
    for (const c of cards) addCard(col, c.id, 6, r);
    expect(updateRanks(zero, with_({ collection: col })).collector).toBe(7);
    expect(updateRanks(zero, with_({ collection: col, traded: true })).collector).toBe(6);
  });
});

describe('PLAYER\'S DATA percentages (in tenths of a percent)', () => {
  it('story points / 166, cards obtained / 301, Digi-Parts / 128', () => {
    const col = newCollection();
    addCard(col, 27, 1, r);
    expect(percentages({ storyPoints: 83, collection: col, ownedParts: Array.from({ length: 128 }, (_, i) => i < 64) })).toEqual({ game: 500, cards: 3, parts: 500 });
  });
});

describe('final title (ENDSEG 0x801DE80C)', () => {
  it('no rounds won → Emperor Cassiopeia; one dominant specialty and attack → its title', () => {
    expect(finalTitle([0, 0, 0, 0, 0], [0, 0, 0])).toBe('Emperor Cassiopeia');
    expect(finalTitle([50, 5, 3, 2, 1], [40, 10, 5])).toBe('Bomber King');
    expect(finalTitle([50, 5, 3, 2, 1], [40, 38, 5])).toBe('3-headed Dragon');
    expect(finalTitle([50, 48, 3, 2, 1], [40, 10, 5])).toBe('Fire Ocean Master');
    expect(finalTitle([5, 3, 2, 1, 50], [1, 2, 40])).toBe('Jamming King');
  });
});
