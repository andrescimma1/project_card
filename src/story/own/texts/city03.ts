/**
 * Puerto Escarcha (city 3): an icy harbour of frozen docks and lighthouses. The Collector has taken its
 * arena: Aguijón guards it and Ventisca, the wolf who hands out the pass to Chatarral, is under his spell.
 * Iker tells the player that every arena in the Quiet Lands is in danger. Once Aguijón falls, Ventisca is
 * free, furious that someone calls himself the Collector, and gives the pass after a clean battle.
 * Later come Acero, Mateo and Acero Negro, and Gema, who opens the Extra Arena. The later phases of the
 * arena and the Extra Arena are in city03later.ts.
 */
import { CITY03_LATER, DECKS03, LINES03 } from './city03later';
import type { CityTexts, Written } from './types';

const { grr, tempano, muelle, ventisca, coraza, barreno, calado, anfora, fiordo, acero, aceroNegro } = LINES03;

const deck = (es: string, en: string): Written => ({ who: null, es, en });
const aguijonDeck = deck('*c3Mazo Enjambre Oscuro\nUn mazo con muchas maneras\nde atacar.', '*c3Dark Swarm Deck\nA deck with many ways\nto attack.');
const thornDeck = deck('*c3Mazo Jardín de Espinas\nUn mazo de tres colores lleno de plantas.\nToda flor tiene sus espinas.', '*c3Thorn Garden Deck\nA three-color deck full of plants.\nEvery flower has its thorns.');
const ikerDeck = deck('*c3Mazo Paso Firme\nUn mazo para partidas largas.\nLa clave es la velocidad.', '*c3Steady Stride Deck\nA deck for long matches.\nSpeed is the key.');
const mateoDeck = deck('*c3Mazo Lazo Firme\nLo mejor de las facciones Azul y Verde.\nUn mazo muy rápido.', '*c3Firm Bond Deck\nThe best of the Blue and Green factions.\nA very fast deck.');

const tempanoWonLunch = {
  es: '¡Sí, sí! ¡Gané!\n¡Tú invitas el almuerzo!\n\nUf, quedé llenísimo.\n¡Gracias por el banquete!\n\n¡Ojalá lo repitamos pronto!',
  en: "Yes, yes! I won!\nLunch is on you!\n\nPhew, I'm stuffed.\nThanks for the feast!\n\nLet's do this again soon!",
};
const gemaArena = { es: '¡Ey! Organizo una Arena.\n¿Por qué no entras, para divertirte?', en: "Yo! I'm running an Arena.\nWhy don't you jump in, just for fun?" };
const ventiscaFair = {
  es: 'La última vez que jugamos,\nyo no era yo.\n\nQuiero una batalla limpia,\nde igual a igual.',
  en: "The last time we played,\nI wasn't myself.\n\nI want a clean battle,\nas equals.",
};
const toArena = { es: 'Es inútil.\n¡Tengo que ir a la Arena!', en: "It's no use.\nI need to get to the Arena!" };
const mystery = {
  es: '¡Gana experiencia y junta cartas!\n\nTienes que armar un mazo poderoso\nque nadie pueda vencer.',
  en: "Gain experience and collect cards!\n\nYou must build a powerful deck\nthat no one can beat!",
};

