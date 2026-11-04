/**
 * EXP bonuses after a battle against the CPU — KAWSEG 0x801FAA54 over the table 0x801FC300.
 */
import { describe, expect, it } from 'vitest';
import { BONUS_BIT } from '../../src/engine/game/bonusFlags';
import type { GameState } from '../../src/engine/game/types';
import { evaluateBonuses } from '../../src/engine/progression/bonuses';
import { buildGame, type PlayerSpec } from '../engine/build';

function ended(p0: PlayerSpec, p1: PlayerSpec, winner: 0 | 1, flags = 0): GameState {
  const { state } = buildGame({ phase: { name: 'gameOver' }, p0, p1 });
  state.winner = winner;
  state.players[0].bonusFlags = flags;
  return state;
}
const bit = (...b: number[]) => b.reduce((f, x) => f | (1 << x), 0);
const names = (r: ReturnType<typeof evaluateBonuses>) => r.granted.map((b) => b.name);
const base = { stack: ['Agumon'], online: ['Biyomon'], hand: ['Gabumon'] };

describe('EXP bonuses (0x801FAA54)', () => {
  it('a 3-0 win attacking only with ◯, gambling every time, without digivolving or changing the hand', () => {
    const s = ended({ ...base, rounds: 3 }, { stack: ['Gabumon'], online: ['Agumon'] }, 0, bit(BONUS_BIT.attackCircle, BONUS_BIT.supportUsed));
    expect(names(evaluateBonuses(s, 0, 5))).toEqual(['All ◯ Attack Win', 'All or Nothing Gamble Win', 'No Digivolve Win', 'No Discard Win', 'No Loss Win']);
    expect(evaluateBonuses(s, 0, 5).exp).toBe(5 + 3 + 5 + 3 + 1 + 3);
  });

  it('losses only give the loss bonuses (and the shared ones); the rival EXP only counts when winning', () => {
    const s = ended({ ...base, rounds: 0 }, { stack: ['Gabumon'], rounds: 3 }, 1, bit(BONUS_BIT.attackCircle, BONUS_BIT.nonGambleSupport, BONUS_BIT.digivolved, BONUS_BIT.changedHand, BONUS_BIT.damageFever));
    const r = evaluateBonuses(s, 0, 5);
    expect(names(r)).toEqual(['Total Loss', 'Damage Fever']);
    expect(r.exp).toBe(1 + 10);
  });

  it('Super Bonus after 7 others; Lucky Name never', () => {
    const s = ended({ ...base, rounds: 3, dp: Array(8).fill('Biyomon') }, { stack: ['Gabumon'] }, 0, bit(BONUS_BIT.attackCircle, BONUS_BIT.fourOfAKind, BONUS_BIT.supportUsed));
    const n = names(evaluateBonuses(s, 0, 0));
    expect(n).toContain('8 DP Cards Win');
    expect(n).toContain('0 Online Card Left win');
    expect(n.at(-1)).toBe('Super Bonus');
    expect(n).not.toContain('Lucky Name');
  });

  it('Desperate Win needs 3-2 with both decks and hands empty', () => {
    const s = ended({ stack: ['Agumon'], rounds: 3 }, { stack: ['Gabumon'], rounds: 2 }, 0, bit(BONUS_BIT.attackCircle, BONUS_BIT.nonGambleSupport, BONUS_BIT.digivolved, BONUS_BIT.changedHand));
    const n = names(evaluateBonuses(s, 0, 0));
    expect(n).toContain('Desperate Win');
    expect(n).not.toContain('All Gone Win');
  });
});
