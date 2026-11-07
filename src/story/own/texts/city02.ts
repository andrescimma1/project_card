/**
 * Bosque Hondo (city 2): a deep forest of huge trees, moss and rope bridges. The arena master, Escamo, is
 * under the Collector's spell, and Hebra, the Collector's partner, has taken over the arena. Lía, a
 * traveller, tells the player that someone is taking over the arenas. Musgo and Sigilo play at the café
 * and in the arena; once Hebra loses, Escamo wakes up and gives the pass to Frost Harbor.
 * The later phases of the forest (Trino's Extra Arena, Coloso's Beetle Arena, Mina and Azucena) are in
 * city02later.ts.
 */
import { CITY02_LATER } from './city02later';
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });
const musgoDeck = deck('*c3Mazo Brote Veloz\nUn mazo que evoluciona muy rápido.', '*c3Quick Sprout Deck\nA deck that evolves very quickly.');
const sigiloDeck = deck('*c3Mazo Relevo\nCambia rápido entre Novatos\ny Campeones.', '*c3Relay Deck\nSwitches quickly between\nNovices and Veterans.');
const escamoDeck = deck('*c3Mazo Escama Victoriosa\nUn mazo equilibrado\ncon Escamo como estrella.', '*c3Victory Scale Deck\nA well-balanced deck\nstarring Escamo.');
const liaDeck = deck('*c3Mazo ¡Bingo!\nTe confunde con un montón\nde cartas de azar.', '*c3Bingo! Deck\nIt confuses you with all kinds\nof Gamble cards.');
const hebraDeck = deck(
  '*c3Mazo de Prueba\nNo subestimes la carta de Hebra.\nSi lo haces, lo vas a lamentar.',
  "*c3Tryout Deck\nDon't underestimate the Hebra card.\nIf you do, you'll regret it.",
);

// Musgo, a moss creature who grows (and evolves) faster than anyone, and never stops snickering
const musgo = {
  ask: { es: '¡Vamos, vamos! ¿Empezamos?', en: 'Come on, come on! Shall we start?' },
  go: { es: '¡Ñaca, ñaca, ñaca!', en: 'Nyeh heh heh!' },
  lost: {
    es: '¡Rayos! ¡Perdí!\nJuegas bastante bien. ¡Ñaca, ñaca!\n\nPero no te confíes.\n¡Un día de estos te va a ir mal!',
    en: "Rats! I lost!\nYou're pretty good. Nyeh heh!\n\nBut don't get cocky.\nOne of these days you'll get burned!",
  },
  won: {
    es: '¡Ñaca, ñaca, ñaca!\n¡No eres rival para mí!\n\nVuelve si quieres perder otra vez.\n¡Ñaca, ñaca! ¡Ñaca, ñaca, ñaca!',
    en: "Nyeh heh heh!\nYou're no match for me!\n\nCome back if you want to lose again!\nNyeh heh! Nyeh heh heh!",
  },
};

// Sigilo, a forest ninja who throws razor leaves and lives for his training
const sigilo = {
  ask: { es: 'Prepararse es tan importante\ncomo entrenar. ¿Empezamos?', en: 'Preparing matters as much\nas training. Shall we begin?' },
  slack: { es: '¡Eso pasa cuando aflojas\ny no entrenas lo suficiente!', en: "That's what happens when you slack off\nand don't train enough!" },
  go: { es: '¡Muéstrame los frutos\nde tu entrenamiento!', en: 'Show me the fruits\nof your training!' },
  lostCafe: '\n\n¡Te espero en el Café de batallas!',
  lostCafeEn: "\n\nI'll wait for you at the Battle Cafe!",
  won: {
    es: 'Ja, ja, ja... Sabía que no\nentrenabas lo suficiente.\n\nEntrena mucho más antes de volver\na recibir otro castigo.\n\nPero como yo también entreno,\nnunca me vas a alcanzar.\n\nJa, ja, ja...',
    en: "Ha ha ha... I knew you weren't\ntraining enough.\n\nTrain much harder before you come\nback for more punishment.\n\nBut since I keep training too,\nyou'll never catch me.\n\nHa ha ha...",
  },
};
const sigiloLost = {
  es: '¡No! ¡No puedo creerlo!\n\nVeo que entrenaste muchísimo.\nAhora me toca aprender de ti.\n\nEntrenaré todavía más. ¡La próxima\nte venceré con mis hojas afiladas!',
  en: "No! I can't believe it!\n\nI see you've trained very hard.\nNow it's my turn to learn from you.\n\nI'll train even harder. Next time,\nmy razor leaves will defeat you!",
};

