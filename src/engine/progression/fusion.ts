/**
 * Card Fusion (Andromon's shops) and Partner Fusion — docs/research/progresion/03-companero-fusion-intercambio.md §4.
 *   EVOSEG 0x801ECCA0  result: S = Composite(A) + Composite(B); specialty from the 6×6 mix table;
 *                      the card of that category whose Result equals S (search 0x801ED5F4, widening ±d);
 *                      20 fixed special fusions first; mutation with chance ⌊S/10⌋ + 1 %
 *   EVOSEG 0x801EABB0  what can be chosen;  0x801EBA08  consume 2, add 1
 *   EVOSEG 0x801EB2A0  Partner Fusion: 5 cards per partner teach a Digi-Part, others give EXP = Composite
 */
import { cards } from '../cards/db';
import { LEVEL_CODE, SPECIALTY_CODE } from '../ai/view';
import { addCard, copiesOf, removeCard } from './collection';
import { gainExp, MAX_LEVEL } from './partnerExp';
import type { SaveData } from './save';
import { progression } from './tables';

type Rand = { next(): number };
export type FusionKind = 'normal' | 'special' | 'mutation';

const F = progression.fusion;
const OPTION = 5;
const JEWEL_FIRST = 273;
const FAKE_SEVENS = 200;

const category = (id: number) => {
  const c = cards[id];
  return c.kind === 'digimon' ? SPECIALTY_CODE[c.specialty] : OPTION;
};
const s8 = (v: number) => ((v & 0xff) ^ 0x80) - 0x80;

