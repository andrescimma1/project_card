/**
 * Prize Packs — port of SLUS 0x8004635C (docs/research/progresion/02-resultados-y-guardado.md §3).
 * A pack is 3 cards. Pools are built from each card's Result value (CARD2 +0x19, `fusion.result`):
 *   Digimon: bound x = pack[specialty·3 + (R → 2, C → 1, U or A → 0)];  x < 0 → [−x, 99], else [0, x]
 *   Option / Digivolve Option: [pack[16], pack[15]]
 *   value in range → normal pool;  max ≠ 0 and max < value ≤ max + pack[17] → rare pool (0x8004667C)
 * Card 1 comes from the rare pool when rand() % 100 < rare% (Digi-Parts 126/127); cards 2-3 are normal.
 */
import { cards } from '../cards/db';
import { SPECIALTY_CODE, LEVEL_CODE } from '../ai/view';
import { progression } from './tables';

export interface PackPools {
  normal: number[];
  rare: number[];
}

const LEVEL_INDEX = [2, 0, 1, 0]; // by level code R0 A1 C2 U3 → table column (R 2, C 1, U/A 0)
const cache = new Map<number, PackPools>();

export function packPools(type: number): PackPools {
  const hit = cache.get(type);
  if (hit) return hit;
  const t = progression.packs[type].params;
  const normal: number[] = [];
  const rare: number[] = [];
  for (const c of cards) {
    const v = c.fusion.result;
    if (v === 0) continue;
    let min: number;
    let max: number;
    if (c.kind === 'digimon') {
      const x = t[SPECIALTY_CODE[c.specialty] * 3 + LEVEL_INDEX[LEVEL_CODE[c.level]]];
      [min, max] = x < 0 ? [-x, 99] : [0, x];
    } else {
      [min, max] = [t[16], t[15]];
    }
    if (v >= min && v <= max) normal.push(c.id);
    else if (max !== 0 && v >= min && v <= max + t[17]) rare.push(c.id);
  }
  const pools = { normal, rare };
  cache.set(type, pools);
  return pools;
}

/** The 3 card ids of a pack of `type`; `rarePercent` = Σ rare% of the partner slots. */
export function openPack(type: number, rarePercent: number, rand: { next(): number }): number[] {
  const { normal, rare } = packPools(type);
  const first = rand.next() % 100 < rarePercent && rare.length ? rare[rand.next() % rare.length] : normal[rand.next() % normal.length];
  return [first, normal[rand.next() % normal.length], normal[rand.next() % normal.length]];
}
