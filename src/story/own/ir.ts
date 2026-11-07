/**
 * Our own story scripts: the logic of each city (battles, flags, menus, rewards) without any text, and
 * a compiler that builds a runnable MSCD script from that logic plus our own dialogue. The VM and the
 * city host run it exactly as they run an original script, so the rules do not change.
 *
 * Logic format (`CityLogic.code`), compact so the 12 cities stay small:
 *   ['L', n]                 label n (n = offset of the instruction in the original file)
 *   ['g', n, a?]             goto label n (a = an unused field the original keeps, for exactness)
 *   ['7', v, sub, mode, x]   variable op (op 7)            ['9', v, sub, mode, x]  skip-unless (op 9)
 *   ['c', op, cmd, ...p]     host command (op 10..14); p = flattened [mode, value] pairs
 *   ['n', v, name]           text pointer to a name (rival shown by CMD10.13)
 *   ['u', id, kind, speaker, shared?]
 *                            a run of dialogue: kind 's' ends waiting for the player, 'p' stays on screen
 *                            (a prompt before a menu), 'c' is a caption (CMD10.22); speaker = who talks
 *                            in its first page (a name key), or null; shared = key of a line that many
 *                            cities repeat (the arena is closed, congratulations…), written once.
 */

export type LogicItem =
  | ['L', number]
  | ['g', number, number?]
  | ['7' | '9', number, number, number, number]
  | ['c', number, number, ...number[]]
  | ['n', number, string]
  | ['u', string, 's' | 'p' | 'c', string | null, string?];

export interface CityLogic {
  nvars: number;
  code: LogicItem[];
}

/** A page of dialogue: who talks (shown coloured on the first line) and up to 3 lines. */
export interface Page {
  speaker?: string;
  lines: string[];
}

/** What the compiler writes for a run of dialogue: pages that wait, then optional lines left on screen. */
export interface UnitText {
  pages: Page[];
  prompt?: string[];
}

/** Context of a run of dialogue, so generic text can be written for it (the menu it introduces, the reward…). */
export interface UnitContext {
  id: string;
  kind: 's' | 'p' | 'c';
  speaker: string | null;
  shared: string | null;
  /** Another run of dialogue comes right before (only portraits, waits or clears between them). */
  afterUnit: boolean;
  /** Host commands that follow the run (up to the next label or jump). */
  next: { op: number; cmd: number; params: number[] }[];
}

