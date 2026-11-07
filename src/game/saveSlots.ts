/**
 * Story-mode saves in the browser. Like the game's memory card files BASLUS-01328_A/B/C, there are 3
 * slots; each holds one player save (SaveData). Storage errors never break the game: the save then
 * lives only for the session.
 */
import { cards } from '../engine/cards/db';
import { recordIndex, type DeckRecord } from '../engine/progression/records';
import type { SaveData } from '../engine/progression/save';
import { rankNames } from './titles';

type KV = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export const SAVE_SLOTS = 3;
const key = (slot: number) => `dcb.save.${'ABC'[slot]}`;

function defaultStorage(): KV | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export function loadSave(slot: number, storage: KV | null = defaultStorage()): SaveData | null {
  try {
    const raw = storage?.getItem(key(slot));
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!(data && data.version === 1 && Array.isArray(data.partners) && data.collection)) return null;
    return migrate(data);
  } catch {
    return null;
  }
}

/** Saves written by earlier versions of the remake get the fields added since. */
function migrate(data: Record<string, unknown> & Partial<SaveData>): SaveData {
  data.fusionShop ??= -1;
  data.trades ??= { received: 0, given: 0 };
  data.registration ??= Math.floor(Math.random() * 0x10000);
  data.maxAttack ??= Array.from({ length: 191 }, () => [0, 0, 0]);
  data.saveCount ??= 0;
  data.statsViewed ??= false;
  if (!data.eventRecords) {
    // COM records were kept by DECK2 index: merge them into the shared records and mark the decks as known
    const merged: SaveData['deckRecords'] = {};
    const known: Record<number, DeckRecord> = {};
    for (const [k, r] of Object.entries(data.deckRecords ?? {})) {
      const m = recordIndex(Number(k));
      const t = (merged[m] ??= { wins: 0, losses: 0 });
      t.wins = Math.min(t.wins + r.wins, 999);
      t.losses = Math.min(t.losses + r.losses, 999);
      known[m] = { known: true, base: false, wins: 0, losses: 0 };
    }
    data.deckRecords = merged;
    data.eventRecords = known;
  }
  return data as SaveData;
}

export function writeSave(slot: number, save: SaveData, storage: KV | null = defaultStorage()): void {
  try {
    storage?.setItem(key(slot), JSON.stringify(save));
  } catch {
    // storage unavailable
  }
}

export function deleteSave(slot: number, storage: KV | null = defaultStorage()): void {
  try {
    storage?.removeItem(key(slot));
  } catch {
    // storage unavailable
  }
}

export interface SaveSummary {
  name: string;
  partner: string;
  winsCom: number;
  tamer: string;
  storyPoints: number;
}

export function listSaves(storage: KV | null = defaultStorage()): (SaveSummary | null)[] {
  return Array.from({ length: SAVE_SLOTS }, (_, slot) => {
    const s = loadSave(slot, storage);
    if (!s) return null;
    return { name: s.name, partner: cards[s.partners[0].slot.id].name, winsCom: s.winsCom, tamer: rankNames(s.ranks).tamer, storyPoints: s.story.points };
  });
}
