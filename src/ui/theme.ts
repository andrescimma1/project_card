import type { AttackSlot, Card, Confidence, Level, Specialty } from '../engine/cards/types';

export const SPECIALTY_NAME: Record<Specialty, string> = {
  fire: 'Fire',
  ice: 'Ice',
  nature: 'Nature',
  darkness: 'Darkness',
  rare: 'Rare',
};

export const SPECIALTY_COLOR: Record<Specialty, string> = {
  fire: 'var(--color-fire)',
  ice: 'var(--color-ice)',
  nature: 'var(--color-nature)',
  darkness: 'var(--color-darkness)',
  rare: 'var(--color-rare)',
};

export const LEVEL_NAME: Record<Level, string> = { R: 'Rookie', C: 'Champion', U: 'Ultimate', A: 'Armor' };

export const SLOT_GLYPH: Record<AttackSlot, string> = { circle: '◯', triangle: '△', cross: '✕' };

export function frameColor(card: Card): string {
  if (card.kind === 'digimon') return SPECIALTY_COLOR[card.specialty];
  if (card.kind === 'digivolve') return '#ff9edb';
  return '#c7cff0';
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
