import { cards } from '../../engine/cards/db';
import type { Card } from '../../engine/cards/types';
import { cardOf } from '../../engine/game/effects';
import { partnerCards } from '../../engine/game/partner';
import type { CardRef, GameState, PlayerId } from '../../engine/game/types';

/** The card an instance uses (partner instances use their slot copy). */
export function cardAt(game: GameState, player: PlayerId, ref: CardRef): Card {
  return cardOf(game.players[player], ref);
}

/** The partner copy of a card id for that player, or the ROM card. */
export function partnerCardOf(game: GameState, player: PlayerId, id: number): Card {
  const slot = game.players[player].partners.find((s) => s.id === id);
  return slot ? partnerCards(slot).card : cards[id];
}

export function activeRef(game: GameState, player: PlayerId): CardRef | null {
  return game.players[player].stack.find((x) => x !== null) ?? null;
}
