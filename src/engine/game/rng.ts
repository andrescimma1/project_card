/**
 * Deterministic PRNG (mulberry32). The state lives in GameState.rng so a whole match can be
 * replayed from its seed and action list. (The original uses the PSX rand(); exact sequence
 * reproduction is not a goal — only the rules that consume randomness are.)
 */
import type { GameState, Slot } from './types';

export function nextRandom(state: GameState): number {
  let t = (state.rng = (state.rng + 0x6d2b79f5) >>> 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function randomInt(state: GameState, n: number): number {
  return Math.floor(nextRandom(state) * n);
}

/**
 * Shuffle the cards of a zone and pack them at the END of the slot array (top = first card).
 * Packing detail of the game's shuffle (SLUS 0x80041430) is not decoded; card order is random either way.
 */
export function shuffleZone(state: GameState, zone: Slot[]): void {
  const cards = zone.filter((x): x is number => x !== null);
  for (let i = cards.length - 1; i > 0; i--) {
    const j = randomInt(state, i + 1);
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  zone.fill(null);
  cards.forEach((c, i) => (zone[zone.length - cards.length + i] = c));
}
