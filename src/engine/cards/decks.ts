import raw from '../../data/decks.json';
import type { OriginalDeck } from './decodeDecks';

/** The 159 built-in decks of the original game (B.DRV/DECK2.DEK). */
export const decks = raw as OriginalDeck[];

/** Player starter decks (owner "Player"): Red = Veemon, Green = Hawkmon, Yellow = Armadillomon. */
export const starterDecks = ['Red', 'Green', 'Yellow'].map((n) => decks.find((d) => d.owner === 'Player' && d.name === n)!);

/** Decks used by opponent characters (everything not owned by "Player"). */
export const opponentDecks = decks.filter((d) => d.owner !== 'Player');
