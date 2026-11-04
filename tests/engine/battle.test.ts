/**
 * Battle resolution, against the algorithm read from the game (KAWSEG 0x801E6AA4, see
 * docs/research/04-motor-original.md §4-§6). Expected numbers are computed by hand from ROM stats.
 */
import { describe, expect, it } from 'vitest';
import { resolveBattle, simulateBattle } from '../../src/engine/game/battle';
import type { GameEvent } from '../../src/engine/game/types';
import { buildGame, names } from './build';

const order = (events: GameEvent[]) => events.find((e) => e.type === 'attackOrder');
const effectsOf = (events: GameEvent[]) => events.filter((e) => e.type === 'effect');

describe('basic exchange', () => {
  it('turn player attacks first and damage equals the chosen power', () => {
    const { state } = buildGame({
      p0: { stack: ['Goburimon'], attack: 'circle', support: 'none' },
      p1: { stack: ['SnowGoburimon'], attack: 'circle', support: 'none' },
    });
    const { state: s, events } = resolveBattle(state);
    expect(order(events)).toMatchObject({ first: 0, second: 1 });
    expect(s.players[1].hp).toBe(770 - 300);
    expect(s.players[0].hp).toBe(500 - 230);
  });

  it('a KO on the first hit prevents the second attack', () => {
    const { state } = buildGame({
      p0: { stack: ['Gigadramon'], attack: 'circle', support: 'none' },
      p1: { stack: ['Goburimon'], attack: 'circle', support: 'none' },
    });
    const { state: s, events } = resolveBattle(state);
    expect(events.filter((e) => e.type === 'hit')).toHaveLength(1);
    expect(s.players[0].hp).toBe(1480);
    expect(s.players[0].rounds).toBe(1);
  });
});

describe('support bytecode', () => {
  it('Agumon boosts only the ◯ attack', () => {
    const circle = buildGame({
      p0: { stack: ['Goburimon'], attack: 'circle', support: 'Agumon' },
      p1: { stack: ['SnowGoburimon'], attack: 'circle', support: 'none' },
    });
    expect(resolveBattle(circle.state).state.players[1].hp).toBe(770 - 600);
    const triangle = buildGame({
      p0: { stack: ['Goburimon'], attack: 'triangle', support: 'Agumon' },
      p1: { stack: ['SnowGoburimon'], attack: 'circle', support: 'none' },
    });
    expect(resolveBattle(triangle.state).state.players[1].hp).toBe(770 - 300);
  });

  it('Seadramon halves the opponent attack, rounded down to tens', () => {
    const { state } = buildGame({
      p0: { stack: ['SnowGoburimon'], attack: 'triangle', support: 'none' },
      p1: { stack: ['Goburimon'], attack: 'circle', support: 'Seadramon' },
    });
    const { state: s } = resolveBattle(state);
    expect(s.players[1].hp).toBe(500 - 110); // 230 / 2 = 115 -> 110
    expect(s.players[0].hp).toBe(770 - 300);
  });

  it('Ogremon multiplies Attack Power by the DP cards, then discards them', () => {
    const { state } = buildGame({
      p0: { stack: ['Goburimon'], dp: ['Agumon', 'Biyomon', 'Gabumon'], attack: 'circle', support: 'Ogremon' },
      p1: { stack: ['SnowGoburimon'], attack: 'circle', support: 'none' },
    });
    const { state: s } = resolveBattle(state);
    expect(s.players[1].hp).toBe(0); // 300 x 3 = 900 > 770
    expect(names(s, 0, 'dp')).toEqual([]);
    expect(names(s, 0, 'offline')).toEqual(expect.arrayContaining(['Agumon', 'Biyomon', 'Gabumon']));
  });

  it('Aquilamon support never triggers (comparator 0xFF)', () => {
    const { state } = buildGame({
      turn: 1,
      p0: { stack: ['Goburimon'], attack: 'triangle', support: 'Aquilamon' },
      p1: { stack: ['Gigadramon'], attack: 'circle', support: 'none' },
    });
    const { events } = resolveBattle(state);
    expect(order(events)).toMatchObject({ first: 1 });
  });

  it('support cards go to the Offline Pile after the battle', () => {
    const { state } = buildGame({
      p0: { stack: ['Goburimon'], attack: 'circle', support: 'Agumon' },
      p1: { stack: ['SnowGoburimon'], attack: 'circle', support: 'none' },
    });
    const { state: s } = resolveBattle(state);
    expect(names(s, 0, 'hand')).toEqual([]);
    expect(names(s, 0, 'offline')).toEqual(['Agumon']);
  });
});

