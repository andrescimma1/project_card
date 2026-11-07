/**
 * Camino del Risco (city 9): the narrow cliff road toward the Archivist's Tower. The Collector left his
 * gang in charge of the Cliff Arena: Honda the bully, Chismes the two-faced gossip, Garfio (who calls the
 * player a shrimp) and Tenazón, still under the spell. Beating Tenazón gives the pass to the tower.
 * Mandíbula, Fermín (the Collector, unmasked), the Blot, Duende and Gruñón are in city09later.ts.
 */
import { CITY09_LATER } from './city09later';
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });
const hondaDeck = deck('*c3Mazo Desbocado\nUn mazo de las cinco facciones.\nNadie sabe qué va a salir.', '*c3Runaway Deck\nA deck of all five factions.\nNobody knows what comes next.');
const chismesDeck = deck(
  '*c3Mazo Evolución Oscura\nUn mazo Sombrío con cartas de Evolución\nque saltan de Novato a Perfecto.',
  '*c3Dark Evolution Deck\nA Shadow deck with Evolution cards\nthat leap from Novice to Apex.',
);
const garfioDeck = deck('*c3Mazo Gancho Negro\nUn mazo Sombrío puro y destructivo.', '*c3Black Hook Deck\nA pure, destructive Shadow deck.');
const tenazonDeck = deck('*c3Mazo Doble Garra\nUn mazo Sombrío y Rojo\na toda potencia.', '*c3Twin Claw Deck\nA full-power Shadow\nand Red deck.');

const honda = {
  ask: { es: 'Esta vez gano yo y pierdes tú.\n¿Empezamos?', en: 'This time I win and you lose.\nShall we start?' },
  scared: { es: '¡Je, je, je! ¿Te da miedo?\nYa sabía que no te atreverías.', en: "He he he! Scared?\nI knew you wouldn't dare." },
  serious: { es: '¡Je, je, je! ¡Ja, ja, ja!\nEsta vez voy en serio.', en: 'He he he! Ha ha ha!\nThis time I mean it.' },
  lost: {
    es: '¡Nooo!\n\n¡Qué fuerza tienes!\nMi honda no dio ni una...\n\n¡Me enojé! ¡Y cuando me enojo,\nme voy! ¡Adiós!\n\n¡Je, je, je! ¡Ja, ja, ja!',
    en: "Nooo!\n\nYou're so strong!\nMy slingshot didn't hit a thing...\n\nI'm mad! And when I'm mad,\nI'm gone! Bye!\n\nHe he he! Ha ha ha!",
  },
  won: {
    es: '¡Je, je, je! ¡Ja, ja, ja!\n\n¡Te lancé lejos, como a una piedrita!\n¡Aquí el fuerte soy yo!\n\nLas piedritas se van del camino.\n¡Fuera de aquí!\n\n¡Je, je, je! ¡Ja, ja, ja!\nY lo digo en serio.',
    en: "He he he! Ha ha ha!\n\nI flung you far, like a pebble!\nI'm the strong one here!\n\nPebbles get off the road.\nOut of here!\n\nHe he he! Ha ha ha!\nAnd I mean it.",
  },
};

const chismes = {
  ask: { es: 'Ji, ji, ji...\n¿Empezamos nuestra partida?', en: 'Hee hee hee...\nShall we start our match?' },
  stalling: { es: 'Ji, ji, ji...\n¡Vamos, no le des más vueltas!', en: 'Hee hee hee...\nCome on, quit stalling!' },
  lost: {
    es: '¡Qué habilidad! ¡Lo sabía!\n\nTu forma de jugar las cartas...\n¡parece magia!\n\nClaro que fui suave contigo...\npero fue una gran partida.\n\nSi nos volvemos a cruzar,\njuguemos la revancha.\n\n(Ojalá no volver a verte nunca...)',
    en: "So skillful! I knew it!\n\nThe way you play your cards...\nit's like magic!\n\nOf course, I went easy on you...\nbut it was a great match.\n\nIf we cross paths again,\nlet's have a rematch.\n\n(I hope I never see you again...)",
  },
  won: {
    es: '¡Ja! ¿Viste eso?\n¡Este es mi verdadero poder!\n\nNo iba a perder contra alguien\ncomo tú, ¿o sí?\n\nEste camino no es para principiantes.\n¿Entendido?\n\nLa clase de hoy terminó.\nJi, ji, ji...',
    en: "Hah! See that?\nThis is my real power!\n\nI was never going to lose\nto someone like you, was I?\n\nThis road isn't for beginners.\nGot it?\n\nToday's lesson is over.\nHee hee hee...",
  },
};

