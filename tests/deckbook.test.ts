/**
 * Deck builder logic: original deck rules (30 cards, at most 4 copies, needs Digimon) and local storage.
 */
import { describe, expect, it } from 'vitest';
import { addCard, deckStats, loadDecks, newDeck, removeCard, saveDecks, type SavedDeck } from '../src/game/deckbook';
import { cardId } from './engine/build';

const agumon = cardId('Agumon');
const chip = cardId('Attack Chip');

function memoryStorage() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
}

describe('deck editing', () => {
  it('adds up to 4 copies of a card', () => {
    let d = newDeck('Prueba');
    for (let i = 0; i < 4; i++) d = addCard(d, agumon).deck;
    const fifth = addCard(d, agumon);
    expect(fifth.error).toMatch(/4 copias/);
    expect(fifth.deck.cards.filter((x) => x === agumon)).toHaveLength(4);
  });

  it('never goes above 30 cards', () => {
    let d = newDeck('Lleno');
    const ids = [...Array(8).keys()].map((i) => i + 27); // 8 different cards
    for (const id of ids) for (let i = 0; i < 4; i++) d = addCard(d, id).deck;
    expect(d.cards).toHaveLength(30);
    expect(addCard(d, chip).error).toMatch(/30/);
  });

  it('removes one copy at a time', () => {
    const d = addCard(addCard(newDeck('x'), agumon).deck, agumon).deck;
    expect(removeCard(d, agumon).cards).toEqual([agumon]);
  });

  it('reports counts and validation errors', () => {
    const d = addCard(addCard(newDeck('x'), agumon).deck, chip).deck;
    const s = deckStats(d);
    expect(s).toMatchObject({ total: 2, digimon: 1, option: 1, digivolve: 0 });
    expect(s.levels.R).toBe(1);
    expect(s.errors.length).toBeGreaterThan(0);
  });
});

describe('local storage', () => {
  it('saves and loads decks', () => {
    const st = memoryStorage();
    const decks: SavedDeck[] = [addCard(newDeck('Mío'), agumon).deck];
    saveDecks(decks, st);
    expect(loadDecks(st)).toEqual(decks);
  });

  it('returns an empty list when storage is missing or corrupt', () => {
    const st = memoryStorage();
    st.setItem('dcb.decks.v1', '{not json');
    expect(loadDecks(st)).toEqual([]);
    expect(loadDecks(null)).toEqual([]);
  });
});
