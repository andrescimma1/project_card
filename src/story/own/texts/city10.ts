/**
 * Torre del Archivero (city 10): the ancient archive where the record of every creature's shape was kept,
 * and the hardest Arena of the Quiet Lands. Yunque (once Brezo, then Tizón) defends it; after his Arena he
 * sends the player to the Torre sin Fin, the tower on the lake where Shadow creatures nest and the grey fog
 * comes from, and opens card trading. Madreselva, who lost her shape, locks the café to warn the player.
 * The later phases (after the Torre sin Fin, Centinela and the new Arenas) are in city10later.ts.
 */
import { CITY10_LATER } from './city10later';
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });
const note = (es: string, en: string): Written => ({ who: null, es, en });

const espinaDeck = deck('*c3Mazo Púas\nUn mazo armado con Primer golpe\ny Absorber HP.', '*c3Spines Deck\nA deck armed with First strike\nand Drain HP.');
const cornelioDeck = deck('*c3Mazo Rompecorazas\nUn mazo Verde muy eficaz contra\ncriaturas de nivel Armadura.', '*c3Shellbreaker Deck\nA Green deck that works well\nagainst Armored creatures.');
const rompehielosDeck = deck('*c3Mazo Apagafuegos\nUn mazo Azul que apaga el fuego.\n¡Cuidado si usas un mazo Rojo!', '*c3Firequench Deck\nA Blue deck that puts out fires.\nRed deck users, watch out!');
const gallardoDeck = deck('*c3Mazo Primer Vuelo\nUn mazo Rojo y veloz que suele\natacar primero.', '*c3First Flight Deck\nA fast Red deck that tends\nto attack first.');
const aullidoDeck = deck('*c3Mazo Aullido Lunar\nUn mazo de contraataques\ny recuperación de HP.', '*c3Moon Howl Deck\nA deck of counterattacks\nand HP recovery.');
const yunqueDeck = deck('*c3Mazo Siete Formas\nUn mazo de tres colores con\ncriaturas de todo tipo.', '*c3Seven Shapes Deck\nA three-color deck with\nall kinds of creatures.');
const thornDeck = deck('*c3Mazo Jardín de Espinas\nUn mazo de tres colores lleno de plantas.\nToda flor tiene sus espinas.', '*c3Thorn Garden Deck\nA three-color deck full of plants.\nEvery flower has its thorns.');

const mission = {
  es: 'Hay que actuar antes de que las\nTierras Quietas se vuelvan grises.\n\nEsto es lo que te pido.\n\nVe a la Torre sin Fin y vence a todos\nlos jugadores Sombríos que hay allí.\n\nSi pudiera, iría yo, pero ahora\nno puedo dejar el archivo.\n\n¡Solo puedo contar contigo!',
  en: "We must act before the\nQuiet Lands turn grey.\n\nThis is what I ask of you.\n\nGo to the Endless Tower and beat\nevery Shadow card player there.\n\nI would go if I could, but right\nnow I can't leave the archive.\n\nYou're the only one I can count on!",
};
const trading = {
  es: 'Además, desde ahora puedes\nintercambiar cartas con tus amigos.\n\nIntercambia cartas para\nmejorar tu mazo.',
  en: 'Also, from now on you can\ntrade cards with your friends.\n\nTrade cards to make\nyour deck stronger.',
};

