/**
 * Where each card's picture comes from.
 *
 * - Original art: extracted from the user's disc (npm run extract:art), 64×64, drawn pixelated.
 * - Our own art: the new creatures that are replacing the Digimon. It takes priority by card id.
 *   Masters (as generated) go in public/cards-art/; the game uses a 512 px WebP in public/art/.
 *   Delete a line to bring the original art back.
 */
import type { Element } from './vocab/factions';

export interface CustomArt {
  file: string;
  /** Working name of our creature. */
  creature: string;
  /** Where it lives (its illustration's background). Presentation only. */
  habitat?: string;
  /** What it is made of or wields, if anything. Presentation only (not its faction). */
  element?: Element;
}

export const CUSTOM_ART: Partial<Record<number, CustomArt>> = {
  15: { file: '/art/LC015.webp', creature: 'Simio guerrero', habitat: 'Selva de montaña' }, // Apemon
  17: { file: '/art/LC017.webp', creature: 'Dinosaurio acorazado', habitat: 'Estepa seca' }, // Monochromon
  18: { file: '/art/LC018.webp', creature: 'Espíritu de las brasas', habitat: 'Ruinas de un templo', element: 'Fuego' }, // Meramon
  19: { file: '/art/LC019.webp', creature: 'Centauro arquero', habitat: 'Bosque de otoño' }, // Centarumon
  26: { file: '/art/LC026.webp', creature: 'Reptil rayado del cañón', habitat: 'Cañón de arenisca' }, // Flarerizamon
};

export function isCustomArt(cardId: number): boolean {
  return CUSTOM_ART[cardId] !== undefined;
}

export function artUrl(cardId: number): string {
  return CUSTOM_ART[cardId]?.file ?? `/card-art/LC${String(cardId).padStart(3, '0')}.png`;
}
