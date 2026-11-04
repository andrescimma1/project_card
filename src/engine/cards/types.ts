/**
 * Card data model for Digimon Digital Card Battle (SLUS-01328).
 *
 * Every field below maps to a byte range of the original card table `CARD2.CDD`
 * (inside B.DRV on the disc). See docs/research/02-formato-rom.md for the byte map.
 * Nothing here is invented: fields whose meaning is not yet proven are kept
 * under `unknown` with their raw values so they can be decoded later.
 */

export type Specialty = 'fire' | 'ice' | 'nature' | 'darkness' | 'rare';
/** ROM level code 0..3 -> R (Rookie), A (Armor), C (Champion), U (Ultimate). */
export type Level = 'R' | 'A' | 'C' | 'U';
export type AttackSlot = 'circle' | 'triangle' | 'cross';

/** Cross (✕) attack special effect, ROM byte +0xE4. Order = pointer table at 0x8006E4BC in SLUS_013.28. */
export type CrossEffect =
  | 'none'
  | 'firstAttack'
  | 'circleTo0'
  | 'triangleTo0'
  | 'crossTo0'
  | 'counterCircle'
  | 'counterTriangle'
  | 'counterCross'
  | 'crash'
  | 'eatUpHp'
  | 'jamming'
  | 'foeX3Fire'
  | 'foeX3Ice'
  | 'foeX3Nature'
  | 'foeX3Darkness'
  | 'foeX3Rare';

export interface Attack {
  name: string;
  power: number;
  /** Battle animation id (ROM u16). Presentation only. */
  animId: number;
  /** Sound / hit-effect id (ROM u16, semantics unconfirmed). Presentation only. */
  fxId: number;
}

/**
 * How confident we are that a decoded meaning is right.
 *  - 'code'     : read from the game's own interpreter code (KAWSEG overlay). Strongest.
 *  - 'rom'      : read from a data/label table of the game.
 *  - 'rom+text' : data meaning matches the in-game text of every card using it.
 *  - 'inferred' : by symmetry/consistency only.
 *  - 'unknown'  : seen in the data, meaning not decoded.
 */
export type Confidence = 'code' | 'rom' | 'rom+text' | 'inferred' | 'unknown';

export interface VarRef {
  /** Raw variable id as stored in the ROM. */
  id: number;
  /** Decoded name, e.g. "own.hp". `null` when the id is not decoded yet. */
  name: string | null;
  confidence: Confidence;
}

/**
 * Comparator byte. The game's compare() returns FALSE for any code >= 6
 * (KAWSEG 0x801E9BAC), so 'never' is a real, reproducible behaviour (Aquilamon uses 0xFF).
 */
export type Comparator = '<' | '<=' | '>' | '>=' | '!=' | '==' | 'never';

/**
 * Arithmetic as implemented by the game (KAWSEG 0x801E9ABC):
 *  add: a + b, capped at 9990 · sub: a − b, floored at 0 · mul: a × b, capped at 9990
 *  div: 0 if a or b is 0, else trunc(a / b) with minimum 10, rounded DOWN to a multiple of 10
 *  'zero': any other code returns 0.
 */
export type ArithOp = 'add' | 'sub' | 'mul' | 'div' | 'zero';

/** One operand: a variable when `ref` is set, otherwise the literal `value` (game reads var 0 as "literal"). */
export interface Operand {
  ref: VarRef | null;
  value: number;
}

/**
 * Condition record (32 bytes): (o0 op0 o1 op1 o2) CMP (o3 op2 o4 op3 o5), arithmetic left to right.
 * Both enabled conditions must hold (AND); if any fails, NO action of the card runs.
 */
export interface Condition {
  enabled: boolean;
  operands: [Operand, Operand, Operand, Operand, Operand, Operand];
  ops: [ArithOp, ArithOp, ArithOp, ArithOp];
  cmp: Comparator;
  cmpRaw: number;
  raw: string;
}

/**
 * Action record (16 bytes): target := (o2 opInner o1) opOuter o0.
 * When the target is own/opp attack power (0x0A/0x0B) the formula is evaluated once per
 * attack slot (◯, △, ✕) and variables 11/12 read the power of that slot.
 */
export interface Action {
  enabled: boolean;
  target: VarRef;
  operands: [Operand, Operand, Operand];
  opInner: ArithOp;
  opOuter: ArithOp;
  raw: string;
}

export interface EffectProgram {
  conditions: Condition[];
  actions: Action[];
}

export interface SupportEffect {
  /** The 4 text lines exactly as stored in the ROM (control codes kept, e.g. *a0, *b1, *e5). */
  textRaw: string[];
  /** Human readable text (control codes rendered as words/symbols). */
  text: string;
  program: EffectProgram;
}

export interface SourceRef {
  file: 'B.DRV/CARD2.CDD';
  /** Byte offset of the record inside CARD2.CDD. */
  offset: number;
  size: number;
}

/** A known disagreement between the ROM bytecode and the ROM text. Must be verified in-game. */
export interface DataIssue {
  field: string;
  note: string;
}

/**
 * Support Speed (ROM: Digimon +0xE6, Option +0x8C). 0 None, 1 Low, 2 Mid, 3 High.
 * Name and values confirmed against Wikimon's table for all 293 Digimon/Option cards.
 * How it orders support resolution is NOT decoded yet.
 */
export type SupportSpeed = 0 | 1 | 2 | 3;

/** Card Fusion values (ROM +0x18/+0x19). Story-mode feature, not used in battle. Confirmed for all 301 cards. */
export interface FusionValues {
  composite: number;
  result: number;
}

interface CardBase {
  /** ROM card index (0..300). Stable unique id. */
  id: number;
  /** Display number "001".."301" (ROM index + 1). */
  number: string;
  name: string;
  nameRaw: string;
  fusion: FusionValues;
  source: SourceRef;
  /** Open questions: something in this record is not decoded yet. */
  issues: DataIssue[];
  /** Resolved differences between the card text and what the game actually executes. */
  notes: DataIssue[];
  unknown: Record<string, number | number[]>;
}

export interface DigimonCard extends CardBase {
  kind: 'digimon';
  specialty: Specialty;
  level: Level;
  hp: number;
  /** DP required to digivolve INTO this card (0 for R and A). */
  dpRequired: number;
  /** DP gained when this card is placed in the DP Slot ("+P"). */
  dpGiven: number;
  attacks: Record<AttackSlot, Attack>;
  crossEffect: CrossEffect;
  support: SupportEffect;
  supportSpeed: SupportSpeed;
}

export interface OptionCard extends CardBase {
  kind: 'option';
  support: SupportEffect;
  supportSpeed: SupportSpeed;
}

/** ROM digivolve-option type byte (+0x1A of the 112-byte record). */
export type DigivolveOptionType =
  | 'special'
  | 'warp'
  | 'speed'
  | 'mutant'
  | 'digiDevolve'
  | 'download'
  | 'armorCrush'
  | 'deArmor';

export interface DigivolveOptionCard extends CardBase {
  kind: 'digivolve';
  digivolveType: DigivolveOptionType;
  typeRaw: number;
  textRaw: string[];
  text: string;
}

export type Card = DigimonCard | OptionCard | DigivolveOptionCard;

export interface CardDatabase {
  game: 'Digimon Digital Card Battle (USA) SLUS-01328';
  extractedFrom: string;
  cardCount: number;
  generatedBy: string;
  cards: Card[];
}
