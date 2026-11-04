/**
 * MSCD script VM — SLUS 0x80020F54 (docs/research/progresion/01-mundo-y-guiones.md §1).
 * Bytecode is assembled by hand here; the last test runs a real city script from the user's disc.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { newVm, parseMscd, runUntilCommand, scriptText } from '../../src/story/vm';
import { readDrvPath } from '../../tools/extract/drv';

import { asm, cmd, goto, set, skipIf, str } from './mscdAsm';
const rand = (...v: number[]) => {
  let i = 0;
  return { next: () => v[Math.min(i++, v.length - 1)] };
};

describe('MSCD VM (SLUS 0x80020F54)', () => {
  it('arithmetic on variables, with immediates or other variables', () => {
    const s = parseMscd(asm(8, set(1, 0, 10), set(1, 1, 5), set(2, 0, 3), set(1, 3, 2, true), set(1, 2, 1), set(1, 5, 4), cmd(10, 7)));
    const vm = newVm(s);
    expect(runUntilCommand(s, vm, rand(0))).toMatchObject({ op: 10, cmd: 7, params: [] });
    expect(vm.vars[1]).toBe(((10 + 5) * 3 - 1) % 4);
  });

  it('rand() % (x + 1)', () => {
    const s = parseMscd(asm(4, set(3, 6, 7), cmd(10, 0)));
    const vm = newVm(s);
    runUntilCommand(s, vm, rand(13));
    expect(vm.vars[3]).toBe(13 % 8);
  });

  it('if (!cond) goto: the skip jumps over the goto when the condition holds', () => {
    // v1 = 5; skip next if v1 == 5; goto END; v2 = 1; END: CMD10.0
    const prog = (k: number) => asm(4, set(1, 0, k), skipIf(1, 0, 5), goto(44), set(2, 0, 1), cmd(10, 0));
    for (const [k, v2] of [[5, 1], [4, 0]]) {
      const s = parseMscd(prog(k));
      const vm = newVm(s);
      runUntilCommand(s, vm, rand(0));
      expect(vm.vars[2]).toBe(v2);
    }
  });

  it('chained skips make an OR: a skipped op 9 also skips the next instruction', () => {
    // if (v1 == 1 || v1 == 2) v2 = 1
    const prog = (k: number) => asm(4, set(1, 0, k), skipIf(1, 0, 1), skipIf(1, 0, 2), goto(56), set(2, 0, 1), cmd(10, 0));
    expect([1, 2, 3].map((k) => {
      const s = parseMscd(prog(k));
      const vm = newVm(s);
      runUntilCommand(s, vm, rand(0));
      return vm.vars[2];
    })).toEqual([1, 1, 0]);
  });

  it('signed comparisons, host commands with immediate or variable parameters, inline text', () => {
    const s = parseMscd(asm(8, set(1, 0, 0xffffffff), skipIf(1, 2, 0), set(2, 0, 9), set(3, 0, 42), str(4, 'Hi!'), cmd(12, 2, [0, 7], [1, 3])));
    const vm = newVm(s);
    const c = runUntilCommand(s, vm, rand(0));
    expect(vm.vars[2]).toBe(0); // −1 < 0, so v2 = 9 was skipped
    expect(c).toMatchObject({ op: 12, cmd: 2, params: [7, 42] });
    expect(scriptText(s, vm.vars[4])).toBe('Hi!');
  });

  it('returns null at the end of the code', () => {
    const s = parseMscd(asm(2, set(1, 0, 1)));
    expect(runUntilCommand(s, newVm(s), rand(0))).toBeNull();
  });
});

const disc = process.env.DCB_DISC;
describe.skipIf(!disc || !existsSync(join(disc ?? '', 'C.DRV')))('a real city script', () => {
  it('CITY00 runs from its start up to host commands, with 372 variables', () => {
    const s = parseMscd(readDrvPath(join(disc!, 'C.DRV'), 'DEBUG/CITY00.MSD'));
    expect(s.nvars).toBe(372);
    const vm = newVm(s);
    vm.vars[0] = 1;
    const c = runUntilCommand(s, vm, rand(0));
    expect(c).not.toBeNull();
    expect(c!.op).toBeGreaterThanOrEqual(10);
  });
});
