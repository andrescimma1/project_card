/**
 * Bosque Hondo, later phases. Trino hosts the Extra Arena, where every shape he reaches takes a new name
 * (Trino, Aquilino, Vendaval, Molinete, Céfiro, and at the top Brunilda); Coloso, a huge beetle, opens the
 * Beetle Arena with Tenaza and Sigilo; Mina, a bored traveller, and Azucena, who was Espina, play at the
 * café.
 */
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });
const tenazaDeck = deck(
  '*c3Mazo Choque de Frente\nUn mazo Verde muy ofensivo, con cartas\nde Apoyo de ataque muy arriesgadas.',
  '*c3Head-On Deck\nA very offensive Green deck with\nrisky attack Support cards.',
);
const colosoDeck = deck('*c3Mazo Cuernos Cruzados\nUn mazo lleno de insectos poderosos.', '*c3Crossed Horns Deck\nA deck full of powerful insects.');
const trinoDeck = deck('*c3Mazo Pluma Veloz\n¿Te llevará este mazo a la victoria?', '*c3Swift Feather Deck\nWill this deck lead you to victory?');
const aquilinoDeck = deck(
  '*c3Mazo Ojo de Tormenta\nUn mazo de Primer golpe que aprovecha\nlas criaturas Rojas y Verdes.',
  '*c3Eye of the Storm Deck\nA First strike deck that makes good\nuse of Red and Green creatures.',
);
const vendavalDeck = deck('*c3Mazo Amor Ardiente\nSu fuerte es recuperar HP\ny adivinar tus ataques.', '*c3Burning Love Deck\nIts strengths are recovering HP\nand guessing your attacks.');
const molineteDeck = deck('*c3Mazo Aspa Silenciosa\nUn mazo veloz de las facciones\nRara y Verde.', '*c3Silent Blade Deck\nA fast deck of the Rare\nand Green factions.');
const cefiroDeck = deck('*c3Mazo Jinete del Viento\nUn mazo Verde de gran defensa,\ncon Apoyo que anula ataques.', '*c3Wind Rider Deck\nA Green deck with great defense\nand Support that nullifies attacks.');
const brunildaDeck = deck('*c3Mazo Escudo de Honor\nUn mazo Verde que pelea limpio.', '*c3Shield of Honor Deck\nA Green deck that fights fair.');
const azucenaDeck = deck(
  '*c3Mazo Hadas del Prado\nSin cartas de Apoyo: todo Verde.\n¡Junta PE muy rápido!',
  '*c3Meadow Sprites Deck\nNo Support cards, all Green.\nIt gathers EP very quickly!',
);
const minaDeck = deck('*c3Mazo Princesa\n24 criaturas llenas de energía\nprotegen a la princesa.', '*c3Princess Deck\n24 lively creatures\nprotect the princess.');
const sigiloDeck = deck('*c3Mazo Relevo\nCambia rápido entre Novatos\ny Campeones.', '*c3Relay Deck\nSwitches quickly between\nNovices and Veterans.');

// Tenaza, a stag beetle with a nose for business, who calls everyone "superstar"
const tenazaWon = {
  es: '¡Ay, ay, ay! ¡Así no!\n¡Así no me vas a ganar!\n\nMejor vuelve cuando\nhayas entrenado más.',
  en: "Oh my, my! That's no good!\nYou can't beat me like that!\n\nYou'd better come back\nafter more training.",
};

// Coloso, a huge, honorable beetle
const coloso = {
  why: { es: '¿Entonces a qué viniste?', en: 'Then what did you come here for?' },
  go: { es: '¡Así pelean los insectos!', en: 'This is how insects fight!' },
};