// Escamo, the master of the Deepwood Arena: kind and proud once the spell is gone
const escamo = {
  lost: {
    es: 'Tienes mucha fuerza...\nCreo que no puedo contigo.\n\nPero la próxima no pierdo.\nTe enfrento donde sea.\n¡Juguemos otra vez!',
    en: "You're strong...\nI guess I'm no match for you.\n\nBut I won't lose next time.\nI'll take you on anywhere.\nLet's do this again!",
  },
  won: {
    es: '¡Bien! ¡Gané!\n¿Ves? ¡Esta es mi verdadera fuerza!\n\n¡Fue divertido! Te enfrento donde sea.\n¡Juguemos otra vez!',
    en: "Great! I win!\nSee? This is my real strength!\n\nThat was fun! I'll take you on anywhere.\nLet's do this again!",
  },
};

const FOREST: CityTexts = {
  // Musgo, at the café
  '1874': {
    es: 'Los Verdes evolucionamos rapidísimo.\n\nSi quieres un mazo que evolucione\nrápido, pon muchas criaturas Verdes.\n¡Ñaca, ñaca!',
    en: 'We Greens evolve super fast.\n\nIf you want a fast-evolving deck,\nput lots of Green creatures in it.\nNyeh heh!',
  },
  '19CC': musgo.ask,
  '1A70': { es: '¿Qué pasa...? ¿Te dio miedo?\n¡Ñaca, ñaca!', en: "What's wrong...? Scared?\nNyeh heh!" },
  '1AE8': musgo.go,
  '1B80': musgo.lost,
  '1C90': musgo.won,
  '1DA8': musgoDeck,

  // Sigilo, at the café
  '1F40': {
    es: 'Las criaturas Verdes sirven para\natacar y para defender. Me encantan.\nAdemás, muchas dan bastantes PE.\n\nMis cartas de Apoyo favoritas son\nlas que adivinan el ataque del rival.\n\nSi aciertas, golpeas primero\ny con mucha más fuerza.',
    en: "Green creatures are great at both\nattack and defense. I love them.\nMany of them give lots of EP, too.\n\nMy favorite Support cards are the ones\nthat guess your rival's attack.\n\nIf you guess right, you strike first\nand hit much harder.",
  },
  '2144': sigilo.ask,
  '2214': { es: '¡Eso pasa cuando aflojas\ny no te concentras!', en: "That's what happens when you slack off\nand lose focus!" },
  '22B8': sigilo.go,
  '2368': sigiloLost,
  '24E4': sigilo.won,
  '26C0': sigiloDeck,

  // Escamo, free from the spell, gives the pass to Frost Harbor
  '27FC': {
    es: '¡Eres tú! Gracias por vencer a Hebra.\nMe salvaste.\n\nEstaba bajo un hechizo\nhasta que le ganaste.\n\nVeía todo, pero no podía\ncontrolar mi propio cuerpo.\n\nLo siento mucho.',
    en: "It's you! Thanks for beating Hebra.\nYou saved me.\n\nI was under a spell\nuntil you beat him.\n\nI saw everything, but I couldn't\ncontrol my own body.\n\nI'm really sorry.",
  },
  '29B4': { who: 'me', es: '¿Qué te pasó?', en: 'What happened?' },
  '2A08': {
    es: 'Hebra llegó con un viajero.\nLe dicen el Coleccionista.\n\nCuando lo miré a los ojos,\ndejé de mandar sobre mi cuerpo.\n\nEl viajero se fue, pero Hebra se quedó\ny se adueñó de mi Arena.\n\nYo solo podía mirar.\nFue horrible.\n\nYo le daba el pase a Puerto Escarcha\na quien ganaba... pero bajo\nel hechizo, ni eso podía hacer.',
    en: "Hebra came here with a traveller.\nThey call him the Collector.\n\nWhen I looked into his eyes,\nI lost control of my body.\n\nThe traveller left, but Hebra stayed\nand took over my Arena.\n\nAll I could do was watch.\nIt was horrible.\n\nI used to give winners the pass\nto Frost Harbor... but under\nthe spell, I couldn't even do that.",
  },
  '2D24': { who: 'me', es: '¿Eso fue lo que pasó?\n\nHebra y el Coleccionista...\n¿Qué estarán tramando?', en: "So that's what happened?\n\nHebra and the Collector...\nWhat are they up to?" },
  '2DE0': {
    es: 'No sé qué buscan, pero ese viajero\nhuele a peligro.\n\nPuede que esté pasando lo mismo\nen otros pueblos.',
    en: "I don't know what they want, but\nthat traveller means trouble.\n\nThe same thing might be happening\nin other towns, too.",
  },
  '2EE8': {
    who: 'me',
    es: 'Sí, es muy posible. Tengo que\nllegar cuanto antes al próximo pueblo.\n\n¿Cómo consigo el pase\nal pueblo siguiente?',
    en: "Yeah, that's very possible. I need to\nget to the next town right away.\n\nSo, how do I get the pass\nto the next town?",
  },
  '2FD8': { es: 'Toma, esto es tuyo.', en: 'Here, take this.' },
  '303C': { who: null, es: 'Recibiste el *c5pase a Puerto Escarcha*c7.', en: 'You got the *c5pass to Frost Harbor*c7.' },
  '309C': { who: 'me', es: '¡Gracias! ¡Ya puedo seguir mi viaje!', en: 'Thanks! Now I can move on!' },
  '3108': {
    es: 'Es todo lo que puedo hacer\npor ti ahora.\n\nTen mucho cuidado. En los próximos\npueblos puede pasar cualquier cosa.\n\nY vuelve a esta Arena, ¿sí?',
    en: "That's about all I can do\nfor you right now.\n\nBe very careful. Anything can happen\nin the towns ahead.\n\nAnd come back to this Arena, OK?",
  },
  '326C': { who: 'me', es: '¡Claro! Te voy a desafiar otra vez.\n¡Y voy a ganar!', en: "Sure, I'll challenge you again.\nAnd I'm going to win!" },
  '32F0': {
    es: 'Ja, ja... Sabía que dirías eso.\n\nNo creas que será tan fácil\ncomo nuestra última batalla.\n\nQue tengas un buen viaje.',
    en: "Ha ha... I knew you'd say that.\n\nDon't think it'll be as easy\nas our last battle!\n\nHave a safe journey.",
  },

  // Escamo, at the café
  '3590': {
    es: 'Como ya sabes, las criaturas\nse dividen en 5 facciones:\n\nRoja, Azul, Verde, Sombría y Rara.\n\nNinguna es más fuerte que las demás.\nCada una tiene virtudes y debilidades.\n\nConoce bien cada facción y úsala\na tu favor para ganar batallas.',
    en: 'As you know, creatures belong\nto 5 factions:\n\nRed, Blue, Green, Shadow and Rare.\n\nNo faction is stronger than the rest.\nEach has its strengths and weaknesses.\n\nLearn what each faction does well\nand use it to win battles.',
  },
  '37B0': { es: 'Bien. ¿Empezamos?', en: 'OK. Shall we start?' },
  '3840': { es: 'Qué lástima.', en: "That's too bad." },
  '38A8': { es: 'Muéstrame tu fuerza.', en: 'Show me your strength.' },
  '3948': escamo.lost,
  '3B84': escamo.won,
  '3C84': escamoDeck,

  // Lía, a traveller who builds her own decks
  '3D2C': { es: '¡Hola! ¡Me llamo Lía!', en: 'Hi! My name is Lía!' },
  '3D88': { who: 'me', es: '¡Hola, soy *h0!', en: "Hi, I'm *h0!" },
  '3DD8': { es: '¿No sientes algo extraño\nen esta Arena? No me gusta nada...', en: "Don't you think this Arena\nfeels strange? I don't like it..." },
  '3E64': { who: 'me', es: '¿Extraño? ¿A qué te refieres?', en: 'Strange? What do you mean?' },
  '3EC8': {
    es: 'Antes, el maestro de la Arena\nera una criatura llamada Escamo.\n\nPero ahora manda una criatura\nque nadie conoce.\n\nEscamo era muy amable...\nPero ahora está de muy mal humor.\n\nY además dejó de dar el pase.\n¡Es un desastre!\n\nDicen que un viajero se está quedando\ncon las Arenas: el Coleccionista.\n\nEs difícil de explicar.\nLo verás cuando vayas.\n\n¡Nos vemos!',
    en: "The Arena master used to be\na creature named Escamo.\n\nBut now some creature nobody\nknows is in charge.\n\nEscamo used to be so nice...\nBut now he's in a really bad mood.\n\nAnd he stopped giving out the pass!\nWhat a mess!\n\nPeople say a traveller is taking over\nthe Arenas. They call him the Collector.\n\nIt's hard to explain.\nYou'll see once you go there.\n\nSee you!",
  },
  '43DC': { es: 'Es una situación terrible.\n\nCuesta explicarlo.\nLo verás cuando vayas.', en: "It's a terrible situation.\n\nIt's hard to explain.\nYou'll see once you get there." },
  '44CC': { es: '¡Oye, juguemos!\n¡Desafíame a una partida!', en: "Hey, let's play!\nChallenge me to a match!" },
  '4548': { who: 'me', es: '¡Claro! ¡Cuando quieras!', en: 'Sure! Anytime!' },
  '459C': { es: '¿De verdad? ¡Gracias!', en: 'Really? Thanks!' },
  '4600': { es: 'Escamo volvió a ser el de siempre.\n¿Tuviste algo que ver con eso?', en: 'Escamo is back to his old self.\nDid you have something to do with that?' },
  '46AC': { es: 'Vamos, ¿empezamos?', en: 'Come on, shall we start?' },
  '4738': { es: '¿Qué? ¡Creí que querías jugar!', en: 'What? I thought you wanted to play!' },
  '4808': { es: '¡Bien! ¡No me vas a ganar!', en: "Alright! You won't beat me!" },
  '4858': { es: 'Tengo que pedirte un favor...', en: 'I have a favor to ask you...' },
  '48A8': { es: '¿Puedes jugar con este\n*c3Mazo Vendaval*c7 que armé?', en: 'Can you play with this\n*c3Vendaval Deck*c7 I made?' },
  '4910': { es: '¡Creo que me quedó muy fuerte!', en: 'I think it came out really strong!' },
  '4970': { es: 'Tengo otro favor que pedirte...', en: 'I have another favor to ask...' },
  '49C4': { es: '¿Puedes jugar con mi nueva creación,\nel *c3Mazo Molinete*c7?', en: 'Can you play with my latest creation,\nthe *c3Molinete Deck*c7?' },
  '4A34': { es: '¡Eres un sol!', en: "You're the best!" },
  '4B04': {
    es: '¡Ay, perdí! Pero me da igual\nquién gane. ¡De verdad!\n\nJuguemos otra vez un día de estos.\n¡Adiós!',
    en: "Oh no, I lost! But I don't mind\nwho wins. Really!\n\nLet's play again sometime.\nBye-bye!",
  },
  '4DFC': {
    es: '¡Bingo! ¡Te atrapé!\n\n¿Ves? Te lo dije:\nyo no pierdo.\n\n¡Me divertí muchísimo!\n\nJuguemos otra vez un día de estos.\nLa próxima tampoco pierdo. ¡Adiós!',
    en: "Bingo! Gotcha!\n\nSee? Like I said,\nI don't lose.\n\nThat was so much fun!\n\nLet's play again sometime.\nI won't lose next time either. Bye-bye!",
  },
  '4F64': liaDeck,

  // Hebra, at the café
  'B4D8': hebraDeck,
};

