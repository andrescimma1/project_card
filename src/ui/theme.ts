/**
 * Presentation helpers shared by every screen. Names and colours come from our own vocabulary
 * (vocab/terms.ts, vocab/factions.ts); the rules' identifiers stay underneath.
 */
import type { Card, Confidence, Level, Specialty } from '../engine/cards/types';
import { FACTIONS, factionOfSpecialty, paletteOf } from './vocab/factions';
import { m } from '../i18n';
import { TERMS } from './vocab/terms';

/** A record whose values are read from the current language on every access. */
function live<K extends string, V>(read: (k: K) => V): Record<K, V> {
  return new Proxy({} as Record<K, V>, { get: (_, k) => read(k as K) });
}

/** Faction name of a specialty ("Roja" / "Red"), in the current language. */
export const SPECIALTY_NAME: Record<Specialty, string> = live((s: Specialty) => FACTIONS[factionOfSpecialty(s)].name);

/** Faction colour of a specialty. */
export const SPECIALTY_COLOR: Record<Specialty, string> = {
  fire: FACTIONS.red.palette.main,
  ice: FACTIONS.blue.palette.main,
  nature: FACTIONS.green.palette.main,
  darkness: FACTIONS.shadow.palette.main,
  rare: FACTIONS.gold.palette.main,
};

/** A lighter tone of the faction colour, readable on the dark surfaces. */
export const SPECIALTY_TEXT: Record<Specialty, string> = {
  fire: FACTIONS.red.palette.light,
  ice: FACTIONS.blue.palette.light,
  nature: FACTIONS.green.palette.light,
  darkness: FACTIONS.shadow.palette.light,
  rare: FACTIONS.gold.palette.light,
};

export const LEVEL_NAME: Record<Level, string> = live((l: Level) => TERMS.levels[l]);

export function frameColor(card: Card): string {
  return paletteOf(card).main;
}

/** How each decoded value was verified, in the current language. */
export const CONFIDENCE_LABEL: Record<Confidence, string> = live((c: Confidence) => m().research.confidence[c]);

export const CONFIDENCE_COLOR: Record<Confidence, string> = {
  code: 'var(--color-verified)',
  rom: 'var(--color-verified)',
  'rom+text': 'var(--color-verified)',
  inferred: 'var(--color-probable)',
  unknown: 'var(--color-unknown)',
};
