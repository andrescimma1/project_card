/**
 * Torre del Archivero, later phases: Yunque thanks the player once the Torre sin Fin is cleared and sets up
 * a new Arena with old friends (Azucena, Astado, Martillo, Plumaria, Acero and Fragua); Centinela, the shape
 * Fragua and Acero reached together, waits at the café and closes a last Arena of his own.
 */
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });
const note = (es: string, en: string): Written => ({ who: null, es, en });

const azucenaDeck = deck('*c3Mazo Hadas del Prado\nTodo Verde y sin cartas de Apoyo.\nJunta PE muy rápido.', '*c3Meadow Sprites Deck\nAll Green, with no Support cards.\nIt collects EP very quickly.');
const astadoDeck = deck('*c3Mazo Trampas Ocultas\nUn mazo Verde que encadena\ncontraataques.', '*c3Hidden Snares Deck\nA Green deck that chains\ncounterattacks.');
const martilloDeck = deck('*c3Mazo Arsenal\nUn mazo muy eficaz,\ncargado de armas.', '*c3Arsenal Deck\nA very effective deck\nloaded with weapons.');
const plumariaDeck = deck('*c3Mazo Alba Dorada\nUn mazo Rojo equilibrado\nque recupera HP.', '*c3Golden Dawn Deck\nA well-balanced Red deck\nthat recovers HP.');
const aceroDeck = deck('*c3Mazo Escarcha Certera\nUn mazo Azul de ataque, con\nmuchos HP y bien equilibrado.', '*c3True Frost Deck\nA Blue attack deck with\nplenty of HP, well-balanced.');
const fraguaDeck = deck('*c3Mazo Corazón de Brasa\nUn mazo Rojo perfectamente equilibrado.\nNo tiene puntos débiles.', '*c3Ember Heart Deck\nA perfectly balanced Red deck.\nIt has no weak links.');
const centinelaDeck = deck('*c3Mazo Dos Guardias\nUn mazo Rojo y Azul con\nCentinela como estrella.', '*c3Twin Guard Deck\nA Red and Blue deck\nstarring Centinela.');

const azucenaNo = { es: '¿Por qué? ¿Por qué?\n¡Nadie quiere jugar conmigo!', en: 'Why? Why?\nNobody wants to play with me!' };
const azucenaGo = { es: '¡Esta vez no me ganas!', en: "You won't beat me this time!" };

