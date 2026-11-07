/**
 * Puerto Escarcha, later phases: the arena once Ventisca is free (Témpano, Muelle, Ventisca, then Acero and
 * Acero Negro), and the Extra Arena, where Gema fights with every shape it reaches, taking a new name each
 * time: Gema, Coraza, Barreno, Calado, Ánfora and, at last, Fiordo.
 * The decks and lines that the café of city03.ts repeats are exported from here.
 */
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });

export const DECKS03 = {
  tempano: deck('*c3Mazo Gran Banquete\nLleno de comida rica. Hace falta mucho\npoder de ataque para bajarle el HP.', '*c3Grand Feast Deck\nFull of tasty food. You need lots of\nAttack Power to get through its HP.'),
  muelle: deck('*c3Mazo Rompeolas\nUn mazo Azul de los de siempre.\nTodo defensa.', '*c3Breakwater Deck\nA classic Blue deck.\nAll defense.'),
  ventisca: deck('*c3Mazo Contragolpe\nUn mazo Azul equilibrado. No olvides\nel Apoyo que te deja atacar primero.', "*c3Counterblow Deck\nA well-balanced Blue deck. Don't forget\nSupport cards that strike first."),
  gema: deck('*c3Mazo Rompemontes\nUn mazo con criaturas\nde la facción Rara.', '*c3Mountain Breaker Deck\nA deck with creatures\nof the Rare faction.'),
  coraza: deck('*c3Mazo Cabeza Dura\nUn mazo Raro con mucha defensa. Atácalo\ncuando no tenga cartas de Apoyo.', '*c3Hardhead Deck\nA Rare deck with strong defense. Hit it\nwhen it has no Support cards left.'),
  barreno: deck('*c3Mazo Rompemontes Extra\nUn mazo Raro demoledor, con más\ncartas que recuperan HP.', '*c3Mountain Breaker EX Deck\nA crushing Rare deck with extra\ncards that recover HP.'),
  calado: deck('*c3Mazo Aguas Hondas\nUn mazo duro de las facciones\nAzul y Rara.', '*c3Deep Water Deck\nA tough deck of the Blue\nand Rare factions.'),
  anfora: deck('*c3Mazo Barro Sagrado\nUn mazo de la facción Rara. Cuidado:\nsus ataques cambian la facción.', '*c3Sacred Clay Deck\nA Rare faction deck. Beware:\nits attacks change factions.'),
  fiordo: deck('*c3Mazo Hielo Eterno\nUn mazo Azul y Raro con muchísima\ndefensa. Lo apuesta todo a evolucionar.', '*c3Everfrost Deck\nA Blue and Rare deck with huge defense.\nIt bets everything on evolving.'),
  acero: deck('*c3Mazo Ráfaga Total\nUn mazo Azul muy ofensivo,\nequilibrado y con mucho HP.', '*c3Full Volley Deck\nA very offensive Blue deck,\nbalanced and with plenty of HP.'),
  aceroNegro: deck('*c3Mazo Bandera Negra\nGana despacio, con cartas de Apoyo\nque interfieren y anulan.', '*c3Black Banner Deck\nWins slowly, with Support cards\nthat jam and nullify.'),
};

