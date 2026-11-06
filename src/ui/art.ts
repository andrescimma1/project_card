/**
 * Where each card's picture comes from.
 *
 * - Original art: extracted from the user's disc (npm run extract:art), 64×64, drawn pixelated.
 * - Our own art: the new creatures that are replacing the Digimon. It takes priority by card id.
 *   Masters (as generated) go in public/cards-art/; the game uses a 512 px WebP in public/art/.
 *   Delete a line to bring the original art back.
 */
import { getLocale, type Locale } from '../i18n';
import { elementName, type Element } from './vocab/factions';

export interface CustomArt {
  file: string;
  /** Working name of our creature. */
  creature: string;
  /** Where it lives (its illustration's background), per language. Presentation only. */
  habitat?: Record<Locale, string>;
  /** What it is made of or wields, if anything. Presentation only (not its faction). */
  element?: Element;
}

export const CUSTOM_ART: Partial<Record<number, CustomArt>> = {
  15: { file: '/art/LC015.webp', creature: 'Simio guerrero', habitat: { es: 'Selva de montaña', en: 'Mountain jungle' } }, // Apemon
  17: { file: '/art/LC017.webp', creature: 'Dinosaurio acorazado', habitat: { es: 'Estepa seca', en: 'Dry steppe' } }, // Monochromon
  18: { file: '/art/LC018.webp', creature: 'Espíritu de las brasas', habitat: { es: 'Ruinas de un templo', en: 'Temple ruins' }, element: 'fire' }, // Meramon
  19: { file: '/art/LC019.webp', creature: 'Centauro arquero', habitat: { es: 'Bosque de otoño', en: 'Autumn forest' } }, // Centarumon
  26: { file: '/art/LC026.webp', creature: 'Reptil rayado del cañón', habitat: { es: 'Cañón de arenisca', en: 'Sandstone canyon' } }, // Flarerizamon
};

export function isCustomArt(cardId: number): boolean {
  return CUSTOM_ART[cardId] !== undefined;
}

export function artUrl(cardId: number): string {
  return CUSTOM_ART[cardId]?.file ?? `/card-art/LC${String(cardId).padStart(3, '0')}.png`;
}

/** Habitat and element of a creature with our own art, in the current language (null when it has none). */
export function creatureProfile(cardId: number): { habitat: string | null; element: string | null } | null {
  const a = CUSTOM_ART[cardId];
  if (!a || (!a.habitat && !a.element)) return null;
  return { habitat: a.habitat?.[getLocale()] ?? null, element: a.element ? elementName(a.element) : null };
}
