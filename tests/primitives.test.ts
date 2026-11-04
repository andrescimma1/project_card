/**
 * Behaviour of routines ported 1:1 from the game code (see docs/research/04-motor-original.md).
 */
import { describe, expect, it } from 'vitest';
import { arith, battleStat, compare, dpTotal } from '../src/engine/rules/primitives';

describe('arith (KAWSEG 0x801E9ABC)', () => {
  it('caps add and mul at 9990', () => {
    expect(arith(9000, 'add', 2000)).toBe(9990);
    expect(arith(5000, 'mul', 3)).toBe(9990);
  });
  it('floors sub at 0', () => {
    expect(arith(100, 'sub', 200)).toBe(0);
  });
  it('div truncates to a multiple of 10 with minimum 10', () => {
    expect(arith(1650, 'div', 2)).toBe(820); // 825 -> 820
    expect(arith(15, 'div', 2)).toBe(10); // 7 -> min 10
    expect(arith(0, 'div', 2)).toBe(0);
    expect(arith(300, 'div', 0)).toBe(0);
  });
  it('unknown op yields 0', () => {
    expect(arith(300, 'zero', 5)).toBe(0);
  });
});

describe('compare (KAWSEG 0x801E9BAC)', () => {
  it('codes 0..5', () => {
    expect(compare(1, '<', 2)).toBe(true);
    expect(compare(200, '<=', 200)).toBe(true); // Betamon "less than 200" really means <= 200
    expect(compare(3, '>=', 3)).toBe(true);
    expect(compare(1, '!=', 0)).toBe(true);
  });
  it('out-of-range comparator is always false (Aquilamon 0xFF)', () => {
    expect(compare(1, 'never', 1)).toBe(false);
  });
});

describe('entering the Battle Slot (SLUS 0x8004080C)', () => {
  it('Rookie keeps full stats; C halves; U quarters; truncated to tens', () => {
    expect(battleStat(1650, null)).toBe(1650);
    expect(battleStat(1650, 'R')).toBe(1650);
    expect(battleStat(850, 'C')).toBe(420); // 425 -> 420
    expect(battleStat(1650, 'U')).toBe(410); // 412 -> 410
  });
});

describe('DP total (SLUS 0x8004110C)', () => {
  it('sums +P and caps at 90', () => {
    expect(dpTotal([10, 20, 30])).toBe(60);
    expect(dpTotal([30, 30, 30, 30])).toBe(90);
  });
});
