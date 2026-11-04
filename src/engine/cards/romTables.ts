/**
 * Lookup tables recovered from the original game (SLUS-01328).
 *
 * Confidence levels (strongest first):
 *  - 'code'      : read from the game's interpreter (battle overlay KAWSEG, loads at 0x801DDF38).
 *  - 'rom'       : read from an ID/label table in the executable or card file.
 *  - 'rom+text'  : data meaning matches the in-game text of every card that uses it.
 *  - 'inferred'  : symmetry/consistency only.
 *  - 'unknown'   : seen in the data, meaning not decoded yet.
 *
 * Addresses and full evidence: docs/research/02-formato-rom.md and 04-motor-original.md
 */
import type { ArithOp, Comparator, Confidence, CrossEffect, DigivolveOptionType, Level, Specialty } from './types';

/** Specialty nibble (high nibble of +0x1A). Text glyphs *a0..*a4 use the same order. */
export const SPECIALTY_BY_CODE: Specialty[] = ['fire', 'ice', 'nature', 'darkness', 'rare'];

/** Level nibble (low nibble of +0x1A): 0 R, 1 A, 2 C, 3 U. */
export const LEVEL_BY_CODE: Level[] = ['R', 'A', 'C', 'U'];

/** ✕ effect id -> name. Pointer table 0x8006E4BC in SLUS_013.28. */
export const CROSS_EFFECT_BY_CODE: CrossEffect[] = [
  'none',
  'firstAttack',
  'circleTo0',
  'triangleTo0',
  'crossTo0',
  'counterCircle',
  'counterTriangle',
  'counterCross',
  'crash',
  'eatUpHp',
  'jamming',
  'foeX3Fire',
  'foeX3Ice',
  'foeX3Nature',
  'foeX3Darkness',
  'foeX3Rare',
];

/** Resolution speed of each ✕ effect (byte table 0x8006E4FC in SLUS_013.28). 0 = never resolves. */
export const CROSS_EFFECT_SPEED: Record<CrossEffect, 0 | 1 | 2 | 3> = {
  none: 0,
  firstAttack: 2,
  circleTo0: 1,
  triangleTo0: 1,
  crossTo0: 1,
  counterCircle: 1,
  counterTriangle: 1,
  counterCross: 1,
  crash: 1,
  eatUpHp: 2,
  jamming: 3,
  foeX3Fire: 1,
  foeX3Ice: 1,
  foeX3Nature: 1,
  foeX3Darkness: 1,
  foeX3Rare: 1,
};

/** Digivolve option type byte. Rules per type: docs/research/04-motor-original.md. */
export const DIGIVOLVE_TYPE_BY_CODE: Record<number, DigivolveOptionType> = {
  0: 'special',
  1: 'warp',
  2: 'speed',
  3: 'mutant',
  4: 'digiDevolve',
  5: 'download',
  6: 'armorCrush',
  7: 'deArmor',
};

/** compare() jump table 0x801DE164 (6 entries); any other code returns false. */
export function comparatorFromCode(code: number): Comparator {
  return (['<', '<=', '>', '>=', '!=', '=='] as const)[code] ?? 'never';
}

/** arith() at 0x801E9ABC; any other code returns 0. */
export function arithFromCode(code: number): ArithOp {
  return (['add', 'sub', 'mul', 'div'] as const)[code] ?? 'zero';
}

interface VarInfo {
  name: string;
  confidence: Confidence;
}

/** getVar() at 0x801E7DD4 — jump table 0x801DDFD4, 29 cases. Id 0 is "literal". */
export const READ_VARS: Record<number, VarInfo> = {
  1: { name: 'own.specialty', confidence: 'code' },
  2: { name: 'opp.specialty', confidence: 'code' },
  3: { name: 'own.hp', confidence: 'code' },
  4: { name: 'opp.hp', confidence: 'code' },
  5: { name: 'own.power.circle', confidence: 'code' },
  6: { name: 'opp.power.circle', confidence: 'code' },
  7: { name: 'own.power.triangle', confidence: 'code' },
  8: { name: 'opp.power.triangle', confidence: 'code' },
  9: { name: 'own.power.cross', confidence: 'code' },
  10: { name: 'opp.power.cross', confidence: 'code' },
  11: { name: 'own.power[slot]', confidence: 'code' },
  12: { name: 'opp.power[slot]', confidence: 'code' },
  13: { name: 'own.level', confidence: 'code' },
  14: { name: 'opp.level', confidence: 'code' },
  15: { name: 'own.stackState', confidence: 'unknown' },
  16: { name: 'opp.stackState', confidence: 'unknown' },
  17: { name: 'own.attackSlot', confidence: 'code' },
  18: { name: 'opp.attackSlot', confidence: 'code' },
  19: { name: 'opp.supportCard.kind', confidence: 'code' },
  20: { name: 'own.isNotTurnPlayer', confidence: 'code' },
  21: { name: 'own.hand.count', confidence: 'code' },
  22: { name: 'opp.hand.count', confidence: 'code' },
  23: { name: 'own.dpSlot.count', confidence: 'code' },
  24: { name: 'opp.dpSlot.count', confidence: 'code' },
  25: { name: 'own.offline.isEmpty', confidence: 'code' },
  26: { name: 'temp', confidence: 'code' },
  27: { name: 'own.onlineDeck.count', confidence: 'code' },
  28: { name: 'opp.onlineDeck.count', confidence: 'code' },
};

