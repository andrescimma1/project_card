/**
 * Cinematic scenes derived from engine events. Pure presentation: the engine state is already final;
 * scenes only replay what happened.
 */
import type { CardRef, GameEvent, GameState, PlayerId } from '../engine/game/types';

export type Scene =
  | {
      kind: 'digivolve';
      player: PlayerId;
      card: CardRef;
      from: CardRef | null;
      /** Armor-digivolution on entry: the same instance changed card, so the partner is given by id. */
      fromId?: number;
      armor?: boolean;
      /** The board to show while it plays: right after the digivolution. */
      state?: GameState;
      /** The board right before it (the stats count up from these values). */
      prev?: GameState;
    }
  | {
      kind: 'battle';
      events: GameEvent[];
      /** The board to show while it plays: as it was before the battle (the final state is already later). */
      state?: GameState;
    };

/** The states around the action that produced the events, so a scene never shows the future. */
export interface SceneContext {
  before: GameState;
  after: GameState;
}

export function buildScenes(events: GameEvent[], ctx?: SceneContext): Scene[] {
  const scenes: Scene[] = [];
  const after = ctx ? { state: ctx.after, prev: ctx.before } : {};
  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    if (e.type === 'digivolved') scenes.push({ kind: 'digivolve', player: e.player, card: e.card, from: e.from, ...after });
    else if (e.type === 'armorDigivolved') scenes.push({ kind: 'digivolve', player: e.player, card: e.card, from: null, fromId: e.from, armor: true, ...after });
    else if (e.type === 'reveal') {
      let j = i + 1;
      while (j < events.length && events[j].type !== 'turnStart') j++;
      scenes.push({ kind: 'battle', events: events.slice(i, j), ...(ctx ? { state: ctx.before } : {}) });
      i = j - 1;
    }
  }
  return scenes;
}
