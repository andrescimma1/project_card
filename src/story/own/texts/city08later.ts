/**
 * Mirador de las Nubes, later phases: Zarpa opens the Extra Arena to battle in her other shapes, each with
 * its own name (Esfinge with the egg of Light, Ancla with the egg of Reliability, Aurora at Apex and, at
 * last, Magna); they also wait at the café, and the Blot wanders in.
 */
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });
const cumbreDeck = deck('*c3Mazo Cumbre\nUn mazo Verde muy equilibrado,\ncon Zarpa en el centro.', '*c3Summit Deck\nA well-balanced Green deck\nwith Zarpa at its heart.');
const esfingeDeck = deck('*c3Mazo Sol del Desierto\nUn mazo Verde equilibrado,\nque juega a su propio ritmo.', '*c3Desert Sun Deck\nA balanced Green deck\nthat plays at its own pace.');
const anclaDeck = deck('*c3Mazo Remolino\nUn mazo defensivo de dos facciones:\nAzul y Verde.', '*c3Whirlpool Deck\nA defensive deck of two factions:\nBlue and Green.');
const auroraDeck = deck('*c3Mazo Alba\nUn mazo Verde lleno de cartas\nmuy vistosas.', '*c3Dawnlight Deck\nA Green deck full of\nstriking cards.');
const magnaDeck = deck('*c3Mazo Dragón de las Nubes\nUn mazo Verde que recupera mucho HP.\nPrepárate para una batalla larga.', '*c3Cloud Dragon Deck\nA Green deck that recovers lots of HP.\nExpect a long battle.');
const blotDeck = deck('*c3Mazo Vacío Desesperado\nEl mazo más maligno y poderoso.', '*c3Desperate Void Deck\nThe most evil and powerful deck.');

const notice = (es: string, en: string): Written => ({ who: null, es, en });
const fusionNotes = notice('Recibiste *c6notas de fusión especial*c7.', 'You got *c6Special Fusion Notes*c7.');
const leaveArena = notice('¿Seguro que quieres\nsalir de la Arena?', 'Are you sure you want\nto leave the Arena?');
const enterExtra = notice('¿Seguro que quieres\nentrar a la Arena Extra?', 'Are you sure you want\nto enter the Extra Arena?');

const zarpa = {
  dontCare: { es: 'Parece que no te interesa mucho.', en: "I guess you don't really care." },
  surprise: { es: '¡Te vas a sorprender!', en: "You're going to be surprised!" },
};
const esfinge = {
  ask: { es: '¿Me ayudas a abrir una nueva era?', en: 'Will you help me open a new era?' },
  light: { es: '¡Se acerca el tiempo de la luz!', en: 'The time of light is near!' },
};
const ancla = {
  ask: { es: '¿Te atreves?', en: 'Do you dare?' },
  shallow: { es: '¿Eso es todo lo que hay en ti?', en: 'Is that all there is to you?' },
  showMe: { es: '¡Muéstrate tal como eres!', en: 'Show me who you really are!' },
  lost: {
    es: '¿Qué fue eso? No me atacaste\ncon todo tu poder.\n\nGuardas más fuerza de la que crees.\n\nTu verdadera batalla\ntodavía no empezó.\n\nNo pierdas el tiempo\ncon alguien como yo.\n\nMira bien dentro de ti.\n\nCuando te encuentres,\nven a desafiarme otra vez.',
    en: "What was that? You didn't strike\nwith all your power.\n\nYou hold more strength than you think.\n\nYour real battle\nhas not yet begun.\n\nDon't waste your time\non someone like me.\n\nLook deep inside yourself.\n\nWhen you find yourself,\ncome challenge me again.",
  },
};
const aurora = {
  ask: { es: '¿Estás de acuerdo?', en: 'Do you agree?' },
  noForce: { es: 'No pienso imponerte mis ideas.', en: "I won't force my ideas on you." },
  go: { es: 'Entonces, a jugar.', en: 'Then let us battle.' },
};
const magna = {
  focus: { es: 'Ahora, concéntrate.', en: 'Now, concentrate.' },
  lost: {
    es: 'Este resultado no me satisface.\nSé que puedes hacerlo mucho mejor.\n\nQuiero una batalla mejor,\ncueste lo que cueste.\n\nEsperaré tu desafío.',
    en: 'This outcome does not satisfy me.\nI know you can do much better.\n\nI want a better battle,\nno matter how long it takes.\n\nI will await your challenge.',
  },
};