describe('resolution order', () => {
  it('a High-speed Option voids the opponent support before it applies', () => {
    const { state } = buildGame({
      p0: { stack: ['Goburimon'], attack: 'circle', support: 'Agumon' },
      p1: { stack: ['SnowGoburimon'], attack: 'circle', support: "Cherrymon's Mist" },
    });
    const { state: s } = resolveBattle(state);
    expect(s.players[1].hp).toBe(770 - 300);
  });

  it('at equal speed an Option resolves before a Digimon support, even the opponent one', () => {
    const { state } = buildGame({
      p0: { stack: ['Goburimon'], attack: 'circle', support: 'WaruSeadramon' },
      p1: { stack: ['SnowGoburimon'], attack: 'circle', support: 'Mystic Sevens' },
    });
    const { events } = resolveBattle(state);
    expect(effectsOf(events).find((e) => e.player === 0 && e.source === 'support')).toMatchObject({ voided: true });
  });

  it('within the same kind and speed, the turn player resolves first', () => {
    const p0 = { stack: ['Goburimon'], attack: 'circle' as const, support: 'ClearAgumon' };
    const p1 = { stack: ['SnowGoburimon'], attack: 'circle' as const, support: 'WaruSeadramon' };
    const asTurn0 = effectsOf(resolveBattle(buildGame({ turn: 0, p0, p1 }).state).events);
    expect(asTurn0.find((e) => e.player === 1 && e.source === 'support')).toMatchObject({ voided: true });
    const asTurn1 = effectsOf(resolveBattle(buildGame({ turn: 1, p0, p1 }).state).events);
    expect(asTurn1.find((e) => e.player === 0 && e.source === 'support')).toMatchObject({ voided: true });
  });
});