const garfio = {
  again: { es: '¡Qué insistencia!\n¿Todavía quieres otra partida?', en: 'You just never quit!\nYou still want another match?' },
  knewIt: { es: 'Lo sabía.\n¡Ahora vete de aquí!', en: 'I knew it.\nNow get out of here!' },
  fluke: { es: 'Te voy a demostrar que la última vez\nfue pura suerte.', en: 'I will prove that last time\nwas pure luck!' },
  won: {
    es: '¡Ja, ja, ja, ja!\n¡Esto es genial!\n\nSabía que un camarón como tú\nno me iba a ganar.\n\nYa viste lo débil que eres.\n¡Vuelve por donde viniste!\n\n¡Ja, ja, ja, ja!',
    en: "Ha ha ha ha!\nThis is great!\n\nI knew a little shrimp like you\ncould never beat me!\n\nNow you know how weak you are.\nGo back the way you came!\n\nHa ha ha ha!",
  },
};

const tenazon = {
  ask: { es: 'Grrr, grrr...\n¿Jugar...? ¿Jugar...?', en: 'Grrr, grrr...\nPlay...? Play...?' },
  growl: { es: 'Grrr, grrr...', en: 'Grrr, grrr...' },
  roar: { es: '¡Grraaaaah!', en: 'Grraaaaah!' },
  lost: { es: 'Grrr, grrr...\n\nYo... grrr... perdí...\n\nGrraaah... grrr...\n\n¡Grraaaaah!', en: 'Grrr, grrr...\n\nI... grrr... lost...\n\nGrraaah... grrr...\n\nGrraaaaah!' },
  won: { es: 'Grrr, grrr...\n\nYo... grrr... gané...\n\nGrraaah... grrr...\n\n¡Grraaaaah!', en: 'Grrr, grrr...\n\nI... grrr... won...\n\nGrraaah... grrr...\n\nGrraaaaah!' },
};

