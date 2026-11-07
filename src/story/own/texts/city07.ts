/**
 * Templo Hundido (city 7): Tomás, a traveller, tells the player about the Archivist's Tower, the hardest
 * arena of the Quiet Lands, and gives Bollo's egg of Hope to whoever has him as partner. At the café, Saeta,
 * Campana and Celeste, of the temple, play the player; Bollo invites the player to the Extra Arena and is
 * later met in his other shapes; the Blot wanders in, and a stranger with no name warns about "him".
 * The arenas are in city07later.ts.
 */
import { CITY07_LATER, TEMPLE_DECKS as D } from './city07later';
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });
const tomasDeck = deck('*c3Mazo Buen Viento\nUn mazo Verde que sabe cuándo\natacar y cuándo defenderse.', '*c3Fair Wind Deck\nA Green deck that knows when\nto attack and when to defend.');
const thornDeck = deck('*c3Mazo Jardín de Espinas\nUn mazo de tres colores lleno de plantas.\nToda flor tiene sus espinas.', '*c3Thorn Garden Deck\nA three-color deck full of plants.\nEvery flower has its thorns.');
const blotDeck = deck('*c3Mazo Vacío Desesperado\nEl mazo más maligno y poderoso.', '*c3Desperate Void Deck\nThe most evil and powerful deck.');

const tower = { who: 'me', es: 'La Torre del Archivero...', en: "The Archivist's Tower, huh...?" };
const bolloWait = { es: '¡Bien! ¡Te espero en la Arena!', en: "OK! I'll be waiting at the Arena!" };
const celesteAccept = {
  es: 'Acepto tu desafío con gusto.\nEspero con ganas nuestra partida.\n\nTe espero en la Arena.',
  en: "I'll gladly accept your challenge.\nI look forward to our match.\n\nI'll be waiting at the Arena.",
};
const strangerTrain = {
  es: '¡Entrena! ¡Hazte más fuerte!\n\nAquí también debería haber\nuna Tienda de fusión.\n\nSi fusionas cartas una y otra vez,\npuedes crear cartas más poderosas.\n\nCuento contigo...',
  en: "Train! Become stronger!\n\nThere should be another\nFusion Shop here.\n\nFuse cards over and over,\nand you can make stronger ones.\n\nI'm counting on you...",
};

