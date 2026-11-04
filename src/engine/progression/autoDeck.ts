/**
 * Auto Deck — SUBSEG 0x801F10D8 (menu 0x801F0024: Specialty, Offensive / Defensive, Option Cards Many / Few).
 *   1. 20 pools of card ids: specialty × {R, C, U} (0..14; level A counts as R), Options by kind
 *      (15 Offensive, 16 Defensive, SUBSEG 0x801F228C) and Digivolve (17). Each owned card goes in
 *      min(copies, 4) times; partners and Armor (172..190) are left out. Each pool is shuffled:
 *      for i, swap(i, |rand() % n|).
 *   2. The "second" specialty = the one, other than the chosen, with most cards in its three pools
 *      (ties: the later one).
 *   3. Options: the preferred kind, then Digivolve, then the other kind, up to the template count.
 *   4. The partner cards of the slots, then R (count includes the partners), C and U of the chosen
 *      specialty, each topped up from the second specialty.
 *   5. If still under 30: every pool in order (0..19), whatever is left.
 */
import { LEVEL_CODE, SPECIALTY_CODE } from '../ai/view';
import { cards } from '../cards/db';
import { copiesOf } from './collection';
import type { SaveData } from './save';
import { progression } from './tables';

type Rand = { next(): number };
const POOLS = 20;
const DIGIVOLVE_POOL = 17;
const DECK_SIZE = 30;

export interface AutoDeckOptions {
  /** 0 Fire, 1 Ice, 2 Nature, 3 Darkness, 4 Rare. */
  specialty: number;
  /** Option preference: Offensive (false) or Defensive (true). */
  defensive: boolean;
  /** Option Cards: Many (false) or Few (true). */
  few: boolean;
}

function poolOf(id: number): number {
  const c = cards[id];
  if (c.kind === 'digimon') return SPECIALTY_CODE[c.specialty] * 3 + Math.max(0, LEVEL_CODE[c.level] - 1);
  if (c.kind === 'digivolve') return DIGIVOLVE_POOL;
  return 15 + progression.autoDeck.optionCategory[id - 191];
}

export function autoDeck(save: SaveData, o: AutoDeckOptions, rand: Rand): number[] {
  const pools: number[][] = Array.from({ length: POOLS }, () => []);
  for (let id = 0; id < cards.length; id++) {
    if (id >= 172 && id <= 190) continue;
    const n = Math.min(copiesOf(save.collection, id), 4);
    for (let k = 0; k < n; k++) pools[poolOf(id)].push(id);
  }
  for (const p of pools)
    for (let i = 0; i < p.length; i++) {
      const j = Math.abs(rand.next() % p.length);
      [p[i], p[j]] = [p[j], p[i]];
    }

  let second = 0;
  let best = 0;
  for (let s = 0; s < 5; s++) {
    if (s === o.specialty) continue;
    const total = pools[s * 3].length + pools[s * 3 + 1].length + pools[s * 3 + 2].length;
    if (total >= best) [second, best] = [s, total];
  }

  const deck: number[] = [];
  /** 0x801F0FD8: up to n cards from the front of a pool (taken cards leave it). */
  const take = (pool: number, n: number) => {
    const got = pools[pool].splice(0, Math.max(0, n));
    deck.push(...got);
    return got.length;
  };

  const [options, ...levels] = progression.autoDeck.templates[o.few ? 1 : 0];
  const pref = o.defensive ? 1 : 0;
  let got = take(15 + pref, options);
  if (got < options) got += take(DIGIVOLVE_POOL, options - got);
  if (got < options) take(16 - pref, options - got);

  levels.forEach((want, lvl) => {
    let n = 0;
    if (lvl === 0)
      for (const p of save.partners) {
        deck.push(p.slot.id);
        n++;
      }
    n += take(o.specialty * 3 + lvl, want - n);
    if (n < want) take(second * 3 + lvl, want - n);
  });

  for (let pool = 0; pool < POOLS && deck.length < DECK_SIZE; pool++) take(pool, DECK_SIZE - deck.length);
  return deck;
}
