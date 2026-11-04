/**
 * Trade between two saves (OPENSEG; docs/research/progresion/03-companero-fusion-intercambio.md §5).
 *   0x801EB2E8  both saves need trade enabled (+0x28 bit 10) and different registration numbers (+0x10)
 *   0x801E2068  tradable = copies − copies in decks, only copies whose serial the receiver lacks, receiver ≤ 6
 *   0x801E3214  a card must be identified (0x40) and have Composite ≠ 0; 3 slots per player
 *   0x801E2B34  one-sided gifts are allowed, an empty trade is not
 *   0x801E1C8C / 0x801E1AA4  the copy changes hands with its serial number (picked by 0x801E195C); the receiver
 *                            marks it 0x08 "Received by Trading."; +0x4E given / +0x4C received (up to 9999);
 *                            both recompute the ranks (0x8002CC44)
 */
import { cards } from '../cards/db';
import { copiesOf, FLAG, MAX_OWNED } from './collection';
import { freeCopies } from './fusion';
import { updateRanks } from './ranks';
import type { SaveData } from './save';

const SLOTS = 3;
const COUNTER_CAP = 9999;

/** Why these two saves cannot trade, or null. */
export function tradeBlocked(a: SaveData, b: SaveData): string | null {
  if (a.registration === b.registration) return 'No se puede intercambiar con la misma partida.';
  if (!a.tradeEnabled && !b.tradeEnabled) return 'El intercambio está desactivado.';
  if (!a.tradeEnabled) return 'El jugador 1 todavía no puede intercambiar.';
  if (!b.tradeEnabled) return 'El jugador 2 todavía no puede intercambiar.';
  return null;
}

/** Serial slots of `from`'s copies of `id` that `to` does not already have. */
function newSerialSlots(from: SaveData, to: SaveData, id: number): number[] {
  const theirs = to.collection.serials[id].slice(0, copiesOf(to.collection, id));
  const slots: number[] = [];
  for (let s = 0; s < copiesOf(from.collection, id); s++) if (!theirs.includes(from.collection.serials[id][s])) slots.push(s);
  return slots;
}

/** Copies of `id` that `from` can give `to` (0x801E2068). */
export function tradable(from: SaveData, to: SaveData, id: number): number {
  const n = Math.min(freeCopies(from, id), newSerialSlots(from, to, id).length, MAX_OWNED - copiesOf(to.collection, id));
  return Math.max(0, n);
}

/** Why `from` cannot add `id` to its offer (`offered` = cards already chosen), or null (0x801E3214). */
export function canOffer(from: SaveData, to: SaveData, id: number, offered: number[]): string | null {
  if (!(from.collection.flags[id] & FLAG.obtained)) return 'Esta carta no está identificada.';
  if (cards[id].fusion.composite === 0) return 'Esta carta no se puede intercambiar.';
  if (offered.length >= SLOTS) return `Solo puedes ofrecer ${SLOTS} cartas.`;
  if (tradable(from, to, id) - offered.filter((x) => x === id).length <= 0) return 'No puedes transferir más copias de esta carta.';
  return null;
}

const serialsOf = (s: SaveData, id: number) => s.collection.serials[id].slice(0, copiesOf(s.collection, id));
const recomputeRanks = (s: SaveData) => (s.ranks = updateRanks(s.ranks, s)); // 0x8002CC44

/**
 * 0x801E195C: the serial to give. The game returns the first of the giver's copies whose serial differs from
 * any one of the receiver's (so it can be one the receiver already owns), or the first copy.
 */
function pickSerial(from: SaveData, to: SaveData, id: number): number {
  const theirs = serialsOf(to, id);
  for (const s of serialsOf(from, id)) for (const t of theirs) if (s !== t) return s;
  return from.collection.serials[id][0];
}

/** 0x801E1C8C: remove the copy with that serial (the next ones move up). */
function give(from: SaveData, id: number, serial: number): void {
  const list = from.collection.serials[id];
  const at = serialsOf(from, id).indexOf(serial);
  if (at >= 0) {
    list.splice(at, 1);
    list.push(0);
  }
  from.collection.flags[id] -= 1;
  recomputeRanks(from);
  from.trades = { ...from.trades, given: Math.min(from.trades.given + 1, COUNTER_CAP) };
}

/** 0x801E1AA4: add the copy with its serial; a never-seen card is "new"; 0xC8 = received by trading. */
function receive(to: SaveData, id: number, serial: number): void {
  const c = to.collection;
  c.serials[id][copiesOf(c, id)] = serial;
  if (c.flags[id] === 0) c.flags[id] |= FLAG.isNew;
  c.flags[id] += 1;
  if (copiesOf(c, id) === MAX_OWNED || cards[id].fusion.result === 0) c.flags[id] |= FLAG.complete;
  c.flags[id] |= FLAG.justReceived | FLAG.obtained | FLAG.traded;
  recomputeRanks(to);
  to.trades = { ...to.trades, received: Math.min(to.trades.received + 1, COUNTER_CAP) };
}

function transfer(from: SaveData, to: SaveData, id: number): void {
  const serial = pickSerial(from, to, id);
  give(from, id, serial);
  receive(to, id, serial);
}

/** Trade: `a` gives `giveA`, `b` gives `giveB`. Error message, or null when done. */
export function trade(a: SaveData, b: SaveData, giveA: number[], giveB: number[]): string | null {
  if (!giveA.length && !giveB.length) return 'No se puede intercambiar 0 cartas.';
  const why =
    tradeBlocked(a, b) ??
    giveA.map((id, i) => canOffer(a, b, id, giveA.slice(0, i))).find(Boolean) ??
    giveB.map((id, i) => canOffer(b, a, id, giveB.slice(0, i))).find(Boolean) ??
    null;
  if (why) return why;
  a.traded = b.traded = true; // OPENSEG 0x801E48CC: +0x28 bit 11 on both, before any card moves
  for (const id of giveA) transfer(a, b, id);
  for (const id of giveB) transfer(b, a, id);
  return null;
}
