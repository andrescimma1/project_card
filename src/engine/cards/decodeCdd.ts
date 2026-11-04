/**
 * Decoder for the original card table CARD2.CDD (Digimon Digital Card Battle, SLUS-01328).
 *
 * Layout (all little-endian), verified by consuming the file byte-exactly (84 312 bytes):
 *   header   : "0ACD" magic, u16 digimonCount (=191), u8 optionCount (=102), u8 digivolveCount (=8)
 *   digimon  : 191 records x 316 bytes  (ids 0..190)
 *   options  : 102 records x 226 bytes  (ids 191..292, kind byte = 1)
 *   digivolve:   8 records x 112 bytes  (ids 293..300, kind byte = 2)
 *
 * Pure function, no Node/DOM dependencies, so it runs in the extractor and in tests.
 */
import {
  arithFromCode,
  comparatorFromCode,
  CROSS_EFFECT_BY_CODE,
  DIGIVOLVE_TYPE_BY_CODE,
  LEVEL_BY_CODE,
  READ_VARS,
  SPECIALTY_BY_CODE,
  WRITE_TARGETS,
  renderGameText,
} from './romTables';
import type {
  Action,
  Attack,
  Card,
  Condition,
  DataIssue,
  DigimonCard,
  DigivolveOptionCard,
  EffectProgram,
  OptionCard,
  Operand,
  SupportEffect,
  VarRef,
} from './types';

export const DIGIMON_RECORD = 316;
export const OPTION_RECORD = 226;
export const DIGIVOLVE_RECORD = 112;
const TEXT_LINE = 21;

class Reader {
  private readonly b: Uint8Array;
  constructor(b: Uint8Array) {
    this.b = b;
  }
  u8(o: number) {
    return this.b[o];
  }
  u16(o: number) {
    return this.b[o] | (this.b[o + 1] << 8);
  }
  s16(o: number) {
    const v = this.u16(o);
    return v & 0x8000 ? v - 0x10000 : v;
  }
  s32(o: number) {
    return this.b[o] | (this.b[o + 1] << 8) | (this.b[o + 2] << 16) | (this.b[o + 3] << 24);
  }
  /** NUL-terminated latin1 string inside a fixed-size field. Bytes after the NUL are leftover garbage in the ROM. */
  str(o: number, len: number) {
    let s = '';
    for (let i = 0; i < len; i++) {
      const c = this.b[o + i];
      if (c === 0) break;
      s += String.fromCharCode(c);
    }
    return s;
  }
  hex(o: number, len: number) {
    let s = '';
    for (let i = 0; i < len; i++) s += this.b[o + i].toString(16).padStart(2, '0');
    return s;
  }
}

function readVar(id: number): VarRef {
  const info = READ_VARS[id];
  return info ? { id, name: info.name, confidence: info.confidence } : { id, name: null, confidence: 'unknown' };
}

function writeVar(id: number): VarRef {
  const info = WRITE_TARGETS[id];
  return info ? { id, name: info.name, confidence: info.confidence } : { id, name: null, confidence: 'unknown' };
}

/** Operand = (s16 var id, s16 literal). The game's getVar returns the literal only when the id is 0. */
function operand(r: Reader, varAt: number, constAt: number): Operand {
  const id = r.s16(varAt);
  return { ref: id ? readVar(id) : null, value: r.s16(constAt) };
}

/**
 * Condition record, 0x20 bytes (interpreter KAWSEG 0x801E9C1C):
 *   +0x00 enabled · +0x02..+0x0C six s16 var ids · +0x0E..+0x18 six s16 literals
 *   +0x1A comparator · +0x1B..+0x1E four arithmetic ops
 *   (o0 op0 o1 op1 o2) CMP (o3 op2 o4 op3 o5)
 */
function decodeCondition(r: Reader, o: number): Condition {
  const cmpRaw = r.u8(o + 0x1a);
  const ops = [0x1b, 0x1c, 0x1d, 0x1e].map((x) => arithFromCode(r.u8(o + x)));
  return {
    enabled: r.u8(o) !== 0,
    operands: [0, 1, 2, 3, 4, 5].map((i) => operand(r, o + 0x02 + 2 * i, o + 0x0e + 2 * i)) as Condition['operands'],
    ops: ops as Condition['ops'],
    cmp: comparatorFromCode(cmpRaw),
    cmpRaw,
    raw: r.hex(o, 0x20),
  };
}

