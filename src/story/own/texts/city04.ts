/**
 * Chatarral (city 4): a town built from scrap, where the Collector's spell keeps many creatures
 * quiet. Cuerda and Babosín play at the café; Rey Basural, who somehow is under nobody's spell, sends
 * the player to the Arena to beat Humo, then keeps the pass to Lampless City until he loses in his own
 * Arena. The later phases of the town are in city04later.ts.
 */
import { CITY04_LATER } from './city04later';
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });
const cuerdaDeck = deck('*c3Mazo Caja de Sorpresas\nUn mazo que salta cuando menos\nlo esperas, como un muñeco de resorte.', '*c3Surprise Box Deck\nA deck that springs out when you\nleast expect it, like a wind-up toy.');
const babosinDeck = deck('*c3Mazo Baba Pegajosa\nUn mazo retorcido que no deja\nque el rival evolucione.', '*c3Sticky Slime Deck\nA twisted deck that keeps\nthe rival from evolving.');
const reyDeck = deck('*c3Mazo ¡Viva el Rey!\nUn mazo descarado que obliga\nal rival a descartar cartas.', '*c3Long Live the King Deck\nA shameless deck that forces\nthe rival to discard cards.');
const humoDeck = deck('*c3Mazo Cortina de Humo\nUn mazo Rojo y Sombrío que evoluciona\ny cubre sus propios puntos débiles.', '*c3Smokescreen Deck\nA Red and Shadow deck that evolves\nand covers its own weak spots.');

// Cuerda: a wind-up gear creature, cheeky and restless
const cuerda = {
  ask: { es: '¿Jugamos? ¡Cric, cric, cric!', en: 'Want to play? Crick, crick, crick!' },
  no: { es: '¿No? Mejor, así descanso.\n¡Cric, cric!', en: 'No? Good, I get to rest.\nCrick, crick!' },
  lost: {
    es: '¡Cric, cric, cric! ¿Perdí?\n¡Un momento! ¡Cric, cric, cric!\n\n¡Eso no es justo! ¡Cric, cric!\nNo vuelvas nunca más por aquí.\n\nAdiós. ¡Cric, cric, cric!',
    en: "Crick, crick, crick! I lost?\nWait a second! Crick, crick, crick!\n\nThat's not fair! Crick, crick!\nDon't ever come back here.\n\nBye-bye. Crick, crick, crick!",
  },
  won: {
    es: '¡Cric, cric, cric! ¡Gané!\nA ti te falta cuerda. ¡Cric, cric!\n\nVuelve cuando quieras. ¡Cric, cric!\n¡Ja, ja, ja! ¡Cric, cric, cric!',
    en: "Crick, crick, crick! I won!\nYou're all wound down. Crick, crick!\n\nCome back anytime. Crick, crick!\nHa ha ha! Crick, crick, crick!",
  },
};

// Babosín: a shy slug in a shell who apologizes for everything
const babosin = {
  wait: { es: '¡Ay, perdón! Tómate tu tiempo.', en: "Oh, I'm sorry! Take your time." },
  go: { es: 'Bueno... entonces, empecemos.', en: "Well... let's begin, then." },
  lost: {
    es: 'Perdón por no ser un rival\nmás difícil...\n\nHice lo que pude, pero no soy\nmuy buen jugador de cartas.\n\nSigue así. ¡Mucha suerte!\n\nBueno, ya me voy.',
    en: "Sorry I couldn't be\na tougher rival...\n\nI did what I could, but I'm not\nmuch of a card player.\n\nKeep it up. Good luck!\n\nWell, I'd better get going.",
  },
  won: {
    es: 'Perdón... No quería\nponerme tan serio.\n\nEspero no haberte hecho\npasar un mal rato...\n\nSi quieres jugar conmigo otra vez,\ngolpea mi caparazón: toc, toc.\n\nBueno, ya me voy.',
    en: "I'm sorry... I didn't mean\nto get so serious.\n\nI hope I didn't give you\na bad time...\n\nIf you want to play me again,\njust knock on my shell.\n\nWell, I'd better get going.",
  },
};

