/**
 * Partner cards and Armor-digivolution on entry (docs/research/07-progresion.md §5):
 *   slots from a CPU deck  SLUS 0x8003F9EC · partner copies  SLUS 0x80048230
 *   pointer redirection    SLUS 0x80046A38 · Armor in place  SLUS 0x80040A48 (states 8/9)
 */
import { describe, expect, it } from 'vitest';
import { chooseAiAction, createAi } from '../../src/engine/ai';
import { decks } from '../../src/engine/cards/decks';
import { cardOf } from '../../src/engine/game/effects';
import { partnerCards, partnersFromDeck } from '../../src/engine/game/partner';
import { applyAction, createGame, legalActions } from '../../src/engine/game/turn';
import { buildGame, cardId, digimon } from './build';

const deck = (name: string) => decks.find((d) => d.name === name)!;

describe('partner slots (SLUS 0x8003F9EC)', () => {
  it('one slot per partner card of the deck, with the deck Digi-Egg equipped', () => {
    const d = deck('Binding Chain'); // Digimon Emperor: Wormmon, egg 2 → Quetzalmon
    expect(partnersFromDeck(d.cards, d.partnerEgg)).toEqual([{ id: 187, armorId: 177, level: 1, bonus: [0, 0, 0, 0], parts: [] }]);
    const m = deck("Miracle Knight's"); // egg 3 → Magnamon
    expect(partnersFromDeck(m.cards, m.partnerEgg)[0]).toMatchObject({ id: 175, armorId: 173 });
    expect(partnersFromDeck(deck('Go Go Dinosaur').cards, 0)[0]).toMatchObject({ id: 175, armorId: null });
  });

  it('an egg the partner does not have gives no Armor; at most 3 slots, in deck order', () => {
    expect(partnersFromDeck([cardId('Hawkmon')], 3)[0].armorId).toBeNull();
    const four = ['Gatomon', 'Veemon', 'Patamon', 'Wormmon'].map(cardId);
    expect(partnersFromDeck(four, 0).map((s) => s.id)).toEqual([184, 175, 183]);
  });
});

describe('partner copies (SLUS 0x80048230)', () => {
  it('level bonuses go to the partner and to its Armor; Counter/Crash keep ✕ at 0', () => {
    const { card, armor } = partnerCards({ id: 175, armorId: 172, level: 5, bonus: [10, 20, 0, 30], parts: [] });
    expect([card.hp, card.attacks.circle.power, card.attacks.triangle.power, card.attacks.cross.power]).toEqual([560, 370, 280, 230]);
    // Flamedramon: ✕ 0 → 100 (+30), then reset to 0 by its ◯ Counter
    expect([armor!.hp, armor!.attacks.circle.power, armor!.attacks.triangle.power, armor!.attacks.cross.power]).toEqual([610, 520, 350, 0]);
    expect(digimon('Veemon').hp).toBe(550); // the ROM card is untouched
  });
});

describe('Armor-digivolution on entry (states 8/9, SLUS 0x80040A48)', () => {
  const setup = (partnerEgg: number) => {
    const built = buildGame({ turn: 1, phase: { name: 'entrance' }, p0: { stack: ['Gabumon'] }, p1: { hand: ['Wormmon', 'Shadramon'] } });
    const p1 = built.state.players[1];
    p1.partners = partnersFromDeck(p1.cards, partnerEgg);
    p1.partnerOf = p1.cards.map((id) => (id === 187 ? 0 : null));
    return { ...built, wormmon: built.refs[1].Wormmon[0] };
  };

  it('entering a partner with an equipped egg asks first; accepting turns the card into the Armor in place', () => {
    const { state, wormmon } = setup(2);
    let s = applyAction(state, { type: 'enter', player: 1, card: wormmon }).state;
    expect(s.phase.name).toBe('armorDigivolve');
    expect(legalActions(s, 1).map((a) => a.type)).toEqual(['armorDigivolve', 'skipArmorDigivolve']);
    s = applyAction(s, { type: 'armorDigivolve', player: 1 }).state;
    const p = s.players[1];
    expect(cardOf(p, wormmon).name).toBe('Quetzalmon');
    expect([p.hp, ...p.powers, p.specialty]).toEqual([800, 400, 350, 0, digimon('Quetzalmon').specialty]);
    expect(p.enteredAs).toBeNull(); // the abnormal-state bits are not touched
    expect(p.settled).toBe(false);
    expect(s.phase.name).toBe('dp');
  });

  it('declining keeps the Rookie', () => {
    const { state, wormmon } = setup(2);
    let s = applyAction(state, { type: 'enter', player: 1, card: wormmon }).state;
    s = applyAction(s, { type: 'skipArmorDigivolve', player: 1 }).state;
    expect(cardOf(s.players[1], wormmon).name).toBe('Wormmon');
    expect(s.phase.name).toBe('dp');
  });

  it('no question without an egg, nor for an Armor card that is not a partner', () => {
    const { state, wormmon, refs } = setup(0);
    expect(applyAction(state, { type: 'enter', player: 1, card: wormmon }).state.phase.name).toBe('dp');
    const shadra = setup(2);
    expect(applyAction(shadra.state, { type: 'enter', player: 1, card: refs[1].Shadramon[0] }).state.phase.name).toBe('dp');
  });

  it('the CPU always Armor-digivolves (state 8 does it without asking)', () => {
    const { state, wormmon } = setup(2);
    const s = applyAction(state, { type: 'enter', player: 1, card: wormmon }).state;
    expect(chooseAiAction(s, 1, createAi([0, 0, 0, 0], 1))).toEqual({ type: 'armorDigivolve', player: 1 });
  });

  it('createGame builds the slots from each deck and its Digi-Egg', () => {
    const d = deck('Binding Chain');
    const { state } = createGame({ decks: [deck('Red').cards, d.cards], seed: 3, firstPlayer: 0, eggs: [0, d.partnerEgg] });
    expect(state.players[1].partners.map((s) => [s.id, s.armorId])).toEqual([[187, 177]]);
    const p = state.players[1];
    expect(p.cards.filter((_, i) => p.partnerOf[i] === 0).every((id) => id === 187)).toBe(true);
  });
});