describe('✕ effects', () => {
  it('Jamming voids a Digimon support', () => {
    const { state } = buildGame({
      p0: { stack: ['Kunemon'], attack: 'cross', support: 'none' },
      p1: { stack: ['Goburimon'], attack: 'circle', support: 'Agumon' },
    });
    const { state: s } = resolveBattle(state);
    expect(s.players[1].hp).toBe(500 - 190);
    expect(s.players[0].hp).toBe(680 - 300);
  });

  it('Jamming does not void an Option', () => {
    const { state } = buildGame({
      p0: { stack: ['Kunemon'], attack: 'cross', support: 'none' },
      p1: { stack: ['Goburimon'], attack: 'circle', support: 'Attack Chip' },
    });
    expect(resolveBattle(state).state.players[0].hp).toBe(680 - 600);
  });

  it('◯ Counter: the attacker misses and takes its own power back', () => {
    const { state } = buildGame({
      p0: { stack: ['Goburimon'], attack: 'circle', support: 'none' },
      p1: { stack: ['Candlemon'], attack: 'cross', support: 'none' },
    });
    const { state: s } = resolveBattle(state);
    expect(s.players[1].hp).toBe(480);
    expect(s.players[0].hp).toBe(500 - 300);
  });

  it('◯ Counter does nothing when the opponent does not use ◯', () => {
    const { state } = buildGame({
      p0: { stack: ['Goburimon'], attack: 'triangle', support: 'none' },
      p1: { stack: ['Candlemon'], attack: 'cross', support: 'none' },
    });
    const { state: s } = resolveBattle(state);
    expect(s.players[1].hp).toBe(480 - 300);
    expect(s.players[0].hp).toBe(500);
  });

  it('a later counter clears an earlier one (✕ Counter after Golden Banana)', () => {
    const { state } = buildGame({
      p0: { stack: ['Candlemon'], attack: 'cross', support: 'none' },
      p1: { stack: ['Goburimon'], attack: 'circle', support: 'Golden Banana' },
    });
    const { state: s, events } = resolveBattle(state);
    expect(order(events)).toMatchObject({ first: 1, second: 0 });
    expect(s.players[0].hp).toBe(480);
    expect(s.players[1].hp).toBe(0); // 500 halved = 250, countered for 300
  });

  it('1st Attack lets the non-turn player attack first', () => {
    const { state } = buildGame({
      p0: { stack: ['Goburimon'], attack: 'circle', support: 'none' },
      p1: { stack: ['Biyomon'], attack: 'cross', support: 'none' },
    });
    expect(order(resolveBattle(state).events)).toMatchObject({ first: 1 });
  });

  it('if both have 1st Attack they cancel and the turn player stays first', () => {
    const { state } = buildGame({
      p0: { stack: ['Biyomon'], attack: 'cross', support: 'none' },
      p1: { stack: ['Biyomon'], attack: 'cross', support: 'none' },
    });
    expect(order(resolveBattle(state).events)).toMatchObject({ first: 0 });
  });

  it('Crash: ✕ power becomes own HP, then HP becomes 10', () => {
    const { state } = buildGame({
      p0: { stack: ['Solarmon'], attack: 'cross', support: 'none' },
      p1: { stack: ['SnowGoburimon'], attack: 'circle', support: 'none' },
    });
    const { state: s } = resolveBattle(state);
    expect(s.players[1].hp).toBe(770 - 500);
    expect(s.players[0].hp).toBe(0); // 10 - 230
  });

  it('the second attacker Crash uses the HP left after the first hit', () => {
    const { state } = buildGame({
      turn: 1,
      p0: { stack: ['Solarmon'], attack: 'cross', support: 'none' },
      p1: { stack: ['SnowGoburimon'], attack: 'circle', support: 'none' },
    });
    const { state: s } = resolveBattle(state);
    expect(s.players[0].hp).toBe(10);
    expect(s.players[1].hp).toBe(770 - 270);
  });

  it('Eat-up HP heals the damage, capped at the HP the foe had', () => {
    const capped = buildGame({
      p0: { stack: ['Palmon'], attack: 'cross', support: 'none' },
      p1: { stack: ['Goburimon'], hp: 100, attack: 'circle', support: 'none' },
    });
    expect(resolveBattle(capped.state).state.players[0].hp).toBe(500 + 100);
    const full = buildGame({
      p0: { stack: ['Palmon'], attack: 'cross', support: 'none' },
      p1: { stack: ['SnowGoburimon'], attack: 'circle', support: 'none' },
    });
    const s = resolveBattle(full.state).state;
    expect(s.players[0].hp).toBe(500 + 160 - 230);
    expect(s.players[1].hp).toBe(770 - 160);
  });

  it('Foe X3 checks the opponent CURRENT specialty', () => {
    const ice = buildGame({
      p0: { stack: ['D-Otamamon'], attack: 'cross', support: 'none' },
      p1: { stack: ['SnowGoburimon'], attack: 'circle', support: 'none' },
    });
    expect(resolveBattle(ice.state).state.players[1].hp).toBe(770 - 450);
    const changed = buildGame({
      p0: { stack: ['D-Otamamon'], attack: 'cross', support: 'none' },
      p1: { stack: ['SnowGoburimon'], specialty: 'fire', attack: 'circle', support: 'none' },
    });
    expect(resolveBattle(changed.state).state.players[1].hp).toBe(770 - 150);
  });
});

describe('HP snapshots for the UI (no rule impact)', () => {
  it('reveal carries the HP before supports; effects and hits carry the HP after them', () => {
    const { state } = buildGame({
      p0: { stack: ['Goburimon'], attack: 'circle', support: 'Recovery Floppy' },
      p1: { stack: ['SnowGoburimon'], attack: 'circle', support: 'none' },
    });
    const { events } = resolveBattle(state);
    expect(events.find((e) => e.type === 'reveal')).toMatchObject({ hp: [500, 770] });
    expect(events.find((e) => e.type === 'effect')).toMatchObject({ hp: [800, 770] });
    const hits = events.filter((e) => e.type === 'hit');
    expect(hits[0]).toMatchObject({ hp: [800, 470] });
    expect(hits[1]).toMatchObject({ hp: [570, 470] });
  });
});

