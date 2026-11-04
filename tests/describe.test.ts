import { describe, expect, it } from 'vitest';
import { describeEvent } from '../src/game/describe';
import { buildGame } from './engine/build';

describe('event descriptions (Spanish)', () => {
  const { state, refs } = buildGame({
    p0: { stack: ['Agumon'], hand: ['Biyomon'] },
    p1: { stack: ['Goburimon'] },
  });

  it('describes a hit with the attacker card name', () => {
    expect(describeEvent({ type: 'hit', attacker: 0, defender: 1, attackerCard: refs[0].Agumon[0], defenderCard: refs[1].Goburimon[0], damage: 380, eaten: 0, hp: [500, 120], slot: 'circle' }, state)).toBe(
      'Tu Agumon golpea a Goburimon por 380.',
    );
  });

  it('describes a voided support', () => {
    expect(describeEvent({ type: 'effect', player: 0, source: 'support', card: refs[0].Biyomon[0], speed: 1, voided: true, conditionsMet: false, hp: [570, 500], attacks: ['circle', 'circle'] }, state)).toBe('Tu soporte Biyomon fue anulado.');
  });

  it('describes an Armor-digivolution on entry with both card names', () => {
    expect(describeEvent({ type: 'armorDigivolved', player: 1, card: refs[1].Goburimon[0], from: 187, to: 177 }, state)).toBe(
      'La CPU Armor-digievoluciona: Wormmon pasa a Quetzalmon.',
    );
  });

  it('describes the round winner', () => {
    expect(describeEvent({ type: 'roundWon', player: 1, rounds: 2 }, state)).toBe('La CPU gana la ronda (2 de 3).');
  });

  it('2 Player Battle: both players are named, nobody is "you" or "the CPU"', () => {
    const names: [string, string] = ['Taichi', 'Matt'];
    expect(describeEvent({ type: 'hit', attacker: 1, defender: 0, attackerCard: refs[1].Goburimon[0], defenderCard: refs[0].Agumon[0], damage: 300, eaten: 0, hp: [270, 500], slot: 'cross' }, state, names)).toBe(
      'Goburimon de Matt golpea a Agumon de Taichi por 300.',
    );
    expect(describeEvent({ type: 'reveal', attacks: ['circle', 'cross'], hp: [1, 1] }, state, names)).toBe('Ataques: Taichi ◯, Matt ✕.');
    expect(describeEvent({ type: 'draw', player: 0, card: refs[0].Biyomon[0] }, state, names)).toBe('Taichi roba una carta.');
    expect(describeEvent({ type: 'gameOver', winner: 1, reason: 'rounds' }, state, names)).toBe('Matt gana la partida.');
  });
});