// Trino and his shapes
const trino = {
  ask: { es: 'Cuando gustes. ¿Empezamos?', en: 'Whenever you like. Shall we begin?' },
  wonStart: 'Parece que gané.\n\nSi no puedes ni conmigo, tu futuro\nno pinta muy bien...',
  wonStartEn: "It looks like I won.\n\nIf you can't even beat me, your future\ndoesn't look too bright...",
};
const aquilinoWon = {
  es: 'Lo hiciste bien.\n\nAcepto tu desafío cuando quieras.\nNo te preocupes tanto si pierdes.\n\nLos nervios no ayudan\nen una batalla.\n\nTómalo con calma.',
  en: "You did well.\n\nI'll accept your challenge anytime.\nDon't worry too much if you lose.\n\nNerves don't help\nin a battle.\n\nTake it easy.",
};
const vendaval = {
  quit: { es: 'Si no te sientes con ánimo,\npuedes dejarlo.', en: "If you're not up to it,\nyou can quit." },
  go: { es: 'Te mostraré mi amor ardiente.', en: "I'll show you my burning love." },
  lost: {
    es: '¡Increíble! ¡Simplemente increíble!\nTienes verdadero talento.\n\nAlgún día nos volveremos a ver\ny te venceré con mi nuevo poder.\n\nEspera ese día.',
    en: "Incredible! Simply incredible!\nYou have true talent.\n\nSomeday we'll meet again and I'll\ndefeat you with my new power.\n\nWait for that day.",
  },
  won: {
    es: '...\n\nFue una batalla difícil.\nTuve suerte de ganar esta vez.\n\nTienes que volver a desafiarme.\n\nAsí veremos quién gana de verdad.\nTe estaré esperando.',
    en: "...\n\nThat was a tough match.\nI was lucky to win this time.\n\nYou must come challenge me again.\n\nThen we'll see who the real winner is.\nI'll be waiting for you.",
  },
  wonAgain: {
    es: '...\n\nFue una batalla difícil.\nTuve suerte de ganar esta vez.\n\nEsta no es nuestra última batalla.\nVuelve a desafiarme.\n\nAsí veremos quién gana de verdad.\nTe estaré esperando.',
    en: "...\n\nThat was a tough match.\nI was lucky to win this time.\n\nThis isn't our final match.\nCome and challenge me again.\n\nThen we'll see who the real winner is.\nI'll be waiting for you.",
  },
};
const molinete = {
  ask: { es: '¿Aguantarás el castigo\nde mis estrellas de acero?', en: 'Can you take the punishment\nof my steel stars?' },
  no: { es: 'Bueno, entiendo tu decisión...', en: 'Well, I understand your decision...' },
  won: {
    es: 'Estuvo muy reñido...\nTienes mucha fuerza.\n\nCon un poco más de suerte,\npodrías haberme vencido.\n\nVuelve a esta Arena cuando quieras.\nTe enfrentaré siempre.\n\nNos volveremos a ver. ¡Adiós!',
    en: "That was so close...\nYour power is strong.\n\nWith a little more luck,\nyou could have beaten me.\n\nCome back to this Arena anytime.\nI'll take you on every time.\n\nWe shall meet again. Goodbye!",
  },
};
const molineteGo = (es: string, en: string) => ({ es: `Veo que no aprecias mucho tu pellejo...\nBien. ${es}`, en: `You don't value your hide much...\nFine. ${en}` });
const molineteNext = (es: string, en: string) => ({
  es: `Mis estrellas...\n\n${es}\n\nPero no pienso volver a perder.\n\nAlcanzaré mi forma siguiente\ny te venceré. ¡Ten cuidado!`,
  en: `My steel stars...\n\n${en}\n\nBut I don't intend to lose again.\n\nI'll reach my next shape\nand beat you. Watch out!`,
});
const cefiro = {
  ask: { es: 'Nos espera un gran destino.\n¿Empezamos?', en: 'A great destiny awaits us.\nShall we begin?' },
  no: { es: 'Cuando te pierdas... mira el cielo.\nAllí verás el camino...', en: "When you get lost... look at the sky.\nYou'll see the way..." },
  go: { es: '¡A volar!', en: "Let's soar!" },
  lostStart: 'Me venciste en mi forma Perfecta...\nTu habilidad con las cartas\nes increíble.',
  lostStartEn: 'You defeated me in my Apex shape...\nYour card skills are incredible.',
  next: '\n\nAhora que perdí, debo alcanzar\nmi forma siguiente.',
  nextEn: "\n\nNow that I've lost, I must reach\nmy next shape.",
};
const cefiroWon = (es: string, en: string) => ({
  es: `Parece que mi ataque en picada\nfue demasiado para ti.\n\nNo te sientas mal. Nunca debiste\ndesafiarme en mi forma Perfecta.\n\nPero en tus ojos veo\nque no te rendiste.\n\nBien. Aceptaré tus desafíos\nhasta que decidas rendirte.\n\n${es}`,
  en: `Looks like my dive attack\nwas too much for you.\n\nDon't feel bad. You should never have\nchallenged me in my Apex shape.\n\nBut I can see in your eyes\nthat you haven't given up.\n\nFine. I'll accept your challenges\nuntil you decide to give up.\n\n${en}`,
});
const brunilda = {
  ask: { es: '¿Lo pensaste bien...?', en: 'Have you thought this through...?' },
  no: { es: 'Haces bien en pensarlo.\nEn batalla no hay vuelta atrás...', en: "Wise to think it over.\nIn battle, there's no turning back..." },
  go: { es: '¡Comienza la batalla!', en: 'The battle has begun!' },
  won: {
    es: 'Respeto tu valor al desafiarme\nen mi forma más alta.\n\nPero todavía te falta fuerza.\n\nDeberías saber que tus trucos\nno funcionan conmigo.\n\nSi quieres vencerme, golpea de frente\ny con todo tu poder.\n\nEsperaré tu próximo desafío.',
    en: "I respect your fighting spirit\nin challenging my highest shape.\n\nBut you're still not tough enough!\n\nYou should know your little tricks\nwon't work on me.\n\nIf you want to defeat me, hit me\nhead-on with all your power!\n\nI'll wait for your next challenge.",
  },
};

// Azucena, who was Espina, and Mina, the traveller she can't stop pestering
const azucenaEnd = {
  es: 'Ah, no te preocupes por nosotras.\nSiempre somos así.\n\nMe divertí mucho.\nJuega con Mina también, ¿sí?\n\nMina es un poco perezosa,\npero es muy fuerte.\n\n¡Nos vemos!',
  en: "Oh, don't worry about us.\nWe're always like this.\n\nI had a lot of fun.\nPlease play with Mina, too.\n\nMina is a bit lazy,\nbut she's pretty strong.\n\nSee you later!",
};

