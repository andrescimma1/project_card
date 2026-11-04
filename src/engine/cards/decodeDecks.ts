/**
 * Decoder for B.DRV/DECK2.DEK — the game's built-in decks (tutorial, CPU opponents, player starters).
 *
 *   +0x0000  "30KD" magic, then 4 header bytes (not decoded)
 *   +0x0008  159 records × 110 bytes. The game reads record i at file + 8 + 110·i (SLUS 0x8003FA20)
 *            and copies it to the opponent struct at *0x8006E054 + 8.
 * Record:
 *   +0x00 30 × u16 card ids (CARD2.CDD index)
 *   +0x3C char[19] deck name
 *   +0x4F char[19] owner (opponent character, or "Player")
 *   +0x62 u16      not decoded
 *   +0x64 4 × u8   CPU personality: SLUS 0x8003FE7C copies them, 2 bits each, to the CPU player's flags
 *                  bits 22-23, 24-25, 26-27, 28-29 (docs/research/06-ia-original.md)
 *   +0x68 3 × u8   rival presentation (🟡 music / model / arena: SLUS 0x8002B024, 0x8003EAF4)
 *   +0x6B u8       Prize Pack type won by beating it (KAWSEG 0x801F5C64)
 *   +0x6C u8       EXP it gives (KAWSEG 0x801F41C0)
 *   +0x6D u8       Digi-Egg of the CPU partner: 0 none, k = egg k − 1 (SLUS 0x8003F9EC → 0x80047C38)
 * See docs/research/07-progresion.md.
 */
export interface OriginalDeck {
  index: number;
  name: string;
  owner: string;
  cards: number[];
  /** CPU personality parameters (one per AI decision, see docs 06). */
  ai: [number, number, number, number];
  /** EXP the partner earns for beating this deck (0 for the player's decks). */
  exp: number;
  /** Prize Pack type (index into the pack table) won by beating this deck. */
  prizePack: number;
  /** Digi-Egg equipped by the CPU partner: 0 none, 1..3 = egg index + 1. */
  partnerEgg: number;
  /** +0x68..+0x6A: rival presentation (not decoded). */
  presentation: [number, number, number];
  unknown: { u62: number };
}

const HEADER = 8;
const RECORD = 110;

function str(b: Uint8Array, o: number, len: number): string {
  let s = '';
  for (let i = 0; i < len && b[o + i]; i++) s += String.fromCharCode(b[o + i]);
  return s;
}

export function decodeDeckFile(bytes: Uint8Array): OriginalDeck[] {
  if (String.fromCharCode(...bytes.slice(0, 4)) !== '30KD') throw new Error('Not a DECK2.DEK file');
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const out: OriginalDeck[] = [];
  for (let o = HEADER, index = 0; o + RECORD <= bytes.length; o += RECORD, index++) {
    out.push({
      index,
      name: str(bytes, o + 0x3c, 19),
      owner: str(bytes, o + 0x4f, 19),
      cards: Array.from({ length: 30 }, (_, i) => dv.getUint16(o + i * 2, true)),
      ai: [0, 1, 2, 3].map((i) => bytes[o + 0x64 + i]) as OriginalDeck['ai'],
      exp: bytes[o + 0x6c],
      prizePack: bytes[o + 0x6b],
      partnerEgg: bytes[o + 0x6d],
      presentation: [bytes[o + 0x68], bytes[o + 0x69], bytes[o + 0x6a]],
      unknown: { u62: dv.getUint16(o + 0x62, true) },
    });
  }
  return out;
}