// Rey Basural: rules the junk heaps, gives orders, hiccups, and never admits a loss
const rey = {
  goBeat: { es: 'Solo ve a la Arena y vence\na esos malvados. Nada más. ¡Hip!', en: "Just go to the Arena and beat\nthose villains. That's all. Hic!" },
  counting: { es: 'Cuento contigo. ¡Rápido! ¡Hip!', en: "I'm counting on you. Hurry! Hic!" },
  noUse: { es: 'Ya no me sirves. ¡Hip!', en: 'I have no more use for you. Hic!' },
  letYouWin: { es: '¡Qué insolencia! ¡Hip!\nTe dejé ganar, eso es todo.', en: "The nerve of you! Hic!\nI let you win, that's all." },
  ask: { es: 'Deja de perder el tiempo. ¡Hip!\n¿Empezamos o no?', en: 'Stop wasting time. Hic!\nAre we starting or not?' },
  backOut: { es: '¿Cómo? ¿Ahora te echas atrás?', en: 'What? Backing out now?' },
};

const ARRIVAL: CityTexts = {
  // Cuerda, at the café
  '1314': {
    es: 'Las criaturas de la facción Rara\nsomos todas raras. ¡Rarísimas!\n¡Cric, cric, cric!\n\nAsí que cuidado al usarnos.\n¡Cric, cric!',
    en: 'We Rare faction creatures\nare rarely normal. Very rarely!\nCrick, crick, crick!\n\nSo be careful when you use us.\nCrick, crick!',
  },
  '1408': { who: 'me', es: 'Qué criatura tan curiosa...', en: 'What a curious creature...' },
  '1468': cuerda.ask,
  '1508': cuerda.no,
  '1588': { es: '¿Así que quieres darme cuerda?\n¡A ver qué tal!', en: "So you want to wind me up?\nLet's see how it goes!" },
  '1638': cuerda.lost,
  '17A4': cuerda.won,
  '18C4': cuerdaDeck,

  // Babosín, at the café
  '1A50': {
    es: 'Quisiera darte un consejo.\nBueno, no es muy útil, pero...\n\nLo mejor de las criaturas de la\nfacción Rara son sus efectos de soporte.\n\nCon tantos efectos especiales,\npuedes tener al rival confundido.\n\nEso es lo que distingue\na la facción Rara.\n\nPero su poder, en general,\nes bastante normal.\n\nNi muy alto ni muy bajo.\nNormal y nada más.\n\nOtra pista, para armar un mazo\nde la facción Rara...\n\n...lleva siempre cartas que ataquen\nla Mano y el Mazo del rival.\n\nY recuerda: todo mazo necesita\nun objetivo claro.\n\nOjalá te sirva de algo...',
    en: "I'd like to give you some advice.\nWell, it's not very useful, but...\n\nThe best thing about Rare faction\ncreatures is their Support effects.\n\nWith so many special effects,\nyou can keep your rival confused.\n\nThat's what the Rare\nfaction is all about.\n\nBut their power, overall,\nis pretty ordinary.\n\nNot too high, not too low.\nJust ordinary.\n\nAnother tip, for building\na Rare faction deck...\n\n...always carry cards that attack\nyour rival's Hand and Deck.\n\nAnd remember: every deck needs\na clear goal.\n\nI hope that helps a little...",
  },
  '1EE0': { es: 'Si no es molestia...\n¿quieres jugar una partida?', en: "If it's no trouble...\nwould you like to play a match?" },
  '1F90': { es: 'No quiero apurarte...\nTómate todo el tiempo que necesites.', en: "I don't want to rush you...\nTake all the time you need." },
  '2030': babosin.go,
  '20DC': babosin.lost,
  '229C': babosin.won,
  '2460': babosinDeck,

  // Rey Basural asks the player to throw the villains out of his Arena
  '2528': { es: 'Soy el Rey Basural. ¡Hip!', en: "I'm the Junk King. Hic!" },
  '258C': { who: 'me', es: 'Soy *h0. Mucho gus...', en: "I'm *h0. Nice to me..." },
  '25E8': { es: 'Aquí el rey soy yo,\nasí que yo doy las órdenes. ¡Hip!', en: "I'm the king here,\nso I give the orders. Hic!" },
  '2660': { who: 'me', es: '¿Eh...?', en: 'Huh...?' },
  '26AC': { es: '¡Echa a todos los malvados\nde la Arena de este pueblo!', en: "Throw every last villain\nout of this town's Arena!" },
  '2734': { who: 'me', es: '¿Malvados...?', en: 'Villains...?' },
  '2788': {
    es: 'Unos malvados se adueñaron de mi\npueblo y de mi Arena. ¡Hip!\n\nHay que hacer algo, o este montón\nde chatarra no tendrá futuro. ¡Hip!',
    en: 'Some villains took over my town\nand my Arena. Hic!\n\nSomething must be done, or this\njunk heap has no future. Hic!',
  },
  '28A0': { who: 'me', es: '¿Tú también estás bajo el hechizo\ndel Coleccionista?', en: "Are you under the Collector's\nspell, too?" },
  '2904': { es: '¿Yo? No estoy bajo el hechizo\nde nadie. ¡Hip!', en: "Me? I'm under nobody's spell.\nHic!" },
  '2974': { who: 'me', es: '¡Espera! ¿Y por qué tú no caíste\nen su hechizo, si los demás sí?', en: "Wait! How come you didn't fall\nunder his spell, when the others did?" },
  '29FC': {
    es: '¡Basta de preguntas! ¡Hip!\nTe ordeno que los eches. ¿Entendido?\n\nSi te deshaces de esos malvados,\nte daré una recompensa. ¡Hip!',
    en: "Enough questions! Hic!\nI order you to throw them out. Got it?\n\nIf you get rid of those villains,\nI'll give you a reward. Hic!",
  },
  '2AFC': { who: 'me', es: '¿Una recompensa? ¿Hablas del pase?', en: 'A reward? You mean the pass?' },
  '2B60': {
    es: 'Si eso quieres, te daré el pase\nal pueblo siguiente.\n\n¿De acuerdo? ¡Pues date prisa! ¡Hip!',
    en: "If that's what you want, I'll give you\nthe pass to the next town.\n\nDeal? Then hurry up! Hic!",
  },
  '2C4C': { who: 'me', es: 'Pero ¿qué es lo que quieres tú?', en: 'But what is it that you want?' },
  '2CA8': {
    es: `${rey.goBeat.es}\n\nYo era el maestro de esta Arena,\n¡pero me la quitaron! ¡Hip!\n\n¡Qué rabia me da! ¡Me dan ganas de...!\n¡Hip!`,
    en: `${rey.goBeat.en}\n\nI was the master of this Arena,\nbut they took it from me! Hic!\n\nIt makes me so mad! I could just...!\nHic!`,
  },
  '2E14': { who: 'me', es: '¡Está bien, está bien!\nVoy ahora mismo.', en: "OK, OK!\nI'll go right now." },
  '2E84': rey.counting,

  // after Humo is beaten, the king keeps the pass for himself
  '304C': { es: 'Bien, bien. Te deshiciste de ellos.\nTe lo agradezco. ¡Hip!\n\n...', en: 'Good, good. You got rid of them.\nI thank you. Hic!\n\n...' },
  '3114': { who: 'me', es: '¿Qué pasa?', en: 'What is it?' },
  '3164': { es: '¿Qué? Ya no me sirves. ¡Hip!\nPuedes retirarte. ¡Hip!', en: 'What? I have no more use for you. Hic!\nYou are dismissed. Hic!' },
  '31FC': { who: 'me', es: '¿Y el pase...?', en: 'What about the pass...?' },
  '325C': { es: '¿De qué hablas?', en: 'What are you talking about?' },
  '32C4': { who: 'me', es: '¡Dijiste que si vencía a Humo,\nme darías el pase!', en: "You said if I beat Humo,\nyou'd give me the pass!" },
  '3358': { es: 'No puedo darte el pase\nhasta que ganes en la Arena. ¡Hip!', en: "I can't give you the pass\nuntil you win at the Arena. Hic!" },
  '33F0': { who: 'me', es: '¡Eso no es justo!', en: "That's not fair!" },
  '3444': { es: '¡Silencio, y a ganar en la Arena!\n¡Ahora el maestro soy yo! ¡Hip!', en: "Quiet, and go win at the Arena!\nI'm the master now! Hic!" },
  '34E4': { who: 'me', es: '¡Pero si ya te gané antes!', en: 'But I already beat you before!' },
  '353C': { es: 'Aquella vez te dejé ganar. ¡Hip!\nEso es todo. ¡Ahora, fuera!', en: "I let you win that time. Hic!\nThat's all. Now, off you go!" },

  // Rey Basural at the café, in every phase
  '3750': { es: `${rey.goBeat.es}\n\n${rey.counting.es}`, en: `${rey.goBeat.en}\n\n${rey.counting.en}` },
  '3848': rey.noUse,
  '38C0': rey.letYouWin,
  '395C': { es: 'Deja de perder el tiempo. ¡Hip!\n¿Jugamos o no?', en: 'Stop wasting my time. Hic!\nAre we playing or not?' },
  '39FC': rey.backOut,
  '3A74': { es: 'Está bien, está bien. ¡Juguemos! ¡Hip!', en: "Fine, fine. Let's play! Hic!" },
  '3B20': { es: `¡Perdí a propósito otra vez! ¡Hip!\n¡Igual que la última vez!\n\n${rey.letYouWin.es}`, en: `I lost on purpose again! Hic!\nJust like last time!\n\n${rey.letYouWin.en}` },
  '3D50': {
    es: '¿Lo ves? Este es mi verdadero poder.\n¡Hip! ¡Ja, ja, ja, ja!\n\n¡Cabeza de chatarra!\nTienes que ganarme. ¡Hip!\n\nAunque nunca lo vas a lograr. ¡Hip!',
    en: 'You see? This is my true power.\nHic! Ha ha ha ha!\n\nYou scrap-head!\nYou have to beat me. Hic!\n\nNot that you ever will. Hic!',
  },
  '3E9C': reyDeck,

  // Humo's deck, asked at the café
  '5784': humoDeck,

  // the first tournament: Cuerda, Babosín, Rey Basural, then Humo
  '8FCC': {
    es: 'Soy Cuerda. ¡Cric, cric, cric!\nAlguien me dio cuerda, y aquí estoy.\n\nConmigo siempre hay sorpresas. ¡Cric!\nSi pierdes, te quedas sin cuerda.',
    en: "I'm Cuerda. Crick, crick, crick!\nSomeone wound me up, and here I am.\n\nWith me, there are always surprises!\nLose, and you'll be all wound down.",
  },
  '9160': { es: '¿Empezamos? ¡Cric, cric, cric!', en: 'Shall we start? Crick, crick, crick!' },
  '9200': cuerda.no,
  '9280': { es: '¿Así que quieres enfrentarme?\n¡Cric, cric! ¡Vamos!', en: 'So you want to take me on?\nCrick, crick! Here we go!' },
  '9328': cuerda.lost,
  '94A8': cuerda.won,
  '95CC': cuerdaDeck,
  '96E4': {
    es: 'Hola. Me llamo Babosín.\nSiempre le doy vueltas a todo.\n\nA mi futuro, por ejemplo...\nTengo tantas preocupaciones...\n\nY últimamente siento la cabeza\npesada, como si no fuera yo.\n\nBueno, ¿empezamos?',
    en: "Hello. My name is Babosín.\nI'm always thinking things over.\n\nMy future, for example...\nI have so many worries...\n\nAnd lately my head feels heavy,\nas if I weren't myself.\n\nWell, shall we begin?",
  },
  '9964': { es: 'Entonces... ¿empezamos?', en: 'So... shall we start?' },
  '9A14': babosin.wait,
  '9AA4': { es: 'Bueno... empecemos.', en: "Well... let's get started." },
  '9B44': babosin.lost,
  '9CE8': babosin.won,
  '9E90': babosinDeck,
  '9FC4': {
    es: 'Como ya te dije, soy el Rey Basural.\n¡Hip! El verdadero maestro de esta Arena.\n\nAnda, gáname a mí y después\na ese Humo. ¡Vamos! ¡Hip!\n\n¡Y no me hagas esperar! ¡Hip!',
    en: "Like I told you, I'm the Junk King.\nHic! The true master of this Arena.\n\nGo on, beat me, then beat\nthat Humo. Come on! Hic!\n\nAnd don't keep me waiting! Hic!",
  },
  'A120': { who: 'me', es: '¿Y a este qué le pasa?', en: "What's with this guy?" },
  'A17C': { es: '¡Bah! Deja de perder el tiempo. ¡Hip!', en: 'Bah! Stop wasting time. Hic!' },
  'A1E8': { who: 'me', es: '¿Y todo esto para qué?', en: "What's all this for, anyway?" },
  'A2F8': rey.ask,
  'A3A4': rey.backOut,
  'A41C': { es: '¡Bien! ¡Hora de jugar! ¡Hip!', en: 'Good! Battle time! Hic!' },
  'A4C0': {
    es: '¡Hip! ¡Perdí a propósito!\nAhora ve y gánale al siguiente.\n\n¡Rápido! ¡Hip! Y no olvides\nque perdí a propósito.\n\n¡Y ahora gana la próxima! ¡Hip!',
    en: "Hic! I lost on purpose!\nNow go beat the next one!\n\nHurry! Hic! And don't forget\nthat I lost on purpose.\n\nYou'd better win the next match! Hic!",
  },
  'A62C': {
    es: '¿Qué haces perdiendo contra mí? ¡Hip!\n\n¡Cabeza de chatarra!\n¡Tienes que ganarme! ¡Hip!\n\n¡No me hagas esperar! ¡Hip!',
    en: "What are you doing losing to me? Hic!\n\nYou scrap-head!\nYou have to beat me! Hic!\n\nDon't keep me waiting! Hic!",
  },
  'A754': reyDeck,
  'A87C': {
    es: '¡El maestro de esta Arena soy yo!\nMe llamo Humo.\n\nEsta será tu última batalla.\n\nNo puedo dejarte pasar.\nTengo mis motivos.',
    en: "I am the master of this Arena!\nMy name is Humo.\n\nThis will be your final battle.\n\nI can't let you go any further.\nI have my reasons.",
  },
  'AA2C': { who: 'me', es: '¿Qué motivos? ¿Recibes órdenes\ndel Coleccionista?', en: 'What reasons? Are you taking\norders from the Collector?' },
  'AABC': {
    es: '¡Silencio! No es asunto tuyo.\n¡Yo no recibo órdenes de nadie!\n\nEstoy aquí por voluntad propia.\nPor él...\n\n¡Aquí te voy a detener!',
    en: "Silence! That's none of your business.\nI don't take orders from anyone!\n\nI stand here of my own will.\nFor him...\n\nThis is where I stop you!",
  },
  'ACD4': { es: '¡Vas a perder! ¿Te atreves a jugar?', en: "You're going to lose! Dare to play?" },
  'AD70': { es: '¡Ja! Haces bien en tenerme miedo.', en: "Ha! You're right to be afraid of me." },
  'ADEC': { es: '¡No pienso perder!', en: 'I refuse to lose!' },
  'AE80': {
    es: '¡No...! ¿Por qué? ¿Por qué?\n\nNo tengo fuerzas...\nPerdóname...\n\n¡Te derrotaré en la Arena Embrujada\nde Ciudad sin Faroles!\n\n¡Nunca me voy a rendir!',
    en: "No...! Why? Why?\n\nI'm so powerless...\nForgive me...\n\nI'll defeat you at the Haunted Arena\nin Lampless City!\n\nI will never give up!",
  },
  'AFE8': { who: 'me', es: '...', en: '...' },
  'B034': { es: '¡Nos volveremos a ver!\nDe eso no tengas duda.', en: "We'll meet again!\nYou can count on it!" },
  'B0AC': { who: 'me', es: 'Quizás no sea tan malo\ncomo parece...', en: "Maybe he's not as bad\nas he seems..." },
  'B138': {
    es: '¡Gané! ¡Gané!\n¡Lo hice por ti! ¡Gané!\n\nYa viste mi verdadero poder.\nNo puedes conmigo.\n\nEsta es mi Arena.\nNadie se interpone en mi camino.',
    en: "I won! I won!\nI did it for you! I won!\n\nNow you've seen my true power.\nYou're no match for me.\n\nThis is my Arena.\nNo one stands in my way.",
  },
  'B280': humoDeck,

  // the second tournament: Cuerda, Babosín, then Rey Basural, who holds the pass
  'B668': { es: '¿Empezamos? ¡Cric, cric, cric!', en: 'Shall we start? Crick, crick, crick!' },
  'B708': cuerda.no,
  'B788': { es: '¿Otra vez quieres enfrentarme?\n¡Cric, cric! ¡Vamos!', en: 'You want to take me on again?\nCrick, crick! Here we go!' },
  'B82C': {
    es: '¡Cric, cric, cric! ¿Perdí?\n¡Qué rabia! ¡Cric, cric, cric!\n\nOdio perder. ¡Cric, cric!\n¡Ya no juego más! ¡Cric!\n\nAdiós. ¡Cric, cric, cric!',
    en: 'Crick, crick, crick! I lost?\nHow annoying! Crick, crick, crick!\n\nI hate losing. Crick, crick!\nI quit! Crick!\n\nBye-bye. Crick, crick, crick!',
  },
  'B98C': {
    es: '¡Cric, cric, cric! ¡Gané!\n¡Qué poca cosa! ¡Cric, cric!\n\nVuelve cuando quieras. ¡Cric, cric!\n¡Ja, ja, ja! ¡Cric, cric, cric!',
    en: 'Crick, crick, crick! I won!\nThat was nothing! Crick, crick!\n\nCome back anytime. Crick, crick!\nHa ha ha! Crick, crick, crick!',
  },
  'BAB0': cuerdaDeck,
  'BC50': { es: 'El tiempo pasa...\n¿Empezamos?', en: "Time's ticking...\nShall we start?" },
  'BD04': babosin.wait,
  'BD94': babosin.go,
  'BE40': {
    es: 'Perdón por no ser un rival\nmás difícil...\n\nHice lo que pude, pero...\nya sabes cómo es esto.\n\nSigue así. ¡Mucha suerte!\n\nYa me voy.',
    en: "Sorry I couldn't be\na tougher rival...\n\nI did what I could, but...\nyou know how it is.\n\nKeep it up. Good luck!\n\nI'll be going now.",
  },
  'BFD4': {
    es: 'Perdón... No quería\nponerme tan serio.\n\nEspero no haber herido\ntu orgullo...\n\nSi quieres jugar conmigo otra vez,\ngolpea mi caparazón: toc, toc.\n\nBueno, ya me voy.',
    en: "I'm sorry... I didn't mean\nto get so serious.\n\nI hope I didn't hurt\nyour pride...\n\nIf you want to play me again,\njust knock on my shell.\n\nWell, I'd better get going.",
  },
  'C18C': babosinDeck,
  'C2C0': {
    es: 'Soy el Rey Basural. ¡Hip!\nY el maestro de esta Arena. ¡Hip!\n\n¿Así que quieres el pase al pueblo\nsiguiente? ¿Quién te crees? ¡Hip!\n\nSi tanto lo quieres, primero\ntendrás que ganarme. ¡Hip!\n\nLa otra vez perdí a propósito. ¡Hip!\nEsta vez te voy a aplastar. ¡Hip!',
    en: "I'm the Junk King. Hic!\nAnd the master of this Arena. Hic!\n\nSo you want the pass to the next\ntown? Who do you think you are? Hic!\n\nIf you want it that badly,\nyou'll have to beat me first! Hic!\n\nI lost on purpose last time. Hic!\nThis time I'll crush you. Hic!",
  },
  'C4C8': { who: 'me', es: '¡Pero qué complicado eres!', en: "Wow, you're impossible!" },
  'C528': { es: '¡Silencio! ¡Hip!', en: 'Silence! Hic!' },
  'C630': rey.ask,
  'C6DC': rey.backOut,
  'C754': { es: 'Está bien, está bien. ¡Vamos! ¡Hip!', en: "Fine, fine. Let's go! Hic!" },
  'C7FC': { es: `Te volví a dejar ganar,\n¡igual que la última vez! ¡Hip!\n\n${rey.letYouWin.es}`, en: `I let you win again,\njust like last time! Hic!\n\n${rey.letYouWin.en}` },
  'C924': { who: null, es: '¡Felicitaciones por la victoria!\nRecibiste el pase a Ciudad sin Faroles.', en: 'Congratulations on your win!\nYou got the pass to Lampless City.' },
  'D714': {
    es: '¡Ya viste mi verdadero poder! ¡Hip!\n¡Ja, ja, ja, ja!\n\nHasta la chatarra juega mejor. ¡Hip!\nVuelve más tarde. ¡Hip!\n\nTotal, nunca me vas a ganar. ¡Hip!',
    en: "Now you've seen my true power! Hic!\nHa ha ha ha!\n\nEven scrap plays better than you. Hic!\nTry again later. Hic!\n\nYou'll never beat me anyway. Hic!",
  },
  'D86C': reyDeck,
};

export const CITY04: CityTexts = { ...ARRIVAL, ...CITY04_LATER };
