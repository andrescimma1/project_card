/**
 * Match session (human vs the original CPU AI) — framework-free Zustand store used by the UI.
 */
import { describe, expect, it } from 'vitest';
import { starterDecks } from '../../src/engine/cards/decks';
import { createSession } from '../../src/game/session';
import { legalActions } from '../../src/engine/game/turn';

describe('match session', () => {
  it('starts a match and lets the CPU play until the human has something to do', () => {
    const s = createSession();
    s.getState().start({ human: starterDecks[0].cards, cpu: starterDecks[1].cards, seed: 5, humanFirst: false });
    const { game } = s.getState();
    expect(game).not.toBeNull();
    expect(legalActions(game!, 0).length).toBeGreaterThan(0);
    expect(legalActions(game!, 1)).toEqual([]);
    expect(s.getState().log.length).toBeGreaterThan(0);
  });

  it('a whole match can be played by always taking the first legal human action', () => {
    const s = createSession();
    s.getState().start({ human: starterDecks[0].cards, cpu: starterDecks[2].cards, seed: 9, humanFirst: true });
    let guard = 0;
    while (s.getState().game!.phase.name !== 'gameOver' && guard++ < 3000) {
      const options = legalActions(s.getState().game!, 0);
      s.getState().act(options[options.length - 1]);
    }
    expect(s.getState().game!.phase.name).toBe('gameOver');
  });

  it('queues a battle scene after a battle and lets the UI consume it', () => {
    const s = createSession();
    s.getState().start({ human: starterDecks[0].cards, cpu: starterDecks[1].cards, seed: 21, humanFirst: true });
    let guard = 0;
    while (!s.getState().scenes.some((x) => x.kind === 'battle') && guard++ < 200) {
      const options = legalActions(s.getState().game!, 0);
      s.getState().act(options[options.length - 1]);
    }
    const before = s.getState().scenes.length;
    expect(before).toBeGreaterThan(0);
    s.getState().popScene();
    expect(s.getState().scenes.length).toBe(before - 1);
  });

  it('the CPU plays with the original AI and the personality of its deck', () => {
    const s = createSession();
    s.getState().start({ human: starterDecks[0].cards, cpu: starterDecks[1].cards, cpuAi: [2, 2, 2, 2], seed: 5, humanFirst: false });
    expect(s.getState().cpu?.profile).toEqual([2, 2, 2, 2]);
    expect(createSession().getState().cpu).toBeNull();
  });

  it('rejects an illegal action without changing the game', () => {
    const s = createSession();
    s.getState().start({ human: starterDecks[0].cards, cpu: starterDecks[1].cards, seed: 3, humanFirst: true });
    const before = s.getState().game;
    s.getState().act({ type: 'skipDp', player: 1 });
    expect(s.getState().game).toBe(before);
    expect(s.getState().error).not.toBeNull();
  });
});
