/**
 * Digi-Parts applied to the partner copies — SLUS 0x80048230 (switch at 0x8001274C).
 * docs/research/progresion/03-companero-fusion-intercambio.md §3.
 */
import { describe, expect, it } from 'vitest';
import { simulateBattle } from '../../src/engine/game/battle';
import { partnerBoosts, partnerCards } from '../../src/engine/game/partner';
import type { PartnerSlot } from '../../src/engine/game/types';
import { buildGame } from './build';

const veemon = (...parts: number[]): PartnerSlot => ({ id: 175, armorId: 172, level: 10, bonus: [0, 0, 0, 0], parts });
const powers = (c: { attacks: Record<'circle' | 'triangle' | 'cross', { power: number }> }) => [c.attacks.circle.power, c.attacks.triangle.power, c.attacks.cross.power];

describe('stat parts (types 0-6) go to the partner and to its Armor', () => {
  it('HP, all attacks, one attack, +P', () => {
    const { card, armor } = partnerCards(veemon(0, 7, 38)); // HP +50 · all attacks +50 · +10 DP
    expect([card.hp, ...powers(card), card.dpGiven]).toEqual([600, 400, 330, 250, 30]);
    expect([armor!.hp, ...powers(armor!)]).toEqual([650, 550, 400, 0]); // Flamedramon keeps ✕ 0 (◯ Counter)
  });

  it('type 5 changes the ✕ effect and its power; powers never go below 0', () => {
    const { card, armor } = partnerCards(veemon(24)); // ◯ to 0, ✕ −100
    expect([card.crossEffect, card.attacks.cross.power]).toEqual(['circleTo0', 100]);
    // Flamedramon: ✕ 0 → 100, −100 = 0; no longer a Counter
    expect([armor!.crossEffect, armor!.attacks.cross.power]).toEqual(['circleTo0', 0]);
  });

  it('type 8 adds EXP % or rare-card % to the slot, not to the cards', () => {
    expect(partnerBoosts(veemon(123))).toEqual({ expPercent: 10, rarePercent: 0 });
    expect(partnerBoosts(veemon(127))).toEqual({ expPercent: 0, rarePercent: 20 });
  });
});

describe('type 7: a new support program from the ROM templates', () => {
  it('the partner gets the template program, text and speed; the Armor keeps its program but shows the new text', () => {
    const { card, armor } = partnerCards(veemon(41)); // Boost Attack Power +50
    expect(card.support.program.conditions.every((c) => !c.enabled)).toBe(true);
    expect(card.support.program.actions.map((a) => a.enabled)).toEqual([true, false, false]);
    expect(card.support.program.actions[0].operands[2].value).toBe(50);
    expect([card.supportSpeed, card.support.text]).toEqual([1, 'Boost Attack Power +50.']);
    expect(armor!.support.text).toBe('Boost Attack Power +50.');
    expect(armor!.support.program).toEqual(partnerCards(veemon()).armor!.support.program);
  });

  it('the new program runs in battle like any support', () => {
    const { state, refs } = buildGame({
      p0: { stack: ['Goburimon'], attack: 'circle', support: 'Veemon' },
      p1: { stack: ['SnowGoburimon'], attack: 'circle', support: 'none' },
    });
    const p = state.players[0];
    p.partners = [veemon(41)];
    p.partnerOf = p.cards.map((id) => (id === 175 ? 0 : null));
    expect(refs[0].Veemon).toHaveLength(1);
    expect(simulateBattle(state)[1]).toBe(770 - 350);
  });
});
