/**
 * MSCD script VM — port of SLUS 0x80020F54 (docs/research/progresion/01-mundo-y-guiones.md §1).
 * File: "MSCD" · u32 version (3) · u32 end of code · u32 number of variables · code from +16.
 * Instruction = u16 op, u16 a, operands; the PC is aligned to 4 after each one. Jumps are relative to +16.
 *   op 5  goto                       op 6  inline text (unused by the cities)
 *   op 7  v[a] (= += -= *= /= %= =rand%(x+1)) x      op 8  v[a] = pointer to inline bytes
 *   op 9  skip the next instruction if v[a] (== <= < != > >=) x   (a skipped op 9 also skips its next: OR)
 *   op 10..14  host command with op−10 parameters (mode 0 immediate, else v[val]); the VM stops there.
 * Variables are signed 32-bit; comparisons are signed (slt). A "pointer" is a byte offset in the file.
 */

export interface MscdScript {
  bytes: Uint8Array;
  end: number;
  nvars: number;
}

export interface VmState {
  /** Byte offset of the next instruction in the file. */
  pc: number;
  vars: number[];
}

export interface HostCommand {
  op: number;
  cmd: number;
  /** Parameter values (immediates, or the low 16 bits of the variable). */
  params: number[];
  /** Offset of the command, for debugging. */
  at: number;
}

const CODE = 16;

function u16(b: Uint8Array, o: number) {
  return b[o] | (b[o + 1] << 8);
}
function u32(b: Uint8Array, o: number) {
  return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
}
const s32 = (v: number) => v | 0;

export function parseMscd(bytes: Uint8Array): MscdScript {
  return { bytes, end: u32(bytes, 8), nvars: u32(bytes, 12) };
}

export function newVm(script: MscdScript): VmState {
  return { pc: CODE, vars: Array(script.nvars).fill(0) };
}

function size(b: Uint8Array, pc: number): number {
  const op = u16(b, pc);
  const a = u16(b, pc + 2);
  switch (op) {
    case 5:
      return 8;
    case 6:
      return 4 + a;
    case 7:
    case 9:
      return 12;
    case 8:
      return 6 + u16(b, pc + 4);
    default:
      if (op >= 10 && op <= 14) return 4 + 4 * (op - 10);
      throw new Error(`MSCD: bad opcode ${op} at 0x${pc.toString(16)}`);
  }
}
const next = (b: Uint8Array, pc: number) => (pc + size(b, pc) + 3) & ~3;

function operand(s: MscdScript, vm: VmState, pc: number): number {
  return u16(s.bytes, pc + 6) ? vm.vars[u32(s.bytes, pc + 8)] : s32(u32(s.bytes, pc + 8));
}

/** Run until a host command (returned, PC already past it) or the end of the code (null). */
export function runUntilCommand(s: MscdScript, vm: VmState, rand: { next(): number }): HostCommand | null {
  const b = s.bytes;
  let skip = false;
  while (vm.pc - 0 < s.end) {
    const pc = vm.pc;
    const op = u16(b, pc);
    const a = u16(b, pc + 2);
    vm.pc = next(b, pc);
    if (skip) {
      skip = op === 9; // a skipped op 9 also skips the instruction after it
      continue;
    }
    if (op === 5) {
      vm.pc = CODE + u32(b, pc + 4);
    } else if (op === 7) {
      const x = operand(s, vm, pc);
      const v = vm.vars[a];
      switch (u16(b, pc + 4)) {
        case 0: vm.vars[a] = x; break;
        case 1: vm.vars[a] = s32(v + x); break;
        case 2: vm.vars[a] = s32(v - x); break;
        case 3: vm.vars[a] = Math.imul(v, x); break;
        case 4: if (x !== 0) vm.vars[a] = s32(Math.trunc(v / x)); break; // 🟡 division by 0 leaves it
        case 5: if (x !== 0) vm.vars[a] = s32(v % x); break;
        case 6: vm.vars[a] = rand.next() % (x + 1); break;
      }
    } else if (op === 8) {
      vm.vars[a] = pc + 6;
    } else if (op === 9) {
      const x = operand(s, vm, pc);
      const v = vm.vars[a];
      const cmp = u16(b, pc + 4);
      skip = [v === x, v <= x, v < x, v !== x, v > x, v >= x][cmp] ?? false;
    } else if (op >= 10 && op <= 14) {
      const params = Array.from({ length: op - 10 }, (_, j) => {
        const mode = u16(b, pc + 4 + 4 * j);
        const val = u16(b, pc + 6 + 4 * j);
        return mode ? vm.vars[val] & 0xffff : val;
      });
      return { op, cmd: a, params, at: pc };
    }
  }
  return null;
}

/** NUL-terminated text at a pointer (byte offset) stored in a variable. */
export function scriptText(s: MscdScript, ptr: number): string {
  let out = '';
  for (let o = ptr; o < s.bytes.length && s.bytes[o]; o++) out += String.fromCharCode(s.bytes[o]);
  return out;
}