const CAFE: CityTexts = {
  // Tenaza
  '5114': { es: '¡Oye, estrella! ¡Qué manera de jugar!\n¡Me dejaste con la boca abierta!', en: "Hey, superstar! What a player!\nI'm so impressed!" },
  '519C': { es: '¿Y bien? ¿Echamos una partida?', en: 'Well? Want to play a round?' },
  '5238': { es: '¿Qué pasa? ¡No me digas que\nte vas a echar para atrás!', en: "What's wrong? Don't tell me\nyou're backing out now!" },
  '52D0': { es: '¡A ver de qué eres capaz!', en: "Let's see what you've got!" },
  '5374': {
    es: '¡Ay, ay, ay! Perdí.\n¡Estrella, eres una joya!\n\nOye, ¿no quieres que montemos\nun negocio juntos?\n\n¡Con tu talento nos haríamos ricos!\n¿Qué me dices?',
    en: "Oh my, my! I lost.\nSuperstar, you're a gem!\n\nHey, don't you want to start\na business with me?\n\nWith your talent, we'd make a fortune!\nWhat do you say?",
  },
  '54E8': tenazaWon,
  '55F8': tenazaDeck,

  // Coloso
  '56D0': { es: 'Me llamo Coloso.', en: 'My name is Coloso.' },
  '5744': { who: 'me', es: '¡Hola, soy *h0!', en: "Hi, I'm *h0!" },
  '5794': { es: '¿Tú también juegas a las cartas?', en: 'Do you play cards, too?' },
  '5804': {
    es: 'Pienso abrir la Arena del Escarabajo\naquí en el bosque.\n\nSi te animas, ven a inscribirte.',
    en: "I'm planning to open the Beetle Arena\nhere in the forest.\n\nIf you're up for it, come and sign up.",
  },
  '590C': { who: null, es: '*c6¡La Arena del Escarabajo está abierta!\n*c6¡Que pasen los valientes!', en: '*c6The Beetle Arena is now open!\n*c6Those who are ready, come on in!' },
  '5AE4': { es: 'Ven a la Arena del Escarabajo.\n¡No te olvides!', en: "Come to the Beetle Arena.\nDon't forget!" },
  '5B64': {
    es: 'Acepto el desafío de cualquiera,\nsea quien sea.\n\n¡Los insectos del bosque estamos\norgullosos de eso!',
    en: 'I accept a challenge from anyone,\nwhoever they are.\n\nWe forest insects take pride in that!',
  },
  '5C64': { es: '¿Medimos fuerzas?', en: 'Shall we test our strength?' },
  '5CF4': coloso.why,
  '5D70': coloso.go,
  '5E20': {
    es: 'Juegas muy bien... Tal como pensaba.\nNo me importa quién gane.\n\nPero tengo que saber quién\nes el más fuerte. Vuelve por\nla revancha, ¿sí?\n\nEn la Arena o en el Café,\nquiero volver a jugar contigo.',
    en: "You're very good... Just as I thought.\nI don't mind who wins.\n\nBut I must find out who's\nthe strongest. Come back\nfor a rematch, OK?\n\nAt the Arena or the Cafe,\nI want to battle you again.",
  },
  '6108': {
    es: 'Esto sí es una batalla de verdad.\n\nPero no creo que sea la última\nvez que juguemos.\n\nEn la Arena o en el Café,\nquiero volver a jugar contigo.',
    en: "This is what a real battle is all about.\n\nBut I don't think this will be\nthe last time we play.\n\nAt the Arena or the Cafe,\nI want to battle you again.",
  },
  '6290': colosoDeck,

  // Trino, a polite bird who hosts the Extra Arena
  '6358': { es: 'Permíteme presentarme.\nMe llamo Trino.', en: 'Allow me to introduce myself.\nMy name is Trino.' },
  '63DC': { who: 'me', es: '¡Hola, soy *h0!', en: "Hi, I'm *h0!" },
  '642C': { es: 'En este momento organizo una Arena\naquí en el bosque: la Arena Extra.', en: "Right now, I'm hosting an Arena\nhere in the forest: the Extra Arena." },
  '64C0': { who: 'me', es: '¿Eh...?', en: 'Huh...?' },
  '650C': { es: 'Si gustas, ¡entra a mi Arena!\nTe aseguro que no te arrepentirás.', en: "If you like, please enter my Arena!\nI promise you won't regret it!" },
  '65A8': { who: null, es: '*c6¡La Arena Extra está abierta!\n*c6¡Que pasen los valientes!', en: '*c6The Extra Arena is now open!\n*c6Those who are ready, come on in!' },
  '6800': { es: 'Si gustas, ¡entra a mi Arena!\nTe aseguro que no te arrepentirás.', en: "If you like, please enter my Arena!\nI promise you won't regret it!" },
  '68A0': {
    es: 'Si crees que me venciste...\nJa, ja, ja...\n\nTodavía guardo mucha fuerza.\n\nVolveré a desafiarte cuando\nalcance una forma nueva.\n\nAh, casi lo olvido...\nTe contaré un secreto sobre la fusión.\n\nPara crear una carta Azul, fusiona\nVerde con Sombría, Roja con Rara,\no Azul con una carta de Apoyo.\n\n¡Con esas mezclas obtienes\nuna carta Azul!',
    en: "If you think you've beaten me...\nHa ha ha...\n\nI still have plenty of power\nhidden inside me.\n\nI'll challenge you again once\nI reach a new shape.\n\nOh, I almost forgot...\nLet me tell you a secret about fusion.\n\nTo create a Blue card, fuse\nGreen with Shadow, Red with Rare,\nor Blue with a Support card.\n\nThose mixes will get you\na Blue card!",
  },
  '6B60': trino.ask,
  '6BE8': { es: 'Perdón.\nNo quise apurarte.', en: "I'm sorry.\nI didn't mean to rush you." },
  '6C70': { es: '¡Vamos allá!', en: "Let's go for it!" },
  '6D04': {
    es: '¡Increíble! Me ganaste sin rodeos.\nPero fue suerte de principiante...\n\nLa próxima no será tan fácil.\n¡No pienso volver a perder!',
    en: "Incredible! You beat me outright.\nBut that was just beginner's luck...\n\nOur next battle won't be this easy.\nI don't intend to lose again!",
  },
  '6E20': {
    es: trino.wonStart + '\n\nSi tienes suerte, nos volveremos\na ver aquí. Desafíame entonces.',
    en: trino.wonStartEn + "\n\nIf you're lucky, we'll meet here\nagain. You can challenge me then.",
  },
  '6F74': trinoDeck,

  // Aquilino, Trino's next shape
  '7104': { es: '¿Vienes a desafiarme?\n¿Lo dices en serio?', en: 'You want to challenge me?\nAre you serious?' },
  '716C': { es: 'Espero que vengas con todo.\n¿Empezamos?', en: 'I hope you came prepared.\nShall we?' },
  '7208': { es: '¿Qué...? ¿Qué pasa?\n\nNo... Es broma, ¿verdad?\nJa, ja, ja, ja...', en: "What...? What's wrong?\n\nNo... You're joking, right?\nHa ha ha ha..." },
  '72DC': { es: 'Después no te arrepientas.', en: "Don't regret this later." },
  '7370': {
    es: 'No... ¿Cómo pude perder contigo\notra vez? Mmm... Veo que vas en serio.\n\n¡No acepto la derrota!\nSe acabaron los juegos.\n\nLa próxima conocerás mi furia.\nY no, no es una excusa.\n\n¡Espera a que nos volvamos a ver!\nJa, ja, ja, ja...',
    en: "No... How could I lose to you again?\nHmm... I guess you're serious.\n\nI won't accept defeat!\nNo more playing around.\n\nNext time, you'll face my fury.\nAnd no, this isn't an excuse.\n\nJust wait until we meet again!\nHa ha ha ha...",
  },
  '7558': {
    es: 'Diría que lo hiciste bastante bien.\n\nAcepto tu desafío cuando quieras,\npero no llores si pierdes.\n\nLlorar solo te hace perder batallas\nque podrías ganar.\n\nTómalo con calma.',
    en: "I'd say you did pretty well.\n\nI'll accept your challenge anytime,\nbut don't go crying if you lose.\n\nCrying only makes you lose battles\nyou could have won.\n\nTake it easy.",
  },
  '76F4': aquilinoDeck,

  // Vendaval, who fights for love
  '78B8': {
    es: 'Si quieres ser fuerte, tienes que\nconocer el significado del amor.\n\n¿Hay amor en tu corazón?',
    en: 'If you want to become strong, you\nneed to know the meaning of love.\n\nIs there love in your heart?',
  },
  '79A4': { es: '¿Bailamos este tango...?', en: 'Shall we dance this tango...?' },
  '7A30': vendaval.quit,
  '7AAC': vendaval.go,
  '7B54': vendaval.lost,
  '7DD0': vendaval.won,
  '7F5C': vendavalDeck,

  // Molinete, a ninja with steel stars
  '80F8': { es: 'Tienes mucho potencial...\n¡Entrena conmigo y te haré ninja!', en: 'You have great potential...\nTrain with me and become a ninja!' },
  '8198': molinete.ask,
  '8254': molinete.no,
  '82D0': molineteGo('¡Empecemos!', "Let's begin!"),
  '8398': {
    es: 'Mis estrellas...\n\nEsta batalla fue increíble.\nTe agradezco la lección.\n\nPero no pienso volver a perder.\n\nTe venceré cuando volvamos a vernos.\n¡No te vayas a ninguna parte!',
    en: "My steel stars...\n\nThis battle was incredible.\nThank you for the lesson.\n\nBut I don't intend to lose again.\n\nI'll defeat you when we meet again.\nDon't go anywhere!",
  },
  '8658': {
    es: 'Estuvo muy reñido...\nTienes mucha fuerza.\n\nCon un poco más de suerte,\npodrías haberme vencido.\n\nVuelve a este Café cuando quieras.\nTe enfrentaré siempre.',
    en: "That was so close...\nYour power is strong.\n\nWith a little more luck,\nyou could have beaten me.\n\nCome back to this Cafe anytime.\nI'll take you on every time.",
  },
  '87D4': molineteDeck,

  // Céfiro, master of the sky
  '8964': { es: '¿Qué imaginas cuando miras\nel cielo inmenso?', en: 'What do you imagine when you look\nup at the great big sky?' },
  '8A00': cefiro.ask,
  '8ABC': cefiro.no,
  '8B5C': cefiro.go,
  '8BF0': {
    es: cefiro.lostStart + '\n\nPero esto no termina aquí...\nPrepárate para la próxima batalla.\n\nTe espero en este Café.',
    en: cefiro.lostStartEn + "\n\nBut this isn't the end...\nPrepare for the next battle.\n\nI'll wait for you at this Cafe.",
  },
  '8E88': cefiroWon('Espero la revancha.', 'I look forward to a rematch.'),
  '90E0': cefiroDeck,

  // Brunilda, the warrior princess
  '927C': {
    es: 'Me enorgullece ser guerrera.\nEs mi papel en la vida.\n\nTe daré un consejo.\n\nSi consigues 7 bonos o más en una\nsola batalla, ¡ganas un bono extra!\n\nDeberías intentarlo...\n¿Podrás conseguir ese bono extra?',
    en: 'I am proud to be a warrior.\nIt is my role in life.\n\nLet me give you some advice.\n\nIf you earn 7 or more bonuses in a\nsingle battle, you get an extra bonus!\n\nYou should try for that...\nCan you get that extra bonus?',
  },
  '9440': brunilda.ask,
  '94CC': brunilda.no,
  '9564': brunilda.go,
  '9600': {
    es: 'Nunca olvidaré esta batalla.\nHoy es tu día.\n\nPero recuerda: si dejas de entrenar,\nte derrotarán.\n\nNuestra batalla apenas comienza.\n\nTienes que enfrentarme cuando\nnos veamos en este Café.\n\nNos volveremos a ver. ¡Adiós!',
    en: "I will never forget this battle.\nToday is your day.\n\nBut remember, you'll be defeated\nonce you stop training.\n\nOur battle is just beginning.\n\nYou must battle me when\nwe meet at this Cafe.\n\nWe shall meet again. Goodbye!",
  },
  '9948': brunilda.won,
  '9B84': brunildaDeck,

  // Azucena
  '9C28': { es: 'Hola, soy Azucena.\nAntes era Espina.', en: "Hi, I'm Azucena.\nI used to be Espina." },
  '9CAC': { who: 'me', es: '¡Hola! ¡Cuánto tiempo!', en: 'Hi! Long time no see!' },
  '9D04': { es: '¡Desafíame! No me vas a ganar\ntan fácil como a Espina.', en: "Come challenge me! I won't go down\nas easily as Espina did." },
  '9EB8': { es: '¡Mina, tienes que jugar conmigo!\n¿Sí? ¿Sí? ¡Por favor!', en: 'Mina, you have to play with me!\nPlease? Please? Pretty please?' },
  '9F60': { es: '¿Jugamos una partida?', en: 'Want to play a match?' },
  '9FF4': { es: '¿Por qué? ¿Por qué? ¿Por qué?\n¿Por qué nadie quiere jugar conmigo?', en: "Why? Why? Why?\nWhy won't anyone play with me?" },
  'A088': { es: '¡Mírame, Mina!\n¡Voy a ganar por ti!', en: "Watch me, Mina!\nI'll win for you!" },
  'A13C': {
    es: '¡Ay, perdí! Fue tu culpa, Mina.\n¡Perdí porque no me mirabas!\n\n' + azucenaEnd.es,
    en: "Oh no, I lost! It's your fault, Mina.\nI lost because you weren't watching!\n\n" + azucenaEnd.en,
  },
  'A518': { es: '¡Bien! ¡Gané!\nMina, ¿viste?\n\n' + azucenaEnd.es, en: 'Great! I won!\nMina, did you see that?\n\n' + azucenaEnd.en },
  'A728': azucenaDeck,

  // Mina, a traveller who would rather be home
  'A810': { es: 'Soy Mina. ¿Y tú quién eres?', en: "I'm Mina. Who are you?" },
  'A870': { who: 'me', es: 'Hola, me llamo *h0.', en: 'Hi, my name is *h0.' },
  'A8C8': { es: '¿Y qué haces en un lugar como este?', en: 'So, what are you doing\nin a place like this?' },
  'A938': { who: 'me', es: 'Pues... jugar a las cartas, claro.', en: 'Well, card battles, of course.' },
  'A99C': {
    es: '¿Cartas? Yo también juego...\n¡Pero es tan aburrido!\n\nAzucena siempre me pide que juegue\ncon ella. Yo solo quiero volver a casa.\n\nAzucena me habló de ti. No para\nde insistir en que juegue contigo.\n\nMe da pereza, pero...\n¿quieres jugar?',
    en: "Cards? I play too...\nBut it's sooo boring!\n\nAzucena keeps asking me to play\nwith her. I just want to go home.\n\nAzucena told me about you. She keeps\nnagging me to play with you.\n\nI hate to ask, but...\ndo you want to play?",
  },
  'AC80': { es: '¡Ay! ¡Qué aburrimiento!\n\n¡Quiero volver a casa!', en: "Ugh! This is sooo boring!\n\nI just want to go home!" },
  'AD2C': { es: 'Qué fastidio, pero...\n¿quieres jugar contra mí?', en: 'This is such a pain, but...\ndo you want to battle me?' },
  'ADE8': { es: '¿Qué? ¿Cómo te atreves\na decirme que no?', en: 'What? How dare you\nsay no to me!' },
  'AE5C': { es: 'Está bien, está bien. Juguemos.', en: "Alright, alright. Let's do it." },
  'AF00': {
    es: '¡Perdí! ¡Qué ridículo!\n\n¡Oye, tú! ¡Tienes que darme\notra oportunidad! ¡No soporto perder!\n\n¡Azucena! ¡Tenemos que entrenar!\n¡La próxima le gano sí o sí!',
    en: "I lost! This is so embarrassing!\n\nHey, you! You have to give me another\nchance! I can't stand losing!\n\nAzucena! We have to train!\nI'm winning next time, no matter what!",
  },
  'B218': {
    es: '¿Qué? ¿Ya gané?\n\nDemasiado fácil.\n¡Qué aburrido!\n\n¿No hay algo más divertido que hacer?\n\nSi de verdad quieres, a lo mejor\nte dejo desafiarme otra vez.\n\n¡Adiós!',
    en: "What?! I won already?!\n\nThat was too easy.\nThis is so boring!\n\nIsn't there something more fun to do?\n\nIf you really want, I might let you\nchallenge me one more time.\n\nSee you!",
  },
  'B3D0': minaDeck,
};

