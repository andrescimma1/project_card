/**
 * Aldea del Cruce, later phases: Madreselva sends the player to Lampless City, Tadeo hunts Mortaja, and
 * the boar who started as Brezo comes back with every new shape and a new name (Tizón, then Fragua);
 * Hollín guards the last arena, and the Blot wanders in.
 */
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });
const thornDeck = deck('*c3Mazo Jardín de Espinas\nUn mazo de tres colores lleno de plantas.\nToda flor tiene sus espinas.', '*c3Thorn Garden Deck\nA three-color deck full of plants.\nEvery flower has its thorns.');
const tizonDeck = deck('*c3Mazo ¡Evoluciona!\nUn mazo básico de la facción Roja.', '*c3Evolve! Deck\nA basic Red faction deck.');
const fraguaDeck = deck('*c3Mazo Corazón de Brasa\nUn mazo Rojo perfectamente equilibrado.\nNo tiene puntos débiles.', '*c3Ember Heart Deck\nA perfectly balanced Red deck.\nIt has no weak links.');
const hollinDeck = deck('*c3Mazo Brasa Negra\nUn mazo Rojo con cartas de Apoyo\nque anulan, y mucho ataque.', '*c3Black Ember Deck\nA Red deck with nullifying Support\ncards and strong attacks.');
const madreselva = {
  wait: { es: 'Tómate tu tiempo. Hagas lo que hagas,\nigual voy a ganar.\n\nJa, ja, ja...', en: "Take your time. Whatever you do,\nI'll still win.\n\nHa ha ha..." },
  go: { es: 'Cuando quieras, empezamos.', en: "Whenever you're ready, let's begin." },
  lost: { es: 'Mmm... Sí, juegas bien.\n\nInteresante. Vuelve a desafiarme.\n¡Ja, ja, ja!', en: 'Hmm... Yes, you play well.\n\nInteresting. Challenge me again.\nHa ha ha!' },
  won: { es: '¡Ja, ja, ja! Te falta mucho por aprender.\n\nTómate tu tiempo.\nNo me voy a ir a ninguna parte.\n\n¡Ja, ja, ja!', en: "Ha ha ha! You have a lot to learn.\n\nTake your time.\nI'm not going anywhere.\n\nHa ha ha!" },
};
const tizon = {
  doubt: { es: 'Si tienes dudas, mejor vete ahora.\n\nHoy la suerte no está de tu lado.', en: "If you have doubts, leave now.\n\nLuck isn't on your side today." },
  won: { es: '¡Bien! ¡Gané!\n\nNo te rindas.\nDesafíame cuando quieras.\n\nSiempre voy a estar aquí. ¡Nos vemos!', en: "Alright! I won!\n\nDon't give up.\nChallenge me whenever you want.\n\nI'll always be here. See you!" },
  lostNext: {
    es: '¡Increíble! ¡Qué fuerza!\nTengo que ser más duro y tener más suerte.\n\n¡Rayos! La próxima no me ganas.\n¡Voy a alcanzar mi siguiente forma!',
    en: "Wow! You're really strong!\nI need to be tougher and luckier.\n\nDarn! You won't beat me next time.\nI'll reach my next shape!",
  },
};
const fraguaLost = {
  es: 'Sí, tu voluntad es asombrosa.\n\nPero todavía te falta camino.\nGanar no lo es todo.\n\nYa nos volveremos a enfrentar.\nEso es todo lo que tengo que decir.\n\nEspero con ganas nuestra próxima batalla.',
  en: "Yes, your willpower is amazing.\n\nBut you still have a long way to go.\nWinning isn't everything.\n\nWe will face each other again.\nThat is all I have to say.\n\nI look forward to our next battle.",
};
const fraguaWon = {
  es: 'Mmm, esta vez fui más fuerte.\n\nLimpia tu espíritu y confía en tu instinto.\nAsí vas a ganar.\n\n¡Nos volveremos a ver!',
  en: 'Hmm, this time I was stronger.\n\nClear your spirit and trust your instincts.\nThen you will win.\n\nWe will meet again!',
};
const fraguaDodge = { es: 'No hace falta que dudes.\nEsta batalla no se puede evitar.\n\nTe estaré esperando.', en: "No need to hesitate.\nYou can't avoid this battle.\n\nI'll be waiting for you." };
const hello = { es: '¡Qué gusto verte! ¿Cómo estás?', en: 'Welcome. How are you doing?' };