const ARENA: CityTexts = {
  // the first tournament: Musgo, Sigilo, Escamo under the spell, and Hebra
  'B784': {
    es: '¡Ñaca, ñaca, ñaca!\nMe llaman Musgo.\n\nCrezco más rápido que nadie.\n¿Podrás con mis evoluciones?\n¡Ñaca, ñaca, ñaca!',
    en: 'Nyeh heh heh!\nThey call me Musgo.\n\nI grow faster than anyone.\nCan you handle my quick evolutions?\nNyeh heh heh!',
  },
  'B92C': musgo.ask,
  'B9D0': { es: '¿Te dio miedo? ¡Ñaca, ñaca!', en: 'Scared? Nyeh heh!' },
  'BA44': musgo.go,
  'BADC': {
    es: '¡Rayos... perdí!\nJuegas mejor de lo que pensaba. ¡Ñaca!\n\nPero no te confíes. ¡Ñaca, ñaca!\n¡Un día de estos te va a ir mal!',
    en: "Rats... I lost...\nYou're better than I thought. Heh!\n\nBut don't get cocky. Nyeh heh!\nOne of these days you'll get burned!",
  },
  'BC00': musgo.won,
  'BD10': musgoDeck,
  'BE30': {
    es: 'Me llamo Sigilo. Entreno todos\nlos días para la batalla.\n\nSoy el maestro de las hojas afiladas.\n¡Te voy a vencer!',
    en: 'My name is Sigilo. I train every day\nto prepare for battle.\n\nI am the master of razor leaves.\nI will defeat you!',
  },
  'BFE4': sigilo.ask,
  'C0AC': { es: '¿Qué? ¡Qué falta de disciplina!\n¡Concéntrate!', en: "What!? Where's your discipline?\nFocus!" },
  'C134': sigilo.go,
  'C1E4': { es: sigiloLost.es + sigilo.lostCafe, en: sigiloLost.en + sigilo.lostCafeEn },
  'C3B4': sigilo.won,
  'C58C': sigiloDeck,
  'C6B0': { es: 'Soy Escamo.\n¡No eres rival para mí!', en: "I'm Escamo.\nYou're no match for me!" },
  'C730': { who: 'me', es: '¿Eres la criatura de la que\nme habló Lía?', en: 'Are you the creature\nLía told me about?' },
  'C798': { es: '¿Qué tanto murmuras...?\n¡Te voy a ganar!', en: "What are you mumbling about...?\nI'm going to beat you!" },
  'C828': { who: 'me', es: '(Creo que no me va a escuchar.)', en: "(I don't think he'll listen to me.)" },
  'C940': { es: '¿Vas a pelear o no?', en: 'Are you going to battle or not?' },
  'C9D8': { es: '¡Entonces lárgate!', en: 'Then get out of here!' },
  'CA44': { es: '¡Te voy a hacer polvo!', en: "I'm going to crush you!" },
  'CAE8': { es: 'Agh...', en: 'Ugh...' },
  'CB3C': { who: 'me', es: 'Oye... ¿Estás bien?\n\n¡Se quedó sin fuerzas!\nMejor sigo con el próximo combate.', en: "Hey... Are you OK?\n\nHe's out cold!\nI'd better move on to the next match." },
  'CC1C': {
    es: 'Nunca podrás ganarme.\n¡Fuera de aquí!\n\n¡No vuelvas a mostrarme la cara!\n¡Qué pérdida de tiempo!',
    en: "You can never beat me.\nGet out of here!\n\nDon't ever show your face to me again!\nWhat a waste of time!",
  },
  'CD24': escamoDeck,
  'CE48': { es: 'Soy Hebra.\nSoy el maestro de esta Arena.', en: "I'm Hebra.\nI'm the master of this Arena." },
  'CECC': {
    who: 'me',
    es: 'Quiero preguntarte algo.\n¿Qué está pasando en esta Arena?\n\nSiento que algo anda mal aquí.',
    en: "I want to ask you something.\nWhat's going on in this Arena?\n\nI feel like something is wrong here.",
  },
  'CFB8': { es: '¿De qué hablas?\nAquí no pasa nada.', en: 'What do you mean?\nNothing is wrong here.' },
  'D024': {
    es: 'Olvídate de eso y empecemos.\n¡Vamos!\n\nNo puedo dejarte ganar.\n¡Vas a ver lo despiadado que soy!',
    en: "Forget about that and let's start.\nBring it on!\n\nI can't let you win.\nI'll show you how ruthless I can be!",
  },
  'D1F0': { es: '¿Te atreves a enfrentarme?', en: 'Do you dare to face me?' },
  'D280': { es: 'Diría que es una buena decisión.', en: "I'd say that's a wise decision." },
  'D2F4': { es: 'Yo nunca pierdo.\n¡Ya vas a ver!', en: 'I never lose.\nYou will see!' },
  'D3A8': {
    es: '¡Nooo! Perdí.\n¿Qué voy a hacer?\n\n¡El Coleccionista se va a enojar\nmuchísimo conmigo!',
    en: 'Oh nooo! I lost.\nWhat am I going to do?\n\nThe Collector is going to be\nso mad at me!',
  },
  'D470': { who: 'me', es: '¿El Coleccionista...?\n¿Por qué te pones así?', en: 'The Collector...?\nWhy are you so upset?' },
  'D4E0': { es: '¡Ay, no! ¡Estoy en un gran lío!\n¿Qué voy a hacer?', en: "Oh no! I'm in big trouble!\nWhat am I going to do?" },
  'D56C': { who: 'me', es: 'Perdona que interrumpa,\npero ¿me das el pase?', en: 'Sorry to interrupt,\nbut can I have the pass?' },
  'D5FC': { es: '¡Silencio! ¡Yo no tengo ningún pase!\n¡La próxima te gano, ya verás!', en: "Quiet! I don't have any pass!\nI'll beat you next time for sure!" },
  'D69C': {
    who: 'me',
    es: '¿Qué fue todo eso?\n\n¿Y cómo consigo el pase? Sin él\nno puedo ir al próximo pueblo...\n\nBueno. Volveré al Café de batallas\na ver si averiguo algo.',
    en: "What was that all about?\n\nBut how do I get the pass? I can't\ngo to the next town without it...\n\nOh well. I'll go back to the\nBattle Cafe and ask around.",
  },
  'D7FC': {
    es: '¡Uf... no perdí!\nAsí el Coleccionista no se enoja.\n\nEspero que hayas aprendido la lección.\nY ojalá no vuelvas.',
    en: "Phew... I didn't lose!\nNow the Collector won't get mad.\n\nI hope you've learned your lesson.\nAnd hopefully you won't come back.",
  },
  'D910': hebraDeck,

  // the next tournament: Musgo, Sigilo, and Escamo back in charge
  'DCF0': musgo.ask,
  'DD94': { es: '¿Te vas a echar para atrás?\n¡Ñaca, ñaca!', en: 'Chickening out? Nyeh heh!' },
  'DE10': musgo.go,
  'DEA8': musgo.lost,
  'DFCC': musgo.won,
  'E0E4': musgoDeck,
  'E28C': sigilo.ask,
  'E354': sigilo.slack,
  'E3F8': sigilo.go,
  'E4A8': {
    es: '¡No...! ¡No puedo creerlo!\n\nVeo que entrenaste muchísimo.\n¡Tengo que entrenar todavía más!\n\nLa próxima te venceré\ncon mis hojas afiladas.' + sigilo.lostCafe,
    en: "No... I can't believe this!\n\nI see you've trained very hard.\nI have to train even harder!\n\nNext time, my razor leaves\nwill defeat you!" + sigilo.lostCafeEn,
  },
  'E674': sigilo.won,
  'E854': sigiloDeck,
  'E974': {
    es: 'Aquí estás... ¡Esta vez te mostraré\nmi verdadera fuerza!\n\nQue me hayas ganado una vez\nno quiere decir que será fácil.',
    en: "There you are... This time I'll show\nyou my real strength!\n\nJust because you won once doesn't\nmean this will be easy.",
  },
  'EB28': { es: '¿Empezamos?', en: 'Shall we start?' },
  'EBB4': { es: '¿Qué? ¿De qué tienes miedo?', en: 'What? What are you afraid of?' },
  'EC28': { es: '¡Te mostraré mi verdadera fuerza!', en: "I'll show you my real strength!" },
  'ECCC': {
    es: 'Tienes mucha fuerza...\nCreo que no puedo contigo.\n\nTe enfrento donde sea.\n¡Juguemos otra vez!',
    en: "You're strong...\nI guess I'm no match for you.\n\nI'll take you on anywhere.\nLet's do this again!",
  },
  'FB74': escamo.won,
  'FC74': escamoDeck,
};

export const CITY02: CityTexts = { ...FOREST, ...ARENA, ...CITY02_LATER };
