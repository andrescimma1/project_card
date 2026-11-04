/**
 * Prize Pack generator — SLUS 0x8004635C (docs/research/progresion/02-resultados-y-guardado.md §3).
 * Pool sizes are the ones the research computed independently by simulating the routine.
 */
import { describe, expect, it } from 'vitest';
import { openPack, packPools } from '../../src/engine/progression/packs';

const seq = (...v: number[]) => {
  let i = 0;
  return { next: () => v[Math.min(i++, v.length - 1)] };
};

describe('pack pools (from each card Result value, level and specialty)', () => {
  it('normal and rare pool sizes of the 16 packs', () => {
    const sizes = Array.from({ length: 16 }, (_, t) => {
      const p = packPools(t);
      return [p.normal.length, p.rare.length];
    });
    expect(sizes).toEqual([
      [50, 5], [100, 10], [135, 10], [135, 5], [22, 3], [23, 3], [22, 3], [22, 3],
      [21, 3], [59, 3], [22, 3], [21, 3], [20, 3], [22, 3], [20, 3], [52, 7],
    ]);
  });

  it('rare pools sit just above the normal range (Basic: one Champion per specialty)', () => {
    expect(packPools(0).rare).toEqual([23, 57, 93, 128, 161]);
    expect(packPools(9).rare).toEqual([215, 295, 296]);
  });

  it('cards with Result 0 never come in packs (partners, Armor, Sevens, jewels, special-fusion Digimon)', () => {
    const all = new Set(Array.from({ length: 16 }, (_, t) => [...packPools(t).normal, ...packPools(t).rare]).flat());
    for (const id of [0, 1, 103, 172, 175, 190, 200, 273, 285, 292, 293]) expect(all.has(id)).toBe(false);
  });
});

describe('opening a pack', () => {
  it('3 cards from the normal pool when there is no rare chance', () => {
    const p = packPools(4); // Red Pack
    expect(openPack(4, 0, seq(99, 0, 1, 2))).toEqual([p.normal[0], p.normal[1], p.normal[2]]);
  });

  it('the first card comes from the rare pool when rand() % 100 < rare %', () => {
    const p = packPools(4);
    expect(openPack(4, 30, seq(29, 1, 5, 6))).toEqual([p.rare[1], p.normal[5], p.normal[6]]);
    expect(openPack(4, 30, seq(30, 1, 5, 6))).toEqual([p.normal[1], p.normal[5], p.normal[6]]);
  });
});
