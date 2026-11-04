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

describe('story screens edit the save the script uses', () => {
  it('after a battle the city host and the store share one save (top-level fields are not lost)', async () => {
    const { store } = setup();
    await store.getState().newGame(0, 0);
    store.getState().reply({ kind: 'ack' });
    const { state } = buildGame({ phase: { name: 'gameOver' }, p0: { stack: ['Agumon'], rounds: 3 }, p1: { stack: ['Gabumon'] } });
    state.winner = 0;
    store.getState().finishBattle(state, []);
    expect(store.getState().host!.save).toBe(store.getState().save);
  });

  it('a deck is saved only with cards the collection allows; the active deck must keep 30 cards', async () => {
    const { store } = setup();
    await store.getState().newGame(0, 0);
    const own = store.getState().save!.decks[0].cards;
    expect(store.getState().saveDeck(1, 'Otro', [172])).toMatch(/Armor/);
    expect(store.getState().saveDeck(1, 'Otro', [27, 27, 27, 27, 27])).toMatch(/copias|tienes/);
    expect(store.getState().saveDeck(0, 'Rojo', own.slice(0, 10))).toMatch(/activo/);
    expect(store.getState().saveDeck(1, 'Otro', own.slice(0, 10))).toBeNull();
    expect(store.getState().save!.decks[1]).toMatchObject({ name: 'Otro', cards: own.slice(0, 10) });
    expect(store.getState().host!.save.decks[1].cards).toHaveLength(10);
  });

  it('choosing the active deck needs 30 cards', async () => {
    const { store } = setup();
    await store.getState().newGame(0, 0);
    expect(store.getState().selectDeck(1)).toMatch(/30/);
    expect(store.getState().selectDeck(0)).toBeNull();
  });

  it('partner equipment goes through the save rules', async () => {
    const { store } = setup();
    await store.getState().newGame(0, 0);
    const part = store.getState().save!.ownedParts.indexOf(true);
    expect(store.getState().partnerAction({ kind: 'equip', partner: 0, part })).toBeNull();
    expect(store.getState().save!.partners[0].slot.parts).toEqual([part]);
    store.getState().partnerAction({ kind: 'unequip', partner: 0, part });
    expect(store.getState().save!.partners[0].slot.parts).toEqual([]);
    expect(store.getState().partnerAction({ kind: 'egg', partner: 0, egg: 0 })).toMatch(/Digi-Egg/);
  });
});

describe('Fusion Shop (CMD11.4)', () => {
  const shopScript = asm(372, cmd(11, 4, [0, 1]), cmd(10, 5));
  async function inShop() {
    const storage = memoryStorage();
    const store = createStoryStore({ loadScript: async () => shopScript, storage, session: createSession(), seed: 3 });
    await store.getState().newGame(0, 0);
    return store;
  }

  it('the script opens shop No.2: fusion up to level C', async () => {
    const store = await inShop();
    expect(store.getState().request).toEqual({ kind: 'screen', screen: 'fusion', arg: 1 });
    expect(store.getState().shopLevel).toBe(2);
    expect(store.getState().save!.fusionShop).toBe(1);
  });

  it('fusing changes the collection the script and the save see', async () => {
    const store = await inShop();
    const save = store.getState().save!;
    const { addCard, copiesOf } = await import('../src/engine/progression/collection');
    addCard(save.collection, 115, 1, { next: () => 1 });
    addCard(save.collection, 40, 1, { next: () => 2 });
    expect(store.getState().fuse(115, 40)).toMatchObject({ error: expect.stringMatching(/nivel/) }); // Ultimate at No.2
    addCard(save.collection, 14, 2, { next: () => 3 });
    const r = store.getState().fuse(14, 14); // two free copies of Greymon (C)
    expect(r).not.toHaveProperty('error');
    expect(copiesOf(store.getState().save!.collection, 14)).toBe(copiesOf(save.collection, 14));
    expect(store.getState().host!.save).toBe(store.getState().save);
    expect(store.getState().save!.fusion.fused).toBe(1);
  });

  it('Partner Fusion feeds a partner', async () => {
    const store = await inShop();
    const { addCard } = await import('../src/engine/progression/collection');
    addCard(store.getState().save!.collection, 14, 1, { next: () => 1 });
    expect(store.getState().partnerFuse(0, 14)).toMatchObject({ exp: 12 });
    expect(store.getState().save!.partners[0].slot.level).toBe(2);
  });
});