const CAFE: CityTexts = {
  // Madreselva will not let the player leave the café until they talk
  '11F8': { es: '*c6Una enredadera cubre la puerta.', en: '*c6A vine covers the door.' },
  '123C': { es: '*c2¡Atención! *c6No se puede salir.', en: '*c2Attention! *c6You cannot leave.' },

  // Espina, at the café
  '13B4': {
    es: 'Si usas un mazo Verde,\ntengo un buen consejo para ti.\n\nUn mazo Verde no necesita muchas\ncartas de Evolución.\n\nMejor lleva cartas que suban\nlos HP y el poder de ataque.\n\nYa está. ¿Te sirvió?',
    en: "If you use a Green deck,\nI have some good advice for you.\n\nA Green deck doesn't need many\nEvolution cards.\n\nBetter to carry cards that boost\nHP and Attack Power.\n\nThere. Wasn't that useful?",
  },
  '1564': { es: 'Prometo no pinchar... mucho.\n¿Jugamos una partida?', en: 'I promise not to prick... much.\nShall we play a match?' },
  '15EC': { es: 'No es por hacerte sentir mal,\npero esperaba más de ti...', en: 'Not to make you feel bad,\nbut I expected more from you...' },
  '1690': { es: '¡Cuánta energía! ¡Así me gusta!', en: "So much energy! That's what I like!" },
  '1738': {
    es: 'Vaya... Me hablaron mucho de ti,\ny parece que los rumores son ciertos.\n\nTe esperan oponentes muy duros,\npero te va a ir bien.',
    en: "Wow... I heard a lot about you,\nand I guess the rumors are true!\n\nTough opponents are waiting for you,\nbut you'll do just fine.",
  },
  '19B8': {
    es: '¿Qué? ¿Qué pasó?\n\nMe dijeron que eras de lo mejor.\n¡Qué exageración!\n\nQuizás no te sientes bien hoy.\n\nNo te rindas: la constancia es la clave\npara llegar a lo más alto.\n\nProbemos otra vez.\nTe espero... ¡Nos vemos!',
    en: "What? What happened?\n\nThey told me you were one of the best.\nWhat an exaggeration!\n\nMaybe you're not feeling well today.\n\nDon't give up. Persistence is the key\nto reaching the top.\n\nLet's try again.\nI'll be waiting... See you!",
  },
  '1BC0': espinaDeck,

  // Cornelio
  '1D60': {
    es: 'Me hablaron mucho de ti.\n¡Dicen que tienes muchísima fuerza!\n\nTenía ganas de desafiarte.\n\nPor cierto, me enteré\nde algo muy útil.\n\nHay una reliquia que le da más\nexperiencia a tu compañero.\n\nPero solo al compañero\nque la lleva puesta.\n\nInteresante, ¿no?',
    en: "I've heard a lot about you.\nThey say you're super strong!\n\nI've been wanting to challenge you.\n\nBy the way, I heard about\nsomething really useful.\n\nThere's a relic that gives your\npartner more experience.\n\nBut only the partner\nwho has it equipped.\n\nInteresting, huh?",
  },
  '2000': { es: '¿De verdad quieres jugar?', en: 'Do you really want to play?' },
  '2098': { es: 'Mucho hablar y poco jugar, ¿eh?', en: 'All talk and no play, huh?' },
  '2114': { es: 'No le temes a nada, ¿eh?', en: "You're not afraid of anything, huh?" },
  '21B8': {
    es: '¡Vaya! Me ganaste bien...\n¡De verdad tienes mucha fuerza!\n\nEsta vez ganaste limpiamente.\nQuizás nos volvamos a ver.\n\nCuando nos crucemos, ¡la revancha!',
    en: "Wow! You got me good...\nYou really ARE super strong!\n\nYou won fair and square this time.\nMaybe we'll meet again someday.\n\nNext time we meet, it's a rematch!",
  },
  '2448': {
    es: '¡Rayos! No eres como me contaron.\nPensé que serías mucho mejor.\n\n¿Eso es todo lo que tienes?\n¡Me decepcionas!\n\nBueno, voy a estar aquí un tiempo.\n¡Vuelve a desafiarme!',
    en: "Darn! You're nothing like they said!\nI thought you'd be much better.\n\nIs that all you've got?\nYou disappoint me!\n\nWell, I'll be here for a while.\nCome back and challenge me!",
  },
  '25C4': cornelioDeck,

  // Rompehielos
  '2774': {
    es: 'Aunque tu compañero sea de otra\nfacción que tu mazo, no pasa nada.\n\nPuedes usarlo para sumar PE\no por su efecto de soporte.\n\n¡Me lo enseñó mi compañero, Jacinto!',
    en: "Even if your partner's faction\ndoesn't match your deck, that's OK.\n\nYou can use it to add EP\nor for its support effect.\n\nMy partner, Jacinto, taught me that!",
  },
  '28D4': { es: '¿Quieres jugar conmigo?', en: 'Do you want to play with me?' },
  '296C': { es: 'Bueno. Si algún día de verdad\nquieres jugar, aquí estoy.', en: "OK. If you ever really\nwant to play, I'm right here." },
  '2A14': { es: '¡Genial! ¡Vamos!', en: "Cool. Let's do it!" },
  '2AB0': {
    es: '¡Eh, perdí! Parece que todo\nlo que dicen de ti es cierto.\n\nTu habilidad te va a llevar lejos.\n¡Suerte!\n\nLo importante es la constancia.\n¡Nunca te rindas!\n\nEso me dice siempre\nmi compañero, Jacinto.',
    en: "Hey, I lost! I guess everything\nthey say about you is true!\n\nYour skills will take you far.\nGood luck!\n\nWhat matters is persistence.\nDon't ever give up!\n\nThat's what my partner,\nJacinto, always tells me.",
  },
  '2D98': {
    es: '¡Eh, gané! Parece que los rumores\neran solo rumores. Qué se le va a hacer.\n\nCon ese nivel no me vas a ganar.\n\n¡Pero sigue intentando!\nLa constancia es muy importante.\n\nBueno, eso dice siempre\nmi compañero, Jacinto.',
    en: "Hey, I won! I guess rumors\nare just rumors. Oh well.\n\nYou'll never beat me with those skills!\n\nBut keep trying!\nPersistence is very important.\n\nWell, that's what my partner,\nJacinto, says all the time.",
  },
  '2F58': rompehielosDeck,

  // Gallardo
  '3114': {
    es: '¿Alguna vez pensaste en lo que\nde verdad quieres?\n\nNo hace falta que respondas ahora.\nPero te sugiero que lo pienses.\n\nTe doy unos consejos\npara los mazos Rojos.\n\nLos mazos Rojos tienen pocos HP.\n\nCompénsalo con cartas que recuperen HP\ny suban tu poder de ataque.\n\nTu batalla empieza ahora.',
    en: "Have you ever thought about what\nyou really want?\n\nYou don't need to answer now.\nBut I suggest you think about it.\n\nLet me give you some tips\non Red decks.\n\nRed decks have low HP.\n\nMake up for it with cards that recover\nHP and boost your Attack Power.\n\nYour battle begins now.",
  },
  '33E0': { es: 'Veo que tienes ganas.\n¿Jugamos?', en: "Looks like you're eager.\nShall we play?" },
  '3474': { es: 'No hace falta que sepas\nla respuesta todavía.', en: "You don't need to know\nthe answer yet." },
  '34F4': { es: '¡Allá voy! ¡Prepárate!', en: 'Here I come! Get ready!' },
  '35A0': {
    es: 'Perdí, pero fue una gran batalla.\n\nSí. Seguro que pronto\nencontrarás tu respuesta.\n\nCuando la tengas, vuelve a desafiarme.\n\nTe esperan oponentes duros,\npero sé que puedes con ellos.',
    en: "I lost, but it was a great battle.\n\nYes. I'm sure you'll find\nyour answer soon.\n\nWhen you do, come challenge me again.\n\nTough opponents await you,\nbut I know you can do it!",
  },
  '3884': {
    es: '¿Eso es todo...?\n\nPerdiste esta vez, pero algún día\nencontrarás la respuesta.\n\nCuando la encuentres,\nven a desafiarme otra vez.\n\nTu batalla recién empieza.\nAquí te espero.',
    en: "Is this all you've got...?\n\nYou lost this time, but someday\nyou'll find the answer.\n\nWhen you do, come\nchallenge me again.\n\nYour battle is just beginning.\nI'll be waiting for you here.",
  },
  '3A4C': gallardoDeck,

  // Aullido (once Ventisca, of Frost Harbor)
  '3C14': {
    es: 'Tienes mucha fuerza.\n\nNo bajes la guardia.\nTe esperan más oponentes.\n\nUsar bien las cartas de Apoyo es\nla clave para ganar lo que viene.\n\nToma, te doy esta carta.',
    en: "You're quite strong.\n\nDon't let your guard down.\nMore opponents are waiting for you.\n\nUsing Support cards well is the key\nto winning the battles ahead.\n\nHere, take this card.",
  },
  '3DEC': {
    es: 'Si tu nivel es menor que el del rival,\nesta carta intercambia tus HP\ncon los suyos.\n\nUsa bien los efectos de soporte\npara ganarle terreno al rival.\n\nSeguro que sabrás sacarle provecho.\n\nSuerte. ¡Cuídate!',
    en: "If your level is lower than your\nopponent's, this card swaps\nyour HP with theirs.\n\nUse support effects wisely\nto get the upper hand.\n\nI'm sure you'll figure it out.\n\nGood luck. Take care!",
  },
  '4038': {
    es: 'Para mí, los mejores mazos\nson los Azules.\n\nTienen sus puntos débiles,\ncomo su poco poder de ataque.\n\nMás que duplicar o triplicar\nun ataque débil...\n\n...conviene subirle el poder\ncon cartas de Apoyo.\n\nAsí, un mazo Azul es invencible.\nEso es lo que creo.',
    en: "For me, the best decks\nare Blue decks.\n\nThey have weak points,\nlike their low Attack Power.\n\nRather than doubling or tripling\na weak attack...\n\n...it's better to boost its power\nwith Support cards.\n\nThat makes a Blue deck invincible.\nThat's what I believe!",
  },
  '427C': { es: '¿Puedo contar con una\nbuena batalla?', en: 'Can I count on you\nfor a good battle?' },
  '430C': { es: '¿De verdad...?', en: 'Are you really sure...?' },
  '4380': { es: '¡Juguemos una batalla digna\nde este Café!', en: "Let's play a battle worthy\nof this Cafe!" },
  '444C': {
    es: '¡Vaya! ¡Qué gran batalla!\n\nNo me arrepiento de nada.\nGracias. Lo disfruté mucho.\n\nVolvamos a jugar cuando\nalcance mi siguiente forma.\n\n¡Cuento contigo!\n¡Prométemelo!',
    en: "Wow! That was great!\n\nI have no regrets.\nThank you. I really enjoyed it.\n\nLet's play again once\nI reach my next shape.\n\nI'm counting on you!\nPromise me!",
  },
  '4754': {
    es: '¡No te sientas mal!\nPiensa en todo lo que avanzaste.\n\n¡Tienes que desafiarme otra vez!\nSeguro que superas esta derrota.\n\n¡Estoy convencido!',
    en: "Don't feel bad!\nThink of how far you've come.\n\nYou must challenge me again!\nYou'll get over this loss.\n\nI'm sure of it!",
  },
  '48AC': aullidoDeck,

  // Yunque: the Archive Seal and the Torre sin Fin
  '4958': {
    es: 'Soy Yunque. No te veía desde\nla Aldea del Cruce...\n\nAllí me llamaba Brezo. Después fui\nTizón, y al alcanzar esta forma...\n\n...tomé el nombre de Yunque.\nAhora defiendo la Torre del Archivero.\n\nEn este archivo se guarda el registro\nde la forma de cada criatura.\n\nY su Arena es la última prueba\npara cualquier jugador de cartas.\n\nQuien gana aquí recibe\nel Sello del Archivo.',
    en: "I'm Yunque. I haven't seen you since\nCrossroads Village...\n\nBack then I was Brezo. Then I was\nTizón, and when I reached this shape...\n\n...I took the name Yunque.\nNow I defend the Archivist's Tower.\n\nThis archive keeps the record\nof every creature's shape.\n\nAnd its Arena is the final test\nfor every card player.\n\nWhoever wins here receives\nthe Archive Seal.",
  },
  '4B5C': { who: 'me', es: '¿Este es el último pueblo?', en: 'Is this the last town?' },
  '4BB8': {
    es: 'Así es. Siento una gran fuerza\ndentro de ti.\n\nPuedes con mi Arena.\nSe nota.\n\nYa lo habrás visto: una niebla gris\navanza sobre las Tierras Quietas.',
    en: "That's right. I sense great power\nwithin you.\n\nYou can take on my Arena.\nI can tell.\n\nYou've seen it by now: a grey fog\nis creeping over the Quiet Lands.",
  },
  '4D20': { who: 'me', es: 'Entonces sí está pasando\nalgo malo...', en: 'So something bad really\nis happening...' },
  '4D8C': {
    es: 'Sí. Pero primero tienes que\nsuperar mi Arena.\n\nEsta ya no es solo tu batalla.\nNuestro futuro depende de ti.\n\nVen a verme cuando hayas\nconquistado esta Arena.\n\n¡Ahora todo depende de ti!',
    en: "Yes. But first, you must\nget through my Arena.\n\nThis isn't just your battle anymore.\nOur future depends on you.\n\nCome see me again once you have\nconquered this Arena.\n\nIt's all up to you now!",
  },
  '501C': {
    es: 'Mmm. Ya vi tu fuerza.\nVa más allá de lo que imaginaba.\n\nTe entrego el Sello del Archivo.\n\nPero ese sello no se lleva en la mano.\nNo tiene forma: se lleva por dentro.\n\nTus ganas de jugar,\neso es el Sello del Archivo.\n\nTengo que pedirte un favor.\nSé que puedes hacerlo.\n\nUna gran crisis está por caer\nsobre las Tierras Quietas.',
    en: "Hmm. Now I've seen your power.\nIt goes beyond what I imagined.\n\nI grant you the Archive Seal.\n\nBut this seal isn't held in a hand.\nIt has no shape: you carry it inside.\n\nYour love of playing,\nthat is the Archive Seal.\n\nI need to ask you a favor.\nI'm sure you can do it.\n\nA great crisis is about to fall\nupon the Quiet Lands.",
  },
  '52FC': { who: 'me', es: '¿Tiene que ver con una torre?', en: 'Does it have to do with a tower?' },
  '5358': {
    es: 'Sí. Una torre enorme y oscura.\n\nApareció sobre el lago, junto a la\nmontaña, cerca de esta torre.\n\nCon el tiempo, unas criaturas\nde la facción Sombría anidaron allí.\n\nLa llaman la Torre sin Fin.\nDe ella sale la niebla gris\nque borra las formas.',
    en: 'Yes. A huge, dark tower.\n\nIt appeared on the lake, beside the\nmountain, close to this tower.\n\nIn time, creatures of the Shadow\nfaction began nesting there.\n\nThey call it the Endless Tower.\nThe grey fog that erases shapes\ncomes out of it.',
  },
  '5550': { who: 'me', es: '¿En serio...? Yo creía que era\nesta torre, la del Archivero.', en: "Really...? I was sure it was\nthis one, the Archivist's Tower." },
  '55D4': {
    es: 'La niebla se extiende por\ntodas las Tierras Quietas.\n\nPor ahora borró pocas formas,\npero es cuestión de tiempo.\n\nHay que actuar antes de que\ntodo se vuelva gris.\n\nEsto es lo que te pido.\n\nVe a la Torre sin Fin y vence a todos\nlos jugadores Sombríos que hay allí.\n\nIría yo, pero no puedo irme:\nalguien debe cuidar el archivo.\n\n¡Solo puedo contar contigo!',
    en: "The fog is spreading over\nall of the Quiet Lands.\n\nSo far it has erased few shapes,\nbut it's only a matter of time.\n\nWe must act before\neverything turns grey.\n\nHere is what I ask of you.\n\nGo to the Endless Tower and beat\nevery Shadow card player there!\n\nI would go myself, but I can't leave:\nsomeone must guard the archive.\n\nYou're the only one I can count on!",
  },
  '58E8': { who: 'me', es: 'La Torre sin Fin...', en: 'The Endless Tower...' },
  '5944': { es: 'Toma esto.', en: 'Here, take this.' },
  '59B0': note('Recibiste el *c5pase a la Torre sin Fin*c7.', 'You got the *c5pass to the Endless Tower*c7.'),
  '5A14': {
    es: 'Con este pase puedes entrar\na la Torre sin Fin.\n\nLas criaturas de allí son muy fuertes.\n\nTen cuidado y usa todo lo que sabes.\nContamos contigo. ¡Tú puedes!',
    en: "Enter the Endless Tower\nwith this pass.\n\nThe creatures there are very strong.\n\nBe careful and use everything you know.\nWe're counting on you. You can do it!",
  },
  '5B4C': { es: 'Y toma también este huevo.\nEs lo menos que puedo hacer.', en: "And take this egg, too.\nIt's the least I can do." },
  '5C00': note('Recibiste el *c3huevo del Valor*c7 de Brinco.', "You got Brinco's *c3Egg of Courage*c7!"),
  '5C90': note('Recibiste el *c3huevo del Amor*c7 de Trino.', "You got Trino's *c3Egg of Love*c7!"),
  '5D1C': note('Recibiste el *c3huevo del Saber*c7 de Gema.', "You got Gema's *c3Egg of Knowledge*c7!"),
  '5DC0': note('Recibiste el *c3huevo de la Esperanza*c7\nde Bollo.', "You got Bollo's *c3Egg of Hope*c7!"),
  '5E4C': note('Recibiste el *c3huevo de la Luz*c7 de Zarpa.', "You got Zarpa's *c3Egg of Light*c7!"),
  '5EDC': note('Recibiste el *c3huevo del Valor*c7 de Hebra.', "You got Hebra's *c3Egg of Courage*c7!"),
  '5F58': trading,
  '6044': { who: 'me', es: 'Gracias. Me ayudaste mucho.', en: "Thanks. You've been a great help." },
  '60A8': { who: 'me', es: 'No puedo prometerte nada,\npero voy a dar lo mejor de mí.', en: "I can't promise you anything,\nbut I'll do my best!" },
  '6128': { es: 'Gracias. Ten mucho cuidado.', en: 'Thank you. Be careful out there.' },
  '61CC': trading,
  '62B8': { who: 'me', es: 'Te prometo que voy a dar lo mejor.\nDeséame suerte.', en: "I promise I'll do my best.\nWish me luck." },
  '6334': { es: 'Mucha suerte, y gracias de corazón.', en: 'Good luck, my friend. And thank you.' },
  '6AE4': {
    es: 'Lo primero es ganar en esta Arena.\n\nSi no lo logras,\nno nos queda esperanza.\n\nVen a verme cuando hayas\nconquistado esta Arena.\n\n¡Todo depende de ti!',
    en: "The first thing you must do\nis win at this Arena.\n\nIf you can't do it,\nwe have no hope left.\n\nCome see me again once you have\nconquered this Arena.\n\nIt's all up to you!",
  },
  '6CF0': mission,

  // a match with Yunque at the café
  '792C': { es: '¿Comenzamos la batalla?', en: 'Shall we begin the battle?' },
  '79C4': { es: 'Como quieras. Pero el tiempo pide\nuna fuerza nueva. Vuelve pronto.', en: 'As you wish. But these times call\nfor a new power. Come back soon.' },
  '7A40': { es: '¡Muéstrame lo que tienes!', en: "Show me what you've got!" },
  '7AE4': {
    es: 'Juegas tan bien como siempre.\n\nCreo que ya me superaste.\nPuedes sentir orgullo de ti.\n\nTe desafiaré otra vez cuando\nalcance una forma nueva.\n\nEspero que aceptes.',
    en: "You're in top form, as usual.\n\nI think you're far beyond my skills.\nYou should be proud of yourself.\n\nI'll challenge you again when\nI reach a new shape.\n\nI hope you'll accept.",
  },
  '7DF0': {
    es: 'Mmm... Parece que todavía no sabes\nusar tu fuerza escondida.\n\nPero eres nuestra única esperanza.\n\n¡Sigue intentando!\nTienes que vencerme.\n\nAquí te espero.\n¡Cuento contigo!',
    en: "Hmm... Looks like you haven't learned\nto use your hidden power yet.\n\nBut you're our only hope.\n\nKeep trying!\nYou must defeat me.\n\nI'll keep waiting.\nI'm counting on you!",
  },
  '7FB0': yunqueDeck,

  // Madreselva, without her shape: only the player can see her
  '94E4': { es: 'Qué alegría verte otra vez...\nY cuánta fuerza tienes ahora.', en: "I'm so glad to see you again...\nAnd you've grown so much stronger." },
  '9574': { who: 'me', es: 'Sí, creo que sí.', en: 'Yeah, I think so.' },
  '95D0': {
    es: 'Tengo algo importante que decirte.\nPero antes, ve a ver a Yunque.\n\nTe espero aquí.\nJa, ja, ja...',
    en: "I have something important to tell you.\nBut first, go and see Yunque.\n\nI'll be waiting for you here.\nHa ha ha...",
  },
  '96F0': { es: 'Qué alegría verte otra vez.\nMira todo lo que avanzaste.', en: "So glad to see you again.\nMy, look how far you've come." },
  '9778': { who: 'me', es: 'Sí, eso creo.', en: 'Yeah, I guess.' },
  '97D8': { es: 'Así que ya hablaste con Yunque.', en: "So, you've spoken with Yunque." },
  '9844': { who: 'me', es: 'Dijo que está pasando algo malo.', en: 'He said something bad is happening.' },
  '98C0': {
    es: 'Por cierto, perdona que no te dejara\nsalir del Café.\n\nNecesitaba hablar contigo antes\nde que fueras a la Torre sin Fin.\n\nPor eso cubrí la puerta\ncon una enredadera.',
    en: "By the way, I'm sorry I didn't let you\nleave the Battle Cafe.\n\nI needed to talk to you before\nyou went to the Endless Tower.\n\nThat's why I covered the door\nwith a vine.",
  },
  '9A28': {
    es: 'Y no sirve de nada preguntarles\na los demás por mí.\n\nSolo tú puedes verme.\nHace un tiempo perdí mi forma.\n\nSin forma no puedo entrar a las Arenas,\npero tampoco necesito pases para viajar.',
    en: "And it's no use asking\nthe others about me.\n\nYou're the only one who can see me.\nI lost my shape a while ago.\n\nWithout a shape I can't enter Arenas,\nbut I don't need passes to travel.",
  },
  '9B7C': { who: 'me', es: '¿Quién eres?', en: 'Who are you?' },
  '9BCC': {
    es: 'Me llamo... Madreselva.\n\nAndo por estas tierras buscando\nnoticias de «él».\n\nSi «él» llega a este mundo, tengo que\ndetenerlo, cueste lo que cueste.\n\nNecesito tu fuerza. Tienes mucho\ntalento para las cartas.',
    en: 'My name is... Madreselva.\n\nI\'m travelling these lands to learn\nwhat I can about "him."\n\nIf "he" comes into this world, I must\nstop him, whatever the cost.\n\nI need your power. You have\ngreat talent with cards.',
  },
  '9D88': {
    who: 'me',
    es: '¡Espera un momento!\n¿De qué estás hablando?\n\n¿Tiene que ver con la Torre sin Fin\nque mencionó Yunque?',
    en: 'Hold on a second!\nWhat are you talking about?\n\nDoes this have to do with the\nEndless Tower Yunque mentioned?',
  },
  '9E84': {
    es: 'Es probable. Si es así,\n¡solo tú puedes vencerlo!\n\nNadie más tiene ninguna\noportunidad contra «él».\n\nAhora que venciste a Yunque,\neres nuestra mejor esperanza.\n\nSolo cuento contigo.\nNo hay otro camino.',
    en: 'Probably. If so, you\'re the only\none who can defeat "him"!\n\nNobody else stands\na chance against "him."\n\nNow that you\'ve beaten Yunque,\nyou\'re our best hope.\n\nYou\'re the only one I can count on.\nThere is no other way.',
  },
  'A070': { who: 'me', es: '¿Qué?', en: 'What?' },
  'A0B8': {
    es: 'Vas a necesitar cartas\ny mazos fuertes.\n\nLa última tienda de fusión\nestá aquí, en esta torre.\n\nFusiona las cartas que tienes\npara conseguir otras más poderosas.',
    en: 'You will need strong cards\nand decks.\n\nThe last Fusion shop is here,\nin this tower.\n\nFuse the cards you have\nto get more powerful ones.',
  },
  'A204': { who: 'me', es: '¿Quién es «él»?', en: 'Who is "he"?' },
  'A25C': {
    es: 'No puedo decírtelo\nhasta que «él» llegue.\n\nLo sabrás cuando llegues\na la Torre sin Fin.',
    en: 'I can\'t tell you\nuntil "he" arrives.\n\nYou\'ll know for sure once\nyou reach the Endless Tower.',
  },
  'A334': { who: 'me', es: 'Está bien...', en: 'Alright...' },
  'A384': { es: 'Perdón por cargarte con esto.\nYa me tengo que ir.', en: "I'm sorry to put this burden on you.\nI must go now." },
  'A40C': {
    who: 'me',
    es: 'No te preocupes. Sé que esto\nes algo serio.\n\nYa lo decidí.\n¡Voy a ir a la Torre sin Fin!',
    en: "Don't worry. I know this is\nserious business.\n\nI've made up my mind.\nI'll go to the Endless Tower!",
  },
  'A4E8': {
    es: 'Ya veo.\nGracias...\n\nTienes buen corazón. Me alegra\nque seas tú quien lo haga.\n\nSolo lamento que tuviéramos\nque hablar de «él».\n\nPodríamos haber tenido charlas mucho\nmás interesantes, ¿no crees?',
    en: 'I see.\nThank you...\n\nYou have a good heart. I\'m glad you\'re\nthe one who will do this.\n\nI only regret that we had\nto talk about "him."\n\nWe could have had so many more\ninteresting talks, don\'t you think?',
  },
  'A6BC': { who: 'me', es: '¿Qué quieres decir?', en: 'What do you mean?' },
  'A710': { es: 'Adiós...\nOjalá puedas vencerlo.', en: 'Farewell...\nI hope you can defeat "him."' },
  'A794': { who: 'me', es: '¡Espera! ¡Madreselva...!', en: 'Wait. Hold on! Madreselva...' },
  'A8A4': { es: 'Adiós...\nOjalá puedas con «él».', en: 'Goodbye...\nI hope you can beat "him."' },
  'A934': thornDeck,
};

