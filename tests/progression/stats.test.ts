/**
 * Player's Complete Stats — ENDSEG 0x801DF47C (one scrolling page, sections in this order):
 * cards you own · per event deck · per COM · bonuses · trading · fusion · attack rate · specialty data ·
 * COM / 2P results and saves · titles · "You're ...!" (0x801DE80C).
 */
import { describe, expect, it } from 'vitest';
import { addCard, FLAG } from '../../src/engine/progression/collection';
import { newGame } from '../../src/engine/progression/save';
import { completeStats } from '../../src/engine/progression/stats';

const counter = () => {
  let i = 0;
  return { next: () => i++ };
};

describe('Complete Stats (ENDSEG)', () => {
  it('cards: unknown ones show as ?????, owned Digimon show rounds won/lost and best ◯△✕ power', () => {
    const s = newGame(0, counter());
    s.roundsWon[27] = 4;
    s.roundsLost[27] = 1;
    s.maxAttack[27] = [520, 0, 120];
    s.collection.flags[27] |= FLAG.traded;
    const st = completeStats(s);
    expect(st.cards).toHaveLength(301);
    expect(st.cards[0]).toMatchObject({ id: 0, known: false });
    expect(st.cards[27]).toMatchObject({ known: true, copies: 2, traded: true, digimon: { wins: 4, losses: 1, max: [520, 0, 120] } });
    expect(st.cards[264]).toMatchObject({ known: true, digimon: null }); // Attack Chip: Options show no battle data
  });

  it('event decks = every known deck; COM decks = those beaten at least once, by owner', () => {
    const s = newGame(0, counter());
    s.eventRecords[3] = { known: true, base: false, wins: 0, losses: 0 };
    s.eventRecords[145] = { known: true, base: false, wins: 2, losses: 1 };
    s.deckRecords[3] = { wins: 1, losses: 2 };
    s.deckRecords[4] = { wins: 0, losses: 3 };
    const st = completeStats(s);
    expect(st.eventDecks.map((d) => [d.index, d.wins, d.losses])).toEqual([[3, 0, 0], [142, 0, 0], [145, 2, 1]]);
    expect(st.eventDecks[0].name).toBe('New Power');
    expect(st.comDecks).toEqual([{ index: 3, owner: 'Babamon', wins: 1, losses: 2 }]);
  });

  it('bonuses: all but "Lucky Name" (never granted); attack rate in tenths of a percent', () => {
    const s = newGame(0, counter());
    s.bonusCounts[0] = 5;
    s.attackUse = [3, 1, 0];
    const st = completeStats(s);
    expect(st.bonuses).toHaveLength(31);
    expect(st.bonuses.some((b) => b.name === 'Lucky Name')).toBe(false);
    expect(st.bonuses[0]).toMatchObject({ id: 0, times: 5 });
    expect(st.attackRate).toEqual([750, 250, 0]);
    expect(completeStats(newGame(0, counter())).attackRate).toEqual([0, 0, 0]);
  });

  it('specialty data: ranked by rounds won (ties keep Fire, Ice, Nature, Darkness, Rare order), with totals', () => {
    const s = newGame(0, counter());
    s.roundsWon[34] = 5; // Vikemon (Ice)
    s.roundsLost[34] = 2;
    s.roundsWon[103] = 5; // Apokarimon (Darkness)
    s.roundsWon[0] = 1; // Imperialdramon (Fire)
    const st = completeStats(s);
    expect(st.specialty.rows.map((r) => r.specialty)).toEqual(['ice', 'darkness', 'fire', 'nature', 'rare']);
    expect(st.specialty.rows[0]).toMatchObject({ wins: 5, losses: 2 });
    expect(st.specialty.all).toMatchObject({ wins: 11, losses: 2 });
    expect(st.specialty.all.cards).toBe(st.specialty.rows.reduce((n, r) => n + r.cards, 0));
  });

  it('results, titles and the final title', () => {
    const s = newGame(0, counter());
    Object.assign(s, { winsCom: 12, lossesCom: 3, wins2p: 1, losses2p: 0, saveCount: 7 });
    s.fusion = { fused: 2, used: 5, mutations: 1 };
    s.trades = { received: 3, given: 4 };
    addCard(s.collection, 34, 1, counter());
    const st = completeStats(s);
    expect(st.results).toEqual({ com: [12, 3], twoP: [1, 0], saves: 7 });
    expect(st.fusion).toEqual({ used: 5, fused: 2, mutations: 1 });
    expect(st.trading).toEqual({ given: 4, received: 3 });
    expect(st.titles.tamer).toBe('Beginner Tamer');
    expect(st.finalTitle).toBe('Emperor Cassiopeia'); // no rounds won yet
  });
});