const GANG: CityTexts = {
  // Honda, at the café (after the first tournament)
  '12BC': { es: '¡Je, je, je! ¿Tú otra vez?\n¿Qué haces aquí?', en: 'He he he! You again?\nWhat are you doing here?' },
  '1348': honda.ask,
  '13FC': honda.scared,
  '148C': honda.serious,
  '154C': honda.lost,
  '16B0': honda.won,
  '1838': hondaDeck,

  // Chismes, at the café
  '19C0': {
    es: 'Ji, ji, ji... No pienso ganarte,\nasí que tranquilidad.\n\nNuestra partida es puro trámite.\n¿Sí?\n\nAh, y te cuento un chisme...\n\nSi una fusión de cartas sale mutante,\nte queda una carta muy poco común.\n\nQué problema, ¿no? Ji, ji, ji...\n\nY dicen que, a veces, una fusión\nrompe todas las reglas.\n\nYo, con las fusiones de cartas,\nsoy muy exigente. Ji, ji, ji...',
    en: "Hee hee hee... I don't plan to beat you,\nso relax.\n\nOur match is just a formality.\nOK?\n\nOh, and here's some gossip...\n\nIf a card fusion mutates,\nyou end up with a very unusual card.\n\nQuite a problem, huh? Hee hee hee...\n\nAnd they say that, sometimes,\na fusion breaks every rule there is.\n\nMe, I'm very picky\nabout card fusions. Hee hee hee...",
  },
  '1DA8': chismes.ask,
  '1E5C': chismes.stalling,
  '1EE8': { es: 'Ji, ji, ji...\n(Cayó en la trampa...)', en: "Hee hee hee...\n(Got you now...)" },
  '1FA0': {
    es: '¡Qué bien juegas! ¡Lo sabía!\n\nHas mejorado muchísimo.\n\nClaro que fui suave contigo otra vez...\npero fue una gran partida.\n\nSi nos volvemos a cruzar, jugamos.\n\n(¡Ni lo sueñes!)',
    en: "You play so well! I knew it!\n\nYou've improved so much.\n\nOf course, I went easy on you again...\nbut it was a great match.\n\nIf we meet again, let's play.\n\n(In your dreams!)",
  },
  '21D0': chismes.won,
  '23AC': chismesDeck,

  // Garfio, at the café: the shrimp on the road to the tower
  '245C': { es: 'Soy Garfio.\n¿Y tú quién eres?', en: "I'm Garfio.\nAnd who are you?" },
  '24D0': { who: 'me', es: 'Soy *h0.\n¡Mucho gusto!', en: "I'm *h0.\nNice to meet you!" },
  '2544': {
    es: '¿*h0? Nunca oí hablar de ti.\n\nEste camino no es para camarones.\nLos camarones terminan en mi garfio.',
    en: "*h0? Never heard of you.\n\nThis road isn't for shrimps.\nShrimps end up on my hook.",
  },
  '2618': {
    who: 'me',
    es: '¿A quién le dices camarón?\nVoy a la Torre del Archivero\na ganar su torneo.',
    en: "Who are you calling a shrimp?\nI'm going to the Archivist's Tower\nto win its tournament.",
  },
  '26BC': {
    es: '¿Qué? El Coleccionista nos dejó\na cargo de este camino.\n\n¿Y tú crees que vas a pasar\npor esta Arena?',
    en: 'What? The Collector left us\nin charge of this road.\n\nAnd you think you can\nget through this Arena?',
  },
  '274C': { who: 'me', es: '¡Claro que sí!', en: 'Of course!' },
  '279C': {
    es: '¡Ja, ja, ja, ja!\n¡Qué gracioso!\n\nBueno, como quieras...\nSi insistes, juego contigo.\n\nPero después no digas\nque no te avisé...\n\n¡Ja, ja, ja, ja!',
    en: "Ha ha ha ha!\nYou're funny!\n\nWell, whatever...\nIf you insist, I'll play you.\n\nBut don't say\nI didn't warn you...\n\nHa ha ha ha!",
  },
  '2AF4': {
    es: 'Bueno, como quieras...\nSi insistes, te espero en la Arena.\n\nPero no digas que no te avisé.\nVas a salir con más de un raspón...\n\n¡Ja, ja, ja, ja!',
    en: "Well, whatever...\nIf you insist, I'll be at the Arena.\n\nBut don't say I didn't warn you.\nYou'll leave with more than a scratch...\n\nHa ha ha ha!",
  },
  '2C40': {
    es: 'No te daré el pase\nhasta que venzas a Tenazón.\n\nAsí son las cosas.\n¿Entendido?\n\n¡Ja, ja, ja, ja!',
    en: "I won't give you the pass\nuntil you beat Tenazón.\n\nThat's just how it is.\nGot it?\n\nHa ha ha ha!",
  },
  '2D74': { es: '¡Rayos, me ganaste!\n¡No vuelvas nunca más!', en: "Darn it, you beat me!\nDon't ever come back!" },
  '2E00': garfio.again,
  '2EC8': garfio.knewIt,
  '2F4C': garfio.fluke,
  '3018': {
    es: '¡¿Qué?!\n¡Aaargh! ¡Perdí!\n\n¡No puede ser! ¿Otra vez contra\nun camarón como tú?\n\n¡Rayos! ¡No quiero volver\na verte por aquí!',
    en: 'What?!\nArgh! I lost!\n\nNo way! Again, against\na shrimp like you?\n\nDarn it! I never want\nto see you here again!',
  },
  '3170': garfio.won,
  '3308': garfioDeck,

  // Tenazón, at the café: still under the spell
  '33AC': {
    es: 'Grrr, grrr... Yo... Tenazón...\n\nYo... grrr... grrr... te venzo...\n\nVen... a la... grrr... Arena...\n\nGrrr, grrr...\n\n¡Grraaaaah!',
    en: 'Grrr, grrr... Me... Tenazón...\n\nI... grrr... grrr... beat you...\n\nCome... to... grrr... Arena...\n\nGrrr, grrr...\n\nGrraaaaah!',
  },
  '3520': { who: 'me', es: '¿Qué le pasa a esta criatura...?\nParece hechizada...', en: "What's wrong with this creature...?\nIt looks like it's under a spell..." },
  '3768': { es: 'Ven... a la... grrr... Arena...\n\nGrrr, grrr...\n\n¡Grraaaaah!', en: 'Come... to... grrr... Arena...\n\nGrrr, grrr...\n\nGrraaaaah!' },
  '3850': { es: 'Otra... partida... grrr... grrr...\n\nGrrr, grrr...\n\n¡Grraaaaah!', en: 'One... more... match... grrr...\n\nGrrr, grrr...\n\nGrraaaaah!' },
  '3944': tenazon.ask,
  '39D0': tenazon.growl,
  '3A38': tenazon.roar,
  '3ACC': tenazon.lost,
  '3BDC': { who: 'me', es: 'Gané... pero ¿Tenazón\nestará bien...?', en: 'I won... but is Tenazón\ngoing to be OK...?' },
  '3D6C': tenazon.won,
  '3E80': { who: 'me', es: '¡Rayos! Perdí...\n¡Pero no me voy a rendir!', en: "Darn! I lost...\nBut I'm not giving up!" },
  '3F08': tenazonDeck,
};

