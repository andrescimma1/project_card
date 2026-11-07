/**
 * Hornos Viejos (city 1): the old kiln town. Dante, a traveller, has a bad feeling about the Arenas, and a
 * stranger warns the player too. Pavesa, Ceniza and Brinco run the Arena; Zarpazo opens the Extra Arena,
 * where he changes form round after round (Chispero, Trueno, Dúo, Áureo, Soberano). After the end of the
 * story, Plumaria and Soledad come by, and the Blot wanders in from time to time.
 */
import type { CityTexts } from './types';

// the player
const meHello = { who: 'me', es: '¡Hola, soy *h0!', en: "Hi, I'm *h0!" };
const mePuzzled = { who: 'me', es: '¿...?', en: '...???' };

// decks
const pavesaDeck = { who: null, es: '*c3Mazo Brasa Viva\nTodo Rojo y muy caliente.\nEs más rápido de lo que parece.', en: '*c3Live Ember Deck\nAll Red and really hot.\nIt is faster than it looks.' };
const cenizaDeck = {
  who: null,
  es: '*c3Mazo Cielo de Ceniza\nUn mazo Rojo que ataca desde el aire.\nCuidado con sus golpes por sorpresa.',
  en: '*c3Ash Sky Deck\nA Red deck that strikes from the air.\nWatch out for its surprise attacks.',
};
const brincoDeck = {
  who: null,
  es: '*c3Mazo Estampida\nUna manada de bestias que escupen fuego.\n¡Frena sus ataques de Furia!',
  en: '*c3Stampede Deck\nA herd of fire-breathing beasts.\nStop their Fury attacks!',
};
const zarpazoDeck = { who: null, es: '*c3Mazo Contragolpe\nUn mazo Rojo muy bueno\npara devolver los golpes.', en: '*c3Counterblow Deck\nA Red deck that is great\nat striking back.' };
const chisperoDeck = {
  who: null,
  es: '*c3Mazo Mecha Corta\nUn mazo Rojo muy fuerte que lo\narriesga todo en cada golpe.',
  en: '*c3Short Fuse Deck\nA strong Red deck that risks\neverything on every blow.',
};
const truenoDeck = {
  who: null,
  es: '*c3Mazo Relámpago\nUn mazo veloz con criaturas de nivel\nArmadura y cartas de Apoyo.',
  en: '*c3Lightning Deck\nA fast deck of Armored creatures\nand Support cards.',
};
const duoDeck = {
  who: null,
  es: '*c3Mazo Tres Presagios\nIntenta adivinar tus ataques, pero\nsi se equivoca, sale lastimado.',
  en: '*c3Three Omens Deck\nIt tries to guess your attacks, but\nif it guesses wrong, it gets hurt.',
};
const aureoDeck = {
  who: null,
  es: '*c3Mazo Caballero Dorado\nUn mazo Rojo de criaturas de nivel\nArmadura. Muy fuerte en defensa.',
  en: '*c3Golden Knight Deck\nA Red deck built on Armored creatures.\nVery strong on defense.',
};
const soberanoDeck = {
  who: null,
  es: '*c3Mazo Corona Invicta\nEl mazo supremo de Soberano,\nlleno de criaturas muy fuertes.',
  en: "*c3Unbeaten Crown Deck\nSoberano's supreme deck,\nfull of very strong creatures.",
};

// lines that repeat
const cenizaGo = { es: '¡Prueba mi Lluvia de Ceniza!', en: 'Taste my Ash Rain!' };
const brincoAsk = { es: 'Y bien, ¿subimos al ring?', en: 'So, shall we step into the ring?' };
const brincoGo = { es: '¡Bien! ¡Dame tu mejor golpe!', en: 'Alright! Hit me with your best shot!' };
const danteStrongDeck = { es: '¡Es un mazo bastante fuerte!', en: "It's a pretty strong deck!" };
const eggNotice = { who: null, es: '¡Recibiste un *c3huevo*c7\npara tu compañero!', en: 'You got an *c3egg*c7\nfor your partner!' };
const zarpazoGo = { es: '¡Bien!', en: 'OK!' };
const chisperoAsk = { es: '¡Que salten chispas!\n¿Empezamos?', en: "Let's make sparks fly!\nShall we begin?" };
const chisperoNo = { es: '¿Qué? ¿Te echas para atrás?', en: "What?! You're backing out?" };
const chisperoGo = { es: '¡Con todo!', en: 'Go for it!' };
const chisperoLoss = {
  es: 'Parece que la batalla\nfue demasiado para ti.\n\nNo te exijas tanto.\nPuedes desafiarme cuando quieras.',
  en: "Looks like the battle\nwas too much for you.\n\nDon't be so hard on yourself.\nYou can challenge me anytime.",
};
const truenoAsk = { es: '¿Entonces empezamos?', en: 'So, shall we get going?' };
const truenoWait = { es: 'Eso es. Tómate tu tiempo.\n¡Ja, ja, ja, ja!', en: "That's right. Take your time.\nHa ha ha ha!" };
const truenoGo = { es: '¡Bien! ¡Estoy listo!', en: "OK! I'm ready!" };
const truenoLossCalm = {
  es: 'Ja, ja, ja, ja... Te faltó calma.\n\n¡Tienes que aprender a relajarte!\n\nNo te preocupes.\n¡Ven a jugar cuando quieras!',
  en: "Ha ha ha ha... You were too tense.\n\nYou've got to learn to relax!\n\nDon't worry about it.\nCome and play me anytime!",
};
const truenoLossTense = {
  es: 'Ja, ja, ja, ja... Te noto con nervios.\n\n¡Tienes que aprender a relajarte!\n\nNo te preocupes.\n¡Ven a jugar cuando quieras!',
  en: "Ha ha ha ha... You look a bit tense.\n\nYou've got to learn to relax!\n\nDon't worry about it.\nCome and play me anytime!",
};
const duoAsk = { es: 'Concentrándonos...\n\n¿Empezamos?', en: 'Concentrating...\n\nShall we begin?' };
const duoWait = { es: 'Tómate tu tiempo. Tenemos de sobra.\n¡Ja, ja, ja, ja...!', en: 'Take your time. We have plenty.\nHa ha ha ha...!' };
const duoGo = { es: '¡Ahora...!', en: 'Now...!' };
const duoLoss = {
  es: 'No perdemos...\nSabíamos que ganaríamos.\n\nAntes de volver a desafiarnos,\nentrena tu mente.\n\nTe esperamos...',
  en: "We do not lose...\nWe knew we would win.\n\nBefore you challenge us again,\ntrain your mind.\n\nWe'll be waiting...",
};
const duoToAureo = {
  es: 'Para vencer nuestra mente...\nnecesitas una mente increíble...\n\nPor fin es hora de unirnos en Áureo.\nVerás nuestro verdadero poder.',
  en: "To beat our minds...\nyou must have an incredible mind...\n\nAt last it's time to become Áureo.\nYou'll see our true power.",
};
const aureoAsk = { es: 'No pienso perder...\n¿Aún quieres enfrentarme?', en: 'I will not lose...\nDo you still want to face me?' };
const aureoNo = { es: 'Sí. Es una sabia decisión.', en: 'Yes. That is a wise decision.' };
const aureoGo = { es: 'Ya veo...\nSi insistes, ¡lucharé contigo!', en: 'I see...\nIf you insist, I will fight you!' };
const aureoLoss = {
  es: 'Mi defensa no se rompe tan fácil.\n\nPero fue una batalla intensa.\nSi quieres la revancha, vuelve.\n\n¡Te estaré esperando!',
  en: 'My defense is not easy to break.\n\nBut it was an intense battle.\nIf you want a rematch, come back.\n\nI will be waiting for you!',
};
const soberanoNo = { es: '¡No me decepciones! ¡Lucha con todo!', en: "Don't let me down!\nFight with all you've got!" };

