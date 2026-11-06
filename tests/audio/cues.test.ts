/**
 * Engine events → audiovisual cues. Pure translation: the rules are untouched, the cues only say what
 * the player should hear/see and when (relative to the scene that shows it).
 */
import { describe, expect, it } from 'vitest';
import { battleStepCues, planCues, type StepCtx } from '../../src/audio/cues';
import type { Cue } from '../../src/audio/bus';
import { feedSessionCues } from '../../src/audio/sessionCues';
import { cards } from '../../src/engine/cards/db';
import { decks } from '../../src/engine/cards/decks';
import type { DigimonCard } from '../../src/engine/cards/types';
import { applyAction, createGame, legalActions } from '../../src/engine/game/turn';
import type { GameEvent, PlayerId } from '../../src/engine/game/types';
import { buildScenes } from '../../src/game/scenes';
import { createSession } from '../../src/game/session';
import { digimon } from '../engine/build';

const names = (cs: Cue[]) => cs.map((c) => c.name);

describe('planCues (board events)', () => {
  it('counts exactly the scenes the session builds, over whole matches', () => {
    for (const seed of [3, 11, 29]) {
      let { state, events } = createGame({ decks: [decks[142].cards, decks[143].cards], seed, firstPlayer: (seed % 2) as PlayerId });
      const all: GameEvent[] = [...events];
      let scenes = buildScenes(events).length;
      for (let guard = 0; guard < 3000 && state.phase.name !== 'gameOver'; guard++) {
        const actor = ([0, 1] as PlayerId[]).find((w) => legalActions(state, w).length > 0)!;
        const acts = legalActions(state, actor);
        const r = applyAction(state, acts[(guard * 7 + seed) % acts.length]);
        scenes += buildScenes(r.events).length;
        all.push(...r.events);
        state = r.state;
      }
      expect(state.phase.name).toBe('gameOver');
      expect(planCues(all, { humans: [0] }).scenes).toBe(scenes);
    }
  });

  it('deals the opening draws one after another', () => {
    // only the player who opens the turn draws at the start (the other draws on their own turn)
    const { events } = createGame({ decks: [decks[142].cards, decks[143].cards], seed: 4, firstPlayer: 0 });
    const draws = planCues(events, { humans: [0] }).cues.filter((c) => c.name === 'CARD_DRAWN');
    expect(draws.length).toBe(events.filter((e) => e.type === 'draw').length);
    expect(draws.length).toBeGreaterThanOrEqual(4);
    for (let i = 1; i < draws.length; i++) expect(draws[i].delay!).toBeGreaterThan(draws[i - 1].delay!);
  });

  it('what happens after a battle waits for that battle to be shown', () => {
    const events: GameEvent[] = [
      { type: 'supportChosen', player: 1, from: 'hand' },
      { type: 'reveal', attacks: ['circle', 'cross'], hp: [500, 400] },
      { type: 'hit', attacker: 0, defender: 1, attackerCard: 0, defenderCard: 0, damage: 300, eaten: 0, hp: [500, 100], slot: 'circle' },
      { type: 'cardsDiscarded', player: 1, cards: [3], from: 'support' },
      { type: 'turnStart', player: 1, turnNumber: 3 },
      { type: 'draw', player: 1, card: 9 },
    ];
    const { cues, scenes } = planCues(events, { humans: [0] });
    expect(scenes).toBe(1);
    expect(cues.map((c) => [c.name, c.afterScenes])).toEqual([
      ['CARD_SET', 0],
      ['CARD_DISCARDED', 1],
      ['CARD_DRAWN', 1],
    ]);
  });

  it('what comes right before a cinematic is played quickly, so it does not drag over it', () => {
    const before: GameEvent[] = [
      { type: 'turnStart', player: 1, turnNumber: 1 },
      ...[1, 2, 3, 4].map((card): GameEvent => ({ type: 'draw', player: 1, card })),
      { type: 'enter', player: 1, card: 1, enteredAs: null },
      { type: 'dpCharged', player: 1, card: 2, dpTotal: 10 },
    ];
    const alone = planCues(before, { humans: [0] }).cues;
    const withScene = planCues([...before, { type: 'armorDigivolved', player: 1, card: 1, from: 187, to: 177 }], { humans: [0] }).cues;
    expect(withScene.length).toBe(alone.length);
    expect(Math.max(...withScene.map((c) => c.delay!))).toBeLessThanOrEqual(700);
    expect(Math.max(...alone.map((c) => c.delay!))).toBeGreaterThan(700);
  });

  it('only the CPU locking its attack makes a sound here (the human hears their own pick from the board)', () => {
    const events: GameEvent[] = [
      { type: 'attackChosen', player: 0 },
      { type: 'attackChosen', player: 1 },
    ];
    expect(names(planCues(events, { humans: [0] }).cues)).toEqual(['ATTACK_LOCKED']);
    expect(planCues(events, { humans: [0] }).cues[0].data?.player).toBe(1);
  });

  it('entering, charging DP and playing a Digivolve Option move a card onto the board', () => {
    const events: GameEvent[] = [
      { type: 'enter', player: 0, card: 1, enteredAs: null },
      { type: 'dpCharged', player: 1, card: 2, dpTotal: 30 },
      { type: 'digivolveOptionPlayed', player: 0, card: 4 },
    ];
    expect(names(planCues(events, { humans: [0] }).cues)).toEqual(['CARD_MOVED', 'CARD_PLACED', 'CARD_MOVED', 'DP_CHARGED', 'CARD_MOVED', 'OPTION_PLAYED']);
  });
});

