import { describe, expect, it } from 'vitest';
import { buildScenes } from '../src/game/scenes';
import type { GameEvent } from '../src/engine/game/types';

const ev = {
  turn: (player: 0 | 1): GameEvent => ({ type: 'turnStart', player, turnNumber: 2 }),
  digi: (player: 0 | 1): GameEvent => ({ type: 'digivolved', player, card: 5, from: 1 }),
  reveal: (): GameEvent => ({ type: 'reveal', attacks: ['circle', 'cross'], hp: [500, 600] }),
  hit: (): GameEvent => ({ type: 'hit', attacker: 0, defender: 1, attackerCard: 0, defenderCard: 0, damage: 300, eaten: 0, hp: [500, 300], slot: 'circle' }),
  round: (): GameEvent => ({ type: 'roundWon', player: 0, rounds: 1 }),
};

describe('scene builder', () => {
  it('turns a digivolution into its own scene', () => {
    expect(buildScenes([ev.digi(0)])).toEqual([{ kind: 'digivolve', player: 0, card: 5, from: 1 }]);
  });

  it('an Armor-digivolution on entry is a digivolve scene that remembers the partner it came from', () => {
    expect(buildScenes([{ type: 'armorDigivolved', player: 1, card: 3, from: 187, to: 177 }])).toEqual([
      { kind: 'digivolve', player: 1, card: 3, from: null, fromId: 187, armor: true },
    ]);
  });

  it('groups a battle from the reveal up to the next turn start', () => {
    const scenes = buildScenes([ev.reveal(), ev.hit(), ev.round(), ev.turn(1), ev.digi(1)]);
    expect(scenes.map((s) => s.kind)).toEqual(['battle', 'digivolve']);
    expect(scenes[0]).toMatchObject({ kind: 'battle', events: [ev.reveal(), ev.hit(), ev.round()] });
  });

  it('ignores events with no cinematic', () => {
    expect(buildScenes([ev.turn(0), { type: 'draw', player: 0, card: 3 }])).toEqual([]);
  });
});