export const CITY01: CityTexts = {
  // Pavesa, an ember spirit from the big kiln, at the café
  '17C4': {
    es: 'Las criaturas Rojas...\ntienen mucho poder de ataque...\n\nSi quieres un mazo de ataque...\nlleva criaturas Rojas... chss...\n\nTambién conviene llevar...\ncartas de Apoyo que refuercen\na tu facción...\n\nAvivan el fuego... Muy... útiles...',
    en: 'Red creatures...\nhave lots of attack power...\n\nIf you want an attack deck...\nbring Red creatures... hsss...\n\nIt also helps to bring...\nSupport cards that boost\nyour own faction...\n\nThey stoke the fire... Very... useful...',
  },
  '198C': { es: '¿Jugamos... una partida?', en: 'Shall we... play a match?' },
  '1A1C': { es: 'Ya veo...', en: 'I see...' },
  '1A78': { es: 'Voy a convertirte...\nen pan tostado...', en: "I'll turn you...\ninto toast..." },
  '1B18': { es: '¡Perdí...!\n\nPero... la próxima... gano yo...', en: 'I lost...!\n\nBut... next time... I... win...' },
  '1BC0': { es: 'Yo... no... pierdo...\n\nYo... siempre gano...\nVuelve... si quieres perder otra vez...', en: 'I... do not... lose!!\n\nI... always win...!!\nCome back... to lose again...' },
  '1C98': pavesaDeck,

  // Ceniza, a proud ash bird, at the café
  '1E58': {
    es: 'Las reliquias que recibe tu compañero\nhay que usarlas, o se desperdician.\n\nPero recuerda: tu compañero solo\npuede llevar un efecto de soporte\na la vez.\n\nUn consejito, nada más...',
    en: "The relics your partner receives\nshould be used, or they'll go to waste.\n\nBut remember: your partner can only\ncarry one support effect at a time.\n\nJust a little advice...",
  },
  '1FD0': { es: 'Mi mazo ya está listo.\n¿Y el tuyo? ¿Jugamos?', en: 'My deck is ready.\nIs yours? Shall we play?' },
  '207C': { es: 'No hay ninguna prisa.', en: 'There is no need to hurry.' },
  '20F0': cenizaGo,
  '2198': {
    es: '¡Imposible! ¿Cómo perdí?\n\nJuegas bien, pero mi Lluvia de Ceniza\nse hará cada vez más fuerte.\n\nAsí que no creas que me vencerás\nla próxima vez...',
    en: "Impossible! How did I lose?\n\nYou're good, but my Ash Rain\nwill only grow stronger.\n\nSo don't think you'll beat me\nthe next time we meet...",
  },
  '22F4': {
    es: 'Tal como esperaba. Mi Lluvia de Ceniza\nfue demasiado para ti.\n\nNo tienes ninguna oportunidad...\n\nPero sigue poniéndote a prueba.',
    en: "Just as I expected. My Ash Rain\nwas too much for you.\n\nYou don't stand a chance against me...\n\nBut keep testing yourself.",
  },
  '2434': cenizaDeck,

  // Brinco, a boxing kangaroo and master of the Arena, at the café
  '25F8': {
    es: '¡Entrena a tu compañero llevándolo\nsiempre en tu mazo!\n\n¡Al subir de nivel,\nrecibe más reliquias!\n\n¡Y cada 5 niveles se hace más fuerte!\n¡Como un buen boxeador!',
    en: 'Train your partner by always\nkeeping it in your deck!\n\nAs it levels up,\nit gets more relics!\n\nAnd every 5 levels, it gets stronger!\nJust like a good boxer!',
  },
  '2770': brincoAsk,
  '27FC': { es: '¿Te dio miedo? ¡Ja, ja, ja!\nNadie sube de categoría antes de tiempo.', en: "Scared? Ha ha ha!\nDon't step up a weight class too soon!" },
  '28A0': brincoGo,
  '2944': { es: '¡Uf! No puedo creer que perdí...\n\n¡Rayos!\n\n¡Vuelve por la revancha!\nLa próxima no pierdo.', en: "Whoa! I can't believe I lost...\n\nDarn it!\n\nCome back for a rematch!\nNext time I won't lose!" },
  '2B88': { es: '¡Ja, ja, ja! ¡Te lo dije!\n¡Yo siempre gano!\n\n¡Es broma, es broma!', en: 'Ha ha ha! I told you so!\nI always win!\n\nJust kidding, just kidding!' },
  '2C54': brincoDeck,

  // Dante, a traveller, the first time
  '2D28': { es: '¡Hola! Me llamo Dante.\n¡Mucho gusto!', en: 'Hi! My name is Dante.\nNice to meet you!' },
  '2DA0': meHello,
  '2DF0': { es: '¿Puedo hablar contigo un momento?', en: 'Can I talk to you for a moment?' },
  '2E4C': { es: 'Hay algo que me tiene inquieto...', en: 'Something has been bugging me...' },
  '2EB0': { who: 'me', es: 'Claro...\n\n¿Qué pasa?', en: "Sure...\n\nWhat's on your mind?" },
  '2F34': {
    es: 'Últimamente pasan cosas raras\nen las Arenas de varios pueblos.\n\nDicen que alguien se está\nquedando con ellas.',
    en: 'Weird things have been happening\nat the Arenas of many towns lately.\n\nPeople say someone is\ntaking them over.',
  },
  '2FC8': { who: 'me', es: 'Bueno, llegué a las Tierras Quietas\nhace pocos días...\n\nAsí que no sabría decirte.', en: "Well, I only got to the Quiet Lands\na few days ago...\n\nSo I wouldn't know." },
  '3080': { es: 'Ah, claro...', en: 'Oh, right...' },
  '30D4': { who: 'me', es: '¿Y qué es lo que pasa?', en: "So, what's going on?" },
  '3128': { es: 'No estoy del todo seguro.\nSolo tengo un mal presentimiento...', en: "I'm not completely sure.\nI just have a bad feeling..." },
  '31B4': { who: 'me', es: '...', en: '...' },
  '31FC': { es: '¿Piensas seguir\nal próximo pueblo?', en: 'Are you planning to go on\nto the next town?' },
  '3278': { who: 'me', es: 'Sí, creo que sí...', en: 'Yeah, I think so...' },
  '32D0': { es: 'Ya veo... Si vas a entrar a la Arena,\nten mucho cuidado.', en: "I see... If you're going to the Arena,\nbe really careful." },
  '3360': { who: 'me', es: 'Bien. ¡Tendré cuidado!', en: "OK. I'll be careful!" },
  '33B8': { es: 'Si ganas, ven a verme.\n¡Voy a tener algo para ti!\n\n¡Suerte! Nos vemos.', en: "If you win, come and see me.\nI'll have something for you!\n\nGood luck! See you later." },
  '34A0': { who: 'me', es: 'Bien. ¡Nos vemos!', en: 'OK. See you later!' },

  // Dante, once the Collector is beaten
  '35DC': { es: '¡Lo lograste!\nVenciste al Coleccionista.', en: 'You did it!\nYou beat the Collector.' },
  '365C': { who: 'me', es: 'Ahora todo está en orden. Parece que\nel Coleccionista dejó lo que hacía...', en: 'Everything is fine now. It looks like\nthe Collector has given it all up...' },
  '36F8': { es: '¡Qué bueno!\n\n¡Sigue así! ¿Y si juegas\nuna partida contra mí?\n\n¿Qué dices?', en: "That's great!\n\nKeep it up! How about\na match against me?\n\nWhat do you say?" },

  // Dante, after the Arena: the egg
  '3944': { es: '¡Juegas muy bien!\nDe hecho, ¡juegas increíble!', en: "You play really well!\nIn fact, you're amazing!" },
  '39CC': { who: 'me', es: 'Gracias. A ver si un día\njugamos una partida.', en: 'Thanks. Maybe we can play\na match sometime.' },
  '3A48': { es: 'Esto es para ti. Úsalo sin miedo.\nEs un huevo para tu compañero.', en: "This is for you. Go ahead and use it.\nIt's an egg for your partner." },
  '3B18': eggNotice,
  '3B80': eggNotice,
  '3BE4': eggNotice,
  '3C70': { es: 'Con este huevo, tu compañero\npuede evolucionar en plena batalla.\n\n¡Ahora tu mazo es mucho más fuerte!', en: 'With this egg, your partner\ncan evolve in the middle of a battle.\n\nNow your deck is much stronger!' },
  '3D50': { who: 'me', es: '¡Qué bien! ¡Muchas gracias!', en: 'Wow! Great! Thanks a lot!' },
  '3DAC': { es: '¡Suerte!\nNos vemos.', en: 'Good luck!\nSee you later!' },
  '3E4C': { es: 'Sigo con un mal presentimiento...\nTen cuidado en las Arenas.', en: 'I still have this bad feeling...\nBe careful at the Arenas.' },
  '3EF0': { es: 'Ven a desafiarme de vez en cuando.', en: 'Come and challenge me once in a while.' },
  '3F5C': { who: 'me', es: 'Claro. ¡Cuando quieras!', en: 'Sure. Anytime!' },
  '3FB0': { es: '¿En serio? ¡Genial!', en: 'Really? Great!' },

  // Dante's matches; with some partners he lends the player one of his decks
  '4014': { es: '¡Muy bien! ¿Empezamos la partida?', en: 'Alright! Shall we start the match?' },
  '40A8': { es: '¿Qué? ¿Muy poca cosa para ti, eh?', en: 'What? Not good enough for you, huh?' },
  '4188': { es: '¡Te voy a mostrar mi verdadera fuerza!', en: "I'll show you my real power!" },
  '41D8': { es: 'Tengo una idea...', en: "I've got an idea..." },
  '421C': { es: 'Esta vez, juega tú con el *c3Mazo Chispero*c7\nque armé yo.', en: 'This time, you play with\nthe *c3Chispero Deck*c7 I built.' },
  '428C': danteStrongDeck,
  '42E4': { es: 'Tengo otra idea...', en: "I've got another idea..." },
  '432C': { es: 'Esta vez, juega tú con el *c3Mazo Trueno*c7\nque armé yo.', en: 'This time, you play with\nthe *c3Trueno Deck*c7 I built.' },
  '43A0': danteStrongDeck,
  '43F8': { es: '¡Armé un mazo nuevo!', en: 'I put together a new deck!' },
  '4444': { es: 'Esta vez, juega tú con el *c3Mazo Áureo*c7\nque armé yo.', en: 'This time, you play with\nthe *c3Áureo Deck*c7 I built.' },
  '44B4': { es: '¡Es un mazo superfuerte!', en: "It's a super strong deck!" },
  '4590': { es: '¡Ay, no! ¡Perdí!\n\nJuegas muy fuerte.\nDe verdad, me dejaste impresionado.\n\n¡Pero fue divertido! ¡Otra vez!', en: "Oh no! I lost!\n\nYou're really strong.\nI'm very impressed. Really!\n\nBut that was fun! Let's do it again!" },
  '48A4': {
    es: '¿Viste? ¡Te dije que era bueno!\n\nNo juegas tan bien como pensaba.\n¿O será que yo soy demasiado fuerte?\n\nEs broma. Vuelve cuando quieras.\n¡Te enfrento cuando sea!',
    en: "See? I told you I was good!\n\nYou're not as good as I thought.\nOr am I just too strong?\n\nJust kidding. Come back anytime.\nI'll take you on whenever!",
  },
  '49F4': { who: null, es: '*c3Mazo Corazón de Horno\nUn mazo muy fuerte en ataque.', en: "*c3Kiln Heart Deck\nA deck that's strong on offense." },

  // Zarpazo, who opens the Extra Arena
  '4AB8': { es: '¡Hola! Soy Zarpazo.\n¡Mucho gusto!', en: "Hi, I'm Zarpazo.\nGood to meet you!" },
  '4B30': meHello,
  '4B80': { es: 'Estoy en un torneo llamado Arena Extra.\nAllí peleo mientras evoluciono.', en: "I'm in a tournament called Extra Arena,\nwhere I fight while I evolve." },
  '4C20': { es: 'Si te animas,\n¿por qué no te inscribes?', en: "If you feel up to it,\nwhy don't you enter?" },
  '4CA4': { who: 'me', es: 'Suena interesante.', en: 'That sounds interesting.' },
  '4D00': { es: '¡Entonces te espero en la Arena!', en: "Then I'll be waiting at the Arena!" },
  '4D78': { who: null, es: '*c6¡La Arena Extra está abierta!\n*c6¡Que pasen los valientes!', en: '*c6The Extra Arena is now open!\n*c6Those who are ready, come on in!' },
  '4FD0': { es: '¡Te espero en la Arena!', en: "I'll be waiting at the Arena!" },
  '5044': { es: '¡Guau! ¡Qué fuerza tienes!\n¡Me dejaste impresionado!', en: "Wow! You're really strong!\nI'm really impressed!" },
  '50CC': { who: 'me', es: '¿En serio lo crees?', en: 'You really think so?' },
  '5124': {
    es: 'Prométeme que lo repetiremos.\n\nTe voy a contar un gran secreto.\nEs sobre la fusión de cartas...\n\nSale una carta Roja si fusionas\nSombría con Azul, Sombría con Rara,\no Roja con una carta de Apoyo.\n\n¿Genial, no?',
    en: "Promise me we'll do this again.\n\nI'll let you in on a big secret.\nIt's about card fusion...\n\nYou get a Red card by fusing\nShadow with Blue, Shadow with Rare,\nor Red with a Support card.\n\nCool, huh?",
  },
  '52C8': { es: '¿Quieres jugar contra mí?', en: 'Do you want to battle me?' },
  '5364': { es: 'Bueno, tómate tu tiempo.\n\nTenemos tiempo de sobra.', en: "Well, take your time.\n\nWe've got plenty of time." },
  '5414': zarpazoGo,
  '5494': { es: '¡Ay, no! ¡Perdí otra vez!\n¡Qué fuerte eres!\n\n¡Ya no sé qué hacer contigo!', en: "Oh no! I lost again!\nYou're really strong!\n\nI don't know what to do with you!" },
  '5570': { es: '¡Sí! ¡Gané!\n\nYa tendrás más oportunidades.\n¡Nos vemos!', en: "Yes! I win!\n\nYou'll have more chances!\nSee you again!" },
  '5640': zarpazoDeck,

  // Chispero, hot-headed, at the café
  '57D8': { es: 'La última vez perdí, pero todavía\nme quedan muchas chispas.', en: "I lost last time, but I've still\ngot plenty of sparks left." },
  '587C': chisperoAsk,
  '5904': chisperoNo,
  '597C': { es: '¡A pelear con todo!', en: "Let's fight with everything we've got!" },
  '5A20': {
    es: 'Mmm... Fue una batalla dura...\n¿Pero cómo pude perder así?\n\n¡No creas que esto termina aquí!\n¡Lo nuestro apenas empieza!',
    en: "Hmm... That was a tough battle...\nBut how could I lose like that?\n\nDon't think this is the end of it!\nOur fight has only just begun!",
  },
  '5B48': {
    es: 'Creo que la presión pudo contigo.\n\nNo te exijas tanto.\nPuedes desafiarme cuando quieras.',
    en: "I guess the pressure got to you.\n\nDon't be so hard on yourself.\nYou can challenge me anytime.",
  },
  '5C54': chisperoDeck,

  // Trueno, laid-back despite his name, at the café
  '5DF4': { es: 'Oye, nada de nervios. ¡Relájate!\n\nEs solo un juego de cartas.\nCon calma, la suerte llega sola.', en: "Hey, no need for nerves. Relax!\n\nIt's just a card game.\nStay calm and luck will come." },
  '5EDC': truenoAsk,
  '5F70': truenoWait,
  '5FFC': { es: '¡Bien! ¡Ya estoy relajado!', en: "OK! I'm all relaxed!" },
  '6094': { es: 'Uy... Otra vez me relajé de más.\n\nNo, es broma. ¡Juegas muy bien!\n\nHay que repetirlo.\nNos vemos. Ja, ja, ja.', en: "Oops... I got too relaxed again.\n\nNah, just kidding. You're really good!\n\nLet's do this again.\nSee you later. Ha ha ha." },
  '62F0': truenoLossCalm,
  '6430': truenoDeck,

  // Dúo, two minds in one body (always "we"), at the café
  '65C8': { es: '¿Tienes el valor de enfrentar\nnuestros poderes mentales?\nAhora son aún más fuertes.', en: 'Do you have the courage to face\nour mental powers?\nThey are even stronger now.' },
  '6670': { es: '¿Quieres jugar contra nosotros?', en: 'Do you want to battle us?' },
  '670C': duoWait,
  '67A4': { es: 'Lo vimos venir.', en: 'We saw that coming.' },
  '6834': {
    es: 'Para vencer nuestra mente...\nnecesitas una mente increíble...\n\n¡Queremos la revancha...!\n\nSi nos volvemos a ver,\nno dejes de desafiarnos.',
    en: 'To beat our minds...\nyou must have an incredible mind...\n\nWe want a rematch...!\n\nIf we meet again,\nbe sure to challenge us.',
  },
  '6A9C': {
    es: 'Esta vez, nuestra voluntad pudo más.\n\nAntes de volver a desafiarnos,\nentrena esa mente.\n\nTe esperamos...',
    en: "This time our will was stronger.\n\nBefore you challenge us again,\ntrain that mind of yours.\n\nWe'll be waiting...",
  },
  '6BCC': duoDeck,

  // Áureo, the golden knight, at the café
  '6D9C': { es: '¡Soy Áureo, el gran caballero dorado!\n\nNo puedo volver a perder...', en: 'I am Áureo, the mighty golden knight!\n\nI cannot lose again...' },
  '6E60': aureoAsk,
  '6F1C': aureoNo,
  '6F90': aureoGo,
  '704C': {
    es: 'Otra vez atravesaste la defensa\nde este caballero dorado...\n\nDebo admitir mi derrota...\n\n¡Pero un día ganaré!',
    en: 'Once again you broke through\nthe defense of this golden knight...\n\nI must admit my defeat...\n\nBut one day I shall win!',
  },
  '72A4': {
    es: 'Ja, ja, ja... Tal como pensaba.\nMi defensa no se rompe tan fácil.\n\nPero fue una batalla intensa.\nSi quieres la revancha, vuelve.\n\n¡Te estaré esperando!',
    en: 'Ha ha ha... Just as I thought.\nMy defense is not that easy to break.\n\nBut it was an intense battle.\nIf you want a rematch, come back.\n\nI will be waiting for you!',
  },
  '7418': aureoDeck,

  // Soberano, at the café
  '75DC': {
    es: 'Veo que tu compañero creció mucho...\n\nSeguro ya tienes muchas reliquias...\n\nPero hay reliquias que no se consiguen\nsolo subiendo de nivel.\n\nEl camino a la batalla definitiva es\nlargo, ¡pero no pierdas la esperanza!\n\nTe ayudaré a llegar.\nAsí que, ¡a jugar!',
    en: "I see your partner has grown\nquite a bit...\n\nI'm sure you have many relics...\n\nBut some relics can't be earned\njust by leveling up.\n\nThe road to the ultimate battle is long,\nbut don't give up hope!\n\nI'll help you get there.\nSo, let's battle!",
  },
  '7844': { es: '¿Todo listo? ¿Comenzamos?', en: 'All set? Shall we begin?' },
  '78D4': soberanoNo,
  '7954': { es: '¡Que comience la batalla definitiva!', en: 'Let the ultimate battle begin!' },
  '7A00': {
    es: 'Quizá este mazo ya no merece\nllamarse Corona Invicta.\n\nTu hora llegó. Ve en busca de la batalla\ndefinitiva que ni yo pude alcanzar.\n\nTe ayudaré en todo lo que pueda,\nporque ahora la corona es tuya.',
    en: 'Perhaps this deck no longer deserves\nthe name Unbeaten Crown.\n\nYour time has come. Seek the ultimate\nbattle that even I could not reach.\n\nI will help you as much as I can,\nfor the crown is yours now.',
  },
  '7D8C': {
    es: 'Como dice su nombre, Corona Invicta:\nno puedo perder.\n\nEn la batalla no hay descanso.\n¡Sigue intentándolo!\n\nAlgún día verás la luz de la esperanza.',
    en: 'Just as its name says, Unbeaten Crown:\nI cannot lose.\n\nThere is no rest in battle.\nKeep it coming!\n\nSomeday you will see the light of hope.',
  },
  '7F08': soberanoDeck,

  // Plumaria, a feathered serpent and Soledad's partner (after the Archivist's Tower)
  '7FE0': {
    es: 'Soy Plumaria, compañera de Soledad.\nNos vimos en la Torre del Archivero.\n\n¿Cómo te ha ido?',
    en: "I'm Plumaria, Soledad's partner.\nWe last met at the Archivist's Tower.\n\nSo, how have you been?",
  },
  '80C0': { who: 'me', es: '¡Muy bien!', en: "I'm doing great!" },
  '8118': { es: 'Se te ve bien. Parece que encontraste\nlo que buscabas...', en: 'You look well. You must have found\nwhat you were looking for...' },
  '81B4': {
    es: 'Por cierto, quiero desafiarte\na una batalla...\n\nSi quieres jugar contra Soledad,\nprimero tienes que vencerme a mí...',
    en: 'By the way, I would like to\nchallenge you to a battle...\n\nIf you want to battle Soledad,\nyou have to beat me first...',
  },
  '82B8': { es: 'Pero si no mejoraste desde la Torre\ndel Archivero, vas a perder.', en: "But if you haven't improved since\nthe Archivist's Tower, you will lose!" },
  '846C': { es: 'Yo protegeré a Soledad...\nEso sí te lo puedo asegurar.', en: 'I will protect Soledad...\nThat much I can promise you.' },
  '8500': { es: '¿Empezamos la batalla?', en: 'Shall we begin the battle?' },
  '8598': { es: '¿Perdiste las ganas de pelear?', en: 'Have you lost your passion for battle?' },
  '8618': { es: '¡Demos lo mejor de nosotros!', en: 'We must do our very best!' },
  '86B8': {
    es: 'No puedo creer que perdí...\nPerdóname, Soledad...\n\nPero no guardo rencor.\nFue una batalla justa.\n\nSeguro que tú y Soledad tendrán\nuna gran partida.\n\nSi tienes tiempo, me gustaría\nuna revancha.\n\n¡Prometo que nos volveremos a ver!\nAdiós.',
    en: "I can't believe I lost...\nI'm so sorry, Soledad...\n\nBut I hold no grudges.\nIt was a fair battle.\n\nI'm sure you and Soledad will\nhave a great match.\n\nIf you have time, I would like\na rematch with you.\n\nI promise we'll meet again!\nGoodbye.",
  },
  '8A94': {
    es: 'Quizá creas que puedes vencerme...\npero todavía te falta habilidad.\n\n¡No estás a la altura de Soledad!\n\nDisfruté la partida.\nRepitámosla algún día.',
    en: "You may think you can beat me...\nbut you don't have enough skill yet.\n\nYou are no match for Soledad!\n\nI enjoyed our match.\nLet's do this again sometime.",
  },
  '8BEC': { who: null, es: '*c3Mazo Plumas al Sol\nUn mazo Rojo equilibrado\nque recupera HP.', en: '*c3Sunlit Feathers Deck\nA well-balanced Red deck\nthat recovers HP.' },

  // Soledad, a traveller
  '8CA4': { es: 'Me llamo Soledad.\n¿Y tú?', en: "My name is Soledad.\nWhat's yours?" },
  '8D14': { who: 'me', es: 'Soy *h0.', en: "I'm *h0." },
  '8D60': { es: '¿Tú también quieres llegar\na lo más alto en las Arenas?', en: 'Are you trying to reach\nthe top of the Arenas, too?' },
  '8DE4': { who: 'me', es: 'Sí...', en: 'Yeah...' },
  '8E30': {
    es: 'Venciste a Plumaria, ¿verdad?\nNo se lo tomó nada bien.\n\nPero dijo que fue una buena batalla.\n\n¿Quieres jugar contra mí también?',
    en: "You beat Plumaria, right?\nThat didn't go down well at all.\n\nBut Plumaria said it was a good battle.\n\nWant to play against me, too?",
  },
  '907C': { es: 'Me encanta jugar.\n\nSoy más fuerte de lo que parezco.', en: "I love to battle.\n\nI'm stronger than I look." },
  '9120': { es: 'Entonces, ¿empezamos?', en: 'So, shall we begin?' },
  '91A8': { es: 'Bueno, no quiero obligarte.', en: "Well, I don't want to force you." },
  '921C': { es: '¡No pienso perder!', en: "I won't be defeated!" },
  '92B4': { es: 'Uy, perdí.\nJuegas mejor que Tadeo.\n\nQué raro... No me molesta perder.\nRepitámoslo algún día.', en: "Oops, I lost.\nYou're better than Tadeo.\n\nFunny... I don't mind losing at all.\nLet's do this again sometime." },
  '9564': {
    es: '¡Gané! Soy buena, ¿eh?\nA Tadeo tampoco le he perdido nunca.\n\n¡Hacía mucho que no disfrutaba\nuna partida así!\n\nRepitámoslo algún día.',
    en: "Hey, I won. I'm pretty good, huh?\nI've never lost to Tadeo, either.\n\nI haven't enjoyed a battle like this\nin a long time!\n\nLet's do this again sometime.",
  },
  '96B0': { who: null, es: '*c3Mazo Gran Salto\nUn mazo Rojo que evoluciona rápido.\nLleva muchas cartas de Apoyo.', en: '*c3Great Leap Deck\nA Red deck that evolves fast.\nIt carries lots of Support cards.' },

  // the Blot, wandering through town
  '989C': {
    es: '¿Qué sabes tú del dolor de los\nque se quedaron sin forma?\n\n¡Lo odio todo!\n\nMi rencor no se irá hasta que\nlo haya borrado todo.',
    en: "What do you know about the pain\nof those left without a shape?\n\nI hate everything!\n\nMy hatred won't go away until\nI have blotted everything out.",
  },
  '9A0C': { es: '¿Adónde... voy?\n\n¿Me espera la calma allá?\n\n¿O me hundirá más rencor?\n\nNo lo sé...', en: 'Where... am I... going?\n\nIs peace waiting for me there?\n\nOr will more hatred swallow me?\n\nI do not know...' },
  '9B4C': { es: '¿Crees que puedes vencerme?', en: 'Do you think you can beat me?' },
  '9BE4': { es: 'Entonces, ¡fuera de mi vista!', en: 'Then get out of my sight!' },
  '9C58': { es: '¡Arde en las llamas de mi rencor!', en: 'Burn in the flames of my hatred!' },
  '9CF4': {
    es: 'Ahhh... Me desvanezco...\n¿Se irá también mi rencor?\n\n¿Me salvaré ahora?\nNo lo sé... No lo sé...\n\n¿Adónde... voy?\n\n¿Me espera la calma allá?\n\n¿O me hundirá más rencor?\n\nNo lo sé...',
    en: "Ahhh... I'm fading away...\nWill my hatred fade too?\n\nWill I be saved now?\nI don't know... I don't know...\n\nWhere... am I... going?\n\nIs peace waiting for me there?\n\nOr will more hatred swallow me?\n\nI do not know...",
  },
  A210: {
    es: 'Ahhh... El rencor crece dentro de mí.\nYa no puedo contenerlo...\n\nTengo que soltarlo.\nEste mundo se hundirá en la oscuridad.\n\nHaré que todos sientan mi dolor.\n\n¡Siente el dolor! ¡Siente la angustia!\n\n¡Esta es la venganza de los que\nse quedaron sin forma!',
    en: "Ahhh... The hatred inside me is growing.\nI can't hold it any longer...\n\nI must let it out.\nThis world will sink into darkness.\n\nI will make everyone feel my pain.\n\nFeel the pain! Feel the agony!\n\nThis is the revenge of those\nwho were left without a shape!",
  },
  A454: { who: null, es: '*c3Mazo Vacío\nEl mazo más cruel y poderoso de todos.', en: '*c3Hollow Deck\nThe cruelest, most powerful deck of all.' },

  // the stranger
  A500: { es: 'Así que tú eres quien acaba de llegar.', en: "So, you're the one who just arrived." },
  A568: { who: 'me', es: 'Sí, soy *h0.\n¿Y tú eres...?', en: "Yes, I'm *h0.\nAnd you are...?" },
  A5D4: {
    es: '¿Yo...?\n\nYo soy...\n\nEso no importa. Últimamente pasan\ncosas extrañas. Ten cuidado.',
    en: "Me...?\n\nI am...\n\nThat's not important. Strange things\nhave been happening lately. Be careful.",
  },
  A6D8: mePuzzled,
  A87C: { es: 'Últimamente pasan cosas extrañas\nen este mundo. Ten cuidado.', en: 'Strange things have been happening\nin this world lately. Be careful.' },
  A918: mePuzzled,
  A970: { who: null, es: '*c3Mazo Jardín de Espinas\nUn mazo tricolor lleno de plantas.\nLo más bonito también pincha.', en: '*c3Thorn Garden Deck\nA three-color deck full of plants.\nEven the prettiest things can prick.' },

  // the Arena: Pavesa
  AC04: {
    es: 'Tu primer rival soy yo...\nPavesa, del horno grande.\n\n¿Podrás con el espíritu de lucha...\nque arde dentro de mí?',
    en: 'Your first opponent is me...\nPavesa, from the big kiln.\n\nCan you beat the fighting spirit...\nthat burns inside me?',
  },
  AD88: { es: 'Chss... Estoy ardiendo...\n¿Empezamos?', en: "Hsss... I'm burning hot...\nShall we begin?" },
  AE20: { es: '¡...!', en: '...!' },
  AE78: { es: 'Voy a reducirte... a cenizas...', en: "I'll burn you... to a crisp..." },
  AF18: { es: '¿Perdí...?\n\nLa próxima... gano yo.\n\nTe espero... en el Café de batallas.', en: "I lost...!?\n\nNext time... I'll win.\n\nI'll wait for you... at the Battle Cafe." },
  B008: { es: 'Yo... no... pierdo...\n\n¡Siempre gano!\nVuelve si quieres perder otra vez.', en: 'I... do not... lose!!\n\nI always win!!\nCome back if you want to lose again.' },
  B0D8: pavesaDeck,

  // the Arena: Ceniza
  B224: {
    es: 'Soy Ceniza, tu próximo rival.\nNací del humo de estas chimeneas.\n\n¿Podrás con mi Lluvia de Ceniza?\n¡Ja, ja, ja, ja...!',
    en: "I'm Ceniza, your next opponent.\nI was born from these chimneys' smoke.\n\nCan you beat my Ash Rain?\nHa ha ha ha...",
  },
  B3A4: { es: 'Mi mazo ya está listo.\n¿Y el tuyo? ¿Empezamos?', en: 'My deck is ready.\nIs yours? Shall we begin?' },
  B448: { es: 'La batalla ya empezó.\n¡No hay salida!', en: 'The battle has already begun.\nThere is no way out!' },
  B4DC: cenizaGo,
  B584: { es: '¡Imposible! ¿Cómo pude perder?\n\nLa próxima vez te venceré\ncon mi Gran Lluvia de Ceniza.', en: "Impossible! How could I lose?\n\nNext time I'll beat you\nwith my Great Ash Rain!" },
  B674: {
    es: 'Tal como esperaba. Mi Lluvia de Ceniza\nfue demasiado para ti.\n\nNo tienes ninguna oportunidad...\n\nPero no pierdas la esperanza, aprendiz.',
    en: "Just as I expected. My Ash Rain\nwas too much for you.\n\nYou don't stand a chance against me...\n\nBut don't lose hope, apprentice.",
  },
  B7AC: cenizaDeck,

  // the Arena: Brinco, the master
  B8F8: { es: '¡Hola! Soy Brinco,\n¡el maestro de esta Arena!\n\nNo te la voy a dejar fácil.\n¡Sube al ring si te atreves!', en: "Hey, I'm Brinco,\nthe master of this Arena!\n\nI won't go easy on you.\nStep into the ring if you dare!" },
  BAA4: brincoAsk,
  BB30: { es: '¿Te dio miedo? ¡Ja, ja, ja!\nNo te metas en peleas\nque te quedan grandes.', en: "Scared? Ha ha ha!\nDon't pick fights\nthat are too big for you!" },
  BBC4: brincoGo,
  BC68: { es: 'Uf... No puedo creer que perdí.\n\n¡Rayos!\n\nVen al Café de batallas.\n¡Esto no se queda así!', en: "Whoa... I can't believe I lost.\n\nDarn it!\n\nCome to the Battle Cafe!\nYou haven't seen the last of me!" },
  BD94: { who: null, es: '¡Felicitaciones por la victoria!\nRecibiste el pase a Bosque Hondo.', en: 'Congratulations on your win!\nYou got the pass to Deepwood.' },
  C9B0: { es: '¡Ja, ja, ja! ¡Te lo dije!\n¡Yo siempre gano!\n\n¡Espero que hayas aprendido la lección!', en: 'Ha ha ha! I told you so!\nI always win!\n\nI hope you learned your lesson!' },
  CA8C: brincoDeck,

  // the Extra Arena, first tournament: Zarpazo, Chispero, Trueno
  CC54: { who: null, es: 'La Arena Extra está cerrada por ahora.\nVuelve más tarde.', en: 'The Extra Arena is closed for now.\nPlease come back later.' },
  CE30: {
    es: '¡Sabía que vendrías!\n\nEn esta Arena peleo con\ntodas mis formas.\n\nAunque me ganes, enseguida evoluciono.\n¡Así que no bajes la guardia!\n\n¡Empecemos!',
    en: "I knew you would come!\n\nIn this Arena I fight\nwith all of my forms.\n\nBeat me, and I'll evolve right away!\nSo don't lower your guard!\n\nNow let's begin!",
  },
  D068: { es: '¿Todo listo? ¿Empezamos?', en: 'All set? Shall we begin?' },
  D0F4: { es: '¡Con calma!\n\nTenemos tiempo de sobra.', en: "Take it easy!\n\nWe've got plenty of time." },
  D19C: zarpazoGo,
  D228: { es: '¡Ay, no! Perdí. ¡Juegas muy bien!\n\nPero cuando evolucione,\nseré mucho más fuerte. ¡Suerte!', en: "Oh no! I lost. You're really good!\n\nBut once I evolve, I'll be\nmuch stronger! Good luck!" },
  D324: {
    es: '¡Sí! ¡Gané!\n\nSi no puedes conmigo, nunca\nvas a ganar esta Arena.\n\nYa tendrás más oportunidades.\n¡Nos vemos!',
    en: "Yes! I win!\n\nIf you can't beat me, you'll never\nwin this Arena!\n\nYou'll have more chances!\nSee you later!",
  },
  D46C: zarpazoDeck,
  D590: { es: '¡Evolucioné! Ahora soy Chispero.\n\nMe venciste como Zarpazo, pero ¿podrás\ncon mi nueva forma?', en: "I evolved! Now I'm Chispero!\n\nYou beat me as Zarpazo, but can you\nhandle my new form?" },
  D730: chisperoAsk,
  D7BC: chisperoNo,
  D82C: chisperoGo,
  D8C0: { es: 'No puedo creerlo... Perdí...\n\n¡Pero no creas que esto termina aquí!\n¡La pelea sigue!', en: "I can't believe it... I lost...\n\nBut don't think this is the end of it!\nThe fight isn't over yet!" },
  D9BC: chisperoLoss,
  DAC8: chisperoDeck,
  DBF0: {
    es: '¡Aquí llega Trueno!\n\nMe sorprende que llegaras tan lejos.\nPero tranquilidad, nada de nervios.\n\nEs solo un juego de cartas.\nCon calma, la suerte llega sola.',
    en: "Heeere's Trueno!\n\nI'm impressed you got this far.\nBut easy now, no need for nerves.\n\nIt's just a card game.\nStay calm and luck will come.",
  },
  DDE8: { es: '¡Adelante! ¿Empezamos?', en: 'Bring it on! Shall we start?' },
  DE70: truenoWait,
  DEFC: truenoGo,
  DF94: {
    es: '¡Uy! Debí prestar más atención.\n\nEs broma. ¡Juegas muy bien!\n\nRepitámoslo en el Café de batallas.\nAhí me lo tomaré en serio. ¡Ja, ja!',
    en: "Oops! I should've paid more attention.\n\nJust kidding. You're really good!\n\nLet's do this again at the Battle Cafe.\nI'll take you seriously then. Ha ha!",
  },
  E290: truenoLossTense,
  E3D0: truenoDeck,

  // the Extra Arena, second tournament: Chispero, Trueno, Dúo
  E71C: chisperoAsk,
  E7A8: chisperoNo,
  E81C: chisperoGo,
  E8B0: { es: 'No puedo creerlo... Perdí...\n\n¡Pero esto no termina aquí!\n¡Lo nuestro apenas empieza!', en: "I can't believe it... I lost...\n\nBut it's not over yet!\nOur fight is just beginning!" },
  E9A4: chisperoLoss,
  EAB4: chisperoDeck,
  EC64: truenoAsk,
  ECF8: truenoWait,
  ED84: truenoGo,
  EE1C: {
    es: '¡Uy! Debí prestar más atención.\n\nEs broma. ¡Juegas muy bien!\n\nPero lo que viene ahora\nno es tan relajado. ¡Ja, ja!',
    en: "Oops! I should've paid more attention.\n\nJust kidding. You're really good!\n\nBut what comes next\nisn't so laid-back. Ha ha!",
  },
  EF78: truenoLossTense,
  F0B8: truenoDeck,
  F1DC: {
    es: 'Somos Dúo.\n\nDos mentes en un solo cuerpo.\nPodemos leer tu mente.\n\nSabemos cada jugada que harás.\n\n¿Podrás con nuestros poderes mentales?\n¡Ja, ja, ja, ja...!',
    en: 'We are Dúo.\n\nTwo minds in a single body.\nWe can read your mind.\n\nWe know every move you will make.\n\nCan you beat our mental powers?\nHa ha ha ha...!',
  },
  F3E4: duoAsk,
  F470: duoWait,
  F50C: duoGo,
  F59C: {
    es: 'Para vencer nuestra mente...\nnecesitas una mente increíble...\n\n¡Queremos la revancha...!\n\nNos veremos en el Café de batallas.\nDesafíanos allí.',
    en: "To beat our minds...\nyou must have an incredible mind...\n\nWe want a rematch...!\n\nWe'll meet at the Battle Cafe.\nChallenge us there.",
  },
  F8B0: duoLoss,
  F9E8: duoDeck,

  // the Extra Arena, third tournament: Trueno, Dúo, Áureo
  FD68: truenoAsk,
  FDF8: truenoWait,
  FE84: truenoGo,
  FF1C: {
    es: 'Uy... Me relajé de más.\n\nNo, es broma. ¡Juegas muy bien!\n\n¡Ahora evoluciono a Dúo!\nNo será tan fácil. ¡Ja, ja, ja!',
    en: "Oops... I got too relaxed.\n\nNah, just kidding. You're really good!\n\nNow I'm evolving into Dúo!\nIt won't be this easy. Ha ha ha!",
  },
  '10078': truenoLossCalm,
  '101B8': truenoDeck,
  '10364': duoAsk,
  '103F0': duoWait,
  '1048C': duoGo,
  '1051C': duoToAureo,
  '1064C': duoLoss,
  '10784': duoDeck,
  '108DC': {
    es: '¡Soy Áureo, el gran caballero dorado!\n\n¿Desafiarme a mí? Qué temeridad,\npero admiro tu valor.\n\nPor respeto a tu valor,\n¡lucharé con todas mis fuerzas!',
    en: 'I am Áureo, the mighty golden knight!\n\nChallenging me? How reckless,\nbut I admire your courage.\n\nOut of respect for your courage,\nI shall fight with all my might!',
  },
  '10AE4': aureoAsk,
  '10BA0': aureoNo,
  '10C14': aureoGo,
  '10CD0': {
    es: 'Nadie había atravesado antes\nla defensa de este caballero dorado...\n\nAdmito mi derrota. Ganaste.\n\nTe esperaré en el Café de batallas.',
    en: "No one had ever broken through\nthe defense of this golden knight...\n\nI admit my defeat. You won.\n\nI'll wait for you at the Battle Cafe.",
  },
  '10FCC': aureoLoss,
  '11108': aureoDeck,

  // the Extra Arena, fourth tournament: Dúo, Áureo, Soberano
  '11480': duoAsk,
  '1150C': duoWait,
  '115A8': duoGo,
  '11638': duoToAureo,
  '11768': duoLoss,
  '118A0': duoDeck,
  '11A80': aureoAsk,
  '11B3C': aureoNo,
  '11BB0': aureoGo,
  '11C6C': {
    es: 'Nadie había atravesado antes\nla defensa de este caballero dorado...\n\nLo admito: ganaste limpiamente.\n\nPero cuando evolucione a Soberano,\nno tendrás ninguna oportunidad.',
    en: "No one had ever broken through\nthe defense of this golden knight...\n\nI admit it. You won fair and square.\n\nBut once I evolve into Soberano,\nyou won't stand a chance.",
  },
  '11DEC': aureoLoss,
  '11F30': aureoDeck,
  '12084': {
    es: 'Sí... ¡Librar la batalla definitiva\nes mi misión!\n\nTienes poder y habilidad, sin duda.\nPero...\n\n¡Te mostraré lo que es\nuna verdadera batalla!',
    en: "Yes... Fighting the ultimate battle\nis my mission!\n\nYou have power and skill, no doubt.\nBut...\n\nI'll show you what\na real battle is!",
  },
  '1228C': { es: '¡Llegó la hora!\n¿Me muestras lo que tienes?', en: "It's showtime!\nWill you show me what you've got?" },
  '12334': soberanoNo,
  '123B4': { es: '¡Este momento quedará en la historia!', en: 'This will be our moment in history!' },
  '12464': {
    es: 'No puedo creerlo. Mi Corona Invicta\npor fin fue derrotada.\n\nTu hora llegó. Ve en busca de la batalla\ndefinitiva que ni yo pude alcanzar.\n\nTe ayudaré en todo lo que pueda.\n\nTe veré en el Café de batallas...\n¡Ahora la corona es tuya!',
    en: "I can't believe it. My Unbeaten Crown\nhas finally been defeated.\n\nYour time has come. Seek the ultimate\nbattle that even I could not reach.\n\nI will help you as much as I can.\n\nI shall see you at the Battle Cafe...\nThe crown is yours now!!",
  },
  '12810': {
    es: 'No me llaman invicto por nada.\n\nEn la batalla no hay descanso.\n¡Sigue intentándolo!\n\nAlgún día verás la luz de la esperanza.',
    en: "I'm not called unbeaten for nothing.\n\nThere is no rest in battle.\nKeep it coming!\n\nSomeday you will see the light of hope.",
  },
  '12964': soberanoDeck,
};
