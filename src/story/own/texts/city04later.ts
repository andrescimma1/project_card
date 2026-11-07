/**
 * Chatarral, later phases: Martillo (once Rompehielos) wants a rematch and sends the player to Jacinto,
 * his partner; Tronada opens an Arena just for fun, with Tuerca and the star Lucero; Gruñón, a grumpy
 * wanderer, demands a match; and the Blot wanders among the junk heaps.
 */
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });
const martilloDeck = deck('*c3Mazo Arsenal\nUn mazo muy eficaz,\ncargado de armas.', '*c3Arsenal Deck\nA very effective deck\nloaded with weapons.');
const jacintoDeck = deck('*c3Mazo Botiquín\nUn mazo de curación: recupera HP\nen cualquier momento.', '*c3Med Kit Deck\nA healing deck that can\nrecover HP at any time.');
const tronadaDeck = deck('*c3Mazo Tormenta\nUn mazo de la facción Rara con\ndescartes y Embestidas muy potentes.', '*c3Thunderstorm Deck\nA Rare faction deck with very\nstrong discards and Ram effects.');
const tuercaDeck = deck('*c3Mazo Trepador\nUn mazo de la facción Rara que busca\nllegar a Perfecto. Ataca desde Campeón.', '*c3Climber Deck\nA Rare faction deck that aims\nfor Apex, attacking as a Veteran.');
const luceroDeck = deck('*c3Mazo Brillo Estelar\nFuerte contra las facciones\nSombría y Rara.', '*c3Starshine Deck\nStrong against the Shadow\nand Rare factions.');
const grunonDeck = deck('*c3Mazo Caras Raras\nUn mazo lleno de criaturas\nde aspecto muy curioso.', '*c3Funny Faces Deck\nA deck full of very\ncurious-looking creatures.');

// Tronada: a cheerful host who opened an Arena so everyone could have fun
const tronada = {
  ask: { es: '¿Empezamos?', en: 'Shall we start?' },
  wait: { es: '¡Uy, perdón!\nTómate tu tiempo.', en: 'Oops, sorry!\nTake your time.' },
  fun: { es: '¿Qué tal? ¿Te divertiste?\n¡Yo lo pasé genial!', en: 'So, how was it? Did you have fun?\nI had a great time!' },
};

// Lucero: a creature who never forgets to say it is a star
const lucero = {
  go: { es: 'En fin, no olvides que\n¡soy una estrella! ¡Ja, ja, ja!', en: "Anyway, just don't forget\nthat I'm a star! Ha ha ha!" },
  lost: {
    es: '¡Oye! ¡Te dije que me escucharas\ncuando hablo!\n\nYo no pierdo, porque soy una estrella.\n¿Entendiste?\n\nEsto está mal. ¿Qué hago?\n\n¡Ya sé! Digamos que esta partida...\nnunca pasó. ¿Qué te parece?\n\nSí, es una gran idea, ¿no?',
    en: "Hey! I told you to listen\nwhen I'm talking!\n\nI don't lose, because I'm a star.\nGot that?\n\nThis is bad. What do I do?\n\nI know! Let's say this match...\nnever happened. How about that?\n\nYes, that's a great idea, right?",
  },
};

// Gruñón: a grumpy wanderer who turns up in any town
const grunonRevenge = {
  es: 'Me las vas a pagar. ¡No lo olvides!\nLa próxima no me ganas.\n\nTe estaré esperando en algún pueblo,\ncuando menos te lo esperes. ¡Bah!',
  en: "You'll pay for this. Don't forget it!\nYou won't beat me next time.\n\nI'll be waiting in some town,\nwhen you least expect it. Bah!",
};

// the Blot, among the junk heaps
const blotWhere = {
  es: '¿Adónde... voy...?\n\n¿Me espera la paz allí?\n\n¿O me tragará más rencor?\n\nNo lo sé...',
  en: 'Where... am I... going?\n\nIs peace waiting for me there?\n\nOr will more hatred swallow me?\n\nI do not know...',
};

