/**
 * Story-mode decks and partner equipment:
 *   SUBSEG 0x801ECE70  a card can be added: never an Armor card, at most 4 copies per deck
 *   SUBSEG 0x801F10D8  (Auto-Deck) partners come from the partner slots, one card each
 *   SLUS 0x800495B4 / 0x800496E4 / 0x800493EC  Digi-Part equipment rules
 *   SLUS 0x80047E64  choosing a Digi-Egg requires owning it
 */
import { describe, expect, it } from 'vitest';
import { addCard as collect } from '../../src/engine/progression/collection';
import { newGame } from '../../src/engine/progression/save';
import { availableCopies, canAddStoryCard, chooseEgg, equipPart, unequipPart } from '../../src/engine/progression/storyDecks';

const counter = () => {
  let i = 0;
  return { next: () => i++ };
};
const fresh = () => newGame(0, counter()); // Veemon

describe('cards a story deck can use', () => {
  it('owned copies; one card per partner slot; Armor cards never', () => {
    const s = fresh();
    collect(s.collection, 27, 3, counter());
    expect(availableCopies(s, 27)).toBeGreaterThanOrEqual(3);
    expect([availableCopies(s, 175), availableCopies(s, 182), availableCopies(s, 172)]).toEqual([1, 0, 0]);
  });

  it('at most 4 copies per deck and never more than owned', () => {
    const s = fresh();
    collect(s.collection, 99, 6, counter());
    const four = Array(4).fill(99);
    expect(canAddStoryCard(s, four, 99)).toMatch(/4 copias/);
    expect(canAddStoryCard(s, [175], 175)).toMatch(/Veemon/);
    expect(canAddStoryCard(s, [], 172)).toMatch(/Armor/);
    expect(canAddStoryCard(s, [], 99)).toBeNull();
  });
});

describe('partner equipment', () => {
  it('a Digi-Part must be owned, free, and not repeat a type (type 1 excludes 1-4); 3 per partner', () => {
    const s = fresh();
    for (const id of [0, 1, 7, 10, 41, 123]) s.ownedParts[id] = true;
    expect(equipPart(s, 0, 0)).toBeNull();
    expect(equipPart(s, 0, 1)).toMatch(/tipo/); // HP twice
    expect(equipPart(s, 0, 7)).toBeNull(); // all attacks
    expect(equipPart(s, 0, 10)).toMatch(/tipo/); // ◯ after "all attacks"
    expect(equipPart(s, 0, 41)).toBeNull();
    expect(equipPart(s, 0, 123)).toMatch(/3/);
    expect(equipPart(s, 0, 2)).toMatch(/no la tienes/);
    unequipPart(s, 0, 41);
    expect(s.partners[0].slot.parts).toEqual([0, 7]);
  });

  it('a Digi-Egg can be chosen only once received', () => {
    const s = fresh();
    expect(chooseEgg(s, 0, 0)).toMatch(/no lo tienes/);
    s.partners[0].eggs[0] = 172;
    expect(chooseEgg(s, 0, 0)).toBeNull();
    expect(s.partners[0].slot.armorId).toBe(172);
  });
});