const EXTRA_ARENA: CityTexts = {
  'FE10': { who: null, es: 'La Arena Extra está cerrada por ahora.\nVuelve más tarde.', en: 'The Extra Arena is closed for now.\nPlease come back later.' },

  // first tournament: Trino, Aquilino, Vendaval
  'FFEC': {
    es: 'Gracias por venir. Aquí te esperan\ntodas mis formas.\n\n¡Podrías llamarla la Arena de Trino!\n\nTe atacaré con todo lo que tengo.\n¿Cuánto podrás aguantar?',
    en: "Thank you for coming. All my shapes\nare waiting for you here.\n\nYou could call it the Trino Arena!\n\nI'll hit you with everything I have.\nHow much of it can you take?",
  },
  '101FC': trino.ask,
  '10284': { es: 'Perdón.\nNo quiero apurarte.', en: "I'm sorry.\nI don't mean to rush you." },
  '1030C': { es: '¡Adelante!', en: "Let's do this!" },
  '103A0': {
    es: '¡Increíble! Me ganaste limpiamente.\nPero esto apenas comienza...\n\n¡Ahora alcanzaré la forma de Aquilino!\nTe advierto que seré más fuerte.\n\n¡No voy a perder!',
    en: "Incredible! You beat me fair and square.\nBut this is only the beginning...\n\nNow I'll reach the shape of Aquilino!\nI'm warning you, I'll be stronger.\n\nI won't lose!",
  },
  '104FC': {
    es: trino.wonStart + '\n\nVuelve a desafiarme cuando quieras.\nSiempre estaré aquí.',
    en: trino.wonStartEn + "\n\nCome back and challenge me again.\nI'll always be here.",
  },
  '10640': trinoDeck,
  '10758': {
    es: '¡Como Aquilino, soy invencible!\n\nNo creas que será tan fácil\ncomo la última vez.\n\n¿Podrás con mi Primer golpe?\nJa, ja, ja... ¡A pelear!',
    en: "As Aquilino, I'm invincible!\n\nDon't think it'll be as easy\nas last time.\n\nCan you handle my First strike?\nHa ha ha... Time to battle!",
  },
  '1094C': { es: '¡Con todo! ¿Empezamos?', en: "Let's rock! Shall we start?" },
  '109E4': { es: '¿Qué...? ¿Qué pasa?\n\nNo... Dime que no es cierto.\nJa, ja, ja, ja...', en: "What...? What's wrong?\n\nNo... Tell me that isn't so.\nHa ha ha ha..." },
  '10AB8': { es: '¡Sin arrepentimientos!', en: 'No regrets!' },
  '10B4C': {
    es: '¡Imposible! ¿Perdí?\n\n¡No acepto la derrota!\nSe acabaron los juegos.\n\nAlcanzaré la forma de Vendaval\ny te volveré a desafiar.\n\nNo te sientas mal si pierdes:\nes mi forma más fuerte... por ahora.',
    en: "Impossible! I lost?\n\nI won't accept defeat!\nNo more playing around.\n\nI'll reach the shape of Vendaval\nand challenge you again.\n\nDon't feel bad if you lose:\nit's my strongest shape... for now.",
  },
  '10D58': aquilinoWon,
  '10ED8': aquilinoDeck,
  '11024': {
    es: '¡Me encendiste el corazón!\n¡Soy Vendaval, el maestro de la Arena!\n\nHasta aquí llegas.\nTe lo aseguro.\n\nRodeado de amor,\nsoy de verdad invencible.\n\n¡Vamos! ¡Muéstrame todo lo que tienes!',
    en: "You got me all fired up!\nI'm Vendaval, master of this Arena!\n\nThis is as far as you go.\nI assure you.\n\nSurrounded by love,\nI am truly invincible.\n\nCome on! Show me everything you have!",
  },
  '1128C': { es: 'Sí... ¿Empezamos?', en: 'Yes... Shall we begin?' },
  '1131C': vendaval.quit,
  '11398': vendaval.go,
  '11440': vendaval.lost,
  '11748': vendaval.won,
  '118D4': vendavalDeck,

  // second tournament: Aquilino, Vendaval, Molinete
  '11C20': { es: '¡Vamos! ¿Empezamos?', en: "Let's go! Shall we start?" },
  '11CB4': { es: '¿Qué...? ¿Qué pasa?\n\nNo... Es broma.\nJa, ja, ja, ja...', en: "What...? What's wrong?\n\nNo... You're joking.\nHa ha ha ha..." },
  '11D80': { es: 'No te arrepientas.', en: "Don't regret this." },
  '11E1C': {
    es: 'Mmm... Veo que vas en serio.\n\n¡No acepto la derrota!\nSe acabaron los juegos.\n\nAlcanzaré la forma de Vendaval\ny te volveré a desafiar.\n\nNo te sientas mal si pierdes contra\nVendaval: esa es mi verdadera fuerza...',
    en: "Hmm... I guess you're serious.\n\nI won't accept defeat!\nNo more playing around.\n\nI'll reach the shape of Vendaval\nand challenge you again.\n\nDon't feel too bad if you lose to\nVendaval. That is my real power...",
  },
  '12040': aquilinoWon,
  '121CC': aquilinoDeck,
  '123A0': { es: 'Sí... ¿Bailamos?', en: 'Yes... Shall we dance?' },
  '12434': vendaval.quit,
  '124B0': vendaval.go,
  '12558': {
    es: '¡Increíble! ¡Simplemente increíble!\nTienes verdadero talento.\n\nAlgún día nos volveremos a ver\ny te venceré con mi nuevo poder.\n\n¡Nadie podrá detenerme cuando\nalcance la forma de Molinete!',
    en: "Incredible! Simply incredible!\nYou have true talent.\n\nSomeday we'll meet again and I'll\ndefeat you with my new power.\n\nNo one can stop me once\nI reach the shape of Molinete!",
  },
  '126E0': vendaval.wonAgain,
  '12890': vendavalDeck,
  '129B4': {
    es: '¡Ja! ¡Aquí está Molinete,\nel maestro de esta Arena!\n\nMis estrellas de acero cortan\nlo que sea.\n\nSi no vienes con todo,\nte vas a llevar un buen susto.',
    en: "Hah! Here is Molinete,\nmaster of this Arena!\n\nMy steel stars are sharp enough\nto cut through anything.\n\nIf you're not fully prepared,\nyou'll get seriously hurt!",
  },
  '12BCC': molinete.ask,
  '12C88': molinete.no,
  '12D04': molineteGo('¡Terminemos con esto!', "Let's get it over with!"),
  '12DD4': {
    es: 'Mis estrellas...\n\nEsta batalla fue increíble.\nTe agradezco la lección.\n\nPero no pienso volver a perder.\n\nCuando nos veamos en el Café\nde batallas, te venceré.\n\nEspero ese momento con ganas.',
    en: "My steel stars...\n\nThis battle was incredible.\nThank you for the lesson.\n\nBut I don't intend to lose again.\n\nWhen we meet at the Battle Cafe,\nI will defeat you.\n\nI look forward to that moment.",
  },
  '13168': molinete.won,
  '1332C': molineteDeck,

  // third tournament: Vendaval, Molinete, Céfiro
  '1366C': { es: 'Mmm... ¿Empezamos?', en: 'Hmm... Shall we begin?' },
  '13700': vendaval.quit,
  '1377C': vendaval.go,
  '13824': {
    es: '¡Increíble! ¡Simplemente increíble!\nTienes verdadero talento.\n\nPero no creo que puedas vencer\nmi nuevo poder.\n\n¡Nadie podrá detenerme cuando\nalcance la forma de Molinete!',
    en: "Incredible! Simply incredible!\nYou have true talent.\n\nBut I don't think you can beat\nmy new power.\n\nNo one can stop me once\nI reach the shape of Molinete!",
  },
  '139AC': vendaval.wonAgain,
  '13B5C': vendavalDeck,
  '13D08': molinete.ask,
  '13DC4': molinete.no,
  '13E40': molineteGo('¡Terminemos con esto!', "Let's get this over with!"),
  '13F14': molineteNext('¡Increíble! ¡Simplemente increíble!\nTienes verdadero talento.', 'Incredible! Simply incredible!\nYou have true talent.'),
  '140B0': molinete.won,
  '14274': molineteDeck,
  '1438C': {
    es: '¡Alcancé mi forma siguiente!\n\nSoy Céfiro, señor del cielo,\ny el maestro de esta Arena.\n\nNadie resistió nunca\nmi ataque en picada.\n\nQuiero ver qué tal te va...',
    en: "I've reached my next shape!\n\nI am Céfiro, master of the sky,\nand master of this Arena.\n\nNo one has ever survived\nmy dive attack.\n\nI'd like to see how well you do...",
  },
  '145D0': cefiro.ask,
  '1468C': cefiro.no,
  '1472C': cefiro.go,
  '147C0': {
    es: cefiro.lostStart + cefiro.next + '\n\nTe prometo otra batalla\nmuy intensa.\n\nSigue entrenando hasta entonces.\n\nAdiós.',
    en: cefiro.lostStartEn + cefiro.nextEn + '\n\nI promise you another\nfierce battle.\n\nKeep training until then.\n\nGoodbye.',
  },
  '14B98': cefiroWon('Espero la revancha.', 'I look forward to a rematch.'),
  '14DF4': cefiroDeck,

  // fourth tournament: Molinete, Céfiro, Brunilda
  '15140': molinete.ask,
  '151FC': molinete.no,
  '15278': molineteGo('¡Vamos allá!', "Let's go for it!"),
  '15344': molineteNext('Esta batalla fue increíble.\nTe agradezco esta lección.', 'This battle was incredible.\nThank you for this lesson.'),
  '154EC': molinete.won,
  '156B0': molineteDeck,
  '15850': cefiro.ask,
  '1590C': cefiro.no,
  '159AC': cefiro.go,
  '15A40': {
    es: cefiro.lostStart + cefiro.next + '\n\nYa no hay vuelta atrás.\nPrepárate para la próxima batalla.',
    en: cefiro.lostStartEn + cefiro.nextEn + "\n\nThere's no turning back now.\nPrepare for the next battle.",
  },
  '15BF0': cefiroWon('Espero tus desafíos.', 'I look forward to your challenges.'),
  '15E54': cefiroDeck,
  '15F7C': {
    es: 'Soy Brunilda, la princesa guerrera.\nSoy la maestra de esta Arena.\n\nSiento el fuego que llevas dentro.\nAcepto tu desafío.\n\nPero no aceptaré excusas\nsi no das lo mejor de ti.\n\nMuéstrame todo lo que tienes.\nAsí me demuestras respeto.\n\nEs hora de pelear.\n¡Adelante, sorpréndeme!',
    en: "I am Brunilda, the warrior princess.\nI am the master of this Arena.\n\nI can feel the fire inside you.\nI accept your challenge.\n\nBut I will accept no excuses\nif you don't give your best.\n\nShow me everything you have.\nThat is how you show me respect.\n\nIt's time to battle.\nGo ahead. Make my day!",
  },
  '16284': brunilda.ask,
  '16310': brunilda.no,
  '163A8': brunilda.go,
  '16444': {
    es: 'Nunca olvidaré esta batalla.\nHoy es tu día.\n\nPero recuerda: si dejas de mejorar\ntu fuerza y tu habilidad, perderás.\n\nNuestra batalla apenas comienza.\n\nTienes que enfrentarme cuando nos\nveamos en el Café de batallas.\n\nNos volveremos a ver. ¡Adiós!',
    en: "I will never forget this battle.\nToday is your day.\n\nBut remember, you'll be defeated\nonce you stop improving your skills.\n\nOur battle is just beginning.\n\nYou must battle me when\nwe meet at the Battle Cafe.\n\nWe shall meet again. Goodbye!",
  },
  '16818': brunilda.won,
  '16A54': brunildaDeck,
};