export const CITY10_LATER: CityTexts = {
  // Yunque, once the Torre sin Fin is cleared
  '63F8': {
    es: 'Gracias. La niebla gris se disipó,\ny las formas siguen en su lugar.\n\nSabía que lo lograrías.\nY no me equivoqué.\n\nPero tu verdadera batalla\nrecién empieza.\n\nTodavía te esperan muchos\noponentes poderosos.\n\nYo también te desafiaré algún día,\ncon mi siguiente forma.\n\nHasta ese día, adiós.',
    en: 'Thank you. The grey fog has lifted,\nand every shape is still in place.\n\nI knew you would do it.\nAnd I was right.\n\nBut your real battle\nhas just begun.\n\nMany powerful opponents\nare still waiting for you.\n\nI, too, will challenge you one day,\nin my next shape.\n\nUntil that day, farewell.',
  },
  '66D0': {
    es: 'Así que viniste.\n\nYa me venciste con la forma de Fragua.\nPero eso fue solo un paso más.\n\nCon unos viejos amigos armé\nuna Arena nueva. ¿Quieres entrar?\n\nEs una Arena provisional, pero\nte aseguro que es de calidad.\n\n¡Espero verte allí!',
    en: "So, you're here.\n\nYou beat me when I had Fragua's shape.\nBut that was only one more step.\n\nWith a few old friends, I set up\na new Arena. Will you enter?\n\nIt's only a temporary Arena, but\nI can vouch for its quality.\n\nI hope to see you there!",
  },
  '6F50': {
    es: 'Gracias... ¡Nos salvaste!\nSabía que podías hacerlo.\n\nNo me equivoqué.\n\nPero tu verdadera batalla\nrecién empieza.\n\nTodavía te esperan muchos\noponentes poderosos.',
    en: 'Thank you... You saved us!\nI knew you could do it!\n\nI was right all along.\n\nBut your true battle\nhas just begun.\n\nMany powerful opponents\nare still waiting to challenge you.',
  },
  '7134': {
    es: 'Con unos viejos amigos armé\nuna Arena nueva. ¿Quieres entrar?\n\nEs provisional, pero te aseguro\nque es muy entretenida.\n\n¡Espero verte allí!',
    en: "With a few old friends, I set up\na new Arena. Will you enter?\n\nIt's only temporary, but rest\nassured, it's quite entertaining.\n\nI hope to see you there!",
  },
  '72B0': { es: 'Mi viaje no tiene fin. Te desafiaré\notra vez cuando evolucione.\n\nEspero que aceptes mi desafío.', en: "My journey has no end. I'll challenge\nyou again when I evolve.\n\nI hope you'll accept my challenge." },
  '73B0': { es: 'Seguro que tu habilidad va a crecer\naún más. Por eso, toma este huevo.\n\nOjalá te ayude.', en: "I'm sure your skills will grow\neven more. So, take this egg.\n\nI hope it helps you." },
  '74C4': note('Recibiste el *c3huevo del Valor*c7 de Brinco.', "You got Brinco's *c3Egg of Courage*c7!"),
  '7554': note('Recibiste el *c3huevo del Amor*c7 de Trino.', "You got Trino's *c3Egg of Love*c7!"),
  '75E0': note('Recibiste el *c3huevo del Saber*c7 de Gema.', "You got Gema's *c3Egg of Knowledge*c7!"),
  '7684': note('Recibiste el *c3huevo de la Esperanza*c7\nde Bollo.', "You got Bollo's *c3Egg of Hope*c7!"),
  '7710': note('Recibiste el *c3huevo de la Luz*c7 de Zarpa.', "You got Zarpa's *c3Egg of Light*c7!"),
  '77A0': note('Recibiste el *c3huevo del Valor*c7 de Hebra.', "You got Hebra's *c3Egg of Courage*c7!"),
  '7818': { who: 'me', es: '¡Gracias! Me ayudaste mucho.', en: "Thanks! You've been a great help!" },
  '787C': { es: 'Ojalá saques más de tu fuerza\nescondida. ¡Suerte!', en: 'I hope you tap into more of\nyour hidden power. Good luck!' },

  // Centinela, at the café
  '8070': { es: 'Me llamo Centinela.\n¡Sé todo sobre ti!', en: 'My name is Centinela.\nI know everything about you!' },
  '80F4': { who: 'me', es: '¿Cómo? ¿Nos conocemos?', en: 'How? Have we met before?' },
  '8150': {
    es: 'Sí. Nos vimos muchas veces.\n¡Nuestras batallas fueron emocionantes!\n\nPero olvida el pasado.\nTe espero en la Arena.\n\nEso es todo por ahora.\n¡Ja, ja, ja!',
    en: "Yes. We have met many times.\nOur battles were so exciting!\n\nBut forget about the past.\nI'll be waiting at the Arena.\n\nThat's all I have to say for now.\nHa ha ha!",
  },
  '8484': { es: 'No hablemos del pasado.\nTe espero en la Arena.\n\nEso es todo por ahora.\n¡Ja, ja, ja!', en: "Let's not talk about the past.\nI'll be waiting at the Arena.\n\nThat's all I have to say for now.\nHa ha ha!" },
  '85A8': { es: 'Gracias a ti, conseguí\nmi nueva fuerza.\n\nToma este huevo\ncomo muestra de gratitud.', en: 'Thanks to you, I was able to\ngain my new power.\n\nPlease take this egg as\na token of my thanks.' },
  '86B0': note('Recibiste el *c3huevo de la Amistad*c7\nde Brinco.', "You got Brinco's *c3Egg of Friendship*c7!"),
  '8744': note('Recibiste el *c3huevo de la Sinceridad*c7\nde Trino.', "You got Trino's *c3Egg of Sincerity*c7!"),
  '87D8': note('Recibiste el *c3huevo de la Confianza*c7\nde Gema.', "You got Gema's *c3Egg of Reliability*c7!"),
  '8880': note('Recibiste el *c3huevo del Valor*c7 de Bollo.', "You got Bollo's *c3Egg of Courage*c7!"),
  '8910': note('Recibiste el *c3huevo de la Confianza*c7\nde Zarpa.', "You got Zarpa's *c3Egg of Reliability*c7!"),
  '89B0': note('Recibiste el *c3huevo de la Luz*c7 de Hebra.', "You got Hebra's *c3Egg of Light*c7!"),
  '8A14': { es: '¡Busquemos la batalla definitiva!', en: 'We must seek the ultimate battle!' },
  '8A88': {
    es: 'Nada me alegra más que probar\nmi nueva fuerza.\n\n¡Te voy a mostrar de qué soy capaz!\n\nPero antes, te cuento un secreto.\n\n¿Oíste hablar de la fusión mutante?\n\nPuede pasar al fusionar cartas,\ny crea una carta inesperada.\n\nEs muy rara: pasa más o menos\nen 1 de cada 100 fusiones.\n\nPero así se consiguen las cartas\nde las joyas, que son rarísimas.\n\nMe encantaría tener algunas\nun día de estos.',
    en: "Nothing makes me happier than\ntrying out my new power.\n\nI'll show you what I'm capable of!\n\nBut first, let me tell you a secret.\n\nHave you heard of a mutant fusion?\n\nIt can happen when you fuse cards,\nand it creates an unexpected card.\n\nIt's very rare: it happens in\nabout 1 of every 100 fusions.\n\nBut it's how you get the jewel cards,\nwhich are extremely rare.\n\nI would love to get my hands on\nsome of them one of these days.",
  },
  '8DF0': { es: '¿Sientes mi emoción?\n¿Jugamos?', en: 'Can you sense my excitement?\nShall we play?' },
  '8E84': { es: '¿Te echas atrás?', en: 'Are you backing out?' },
  '8EEC': { es: '¡Prepárate para la batalla\nde tu vida!', en: 'Prepare yourself for the battle\nof a lifetime!' },
  '8FAC': {
    es: 'Me ganaste, y fue muy satisfactorio.\nYa no me importa quién gane o pierda.\n\nLa calidad de la batalla\nes mucho más importante.\n\nSigamos con nuestro duelo\ny mejorando juntos.\n\nCuento contigo...',
    en: "You beat me, and it was satisfying.\nI no longer care who wins or loses.\n\nThe quality of the battle matters\nmuch more to me.\n\nLet's keep up our duel and\nkeep improving our skills.\n\nI'm counting on you...",
  },
  '928C': {
    es: 'Esta vez gané yo, y estoy satisfecho.\nPero ya no me importa quién gane.\n\nLo importante es la calidad\nde la batalla.\n\nSigamos puliendo\nnuestra habilidad.\n\n¡Te enfrento cuando quieras!',
    en: "I won this time, and I am satisfied.\nBut I no longer care who wins.\n\nWhat's important is\nthe quality of the battle.\n\nLet us keep sharpening\nour skills.\n\nI will take you on anytime!",
  },
  '9424': centinelaDeck,

  // Yunque's new Arena: Azucena
  'EF94': {
    es: '¡Qué gusto verte otra vez!\n\nHasta ahora siempre me ganaste,\n¡pero no pienso rendirme!\n\n¡Esta vez sí que gano!\n¿Aceptas mi desafío?\n\n¿Por favor?',
    en: "Good to see you again!\n\nYou've always beaten me so far,\nbut there's no way I'm giving up!\n\nI'm going to win for sure this time!\nWill you accept my challenge?\n\nPlease?",
  },
  'F1C4': { es: '¿Empezamos?', en: 'Shall we start?' },
  'F250': azucenaNo,
  'F2D8': azucenaGo,
  'F37C': {
    es: 'Ay... No sirve de nada,\npor más que lo intente...\n\n¡No, eso no es verdad!\n\nMejoré mucho gracias\na nuestras batallas.\n\nVoy a hacerme más fuerte.\n¡Y entonces te ganaré!\n\nSuerte en la próxima ronda.\nTodos tienen ganas de desafiarte.',
    en: "Sigh... I guess it's no use,\nno matter how many times I try...\n\nNo, that can't be true!\n\nMy skills have improved\nbecause of our battles.\n\nI'll get even stronger.\nAnd then I'll beat you!\n\nGood luck in the next round!\nEveryone's eager to challenge you.",
  },
  'F5BC': {
    es: '¡Mira! ¡Gané!\n¡Tengo que contárselo a Mina!\n\n¡Ay, perdón!\nQué desconsiderada soy...\n\n¡Pero estoy tan feliz!\n¡Por fin! ¡Qué maravilla!\n\nJuguemos otra vez. ¡Adiós!',
    en: "Wow! Look! I won!\nI have to tell Mina about this!\n\nOh! I'm sorry...\nThat was thoughtless of me.\n\nBut I'm so happy!\nAt last! This is wonderful.\n\nLet's do this again. Bye!",
  },
  'F758': azucenaDeck,

  // Astado
  'F8B0': {
    es: '¡Soy yo, Astado!\n¡Cuánto tiempo!\n\nFragua me trajo aquí.\nQuería desafiarte otra vez.\n\nMe contaron que también\nle ganaste a Isidro.\n\n¡Increíble!\n\nCreo que voy a tener que ir\ncon todo lo que tengo.',
    en: "It's me, Astado.\nLong time no see!\n\nFragua brought me here.\nI wanted to challenge you again.\n\nThey told me you beat\nIsidro, too.\n\nThat's incredible!\n\nI guess I'll have to come at you\nwith all I've got!",
  },
  'FB64': { es: '¡Vaya! ¿Quieres jugar conmigo?', en: 'Wow! You want to battle me?' },
  'FC00': { es: 'Ah. Qué lástima.', en: "Oh. That's too bad." },
  'FC70': { es: '¡Bueno, empecemos!', en: "Well, let's get started!" },
  'FD14': {
    es: 'Creo que no estoy a tu altura.\nOjalá fuera mejor.\n\nVaya, ahora entiendo cómo le ganaste\na Isidro. ¡Juegas muy bien!\n\nLa verdad, no me obsesiona ganar.\n\n¡Juguemos otra vez! ¡Adiós!',
    en: "I guess I'm no match for you.\nI wish I were better.\n\nWow, now I see how you beat Isidro.\nYou're one strong card player!\n\nTo tell you the truth, I'm not\nhung up on winning.\n\nLet's do this again!\nBye!",
  },
  'FEF8': {
    es: '¿Eh? ¿Qué pasó? ¡Gané!\n\n¡Increíble!\n\nAhora ya ves que merezco un poco\nde respeto por aquí, ¿eh?\n\nAunque, la verdad, no me\nobsesiona tanto ganar.\n\n¡Juguemos otra vez! ¡Adiós!',
    en: "Huh? What happened?\nI won!\n\nThis is incredible!\n\nSo now you see that I deserve\nsome respect around here, eh?\n\nWell, to tell you the truth, I'm not\nhung up on winning all that much.\n\nLet's do this again!\nBye!",
  },
  '1010C': astadoDeck,

  // Martillo
  '1023C': {
    es: '¡Eh! ¡Soy yo, Martillo!\nVine a desafiarte otra vez.\n\nLa última vez me ganaste,\n¡pero veamos quién gana ahora!\n\n¡A ver si puedes detenerme!',
    en: "Hey! It's me, Martillo!\nI'm here to challenge you again.\n\nYou beat me last time, but let's see\nwho comes out on top this time!\n\nTry and stop me!",
  },
  '10424': { es: '¿Jugamos?', en: 'Do you want to do this?' },
  '104B0': { es: '¿En serio? ¡Ay, no!', en: 'Really? Oh, man!' },
  '10514': { es: '¡Muy bien! ¡Empecemos!', en: "Alright! Let's get started!" },
  '105B4': {
    es: '¡Ay! ¡Me ganaste otra vez!\n¡Juegas demasiado bien!\n\nParece que nunca\nte puedo alcanzar.\n\n¡Pero no me voy a rendir!\n¡Algún día voy a ganar yo!\n\nProméteme que aceptarás mi desafío\notra vez, ¿sí? ¡Nos vemos!',
    en: "Oh! You beat me again!\nYou're just too good!\n\nIt seems like I can never\ncatch up to you.\n\nBut I'm not giving up!\nI'll come out on top someday!\n\nPromise you'll accept my challenge\nagain, OK? See you later!",
  },
  '10794': {
    es: '¡Vaya, gané!\n¿Ya sabemos quién es mejor?\n\n¡Es broma! No te rindas todavía.\nSé que vas a mejorar mucho.\n\n¡Yo todavía no me conformo!\nSiempre estoy listo para la revancha.\n\n¡Tengo todo el tiempo del mundo!',
    en: "Wow, I won!\nNow do we know who's better?\n\nJust kidding! Don't give up yet.\nI know you'll get much better!\n\nI'm not satisfied yet!\nI'm always ready for a rematch!\n\nI have all the time in the world!",
  },
  '10940': martilloDeck,

  // Plumaria
  '10A6C': {
    es: '¡Soy yo, Plumaria!\n¡Qué alegría verte otra vez!\n\nAsí que nadie pudo detenerte, ¿eh?\nPues yo no soy como los demás.\n\nNo te dejaré pasar de aquí.\n¡Lo digo en serio!',
    en: "It's me, Plumaria!\nI'm so glad to see you again!\n\nSo no one could stop you, huh?\nWell, I'm not like the others!\n\nI won't let you go any further.\nI mean it!",
  },
  '10CA0': { es: '¿Empezamos?', en: 'Shall we begin?' },
  '10D2C': { es: 'No me gustan las batallas\nsin corazón.', en: 'I dislike heartless battles.' },
  '10DA0': { es: '¡Demos lo mejor!', en: "Let's give it our best shot!" },
  '10E44': {
    es: 'Parece que no soy rival para ti.\nAdelante, puedes pasar.\n\nPero los dos últimos jugadores van\nen serio: quieren detenerte aquí.\n\nTe sugiero que te prepares\nantes de seguir...',
    en: "Looks like I'm not much\ncompetition for you. Go ahead.\n\nBut the last two card players are set\non stopping you in this Arena!\n\nI suggest you prepare yourself\nbefore moving on...",
  },
  '10FDC': {
    es: 'Te dije que no te dejaría pasar.\n\nVen a verme otra vez.\nMe encantan las revanchas.\n\nLo digo en serio...',
    en: "I told you I'd stop you from\ngoing any further.\n\nCome see me again.\nI'm all for rematches.\n\nI'm serious...",
  },
  '11118': plumariaDeck,

  // Acero
  '11240': {
    es: 'Hola. Soy yo... Acero.\nSupe que le ganaste a Mateo.\n\nIncreíble. Tu fuerza\nmerece mi respeto.\n\nPero yo tampoco me rendí.\nSiempre busco más fuerza.\n\n¡Voy a seguir hasta vencerte!\n\nNo me importa cuántas veces\nni cuánto tarde. ¡Te venceré!',
    en: "Hello. It's me... Acero.\nI heard you defeated Mateo.\n\nIncredible. Your power\nhas earned my respect.\n\nBut I haven't given up, either.\nI'm always seeking more power.\n\nI will keep going until I beat you!\n\nI don't care how many times or\nhow long it takes. I will beat you!",
  },
  '11540': { es: 'Estoy preparado...\n¿Y tú?', en: 'I am ready...\nAre you?' },
  '115CC': { es: '¿Qué? ¿Cómo te atreves a rechazarme?', en: 'What? How dare you turn me down!' },
  '11648': { es: 'Bien. Comencemos.', en: "OK. Let's begin." },
  '116E4': {
    es: '¡Aaah! ¡Perdí otra vez! Tienes mucha\nfuerza. O quizá me falta entrenar.\n\nEsto es una prueba de resistencia.\n¡No me voy a rendir!\n\nPor más veces que pierda,\n¡te seguiré desafiando!',
    en: "Argh! I lost again! You're too strong.\nOr maybe I just need more training.\n\nThis is a test of endurance.\nI'm not going to give up!\n\nNo matter how many times I lose,\nI will keep challenging you!",
  },
  '11890': {
    es: '¡Gané! Parece que esta vez mi fuerza\ncreció más rápido que la tuya.\n\n¿Qué se siente perder?\n\nDuele, ¿verdad? Pero ese dolor\nes lo que me hizo seguir.\n\n¡Vuelve a desafiarme!',
    en: "I won! I guess my power grew\nfaster than yours this time.\n\nHow does it feel to lose?\n\nPainful, isn't it? But that pain\nis what kept me going until now.\n\nCome challenge me again!",
  },
  '11A4C': aceroDeck,

  // Fragua, the last opponent of the new Arena
  '11BA8': {
    es: 'Mira cuánto has avanzado.\n\nEsta Arena se preparó\nespecialmente para ti...\n\n¿Lo disfrutaste hasta ahora?\nEntonces, comencemos.\n\n¡Esta es la batalla final!',
    en: "Look how far you've come.\n\nThis Arena was prepared\nespecially for you...\n\nHave you enjoyed it so far?\nNow, let us begin.\n\nThis is the final battle!",
  },
  '11DD4': { es: '¿Aceptas mi desafío?', en: 'Do you accept my challenge?' },
  '11E6C': { es: 'Ya veo. Tú decides.\nYo seguiré aquí.', en: "I see. Well, that's up to you.\nI'll still be here." },
  '11F04': { es: 'Me alegra oírlo. ¡Vamos!', en: "That's good to hear. Let's go!" },
  '11FAC': {
    es: 'Tu concentración es asombrosa.\n\nPerdí, pero fue una gran batalla.\nNo me arrepiento de nada.\n\nSiento que por fin todo mi\nentrenamiento dio frutos...\n\nMe alegra mucho haberte conocido...\n\nMe diste la oportunidad de\nllegar más alto.\n\nGracias. Ojalá nos volvamos a ver.\n\nLleguemos los dos a la cima.',
    en: "Your concentration is amazing.\n\nI lost, but it was a great battle.\nI have no regrets.\n\nI feel like all my training\nfinally paid off...\n\nI'm really glad we met...\n\nYou gave me a chance to take\nmyself to another level.\n\nThank you. I hope we meet again.\n\nLet's both reach the top.",
  },
  '124F4': {
    es: 'Parece que al fin las cosas\nse ponen a mi favor.\n\nMi entrenamiento dio frutos.\nEsto hay que celebrarlo.\n\nPero sé que sigues siendo\nun rival temible.\n\nSeguiré entrenando.\nVuelve a esta Arena.\n\nOjalá nos volvamos a ver.',
    en: "It looks like the tables are\nfinally turning in my favor.\n\nMy training has finally paid off.\nThis calls for a celebration.\n\nBut I know you are still\nan opponent to be reckoned with.\n\nI will keep training.\nCome back to this Arena.\n\nI hope we'll see each other again.",
  },
  '12734': fraguaDeck,

  // Centinela's Arena: the old friends again, then Centinela
  '12B40': { es: '¿Empezamos la batalla?', en: 'Shall we start the battle?' },
  '12BD4': azucenaNo,
  '12C5C': azucenaGo,
  '12D00': {
    es: 'Ay... No sirve de nada,\npor más veces que lo intente...\n\n¡No, eso no es cierto!\n\nEstoy aquí porque nuestras batallas\nme hicieron más fuerte.\n\nPuedo hacerme aún más fuerte.\n¡Y entonces te venceré!\n\nSuerte en la próxima ronda.\n¡Todos esperan su turno contigo!',
    en: "Sigh. It's just no good,\nno matter how many times I try...\n\nNo, that can't be true!\n\nI'm here because our battles\nmade me a stronger card player.\n\nI can become even stronger.\nAnd then I'll defeat you!\n\nGood luck in the next round!\nEveryone's eager for their turn!",
  },
  '12F4C': {
    es: '¡Mira! ¡Qué bien! ¡Gané!\n¡Tengo que contárselo a Mina!\n\nAy, perdón...\nEso fue muy grosero de mi parte.\n\n¡Pero estoy tan contenta!\n¡Qué maravilla!\n\nJuguemos otra vez. ¡Adiós!',
    en: "Wow! Great! I won!\nI have to tell Mina about this!\n\nOh, I'm sorry...\nThat was really rude of me.\n\nBut I'm just so happy!\nThis is wonderful!\n\nLet's do this again. Bye!",
  },
  '130EC': azucenaDeck,
  '132CC': { es: 'Oye, ¿jugamos una ronda?', en: 'Hey, how about a round?' },
  '13364': { es: 'Qué lástima.', en: "That's too bad." },
  '133D0': { es: '¡Empecemos!', en: "Let's get started!" },
  '13470': {
    es: 'Uf, creo que no estoy a tu altura.\nOjalá tuviera más fuerza.\n\nAhora sé cómo le ganaste a Isidro.\nMe superas por mucho.\n\nBueno, en la vida no todo es\nganar, ¿verdad?\n\n¡Juguemos otra vez! ¡Adiós!',
    en: "Ugh, I guess I'm no match for you.\nI wish I were stronger.\n\nNow I know how you beat Isidro.\nYou're way beyond my skills.\n\nWell, life isn't all about\nwinning, right?\n\nLet's do this again! Bye!",
  },
  '13644': {
    es: '¿Eh? ¿Qué pasó? ¡Gané!\n\n¡Increíble!\n\nAhora se ve quién merece\nmás respeto por aquí.\n\nPero ganar no lo es todo, ¿verdad?\nSin rencores, espero.\n\n¡Juguemos otra vez! ¡Adiós!',
    en: "Huh? What happened? I won!\n\nThis is incredible!\n\nNow we see who deserves more\nrespect around here.\n\nBut winning isn't everything, right?\nNo hard feelings, I hope.\n\nLet's do this again! Bye!",
  },
  '1382C': astadoDeck,
  '139E4': { es: 'Entonces, ¿jugamos?', en: 'So, do you wanna play?' },
  '13A74': { es: '¿En serio? ¡Qué lástima!', en: "Really? That's too bad!" },
  '13AE0': { es: '¡Muy bien! ¡A jugar!', en: "Alright! Let's do it!" },
  '13B78': {
    es: '¡Ay, me ganaste otra vez!\n¡Sí que juegas bien!\n\nParece que nunca\nte puedo alcanzar.\n\n¡Pero no me rindo!\nTe prometo que un día te gano.\n\nProméteme que seguirás aceptando\nmis desafíos, ¿sí? ¡Nos vemos!',
    en: "Oh, you beat me again!\nYou ARE really good!\n\nIt seems like I can never\ncatch up to you.\n\nBut I won't give up!\nI promise I'll beat you one day.\n\nPromise you'll keep accepting\nmy challenge, OK? See you later!",
  },
  '13D50': {
    es: '¡Je, je, je, gané!\n¿Ya vemos quién es mejor?\n\n¡Es broma! No te lo tomes a mal.\nSé que vas a mejorar.\n\nDe todos modos, ¡no me conformo!\nSiempre estoy listo para la revancha.\n\n¡Tengo todo el tiempo del mundo!',
    en: "Heh heh heh, I won!\nNow do we see who's better?\n\nJust kidding! Don't feel hurt.\nI know you'll get better!\n\nAnyway, I'm not satisfied yet!\nI'm always ready for a rematch!\n\nI have plenty of time!",
  },
  '13F04': martilloDeck,
  '140D4': { es: '¿Empezamos la batalla?', en: 'Shall we begin the battle?' },
  '14174': { es: 'No me gustan las batallas\na medias.', en: 'I dislike half-hearted battles.' },
  '141E8': { es: '¡Pues dame tu mejor jugada!', en: 'So, hit me with your best shot!' },
  '14290': {
    es: 'Parece que no tengo fuerza\npara detenerte. Puedes pasar.\n\nQueda un rival más esperando\nsu turno. ¡Cuidado!\n\nPrepárate bien antes de seguir,\no te puedes arrepentir.',
    en: "Looks like I'm not strong enough\nto stop you. You may pass.\n\nOne more card player is waiting\nfor a turn. Watch out!\n\nBetter prepare yourself before\nyou go, or you might regret it.",
  },
  '14430': {
    es: 'Te dije que te detendría aquí.\n\nDesafíame otra vez cuando quieras.\n¡Te voy a frenar en seco!\n\nLo digo en serio...',
    en: "I told you I'd stop you here.\n\nChallenge me again anytime.\nI'll stop you dead in your tracks!\n\nI'm serious...",
  },
  '14560': plumariaDeck,
  '14680': {
    es: 'Agradezco la oportunidad de librar\nuna batalla como esta.\n\nNosotros, Fragua y Acero,\nunimos nuestras formas en una sola:\nyo, Centinela.\n\nNada me alegra más que enfrentar\na un rival digno.\n\n¡Qué sensación!\nAhora, prepárate.',
    en: "I'm grateful for this chance\nto fight a battle like this.\n\nWe, Fragua and Acero,\njoined our shapes into one:\nme, Centinela.\n\nNothing makes me happier than\nfacing a worthy opponent!\n\nWhat a feeling!\nNow, prepare yourself!",
  },
  '14910': { es: '¿Sientes mi emoción?\n¿Empezamos?', en: 'Can you feel my excitement?\nShall we begin?' },
  '149A4': { es: '¿Te echas atrás ahora?', en: 'Are you backing out now?' },
  '14A10': { es: '¡Prepárate para una batalla emocionante!', en: 'Get ready for an exciting battle!' },
  '14AB4': {
    es: 'Qué gran batalla. Ganar ya\nno me importa.\n\nLo importante es la calidad\nde la batalla.\n\nDebemos seguir buscando\nel desafío definitivo.\n\nConfío en ti.',
    en: "That was quite a battle. Winning\ndoesn't matter to me anymore.\n\nThe quality of the battle\nis what's important.\n\nWe must keep seeking\nthe ultimate challenge.\n\nI trust you to do this.",
  },
  '14E18': {
    es: 'Sí, estoy satisfecho...\nEsta vez gané, y valió todo mi esfuerzo.\n\nPocos jugadores me obligan\na esforzarme tanto.\n\nOjalá sigas mejorando.\nYo también lo haré.\n\nEspero que vuelvas\na desafiarme.\n\n¡Te enfrento cuando quieras!',
    en: "Yes, I am satisfied...\nI won, and it took my full effort.\n\nThere aren't many card players\nwho can make me work so hard.\n\nI hope you keep improving.\nThe same goes for me.\n\nI hope you'll come back\nand challenge me again.\n\nI will take you on anytime!",
  },
  '15034': centinelaDeck,
};
