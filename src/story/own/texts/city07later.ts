/**
 * Templo Hundido (city 7), the arenas: Saeta guards the Temple Arena, Campana comes next and Celeste, its
 * master, gives the pass to Cloud Lookout. In the Extra Arena, Bollo fights in every shape he reaches, each
 * with its own name: Barón, Alazán, Custodio and, at last, Serafín.
 */
import { SHARED } from './shared';
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });

/** The decks of the temple's creatures, at the café and in the arenas. */
export const TEMPLE_DECKS = {
  saeta: deck('*c3Mazo Flecha Ardiente\nUn mazo Rojo que resiste bien\ncontra la facción Azul.', '*c3Burning Arrow Deck\nA Red deck that holds up well\nagainst the Blue faction.'),
  campana: deck('*c3Mazo Rugido Antiguo\nUn mazo Rojo y Verde: tosco,\npero bien equilibrado.', '*c3Ancient Roar Deck\nA Red and Green deck: rough,\nbut well balanced.'),
  celeste: deck('*c3Mazo Cazasombras\nUn mazo Verde hecho para vencer\na la facción Sombría.', '*c3Shadowbane Deck\nA Green deck built to beat\nthe Shadow faction.'),
  bollo: deck('*c3Mazo Recién Horneado\nUn mazo Verde lleno de Novatos.\n¡No subestimes su poder!', "*c3Fresh-Baked Deck\nA Green deck full of Novices.\nDon't underestimate its power!"),
  baron: deck('*c3Mazo Doble Embestida\nUn mazo de ataque de dos colores:\nRojo y Verde.', '*c3Double Charge Deck\nAn attacking deck in two colors:\nRed and Green.'),
  alazan: deck('*c3Mazo Galope de Luz\nUn mazo Verde que deshace\na la facción Sombría.', '*c3Light Gallop Deck\nA Green deck that breaks\nthe Shadow faction.'),
  custodio: deck('*c3Mazo Espada del Alba\nEl mazo Verde más temido\npor la facción Sombría.', '*c3Dawn Blade Deck\nThe Green deck the Shadow\nfaction fears the most.'),
  serafin: deck('*c3Mazo Alas Doradas\nUn mazo Verde muy equilibrado.', '*c3Golden Wings Deck\nA very well-balanced Green deck.'),
};
const D = TEMPLE_DECKS;

const extraClosed = { who: null, es: 'La Arena Extra está cerrada por ahora.\nVuelve más tarde.', en: 'The Extra Arena is closed for now.\nPlease come back later.' };
const alazan = {
  fear: { es: 'Le temes a la sombra.', en: 'You fear the shadow.' },
  ask: { es: '¡La luz está lista para brillar!\n¿Empezamos?', en: 'The light is ready to shine!\nShall we begin?' },
};
const custodio = {
  feel: { es: 'Siente la luz que brilla\nen tu corazón.', en: 'Feel the light shining\nin your heart.' },
};

