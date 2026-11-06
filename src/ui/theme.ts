/**
 * Presentation helpers shared by every screen. Names and colours come from our own vocabulary
 * (vocab/terms.ts, vocab/factions.ts); the rules' identifiers stay underneath.
 */
import type { Card, Confidence, Level, Specialty } from '../engine/cards/types';
import { FACTIONS, factionOfSpecialty, paletteOf } from './vocab/factions';
import { TERMS } from './vocab/terms';

/** Faction name of a specialty ("Roja"). */
export const SPECIALTY_NAME: Record<Specialty, string> = {
  fire: FACTIONS[factionOfSpecialty('fire')].name,
  ice: FACTIONS[factionOfSpecialty('ice')].name,
  nature: FACTIONS[factionOfSpecialty('nature')].name,
  darkness: FACTIONS[factionOfSpecialty('darkness')].name,
  rare: FACTIONS[factionOfSpecialty('rare')].name,
};

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

export const LEVEL_NAME: Record<Level, string> = TERMS.levels;

export function frameColor(card: Card): string {
  return paletteOf(card).main;
}

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  code: 'Código del juego',
  rom: 'ROM',
  'rom+text': 'ROM + texto',
  inferred: 'Inferido',
  unknown: 'Desconocido',
};

export const CONFIDENCE_COLOR: Record<Confidence, string> = {
  code: 'var(--color-verified)',
  rom: 'var(--color-verified)',
  'rom+text': 'var(--color-verified)',
  inferred: 'var(--color-probable)',
  unknown: 'var(--color-unknown)',
};
