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
  8: { file: '/art/LC008.webp', creature: 'Simio de cuatro brazos', habitat: { es: 'Cumbre nevada', en: 'Snowy summit' } }, // MasterTyrannomon
  9: { file: '/art/LC009.webp', creature: 'Jabalí titán', habitat: { es: 'Puerta de una fortaleza en ruinas', en: 'Ruined fortress gate' } }, // MetalGreymon
  10: { file: '/art/LC010.webp', creature: 'Dragón del cañón', habitat: { es: 'Desfiladero de arenisca', en: 'Sandstone gorge' } }, // Vermilimon
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
  // Facción Sombría: Perfectos
  109: { file: '/art/LC109.webp', creature: 'Leviatán del manglar', habitat: { es: 'Manglar al amanecer', en: 'Mangrove at dawn' } }, // Infermon
  114: { file: '/art/LC114.webp', creature: 'Hiena de tres cabezas', habitat: { es: 'Cementerio en un acantilado', en: 'Clifftop graveyard' } }, // Phantomon
  // Facción Sombría: Campeones
  126: { file: '/art/LC126.webp', creature: 'Hiena de las llaves', habitat: { es: 'Depósito de carretas viejas', en: 'Old cart yard' } }, // Gururumon
  130: { file: '/art/LC130.webp', creature: 'Camaleón del manglar', habitat: { es: 'Manglar con neblina', en: 'Misty mangrove' } }, // Darkrizamon
  // Facción Sombría: Novatos
  133: { file: '/art/LC133.webp', creature: 'Lémur ladrón', habitat: { es: 'Huerto abandonado', en: 'Abandoned orchard' } }, // BKGatomon
  134: { file: '/art/LC134.webp', creature: 'Escorpión de la vasija', habitat: { es: 'Dunas del desierto', en: 'Desert dunes' } }, // Kokuwamon
  135: { file: '/art/LC135.webp', creature: 'Polilla de papel', habitat: { es: 'Biblioteca en ruinas', en: 'Ruined library' } }, // Tsukaimon
  // Facción Rara: Campeones
  157: { file: '/art/LC157.webp', creature: 'Mapache fiestero', habitat: { es: 'Salón de baile abandonado', en: 'Abandoned ballroom' } }, // Numemon
  159: { file: '/art/LC159.webp', creature: 'Cangrejo dolmen', habitat: { es: 'Páramo con piedras antiguas', en: 'Moor with standing stones' } }, // Rockmon
  161: { file: '/art/LC161.webp', creature: 'Zorro charlatán', habitat: { es: 'Mercado en un cruce de caminos', en: 'Crossroads market' } }, // NiseDrimogemon
  // Facción Rara: Novatos
  166: { file: '/art/LC166.webp', creature: 'Cochinilla de relojería', habitat: { es: 'Taller de relojero abandonado', en: "Abandoned watchmaker's workshop" } }, // Hagurumon
  168: { file: '/art/LC168.webp', creature: 'Gecko de vidrio soplado', habitat: { es: 'Invernadero abandonado', en: 'Abandoned greenhouse' } }, // ClearAgumon
  170: { file: '/art/LC170.webp', creature: 'Tapir bailarín', habitat: { es: 'Feria abandonada', en: 'Abandoned fair' } }, // Psychemon
  171: { file: '/art/LC171.webp', creature: 'Zarigüeya de la careta', habitat: { es: 'Trastienda de un teatro ambulante', en: 'Backstage of a traveling theater' } }, // ModokiBetamon
  190: { file: '/art/LC190.webp', creature: 'Erizo joyero', habitat: { es: 'Orilla de un río con geodas', en: 'Riverbank with geodes' } }, // Armadillomon
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
