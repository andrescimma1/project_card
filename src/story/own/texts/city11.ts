/**
 * Torre sin Fin (city 11), the final chapter. The tower that appeared on the lake: grey fog, floors without
 * end, and alarms that sound like the tower itself talking. Ravenous Mortaja wants every shape to go grey
 * and quiet; his tower holds Colmillo, Tres Llaves, Marejada and Engranaje in the first arena. When he
 * falls, a voice without a face (the one Madreselva warned about) tries to take the tower. Madreselva, who
 * was really the guardian of the Archive wearing a borrowed shape, sets her trap: the player beats «A» at
 * cards and she takes him beyond the fog, never to return.
 * After the ending, the tower's residents stay as rivals (city11later.ts).
 */
import { CITY11_LATER, DECKS, MAREJADA, MORTAJA } from './city11later';
import type { CityTexts, Written } from './types';

const me = (es: string, en: string): Written => ({ who: 'me', es, en });
const deck = (es: string, en: string): Written => ({ who: null, es, en });
const madreselva = me('Madreselva...', 'Madreselva...');

const FINAL: CityTexts = {
  // Ravenous Mortaja, at the café: too much color in this world
  '2A24': { es: 'Soy Mortaja Voraz.\nVine a apagar los colores\nde este mundo.', en: 'I am Ravenous Mortaja.\nI came to put out the colors\nof this world.' },
  '2AB0': me('¡Este mundo no necesita tu gris!', "This world doesn't need your grey!"),
  '2B10': {
    es: 'Hay demasiado color en este mundo.\nDemasiadas formas, demasiado ruido.\n\nMi niebla lo va a cubrir todo.\nTodo será gris y quieto.',
    en: "There's too much color in this world.\nToo many shapes, too much noise.\n\nMy fog will cover everything.\nAll of it, grey and still.",
  },
  '2BFC': me('¿¡Qué tonterías dices!?\n¡No voy a dejar que lo borres!', "What nonsense is that!?\nI won't let you erase it!"),
  '2C90': {
    es: 'Ja, ja, ja...\n\n¿A ti te mandó la Torre del Archivero?\n¡Qué decepción!\n\n¿Y qué piensas hacer?\n¿Te crees muy fuerte?\n\nPor más que lo intentes,\nla niebla nunca se irá.\n\nJa, ja, ja...',
    en: "Ha ha ha...\n\nThe Archivist's Tower sent you?\nHow disappointing!\n\nAnd what will you do?\nYou think you're so strong?\n\nTry all you like,\nthe fog will never go away.\n\nHa ha ha...",
  },
  '3068': {
    es: 'Ja, ja, ja...\n\nAsí que a ti te mandaron\ndesde la Torre del Archivero.\n¡Qué poca cosa!\n\n¿Qué piensas hacer?\n¿De verdad crees que puedes ganarme?\n\nPor más que lo intentes,\nla niebla nunca se irá.\n\nJa, ja, ja...',
    en: "Ha ha ha...\n\nSo you're the one the Archivist's\nTower sent? How unimpressive!\n\nWhat will you do?\nDo you really think you can beat me?\n\nTry all you like,\nthe fog will never go away.\n\nHa ha ha...",
  },

  // the first arena: Colmillo
  A7B8: {
    es: 'Soy Colmillo. ¿Y tú quién eres?\n\nJe, je, je... Interesante.\n\nTe voy a embestir tan fuerte que\nno sabrás ni qué te pasó.\n\nJe, je, je...',
    en: "I'm Colmillo. And who are you?\n\nHeh heh heh... Interesting.\n\nI'll ram you so hard you won't\neven know what happened.\n\nHeh heh heh...",
  },
  A9B8: { es: '¿Te atreves a pelear conmigo?', en: 'Do you dare to fight me?' },
  AA48: { es: 'Je, je, je... ¡Gallina!', en: 'Heh heh heh... Chicken!' },
  AAB0: { es: '¡Venir aquí fue tu peor idea!', en: 'Coming here was your worst idea!' },
  AB54: {
    es: 'Parece que en la Torre del Archivero\nno son tan tontos.\n\nMandaron a alguien con fuerza\nde verdad.\n\nPero no te creas tanto por ganarme.\nMás arriba te esperan otros\nmucho más fuertes.\n\nJe, je, je...',
    en: "Looks like the Archivist's Tower\nisn't so foolish after all.\n\nThey sent someone with\nreal strength.\n\nBut don't get cocky because you beat me.\nHigher up, much stronger ones\nare waiting for you.\n\nHeh heh heh...",
  },
  AD40: {
    es: 'Je, je, je...\n\nEn la Torre del Archivero\nse equivocaron al mandarte.\n\nCon eso no pasas de esta Arena.\n\nLa niebla ya manda en este mundo.\n\nJe, je, je...',
    en: "Heh heh heh...\n\nThe Archivist's Tower made a mistake\nsending you here.\n\nWith skills like that, you'll never\nget past this Arena.\n\nThe fog already rules this world.\n\nHeh heh heh...",
  },
  AF08: DECKS.colmillo,

  // Tres Llaves, the keeper of the floors
  B060: {
    es: 'Qué raro, una visita...\n¿Qué te trae a mis pisos?\n\n¿Vienes a desafiarme?\nTengo tres llaves para tres puertas...\n\n...y una hoz para quien se cuela.\nDe mis pisos nadie sale sin permiso.',
    en: "How odd, a visitor...\nWhat brings you to my floors?\n\nHere to challenge me?\nI have three keys for three doors...\n\n...and a sickle for intruders.\nNo one leaves my floors unless I say so.",
  },
  B270: { es: '¿De verdad quieres pelear conmigo?', en: 'Do you really want to fight me?' },
  B304: { es: 'Ja, ja, ja. Bien pensado.\nCorre mientras la puerta siga abierta.', en: 'Ha ha ha. Wise choice.\nRun while the door is still open.' },
  B39C: { es: 'Ya cerré la puerta detrás de ti.', en: "I've already locked the door behind you." },
  B434: {
    es: '¡No puede ser!\n¿Quién eres, en realidad?\n\nEsto no se va a quedar así.\n\n¡No acepto esta derrota!\n¡Exijo la revancha!\n\nNo hay puerta que te esconda de mí.\nTengo las tres llaves.\n\nTarde o temprano, te encontraré.',
    en: "This can't be!\nWho are you, really?\n\nThis isn't over.\n\nI refuse to accept this defeat!\nI demand a rematch!\n\nNo door can hide you from me.\nI hold all three keys.\n\nSooner or later, I'll find you.",
  },
  B630: {
    es: '¿Qué tal se siente quedar bajo llave?\n\nEspero que hayas aprendido la lección.\nAhora, fuera de aquí.\n\nMandar a alguien tan débil...\n¿Es una broma?\n\nEste mundo ya es nuestro.\n\n¡Ja, ja, ja, ja!',
    en: "How does it feel to be locked in?\n\nI hope you've learned your lesson.\nNow get out of here.\n\nSending someone so weak...\nIs this a joke?\n\nThis world is ours now.\n\nHa ha ha ha!",
  },
  B80C: DECKS.tresLlaves,

  // Marejada, the tide sentinel
  B934: {
    es: 'Alerta de marea.\nAlgo se mueve en el agua.\n\nRastreando...\nObjetivo a la vista.\n\nCorriente fijada.\nComienza el oleaje.',
    en: 'Tide alert.\nSomething is moving in the water.\n\nTracking...\nTarget in sight.\n\nCurrent locked.\nThe swell begins.',
  },
  BB4C: MAREJADA.ask,
  BBE8: MAREJADA.no,
  BC58: MAREJADA.yes,
  BCF0: MAREJADA.won,
  BF74: MAREJADA.lost,
  C0AC: DECKS.marejada,

  // Engranaje grinds shapes until they are grey
  C1D0: {
    es: 'Soy Engranaje.\n\nArmé un ejército de máquinas\npara moler todas las formas\nde este mundo.\n\n¡Hasta dejarlas grises y quietas!\n\nY para terminar el trabajo,\n¡disparo mi Cañón sin Fin!',
    en: "I am Engranaje.\n\nI built an army of machines\nto grind down every shape\nin this world.\n\nUntil they're all grey and still!\n\nAnd to finish the job,\nI'll fire my Endless Cannon!",
  },
  C444: { es: '¿Quieres que te muela a ti también?', en: 'Do you want to be ground down, too?' },
  C4E4: { es: 'No hay dónde esconderse.\nMis máquinas lo cubren todo.', en: "There's nowhere to hide.\nMy machines cover everything." },
  C558: { es: '¡Lo voy a moler todo!', en: "I'll grind it all down!" },
  C5FC: {
    es: '¡Aaargh! ¿Cómo pude perder\ncontra alguien como tú?\n\n¡Nooo! ¡El amo Mortaja Voraz\nse va a enfurecer! ¡Tengo que huir!\n\nHaz lo que quieras.\nYo me retiro.\n\nAaargh...',
    en: "Aaargh! How could I lose\nto someone like you!?\n\nNooo! Master Ravenous Mortaja\nwill be furious! I have to run!\n\nDo whatever you want.\nI'm done here.\n\nAaargh...",
  },
  C7B8: { es: '¡A moler! ¡A moler todo!\nYa no me puedes detener.\n\nSiéntate y mira cómo mi ejército\nhace su trabajo.\n\n¡El gris me espera!', en: "Grind! Grind it all!\nYou can't stop me now.\n\nSit back and watch my army\ndo its job.\n\nThe grey awaits me!" },
  C90C: DECKS.engranaje,

  // Ravenous Mortaja, at the top of the first arena
  CA70: {
    es: 'Todo color termina en gris.\nEsa es la ley de este mundo.\n\nNi siquiera tú puedes cambiarla.\nNada escapará de mi niebla.\n\nResistirse no sirve de nada.\nJa, ja, ja.',
    en: 'Every color ends up grey.\nThat is the law of this world.\n\nNot even you can change it.\nNothing will escape my fog.\n\nResisting is pointless.\nHa ha ha.',
  },
  CBEC: me('¡No! ¡No te creo nada!\n\n¡Voy a acabar con tu niebla!', "No! I don't believe a word you say!\n\nI'm going to put an end to your fog!"),
  CCA4: { es: '¡Ja, ja, ja!\n\nComo quieras. Entonces te mostraré\nlo poco que puedes hacer.\n\n¡Te vas a arrepentir!\n\n¡Ja, ja, ja!', en: "Ha ha ha!\n\nAs you wish. Then I'll show you\nhow little you can do.\n\nYou'll regret this!\n\nHa ha ha!" },
  CEA0: { es: '¿Todavía piensas resistirte?', en: 'Do you still intend to resist?' },
  CF40: { es: '¡Ja, ja, ja! Sabia decisión.\nParece que por fin lo entiendes.', en: 'Ha ha ha! A wise choice.\nIt seems you finally understand.' },
  CFF0: MORTAJA.show,
  D0B4: {
    es: 'Hice todo lo que pude.\n\nPero no creas que acepto la derrota.\n\nPor más que lo intentes,\nnunca borrarás el gris.\n\nJa, ja, ja...\n\nLo que haces solo retrasa\nlo inevitable.\n\nMientras quede un poco de gris,\nla niebla volverá.\n\nMe basta con esperar.\n\nNos volveremos a ver...\n\nJa, ja, ja...',
    en: "I gave it everything I had.\n\nBut don't think I accept defeat.\n\nNo matter how hard you try,\nyou'll never wipe out the grey.\n\nHa ha ha...\n\nAll you're doing is putting off\nthe inevitable.\n\nAs long as a little grey remains,\nthe fog will return.\n\nAll I have to do is wait.\n\nWe shall meet again...\n\nHa ha ha...",
  },

  // the tower breaks: Mortaja's voice repeats, the tower locks itself, and a voice without a face appears
  D4C0: {
    es: 'Lo que haces solo retrasa\nlo inevitable.\n\nLo que haces solo retrasa\nlo inevitable.\n\nJa, ja, ja... Ja...\n\nJa, ja...\nja... ja...',
    en: "All you're doing is putting off\nthe inevitable.\n\nAll you're doing is putting off\nthe inevitable.\n\nHa ha ha... Ha...\n\nHa ha...\nha... ha...",
  },
  D650: me('¿Qué le pasa? Repite lo mismo\nuna y otra vez.', 'What is going on? He keeps\nsaying the same thing.'),
  D718: me('¿¡Qué está pasando!?', "What's happening!?"),
  D778: { es: '*c6Cierre de la torre en 2 segundos.', en: '*c6Tower lockdown in 2 seconds.' },
  D7DC: {
    who: null,
    es: '*c2...............................\n*c2...............................\n*c2...............................\n\n*c2...............................\n*c2...............................\n*c2...............................',
    en: '*c2...............................\n*c2...............................\n*c2...............................\n\n*c2...............................\n*c2...............................\n*c2...............................',
  },
  D9DC: {
    es: '*c6¡Alto!\n*c6Rayos... ¡la torre se me escapa!\n\n*c6¡No encuentro ninguna puerta abierta!\n\n*c6¡Deja de resistirte!',
    en: "*c6Stop!\n*c6Blast... the tower is slipping away!\n\n*c6I can't find a single open door!\n\n*c6Stop resisting!",
  },
  DAEC: me('¿Qué...? ¿Quién está ahí?', "What...? Who's there?"),
  DB40: { es: '*c6¿Y tú quién eres...?', en: '*c6And who are you...?' },
  DBA0: me('¡...!\n\n(¿Será posible...?)\n\n(¿Será... «él»?)', '...!\n\n(Could it be...?)\n\n(Could it be... “him”?)'),
  DC64: { es: '*c6¡Tú, silencio!', en: '*c6You! Quiet!' },
  DCC0: me('¿¡Qué haces aquí!?\n\nSi planeas algo malo,\n¡no te lo voy a permitir!', "What are you doing here!?\n\nIf you're planning something evil,\nI won't let you get away with it!"),
  DD90: {
    es: '*c6¿Qué? ¿De qué hablas?\n\n*c6¿Tú piensas detenerme a mí?\n*c6¡Ja, ja, ja!\n\n*c6Sin cuerpo, nada me ata\n*c6y nada me detiene.\n\n*c6Pronto esta torre será mía.\n*c6Es cuestión de tiempo.\n\n*c6¡Y en esta torre el tiempo no se acaba!\n\n*c6Con la torre en mis manos,\n*c6tendré todas las formas del mundo.',
    en: "*c6What? What are you talking about?\n\n*c6You intend to stop me?\n*c6Ha ha ha!\n\n*c6Without a body, nothing binds me\n*c6and nothing stops me.\n\n*c6Soon this tower will be mine.\n*c6It's only a matter of time.\n\n*c6And in this tower, time never runs out!\n\n*c6With the tower in my hands,\n*c6every shape in the world will be mine.",
  },
  E03C: me('¡Lo sabía! ¡Tramas algo malo!\n¡Te voy a detener!', "I knew it! You're up to something evil!\nI'm going to stop you!"),
  E0C8: {
    es: '*c6¿Me estás desafiando?\n*c6¡Ja, ja, ja, ja! ¡Ja, ja, ja, ja!\n\n*c6¡Qué gracioso! ¡Muy gracioso!\n\n*c6Está bien. Aquí todo se decide\n*c6con cartas, ¿no?\n\n*c6Acepto tu desafío.\n*c6Adelante, intenta ganarme.\n\n*c6Que sea entretenido.\n*c6Mi tiempo es valioso.\n\n*c6Espero que estés a la altura.\n\n*c6Nunca vas a ganar. Y aunque ganes,\n*c6nada va a cambiar.',
    en: "*c6Are you challenging me?\n*c6Ha ha ha ha! Ha ha ha ha!\n\n*c6How funny! Very funny!\n\n*c6Fine. Here everything is settled\n*c6with cards, isn't it?\n\n*c6I accept your challenge.\n*c6Go ahead, try to beat me.\n\n*c6Make it entertaining.\n*c6My time is precious.\n\n*c6I hope you're up to it.\n\n*c6You'll never win. And even if you do,\n*c6nothing will change.",
  },
  E3F0: {
    es: '*c6Te doy tiempo para preparar\n*c6tus mazos. Vuelve cuando quieras.\n\n*c6¡Arma un mazo poderoso\n*c6antes de volver!',
    en: "*c6I'll give you time to fix\n*c6your decks. Come back when ready.\n\n*c6Build a powerful deck\n*c6before you return!",
  },
  E4E4: { es: '*c6¡Ja, ja, ja, ja!', en: '*c6Ha ha ha ha!' },
  E560: {
    es: '¡Ja, ja, ja!\n\n¿Ves lo poco que puedes hacer?\nNo puedes cambiar nada.\n\nNo hay esperanza para ti.\n\nSiéntate y mira cómo la niebla\nse traga este mundo.\n\nEs lo único que te queda.\n\n¡Ja, ja, ja!',
    en: "Ha ha ha!\n\nDo you see how little you can do?\nYou can't change a thing.\n\nThere's no hope for you.\n\nSit back and watch the fog\nswallow this world.\n\nThat's all you have left.\n\nHa ha ha!",
  },
  E794: me('¡No me voy a rendir!\n\n¡No llegué hasta aquí para nada!\n¡Nunca me voy a rendir!', "I won't give up!\n\nI didn't come this far for nothing!\nI'll never give up!"),
  E85C: DECKS.mortaja,

  // while «A» holds the tower, the way out is closed
  '19690': { es: '*c6Error de la torre: piso 5128 sin salida.', en: '*c6Tower error: floor 5128 has no exit.' },
  '196D4': { es: '*c2¡Alerta!*c6 No se puede abrir la puerta.', en: '*c2Warning!*c6 The door cannot be opened.' },
  '19730': { es: '*c6Error de la torre: piso 5128 sin salida.', en: '*c6Tower error: floor 5128 has no exit.' },
  '19774': { es: '*c2¡Alerta!*c6 La niebla cierra el camino.', en: '*c2Warning!*c6 The fog blocks the way.' },

  // Madreselva explains who «A» is, and who she really is
  '161FC': me(
    '¡Madreselva, escucha!\n¡Pasó algo terrible!\n\nApareció alguien en la Arena.\nCreo que es «él».\n\n¡El de quien me hablaste!',
    "Madreselva, listen!\nSomething terrible happened!\n\nSomeone appeared at the Arena.\nI think it's “him”.\n\nThe one you told me about!",
  ),
  '16334': {
    es: 'Tranquilidad, *h0.\nTienes razón... Es «él».\n\n«Él» es una de las sombras\nmás hondas que esconde la niebla...\n\nLo llamamos «A».',
    en: "Stay calm, *h0.\nYou're right... It's “him”.\n\n“He” is one of the deepest shadows\nhidden in the fog...\n\nWe call him “A”.",
  },
  '16474': me('¿«A»...?', '“A”...?'),
  '164C8': {
    es: 'Así es... «A» fue una persona.\nVivió aquí hace mucho, cuando\nlas personas todavía estaban.\n\nHizo mucho daño en ese tiempo,\npero alguien muy valiente lo venció.\n\nLo dejaron dormido, encerrado\nen el fondo del lago.\nO eso se contaba...\n\nPero su voluntad siguió creciendo.\nCuando nos dimos cuenta, ya era tarde.\n\nSu voluntad dejó atrás su cuerpo\ny salió del lago.\n\nDesde entonces, «A» acecha\nlas Tierras Quietas.\n\nYo lo vigilaba de cerca,\nbuscando cómo frenarlo.\n\nPero sabía que con fuerza\nno se lo puede vencer.\n\nPor eso preparé una trampa\nen la Arena de esta torre.\n\nSe activa si «A» pierde\nuna batalla de cartas.\n\nSi alguien le gana, «A» pierde\ntodo su poder... y ya no podrá\ntocar la torre nunca más.\n\nY tú lograste que aceptara\njugar contra ti.\n\nPero ya tiene casi toda la torre\nen sus manos...\n\nY seguro va a usar su mazo especial,\nel *c3Mazo Ola Gris*c7.\n\nEstá lleno de cartas poderosísimas.\n\nY lo peor: es un mazo que no se baraja.\nSus cartas salen en el orden\nque más le conviene.\n\nEs un mazo tramposo,\ncon combinaciones terribles.\nEs fuerte en cualquier mano...\n\n...y en manos de «A»,\nparece invencible.\n\nNo llegaste aquí por casualidad.\nEste camino era para ti.\n\nSé que puedes vencerlo...\n¡Estoy segura de que puedes!',
    en: "That's right... “A” was a person.\nHe lived here long ago, when\npeople were still around.\n\nHe did great harm back then,\nbut someone very brave defeated him.\n\nHe was put to sleep and locked away\nat the bottom of the lake.\nOr so the story went...\n\nBut his will kept growing.\nBy the time we noticed, it was too late.\n\nHis will left his body behind\nand crawled out of the lake.\n\nEver since, “A” has been stalking\nthe Quiet Lands.\n\nI kept a close watch on him,\nlooking for a way to stop him.\n\nBut I knew strength alone\ncould never beat him.\n\nSo I set a trap\nin the Arena of this tower.\n\nIt springs if “A” loses\na card battle.\n\nIf someone beats him, “A” loses\nall his power... and he can never\ntouch the tower again.\n\nAnd you got him to agree\nto play against you.\n\nBut he already holds\nalmost the whole tower...\n\nAnd he's sure to use his special deck,\nthe *c3Grey Wave Deck*c7.\n\nIt's full of incredibly powerful cards.\n\nWorst of all, it's never shuffled.\nHis cards come out in whatever\norder suits him best.\n\nIt's a cheating deck with terrible\ncombos. It's strong in any hands...\n\n...and in the hands of “A”,\nit seems unbeatable.\n\nYou didn't come here by chance.\nThis path was meant for you.\n\nI know you can beat him...\nI'm sure you can!",
  },
  '17088': madreselva,
  '170D8': {
    es: '*h0... Hay algo...\n\n...que tengo que decirte...\n\nEn realidad, no soy Madreselva.\n\nTomé prestada su forma por un tiempo\npara engañar a «A».\n\nSoy la guardiana del Archivo,\nel registro de todas las formas...\nNi siquiera soy una criatura.\n\nPerdóname por engañarte\ntodo este tiempo.\n\nPero era verdad que quería\nseguir hablando contigo.\n\nDe verdad quería hablar más contigo.\n\nSé que no es fácil para ti,\npero cuento contigo.',
    en: "*h0... There's something...\n\n...I have to tell you...\n\nThe truth is, I'm not Madreselva.\n\nI borrowed her shape for a while\nto deceive “A”.\n\nI'm the guardian of the Archive,\nthe record of every shape...\nI'm not even a creature.\n\nForgive me for deceiving you\nall this time.\n\nBut it was true that I wanted\nto keep talking with you.\n\nI really did want to talk more.\n\nI know this is hard for you,\nbut I'm counting on you.",
  },
  '17434': madreselva,
  '175C8': {
    es: 'Soy la guardiana del Archivo...\nNi siquiera soy una criatura.\n\nPerdóname por engañarte\ntodo este tiempo...\n\nPero era verdad que quería\nseguir hablando contigo.\n\nDe verdad quería hablar más contigo.\n\nSé que no es fácil para ti,\npero cuento contigo.',
    en: "I'm the guardian of the Archive...\nI'm not even a creature.\n\nForgive me for deceiving you\nall this time...\n\nBut it was true that I wanted\nto keep talking with you.\n\nI really did want to talk more.\n\nI know this is hard for you,\nbut I'm counting on you.",
  },
  '17800': deck('*c3Mazo Jardín de Espinas\nUn mazo de tres colores lleno de plantas.\nToda flor tiene sus espinas.', '*c3Thorn Garden Deck\nA three-color deck full of plants.\nEvery flower has its thorns.'),

  // «A», at the arena
  '17A48': { es: '*c6Así que llegaste. Ja, ja, ja...\n*c6No sirve de nada, pero jugaré contigo.', en: "*c6So, you made it. Ha ha ha...\n*c6It's pointless, but I'll play you." },
  '17AE0': me('¡Le prometí a Madreselva\nque vencería a «A»!\n\n¡No voy a perder!', 'I promised Madreselva\nthat I would defeat “A”!\n\nI will not lose!'),
  '17B98': {
    es: '*c6¿Tú... me llamaste «A»...?\n\n*c6Parece que alguien anda metiendo\n*c6las narices donde no debe... ¡Ja!\n\n*c6¡Cuando la torre sea mía, borraré\n*c6a los guardianes del Archivo!',
    en: "*c6You... You called me “A”...?\n\n*c6Seems someone's been sticking\n*c6their nose in my business... Hah!\n\n*c6Once the tower is mine, I'll erase\n*c6the guardians of the Archive!",
  },
  '17CE8': me('¡No! ¡No te lo voy a permitir!', "No! I won't let you!"),
  '17D44': {
    es: '*c6¡Ja! ¿Y qué vas a hacer? ¿Detenerme?\n\n*c6¡Lo único que sabes son trucos\n*c6de cartas!\n\n*c6Aunque me ganes una partida,\n*c6nada va a cambiar.',
    en: "*c6Hah! And what will you do? Stop me?\n\n*c6All you know are a few\n*c6card tricks!\n\n*c6Even if you beat me at cards,\n*c6nothing will change.",
  },
  '17E8C': me('¡Basta! ¡Que empiece la batalla!', "Enough! Let's get this battle started!"),
  '17EF4': { es: '*c6¡Ja! Si tanto quieres, juguemos.', en: '*c6Hah! If you insist, let us play.' },
  '17F78': {
    es: '*c6¿Otra vez aquí? No importa.\n*c6En esta torre, el tiempo no se acaba.\n\n*c6Pero nunca me vas a vencer.',
    en: "*c6Back again? It doesn't matter.\n*c6In this tower, time never runs out.\n\n*c6But you will never defeat me.",
  },
  '180F0': { es: '*c6¿Todavía quieres intentarlo...?', en: '*c6Do you still want to try...?' },
  '18184': { es: '*c6Ya lo ves: no puedes hacer nada.', en: "*c6You see? There's nothing you can do." },
  '181F4': { es: '*c6¡Ja, ja, ja, ja!', en: '*c6Ha ha ha ha!' },

  // the player beats «A» and Madreselva's trap closes
  '1827C': { es: '*c6¿¡Qué...!?', en: '*c6What...!?' },
  '182D4': { es: '*c6Movimiento no autorizado en la torre.', en: '*c6Unauthorized move inside the tower.' },
  '18314': { es: '*c6Ese piso no existe.', en: '*c6That floor does not exist.' },
  '18364': { es: '*c6¡Aaargh!\n*c6¡Nooooo!', en: '*c6Aaargh!\n*c6Nooooo!' },
  '183D4': { es: '*c6Cerrando el piso actual.', en: '*c6Closing the current floor.' },
  '18428': { es: '*c6¡NO! ¡La torre se me escapa!\n\n*c6¡No te lo voy a permitir...!', en: "*c6NO! The tower is slipping away!\n\n*c6I won't let you...!" },
  '184E0': { es: '*c6Se recibió una orden...', en: '*c6Order received...' },
  '18518': { es: '*c2¡Alerta!*c6 Orden no válida.', en: '*c2Warning!*c6 Invalid order.' },
  '18568': { es: '*c6¿¡Otra vez el mismo piso!?\n*c6¿Por qué?', en: '*c6The same floor again!?\n*c6Why?' },
  '185D0': { es: 'Porque ahora estás en mi jardín.', en: "Because you're in my garden now." },
  '18648': me('¡Madreselva!', 'Madreselva!'),
  '18694': { es: '*c6¡Tú eres la guardiana del Archivo!', en: "*c6You must be the Archive's guardian!" },
  '186FC': {
    es: 'Encerré tu piso dentro de mi jardín.\nNo tienes salida.\n\nSolo puedes subir y bajar\nlas mismas escaleras, para siempre.',
    en: "I've shut your floor inside my garden.\nThere's no way out.\n\nAll you can do is climb up and down\nthe same stairs, forever.",
  },
  '187FC': { es: '*c6Esa batalla de cartas...\n*c6¿¡Era una trampa!?', en: '*c6That card battle...\n*c6It was a trap!?' },
  '18868': { es: 'Era mi única oportunidad.\n*h0, ¡lo lograste!\n\nGracias por tu coraje.', en: 'It was my only chance.\n*h0, you did it!\n\nThank you for being so brave.' },
  '18934': me('¡No fue nada!\nMadreselva, ¿¡dónde estás!?', 'It was nothing!\nMadreselva, where are you!?'),
  '189A8': {
    es: 'Lo siento... Ya le devolví su forma\na Madreselva.\n\nYa no puedo verte cara a cara.',
    en: "I'm sorry... I've already given\nMadreselva her shape back.\n\nI can't see you face to face anymore.",
  },
  '18A9C': { es: '*c6¡Guardiana molesta!\n*c6¿¡Crees que me atrapaste!?\n\n*c6¡Te voy a borrar!', en: "*c6You pesky guardian!\n*c6You think you've caught me!?\n\n*c6I will erase you!" },
  '18B68': {
    es: 'Ja, ja, ja, ja...\n\nSabía que lo intentarías. Por eso...\n\n...¡me voy a llevar a los dos lejos\nde las Tierras Quietas,\nmás allá de la niebla!',
    en: "Ha ha ha ha...\n\nI knew you'd try that. That's why...\n\n...I'm taking us both away\nfrom the Quiet Lands,\nbeyond the fog!",
  },
  '18C88': { es: '*c6¿¡Qué!?', en: '*c6What!?' },
  '18CD4': me('¿Qué?', 'What?'),
  '18D1C': { es: '*c6¡No! ¡Alto! ¡No lo hagas!\n*c6¡No quiero volver allá!\n\n*c6¡Por favor! ¡Detente!', en: "*c6No! Stop! Don't do it!\n*c6I don't want to go back there!\n\n*c6Please! Stop!" },
  '18DEC': me('¡Madreselva!', 'Madreselva!'),
  '18E38': {
    es: 'Me alegra que me llamaras así\nhasta el final...\n\nQuisiera hablar más, pero tengo\nque llevarme lejos a este monstruo.\n\nAdonde va, no hay camino de regreso.\n\nAsí que...\nesto es un adiós.',
    en: "I'm glad you called me by that name\nuntil the end...\n\nI wish we could talk more, but I have\nto take this monster far away.\n\nWhere he's going, there's no way back.\n\nSo...\nthis is goodbye.",
  },
  '18FE8': me('¿¡De verdad tienes que irte!?\n¡Espera!', 'Do you really have to go!?\nWait!'),
  '19054': { es: 'Adiós... *h0...\n\nJa, ja, ja, ja...', en: 'Goodbye... *h0...\n\nHa ha ha ha...' },
  '190E4': me('¡¡Madreselva!!', 'Madreselva!!!'),
  '1913C': { es: '*c2¡Aaaaaaah!', en: '*c2Aaaaaargh!' },
  '19194': madreselva,

  // the player loses to «A»
  '19210': {
    es: '*c6Qué inútil...\n\n*c6Nada cambió.\n*c6Solo perdiste el tiempo.\n\n*c6Ya casi termino. Pronto tendré\n*c6todas las formas en mis manos.\n\n*c6¡Esta vez gano yo!\n\n*c6¡Ja, ja, ja, ja!',
    en: "*c6How futile...\n\n*c6Nothing has changed.\n*c6You only wasted your time.\n\n*c6I'm almost done. Soon I'll hold\n*c6every shape in my hands.\n\n*c6This time, I win!\n\n*c6Ha ha ha ha!",
  },
  '193A4': me('Te volveré a desafiar...\npor Madreselva\ny por las Tierras Quietas.\n\n¡Nunca me voy a rendir!', "I'll challenge you again...\nfor Madreselva and the Quiet Lands.\n\nI will never give up!"),
  '19470': deck('*c3Mazo Ola Gris\nUn mazo maldito, nacido\nde una niebla que nunca termina.', '*c3Grey Wave Deck\nA cursed deck born\nfrom a fog that never ends.'),
};

export const CITY11: CityTexts = { ...FINAL, ...CITY11_LATER };
