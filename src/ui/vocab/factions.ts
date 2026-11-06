/**
 * Factions, habitats and elements are three different things:
 * - Faction: the creature's temperament and its card colour. The rules call it "specialty" and use it
 *   (×3 effects, specialty changes), so it maps 1:1 onto the rules' five specialties.
 * - Habitat: where the creature lives (its illustration's background). Presentation only.
 * - Element: what it is made of or wields, if anything (fire, ice…). Presentation only; most creatures
 *   of the Red Faction have no fire at all.
 */
import type { Card, Specialty } from '../../engine/cards/types';
import { m, type Messages } from '../../i18n';

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
  /** "Roja" / "Red" (shown as "Facción Roja"), in the current language. */
  readonly name: string;
  readonly temperament: string;
  palette: Palette;
}

/** Only the Red Faction is defined by design so far; the other four are provisional. Names and temperaments
 * come from the current language (i18n terms.factions); colours are the same in every language. */
const faction = (id: FactionId, palette: Palette): Faction => ({
  id,
  palette,
  get name() {
    return m().terms.factions[id].name;
  },
  get temperament() {
    return m().terms.factions[id].temperament;
  },
});

export const FACTIONS: Record<FactionId, Faction> = {
  red: faction('red', { main: '#b23a2c', dark: '#5a1b13', light: '#efb48e' }),
  blue: faction('blue', { main: '#3e6f91', dark: '#1a3347', light: '#a9c9dd' }),
  green: faction('green', { main: '#5c7f37', dark: '#2a3d17', light: '#c1d692' }),
  shadow: faction('shadow', { main: '#634c80', dark: '#2a1f3a', light: '#c3b1dc' }),
  gold: faction('gold', { main: '#b6862c', dark: '#59400f', light: '#efd690' }),
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

/** Elements a creature can have (presentation only, optional); their names are in i18n terms.elements. */
export type Element = keyof Messages['terms']['elements'];
export const elementName = (e: Element) => m().terms.elements[e];
