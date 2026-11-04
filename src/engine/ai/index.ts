/**
 * The original CPU AI (KAWSEG 0x801DFF2C..0x801E6AA4), ported decision by decision.
 * Decision codes asked by the state machine (SLUS coroutine 0x80038F68):
 *   1 mulligan · 2 entrance · 3 DP + plan · 4 Digivolve Option · 5 digivolve · 6 attack · 7 support
 * Each answer is turned into the engine Action the state machine would perform; when the engine does
 * not allow it, the "pass" action of the phase is used (as the game silently does in those cases).
 */
import type { Action, GameState, PlayerId } from '../game/types';
import { legalActions } from '../game/turn';
import { aiAttack } from './attack';
import { aiDp } from './dp';
import { aiEntrance } from './entrance';
import { aiMulligan } from './mulligan';
import { aiDigivolve, aiDigivolveOption } from './option';
import { psxRand } from './rand';
import { aiSupport } from './support';
import { newAiMemory, type AiCtx, type AiProfile } from './view';

export type { AiCtx, AiProfile } from './view';

/** A CPU player: personality of its deck (DECK2.DEK +0x66), its rand() and its plan memory. */
export function createAi(profile: AiProfile, seed: number): AiCtx {
  return { profile: [...profile] as AiProfile, rand: psxRand(seed), memory: newAiMemory() };
}

export function chooseAiAction(state: GameState, player: PlayerId, ai: AiCtx): Action {
  const legal = legalActions(state, player);
  if (!legal.length) throw new Error('The CPU has no legal action');
  const ok = (a: Action) => legal.some((x) => JSON.stringify(x) === JSON.stringify(a));
  const or = (a: Action, fallback: Action): Action => (ok(a) ? a : fallback);

  switch (state.phase.name) {
    case 'mulligan':
      return or(aiMulligan(state, player, ai) ? { type: 'changeHand', player } : { type: 'keepHand', player }, { type: 'keepHand', player });
    case 'entrance':
      return or({ type: 'enter', player, card: aiEntrance(state, player, ai) }, legal[0]);
    case 'armorDigivolve':
      return { type: 'armorDigivolve', player }; // state 8: the CPU Armor-digivolves without being asked
    case 'dp': {
      const card = aiDp(state, player, ai);
      return card === -1 ? { type: 'skipDp', player } : or({ type: 'chargeDp', player, card }, { type: 'skipDp', player });
    }
    case 'digivolveOption': {
      const card = aiDigivolveOption(state, player, ai);
      const skip: Action = { type: 'skipDigivolveOption', player };
      return card === -1 ? skip : or({ type: 'playDigivolveOption', player, card }, skip);
    }
    case 'digivolve': {
      const card = aiDigivolve(state, player, ai);
      const skip: Action = { type: 'skipDigivolve', player };
      return card === -1 ? skip : or({ type: 'digivolve', player, card }, skip); // re-validated like 0x801E9F5C
    }
    case 'attack':
      return { type: 'chooseAttack', player, slot: aiAttack(state, player, ai) };
    case 'support':
      return or({ type: 'chooseSupport', player, choice: aiSupport(state, player, ai) }, { type: 'chooseSupport', player, choice: { from: 'none' } });
    default:
      return legal[0];
  }
}
