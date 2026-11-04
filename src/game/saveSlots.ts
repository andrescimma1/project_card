/**
 * Story-mode saves in the browser. Like the game's memory card files BASLUS-01328_A/B/C, there are 3
 * slots; each holds one player save (SaveData). Storage errors never break the game: the save then
 * lives only for the session.
 */
import { cards } from '../engine/cards/db';
import { rankTitles } from '../engine/progression/ranks';
import type { SaveData } from '../engine/progression/save';

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
    return data && data.version === 1 && Array.isArray(data.partners) && data.collection ? (data as SaveData) : null;
  } catch {
    return null;
  }
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
    return { name: s.name, partner: cards[s.partners[0].slot.id].name, winsCom: s.winsCom, tamer: rankTitles(s.ranks).tamer, storyPoints: s.story.points };
  });
}
