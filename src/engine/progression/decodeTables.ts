/**
 * Decoder for the progression tables in the executable and the overlays (docs/research/07-progresion.md).
 * Inputs are the user's own disc files: SLUS_013.28 and the P.DRV overlays KAWSEG/EVOSEG/OPENSEG.
 */
import { decodeActionAt, decodeConditionAt } from '../cards/decodeCdd';
import { renderGameText } from '../cards/romTables';
import type { Action, Condition } from '../cards/types';

export interface PackDef {
  index: number;
  name: string;
  /** 18 signed bytes: for each specialty [U or A, C, R] bound (×5), then Option max, Option min, rare window. */
  params: number[];
}

export interface DigiPartDef {
  id: number;
  /** Short name as listed by the game (KAWSEG 0x801FBB38), control codes rendered. */
  name: string;
  /** Full text: the support text for type 7 parts (SLUS 0x8006EDB4), else the name. */
  text: string;
  /** Level at which each partner learns it, in SLUS partner order (Veemon, Hawkmon, Armadillomon, Gatomon, Patamon, Wormmon); -1 never. */
  levels: number[];
  /** Effect (SLUS 0x8006E9B4): 0 HP · 1 all attacks · 2/3/4 ◯/△/✕ · 5 ✕ effect · 6 +P · 7 support program · 8 EXP%/rare%. */
  type: number;
  b1: number;
  b2: number;
  b3: number;
  value: number;
  /** b6: support speed for type 7. */
  speed: number;
  b7: number;
}

export interface BonusDef {
  id: number;
  exp: number;
  name: string;
}

export interface ProgressionTables {
  packs: PackDef[];
  fusion: {
    /** Result category for (category A, category B): 0 Fire … 4 Rare, 5 Option (EVOSEG 0x801EFEDC). */
    mix: number[][];
    /** Card id ranges searched for each result category (EVOSEG 0x801EFF00); Option has two. */
    ranges: [number, number][];
    /** Fixed fusions (EVOSEG 0x801DF03C); fx = 4th byte (🟡 animation/message id). */
    specials: { a: number; b: number; result: number; fx: number }[];
    /** Partner order used by EVOSEG (0x801EFED4). */
    partnerOrder: number[];
    /** Partner Fusion: per partner (EVOSEG order), 5 cards that teach a Digi-Part (EVOSEG 0x801EFF1C). */
    partnerFusion: { card: number; part: number }[][];
  };
  partners: {
    /** Starting Digi-Part per partner, SLUS order (SLUS 0x8006EEFC). */
    initialPart: number[];
    /** 5 pairs per starter partner (Veemon, Hawkmon, Armadillomon); one card of each pair is given at random (OPENSEG 0x801F04C4). */
    starterPairs: [number, number][][];
  };
  digiParts: DigiPartDef[];
  /** Templates copied by type 7 parts: conditions (SLUS 0x8006E534) and actions (0x8006E774); index = record value − 1. */
  supportTemplates: { conditions: Condition[]; actions: Action[] };
  /** EXP bonuses evaluated after a battle (KAWSEG 0x801FC300). */
  bonuses: BonusDef[];
}

const SLUS_BASE = 0x80010000;
const SLUS_FILE_OFFSET = 0x800;
const OVERLAY_BASE = 0x801ddf38;

class Image {
  constructor(
    readonly bytes: Uint8Array,
    private readonly toOffset: (addr: number) => number,
  ) {}
  at(addr: number) {
    return this.toOffset(addr);
  }
  u8(addr: number) {
    return this.bytes[this.at(addr)];
  }
  s8(addr: number) {
    const v = this.u8(addr);
    return v > 127 ? v - 256 : v;
  }
  u16(addr: number) {
    const o = this.at(addr);
    return this.bytes[o] | (this.bytes[o + 1] << 8);
  }
  s16(addr: number) {
    const v = this.u16(addr);
    return v & 0x8000 ? v - 0x10000 : v;
  }
  u32(addr: number) {
    const o = this.at(addr);
    return (this.bytes[o] | (this.bytes[o + 1] << 8) | (this.bytes[o + 2] << 16) | (this.bytes[o + 3] << 24)) >>> 0;
  }
  cstr(addr: number) {
    let s = '';
    for (let o = this.at(addr); this.bytes[o]; o++) s += String.fromCharCode(this.bytes[o]);
    return s;
  }
}

