/**
 * Factions, habitats and elements are three different things:
 * - Faction: the creature's temperament and its card colour. The rules call it "specialty" and use it
 *   (×3 effects, specialty changes), so it maps 1:1 onto the rules' five specialties.
 * - Habitat: where the creature lives (its illustration's background). Presentation only.
 * - Element: what it is made of or wields, if anything (fire, ice…). Presentation only; most creatures
 *   of the Red Faction have no fire at all.
 */
import type { Card, Specialty } from '../../engine/cards/types';

export type FactionId = 'red' | 'blue' | 'green' | 'shadow' | 'gold';

export interface Palette {
  /** Frame and emblem colour. */
  main: string;
  /** Deep tone: shadows, edges, the band behind light text. */
  dark: string;
  /** Pale tone: highlights, text on dark. */
  light: string;
}

export interface Faction {
  id: FactionId;
  /** "Roja" (shown as "Facción Roja"). */
  name: string;
  temperament: string;
  palette: Palette;
}

/** Only the Red Faction is defined by design so far; the other four are provisional and easy to rename. */
export const FACTIONS: Record<FactionId, Faction> = {
  red: { id: 'red', name: 'Roja', temperament: 'Agresividad, valentía, orgullo y ataque frontal', palette: { main: '#b23a2c', dark: '#5a1b13', light: '#efb48e' } },
  blue: { id: 'blue', name: 'Azul', temperament: 'Calma, paciencia y control (provisional)', palette: { main: '#3e6f91', dark: '#1a3347', light: '#a9c9dd' } },
  green: { id: 'green', name: 'Verde', temperament: 'Resistencia, crecimiento y defensa (provisional)', palette: { main: '#5c7f37', dark: '#2a3d17', light: '#c1d692' } },
  shadow: { id: 'shadow', name: 'Sombría', temperament: 'Astucia, engaño y desgaste (provisional)', palette: { main: '#634c80', dark: '#2a1f3a', light: '#c3b1dc' } },
  gold: { id: 'gold', name: 'Dorada', temperament: 'Rareza, nobleza y equilibrio (provisional)', palette: { main: '#b6862c', dark: '#59400f', light: '#efd690' } },
};

const OF_SPECIALTY: Record<Specialty, FactionId> = { fire: 'red', ice: 'blue', nature: 'green', darkness: 'shadow', rare: 'gold' };

export const factionOfSpecialty = (s: Specialty): FactionId => OF_SPECIALTY[s];

/** Creatures belong to a faction; support and evolution cards do not. */
export function factionOf(card: Card): Faction | null {
  return card.kind === 'digimon' ? FACTIONS[OF_SPECIALTY[card.specialty]] : null;
}

/** Palettes of the cards that are not creatures. */
export const SUPPORT_PALETTE: Palette = { main: '#8c6b43', dark: '#3d2b17', light: '#e2c999' };
export const EVOLUTION_PALETTE: Palette = { main: '#3f7f77', dark: '#173330', light: '#a6d6cc' };

export function paletteOf(card: Card): Palette {
  const f = factionOf(card);
  if (f) return f.palette;
  return card.kind === 'digivolve' ? EVOLUTION_PALETTE : SUPPORT_PALETTE;
}

/** Elements a creature can have (presentation only, optional). */
export const ELEMENTS = ['Fuego', 'Agua', 'Hielo', 'Tierra', 'Roca', 'Aire', 'Planta', 'Rayo', 'Metal', 'Luz', 'Sombra'] as const;
export type Element = (typeof ELEMENTS)[number];