export const LINES03 = {
  grr: { es: 'Grrrrrr...', en: 'Grrrrrr...' },
  tempano: {
    no: { es: 'Ay, qué pena...\nY yo con tanta hambre.', en: "Aw, what a shame...\nAnd I'm so hungry, too." },
    go: { es: '¡A la mesa!', en: 'Dinner is served!' },
    won: { es: '¡Sí, sí! ¡Gané!\n¡Eso fue pan comido!\n\nUf, quedé llenísimo.\n¡Gracias por el banquete!\n\n¡Ojalá lo repitamos pronto!', en: "Yes, yes! I won!\nThat was a piece of cake!\n\nPhew, I'm stuffed.\nThanks for the feast!\n\nLet's do this again soon!" },
  },
  muelle: {
    ask: { es: 'Bien. ¿Soltamos amarras?', en: 'Well then. Shall we cast off?' },
    no: { es: '¿No viniste a jugar?', en: "Didn't you come here to play?" },
    lost: {
      es: 'Lo que esperaba. Juegas bien.\n\nTienes mucho potencial.\nPerdí, pero fue una buena partida.\n\nSé que algún día tu fuerza\nsalvará las Tierras Quietas.\n\nOjalá sigas adelante\ny llegues lejos con las cartas.',
      en: "Just as I expected. You play well.\n\nYou have great potential.\nI lost, but it was a good match.\n\nI know that one day your strength\nwill save the Quiet Lands.\n\nI hope you keep going\nand go far with your cards.",
    },
    won: {
      es: 'Perdona, me dejé llevar.\nNo quería ser tan duro.\n\nJuegas bien. Espero que algún día\nllegues lejos con las cartas.\n\nTienes mucho potencial. Un día\nme vencerás y llegarás más lejos.\n\nEsperaré tu próximo desafío.',
      en: "Forgive me, I got carried away.\nI didn't mean to be so harsh.\n\nYou play well. I hope someday\nyou go far with your cards.\n\nYou have great potential. One day\nyou'll beat me and go even further.\n\nI'll be waiting for your next challenge.",
    },
  },
  ventisca: {
    no: { es: 'Si no te sientes con ganas,\nqué lástima...', en: "If you're not up for it,\nthat's a shame..." },
  },
  gema: {
    won: { es: '¡Ey, ey! ¡Gané! ¡Ey!\n¿Qué pasó? ¡Te falta fuerza!', en: "Yo yo! I won! Yo!\nWhat happened? You're so weak!" },
  },
  coraza: {
    ask: { es: '¡Ey! ¿Te animas?', en: 'Yo! You up for it?' },
    no: { es: '¿Qué? ¿Te dio miedo?\n¡Porque tienes cara de miedo!', en: "What? Scared?\n'Cause you sure look scared!" },
  },
  barreno: {
    no: { es: '¡No quiero excusas!\n¡Prepárate! ¡Ey!', en: "I don't wanna hear excuses!\nGet ready. Yo!" },
    go: { es: '¡Ey! ¡Esta vez no pierdo! ¡Ey!', en: "Yo! I won't lose this time! Yo!" },
  },
  calado: {
    ask: { es: '¡Ey! ¡Me muero por jugar contigo!\n¿Empezamos?', en: "Yo! I can't wait to take you on!\nShall we?" },
    no: { es: '¡Ja!\nTienes miedo, ¿verdad?', en: "Hah!\nYou're scared, aren't you?" },
    go: { es: '¡Mira! ¡Este es mi verdadero poder! ¡Ey!', en: 'Watch! This is my true power! Yo!' },
    won: { es: '¡Ey, ey! ¡Gané! ¡Ey!\n¿Qué pasó? ¡Te falta fuerza!\n\nSabía que no podías ganarme\nsiendo yo Calado.\n\nDesafíame cuando quieras.\n¡Ey! Nos vemos.', en: "Yo yo! I won! Yo!\nWhat happened? You're so weak!\n\nI knew you couldn't beat me\nwhile I'm Calado.\n\nChallenge me anytime.\nYo! See you around." },
  },
  anfora: {
    ask: { es: '¿Te atreves a recibir tu castigo?', en: 'Ready to take your punishment?' },
    no: { es: '¡Bueno, entiendo tu decisión!', en: 'Well, I get your decision!' },
    go: { es: '¡Ey! Te voy a hacer lamentar\nhaberme desafiado. ¡Ey!', en: "Yo! I'll make you regret\nchallenging me. Yo!" },
    won: { es: '¡Ey, ey! ¡Gané! ¡Ey!\n¿Qué pasó? ¡Te falta fuerza!\n\nNo eres rival para Ánfora,\n¡un Perfecto de verdad!\n\n¡Ey! Puedes desafiarme otra vez.\nNos vemos.', en: "Yo yo! I won! Yo!\nWhat happened? You're so weak!\n\nYou're no match for Ánfora,\na true Apex!\n\nYo! You can challenge me again.\nSee you around." },
  },
  fiordo: {
    ask: { es: '¿De verdad quieres hacer esto?', en: 'Do you really want to do this?' },
    no: { es: '¡Sabia decisión!\nEs mejor para tu salud.', en: "A wise choice!\nIt's better for your health." },
    go: { es: 'Bueno, tú lo decidiste.', en: "Well, it's your call." },
    won: {
      es: '¡Bien! ¡Gané! ¡Ey!\nEstuvo reñido, ¡pero gané!\n\nHabría sido terrible perder\nen mi forma más alta.\n\nPuedes desafiarme otra vez,\npero ten un poco de piedad.\n\nNos volveremos a ver.',
      en: "All right! I won! Yo!\nIt was close, but I won!\n\nIt would've been awful to lose\nin my highest shape!\n\nYou can challenge me again,\nbut go easy on me.\n\nWe'll meet again.",
    },
  },
  acero: {
    ask: { es: '¡Estoy listo! ¿Jugamos?', en: "I'm ready to go! Shall we?" },
  },
  aceroNegro: {
    ask: { es: 'Vienes a jugar, ¿verdad?', en: 'You came here to battle, right?' },
    no: { es: 'Parece que todo era palabrería...', en: 'I guess it was all just talk...' },
    go: { es: '¡Esta es mi respuesta!', en: 'This is my answer!' },
    won: {
      es: 'Ya veo... Así juegas, ¿eh?\nAhora lo sé.\n\nLo más importante es entenderse\na través de la batalla.\n\nNo lo olvides.\n\nQuien solo piensa en ganar\nsolo encuentra la derrota.\n\nDesafíame cuantas veces quieras.\nEsa es mi respuesta.',
      en: "I see... So that's how you play.\nNow I know.\n\nWhat matters most is understanding\neach other through battle.\n\nDon't forget it.\n\nThose who think only of winning\nfind only defeat.\n\nChallenge me as often as you like.\nThat is my answer.",
    },
  },
};

