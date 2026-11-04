/**
 * Shared vocabulary for the port of the original CPU AI (KAWSEG 0x801DFF2C..0x801E6AA4).
 * The AI reads the same fixed-slot zones our engine keeps (docs/research/04-motor-original.md §1),
 * so these helpers mirror the original counting routines one to one.
 */
import { DIGIVOLVE_TYPE_BY_CODE } from '../cards/romTables';
import type { Card, DigimonCard, DigivolveOptionType, Level, Specialty } from '../cards/types';
import { cardOf } from '../game/effects';
import type { PlayerState, Slot } from '../game/types';
import type { PsxRand } from './rand';

/**
 * CPU personality: DECK2.DEK record +0x66 bytes 0..3 (`OriginalDeck.ai`). SLUS 0x8003FE7C copies
 * them to the CPU player's flags: ai[0] → bits 22-23, ai[1] → 24-25, ai[2] → 26-27, ai[3] → 28-29.
 */
export type AiProfile = [number, number, number, number];

/** One 6-byte entry of the plan table at ctx+0x7C8 (one per hand slot). */
export interface PlanEntry {
  /** -1 no Digimon · 0 not reachable · 1 reachable · 2 needs more than one hand card */
  flag: number;
  /** DP still missing (100 when not a Digimon). */
  need: number;
  /** Copy of hand[i] (card ref or -1). */
  card: number;
  /** Digivolve Option chosen to reach `card` (or a duplicated option, phase 3), else -1. */
  extra: number;
}

/**
 * AI state that survives between decisions, as in the battle context: the plan table written by
 * decision 3 (DP) and read by decisions 4 (Digivolve Option) and 5 (digivolve).
 */
export interface AiMemory {
  T: PlanEntry[];
  /** ctx+0x7C4: index of the chosen entry (the original keeps a pointer), or null. */
  plan: number | null;
}

export function newAiMemory(): AiMemory {
  return { T: Array.from({ length: 4 }, () => ({ flag: -1, need: 100, card: -1, extra: -1 })), plan: null };
}

export interface AiCtx {
  profile: AiProfile;
  /** The AI's rand() (SLUS 0x80069124): 0..32767. */
  rand: Pick<PsxRand, 'next'>;
  memory: AiMemory;
}

/** Card record +0x1A low nibble. */
export const LEVEL_CODE: Record<Level, number> = { R: 0, A: 1, C: 2, U: 3 };
/** Card record +0x1A high nibble. */
export const SPECIALTY_CODE: Record<Specialty, number> = { fire: 0, ice: 1, nature: 2, darkness: 3, rare: 4 };

/** Card entry +0x14 / record +0x02. */
export const KIND_CODE = { digimon: 0, option: 1, digivolve: 2 } as const;
/** Digivolve Option record +0x1A (inverse of DIGIVOLVE_TYPE_BY_CODE). */
export const DV_TYPE_CODE: Record<DigivolveOptionType, number> = Object.fromEntries(
  Object.entries(DIGIVOLVE_TYPE_BY_CODE).map(([code, type]) => [type, Number(code)]),
) as Record<DigivolveOptionType, number>;

/** SLUS 0x8006E518: the 6 Armor-digivolution partners (lookup SLUS 0x80047A58). */
export const ARMOR_PARTNERS: readonly number[] = [175, 182, 190, 184, 183, 187];

/** KAWSEG 0x801FB9D8 (5 ids): cards that void the opponent's support. */
export const VOIDERS: readonly number[] = [80, 152, 168, 253, 289];
/** KAWSEG 0x801FB9A8 (24 ids): disruption of hand, deck, DP Slot or Offline Pile. */
export const DISRUPTORS: readonly number[] = [107, 113, 118, 139, 153, 154, 155, 156, 157, 158, 159, 160, 182, 190, 201, 212, 213, 214, 225, 247, 255, 257, 291, 292];
/** KAWSEG 0x801FB9E4 (33 ids): HP recovery (Ikkakumon 47 is in the ROM table although it does not heal). */
export const HEALERS: readonly number[] = [
  35, 38, 39, 47, 48, 52, 55, 70, 78, 87, 134, 142, 147, 166, 197, 206, 207, 208, 209, 210, 221, 222, 223, 224, 242, 243, 244, 246, 248, 259, 266, 274,
  286,
];

/** 0x801E0558: is the card ref (or -1) the card with this ROM id? */
export function isCardId(p: PlayerState, ref: Slot | -1, id: number): boolean {
  return ref !== null && ref !== -1 && p.cards[ref] === id;
}
export const inTable = (p: PlayerState, ref: Slot | -1, table: readonly number[]) => table.some((id) => isCardId(p, ref, id));
/** 0x801E05CC applied to a table, in table order: 1 + hand position of the first match, or 0. */
export function handPosOfTable(p: PlayerState, table: readonly number[]): number {
  for (const id of table) for (let i = 0; i < 4; i++) if (isCardId(p, p.hand[i], id)) return i + 1;
  return 0;
}

export function digimonAt(p: PlayerState, ref: Slot): DigimonCard | null {
  if (ref === null) return null;
  const c = cardOf(p, ref);
  return c.kind === 'digimon' ? c : null;
}

/** Enabled support actions (record +0xB4 + k*16, k = 0..2). */
export function supportActionCount(c: Card): number {
  return c.kind === 'digivolve' ? 0 : c.support.program.actions.filter((a) => a.enabled).length;
}

/** 0x801DFF2C: Digimon cards in hand. */
export function handDigimonCount(p: PlayerState): number {
  return p.hand.filter((r) => digimonAt(p, r) !== null).length;
}

/** 0x801E0148: Digimon in hand with that level. */
export function handCountLevel(p: PlayerState, level: number): number {
  return p.hand.filter((r) => {
    const c = digimonAt(p, r);
    return c !== null && LEVEL_CODE[c.level] === level;
  }).length;
}

/** 0x801E02D8: Digimon in hand whose printed specialty is `spec`. */
export function handCountSpecialty(p: PlayerState, spec: number): number {
  return p.hand.filter((r) => {
    const c = digimonAt(p, r);
    return c !== null && SPECIALTY_CODE[c.specialty] === spec;
  }).length;
}

/** 0x801E047C: Digimon in hand with that printed specialty and level. */
export function handCountSpecLevel(p: PlayerState, spec: number, level: number): number {
  return p.hand.filter((r) => {
    const c = digimonAt(p, r);
    return c !== null && SPECIALTY_CODE[c.specialty] === spec && LEVEL_CODE[c.level] === level;
  }).length;
}

/** 0x801E0210: Digimon in the Online Deck whose printed specialty is `spec`. */
export function onlineCountSpecialty(p: PlayerState, spec: number): number {
  return p.online.filter((r) => {
    const c = digimonAt(p, r);
    return c !== null && SPECIALTY_CODE[c.specialty] === spec;
  }).length;
}
