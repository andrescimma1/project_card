/**
 * The original CPU AI driving whole matches through the engine: every decision must map to a legal
 * action, and matches must finish.
 */
import { describe, expect, it } from 'vitest';
import { chooseAiAction, createAi } from '../../../src/engine/ai';
import { decks, starterDecks } from '../../../src/engine/cards/decks';
import { applyAction, createGame, legalActions } from '../../../src/engine/game/turn';
import type { PlayerId } from '../../../src/engine/game/types';
import { buildGame } from '../build';

const deckNamed = (name: string) => decks.find((d) => d.name === name)!;

describe('original AI in full matches', () => {
  it.each([
    ['Red', 'Green', 11],
    ['Yellow', 'Tricolor Starter', 22],
    ['Green', 'New Power', 33],
  ])('%s vs %s (seed %i): only legal actions, to the end', (a, b, seed) => {
    const da = deckNamed(a);
    const db = deckNamed(b);
    const ais = [createAi(da.ai, seed), createAi(db.ai, seed + 1)];
    let { state } = createGame({ decks: [da.cards, db.cards], seed, firstPlayer: 0 });
    let steps = 0;
    while (state.phase.name !== 'gameOver' && steps < 3000) {
      const actor = ([0, 1] as PlayerId[]).find((w) => legalActions(state, w).length > 0)!;
      const action = chooseAiAction(state, actor, ais[actor]);
      expect(legalActions(state, actor)).toContainEqual(action);
      state = applyAction(state, action).state;
      steps++;
    }
    expect(state.phase.name).toBe('gameOver');
  }, 60_000);

  it('maps each decision to the engine action of its phase', () => {
    const ai = createAi([0, 0, 0, 0], 1);
    const { state, refs } = buildGame({ turn: 1, phase: { name: 'entrance' }, p0: { stack: ['Gabumon'] }, p1: { hand: ['Greymon', 'Agumon'] } });
    expect(chooseAiAction(state, 1, ai)).toEqual({ type: 'enter', player: 1, card: refs[1].Agumon[0] });
  });

  it('a starter deck carries its personality', () => {
    expect(starterDecks.every((d) => d.ai.length === 4)).toBe(true);
  });
});