const { tempano, muelle, ventisca, gema, coraza, barreno, calado, anfora, fiordo, acero, aceroNegro } = LINES03;

const tempanoAsk = { es: '¿Jugamos? ¡Tengo la panza vacía!', en: "Shall we play? My belly's empty!" };
const tempanoLost = (es: string, en: string) => ({ es: `¡Nooo! ¡Perdí!\n¡Qué fuerza tienes!\n\n¡Eso no lo sabía! ¡No es justo!\n${es}`, en: `Nooo! I lost!\nYou're really strong!\n\nI didn't see that coming! Not fair!\n${en}` });
const ventiscaGo = { es: '¡Bien! ¡Vamos!', en: "Good! Let's go!" };
const aceroLostTo = { es: 'Lo que pensaba. Tienes mucha fuerza.\nCreo que ya no estoy a tu altura.', en: "Just as I thought. You're strong.\nI guess I'm no match for you now." };
const aceroNo = { es: 'Bueno. Que lo disfrutes.', en: 'Well. Enjoy yourself.' };
const aceroLesson = { es: 'Que te sirva de lección, ¿sí?\n\nJuego contigo cuando quieras.\nVuelve otra vez.\n\n¡Nos vemos!', en: "Let this be a lesson, OK?\n\nI'll play you whenever you like.\nCome back again.\n\nSee you later!" };
const gemaAsk = { es: '¡Ey! ¿Empezamos?', en: 'Yo! Ready?' };
const corazaWon = {
  es: '¡Ey, ey! ¡Gané! ¡Ey!\n¿Qué pasó? ¡Te falta fuerza!\n\nMi cabezazo de roca es invencible.\n¡Ey! ¡Sabía que era el mejor!\n\nVuelve cuando tengas mucha más fuerza.\n\n¡Ey! Nos vemos.',
  en: "Yo yo! I won! Yo!\nWhat happened? You're so weak!\n\nMy rock-hard headbutt is unbeatable.\nI knew I was the best. Yo!\n\nGet a lot stronger before\nyou show your face here again.\n\nYo! See you around.",
};
const barrenoWon = (es: string, en: string) => ({
  es: `¡Ey, ey! ¡Gané! ¡Ey!\n¿Qué pasó? ¡Te falta fuerza!\n\n¿Ves? No eres rival para mí\n${es}\n\nPuedes desafiarme otra vez. ¡Ey!\nNos vemos.`,
  en: `Yo yo! I won! Yo!\nWhat happened? You're so weak!\n\nSee? You're no match for me\n${en}\n\nYou can challenge me again. Yo!\nSee you around.`,
});
const barrenoToCalado = (es: string, en: string) => ({
  es: `${es}\n\nAhora sí. ¡Ey! Con mi huevo\nde la Confianza voy a evolucionar.\n\nComo Calado, mi nuevo poder\nte va a dejar con la boca abierta. ¡Ey!\n\n¡Vamos, vamos! ¡Ey! ¡Pégame! ¡Ey!`,
  en: `${en}\n\nThis is it. Yo! With my Egg of\nReliability, I'm gonna evolve!\n\nAs Calado, my new power\nwill blow you away. Yo!\n\nCome on, come on! Yo! Hit me! Yo!`,
});
const caladoIntro = {
  es: '¡Bien! ¡Ahora soy Calado! ¡Ey!\nBajo el agua no hay quien me gane.\n\nEsta vez no será tan fácil como antes.\nTen cuidado. ¡Ey!',
  en: "All right! Now I'm Calado! Yo!\nUnderwater, nobody beats me.\n\nIt won't be as easy as before.\nYou'd better watch out. Yo!",
};
const anforaIntro = {
  es: 'Ahora soy Ánfora: ¡llegué a Perfecto!\n¡Ya no tienes ninguna oportunidad!\n\nYa no tengo puntos débiles.\nAhora verás mi verdadero poder.',
  en: "Now I'm Ánfora: I made it to Apex!\nYou don't stand a chance!\n\nI've got no weak spots left.\nNow I'll show you my true power!",
};
const finalInvite = { es: 'Te espero en el Café de batallas.\n¡Ey! No te olvides de venir.\n\n¡Ey! Nos vemos.', en: "I'll be waiting at the Battle Cafe.\nYo! Don't forget to come.\n\nYo! See you later." };
const giveUp = {
  es: '¡Me rindo! ¡Me rindo!\n¡Perdón! ¡Ey! ¡En serio!\n\nPero quiero jugar contigo otra vez.',
  en: "I give up! I give up!\nSorry! Yo! Really!\n\nBut I wanna play you again.",
};
const nobodyCan = { es: 'Si yo no puedo ganarte,\nnadie puede, en serio.', en: "If I can't beat you,\nnobody can, man." };

