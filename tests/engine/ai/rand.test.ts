/**
 * The CPU AI draws its randomness from the PSX libc rand() (SLUS 0x80069124):
 *   seed = seed * 0x41C64E6D + 12345;  return (seed >> 16) & 0x7FFF
 * Reference values computed independently (Python big-int arithmetic).
 */
import { describe, expect, it } from 'vitest';
import { psxRand } from '../../../src/engine/ai/rand';

describe('psxRand (SLUS 0x80069124)', () => {
  it('reproduces the PSX LCG sequence from seed 0', () => {
    const r = psxRand(0);
    expect([r.next(), r.next(), r.next(), r.next(), r.next()]).toEqual([0, 21468, 9988, 22117, 3498]);
  });

  it('wraps at 32 bits and exposes the seed', () => {
    const r = psxRand(123456789);
    expect([r.next(), r.next(), r.next()]).toEqual([3536, 17195, 26824]);
    expect(r.seed).toBe(3905459128);
  });
});
