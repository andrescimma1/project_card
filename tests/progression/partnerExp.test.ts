/**
 * Partner EXP and levels — SLUS 0x80049934 (EXP needed), KAWSEG 0x801F4A24 (battle EXP, added one point
 * at a time), 0x80049840 (Digi-Part of the new level), 0x8004994C (+10 every 5 levels).
 */
import { describe, expect, it } from 'vitest';
import { newPartnerSlot } from '../../src/engine/game/partner';
import { battleExpGain, expNeeded, gainExp, type PartnerProgress } from '../../src/engine/progression/partnerExp';

const seq = (...v: number[]) => {
  let i = 0;
  return { next: () => v[Math.min(i++, v.length - 1)] };
};
const veemon = (level = 1, exp = 0): PartnerProgress => ({ slot: { ...newPartnerSlot(175), level }, exp });
const owned = () => Array(128).fill(false) as boolean[];

describe('EXP curve (0x80049934)', () => {
  it('cumulative EXP to leave level L is (L+1)(L+3), up to 9999 at 98 → 99', () => {
    expect([1, 2, 4, 10, 50, 98].map(expNeeded)).toEqual([8, 15, 35, 143, 2703, 9999]);
  });
});

describe('gaining EXP', () => {
  it('each new level teaches its Digi-Part (Veemon level 2: part 41)', () => {
    const p = veemon();
    const parts = owned();
    const r = gainExp(p, 8, parts, seq(0));
    expect([p.slot.level, p.exp]).toEqual([2, 8]);
    expect(r.learned).toEqual([41]);
    expect(parts[41]).toBe(true);
  });

  it('a part already owned is not learned again; several levels at once learn each one', () => {
    const p = veemon();
    const parts = owned();
    parts[41] = true;
    const r = gainExp(p, 24, parts, seq(0));
    expect(p.slot.level).toBe(4);
    expect(r.learned).toEqual([0, 15]);
  });

  it('every 5 levels, +10 to HP, ◯, △ or ✕ with rand() % 4', () => {
    const p = veemon(4, 34);
    gainExp(p, 1, owned(), seq(6));
    expect(p.slot.level).toBe(5);
    expect(p.slot.bonus).toEqual([0, 0, 10, 0]);
  });

  it('stops at level 99 and 9999 EXP', () => {
    const p = veemon(98, 9990);
    gainExp(p, 50, owned(), seq(0));
    expect([p.slot.level, p.exp]).toEqual([99, 9999]);
  });

  it('battle EXP = rival EXP + bonuses, plus the slot EXP % rounded down', () => {
    expect(battleExpGain(17, 0)).toBe(17);
    expect(battleExpGain(17, 30)).toBe(22);
  });
});