export const CITY04_LATER: CityTexts = {
  // Martillo: Rompehielos, in his next shape and with a new name
  '3F48': {
    es: '¡Eh! ¡Soy Martillo!\nLa última vez me ganaste.\n\nPero ya no soy Rompehielos.\nAlcancé una forma nueva.\n¡Esta vez no pierdo!',
    en: "Hey! I'm Martillo!\nYou beat me last time.\n\nBut I'm not Rompehielos anymore.\nI reached a new shape.\nI won't lose this time!",
  },
  '4038': { who: 'me', es: 'Yo también me hice mucho más fuerte.\n¡No me vas a ganar!', en: "I've gotten a lot stronger, too.\nYou can't beat me!" },
  '40C0': {
    es: 'Por cierto, Acero me contó\nque le ganaste a Mateo.\n\n¡Cuánto has mejorado!\nGanarle a Mateo... ¡Increíble!\n\nPero hasta que no juguemos,\nnadie sabrá quién es más fuerte.\n\nVas a jugar conmigo, ¿no?\n¡Mi mazo Arsenal es muy fuerte!',
    en: "By the way, Acero told me\nyou beat Mateo!\n\nYou've improved so much!\nBeating Mateo... Incredible!\n\nBut until we play,\nno one will know who's stronger.\n\nYou'll play me, right?\nMy Arsenal Deck is really strong!",
  },
  '4360': {
    es: 'Ganarle a Mateo... ¡Increíble!\n\nVas a jugar conmigo, ¿no?\n¡Mi mazo Arsenal es muy fuerte!',
    en: "Beating Mateo... Incredible!\n\nYou'll play me, right?\nMy Arsenal Deck is really strong!",
  },
  '4450': { es: '¡Así me gusta!\n¿Empezamos?', en: "That's the spirit!\nShall we start?" },
  '44E0': { es: '¡Ay, qué pena!', en: "Aw, that's a shame!" },
  '4548': { es: '¡Bien! ¡Vamos con todo!', en: "Alright! Let's give it everything!" },
  '45E8': {
    es: '¡Uf! ¡Otra vez me ganaste!\nJuegas muy bien.\n\nCreces más rápido que yo.\n¡Quiero un poco de esa fuerza!\n\n¿Por qué no juegas con Jacinto,\nmi compañero? ¡Es mucho más fuerte\nde lo que parece!\n\nVuelve a desafiarme cuando quieras.\n¡Nos vemos!',
    en: "Whew! You beat me again!\nYou play really well.\n\nYou're growing faster than me.\nI want some of that strength!\n\nWhy don't you play Jacinto,\nmy partner? He's much stronger\nthan he looks!\n\nChallenge me again anytime.\nSee you!",
  },
  '497C': {
    es: '¡Ja! ¡Gané!\nNo eres tan fuerte como pareces.\n\nTal vez no era tu mejor día.\n¿Qué...? ¿Por qué esa cara?\n\nSi quieres la revancha, avísame.\n¡Te enfrento cuando quieras!',
    en: "Ha! I won!\nYou're not as strong as you look.\n\nMaybe it wasn't your best day.\nWhat...? Why the long face?\n\nIf you want a rematch, let me know.\nI'll take you on anytime!",
  },
  '4AEC': martilloDeck,

  // Jacinto, a traveller who always feels he should be studying
  '4BB0': { es: 'Hola, me llamo Jacinto.\nMucho gusto.', en: 'Hi, my name is Jacinto.\nNice to meet you.' },
  '4C18': { who: 'me', es: 'Hola, yo soy *h0.', en: "Hi, I'm *h0." },
  '4C70': { es: 'Supe que le ganaste a Martillo.\n¡Qué bien! Yo nunca pude.', en: "I heard you beat Martillo.\nThat's great! I never could." },
  '4D00': { who: 'me', es: 'Seguro que juegas mejor\nde lo que crees.', en: 'I bet you play better\nthan you think.' },
  '4D6C': { es: 'No soy tan bueno... Pero si no\nte molesta, ¿aceptas mi desafío?', en: "I'm not that good... But if\nyou don't mind, will you play me?" },
  '4F24': { es: 'Aunque en realidad debería estar\nrepasando mis apuntes...', en: 'Although I really should be\ngoing over my notes...' },
  '4F90': { es: 'No soy muy fuerte, te aviso...\n¿De verdad quieres jugar?', en: "I'm not very strong, I warn you...\nDo you really want to play?" },
  '5030': { es: 'Ah, bueno. Lo entiendo.', en: 'Oh, OK. I understand.' },
  '5098': { es: '¿De verdad? ¡Prometo dar lo mejor de mí!', en: 'Really? I promise to do my best!' },
  '5140': {
    es: '¡Ay, no! ¡Perdí!\nLo sabía. Eres muy fuerte.\n\nNo le ganaste a Martillo por suerte.\n¡Usas tus cartas de maravilla!\n\nAprendí mucho. Gracias.\n\n¿Jugamos otra vez algún día?\n¡Nos vemos!',
    en: "Oh no! I lost!\nI knew it. You're really strong.\n\nYou didn't beat Martillo by luck.\nYou use your cards so well!\n\nI learned a lot. Thanks.\n\nWill you play me again someday?\nSee you!",
  },
  '54AC': {
    es: '¡Gané! ¡No lo puedo creer!\n¡Qué alegría!\n\nSeguro tuve mucha suerte.\nPero ¡usas tus cartas muy bien!\n\nAprendí mucho. Gracias.\n\n¿Jugamos otra vez algún día?\n¡Nos vemos!',
    en: "I won! I can't believe it!\nThis is great!\n\nI must have been really lucky.\nBut you use your cards so well!\n\nI learned a lot. Thanks.\n\nWill you play me again someday?\nSee you!",
  },
  '565C': jacintoDeck,

  // Tronada, at the café
  '5850': { es: '¡Hola! Soy Tronada.', en: "Hi! I'm Tronada." },
  '58B0': { who: 'me', es: '¡Hola! ¡Soy *h0!', en: "Hi! I'm *h0!" },
  '5900': { es: 'Organizo una Arena.\n¡Ven si te dan ganas!\n\n¡Lo vas a pasar de maravilla!', en: "I'm hosting an Arena.\nCome by if you feel like it!\n\nYou'll have a wonderful time!" },
  '59C8': { who: 'me', es: '¡Claro que voy!', en: "Of course I'll be there!" },
  '5C04': { es: 'Organizo una Arena.\n¡Ven si te dan ganas!\n\n¡Te garantizo que lo vas a pasar\nde maravilla!', en: "I'm hosting an Arena.\nCome by if you feel like it!\n\nI guarantee you'll have\na wonderful time!" },
  '5CE4': { es: '¡Hola!\n\n¿Lo estás pasando bien?\n¿Jugamos la revancha?', en: 'Hi!\n\nAre you having fun?\nHow about a rematch?' },
  '5DAC': tronada.ask,
  '5E38': tronada.wait,
  '5EBC': { es: '¡Que retumbe el trueno!\n¡A jugar!', en: "Let the thunder roll!\nLet's play!" },
  '5F54': {
    es: `¡Ay, no! ¡Perdí!\n\n${tronada.fun.es}\n\nMe encantaría jugar otra vez\ncuando tengas un rato libre.\n\n¡Te espero!`,
    en: `Oh no! I lost!\n\n${tronada.fun.en}\n\nI'd love to play again\nwhen you have some free time.\n\nI'll be waiting!`,
  },
  '60E4': {
    es: `¡Bien! ¡Gané!\n\n${tronada.fun.es}\n\nMe encantaría jugar otra vez\ncuando tengas un rato libre.\n\n¡Te espero!`,
    en: `Yes! I won!\n\n${tronada.fun.en}\n\nI'd love to play again\nwhen you have some free time.\n\nI'll be waiting!`,
  },
  '627C': tronadaDeck,

  // Tuerca, small and screwed on tight, at the café
  '6438': { es: '¡Rayos! ¿Qué me pasa?\nDesde que perdí, siento que\nse me aflojó una tuerca.', en: "Darn! What's wrong with me?\nEver since I lost, I feel like\nI've got a screw loose." },
  '64AC': { es: '¿Qué? ¿Buscas pelea?', en: 'What? Looking for a fight?' },
  '6548': { es: '¡Ja! ¡Gallina!', en: 'Ha! Chicken!' },
  '65B4': { es: 'Te lo advierto...\n¡yo no pierdo!', en: "I'm warning you...\nI don't lose!" },
  '6660': {
    es: '¿Qué? ¿Qué pasó? ¿Perdí?\n\n¿Por qué? ¿Por qué?\n¡Rayos! ¿Qué me pasa?\n\n¡Exijo otra partida!',
    en: "What? What happened? I lost?\n\nWhy? Why?\nDarn! What's wrong with me?\n\nI demand another match!",
  },
  '6784': {
    es: '¡Mira! ¡Gané!\n¡Soy lo máximo!\n\n¡Ja! ¡Qué poca cosa! Te dejo\nque me desafíes otra vez. Soy generoso.\n\n¡Cuando quieras! ¡Nos vemos!',
    en: "Look! I won!\nI'm the best!\n\nHa! That was nothing! I'll let you\nchallenge me again. I'm generous.\n\nAnytime! See ya!",
  },
  '68D0': tuercaDeck,

  // Lucero, the star, at the café
  '6A98': {
    es: 'Ya te lo dije mil veces, pero\nsoy Lucero. ¡Una estrella!\n\n¡A estas alturas ya deberías saberlo!\n¡Y que no se te olvide!',
    en: "I've told you a thousand times, but\nI'm Lucero. A star!\n\nYou should know that by now!\nAnd don't you forget it!",
  },
  '6BB0': { es: 'Vamos. ¿Te atreves a jugar\ncontra una estrella?', en: 'Come on. Do you dare to play\nagainst a star?' },
  '6C48': {
    es: 'Ja, ja, ja, ja...\n\nParece que jugar con una estrella\nte pone los nervios de punta. ¡Ja, ja!',
    en: 'Ha ha ha ha...\n\nLooks like facing a star\nis too much for your nerves. Ha ha!',
  },
  '6D30': lucero.go,
  '6E08': lucero.lost,
  '7164': {
    es: '¡Uf!\n¡Fue facilísimo!\n\n¿Ves? ¡A Lucero nadie le gana!\nBueno, bueno, no lo hiciste tan mal.\n\nPero es que juego demasiado bien.\n¡Porque soy una estrella! ¿Entendiste?\n\nAsí que no vuelvas a hacer algo\ntan tonto. ¡Que no se te olvide!\n\n¡Nos vemos!',
    en: "Whew!\nThat was way too easy!\n\nSee? No one beats Lucero!\nOK, OK, you didn't do so badly.\n\nBut I just play too well.\nBecause I'm a star! Got that?\n\nSo don't do anything that silly\nagain. Don't forget it!\n\nSee you later!",
  },
  '73A0': luceroDeck,

  // Gruñón, a grumpy wanderer
  '7448': {
    es: 'Soy Gruñón. Llevo años dando vueltas\npor todos los pueblos. ¡Bah!\n\n¡Juega conmigo! ¡Y no se te\nocurra salir corriendo!\n\n¡Te dije que juegues conmigo!',
    en: "I'm Gruñón. I've spent years wandering\nfrom town to town. Bah!\n\nPlay with me! And don't you\ndare run away!\n\nI said, play with me!",
  },
  '756C': { who: 'me', es: 'Bueno... Si tanto insistes...', en: 'OK... If you insist...' },
  '75C8': { es: '¡Hmpf! ¡Por fin!\nA ver si me alegras el día.', en: "Hmph! Finally!\nLet's see if you can brighten my day." },
  '77D0': { es: '¡Oye, tú!\n¡No hay tiempo para charlar!\n\n¡Apúrate y juguemos! ¡Grrr!', en: "Hey, you!\nNo time for chit-chat!\n\nHurry up and let's play! Grrr!" },
  '78B4': grunonRevenge,
  '79D4': { es: '¡Vamos, vamos!\n¿Jugamos o qué?', en: 'Come on, come on!\nAre we playing or what?' },
  '7A64': { es: '¿Cómo que no? ¡Grrr!', en: 'What do you mean, no? Grrr!' },
  '7AC4': { es: '¡Hmpf! ¡Así me gusta!', en: "Hmph! That's more like it!" },
  '7B54': { es: `¡Nooo! ¡Perdí!\n¡Eres demasiado fuerte! ¡Grrr!\n\n${grunonRevenge.es}`, en: `Nooo! I lost!\nYou're too strong! Grrr!\n\n${grunonRevenge.en}` },
  '7E84': {
    es: '¡Ja! ¡Te gané!\n\nVaya... Hacía años que no\nme sentía de tan buen humor.\n\nTe enfrento cuando quieras.\n\n...¡Bah! No te acostumbres.',
    en: "Ha! I beat you!\n\nWell... I haven't been in such\na good mood in years.\n\nI'll take you on anytime.\n\n...Bah! Don't get used to it.",
  },
  '7FBC': grunonDeck,

  // the Blot
  '818C': {
    es: '¿Qué sabes tú del dolor de los\nque se quedaron atrás cuando\notros evolucionaron?\n\nAquí todo lo roto termina tirado.\nComo yo.\n\n¡Lo desprecio todo!\n\nMi rencor no va a parar hasta\nque borre todo lo de este mundo.',
    en: 'What do you know of the pain of\nthose left behind when\nothers evolved?\n\nHere, everything broken ends up\nthrown away. Like me.\n\nI despise everything!\n\nMy hatred won\'t stop until\nI erase everything in this world.',
  },
  '82FC': blotWhere,
  '8440': { es: '¿Crees que puedes vencerme?', en: 'Do you think you can beat me?' },
  '84D8': { es: '¿Dudas? Vuelve cuando te atrevas\na enfrentar mi rencor.', en: 'You hesitate? Come back when you\ndare to face my hatred.' },
  '853C': { es: '¡Que te consuma el fuego\nde mi rencor!', en: 'Be consumed by the fire\nof my hatred!' },
  '85D8': {
    es: `Ohhh, me desvanezco...\n¿Desaparecerá también mi rencor?\n\n¿Me salvaré ahora?\nNo lo sé... No lo sé...\n\n${blotWhere.es}`,
    en: `Ohhh, I'm fading...\nWill my hatred disappear, too?\n\nWill I be saved now?\nI don't know... I don't know...\n\n${blotWhere.en}`,
  },
  '8AF0': {
    es: '¡Oh, el rencor crece dentro de mí!\nYa no lo puedo contener...\n\nDebo librarme de él.\n¡Este mundo se perderá en el gris!\n\nHaré que todos sientan mi dolor.\n\n¡Siente mi dolor! ¡Siente mi angustia!\n\n¡Esta es la venganza de los que\nse quedaron atrás!',
    en: "Oh, the hatred inside me is growing!\nI can't hold it back anymore...\n\nI must rid myself of it.\nThis world will be lost in grey!\n\nI will make everyone feel my pain.\n\nFeel my pain! Feel my agony!\n\nThis is the revenge of those\nwho were left behind!",
  },
  '8D24': deck('*c3Mazo Vacío Desesperado\nEl mazo más maligno y poderoso.', '*c3Desperate Void Deck\nThe most evil and powerful deck.'),

  // Tronada's Arena: Tronada, Tuerca, then Lucero
  'DBB0': {
    es: '¡Hola, soy Tronada!\n¡Te damos la bienvenida a nuestra Arena!\n\nAbrí esta Arena para que todos\ndisfruten de las partidas de cartas.\n\nAsí que relájate y diviértete.',
    en: "Hi, I'm Tronada!\nWelcome to our Arena!\n\nI opened this Arena so everyone\ncould enjoy card battles!\n\nSo relax and have fun.",
  },
  'DD8C': tronada.ask,
  'DE18': tronada.wait,
  'DE98': { es: '¡Bien, empecemos!', en: "Alright, let's begin!" },
  'DF30': {
    es: `¡Ay, no! ¡Perdí!\n\n${tronada.fun.es}\n\nMe encantaría repetirlo\ncuando tengas más tiempo.\n\n¡Nos vemos! ¡Adiós!`,
    en: `Oh no! I lost!\n\n${tronada.fun.en}\n\nI'd love to do this again\nwhen you have more time.\n\nSee you again! Goodbye!`,
  },
  'E0D0': {
    es: `¡Bien! ¡Gané!\n\n${tronada.fun.es}\n\nMe encantaría jugar otra vez\ncuando tengas más tiempo.\n\n¡Hasta luego! ¡Adiós!`,
    en: `Yes! I won!\n\n${tronada.fun.en}\n\nI'd love to play again\nwhen you have more time.\n\nSee you later! Goodbye!`,
  },
  'E264': tronadaDeck,
  'E3AC': {
    es: '¡Eh! ¡Soy Tuerca!\n\nPequeño, pero bien apretado.\n¡Y nunca pierdo!\n\n¡Así como lo oyes!',
    en: "Hey! I'm Tuerca!\n\nSmall, but screwed on tight.\nAnd I never lose!\n\nYou heard me!",
  },
  'E574': { es: '¿Qué miras?\n¿Quieres pelea?', en: 'What are you looking at?\nWant a fight?' },
  'E614': { es: '¡Bah! ¡Qué poco valor!', en: 'Bah! No guts at all!' },
  'E678': { es: '¡Yo nunca, nunca pierdo!', en: 'I never, ever lose!' },
  'E718': {
    es: '¡Ay, no! ¿Qué pasó?\n¿Perdí?\n\n¿Por qué? ¿Por qué? ¿Por qué?\n¡Rayos! ¿Cómo puede ser?\n\n¡Vamos a jugar otra vez!',
    en: "Oh no! What happened?\nI lost?\n\nWhy? Why? Why?\nDarn! How can that be?\n\nWe're playing again!",
  },
  'E85C': {
    es: '¡Gané! ¡Gané!\n¡Te dije que iba a ganar!\n\nSi quieres, juego otra vez contigo.\nEs que soy muy generoso.\n\n¡Cuando quieras! ¡Nos vemos!',
    en: "I won! I won!\nI told you I'd win!\n\nI'll play you again if you want.\nI'm just that generous.\n\nAnytime! See ya!",
  },
  'E9AC': tuercaDeck,
  'EB00': {
    es: '¡Aquí estoy! Soy Lucero.\n\nComo ves, soy una estrella.\n¿Y tú quieres jugar conmigo?\n\n¿Sabes en qué te estás metiendo?\nLo que quiero decir es que...\n\n¡Jugar contra una estrella como yo\nes un gran honor para ti!',
    en: "Here I am! I'm Lucero.\n\nAs you can see, I'm a star.\nAnd you want to play me?\n\nDo you know what you're getting into?\nWhat I mean is... that...\n\nPlaying a star like me\nis a great honor for you!",
  },
  'ED80': { es: '¡Te voy a deslumbrar!\n¿Empezamos?', en: "I'm going to dazzle you!\nShall we start?" },
  'EE1C': {
    es: 'Ja, ja, ja, ja...\n\nParece que jugar contra Lucero\nte pone los nervios de punta. ¡Ja, ja!',
    en: 'Ha ha ha ha...\n\nLooks like facing Lucero\nis too much for your nerves. Ha ha!',
  },
  'EF0C': lucero.go,
  'EFE4': lucero.lost,
  'F264': { es: '¡Un momento! ¿De qué hablas?\n\n¡Aaaah...!', en: 'Hold on! What are you talking about?\n\nAaaah...!' },
  'F47C': {
    es: '¡Uf!\n¡Fue facilísimo!\n\n¿Ves? ¡A Lucero nadie le gana!\nBueno, bueno, no lo hiciste tan mal.\n\nPero es que juego demasiado bien.\n¡Soy Lucero! ¿Entendiste?\n\nAsí que no vuelvas a hacer algo\ntan tonto. ¿De acuerdo?\n\nAdiós. ¡Nos vemos!',
    en: "Whew!\nThat was way too easy!\n\nSee? No one beats Lucero!\nOK, OK, you didn't do so badly.\n\nBut I just play too well.\nI'm Lucero! You get it?\n\nSo don't do anything that silly\nagain. OK?\n\nBye. See you later!",
  },
  'F6AC': luceroDeck,
};