const BEETLE_ARENA: CityTexts = {
  '16BB0': { who: null, es: 'La Arena del Escarabajo está cerrada\npor ahora. Vuelve más tarde.', en: 'The Beetle Arena is closed for now.\nPlease come back later.' },
  '16C0C': { who: null, es: '¿Seguro que quieres entrar\na la Arena del Escarabajo?', en: 'Are you sure you want\nto enter the Beetle Arena?' },

  // Tenaza
  '16D84': { es: 'Hola. Me llamo Tenaza.\n\n¡Mi mazo es muy fuerte!\nNo es nada fácil ganarme.', en: "Hey there. My name is Tenaza.\n\nMy deck is really strong!\nI'm not easy to beat." },
  '16F04': { es: '¿Y bien? ¿Quieres probar suerte?', en: 'Well? Want to try your luck?' },
  '16F9C': { es: '¿Qué pasa? No me digas\nque cambiaste de idea.', en: "What's wrong? Don't tell me\nyou changed your mind." },
  '17034': { es: 'Entonces... ¡a jugar!', en: "Then... let's play!" },
  '170D8': {
    es: '¡Ay, ay, ay! Perdí.\nJuegas de maravilla.\n\n¡Oye! ¡Montemos un negocio juntos!\n\n¡Con tu talento nos haríamos ricos!\n¿Qué me dices?',
    en: "Oh my, my! I lost.\nYou play like a dream.\n\nHey! Let's team up and start a business!\n\nWith your talent, we'd make a fortune!\nWhat do you say?",
  },
  '1723C': tenazaWon,
  '1734C': tenazaDeck,

  // Sigilo, back for revenge
  '174A0': {
    es: 'Soy Sigilo. ¡Entreno sin parar\ndesde que perdí contigo!\n\nEntré a esta Arena para vencerte\ncomo maestro de las hojas afiladas.\n\nNo puedo perder otra vez.\n¡Mi reputación está en juego!',
    en: "I'm Sigilo. I've been training nonstop\never since I lost to you!\n\nI entered this Arena to beat you\nas the master of razor leaves.\n\nI cannot afford to lose again.\nMy reputation is at stake!",
  },
  '176C8': { es: 'Prepararse es tan importante\ncomo entrenar. ¿Empezamos?', en: 'Preparing matters as much\nas training. Shall we begin?' },
  '17790': { es: '¡Eso pasa cuando aflojas\ny no entrenas lo suficiente!', en: "That's what happens when you slack off\nand don't train enough!" },
  '17834': { es: '¡Muéstrame los frutos\nde tu entrenamiento!', en: 'Show me the fruits\nof your training!' },
  '178E4': {
    es: '¡No! ¡Perdí... otra vez!\n\nVeo que no dejaste de entrenar.\nTengo que llegar más lejos.\n\nEntrenaré más, y la próxima te venceré\ncon mis hojas afiladas.\n\n¡Te espero en el Café de batallas!',
    en: "No! I lost... again!\n\nI see you've kept up your training.\nI must take myself further.\n\nI'll train more, and next time\nmy razor leaves will defeat you!\n\nI'll wait for you at the Battle Cafe!",
  },
  '17AB8': {
    es: 'Ja, ja, ja... ¡Sabía que estabas\naflojando! Ja, ja, ja...\n\nEntrena mucho más antes de volver\na recibir otro castigo.\n\n¡Yo entrenaré todavía más!\nNunca me vas a alcanzar.\n\nJa, ja, ja...',
    en: "Ha ha ha... I knew you were\nslacking off! Ha ha ha...\n\nTrain much harder before you come\nback for more punishment.\n\nI'll train even harder!\nYou'll never catch up with me!\n\nHa ha ha...",
  },
  '17C78': sigiloDeck,

  // Coloso, master of the Beetle Arena
  '17DA8': {
    es: 'Me alegra que hayas llegado.\nSoy el maestro de la Arena\ndel Escarabajo.\n\nSe nota que juegas bien, pero\n¿podrás con mi ejército de insectos?\n\nNo subestimes a mis insectos,\no te llevarás una sorpresa.',
    en: "I'm glad you made it here.\nI'm the master of the Beetle Arena.\n\nYou seem like a good player, but\ncan you hold off my army of insects?\n\nDon't take my insects lightly,\nor you'll be in for a surprise!",
  },
  '17FFC': { es: '¡Que empiece la función!\n¿Medimos fuerzas?', en: "Let's rock and roll!\nShall we test our strength?" },
  '18094': coloso.why,
  '18110': coloso.go,
  '181C0': {
    es: 'Tienes habilidad, pero creo que\nesta vez tuviste suerte.\n\nTengo que saber quién es más fuerte.\nVuelve por la revancha.\n\n¡Te espero!',
    en: "You've got skills, but I think\nyou got lucky this time.\n\nI must know who is stronger.\nCome back for a rematch.\n\nI'll be waiting!",
  },
  '184D4': {
    es: 'Esto sí es una batalla de verdad.\n\nPero no creo que sea la última\nvez que nos veamos.\n\nEsperaré tu desafío. Adiós.',
    en: "This is what a real battle is all about.\n\nBut I don't think this will be\nthe last time I see you.\n\nI'll wait for your challenge. Goodbye.",
  },
  '18630': colosoDeck,
};

export const CITY02_LATER: CityTexts = { ...CAFE, ...EXTRA_ARENA, ...BEETLE_ARENA };