describe('battleStepCues (battle replay)', () => {
  const agumon = digimon('Agumon');
  const gabumon = digimon('Gabumon');
  const ctx = (o: Partial<StepCtx> = {}): StepCtx => ({
    fighters: [agumon, gabumon],
    attacks: ['circle', 'triangle'],
    prev: { hp: [500, 400], powers: [[300, 200, 100], [250, 150, 100]] },
    max: [500, 400],
    turn: 0,
    humans: [0],
    ...o,
  });

  it('a hit swings with the attack identity and lands on the defender a moment later', () => {
    const hit: GameEvent = { type: 'hit', attacker: 0, defender: 1, attackerCard: 0, defenderCard: 0, damage: 300, eaten: 0, hp: [500, 100], slot: 'circle' };
    const cues = battleStepCues(hit, ctx());
    expect(cues[0]).toMatchObject({ name: 'ATTACK_RESOLVED', data: { player: 0, slot: 'circle' } });
    const land = cues.find((c) => c.name === 'HIT_TAKEN')!;
    expect(land.data).toMatchObject({ player: 1, slot: 'circle', damage: 300, lethal: false });
    expect(land.delay!).toBeGreaterThan(0);
    const ko = battleStepCues({ ...hit, damage: 400, hp: [500, 0] }, ctx());
    expect(ko.find((c) => c.name === 'HIT_TAKEN')!.data?.lethal).toBe(true);
  });

  it('a hit that does no damage is blocked, and Eat-up HP heals the attacker', () => {
    const blocked = battleStepCues({ type: 'hit', attacker: 1, defender: 0, attackerCard: 0, defenderCard: 0, damage: 0, eaten: 0, hp: [500, 400], slot: 'triangle' }, ctx());
    expect(names(blocked)).toEqual(['ATTACK_RESOLVED', 'ATTACK_BLOCKED']);
    const eat = battleStepCues({ type: 'hit', attacker: 1, defender: 0, attackerCard: 0, defenderCard: 0, damage: 200, eaten: 200, hp: [300, 600], slot: 'cross' }, ctx({ attacks: ['circle', 'cross'] }));
    expect(names(eat)).toContain('HP_RECOVERED');
  });

  it('a ✕ Counter that matches the rival attack sounds as a counterattack', () => {
    const counter = cards.find((c): c is DigimonCard => c.kind === 'digimon' && c.crossEffect === 'counterCircle')!;
    const cues = battleStepCues(
      { type: 'hit', attacker: 1, defender: 0, attackerCard: 0, defenderCard: 0, damage: 300, eaten: 0, hp: [200, 400], slot: 'cross' },
      ctx({ fighters: [agumon, counter], attacks: ['circle', 'cross'] }),
    );
    expect(names(cues)).toContain('COUNTER');
    expect(cues[0].data).toMatchObject({ slot: 'cross', effect: 'counterCircle' });
  });

  it('a support card flips, activates, and its outcome is heard', () => {
    const base = { type: 'effect' as const, player: 1 as PlayerId, source: 'support' as const, card: 5, speed: 2, attacks: ['circle', 'triangle'] as ['circle', 'triangle'] };
    const healed = battleStepCues({ ...base, voided: false, conditionsMet: true, hp: [500, 600] }, ctx());
    expect(names(healed)).toEqual(['CARD_REVEALED', 'SUPPORT_ACTIVATED', 'HP_RECOVERED']);
    const voided = battleStepCues({ ...base, voided: true, conditionsMet: false, hp: [500, 400] }, ctx());
    expect(names(voided)).toEqual(['CARD_REVEALED', 'SUPPORT_ACTIVATED', 'EFFECT_VOIDED']);
    const boosted = battleStepCues({ ...base, voided: false, conditionsMet: true, hp: [500, 400], powers: [[300, 200, 100], [500, 150, 100]] }, ctx());
    expect(names(boosted)).toContain('STAT_UP');
  });

  it('a round won is good news only for a human seat', () => {
    expect(battleStepCues({ type: 'roundWon', player: 0, rounds: 1 }, ctx())[0].data?.win).toBe(true);
    expect(battleStepCues({ type: 'roundWon', player: 1, rounds: 1 }, ctx())[0].data?.win).toBe(false);
  });
});

describe('feedSessionCues', () => {
  it('shuffles at the start and holds later draws until the cinematics before them are over', () => {
    const s = createSession();
    const got: Cue[] = [];
    const stop = feedSessionCues(s, (cs) => got.push(...cs));
    s.getState().start({ human: decks[142].cards, cpu: decks[143].cards, seed: 5, humanFirst: true });
    expect(got[0].name).toBe('DECK_SHUFFLED');
    expect(got.some((c) => c.name === 'CARD_DRAWN')).toBe(true);
    for (let guard = 0; guard < 300 && !s.getState().scenes.some((k) => k.kind === 'battle'); guard++) {
      const acts = legalActions(s.getState().game!, 0);
      if (!acts.length) break;
      s.getState().act(acts[0]);
    }
    expect(s.getState().scenes.some((k) => k.kind === 'battle')).toBe(true);
    const before = got.length;
    const log = s.getState().log.map((l) => l.event);
    // the first scene (a digivolution or the battle) holds every draw that comes after it
    const firstScene = log.findIndex((e) => e.type === 'digivolved' || e.type === 'armorDigivolved' || e.type === 'reveal');
    const drawsBeforeScene = log.slice(0, firstScene).filter((e) => e.type === 'draw').length;
    expect(got.filter((c) => c.name === 'CARD_DRAWN').length).toBe(drawsBeforeScene);
    expect(log.filter((e) => e.type === 'draw').length).toBeGreaterThan(drawsBeforeScene);
    while (s.getState().scenes.length) s.getState().popScene();
    expect(got.slice(before).some((c) => c.name === 'CARD_DRAWN')).toBe(true);
    stop();
  });
});