const CAFE: CityTexts = {
  // Saeta, the temple's guardian
  '1600': { es: 'Una reliquia le sirve a cualquiera,\nen cualquier carta de compañero.\n\nSí... Son muy prácticas...', en: 'Anyone can use a relic,\non any of their partner cards.\n\nYes... They are very handy...' },
  '16E8': { es: '¿Te atreves a intentar pasar?', en: 'Do you dare to try and pass?' },
  '1780': { es: '¿Cambiaste de idea?', en: 'Have you changed your mind?' },
  '17F4': { es: '¿Podrás romper mi defensa?', en: 'Can you break through my defense?' },
  '189C': {
    es: '¡Increíble! Me venciste...\nNo volveré a cerrarte el paso.\n\nPuedes pasar. Mira con tus\npropios ojos lo que hay más allá.\n\nTe deseo suerte.',
    en: 'Incredible! You got me...\nI shall stand in your way no more.\n\nYou may pass. See for yourself\nwhat lies ahead.\n\nI wish you luck.',
  },
  '19D4': {
    es: '¿Cómo te atreves a desafiarme\ncon una técnica tan torpe?\n\nTu verdadera fuerza se prueba\nen este mundo. Da todo lo que tienes.\n\nEsperaré tu desafío.',
    en: "How dare you challenge me\nwith such crude skills!\n\nYour true strength is tested in this\nworld. Give it everything you've got.\n\nI shall await your challenge.",
  },
  '1B38': D.saeta,

  // Campana, whose roar rings like the temple bell
  '1CCC': { es: '¡Siente la fuerza antigua!\n\nMi rugido retumba como\nla campana del templo. ¡BOOONG!', en: 'Feel the ancient power!\n\nMy roar rings out like\nthe temple bell. BOOONG!' },
  '1D3C': { es: '¿Quieres ver cómo se peleaba\nen los tiempos antiguos?', en: 'Want to see how battles were\nfought in ancient times?' },
  '1DDC': { es: 'Parece que te falta valor.', en: "Looks like you're short on nerve." },
  '1E50': { es: '¡Escucha mi rugido!\n¡BOOONG!', en: 'Hear my roar!\nBOOONG!' },
  '1EEC': {
    es: '¡Oh, qué fuerza! ¡Siento hervir\nmi sangre salvaje!\n\nNo te apartes de tu camino.\nTu viaje todavía es largo y duro.\n\n¡Pero no aflojes!\nSé que puedes lograrlo.',
    en: "Oh, such power! I can feel my wild\nblood boiling in my veins!\n\nDon't stray from your path.\nYour journey is still long and hard.\n\nBut stick with it!\nI know you can make it.",
  },
  '207C': {
    es: 'Todavía no te alcanza.\n\nTu fuerza antigua sigue dormida.\n\nLo que te falta es experiencia.\nTienes que ganar más.\n\nConmigo puedes ganarla.\nYa sabes que siempre estoy aquí.',
    en: "You're not good enough yet.\n\nYour ancient power is still asleep.\n\nWhat you need now is experience.\nGo and earn more.\n\nYou can earn it with me.\nYou know I'm always here.",
  },
  '2254': D.campana,

  // Celeste, master of the Temple Arena
  '22FC': { es: 'Soy Celeste. Así que entrenas\npara llegar a lo más alto, ¿eh?', en: "I'm Celeste. So, you're training\nto reach the top, eh?" },
  '2390': { who: 'me', es: 'Sí. Mi entrenamiento va muy bien.', en: 'Yes. My training is going well.' },
  '23F8': { es: 'Ya veo. Entonces, ¿vas a entrar\na la Arena que dirijo?', en: "I see. Then will you enter\nthe Arena I'm hosting?" },
  '2488': { who: 'me', es: '¡Claro!', en: 'Of course.' },
  '24D8': {
    es: 'Bien. Ya era hora de ver jugadores\nde cartas fuertes por aquí.\n\nAcepto tu desafío con gusto.\nEspero con ganas nuestra partida.\n\nTe espero en la Arena.',
    en: "Good. It's about time we saw\nsome strong card players here.\n\nI'll gladly accept your challenge.\nI look forward to our match!\n\nI'll be waiting at the Arena.",
  },
  '2830': celesteAccept,
  '2918': {
    es: 'Tienes que seguir adelante.\nSolo así encontrarás la respuesta.\n\nAh, sí. Te doy un consejo.\n\nCuando ganas con tu carta\nde compañero, recibes EXP extra.\n\nLa EXP extra es una forma rápida\nde subir de nivel a tu compañero.\n\nPor ejemplo, si ganas sin perder\nninguna ronda, recibes 3 de EXP extra.\n\n¡No dejes pasar la EXP extra!',
    en: "You must keep moving forward.\nThat's the only way to find the answer.\n\nOh, yes. Let me give you some advice.\n\nWhen you win with your partner card,\nyou get bonus EXP.\n\nBonus EXP is a quick way\nto level up your partner.\n\nFor instance, winning without losing\na single round gives you 3 bonus EXP.\n\nBe sure to earn bonus EXP!",
  },
  '2BD0': { es: 'Entonces, ¿empezamos?', en: 'So, shall we begin?' },
  '2C5C': { es: 'No hay prisa.\nTenemos mucho tiempo.', en: "There's no need to hurry.\nWe have plenty of time." },
  '2CEC': { es: 'Que sea una gran partida.', en: "Let's make this a great match." },
  '2D94': {
    es: 'Ahora veo que tu fuerza es real.\n\nOdio perder.\n\nPero eso me empuja\na entrenar más duro.\n\nDebes encontrar tu verdadero camino.\nSigue adelante.\n\nSi quieres volver a jugar conmigo,\nme encontrarás aquí.\n\nSiempre estaré aquí, esperando.',
    en: "Now I see your strength is real.\n\nI hate to lose.\n\nBut that feeling pushes me\nto train even harder.\n\nYou must find your true path.\nKeep moving.\n\nIf you want to play me again,\nyou'll find me here.\n\nI'll always be here, waiting.",
  },
  '30DC': {
    es: 'No te sientas mal.\nJugaste bastante bien.\n\nEsta vez gané yo, pero ¿quién sabe\nqué pasará la próxima?\n\nTodo pasa por algo.\nEsta derrota te hará más fuerte.\n\nAdelante. Detenerte\nno va contigo.\n\nEsperaré tu desafío.',
    en: "Don't feel bad.\nYou played quite well.\n\nI won this time, but who knows\nwhat will happen next time?\n\nEverything happens for a reason.\nThis loss will make you stronger.\n\nGo on. Standing still\njust isn't like you.\n\nI'll be waiting for your challenge.",
  },
  '32F4': D.celeste,

  // Tomás, a traveller, tells the player about the Archivist's Tower
  '3390': { es: '¡Hola! Me llamo Tomás.\n¡Mucho gusto!', en: 'Hi, my name is Tomás.\nNice to meet you!' },
  '3408': { who: 'me', es: '¡Hola! ¡Soy *h0!', en: "Hi! I'm *h0!" },
  '3458': { es: '¿Tú también quieres llegar\na lo más alto?', en: 'Do you want to reach\nthe top, too?' },
  '34C8': { who: 'me', es: '¡Claro que sí!', en: 'Yes, of course!' },
  '351C': {
    es: 'Entonces te cuento algo.\n\nA tres pueblos de aquí está\nla Torre del Archivero.\n\nEs un archivo antiguo. Dicen que\nguarda el registro de todas las formas.\n\nAhí está la Arena más difícil\nde las Tierras Quietas.\n\nNunca fui, pero todos los jugadores\nde cartas sueñan con jugar allí.\n\nDicen que ganar en esa Arena\nes dificilísimo.\n\nSiempre quise ir.\n\nSi quieres ser de los mejores,\n¡ponte a prueba en esa torre!',
    en: "Then let me tell you something.\n\nThree towns from here stands\nthe Archivist's Tower.\n\nIt's an old archive. They say it keeps\na record of every shape.\n\nIt has the toughest Arena\nin the Quiet Lands.\n\nI've never been, but every card\nplayer dreams of playing there.\n\nThey say winning in that Arena\nis incredibly hard.\n\nI've always wanted to go.\n\nIf you want to be one of the best,\nprove yourself at that tower!",
  },
  '381C': tower,
  '3A9C': { es: 'Si quieres ser de los mejores,\n¡ve a la Torre del Archivero!', en: "If you want to be one of the best,\ngo to the Archivist's Tower!" },
  '3B40': tower,
  '3BEC': {
    es: '¡Vaya, qué fuerza tienes!\nSeguro que en la torre te irá bien.\n\n¡Vas a ser de los mejores, lo sé!\n\nA ver... ¿Tu carta de compañero\nes Bollo?\n\n¡Entonces toma esto!\nEs un huevo para Bollo.',
    en: "Wow, you're really strong...\nI'm sure you'll do well at the tower!\n\nYou'll be one of the best, I know it!\n\nLet me see. Is your partner card\nBollo?\n\nThen take this!\nIt's an egg for Bollo!",
  },
  '3DAC': { who: null, es: 'Recibiste el *c3huevo de la Esperanza*c7\nde Bollo.', en: "You got Bollo's\n*c3Egg of Hope*c7!" },
  '3E20': { es: 'Con este huevo, tu Bollo podrá\nevolucionar cuando entre a combatir.\n\n¡Con esto vas a llegar muy lejos!', en: "With this egg, your Bollo can\nevolve when it enters the fight.\n\nWith this, you'll go a long way!" },
  '3EF8': { who: 'me', es: '¡Gracias!', en: 'Thanks!' },
  '3F44': { es: '¡Suerte!', en: 'Good luck.' },
  '3FB0': { es: '¡Vaya, qué fuerza tienes!\nSeguro que en la torre te irá bien.\n\n¡Ser de los mejores no es un sueño!', en: "Wow, you're really strong.\nYou'll do fine at the tower, I'm sure!\n\nBeing one of the best is no dream!" },
  '40A0': { es: '¿Quieres jugar contra mí?', en: 'Would you like to play against me?' },
  '4138': { es: '¡Qué lástima!', en: "That's too bad!" },
  '41EC': { es: '¿En serio? ¡Genial!', en: 'Really? Cool!' },
  '422C': { es: '¡Ah, cierto!\nArmé un mazo nuevo.', en: 'Oh, yeah!\nI built a brand-new deck.' },
  '4288': { es: 'Para esta partida,\nte presto mi *c3Mazo Alazán*c7.', en: 'For this match,\nyou can borrow my *c3Alazán Deck*c7.' },
  '42FC': { es: '¡Es bastante bueno, ya verás!', en: "It's a pretty good deck, you'll see!" },
  '4350': { es: 'Esta vez quiero que pruebes\notro mazo que armé.', en: "This time I'd like you to try\nanother deck I built." },
  '43C4': { es: '¡Te presento el *c3Mazo Barón*c7!', en: 'This is the *c3Barón Deck*c7!' },
  '4410': { es: 'Creo que me quedó muy bien armado.', en: 'I think it turned out pretty well!' },
  '44D4': {
    es: 'Lo sabía. ¡Tu fuerza y tu manera\nde jugar son increíbles!\n\n¿Por qué no pruebas suerte\nen la Torre del Archivero?\n\nYo todavía necesito práctica.\n¿Jugamos otra vez más adelante?\n\n¡Te espero!',
    en: "Just as I thought.\nYour strength and skill are amazing!\n\nWhy not try your luck\nat the Archivist's Tower?\n\nI still need more practice.\nWill you play me again sometime?\n\nI'll be waiting for you!",
  },
  '4734': {
    es: 'Lo sabía. ¡Qué fuerza\ny qué manera de jugar!\n\nCon eso vas a llegar muy lejos.\n\nOye, todavía necesito práctica.\n¿Jugamos otra vez?\n\n¡Te espero!',
    en: "Just as I thought.\nSuch strength and such skill!\n\nYou're going to go far with that.\n\nHey, I still need more practice.\nCan we play again?\n\nI'll be waiting for you!",
  },
  '4AD0': {
    es: '¡Logré ganar!\nSuerte de principiante, supongo.\n\n¿Jugamos otra vez? Así gano\nmás práctica.\n\n¡Te espero!',
    en: "I managed to win!\nBeginner's luck, I guess.\n\nWill you play me again\nand help me get more practice?\n\nI'll be waiting for you!",
  },
  '4C08': tomasDeck,

  // Bollo opens the Extra Arena, the arena of all his shapes
  '4CC0': { es: '¡Hola! Soy Bollo.\n¡Mucho gusto!', en: "Hi! I'm Bollo.\nNice to meet you!" },
  '4D34': { who: 'me', es: 'Hola, soy *h0.', en: "Hi, I'm *h0." },
  '4D84': { es: 'Hay una Arena donde peleo\ncon todas mis formas.\n\n¿Por qué no vienes a verme\na la Arena?', en: 'There is an Arena where I fight\nin all of my shapes.\n\nWhy not come and see me\nat the Arena?' },
  '4E6C': { who: 'me', es: '¡Claro!\n¡Cuenta conmigo!', en: 'Sure!\nYou can count on me!' },
  '4EE0': bolloWait,
  '4F50': { who: null, es: '*c6¡La Arena Extra está abierta!\n*c6¡Que pasen los valientes!', en: '*c6The Extra Arena is now open!\n*c6Those who are ready, come on in!' },
  '51A8': bolloWait,
  '5220': {
    es: '¡Hola! ¿Cómo estás?\n\nTe voy a enseñar algo muy útil.\n\n¿Sabes cómo crear una carta Verde?\n\nFusiona una Roja con una Azul,\nuna Azul con una Rara...\n\n...o una Verde con\nuna carta de Apoyo.\n\n¿No es increíble?',
    en: "Hi! How are you?\n\nLet me show you something really useful!\n\nDo you know how to make a Green card?\n\nFuse a Red with a Blue,\na Blue with a Rare...\n\n...or a Green with\na Support card!\n\nIsn't that amazing!?",
  },
  '53D8': { es: '¿Jugamos una partida?', en: 'Ready to battle?' },
  '5468': { es: '¿En serio? ¡Qué pena!\nTenía muchas ganas de jugar contigo.', en: 'Really? Aw, too bad.\nI really wanted to battle you.' },
  '550C': { es: '¡Sin trampas, eh!', en: 'No cheating!' },
  '559C': {
    es: '¡Ay, no! ¡Perdí otra vez!\n¡Qué fuerte eres!\n\nVen a jugar conmigo otra vez.\n¡La próxima no será tan fácil!\n\n¡Ya verás!',
    en: "Oh no! I lost again!\nYou're so strong!\n\nCome play me again sometime.\nI won't be so easy next time!\n\nJust you wait!",
  },
  '56D4': {
    es: '¡Bien! ¡Gané!\nTienes que mejorar.\n\nSi ni a mí me puedes ganar,\n¿cómo vas a ganarles a los demás?\n\n¡Desafíame otra vez cuando quieras!\nYa sabes que siempre estoy aquí.\n\n¡Adiós!',
    en: "Yay! I won!\nYou've got to get better.\n\nIf you can't even beat me,\nhow will you beat anyone else?\n\nChallenge me again anytime!\nYou know I'll be here.\n\nBye!",
  },
  '587C': D.bollo,

  // Barón, Bollo with the egg of Courage
  '5A40': { es: '¡El huevo del Valor tiene un gran poder!\n\nSi no te lo tomas en serio,\nno me vas a ganar.', en: "The Egg of Courage has great power!\n\nIf you don't get serious,\nyou won't beat me." },
  '5B28': { es: '¿Te atreves conmigo?', en: 'Want to take me on?' },
  '5BB4': { es: '¿En serio? ¡Vamos, anímate!', en: 'Really? Come on, get with it!' },
  '5C28': { es: '¡Hagámoslo rápido!', en: "Let's make it quick!" },
  '5CC4': {
    es: 'Uf, me ganaste.\nNo pude hacer nada. Juegas bien.\n\nParece que me falta práctica.\n¡La próxima te gano!',
    en: "Ugh, you got me.\nI couldn't do a thing. You're good.\n\nGuess I've got some catching up to do.\nI'll beat you next time!",
  },
  '5DD4': {
    es: '¡El huevo del Valor tiene un gran poder!\n\nSi no te lo tomas en serio,\nno me vas a ganar.\n\nTienes que ir con todo, ¿sí?\nTe espero.',
    en: "The Egg of Courage has great power!\n\nIf you don't get serious,\nyou won't beat me.\n\nYou have to go all out. OK?\nI'll be waiting for you.",
  },
  '5F34': D.baron,

  // Alazán, Bollo with the egg of Hope
  '60D0': { es: '¡Mi luz deshace cualquier sombra!\n\nSi hay sombra en tu corazón,\nmi luz te vencerá.', en: 'My light breaks any shadow!\n\nIf there is shadow in your heart,\nmy light will defeat you!' },
  '61C0': { es: '¡La luz está lista para brillar!\n¿Empezamos?', en: 'The light is ready to shine!\nShall we begin?' },
  '627C': { es: 'Le temes a la sombra.', en: 'You fear the shadow.' },
  '62F0': { es: '¡Saca la sombra de tu mente!', en: 'Banish the shadow from your mind!' },
  '639C': {
    es: '¡Increíble! No había ni una pizca\nde sombra en ti.\n\nTu espíritu limpio te dará\nmuchas victorias.\n\nPero no te confíes. La sombra entra\ncuando uno se cree invencible.\n\nSi alguna vez la sombra te desvía,\nven a jugar conmigo otra vez.\n\n¡Limpiaremos juntos el espíritu!',
    en: "Incredible! There wasn't a hint\nof shadow in you.\n\nYour clear spirit will bring you\nmany victories.\n\nBut don't get cocky. Shadow creeps\nin when you get overconfident.\n\nIf the shadow ever leads you astray,\ncome and play me again.\n\nWe'll clear our spirits together!",
  },
  '6714': {
    es: 'Mmm... Siento mucha duda en tu\ncorazón. Por ahí entra la sombra.\n\nDesafíame cuantas veces quieras.\n¡Limpiaremos juntos el espíritu!\n\nSiempre te estaré esperando aquí.',
    en: "Hmm... I sense much doubt in your\nheart. That is how the shadow gets in.\n\nChallenge me as often as you like.\nWe'll clear our spirits together!\n\nI will always be waiting here.",
  },
  '6890': D.alazan,

  // Custodio, keeper of order
  '6A28': { es: 'Yo mantengo el orden en este mundo.\n\n¡Mi luz detendrá a todo jugador\nde corazón oscuro!', en: 'I keep order in this world.\n\nMy light will stop every player\nwith a dark heart!' },
  '6B18': { es: 'Es hora de combatir.\n¿Empezamos?', en: 'It is time to battle.\nShall we begin?' },
  '6BAC': { es: 'Libérate de la oscuridad.', en: 'Rid yourself of darkness.' },
  '6C20': { es: 'Imagina una luz que brilla\nen tu corazón.', en: 'Imagine a light shining\nin your heart.' },
  '6CD4': {
    es: 'La luz de tu corazón... ¡es real!\n\nNo dudaste ni un instante\nen toda la batalla.\n\nPor eso ganaste.\n\nAyúdame a mantener el orden\nen este mundo.\n\nSeguro que tus batallas llevarán\ntu luz a muchas criaturas más.\n\n¡Te deseo suerte!',
    en: "The light in your heart... It's real!\n\nYou didn't hesitate once\nin the whole battle.\n\nThat is why you won.\n\nI want your help in keeping\norder in this world.\n\nI'm sure your battles will carry\nyour light to many more creatures.\n\nI wish you luck!",
  },
  '7068': {
    es: 'Si dudas, pierdes.\n\nLa sombra se mete por cualquier\nduda que encuentre en ti.\n\nDespeja tu mente al jugar.\nPuedes desafiarme cuando quieras.',
    en: "You'll lose if you hesitate.\n\nThe shadow slips in through any\ndoubt it finds in you.\n\nClear your mind when you play.\nI'm ready to battle anytime.",
  },
  '71D8': D.custodio,

  // Serafín, Bollo's highest shape
  '7370': { es: 'Mis alas de oro limpian toda sombra.\nNo tienes nada que temer...\n\nSi tu espíritu es puro,\nestas alas te protegerán.', en: 'My golden wings cleanse all shadow.\nYou have nothing to fear...\n\nIf your spirit is pure,\nthese wings will protect you.' },
  '7480': { es: '¿Seguro que quieres enfrentarme?', en: 'Are you sure you want to face me?' },
  '7508': { es: '¡Confía en tu instinto!', en: 'Trust your instincts!' },
  '7574': { es: '¡Que la sombra caiga ante la justicia!', en: 'Let the shadow fall before justice!' },
  '7624': {
    es: 'Encontré una nueva luz en este mundo.\nNo tengo nada más que decir.\n\nSigue tu propio camino.\nAlgún día hallarás la respuesta.\n\nBusca más luz en nuestras batallas.',
    en: 'I have found a new light in this world.\nI have nothing more to say.\n\nKeep walking your own path.\nSomeday you shall find the answer.\n\nFind more light in our battles.',
  },
  '799C': {
    es: 'Una niebla gris acecha a este mundo.\nNecesitamos tu fuerza.\n\nNo hay tiempo que perder.\nEste mundo necesita una nueva luz.\n\nDesafíame otra vez y vénceme\nla próxima. ¡Muéstrame tu fuerza!',
    en: 'A grey fog stalks this world.\nWe need your strength.\n\nThere is no time to waste.\nThis world needs a new light.\n\nChallenge me again, and beat me\nnext time. Show me your strength!',
  },
  '7B40': D.serafin,

  // the Blot, a creature that lost its shape
  '7D0C': {
    es: '¿Qué sabes tú del dolor de los\nque no pudieron evolucionar?\n\n¡Lo desprecio todo!\n\nMi rencor no va a parar hasta\nque borre todo lo de este mundo.',
    en: "What do you know of the pain\nof those who could never evolve?\n\nI despise everything!\n\nMy hatred won't stop until\nI erase everything in this world.",
  },
  '7E7C': { es: '¿Adónde... voy...?\n\n¿Encontraré por fin la paz?\n\n¿O me tragará más rencor?\n\nNo lo sé...', en: 'Where... am I... going?\n\nWill I finally find peace?\n\nOr will more hatred swallow me?\n\nI do not know...' },
  '7FBC': { es: '¿Crees que puedes vencerme?', en: 'Do you think you can beat me?' },
  '8054': { es: '¿Te echas atrás?\nYa volverás...', en: 'Backing down?\nYou will be back...' },
  '80B8': { es: '¡Que te trague mi rencor!', en: 'Be swallowed by my hatred!' },
  '8154': {
    es: 'Ohhh, me desvanezco...\n¿Desaparecerá también mi rencor?\n\n¿Me salvaré ahora?\nNo lo sé...\n\n¿Adónde... voy...?\n\n¿Me espera la paz allí?\n\n¿O me tragará más rencor?\n\nNo lo sé...',
    en: "Ohhh, I'm fading...\nWill my hatred disappear, too?\n\nWill I be saved now?\nI don't know...\n\nWhere... am I... going?\n\nIs peace waiting for me there?\n\nOr will more hatred swallow me?\n\nI do not know...",
  },
  '866C': {
    es: '¡Oh, el rencor crece dentro de mí!\nNo lo puedo contener.\n\nDebo librarme de él, ¡y cubrir\neste mundo de gris!\n\nHaré que todos sientan mi dolor.\n\n¡Siente mi dolor! ¡Siente mi angustia!\n\n¡Esta es la venganza de los que\nse quedaron atrás!',
    en: "Oh, the hatred inside me is growing!\nI can't contain it.\n\nI must rid myself of it, and cover\nthis world in grey!\n\nI will make everyone feel my pain.\n\nFeel my pain! Feel my agony!\n\nThis is the revenge of those\nwho were left behind!",
  },
  '88B0': blotDeck,

  // a stranger with no name, who keeps asking the player for help, warns about "him"
  '895C': {
    es: 'Ah, eres tú.\nGracias por salvar a Ventisca.\n\nTambién venciste al Coleccionista\nen Ciudad sin Faroles.\n\n¿Y qué fue del Coleccionista?',
    en: "Oh, it's you.\nThank you for saving Ventisca.\n\nYou also defeated the Collector\nin Lampless City.\n\nSo, what became of the Collector?",
  },
  '8A98': { who: 'me', es: '...', en: '...' },
  '8AE4': { es: '¿No me lo quieres contar?', en: "You don't want to tell me?" },
  '8B48': { who: 'me', es: 'Siempre me pides cosas,\npero ¿quién eres?', en: 'You keep asking things of me,\nbut who are you?' },
  '8BCC': { es: 'Mmm, bueno...\n\nTodavía no te lo puedo decir.\n\nPero hay algo seguro.\n\n"Él" podría aparecer.', en: "Hmm, well...\n\nI can't tell you yet.\n\nBut one thing is certain.\n\n\"He\" may show up." },
  '8CE0': { who: 'me', es: '¿"Él"?\n¿De qué hablas?', en: '"He"?\nWhat are you talking about?' },
  '8D5C': {
    es: 'Perdona, de verdad no puedo decirlo.\nNo sé si sería prudente.\n\nPero "él" es temible...\n\n"Él" puede aparecer en cualquier parte.\nUsa un mazo maldito, hecho de sombra.\n\n"Él" engaña a los demás para\ndestruir las Tierras Quietas.',
    en: "I'm sorry, but I really can't say.\nI'm not sure it would be wise.\n\nBut \"he\" is a terrifying one...\n\n\"He\" can show up anywhere. \"He\" uses\na cursed deck made of shadow.\n\n\"He\" deceives others in order\nto destroy the Quiet Lands.",
  },
  '8F48': { who: 'me', es: '¿Qué? ¿Y por qué querría eso?', en: 'What? Why would he want that?' },
  '8FAC': { es: '¡Eres nuestra única esperanza!', en: 'You are our only hope!' },
  '900C': { who: 'me', es: '¿Eh?', en: 'Huh?' },
  '9058': { es: `${strangerTrain.es}\n\nAdiós. Espero que\nnos volvamos a ver.`, en: `${strangerTrain.en}\n\nGoodbye. I look forward\nto seeing you again.` },
  '9238': { who: 'me', es: '¡Espera...!', en: 'Wait...!' },
  '93F0': strangerTrain,
  '957C': thornDeck,
};

export const CITY07: CityTexts = { ...CAFE, ...CITY07_LATER };