export const CITY08_LATER: CityTexts = {
  // Zarpa opens an Arena for her other shapes
  '6A08': { es: 'Hola. Me han hablado mucho de ti.\nTe has esforzado, ¿verdad?', en: "Hi. I've heard a lot about you.\nYou've been working hard, haven't you?" },
  '6AA4': { who: 'me', es: 'Sí, creo que me va bastante bien.', en: "Yeah, I think I'm doing pretty well." },
  '6B08': {
    es: 'Yo también aprendí mucho\nen nuestras batallas.\n\nAsí que abrí una Arena nueva,\npara jugar con mis otras formas.\n\n¿Por qué no vienes?\nTe prometo que lo vas a disfrutar.',
    en: "I learned a lot from\nour battles, too.\n\nSo I opened a new Arena,\nto play in my other shapes.\n\nWhy don't you come by?\nI promise you'll enjoy it.",
  },
  '6C80': { who: 'me', es: '¡Claro que voy!', en: "Of course I'll be there!" },
  '6CDC': { es: '¿De verdad? Gracias.\nTe espero en la Arena.', en: "Really? Thanks.\nI'll be waiting at the Arena." },
  '6D6C': notice('*c6¡La Arena Extra está abierta!\n*c6¡Que pasen los valientes!', '*c6The Extra Arena is now open!\n*c6Those who are ready, come on in!'),
  '6FC4': { es: 'Gracias a ti, abrí una Arena\npara mis otras formas.\n\n¿Por qué no vienes?\nTe prometo que lo vas a disfrutar.', en: "Thanks to you, I opened an Arena\nfor my other shapes.\n\nWhy don't you come by?\nI promise you'll enjoy it." },
  '70F0': {
    es: '¡Voy a seguir evolucionando!\n\nNo creas que esto terminó solo\nporque me ganaste un par de veces.\n\nPor cierto, hace tiempo encontré esto.\nPuede que te sirva.',
    en: "I'll keep on evolving!\n\nDon't think this is over just\nbecause you beat me once or twice.\n\nBy the way, I found this a while back.\nIt might come in handy.",
  },
  '724C': fusionNotes,
  '72A8': { es: 'Creo que se usan en la tienda\nde fusión. Pruébalas algún día.\n\n¡Hasta pronto! Juguemos otra vez.', en: "I think they're used at the fusion\nshop. Try them sometime.\n\nSee you! Let's play again someday." },
  '7394': { es: '¡Voy a seguir evolucionando!\n\nNo creas que lo nuestro terminó\nsolo porque me ganaste un par de veces.', en: "I'll keep on evolving!\n\nDon't think it's over between us\njust because you won once or twice!" },
  '7480': { es: '¿Quieres ver cuánto cambié?', en: "Want to see how much I've changed?" },
  '750C': zarpa.dontCare,
  '7580': zarpa.surprise,
  '7618': {
    es: 'Todavía no soy lo bastante fuerte...\nTu poder es increíble.\n\nPero esta batalla es solo el comienzo.\n\nTe lo advierto: la próxima\nno será tan fácil.\n\n¡Voy a seguir evolucionando!',
    en: "I'm still not strong enough...\nYour power is incredible.\n\nBut this battle is only the beginning.\n\nI'm warning you: the next one\nwon't be so easy.\n\nI'll keep on evolving!",
  },
  '77B4': { es: '¡Ja, ja, ja!\n¡Mira mi nuevo poder!\n\nNada mal, ¿eh?\n\nAcepto tu desafío cuando quieras,\npero no me vas a ganar tan fácil.', en: "Ha ha ha!\nBehold my new power!\n\nNot bad, huh?\n\nI'll take your challenge anytime,\nbut I won't be beaten so easily." },
  '78E8': cumbreDeck,

  // Esfinge, at the café
  '7AB0': { es: 'Mi poder de luz va más allá\nde lo que puedes imaginar.\n\nNo hay palabras para explicarlo.\n¡Deja que te lo muestre en batalla!', en: 'My power of light is beyond\nanything you can imagine.\n\nThere are no words for it.\nLet me show you in battle!' },
  '7BB4': { es: '¿Unimos fuerzas para abrir\nuna nueva era?', en: 'Shall we join forces to begin\na new era?' },
  '7C58': { es: 'No te das cuenta de todo\nel talento que tienes...', en: "You don't realize how much\ntalent you have..." },
  '7CF4': esfinge.light,
  '7D9C': { es: 'Tu poder debe abrir una nueva era.\nNo hay tiempo que perder.\n\n¡Tienes que cumplir tu destino!\nTe estaré esperando.', en: "Your power must open a new era.\nThere's no time to waste.\n\nYou must fulfill your destiny!\nI'll be waiting." },
  '7EBC': {
    es: '¡Esta era necesita un poder nuevo!\n¿No eres tú quien lo tiene?\n\nSé que lo llevas dentro.\n¡Despierta la luz que hay en ti!\n\nEso creo. Esta derrota es solo\nun escalón hacia el futuro.\n\nAhora debes dar el siguiente paso.',
    en: "This era needs a new power!\nAren't you the one who has it?\n\nI know it's inside you.\nAwaken the light within you!\n\nThat's what I believe. This loss is\njust a step toward the future.\n\nNow you must take the next step.",
  },
  '8088': esfingeDeck,

  // Ancla, at the café
  '824C': {
    es: 'Ante Ancla, todo muestra\nlo que lleva en el fondo.\n\nSi me vences, aceptaré\nque tu poder es real.\n\nSi no, te hundirás en lo oscuro.\n\nPiénsalo bien antes de decidir.',
    en: 'Before Ancla, all things show\nwhat lies beneath.\n\nIf you beat me, I will accept\nthat your power is real.\n\nIf not, you will sink into the dark.\n\nThink carefully before you decide.',
  },
  '83F8': ancla.ask,
  '847C': ancla.shallow,
  '84E8': { es: 'Muéstrame todo lo que tienes.', en: 'Show me all you have.' },
  '8584': {
    es: 'Lo he visto todo.\nDe verdad eres especial.\n\nPero guardas aún más poder dentro.\nTodavía no lo reconoces.\n\nTu verdadera batalla recién empieza.\n\nUn día te desafiaré\ncon mi siguiente forma.\n\nCuando llegue ese día, espero\notra batalla igual de buena.',
    en: 'I have seen it all.\nYou truly are something.\n\nBut there is more power in you.\nYou have yet to see it.\n\nYour real battle is just beginning.\n\nOne day I will challenge you\nin my next shape.\n\nWhen that day comes, I expect\nanother battle just as good.',
  },
  '88E0': ancla.lost,
  '8B5C': anclaDeck,

  // Aurora, at the café
  '8CF4': { es: 'No te tomes esta batalla a la ligera.\n\nSi no estás de acuerdo,\nmejor vete...', en: "Don't take this battle lightly.\n\nIf you don't agree,\nyou'd better leave..." },
  '8DD4': aurora.ask,
  '8E5C': aurora.noForce,
  '8EF4': aurora.go,
  '8F90': {
    es: 'Siento en ti espíritu de lucha.\nTe tomas esto en serio.\n\nVolveré a desafiarte.\n\nTe prometo que un día me verás\ncon mi siguiente forma.\n\n¡Entrena mucho hasta entonces!',
    en: "I sense a fighting spirit in you.\nYou take this seriously.\n\nI shall challenge you again.\n\nI promise that one day you'll see me\nin my next shape.\n\nTrain hard until then!",
  },
  '9270': {
    es: 'Así que todavía dudas.\n\nCon ese nivel no podrás seguir\ntu viaje. Debes mejorar.\n\nVuelve a desafiarme cuando quieras.\nAquí siempre tendrás un lugar.\n\nNos volveremos a ver.',
    en: "So, you still have doubts.\n\nAt that level, you can't go on\nwith your journey. You must improve.\n\nChallenge me again anytime.\nThere's always a place for you here.\n\nWe shall meet again.",
  },
  '9418': auroraDeck,

  // Magna, at the café
  '95B8': { es: 'Empieza la última gran batalla.\n¡Luchemos!\n\nEspero mucho de ti.', en: 'The last great battle begins.\nLet us fight!\n\nI expect a lot from you.' },
  '9694': { es: '¿Tienes fuerzas para\nla gran batalla?', en: 'Are you ready for the great battle?' },
  '9730': { es: 'No voy a obligarte, pero pelear\nsin un motivo no tiene sentido.', en: "I won't force you, but fighting\nwithout a cause is meaningless." },
  '97D4': magna.focus,
  '986C': {
    es: 'El resultado me satisface.\n\nLos dos dimos lo mejor de nosotros.\n\nGracias por esta batalla.\n\nSupongo que seguirás tu viaje,\nen busca de otras batallas.\n\nSi alguna vez te acuerdas de mí,\nven a desafiarme otra vez.\n\nEsperaré tu regreso.',
    en: "I am satisfied with the outcome.\n\nWe both gave our very best.\n\nThank you for this battle.\n\nI suppose you'll go on with your\njourney, in search of new rivals.\n\nIf you ever remember me,\ncome challenge me again.\n\nI will await your return.",
  },
  '9BF0': magna.lost,
  '9D4C': magnaDeck,

  // the Blot, a creature that lost its shape
  '9F4C': {
    es: '¿Qué sabes tú del dolor de los que\nnunca pudieron evolucionar?\n\n¡Lo odio todo!\n\nMi rencor no se apagará hasta borrar\ntodo lo que hay en este mundo.',
    en: 'What do you know of the pain of those\nwho could never evolve?\n\nI hate everything!\n\nMy hatred will not fade until I erase\neverything in this world.',
  },
  'A0B8': { es: '¿Adónde... voy...?\n\n¿Habrá paz allí?\n\n¿O me hundirá más rencor?\n\nNo lo sé...', en: "Where... am I... going?\n\nWill there be peace there?\n\nOr will more hatred drag me down?\n\nI don't know..." },
  'A1F0': { es: '¿Crees que puedes vencerme?', en: 'Do you think you can beat me?' },
  'A28C': { es: '¿No? Entonces vete...\nantes de que cambie de idea.', en: 'No? Then leave...\nbefore I change my mind.' },
  'A2F4': { es: '¡Entonces, que te trague mi rencor!', en: 'Then let my hatred swallow you!' },
  'A394': {
    es: 'Ohhh... me desvanezco...\n¿Y mi rencor se va conmigo?\n\n¿Esto es la calma?\nNo lo entiendo...\n\n¿Adónde... voy...?\n\n¿Habrá serenidad allí?\n\n¿O me hundirá más rencor?\n\nNo lo sé...',
    en: "Ohhh... I'm fading...\nIs my hatred going with me?\n\nIs this what calm feels like?\nI don't understand...\n\nWhere... am I... going?\n\nWill there be serenity there?\n\nOr will more hatred drag me down?\n\nI don't know...",
  },
  'A89C': {
    es: 'El rencor crece dentro de mí...\nYa no lo puedo contener...\n\n¡Tengo que soltarlo!\n¡Cubriré este mundo de gris!\n\n¡Ahora todos sentirán mi dolor!\n\n¡Sientan mi dolor! ¡Mi angustia!\n\n¡Es la venganza de los que\nnunca pudieron evolucionar!',
    en: 'The hatred inside me is growing...\nI cannot hold it in any longer...\n\nI must let it out!\nI will cover this world in grey!\n\nNow everyone will feel my pain!\n\nFeel my pain! Feel my agony!\n\nThis is the revenge of those\nwho could never evolve!',
  },
  'AACC': blotDeck,

  // the Extra Arena
  'D984': notice('La Arena Extra está cerrada por ahora.\nVuelve más tarde.', 'The Extra Arena is closed for now.\nPlease come back later.'),
  'D9E4': enterExtra,

  // first round: Zarpa, Esfinge, Ancla
  'DB60': {
    es: 'Hola. Gracias por venir.\nSoy tu primera rival.\n\nMejoré mucho desde nuestra\núltima batalla.\n\nEn esta Arena te mostraré\ncuánto crecí.\n\nEmpecemos.\nDame todo lo que tienes.',
    en: "Hi. Thanks for coming.\nI'm your first opponent.\n\nI've improved a lot since\nour last battle.\n\nIn this Arena, I'll show you\nhow much I've grown.\n\nLet's begin.\nGive me all you've got.",
  },
  'DDA0': { es: '¿Quieres verme evolucionar?', en: 'Do you want to see me evolve?' },
  'DE38': zarpa.dontCare,
  'DEAC': zarpa.surprise,
  'DF4C': {
    es: 'Todavía no puedo contigo.\nTu poder es increíble.\n\nPero esto fue solo un calentamiento.\n\nCon el huevo de la Luz voy a\nevolucionar. ¡Seré Esfinge!\n\nTe advierto que la próxima\nno será tan fácil.\n\n¡Te espero!',
    en: "I'm still no match for you.\nYour power is incredible.\n\nBut that was only a warm-up.\n\nWith the Egg of Light, I'll evolve.\nI'll become Esfinge!\n\nI warn you, the next battle\nwon't be so easy.\n\nI'll be waiting!",
  },
  'E160': {
    es: '¡Ja, ja, ja!\n¿Qué te parece mi nuevo poder?\n\nNada mal, ¿eh?\n\nAcepto tu desafío cuando quieras,\npero no me vas a ganar tan fácil.\n\n¡Te espero en esta Arena!',
    en: "Ha ha ha!\nHow do you like my new power?\n\nNot bad, huh?\n\nI'll take your challenge anytime,\nbut I won't be beaten so easily.\n\nI'll wait for you in this Arena!",
  },
  'E2DC': cumbreDeck,
  'E430': {
    es: 'Soy Esfinge. Fui Zarpa, y alcancé\nesta forma con el huevo de la Luz.\n\nSi subestimas mi poder,\nte vas a arrepentir.\n\nMi poder de luz va más allá\nde lo que puedes imaginar.\n\nNo hay palabras para explicarlo.\n¡Deja que te lo muestre en batalla!',
    en: "I'm Esfinge. Once I was Zarpa;\nthe Egg of Light gave me this shape.\n\nIf you underestimate my power,\nyou will regret it.\n\nMy power of light is beyond\nanything you can imagine.\n\nThere are no words for it.\nLet me show you in battle!",
  },
  'E6C4': esfinge.ask,
  'E760': { es: 'No te das cuenta de todo\nel talento que tienes.', en: "You don't realize how much\ntalent you have." },
  'E7FC': esfinge.light,
  'E8A4': {
    es: 'Tu poder debe abrir la nueva era.\nNo hay tiempo que perder.\n\n¡Tienes que seguir tu destino!\n\nPero antes, debes ganar\nla siguiente batalla.\n\nCon el huevo de la Confianza\nveré cuál es tu futuro.\n\n¡Te espero!',
    en: "Your power must open the new era.\nThere's no time to waste!\n\nYou must follow your destiny!\n\nBut first, you must win\nthe next battle.\n\nWith the Egg of Reliability,\nI will see your future.\n\nI'll be waiting!",
  },
  'EAC4': {
    es: '¡Esta era necesita un poder nuevo!\n¿Es mucho pedirte?\n\nNo. Sé que ese poder\nestá en lo hondo de ti.\n\nEso creo. Tu derrota fue\nel primer paso hacia el futuro.\n\nDa ese paso: vuelve a desafiar\nesta Arena.',
    en: "This era needs a new power!\nIs that too much to ask of you?\n\nNo. I know that power\nis deep inside you!\n\nThat's what I believe. Your loss was\nthe first step toward the future.\n\nTake that step: challenge\nthis Arena again.",
  },
  'ECC4': esfingeDeck,
  'EE10': {
    es: 'El huevo de la Confianza no miente.\n\nAnte Ancla, todo y todos\nmuestran lo que llevan en el fondo.\n\nSi me vences, aceptaré\nque tu poder es real.\n\nPero si tu poder no es real,\nte hundirás en lo oscuro.\n\nAsí que ten cuidado.',
    en: 'The Egg of Reliability does not lie.\n\nBefore Ancla, everything and everyone\nshows what lies beneath.\n\nIf you beat me, I will accept\nthat your power is real.\n\nBut if your power is not real,\nyou will sink into the dark.\n\nSo be careful.',
  },
  'F0B8': ancla.ask,
  'F13C': ancla.shallow,
  'F1A8': ancla.showMe,
  'F248': {
    es: 'Ya vi todo de ti.\nDe verdad eres especial.\n\nGuardas aún más poder dentro,\nuno que todavía no descubres.\n\nTu verdadera batalla recién empieza.\n\nUn día te desafiaré\ncon una forma nueva.\n\nEspero otra batalla\nigual de buena contigo.',
    en: 'I have seen everything about you.\nYou truly are something.\n\nThere is more power hidden in you,\npower you have yet to discover.\n\nYour real battle is just beginning.\n\nOne day I will challenge you\nin a new shape.\n\nI expect another battle\njust as good.',
  },
  'F634': {
    es: '¿Qué fue eso? Todavía no\nte mostraste tal como eres.\n\nGuardas mucha fuerza\nque ni siquiera conoces.\n\nTu verdadera batalla\nni siquiera empezó.\n\nNo pierdas el tiempo\ncon alguien como yo.\n\nAhora, mira bien dentro de ti.\n\nY cuando te encuentres,\nven a desafiarme otra vez.',
    en: "What was that? You still haven't\nshown me who you really are.\n\nYou hold so much strength\nyou don't even know about.\n\nYour real battle\nhasn't even started.\n\nDon't waste your time\non someone like me.\n\nNow, look deep inside yourself.\n\nAnd when you find yourself,\ncome challenge me again.",
  },
  'F8B4': anclaDeck,
  'F968': leaveArena,
  'F9F8': enterExtra,

  // second round: Esfinge, Ancla, Aurora
  'FC00': esfinge.ask,
  'FC9C': { es: 'No sabes cuánta habilidad tienes...', en: "You don't know how much\nskill you have..." },
  'FD34': esfinge.light,
  'FDDC': {
    es: 'Tu poder está hecho para traer\nla nueva era. No hay tiempo que perder.\n\n¡Tienes que seguir tu destino!\n\nPero antes debes ganar\nla siguiente batalla.\n\nCon el huevo de la Confianza\nveré cuál es tu futuro.\n\n¡Te espero!',
    en: "Your power is meant to bring\nthe new era. No time to fool around.\n\nYou must follow your destiny!\n\nBut you must win the next\nbattle before you move on.\n\nWith the Egg of Reliability,\nI will see your future.\n\nI'll be waiting!",
  },
  '10000': {
    es: '¡Tienes que traer la nueva era!\n¿Te estoy pidiendo demasiado?\n\nEstoy segura de que guardas\nmás poder en lo hondo de ti.\n\nEso creo. Esta derrota\nsolo te hará más fuerte.\n\nAhora, sigue desafiándome\nen esta Arena.',
    en: "You must bring the new era!\nAm I asking too much of you?\n\nI know for certain that you hold\nmore power deep inside!\n\nThat's what I believe. This loss\nwill only make you stronger.\n\nNow, keep challenging me\nin this Arena.",
  },
  '101EC': esfingeDeck,
  '103D4': ancla.ask,
  '10458': ancla.shallow,
  '104C4': ancla.showMe,
  '10568': {
    es: 'Ahora sí lo vi todo.\nDe verdad eres especial.\n\nHay en ti más poder\ndel que crees.\n\nTu verdadera batalla recién empieza.\nY yo estoy lista para una forma nueva.\n\nAlcanzaré mi forma Perfecta,\nAurora, y te mostraré la luz.\n\nAhora, tú decides.',
    en: 'Now I have seen everything.\nYou truly are something.\n\nThere is more power in you\nthan you realize.\n\nYour real battle is just beginning.\nAnd I am ready for a new shape.\n\nI will reach my Apex shape,\nAurora, and show you the light.\n\nNow, the choice is yours.',
  },
  '107A4': {
    es: '¿Qué fue eso? ¿No te pedí\nque me lo mostraras todo?\n\nHay en ti más poder\ndel que conoces.\n\nTu verdadera batalla\ntodavía no empezó.\n\nNo pierdas el tiempo\ncon alguien como yo.\n\nMira bien dentro de ti.\n\nCuando te encuentres,\nvuelve a desafiarme.',
    en: "What was that? Didn't I ask you\nto show me everything?\n\nThere is more power in you\nthan you know.\n\nYour real battle\nhas not yet begun.\n\nDon't waste your time\non someone like me.\n\nLook deep within yourself.\n\nWhen you find yourself,\nchallenge me again.",
  },
  '10A1C': anclaDeck,
  '10B3C': {
    es: 'Con mi forma Perfecta, Aurora,\nvoy a terminar esta batalla.\n\nVoy a dar todo lo que tengo.\n\nNo te tomes esta batalla a la ligera.\n\nSi no estás de acuerdo,\nmejor vete.\n\n¡En esta Arena se juega en serio!',
    en: "In my Apex shape, Aurora,\nI will end this battle.\n\nI will give it everything I have.\n\nDon't take this battle lightly.\n\nIf you don't agree,\nyou'd better leave.\n\nIn this Arena, we play for real!",
  },
  '10E18': aurora.ask,
  '10EA8': aurora.noForce,
  '10F34': aurora.go,
  '10FD4': {
    es: 'Siento un fuego en ti.\nDe verdad te lo tomas en serio.\n\nVolveré a desafiarte.\n\nTe prometo que un día me verás\ncon una forma nueva.\n\n¡Prepárate hasta entonces!\nNos volveremos a ver.',
    en: "I do feel a fire in you.\nYou really take this seriously.\n\nI shall challenge you again.\n\nI promise that one day you'll see me\nin a new shape.\n\nPrepare yourself until then!\nWe shall meet again.",
  },
  '11350': {
    es: 'Así que todavía dudas.\n\nSi sigues titubeando,\nno podrás seguir tu viaje.\n\nVuelve a desafiarme cuando quieras.\nAquí siempre tendrás un lugar.\n\nNos volveremos a ver.',
    en: "So, you still have doubts.\n\nIf you keep faltering,\nyou can't go on with your journey.\n\nChallenge me again anytime.\nThere's always a place for you here.\n\nWe shall meet again.",
  },
  '114FC': auroraDeck,
  '115B8': leaveArena,
  '11648': enterExtra,

  // third round: Ancla, Aurora, Magna
  '1184C': { es: '¿Te atreves de verdad?', en: 'Do you really dare?' },
  '118DC': ancla.shallow,
  '11948': { es: '¡Muéstrame todo lo que tienes!', en: 'Show me everything you have!' },
  '119EC': {
    es: 'Te miré con atención,\ny de verdad eres especial.\n\nHay en ti más potencial\ndel que crees.\n\nTu verdadera batalla recién empieza.\nY yo estoy lista para una forma nueva.\n\nAlcanzaré mi forma Perfecta, Aurora,\ny te ayudaré a dar el siguiente paso.\n\n¿Me seguirás?',
    en: 'I took a good look at you,\nand you truly are something.\n\nThere is more potential in you\nthan you realize.\n\nYour real battle is just beginning.\nAnd I am ready for a new shape.\n\nI will reach my Apex shape, Aurora,\nand help you take the next step.\n\nWill you follow my lead?',
  },
  '11C38': {
    es: '¿Qué fue eso? No me atacaste\ncon todo lo que tienes.\n\nHay en ti mucho más talento\ndel que crees.\n\nTu verdadera batalla\ntodavía no empezó.\n\nNo dejes que alguien como yo\nte detenga.\n\nMira bien dentro de ti.\n\nY cuando te encuentres,\nvuelve a desafiarme.',
    en: "What was that? You didn't strike\nwith everything you have.\n\nThere is much more talent in you\nthan you realize.\n\nYour real battle\nhas not yet begun.\n\nDon't let someone like me\nhold you back.\n\nLook deep within yourself.\n\nAnd when you find yourself,\nyou must challenge me again.",
  },
  '11EA8': anclaDeck,
  '12050': { es: '¿Estamos de acuerdo?', en: 'Are we in agreement?' },
  '120E0': aurora.noForce,
  '1216C': { es: 'Entonces, solo queda jugar.', en: 'Then all that is left is to battle.' },
  '1221C': {
    es: 'Sentí un fuego en ti.\nDe verdad te lo tomas en serio.\n\nVolveré a desafiarte.\n\nPor fin llegó la hora de alcanzar\nmi forma más alta.\n\nTe mostraré de lo que soy capaz.\n¡Esta será nuestra última batalla!',
    en: "I felt a fire in you.\nYou really take this seriously.\n\nI shall challenge you again.\n\nAt last, it is time for me to reach\nmy highest shape.\n\nI'll show you what I'm capable of.\nThis will be our last battle!",
  },
  '123EC': {
    es: 'Todavía no confías en ti.\n\nCon un juego tan inmaduro\nno vas a llegar muy lejos.\n\nSigue desafiando esta Arena.\nAquí siempre tendrás un lugar.\n\nNos volveremos a ver.',
    en: "You still don't trust yourself.\n\nWith such childish play,\nyou won't last very long.\n\nKeep challenging this Arena.\nThere's always a place for you here.\n\nWe shall meet again.",
  },
  '12584': auroraDeck,
  '126B0': {
    es: 'Soy Magna. Fui Zarpa, Esfinge,\nAncla y Aurora.\n\nMira cuánto camino recorrimos.\nNo puedo creer que llegaras tan lejos.\n\nLa última gran batalla está por empezar.\nDemos lo mejor de nosotros.\n\nEspero una batalla que valga la pena.',
    en: "I am Magna. I was Zarpa, Esfinge,\nAncla and Aurora.\n\nLook how far we've come.\nI can't believe you made it this far.\n\nThe last great battle is about to begin.\nLet us both do our best.\n\nI'm counting on a battle worth fighting.",
  },
  '128FC': { es: '¿Tienes fuerzas para\nla gran batalla?', en: 'Are you ready for the great battle?' },
  '1299C': { es: 'No voy a obligarte. Pero piensa\nen todo el camino que recorriste.', en: "I won't force you into battle.\nBut think of how far you've come." },
  '12A40': magna.focus,
  '12AD8': {
    es: 'El resultado me satisface.\n\nCreo que los dos dimos\nlo mejor de nosotros.\n\nQuiero darte las gracias.\n\nSin ti, no habría alcanzado\nesta forma.\n\nSupongo que seguirás tu viaje,\nen busca de nuevas batallas.\n\nSi alguna vez te acuerdas de mí,\nven a verme cuando puedas.\n\nEsperaré con ganas tu regreso.',
    en: "I am satisfied with the outcome.\n\nI believe we both\ngave our very best.\n\nI want to thank you.\n\nWithout you, I could never have\nreached this shape.\n\nI suppose you'll go on with your\njourney, in search of new battles.\n\nIf you ever remember me,\ncome and see me when you can.\n\nI'll look forward to your return.",
  },
  '12F6C': magna.lost,
  '130C4': magnaDeck,
  '131A8': leaveArena,
};
