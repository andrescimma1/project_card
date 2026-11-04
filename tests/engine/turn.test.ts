/**
 * Turn flow, against the state machine read from the game (SLUS 0x80034260) and the player
 * digivolve check (KAWSEG 0x801E9F5C). See docs/research/04-motor-original.md §2-§3.
 */
import { describe, expect, it } from 'vitest';
import { applyAction, beginTurn, canDigivolve, createGame, legalActions, validateDeck } from '../../src/engine/game/turn';
import { buildGame, cardId, names } from './build';

const many = (name: string, n: number) => Array(n).fill(name);

describe('setup and preparation', () => {
  const deck = [...many('Agumon', 4), ...many('Biyomon', 4), ...many('Greymon', 4), ...many('Attack Chip', 4), ...many('Goburimon', 4), ...many('Solarmon', 4), ...many('Recovery Floppy', 4), ...many('Tyrannomon', 2)].map(cardId);

  it('validates a deck: 30 cards, at most 4 copies, at least one Digimon', () => {
    expect(validateDeck(deck)).toEqual([]);
    expect(validateDeck(deck.slice(1))).not.toEqual([]);
    expect(validateDeck([...deck.slice(0, 25), ...many('Agumon', 5).map(cardId)])).not.toEqual([]);
    expect(validateDeck(many('Attack Chip', 30).map(cardId))).not.toEqual([]);
  });

  it('createGame is deterministic for a seed and only the first player draws', () => {
    const a = createGame({ decks: [deck, deck], seed: 7, firstPlayer: 0 });
    const b = createGame({ decks: [deck, deck], seed: 7, firstPlayer: 0 });
    expect(a.state).toEqual(b.state);
    expect(a.state.players[0].hand.filter((x) => x !== null)).toHaveLength(4);
    expect(a.state.players[1].hand.filter((x) => x !== null)).toHaveLength(0);
    expect(a.state.turn).toBe(0);
  });

  it('with no Digimon in play or in hand, the hand is redrawn automatically', () => {
    const { state } = buildGame({
      phase: { name: 'turnStart' },
      p0: { online: [...many('Attack Chip', 4), 'Agumon', ...many('Recovery Floppy', 3)] },
      p1: { stack: ['Goburimon'] },
    });
    const { state: s, events } = beginTurn(state);
    expect(names(s, 0, 'offline')).toEqual(many('Attack Chip', 4));
    expect(names(s, 0, 'hand')).toContain('Agumon');
    expect(events).toContainEqual(expect.objectContaining({ type: 'handChanged', player: 0, auto: true }));
    expect(s.phase.name).toBe('mulligan');
  });

  it('with no Digimon in play, in hand or in the deck, that player loses', () => {
    const { state } = buildGame({ phase: { name: 'turnStart' }, p0: { hand: ['Attack Chip'] }, p1: { stack: ['Goburimon'] } });
    const { state: s } = beginTurn(state);
    expect(s.winner).toBe(1);
    expect(s.endReason).toBe('noDigimon');
  });

  it('an empty deck is not a loss while a Digimon is in play', () => {
    const { state } = buildGame({ phase: { name: 'turnStart' }, p0: { stack: ['Agumon'] }, p1: { stack: ['Goburimon'] } });
    const { state: s } = beginTurn(state);
    expect(s.winner).toBeNull();
    expect(s.phase.name).toBe('mulligan');
  });

  it('changeHand discards the whole hand and redraws', () => {
    const { state } = buildGame({
      phase: { name: 'mulligan' },
      p0: { hand: many('Attack Chip', 4), online: many('Agumon', 6) },
    });
    const { state: s } = applyAction(state, { type: 'changeHand', player: 0 });
    expect(names(s, 0, 'offline')).toEqual(many('Attack Chip', 4));
    expect(names(s, 0, 'hand')).toEqual(many('Agumon', 4));
  });

  it('entering with a Champion halves HP and powers; with an Ultimate quarters them', () => {
    const c = buildGame({ phase: { name: 'entrance' }, p0: { hand: ['Greymon'] } });
    const sc = applyAction(c.state, { type: 'enter', player: 0, card: c.refs[0].Greymon[0] }).state;
    expect(sc.players[0]).toMatchObject({ hp: 420, powers: [300, 210, 0], enteredAs: 'C' });
    expect(sc.phase.name).toBe('dp');
    const u = buildGame({ phase: { name: 'entrance' }, p0: { hand: ['WarGreymon'] } });
    const su = applyAction(u.state, { type: 'enter', player: 0, card: u.refs[0].WarGreymon[0] }).state;
    expect(su.players[0]).toMatchObject({ hp: 410, powers: [220, 160, 90], enteredAs: 'U' });
  });
});