const CODE = 16;
const u16 = (b: Uint8Array, o: number) => b[o] | (b[o + 1] << 8);
const u32 = (b: Uint8Array, o: number) => (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;

interface Raw {
  pc: number;
  op: number;
  a: number;
  size: number;
}

function parse(b: Uint8Array): Raw[] {
  const end = u32(b, 8);
  const out: Raw[] = [];
  for (let pc = CODE; pc < end; ) {
    const op = u16(b, pc);
    const a = u16(b, pc + 2);
    let size: number;
    if (op === 5) size = 8;
    else if (op === 7 || op === 9) size = 12;
    else if (op === 8) size = 6 + u16(b, pc + 4);
    else if (op >= 10 && op <= 14) size = 4 + 4 * (op - 10);
    else throw new Error(`MSCD: opcode ${op} at 0x${pc.toString(16)} is not supported`);
    out.push({ pc, op, a, size });
    pc = (pc + size + 3) & ~3;
  }
  return out;
}

const cstr = (b: Uint8Array, o: number, n: number) => {
  let s = '';
  for (let i = 0; i < n && b[o + i]; i++) s += String.fromCharCode(b[o + i]);
  return s;
};
const isCmd = (r: Raw, op: number, cmd: number) => r.op === op && r.a === cmd;
/** A dialogue instruction: text into v4, print, wait, clear. */
const isDialogue = (r: Raw) => (r.op === 8 && r.a === 4) || isCmd(r, 10, 4) || isCmd(r, 10, 5) || isCmd(r, 10, 6);

/** Speaker of a page: a first line that is only a coloured name ("*c4Name*c7") above the text. */
function speakerOf(page: string[]): string | null {
  const m = page.length > 1 ? /^\*c[0-9a-f]([^*:]+)\*c7\s*$/i.exec(page[0]) : null;
  return m ? m[1].trim() : null;
}

export interface Lifted {
  logic: CityLogic;
  /** Original bytes of each run of dialogue (tests compile them back to check the logic is exact). */
  originals: Record<string, Uint8Array>;
  /** Original bytes of each name instruction, in order (same purpose). */
  names: Uint8Array[];
  /** Original text of each run, by page (local tools only: never written to the repository). */
  texts: Record<string, string[][]>;
}

/** Turn an original script into logic without text. */
export function lift(bytes: Uint8Array): Lifted {
  const ins = parse(bytes);
  const labels = new Set<number>();
  for (const r of ins) if (r.op === 5) labels.add(CODE + u32(bytes, r.pc + 4));
  const code: LogicItem[] = [];
  const originals: Record<string, Uint8Array> = {};
  const texts: Record<string, string[][]> = {};
  const names: Uint8Array[] = [];
  const id = (pc: number) => pc.toString(16).toUpperCase().padStart(4, '0');
  const param = (r: Raw, i: number) => [u16(bytes, r.pc + 4 + 4 * i), u16(bytes, r.pc + 6 + 4 * i)];

  for (let i = 0; i < ins.length; i++) {
    const r = ins[i];
    if (labels.has(r.pc)) code.push(['L', r.pc]);
    const prevSkips = i > 0 && ins[i - 1].op === 9;

    // a run of dialogue: never across a label, never right after a conditional skip
    if (r.op === 8 && r.a === 4 && !prevSkips) {
      let j = i;
      // a clear right before the text belongs to the run when nothing jumps between them
      while (j + 1 < ins.length && isDialogue(ins[j + 1]) && !labels.has(ins[j + 1].pc)) j++;
      const start = r.pc;
      const stop = j + 1 < ins.length ? ins[j + 1].pc : u32(bytes, 8);
      const pages: string[][] = [];
      let page: string[] = [];
      let waited = false;
      for (let k = i; k <= j; k++) {
        const x = ins[k];
        if (x.op === 8) page.push(cstr(bytes, x.pc + 6, u16(bytes, x.pc + 4)));
        else if (isCmd(x, 10, 5)) {
          pages.push(page);
          page = [];
          waited = true;
        }
      }
      const prompt = page.length > 0;
      if (prompt) pages.push(page);
      const key = id(start);
      code.push(['u', key, prompt ? 'p' : 's', speakerOf(pages[0] ?? [])]);
      if (!waited && !prompt) throw new Error(`run at 0x${key} has no text`);
      originals[key] = bytes.slice(start, stop);
      texts[key] = pages;
      i = j;
      continue;
    }

    if (r.op === 8 && r.a === 9) {
      const text = cstr(bytes, r.pc + 6, u16(bytes, r.pc + 4));
      const caption = i + 1 < ins.length && isCmd(ins[i + 1], 10, 22);
      if (caption) {
        const key = id(r.pc);
        code.push(['u', key, 'c', null]);
        originals[key] = bytes.slice(r.pc, ins[i + 1].pc);
        texts[key] = [[text]];
      } else {
        code.push(['n', 9, text]);
        names.push(bytes.slice(r.pc, i + 1 < ins.length ? ins[i + 1].pc : u32(bytes, 8)));
      }
      continue;
    }
    if (r.op === 8) throw new Error(`text pointer into v${r.a} at 0x${id(r.pc)} is not supported`);
    if (r.op === 5) code.push(r.a ? ['g', CODE + u32(bytes, r.pc + 4), r.a] : ['g', CODE + u32(bytes, r.pc + 4)]);
    else if (r.op === 7 || r.op === 9) code.push([String(r.op) as '7' | '9', r.a, u16(bytes, r.pc + 4), u16(bytes, r.pc + 6), u32(bytes, r.pc + 8) | 0]);
    else code.push(['c', r.op, r.a, ...Array.from({ length: r.op - 10 }, (_, k) => param(r, k)).flat()]);
  }
  return { logic: { nvars: u32(bytes, 12), code }, originals, names, texts };
}

/** How the compiler gets the bytes of each run of dialogue and each name. */
export interface TextSource {
  /** Instructions for a run of dialogue, already encoded (see `encodeUnit`), or null to leave it out. */
  unit(ctx: UnitContext): Uint8Array | null;
  /** Bytes of a name (with its terminating zero). */
  name(key: string): Uint8Array;
  /** Tests only: the whole original instruction of the n-th name, emitted as it is. */
  nameInstruction?(n: number): Uint8Array;
}

const w16 = (out: number[], v: number) => out.push(v & 255, (v >> 8) & 255);
const w32 = (out: number[], v: number) => out.push(v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255);
const pad = (out: number[]) => {
  while (out.length % 4) out.push(0);
};

/** Encode text as a pointer instruction (op 8) into variable v. */
export function textInstruction(out: number[], v: number, bytes: Uint8Array): void {
  w16(out, 8);
  w16(out, v);
  w16(out, bytes.length);
  out.push(...bytes);
  pad(out);
}

const utf8 = new TextEncoder();
const zstr = (s: string) => {
  const b = utf8.encode(s);
  const z = new Uint8Array(b.length + 1);
  z.set(b);
  return z;
};

/** Instructions of a run of dialogue: clear, then each page (lines + wait), then the prompt lines. */
export function encodeUnit(text: UnitText, colour = 4): Uint8Array {
  const out: number[] = [];
  const cmd = (c: number) => {
    w16(out, 10);
    w16(out, c);
  };
  const print = (line: string) => {
    textInstruction(out, 4, zstr(line));
    cmd(4);
  };
  cmd(6);
  for (const p of text.pages) {
    if (p.speaker) print(`*c${colour}${p.speaker}*c7`);
    p.lines.forEach(print);
    cmd(5);
    cmd(6);
  }
  for (const l of text.prompt ?? []) print(l);
  return Uint8Array.from(out);
}

/** A caption (CMD10.22 shows the text in v9). */
export function encodeCaption(line: string): Uint8Array {
  const out: number[] = [];
  textInstruction(out, 9, zstr(line));
  return Uint8Array.from(out);
}

export const encodeName = zstr;

/** Commands that only change the look between two runs of dialogue: portraits, clear, scene, wait, sound. */
const QUIET = new Set(['13.0', '10.6', '10.0', '11.14', '11.13']);

/** Build a runnable MSCD script from the logic and the text. */
export function compile(logic: CityLogic, text: TextSource): Uint8Array {
  const out: number[] = [];
  const at = new Map<number, number>();
  const fixups: { pos: number; label: number }[] = [];
  const code = logic.code;
  let nameCount = 0;
  for (let i = 0; i < code.length; i++) {
    const it = code[i];
    switch (it[0]) {
      case 'L':
        at.set(it[1], out.length);
        break;
      case 'g':
        w16(out, 5);
        w16(out, it[2] ?? 0);
        fixups.push({ pos: out.length, label: it[1] });
        w32(out, 0);
        break;
      case '7':
      case '9':
        w16(out, Number(it[0]));
        w16(out, it[1]);
        w16(out, it[2]);
        w16(out, it[3]);
        w32(out, it[4]);
        break;
      case 'c': {
        const [, op, cmd, ...p] = it;
        w16(out, op);
        w16(out, cmd);
        p.forEach((v) => w16(out, v));
        pad(out);
        break;
      }
      case 'n': {
        const raw = text.nameInstruction?.(nameCount);
        if (raw) out.push(...raw);
        else textInstruction(out, it[1], text.name(it[2]));
        nameCount++;
        break;
      }
      case 'u': {
        const next: UnitContext['next'] = [];
        for (let k = i + 1; k < code.length && next.length < 12; k++) {
          const n = code[k];
          if (n[0] === 'L' || n[0] === 'g' || n[0] === 'u') break;
          if (n[0] === 'c') {
            const [, op, cmd, ...p] = n;
            next.push({ op, cmd, params: p.filter((_, j) => j % 2 === 1) });
          }
        }
        let afterUnit = false;
        for (let k = i - 1; k >= 0; k--) {
          const b = code[k];
          if (b[0] === 'u') afterUnit = true;
          if (b[0] !== 'c' || !QUIET.has(`${b[1]}.${b[2]}`)) break;
        }
        const bytes = text.unit({ id: it[1], kind: it[2], speaker: it[3], shared: it[4] ?? null, afterUnit, next });
        if (bytes) {
          out.push(...bytes);
          pad(out);
        }
        break;
      }
    }
  }
  for (const f of fixups) {
    const target = at.get(f.label);
    if (target === undefined) throw new Error(`label ${f.label} is missing`);
    const rel = target; // jumps are relative to the start of the code
    out[f.pos] = rel & 255;
    out[f.pos + 1] = (rel >> 8) & 255;
    out[f.pos + 2] = (rel >> 16) & 255;
    out[f.pos + 3] = (rel >>> 24) & 255;
  }
  const end = CODE + out.length;
  const head = [0x4d, 0x53, 0x43, 0x44];
  w32(head, 3);
  w32(head, end);
  w32(head, logic.nvars);
  return Uint8Array.from([...head, ...out]);
}
