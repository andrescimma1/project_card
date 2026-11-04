/**
 * "2 Player Battle" between two saves (OPENSEG; result SLUS 0x80041A1C → 0x8003EC4C):
 *   both saves: wins / losses of the deck slot used, 2P wins (+0x1C) / losses (+0x1E), rounds won / lost by
 *   each card (KAWSEG 0x801ED0A0, winner's and loser's block), ranks; no EXP, no Prize Pack, no COM records.
 */
import { describe, expect, it } from 'vitest';
import type { GameEvent, GameState } from '../../src/engine/game/types';
import { newGame } from '../../src/engine/progression/save';
import { apply2pResult } from '../../src/engine/progression/twoPlayer';
import { buildGame } from '../engine/build';

const counter = (from = 0) => {
  let i = from;
  return { next: () => i++ };
};

function battle(winner: 0 | 1): { state: GameState; events: GameEvent[] } {
  const { state } = buildGame({ phase: { name: 'gameOver' }, p0: { online: ['Agumon'], rounds: 3 }, p1: { online: ['Gabumon'] } });
  state.winner = winner;
  const ag = state.players[0].online.find((x) => x !== null)!;
  const ga = state.players[1].online.find((x) => x !== null)!;
  const events: GameEvent[] = [
    { type: 'reveal', attacks: ['circle', 'cross'], hp: [570, 600] },
    { type: 'hit', attacker: 0, defender: 1, attackerCard: ag, defenderCard: ga, damage: 380, eaten: 0, hp: [570, 0], slot: 'circle' },
    { type: 'ko', player: 1, card: ga } as GameEvent,
  ];
  return { state, events };
}

describe('2 Player Battle result', () => {
  it('the winner and the loser both keep the result', () => {
    const a = newGame(0, counter());
    const b = newGame(1, counter(5000));
    const r = battle(0);
    apply2pResult([a, b], r);
    expect([a.wins2p, a.losses2p, b.wins2p, b.losses2p]).toEqual([1, 0, 0, 1]);
    expect([a.decks[0].wins, b.decks[0].losses]).toEqual([1, 1]);
    expect([a.winsCom, a.lossesCom, b.winsCom, a.partners[0].exp]).toEqual([0, 0, 0, 0]);
    expect(Object.keys(a.deckRecords)).toEqual([]);
  });

  it('rounds: the KO counts as won for the winner card and lost for the loser card, in each save', () => {
    const a = newGame(0, counter());
    const b = newGame(1, counter(5000));
    apply2pResult([a, b], battle(0));
    expect([a.roundsWon[27], b.roundsLost[62]]).toEqual([1, 1]);
    expect(a.maxAttack[27][0]).toBe(380);
    expect([a.attackUse, b.attackUse]).toEqual([[1, 0, 0], [0, 0, 1]]);
  });

  it('ranks use the 2P wins (10 → Battle Expert)', () => {
    const a = newGame(0, counter());
    const b = newGame(1, counter(5000));
    a.wins2p = 9;
    apply2pResult([a, b], battle(0));
    expect(a.ranks.battle2p).toBe(1);
  });
});
