/**
 * Our names for the 159 built-in decks (DECK2 records), by record index. The story, the battle screen and the
 * deck lists show these instead of the original names. A deck shows as "Mazo <name>" / "<name> Deck".
 * Records that repeat an original deck (same name and owner) repeat its name here.
 */
import { getLocale, m, type Locale } from '../../i18n';
import { characterName } from './world';

type Name = readonly [es: string, en: string];

const FIGHTBACK: Name = ['Contragolpe', 'Counterblow'];
const BLAST_HEART: Name = ['Corazón de Brasa', 'Ember Heart'];
const SUNLIT: Name = ['Plumas al Sol', 'Sunlit Feathers'];
const MEADOW: Name = ['Hadas del Prado', 'Meadow Sprites'];
const ARSENAL: Name = ['Arsenal', 'Arsenal'];
const SNARES: Name = ['Trampas Ocultas', 'Hidden Snares'];
const VOID: Name = ['Vacío Desesperado', 'Desperate Void'];
const FACES: Name = ['Caras Raras', 'Funny Faces'];

export const DECK_NAMES: readonly Name[] = [
  ['Primeros Pasos', 'First Steps'], // 0 tutorial
  ['Tricolor', 'Tricolor'],
  ['de Pipa', "Pipa's"],
  ['Fuerza Nueva', 'New Strength'],
  ['Brasa Viva', 'Live Ember'],
  ['Cielo de Ceniza', 'Ash Sky'], // 5
  ['Estampida', 'Stampede'],
  ['Brote Veloz', 'Quick Sprout'],
  ['Relevo', 'Relay'],
  ['Escama Victoriosa', 'Victory Scale'],
  ['de Prueba', 'Tryout'], // 10
  ['Gran Banquete', 'Grand Feast'],
  ['Rompeolas', 'Breakwater'],
  FIGHTBACK,
  ['Enjambre Oscuro', 'Dark Swarm'],
  ['Caja de Sorpresas', 'Surprise Box'], // 15
  ['Baba Pegajosa', 'Sticky Slime'],
  ['¡Viva el Rey!', 'Long Live the King'],
  ['Cortina de Humo', 'Smokescreen'],
  ['Hilo Firme', 'Strong Thread'],
  ['Picadura Sombría', 'Shadow Sting'], // 20
  ['Humo Renacido', 'Smoke Reborn'],
  ['Pluma Estelar', 'Star Feather'],
  ['Vitrina', 'Showcase'],
  ['Flecha Ardiente', 'Burning Arrow'],
  ['Rugido Antiguo', 'Ancient Roar'], // 25
  ['Cazasombras', 'Shadowbane'],
  ['Corazón de Horno', 'Kiln Heart'],
  ['¡Bingo!', 'Bingo!'],
  ['Paso Firme', 'Steady Stride'],
  ['Buen Viento', 'Fair Wind'], // 30
  ['Chistera', 'Top Hat'],
  ['Caída Libre', 'Free Fall'],
  ['Uña Afilada', 'Sharp Claw'],
  ['Damas del Cielo', 'Sky Ladies'],
  ['Desbocado', 'Runaway'], // 35
  ['Evolución Oscura', 'Dark Evolution'],
  ['Gancho Negro', 'Black Hook'],
  ['Doble Garra', 'Twin Claw'],
  ['Púas', 'Spines'],
  ['Rompecorazas', 'Shellbreaker'], // 40
  ['Apagafuegos', 'Firequench'],
  ['Primer Vuelo', 'First Flight'],
  ['Aullido Lunar', 'Moon Howl'],
  ['Siete Formas', 'Seven Shapes'],
  ['Embestida', 'Rampage'], // 45
  ['Hoz y Cerrojo', 'Sickle and Lock'],
  ['Pleamar', 'High Tide'],
  ['Rey de la Niebla', 'Fog King'],
  ['Garra de Selva', 'Jungle Claw'],
  ['Ala Helada', 'Frozen Wing'], // 50
  ['Fanfarria', 'Fanfare'],
  ['Gris Renacido', 'Grey Reborn'],
  ['¡Evoluciona!', 'Evolve!'],
  ['Revés', 'Backhand'],
  ['Mecha Corta', 'Short Fuse'], // 55
  ['Relámpago', 'Lightning'],
  ['Pluma Veloz', 'Swift Feather'],
  ['Ojo de Tormenta', 'Eye of the Storm'],
  ['Amor Ardiente', 'Burning Love'],
  ['Rompemontes', 'Mountain Breaker'], // 60
  ['Cabeza Dura', 'Hardhead'],
  ['Rompemontes Extra', 'Mountain Breaker EX'],
  ['Tormenta', 'Thunderstorm'],
  ['Trepador', 'Climber'],
  ['Brillo Estelar', 'Starshine'], // 65
  ['Baile de Sábanas', 'Sheet Dance'],
  ['Graznido', "Crow's Caw"],
  ['Hueso Hueco', 'Hollow Bone'],
  ['Velo Gris', 'Grey Veil'],
  ['Recién Horneado', 'Fresh-Baked'], // 70
  ['Doble Embestida', 'Double Charge'],
  ['Galope de Luz', 'Light Gallop'],
  ['Cumbre', 'Summit'],
  ['Sol del Desierto', 'Desert Sun'],
  ['Remolino', 'Whirlpool'], // 75
  ['Imposible', 'No Way'],
  ['Choque de Frente', 'Head-On'],
  ['Cuernos Cruzados', 'Crossed Horns'],
  BLAST_HEART,
  ['Hasta el Final', 'All the Way'], // 80
  ['Tres Presagios', 'Three Omens'],
  SUNLIT,
  ['Gran Salto', 'Great Leap'],
  ['Aspa Silenciosa', 'Silent Blade'],
  MEADOW, // 85
  ['Princesa', 'Princess'],
  ['Aguas Hondas', 'Deep Water'],
  ['Ráfaga Total', 'Full Volley'],
  ['Lazo Firme', 'Firm Bond'],
  ARSENAL, // 90
  ['Botiquín', 'Med Kit'],
  SNARES,
  ['Cálculo Exacto', 'Exact Math'],
  ['Espada del Alba', 'Dawn Blade'],
  ['Alba', 'Dawnlight'], // 95
  ['Rey Sombrío', 'Shadow King'],
  ['Laberinto', 'Labyrinth'],
  ['Mar de Fondo', 'Groundswell'],
  ['Teatro de Hilos', 'String Theater'],
  ['Ejército de Hierro', 'Iron Army'], // 100
  ['Flor Negra', 'Black Flower'],
  ['Cuatro Señores', 'Four Lords'],
  ['Caballero Dorado', 'Golden Knight'],
  ['Jinete del Viento', 'Wind Rider'],
  ['Barro Sagrado', 'Sacred Clay'], // 105
  ['Alas Doradas', 'Golden Wings'],
  ['Dragón de las Nubes', 'Cloud Dragon'],
  ['Raíz sin Fin', 'Endless Root'],
  ['Cuenta Regresiva', 'Countdown'],
  ['Corona Invicta', 'Unbeaten Crown'], // 110
  ['Escudo de Honor', 'Shield of Honor'],
  ['Hielo Eterno', 'Everfrost'],
  ['Dos Guardias', 'Twin Guard'],
  VOID,
  ['Brasa Negra', 'Black Ember'], // 115
  ['Bandera Negra', 'Black Banner'],
  VOID,
  ['Jardín de Espinas', 'Thorn Garden'],
  FACES,
  ['Revancha', 'Payback'], // 120
  VOID,
  VOID,
  VOID,
  VOID,
  VOID, // 125
  VOID,
  VOID,
  FACES,
  FACES,
  FACES, // 130
  FACES,
  MEADOW,
  SNARES,
  ARSENAL,
  SUNLIT, // 135
  ['Escarcha Certera', 'True Frost'],
  BLAST_HEART,
  FIGHTBACK,
  ['de Nilo', "Nilo's"],
  ['Ola Gris', 'Grey Wave'], // 140
  ['Hallazgo', 'Lucky Find'],
  ['Rojo', 'Red'], // the player's starter decks
  ['Verde', 'Green'],
  ['Amarillo', 'Yellow'],
  ['Chispero', 'Chispero'], // 145, decks lent to the player, named after a creature
  ['Trueno', 'Trueno'],
  ['Áureo', 'Áureo'],
  ['Vendaval', 'Vendaval'],
  ['Molinete', 'Molinete'],
  ['Barreno', 'Barreno'], // 150
  ['Calado', 'Calado'],
  ['Alazán', 'Alazán'],
  ['Barón', 'Barón'],
  ['Esfinge', 'Esfinge'],
  ['Ancla', 'Ancla'], // 155
  ['Humo', 'Humo'],
  ['Quetzal', 'Quetzal'],
  ['Práctica', 'Practice'],
];

/** Our name of a built-in deck. */
export const deckName = (index: number, locale: Locale): string => DECK_NAMES[index][locale === 'es' ? 0 : 1];

/** The deck file spells two owners differently from the scripts. */
const OWNER_KEY: Record<string, string> = { 'BK WarGreymon': 'BlackWarGreymon', 'BK MetalGarurumon': 'BKMetalGarurumon' };

/** The name a deck's owner has in our world (the same one the story uses). */
export const ownerName = (owner: string, locale: Locale = getLocale()): string => characterName(OWNER_KEY[owner] ?? owner, locale);

/** How a built-in deck shows on screen: "Mazo Brasa Viva" / "Live Ember Deck". */
export const deckLabel = (index: number): string => m().board.setup.deckName(deckName(index, getLocale()));
