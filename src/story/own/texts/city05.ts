/**
 * Ciudad sin Faroles (city 5): a city whose street lamps went out long ago, where it is always dusk.
 * The Collector has taken its Arena, and Hebra, his companion, defends it in each of its shapes (Hebra,
 * Aguijón, Humo, Quetzal) until the Collector himself loses and runs off. Hebra then gives the pass to
 * Templo Hundido and an egg for the partner; later it keeps the Arena with all its shapes.
 * Mortaja's gang, Astado and Isidro, and Gruñón are in city05later.ts.
 */
import { CITY05_LATER } from './city05later';
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });
const hebraDeck = deck('*c3Mazo Hilo Firme\nHebra mejoró su mazo de siempre.\nAhora juega en serio.', "*c3Strong Thread Deck\nHebra's usual deck, improved.\nNow it means business.");
const aguijonDeck = deck('*c3Mazo Picadura Sombría\nLa revancha del Enjambre Oscuro,\ncon algunas cartas cambiadas.', "*c3Shadow Sting Deck\nDark Swarm's rematch version,\nwith a few cards swapped.");
const humoDeck = deck('*c3Mazo Humo Renacido\nLa Cortina de Humo vuelve,\ncon cartas que reviven criaturas.', '*c3Smoke Reborn Deck\nThe Smokescreen deck returns,\nwith cards that revive creatures.');
const quetzalDeck = deck('*c3Mazo Pluma Estelar\nUn mazo de combos que ataca tus\npuntos débiles. ¡Cuida tu facción!', '*c3Star Feather Deck\nA combo deck that hits your weak spots.\nGuard your faction!');
const collectorDeck = deck('*c3Mazo Vitrina\nUn mazo de coleccionista, hecho\npara dominar todo el campo.', "*c3Showcase Deck\nA collector's deck, made to\ncontrol the whole field.");

const notice = (es: string, en: string): Written => ({ who: null, es, en });
const eggs = {
  friendship: notice('Recibiste el *c3huevo de la Amistad*c7\nde Brinco.', "You got Brinco's\n*c3Egg of Friendship*c7!"),
  sincerity: notice('Recibiste el *c3huevo de la Sinceridad*c7\nde Trino.', "You got Trino's\n*c3Egg of Sincerity*c7!"),
  reliability: notice('Recibiste el *c3huevo de la Confianza*c7\nde Gema.', "You got Gema's\n*c3Egg of Reliability*c7!"),
};

const hebra = {
  gift: { es: 'Toma, quiero que tengas esto.\n¡Es un huevo para tu compañero!', en: "Here, I want you to have this.\nIt's an egg for your partner!" },
  egg: { es: 'Con este huevo, tu compañero puede\nalcanzar una forma nueva\ncuando entra a combatir.', en: 'With this egg, your partner can\nreach a new shape\nwhen it enters the fight.' },
  thanks: { who: 'me', es: '¡Genial! ¡Muchas gracias!', en: 'Great! Thanks a lot!' },
  beatYou: { es: '¡Esta vez te voy a ganar!', en: "I'll beat you this time!" },
};
const aguijonAsk = { es: '¿Aceptas el combate?', en: 'Will you take me on?' };
const humo = {
  ask: { es: '¿Te atreves a jugar con fuego?', en: 'Do you dare to play with fire?' },
  noForce: { es: 'No voy a obligarte a jugar.', en: "I won't force you to play." },
  go: { es: '¡Pues que empiece el fuego!', en: 'Then let the fire begin!' },
};
const quetzal = {
  ask: { es: '¿Me concedes una batalla?', en: 'Will you grant me a battle?' },
  wait: { es: '¿Es tu última palabra?\nEntonces esperaré.', en: 'Is that your final word?\nThen I shall wait.' },
};