const ARENA: CityTexts = {
  // first tournament: Honda, Chismes, Garfio
  '92AC': {
    es: '¡Je, je, je! ¡Ja, ja, ja!\n¡Soy Honda!\n\n¿Vas camino a la Torre?\n¡Con mi honda te mando de vuelta!\n\n¡Je, je, je! ¡Ja, ja, ja!\n¡Ya vas a ver!\n\n¡Je, je, je! ¡Ja, ja, ja!',
    en: "He he he! Ha ha ha!\nI'm Honda!\n\nHeading for the Tower?\nMy slingshot will send you back!\n\nHe he he! Ha ha ha!\nJust you wait!\n\nHe he he! Ha ha ha!",
  },
  '94E0': { es: 'Te lo digo clarito: yo gano\ny tú pierdes. ¿Empezamos?', en: 'Let me make it clear: I win\nand you lose. Shall we start?' },
  '959C': honda.scared,
  '9624': { es: '¡Je, je, je! ¡Ja, ja, ja!\nCargo la honda... ¡y fuego!', en: 'He he he! Ha ha ha!\nLoad the slingshot... and fire!' },
  '96DC': honda.lost,
  '984C': honda.won,
  '99E0': hondaDeck,
  '9AF4': {
    es: 'Ji, ji, ji... Me llamo Chismes.\n\nTen cuidado. Dicen que este camino\nes bastante peligroso.\n\nPero yo no pienso ganarte.\nTranquilidad.\n\nSolo quiero que pases por aquí\nsin problemas.\n\nJugamos por puro trámite, ¿sí?\n\nTe voy a dejar ganar.\nSí, ese es mi plan.\n\nNo te lo esperabas, ¿eh?\nBueno, juguemos.\n\nJi, ji, ji...',
    en: "Hee hee hee... My name is Chismes.\n\nBe careful. They say this road\nis pretty dangerous.\n\nBut I don't plan to beat you.\nRelax.\n\nI just want you to get through\nhere nice and easy.\n\nWe play just as a formality, OK?\n\nI'm going to let you win.\nYes, that's my plan.\n\nDidn't expect that, did you?\nWell, let's play.\n\nHee hee hee...",
  },
  '9EF4': chismes.ask,
  '9FA0': chismes.stalling,
  'A02C': { es: 'Ji, ji, ji...\n(Ay, qué inocencia...)', en: 'Hee hee hee...\n(How naive...)' },
  'A0DC': chismes.lost,
  'A300': {
    es: '¡Ja! ¿Viste eso?\n¿Ves lo débil que eres?\n\nNo hay forma de que pierda\ncontra alguien como tú.\n\nEste camino no es para principiantes.\n¿Entendido?\n\nEso fue una lección completa.\nY la clase terminó. Ji, ji, ji...',
    en: "Hah! See that?\nSee how weak you are?\n\nThere's no way I could lose\nto someone like you.\n\nThis road isn't for beginners.\nGot it?\n\nThat was a full lesson.\nAnd class is over. Hee hee hee...",
  },
  'A4E8': chismesDeck,
  'A618': {
    es: '¡Ja, ja, ja, ja!\n¡Así que llegaste!\n\nNo sé cómo llegaste tan lejos, pero\nolvídate de ganarme.\n\n¡Ja, ja, ja, ja!\n¡Qué gracioso!\n\nNo vas a pasar tan fácil,\ncamarón.\n\n¡Ja, ja, ja, ja!',
    en: "Ha ha ha ha!\nSo, you made it!\n\nI don't know how you got this far,\nbut forget about beating me.\n\nHa ha ha ha!\nThis is so funny!\n\nYou won't get through here\nso easily, shrimp.\n\nHa ha ha ha!",
  },
  'A8B4': { es: '¿Todavía quieres jugar una partida?', en: 'You still want to play a match?' },
  'A954': { es: 'Lo sabía.\n¡Ahora, largo de aquí!', en: 'I knew it.\nNow, scram!' },
  'A9D0': { es: '¡Ja, ja, ja, ja!\n¡Te vas a arrepentir!', en: "Ha ha ha ha!\nYou're going to regret this!" },
  'AA88': {
    es: '¡¿Qué?!\n¡Aaargh! ¡Perdí!\n\n¡No puede ser! ¿Cómo pude perder\ncontra un camarón como tú?\n\n¡Fuera! ¡Este lugar no es\npara camarones!',
    en: "What?!\nArgh! I lost!\n\nNo way! How could I lose\nto a shrimp like you?\n\nGet lost! This place\nisn't for shrimps!",
  },
  'ABD4': { who: 'me', es: '¡Oye, te gané!\n¡Acéptalo!\n\nAhora dame el pase\nal siguiente pueblo.', en: 'Hey, I beat you!\nDeal with it!\n\nNow give me the pass\nto the next town.' },
  'AC90': { es: 'Mmm... Tenazón se encargará\nde todo...', en: 'Mmm... Tenazón will take care\nof everything...' },
  'AD04': { who: 'me', es: 'Deja de murmurar\ny dame el pase.', en: 'Stop mumbling\nand give me the pass!' },
  'AD7C': { es: 'Lo siento, pero no puedo hacer eso.', en: "Sorry, but I can't do that!" },
  'ADE8': { who: 'me', es: '¿Por qué? ¡No es justo!', en: "Why? That's not fair!" },
  'AE40': { es: '¡Silencio! Es que yo no soy\nel verdadero maestro de esta Arena.', en: "Silence! You see, I'm not\nthe real master of this Arena!" },
  'AED0': { who: 'me', es: '¿Qué? ¡No sabía eso!', en: "What? I didn't know that!" },
  'AF2C': {
    es: '¡Claro que no lo sabías!\n¡Nunca te lo dije!\n\nComo sea: hasta que no venzas\na Tenazón, no hay pase.\n\nAsí son las cosas.\n¿Entendido?\n\n¡Ja, ja, ja, ja!',
    en: "Of course you didn't!\nI never told you!\n\nAnyway, until you beat\nTenazón, there's no pass!\n\nThat's how it is.\nGot it?\n\nHa ha ha ha!",
  },
  'B16C': {
    es: '¡Ja, ja, ja, ja!\n\n¡Esto es genial! ¿Viste?\n¿No te lo dije?\n\nSabía que un camarón como tú\nno me iba a ganar.\n\nYa viste lo débil que eres.\n¡Vuelve por donde viniste!\n\n¡Ja, ja, ja, ja!',
    en: "Ha ha ha ha!\n\nThis is great! See?\nDidn't I tell you?\n\nI knew a shrimp like you\ncould never beat me!\n\nNow you know how weak you are.\nGo back the way you came!\n\nHa ha ha ha!",
  },
  'B34C': garfioDeck,

  // second tournament: Honda, Chismes, Garfio and Tenazón, for the pass to the tower
  'B720': honda.ask,
  'B7CC': honda.scared,
  'B868': honda.serious,
  'B928': honda.lost,
  'BA98': honda.won,
  'BC30': hondaDeck,
  'BDCC': chismes.ask,
  'BE78': { es: 'Ji, ji, ji...\nTranquilidad, es puro trámite.', en: "Hee hee hee...\nDon't worry, it's just a formality." },
  'BF10': { es: 'Ji, ji, ji...\n(Todavía cree que puede ganar...)', en: 'Hee hee hee...\n(Still thinks they can win...)' },
  'BFD4': chismes.lost,
  'C1F4': chismes.won,
  'C3DC': chismesDeck,
  'C594': garfio.again,
  'C668': garfio.knewIt,
  'C6EC': garfio.fluke,
  'C7B8': {
    es: '¡¿Qué?!\n¡Aaargh! ¡Perdí!\n\n¡No puede ser! ¿Otra vez contra\nun camarón como tú?\n\nQue Tenazón se encargue de todo.\n\nTenazón no tiene piedad.\n¡Prepárate para lo peor!\n\n¡Ja, ja, ja, ja!',
    en: "What?!\nArgh! I lost!\n\nNo way! Again, against\na shrimp like you?\n\nI'll leave it all to Tenazón.\n\nTenazón shows no mercy.\nGet ready for the worst!\n\nHa ha ha ha!",
  },
  'C9C4': garfio.won,
  'CB68': garfioDeck,
  'CC8C': {
    es: 'Grrr... grrr...\nYo... maestro... de la Arena...\n\nYo... grrr... grrr... te venzo...\n\nGrrr... grrr...\n\n¡Grraaaaah!',
    en: 'Grrr... grrr...\nMe... master... of the Arena...\n\nI... grrr... grrr... beat you...\n\nGrrr... grrr...\n\nGrraaaaah!',
  },
  'CE88': tenazon.ask,
  'CF14': tenazon.growl,
  'CF7C': tenazon.roar,
  'D010': tenazon.lost,
  'D120': { who: 'me', es: '¿Tenazón estará bien...?', en: 'Is Tenazón going to be OK...?' },
  'D1A0': { who: null, es: '¡Felicitaciones por la victoria!\nRecibiste el pase a la\nTorre del Archivero.', en: "Congratulations on your win!\nYou got the pass to\nthe Archivist's Tower." },
  'D37C': tenazon.won,
  'D494': { who: 'me', es: '¡Rayos! Perdí.\n¡Lo voy a intentar otra vez!', en: "Darn! I lost.\nI'm going to try one more time!" },
  'D518': tenazonDeck,
};

export const CITY09: CityTexts = { ...GANG, ...ARENA, ...CITY09_LATER };
