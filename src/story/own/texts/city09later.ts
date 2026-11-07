/**
 * Camino del Risco, the other regulars of the café: Mandíbula (who used to be Hebra, the Collector's
 * partner), Fermín (the Collector himself, who gives it all up and hands over the partner cards he
 * hoarded), the Blot, Duende and Gruñón.
 */
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });
/** The partner card the player picked from the ones Fermín hoarded (the pick itself gives the card). */
const partnerCard = (name: string): Written => ({ who: null, es: `Recibiste la carta de *c6${name}*c7.`, en: `You got the *c6${name}*c7 card.` });

const fermin = {
  gift: {
    es: 'Por tus palabras... quiero\ndarte algo a cambio.\n\nSon cartas de compañeros que acaparé.\nNo puedo darte todas...\n\n...pero elige la que más te guste.',
    en: "For your kind words... I want\nto give you something in return.\n\nThese are partner cards I hoarded.\nI can't give you all of them...\n\n...but pick the one you like best.",
  },
  thanks: { who: 'me', es: '¡Gracias! ¡Es genial!', en: 'Thanks. This is great!' },
};

const borronLost = {
  es: '¿Adónde... voy...?\n\n¿Me espera la paz allí?\n\n¿O me tragará más rencor?\n\nNo lo sé...',
  en: 'Where... am I... going?\n\nIs peace waiting for me there?\n\nOr will more bitterness swallow me?\n\nI do not know...',
};

const grunonBeaten = {
  es: '¡Ya me las vas a pagar, no lo olvides!\nLa próxima no me ganas.\n\nCuando menos lo esperes,\n¡ahí voy a estar! ¡Ja, ja, ja, ja!',
  en: "You'll pay for this, don't forget it!\nYou won't beat me next time.\n\nWhen you least expect it,\nI'll be there! Ha ha ha ha!",
};

