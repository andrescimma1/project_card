/**
 * CPU AI — decision 1 (state 4): keep the hand (false) or change all cards (true). KAWSEG 0x801E19EC.
 * The state machine asks again after every change, until the AI keeps or the deck is empty.
 */
import type { DigimonCard } from '../cards/types';
import { isAbnormal, playerDp } from '../game/digivolve';
import { cardOf } from '../game/effects';
import type { GameState, PlayerId, PlayerState } from '../game/types';
import { count, top } from '../game/zones';
import { checkHand } from './dp';
import { evaluate } from './evaluate';
import {
  digimonAt,
  handCountLevel,
  handDigimonCount,
  handPosOfTable,
  HEALERS,
  LEVEL_CODE,
  SPECIALTY_CODE,
  VOIDERS,
  type AiCtx,
} from './view';

const other = (x: PlayerId): PlayerId => (x === 0 ? 1 : 0);

/** 0x801E0080: Digimon in the Online Deck with that level (the AI knows its deck contents). */
function onlineCountLevel(p: PlayerState, level: number): number {
  return p.online.filter((r) => {
    const c = digimonAt(p, r);
    return c !== null && LEVEL_CODE[c.level] === level;
  }).length;
}

/** 0x801E03A0: Digimon in the Online Deck with that printed specialty and level. */
function onlineCountSpecLevel(p: PlayerState, spec: number, level: number): number {
  return p.online.filter((r) => {
    const c = digimonAt(p, r);
    return c !== null && SPECIALTY_CODE[c.specialty] === spec && LEVEL_CODE[c.level] === level;
  }).length;
}

/**
 * 0x801E0650: a Digivolve Option whose card-entry byte +0x15 equals `index`. That byte is the index
 * within the card type (SLUS 0x80046BAC), i.e. id − 293 — not the option type the branches below
 * seem written for. The original behaviour is kept.
 */
function handHasOption(p: PlayerState, index: number): boolean {
  return p.hand.some((r) => r !== null && cardOf(p, r).kind === 'digivolve' && p.cards[r] - 293 === index);
}

/** 0x801E0708: hand Digimon of the active Digimon's level with more printed HP than the current HP. */
function handSameLevelMoreHp(p: PlayerState, active: number): number {
  const lvl = LEVEL_CODE[(cardOf(p, active) as DigimonCard).level];
  return p.hand.filter((r) => {
    const c = digimonAt(p, r);
    return c !== null && LEVEL_CODE[c.level] === lvl && p.hp < c.hp;
  }).length;
}

function byPersonality(p: PlayerState, deckLeft: number, ai: AiCtx, onThree: boolean): boolean {
  switch (ai.profile[2] & 3) {
    case 0:
      return deckLeft >= 3 * (3 - p.rounds);
    case 1:
      return deckLeft >= 4 * (3 - p.rounds);
    case 2:
      return ai.rand.next() % 3 === 0;
    default:
      return onThree;
  }
}

export function aiMulligan(state: GameState, cpu: PlayerId, ai: AiCtx): boolean {
  const p = state.players[cpu];
  const o = state.players[other(cpu)];
  const deckLeft = count(p.online);
  if (deckLeft === 0) return false;
  const active = top(p.stack);

  if (active === null) {
    if (handDigimonCount(p) === 0) return true;
    if (handCountLevel(p, LEVEL_CODE.R) !== 0) return false;
    for (let k = 0; k < 8; k++) {
      if (!handHasOption(p, k) || handDigimonCount(p) < 2) continue;
      if (k === 0 && playerDp(p) >= 20 && handCountLevel(p, LEVEL_CODE.C) !== 0) return false;
      if (k === 2) for (let s = 0; s < 5; s++) if (onlineCountSpecLevel(p, s, LEVEL_CODE.C) !== 0 && onlineCountSpecLevel(p, s, LEVEL_CODE.U) !== 0) return false;
      if (k === 3) for (let l = 2; l < 4; l++) if (playerDp(p) >= l * 20 && handCountLevel(p, l) >= 2) return false;
      if (k === 5) return false;
    }
    if (onlineCountLevel(p, LEVEL_CODE.R) === 0) return false;
    return byPersonality(p, deckLeft, ai, false);
  }

  // cases 6 and 7 exist in the jump table but the loop stops at 6
  for (let k = 0; k < 6; k++) {
    if (!handHasOption(p, k) || handDigimonCount(p) === 0) continue;
    const lvl = LEVEL_CODE[(cardOf(p, active) as DigimonCard).level];
    const base = lvl === LEVEL_CODE.R ? 1 : lvl;
    if (k === 0 && handCountLevel(p, base + 1) !== 0) return false;
    if (k === 1 && lvl === LEVEL_CODE.R && handCountLevel(p, LEVEL_CODE.U) !== 0) return false;
    if (k === 2 && !isAbnormal(p) && onlineCountSpecLevel(p, SPECIALTY_CODE[p.specialty], base + 1) !== 0) return false;
    if (k === 3 && handSameLevelMoreHp(p, active) !== 0) return false;
    if (k === 5) return false;
  }

  if (o.rounds !== 2) return false;
  if (handPosOfTable(p, HEALERS) !== 0) {
    if (handPosOfTable(o, VOIDERS) === 0) return false;
    const foe = top(o.stack);
    const cross = foe === null ? null : cardOf(o, foe);
    if (!(cross && cross.kind === 'digimon' && cross.crossEffect === 'jamming')) return false;
  }
  if (evaluate(state, cpu).ret === 0) return false;
  if (checkHand(p, ai.memory) === 1) return false;
  return byPersonality(p, deckLeft, ai, true);
}
