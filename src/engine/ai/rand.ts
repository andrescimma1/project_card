/**
 * PSX libc rand() as used by the CPU AI (SLUS 0x80069124):
 *   seed = seed * 0x41C64E6D + 12345 (mod 2^32);  return (seed >> 16) & 0x7FFF   → 0..32767
 * The AI keeps its own generator (seeded by the session) so its choices are reproducible
 * without touching the match RNG in GameState.
 */
export interface PsxRand {
  /** Current 32-bit seed. */
  readonly seed: number;
  /** Next value in 0..32767. */
  next(): number;
}

export function psxRand(seed: number): PsxRand {
  let s = seed >>> 0;
  return {
    get seed() {
      return s;
    },
    next() {
      s = (Math.imul(s, 0x41c64e6d) + 12345) >>> 0;
      return (s >>> 16) & 0x7fff;
    },
  };
}