const CAFE: CityTexts = {
  // Hebra, while the Collector holds the Arena
  '134C': {
    es: '¡Sabía que vendrías!\n\nEsta Arena ahora es del Coleccionista,\ny yo la defiendo por él.\n\nTe voy a mostrar todas mis formas.\n¡No pienso perder!',
    en: "I knew you'd come!\n\nThis Arena belongs to the Collector now,\nand I defend it for him.\n\nI'll show you all my shapes.\nI'm not going to lose!",
  },
  '1420': { es: 'Y aunque me ganes, nunca vas\na vencer al Coleccionista.\n\n¡Adelante! Te estoy esperando.', en: "And even if you beat me, you'll\nnever defeat the Collector.\n\nGo ahead! I'm waiting for you." },
  '1E38': { es: '¡Nunca me vas a ganar!', en: "You'll never beat me!" },

  // Hebra, once the Collector has lost: the pass and an egg
  '15B0': { es: 'Quiero darte las gracias.\nEl hechizo de la Arena se rompió.\n\nCreo que el Coleccionista\nva a cambiar.', en: "I want to thank you.\nThe spell on the Arena is broken.\n\nI think the Collector\nis going to change." },
  '1664': { who: 'me', es: '¿Él está bien?', en: 'Is he okay?' },
  '16B4': { es: 'No te preocupes por él.\nYo lo voy a cuidar.\n\nGracias por todo.\nAh, y quiero darte esto.', en: "Don't worry about him.\nI'll take care of him.\n\nThanks for everything.\nOh, and I want to give you this." },
  '1790': notice('Recibiste el pase a Templo Hundido.', 'You got the pass to Sunken Temple.'),
  '17E0': {
    es: 'No puedo creer tu fuerza.\nNunca vi perder al Coleccionista.\n\nYo también quiero hacerme más fuerte.\nEntrenaré en la Arena. ¡Ven a verme!',
    en: "I can't believe how strong you are.\nI'd never seen the Collector lose.\n\nI want to get stronger, too.\nI'll train at the Arena. Come see me!",
  },
  '18F0': hebra.gift,
  '19B4': eggs.friendship,
  '1A20': eggs.sincerity,
  '1A8C': eggs.reliability,
  '1B1C': hebra.egg,
  '1BB8': hebra.thanks,
  '1BFC': { es: '¡Adiós! ¡Te espero!', en: "Bye! I'll be waiting!" },
  '1EA0': { es: 'Gracias por todo.\n\nJuega conmigo otra vez, en la Arena\no en el Café de batallas.', en: 'Thanks for everything.\n\nPlay with me again, at the Arena\nor at the Battle Cafe.' },
  '1F70': hebra.gift,
  '2034': eggs.friendship,
  '20A0': eggs.sincerity,
  '210C': eggs.reliability,
  '219C': hebra.egg,
  '2234': hebra.thanks,
  '2298': { es: '¡Te voy a estar esperando!', en: "I'll be waiting for you!" },

  // Hebra's matches at the café
  '2304': { es: '¿Te animas a una partida?', en: 'Up for a match?' },
  '2394': { es: '¿No? ¡Ay, vamos!\nOtro día será, entonces.', en: 'No? Aw, come on!\nSome other day, then.' },
  '240C': hebra.beatYou,
  '24AC': {
    es: '¡Ay, no! ¡Perdí otra vez!\nTodavía me falta mucho.\n\nPero ¡qué divertido fue!\nNunca disfruté tanto una batalla.\n\nTe lo agradezco, pero la próxima\nno pienso dejarte ganar.',
    en: "Oh no! I lost again!\nI still have a long way to go.\n\nBut that was so much fun!\nI never enjoyed a battle this much.\n\nI'm grateful to you, but next time\nI won't let you win.",
  },
  '2684': {
    es: '¡Sí! ¡Gané! ¿Viste? ¡Te lo dije!\n\nNunca había disfrutado tanto\nuna batalla.\n\nTú me enseñaste a divertirme.\n\nJuego contigo donde quieras.\n¡Repitamos pronto!',
    en: "Yes! I won! See? I told you!\n\nI never enjoyed a battle\nthis much.\n\nYou taught me to have fun.\n\nI'll play you anywhere.\nLet's do it again soon!",
  },
  '2830': hebraDeck,

  // Aguijón: the Shadow faction evolves slowly
  '29C4': {
    es: 'Las cartas de la facción Sombría\nno evolucionan muy rápido.\n\nPero cuanto más alta es su forma,\nmás poder tienen.\n\nAsí son las criaturas Sombrías.\n\nAdemás, las cartas de Apoyo Altar\npueden cambiar la facción del rival.\n\nCon eso puedes armar\ntoda clase de combos.\n\nTe las recomiendo.',
    en: "Shadow faction cards\ndon't evolve very quickly.\n\nBut the higher their shape,\nthe more power they have.\n\nThat's how Shadow creatures are.\n\nAlso, the Altar Support cards\ncan change your rival's faction.\n\nWith that, you can build\nall kinds of combos.\n\nI highly recommend them.",
  },
  '2C58': aguijonAsk,
  '2CEC': { es: 'Como quieras. Te espero\ncuando tengas el valor.', en: "As you wish. I'll wait\nuntil you find the nerve." },
  '2D68': { es: 'Bien. En guardia.', en: 'Good. On guard.' },
  '2E00': { es: 'No tengo excusas...\nMe ganaste por completo.\n\nPero la próxima gano yo.\nPrepárate.', en: "I have no excuses...\nYou beat me completely.\n\nBut next time I'll win.\nBe ready." },
  '2EEC': {
    es: '¡Eso es! Te vencí.\n\nTe enfrento cuando quieras,\naquí en el Café o en la Arena.\n\nTe estaré esperando.',
    en: "That's it! I beat you.\n\nI'll face you anytime,\nhere at the Cafe or at the Arena.\n\nI'll be waiting.",
  },
  '3060': aguijonDeck,

  // Humo: Shadow decks are for players with experience
  '3220': {
    es: 'Las cartas Sombrías son para\njugadores con experiencia.\n\nSu punto débil son sus pocos PE.\n\nY necesitan más PE para evolucionar,\nasí que son lentas.\n\nPero cuando llegan a Perfecto,\nsu poder es tremendo.\n\nY una cosa más...\n\nSus efectos de Apoyo suelen\nser arriesgados.\n\nAsí que juega con cabeza:\nnada de apostarlo todo a una carta.\n\n¿Tienes la experiencia para\nusar un mazo Sombrío?',
    en: "Shadow cards are for\nplayers with experience.\n\nTheir weak spot is their low EP.\n\nAnd they need more EP to evolve,\nso they're slow.\n\nBut once they reach Apex,\ntheir power is tremendous.\n\nAnd one more thing...\n\nTheir Support effects are\noften risky.\n\nSo play smart:\nno betting everything on one card.\n\nDo you have the experience\nto use a Shadow deck?",
  },
  '3570': humo.ask,
  '3608': humo.noForce,
  '3680': humo.go,
  '371C': { es: '¿Qué? ¿Todavía no puedo ganarte?\n¡La próxima vez te gano!\n\n¡Acuérdate de lo que te digo!', en: "What!? I still can't beat you?\nThen I'll get you next time!\n\nMark my words!" },
  '37FC': {
    es: '¡Ya viste quién manda!\n\nCreo que esta vez tuve suerte.\nJuguemos otra vez en el Café.\n\nVamos, no me dejes con las ganas.',
    en: "Now you know who's boss!\n\nI guess I got lucky this time.\nLet's play again at the Cafe.\n\nCome on, don't leave me hanging.",
  },
  '3954': humoDeck,

  // Quetzal, Hebra's last shape, free of the Collector
  '3B20': { es: 'Me enseñaste la alegría de jugar.\nTe lo agradezco de verdad.\n\nOjalá podamos repetirlo.', en: 'You showed me the joy of playing.\nI truly thank you.\n\nI hope we can do it again.' },
  '3C00': quetzal.ask,
  '3C90': quetzal.wait,
  '3D04': { es: 'Ahora solo estamos tú y yo.', en: "Now it's just you and me." },
  '3DB0': {
    es: 'Una victoria perfecta.\nNo me arrepiento de nada.\nAl contrario: me siento bien.\n\nQuiero jugar a las cartas como tú.\nPero cuidado: esto apenas empieza.\n\nTe voy a desafiar muchas veces.\n¡Hasta la próxima!',
    en: "A perfect win.\nI have no regrets.\nIn fact, I feel good.\n\nI want to play cards like you.\nBut beware: this is only the beginning.\n\nI'll challenge you many times.\nUntil next time!",
  },
  '4078': {
    es: 'Nuestra batalla continúa...\nSiempre disfruto nuestras partidas.\n\nNo volveré a perder.\nAcepto tu desafío cuando quieras.\n\n¡Te estaré esperando!',
    en: "Our battle goes on...\nI always enjoy our matches.\n\nI won't lose again.\nI'll accept your challenge anytime.\n\nI'll be waiting!",
  },
  '41C0': quetzalDeck,

  // the Collector's deck, from the café
  '82BC': collectorDeck,
};

