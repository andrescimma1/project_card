/**
 * The card collection of a save (docs/research/progresion/02-resultados-y-guardado.md §3.4).
 * One byte per card id (save+0x14B2): bits 0-2 copies (max 6), 0x08 received by trading (OPENSEG 0x801E1C30,
 * shown by ENDSEG 0x801DFD5C), 0x10 complete, 0x20 new, 0x40 obtained
 * at least once, 0x80 just received. Each copy slot has a serial number (save+0x15E0[id][6]).
 */
import { cards } from '../cards/db';

export const MAX_OWNED = 6;
export const FLAG = { traded: 0x08, complete: 0x10, isNew: 0x20, obtained: 0x40, justReceived: 0x80 } as const;

export interface Collection {
  flags: number[];
  serials: number[][];
}

export function newCollection(): Collection {
  return { flags: Array(cards.length).fill(0), serials: Array.from({ length: cards.length }, () => Array(MAX_OWNED).fill(0)) };
}

export const copiesOf = (c: Collection, id: number) => c.flags[id] & 7;
const notCollectible = (id: number) => id >= 172 && id <= 190; // partners and Armor

/** 0x80045968: a rand() serial that no lower copy slot of this card already has. */
function assignSerial(c: Collection, id: number, slot: number, rand: { next(): number }): void {
  let s = rand.next();
  // the game retries until the serial is new; the cap only guards against a degenerate generator
  for (let tries = 0; c.serials[id].slice(0, slot).includes(s) && tries < 1000; tries++) s = rand.next();
  c.serials[id][slot] = s;
}

/**
 * 0x80045B18: add n copies. Returns the copies now owned, −1 when capped at 6, −2 when already full
 * ("FULL SET!"), −3 for partners and Armor. (The game then recomputes the ranks, 0x8002CC44.)
 */
export function addCard(c: Collection, id: number, n: number, rand: { next(): number }): number {
  if (notCollectible(id)) return -3;
  for (let s = copiesOf(c, id); s < MAX_OWNED; s++) assignSerial(c, id, s, rand);
  if (copiesOf(c, id) === MAX_OWNED) {
    c.flags[id] |= FLAG.complete | FLAG.obtained;
    return -2;
  }
  if (copiesOf(c, id) === 0 && !(c.flags[id] & FLAG.obtained)) c.flags[id] |= FLAG.isNew;
  if (copiesOf(c, id) + n > MAX_OWNED) {
    c.flags[id] = (c.flags[id] & 0xf8) | MAX_OWNED | FLAG.complete | FLAG.obtained;
    return -1;
  }
  c.flags[id] += n;
  if (copiesOf(c, id) === MAX_OWNED || cards[id].fusion.result === 0) c.flags[id] |= FLAG.complete;
  c.flags[id] |= FLAG.obtained | FLAG.justReceived;
  return copiesOf(c, id);
}

/** 0x80045E1C: remove n copies. Returns the copies left, −1 when it had fewer, −2 when none, −3 partners/Armor. */
export function removeCard(c: Collection, id: number, n: number): number {
  if (notCollectible(id)) return -3;
  if (copiesOf(c, id) === 0) return -2;
  if (copiesOf(c, id) - n < 0) {
    c.flags[id] &= 0xf8;
    return -1;
  }
  c.flags[id] -= n;
  return copiesOf(c, id);
}

/** 0x80045A58: clear "just received" on every card. */
export function clearJustReceived(c: Collection): void {
  for (let id = 0; id < c.flags.length; id++) c.flags[id] &= 0x7f;
}

/** Clear "new" on every card (the routine right after 0x80045A58). */
export function clearNew(c: Collection): void {
  for (let id = 0; id < c.flags.length; id++) c.flags[id] &= 0xdf;
}
