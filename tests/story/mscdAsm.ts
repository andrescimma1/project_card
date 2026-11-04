/** Hand assembler for MSCD bytecode (tests only). */
/** Tiny assembler for the 5 opcode shapes, padding every instruction to 4 bytes. */
export function asm(nvars: number, ...ins: number[][]): Uint8Array {
  const words: number[] = [];
  for (const i of ins) {
    const bytes = i;
    words.push(...bytes, ...Array((4 - (bytes.length % 4)) % 4).fill(0));
  }
  const end = 16 + words.length;
  const head = [0x4d, 0x53, 0x43, 0x44, 3, 0, 0, 0, end & 255, end >> 8, 0, 0, nvars, 0, 0, 0];
  return new Uint8Array([...head, ...words]);
}
export const u16 = (v: number) => [v & 255, (v >> 8) & 255];
export const u32 = (v: number) => [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255];
export const set = (v: number, sub: number, x: number, fromVar = false) => [...u16(7), ...u16(v), ...u16(sub), ...u16(fromVar ? 1 : 0), ...u32(x)];
export const skipIf = (v: number, sub: number, x: number) => [...u16(9), ...u16(v), ...u16(sub), ...u16(0), ...u32(x)];
export const goto = (codeOffset: number) => [...u16(5), 0, 0, ...u32(codeOffset)];
export const cmd = (op: number, c: number, ...p: [number, number][]) => [...u16(op), ...u16(c), ...p.flatMap(([m, v]) => [...u16(m), ...u16(v)])];
export const str = (v: number, s: string) => [...u16(8), ...u16(v), ...u16(s.length + 1), ...[...s].map((c) => c.charCodeAt(0)), 0];
