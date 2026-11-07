/**
 * The world of our own story: the Quiet Lands. People left long ago; the creatures kept their towns and
 * their trades, and the cards keep the shape of every creature. Something is erasing those shapes from a
 * tower at the end of the map, and the player, an apprentice who has just arrived, travels town by town
 * winning tournaments until they reach it.
 *
 * The 12 places keep the order and the unlocks of the original map; only their names are ours.
 */
import type { Locale } from '../../i18n';

type Named = Record<Locale, string>;

export const CITIES: Named[] = [
  { es: 'Aldea del Cruce', en: 'Crossroads Village' },
  { es: 'Hornos Viejos', en: 'Old Kilns' },
  { es: 'Bosque Hondo', en: 'Deepwood' },
  { es: 'Puerto Escarcha', en: 'Frost Harbor' },
  { es: 'Chatarral', en: 'Scrapyard' },
  { es: 'Ciudad sin Faroles', en: 'Lampless City' },
  { es: 'Isla de Arena', en: 'Sand Island' },
  { es: 'Templo Hundido', en: 'Sunken Temple' },
  { es: 'Mirador de las Nubes', en: 'Cloud Lookout' },
  { es: 'Camino del Risco', en: 'Cliff Road' },
  { es: 'Torre del Archivero', en: "Archivist's Tower" },
  { es: 'Torre sin Fin', en: 'Endless Tower' },
];

/** The three regions of the map, with the places of each (same grouping as the original map). */
export const AREAS: { name: Named; cities: number[] }[] = [
  { name: { es: 'Tierras Bajas', en: 'Lowlands' }, cities: [0, 1, 2, 3, 4] },
  { name: { es: 'Tierras Altas', en: 'Highlands' }, cities: [5, 7, 8, 6] },
  { name: { es: 'Tierras Lejanas', en: 'Far Lands' }, cities: [9, 10, 11] },
];

/** The arenas of each place (CMD11.1 ids 3..6); an empty name is an arena the place does not have. */
export const ARENAS: Record<Locale, string[][]> = {
  es: [
    ['Arena del Cruce'],
    ['Arena de los Hornos', 'Arena Extra'],
    ['Arena del Bosque', 'Arena Extra', 'Arena del Escarabajo'],
    ['Arena Escarcha', 'Arena Extra'],
    ['Arena del Chatarral'],
    ['Arena sin Faroles', 'Arena Extra', '', 'Arena Embrujada'],
    ['Arena de la Isla'],
    ['Arena del Templo', 'Arena Extra'],
    ['Arena de las Nubes', 'Arena Extra'],
    ['Arena del Risco'],
    ['Arena del Archivero'],
    ['Arena sin Fin'],
  ],
  en: [
    ['Crossroads Arena'],
    ['Kiln Arena', 'Extra Arena'],
    ['Deepwood Arena', 'Extra Arena', 'Beetle Arena'],
    ['Frost Arena', 'Extra Arena'],
    ['Scrapyard Arena'],
    ['Lampless Arena', 'Extra Arena', '', 'Haunted Arena'],
    ['Island Arena'],
    ['Temple Arena', 'Extra Arena'],
    ['Cloud Arena', 'Extra Arena'],
    ['Cliff Arena'],
    ['Archivist Arena'],
    ['Endless Arena'],
  ],
};

/**
 * Our characters, by the key the city logic uses for them (the speaker or rival of the original). A
 * plain string is a proper name, the same in every language. Characters not named yet keep their key.
 */
export const CHARACTERS: Record<string, string | Named> = {
  Betamon: 'Nilo', // the guide: an axolotl ship's boy
  Agumon: 'Brezo', // a young boar with a red mane
  Penguinmon: 'Pipa', // a pika with a sled
  Babamon: { es: 'Abuela Retama', en: 'Grandma Retama' }, // master of the first arena
  Rosemon: 'Madreselva',
  Greymon: 'Tizón',
  WarGreymon: 'Fragua',
  BlackWarGreymon: 'Hollín',
  Tai: 'Tadeo', // another traveller who came back
  Apokarimon: { es: 'El Borrón', en: 'The Blot' }, // what is left of a creature that lost its shape
};

export function characterName(key: string, locale: Locale): string {
  const c = CHARACTERS[key];
  if (c === undefined) return key;
  return typeof c === 'string' ? c : c[locale];
}