describe('DP and digivolution', () => {
  it('only one card can be charged to the DP Slot per turn', () => {
    const { state, refs } = buildGame({ phase: { name: 'dp' }, p0: { stack: ['Agumon'], hand: ['Biyomon', 'Gabumon'] } });
    const { state: s } = applyAction(state, { type: 'chargeDp', player: 0, card: refs[0].Biyomon[0] });
    expect(names(s, 0, 'dp')).toEqual(['Biyomon']);
    expect(s.phase.name).toBe('digivolveOption');
    expect(() => applyAction(s, { type: 'chargeDp', player: 0, card: refs[0].Gabumon[0] })).toThrow();
  });

  it('normal digivolution: next level, same specialty, enough DP; DP cards go to the Offline Pile', () => {
    const { state, refs } = buildGame({
      phase: { name: 'digivolve' },
      p0: { stack: ['Agumon'], hand: ['Greymon'], dp: ['MoriShellmon', 'Biyomon'] },
      p1: { stack: ['Goburimon'] },
    });
    expect(canDigivolve(state, 0, refs[0].Greymon[0])).toBe(true);
    const { state: s } = applyAction(state, { type: 'digivolve', player: 0, card: refs[0].Greymon[0] });
    expect(names(s, 0, 'stack')).toEqual(['Greymon', 'Agumon']);
    expect(s.players[0].hp).toBe(850);
    expect(names(s, 0, 'dp')).toEqual([]);
    expect(names(s, 0, 'offline')).toEqual(expect.arrayContaining(['MoriShellmon', 'Biyomon']));
    expect(s.phase.name).toBe('attack');
  });

  it('rejects digivolution without enough DP, to another specialty, or skipping a level', () => {
    const lowDp = buildGame({ phase: { name: 'digivolve' }, p0: { stack: ['Agumon'], hand: ['Greymon'], dp: ['Biyomon'] } });
    expect(canDigivolve(lowDp.state, 0, lowDp.refs[0].Greymon[0])).toBe(false);
    const color = buildGame({ phase: { name: 'digivolve' }, p0: { stack: ['Agumon'], hand: ['Seadramon'], dp: ['MoriShellmon', 'Biyomon'] } });
    expect(canDigivolve(color.state, 0, color.refs[0].Seadramon[0])).toBe(false);
    const skip = buildGame({ phase: { name: 'digivolve' }, p0: { stack: ['Agumon'], hand: ['WarGreymon'], dp: ['MoriShellmon', 'MoriShellmon'] } });
    expect(canDigivolve(skip.state, 0, skip.refs[0].WarGreymon[0])).toBe(false);
  });

  it('a directly-entered Champion can digivolve normally and recovers full stats', () => {
    const { state, refs } = buildGame({
      phase: { name: 'digivolve' },
      p0: { stack: ['Greymon'], enteredAs: 'C', hp: 420, powers: [300, 210, 0], hand: ['MetalGreymon'], dp: ['MoriShellmon'] },
      p1: { stack: ['Goburimon'] },
    });
    const { state: s } = applyAction(state, { type: 'digivolve', player: 0, card: refs[0].MetalGreymon[0] });
    expect(s.players[0]).toMatchObject({ hp: 1540, enteredAs: null });
  });

  it('the specialty compared is the CURRENT one (changed by a support)', () => {
    const { state, refs } = buildGame({
      phase: { name: 'digivolve' },
      p0: { stack: ['Agumon'], specialty: 'ice', hand: ['Seadramon'], dp: ['MoriShellmon', 'Biyomon'] },
    });
    expect(canDigivolve(state, 0, refs[0].Seadramon[0])).toBe(true);
  });

  it('Special Digivolve: any specialty, next level, costs 20 DP less', () => {
    const { state, refs } = buildGame({
      phase: { name: 'digivolveOption' },
      p0: { stack: ['Agumon'], hand: ['Special Digivolve', 'Seadramon'], dp: ['Biyomon'] },
    });
    expect(canDigivolve(state, 0, refs[0].Seadramon[0])).toBe(false);
    const { state: s } = applyAction(state, { type: 'playDigivolveOption', player: 0, card: refs[0]['Special Digivolve'][0] });
    expect(s.phase.name).toBe('digivolve');
    expect(canDigivolve(s, 0, refs[0].Seadramon[0])).toBe(true);
  });

  it('Speed Digivolve ignores DP but not in the abnormal state', () => {
    const normal = buildGame({ phase: { name: 'digivolveOption' }, p0: { stack: ['Greymon'], hand: ['Speed Digivolve', 'MetalGreymon'] } });
    const s1 = applyAction(normal.state, { type: 'playDigivolveOption', player: 0, card: normal.refs[0]['Speed Digivolve'][0] }).state;
    expect(canDigivolve(s1, 0, normal.refs[0].MetalGreymon[0])).toBe(true);
    const abnormal = buildGame({ phase: { name: 'digivolveOption' }, p0: { stack: ['Greymon'], enteredAs: 'C', hand: ['Speed Digivolve', 'MetalGreymon'] } });
    const s2 = applyAction(abnormal.state, { type: 'playDigivolveOption', player: 0, card: abnormal.refs[0]['Speed Digivolve'][0] }).state;
    expect(canDigivolve(s2, 0, abnormal.refs[0].MetalGreymon[0])).toBe(false);
  });
});

