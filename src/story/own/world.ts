/**
 * The world of our own story: the Quiet Lands. People left long ago; the creatures kept their towns and
 * their trades, and the cards keep the shape of every creature. Something is erasing those shapes from a
 * tower at the end of the map, and the player, an apprentice who has just arrived, travels town by town
 * winning tournaments until they reach it.
 *
 * The 12 places keep the order and the unlocks of the original map; only their names are ours.
 */
import { progression } from '../../engine/progression/tables';
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
  // Aldea del Cruce
  Betamon: 'Nilo', // the guide: an axolotl ship's boy
  Agumon: 'Brezo', // a young boar with a red mane
  Penguinmon: 'Pipa', // a pika with a sled
  Babamon: { es: 'Abuela Retama', en: 'Grandma Retama' }, // master of the first arena
  Rosemon: 'Madreselva',
  Greymon: 'Tizón',
  WarGreymon: 'Fragua',
  BlackWarGreymon: 'Hollín',
  Apokarimon: { es: 'El Borrón', en: 'The Blot' }, // what is left of a creature that lost its shape
  // travellers: people who came back to the Quiet Lands, like the player
  Tai: 'Tadeo',
  Davis: 'Dante',
  Sora: 'Soledad',
  Mimi: 'Mina',
  Keely: 'Lía',
  Matt: 'Mateo',
  Cody: 'Iker',
  Joe: 'Jacinto',
  Izzy: 'Isidro',
  'T.K.': 'Tomás',
  Kari: 'Clara',
  Ken: 'Fermín', // the Collector, once he gives it up
  'Digimon Emperor': { es: 'El Coleccionista', en: 'The Collector' }, // takes over the arenas
  // Hornos Viejos
  Veemon: 'Brinco',
  ExVeemon: 'Zarpazo',
  Flamedramon: 'Chispero',
  Raidramon: 'Trueno',
  Paildramon: 'Dúo',
  Magnamon: 'Áureo',
  Imperialdramon: 'Soberano',
  Meramon: 'Pavesa',
  Phoenixmon: 'Ceniza',
  Garudamon: 'Plumaria',
  // Bosque Hondo
  Wormmon: 'Hebra',
  Veedramon: 'Escamo',
  Ninjamon: 'Sigilo',
  Halsemon: 'Vendaval',
  Shurimon: 'Molinete',
  Lillymon: 'Azucena',
  Vegiemon: 'Musgo',
  Aquilamon: 'Aquilino',
  Sylphymon: 'Céfiro',
  HerculesKabuterimon: 'Coloso',
  Hawkmon: 'Trino',
  Kuwagamon: 'Tenaza',
  Valkyrimon: 'Brunilda',
  // Puerto Escarcha
  Garurumon: 'Ventisca',
  Stingmon: 'Aguijón',
  MetalGarurumon: 'Acero',
  ',MetalGarurumon': 'Acero',
  BKMetalGarurumon: { es: 'Acero Negro', en: 'Black Steel' },
  Frigimon: 'Témpano',
  Whamon: 'Muelle',
  Digmon: 'Barreno',
  Submarimon: 'Calado',
  Ankylomon: 'Coraza',
  Shakkoumon: 'Ánfora',
  Armadillomon: 'Gema',
  Vikemon: 'Fiordo',
  // Chatarral
  MetalMamemon: 'Tuerca',
  Nanimon: 'Gruñón',
  KingSukamon: { es: 'Rey Basural', en: 'Junk King' },
  Shadramon: 'Humo',
  Zudomon: 'Martillo',
  Hagurumon: 'Cuerda',
  ShellNumemon: 'Babosín',
  Thundermon: 'Tronada',
  SuperStarmon: 'Lucero',
  // Ciudad sin Faroles
  Myotismon: 'Mortaja', // wants every shape to go grey and quiet
  VenomMyotismon: { es: 'Mortaja Voraz', en: 'Ravenous Mortaja' },
  Devimon: 'Grajo',
  MegaKabuterimon: 'Astado',
  Quetzalmon: 'Quetzal',
  Bakemon: 'Sábana',
  SkullGreymon: 'Osario',
  // Isla de Arena
  Leomon: 'Melena',
  MetalEtemon: 'Latón',
  // Templo Hundido
  Pegasusmon: 'Alazán',
  Baronmon: 'Barón',
  MagnaAngemon: 'Custodio',
  Angemon: 'Celeste',
  Patamon: 'Bollo',
  Centarumon: 'Saeta',
  Tyrannomon: 'Campana',
  Seraphimon: 'Serafín',
  // Mirador de las Nubes
  Gatomon: 'Zarpa',
  Wizardmon: 'Abalorio',
  Tylomon: 'Ancla',
  Nefertimon: 'Esfinge',
  Angewomon: 'Aurora',
  AeroVeedramon: 'Altura',
  Magnadramon: 'Magna',
  // Camino del Risco
  Goburimon: 'Honda',
  DemiDevimon: 'Chismes',
  Megadramon: 'Garfio',
  Gigadramon: 'Tenazón',
  Piximon: 'Duende',
  GranKuwagamon: 'Mandíbula',
  // Torre del Archivero
  MetalGreymon: 'Yunque',
  Omnimon: 'Centinela',
  WereGarurumon: 'Aullido',
  Togemon: 'Espina',
  Kabuterimon: 'Cornelio',
  Ikkakumon: 'Rompehielos',
  Birdramon: 'Gallardo',
  // Torre sin Fin
  Piedmon: { es: 'El Bufón', en: 'The Jester' },
  Puppetmon: 'Hilván',
  Diaboromon: 'Plaga',
  Infermon: 'Mangle',
  Tuskmon: 'Colmillo',
  Phantomon: { es: 'Tres Llaves', en: 'Three Keys' },
  MegaSeadramon: 'Marejada',
  MetalSeadramon: 'Casco',
  Machinedramon: 'Engranaje',
  LadyDevimon: { es: 'Dama Negra', en: 'Black Lady' },
  // who they are is the mystery: they keep their sign
  '???????': '???????',
  '?????????': '?????????',
  A: 'A',
};

/**
 * The 10 keywords the player can type in Cloud Lookout (CMD10.15), in the order of the original table:
 * the index is what the city logic checks, so each of ours gives the same reward as the original word,
 * which is still accepted.
 */
export const KEYWORDS = ['CENTINELA-1', 'FRAGUA', 'CENTINELA-2', 'ACERO', 'ALTURA', 'COLOSO', 'MORTAJA', 'BUFON', 'LATON', 'ABUELO'];

/** Index of a typed keyword (ours or the original), or −1. */
export function keywordIndex(word: string): number {
  const w = word.trim().toUpperCase();
  const own = KEYWORDS.indexOf(w);
  return own >= 0 ? own : progression.world.keywords.indexOf(w);
}

export function characterName(key: string, locale: Locale): string {
  const c = CHARACTERS[key];
  if (c === undefined) return key;
  return typeof c === 'string' ? c : c[locale];
}