export const CITY00_LATER: CityTexts = {
  // Madreselva comes back to her true shape and sends the player to Lampless City
  '3DD0': hello,
  '3E34': { who: 'me', es: '¡Vaya! ¿Eres Madreselva?', en: 'Wow, are you Madreselva?' },
  '3E8C': { es: '¿Por qué esa cara de sorpresa?', en: 'Why do you look so surprised?' },
  '3EF0': { who: 'me', es: '¿De verdad eres Madreselva?', en: 'Are you really Madreselva?' },
  '3F4C': { es: '¿De qué hablas?\nSoy yo, Madreselva.', en: "What are you talking about?\nIt's me, Madreselva." },
  '3FCC': { who: 'me', es: '¿En serio? ¡No lo puedo creer!', en: "Really? I can't believe it!" },
  '402C': { es: 'Mira, esta es mi verdadera forma.', en: 'You see, this is my true shape.' },
  '4094': { who: 'me', es: '¿De verdad?', en: 'Really?' },
  '40E0': { es: 'Sí. Por algún motivo,\nla había perdido.\n\nNo lo entiendo. De pronto volvió.\n¿Quién sabe por qué?', en: "Yes. For some reason,\nI had lost it.\n\nI don't get it. Suddenly it came back.\nWho knows why?" },
  '41CC': { who: 'me', es: 'Entiendo. Entonces la que conocí\nya no está... Mmm...', en: 'I see. So the one I met\nis gone now... Hmm...' },
  '424C': { es: '¿Qué pasa? ¿Algo anda mal?', en: "What is it? What's wrong?" },
  '42AC': { who: 'me', es: 'Ah, nada. Perdón.', en: "Oh, nothing. I'm sorry." },
  '4308': { es: 'No pasa nada, no me molesta.\n\nPor cierto, quiero pedirte un favor.', en: "Hey, it doesn't matter to me.\n\nBy the way, I have a favor to ask." },
  '43B8': { who: 'me', es: 'Claro. ¿Qué necesitas?', en: 'Sure. What is it?' },
  '440C': { es: 'Unos extraños están causando\nproblemas en Ciudad sin Faroles.', en: 'A group of strangers is causing\ntrouble in Lampless City.' },
  '4498': { who: 'me', es: '¿Unos extraños?', en: 'A group of strangers?' },
  '44F0': { es: 'Ve a ver con tus propios ojos.\nQuiero que les des una lección.', en: 'Go see for yourself. I want you\nto teach them a lesson for me.' },
  '4584': { who: 'me', es: 'Entiendo. Solo tengo que jugar\ncontra ellos y ganarles, ¿no?', en: 'I see. All I have to do is play\nand beat them, right?' },
  '4608': { es: 'Así es. ¿Puedes hacerlo por mí?', en: "That's right. Can you do it for me?" },
  '4674': { who: 'me', es: '¡Claro! ¡Sin problema!', en: 'Sure. No problem!' },
  '46C8': { es: '¡Qué bien! ¡Cuento contigo!', en: "That's great! I'm counting on you!" },
  '4760': { es: 'Parece que se dieron por vencidos.', en: 'It looks like they gave up.' },
  '47C4': { who: 'me', es: 'Pero no entiendo qué pasó.', en: "But I don't understand what happened." },
  '482C': { es: 'En fin, gracias por tu ayuda.\n\nTe deseo suerte.', en: 'Anyway, thank you for your help.\n\nI wish you luck.' },
  '4A1C': { es: 'Ve a Ciudad sin Faroles. ¡Cuento contigo!', en: "Go to Lampless City. I'm counting on you!" },
  '4A94': hello,
  '4AF8': { who: 'me', es: '¡Muy bien!', en: "I'm doing alright!" },
  '4B50': {
    es: 'Me alegro.\n\nTe voy a contar algo útil.\n\nTe enseño a crear cartas de Apoyo\nfusionando cartas que ya tienes.\n\nPara crear una carta de Apoyo necesitas\n2 cartas del mismo color: roja y roja.\n\nTambién puedes fusionar 2 cartas\nde Apoyo. Es útil, ¿no?',
    en: "Good to hear.\n\nLet me tell you something useful.\n\nI'll teach you how to create Support cards\nby fusing cards you already have.\n\nTo create a Support card you need\n2 cards of the same color: red and red.\n\nYou can fuse 2 Support cards, too.\nUseful, isn't it?",
  },
  '4D68': { es: '¿Quieres jugar contra mí?', en: 'Do you want to play against me?' },
  '4DF8': { es: 'Bueno, qué pena.\nVuelve cuando tengas más tiempo.', en: "Well, that's a pity.\nCome back when you have more time." },
  '4E90': { es: '¡Cuidado! No te la voy a dejar fácil.', en: "Watch out! I won't go easy on you!" },
  '4F38': { es: 'Vaya, vaya. Tienes mucha fuerza.\n\nPero la próxima será distinto.\nJa, ja, ja...', en: "Oh my, my. You're really strong.\n\nBut next time will be different!\nHa ha ha..." },
  '52E0': { es: '¿Qué te pasó?\nNo te ves bien.\n\n¡Esta vez gano yo! ¡Ja, ja, ja!', en: "What happened?\nYou don't look well.\n\nI win this time! Ha ha ha!" },
  '53B4': thornDeck,

  // Tizón: Brezo, in his next shape and with a new name
  '5474': { es: 'Ah, eres tú.\n¡Parece que te va muy bien!', en: "Oh, it's you.\nLooks like you're doing really well!" },
  '54F8': { who: 'me', es: '¿Eh? ¿Quién eres?', en: 'What? Who are you?' },
  '5554': {
    es: '¡Uy, perdón! Soy Tizón.\n\nAntes era Brezo. Cuando una criatura\nalcanza otra forma, toma otro nombre.\n\nGracias por ayudarme en la\nTorre del Archivero.\n\nAllí tenía la forma de Yunque.\nPero aquí soy Tizón.\n\n¡Por fin soy el maestro\nde esta Arena!\n\nAhora la Arena es mucho más difícil.\nVen a jugar cuando quieras.\n\n¡Nos vemos!\nTe espero en la Arena.',
    en: "Oops, sorry! I'm Tizón.\n\nI used to be Brezo. When a creature\nreaches a new shape, it takes a new name.\n\nThanks for helping me at\nthe Archivist's Tower.\n\nThere I had the shape of Yunque.\nBut here I'm Tizón.\n\nI'm finally the master\nof this Arena!\n\nThe Arena is much tougher now!\nCome and play whenever you like.\n\nSee you later!\nI'll be waiting at the Arena.",
  },
  '59E4': { es: 'Ahora la Arena es mucho más difícil.\nVen a jugar cuando quieras.\n\n¡Nos vemos!\nTe espero en la Arena.', en: "The Arena is much tougher now!\nCome and play whenever you like.\n\nSee you later!\nI'll be waiting at the Arena." },
  '5AF8': { es: '¿No crees que la voluntad y la suerte\nson lo más importante en una batalla?', en: "Don't you think willpower and luck\nmatter most in a battle?" },
  '5BA8': { es: '¿Jugamos una partida?', en: 'Shall we play a match?' },
  '5C3C': { es: 'Entiendo. Qué lástima.\nVuelve cuando quieras. ¡Aquí estaré!', en: "I see. That's too bad.\nCome back anytime. I'll be here!" },
  '5CD4': { es: '¡Bien! ¡Dame todo lo que tienes!', en: 'Alright! Give me all you have!' },
  '5D70': {
    es: '¡Increíble! ¡Qué manera de jugar!\nTengo que ser más duro y tener más suerte.\n\n¡Rayos! La próxima no me ganas.\n¡Tienes que darme la revancha!',
    en: "Wow! You're really something!\nI need to be tougher and luckier.\n\nDarn! You won't beat me next time.\nYou have to give me a rematch!",
  },
  '5FBC': { es: '¡Bien! ¡Gané!\n\nVuelve cuando quieras. ¡Te espero!', en: "Alright! I win!\n\nCome back anytime. I'll be ready!" },
  '6068': tizonDeck,

  // Tadeo, another traveller, hunts Mortaja
  '60FC': { es: '¡Hola! Me llamo Tadeo.\n¿Y tú?', en: "Hi! My name is Tadeo.\nWhat's yours?" },
  '616C': { who: 'me', es: 'Me llamo *h0.\n¡Mucho gusto!', en: 'My name is *h0.\nNice to meet you!' },
  '61E0': { es: '¿Viste criaturas sospechosas\npor aquí?', en: 'Have you seen any suspicious\ncreatures around here?' },
  '6248': { who: 'me', es: '¿Criaturas sospechosas?', en: 'Suspicious creatures?' },
  '62A4': { es: 'Sí. Su jefe se llama Mortaja.\nSiempre andan causando problemas.', en: "Yeah. Their boss is called Mortaja.\nThey're always causing trouble." },
  '6338': { who: 'me', es: 'No, creo que no las vi.', en: "No, I don't think I've seen them." },
  '63A0': { es: 'Ya veo.', en: 'I see.' },
  '63EC': { who: 'me', es: 'Si las veo, te aviso.', en: "I'll let you know if I do." },
  '6450': { es: '¡Gracias! ¡Me ayudaría mucho!', en: "Thanks! That'll be great!" },
  '661C': { es: 'Avísame si te enteras de algo.\n¡No te olvides!', en: "Let me know if you learn anything.\nDon't forget!" },
  '66B0': {
    es: 'Lo sospechaba...\nMortaja sí volvió a este mundo.\n\nPero gracias a ti, seguro\nque aprendió la lección.\n\nUn día de estos tenemos que jugar.\n¡Soy bastante bueno, eh!\n\n¡Nos vemos!',
    en: "Just as I suspected...\nMortaja did come back to this world.\n\nBut thanks to you, I'm sure\nhe's learned his lesson.\n\nWe should play one of these days.\nI'm pretty good, you know!\n\nSee you later!",
  },
  '6878': { es: '¡Hola! ¡Te va muy bien, por lo que veo!\nAh, casi lo olvido...\n\n¡Te traje esto!\nÚsalo bien.', en: "Hey! You seem to be doing well!\nOh yeah, I almost forgot...\n\nI brought this for you!\nPlease use it." },
  '6970': { who: null, es: 'Recibiste el *c3huevo del Valor*c7 de Bollo.', en: "You got Bollo's *c3Egg of Courage*c7!" },
  '69E8': { who: null, es: 'Recibiste el *c3huevo de la Confianza*c7\nde Zarpa.', en: "You got Zarpa's\n*c3Egg of Reliability*c7!" },
  '6A60': { es: 'Y si tienes tiempo, ¡juguemos!\nTe aseguro que lo vas a pasar bien.', en: "And if you're free, let's play!\nI guarantee you a great time!" },
  '6AF8': {
    es: '¡Hola! ¿Cómo estás?\n\nPor cierto, ¿tienes todas\nlas cartas de compañeros?\n\nHay 6 compañeros distintos,\npero solo puedes conseguir 3.\n\nSeguro ya lo sabes, pero si usas\nmazos de otras personas...\n\n...puedes completar tu lista con\nlos compañeros que no tienes.',
    en: "Hey! How are you doing?\n\nBy the way, do you have all\nthe partner cards?\n\nThere are 6 different partners,\nbut you can only get 3 of them.\n\nYou probably know this, but if you use\nother people's decks...\n\n...you can fill your list with\nthe partners you don't have!",
  },
  '6D18': { es: '¿Quieres jugar contra mí?', en: 'Do you want to play against me?' },
  '6DA4': { es: '¿En serio? Qué lástima.\n\n¡Te enfrento cuando quieras!', en: "Really? That's too bad.\n\nI'll take you on anytime!" },
  '6E48': { es: '¡Sé que voy a ganar!', en: "I know I'm going to win!" },
  '6EDC': { es: '¡Nooo! ¡Perdí!\nJuegas demasiado bien.\n\nPero fue divertido. ¡Otra vez!', en: "Oh no! I lost!\nYou're too strong.\n\nBut that was fun. Let's do it again!" },
  '7160': { es: '¿Qué te pareció eso?\n\nVuelve cuando quieras.', en: 'How do you like that!?\n\nCome back whenever you want.' },
  '7208': deck('*c3Mazo Hasta el Final\nUn mazo Rojo con criaturas Perfectas.', '*c3All the Way Deck\nA Red deck with Apex creatures.'),

  // Fragua: Tizón, in his highest shape
  '8538': { es: 'Por fin llegas. Te estaba esperando.', en: "You're finally here. I've been waiting." },
  '85AC': { who: 'me', es: '¿Quién? ¿Yo?', en: 'Who? Me?' },
  '85FC': {
    es: 'Así es. Tú. Soy Fragua.\n\nFui Tizón, y alcancé mi forma más alta.\nTe estaba esperando.\n\nNo te voy a obligar, pero\nquiero que aceptes mi desafío.',
    en: "That's right. You. I'm Fragua.\n\nI was Tizón, and I reached my highest shape.\nI've been waiting for you.\n\nI won't force you, but\nI want you to accept my challenge.",
  },
  '876C': { who: 'me', es: '¿Una batalla?\nClaro, acepto.', en: 'A battle?\nSure. I accept.' },
  '87D8': { es: 'Bien.\nEso es lo que quería oír.\n\nVen a la Arena.\nPreparé una Arena especial para ti.\n\nTengo ganas de enfrentarte.', en: "Good.\nThat's what I wanted to hear.\n\nCome to the Arena.\nI prepared an Arena especially for you.\n\nI'm looking forward to our battle." },
  '8AF4': { es: 'Ven a la Arena.\nPreparé una Arena especial para ti.\n\nTengo ganas de enfrentarte.', en: "Come to the Arena.\nI prepared an Arena especially for you.\n\nI'm looking forward to our battle." },
  '8BE4': { es: '¿Quieres llegar a lo más alto?\n\nEntonces limpia tu espíritu.', en: 'Do you want to be the best?\n\nThen you must clear your spirit!' },
  '8CA4': { es: '¿Quieres jugar contra mí?', en: 'Do you want to battle me?' },
  '8D38': { es: 'Entiendo. Es tu decisión.\nAquí estaré.', en: "I see. Well, it's your choice.\nI'll be here." },
  '8DC8': { es: 'Me alegra oírlo. ¡A jugar!', en: "That's good to hear. Let's battle!" },
  '8E74': {
    es: 'Sí, tu voluntad es asombrosa.\n\nPero incluso cuando ganas, pierdes algo.\nGanar no lo es todo.\n\nNos volveremos a enfrentar.\nEso es todo lo que tengo que decir.\n\nEspero con ganas nuestra próxima batalla.',
    en: "Yes, your willpower is truly amazing.\n\nBut even when you win, you lose something.\nWinning isn't everything.\n\nWe shall meet again in battle.\nThat's all I have to say.\n\nI look forward to our next battle.",
  },
  '915C': {
    es: 'Parece que yo tenía más ganas de ganar.\n\nConfía en tu instinto\ny los resultados llegarán.\n\nEso es todo lo que tengo que decir.\n\nEspero con ganas nuestra próxima batalla.',
    en: 'Looks like I had more will to win.\n\nTrust your instincts\nand results will follow.\n\nThat is all I have to say.\n\nI look forward to our next battle.',
  },
  '92D0': fraguaDeck,

  // Hollín guards the last arena of the village
  '9398': { es: 'Soy Hollín.\nPor fin encuentro un rival digno.', en: 'I am Hollín.\nFinally, I meet a worthy opponent.' },
  '942C': { who: 'me', es: '¿...?', en: '???' },
  '9478': { es: 'No hace falta tanta modestia.\n\n¡Ven a mi Arena!\nVoy a ponerle fin a tu viaje.\n\n¡Te espero!', en: "Don't be so modest.\n\nCome to my Arena!\nI will put an end to your journey.\n\nI'll be waiting!" },
  '9774': { es: '¡Ven a mi Arena!\nSerá tu última batalla en este mundo.\n\n¡Te espero!', en: "Come to my Arena!\nIt will be your last battle in this world.\n\nI'll be waiting!" },
  '9894': { es: 'Fue una gran batalla.\n\nCreo que mereces llevar\nla prueba de los Milagros.\n\nSí, te la mereces. Te daré\nel huevo de los Milagros.', en: 'That was a great battle.\n\nI think you may be worthy of holding\nthe proof of Miracles.\n\nYes, you are. I shall give you\nthe Egg of Miracles.' },
  '99D8': { who: null, es: 'Recibiste el *c3huevo de los Milagros*c7\nde Brinco.', en: "You got Brinco's\n*c3Egg of Miracles*c7!" },
  '9A3C': { es: 'Con este huevo acabas de ganar\nun poder enorme.\n\nNo lo uses mal: le haría daño\na mucha gente.\n\nÚsalo por una buena causa.\n\nTodo depende de ti.', en: "You have just gained tremendous power\nwith this egg.\n\nDo not misuse it, for it would\nhurt many people.\n\nUse it for a good cause.\n\nIt's all up to you." },
  '9BE0': { es: 'Úsalo con cuidado. Si no, le hará\ndaño a mucha gente.\n\nEspero que le des un buen uso.\n\nTodo depende de ti.', en: "Use it wisely. If you don't, it will\nhurt many people.\n\nI hope you put it to good use.\n\nIt's all up to you." },
  '9D20': { es: '¿Deseas jugar contra mí?', en: 'Do you wish to battle with me?' },
  '9DC0': { es: 'Pero una batalla no es solo pelear.\n\nDebes aprender el verdadero sentido\nde las batallas.', en: "But a battle isn't just fighting.\n\nYou must learn the true meaning\nof battles!" },
  '9EA4': { es: '¡Afilemos nuestras habilidades!', en: 'Let us sharpen our skills!' },
  '9F4C': { es: 'Perdí. Lo admito.\nTu poder es increíble.\n\nPero no debes usarlo mal.\n\nConfío en que harás lo correcto.', en: 'I have lost. I admit it.\nYour power is incredible.\n\nBut you must not misuse that power.\n\nI trust you to do the right thing.' },
  A1B8: { es: 'Juegas bien, pero no eres rival para mí.\n\nDesafíame cuantas veces quieras.\n¡Aquí estaré!', en: "You're quite good, but you are\nno match for me.\n\nChallenge me as often as you like.\nI'll be here!" },
  A2CC: hollinDeck,

  // the Blot, a creature that lost its shape
  A4BC: {
    es: '¿Qué sabes tú del dolor de los que\nse quedaron atrás cuando otros evolucionaron?\n\n¡Lo desprecio todo!\n\nMi rencor no va a parar hasta\nque borre todo lo de este mundo.',
    en: "What do you know of the pain of those\nleft behind when others evolved?\n\nI despise everything!\n\nMy hatred won't stop until\nI erase everything in this world.",
  },
  A628: { es: '¿Adónde... voy...?\n\n¿Encontraré por fin la paz?\n\n¿O me tragará más rencor?\n\nNo lo sé...', en: 'Where... am I... going?\n\nWill I finally find peace?\n\nOr will more hatred swallow me?\n\nI do not know...' },
  A764: { es: '¿Crees que puedes vencerme?', en: 'Do you think you can beat me?' },
  A7FC: { es: '¿No? Entonces vete...\nMi rencor puede esperar.', en: 'No? Then go...\nMy hatred can wait.' },
  A868: { es: '¡Que te trague mi rencor!', en: 'Be swallowed by my hatred!' },
  A8FC: {
    es: 'Ohhh, me desvanezco...\n¿Desaparecerá también mi rencor?\n\n¿Me salvaré ahora?\nNo lo sé...\n\n¿Adónde... voy...?\n\n¿Me espera la paz allí?\n\n¿O me tragará más rencor?\n\nNo lo sé...',
    en: "Ohhh, I'm fading...\nWill my hatred disappear, too?\n\nWill I be saved now?\nI don't know...\n\nWhere... am I... going?\n\nIs peace waiting for me there?\n\nOr will more hatred swallow me?\n\nI do not know...",
  },
  AE00: {
    es: '¡Oh, el rencor crece dentro de mí!\nNo lo puedo contener.\n\nDebo librarme de él, ¡y cubrir\neste mundo de gris!\n\nHaré que todos sientan mi dolor.\n\n¡Siente mi dolor! ¡Siente mi angustia!\n\n¡Esta es la venganza de los que\nse quedaron atrás!',
    en: "Oh, the hatred inside me is growing!\nI can't contain it.\n\nI must rid myself of it, and cover\nthis world in grey!\n\nI will make everyone feel my pain.\n\nFeel my pain! Feel my agony!\n\nThis is the revenge of those\nwho were left behind!",
  },
  B02C: deck('*c3Mazo Vacío Desesperado\nEl mazo más maligno y poderoso.', '*c3Desperate Void Deck\nThe most evil and powerful deck.'),

  // the arena's later tournaments: Pipa, Madreselva, Tizón, Fragua, Hollín
  CE9C: { es: 'Soy Pipa, tu primera rival.\n\nTenme paciencia, ¿sí?\nJi, ji.', en: "I'm Pipa, your first opponent.\n\nPlease go easy on me.\nHee hee." },
  D00C: { es: 'No tengo nada contra ti,\npero voy a ganar. ¿Empezamos?', en: 'I have nothing against you,\nbut I will win. Shall we start?' },
  D0D0: { es: 'Ah, era broma. Vuelve cuando quieras.', en: 'Ah, I was just kidding. Come on back.' },
  D158: { es: '¡A jugar!', en: "Let's rock!" },
  D1EC: { es: 'Ay, perdí. Juegas muy bien.\n\nTengo que hacerme más fuerte.', en: "Oh no, I lost. You're good.\n\nI need to toughen up for next time." },
  D2C0: { es: 'Gané. Tal como esperaba.\n\nPuedes volver a desafiarme si quieres.\n\n¡Perdiste!', en: 'I won. Just as I expected.\n\nYou can challenge me again, if you want.\n\nYou lose!' },
  D3BC: deck('*c3Mazo de Pipa\nUn mazo defensivo de las facciones\nAzul y Rara.', "*c3Pipa's Deck\nA defensive deck of the Blue\nand Rare factions."),
  D56C: { es: 'No soy fácil de vencer. ¿Empezamos?', en: "I'm not easy to beat. Shall we start?" },
  D604: madreselva.wait,
  D6D0: madreselva.go,
  D770: madreselva.lost,
  D850: madreselva.won,
  D950: thornDeck,
  DA8C: { es: '¡Te estaba esperando! Te voy a\ncontar algo importante.\n\nSi quieres vencernos, necesitas\nuna voluntad muy fuerte.\n\nY también suerte, claro.', en: "I've been waiting for you! Let me\ntell you something important.\n\nIf you want to beat us, you need\nstrong willpower!\n\nYou need luck, too, of course." },
  DC84: { es: '¡Empecemos!', en: "Let's begin!" },
  DD08: tizon.doubt,
  DDD0: { es: '¿Seguro? ¡Vamos!\n¡Dame todo lo que tienes!', en: "Are you sure? Let's go!\nGive me all you've got!" },
  DE90: { es: '¡Increíble! Qué fuerza tienes.\nTengo que entrenar más.\n\nLa próxima no me ganas. ¡Revancha!\n\nTal vez nos veamos en el Café.\nAllí te espero.', en: "Wow! You're really strong.\nI need to train more.\n\nYou won't beat me next time. Rematch!\n\nI might see you at the Battle Cafe.\nI'll be waiting for you." },
  E1A8: tizon.won,
  E2CC: tizonDeck,
  E67C: { es: 'Soy muy buena. ¿Empezamos?', en: "I'm really good. Shall we start?" },
  E710: madreselva.wait,
  E7D8: madreselva.go,
  E878: madreselva.lost,
  E958: madreselva.won,
  EA58: thornDeck,
  EC1C: { es: 'Entonces, ¡empecemos!', en: "So, let's begin!" },
  ECA4: tizon.doubt,
  ED6C: { es: '¡Bien! ¡Una vez más, con todo!', en: 'OK! Hit me one more time!' },
  EE10: tizon.lostNext,
  EF38: tizon.won,
  F05C: tizonDeck,
  F170: {
    es: '¡Por ahora, esta es mi forma más fuerte!\n¡Te voy a dar una lección!\n\nTe doy un consejo.\n\nSi quieres avanzar en este mundo,\ntienes que limpiar tu espíritu.\n\nPorque eso es lo que hace falta\npara seguir ganando.',
    en: "For now, this is my strongest shape!\nI'm going to teach you a lesson!\n\nLet me give you a word of advice.\n\nIf you want to move ahead in this world,\nyou need to clear your spirit.\n\nBecause that's what it takes\nto keep winning.",
  },
  F3E8: { es: '¿Te atreves a enfrentarme?', en: 'Are you ready to face me?' },
  F47C: fraguaDodge,
  F554: { es: '¡Bien! ¡A jugar!', en: "Good! Let's battle!" },
  F5F0: fraguaLost,
  F974: fraguaWon,
  FAA0: fraguaDeck,
  FE80: { es: 'Entonces, ¡empecemos!', en: "So, let's begin!" },
  FF08: tizon.doubt,
  FFC8: { es: '¿Seguro? ¡Entonces dame con todo!', en: 'Are you sure? Then hit me!' },
  '1006C': tizon.lostNext,
  '10190': tizon.won,
  '102B4': tizonDeck,
  '10450': { es: '¿Te atreves a enfrentarme?', en: 'Are you ready to face me?' },
  '104E4': fraguaDodge,
  '105C0': { es: '¡Muy bien! ¡A jugar!', en: "Great! Let's battle!" },
  '1065C': {
    es: 'Sí, tu voluntad es asombrosa.\n\nPero todavía te falta camino.\nGanar no lo es todo.\n\nEso es todo lo que tengo que decir.\n\nNos vemos en el Café de batallas.\n\nEspero con ganas nuestra próxima batalla.',
    en: "Yes, your willpower is amazing.\n\nBut you still have a long way to go.\nWinning isn't everything.\n\nThat is all I have to say.\n\nI'll see you again at the Battle Cafe.\n\nI look forward to our next battle.",
  },
  '10850': fraguaWon,
  '10988': fraguaDeck,
  '10AD4': {
    es: '¡Soy el maestro de todos los maestros!\nSoy Hollín.\n\nMe impresiona que hayas\nllegado hasta aquí.\n\n¡Es hora de saber quién es el\nverdadero maestro de los maestros!',
    en: "I am the master of all masters!\nI am Hollín.\n\nI'm impressed that you made it\nthis far.\n\nIt's time to find out who is\nthe true master of all masters!",
  },
  '10CF0': { es: '¿Eso quiere decir que te atreves\na enfrentarme?', en: "Does this mean you're ready\nto face me?" },
  '10D98': { es: 'Elegiste con prudencia.\nNadie puede llamarte cobarde.\n\nEs importante conocer tus límites.', en: "You have chosen wisely.\nNo one can call you a coward now.\n\nIt's important to know your limits." },
  '10E8C': { es: '¡Llegó la hora de tu última batalla!', en: "Now it's time for your last battle!" },
  '10F3C': {
    es: '¡Qué poder tan increíble tienes!\n\nPero no debes usarlo mal.\n\nUn poder así hace mucho daño\nsi se usa mal.\n\nÚsalo por una buena causa.\n\nTodo depende de ti.\nNo lo olvides.\n\n¡Te espero en el Café de batallas!',
    en: "What incredible power you have!\n\nBut you must not misuse that power.\n\nPower of such magnitude causes\nmisery if it is misused.\n\nIt should be used for good causes.\n\nIt's all up to you.\nDon't you forget that.\n\nI'll be waiting at the Battle Cafe!",
  },
  '113B4': { es: 'Juegas bien, pero no eres rival para mí.\n\n¡Sigo siendo el maestro de los maestros!\n\nDesafíame cuantas veces quieras.\n¡Aquí estaré!', en: "You're quite good, but you're no\nmatch for me.\n\nI remain the master of all masters!\n\nChallenge me as often as you like.\nI'll be here!" },
  '1150C': hollinDeck,
};
