/**
 * Rules engine public API (React-free, deterministic, serialisable state).
 *
 *   const { state } = createGame({ decks: [deckA, deckB], seed, firstPlayer: 0 });
 *   legalActions(state, player)      -> Action[]
 *   applyAction(state, action)       -> { state, events }   (throws IllegalActionError)
 */
export { applyAction, beginTurn, canDigivolve, createGame, legalActions, validateDeck } from './game/turn';
export { resolveBattle } from './game/battle';
export { playerDp } from './game/digivolve';
export * from './game/types';
export { cards, byId, cardDb } from './cards/db';