/** 0x801ED5F4 for one value: first card of the specialty range, or a shuffled pick among the Options. */
function search(cat: number, value: number, exclude: number[], rand: Rand): number {
  let v = value & 0xff;
  if (v < 2) v = 2;
  if (v >= 36) v = 35;
  if (cat < OPTION) {
    const [lo, hi] = F.ranges[cat];
    for (let id = lo; id <= hi; id++) if (cards[id].fusion.result === v) return id;
    return -1;
  }
  const pool: number[] = [];
  for (const [lo, hi] of F.ranges.slice(OPTION)) for (let id = lo; id <= hi; id++) if (cards[id].fusion.result === v && !exclude.includes(id)) pool.push(id);
  if (!pool.length) return -1;
  for (let i = 0; i < pool.length; i++) {
    const j = rand.next() % pool.length;
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool[0];
}

/** The search with its widening: never one of the two fused cards. */
function resolve(cat: number, v: number, a: number, b: number, rand: Rand): number {
  let res = search(cat, v, [a, b], rand);
  if (res === a || res === b) res = -1;
  for (let d = 1; res === -1 && d < 64; d++) {
    const up = search(cat, v + d, [], rand);
    const down = search(cat, v - d, [], rand);
    res = up >= 0 && down >= 0 ? (rand.next() % 2 === 0 ? up : down) : up >= 0 ? up : down; // 🟡 which half is "up"
    if (res === a || res === b) res = -1;
  }
  return res;
}

/** 0x801ECCA0. `full(id)` = the player already has 6 copies (only the jewels check it). */
export function fuse(a: number, b: number, rand: Rand, full: (id: number) => boolean = () => false): { result: number; kind: FusionKind } {
  const sp = F.specials.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
  if (sp) return { result: sp.result, kind: 'special' };
  const S = s8(cards[a].fusion.composite + cards[b].fusion.composite);
  const cat = F.mix[category(a)][category(b)];
  const roll = Math.abs(rand.next() % 100);
  if (roll <= Math.trunc(S / 10)) {
    const r2 = Math.abs(rand.next() % 100);
    if (r2 <= 20) {
      const jewel = JEWEL_FIRST + (rand.next() % 12);
      return { result: full(jewel) ? FAKE_SEVENS : jewel, kind: 'mutation' };
    }
    if (r2 <= 60) return { result: FAKE_SEVENS, kind: 'mutation' };
    return { result: resolve(cat, S + (rand.next() % 3) + 1, a, b, rand), kind: 'mutation' };
  }
  return { result: resolve(cat, S, a, b, rand), kind: 'normal' };
}

/** Copies not protected by a deck: owned − the most copies any of the 3 decks uses (EVOSEG 0x801E6398). */
export function freeCopies(save: SaveData, id: number): number {
  const inDecks = Math.max(0, ...save.decks.map((d) => d.cards.filter((x) => x === id).length));
  return copiesOf(save.collection, id) - inDecks;
}

/**
 * 0x801EABB0: why a card cannot be chosen, or null. `maxLevel` = level code the shop fuses up to
 * (No.1 R → 0, No.2 C → 2, No.3 any → 3; 🟡 values inferred from the dialogue). Options are not limited.
 */
export function canFuse(save: SaveData, id: number, maxLevel: number): string | null {
  if (id >= 172 && id <= 190) return [175, 182, 183, 184, 187, 190].includes(id) ? 'No se pueden fusionar cartas Partner.' : 'Esa carta no se puede fusionar.';
  const c = cards[id];
  if (c.fusion.composite === 0) return 'Esa carta no se puede fusionar.';
  if (c.kind === 'digimon' && LEVEL_CODE[c.level] > maxLevel) return 'Esta tienda no fusiona cartas de ese nivel.';
  if (freeCopies(save, id) <= 0) return 'No te quedan copias libres: las demás están en un mazo.';
  return null;
}

/** Level limit of shops No.1/No.2/No.3 (doc 03 §4.1: R, up to C, any; 🟡 the numeric values). */
const SHOP_LEVEL = [0, 2, 3];

/**
 * Entering Andromon's shop `k` (CMD11.4(k)). The shops share their data ("I already got your data from
 * No.2"), so the highest shop visited sets the limit. 🟡 where the game keeps it (UNIT script vars) is unknown.
 */
export function visitShop(save: SaveData, k: number): number {
  save.fusionShop = Math.max(save.fusionShop ?? -1, k);
  return SHOP_LEVEL[save.fusionShop];
}

/** Fuse two collection cards (EVOSEG 0x801EBA08): consume one of each, add the result. */
export function fuseCards(save: SaveData, a: number, b: number, maxLevel: number, rand: Rand): { result: number; kind: FusionKind } | { error: string } {
  const why = canFuse(save, a, maxLevel) ?? canFuse(save, b, maxLevel) ?? (a === b && freeCopies(save, a) < 2 ? 'Necesitas dos copias libres de esa carta.' : null);
  if (why) return { error: why };
  const r = fuse(a, b, rand, (id) => copiesOf(save.collection, id) >= 6);
  if (r.kind !== 'mutation' && copiesOf(save.collection, r.result) >= 6) return { error: 'Ya tienes el máximo de esa carta.' }; // 0x801EAAE8
  removeCard(save.collection, a, 1);
  removeCard(save.collection, b, 1);
  addCard(save.collection, r.result, 1, rand);
  save.fusion = { fused: save.fusion.fused + 1, used: save.fusion.used + 2, mutations: save.fusion.mutations + (r.kind === 'mutation' ? 1 : 0) };
  return r;
}

/** Partner Fusion: partner slot `k` absorbs card `b`. */
export function partnerFusion(
  save: SaveData,
  k: number,
  b: number,
  rand: Rand,
  maxLevel = 3,
): { part?: number; exp?: number; levels?: number; learned?: number[]; error?: string } {
  const why = canFuse(save, b, maxLevel);
  if (why) return { error: why };
  const p = save.partners[k];
  removeCard(save.collection, b, 1);
  save.fusion = { ...save.fusion, used: save.fusion.used + 1 };
  const combo = F.partnerFusion[F.partnerOrder.indexOf(p.slot.id)]?.find((x) => x.card === b);
  if (combo && !save.ownedParts[combo.part]) {
    save.ownedParts[combo.part] = true;
    return { part: combo.part };
  }
  if (p.slot.level >= MAX_LEVEL) return { exp: 0, levels: 0, learned: [] }; // 🟡 "RANK MAX!", the card is still used
  const exp = cards[b].fusion.composite;
  const r = gainExp(p, exp, save.ownedParts, rand);
  return { exp, levels: r.levelsGained, learned: r.learned };
}
