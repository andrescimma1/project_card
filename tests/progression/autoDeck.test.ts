/**
 * Auto Deck — SUBSEG 0x801F10D8. Cards are grouped in 20 pools (specialty × R/C/U, Offensive / Defensive
 * Options, Digivolve), each shuffled with rand(); the template takes Options first (preferred kind, then
 * Digivolve, then the other kind), then partners + R, C and U of the chosen specialty, topping up from the
 * specialty with most cards, and fills to 30 from every pool in order.
 */
import { describe, expect, it } from 'vitest';
import { cards } from '../../src/engine/cards/db';
import { addCard, copiesOf, newCollection } from '../../src/engine/progression/collection';
import { autoDeck } from '../../src/engine/progression/autoDeck';
import { newGame, type SaveData } from '../../src/engine/progression/save';
import { progression } from '../../src/engine/progression/tables';

const counter = () => {
  let i = 0;
  return { next: () => i++ };
};
const fire = { specialty: 0, defensive: false, few: false };
const of = (ids: number[], pred: (id: number) => boolean) => ids.filter(pred).length;
const level = (id: number) => {
  const c = cards[id];
  return c.kind === 'digimon' ? c.level : null;
};
const spec = (id: number) => {
  const c = cards[id];
  return c.kind === 'digimon' ? c.specialty : null;
};

/** A save with no cards but its partner, then 4 copies of the given cards. */
function stocked(ids: number[]): SaveData {
  const s = newGame(0, counter());
  s.collection = newCollection();
  for (const id of ids) addCard(s.collection, id, 4, counter());
  return s;
}
const ids = (pred: (id: number) => boolean) => cards.filter((c) => pred(c.id)).map((c) => c.id);
const FIRE_R = ids((id) => id < 172 && spec(id) === 'fire' && level(id) === 'R');
const FIRE_C = ids((id) => id < 172 && spec(id) === 'fire' && level(id) === 'C');
const FIRE_U = ids((id) => id < 172 && spec(id) === 'fire' && level(id) === 'U');
const ICE_U = ids((id) => id < 172 && spec(id) === 'ice' && level(id) === 'U');
const OPTIONS = ids((id) => id >= 191 && cards[id].kind === 'option');

describe('Auto Deck (SUBSEG 0x801F10D8)', () => {
  it('Many Options: 10 Options, partner + 9 R, 6 C, 4 U of the chosen specialty', () => {
    const s = stocked([...FIRE_R, ...FIRE_C, ...FIRE_U, ...OPTIONS]);
    const d = autoDeck(s, fire, counter());
    expect(d).toHaveLength(30);
    expect(of(d, (id) => id === 175)).toBe(1);
    expect(of(d, (id) => cards[id].kind !== 'digimon')).toBe(10);
    expect([of(d, (id) => level(id) === 'R' && id !== 175), of(d, (id) => level(id) === 'C'), of(d, (id) => level(id) === 'U')]).toEqual([9, 6, 4]);
  });

  it('Few Options: 5 / 12 / 8 / 5, and Defensive Options first', () => {
    const s = stocked([...FIRE_R, ...FIRE_C, ...FIRE_U, ...OPTIONS]);
    const d = autoDeck(s, { ...fire, defensive: true, few: true }, counter());
    expect(of(d, (id) => cards[id].kind !== 'digimon')).toBe(5);
    expect([of(d, (id) => level(id) === 'R'), of(d, (id) => level(id) === 'C'), of(d, (id) => level(id) === 'U')]).toEqual([12, 8, 5]);
    expect(d.filter((id) => id >= 191).every((id) => progression.autoDeck.optionCategory[id - 191] === 1)).toBe(true);
  });

  it('never more copies than owned, at most 4 of a card, never Armor cards', () => {
    const s = newGame(0, counter());
    const d = autoDeck(s, fire, counter());
    for (const id of new Set(d)) {
      expect(of(d, (x) => x === id)).toBeLessThanOrEqual(id === 175 ? 1 : Math.min(4, copiesOf(s.collection, id)));
      expect(id < 172 || id > 190 || id === 175).toBe(true);
    }
  });

  it('missing levels come from the specialty with most cards; the rest fills to 30 in pool order', () => {
    const s = stocked([...FIRE_R, ...FIRE_C, ...ICE_U.slice(0, 1), ...OPTIONS]);
    const d = autoDeck(s, fire, counter());
    expect(of(d, (id) => level(id) === 'U')).toBe(4); // 4 copies of one Ice Ultimate
    expect(d).toHaveLength(30);
  });

  it('with few cards the deck is just shorter', () => {
    const s = stocked(FIRE_R.slice(0, 2));
    expect(autoDeck(s, fire, counter())).toHaveLength(9); // partner + 8
  });
});
