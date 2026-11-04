import { create } from 'zustand';
import { loadDecks, newDeck, saveDecks, type SavedDeck } from './deckbook';

interface DeckStore {
  decks: SavedDeck[];
  /** Deck being edited (a copy; saved explicitly). */
  draft: SavedDeck | null;
  dirty: boolean;
  edit: (deck: SavedDeck) => void;
  create: (name: string, cards?: number[]) => void;
  setDraft: (deck: SavedDeck) => void;
  save: () => void;
  remove: (id: string) => void;
  close: () => void;
}

export const useDecks = create<DeckStore>((set, get) => ({
  decks: loadDecks(),
  draft: null,
  dirty: false,
  edit: (deck) => set({ draft: { ...deck, cards: [...deck.cards] }, dirty: false }),
  create: (name, cards = []) => set({ draft: newDeck(name, cards), dirty: true }),
  setDraft: (draft) => set({ draft, dirty: true }),
  save: () => {
    const d = get().draft;
    if (!d) return;
    const decks = get().decks.some((x) => x.id === d.id) ? get().decks.map((x) => (x.id === d.id ? d : x)) : [...get().decks, d];
    saveDecks(decks);
    set({ decks, dirty: false });
  },
  remove: (id) => {
    const decks = get().decks.filter((x) => x.id !== id);
    saveDecks(decks);
    set({ decks, draft: get().draft?.id === id ? null : get().draft, dirty: false });
  },
  close: () => set({ draft: null, dirty: false }),
}));