export const CITY09_LATER: CityTexts = {
  // Mandíbula: Hebra, in a new shape
  '3FA8': {
    es: 'Soy Mandíbula. Antes me llamaba Hebra.\nAlcancé una forma nueva.\n\nLlegué hasta aquí porque tú me enseñaste\nlo divertidas que son las partidas.\n\n¡De verdad!\n\nBueno, basta de charla.\n¡Quiero jugar contigo!\n\nNo pensarás irte\nsin jugar conmigo, ¿no?\n\nAlguien que juega como tú nunca le da\nla espalda a una buena partida.',
    en: "I'm Mandíbula. I used to be Hebra.\nI reached a new shape.\n\nI got this far because you showed me\nhow fun card matches can be.\n\nIt's true!\n\nWell, enough talk.\nI want to play you!\n\nYou weren't planning to leave\nwithout playing me, were you?\n\nSomeone who plays like you never\nturns their back on a good match.",
  },
  '4338': { es: 'Llegué a esta forma gracias a ti.\nMe enseñaste lo divertido que es jugar.', en: 'I reached this shape thanks to you.\nYou taught me how fun playing is.' },
  '43E8': { es: 'Sabía que me lo pedirías.\nLo sabía. ¿Jugamos?', en: "I knew you'd ask.\nI just knew it. Shall we play?" },
  '44A0': { es: '¡No! No me decepciones.\n¿No lo quieres pensar otra vez?', en: "No! Don't let me down.\nWon't you change your mind?" },
  '453C': { es: 'Muy bien. ¿Empezamos?', en: 'Alright. Shall we begin?' },
  '45D8': {
    es: 'Todavía juegas mejor que yo.\nMe falta mucho entrenamiento...\n\nMmm... Fue una buena lección.\n\nPerdí esta vez, pero la próxima\nque nos crucemos, pierdes tú.\n\n¡No me voy a quedar de brazos cruzados!\n\nPor cierto, si tienes tiempo,\njuega una partida con Fermín.\n\nLe hará bien volver a jugar contigo.\n\nHazlo por mí, ¿sí?',
    en: "You still play better than me.\nI need a lot more training...\n\nHmm... It was a good lesson.\n\nI lost this time, but the next time\nwe meet, you're the one who loses.\n\nI'm not going to just sit around!\n\nBy the way, if you have time,\nplay a match with Fermín.\n\nIt'll do him good to play you again.\n\nDo it for me, OK?",
  },
  '4B30': {
    es: '¡Gané! Esta forma me sienta bien,\n¿no te parece?\n\n¿Verdad que mejoré mucho?\nHe entrenado bastante.\n\nSigamos dando lo mejor.\n\nAvísame cuando quieras jugar.\n¡Siempre tengo tiempo!',
    en: "I won! This shape suits me,\ndon't you think?\n\nI've improved a lot, right?\nI've been training hard.\n\nLet's keep doing our best.\n\nTell me whenever you want to play.\nI always have time!",
  },
  '4D44': deck('*c3Mazo Rey Sombrío\nUn mazo poderoso que usa toda\nla fuerza de la facción Sombría.', '*c3Shadow King Deck\nA powerful deck that uses all\nthe strength of the Shadow faction.'),

  // Fermín: the Collector, unmasked, gives it all up
  '4E10': { es: '...', en: '...' },
  '4E58': { who: 'me', es: '¡Tú eres el Coleccionista!', en: "You're the Collector!" },
  '4EB4': {
    es: 'Sí... Me llamo Fermín.\nPerdón por todo lo que hice.\n\nEn ese momento sentía\nque lo entendía todo...\n\nPero ahora lo veo distinto.\nEra como si algo me tuviera atrapado.\n\nCreía tener todas las respuestas.\nCreía saber lo que hacía.\n\nJunté cartas sin parar, puse Arenas\ny criaturas bajo mi hechizo...\n\n...y obligué a Hebra a hacerles daño\na ti y a los demás.\n\nNo sabía lo que hacía.\nHebra y tú me lo hicieron ver.\n\nGracias a ti, sé que hay cosas\nmás importantes que ganar.',
    en: "Yes... My name is Fermín.\nI'm sorry for everything I did.\n\nBack then, I felt like\nI understood everything...\n\nBut now I see it differently.\nIt was as if something had a hold on me.\n\nI thought I had all the answers.\nI thought I knew what I was doing.\n\nI hoarded cards, and put Arenas\nand creatures under my spell...\n\n...and I made Hebra hurt you\nand the others.\n\nI had no idea what I was doing.\nYou and Hebra made me see it.\n\nThanks to you, I know some things\nmatter more than winning.",
  },
  '51DC': {
    who: 'me',
    es: 'Yo no hice nada, en serio.\n¡Agradécele a Hebra!\n\nAdemás, seguro que Hebra\nya te perdonó.',
    en: "I didn't really do anything.\nYou should thank Hebra!\n\nBesides, I'm sure Hebra\nhas already forgiven you.",
  },
  '52B4': { es: 'Gracias... Me hace bien oír eso.', en: "Thanks... That's good to hear." },
  '5320': fermin.gift,
  '54F4': partnerCard('Brinco'),
  '5564': partnerCard('Trino'),
  '55D4': partnerCard('Gema'),
  '564C': partnerCard('Bollo'),
  '56BC': partnerCard('Zarpa'),
  '572C': partnerCard('Hebra'),
  '578C': { es: 'Me alegra poder ayudarte en algo.', en: "I'm glad I can help you somehow." },
  '57F8': fermin.thanks,
  '5854': { es: 'Si no te molesta, algún día\nquiero la revancha.\n\nNos vemos.', en: "If you don't mind, someday\nI'd like a rematch.\n\nSee you." },
  '5A78': {
    es: 'Ahora sé que hay cosas\nmás importantes que ganar.\n\nY te lo debo a ti...\n\nPor tus palabras... quiero\ndarte algo a cambio.\n\nSon cartas de compañeros que acaparé.\nNo puedo darte todas...\n\n...pero elige la que más te guste.',
    en: "Now I know some things\nmatter more than winning.\n\nAnd I owe it all to you...\n\nFor your kind words... I want\nto give you something in return.\n\nThese are partner cards I hoarded.\nI can't give you all of them...\n\n...but pick the one you like best.",
  },
  '5CF8': partnerCard('Brinco'),
  '5D68': partnerCard('Trino'),
  '5DD8': partnerCard('Gema'),
  '5E50': partnerCard('Bollo'),
  '5EC0': partnerCard('Zarpa'),
  '5F30': partnerCard('Hebra'),
  '5F90': { es: 'Me alegraría poder ayudarte en algo.', en: "I'd be glad if I could help you somehow." },
  '5FFC': fermin.thanks,
  '6060': { es: 'Ahora sé que la vida es más\nque ganar partidas de cartas.\n\nTodo gracias a ti.', en: 'Now I know life is more\nthan winning card matches.\n\nAll thanks to you.' },
  '6134': { es: '¡Yo también mejoré!\nVoy a jugar con todo. ¿Empezamos?', en: "I've improved, too! I'll give it\neverything. Shall we start?" },
  '61F0': { es: '¿No...? Qué pena.\nOjalá la próxima vez se pueda.', en: "No...? That's too bad.\nI hope we can next time." },
  '62D8': { es: '¡Muy bien! ¡Esta vez no pierdo!', en: "Alright! I won't lose this time!" },
  '6324': { es: 'En realidad, quiero pedirte algo.\n¿Me escuchas?', en: 'Actually, I want to ask you something.\nWill you hear me out?' },
  '63A8': { es: 'Quiero que juegues con este\n*c3Mazo Humareda*c7, que armé yo...', en: 'I want you to play with this\n*c3Smokescreen Deck*c7 I built...' },
  '6420': { es: 'Creo que es un mazo bastante bueno.', en: "I think it's a pretty good deck." },
  '6478': { es: 'Armé otro mazo.', en: 'I built another deck.' },
  '64BC': { es: 'Se llama *c3Mazo Quetzal*c7.\nQuiero que lo pruebes en una partida.', en: "It's called the *c3Quetzal Deck*c7.\nI want you to try it in a match." },
  '6540': { es: 'Creo que me salió muy fuerte.\nHazlo por mí, por favor.', en: 'I think it turned out really strong.\nPlease do this for me.' },
  '6648': {
    es: '¡Vaya! ¡Juegas muy bien!\n\nCreí que me iba bien,\npero fuiste demasiado para mí.\n\nVoy a entrenar mucho\npara ser más fuerte.\n\nNo puedo seguir perdiendo.\nOjalá juguemos más seguido.\n\nAprendo mucho contigo.\nJuguemos otra vez.',
    en: "Wow! You're really good!\n\nI thought I was doing well,\nbut you were too much for me.\n\nI'm going to train hard\nand get stronger.\n\nI can't keep losing.\nI hope we play more often.\n\nI learn a lot from you.\nLet's play again.",
  },
  '6A58': {
    es: '¡Bien! ¡Gané!\n\nQué sorpresa.\n¡Nunca pensé que podría ganarte!\n\n¿Ves? ¿No crees que mejoré\nbastante?\n\nPero voy a ser todavía más fuerte.\n\nGané esta vez, pero no creo\nque siempre tenga tanta suerte.\n\nOjalá juguemos más seguido.\nAprendo mucho contigo.\n\n¡Bueno, nos vemos!',
    en: "Great! I won!\n\nWhat a surprise.\nI never thought I could beat you!\n\nSee? Don't you think\nI've improved a lot?\n\nBut I'll get even stronger.\n\nI won this time, but I don't think\nI'll always be this lucky.\n\nI hope we play more often.\nI learn a lot from you.\n\nWell, see you!",
  },
  '6CD4': deck('*c3Mazo Laberinto\nUn mazo Sombrío que ataca\ncon Interferencia.', '*c3Labyrinth Deck\nA Shadow deck that attacks\nwith Jamming.'),

  // the Blot
  '6EA0': {
    es: '¿Qué sabes tú del dolor de quienes\nse quedaron atrás mientras\nlos demás evolucionaban?\n\n¡Odio todo!\n\nMi rencor no se irá hasta que...\nborre todo lo que existe.',
    en: 'What do you know of the pain of those\nleft behind while\nthe others evolved?\n\nI hate everything!\n\nMy bitterness will not fade until...\nI erase everything there is.',
  },
  '7010': borronLost,
  '7150': { es: '¿Crees que puedes vencerme?', en: 'Do you think you can beat me?' },
  '71E8': { es: '¿No? Entonces vuelve\ncuando te atrevas.', en: 'No? Then come back\nwhen you dare.' },
  '7254': { es: '¡Que te consuma el fuego de mi rencor!', en: 'Burn in the fire of my bitterness!' },
  '72F0': {
    es: 'Ohhh... Me apago...\n¿Se apagará también mi rencor?\n\n¿Me salvaré ahora?\nNo lo sé... No lo sé...\n\n¿Adónde... voy...?\n\n¿Me espera la paz allí?\n\n¿O me tragará más rencor?\n\nNo lo sé...',
    en: 'Ohhh... I am fading...\nWill my bitterness fade, too?\n\nWill I be saved now?\nI do not know... I do not know...\n\nWhere... am I... going?\n\nIs peace waiting for me there?\n\nOr will more bitterness swallow me?\n\nI do not know...',
  },
  '7808': {
    es: 'Ohhh... El rencor crece dentro de mí.\nYa no puedo contenerlo...\n\nEs hora de soltarlo y hundir\neste mundo en la oscuridad.\n\nHaré que todos sientan mi dolor.\n\n¡Sientan mi dolor! ¡Mi agonía!\n\n¡Esta es la venganza de quienes\nse quedaron atrás sin evolucionar!',
    en: 'Ohhh... The bitterness grows inside me.\nI cannot hold it in any longer...\n\nIt is time to let it out and plunge\nthis world into darkness.\n\nI will make everyone feel my pain.\n\nFeel my pain! Feel my agony!\n\nThis is the revenge of those\nleft behind, never to evolve!',
  },
  '7A48': deck('*c3Mazo Vacío Desesperado\nEl mazo más cruel y poderoso de todos.', '*c3Desperate Void Deck\nThe cruelest, most powerful deck.'),

  // Duende: small, cheeky and not as easy as he looks
  '7AF4': { es: '¡Eh, tú! ¡Aprendiz!\n¡Aquí abajo! Sí, aquí.\n\n¿Quieres jugar conmigo?', en: 'Hey, you! Apprentice!\nDown here! Yes, here.\n\nWant to play with me?' },
  '7BC8': { who: 'me', es: '¿Una partida? ¡Claro!', en: 'A match? Sure!' },
  '7C1C': { es: 'Crees que por ser pequeño\nsoy fácil de vencer, ¿no?\n\nPues ten cuidado.', en: "You think I'm easy to beat\nbecause I'm small, don't you?\n\nWell, be careful." },
  '7D8C': { es: 'Estás pensando que soy débil, ¿verdad?\nMejor cuida tus pasos.', en: "You think I'm weak, right?\nYou'd better watch your step." },
  '7E34': { es: '¿Empezamos?', en: 'Shall we start?' },
  '7EB8': { es: '¿¡No te animas!?', en: "You're not up for it?!" },
  '7F20': { es: '¡Te advierto que voy en serio!', en: "I'm warning you, I mean it!" },
  '7FBC': {
    es: 'Ja, ja, ja. Nada mal, nada mal.\nEsta vez me ganaste.\n\nPero la próxima será distinto.\n¡Palabra de Duende!\n\n¡Nos vemos! ¡Adiós!',
    en: "Ha ha ha. Not bad, not bad.\nYou beat me this time.\n\nBut next time will be different.\nDuende's honor!\n\nSee you! Bye!",
  },
  '82E8': {
    es: '¡¿Qué?! Juegas mucho peor\nde lo que pensaba.\n\nHasta mi abuela juega mejor.\nVuelve cuando tengas más fuerza.\n\n¡Hasta luego! ¡Adiós!',
    en: "What?! You play way worse\nthan I thought.\n\nEven my grandma plays better.\nCome back when you're stronger.\n\nSee you! Bye!",
  },
  '841C': deck('*c3Mazo Revancha\nUn mazo Verde con Interferencia\ny contraataques.', '*c3Payback Deck\nA Green deck with Jamming\nand counterattacks.'),

  // Gruñón: a grumpy traveller who will not take no for an answer
  '84D0': {
    es: 'Soy Gruñón. ¡Vine de muy, muy lejos!\n\n¡Juega conmigo! ¡Y ni se te\nocurra salir corriendo!\n\n¡Que juegues conmigo, dije!',
    en: "I'm Gruñón. I came from far, far away!\n\nPlay with me! And don't even\nthink about running away!\n\nI said, play with me!",
  },
  '85F0': { who: 'me', es: 'Bueno. Si tanto insistes...', en: 'OK. If you really insist...' },
  '8658': { es: '¡Así me gusta!\n¡Cuando quieras, empezamos!\n\n¡Ja, ja, ja, ja, ja!', en: "That's more like it!\nWe start whenever you want!\n\nHa ha ha ha ha!" },
  '885C': { es: '¡Oye, tú!\n¡No hay tiempo para charlar!\n\n¡Apúrate, que quiero jugar!\n¡Ja, ja, ja, ja, ja!', en: "Hey, you!\nThere's no time to chat!\n\nHurry up, I want to play!\nHa ha ha ha ha!" },
  '8940': grunonBeaten,
  '8A5C': { es: '¡Vamos! ¿Empezamos o no?', en: 'Come on! Are we starting or not?' },
  '8AE8': { es: '¿Cómo que no?', en: 'What do you mean, no?' },
  '8B48': { es: '¡Eso es!', en: "That's it!" },
  '8BD8': {
    es: '¡Nooo! ¡Perdí!\n¡Juegas demasiado bien!\n\n¡Ya me las vas a pagar, no lo olvides!\nLa próxima no me ganas.\n\nCuando menos lo esperes,\n¡ahí voy a estar! ¡Ja, ja, ja, ja!',
    en: "Nooo! I lost!\nYou're too good!\n\nYou'll pay for this, don't forget it!\nYou won't beat me next time.\n\nWhen you least expect it,\nI'll be there! Ha ha ha ha!",
  },
  '8EFC': { es: '¡Ja, ja, ja, ja, ja!\n¡Te gané!\n\n¡Qué bien me siento!\n\n¡Te enfrento cuando quieras!\n\n¡Ja, ja, ja, ja, ja!', en: "Ha ha ha ha ha!\nGot you!\n\nI feel great!\n\nI'll take you on anytime!\n\nHa ha ha ha ha!" },
  '9034': deck('*c3Mazo ¿Y Tú Quién Eres?\nUn mazo lleno de criaturas sospechosas.', '*c3Who Are You? Deck\nA deck full of suspicious creatures.'),
};
