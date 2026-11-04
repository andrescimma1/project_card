/**
 * Card collection — SLUS 0x80045B18 (add), 0x80045E1C (remove), 0x80045968 (serial numbers),
 * 0x80045A58 (clear "just received"). Byte per card at save+0x14B2: bits 0-2 copies, 0x10 complete,
 * 0x20 new, 0x40 obtained, 0x80 just received; serials at save+0x15E0[id][6].
 */
import { describe, expect, it } from 'vitest';
import { addCard, clearJustReceived, copiesOf, newCollection, removeCard } from '../../src/engine/progression/collection';

const seq = (...v: number[]) => {
  let i = 0;
  return { next: () => v[Math.min(i++, v.length - 1)] };
};
const r = () => seq(...Array.from({ length: 50 }, (_, i) => 100 + i));

describe('adding cards (0x80045B18)', () => {
  it('a first copy is new, obtained and just received', () => {
    const c = newCollection();
    expect(addCard(c, 27, 1, r())).toBe(1);
    expect(c.flags[27]).toBe(0x01 | 0x20 | 0x40 | 0x80);
  });

  it('partners and Armor cannot be received as cards', () => {
    expect(addCard(newCollection(), 175, 1, r())).toBe(-3);
    expect(addCard(newCollection(), 190, 1, r())).toBe(-3);
  });

  it('at 6 copies the card is complete; a 7th is FULL SET (−2) and an overflow caps at 6 (−1)', () => {
    const c = newCollection();
    expect(addCard(c, 27, 5, r())).toBe(5);
    expect(addCard(c, 27, 2, r())).toBe(-1);
    expect([copiesOf(c, 27), c.flags[27] & 0x10]).toEqual([6, 0x10]);
    expect(addCard(c, 27, 1, r())).toBe(-2);
  });

  it('a card with Result 0 counts as complete from its first copy', () => {
    const c = newCollection();
    addCard(c, 0, 1, r()); // Imperialdramon
    expect(c.flags[0] & 0x10).toBe(0x10);
  });

  it('each copy slot gets a serial number different from the copies below it', () => {
    const c = newCollection();
    addCard(c, 27, 1, seq(7, 7, 7, 8, 9, 9, 10, 11, 12));
    expect(new Set(c.serials[27]).size).toBe(6);
    expect(c.serials[27][0]).toBe(7);
  });

  it('"just received" is cleared for every card at once', () => {
    const c = newCollection();
    addCard(c, 27, 1, r());
    clearJustReceived(c);
    expect(c.flags[27] & 0x80).toBe(0);
  });
});

describe('removing cards (0x80045E1C)', () => {
  it('removes copies; none left is −2; removing more than there are leaves 0 (−1)', () => {
    const c = newCollection();
    expect(removeCard(c, 27, 1)).toBe(-2);
    addCard(c, 27, 3, r());
    expect(removeCard(c, 27, 1)).toBe(2);
    expect(removeCard(c, 27, 5)).toBe(-1);
    expect(copiesOf(c, 27)).toBe(0);
    expect(c.flags[27] & 0x40).toBe(0x40); // still "obtained"
  });
});
