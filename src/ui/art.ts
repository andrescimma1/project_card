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
  // Facción Roja: Perfectos
  7: { file: '/art/LC007.webp', creature: 'Serpiente emplumada', habitat: { es: 'Valle con un río', en: 'River valley' } }, // Garudamon
  // Facción Roja: Campeones
  15: { file: '/art/LC015.webp', creature: 'Simio guerrero', habitat: { es: 'Selva de montaña', en: 'Mountain jungle' } }, // Apemon
  16: { file: '/art/LC016.webp', creature: 'Jabalí de guerra', habitat: { es: 'Robledal en invierno', en: 'Oak forest in winter' } }, // Tyrannomon
  17: { file: '/art/LC017.webp', creature: 'Dinosaurio acorazado', habitat: { es: 'Estepa seca', en: 'Dry steppe' } }, // Monochromon
  18: { file: '/art/LC018.webp', creature: 'Espíritu de las brasas', habitat: { es: 'Ruinas de un templo', en: 'Temple ruins' }, element: 'fire' }, // Meramon
  19: { file: '/art/LC019.webp', creature: 'Centauro arquero', habitat: { es: 'Bosque de otoño', en: 'Autumn forest' } }, // Centarumon
  20: { file: '/art/LC020.webp', creature: 'Gallo guardián', habitat: { es: 'Acantilado con una torre en ruinas', en: 'Cliff with a ruined tower' } }, // Birdramon
  26: { file: '/art/LC026.webp', creature: 'Reptil rayado del cañón', habitat: { es: 'Cañón de arenisca', en: 'Sandstone canyon' } }, // Flarerizamon
  // Facción Roja: Novatos
  27: { file: '/art/LC027.webp', creature: 'Jabato de crin roja', habitat: { es: 'Robledal en otoño', en: 'Oak forest in autumn' } }, // Agumon
  29: { file: '/art/LC029.webp', creature: 'Pollito caballero', habitat: { es: 'Corral en ruinas', en: 'Ruined courtyard' } }, // Biyomon
  30: { file: '/art/LC030.webp', creature: 'Escarabajo de carga', habitat: { es: 'Bosque bajo la lluvia', en: 'Forest in the rain' } }, // Muchomon
  33: { file: '/art/LC033.webp', creature: 'Mangosta hondera', habitat: { es: 'Orilla de un río con cañas', en: 'Reedy riverbank' } }, // Goburimon
  175: { file: '/art/LC175.webp', creature: 'Canguro boxeador', habitat: { es: 'Sabana con termiteros', en: 'Savanna with termite mounds' } }, // Veemon
  // Facción Sombría: Campeones
  126: { file: '/art/LC126.webp', creature: 'Hiena de las llaves', habitat: { es: 'Depósito de carretas viejas', en: 'Old cart yard' } }, // Gururumon
  130: { file: '/art/LC130.webp', creature: 'Camaleón del manglar', habitat: { es: 'Manglar con neblina', en: 'Misty mangrove' } }, // Darkrizamon
  // Facción Sombría: Novatos
  133: { file: '/art/LC133.webp', creature: 'Lémur ladrón', habitat: { es: 'Huerto abandonado', en: 'Abandoned orchard' } }, // BKGatomon
  134: { file: '/art/LC134.webp', creature: 'Escorpión de la vasija', habitat: { es: 'Dunas del desierto', en: 'Desert dunes' } }, // Kokuwamon
  135: { file: '/art/LC135.webp', creature: 'Polilla de papel', habitat: { es: 'Biblioteca en ruinas', en: 'Ruined library' } }, // Tsukaimon
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
