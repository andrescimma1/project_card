/**
 * The save: a new game (OPENSEG 0x801E8280, SLUS 0x8002D51C) and the result of a battle against the CPU
 * (SLUS 0x8003F3C0..0x8003F990, KAWSEG 0x801F4A24 / 0x801F5E50).
 */
import { describe, expect, it } from 'vitest';
import { decks } from '../../src/engine/cards/decks';
import type { GameEvent, GameState } from '../../src/engine/game/types';
import { copiesOf } from '../../src/engine/progression/collection';
import { applyComResult, newGame } from '../../src/engine/progression/save';
import { buildGame } from '../engine/build';

const counter = () => {
  let i = 0;
  return { next: () => i++ };
};
const deck = (n: string) => decks.find((d) => d.name === n)!;

describe('new game', () => {
  it('Veemon: partner at level 1 with its starting Digi-Part, the Red deck and one card of each starting pair', () => {
    const s = newGame(0, counter());
    expect(s.partners.map((p) => [p.slot.id, p.slot.level, p.exp])).toEqual([[175, 1, 0]]);
    expect(s.ownedParts[10]).toBe(true);
    expect(s.decks[0].cards).toEqual(deck('Red').cards);
    const red = deck('Red').cards;
    expect(copiesOf(s.collection, 27)).toBeGreaterThanOrEqual(red.filter((id) => id === 27).length);
    // every non-partner deck card once, plus one card of each of the 5 Veemon pairs
    const total = s.collection.flags.reduce((n, f) => n + (f & 7), 0);
    expect(total).toBe(red.filter((id) => id !== 175).length + 5);
    for (const [a, b] of [[11, 116], [25, 131], [28, 137], [31, 138], [249, 258]]) expect(copiesOf(s.collection, a) + copiesOf(s.collection, b)).toBeGreaterThan(0);
    expect(copiesOf(s.collection, 175)).toBe(0);
  });
});

function ended(winner: 0 | 1): { state: GameState; events: GameEvent[] } {
  const { state } = buildGame({ phase: { name: 'gameOver' }, p0: { stack: ['Veemon'], online: ['Agumon'], rounds: winner === 0 ? 3 : 1 }, p1: { stack: ['Gabumon'], rounds: winner === 0 ? 0 : 3 } });
  state.winner = winner;
  state.players[0].bonusFlags = 1; // only ◯ used
  return { state, events: [{ type: 'reveal', attacks: ['circle', 'triangle'], hp: [550, 680] }] };
}

describe('after a battle against the CPU', () => {
  it('a win: record, Prize Pack from the rival deck, EXP for the partner in the deck, ranks', () => {
    const s = newGame(0, counter());
    const { state, events } = ended(0);
    const rival = deck('New Power'); // EXP 5
    const r = applyComResult(s, { state, events, rival, deckUsed: [175, ...Array(29).fill(27)], lent: null }, counter());
    expect([s.winsCom, s.lossesCom]).toEqual([1, 0]);
    expect(r.pack).toHaveLength(3);
    expect(r.expGained[0]).toBe(r.bonuses.exp);
    expect(r.bonuses.exp).toBeGreaterThan(5);
    expect(s.partners[0].exp).toBe(r.bonuses.exp);
    expect(s.attackUse).toEqual([1, 0, 0]);
    expect(s.deckRecords[rival.index]).toEqual({ wins: 1, losses: 0 }); // New Power (3) keeps its own record
  });

  it('a loss: no pack, and EXP only from the loss bonuses', () => {
    const s = newGame(0, counter());
    const { state, events } = ended(1);
    const r = applyComResult(s, { state, events, rival: deck('New Power'), deckUsed: [175, ...Array(29).fill(27)], lent: null }, counter());
    expect([s.winsCom, s.lossesCom, r.pack.length]).toEqual([0, 1, 0]);
    expect(r.inDeck).toEqual([true]); // it played, even if it earned nothing
  });

  it('partners that were not in the deck used get no EXP', () => {
    const s = newGame(0, counter());
    const { state, events } = ended(0);
    const r = applyComResult(s, { state, events, rival: deck('New Power'), deckUsed: Array(30).fill(27), lent: null }, counter());
    expect(r.expGained).toEqual([0]);
    expect(r.inDeck).toEqual([false]);
    expect(s.partners[0].exp).toBe(0);
  });
});