/** setVar() at 0x801E81DC — jump table 0x801DE04C, 54 cases (unlisted ids in 0..0x35 are no-ops). */
export const WRITE_TARGETS: Record<number, VarInfo> = {
  0x00: { name: 'own.specialty', confidence: 'code' },
  0x01: { name: 'opp.specialty', confidence: 'code' },
  0x02: { name: 'own.hp', confidence: 'code' },
  0x03: { name: 'opp.hp', confidence: 'code' },
  0x04: { name: 'own.power.circle', confidence: 'code' },
  0x05: { name: 'opp.power.circle', confidence: 'code' },
  0x06: { name: 'own.power.triangle', confidence: 'code' },
  0x07: { name: 'opp.power.triangle', confidence: 'code' },
  0x08: { name: 'own.power.cross', confidence: 'code' },
  0x09: { name: 'opp.power.cross', confidence: 'code' },
  0x0a: { name: 'own.power[each slot]', confidence: 'code' },
  0x0b: { name: 'opp.power[each slot]', confidence: 'code' },
  0x10: { name: 'own.attackSlot', confidence: 'code' },
  0x11: { name: 'opp.attackSlot', confidence: 'code' },
  0x19: { name: 'temp', confidence: 'code' },
  0x1a: { name: 'cmd.own.hand.discardRandom', confidence: 'code' },
  0x1b: { name: 'cmd.opp.hand.discardRandom', confidence: 'code' },
  0x1c: { name: 'cmd.own.unknown1C', confidence: 'unknown' },
  0x1d: { name: 'cmd.opp.unknown1D', confidence: 'unknown' },
  0x1e: { name: 'cmd.own.hand.returnToOnlineDeck', confidence: 'code' },
  0x1f: { name: 'cmd.opp.hand.returnToOnlineDeck', confidence: 'inferred' },
  0x20: { name: 'cmd.own.onlineDeck.discardTop', confidence: 'code' },
  0x21: { name: 'cmd.opp.onlineDeck.discardTop', confidence: 'code' },
  0x22: { name: 'cmd.own.offline.moveTopToOnlineDeck', confidence: 'code' },
  0x23: { name: 'cmd.opp.offline.moveTopToOnlineDeck', confidence: 'code' },
  0x24: { name: 'cmd.own.dpSlot.discardNewest', confidence: 'code' },
  0x25: { name: 'cmd.opp.dpSlot.discardNewest', confidence: 'code' },
  0x2a: { name: 'cmd.own.onlineDeck.shuffle', confidence: 'code' },
  0x2b: { name: 'cmd.opp.onlineDeck.shuffle', confidence: 'code' },
  0x2c: { name: 'cmd.opp.digimonSupport.void', confidence: 'code' },
  0x2d: { name: 'cmd.opp.supportAndOption.void', confidence: 'code' },
  0x2e: { name: 'cmd.own.onlineDeck.fetchPartnerToHand', confidence: 'code' },
  0x2f: { name: 'cmd.opp.attackSlot.rotate', confidence: 'code' },
  0x30: { name: 'cmd.own.reviveOnKO', confidence: 'code' },
  0x31: { name: 'cmd.own.draw', confidence: 'code' },
  0x32: { name: 'cmd.opp.draw', confidence: 'code' },
  0x33: { name: 'cmd.own.attack.eatUpHp', confidence: 'code' },
  0x34: { name: 'cmd.own.counterattack', confidence: 'code' },
  0x35: { name: 'cmd.own.attackFirst', confidence: 'code' },
};

/** In-game text control codes -> readable tokens. */
export const TEXT_TOKENS: Record<string, string> = {
  '*a0': 'Fire',
  '*a1': 'Ice',
  '*a2': 'Nature',
  '*a3': 'Darkness',
  '*a4': 'Rare',
  '*b0': '◯',
  '*b1': '△',
  '*b2': '✕',
  '*b3': '□',
  '*e3': 'R',
  '*e4': 'C',
  '*e5': 'U',
  '*ea': 'A',
};

export function renderGameText(s: string): string {
  return s.replace(/\*[abe][0-9a-f]/g, (m) => TEXT_TOKENS[m] ?? `⟨${m.slice(1)}⟩`);
}