const ARENA: CityTexts = {
  // the Collector's tournament: Hebra in each of its shapes, then the Collector himself
  '9184': {
    es: 'En esta Arena peleo con cada\nuna de mis formas.\n\nSi crees que vas a ganar tan fácil\ncomo la otra vez, piénsalo bien.\n\nNo vas a llegar hasta\nel Coleccionista. ¡Va en serio!',
    en: "In this Arena I fight with\nevery one of my shapes.\n\nIf you think you'll win as easily\nas last time, think again.\n\nYou won't get to the Collector.\nI mean it!",
  },
  '93AC': { es: '¿Empezamos la batalla?', en: 'Shall we start the battle?' },
  '943C': { es: 'Entonces, ¡fuera de aquí!', en: 'Then buzz off!' },
  '949C': { es: '¡No voy a perder!\n¡Esta vez gano yo!', en: "I won't lose!\nThis time I'll win!" },
  '9554': {
    es: '¡Aaay! Perdí.\n\nVoy a evolucionar. En mi próxima\nforma me llamo Aguijón.\n¡Ahora sí vas a caer!\n\n¡Prepárate!',
    en: "Aaargh! I lost.\n\nI'm going to evolve. In my next\nshape, my name is Aguijón.\nNow you're going down!\n\nBe ready!",
  },
  '965C': {
    es: '¡Bien! ¡Gané!\n\n¿Qué te pareció? ¡Ya no me\nvas a volver a ganar!\n\nJuego contigo cuando quieras.\nVuelve si tienes ganas de perder.',
    en: "Great! I won!\n\nHow do you like that? You'll\nnever beat me again!\n\nI'll play you anytime. Come back\nif you feel like losing again!",
  },
  '97A4': hebraDeck,
  '98C0': {
    es: 'Soy Aguijón.\nEsperé mucho este día.\n\nTe voy a aplastar con mi nuevo\nmazo Picadura Sombría.\n\nTus trucos no sirven conmigo.\nTendrás que enfrentarme de frente.',
    en: "I am Aguijón.\nI've waited a long time for this day.\n\nI'll crush you with my new\nShadow Sting deck.\n\nYour tricks won't work on me.\nYou'll have to face me head-on.",
  },
  '9AC4': { es: '¿Empezamos?', en: 'Shall we begin?' },
  '9B58': { es: '¿Para qué retrasar la batalla?\n¡Date prisa!', en: 'Why delay our battle?\nHurry up!' },
  '9BD8': { es: '¡Prepárate para caer!', en: 'Prepare to fall!' },
  '9C7C': {
    es: 'Admito la derrota.\nTu habilidad impresiona.\n\nPero con el huevo del Valor\nevolucionaré en Humo. ¡Y te ganaré!',
    en: "I admit defeat.\nYour skill is impressive.\n\nBut with the Egg of Courage\nI'll evolve into Humo. And I'll win!",
  },
  '9DA0': {
    es: 'No quiero excusas.\nPerdiste. Acéptalo.\n\nTe enfrento cuando quieras,\npero nunca me vas a ganar.\n\n¡Ja, ja, ja!',
    en: "I don't want any excuses.\nYou lost. Accept it.\n\nI'll face you whenever you like,\nbut you'll never beat me.\n\nHa ha ha!",
  },
  '9EEC': aguijonDeck,
  A034: {
    es: '¡Soy Humo! ¡Esta vez sí te gano!\n\nTe voy a mostrar el verdadero poder\ndel huevo del Valor.\n\n¡Esta será tu última batalla!',
    en: "I'm Humo! This time I'll get you!\n\nI'll show you the true power\nof the Egg of Courage!\n\nThis will be your last battle!",
  },
  A208: humo.ask,
  A2A8: { es: '¡No me hagas esperar!', en: "Don't keep me waiting!" },
  A318: humo.go,
  A3B0: {
    es: '¿Qué? ¿Todavía no alcanza\npara ganarte?\n\nÚltima oportunidad. Con el huevo\nde la Luz alcanzaré mi forma final.\n\n¡No tienes escapatoria!\nLa próxima batalla será la última.\n\n¡Acuérdate de lo que te digo!',
    en: "What!? I'm still not good enough\nto beat you!?\n\nLast chance. With the Egg of Light\nI'll reach my final shape.\n\nThere's no escape!\nThe next battle will be your last!\n\nMark my words!",
  },
  A584: {
    es: '¿Ves? ¡No eres rival para mí!\n\nNo soy como los demás.\nConmigo no se pasa tan fácil.\n\nTe detuve. ¡De aquí no pasas!',
    en: "See? You're no match for me!\n\nI'm not like the others.\nYou can't get past me so easily.\n\nI stopped you. You're going nowhere!",
  },
  A6D4: humoDeck,
  A82C: {
    es: '¡Esta es mi forma final!\nAhora me llamo Quetzal.\n\nNo tendré piedad. En esta ciudad\nsin faroles solo brillan las estrellas,\n\ny las estrellas ya decidieron\nquién va a ganar. ¡Yo!\n\nYa no peleo por el Coleccionista.\n¡Peleo por mí!\n\n¡Que empiece la batalla!',
    en: "This is my final shape!\nNow my name is Quetzal.\n\nI'll show no mercy. In this lampless\ncity only the stars shine,\n\nand the stars have already decided\nwho will win. Me!\n\nI don't fight for the Collector\nanymore. I fight for me!\n\nLet the battle begin!",
  },
  AAC0: { es: '¿Aceptas mi desafío?', en: 'Do you accept my challenge?' },
  AB48: { es: 'No puedes escapar de tu destino.', en: 'You cannot escape your fate.' },
  ABBC: { es: '¡Esta es la batalla final!', en: 'This is the final battle!' },
  AC5C: {
    es: 'No tengo nada más que decir.\nNuestra batalla terminó.\n\nNo me arrepiento.\nAl contrario: me siento muy bien.\n\nPerdón, Coleccionista.\nNo pude hacerlo mejor.\n\nPero vas a estar bien, ¿verdad?\n\nMe cuesta irme, pero ya no tengo\nrazones para quedarme aquí.\n\nAdiós...',
    en: "I have nothing more to say.\nOur battle is over.\n\nI have no regrets.\nIn fact, I feel great.\n\nSorry, Collector.\nI couldn't do any better.\n\nBut you'll be okay, won't you?\n\nI hate to leave, but I have\nno reason to stay here anymore.\n\nGoodbye...",
  },
  AEB4: {
    es: 'La batalla terminó, pero\nla disfruté mucho.\n\nNunca me vas a vencer, pero acepto\ntu desafío cuando quieras.\n\n¡Te estaré esperando!',
    en: "The battle is over, but\nI really enjoyed our match.\n\nYou'll never defeat me, but I'll\naccept your challenge anytime.\n\nI'll be waiting!",
  },
  B000: quetzalDeck,

  // the Collector shows up
  B150: {
    es: '¡Ja, ja, ja! ¡Por fin llegas!\n¿A qué debo el honor?\n\nLas cartas de esta ciudad ya son mías.\nY su Arena, bajo mi hechizo, también.\n\nMe sorprende que alguien tan débil\nhaya llegado hasta aquí.\n\nHebra, no sirves para nada.\n\n¿Ni siquiera pudiste detener a\nalguien así? Eres un bicho inútil.',
    en: "Ha ha ha! So you're finally here!\nTo what do I owe the honor?\n\nThe cards of this city are mine now.\nAnd its Arena is under my spell.\n\nI'm surprised someone so weak\nmade it this far.\n\nHebra, you're useless.\n\nYou couldn't even stop someone\nlike that? You're a useless bug.",
  },
  B33C: { who: 'me', es: '¿Cómo puedes decirle eso a quien\npeleó con tanto valor por ti?', en: 'How can you say that to someone\nwho fought so bravely for you?' },
  B3CC: { es: '¿Qué? No entiendes nada.\nUn bicho inútil es inútil\nhaga lo que haga.\n\n¿Ni eso puedes entender?', en: "What? You understand nothing.\nA useless bug is useless,\nwhatever it does.\n\nCan't you even understand that?" },
  B4BC: { who: 'me', es: '¡Qué cruel eres!', en: "You're so cruel!" },
  B510: { es: '¿Sabes siquiera quién soy?\nClaro, alguien como tú no lo sabría.', en: "Do you even know who I am?\nOf course, someone like you wouldn't." },
  B5B0: { who: 'me', es: 'Oye, ¿por qué no te callas?', en: "Hey, why don't you be quiet?" },
  B614: { es: '¿¡Qué dijiste!?', en: 'What did you just say!?' },
  B67C: { who: 'me', es: 'Te haces llamar el Coleccionista,\npero no me pareces gran cosa.', en: "You call yourself the Collector,\nbut you don't seem like much to me." },
  B714: { es: 'Hmf. ¿¡Me lo explicas!?', en: 'Hmph. Care to explain that!?' },
  B784: {
    who: 'me',
    es: 'Dime qué lograste tú solo.\n\nNada, ¿verdad? Tus criaturas\nhicieron todo el trabajo.\n\nJuntas cartas y más cartas,\npero ¿sabes jugarlas?\n\n¡Ah, ya entiendo! Eres malo\njugando a las cartas, ¿no? ¡Ja, ja!',
    en: "Tell me what you've done on your own.\n\nNothing, right? Your creatures\ndid all the work.\n\nYou hoard card after card,\nbut can you even play them?\n\nOh, I get it! You're bad\nat cards, aren't you? Ha ha!",
  },
  B938: { es: '¿¡Qué!? Tú... ¡Tú...!', en: 'What!? You... You...!' },
  B9A4: { who: 'me', es: '¡Basta de charla!\nTe voy a enseñar a jugar a las cartas.', en: "Enough talk!\nI'll show you how to play cards." },
  BA28: { es: '¿Tú, enseñarme a mí? ¡Ja!\nNo sabes lo que dices.', en: "You, teach me? Ha!\nYou don't know what you're saying." },
  BAC8: { who: 'me', es: '¿No te dije que te callaras?\nEs hora de jugar.\n\n¡Vamos, empecemos!', en: "Didn't I tell you to be quiet?\nIt's time to play.\n\nCome on, let's go!" },
  BB8C: { es: '...\nEsto no se va a quedar así.', en: "...\nYou won't get away with this." },
  BCB4: { es: 'No voy a perder.\n¿De verdad te atreves?', en: "I won't lose.\nDo you really dare?" },
  BD40: { es: '¡Vas a terminar rogando\nque tenga piedad!', en: "You'll end up begging\nfor my mercy!" },
  BDBC: { es: '¡Te vas a arrepentir\nde haber venido!', en: "You'll regret\never coming here!" },
  BE78: { es: '¡No...! ¿Por qué?\n¡Mi hechizo se rompe!\n\nEsto no puede estar pasando.', en: "No...! Why?\nMy spell is breaking!\n\nThis can't be happening." },
  BEF8: { who: 'me', es: 'Voy a contarles a todos que\nHebra jugó mejor que tú.', en: "I'm going to tell everyone that\nHebra was a better player than you." },
  BF8C: { es: '¿Qué? ¡Mentira!\n\n¡No puedo creer lo que pasa!', en: "What? Lies!\n\nI can't believe this is happening!" },
  C03C: { who: 'me', es: 'Oye, perdiste. Acéptalo.\nY deja de lloriquear, ¿sí?', en: 'Hey, you lost. Face it.\nAnd stop whining, okay?' },
  C0C4: { es: '...', en: '...' },
  C118: { who: 'me', es: '¿Estás bien?', en: 'Are you okay?' },
  C168: { es: 'Qué horror...\nPerdí... No lo puedo creer...', en: "This is horrible...\nI lost... I can't believe it..." },
  C1F8: { who: 'me', es: '¡Ay, no exageres! Perdiste\nuna sola vez. ¿Quieres la revancha?', en: 'Oh, come on! You only lost once.\nDo you want a rematch?' },
  C280: { es: 'Déjame en paz.\nNo me vas a volver a ver.\n\nDéjame en paz.', en: "Just leave me alone.\nYou'll never see me again.\n\nLeave me alone." },
  C34C: { who: 'me', es: '¡Espera!\n\nAy, se fue. Y nunca se quitó\nla máscara.\n\nColeccionista...\nOjalá esté bien.', en: "Wait!\n\nAw, he's gone. And he never\ntook off his mask.\n\nCollector...\nI hope he'll be okay." },
  C42C: {
    es: '¡Ja! El que pierde, pierde siempre,\nhaga lo que haga.\n\n¡Que te sirva de lección!\nNo vuelvas a molestarme.\n\n¡Ja, ja, ja, ja!',
    en: "Ha! A loser is always a loser,\nno matter what.\n\nLet this be a lesson to you!\nDon't bother me again.\n\nHa ha ha ha!",
  },
  C57C: { who: 'me', es: '¡Rayos! No voy a dejar que se\nsalga con la suya. ¡Tengo que ganarle!', en: "Darn! I won't let him get away\nwith this. I've got to beat him!" },
  C61C: collectorDeck,

  // Hebra's own Arena, once the Collector is gone
  C9A0: {
    es: 'Gracias por venir. Como te dije,\naquí juego con todas mis formas.\n\nPerdí contra ti muchas veces, pero\nesta vez nadie sabe quién va a ganar.\n\n¡No esperes ganar siempre!\n\n¡Demos lo mejor!',
    en: "Thanks for coming. As I told you,\nhere I play with all my shapes.\n\nI've lost to you many times, but\nno one knows who'll win this time.\n\nDon't expect to win every time!\n\nLet's give it our best!",
  },
  CBF0: { es: '¿Empezamos?', en: 'Shall we get going?' },
  CC84: { es: '¿No? ¡Ay, vamos!\nVuelve cuando quieras jugar.', en: 'No? Aw, come on!\nCome back when you want to play.' },
  CCF8: hebra.beatYou,
  CD94: {
    es: '¡Ay, no! ¡Perdí otra vez!\nTodavía me falta mucho.\n\nPero ¡qué buena batalla!\nNunca imaginé que jugar fuera tan lindo.\n\nTú me mostraste lo bonito de jugar.\nPero ojo: ¡te voy a alcanzar!\n\nLa próxima no te dejo ganar.',
    en: "Oh no! I lost again!\nI still have a long way to go.\n\nBut what a great battle!\nI never knew playing could be so fun.\n\nYou showed me the beauty of battles.\nBut watch out: I'll catch up!\n\nI won't let you win next time.",
  },
  CF88: {
    es: '¡Sí! ¡Gané! ¿Viste? ¡Te lo dije!\n\n¡Qué batalla! No sabía que\njugar podía ser tan genial.\n\nTú me mostraste el camino.\n\nJuego contigo cuando y donde sea.\n¡Repitamos!\n\n¡Te voy a estar esperando!',
    en: "Yes! I won! See? I told you!\n\nWhat a battle! I didn't know\nplaying could be so great.\n\nYou showed me the way.\n\nI'll play you anytime, anywhere.\nLet's do it again!\n\nI'll be waiting for you!",
  },
  D180: hebraDeck,
  D324: aguijonAsk,
  D3BC: { es: 'Esquivarme no te servirá.\nTarde o temprano nos enfrentaremos.', en: "Dodging me won't help.\nSooner or later, we'll face each other." },
  D438: { es: '¡Esta vez caes!', en: "This time you're going down!" },
  D4D8: {
    es: 'No tengo excusas.\nMe ganaste limpiamente.\n\nLa próxima evolucionaré en Humo,\n¡y entonces te ganaré!\n\nPrepárate.',
    en: "I make no excuses.\nYou beat me fair and square.\n\nNext time I'll evolve into Humo,\nand then I'll beat you!\n\nBe ready.",
  },
  D62C: {
    es: '¡Ja! ¡Lo logré! Te vencí.\n\nTe enfrento cuando quieras.\n\nEstaré en el Café o en la Arena,\npor si quieres probar suerte otra vez.\n\n¡Te espero!',
    en: "Ha! I did it! I beat you.\n\nI'll face you anytime.\n\nI'll be at the Cafe or the Arena\nif you want to try your luck again.\n\nI'll be waiting!",
  },
  D7B4: aguijonDeck,
  D984: humo.ask,
  DA1C: humo.noForce,
  DA94: humo.go,
  DB30: {
    es: 'No... ¿Todavía no alcanza?\nUsaré otra vez el huevo de la Luz.\n\nNo tienes dónde esconderte.\nTe ganaré en la próxima batalla.\n\n¡Acuérdate de lo que te digo!',
    en: "No... I'm still not good enough?\nI'll use the Egg of Light again.\n\nYou have nowhere to hide.\nI'll beat you in our next battle.\n\nMark my words!",
  },
  DC9C: {
    es: '¡Ya viste de qué estoy hecho!\n\nY no fue suerte, eh.\nJuguemos otra vez en el Café.\n\nVamos, no me dejes con las ganas.',
    en: "Now you've seen what I'm made of!\n\nAnd it wasn't luck, either.\nLet's play again at the Cafe.\n\nCome on, don't leave me hanging.",
  },
  DDFC: humoDeck,
  DF54: {
    es: 'Sabía que llegarías.\nCon tu fuerza, debió de ser fácil.\n\nTambién venciste al Coleccionista,\npero conmigo no será igual.\n\nPeleemos con todo.\nNuestra batalla apenas empieza.',
    en: "I knew you'd make it.\nAs strong as you are, that was easy.\n\nYou defeated the Collector, too,\nbut it won't be the same with me.\n\nLet's fight with all we have.\nOur battle is only beginning.",
  },
  E1AC: quetzal.ask,
  E234: quetzal.wait,
  E2A8: { es: 'Esta batalla es entre tú y yo.', en: 'This battle is between you and me.' },
  E354: {
    es: 'Tu técnica fue perfecta. Ganaste.\nNo me arrepiento. Hasta siento alivio.\n\nAlgún día quiero jugar a las cartas\ncomo tú. ¡Y lo voy a lograr!\n\nTe seguiré desafiando.\nNos vemos en el Café de batallas.',
    en: "Your technique was perfect. You win.\nNo regrets. In fact, I'm relieved.\n\nSomeday I want to play cards\nlike you. And I will!\n\nI'll keep challenging you.\nSee you at the Battle Cafe.",
  },
  F2BC: {
    es: 'Nuestra batalla apenas empieza...\nSiempre disfruto nuestras partidas.\n\nNo volveré a perder.\nDesafíame cuando quieras.\n\n¡Te estaré esperando!',
    en: "Our battle has only begun...\nI always enjoy our matches.\n\nI won't be defeated again.\nChallenge me anytime.\n\nI'll be waiting!",
  },
  F408: quetzalDeck,
};

export const CITY05: CityTexts = { ...CAFE, ...ARENA, ...CITY05_LATER };
