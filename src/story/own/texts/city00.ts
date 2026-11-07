/**
 * Aldea del Cruce (city 0): the player arrives. Nilo, the guide, explains the world; Brezo and Pipa give
 * advice at the café; Grandma Retama runs the first arena and gives the pass to Old Kilns.
 * The later phases of the village are in city00later.ts.
 */
import { CITY00_LATER } from './city00later';
import type { CityTexts } from './types';

const niloDeck = { who: null, es: '*c3Mazo de Nilo\nEl mazo de siempre de Nilo.\nIdeal contra principiantes.', en: "*c3Nilo's Deck\nNilo's usual deck.\nGood against beginners." };
const brezoDeck = { who: null, es: '*c3Mazo Tricolor\nUn mazo fácil de usar, de 3 colores.', en: '*c3Tricolor Deck\nAn easy-to-use deck with 3 colors.' };
const retamaDeck = {
  who: null,
  es: '*c3Mazo Fuerza Nueva\nMuchas cartas nuevas de las facciones\nRoja, Verde y Azul.',
  en: '*c3New Strength Deck\nLots of new cards from the Red,\nGreen and Blue factions.',
};
const retamaToArena = {
  es: 'Veo que Nilo ya te contó\ncómo es este mundo.\n\nEntonces deberías\nprobar suerte en la Arena.\n\nTe espero en la Arena.\n¡Ja, ja, ja!',
  en: 'I see Nilo already told you\nwhat this world is like.\n\nThen you should\ntry your luck at the Arena.\n\nI will be waiting at the Arena.\nHa ha ha!',
};

