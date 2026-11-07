/**
 * Ciudad sin Faroles, later phases: strangers move in. Mortaja likes the city's endless dusk and opens a
 * Haunted Arena to find servants; his gang (Sábana, a dancing ghost; Grajo, who smells something fishy;
 * Osario, who only roars) plays at the café and in his Arena. Astado introduces Isidro, a traveller who
 * studies the rules of the Quiet Lands, and Gruñón shows up from who knows where.
 */
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });
const sabanaDeck = deck('*c3Mazo Baile de Sábanas\nUn mazo Sombrío que roba HP y se cura.\nMuy difícil de tumbar.', '*c3Sheet Dance Deck\nA Shadow deck that drains HP and heals.\nVery hard to bring down.');
const grajoDeck = deck('*c3Mazo Graznido\nDestroza los mazos\nde la facción Verde.', "*c3Crow's Caw Deck\nIt wrecks Green\nfaction decks.");
const osarioDeck = deck('*c3Mazo Hueso Hueco\nUn mazo Sombrío de pura destrucción.\nSu ataque castiga a la facción Verde.', '*c3Hollow Bone Deck\nA Shadow deck of pure destruction.\nIts attack punishes the Green faction.');
const mortajaDeck = deck('*c3Mazo Velo Gris\nUn mazo Sombrío con 2 cartas\nmuy, muy peligrosas.', '*c3Grey Veil Deck\nA Shadow deck with 2\nvery, very dangerous cards.');
const astadoDeck = deck('*c3Mazo Trampas Ocultas\nUn mazo Verde de combos\nde contraataque.', '*c3Hidden Snares Deck\nA Green deck of\ncounterattack combos.');
const isidroDeck = deck('*c3Mazo Cálculo Exacto\nEl mazo de Isidro, lleno de\nmáquinas e insectos.', "*c3Exact Math Deck\nIsidro's deck, full of\nmachines and bugs.");
const grunonDeck = deck('*c3Mazo Caras Raras\nUn mazo lleno de criaturas\nmuy sospechosas.', '*c3Funny Faces Deck\nA deck full of very\nsuspicious creatures.');

const sabana = {
  scared: { es: 'Te asustaste, ¿verdad?', en: "You're scared, aren't you?" },
  lostRevenge: { es: 'Pero la próxima te voy a dejar\nsin aliento. ¡No lo olvides!', en: "But next time I'll leave you\nbreathless. Don't forget it!" },
};
const osario = {
  ask: { es: '¡GRRAAAH!\n¿PELEAR?', en: 'GRRAAAH!\nFIGHT?' },
  no: { es: '¡GRRR...!', en: 'GRRR...!' },
  go: { es: '¡GRRAAAH! ¡DESTRUIR!', en: 'GRRAAAH! DESTROY!' },
  won: {
    es: '¡GRRAAAH!\n\n¡Destruir! ¡Destruir!\n¡Te destruiré una y otra vez!\n\n¡GRRAAAH!\n\n¡Esa es mi misión!\n\n¡GRRAAAH!',
    en: "GRRAAAH!\n\nDestroy! Destroy!\nI'll destroy you again and again!\n\nGRRAAAH!\n\nThat is my mission!\n\nGRRAAAH!",
  },
};
// the Haunted Arena's prompts have no speaker in the logic: Mortaja says them
const mortaja = {
  runAway: { who: 'Myotismon', es: 'No pensarás huir, ¿verdad?\nNi lo intentes.', en: "You're not planning to run away,\nare you? Don't even try." },
  atAnyCost: { who: 'Myotismon', es: '¡Ganaré esta batalla\ncueste lo que cueste!', en: "I'll win this battle\nat any cost!" },
};

