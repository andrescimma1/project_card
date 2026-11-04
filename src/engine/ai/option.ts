/**
 * CPU AI — decision 4 (state 14, Digivolve Option: 0x801DFFD4 + 0x801E4E08) and decision 5
 * (states 18/19, digivolve: 0x801E3C00). Both trust the plan left by decision 3 (AiMemory).
 */
import type { DigimonCard } from '../cards/types';
import { isAbnormal, playerDp } from '../game/digivolve';
import { cardOf } from '../game/effects';
import type { CardRef, GameState, PlayerId } from '../game/types';
import { top } from '../game/zones';
import { DV_TYPE_CODE, LEVEL_CODE, SPECIALTY_CODE, type AiCtx } from './view';

/** Decision 4: the first Digivolve Option in the plan table (not re-checked against the hand), or -1. */
export function aiDigivolveOption(state: GameState, cpu: PlayerId, ai: AiCtx): CardRef | -1 {
  const p = state.players[cpu];
  const options = p.hand.filter((r) => r !== null && cardOf(p, r).kind === 'digivolve').length; // 0x801DFFD4
  if (options === 0) return -1;
  for (const t of ai.memory.T) if (t.extra !== -1) return t.extra; // 0x801E4E08
  return -1;
}

/**
 * Decision 5: the planned target, or -1. Without an option only the DP are checked; the state
 * machine then re-validates the card with the player's rule (0x801E9F5C).
 */
export function aiDigivolve(state: GameState, cpu: PlayerId, ai: AiCtx): CardRef | -1 {
  const p = state.players[cpu];
  const active = top(p.stack);
  if (active === null) return -1;
  const plan = ai.memory.plan;
  if (plan === null) return -1;
  const card = ai.memory.T[plan].card;
  if (card === -1) return -1;
  const t = cardOf(p, card);
  if (t.kind !== 'digimon') return -1;
  const dp = playerDp(p);
  const opt = p.digivolveOption === null ? null : cardOf(p, p.digivolveOption);
  if (!opt || opt.kind !== 'digivolve') return dp < t.dpRequired ? -1 : card;
  const spec = SPECIALTY_CODE[p.specialty];
  let lvl = LEVEL_CODE[(cardOf(p, active) as DigimonCard).level];
  const tLvl = LEVEL_CODE[t.level];
  const tSpec = SPECIALTY_CODE[t.specialty];
  switch (DV_TYPE_CODE[opt.digivolveType]) {
    case 0: // Special
      if (lvl === LEVEL_CODE.A) return -1;
      if (lvl === LEVEL_CODE.R) lvl = 1;
      if (lvl + 1 !== tLvl) return -1;
      return dp + 20 < t.dpRequired ? -1 : card;
    case 1: // Warp
      if (lvl !== LEVEL_CODE.R || tLvl !== LEVEL_CODE.U || tSpec !== spec) return -1;
      return dp < t.dpRequired ? -1 : card;
    case 2: // Speed
      if (lvl === LEVEL_CODE.A) return -1;
      if (lvl === LEVEL_CODE.R) lvl = 1;
      if (isAbnormal(p) || lvl + 1 !== tLvl) return -1;
      return tSpec === spec ? card : -1;
    case 3: // Mutant
      if (dp < t.dpRequired) return -1;
      return tLvl === lvl ? card : -1;
    default:
      return card;
  }
}