const HARBOR: CityTexts = {
  // Témpano, at the café: always hungry
  '17F8': {
    es: 'Ñam... Te cuento un secreto.\n\nLas criaturas de la facción Azul\nsuelen tener mucho HP.\n\nAguantan mucho, pero sus ataques\nno son tan fuertes.\n\nY otro truco, de regalo.\n\nSi tienes cartas que no te sirven,\núsalas como PE o como soporte.\n\nAsí haces lugar en la mano\npara robar cartas nuevas.\n\n¡No tiene sentido guardar\ncartas inútiles en la mano!',
    en: "Munch... Let me tell you a secret.\n\nBlue faction creatures usually\nhave lots of HP.\n\nThey last a long time, but their\nattacks aren't that strong.\n\nHere's another trick, on the house.\n\nIf you have cards you can't use,\nplay them as EP or as support.\n\nThat makes room in your hand\nto draw new cards.\n\nThere's no point keeping\nuseless cards in your hand!",
  },
  '1AFC': { es: '¿Jugamos una partida?\n¡Se me abre el apetito!', en: "Shall we play a match?\nIt's making me hungry!" },
  '1B84': tempano.no,
  '1BE8': tempano.go,
  '1C7C': { es: '¡Nooo! ¡Perdí otra vez!\n¡Juegas demasiado bien!\n\n¡No es justo!\nY encima tengo hambre...', en: "Nooo! I lost again!\nYou play way too well!\n\nIt's not fair!\nAnd I'm still hungry..." },
  '1D74': {
    es: '¡Sí, sí! ¡Gané!\n¿Perdiste la mano?\n\nUf, quedé llenísimo.\n¡Gracias por el banquete!\n\n¡Ojalá lo repitamos pronto!',
    en: "Yes, yes! I won!\nLost your touch?\n\nPhew, I'm stuffed.\nThanks for the feast!\n\nLet's do this again soon!",
  },
  '1EAC': DECKS03.tempano,

  // Muelle, the old whale of the docks
  '2074': {
    es: 'Hola. Deja que te dé un consejo...\n\nMuchos efectos de la facción Azul\nanulan los ataques del rival.\n\nAsí se defienden y, a la vez,\nle bajan el HP al rival.\n\nPor cierto, ¿tienes algún huevo?\n\nCon un huevo, tu compañero puede\nevolucionar a su forma Armadura\nen plena batalla.\n\nPero después ya no puede\nevolucionar a Campeón ni a Perfecto.\n\nLa fuerza de una forma Armadura\nestá entre la de un Novato\ny la de un Campeón.\n\nAsí que, según cómo quieras pelear,\ntal vez te convenga no usar el huevo.',
    en: "Hello. Let me give you some advice...\n\nMany Blue faction effects\nnullify the rival's attacks.\n\nThat way they defend and wear down\nthe rival's HP at the same time.\n\nBy the way, do you have any eggs?\n\nWith an egg, your partner can evolve\ninto its Armored shape mid-battle.\n\nBut after that, it can no longer\nevolve to Veteran or Apex.\n\nAn Armored shape's strength sits\nbetween a Novice and a Veteran.\n\nSo, depending on how you want to fight,\nyou may be better off without the egg.",
  },
  '2434': muelle.ask,
  '24C0': muelle.no,
  '2530': { es: 'Bien. Vamos allá...', en: 'Good. Here we go...' },
  '25CC': muelle.lost,
  '2784': {
    es: 'Perdona, me dejé llevar.\nNo quería ser tan duro.\n\nTienes mucho potencial. Un día\nme vencerás y seguirás tu camino.\n\nEsperaré tu próximo desafío.',
    en: "Forgive me, I got carried away.\nI didn't mean to be so harsh.\n\nYou have great potential. One day\nyou'll beat me and move on.\n\nI'll be waiting for your next challenge.",
  },
  '28DC': DECKS03.muelle,

  // Ventisca, under the Collector's spell
  '2990': grr,
  '29E8': { who: 'me', es: 'A esta criatura le pasa algo.', en: "Something's wrong with this creature." },
  '2A50': grr,
  '2AA8': { who: 'me', es: '¿Él también está bajo el hechizo\nde ese viajero?', en: "Is he under that traveller's\nspell, too?" },
  '2B18': { es: 'Ayuda... Ayúdame...', en: 'Help... Please... help me...' },
  '2B78': { who: 'me', es: '¿Qué? ¿Qué dijiste?', en: 'What? What did you say?' },
  '2BD4': grr,
  '2C2C': { who: 'me', es: 'Es inútil.\nTengo que ir a la Arena.', en: "It's no use.\nI have to get to the Arena." },

  // Ventisca, free again: furious with the Collector
  '2E24': { es: 'Gracias por vencer a Aguijón.\nMe salvaste.', en: 'Thanks for beating Aguijón.\nYou saved me.' },
  '2EB0': { who: 'me', es: '¿Quién te hizo esto?\n¿Fue el Coleccionista?', en: 'Who did this to you?\nWas it the Collector?' },
  '2F3C': {
    es: 'Sí. Apareció de la nada\ny me ordenó que lo obedeciera.\n\nMe negué, claro. Pero entonces...\n\n...caí bajo su hechizo.\n\n¡Se hace llamar Coleccionista!\n¡Como si las criaturas fuéramos\ncartas de su colección!',
    en: 'Yes. He showed up out of nowhere\nand ordered me to obey him.\n\nOf course I refused. But then...\n\n...I fell under his spell.\n\nHe calls himself the Collector!\nAs if we creatures were cards\nin his collection!',
  },
  '3104': { who: 'me', es: 'Bueno, no entiendo bien\nqué está pasando.', en: "Well, I don't really understand\nwhat's going on." },
  '3180': {
    es: `En fin, la Arena vuelve a ser libre.\n\nGracias a ti, puedo volver a dar\nel pase a Chatarral.\n\nSi quieres seguir tu viaje,\nte pido otra batalla conmigo.\n\nSi me vences aquí, te daré el pase.\n\n${ventiscaFair.es}\n\n¿Aceptas mi desafío?\nEsta vez, carta contra carta.`,
    en: `Anyway, the Arena is free again.\n\nThanks to you, I can hand out\nthe pass to Scrapyard again.\n\nIf you mean to keep traveling,\nI must ask you for another battle.\n\nBeat me here and the pass is yours.\n\n${ventiscaFair.en}\n\nWill you accept my challenge?\nThis time, card against card.`,
  },
  '3488': { who: 'me', es: '¡Claro!\n¡Acepto tu desafío!', en: 'Sure!\nI accept your challenge!' },
  '34F4': { es: 'Gracias. No sé qué decir...\n\nPero una batalla es una batalla...\nasí que voy a dar todo de mí.', en: "Thanks. I don't know what to say...\n\nBut a battle is a battle...\nso I'll give it everything I've got." },
  '36BC': grr,
  '3714': { who: 'me', ...toArena },
  '37AC': { es: `Si me vences aquí,\nte daré el pase ahora mismo.\n\n${ventiscaFair.es}`, en: `Beat me here and I'll give\nyou the pass right away.\n\n${ventiscaFair.en}` },
  '391C': {
    es: '¿Usas bien los efectos de soporte?\n\nComo las cartas de Apoyo, los efectos\nde soporte de las criaturas\ntienen poderes muy variados.\n\nSi armas tu mazo pensando en ellos,\nvas a pelear mucho mejor.\n\nY una cosa más...\n\nLas cartas de Evolución se usan en la\nfase de Evolución, después de cargar PE.\n\nAhí te preguntan\nsi quieres usarlas.\n\nSi una carta no va a tener efecto,\nte avisan antes. No te preocupes.\n\nPero a veces conviene usarla igual,\npara deshacerte de cartas.\n\n¡Pruébalo y verás!',
    en: "Are you using support effects well?\n\nLike Support cards, the support effects\non creature cards have all kinds\nof powers.\n\nIf you build your deck with them in mind,\nyou'll fight much better.\n\nAnd one more thing...\n\nYou play Evolution cards in the Evolution\nphase, after you load EP.\n\nYou'll be asked whether\nyou want to use them.\n\nIf a card would have no effect,\nyou're told beforehand. Don't worry.\n\nStill, sometimes it pays to play it\njust to get rid of cards.\n\nTry it and see!",
  },
  '3D10': { es: '¡Ahora sí, la batalla de verdad!\n¿Empezamos?', en: 'Now for the real battle!\nShall we begin?' },
  '3DAC': ventisca.no,
  '3E2C': { es: '¡Vamos allá!', en: 'Here we go!' },
  '3EC4': {
    es: 'Tienes mucha fuerza, de verdad.\n\nEso es poder del bueno.\n¡Tenemos que repetirlo!\n\nVoy a entrenar duro para\nalcanzar mi siguiente forma.',
    en: "You really are strong.\n\nThat's the real thing.\nWe have to do this again!\n\nI'll train hard to reach\nmy next shape.",
  },
  '3FE0': { es: 'Toma. Te lo ganaste.', en: 'Here. You earned this.' },
  '4024': { who: null, es: 'Recibiste el *c5pase a Chatarral*c7.', en: 'You got the *c5pass to Scrapyard*c7.' },
  '4064': { es: 'Vuelve a la Arena cuando quieras.\n¡Te estaré esperando!', en: "Come back to the Arena anytime.\nI'll be waiting for you!" },
  '42DC': {
    es: '¿Ves? Así peleo de verdad.\n¡Te dije que no sería fácil!\n\nVuelve si quieres la revancha.\nTe estaré esperando.\n\n¡Cuídate! ¡Adiós!',
    en: "See? This is how I really fight.\nI told you I'd be tough!\n\nCome back if you want a rematch.\nI'll be waiting.\n\nTake care! Bye!",
  },
  '442C': DECKS03.ventisca,

  // Iker, a polite traveller: every arena is in danger
  '44F8': { es: 'Hola. Me llamo Iker.\n¿Cómo estás?', en: 'Hello. My name is Iker.\nHow are you?' },
  '4570': {
    who: 'me',
    es: '¡Hola, soy *h0!\n\nQuiero saber qué pasa con las Arenas.\nCuéntame todo lo que sepas.',
    en: "Hi, I'm *h0!\n\nI want to know what's going on with\nthe Arenas. Tell me anything you know.",
  },
  '463C': { es: 'Bueno, no es solo este pueblo.\nTodas las Arenas de las Tierras Quietas\nestán en peligro.', en: "Well, it isn't just this town.\nEvery Arena in the Quiet Lands\nis in danger." },
  '46D8': { who: 'me', es: '¿¡...!?', en: '...!?' },
  '4720': {
    es: 'No sé bien qué está pasando,\npero por lo que sé...\n\n...detrás de todo está un jugador\nde cartas que se hace llamar\nel Coleccionista.',
    en: "I'm not sure what's happening,\nbut as far as I know...\n\n...a card player who calls himself\nthe Collector is behind all this.",
  },
  '481C': { who: 'me', es: '¿El Coleccionista?\n\n¿Es el viajero del que me habló Escamo?\n¿Qué es lo que quiere?', en: 'The Collector!?\n\nIs he the traveller Escamo mentioned?\nWhat is he after?' },
  '48E4': {
    es: 'Por lo que hace, creo que quiere\nquedarse con las Tierras Quietas...\n\n...con todas sus Arenas\ny todas sus cartas.',
    en: 'Judging by what he does, I think he\nwants the Quiet Lands for himself...\n\n...every Arena\nand every card.',
  },
  '497C': { who: 'me', es: '¿Quedarse con todo?\n¡Qué horror!', en: "Take over everything?\nThat's awful!" },
  '49E4': {
    es: 'Dicen que nuestra Arena\nya cayó en sus manos.\n\nTen cuidado.\n\nPor cierto, ¿vendrías a verme\ncuando ganes en la Arena?\n\nHay algo que quiero darte...\nNo lo olvides, por favor.\n\nAdiós, y buena suerte.',
    en: "I heard our Arena has already\nfallen into his hands.\n\nPlease be careful.\n\nBy the way, would you come see me\nafter you win at the Arena?\n\nThere's something I want to give you...\nPlease don't forget.\n\nGoodbye, and good luck.",
  },
  '4E4C': { es: '¡Juegas de maravilla!\nDe verdad me impresionaste.', en: "Your battle skills are amazing!\nI'm truly impressed." },
  '4ECC': { who: 'me', es: 'Bueno, tampoco es para tanto...', en: "Well, I'm not that good..." },
  '4F2C': { es: 'Si quieres, usa esto.\nEs una carta de compañero nueva.\n\nSolo puedo darte una.\nElige la que prefieras.', en: "Please use this if you like.\nIt's a new partner card.\n\nI can only give you one.\nPlease choose." },
  '5054': { who: null, es: 'Recibiste la carta de *c6Bollo*c7.', en: 'You got the *c6Bollo*c7 card!' },
  '509C': { who: null, es: 'Recibiste la carta de *c6Zarpa*c7.', en: 'You got the *c6Zarpa*c7 card!' },
  '50FC': { es: 'Recuerda: tienes que ponerla en tu mazo\nantes de poder usarla.\n\nCon ella, tu mazo será más fuerte.', en: 'Remember, you have to put it in your\ndeck before you can use it.\n\nIt will make your deck stronger.' },
  '51E4': { who: 'me', es: '¡Muchas gracias!\n¡Me va a ayudar mucho!', en: 'Thanks a lot!\nThis will really help!' },
  '5250': { es: 'Bueno, hasta pronto. Adiós.', en: 'Well, see you soon. Goodbye.' },
  '52E0': { es: 'El Coleccionista...\nSeguro que trama algo malo.\n\nTen cuidado.', en: 'The Collector...\nHe must be up to something bad.\n\nPlease be careful.' },
  '53C4': { es: 'Espero que algún día\njuguemos una partida.', en: 'I hope we get to play\na match someday.' },
  '5458': { es: 'Si tienes tiempo,\n¿aceptarías un desafío mío?', en: 'If you have time, would you\naccept a challenge from me?' },
  '54F0': { who: 'me', es: '¿Una partida? Claro, acepto.', en: 'A match? Sure, I accept.' },
  '5550': { es: 'Gracias.\nPrometo que no tardaremos mucho.', en: "Thank you.\nI promise it won't take long." },
  '55E4': { es: '¿De verdad aceptas mi desafío?', en: 'Do you really accept my challenge?' },
  '5680': { es: 'Ya veo... Qué lástima.', en: "I see... That's too bad." },
  '573C': { es: 'Bien. Entonces empecemos.\nNo quiero quitarte mucho tiempo.', en: "OK. Then let's begin.\nI don't want to take up your time." },
  '57BC': { es: 'Disculpa. Quiero pedirte un favor...', en: 'Excuse me. I have a favor to ask...' },
  '5814': { es: 'Armé un mazo pensando en Gema.\n\nSe llama *c3Mazo Barreno*c7...', en: "I built a deck with Gema in mind.\n\nIt's called the *c3Barreno Deck*c7..." },
  '586C': { es: 'No tienes por qué hacerlo, pero...\n\n¿Podrías jugar con este mazo?\n¿Lo harías por mí?', en: "You don't have to do this, but...\n\nCould you play with this deck?\nWould you do that for me?" },
  '593C': { es: 'Tengo otro favor que pedirte...\n¿Me escuchas?', en: 'I have another favor to ask...\nWill you hear me out?' },
  '59B0': { es: 'Esta vez armé otro mazo,\nel *c3Mazo Calado*c7...', en: 'This time I built another deck,\nthe *c3Calado Deck*c7...' },
  '5A2C': { es: '¿Podrías jugar con este mazo?\n¿Lo harías por mí?', en: 'Could you play with this deck?\nWould you do that for me?' },
  '5B30': {
    es: 'Ganaste. Juegas muy bien.\n\nTodavía me falta mucho.\nTengo que entrenar mucho más...\n\nSi no te molesta,\nme gustaría jugar contigo otra vez.',
    en: "You win. You're really good.\n\nI still have a lot to learn.\nI must train much, much harder...\n\nIf you don't mind,\nI'd like to play you again.",
  },
  '5E84': {
    es: 'Solo tuve suerte.\nSé que todavía no soy tan fuerte.\n\nPero aprendí mucho. Gracias.\n\nSi no te molesta,\nme gustaría desafiarte otra vez.',
    en: "I just got lucky.\nI know I'm not that strong yet.\n\nBut I learned a lot. Thank you.\n\nIf you don't mind,\nI'd like to challenge you again.",
  },
  '5FD4': ikerDeck,

  // Gema, a cocky armadillo who runs the Extra Arena
  '608C': { es: '¡Ey! Me llamo Gema.', en: "Yo! The name's Gema." },
  '60F8': { who: 'me', es: '¡Hola, soy *h0!', en: "Hi, I'm *h0!" },
  '6148': gemaArena,
  '61EC': { who: 'me', es: '¡Claro que entro!', en: "Of course I'm in!" },
  '6244': { es: '¿Y esa seguridad?\n¡Ey, que yo no pienso perder!', en: "Whoa, so confident!\nYo, I'm not gonna lose." },
  '62E8': { who: null, es: '*c6¡La Arena Extra está abierta!\n*c6¡Que pasen los valientes!', en: '*c6The Extra Arena is now open!\n*c6Those who are ready, come on in!' },
  '6540': gemaArena,
  '65F0': { es: '¡Ey! ¿Qué tal?\n\nTodavía hay muchos jugadores de cartas\nmuy fuertes en este mundo.', en: "Yo! What's up?\n\nThere are still lots of really\nstrong card players in this world!" },
  '66B8': { who: 'me', es: 'Lo sé.\nSiempre aprendo algo de ellos.', en: 'I know.\nI learn from them all the time.' },
  '6728': {
    es: '¡Ey! Te doy un consejo sobre\nfusionar cartas, ¿me sigues?\n\nRoja con Sombría, Rara con Apoyo\no Azul con Verde dan una carta Rara.\n\n¡Ey! Así que a fabricar\nmuchas cartas Raras.',
    en: 'Yo! Here is a tip on fusing cards,\nyou feel me?\n\nRed + Shadow, Rare + Support, or\nBlue + Green makes a Rare card!\n\nYo! So go make yourself\nlots of Rare cards.',
  },
  '68B8': { es: '¡Ey! ¿Una partida conmigo?', en: 'Yo! Play a match with me?' },
  '694C': { es: '¿Qué? ¿Crees que hablo mucho\ny no juego nada?', en: "What?! You think I'm all\ntalk and no game?" },
  '69CC': { es: '¡Así me gusta! ¡Vas a caer!', en: "That's more like it! You're going down!" },
  '6A74': { es: '¡Rayos! ¡Perdí!\n¡Ey, qué fuerza tienes!\n\n¡No puedo seguir perdiendo así!\n¡Exijo la revancha!', en: "Rats! I lost!\nYo, you're really strong!\n\nI can't keep losing like this!\nI want a rematch!" },
  '6B80': { es: '¡Ey, ey! ¡Gané! ¡Ey!\nEs que soy demasiado bueno.\n\n¡Apuesto a que te gano otra vez!', en: "Yo yo! I won! Yo!\nI'm just too good.\n\nBet I can beat you again!" },
  '6C5C': DECKS03.gema,

  // Coraza: Gema, one shape higher
  '6DFC': { es: '¡Ey! Soy Coraza.\n¡Mi cabeza dura rompe lo que sea!\nTen mucho cuidado. ¡Ey!', en: "Yo! I'm Coraza.\nMy hard head can smash anything!\nYou'd better watch out. Yo!" },
  '6EA0': coraza.ask,
  '6F30': coraza.no,
  '6FBC': { es: '¡Ey! ¡A darle!', en: "Yo! Let's do this!" },
  '704C': {
    es: '¡Rayos! ¡Perdí otra vez!\n¡Qué fuerza tienes, en serio!\n\n¡Tengo que entrenar más!\n¡Ey! Hora del entrenamiento especial.\n\nPero no me rindo tan fácil. ¡Ey!\n¡Vamos, muéstrame qué tienes!',
    en: "Rats! Lost again!\nYou're seriously strong!\n\nI gotta train harder!\nYo! Time for special training.\n\nBut I don't give up that easy. Yo!\nCome on, show me what you've got!",
  },
  '71D0': {
    es: '¡Ey, ey! ¡Gané! ¡Ey!\n¿Qué pasó? ¡Te falta fuerza!\n\nMi cabezazo de roca es invencible.\n¡Ey! ¡Soy el mejor!\n\nVuelve cuando tengas mucha más fuerza.\n\n¡Ey! Nos vemos.',
    en: "Yo yo! I won! Yo!\nWhat happened? You're so weak!\n\nMy rock-hard headbutt is unbeatable.\nYo! I'm the greatest!\n\nGet a lot stronger before\nyou show your face here again.\n\nYo! See you around.",
  },
  '739C': DECKS03.coraza,

  // Barreno: Gema's shape with the egg of Knowledge
  '7564': {
    es: '¡Huevo del Saber, a mí!\n¡Ey! Soy Barreno.\n\n¡Voy a perforar tu mazo!\nNo tienes escapatoria.',
    en: "Egg of Knowledge, power up!\nYo! I'm Barreno.\n\nI'm gonna drill right through your deck!\nThere's no escape.",
  },
  '7654': { es: '¡Ey! ¿Empezamos?', en: 'Yo! Shall we start?' },
  '76DC': { es: '¡No quiero excusas!\n¡Ey! ¡Apúrate!', en: "I don't wanna hear excuses!\nYo! Hurry up!" },
  '7768': barreno.go,
  '780C': {
    es: '¡Rayos! ¡Perdí otra vez! ¡Ey!\nNo soy rival para ti.\n\n¡Me rindo! ¡Me rindo!\n¡Perdón! ¡Ey! ¡En serio!\n\nPero quiero jugar contigo otra vez. ¡Ey!',
    en: "Rats! I lost again! Yo!\nI'm no match for you.\n\nI give up! I give up!\nSorry! Yo! Really!\n\nBut I wanna play you again. Yo!",
  },
  '7A70': {
    es: '¡Ey, ey! ¡Gané! ¡Ey!\n¿Qué tal? ¡Ey! ¡Soy el mejor!\n\n¿Ves? No eres rival para mí\nni para mi forma Armadura.\n\nDesafíame cuando quieras.\n¡Ey! ¡Nos vemos!',
    en: "Yo yo! I won! Yo!\nHow 'bout that? Yo! I'm the best!\n\nSee? You're no match for me\nand my Armored shape!\n\nChallenge me anytime!\nYo! See you later!",
  },
  '7BC4': DECKS03.barreno,

  // Calado: Gema's shape with the egg of Reliability
  '7D64': { es: 'Soy Calado.\nBajo el agua no hay quien me gane.\n\nEsta vez no será tan fácil como antes.\nTen cuidado.', en: "I'm Calado.\nUnderwater, nobody beats me.\n\nIt won't be as easy as before.\nYou'd better watch out." },
  '7E48': calado.ask,
  '7EE0': calado.no,
  '7F64': { es: '¡Mira! ¡Este es mi verdadero poder!', en: 'Watch! This is my true power!' },
  '800C': {
    es: '¡Uy! ¡Perdí otra vez!\n\nSi yo no puedo ganarte,\nnadie puede.\n\n¡Me rindo! ¡Ey! ¡En serio!\n¡Perdón! ¡Ey! ¡En serio!\n\nPero quiero jugar contigo otra vez.',
    en: "Whoa! I lost again!\n\nIf I can't beat you,\nnobody can.\n\nI give up! Yo! Really!\nSorry! Yo! Really!\n\nBut I wanna play you again.",
  },
  '82B8': calado.won,
  '841C': DECKS03.calado,

  // Ánfora: Gema as an Apex
  '85B0': {
    es: 'Ahora soy Ánfora: ¡llegué a Perfecto!\n¡Ya no tienes ninguna oportunidad! ¡Ey!\n\nYa no tengo puntos débiles. ¡Ey!\nAhora verás mi verdadero poder.',
    en: "Now I'm Ánfora: I made it to Apex!\nYou don't stand a chance! Yo!\n\nI've got no weak spots left. Yo!\nNow I'll show you my true power!",
  },
  '86D8': anfora.ask,
  '8778': anfora.no,
  '87F4': anfora.go,
  '88D0': {
    es: '¡No puede ser! ¡Perdí otra vez!\n¡Ya no me pegues más! ¡Ey!\n\nSi yo no puedo ganarte,\nnadie puede.\n\n¡Ey! La próxima alcanzaré mi forma\nmás alta, ¡y te aplastaré!',
    en: "No way! I lost again!\nDon't hit me anymore! Yo!\n\nIf I can't beat you,\nnobody can.\n\nYo! Next time I'll reach my highest\nshape and crush you!",
  },
  '8B68': anfora.won,
  '8CE0': DECKS03.anfora,

  // Fiordo: Gema's highest shape
  '8EA4': {
    es: 'Te hiciste muy fuerte.\n\nPor cierto, ¿estás juntando\nmuchas cartas?\n\nDicen que...\n\n...hay más de 30 cartas que no vienen\nen ningún sobre que puedas conseguir.\n\n¡Conseguirlas cuesta mucho esfuerzo!',
    en: "You've gotten really strong.\n\nBy the way, have you been collecting\nlots of cards?\n\nI've heard that...\n\n...there are over 30 cards that don't\ncome in any pack you can get.\n\nYou'll have to work hard for them!",
  },
  '907C': fiordo.ask,
  '9114': fiordo.no,
  '91A8': fiordo.go,
  '9248': {
    es: '¡Basta, basta! ¡Ganaste, ganaste!\nMe rindo. Haz lo que quieras.\n\nDemostraste que tienes mucha fuerza.\nMe rindo... ¡Ey!\n\nTendré que entrenar mucho más\npara jugar tan bien como tú.',
    en: "OK, OK! You win, you win!\nI give up. Do whatever you want.\n\nYou proved you're really strong.\nI give up... Yo!\n\nI'll have to train much harder\nto play as well as you.",
  },
  '94F8': fiordo.won,
  '96A0': DECKS03.fiordo,

  // Acero: Mateo's partner, who was Aullido at the Archivist's Tower
  '9774': {
    es: 'Soy Acero.\n¡Antes era Aullido, y evolucioné!\n\nLa batalla en la Torre del Archivero\nfue genial. Quiero otra igual.\n\nVas a ver cuánto mejoré.\nAhora te costará mucho más vencerme.\n\nAunque todavía no estoy a la altura\nde Mateo. Por ahora...\n\nSi me vences, juega contra Mateo.\n¡Vas a aprender mucho!',
    en: "I'm Acero.\nI used to be Aullido, and I evolved!\n\nOur battle at the Archivist's Tower\nwas great. I want another one like it.\n\nYou'll see how much I've improved.\nIt'll take a lot more to beat me now.\n\nBut I'm still no match for Mateo.\nNot yet, anyway...\n\nIf you can beat me, try playing Mateo.\nYou'll learn a lot!",
  },
  '9AC8': { es: 'Mateo y yo somos uña y mugre...\n¡digo, uña y carne!\n\nNadie puede separarnos.', en: 'Mateo and I are like two peas\nin a pot... uh, a pod!\n\nNobody can split us up.' },
  '9BA0': acero.ask,
  '9C30': { es: '¡Ay, vamos!', en: 'Oh, come on!' },
  '9C98': { es: '¡Sí! ¡Vamos con todo!', en: "Yeah! Let's go all out!" },
  '9D3C': {
    es: 'Perdí. Eres más fuerte\nde lo que creía.\n\nCon ese poder y esa habilidad,\npodrías darle pelea a Mateo.\n\n¡Me encantaría verte desafiarlo!\nSería una gran batalla.',
    en: "I lost. You're stronger\nthan I thought.\n\nWith that power and skill,\nyou might give Mateo a real fight!\n\nI'd love to see you challenge him.\nIt would be a great battle!",
  },
  A0F8: {
    es: '¡Gané!\nSabía que no eras rival para mí.\n\nCon ese nivel nunca vencerás a Mateo.\n¡Primero tienes que vencerme a mí!\n\nEsperaré la revancha.',
    en: "I won!\nI knew you were no match for me.\n\nYou'll never beat Mateo like that.\nYou have to beat me first!\n\nI'll be waiting for a rematch.",
  },
  A25C: DECKS03.acero,

  // Mateo, a traveller who hates to lose
  A34C: { es: 'Hola, me llamo Mateo.', en: 'Hey, my name is Mateo.' },
  A3A8: { who: 'me', es: 'Hola, soy *h0.', en: "Hi, I'm *h0." },
  A3F8: { es: 'Acero me habló de ti.\nDice que juegas muy bien a las cartas.', en: "Acero told me about you.\nHe says you're quite the card player." },
  A49C: { who: 'me', es: 'Bueno, me defiendo...', en: 'Well, I get by...' },
  A4F8: { es: 'Vamos, no te hagas de menos.\n¿Jugamos una partida ahora mismo?', en: "Come on, don't sell yourself short.\nHow about a match right now?" },
  A6A4: { es: '¡Cuando quieras jugamos!\nSeguro que será divertido.', en: "Let's play whenever you like!\nI'm sure it'll be fun." },
  A710: { es: '¿Y? ¿Ya te decidiste?', en: 'So? Have you made up your mind?' },
  A7A8: { es: '¿Qué? ¿No estoy a tu altura?', en: "What? I'm not good enough for you?" },
  A820: { es: '¡Muy bien! ¡A jugar!', en: "All right! Let's do this!" },
  A8BC: {
    es: '¡Vaya! ¡Juegas muy bien!\nHacía mucho que no perdía.\n\nJuguemos otra vez.\nNo soporto perder así.\n\n¡La próxima te gano!',
    en: "Wow! You're really good!\nIt's been a while since I lost.\n\nLet's play again.\nI can't stand losing like this.\n\nI'll get you next time!",
  },
  ABBC: { es: '¿Esto es todo?\n¿Cómo le ganaste a Acero?\n\nBueno, no te desanimes.\nTe enfrento cuando quieras.', en: "Is that all?\nHow did you ever beat Acero?\n\nWell, don't feel bad.\nI'll take you on anytime." },
  ACBC: mateoDeck,

  // Acero Negro, who speaks through battle
  AD78: { es: 'Te doy la bienvenida, *h0.', en: 'Welcome, *h0.' },
  ADD8: { who: 'me', es: '¿Cómo sabes mi nombre?', en: 'How do you know my name?' },
  AE34: { es: 'Oí hablar mucho de ti.\nDicen que eres de temer.\n\nTe espero en la Arena.', en: "I've heard a lot about you.\nThey say you're one to watch.\n\nI'll be waiting at the Arena." },
  AF24: { who: 'me', es: '¡Oye! Espera...', en: 'Hey! Wait...' },
  B154: { es: 'Te espero en la Arena.', en: "I'll be waiting at the Arena." },
  B1D8: { es: 'Lo más importante es entenderse\na través de la batalla.\n\nEsa es mi respuesta.', en: 'What matters most is understanding\neach other through battle.\n\nThat is my answer.' },
  B2D0: aceroNegro.ask,
  B37C: aceroNegro.no,
  B3FC: aceroNegro.go,
  B4A0: {
    es: 'Ya veo... Ese es tu camino.\nAhora lo sé.\n\nLo más importante es entenderse\na través de la batalla.\n\nNo lo olvides.\n\nQuien solo piensa en ganar\nsolo encuentra la derrota.\n\nNos volveremos a ver.',
    en: "I see... So that is your way.\nNow I know.\n\nWhat matters most is understanding\neach other through battle.\n\nDon't forget it.\n\nThose who think only of winning\nfind only defeat.\n\nWe shall meet again.",
  },
  B878: aceroNegro.won,
  BAD4: DECKS03.aceroNegro,
  BBEC: aguijonDeck,

  // someone who hides their name, and knows Ventisca
  BC90: { es: 'Ah, eres tú. Seguro que\nvenciste a Escamo.\n\nYa debe haber vuelto a ser el de antes.', en: 'Oh, it is you. You must have\nbeaten Escamo.\n\nHe must be back to his old self now.' },
  BD5C: { who: 'me', es: 'Sí, es una criatura muy amable.\nTambién me dio el pase.', en: "Yes, he's a really kind creature.\nHe gave me the pass, too." },
  BDE8: { es: 'Me alegro. Pareces saber\nmucho de cartas.\n\nTal vez tú puedas salvar a Ventisca.', en: 'Good for you. You seem to know\nyour cards well.\n\nMaybe you can save Ventisca.' },
  BEB8: { who: 'me', es: '¿Qué quieres decir?\n¿Y quién eres, de todos modos?', en: 'What do you mean?\nAnd who are you, anyway?' },
  BF34: {
    es: 'No te preocupes por mí. Lo que\nnecesitas ahora es más experiencia.\n\nTienes que hacerte mucho más fuerte\ny juntar más cartas.\n\n¡Tienes que armar un mazo invencible!',
    en: "Don't worry about me. What you need\nright now is more experience.\n\nYou must grow much stronger\nand collect more cards.\n\nYou must build an unbeatable deck!",
  },
  C080: { who: 'me', es: 'Sí, ojalá algún día lo logre.\nPero ¿quién eres?', en: 'Yeah, I hope to someday.\nBut who are you?' },
  C100: { es: 'Tienes futuro con las cartas.\nPor favor, salva a Ventisca.\nEs una buena criatura.', en: "You have a future with cards.\nPlease save Ventisca.\nHe's a good creature." },
  C19C: { who: 'me', es: '¿Qué? ¡Oye!', en: 'What? Hey!' },
  C358: mystery,
  C440: thornDeck,

  // the first tournament: Témpano, Muelle, Ventisca under the spell, and Aguijón
  C738: { es: 'Hola. Me llamo Témpano.\n\nMi mazo está lleno de comida rica.\nSi gano, ¡tú invitas el almuerzo!', en: "Hi. My name is Témpano.\n\nMy deck is full of tasty food.\nIf I win, you're buying lunch!" },
  C8C0: { es: '¿Jugamos? ¡Ya tengo hambre!', en: "Shall we play? I'm already hungry!" },
  C948: tempano.no,
  C9AC: tempano.go,
  CA40: { es: '¡Nooo! ¡Perdí!\n¡Qué difícil es ganarte!\n\n¡No es justo!\n¡Tengo hambre!', en: "Nooo! I lost!\nYou're one tough cookie!\n\nThis isn't fair!\nI'm hungry!" },
  CB30: tempanoWonLunch,
  CC64: DECKS03.tempano,
  CDB4: {
    es: 'Soy Muelle,\ntu segundo rival.\n\nMe gusta este lugar.\nAquí se está muy a gusto.\n\nNo es nada personal,\npero no puedo dejarte ganar.\n\nPrepárate, aprendiz.',
    en: "I'm Muelle,\nyour second opponent.\n\nI like this place.\nIt's really comfortable.\n\nNothing personal,\nbut I can't let you win.\n\nBrace yourself, apprentice.",
  },
  CFD4: muelle.ask,
  D060: muelle.no,
  D0D0: { es: 'Bien, empecemos.', en: "Good, let's begin." },
  D16C: muelle.lost,
  D330: {
    es: 'Perdona, me dejé llevar.\nNo quería ser tan duro.\n\nJuegas bien. Espero que algún día\nllegues lejos con las cartas.\n\nMás adelante te espera gente\nmucho más fuerte.\n\nSi no puedes vencerme,\nno puedes seguir adelante.\n\nTienes mucho potencial.\nYa casi me superas.\n\nEsperaré tu próximo desafío.',
    en: "Forgive me, I got carried away.\nI didn't mean to be so harsh.\n\nYou play well. I hope someday\nyou go far with your cards.\n\nMuch stronger rivals\nare waiting up ahead.\n\nIf you can't beat me,\nyou can't go any further.\n\nYou have great potential.\nYou've nearly surpassed me.\n\nI'll be waiting for your next challenge.",
  },
  D5CC: DECKS03.muelle,
  D6E8: grr,
  D740: { who: 'me', es: '¡Aguanta!\n¡Te voy a liberar!', en: "Hang in there!\nI'll set you free!" },
  D860: { es: 'Grrrrrr...\n¿Te... atreves...? Grrr...', en: 'Grrrrrr...\nDo you... dare...? Grrr...' },
  D8E8: grr,
  D948: { es: '¡Grrrrraaah...!', en: 'Grrrrraaah...!' },
  D9E0: { es: '¡Échalo de esta Arena!\n\n¡No... su hechizo sigue aquí!', en: 'Drive him out of this Arena!\n\nNo... his spell is still here!' },
  DA88: { who: 'me', es: '¡Tranquilo!\n¡Todo va a salir bien!', en: "Easy, it's OK!\nYou're going to be OK!" },
  DB14: { es: 'Grrrr... aaahhh...', en: 'Grrrr... aaahhh...' },
  DB70: { who: 'me', es: '¡Rayos!\n¡Tengo que hacerlo mejor!\n\nTengo que desafiarlo otra vez.', en: 'Darn!\nI have to do better!\n\nI need to challenge him again.' },
  DC2C: DECKS03.ventisca,
  DD74: {
    es: 'Soy Aguijón,\nel maestro de esta Arena.\n\nMe venciste cuando era Hebra,\npero esta vez no tendrás suerte.\n\nVerás el poder de mi nueva forma.\n¡A ver qué tienes de verdad!',
    en: "I'm Aguijón,\nthe master of this Arena.\n\nYou beat me when I was Hebra,\nbut this time your luck runs out.\n\nBehold the power of my new shape.\nLet's see what you're really made of!",
  },
  DFB4: { es: '¿Vas a pelear o no?', en: 'Are you going to fight or not?' },
  E048: { es: '¡Bah! Deja de hacerme perder el tiempo.', en: 'Hmph! Stop wasting my time.' },
  E0BC: { es: '¡Esta vez gano yo!', en: 'This time, I win!' },
  E15C: {
    es: '¡Rayos! Perdóname, Coleccionista...\nPerdí otra vez...\n\nPero no me rendiré.\nEncontraré la manera.\n\n¡Oye, tú! Te veré en el próximo pueblo.\n¡Alcanzaré otra forma y te venceré!',
    en: "Darn! Forgive me, Collector...\nI lost again...\n\nBut I won't give up.\nI'll find a way.\n\nHey, you! See you in the next town.\nI'll reach a new shape and beat you!",
  },
  E2C0: { who: 'me', es: '¿Qué están tramando?\n¿Qué piensan hacer?', en: 'What are you up to?\nWhat are you planning to do?' },
  E344: {
    es: '¡Silencio! Nunca entenderás\nlo que piensa el Coleccionista.\n\nTe espero en el próximo pueblo.\n\n¡Hasta la próxima!',
    en: "Silence! You'll never understand\nwhat the Collector has in mind.\n\nI'll be waiting in the next town.\n\nSo long!",
  },
  E450: {
    who: 'me',
    es: '¿Y eso qué fue...?\n\nUf, otra vez me quedé sin pase.\n\n¡Qué mala suerte! Bueno, por ahora\nvoy al Café de batallas.',
    en: "What was that all about...?\n\nUgh, no pass again.\n\nSuch bad luck! Well, I guess\nI'll head to the Battle Cafe for now.",
  },
  E578: {
    es: '¡Coleccionista, gané! ¡Gané!\n\n¿Ves? Nunca me vas a vencer,\npor más que lo intentes.\n\nQue te sirva de lección:\nvuelve por donde viniste.\n\n¡Ja, ja, ja, ja, ja!',
    en: "Collector, I won! I won!\n\nSee? You'll never beat me,\nno matter how many times you try.\n\nLet this be a lesson to you:\ngo back where you came from!\n\nHa ha ha ha ha!",
  },
  E710: aguijonDeck,
};

export const CITY03: CityTexts = { ...HARBOR, ...CITY03_LATER };
