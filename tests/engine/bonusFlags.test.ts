/**
 * Battle flags the EXP bonuses read (player +0x110, docs/research/progresion/02-resultados-y-guardado.md §2.2).
 */
import { describe, expect, it } from 'vitest';
import { resolveBattle } from '../../src/engine/game/battle';
import { BONUS_BIT, hasFlag, partnerEntries } from '../../src/engine/game/bonusFlags';
import { applyAction } from '../../src/engine/game/turn';
import { buildGame } from './build';

describe('flags set by the battle resolution', () => {
  it('the attack used in the hit, and the support kind', () => {
    const { state } = buildGame({
      p0: { stack: ['Goburimon'], attack: 'triangle', support: 'gamble', online: ['Agumon', 'Biyomon'] },
      p1: { stack: ['SnowGoburimon'], attack: 'circle', support: 'none' },
    });
    const [p0, p1] = resolveBattle(state).state.players;
    expect([hasFlag(p0, BONUS_BIT.attackTriangle), hasFlag(p0, BONUS_BIT.attackCircle)]).toEqual([true, false]);
    expect([hasFlag(p0, BONUS_BIT.supportUsed), hasFlag(p0, BONUS_BIT.nonGambleSupport)]).toEqual([true, false]);
    expect([hasFlag(p1, BONUS_BIT.supportUsed), hasFlag(p1, BONUS_BIT.nonGambleSupport)]).toEqual([false, true]);
  });

  it('damage that is a multiple of 1110, and the specialty each Digimon had', () => {
    const { state } = buildGame({
      p0: { stack: ['Goburimon'], powers: [1110, 0, 0], attack: 'circle', support: 'none' },
      p1: { stack: ['SnowGoburimon'], hp: 2000, attack: 'circle', support: 'none' },
    });
    const p0 = resolveBattle(state).state.players[0];
    expect(hasFlag(p0, BONUS_BIT.damageFever)).toBe(true);
    expect(hasFlag(p0, BONUS_BIT.specialtySeen + 0)).toBe(true); // Fire
  });

  it('a KO by an Ultimate, by the partner, the 2-0 score and an exact final hit', () => {
    const { state } = buildGame({
      p0: { stack: ['Gigadramon'], attack: 'circle', support: 'none', rounds: 1 },
      p1: { stack: ['Goburimon'], hp: 900, attack: 'circle', support: 'none' },
    });
    const [p0, p1] = resolveBattle(state).state.players;
    expect(hasFlag(p0, BONUS_BIT.ultimateKo)).toBe(true);
    expect(hasFlag(p0, BONUS_BIT.upTwoZero)).toBe(true);
    expect(hasFlag(p1, BONUS_BIT.downZeroTwo)).toBe(true);
    const fin = buildGame({
      p0: { stack: ['Gigadramon'], attack: 'circle', support: 'gamble', online: ['Gabumon'], rounds: 2 }, // Gabumon: no support effect
      p1: { stack: ['Goburimon'], hp: 900, attack: 'circle', support: 'none' },
    }).state;
    const [w, l] = resolveBattle(fin).state.players;
    expect([hasFlag(w, BONUS_BIT.justEnough), hasFlag(w, BONUS_BIT.finalRoundOwnGamble), hasFlag(l, BONUS_BIT.finalRoundRivalGamble)]).toEqual([true, true, true]);
  });
});

describe('flags set by the turn', () => {
  it('changing the whole hand, digivolving, 4 equal cards in hand', () => {
    const changed = buildGame({ phase: { name: 'mulligan' }, p0: { hand: ['Agumon'], online: ['Agumon', 'Agumon', 'Agumon', 'Agumon'] } }).state;
    const s = applyAction(changed, { type: 'changeHand', player: 0 }).state;
    expect(hasFlag(s.players[0], BONUS_BIT.changedHand)).toBe(true);
    expect(hasFlag(s.players[0], BONUS_BIT.fourOfAKind)).toBe(true);

    const { state, refs } = buildGame({ phase: { name: 'digivolve' }, p0: { stack: ['Agumon'], hand: ['Greymon'], dp: ['MoriShellmon', 'Biyomon'] }, p1: { stack: ['Gabumon'] } });
    const d = applyAction(state, { type: 'digivolve', player: 0, card: refs[0].Greymon[0] }).state;
    expect(hasFlag(d.players[0], BONUS_BIT.digivolved)).toBe(true);
  });

  it('partner entries are counted up to 3', () => {
    const { state, refs } = buildGame({ phase: { name: 'entrance' }, p0: { hand: ['Veemon'] }, p1: { stack: ['Gabumon'] } });
    const p = state.players[0];
    p.partners = [{ id: 175, armorId: null, level: 1, bonus: [0, 0, 0, 0], parts: [] }];
    p.partnerOf = p.cards.map((id) => (id === 175 ? 0 : null));
    const s = applyAction(state, { type: 'enter', player: 0, card: refs[0].Veemon[0] }).state;
    expect(partnerEntries(s.players[0])).toBe(1);
  });
});
