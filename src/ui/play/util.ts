import { cards } from '../../engine/cards/db';
import type { Card } from '../../engine/cards/types';
import { cardOf } from '../../engine/game/effects';
import { partnerCards } from '../../engine/game/partner';
import type { CardRef, GameState, PlayerId } from '../../engine/game/types';
import { m } from '../../i18n';

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

/** Player labels for the board: "You" / "CPU" against the CPU, the two names in a 2 Player Battle. */
export function seatNames(twoPlayer: boolean, names: [string, string] | null): [string, string] {
  const S = m().board.seats;
  return twoPlayer ? (names ?? [S.player1, S.player2]) : [S.you, S.cpu];
}

/** Names printed on the board's frames: the session names if any, else "Player" / "CPU". */
export function boardNames(twoPlayer: boolean, names: [string, string] | null): [string, string] {
  const S = m().board.seats;
  return names ?? (twoPlayer ? [S.player1, S.player2] : [S.player, S.cpu]);
}
