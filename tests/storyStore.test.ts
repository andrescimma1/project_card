/**
 * Story mode flow: slots → new game → city script → battle (engine session) → results → back to the script.
 */
import { describe, expect, it } from 'vitest';
import { decks } from '../src/engine/cards/decks';
import { createSession } from '../src/game/session';
import { createStoryStore } from '../src/game/storyStore';
import { loadSave } from '../src/game/saveSlots';
import { buildGame } from './engine/build';
import { asm, cmd, str } from './story/mscdAsm';

function memoryStorage() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
}
const script = asm(372, str(4, 'Hi!'), cmd(10, 4), cmd(10, 5), cmd(11, 2, [0, 1]), cmd(13, 1, [0, 27], [0, 0xffff], [0, 0xffff]), cmd(11, 6, [0, 1]));

function setup() {
  const storage = memoryStorage();
  const session = createSession();
  const store = createStoryStore({ loadScript: async () => script, storage, session, seed: 7 });
  return { store, storage, session };
}

describe('story flow', () => {
  it('a new game is saved and starts in Beginner City with its script', async () => {
    const { store, storage } = setup();
    await store.getState().newGame(1, 0);
    const s = store.getState();
    expect(s.view).toBe('city');
    expect(s.request).toEqual({ kind: 'say', lines: ['Hi!'] });
    expect(loadSave(1, storage)?.partners[0].slot.id).toBe(175);
  });

  it('a battle request starts a match against that DECK2 deck with the save deck and partners', async () => {
    const { store, session } = setup();
    await store.getState().newGame(0, 0);
    store.getState().reply({ kind: 'ack' });
    expect(store.getState().view).toBe('battle');
    const g = session.getState().game!;
    expect(g.players[1].cards).toEqual(decks[1].cards);
    expect(g.players[0].cards).toEqual(store.getState().save!.decks[0].cards);
    expect(g.players[0].partners.map((p) => p.id)).toEqual([175]);
  });

  it('the end of the match applies the result, shows it, then the script continues (rewards, save)', async () => {
    const { store, storage } = setup();
    await store.getState().newGame(0, 0);
    store.getState().reply({ kind: 'ack' });
    const { state } = buildGame({ phase: { name: 'gameOver' }, p0: { stack: ['Agumon'], rounds: 3 }, p1: { stack: ['Gabumon'] } });
    state.winner = 0;
    store.getState().finishBattle(state, []);
    expect(store.getState().view).toBe('result');
    expect(store.getState().result?.pack).toHaveLength(3);
    expect(store.getState().save!.winsCom).toBe(1);
    store.getState().closeResult();
    expect(store.getState().request).toMatchObject({ kind: 'reward', cards: [27] });
    store.getState().reply({ kind: 'ack' }); // → CMD11.6(1): the script asks to save
    expect(loadSave(0, storage)?.winsCom).toBe(1);
    expect(store.getState().view).toBe('map'); // end of the script
  });
});
