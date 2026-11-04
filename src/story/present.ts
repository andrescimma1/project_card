/**
 * Presentation helpers for the story screens: script text, menu labels, Battle Cafe names, the map.
 * Nothing here changes the rules; labels replace the game's graphical menu items.
 */
import { renderGameText } from '../engine/cards/romTables';
import { progression } from '../engine/progression/tables';
import type { SaveData } from '../engine/progression/save';
import type { MscdScript } from './vm';

export interface Segment {
  text: string;
  /** Text colour code *cN (7 = default). */
  color: number;
}

/**
 * Split a script line into coloured segments. Codes are `*` + letter + digit: c colour, h player
 * name, a/b/e specialty / button / level icons, s/w size and spacing (ignored).
 */
export function storySegments(line: string, playerName: string): Segment[] {
  const out: Segment[] = [];
  let color = 7;
  let buf = '';
  const flush = () => {
    if (buf) out.push({ text: buf, color });
    buf = '';
  };
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const code = line[i + 1];
    if (ch !== '*' || !code || !/[a-w]/.test(code)) {
      buf += ch;
      continue;
    }
    const arg = line[i + 2] ?? '';
    i += 2;
    if (code === 'c') {
      flush();
      color = parseInt(arg, 16) || 7;
    } else if (code === 'h') buf += playerName;
    else if (code === 'a' || code === 'b' || code === 'e') buf += renderGameText(`*${code}${arg}`);
  }
  flush();
  return out;
}

/** Decode a script string (latin1 bytes with Shift-JIS pairs) into text. */
export function decodeScriptString(raw: string): string {
  if (!/[\x80-\xff]/.test(raw)) return raw;
  const bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));
  try {
    return new TextDecoder('shift_jis').decode(bytes);
  } catch {
    return raw;
  }
}

const LABELS: Record<number, string> = {
  0: 'Sala del jugador',
  1: 'Menú',
  2: 'Battle Cafe',
  7: 'Fusion Shop',
  8: 'Entrar',
  9: 'No entrar',
  12: 'Hablar',
  13: 'Combatir',
  14: 'Información',
  15: 'Guardar',
  16: 'Sí',
  17: 'No',
  18: 'Mazos', // 🟡 CMD10.9 (SUBSEG)
  19: 'Compañero', // 🟡 CMD10.17 (SUBSEG)
};

/** Label for a graphical menu item (CMD11.1 id); ids 3..6 are the 4 arenas of the city. */
export function menuLabel(id: number, city: number): string {
  if (id >= 3 && id <= 6) return progression.world.arenas[city]?.[id - 3] || 'Arena';
  return LABELS[id] ?? `Opción ${id}`;
}

/** Cities on the map: flag v(282 + i) set (SAISEG 0x801DE964). */
export function visibleCities(save: SaveData): number[] {
  return Array.from({ length: 12 }, (_, i) => i).filter((i) => {
    const bit = 282 + i - 12;
    return ((save.story.flags[bit >> 5] >>> (bit & 31)) & 1) === 1;
  });
}

/**
 * Battle Cafe names: for each dispatch on v2 (`if (v2 == k)`), the first speaker line (*cN…) of its
 * branch. Both compiled shapes are handled: op9 == + goto (body inline) and op9 != + goto (body at target).
 */
export function npcNames(s: MscdScript): Record<number, string> {
  const b = s.bytes;
  const u16 = (o: number) => b[o] | (b[o + 1] << 8);
  const u32 = (o: number) => (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
  const size = (pc: number) => {
    const op = u16(pc);
    if (op === 5) return 8;
    if (op === 6) return 4 + u16(pc + 2);
    if (op === 7 || op === 9) return 12;
    if (op === 8) return 6 + u16(pc + 4);
    return 4 + 4 * (op - 10);
  };
  const next = (pc: number) => (pc + size(pc) + 3) & ~3;
  const speakerFrom = (start: number): string | null => {
    for (let pc = start, n = 0; pc < s.end && n < 300; pc = next(pc), n++) {
      if (u16(pc) !== 8 || u16(pc + 2) !== 4) continue;
      let t = '';
      for (let o = pc + 6; b[o]; o++) t += String.fromCharCode(b[o]);
      if (t.startsWith('*c') && !t.includes('*h')) return storySegments(t, '').map((x) => x.text).join('').trim() || null;
    }
    return null;
  };
  const names: Record<number, string> = {};
  for (let pc = 16; pc < s.end; pc = next(pc)) {
    if (u16(pc) !== 9 || u16(pc + 2) !== 2 || u16(pc + 6) !== 0) continue;
    const sub = u16(pc + 4);
    const k = u32(pc + 8) | 0;
    const g = next(pc);
    if (u16(g) !== 5 || (sub !== 0 && sub !== 3) || k in names) continue;
    const body = sub === 0 ? next(g) : 16 + u32(g + 4);
    const name = speakerFrom(body);
    if (name) names[k] = name;
  }
  return names;
}