export const CITY05_LATER: CityTexts = {
  // Sábana, a dancing ghost
  '4380': {
    es: 'Aquí los faroles se apagaron hace\nmucho. ¡Mejor para los fantasmas!\n\nY este fantasma bailarín te va\na dar el susto de tu vida.\n\n¡Ji, ji, ji!',
    en: 'The lamps here went out long ago.\nAll the better for ghosts!\n\nAnd this dancing ghost is going to\ngive you the fright of your life.\n\nHee hee hee!',
  },
  '4440': { es: '¿Juegas conmigo? ¡Uuuh, uuuh!', en: 'Will you play with me? Woo woo!' },
  '44D4': sabana.scared,
  '4544': { es: '¡A jugar! ¡Uuuh, uuuh!', en: "Let's play! Woo woo!" },
  '45E0': { es: `¡Ay, nooo! ¡Perdí!\nEsta vez me diste una paliza.\n\n${sabana.lostRevenge.es}`, en: `Oh nooo! I lost!\nYou really whipped me that time.\n\n${sabana.lostRevenge.en}` },
  '46E4': {
    es: '¡Bien! ¡Gané!\nTe di un buen susto.\n\n¡Qué felicidad! ¡Uuuh, uuuh!\n\nCuando quieras te vuelvo a asustar.\n¡Juguemos otra vez!',
    en: "Alright! I win!\nI gave you a good scare.\n\nI'm so happy! Woo woo!\n\nI'll scare you again anytime.\nLet's play again!",
  },
  '4810': sabanaDeck,

  // Grajo: how to fuse Shadow cards
  '49D4': {
    es: 'Enfrentarte valió todo el viaje.\n\nQuiero que te hagas aún más fuerte\ny que volvamos a jugar.\n\nTe diré algo útil.\n\nSi fusionas una carta Roja y una Verde,\nuna Verde y una Rara,\no una Sombría y una de Apoyo...\n\n...obtienes una carta Sombría.\n\nCon esto vas a dominar\nlos mazos Sombríos.\n\nDesafíame cuando quieras.',
    en: "Facing you made this trip worthwhile.\n\nI want you to get even stronger\nand play me again.\n\nLet me tell you something useful.\n\nIf you fuse a Red card and a Green one,\na Green and a Rare,\nor a Shadow and a Support...\n\n...you get a Shadow card.\n\nWith this, you'll master\nShadow decks.\n\nChallenge me anytime.",
  },
  '4C4C': { es: '¡Me hierve la sangre!\n¿Peleamos?', en: 'My blood is burning!\nShall we fight?' },
  '4CD8': { es: '¿Tienes miedo?\nVamos, dime la verdad.', en: 'Are you scared?\nGo on, tell me the truth.' },
  '4D64': { es: '¡Te haré sentir el verdadero miedo!', en: "I'll make you taste real fear!" },
  '4E08': {
    es: '¿¡Qué!? ¡Me ganaste otra vez!\n\nSolo por conocerte, el viaje\nvalió la pena.\n\n¡Juega conmigo de nuevo!\nPuedes correr, pero no esconderte.',
    en: "What!? You beat me again!\n\nMeeting you alone made\nthis trip worthwhile.\n\nPlay me again!\nYou can run, but you can't hide!",
  },
  '4F38': {
    es: 'Gané, pero me costó.\n¿Quién eres, en realidad?\n\nSolo por esta batalla,\nel viaje valió la pena.\n\n¡Juguemos otra vez!\nSé que tú también quieres.',
    en: 'I won, but that was tough.\nWho are you, really?\n\nThis battle alone made\nthe trip worthwhile.\n\nPlay me once more!\nI know you want to.',
  },
  '5090': grajoDeck,

  // Osario only roars
  '5228': { es: '¡GRRAAAH!\n\n¡Destruir! ¡Destruir!\n¡Esa es mi misión!\n\n¡GRRAAAH!', en: 'GRRAAAH!\n\nDestroy! Destroy!\nThat is my mission!\n\nGRRAAAH!' },
  '531C': osario.ask,
  '53A0': osario.no,
  '5400': osario.go,
  '5490': {
    es: '¡GRRAAAH!\n\n¿Qué? ¿Perdí...?\n¡Esto no se queda así!\n\n¡GRRAAAH!\n\n¡Otra batalla! ¡Te voy a destruir!\n\n¡GRRAAAH!',
    en: "GRRAAAH!\n\nWhat? I lost...?\nYou won't get away with this!\n\nGRRAAAH!\n\nAnother battle! I will destroy you!\n\nGRRAAAH!",
  },
  '562C': osario.won,
  '57A4': osarioDeck,

  // Mortaja arrives and opens the Haunted Arena
  '5880': { es: 'Mi nombre es Mortaja.', en: 'My name is Mortaja.' },
  '58E0': { who: 'me', es: 'Eh... ¿Hola?', en: 'Uh... Hi?' },
  '592C': { es: 'Vine a esta ciudad porque aquí\nnunca se encienden los faroles.', en: 'I came to this city because\nthe lamps here never light up.' },
  '59A0': {
    es: 'Me gusta esta penumbra. Aquí los\ncolores se apagan y todo se aquieta.\n\nAsí deberían ser todas las formas:\ngrises y quietas.\n\nTengo una gran tarea por delante,\ny necesito sirvientes fuertes.\n\nPor eso abrí una Arena Embrujada\nen esta ciudad.\n\n¿Vienes a servirme? No pareces\ngran cosa, pero servirás.\n\nTe pondré al frente de mis sirvientes.\n¡Agradécemelo!',
    en: "I like this dusk. Here, colors\nfade and everything goes quiet.\n\nThat's how every shape should be:\ngrey and quiet.\n\nI have a great task ahead of me,\nand I need strong servants.\n\nThat's why I opened a Haunted Arena\nin this city.\n\nHave you come to serve me? You don't\nlook like much, but you'll do.\n\nI'll put you in charge of my servants.\nBe grateful!",
  },
  '5BE4': { who: 'me', es: '(Qué aires se da...)\n\nEstá bien. Voy a entrar a la Arena.', en: "(He sure thinks highly of himself...)\n\nAll right. I'll enter the Arena." },
  '5CA0': {
    es: '¡Claro que sí! ¡Ja, ja, ja, ja!\n\nNo creo que dures mucho,\npero algo vas a aprender.\n\nAdelante. Entra a la Arena.\n¡Ja, ja!',
    en: "Of course you will! Ha ha ha ha!\n\nI don't expect you to last long,\nbut you might learn something.\n\nGo ahead. Enter the Arena.\nHa ha!",
  },
  '5DE4': { who: null, es: '*c6¡La Arena Embrujada está abierta!\n*c6¡Que pasen los valientes!', en: '*c6The Haunted Arena is now open!\n*c6Those who are ready, come on in!' },
  '5FBC': { es: 'La Arena Embrujada te espera.\nAllí te daré una buena lección.\n\n¡Ja, ja, ja, ja!', en: "The Haunted Arena awaits you.\nThere I'll teach you a good lesson.\n\nHa ha ha ha!" },
  '608C': { es: '¡Eres mi sirviente!\n¡Ven a jugar conmigo, ahora!', en: 'You are my servant!\nCome and play with me, now!' },
  '6120': { es: 'Bien. ¿Despertamos a los muertos\ncon una partida?', en: 'Very well. Shall we wake the dead\nwith a match?' },
  '61B4': mortaja.runAway,
  '6250': mortaja.atAnyCost,
  '6304': {
    es: '¡Nooo!\n¿Perdí otra vez?\n\n¡Esto no se queda así!\n¡Prepárate para otra batalla! ¡Ya!\n\n¡Vuelve y enfréntame otra vez!',
    en: "Nooooo!\nI lost again!?\n\nYou won't get away with this!\nGet ready for another battle! Now!\n\nCome back and face me again!",
  },
  '655C': {
    es: '¡Ja, ja, ja, ja!\n¿Te rindes ahora?\n\nEste es mi verdadero poder.\nVeo que quieres la revancha.\n\nBien. No me voy a ir a ninguna parte.\nVuelve cuando quieras.',
    en: "Ha ha ha ha!\nNow, do you give up?\n\nThis is my true power. I see\nyou want to get back at me.\n\nFine. I'm not going anywhere.\nCome back anytime!",
  },
  '66C0': mortajaDeck,

  // Astado introduces Isidro
  '677C': { es: '¡Hola, soy yo, Astado!\n¡Gracias por tu ayuda en la\nTorre del Archivero!', en: "Hi, it's me, Astado!\nThanks for your help at the\nArchivist's Tower!" },
  '681C': { who: 'me', es: '¿Cómo estás? ¡Tanto tiempo!', en: "How are you? It's been a while!" },
  '6884': {
    es: 'Me contaron que últimamente\njugaste muchas batallas.\n\nTodos hablan de ti.\n¡Dicen que tienes una fuerza enorme!\n\n¿Qué dices? ¿Aceptas mi desafío?\n\nNo te voy a decepcionar.\nDe verdad que no.\n\nSi ganas, te presento a Isidro,\nmi compañero de viaje.\n\n¿Qué te parece?',
    en: "I hear you've had a lot of\nbattles lately.\n\nEveryone's talking about you.\nThey say you're super strong!\n\nSo? Will you accept my challenge?\n\nI won't let you down.\nReally, I won't.\n\nIf you win, I'll introduce you\nto Isidro, my travel companion.\n\nWhat do you say?",
  },
  '6BA8': { es: '¿Qué dices? ¿Aceptas mi desafío?\n\nNo te voy a decepcionar.\nLo digo en serio.', en: "So? Will you accept my challenge?\n\nI won't let you down.\nI mean it." },
  '6C98': { es: '¿Aceptas mi desafío?', en: 'Do you accept my challenge?' },
  '6D2C': { es: 'Qué lástima, de verdad.', en: "That's really too bad." },
  '6DA0': { es: '¡Genial! ¡Vamos con todo!', en: "Great! Let's give it everything!" },
  '6E48': {
    es: '¡Vaya! Me ganaste,\ny de forma limpia.\n\n¡Juegas tan bien como dicen!\n\nCon tu fuerza y tu habilidad,\nseguro te irá bien contra Isidro.\n\nPero no lo subestimes,\no te dará una buena paliza.\n\nBueno, me tengo que ir.\nJuguemos cuando tengas más tiempo.',
    en: "Wow! You got me,\nfair and square.\n\nYou play just as well as they say!\n\nWith your strength and skill, I'm sure\nyou'll do well against Isidro.\n\nBut don't underestimate him,\nor he'll give you a real beating.\n\nWell, I have to go.\nLet's play when you have more time.",
  },
  '725C': {
    es: '¿Qué pasó?\n¿Te ganaron los nervios?\n\nAsí, contra Isidro no tienes\nninguna oportunidad.\n\n¿Por qué no te relajas un poco\ny juegas conmigo otra vez?',
    en: "What happened?\nDid your nerves get to you?\n\nPlaying like that, you won't stand\na chance against Isidro.\n\nWhy don't you relax a bit\nand play me one more time?",
  },
  '73E8': astadoDeck,

  // Isidro, a traveller who studies the rules of this world
  '74B0': { es: 'Hola. Me llamo Isidro.\nEs un gusto conocerte.', en: "Hello. My name is Isidro.\nIt's a pleasure to meet you." },
  '7534': { who: 'me', es: 'Hola, soy *h0.', en: "Hi, I'm *h0." },
  '7584': {
    es: 'Este mundo tiene reglas muy precisas.\nCada carta encaja con las demás.\n\nHasta los faroles apagados de aquí\nsiguen un patrón. Conté 312.\n\nTodavía estoy aprendiendo, así que\nestudio todos los días.\n\n¿Por qué no jugamos una partida?\n\nNo soy tan bueno, pero haré\nlo mejor que pueda.',
    en: "This world has very precise rules.\nEvery card fits with the others.\n\nEven the dark lamps around here\nfollow a pattern. I counted 312.\n\nI'm still learning, so\nI study every day.\n\nWhy don't we play a match?\n\nI'm not that good, but\nI'll do my best.",
  },
  '7860': { es: 'Bueno, todavía me queda mucho\npor aprender.', en: 'Well, I still have\na lot to learn.' },
  '78D8': { es: 'Haré lo mejor que pueda.\n¿Jugamos?', en: "I'll do my best.\nShall we play?" },
  '7960': { es: 'Parece que los dos tenemos\nmucho que aprender.', en: 'I guess we both have\na lot to learn.' },
  '79D8': { es: 'Entonces, empecemos.', en: "Then, let's begin." },
  '7A6C': {
    es: '¡Juegas de maravilla!\nFue una gran lección para mí.\n\nCreo que tengo que rehacer\nmi mazo desde cero.\n\nJuega conmigo otra vez algún día.\nLa próxima no pierdo.',
    en: "You're really great!\nThat was a good lesson for me.\n\nI think I need to rebuild\nmy deck from scratch.\n\nPlease play me again someday.\nI won't lose next time.",
  },
  '7BC0': { es: 'Ah, por cierto, toma esto.', en: 'Oh, by the way, take this.' },
  '7C30': { who: null, es: 'Recibiste las *c6Notas de fusión*c7.', en: 'You got the *c6Fusion Notes*c7.' },
  '7C98': {
    es: 'Son mis notas sobre fusiones.\nCuanto más valor suman las dos cartas,\nmás fácil sale una fusión mutante.\n\n¡Son muy útiles!\n\nJuguemos otra vez algún día.',
    en: "They're my notes on fusion.\nThe more value the two cards add up to,\nthe likelier a mutant fusion is.\n\nThey're very useful!\n\nLet's play again sometime.",
  },
  '7F5C': {
    es: '¡Eso estuvo muy reñido!\n\n¡Qué fuerza tienes! Estaba seguro\nde que iba a perder.\n\nMe mostraste cómo mejorar\nmi mazo. Gracias.\n\nAcepto la revancha cuando quieras.\nPara entonces mi mazo será mejor.\n\n¿Hablo demasiado?\n\nTe espero.',
    en: "That was a close one!\n\nBoy, you're strong! I was sure\nI was going to lose.\n\nYou showed me how to improve\nmy deck. Thank you.\n\nI'm ready for a rematch anytime.\nMy deck will be stronger by then.\n\nDo I talk too much?\n\nI'll be waiting.",
  },
  '8194': isidroDeck,

  // Gruñón, from who knows where
  '8390': {
    es: '¡Soy Gruñón! ¡Llegué hasta aquí\ncruzando el tiempo y el espacio!\n\n¡Juega conmigo! ¡Y ni se te\nocurra salir corriendo!\n\n¡Dije que juegues conmigo!',
    en: "I'm Gruñón! I came here\nthrough time and space!\n\nPlay with me! And don't you\ndare run away!\n\nI said, play with me!",
  },
  '84B4': { who: 'me', es: 'Bueno... si tanto insistes.', en: 'Okay... if you insist.' },
  '8510': { es: '¡Así me gusta!\n¡Que empiece la batalla!\n\n¡Ja, ja, ja, ja, ja!', en: "That's more like it!\nLet the battle begin!\n\nHa ha ha ha ha!" },
  '8710': { es: '¡Oye, tú!\n¡No hay tiempo para charlas!\n\n¡Apúrate! ¡Empecemos la batalla!\n¡Ja, ja, ja, ja, ja!', en: "Hey, you!\nThere's no time for small talk!\n\nHurry up! Let's start the battle!\nHa ha ha ha ha!" },
  '87FC': {
    es: 'Ya te voy a agarrar. ¡No lo olvides!\nLa próxima no me ganas.\n\nCuando menos lo esperes, me vas\na encontrar esperándote. ¡Ja, ja, ja!',
    en: "I'll get you. Don't you forget it!\nYou won't beat me next time.\n\nWhen you least expect it, you'll find\nme waiting for you! Ha ha ha!",
  },
  '891C': { es: '¡Vamos! ¿Jugamos o qué?', en: 'Come on! Are we playing or what?' },
  '89AC': { es: '¿Pero qué...?', en: 'What the...?' },
  '8A0C': { es: '¡Así se habla!', en: "That's the spirit!" },
  '8A9C': {
    es: '¡Ay, nooo! ¡Perdí!\n¡Eres demasiado fuerte!\n\nYa te voy a agarrar. ¡No lo olvides!\nLa próxima no me ganas.\n\n¡Te estaré esperando en algún lugar!\n¡Ja, ja, ja, ja!',
    en: "Oh nooo! I lost!\nYou're too strong!\n\nI'll get you. Don't forget it!\nYou won't beat me next time.\n\nI'll be waiting for you somewhere!\nHa ha ha ha!",
  },
  '8DAC': { es: '¡Ja, ja, ja, ja, ja!\n¡Te gané!\n\n¡Me siento genial!\n\n¡Te enfrento cuando quieras!\n\n¡Ja, ja, ja, ja, ja!', en: "Ha ha ha ha ha!\nGot you!\n\nI feel great!\n\nI'll take you on anytime!\n\nHa ha ha ha ha!" },
  '8EE4': grunonDeck,

  // the Haunted Arena: Sábana, Grajo, Osario, then Mortaja
  F58C: { who: null, es: 'La Arena Embrujada está cerrada\npor ahora. Vuelve más tarde.', en: 'The Haunted Arena is closed for now.\nPlease come back later.' },
  F5EC: { who: null, es: '¿Seguro que quieres entrar\na la Arena Embrujada?', en: 'Are you sure you want to enter\nthe Haunted Arena?' },
  F77C: { es: '¡Buu! Soy Sábana.\n¿Te dan miedo los fantasmas?\n\n¡Uuuuuuuh!', en: "Boo! I'm Sábana.\nAre you scared of ghosts?\n\nWoooooooh!" },
  F8D8: { es: '¿Juegas conmigo? ¡Uuuuuh!', en: 'Will you play with me? Woooooh!' },
  F968: sabana.scared,
  F9D8: { es: '¡Buu! ¡Te voy a dar un susto tremendo!', en: "Boo! I'm going to scare you silly!" },
  FA7C: { es: `¡Uuuh! ¡Perdí!\n¡Me espantaste a mí!\n\n${sabana.lostRevenge.es}`, en: `Woooh! I lost!\nYou scared me off!\n\n${sabana.lostRevenge.en}` },
  FB7C: {
    es: '¡Te gané! Nada mal para alguien\nque ni siquiera tiene piernas.\n\n¡Qué felicidad! ¡Uuuh, uuuh!\n\nTienes cara de haber visto un fantasma.\nVuelve por la revancha.',
    en: "I beat you! Not bad for someone\nwho doesn't even have legs.\n\nI'm so happy! Woo woo!\n\nYou look like you've seen a ghost.\nCome back for a rematch.",
  },
  FCC4: sabanaDeck,
  FE10: {
    es: 'Mi nombre es Grajo.\n\nMi compañero Mortaja me trajo\na esta ciudad, y entré a su Arena...\n\n...pero algo aquí me huele mal.\n\nAun así, mientras haya Arenas,\nno puedo resistirme a jugar.',
    en: "My name is Grajo.\n\nMy comrade Mortaja brought me\nto this city, and I entered his Arena...\n\n...but something here smells fishy.\n\nStill, as long as there are Arenas,\nI can't resist playing.",
  },
  '10048': { es: '¡Me empieza a hervir la sangre!\n¿Peleamos?', en: 'My blood is starting to boil!\nShall we fight?' },
  '100E0': { es: '¿Te echas para atrás?\nVamos, admítelo.', en: 'Getting cold feet?\nGo on, admit it.' },
  '10170': { es: 'Conocerás el verdadero miedo.', en: 'You shall know true fear.' },
  '10214': {
    es: '¿Qué? ¿Perdí?\n¿Quién eres, en realidad?\n\nSolo por este duelo,\nel viaje valió la pena.\n\n¡Juega conmigo otra vez! Es tu\ndestino. ¡No puedes escapar!\n\nTe espero aquí mismo.',
    en: "What? I lost?\nWho are you, anyway?\n\nThis duel alone made\nthe trip worthwhile.\n\nPlay me again! It's your\ndestiny. You can't escape it!\n\nI'll wait for you right here.",
  },
  '103B8': {
    es: 'Mmm... Gané, pero tienes fuerza.\n¿Cómo dijiste que te llamabas?\n\nSolo por esta batalla,\nel viaje valió la pena.\n\nTendremos la revancha. Es tu\ndestino. ¡No puedes escapar!\n\nTe espero en el Café de batallas.',
    en: "Hmm... I won, but you're strong.\nWhat did you say your name was?\n\nThis battle alone made\nthe trip worthwhile.\n\nWe'll have a rematch. It's your\ndestiny. You can't escape it!\n\nI'll wait for you at the Battle Cafe.",
  },
  '10574': grajoDeck,
  '10698': { es: '¡GRRAAAH!\n\nSoy Osario.\n¡Destruyo todo lo que veo!\n\nTambién te voy a destruir a ti.\n¡GRRAAAH!', en: 'GRRAAAH!\n\nI am Osario.\nI destroy everything in sight!\n\nI will destroy you, too.\nGRRAAAH!' },
  '10860': osario.ask,
  '108E4': osario.no,
  '10944': osario.go,
  '109D4': {
    es: '¡GRRAAAH!\n\n¿Perdí...? ¡GRRR!\n¡Esto no se queda así!\n\n¡GRRAAAH!\n\n¡Otra batalla!\n¡Entonces te destruiré!\n\n¡GRRAAAH!',
    en: "GRRAAAH!\n\nI lost...? GRRR!\nYou won't get away with this!\n\nGRRAAAH!\n\nAnother battle!\nThen I will destroy you!\n\nGRRAAAH!",
  },
  '10B84': osario.won,
  '10CFC': osarioDeck,
  '10E54': {
    es: 'Así que llegaste.\n\nEstoy muy ocupado.\nNo tengo tiempo para juegos.\n\nPero esta vez haré una excepción.\n\nNo tienes ninguna oportunidad,\npero dame todo lo que tienes.\n\n¡Ja, ja, ja, ja!',
    en: "So, you've come.\n\nI'm very busy.\nI have no time for games.\n\nBut this time I'll make an exception.\n\nYou don't stand a chance, but\ngive me everything you've got.\n\nHa ha ha ha!",
  },
  // first time in his Arena / after the player has beaten him once
  '11114': { who: 'Myotismon', es: '¿Empezamos la partida?', en: 'Shall we begin the match?' },
  '11140': { who: 'Myotismon', es: 'Vamos. ¿Jugamos otra vez?', en: 'Come on. Shall we play again?' },
  '111E4': { who: 'Myotismon', es: '¿Te dio miedo?', en: 'Got cold feet?' },
  '1120C': mortaja.runAway,
  '112B8': { who: 'Myotismon', es: 'Esto terminará enseguida.', en: 'This will be over in no time.' },
  '112E4': mortaja.atAnyCost,
  '11394': {
    es: '¡Un momento! ¿Perdí?\nTiene que haber un error.\n\n¡Nooo!\n\n¡Esto no se queda así!\n¡Exijo la revancha!\n\n¿Que renuncie a volver todo gris?\n¡Cómo te atreves a humillarme!',
    en: "Wait a minute! I lost?\nThere must be some mistake.\n\nNooooo!\n\nYou won't get away with this!\nI demand a rematch!\n\nGive up turning everything grey!?\nHow dare you humiliate me!",
  },
  '11600': {
    es: '¡Nooo!\n¡Perdí otra vez!\n\n¡Esto no se queda así!\n¡Prepárate para otra batalla! ¡Ya!\n\nVeamos quién es mejor. ¡Vamos!',
    en: "Nooooo!\nI lost again!\n\nYou won't get away with this!\nGet ready for another battle! Now!\n\nLet's see who's better. Come on!",
  },
  '1182C': {
    es: 'Lo hiciste bien. ¡Ja, ja, ja, ja!\n\nTienes habilidad, pero te falta\nmucho para vencerme.\n\nEstoy ocupado buscando sirvientes\ndignos. Ve a jugar con otras criaturas.\n\nAdiós.',
    en: "You did well. Ha ha ha ha!\n\nYou have skill, but you have\na long way to go to beat me.\n\nI'm busy looking for worthy servants.\nGo play with some other creatures.\n\nGoodbye.",
  },
  '119B8': {
    es: '¡Ja, ja, ja, ja!\n¿Te rindes ahora?\n\nEste es mi verdadero poder.\nMmm, veo que todavía no lo crees.\n\nBien. Me quedo aquí mismo.\nVuelve cuando quieras.',
    en: "Ha ha ha ha!\nDo you give up now?\n\nThis is my true power.\nHmm, I see you still don't believe it.\n\nFine. I'll stay right here.\nCome back anytime!",
  },
  '11B1C': mortajaDeck,
};
