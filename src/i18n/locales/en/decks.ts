/** Texts of the decks screens in English. Same keys as the Spanish file (the compiler checks it). */
import type { decks as es } from '../es/decks';

export const decks: typeof es = {
  list: {
    title: 'Your decks',
    intro: (creature: string) =>
      `Build decks with the original rules: 30 cards, up to 4 copies of each and at least one ${creature}. There is no progression yet, so all 301 cards are available. Decks are saved in this browser.`,
    newDeckName: 'New deck',
    createEmpty: 'Create empty deck',
    startFrom: 'Or start from an original deck',
    copy: 'Copy',
    copyName: (name: string) => `${name} (copy)`,
    empty: "You haven't saved any decks yet.",
    summary: (total: number, size: number, creatures: number, one: string, many: string) =>
      `${total}/${size} cards, ${creatures} ${creatures === 1 ? one : many}.`,
    ready: 'Ready to play.',
    incomplete: 'Incomplete.',
    edit: 'Edit',
    delete: 'Delete',
    confirmDelete: (name: string) => `Delete the deck "${name}"?`,
  },
  builder: {
    save: 'Save deck',
    saved: 'Saved',
    confirmLeave: 'You have unsaved changes. Leave anyway?',
    back: 'Back to my decks',
  },
  editor: {
    available: 'Available cards',
    search: 'Search',
    searchPlaceholder: 'Card name',
    all: 'All',
    noMatch: 'No card matches the filters.',
    addCard: (name: string, inDeck: number, owned?: number) =>
      `Add ${name} (${inDeck} in the deck${owned !== undefined ? `, you own ${owned}` : ''})`,
    details: (name: string) => `View ${name} details`,
    yourDeck: 'Your deck',
    deckName: 'Deck name',
    cards: 'Cards',
    composition: (c: { creatures: number; creatureWord: string; levels: string; support: number; supportWord: string; evolution: number; evolutionWord: string }) =>
      `${c.creatures} ${c.creatureWord} (${c.levels}), ${c.support} ${c.supportWord}, ${c.evolution} ${c.evolutionWord}.`,
    factionSplit: (faction: string) => `Breakdown by ${faction.toLowerCase()}`,
    removeCopy: (name: string) => `Remove a copy of ${name}`,
    addCopy: (name: string) => `Add a copy of ${name}`,
  },
};