describe('attack snapshots for the UI', () => {
  it('an effect that forces attacks reports the attacks after it', () => {
    const { state } = buildGame({
      p0: { stack: ['Goburimon'], attack: 'triangle', support: 'Darkrizamon' },
      p1: { stack: ['Betamon'], attack: 'cross', support: 'none' },
    });
    const { events } = resolveBattle(state);
    expect(events.find((e) => e.type === 'effect' && e.source === 'support')).toMatchObject({ attacks: ['circle', 'circle'] });
  });
});

describe('simulation mode (0x801E6AA4 with a0 = 1, used by the CPU AI)', () => {
  it('returns the final HP of both players, as the real resolution computes it', () => {
    const { state } = buildGame({
      p0: { stack: ['Goburimon'], attack: 'circle', support: 'Agumon' },
      p1: { stack: ['SnowGoburimon'], attack: 'triangle', support: 'none' },
    });
    const real = resolveBattle(state).state;
    expect(simulateBattle(state)).toEqual([real.players[0].hp, real.players[1].hp]);
  });

  it('a KO reads as 0 HP, before revive or rounds are applied', () => {
    const { state } = buildGame({
      p0: { stack: ['Gigadramon'], attack: 'circle', support: 'none' },
      p1: { stack: ['Goburimon'], attack: 'circle', support: 'Phoenixmon' },
    });
    expect(simulateBattle(state)).toEqual([1480, 0]);
  });

  it('skips zone commands but keeps every value computed before them (Ogremon)', () => {
    const { state } = buildGame({
      p0: { stack: ['Goburimon'], dp: ['Agumon', 'Biyomon', 'Gabumon'], attack: 'circle', support: 'Ogremon' },
      p1: { stack: ['SnowGoburimon'], attack: 'circle', support: 'none' },
    });
    const before = structuredClone(state);
    expect(simulateBattle(state)[1]).toBe(0);
    expect(state).toEqual(before);
  });

  it('does not consume the random generator (Wizardmon discards and draws)', () => {
    const { state } = buildGame({
      p0: { stack: ['Goburimon'], hand: ['Agumon', 'Gabumon'], online: ['Biyomon', 'Palmon'], attack: 'circle', support: 'Wizardmon' },
      p1: { stack: ['SnowGoburimon'], attack: 'circle', support: 'none' },
    });
    expect(() => simulateBattle(state)).not.toThrow();
    expect(simulateBattle(state)).toEqual(simulateBattle({ ...state, rng: 1 }));
  });
});

describe('KO, revive and rounds', () => {
  it('KO sends the whole evolution stack to the Offline Pile and keeps the DP Slot', () => {
    const { state } = buildGame({
      p0: { stack: ['Gigadramon'], attack: 'circle', support: 'none' },
      p1: { stack: ['Greymon', 'Agumon'], dp: ['Biyomon'], attack: 'circle', support: 'none' },
    });
    const { state: s, events } = resolveBattle(state);
    expect(names(s, 1, 'stack')).toEqual([]);
    expect(names(s, 1, 'offline')).toEqual(expect.arrayContaining(['Greymon', 'Agumon']));
    expect(names(s, 1, 'dp')).toEqual(['Biyomon']);
    expect(s.players[0].rounds).toBe(1);
    expect(events).toContainEqual(expect.objectContaining({ type: 'roundWon', player: 0 }));
  });

  it('revive keeps the Digimon with the revive HP, but the round still counts', () => {
    const { state } = buildGame({
      p0: { stack: ['Gigadramon'], attack: 'circle', support: 'none' },
      p1: { stack: ['Goburimon'], attack: 'circle', support: 'Phoenixmon' },
    });
    const { state: s } = resolveBattle(state);
    expect(names(s, 1, 'stack')).toEqual(['Goburimon']);
    expect(s.players[1].hp).toBe(500);
    expect(s.players[0].rounds).toBe(1);
  });

  it('the third round wins the match (revive does not apply to it)', () => {
    const { state } = buildGame({
      p0: { stack: ['Gigadramon'], rounds: 2, attack: 'circle', support: 'none' },
      p1: { stack: ['Goburimon'], attack: 'circle', support: 'Phoenixmon' },
    });
    const { state: s } = resolveBattle(state);
    expect(s.winner).toBe(0);
    expect(s.phase.name).toBe('gameOver');
    expect(s.endReason).toBe('rounds');
  });
});
