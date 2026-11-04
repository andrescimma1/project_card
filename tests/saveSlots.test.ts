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
