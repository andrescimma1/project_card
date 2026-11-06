/**
 * The three action kinds of our game: Furia, Técnica and Instinto. They are categories (each creature
 * keeps its own attack names), and their icons replace the original ◯ △ ✕.
 *
 * Compatibility layer: the rules and the data read from the disc still name the three slots
 * circle / triangle / cross. The interface speaks in action kinds and converts only at that boundary,
 * so no damage, priority, counter or effect changes.
 */
import type { AttackSlot } from '../../engine/cards/types';

export type ActionKind = 'fury' | 'technique' | 'instinct';

/** In slot order: the same order as the powers array of the rules. */
export const ACTIONS: readonly ActionKind[] = ['fury', 'technique', 'instinct'];

const SLOT: Record<ActionKind, AttackSlot> = { fury: 'circle', technique: 'triangle', instinct: 'cross' };
const ACTION: Record<AttackSlot, ActionKind> = { circle: 'fury', triangle: 'technique', cross: 'instinct' };

/** Our action kind → the rules' slot. */
export const slotOf = (a: ActionKind): AttackSlot => SLOT[a];
/** The rules' slot → our action kind. */
export const actionOf = (s: AttackSlot): ActionKind => ACTION[s];
/** Index of the action in the rules' powers array. */
export const powerIndex = (a: ActionKind): number => ACTIONS.indexOf(a);
