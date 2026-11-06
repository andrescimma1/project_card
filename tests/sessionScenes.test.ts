/**
 * The board never shows the future: every cinematic carries the board it plays over.
 */
import { describe, expect, it } from 'vitest';
import { decks } from '../src/engine/cards/decks';
import { legalActions } from '../src/engine/game/turn';
import type { GameEvent } from '../src/engine/game/types';
import { createSession } from '../src/game/session';

describe('session scenes', () => {
  it('a battle scene carries the board before the battle (support phase, HP of the reveal)', () => {
    const s = createSession();
    s.getState().start({ human: decks[142].cards, cpu: decks[143].cards, seed: 5, humanFirst: true });
    for (let guard = 0; guard < 300 && !s.getState().scenes.some((k) => k.kind === 'battle'); guard++) {
      const acts = legalActions(s.getState().game!, 0);
      if (!acts.length) break;
      s.getState().act(acts[0]);
    }
    const scene = s.getState().scenes.find((k) => k.kind === 'battle');
    expect(scene).toBeDefined();
    if (scene?.kind !== 'battle') return;
    const reveal = scene.events[0] as Extract<GameEvent, { type: 'reveal' }>;
    expect(reveal.type).toBe('reveal');
    expect(scene.state?.phase.name).toBe('support');
    expect(scene.state?.players.map((p) => p.hp)).toEqual(reveal.hp);
  });

  it('keeps the deck names of both players for the board', () => {
    const s = createSession();
    s.getState().start({ human: decks[142].cards, cpu: decks[143].cards, seed: 5, humanFirst: true, deckNames: ['Red Deck', 'Betamon Deck'], names: ['Tai', 'Betamon'] });
    expect(s.getState().deckNames).toEqual(['Red Deck', 'Betamon Deck']);
    expect(s.getState().names).toEqual(['Tai', 'Betamon']);
    s.getState().reset();
    expect(s.getState().deckNames).toBeNull();
  });
});