export const CITY03_LATER: CityTexts = {
  // the arena, now free: Témpano, Muelle, then Ventisca as its master
  EAD0: tempanoAsk,
  EB58: { es: '¿¡En serio!?', en: 'Really?!' },
  EBB8: tempano.go,
  EC4C: tempanoLost('¡Me muero de hambre!', "I'm starving!"),
  ED4C: tempano.won,
  EE80: DECKS03.tempano,
  F058: muelle.ask,
  F0E4: muelle.no,
  F154: { es: 'Sí. Comencemos...', en: 'Yes. Let us begin...' },
  F1EC: { es: `Mmm... ${muelle.lost.es}`, en: `Hmm... ${muelle.lost.en}` },
  F3B8: muelle.won,
  F58C: DECKS03.muelle,
  F6A8: {
    es: '¡Hoy voy a pelear con todo el corazón!\nNo creas que me vencerás otra vez.\n\n¡Te mostraré de qué es capaz\nel maestro de esta Arena!',
    en: "Today I'll fight with all my heart!\nDon't think you'll beat me again.\n\nI'll show you what the master\nof this Arena can do!",
  },
  F85C: { es: '¡Ahora sí, una batalla de verdad!\n¿Empezamos?', en: 'Now for a real battle!\nShall we begin?' },
  F8F8: ventisca.no,
  F978: ventiscaGo,
  FA0C: {
    es: 'Tienes mucha fuerza, de verdad.\n\n¡Eso es poder del bueno!\n¡Tenemos que repetirlo!\n\nVoy a entrenar duro para\nalcanzar una forma más alta.\n\n¡Nos vemos en el Café de batallas!',
    en: "You really are strong.\n\nNow that's real power!\nWe have to do this again!\n\nI'll train hard to reach\na higher shape.\n\nSee you at the Battle Cafe!",
  },
  '10958': {
    es: '¿Ves? Así peleo de verdad.\n¡Te dije que no sería fácil!\n\nVuelve si quieres la revancha.\nTe espero en el Café de batallas.\n\n¡Cuídate! ¡Hasta luego!',
    en: "See? This is how I really fight.\nI told you I'd be tough!\n\nCome back if you want a rematch.\nI'll be at the Battle Cafe.\n\nTake care! See you!",
  },
  '10AB4': DECKS03.ventisca,

  // Témpano and Muelle again, then Acero
  '10E9C': tempanoAsk,
  '10F24': tempano.no,
  '10F88': tempano.go,
  '1101C': tempanoLost('¡Tengo hambre!', "I'm hungry!"),
  '1111C': tempano.won,
  '11250': DECKS03.tempano,
  '11428': muelle.ask,
  '114B0': muelle.no,
  '11520': { es: 'Bien, empecemos.', en: "Good, let's begin." },
  '115BC': muelle.lost,
  '11780': muelle.won,
  '11954': DECKS03.muelle,
  '11A78': {
    es: '¡Hola, qué gusto verte! Soy Acero.\n\nYa conozco tu fuerza.\nRelájate y disfruta.\n\nPero ojo, que te puedo ganar.\n¡Ja, ja, ja, ja!',
    en: "Hey, good to see you! I'm Acero.\n\nI already know how strong you are.\nRelax and enjoy yourself.\n\nBut watch out, or I'll get you.\nHa ha ha ha!",
  },
  '11C70': acero.ask,
  '11D00': aceroNo,
  '11D70': { es: 'Bien. Empecemos.', en: "OK. Let's begin." },
  '11E0C': {
    es: `${aceroLostTo.es}\n\nSi puedo ayudarte en algo, avísame.\n\nPasa por el Café de batallas.\n¡Nos vemos!`,
    en: `${aceroLostTo.en}\n\nIf I can help you in any way, tell me.\n\nDrop by the Battle Cafe sometime.\nCatch you later!`,
  },
  '12060': {
    es: '¿Ves? Te dije que tuvieras cuidado...\n\nQue te sirva de lección, ¿sí?\n\nJuego contigo cuando quieras.\nVuelve pronto.\n\n¡Nos vemos!',
    en: "See? I told you to watch out...\n\nLet this be a lesson, OK?\n\nI'll play you whenever you like.\nCome back soon.\n\nSee you later!",
  },
  '121D8': DECKS03.acero,

  // Ventisca, Acero, then Acero Negro
  '125E4': { es: '¿Te animas a enfrentarme?', en: 'Up for taking me on?' },
  '12674': ventisca.no,
  '126F4': ventiscaGo,
  '12788': {
    es: '¡Increíble! No me decepcionaste.\n\nTu fuerza es de verdad. Pero la próxima\nvez evolucionaré, ¡y seré Acero!\n\n¡Ten cuidado!',
    en: "Incredible! You didn't let me down.\n\nYour strength is real. But next time\nI'll evolve, and I'll be Acero!\n\nWatch out!",
  },
  '128C4': {
    es: 'Todavía estoy en forma,\n¿no te parece? ¡Ja, ja, ja, ja!\n\nAcepto la revancha cuando quieras.\n¡Cuídate! ¡Adiós!',
    en: "I've still got it,\ndon't you think? Ha ha ha ha!\n\nI'll take a rematch anytime.\nTake care! Bye!",
  },
  '129CC': DECKS03.ventisca,
  '12BA4': acero.ask,
  '12C34': aceroNo,
  '12CA4': { es: '¡Bien! ¡Que empiece la fiesta!', en: "All right! Let's get this party started!" },
  '12D50': {
    es: `${aceroLostTo.es}\n\nPero tu próximo rival es distinto.\n\nHasta tú vas a tener que usar\ntodo lo que tienes para ganar...\n\n¡Suerte!`,
    en: `${aceroLostTo.en}\n\nBut your next opponent is different.\n\nEven you will have to use\neverything you've got to win...\n\nGood luck!`,
  },
  '12F14': aceroLesson,
  '1303C': DECKS03.acero,
  '1319C': {
    es: 'Por fin llegas...\nNo hace falta que te presentes.\n\nSoy Acero Negro.\n\nDos jugadores de cartas solo tienen\nuna forma de entenderse.\n\nEs la hora de la batalla. ¡Ven!',
    en: "At last, you're here...\nNo need to introduce yourself.\n\nI am Black Steel.\n\nTwo card players have only one way\nto understand each other.\n\nIt's time for battle. Come at me!",
  },
  '13400': aceroNegro.ask,
  '134AC': aceroNegro.no,
  '1352C': aceroNegro.go,
  '135D0': {
    es: 'Ya veo... Así juegas, ¿eh?\nAhora lo sé.\n\nLo más importante es entenderse\na través de la batalla.\n\nNo lo olvides.\n\nQuien solo piensa en ganar\nsolo encuentra la derrota.\n\nNos volveremos a ver\nen el Café de batallas.',
    en: "I see... So that's how you play.\nNow I know.\n\nWhat matters most is understanding\neach other through battle.\n\nDon't forget it.\n\nThose who think only of winning\nfind only defeat.\n\nWe shall meet again\nat the Battle Cafe.",
  },
  '139BC': aceroNegro.won,
  '13C14': DECKS03.aceroNegro,

  // the Extra Arena: Gema, Coraza, Barreno
  '13DB4': { who: null, es: 'La Arena Extra está cerrada por ahora.\nVuelve más tarde.', en: 'The Extra Arena is closed for now.\nPlease come back later.' },
  '13F94': {
    es: '¡Ey! ¡Aquí estás! Soy Gema.\n\n¡Ey! En esta Arena voy a pelear contigo\ncon cada una de mis formas.\n\n¡Ey! Si no te lo tomas en serio,\nte va a ir muy mal.\n\n¡Yo voy muy en serio! ¡Ey!',
    en: "Yo! There you are! I'm Gema.\n\nYo! In this Arena, I'll fight you\nwith every shape I've got.\n\nYo! If you don't take this seriously,\nyou'll get hurt!\n\nI'm dead serious! Yo!",
  },
  '141F4': gemaAsk,
  '14288': { es: '¿Qué? ¡Ey! ¿Qué?', en: 'What? Yo! What?' },
  '142F4': { es: '¡Bien! ¡Empecemos! ¡Ey!', en: "All right! Let's begin. Yo!" },
  '14398': {
    es: '¡Rayos! ¡Perdí!\n¡Qué fuerza tienes!\n\n¡Ey! Bien. Voy a evolucionar.\nAhora seré Coraza. ¡No será tan fácil!\n\n¡A ver qué haces ahora!',
    en: "Rats! I lost!\nYou're really strong!\n\nYo! OK. I'm gonna evolve.\nNow I'll be Coraza. Not so easy now!\n\nLet's see what you can do!",
  },
  '144F4': {
    es: `${gema.won.es}\n\n¡Soy demasiado fuerte para ti!\n\nVuelve cuando tengas mucha más fuerza.\n\n¡Ey! Nos vemos.`,
    en: `${gema.won.en}\n\nMan, I'm way too strong for you!\n\nGet a lot stronger before\nyou show your face here again!\n\nYo! See you around.`,
  },
  '146A8': DECKS03.gema,
  '147D0': {
    es: 'Evolucioné. ¡Ahora me llamo Coraza!\n\n¡Mi cabeza dura rompe lo que sea!\nTen mucho cuidado. ¡Ey!\n\n¡Vamos! ¡Ey! ¡Pégame! ¡Ey!',
    en: "I evolved. Now my name is Coraza!\n\nMy hard head can smash anything!\nYou'd better watch out. Yo!\n\nCome on! Yo! Hit me! Yo!",
  },
  '1499C': coraza.ask,
  '14A2C': coraza.no,
  '14ABC': { es: '¡Ey! ¡Vamos a darle duro!', en: "Yo! Let's hit it hard!" },
  '14B64': {
    es: '¡Rayos! ¡Perdí!\n¡Ey! ¡Qué fuerza tienes, en serio!\n\nAhora sí. ¡Ey! Con mi huevo del Saber\nvoy a evolucionar a Barreno.\n\n¡Esta vez gano seguro!\n¡Vamos, vamos! ¡Ey! ¡Pégame! ¡Ey!',
    en: "Rats! I lost!\nYo! You're seriously strong!\n\nThis is it. Yo! With my Egg of Knowledge\nI'll evolve into Barreno.\n\nThis time I'm winning for sure!\nCome on, come on! Yo! Hit me! Yo!",
  },
  '14D00': {
    es: '¡Ey, ey! ¡Gané! ¡Ey!\n¿Qué pasó? ¡Te falta fuerza!\n\nMi cabezazo de roca es invencible.\n¡Ey! ¿Quién es el mejor?\n\nVuelve cuando tengas mucha más fuerza.\n\n¡Adiós! ¡Ey!',
    en: "Yo yo! I won! Yo!\nWhat happened? You're so weak!\n\nMy rock-hard headbutt is unbeatable.\nYo! Who's the best?\n\nGet a lot stronger before\nyou show your face here again.\n\nLater! Yo!",
  },
  '14EC8': DECKS03.coraza,
  '15018': {
    es: '¡Ey, ey, ey! ¡Llegó la hora del huevo!\n¡Soy el gran Barreno!\n\n¡Voy a perforar tu mazo!\nNo tienes escapatoria.\n\nPrepárate para perder. ¡Ey!',
    en: "Yo yo yo! It's egg time!\nI'm the mighty Barreno!\n\nI'm gonna drill right through your deck!\nThere's no escape.\n\nGet ready to lose. Yo!",
  },
  '151FC': { es: '¡Ey! ¿Empezamos? ¡Ey!', en: 'Yo! Shall we start? Yo!' },
  '1528C': barreno.no,
  '1531C': barreno.go,
  '153C0': {
    es: `¡Rayos! ¡Perdí otra vez!\nNo soy rival para ti.\n\n${giveUp.es}\n\n${finalInvite.es}`,
    en: `Rats! I lost again!\nI'm no match for you.\n\n${giveUp.en}\n\n${finalInvite.en}`,
  },
  '1575C': barrenoWon('en mi forma Armadura.', 'in my Armored shape.'),
  '158C8': DECKS03.barreno,

  // the Extra Arena again: Coraza, Barreno, Calado
  '15C18': coraza.ask,
  '15CA8': coraza.no,
  '15D34': { es: '¡Ey! ¡A darle!', en: "Yo! Let's get going!" },
  '15DD4': {
    es: '¡Ey! ¡Perdí otra vez!\n¡Qué fuerza tienes, en serio!\n\n¡Ey! Con mi huevo del Saber\nvolveré a ser Barreno.\n\nNo pierdo tan fácil. ¡Ey!\n¡A ver qué haces!',
    en: "Yo! I lost again!\nYou're seriously strong!\n\nYo! With my Egg of Knowledge\nI'll become Barreno again!\n\nI don't lose that easy. Yo!\nLet's see what you can do!",
  },
  '15F64': corazaWon,
  '16130': DECKS03.coraza,
  '16308': { es: '¡Ey! ¡Vamos! ¡Ey!', en: "Yo! Let's get going! Yo!" },
  '1639C': barreno.no,
  '1642C': barreno.go,
  '164D0': barrenoToCalado('¡Ey! ¡Perdí otra vez!\n¡Eres demasiado fuerte para mí!', "Yo! I lost again!\nYou're too strong for me!"),
  '16694': barrenoWon('en esta forma Armadura.', 'in this Armored shape.'),
  '16804': DECKS03.barreno,
  '16930': caladoIntro,
  '16AE8': calado.ask,
  '16B80': calado.no,
  '16C04': calado.go,
  '16CB0': {
    es: `¡Rayos! ¡Perdí otra vez!\n\n${nobodyCan.es}\n\n${giveUp.es}\n\n${finalInvite.es}`,
    en: `Darn! I lost again!\n\n${nobodyCan.en}\n\n${giveUp.en}\n\n${finalInvite.en}`,
  },
  '170A0': calado.won,
  '17218': DECKS03.calado,

  // the Extra Arena a third time: Barreno, Calado, Ánfora
  '1755C': { es: '¡Ey! ¡Empecemos! ¡Ey!', en: "Yo! Let's start! Yo!" },
  '175E8': barreno.no,
  '17678': { es: '¡Ey! ¡Esta vez no pierdo!', en: "Yo! I won't lose this time!" },
  '17718': barrenoToCalado('¡No puede ser! ¡Perdí otra vez!\n¡Eres demasiado fuerte para mí!', "No way! I lost again!\nYou're too strong for me!"),
  '178D8': barrenoWon('en mi forma Armadura.', 'in my Armored shape.'),
  '17A44': DECKS03.barreno,
  '17BF8': calado.ask,
  '17C90': calado.no,
  '17D14': calado.go,
  '17DC0': {
    es: `¡Ey! ¡Perdí otra vez!\n\n${nobodyCan.es}\n\nPero todavía puedo evolucionar. ¡Ey!\nY esa forma es fortísima. ¡Ey!\n\n¡Estoy listo! ¡Ey! ¡Vamos! ¡Pégame!`,
    en: `Yo! I lost again!\n\n${nobodyCan.en}\n\nBut I can still evolve again. Yo!\nAnd that shape is super strong. Yo!\n\nI'm ready. Yo! Come on. Hit me!`,
  },
  '17F64': calado.won,
  '180C8': DECKS03.calado,
  '181E8': anforaIntro,
  '183B0': anfora.ask,
  '18450': anfora.no,
  '184CC': anfora.go,
  '185A4': {
    es: `¿Qué? ¡Perdí otra vez!\n¡Ey! ¡Ya no me pegues más!\n\n${nobodyCan.es}\n\nUn día de estos alcanzaré mi forma\nmás alta, ¡y te aplastaré! ¡Ey!\n\n¡Ey! ¡Nos vemos! ¡Ey!`,
    en: `What? I lost again!\nYo! Don't hit me anymore!\n\n${nobodyCan.en}\n\nOne of these days I'll reach my highest\nshape and crush you! Yo!\n\nYo! See you later! Yo!`,
  },
  '1891C': anfora.won,
  '18A94': DECKS03.anfora,

  // the Extra Arena a fourth time: Calado, Ánfora, and Fiordo, its highest shape
  '18E0C': calado.ask,
  '18EA4': calado.no,
  '18F28': calado.go,
  '18FD4': {
    es: '¡No puede ser! ¡Perdí otra vez!\n\n¡Ey, ey! ¡La próxima peleo contigo\ncomo Perfecto!\n\n¡Estoy listo! ¡Ey! ¡Vamos! ¡Pégame!',
    en: "No way! I lost again!\n\nYo yo! Next time I'll fight you\nas an Apex!\n\nI'm ready. Yo! Come on. Hit me!",
  },
  '1910C': calado.won,
  '19274': DECKS03.calado,
  '1941C': anfora.ask,
  '194C0': anfora.no,
  '1953C': anfora.go,
  '19614': {
    es: '¡Nooo! ¡No aguanto más! ¡Ey!\n¡Llegó tu hora!\n\n¡Ey! Perdón por la espera.\n¡Por fin alcanzo mi forma más alta!\n\nNo respondo por tu seguridad. ¡Ey!\nSi quieres huir, ¡huye ahora!',
    en: "Nooo! I can't take it anymore! Yo!\nYour time has come!\n\nYo! Sorry for the wait.\nAt last I reach my highest shape!\n\nI can't promise you'll be safe. Yo!\nIf you want to run, run now!",
  },
  '197B0': anfora.won,
  '19928': DECKS03.anfora,
  '19A74': {
    es: '¡Hola! Por fin alcancé mi forma\nmás alta: ahora me llamo Fiordo.\n¡Soy el maestro de esta Arena!\n\n¡Felicitaciones por llegar\nhasta aquí!\n\nPuedes desafiarme si quieres...\npero no tendrás ninguna oportunidad.',
    en: "Hello! At last I've reached my highest\nshape: my name is now Fiordo.\nI'm the master of this Arena!\n\nCongratulations on making it\nall the way here!\n\nYou're free to challenge me...\nbut you won't stand a chance.",
  },
  '19C78': fiordo.ask,
  '19D10': fiordo.no,
  '19DA4': fiordo.go,
  '19E44': {
    es: '¡Basta, basta! ¡Ganaste, ganaste!\nMe rindo. Haz lo que quieras.\n\nNunca conocí a nadie\nque jugara tan bien como tú.\n\nTendré que entrenar mucho más\npara llegar a tu nivel.\n\nAsí que vuelve a jugar conmigo.\nTe espero en el Café de batallas.\n\nNos vemos.',
    en: "OK, OK! You win, you win!\nI give up. Do whatever.\n\nI've never met anyone\nwho plays as well as you.\n\nI'll have to train much harder\nto reach your level.\n\nSo come and play me again.\nI'll be waiting at the Battle Cafe.\n\nSee you later.",
  },
  '1A228': fiordo.won,
  '1A3D4': DECKS03.fiordo,
};