describe('Trade between two save slots', () => {
  it('needs two saves with trading unlocked, then writes both', async () => {
    const { store, storage } = setup();
    await store.getState().newGame(0, 0);
    await store.getState().newGame(1, 1);
    store.getState().toSlots();
    store.getState().openTrade();
    expect(store.getState().view).toBe('trade');
    expect(store.getState().pickTrade(0, 1)).toMatch(/desactivado/);
    for (const k of [0, 1]) {
      const s = loadSave(k, storage)!;
      s.tradeEnabled = true;
      storage.setItem(`dcb.save.${'AB'[k]}`, JSON.stringify(s));
    }
    expect(store.getState().pickTrade(0, 1)).toBeNull();
    const [a] = store.getState().trade!.saves;
    const give = a.decks[0].cards.find((id) => a.decks[0].cards.filter((x) => x === id).length === 1 && id !== 175)!;
    // a card used once in the only deck is protected: no free copy
    expect(store.getState().doTrade([give], [])).toMatch(/más copias/);
  });
});

describe('what the story keeps for the Complete Stats', () => {
  it('saving from the script or the map counts as a save (+0x0D); creating the game does not', async () => {
    const { store, storage } = setup();
    await store.getState().newGame(0, 0);
    expect(loadSave(0, storage)?.saveCount).toBe(0);
    store.getState().saveNow();
    expect(loadSave(0, storage)?.saveCount).toBe(1);
  });

  it('the tutorial battle keeps no record but makes decks 0 and 158 known', async () => {
    const storage = memoryStorage();
    const session = createSession();
    const store = createStoryStore({ loadScript: async () => asm(372, cmd(11, 2, [0, 0]), cmd(10, 5)), storage, session, seed: 1 });
    await store.getState().newGame(0, 0);
    const { state } = buildGame({ phase: { name: 'gameOver' }, p0: { stack: ['Agumon'], rounds: 3 }, p1: { stack: ['Gabumon'] } });
    state.winner = 0;
    store.getState().finishBattle(state, []);
    const s = store.getState().save!;
    expect([s.winsCom, s.eventRecords[0]?.known, s.eventRecords[158]?.known]).toEqual([0, true, true]);
  });
});

describe('name, Complete Stats and the ending', () => {
  it('a new game takes the player name (12 letters at most, not empty)', async () => {
    const { store } = setup();
    expect(await store.getState().newGame(0, 0, '   ')).toMatch(/nombre/);
    expect(await store.getState().newGame(0, 0, 'Tai*Kamiya Yagami')).toBeNull();
    expect(store.getState().save!.name).toBe('TaiKamiya Ya');
  });

  it('CMD11.19(k ≠ 0) shows the Complete Stats; leaving marks them seen (+0x28 bit 12) and the script goes on', async () => {
    const storage = memoryStorage();
    const store = createStoryStore({ loadScript: async () => asm(372, cmd(11, 19, [0, 1]), str(4, 'After'), cmd(10, 4), cmd(10, 5)), storage, session: createSession(), seed: 1 });
    await store.getState().newGame(0, 0);
    expect(store.getState().request).toEqual({ kind: 'screen', screen: 'ending', arg: 1 });
    store.getState().closeStats();
    expect(store.getState().save!.statsViewed).toBe(true);
    expect(store.getState().request).toEqual({ kind: 'say', lines: ['After'] });
  });

  it('Auto Deck and Base Decks fill a draft from the collection', async () => {
    const { store } = setup();
    await store.getState().newGame(0, 0);
    const d = store.getState().autoDeck({ specialty: 0, defensive: false, few: false });
    expect(d.length).toBeGreaterThan(20);
    expect(store.getState().saveDeck(1, 'Auto', d)).toBeNull();
    expect(store.getState().baseDecks().map((b) => b.index)).toEqual([]); // the Red deck has Veemon in it
  });
});

describe('2 Player Battle between two saves', () => {
  it('each player uses the active deck and partners of their save; the result is written to both', async () => {
    const { store, storage, session } = setup();
    await store.getState().newGame(0, 0, 'Tai');
    await store.getState().newGame(1, 1, 'Matt');
    store.getState().toSlots();
    expect(store.getState().startDuel(0, 0)).toMatch(/distintas/);
    expect(store.getState().startDuel(0, 1)).toBeNull();
    const s = session.getState();
    expect([s.twoPlayer, s.names, store.getState().view]).toEqual([true, ['Tai', 'Matt'], 'duel']);
    expect(s.game!.players[1].partners.map((p) => p.id)).toEqual([182]);
    const { state } = buildGame({ phase: { name: 'gameOver' }, p0: { stack: ['Agumon'], rounds: 3 }, p1: { stack: ['Gabumon'] } });
    state.winner = 1;
    store.getState().finishDuel(state, []);
    expect([loadSave(0, storage)?.losses2p, loadSave(1, storage)?.wins2p]).toEqual([1, 1]);
    expect(store.getState().duel?.winner).toBe(1);
    store.getState().closeDuel();
    expect([store.getState().view, session.getState().game]).toEqual(['slots', null]);
  });
});
