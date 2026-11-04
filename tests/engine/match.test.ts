/**
 * Whole-match robustness: two decks play random LEGAL actions until the game ends.
 * Checks the engine never throws, always terminates, and keeps the 30 cards of each player.
 */
import { describe, expect, it } from 'vitest';
import { applyAction, createGame, legalActions } from '../../src/engine/game/turn';
import type { GameState, PlayerId } from '../../src/engine/game/types';
import { cardsIn } from '../../src/engine/game/zones';
import { buildGame, cardId, names } from './build';

const many = (name: string, n: number) => Array<string>(n).fill(name);

const fireDeck = [
  ...many('Agumon', 4), ...many('Biyomon', 4), ...many('Greymon', 4), ...many('Birdramon', 3), ...many('MetalGreymon', 2),
  ...many('Phoenixmon', 2), ...many('Attack Chip', 3), ...many('Recovery Floppy', 3), ...many('Special Digivolve', 2), ...many('Devil\'s Chip', 3),
].map(cardId);
const iceDeck = [
  ...many('Gabumon', 4), ...many('Betamon', 4), ...many('Seadramon', 4), ...many('Frigimon', 3), ...many('MetalSeadramon', 2),
  ...many('WaruSeadramon', 2), ...many('Attack Chip', 3), ...many('Recovery Floppy', 3), ...many('Warp Digivolve', 2), ...many('Golden Banana', 3),
].map(cardId);

function cardTotal(s: GameState, w: PlayerId): number {
  const p = s.players[w];
  const supportCards = p.support && p.support.kind !== 'none' ? 1 : 0;
  const opt = p.digivolveOption !== null ? 1 : 0;
  return [p.online, p.offline, p.hand, p.dp, p.stack].reduce((n, z) => n + cardsIn(z).length, 0) + supportCards + opt;
}

function lcg(seed: number) {
  let x = seed >>> 0;
  return () => ((x = (Math.imul(x, 1664525) + 1013904223) >>> 0) / 4294967296);
}

describe('full random matches', () => {
  it.each([1, 2, 3, 4, 5, 6, 7, 8])('seed %i reaches game over with consistent card counts', (seed) => {
    const pick = lcg(seed * 7919);
    let { state } = createGame({ decks: [fireDeck, iceDeck], seed, firstPlayer: (seed % 2) as PlayerId });
    let steps = 0;
    while (state.phase.name !== 'gameOver' && steps < 5000) {
      const actor = ([0, 1] as PlayerId[]).find((w) => legalActions(state, w).length > 0);
      expect(actor).toBeDefined();
      const options = legalActions(state, actor!);
      state = applyAction(state, options[Math.floor(pick() * options.length)]).state;
      for (const w of [0, 1] as PlayerId[]) expect(cardTotal(state, w)).toBe(30);
      steps++;
    }
    expect(state.phase.name).toBe('gameOver');
    expect(state.winner).not.toBeNull();
  });
});

describe('remaining Digivolve Options', () => {
  it('Warp Digivolve: R to U of the same specialty, paying the U requirement', () => {
    const { state, refs } = buildGame({
      phase: { name: 'digivolveOption' },
      p0: { stack: ['Agumon'], hand: ['Warp Digivolve', 'WarGreymon'], dp: ['MoriShellmon', 'MoriShellmon'] }, // 60 >= 50
    });
    const s = applyAction(state, { type: 'playDigivolveOption', player: 0, card: refs[0]['Warp Digivolve'][0] }).state;
    expect(legalActions(s, 0)).toContainEqual({ type: 'digivolve', player: 0, card: refs[0].WarGreymon[0] });
  });

  it('Mutant Digivolve: same level, any specialty', () => {
    const { state, refs } = buildGame({
      phase: { name: 'digivolveOption' },
      p0: { stack: ['Greymon'], hand: ['Mutant Digivolve', 'Seadramon'], dp: ['MoriShellmon', 'Biyomon'] },
    });
    const s = applyAction(state, { type: 'playDigivolveOption', player: 0, card: refs[0]['Mutant Digivolve'][0] }).state;
    expect(legalActions(s, 0)).toContainEqual({ type: 'digivolve', player: 0, card: refs[0].Seadramon[0] });
  });

  it('Digi-devolve needs at least two stacked cards and returns to the card below', () => {
    const { state, refs } = buildGame({
      phase: { name: 'digivolveOption' },
      p0: { stack: ['Greymon', 'Agumon'], hand: ['Digi-devolve'] },
      p1: { stack: ['Goburimon'] },
    });
    const s = applyAction(state, { type: 'playDigivolveOption', player: 0, card: refs[0]['Digi-devolve'][0] }).state;
    expect(names(s, 0, 'stack')).toEqual(['Agumon']);
    expect(s.players[0].hp).toBe(570 * 2);
    const single = buildGame({ phase: { name: 'digivolveOption' }, p0: { stack: ['Greymon'], hand: ['Digi-devolve'] } });
    expect(legalActions(single.state, 0)).toEqual([{ type: 'skipDigivolveOption', player: 0 }]);
  });
});
