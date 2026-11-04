/**
 * Zone helpers reproducing the game's slot arrays (SLUS 0x80040064..0x80041340):
 *  - top(): first occupied slot from index 0      (onlineTop 0x800401D0, offlineTop 0x80040064, battleTop 0x80040764, topDP 0x800411C4)
 *  - pushTop(): last empty slot scanning from the end (toOnline 0x800403F8, toOffline 0x800400B4, addDP 0x8004126C)
 *  - hand: insert in the first empty slot (toHand 0x800404C0)
 * Because draws empty the low indices, "pushTop" puts the card right above the current top.
 */
import type { CardRef, Slot } from './types';

export const ZONE_SIZE = { online: 30, offline: 30, hand: 4, dp: 8, stack: 3 } as const;

export function cardsIn(zone: Slot[]): CardRef[] {
  return zone.filter((x): x is CardRef => x !== null);
}

export function count(zone: Slot[]): number {
  return cardsIn(zone).length;
}

export function free(zone: Slot[]): number {
  return zone.length - count(zone);
}

export function top(zone: Slot[]): CardRef | null {
  return zone.find((x) => x !== null) ?? null;
}

/** Insert into the last empty slot (from the end). Returns false when the zone is full. */
export function pushTop(zone: Slot[], card: CardRef): boolean {
  for (let i = zone.length - 1; i >= 0; i--) {
    if (zone[i] === null) {
      zone[i] = card;
      return true;
    }
  }
  return false;
}

/** Insert into the first empty slot (hand). */
export function pushFirst(zone: Slot[], card: CardRef): boolean {
  const i = zone.indexOf(null);
  if (i < 0) return false;
  zone[i] = card;
  return true;
}

export function remove(zone: Slot[], card: CardRef): boolean {
  const i = zone.indexOf(card);
  if (i < 0) return false;
  zone[i] = null;
  return true;
}

export function popTop(zone: Slot[]): CardRef | null {
  const i = zone.findIndex((x) => x !== null);
  if (i < 0) return null;
  const c = zone[i];
  zone[i] = null;
  return c;
}
