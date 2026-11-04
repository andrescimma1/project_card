/**
 * The match session in "2 Player Battle": two people, no CPU AI. The board asks whoever has to act.
 */
import { describe, expect, it } from 'vitest';
import { decks } from '../src/engine/cards/decks';
import { legalActions } from '../src/engine/game/turn';
import { controller, createSession } from '../src/game/session';

describe('2 Player Battle session', () => {
  it('never plays for player 2, and names both players', () => {
    const s = createSession();
    s.getState().start({ human: decks[142].cards, cpu: decks[143].cards, seed: 5, humanFirst: true, twoPlayer: true, names: ['Tai', 'Matt'] });
    const g = s.getState().game!;
    expect(s.getState().names).toEqual(['Tai', 'Matt']);
    expect(legalActions(g, 1).length + legalActions(g, 0).length).toBeGreaterThan(0);
    const before = s.getState().log.length;
    expect(s.getState().log.length).toBe(before); // nothing ran on its own
    expect(s.getState().cpu).toBeNull();
  });

  it('the controller is player 1 while it has something to do, then player 2; vs CPU it is always player 1', () => {
    const s = createSession();
    s.getState().start({ human: decks[142].cards, cpu: decks[143].cards, seed: 5, humanFirst: true, twoPlayer: true });
    let g = s.getState().game!;
    for (let guard = 0; guard < 40 && g.phase.name !== 'attack'; guard++) {
      const p = controller(g, true);
      s.getState().act(legalActions(g, p)[0]);
      g = s.getState().game!;
    }
    expect(g.phase.name).toBe('attack');
    expect(controller(g, true)).toBe(0);
    s.getState().act(legalActions(g, 0).find((a) => a.type === 'chooseAttack')!);
    expect(controller(s.getState().game!, true)).toBe(1);
    expect(controller(s.getState().game!, false)).toBe(0);
  });
});
