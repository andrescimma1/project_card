/**
 * Story-mode saves in the browser: 3 slots like the game's memory card files BASLUS-01328_A/B/C.
 */
import { describe, expect, it } from 'vitest';
import { newGame } from '../src/engine/progression/save';
import { deleteSave, listSaves, loadSave, writeSave } from '../src/game/saveSlots';

function memoryStorage() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  };
}
const counter = () => {
  let i = 0;
  return { next: () => i++ };
};

describe('save slots', () => {
  it('writes and reads back a save in one of 3 slots', () => {
    const st = memoryStorage();
    const s = newGame(1, counter());
    writeSave(2, s, st);
    expect(loadSave(2, st)).toEqual(s);
    expect(loadSave(0, st)).toBeNull();
  });

  it('lists the slots with a short summary', () => {
    const st = memoryStorage();
    writeSave(0, newGame(0, counter()), st);
    const list = listSaves(st);
    expect(list).toHaveLength(3);
    expect(list[0]).toMatchObject({ partner: 'Veemon', winsCom: 0, tamer: 'Beginner Tamer' });
    expect(list[1]).toBeNull();
  });

  it('older saves get the fields added later; COM records move to their shared record (0x800471F4)', () => {
    const st = memoryStorage();
    const old = newGame(0, counter()) as unknown as Record<string, unknown>;
    for (const k of ['eventRecords', 'maxAttack', 'saveCount', 'statsViewed', 'fusionShop', 'trades', 'registration']) delete old[k];
    old.deckRecords = { 125: { wins: 2, losses: 1 }, 114: { wins: 1, losses: 0 }, 3: { wins: 4, losses: 0 } };
    st.setItem('dcb.save.A', JSON.stringify(old));
    const s = loadSave(0, st)!;
    expect(s.deckRecords).toEqual({ 114: { wins: 3, losses: 1 }, 3: { wins: 4, losses: 0 } });
    expect(s.eventRecords[114]?.known && s.eventRecords[3]?.known).toBe(true);
    expect([s.maxAttack.length, s.maxAttack[0], s.saveCount, s.statsViewed, s.fusionShop]).toEqual([191, [0, 0, 0], 0, false, -1]);
  });

  it('ignores corrupt or foreign data, and deletes a slot', () => {
    const st = memoryStorage();
    st.setItem('dcb.save.A', '{nope');
    st.setItem('dcb.save.B', JSON.stringify({ version: 99 }));
    expect([loadSave(0, st), loadSave(1, st)]).toEqual([null, null]);
    writeSave(2, newGame(2, counter()), st);
    deleteSave(2, st);
    expect(loadSave(2, st)).toBeNull();
  });
});
