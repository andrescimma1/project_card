/**
 * Records kept after each battle (SLUS 0x8003F72C..0x8003F990) and the data the Complete Stats screen shows:
 *   0x800471F4  repeated rival decks share one record
 *   save+0xAC0  per DECK2 deck: b15 known, b14 can be a Base Deck (0x800461C0), b0-13 wins with a loaned deck
 *   save+0xBFE  losses with a loaned deck · save+0x888 / +0x9A4 wins / losses against each COM deck
 *   save+0xD3C  highest ◯△✕ power each Digimon reached (KAWSEG 0x801EA5F4)
 */
import { describe, expect, it } from 'vitest';
import { decks } from '../../src/engine/cards/decks';
import type { GameEvent, GameState } from '../../src/engine/game/types';
import { addCard } from '../../src/engine/progression/collection';
import { markTutorial, recordIndex, refreshBaseDecks } from '../../src/engine/progression/records';
import { applyComResult, newGame } from '../../src/engine/progression/save';
import { buildGame } from '../engine/build';

const counter = () => {
  let i = 0;
  return { next: () => i++ };
};

function ended(winner: 0 | 1, events: GameEvent[] = []): { state: GameState; events: GameEvent[] } {
  const { state } = buildGame({ phase: { name: 'gameOver' }, p0: { stack: ['Veemon'], online: ['Agumon'], rounds: 3 }, p1: { stack: ['Gabumon'] } });
  state.winner = winner;
  return { state, events };
}

describe('one record for repeated decks (0x800471F4)', () => {
  it('117, 121-127 → 114 · 128-131 → 119 · 132-139, 141 from a table · the rest unchanged', () => {
    expect([117, 118, 120, 121, 127, 128, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 5].map(recordIndex)).toEqual([
      114, 118, 120, 114, 114, 119, 119, 85, 92, 90, 82, 88, 79, 13, 0, 140, 0, 5,
    ]);
  });

  it('a COM battle counts under the shared record and marks the deck as known', () => {
    const s = newGame(0, counter());
    const { state, events } = ended(0);
    applyComResult(s, { state, events, rival: decks[125], deckUsed: s.decks[0].cards, lent: null }, counter());
    expect(s.deckRecords[114]).toEqual({ wins: 1, losses: 0 });
    expect(s.deckRecords[125]).toBeUndefined();
    expect(s.eventRecords[114]).toMatchObject({ known: true, wins: 0, losses: 0 });
    expect(s.decks[0].wins).toBe(1);
  });

  it('with a loaned deck (CMD11.17) the win goes to that deck, not to your own deck slot', () => {
    const s = newGame(0, counter());
    const { state, events } = ended(0);
    applyComResult(s, { state, events, rival: decks[3], deckUsed: decks[145].cards, lent: 145 }, counter());
    expect(s.eventRecords[145]).toMatchObject({ known: true, wins: 1, losses: 0 });
    expect(s.decks[0].wins).toBe(0);
    expect(s.winsCom).toBe(1);
  });

  it('the tutorial keeps no record but makes decks 0 and 158 known', () => {
    const s = newGame(0, counter());
    markTutorial(s);
    expect([s.eventRecords[0]?.known, s.eventRecords[158]?.known, s.winsCom]).toEqual([true, true, 0]);
  });
});

describe('Base Decks (0x800461C0)', () => {
  it('a known deck becomes a Base Deck once you own every card it needs, and stays one', () => {
    const s = newGame(0, counter());
    const target = decks[2]; // Penguinmon Color: no partner cards
    s.eventRecords[2] = { known: true, base: false, wins: 0, losses: 0 };
    refreshBaseDecks(s);
    expect(s.eventRecords[2].base).toBe(false);
    for (const id of new Set(target.cards)) addCard(s.collection, id, target.cards.filter((x) => x === id).length, counter());
    refreshBaseDecks(s);
    expect(s.eventRecords[2].base).toBe(true);
    s.collection.flags[target.cards[0]] &= 0xf8;
    refreshBaseDecks(s);
    expect(s.eventRecords[2].base).toBe(true);
  });

  it('a deck with a Partner card never qualifies (partners are not counted as copies)', () => {
    const s = newGame(0, counter());
    s.eventRecords[142] = { known: true, base: false, wins: 0, losses: 0 };
    refreshBaseDecks(s);
    expect(s.eventRecords[142].base).toBe(false);
  });
});

describe('highest attack power per Digimon (KAWSEG 0x801EA5F4)', () => {
  it('each hit by your Digimon keeps the highest power of the attack used', () => {
    const s = newGame(0, counter());
    const { state } = ended(0);
    const agumon = state.players[0].online.find((x) => x !== null)!;
    const hit = (damage: number, slot: 'circle' | 'cross', attacker: 0 | 1 = 0): GameEvent => ({
      type: 'hit', attacker, defender: attacker === 0 ? 1 : 0, attackerCard: agumon, defenderCard: agumon, damage, eaten: 0, hp: [0, 0], slot,
    });
    applyComResult(s, { state, events: [hit(380, 'circle'), hit(520, 'circle'), hit(450, 'circle'), hit(120, 'cross'), hit(999, 'circle', 1)], rival: decks[3], deckUsed: s.decks[0].cards, lent: null }, counter());
    expect(s.maxAttack[27]).toEqual([520, 0, 120]);
  });
});
