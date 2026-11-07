/**
 * Readable listing of an MSCD script, to study a city's logic while writing our own scripts:
 *   npx tsx tools/mscd-listing.ts public/scripts/CITY00.MSD > out.txt
 * The listing of an original script contains the game's dialogue: keep it out of git.
 */
import { readFileSync } from 'node:fs';

const OPS7 = ['=', '+=', '-=', '*=', '/=', '%=', '=rand%'];
const OPS9 = ['==', '<=', '<', '!=', '>', '>='];

const b = readFileSync(process.argv[2]);
const u16 = (o: number) => b[o] | (b[o + 1] << 8);
const u32 = (o: number) => (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
const end = u32(8);

const hex = (n: number) => '0x' + n.toString(16).toUpperCase().padStart(4, '0');
const text = (o: number, n: number) => {
  let t = '';
  for (let i = 0; i < n && b[o + i]; i++) t += String.fromCharCode(b[o + i]);
  return t;
};
const operand = (pc: number) => (u16(pc + 6) ? `v${u32(pc + 8)}` : String(u32(pc + 8) | 0));

const targets = new Set<number>();
const ins: { pc: number; line: string }[] = [];
for (let pc = 16; pc < end; ) {
  const op = u16(pc);
  const a = u16(pc + 2);
  let size: number;
  let line: string;
  if (op === 5) {
    size = 8;
    const t = 16 + u32(pc + 4);
    targets.add(t);
    line = `goto ${hex(t)}`;
  } else if (op === 6) {
    size = 4 + a;
    line = `inline ${a} bytes`;
  } else if (op === 7) {
    size = 12;
    line = `v${a} ${OPS7[u16(pc + 4)] ?? '?'} ${operand(pc)}`;
  } else if (op === 9) {
    size = 12;
    line = `skip unless v${a} ${OPS9[u16(pc + 4)] ?? '?'} ${operand(pc)}`;
  } else if (op === 8) {
    size = 6 + u16(pc + 4);
    line = `v${a} = @${hex(pc)} "${text(pc + 6, u16(pc + 4))}"`;
  } else if (op >= 10 && op <= 14) {
    size = 4 + 4 * (op - 10);
    const params = Array.from({ length: op - 10 }, (_, i) => (u16(pc + 4 + 4 * i) ? `v${u16(pc + 6 + 4 * i)}` : String(u16(pc + 6 + 4 * i))));
    line = `CMD${op}.${a}(${params.join(', ')})`;
  } else throw new Error(`bad opcode ${op} at ${hex(pc)}`);
  ins.push({ pc, line });
  pc = (pc + size + 3) & ~3;
}
for (const { pc, line } of ins) console.log(`${targets.has(pc) ? 'L' : ' '}${hex(pc)}  ${line}`);