/**
 * Action record, 0x10 bytes:
 *   +0x00 enabled · +0x01 target · +0x02/+0x04/+0x06 s16 var ids · +0x08/+0x0A/+0x0C s16 literals
 *   +0x0E outer op · +0x0F inner op          target := (o2 inner o1) outer o0
 */
function decodeAction(r: Reader, o: number): Action {
  return {
    enabled: r.u8(o) !== 0,
    target: writeVar(r.u8(o + 0x01)),
    operands: [0, 1, 2].map((i) => operand(r, o + 0x02 + 2 * i, o + 0x08 + 2 * i)) as Action['operands'],
    opInner: arithFromCode(r.u8(o + 0x0f)),
    opOuter: arithFromCode(r.u8(o + 0x0e)),
    raw: r.hex(o, 0x10),
  };
}

/** A condition record (0x20 bytes) at a byte offset, e.g. the Digi-Part templates in SLUS 0x8006E534. */
export function decodeConditionAt(bytes: Uint8Array, offset: number): Condition {
  return decodeCondition(new Reader(bytes), offset);
}

/** An action record (0x10 bytes) at a byte offset, e.g. the Digi-Part templates in SLUS 0x8006E774. */
export function decodeActionAt(bytes: Uint8Array, offset: number): Action {
  return decodeAction(new Reader(bytes), offset);
}

function decodeProgram(r: Reader, condAt: number, actAt: number): EffectProgram {
  return {
    conditions: [0, 1].map((i) => decodeCondition(r, condAt + i * 0x20)),
    actions: [0, 1, 2].map((i) => decodeAction(r, actAt + i * 0x10)),
  };
}

function decodeText(r: Reader, at: number): { textRaw: string[]; text: string } {
  const textRaw = [0, 1, 2, 3].map((i) => r.str(at + i * TEXT_LINE, TEXT_LINE));
  const text = renderGameText(textRaw.filter(Boolean).join(' ')).replace(/\s+/g, ' ').trim();
  return { textRaw, text };
}

function support(r: Reader, condAt: number, actAt: number, textAt: number): SupportEffect {
  return { ...decodeText(r, textAt), program: decodeProgram(r, condAt, actAt) };
}

/** Card Fusion values, +0x18/+0x19 in every record type. */
function fusion(r: Reader, base: number) {
  return { composite: r.u8(base + 0x18), result: r.u8(base + 0x19) };
}

function displayName(raw: string) {
  return renderGameText(raw).trim();
}

/** Automatic checks on ENABLED records: undecoded ids are open issues; out-of-range comparators are notes. */
function programIssues(p: EffectProgram): { issues: DataIssue[]; notes: DataIssue[] } {
  const issues: DataIssue[] = [];
  const notes: DataIssue[] = [];
  const checkOperand = (field: string, op: Operand) => {
    if (op.ref && op.ref.confidence === 'unknown')
      issues.push({ field, note: `La variable de lectura ${op.ref.id} (${op.ref.name ?? 'sin nombre'}) no está decodificada.` });
  };
  p.conditions.forEach((c, i) => {
    if (!c.enabled) return;
    if (c.cmp === 'never')
      notes.push({ field: `support.conditions[${i}].cmp`, note: `Comparador ${c.cmpRaw} fuera de 0..5: la rutina compare() del juego devuelve falso, así que este efecto nunca se activa.` });
    c.operands.forEach((op, j) => checkOperand(`support.conditions[${i}].operands[${j}]`, op));
  });
  p.actions.forEach((a, i) => {
    if (!a.enabled) return;
    if (a.target.confidence === 'unknown') issues.push({ field: `support.actions[${i}].target`, note: `El destino de escritura 0x${a.target.id.toString(16)} no está decodificado.` });
    a.operands.forEach((op, j) => checkOperand(`support.actions[${i}].operands[${j}]`, op));
  });
  return { issues, notes };
}