const ARRIVAL: CityTexts = {
  // first arrival
  '0120': {
    who: null,
    es: 'Te damos la bienvenida\na las Tierras Quietas.\n\nHace mucho que las personas se fueron.\nHoy las criaturas cuidan sus pueblos.\n\nTu guía, Nilo, te espera\nen el Café de batallas.\n\nSi estás empezando,\nescucha sus consejos.\n\n¡Buen viaje, aprendiz!',
    en: 'Welcome to the Quiet Lands.\n\nPeople left a long time ago.\nThe creatures look after their towns now.\n\nYour guide, Nilo, is waiting for you\nat the Battle Cafe.\n\nIf you are just starting out,\nlisten to his advice.\n\nHave a good journey, apprentice!',
  },

  // Nilo, the guide
  '14B0': { es: '¡Hola! Soy Nilo.\nSeré tu guía en este mundo.', en: "Hi! I'm Nilo.\nI'll be your guide in this world." },
  '1530': { who: 'me', es: '¡Hola, soy *h0!', en: "Hi, I'm *h0!" },
  '1580': { es: 'Hace mucho que no llegaba alguien\ncomo tú. Te cuento cómo es todo.', en: "It's been a long time since someone\nlike you came by. Let me explain." },
  '161C': {
    es: 'Aquí todo gira en torno a las cartas.\nCada carta guarda la forma de una criatura.\n\nCuando las personas se fueron, nos dejaron\nsus pueblos, sus oficios... y las cartas.\n\nEn las Tierras Quietas hay muchos pueblos,\ny en casi todos se juega a las cartas.\n\nCada pueblo tiene una Arena\ndonde se hacen torneos.',
    en: 'Everything here revolves around cards.\nEach card keeps the shape of a creature.\n\nWhen the people left, they left us\ntheir towns, their trades... and the cards.\n\nThere are many towns in the Quiet Lands,\nand cards are played in almost all of them.\n\nEvery town has an Arena\nwhere tournaments are held.',
  },
  '17F0': { who: 'me', es: '¿Torneos?', en: 'Tournaments?' },
  '1844': {
    es: '¡Así es! Aquí en la aldea\ntambién hay una Arena.\n\nQuien gana un torneo recibe\nel pase al pueblo siguiente.\n\nSi quieres seguir el camino,\ntienes que ganar el torneo.',
    en: "That's right! There's an Arena\nhere in the village, too.\n\nWhoever wins a tournament gets\nthe pass to the next town.\n\nIf you want to keep going,\nyou have to win the tournament.",
  },
  '19BC': { who: 'me', es: 'Ah... entiendo.', en: 'Oh... I see.' },
  '1A0C': {
    es: 'Así es.\n\nDespués de ganar en la Arena, puedes\njugar contra la gente del Café.\n\nCada rival que vences\nte da cartas nuevas.\n\nTambién puedes armar un mazo automático.\nY mirar los mazos ajenos enseña mucho.\n\nPara el mazo que quieres, tienes que\njuntar las cartas adecuadas.\n\nAl llegar a un pueblo, pasa primero\npor el Café de batallas.\n\nAhí siempre hay alguien que sabe\nalgo que te puede servir.\n\nSeguro llegas lejos.\n¡Mucha suerte!',
    en: "That's right.\n\nAfter you win at the Arena, you can\nplay the regulars at the Cafe.\n\nEvery rival you beat\ngives you new cards.\n\nYou can also build a deck automatically.\nAnd other people's decks teach a lot.\n\nFor the deck you want, you need to\ncollect the right cards.\n\nWhen you reach a town, stop by\nthe Battle Cafe first.\n\nThere's always someone there\nwho knows something useful.\n\nI'm sure you'll go far.\nGood luck!",
  },
  '1DB4': { who: 'me', es: '¡Gracias, Nilo!', en: 'Thanks, Nilo!' },
  '1E08': { es: 'Si quieres, te enseño\na jugar una partida.', en: 'If you like, I can show you\nhow to play a match.' },
  '1EA0': { es: '¿Seguro?', en: 'Are you sure?' },
  '1F2C': { es: '¡Bien!\n\nVen a verme cuando\nquieras jugar.', en: 'Alright!\n\nCome and see me\nwhenever you want to play.' },
  '1FD8': { who: 'me', es: 'Claro, gracias. ¡Nos vemos!', en: 'Sure, thanks. See you later!' },
  '2054': { es: 'Bien.', en: 'OK.' },
  '20C8': { es: 'No te preocupes: con práctica,\nte saldrá cada vez mejor.\n\nVen a verme cuando\nquieras jugar.', en: "Don't worry, you'll get\nthe hang of it.\n\nCome and see me\nwhenever you want to play." },
  '2198': { who: 'me', es: '¡Muchas gracias! ¡Nos vemos!', en: 'Thanks a lot! See you later!' },
  '22D4': { es: '¡Hola! ¿Cómo estás?', en: 'Hi! How are you?' },
  '2334': { who: 'me', es: 'Bien, gracias.', en: 'Fine, thanks.' },
  '2388': { es: 'Si tienes tiempo, ¡juguemos!', en: "If you have time, let's play!" },
  '2400': { es: '¿Quieres que te explique\ncómo se juega otra vez?', en: 'Do you want me to explain\nhow to play again?' },
  '24C4': { es: 'Bien.', en: 'OK.' },
  '252C': { es: 'Nada mal.\n\nVen a verme cuando\nquieras jugar.', en: 'Not bad at all.\n\nCome and see me\nwhenever you want to play.' },
  '25F8': { es: '¿Jugamos una partida, entonces?', en: 'Shall we play a match, then?' },
  '2690': { es: 'Entiendo. ¡Vuelve cuando quieras!', en: 'I see. Come back anytime!' },
  '2710': { es: '¡Bien! ¡Estoy listo!', en: "Alright! I'm ready!" },
  '2780': { es: 'Por cierto, el otro día\nconseguí un mazo nuevo.\n\n¡Voy a usar este!', en: "By the way, I got\na new deck the other day.\n\nI'm using this one!" },
  '289C': { es: '¡Nooo! ¡Juegas muy bien!\nNo tuve ninguna oportunidad.\n\nFue divertido. ¡Juguemos otra vez!', en: "Oh no! You play really well!\nI didn't stand a chance.\n\nThat was fun. Let's play again!" },
  '297C': { es: '¡Gané! Creo que tuve suerte.\n\nLa próxima lo haré mejor.\n¡Fue divertido, juguemos otra vez!', en: "I won! I guess I got lucky.\n\nNext time I'll do even better.\nThat was fun, let's play again!" },
  '2A7C': niloDeck,
  '2B38': { who: null, es: '*c3Mazo Hallazgo\nUn mazo legendario: el más poderoso.', en: '*c3Lucky Find Deck\nA legendary deck: the most powerful.' },

  // Brezo, at the café
  '2CF4': { es: '¡Hola, soy Brezo! ¿Tú también\nvas a entrar a la Arena?', en: "Hi, I'm Brezo! Are you going\nto enter the Arena, too?" },
  '2D80': { who: 'me', es: 'Soy *h0, ¡y sí! Ese es el plan.', en: "I'm *h0, and yes! That's the plan." },
  '2DE4': {
    es: 'Entonces revisa bien tu mazo\nantes de entrar.\n\nNo puedes planear nada si no sabes\nqué cartas llevas.\n\nYo voy a estar en la Arena.\n¡Suerte!',
    en: "Then check your deck carefully\nbefore you go in.\n\nYou can't plan anything if you don't\nknow what cards you carry.\n\nI'll be at the Arena.\nGood luck!",
  },
  '2F5C': {
    es: 'Un mazo básico lleva unos 10 Novatos,\n7 Campeones y 3 Perfectos.\n\nTambién unas 2 cartas de Evolución\ny 8 cartas de Apoyo.\n\nAl principio no uses mazos\ndemasiado rebuscados.\n\n¡Empieza por lo básico!\n\nRecuerda: dentro de una Arena\nno puedes cambiar tu mazo.\n\nConviene armar 3 mazos pronto,\npero para eso necesitas cartas.',
    en: "A basic deck has about 10 Novices,\n7 Veterans and 3 Apex.\n\nAlso about 2 Evolution cards\nand 8 Support cards.\n\nAt first, stay away from decks\nthat are too tricky.\n\nStart with the basics!\n\nRemember: once you are in an Arena,\nyou can't change your deck.\n\nBuild 3 decks soon,\nbut you need cards for that.",
  },
  '3230': { es: '¿Jugamos una partida?', en: 'Shall we play a match?' },
  '32C8': { es: '¿En serio? ¡Qué pena!\nVuelve más tarde.', en: 'Really? Aw, too bad!\nCome back later!' },
  '3354': { es: '¡Prepárate! No te la voy a dejar fácil.', en: "Get ready! I won't go easy on you!" },
  '33F0': { es: '¡Ay, perdí! ¡Juegas muy bien!\n\nYa verás la próxima vez.', en: 'Oh no, I lost! You play really well!\n\nJust wait until next time.' },
  '34C0': { es: '¡Sí! ¿Viste qué bien juego?\n\nLa próxima tampoco pierdo.\n¡Otra vez, cuando quieras!', en: "Yes! Did you see how well I play?\n\nI won't lose next time either.\nAgain, whenever you want!" },
  '3580': brezoDeck,

  // Pipa, at the café
  '3734': {
    es: 'Juntar cartas es lo más importante\npara armar mazos fuertes.\n\nPara conseguir las cartas\nde un mazo en particular...\n\n...tienes que saber\ndónde se consiguen.\n\nCasi siempre, cada rival da\nlos mismos sobres y las mismas cartas.\n\nSi sabes qué tiene tu rival,\njuntas lo que te falta más rápido.',
    en: "Collecting cards is the most important\npart of building strong decks.\n\nTo get the cards\nfor a particular deck...\n\n...you need to know\nwhere to find them.\n\nEach rival usually gives\nthe same packs and cards.\n\nIf you know what your rival has,\nyou'll find what you need faster.",
  },
  '39B4': { es: '¿Jugamos una partida?', en: 'Shall we play a match?' },
  '3A50': { es: 'Qué lástima. Vuelve\ncuando tengas tiempo de jugar.', en: 'What a shame. Come back\nwhen you have time to play.' },
  '3AF0': { es: 'Bien. Prepárate,\nque no soy fácil de vencer.', en: "OK. Get ready,\nI'm not easy to beat." },
  '3B98': { es: 'Perdí. ¡Juegas demasiado bien!\n\nPero la próxima te gano.', en: "I lost. You're too good!\n\nBut I'll beat you next time." },
  '3C50': { es: 'Me parece que te falta práctica.\n\nJuguemos otra vez. ¡Adiós!', en: "Looks like you're out of practice.\n\nLet's play again. Bye!" },
  '3D10': { who: null, es: '*c3Mazo de Pipa\nUn mazo defensivo de las facciones\nAzul y Rara.', en: "*c3Pipa's Deck\nA defensive deck of the Blue\nand Rare factions." },

  // Grandma Retama, at the café
  '72C0': {
    es: 'Hola, criatura. Soy la Abuela Retama.\n\nSiéntate un ratito. Mira, cuando yo\nera una Novata...\n\n...iba a la escuela caminando cuesta\narriba, con nieve, ida y vuelta...\n\n¡Ay, perdona! Ya me puse a hablar\nde mis cosas otra vez, ¿no?\n\nEn fin, ¡te doy la bienvenida!',
    en: "Hello there, little one. I'm Grandma Retama.\n\nSit down for a bit. Listen, when I\nwas a Novice...\n\n...I walked to school uphill,\nin the snow, both ways...\n\nOh, I'm sorry! I'm rambling on\nabout my things again, aren't I?\n\nAnyway, welcome!",
  },
  '74A0': retamaToArena,
  '7684': {
    es: 'Mmm... Parece que Nilo todavía no\nte contó cómo es este mundo.\n\nLo primero que tienes que hacer\nes hablar con Nilo.\n\nTe espero.\n¡Ja, ja, ja!',
    en: "Hmm... It looks like Nilo hasn't told\nyou about this world yet.\n\nThe first thing you need to do\nis talk to Nilo.\n\nI'll be waiting.\nHa ha ha!",
  },
  '77FC': {
    es: '¿Qué? ¿Todavía no hablaste\ncon Nilo?\n\nPues primero tienes que\nhablar con él.\n\nTe espero.\n¡Ja, ja, ja, ja!',
    en: "What? You still haven't\ntalked to Nilo?\n\nWell, you have to talk\nto him first.\n\nI'll be waiting.\nHa ha ha ha!",
  },
  '791C': retamaToArena,
  '7C4C': { es: 'De verdad, deberías probar la Arena.\n\nTe espero allí. ¡Ja, ja, ja!', en: "You really should try the Arena.\n\nI'll be waiting there. Ha ha ha!" },
  '7D2C': {
    es: 'Te voy a dar un consejo que vale oro.\n\nEs sobre las cartas de Apoyo.\nSon muy importantes.\n\nPueden ser muy poderosas, pero\nno llenes tu mazo con ellas.\n\nSi lo haces, te pueden faltar\ncriaturas para combatir.\n\nPor eso conviene llevar\nunas 10 cartas de Apoyo.\n\nMás que eso te puede complicar\nla vida. Tenlo en cuenta.',
    en: "Here's some advice worth its weight in gold.\n\nIt's about Support cards.\nThey're very important.\n\nThey can be very powerful, but\ndon't fill your deck with them.\n\nIf you do, you may run short\nof creatures to fight with.\n\nThat's why it's best to carry\nabout 10 Support cards.\n\nAny more than that can make\nlife hard. Keep it in mind.",
  },
  '7FF0': { es: '¿Quieres jugar otra vez, criatura?', en: 'Want to play again, little one?' },
  '808C': { es: 'Bueno, qué pena.\nVuelve cuando tengas más tiempo.', en: "Well, that's a shame.\nCome back when you have more time." },
  '8124': { es: '¡Prepárate! No pienso tenerte piedad.', en: "Get ready! I won't show you any mercy!" },
  '81D0': { es: '¡Vaya, criatura! ¡Qué fuerza tienes!\n\nPero la próxima será distinto.\n¡Ja, ja, ja!', en: "My, my, little one! You're strong!\n\nBut next time will be different!\nHa ha ha!" },
  '83CC': { es: '¿Qué te pasó?\n¿No te sientes bien?\n\nEsta vez gano yo. ¡Ja, ja, ja, ja!', en: 'What happened?\nNot feeling well?\n\nThis time I win. Ha ha ha ha!' },
  '8498': retamaDeck,

  // the first tournament: Brezo, then Grandma Retama
  B2C0: {
    es: 'Soy tu primer rival.\n¡Vamos, a jugar!\n\n¡No te la voy a dejar fácil!\nLo siento, pero no puedo dejarte ganar.',
    en: "I'm your first opponent.\nCome on, let's play!\n\nI won't go easy on you!\nSorry, I just can't let you win!",
  },
  B45C: { es: 'Voy a ganar. ¿Empezamos?', en: "I'm going to win. Ready?" },
  B4F0: { es: 'Bueno, qué lástima.', en: "Well, that's too bad." },
  B558: { es: '¡Bien! ¡Muéstrame tu mejor jugada!', en: 'OK! Hit me with your best shot!' },
  B5FC: { es: '¡Increíble, me ganaste! ¡Qué fuerza!\n\nLa próxima no te será tan fácil.', en: "Wow, you beat me! So strong!\n\nIt won't be so easy next time." },
  B6D4: { es: '¡Sí! ¿Viste qué bien juego?\n\nMientras yo esté en esta Arena,\nno vas a pasar.', en: "Yes! Did you see how good I am?\n\nAs long as I'm in this Arena,\nyou won't get any further!" },
  B7B8: brezoDeck,
  B8D8: {
    es: '¡La gran maestra de esta Arena\nsoy yo, la Abuela Retama!\n\nTienes talento, criatura.\nPero ¿te alcanza para vencerme?',
    en: "The grand master of this Arena\nis me, Grandma Retama!\n\nYou've got skills, little one.\nBut are they enough to beat me?",
  },
  BA88: { es: '¡Prepárate! ¡Allá voy, criatura!', en: 'Get ready! Here I come, little one!' },
  BB20: { es: 'Tómate tu tiempo. Hagas lo que hagas,\nyo siempre gano.\n\n¡Ja, ja, ja!', en: 'Take your time. Whatever you do,\nI always win.\n\nHa ha ha!' },
  BBE8: { es: 'Cuando quieras, empezamos.', en: "Whenever you're ready, let's begin." },
  BC88: {
    es: 'No puedo creer que me hayas ganado.\n\nTienes mucho potencial.\nQuiero ver hasta dónde llegas.\n\nSi quieres volver a jugar conmigo,\nven al Café de batallas.\n\nAllí te espero. ¡Ja, ja, ja!',
    en: "I can't believe you beat me.\n\nYou have a lot of potential.\nI want to see how far you go.\n\nIf you want to play me again,\ncome to the Battle Cafe.\n\nI'll be waiting there. Ha ha ha!",
  },
  BE48: { who: null, es: '¡Felicitaciones por la victoria!\nRecibiste el pase a Hornos Viejos.', en: 'Congratulations on your win!\nYou got the pass to Old Kilns.' },
  CA64: { es: '¡Ja, ja, ja! Te falta mucho por aprender.\n\nVuelve cuando quieras.\nTe enfrento cualquier día.\n\n¡Ja, ja, ja!', en: "Ha ha ha! You have a lot to learn.\n\nCome back anytime.\nI'll take you on any day.\n\nHa ha ha!" },
  CB64: retamaDeck,
};

export const CITY00: CityTexts = { ...ARRIVAL, ...CITY00_LATER };
