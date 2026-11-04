/**
 * Cinematic scenes derived from engine events. Pure presentation: the engine state is already final;
 * scenes only replay what happened.
 */
import type { CardRef, GameEvent, PlayerId } from '../engine/game/types';

export type Scene =
  | {
      kind: 'digivolve';
      player: PlayerId;
      card: CardRef;
      from: CardRef | null;
      /** Armor-digivolution on entry: the same instance changed card, so the partner is given by id. */
      fromId?: number;
      armor?: boolean;
    }
  | { kind: 'battle'; events: GameEvent[] };

export function buildScenes(events: GameEvent[]): Scene[] {
  const scenes: Scene[] = [];
  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    if (e.type === 'digivolved') scenes.push({ kind: 'digivolve', player: e.player, card: e.card, from: e.from });
    else if (e.type === 'armorDigivolved') scenes.push({ kind: 'digivolve', player: e.player, card: e.card, from: null, fromId: e.from, armor: true });
    else if (e.type === 'reveal') {
      let j = i + 1;
      while (j < events.length && events[j].type !== 'turnStart') j++;
      scenes.push({ kind: 'battle', events: events.slice(i, j) });
      i = j - 1;
    }
  }
  return scenes;
}