const ARENA: CityTexts = {
  // Espina
  'AC40': {
    es: 'Soy Espina. ¡Mucho gusto!\nMe hablaron mucho de ti.\n\nAquí se reúnen los mejores\njugadores de cartas.\n\nGanar aquí no será fácil.\nYo seré la primera en demostrártelo.\n\n¡Bueno, suerte!',
    en: "I'm Espina. Pleasure to meet you!\nI've heard so much about you.\n\nThis is where all the best\ncard players gather.\n\nWinning here won't be easy.\nI'll be the first to show you.\n\nOK, good luck!",
  },
  'AE88': { es: 'Aquí empieza la batalla de verdad.\n¿Empezamos?', en: 'This is where the real battle begins.\nShall we start?' },
  'AF40': { es: 'No te culpo, pero esperaba\nun poco más de ti.', en: "I don't blame you, but I\nexpected a bit more from you." },
  'AFD4': { es: '¡Ese es el espíritu!', en: "That's the spirit!" },
  'B06C': {
    es: '¡Vaya, jugaste mejor de lo que pensaba!\n\nCreo que te va a ir bien.\n\nHay muchos oponentes duros por delante,\npero seguro que puedes con ellos.\n\n¡Te apoyo!\nArrasa con esta Arena.\n\nProméteme que vas a ganar, ¿sí?',
    en: "Wow, you played better than I thought!\n\nI think you'll do well.\n\nThere are many tough opponents ahead,\nbut I'm sure you'll be fine.\n\nI'm rooting for you!\nTake this Arena by storm!\n\nPromise me you'll win, OK?",
  },
  'B250': {
    es: '¿Qué? ¿Qué pasó?\n\nPensé que serías mucho mejor.\n¡Qué decepción!\n\nTienes que jugar mejor que eso\npara superar esta Arena.\n\nQuizás no te sentías bien.\n\nPero si te rindes, nunca vas a ganar\nel Sello del Archivo.\n\nInténtalo otra vez.\nTe espero... ¡Nos vemos!',
    en: "What? What happened?\n\nI thought you'd be much better.\nWhat a letdown!\n\nYou have to play better than that\nto get through this Arena!\n\nMaybe you weren't feeling well.\n\nBut if you give up, you'll never\nearn the Archive Seal!\n\nTry again.\nI'll be waiting... See you!",
  },
  'B4A8': espinaDeck,

  // Cornelio
  'B5D4': {
    es: 'Me llaman Cornelio.\n\nSeré tu segundo rival\nen esta Arena.\n\nSeamos amigos, ¿sí?\n\nMe hablaron mucho de ti.\nDicen que nadie te gana.\n\nAsí que esperaba mi oportunidad\nde enfrentarte.\n\nConmigo no tienes nada que hacer,\npero suerte igual.',
    en: "People call me Cornelio.\n\nI'll be your second opponent\nin this Arena.\n\nLet's be friends, huh?\n\nI've heard so much about you.\nThey say you're unbeatable.\n\nSo I've been waiting for my chance\nto take you on.\n\nYou don't stand a chance against me,\nbut good luck anyway.",
  },
  'B8E4': { es: '¿De verdad quieres hacerlo?', en: 'Do you really want to do this?' },
  'B980': { es: 'Bah. Mucho hablar y nada de acción.', en: 'Hmph. All talk and no action.' },
  'B9FC': { es: 'Muy bien, ¡vamos a jugar!', en: "OK then. Let's do this!" },
  'BAA0': {
    es: '¡Vaya! Me ganaste bien.\n¡Tienes mucha fuerza!\n\nGanaste limpiamente.\nQuizás nos crucemos otra vez.\n\nOjalá juguemos de nuevo.\n¡Adiós!',
    en: 'Wow! You got me good.\nYou ARE tough!\n\nYou won fair and square.\nOur paths may cross again somewhere.\n\nI hope we can do this again.\nBye-bye!',
  },
  'BC0C': {
    es: '¡No eres como me contaron!\nPensé que serías mucho mejor.\n\nSi eso es todo, ¡me decepcionas!\n\nBueno, voy a estar aquí un tiempo.\nVuelve por la revancha.\n\n¡Adiós!',
    en: "You're nothing like they said!\nI thought you'd be much better.\n\nIf that's it, you disappoint me!\n\nWell, I'll be here for a while.\nCome back for a rematch.\n\nBye-bye!",
  },
  'BD9C': cornelioDeck,

  // Rompehielos
  'BED4': {
    es: '¡Hola, soy Rompehielos!\n\nMe impresiona que hayas\nllegado hasta aquí.\n\nPero esto es solo la mitad.\n¡Todavía te falta mucho camino!\n\nDesde aquí, todos son mucho\nmás duros. ¡Suerte!',
    en: "Hey, I'm Rompehielos!\n\nI'm impressed that you\neven made it this far.\n\nBut this is only the halfway point.\nYou still have a long way to go!\n\nEveryone is much tougher\nfrom here on. Good luck!",
  },
  'C124': { es: '¿Lo hacemos?', en: 'Do you want to do this?' },
  'C1B8': { es: 'Vamos, ten un poco de valor.', en: 'Be brave, my friend.' },
  'C228': { es: 'Sabía que no rechazarías\nmi desafío.', en: "I knew you wouldn't turn down\nmy challenge." },
  'C2E4': {
    es: '¡Vaya, perdí!\nAsí que los rumores son ciertos.\n\nCreo que tienes fuerza para\nllegar hasta el final. ¡Suerte!\n\n¡Sigue poniéndote a prueba!\n\nBueno, eso dice siempre\nmi compañero, Jacinto.\n\nProméteme que volveremos a jugar\nsi nos encontramos por ahí.',
    en: "Wow, I lost!\nSo the rumors are true!\n\nI think you're strong enough\nto make it all the way. Good luck!\n\nKeep challenging yourself!\n\nWell, that's what my partner,\nJacinto, says all the time.\n\nPromise me we'll do this again\nif we meet somewhere!",
  },
  'C514': {
    es: '¡Ja! ¡Gané!\nAsí que los rumores eran falsos.\n\nCon ese nivel no vas a superar\nesta Arena.\n\n¡Pero sigue intentando!\nLo importante es no rendirse.\n\nBueno, eso me dice siempre\nmi compañero, Jacinto.\n\n¡Ojalá vuelvas!\nYa sabes que aquí estaré.',
    en: "Ha! I won!\nSo the rumors were false!\n\nYou won't get through this Arena\nwith those skills.\n\nBut keep trying! What matters\nis not giving up.\n\nWell, that's what my partner,\nJacinto, tells me all the time.\n\nI hope you come back!\nYou know I'll be here!",
  },
  'C750': rompehielosDeck,

  // Gallardo
  'C894': {
    es: 'Soy Gallardo.\nDéjame hacerte una pregunta.\n\n¿Cuál es tu propósito?\n¿Lo pensaste alguna vez?\n\nYa es hora de que empieces\na pensarlo.\n\nUna batalla de cartas tiene que ser\nalgo más que ganar.\n\nBueno, basta de charla. ¡La respuesta\nestá más allá de esta partida!',
    en: "I'm Gallardo.\nLet me ask you a question.\n\nWhat is your purpose?\nHave you ever thought about it?\n\nIt's about time you started\nthinking about it.\n\nThere must be more to a card battle\nthan just winning.\n\nWell, enough talk. The answer\nlies beyond this match!",
  },
  'CB98': { es: 'Veo que tienes ganas.\n¿Empezamos?', en: "Looks like you're eager.\nShall we begin?" },
  'CC2C': { es: '¿No quieres saber la respuesta\na mi pregunta?', en: "Don't you want to know the answer\nto my question?" },
  'CCC0': { es: 'No te la voy a dejar fácil.\n¡Prepárate!', en: "I won't go easy on you.\nGet ready!" },
  'CD78': {
    es: 'Perdí, pero fue una gran batalla.\n\nSeguro que algún día encontrarás\nla respuesta a mi pregunta.\n\nCuando la encuentres,\njuguemos la revancha.\n\nEl camino que sigue es duro,\npero sé que puedes recorrerlo.\n\nNos volveremos a ver. ¡Hasta pronto!',
    en: "I lost, but that was a great battle.\n\nI'm sure you'll find the answer\nto my question someday.\n\nWhen you do, let's have\na rematch.\n\nIt's a tough road ahead,\nbut I know you can make it.\n\nI'm sure we'll meet again. See you!",
  },
  'CF7C': {
    es: '¿Esto es lo mejor que puedes hacer?\n\nPerdiste, pero algún día encontrarás\nla respuesta a mi pregunta.\n\nCuando la tengas, quiero que\njuguemos otra vez.\n\nTu viaje recién empieza.\nAquí te espero.\n\n¡Adiós!',
    en: "Is this the best you can do?\n\nYou lost, but I'm sure you'll find\nthe answer to my question someday.\n\nWhen you do, I want us\nto play once more.\n\nYour journey is just beginning.\nI'll be waiting for you here.\n\nGoodbye!",
  },
  'D174': gallardoDeck,

  // Aullido
  'D2B4': {
    es: '¡Soy Aullido, tu quinto rival!\nAntes me llamaba Ventisca.\n\nSupe todo lo que hiciste desde que\nnos vimos en Puerto Escarcha.\n\nSabía que algún día llegarías\na esta Arena.\n\nSolo los más fuertes llegan\na la Torre del Archivero.\n\nSoy duro de vencer.\n¡Prepárate bien!\n\nSeguro que tienes lo necesario para\nvencerme y llegar aún más lejos.\n\nConfío en ti.',
    en: "I'm Aullido, your 5th opponent!\nI used to be called Ventisca.\n\nI've heard what you've been doing\nsince we met in Frost Harbor.\n\nI knew you would reach\nthis Arena one day.\n\nOnly the strongest card players\nreach the Archivist's Tower.\n\nI'm tough to beat.\nYou'd better get ready!\n\nI'm sure you have what it takes to\nbeat me and go even further.\n\nI trust you to do so, my friend.",
  },
  'D66C': { es: '¿Confías en tu habilidad?', en: 'Are you confident in your skills?' },
  'D710': { es: 'No tanto, ¿eh?', en: 'Not so sure, are you?' },
  'D780': { es: '¡Honremos esta Arena\ncon una gran batalla!', en: "Let's honor this Arena\nwith a great match!" },
  'D854': {
    es: '¡Qué batalla!\n\nNo me arrepiento de nada.\nGracias... Disfruté nuestro duelo.\n\nVolvamos a enfrentarnos\ncuando alcance mi siguiente forma.\n\nOjalá nos crucemos otra vez.\n\nProméteme que te acordarás de mí.',
    en: "That was quite a battle!\n\nI have no regrets.\nThank you... I enjoyed our duel.\n\nLet's duel again once\nI reach my next shape.\n\nI hope to run into you again someday.\n\nPromise you'll remember me.",
  },
  'DA38': {
    es: 'No te sientas mal.\nSiente orgullo de haber llegado aquí.\n\n¡Tienes que desafiarme otra vez!\n\nSeguro que vas a crecer hasta vencer\na todos en esta Arena.\n\nEso es lo que creo.',
    en: "You shouldn't feel bad about this.\nBe proud that you've come this far.\n\nYou must challenge me again!\n\nI'm sure you'll grow strong enough to\nbeat everyone in this Arena!\n\nThat's what I believe.",
  },
  'DBF0': aullidoDeck,

  // Yunque, master of the Arena
  'DD1C': {
    es: 'Gracias por venir.\n\nTienes una fuerza escondida.\nPor eso llegaste hasta aquí.\n\nY yo seré quien vea cuánta fuerza\ntienes de verdad.\n\n¿Empezamos?\n¡Dame tu mejor jugada!',
    en: "Thanks for coming.\n\nYou have hidden power.\nThat's why you made it here.\n\nAnd I'll be the one to see\nhow strong you really are!\n\nAre you ready?\nHit me with your best shot!",
  },
  'DF78': { es: '¿Comenzamos?', en: 'Shall we begin?' },
  'E004': { es: 'Como quieras. Pero estos tiempos\npiden una fuerza nueva.', en: 'As you wish. But this era\nis calling for a new power.' },
  'E084': { es: 'Muéstrame tu fuerza.', en: 'Show me your power.' },
  'E138': {
    es: '¡Espléndido! ¡Qué gran batalla!\n\nMe venciste con toda mi fuerza.\nTu poder es real.\n\nCreo que podrás cumplir esta misión.\nTengo que pedirte un favor.\n\nVen al Café de batallas.\nAllí te espero.',
    en: "Splendid! What a great battle!\n\nYou beat me at my strongest.\nYour power is real!\n\nI think you can carry out this\nmission. I have a favor to ask.\n\nCome to the Battle Cafe.\nI'll be there.",
  },
  'E58C': {
    es: 'Veo que estás en buena racha.\n\nNo creo que pueda vencerte.\n\nTu fuerza ya supera la mía.\n\nPero pienso desafiarte otra vez\ncuando evolucione.\n\nEspero que aceptes mi desafío.',
    en: "You're on a roll, I see.\n\nI don't think I'll ever come close\nto defeating you.\n\nYou're way beyond my power.\n\nBut I intend to challenge you again\nafter I evolve.\n\nI hope you'll accept my challenge.",
  },
  'E8F0': {
    es: 'Parece que todavía no usas\ntu fuerza escondida.\n\nPero eres nuestra única esperanza.\n\n¡Por favor, no te rindas!\nSigue intentando hasta vencerme.\n\nAquí te espero.\n¡Cuento contigo!',
    en: "It looks as though you're still not\nusing your hidden power.\n\nBut you are our only hope.\n\nPlease don't give up!\nKeep trying until you beat me.\n\nI'll be here, waiting.\nI'm counting on you!",
  },
  'EAA0': {
    es: 'Esta vez la suerte no estuvo\nde tu lado.\n\nEso es lo que hace interesante\neste juego, ¿no?\n\nLas cartas esconden mucho.\nVen a desafiarme cuando quieras.',
    en: "Luck was not on your side this time.\n\nThat's what keeps this game\ninteresting, isn't it?\n\nCard battles run deep.\nCome challenge me again anytime.",
  },
  'EC04': yunqueDeck,
};

export const CITY10: CityTexts = { ...CAFE, ...ARENA, ...CITY10_LATER };