describe('flag bit 30 ("settled"): set at the battle step (state 23, SLUS 0x80037044), cleared on every stat load', () => {
  it('a Digimon that just entered is not settled until its turn reaches the battle step', () => {
    // left over from a Digimon that was KO'd: nothing clears it until the next stat load
    const { state, refs } = buildGame({ phase: { name: 'entrance' }, p0: { hand: ['Agumon'], online: ['Gabumon'], settled: true }, p1: { stack: ['Gabumon'] } });
    let s = applyAction(state, { type: 'enter', player: 0, card: refs[0].Agumon[0] }).state;
    expect(s.players[0].settled).toBe(false);
    s = applyAction(s, { type: 'skipDp', player: 0 }).state;
    s = applyAction(s, { type: 'skipDigivolveOption', player: 0 }).state;
    s = applyAction(s, { type: 'skipDigivolve', player: 0 }).state;
    expect(s.phase.name).toBe('attack');
    expect(s.players[0].settled).toBe(true);
  });

  it('digivolving clears it; reaching the battle step sets it again', () => {
    const { state, refs } = buildGame({
      phase: { name: 'digivolve' },
      p0: { stack: ['Agumon'], hand: ['Greymon'], dp: ['MoriShellmon', 'Biyomon'], settled: true },
      p1: {},
    });
    const s = applyAction(state, { type: 'digivolve', player: 0, card: refs[0].Greymon[0] }).state;
    // the opponent has no Digimon: no battle, but the turn still went through state 23
    expect(s.players[0].settled).toBe(true);
    expect(s.turn).toBe(1);
  });
});

describe('battle flow', () => {
  it('both choose attacks; the non-turn player picks support first; then the turn passes', () => {
    const { state } = buildGame({
      phase: { name: 'attack' },
      p0: { stack: ['Goburimon'] },
      p1: { stack: ['SnowGoburimon'], online: many('Agumon', 5) },
    });
    let s = applyAction(state, { type: 'chooseAttack', player: 0, slot: 'circle' }).state;
    s = applyAction(s, { type: 'chooseAttack', player: 1, slot: 'circle' }).state;
    expect(s.phase).toEqual({ name: 'support', chooser: 1 });
    expect(legalActions(s, 0)).toEqual([]);
    s = applyAction(s, { type: 'chooseSupport', player: 1, choice: { from: 'none' } }).state;
    expect(s.phase).toEqual({ name: 'support', chooser: 0 });
    const r = applyAction(s, { type: 'chooseSupport', player: 0, choice: { from: 'none' } });
    expect(r.state.players[1].hp).toBe(770 - 300);
    expect(r.state.turn).toBe(1);
    expect(names(r.state, 1, 'hand')).toEqual(many('Agumon', 4));
  });

  it('there is no battle when the opponent has no Digimon', () => {
    const { state } = buildGame({
      phase: { name: 'digivolve' },
      p0: { stack: ['Agumon'] },
      p1: { online: many('Agumon', 5) },
    });
    const { state: s, events } = applyAction(state, { type: 'skipDigivolve', player: 0 });
    expect(events).toContainEqual(expect.objectContaining({ type: 'noBattle' }));
    expect(s.turn).toBe(1);
  });

  it('rejects actions out of phase or by the wrong player', () => {
    const { state, refs } = buildGame({ phase: { name: 'dp' }, p0: { stack: ['Agumon'], hand: ['Attack Chip'] } });
    expect(() => applyAction(state, { type: 'chargeDp', player: 0, card: refs[0]['Attack Chip'][0] })).toThrow();
    expect(() => applyAction(state, { type: 'skipDp', player: 1 })).toThrow();
  });
});