function decodeDigimon(r: Reader, base: number, id: number): DigimonCard {
  const at = (o: number) => base + o;
  const attack = (o: number): Attack => ({
    power: r.u16(at(o)),
    animId: r.u16(at(o + 2)),
    fxId: r.u16(at(o + 4)),
    name: r.str(at(o + 6), 0x16),
  });
  const specLevel = r.u8(at(0x1a));
  const crossCode = r.u8(at(0xe4));
  const nameRaw = r.str(at(0x03), 0x15);
  const sup = support(r, at(0x74), at(0xb4), at(0xe7));
  return {
    id,
    number: String(id + 1).padStart(3, '0'),
    kind: 'digimon',
    name: displayName(nameRaw),
    nameRaw,
    specialty: SPECIALTY_BY_CODE[specLevel >> 4],
    level: LEVEL_BY_CODE[specLevel & 0x0f],
    dpRequired: r.u8(at(0x1b)),
    dpGiven: r.u8(at(0x1c)),
    hp: r.u16(at(0x1e)),
    attacks: { circle: attack(0x20), triangle: attack(0x3c), cross: attack(0x58) },
    crossEffect: CROSS_EFFECT_BY_CODE[crossCode],
    support: sup,
    supportSpeed: r.u8(at(0xe6)) as DigimonCard['supportSpeed'],
    fusion: fusion(r, base),
    source: { file: 'B.DRV/CARD2.CDD', offset: base, size: DIGIMON_RECORD },
    ...programIssues(sup.program),
    unknown: {
      byte1D: r.u8(at(0x1d)),
      byteE5: r.u8(at(0xe5)),
    },
  };
}

function decodeOption(r: Reader, base: number, id: number): OptionCard {
  const at = (o: number) => base + o;
  const nameRaw = r.str(at(0x03), 0x15);
  const sup = support(r, at(0x1c), at(0x5c), at(0x8d));
  return {
    id,
    number: String(id + 1).padStart(3, '0'),
    kind: 'option',
    name: displayName(nameRaw),
    nameRaw,
    support: sup,
    supportSpeed: r.u8(at(0x8c)) as OptionCard['supportSpeed'],
    fusion: fusion(r, base),
    source: { file: 'B.DRV/CARD2.CDD', offset: base, size: OPTION_RECORD },
    ...programIssues(sup.program),
    unknown: {},
  };
}

function decodeDigivolve(r: Reader, base: number, id: number): DigivolveOptionCard {
  const at = (o: number) => base + o;
  const nameRaw = r.str(at(0x03), 0x15);
  const typeRaw = r.u8(at(0x1a));
  return {
    id,
    number: String(id + 1).padStart(3, '0'),
    kind: 'digivolve',
    name: displayName(nameRaw),
    nameRaw,
    digivolveType: DIGIVOLVE_TYPE_BY_CODE[typeRaw],
    typeRaw,
    ...decodeText(r, at(0x1b)),
    fusion: fusion(r, base),
    source: { file: 'B.DRV/CARD2.CDD', offset: base, size: DIGIVOLVE_RECORD },
    issues: [],
    notes: [],
    unknown: {},
  };
}

export interface DecodeResult {
  cards: Card[];
  bytesConsumed: number;
  totalBytes: number;
}

export function decodeCardTable(bytes: Uint8Array): DecodeResult {
  const r = new Reader(bytes);
  const magic = String.fromCharCode(...bytes.slice(0, 4));
  if (magic !== '0ACD') throw new Error(`Not a CARD2.CDD file (magic ${JSON.stringify(magic)})`);
  const digimonCount = r.u16(4);
  const cards: Card[] = [];
  let o = 8;
  for (let id = 0; id < digimonCount; id++, o += DIGIMON_RECORD) cards.push(decodeDigimon(r, o, id));
  let id = digimonCount;
  while (o + OPTION_RECORD <= bytes.length && r.u16(o) === id && r.u8(o + 2) === 1) {
    cards.push(decodeOption(r, o, id));
    o += OPTION_RECORD;
    id++;
  }
  while (o + DIGIVOLVE_RECORD <= bytes.length && r.u16(o) === id && r.u8(o + 2) === 2) {
    cards.push(decodeDigivolve(r, o, id));
    o += DIGIVOLVE_RECORD;
    id++;
  }
  return { cards, bytesConsumed: o, totalBytes: bytes.length };
}