export const CITY07_LATER: CityTexts = {
  // the Temple Arena: Saeta, Campana, then Celeste
  '96A8': SHARED.enterArena,
  '9828': { es: 'Soy Saeta, guardián de esta Arena.\n\nNo puedo dejarte pasar.\nTu viaje termina aquí.', en: 'I am Saeta, guardian of this Arena.\n\nI cannot let you pass.\nYour journey ends here.' },
  '99C0': { es: '¿Todavía piensas seguir adelante?', en: 'Do you still mean to go further?' },
  '9A60': { es: '¿Así que cambiaste de idea?', en: 'So, you changed your mind?' },
  '9AD4': { es: 'Veamos si rompes mi defensa.', en: "Let's see you break through my defense." },
  '9B84': {
    es: 'Increíble. Me venciste.\nYa no tengo derecho a detenerte.\n\nSigue, si así lo quieres.\nMira con tus ojos lo que viene.\n\nTe deseo suerte. Adiós.',
    en: 'Unbelievable. You defeated me.\nI have no right to stop you now.\n\nGo on, if that is your wish.\nSee what lies ahead for yourself.\n\nI wish you luck. Farewell.',
  },
  '9CFC': {
    es: '¡Qué insolencia! ¿Desafiarme\ncon una técnica tan torpe?\n\nTu verdadera fuerza se prueba\nen esta Arena. Ahora, vete en paz.\n\nEsperaré tu regreso. Adiós.',
    en: 'Insolent! You challenge me\nwith such clumsy skills?\n\nYour true strength is tested\nin this Arena. Now, go in peace.\n\nI will await your return. Farewell.',
  },
  '9E74': D.saeta,
  '9F94': {
    es: 'Me llamo Campana...\nVeo que venciste a Saeta.\n\nPero tu fuerza no sirve contra mí.\n¡Inclínate ante mi fuerza antigua!',
    en: "My name is Campana...\nI see you defeated Saeta.\n\nBut your strength won't work on me.\nBow before my ancient power!",
  },
  A14C: { es: '¿Quieres ver mi lado salvaje?', en: 'Do you want to see my wild side?' },
  A1EC: { es: 'Parece que te falta valor.', en: "Looks like you're short on nerve." },
  A260: { es: '¡Siente mi fuerza antigua!\n¡BOOONG!', en: 'Feel my ancient power!\nBOOONG!' },
  A2FC: {
    es: '¡Sí! ¡Siento la sangre correr\ncomo en los viejos tiempos!\n\nVe a buscar tu destino.\nTu viaje está lejos de terminar.\n\n¡Pero no te rindas!\nSé que puedes lograrlo.\n\n¡Nunca te rindas!',
    en: "Yes! I feel my blood racing,\njust like in the old days!\n\nGo and find your destiny.\nYour journey is far from over.\n\nBut don't give up!\nI know you can do it.\n\nNever give up!",
  },
  A4BC: {
    es: 'Todavía no te alcanza.\n\nTienes que despertar el instinto\nsalvaje que llevas dentro.\n\nLo que te falta es experiencia.\nVe a ganar más EXP.\n\nConmigo puedes ganarla.\nAquí te estaré esperando.',
    en: "You're not good enough yet.\n\nYou need to awaken the wild\ninstinct inside you.\n\nWhat you need now is experience.\nGo and earn more EXP.\n\nYou can earn it with me.\nI'll be here, waiting for you.",
  },
  A694: D.campana,
  A7B8: {
    es: 'Soy Celeste.\nSabía que llegarías hasta aquí.\n\nSiento en ti tanta fuerza\ncomo en Tomás.\n\nMi misión es comprobar\nsi esa fuerza es real.\n\nDefendí esta Arena de muchos jugadores\nde cartas. A ti también te detendré.\n\nPrepárate para mi desafío.',
    en: 'I am Celeste.\nI knew you would make it this far.\n\nI sense as much strength in you\nas I do in Tomás.\n\nMy mission is to find out\nif that strength is real.\n\nI have defended this Arena from many\ncard players. I will stop you, too.\n\nPrepare to face my challenge.',
  },
  AA64: { es: '¿Aceptas el desafío?', en: 'Will you accept the challenge?' },
  AAF8: { es: 'Vuelve cuando sea el momento.', en: 'Come back when the time is right.' },
  AB64: { es: 'Da lo mejor de ti.', en: 'Give it your best.' },
  ABF4: {
    es: 'Así que tu fuerza es real.\nPerder no es costumbre para mí.\n\nQué sensación tan amarga.\n\nPero me dan ganas de entrenar más.\n\nDebes seguir tu búsqueda\nhasta encontrar tus respuestas.\n\nSi quieres, vuelve a verme aquí.\n\nTe estaré esperando.',
    en: "So your strength is real.\nI'm not used to losing.\n\nWhat a bitter feeling.\n\nBut it makes me want to train harder.\n\nYou must keep searching\nuntil you find your answers.\n\nIf you wish, come back and see me here.\n\nI'll be waiting.",
  },
  AE44: { who: null, es: '¡Felicitaciones por la victoria!\nRecibiste el pase\na Mirador de las Nubes.', en: 'Congratulations on your win!\nYou got the pass to Cloud Lookout.' },
  BA60: {
    es: 'No te desanimes.\nJugaste bastante bien.\n\nEsta vez gané yo, pero puede\nque no siga siendo así.\n\nEso te da un motivo\npara mejorar, ¿no?\n\nAhora ve. Tienes que seguir.\n\nEsperaré tu próximo desafío.',
    en: "Don't sulk.\nYou played quite well.\n\nI won this time, but it may\nnot stay that way for long.\n\nThat gives you a reason\nto improve, does it not?\n\nNow, go. You must move on.\n\nI'll await your next challenge.",
  },
  BC58: D.celeste,
  BD04: SHARED.leaveArena,

  // the Extra Arena, first tournament: Bollo, Barón, Alazán
  BDD4: extraClosed,
  BE34: SHARED.enterExtraArena,
  BFB0: {
    es: '¡Hola! ¡Qué alegría verte!\n\nGanar en esta Arena\nno va a ser nada fácil.\n\nEs la Arena de todas mis formas.\n¡Yo soy tu primer rival!\n\n¡Puede que te sorprenda!',
    en: "Hi! I'm so glad to see you!\n\nWinning in this Arena\nwon't be easy at all.\n\nThis is the Arena of all my shapes.\nI'm your first opponent!\n\nI might just surprise you!",
  },
  C1E8: { es: '¿Empezamos la batalla?', en: 'Ready to battle?' },
  C278: { es: '¿En serio? ¡Qué pena!\nTenía muchas ganas de jugar contigo.', en: 'Really? Aw, too bad.\nI really wanted to battle you.' },
  C318: { es: '¡Cuidado, que ahí voy!', en: 'Watch out, here I come!' },
  C3BC: {
    es: '¡Ay, no! ¡Perdí!\n¡Qué fuerte eres!\n\nPero con mi huevo del Valor\ntomaré la forma de Barón.\n\n¡No pienso perder! ¡Vamos!',
    en: "Oh no! I lost!\nYou're really strong!\n\nBut with my Egg of Courage\nI'll take the shape of Barón.\n\nI'm not going to lose! Let's go!",
  },
  C51C: {
    es: '¿Viste? ¡Gané!\nTienes que mejorar.\n\nSi ni a mí me puedes ganar,\nno vas a superar esta Arena.\n\nBueno, sigue intentándolo.\nAquí te espero.\n\n¡Adiós!',
    en: "See? I won!\nYou need to get better.\n\nIf you can't even beat me,\nyou'll never get through this Arena.\n\nWell, keep trying.\nI'll be waiting here.\n\nBye!",
  },
  C6AC: D.bollo,
  C7F8: {
    es: '¡Hola! Ahora soy Barón.\nMira el poder de mi huevo del Valor.\n\n¡Esto recién empieza!\nLa batalla de verdad todavía no llega.',
    en: "Hi! Now I'm Barón.\nSee the power of my Egg of Courage.\n\nWe're just warming up!\nThe real battle hasn't even started.",
  },
  C9B0: { es: '¿Empezamos en serio?', en: 'Shall we get started for real?' },
  CA50: { es: '¿Eh? ¡Vamos, anímate!', en: 'Huh? Come on, get with it!' },
  CAC4: { es: '¡Terminemos con esto!', en: "Let's get this over with!" },
  CB64: {
    es: 'Uf, me ganaste. No pude\nhacer nada. ¡Qué fuerte eres!\n\nParece que necesito entrenar más.\n\nAhora usaré el huevo de la Esperanza\npara tomar la forma de Alazán.\n\n¡La última batalla no la pierdo!',
    en: "Ugh, you got me. I couldn't\ndo a thing. You're strong!\n\nLooks like I need more training.\n\nNow I'll use the Egg of Hope\nto take the shape of Alazán.\n\nI won't lose the last battle!",
  },
  CD1C: {
    es: '¡Mi huevo del Valor es muy poderoso!\n\nSi no te lo tomas en serio,\nno vas a superar esta Arena.\n\nTienes que dar todo lo que tienes.\n¿Sí? Te espero.',
    en: "My Egg of Courage is so powerful!\n\nIf you don't get serious,\nyou won't conquer this Arena.\n\nYou have to give it all you've got.\nOK? I'll be waiting for you.",
  },
  CE80: D.baron,
  CFA8: {
    es: '¡En esta última batalla\nte venceré como Alazán!\n\n¡Mi luz deshace toda sombra!\nLibérate de la tuya.\n\n¡Cuidado, que esto puede doler!\n¡Ja, ja, ja!',
    en: "In this last battle,\nI'll beat you as Alazán!\n\nMy light breaks every shadow!\nRid yourself of yours.\n\nWatch out, this might sting!\nHa ha ha!",
  },
  D1B4: alazan.ask,
  D270: alazan.fear,
  D2E4: { es: '¡No hay tiempo para dudar!', en: 'There is no time to hesitate!' },
  D38C: {
    es: '¡Increíble! No vi ni una pizca\nde sombra en ti.\n\nTu espíritu te dará muchas\nvictorias, estoy seguro.\n\nPero no te confíes. La sombra entra\nen quien se cree invencible.\n\nSi alguna vez pierdes el rumbo,\nven a desafiarme.\n\n¡Limpiaremos juntos el espíritu!\nTe espero en el Café de batallas.\n\nAdiós.',
    en: "Incredible! I saw not a hint\nof shadow in you.\n\nYour spirit will bring you\nmany victories, I'm sure.\n\nBut don't get cocky. Shadow creeps\ninto those who think they can't lose.\n\nIf you ever lose your way,\ncome and challenge me.\n\nWe'll clear our spirits together!\nI'll be at the Battle Cafe.\n\nFarewell.",
  },
  D7E8: {
    es: 'Mmm, dudas demasiado.\nY la duda le abre paso a la sombra.\n\nDesafíame cuantas veces quieras.\n¡Limpiaremos juntos el espíritu!\n\nSiempre te estaré esperando.\nAdiós.',
    en: "Hmm, you hesitate too much.\nAnd doubt lets the shadow in.\n\nChallenge me as often as you like.\nWe'll clear our spirits together!\n\nI'll always be here, waiting.\nFarewell.",
  },
  D96C: D.alazan,
  DA20: SHARED.leaveArena,

  // the Extra Arena, second tournament: Barón, Alazán, Custodio
  DAB0: SHARED.enterExtraArena,
  DCB4: { es: '¿Empezamos la batalla de verdad?', en: 'Ready for the real battle?' },
  DD54: { es: '¿Qué? ¡Vamos, ponte las pilas!', en: 'What? Come on, get with the program!' },
  DDD0: { es: '¡Vamos, a jugar!', en: "Come on, let's do this!" },
  DE6C: {
    es: 'Uf, me ganaste...\n¡No pude hacer nada! Qué fuerte eres.\n\n¡Desde ahora voy en serio!\n\nUsaré el huevo de la Esperanza\npara tomar la forma de Alazán.\n\n¡La próxima no la pierdo!',
    en: "Ugh, you beat me...\nI couldn't do a thing! You're strong.\n\nI'm getting serious from now on!\n\nI'll use the Egg of Hope\nto take the shape of Alazán.\n\nI won't lose the next one!",
  },
  E010: {
    es: '¡Mi huevo del Valor es increíble!\n\nSi no te lo tomas en serio,\nno vas a pasar esta Arena.\n\nJuega como si te fuera la vida en ello.\n¿Sí? Te espero.',
    en: "My Egg of Courage is incredible!\n\nIf you don't get serious,\nyou won't get through this Arena.\n\nPlay like your life depends on it.\nOK? I'll be waiting for you.",
  },
  E184: D.baron,
  E334: { es: '¡Que brille la luz!\n¿Empezamos?', en: 'Let the light shine!\nShall we begin?' },
  E3E8: { es: 'El miedo pudo más que tú.', en: 'Your fear got the better of you.' },
  E468: { es: '¡Libérate de la duda!', en: 'Free yourself from doubt!' },
  E510: {
    es: '¡Asombroso! No vi ni una pizca\nde sombra en ti.\n\nTu espíritu limpio te traerá\nmás victorias.\n\nPero alcanzaré mi forma Perfecta,\nCustodio, ¡y te desafiaré otra vez!\n\n¡Brillará una luz todavía mayor!\n¿Podrás resistirla?',
    en: "Amazing! I saw not a hint\nof shadow in you.\n\nYour clear spirit will bring you\nmore victories.\n\nBut I'll reach my Apex shape,\nCustodio, and challenge you again!\n\nAn even greater light will shine!\nCan you stand up to it?",
  },
  E728: {
    es: 'Mmm, todavía siento mucha duda en ti.\nPor ahí entra la sombra.\n\nDesafíame cuantas veces quieras.\n¡Limpiaremos juntos el espíritu!\n\nSiempre te estaré esperando aquí.\nAdiós.',
    en: "Hmm, I still sense much doubt in you.\nThat is how the shadow gets in.\n\nChallenge me as often as you like.\nWe'll clear our spirits together!\n\nI'll always be waiting here.\nFarewell.",
  },
  E8AC: D.alazan,
  E9D0: {
    es: 'Soy Custodio.\nYo mantengo el orden en este mundo.\n\n¡Mi luz detendrá a todo jugador\nde corazón oscuro!\n\n¿Crees que puedes resistir\nel juicio de la luz?',
    en: 'I am Custodio.\nI keep order in this world.\n\nMy light will stop every player\nwith a dark heart!\n\nDo you think you can withstand\nthe judgment of light?',
  },
  EBE8: { es: 'Es hora de combatir.\n¿Empezamos?', en: 'It is time to battle.\nShall we begin?' },
  EC7C: { es: 'Borra toda sombra de tu corazón.', en: 'Wipe every shadow from your heart.' },
  ECFC: custodio.feel,
  EDB0: {
    es: '¡Qué luz tan brillante hay\nen tu corazón!\n\nNo vi ni una duda\nen tu manera de jugar.\n\nEso te llevó a la victoria.\n\nAyúdame a mantener el orden\nen este mundo.\n\nSeguro que llevarás tu luz\na tus próximos rivales.\n\n¡Te deseo suerte!',
    en: "What a bright light\nshines in your heart!\n\nI saw no sign of doubt\nin the way you play.\n\nThat is what led you to victory.\n\nHelp me keep order\nin this world.\n\nI'm sure you will carry your light\nto your next opponents.\n\nI wish you luck!",
  },
  F1BC: {
    es: 'Si tienes dudas, pierdes.\n\nLa duda nace de la sombra.\nNo dejes que el miedo te controle.\n\nDespeja tu mente al jugar.\nPuedes desafiarme cuando quieras.\n\nTe espero aquí, en esta Arena.',
    en: "If you have doubts, you lose.\n\nDoubt is born from shadow.\nDon't let your fears control you.\n\nClear your mind when you play.\nYou may challenge me anytime.\n\nI'll be waiting here in this Arena.",
  },
  F380: D.custodio,
  F434: SHARED.leaveArena,

  // the Extra Arena, third tournament: Alazán, Custodio, Serafín
  F4C4: SHARED.enterExtraArena,
  F6CC: { es: '¡La luz está a punto de brillar!\n¿Empezamos?', en: 'The light is about to shine!\nShall we begin?' },
  F788: alazan.fear,
  F7F8: { es: '¡Borra toda duda de tu mente!', en: 'Erase all doubt from your mind!' },
  F8A4: {
    es: '¡Increíble! No hay ni una pizca\nde sombra en ti.\n\nTu corazón es de los más puros.\nTe dará muchas victorias.\n\nPero alcanzaré mi forma Perfecta,\nCustodio, ¡y te desafiaré otra vez!\n\n¡Brillaré todavía más!\n¿Podrás aguantarlo?',
    en: "Incredible! There isn't a hint\nof shadow in you.\n\nYours is the purest of hearts.\nIt will bring you many victories.\n\nBut I'll reach my Apex shape,\nCustodio, and challenge you again!\n\nI will shine even brighter!\nCan you take it?",
  },
  FAB4: {
    es: 'Todavía siento duda en ti.\nY la duda puede dejar entrar la sombra.\n\nDesafíame cuantas veces quieras.\n¡Limpiaremos juntos el espíritu!\n\nSiempre te estaré esperando aquí.\nAdiós.',
    en: "I still sense some doubt in you.\nAnd doubt can let the shadow in.\n\nChallenge me as often as you like.\nWe'll clear our spirits together!\n\nI'll always be waiting here.\nFarewell.",
  },
  FC40: D.alazan,
  FDEC: { es: 'Es hora de pelear.\n¿Empezamos?', en: 'It is time to fight.\nShall we begin?' },
  FE80: { es: 'Aleja la oscuridad de tu corazón.', en: 'Drive the darkness from your heart.' },
  FF00: custodio.feel,
  FFB4: {
    es: '¡Qué luz tan brillante hay\nen tu corazón!\n\nNo dudaste ni un instante\nen toda la batalla.\n\nPor eso ganaste.\nMi deber es mantener el orden.\n\nLa próxima batalla, con mi forma\nmás alta, Serafín, lo decidirá todo.\n\n¡Te espero!',
    en: "What a bright light\nshines in your heart!\n\nYou didn't hesitate for a moment\nduring our battle.\n\nThat is why you won.\nMy duty is to keep order.\n\nThe next battle, in my highest\nshape, Serafín, will decide it all.\n\nI'll be waiting!",
  },
  '101F8': {
    es: 'Si dudas, pierdes.\n\nLa sombra se adueñará de ti.\n\nAsí que no dudes.\nDespeja tu mente al jugar.\n\nDesafíame cuando quieras.\nTe espero aquí, en esta Arena.',
    en: "You'll lose if you hesitate.\n\nThe shadow will take hold of you.\n\nSo don't hesitate.\nClear your mind when you play.\n\nChallenge me anytime.\nI'll be waiting here in this Arena.",
  },
  '103B0': D.custodio,
  '104D4': {
    es: 'Soy Serafín.\nEsta es mi forma más alta.\n\nMis alas de oro alejan toda sombra.\nNo hay nada que temer.\n\nSi tu espíritu es puro,\nestas alas te protegerán.\n\nComencemos la batalla.',
    en: 'I am Serafín.\nThis is my highest shape.\n\nMy golden wings drive off all shadow.\nThere is nothing to fear.\n\nIf your spirit is pure,\nthese wings will protect you.\n\nLet us begin the battle.',
  },
  '10710': { es: '¿Seguro que quieres enfrentarme?', en: 'Are you sure you want to face me?' },
  '10798': { es: '¡Confía en tu instinto!', en: 'Trust your instincts!' },
  '10804': { es: '¡Que la sombra caiga ante la justicia!', en: 'Let the shadow fall before justice!' },
  '108B4': {
    es: 'Encontré una nueva luz en este mundo.\nNo hay nada más que decir.\n\nSigue tu propio camino\ny encontrarás la respuesta.\n\nDescubre más luz\njugando conmigo.\n\n¡Te espero en el Café de batallas!',
    en: "I have found a new light in this world.\nThere is nothing more to say.\n\nKeep walking your own path,\nand you shall find the answer.\n\nDiscover more light\nby dueling with me.\n\nI'll be waiting at the Battle Cafe!",
  },
  '10C40': {
    es: 'Una niebla gris quiere borrar\nlas formas de este mundo.\n\nNecesitamos tu ayuda.\n\nNo hay tiempo que perder.\nEste mundo necesita una nueva luz.\n\nDesafíame hasta que puedas vencerme.\n¡Muéstrame tu verdadera fuerza!',
    en: 'A grey fog wants to erase\nthe shapes of this world.\n\nWe need your help.\n\nThere is no time to waste.\nThis world needs a new light.\n\nKeep challenging me until you win.\nShow me your true strength!',
  },
  '10DD0': D.serafin,
  '10E80': SHARED.leaveArena,
};