const text = (raw: string) => renderGameText(raw.replace(/\n/g, ' ')).replace(/\s+/g, ' ').trim();

export function decodeProgressionTables(
  slusFile: Uint8Array,
  overlays: { KAWSEG: Uint8Array; EVOSEG: Uint8Array; OPENSEG: Uint8Array },
): ProgressionTables {
  const slus = new Image(slusFile, (a) => a - SLUS_BASE + SLUS_FILE_OFFSET);
  const ovl = (b: Uint8Array) => new Image(b, (a) => a - OVERLAY_BASE);
  const kaw = ovl(overlays.KAWSEG);
  const evo = ovl(overlays.EVOSEG);
  const open = ovl(overlays.OPENSEG);

  const packs = Array.from({ length: 16 }, (_, i) => ({
    index: i,
    name: slus.cstr(slus.u32(0x8006e31c + 4 * i)),
    params: Array.from({ length: 18 }, (_, k) => slus.s8(0x8006e35c + 18 * i + k)),
  }));

  const mix = Array.from({ length: 6 }, (_, r) => Array.from({ length: 6 }, (_, c) => evo.u8(0x801efedc + 6 * r + c)));
  const ranges = Array.from({ length: 7 }, (_, i) => [evo.s16(0x801eff00 + 4 * i), evo.s16(0x801eff02 + 4 * i)] as [number, number]);
  const specials = Array.from({ length: 20 }, (_, i) => ({
    a: evo.u8(0x801df03c + 4 * i),
    b: evo.u8(0x801df03d + 4 * i),
    result: evo.u8(0x801df03e + 4 * i),
    fx: evo.u8(0x801df03f + 4 * i),
  }));
  const partnerOrder = Array.from({ length: 6 }, (_, i) => evo.u8(0x801efed4 + i));
  const partnerFusion = Array.from({ length: 6 }, (_, p) =>
    Array.from({ length: 5 }, (_, j) => ({ card: evo.u8(0x801eff1c + 2 * (5 * p + j)), part: evo.u8(0x801eff1d + 2 * (5 * p + j)) })),
  );

  const initialPart = Array.from({ length: 6 }, (_, i) => slus.u8(0x8006eefc + i));
  const starterPairs = Array.from({ length: 3 }, (_, p) =>
    Array.from({ length: 5 }, (_, j) => [open.u16(0x801f04c4 + 4 * (5 * p + j)), open.u16(0x801f04c6 + 4 * (5 * p + j))] as [number, number]),
  );

  const digiParts = Array.from({ length: 128 }, (_, id): DigiPartDef => {
    const e = 0x8006e9b4 + 8 * id;
    const type = slus.u8(e);
    const name = kaw.cstr(kaw.u32(0x801fbb38 + 12 * id));
    return {
      id,
      name: text(name),
      text: type === 7 ? text(slus.cstr(slus.u32(0x8006edb4 + 4 * (id - 41)))) : text(name),
      levels: Array.from({ length: 6 }, (_, k) => kaw.s8(0x801fbb3c + 12 * id + k)),
      type,
      b1: slus.u8(e + 1),
      b2: slus.u8(e + 2),
      b3: slus.u8(e + 3),
      value: slus.s16(e + 4),
      speed: slus.u8(e + 6),
      b7: slus.u8(e + 7),
    };
  });

  const supportTemplates = {
    conditions: Array.from({ length: 18 }, (_, i) => decodeConditionAt(slusFile, slus.at(0x8006e534 + 32 * i))),
    actions: Array.from({ length: 36 }, (_, i) => decodeActionAt(slusFile, slus.at(0x8006e774 + 16 * i))),
  };

  const bonuses = Array.from({ length: 32 }, (_, i) => ({
    id: kaw.u8(0x801fc300 + 8 * i),
    exp: kaw.u8(0x801fc301 + 8 * i),
    name: text(kaw.cstr(kaw.u32(0x801fc304 + 8 * i))),
  }));

  return { packs, fusion: { mix, ranges, specials, partnerOrder, partnerFusion }, partners: { initialPart, starterPairs }, digiParts, supportTemplates, bonuses };
}
