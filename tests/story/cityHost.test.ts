/**
 * City script host — SAISEG 0x801E390C (docs/research/progresion/01-mundo-y-guiones.md §2-§4).
 * Scripts are assembled by hand; the host turns commands into requests for the UI.
 */
import { describe, expect, it } from 'vitest';
import { copiesOf } from '../../src/engine/progression/collection';
import { newGame } from '../../src/engine/progression/save';
import { advance, enterCity } from '../../src/story/cityHost';
import { asm, cmd, set, skipIf, goto, str } from './mscdAsm';

const counter = () => {
  let i = 0;
  return { next: () => i++ };
};
const save = () => newGame(0, counter());
const city = (...ins: number[][]) => asm(372, ...ins);

describe('city host (SAISEG 0x801E390C)', () => {
  it('text lines accumulate (10.4) until the page wait (10.5); the end of the code ends the visit', () => {
    const h = enterCity(save(), 0, city(str(4, '*c4Betamon*c7'), cmd(10, 4), str(4, 'Hello!'), cmd(10, 4), cmd(10, 5)));
    expect(advance(h, counter())).toEqual({ kind: 'say', lines: ['*c4Betamon*c7', 'Hello!'] });
    expect(advance(h, counter(), { kind: 'ack' })).toEqual({ kind: 'end' });
  });

  it('a menu (11.0 / 11.1 / 10.1) answers in v1: 1..n, or −1 to cancel', () => {
    const h = enterCity(save(), 0, city(cmd(11, 0, [0, 120]), cmd(11, 1, [0, 2]), cmd(11, 1, [0, 3]), cmd(10, 1), set(20, 0, 1, true), cmd(10, 5)));
    expect(advance(h, counter())).toEqual({ kind: 'menu', options: [2, 3], big: true, prompt: [] });
    advance(h, counter(), { kind: 'choice', value: 2 });
    expect(h.vm.vars[1]).toBe(2);
  });

  it('a menu keeps the question printed before it (10.4 without a page wait) on screen', () => {
    const h = enterCity(save(), 0, city(str(4, '*c4Nilo*c7'), cmd(10, 4), str(4, 'Ready?'), cmd(10, 4), cmd(11, 0, [0, 0]), cmd(11, 1, [0, 16]), cmd(10, 1), cmd(10, 5)));
    expect(advance(h, counter())).toEqual({ kind: 'menu', options: [16], big: false, prompt: ['*c4Nilo*c7', 'Ready?'] });
  });

  it('the Battle Cafe: NPCs added with 11.3, chosen with 10.3 into v2', () => {
    const h = enterCity(save(), 0, city(cmd(11, 3, [0, 4]), cmd(11, 3, [0, 9]), cmd(10, 3), cmd(10, 5)));
    expect(advance(h, counter())).toEqual({ kind: 'talkTo', npcs: [4, 9] });
    advance(h, counter(), { kind: 'choice', value: 9 });
    expect(h.vm.vars[2]).toBe(9);
  });

  it('a battle (11.2) resumes with v1 = 1 on a win; a loaned deck (11.17) is used once', () => {
    const h = enterCity(save(), 0, city(cmd(11, 17, [0, 145]), cmd(11, 2, [0, 3]), cmd(11, 2, [0, 4]), cmd(10, 5)));
    expect(advance(h, counter())).toEqual({ kind: 'battle', deck: 3, lent: 145 });
    expect(advance(h, counter(), { kind: 'battleResult', win: true })).toEqual({ kind: 'battle', deck: 4, lent: null });
    expect(h.vm.vars[1]).toBe(1);
    advance(h, counter(), { kind: 'battleResult', win: false });
    expect(h.vm.vars[1]).toBe(0);
  });

  it('rewards are applied to the save: a pack (11.9), up to 3 cards (13.1), a Digi-Part (11.16)', () => {
    const s = save();
    const h = enterCity(s, 0, city(cmd(11, 9, [0, 4]), cmd(13, 1, [0, 27], [0, 0xffff], [0, 0xffff]), cmd(11, 16, [0, 61]), cmd(10, 5)));
    const pack = advance(h, counter());
    expect(pack).toMatchObject({ kind: 'reward', pack: 4 });
    expect((pack as { cards: number[] }).cards).toHaveLength(3);
    const before = copiesOf(s.collection, 27);
    expect(advance(h, counter(), { kind: 'ack' })).toMatchObject({ kind: 'reward', cards: [27] });
    expect(copiesOf(s.collection, 27)).toBe(before + 1);
    expect(advance(h, counter(), { kind: 'ack' })).toMatchObject({ kind: 'reward', part: 61 });
    expect(s.ownedParts[61]).toBe(true);
  });

  it('story flags (v12..v362 bits) and counters persist in the save; completion points (10.19 / 11.18)', () => {
    const s = save();
    const h = enterCity(s, 3, city(set(12, 0, 1), set(300, 0, 1), set(363, 0, 7), cmd(10, 19), cmd(11, 18, [0, 3]), cmd(11, 18, [0, 2])));
    expect(advance(h, counter())).toEqual({ kind: 'end' });
    expect(s.story.flags[0] & 1).toBe(1);
    expect((s.story.flags[(300 - 12) >> 5] >>> ((300 - 12) & 31)) & 1).toBe(1);
    expect(s.story.counters[0]).toBe(7);
    expect([s.story.points, s.story.city]).toEqual([5, 3]);
    const again = enterCity(s, 3, city(skipIf(12, 0, 1), goto(28), cmd(10, 5)));
    expect(again.vm.vars[300]).toBe(1);
    expect(advance(again, counter())).toEqual({ kind: 'say', lines: [] });
  });

  it('PARTNER GET: candidates (10.11 / 11.10), the screen (10.10) adds the partner and sets its flag', () => {
    const s = save();
    const h = enterCity(s, 3, city(cmd(10, 11), cmd(11, 10, [0, 4]), cmd(11, 10, [0, 3]), cmd(10, 10), cmd(10, 5)));
    expect(advance(h, counter())).toEqual({ kind: 'partnerGet', candidates: [4, 3] });
    advance(h, counter(), { kind: 'choice', value: 3 });
    expect(s.partners.map((p) => p.slot.id)).toEqual([175, 184]);
    expect(h.vm.vars[307]).toBe(1);
  });

  it('partner flags follow the slots; Digi-Egg flags give the egg (and equip it if none)', () => {
    const s = save();
    const h = enterCity(s, 0, city(set(295, 0, 1), cmd(10, 5)));
    expect(h.vm.vars[294]).toBe(1); // Veemon owned
    advance(h, counter());
    expect(s.partners[0].eggs[0]).toBe(172);
    expect(s.partners[0].slot.armorId).toBe(172);
  });

  it('wins (10.16 → v1), trade unlock (10.18), deck check (11.21: v1 = 1 when no deck qualifies)', () => {
    const s = save();
    s.winsCom = 301;
    const h = enterCity(s, 0, city(cmd(10, 16), set(30, 0, 1, true), cmd(10, 18), cmd(11, 21, [0, 192]), cmd(10, 5)));
    advance(h, counter());
    expect(h.vm.vars[30]).toBe(301);
    expect(s.tradeEnabled).toBe(true);
    expect(h.vm.vars[1]).toBe(1); // the Red deck has Option cards
  });
});
