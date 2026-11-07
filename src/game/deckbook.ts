/**
 * Deck builder logic. Rules are the original ones (validateDeck: 30 cards, at most 4 copies,
 * Digimon required). Decks are kept in the browser's localStorage (per-viewer convenience).
 */
import { cards } from '../engine/cards/db';
import type { Level, Specialty } from '../engine/cards/types';
import { validateDeck } from '../engine/game/turn';
import { m } from '../i18n';
import { localizeMessage } from '../i18n/engineMessages';

export const DECK_SIZE = 30;
export const MAX_COPIES = 4;
const STORAGE_KEY = 'dcb.decks.v1';

export interface SavedDeck {
  id: string;
  name: string;
  cards: number[];
}

export function newDeck(name: string, ids: number[] = []): SavedDeck {
  return { id: `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, name, cards: [...ids] };
}

export function copiesOf(deck: SavedDeck, id: number): number {
  return deck.cards.filter((x) => x === id).length;
}

export function addCard(deck: SavedDeck, id: number): { deck: SavedDeck; error: string | null } {
  if (deck.cards.length >= DECK_SIZE) return { deck, error: m().game.deck.full(DECK_SIZE) };
  if (copiesOf(deck, id) >= MAX_COPIES) return { deck, error: m().game.deck.maxCopies(MAX_COPIES, cards[id].name) };
  return { deck: { ...deck, cards: [...deck.cards, id].sort((a, b) => a - b) }, error: null };
}

export function removeCard(deck: SavedDeck, id: number): SavedDeck {
  const i = deck.cards.indexOf(id);
  if (i < 0) return deck;
  return { ...deck, cards: deck.cards.filter((_, k) => k !== i) };
}

export function deckStats(deck: SavedDeck) {
  const cs = deck.cards.map((id) => cards[id]);
  const levels: Record<Level, number> = { R: 0, C: 0, U: 0, A: 0 };
  const specialties: Record<Specialty, number> = { fire: 0, ice: 0, nature: 0, darkness: 0, rare: 0 };
  for (const c of cs) {
    if (c.kind !== 'digimon') continue;
    levels[c.level]++;
    specialties[c.specialty]++;
  }
  return {
    total: cs.length,
    digimon: cs.filter((c) => c.kind === 'digimon').length,
    option: cs.filter((c) => c.kind === 'option').length,
    digivolve: cs.filter((c) => c.kind === 'digivolve').length,
    levels,
    specialties,
    // the rules' messages, shown in the current language
    errors: validateDeck(deck.cards).map((e) => localizeMessage(e)),
  };
}

type KV = Pick<Storage, 'getItem' | 'setItem'>;

function defaultStorage(): KV | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export function loadDecks(storage: KV | null = defaultStorage()): SavedDeck[] {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.filter((d) => d && typeof d.name === 'string' && Array.isArray(d.cards)) : [];
  } catch {
    return [];
  }
}

export function saveDecks(decks: SavedDeck[], storage: KV | null = defaultStorage()): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(decks));
  } catch {
    // storage unavailable (private mode, blocked): decks live only for this session
  }
}
