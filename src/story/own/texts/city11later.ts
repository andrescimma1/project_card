/**
 * Torre sin Fin, after the ending: Madreselva took «A» beyond the fog and the world is safe, but the tower
 * is still standing on the lake. Its residents stay in the café as rivals; the Jester wants to be the new
 * villain of the world and opens the second arena, Plaga opens the third and the Blot the fourth. Gruñón
 * crossed the fog to pick fights. The decks and some lines are shared with the final chapter (city11.ts).
 */
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });
const me = (es: string, en: string): Written => ({ who: 'me', es, en });

export const DECKS = {
  colmillo: deck('*c3Mazo Embestida\nUn peligroso mazo de la facción Sombría,\nde mucho ataque y fuerza explosiva.', '*c3Rampage Deck\nA dangerous Shadow faction deck,\nbuilt to attack, with explosive power.'),
  tresLlaves: deck('*c3Mazo Hoz y Cerrojo\nUn mazo que te quita HP\nsin parar.', '*c3Sickle and Lock Deck\nA deck that drains your HP\nwithout end.'),
  marejada: deck('*c3Mazo Pleamar\n¡La marea arrastra las cartas\nde tu mano!', '*c3High Tide Deck\nThe tide sweeps away\nthe cards in your hand!'),
  mortaja: deck('*c3Mazo Rey de la Niebla\nUn mazo misterioso\nde la facción Sombría.', '*c3Fog King Deck\nA mysterious deck\nof the Shadow faction.'),
  engranaje: deck('*c3Mazo Ejército de Hierro\nUn ejército de máquinas destructivo.\nRemata con el Cañón sin Fin.', '*c3Iron Army Deck\nA destructive army of machines.\nIt finishes with the Endless Cannon.'),
  casco: deck('*c3Mazo Mar de Fondo\nUn mazo Azul de Perfectos\ncon una defensa durísima.', '*c3Groundswell Deck\nA Blue deck of Apex creatures\nwith an incredibly tough defense.'),
  hilvan: deck('*c3Mazo Teatro de Hilos\nA Hilván le encanta jugar,\npero tal vez le falte práctica.', "*c3String Theater Deck\nHilván loves to play,\nbut may be out of practice."),
  damaNegra: deck('*c3Mazo Flor Negra\nUn mazo Sombrío de apuestas\ncon golpes letales.', '*c3Black Flower Deck\nA Shadow gambling deck\nwith deadly blows.'),
  bufon: deck('*c3Mazo Cuatro Señores\nLleno de los señores de la torre.\n¡Ataca sin dar respiro!', '*c3Four Lords Deck\nFull of the lords of the tower.\nExpect a relentless attack!'),
  mangle: deck('*c3Mazo Raíz sin Fin\nUn mazo que gira muy rápido.\nIntenta vencerlo de un solo golpe.', '*c3Endless Root Deck\nA fast-spinning deck. Try to beat it\nin a single blow, if you can.'),
  plaga: deck('*c3Mazo Cuenta Atrás\nUn mazo que se destruye a sí mismo,\ncapaz de arrasar con el mapa entero.', '*c3Countdown Deck\nA self-destructing deck, strong\nenough to wipe out the whole map.'),
  borron: deck('*c3Mazo Vacío Desesperado\nEl mazo más maligno y poderoso.', '*c3Desperate Void Deck\nThe most evil and powerful deck.'),
  grunon: deck('*c3Mazo Caras Sospechosas\nUn mazo lleno de criaturas\nde muy dudosa reputación.', '*c3Shady Faces Deck\nA deck full of creatures\nof very doubtful reputation.'),
};

/** Marejada talks like the alarms of the tide. */
export const MAREJADA = {
  ask: { es: 'Oleaje listo.\n¿Confirmas el combate?', en: 'Swell ready.\nConfirm battle?' },
  no: { es: 'Combate cancelado.\nLa marea baja.', en: 'Battle cancelled.\nThe tide goes out.' },
  yes: { es: 'Combate confirmado.\nSube la marea.', en: 'Battle confirmed.\nThe tide rises.' },
  won: {
    es: 'Oleaje detenido.\nReiniciando la marea...\nFallo al reiniciar.\n\nRastreando...\nObjetivo perdido.\nPersecución fallida.\n\nNinguna corriente responde.\nMarea muerta.',
    en: 'Swell stopped.\nRestarting the tide...\nRestart failed.\n\nTracking...\nTarget lost.\nPursuit failed.\n\nNo current responds.\nDead tide.',
  },
  lost: { es: 'Rastreo reanudado.\nObjetivo a la vista.\n\nObjetivo hundido.\n\nOleaje completado.', en: 'Tracking resumed.\nTarget in sight.\n\nTarget sunk.\n\nSwell complete.' },
};

/** Ravenous Mortaja: every color ends up grey. */
export const MORTAJA = {
  show: { es: 'Te voy a mostrar\nun mundo sin color.', en: "I'll show you\na world without color." },
  futile: { es: '¿Sigues con tu lucha inútil?', en: 'Still keeping up your useless fight?' },
  understand: { es: 'Ja, ja, ja...\nParece que por fin lo entiendes.', en: 'Ha ha ha...\nIt seems you finally understand.' },
  won: {
    es: 'Basta...\nEste es el límite de mi poder...\n\nPero eso no significa que me rinda.\n\nPor más que lo intentes,\nnunca borrarás el gris.\n\nJa, ja, ja...\n\nLo que haces solo retrasa\nlo inevitable.\n\nMientras quede un poco de gris,\nla niebla volverá.\n\nMe basta esperar en lo más hondo\nde mi torre a que regrese.\n\nNos volveremos a ver...\n\nJa, ja, ja...',
    en: "Enough...\nThis is the limit of my power...\n\nBut that doesn't mean I give up.\n\nNo matter how hard you try,\nyou'll never wipe out the grey.\n\nHa ha ha...\n\nAll you're doing is putting off\nthe inevitable.\n\nAs long as a little grey remains,\nthe fog will return.\n\nI only have to wait, deep in my tower,\nfor it to come back.\n\nWe shall meet again...\n\nHa ha ha...",
  },
  lost: {
    es: 'Ja, ja, ja...\n\n¿Ves lo poco que puedes hacer?\nNo puedes cambiar nada.\n\nTodo es inútil...\n\nSiéntate y mira cómo el gris\nse adueña de este mundo.\n\nEs lo único que puedes hacer...\n\nJa, ja, ja...',
    en: "Ha ha ha...\n\nDo you see how little you can do?\nYou can't change a thing.\n\nIt's all useless...\n\nSit back and watch the grey\ntake over this world.\n\nThat's all you can do now...\n\nHa ha ha...",
  },
};

const casco = {
  intro: {
    es: '¡Ah, por fin fuera del lago!\nAquí hay mucho que hundir.\n\n¡Ja, ja, ja! ¡Voy a llevar\nla tormenta a todas partes!\n\nY para empezar, te hundo a ti,\naprendiz.\n\n¡Ja, ja, ja!',
    en: "Ah, out of the lake at last!\nPlenty to sink around here.\n\nHa ha ha! I'll bring\nthe storm everywhere!\n\nAnd for starters, I'll sink you,\nlittle apprentice.\n\nHa ha ha!",
  },
  ask: { es: '¿Te atreves?', en: 'Do you dare?' },
  yes: { es: '¡Ja, ja, ja! ¡Al agua!', en: 'Ha ha ha! Into the water!' },
};

const hilvan = {
  ask: { es: '¿Empezamos?', en: 'Shall we start?' },
};

const damaNegra = {
  ask: { es: '¿Aceptas tu castigo?', en: 'Will you take your punishment?' },
  no: { es: '¿Tienes miedo?\nClaro que sí.', en: 'Are you scared?\nOf course you are.' },
  yes: { es: '¿Empezamos?', en: 'Shall we begin?' },
};

/** The Jester: a show that never ends. */
const bufon = {
  missing: {
    es: 'Solo quiero darle a este mundo\nalgo que le hace falta...\n\nSi quieres saber más,\nte espero en mi Arena.\n\nAllí lo verás todo.\nJa, ja, ja...',
    en: "I only want to give this world\nsomething it's been missing...\n\nIf you want to know more,\ncome to my Arena.\n\nThere you'll see it all.\nHa ha ha...",
  },
  ask: { es: 'Ven. ¿Subes a mi escenario?', en: 'Come. Will you step onto my stage?' },
  no: { es: 'Ja, ja, ja... Ya es tarde para bajarse.\nMereces un castigo.', en: "Ha ha ha... It's too late to back out.\nYou deserve a punishment." },
  yes: { es: '¡Que empiece la función!\nJa, ja, ja...', en: 'Let the show begin!\nHa ha ha...' },
  won: {
    es: '¡Nooo! ¡No puedo creer que otra vez\nalguien tan joven arruine mis planes!\n\nPero volveré algún día.\n¡Mi ambición nunca morirá!\n\nNuestra función no termina nunca.\n¡Ja, ja, ja, ja, ja!\n\n¡Esto apenas comienza!',
    en: "Nooo! I can't believe someone so young\nis ruining my plans again!\n\nBut I'll be back one day.\nMy ambition will never die!\n\nOur show never ends.\nHa ha ha ha ha!\n\nThis is only the beginning!",
  },
  lost: {
    es: 'Hace mucho, unos aprendices\narruinaron mi gran función.\n\nPero esta vez no dejaré\nque nadie se interponga.\n\nNo permitiré que alguien como tú\nvuelva a arruinar mis planes.\n\n¡Nunca me vencerás!\n\nJa, ja, ja... ¡Este mundo será mío!',
    en: "Long ago, some apprentices\nruined my grand show.\n\nBut this time, I won't let\nanyone get in my way.\n\nI won't let someone like you\nruin my plans again.\n\nYou'll never defeat me!\n\nHa ha ha... This world will be mine!",
  },
};

/** Mangle hisses and speaks in pieces, like roots that keep spreading. */
const mangle = {
  ask: { es: 'Mis raíces...\n¿atraparte ya?', en: 'My roots...\ngrab you now?' },
  no: { es: 'Raíces... cerca de ti.\n¡Sss...!', en: 'Roots... close to you.\nHsss...!' },
  yes: { es: '¡Sss...! ¡Toma esto...!', en: 'Hsss...! Take this...!' },
  won: {
    es: '¡Sss...! ¡Sss...!\nDolor... Gris...\nYo no... ver nada...\n\n¡Sss...!\nYo... llevar mundo... conmigo.\n\n¡Sss...! ¡Sss...!',
    en: 'Hsss...! Hsss...!\nPain... Grey...\nMe no... see...\n\nHsss...!\nMe... take world... with me.\n\nHsss...! Hsss...!',
  },
  lost: {
    es: '¡Sss...! ¡Sss...!\n\nMundo... volverse gris.\nVolverse... niebla...\n\n¡Sss...! Pronto...\n\n¡Sss...! ¡Sss...!',
    en: 'Hsss...! Hsss...!\n\nWorld... turn grey.\nTurn... into fog...\n\nHsss...! Soon...\n\nHsss...! Hsss...!',
  },
};

/** Plaga only wants to play, and its games end everything. */
const plaga = {
  ask: { es: '¿Que empiece... el juego?', en: 'Shall the game... begin?' },
  no: { es: 'Muy tarde...\nEl juego... ya empezó.', en: 'Too late...\nThe game... has already begun.' },
  yes: { es: '¡Grrr...!', en: 'Grrr...!' },
  bored: {
    es: 'Qué aburrido... Muy aburrido.\n\nPronto... empiezo un juego nuevo.\n\nOjalá... vuelvas a jugar.\n\n¡Grrr...!',
    en: "This is boring... So very boring.\n\nSoon... I'll start a new game.\n\nI hope... you'll play again.\n\nGrrr...!",
  },
  end: {
    es: 'Ya... basta...\n\nEste es... el fin... del mundo.\n\nEl fin... del juego.\n\nTodo... se va a acabar.\n\n¡Grrr...!',
    en: "That's... enough...\n\nThis is... the end... of the world.\n\nThe end... of the game.\n\nEverything... will end.\n\nGrrr...!",
  },
};

/** The Blot, what is left of a creature that lost its shape. */
const borron = {
  pain: {
    es: '¿Qué sabes tú del dolor\nde los que se quedaron atrás\ncuando los demás evolucionaron?\n\n¡Lo odio todo!\n\nMi rencor no desaparecerá\nhasta que borre todo este mundo.',
    en: "What do you know of the pain\nof those left behind\nwhen the others evolved?\n\nI hate everything!\n\nMy hatred won't fade\nuntil I erase this whole world.",
  },
  ask: { es: '¿Crees que puedes vencerme?', en: 'Do you think you can beat me?' },
  no: { es: 'Entonces vete.\nMi rencor puede esperar.', en: 'Then go.\nMy hatred can wait.' },
  yes: { es: '¡Que te traguen las llamas de mi rencor!', en: 'Be swallowed by the flames of my hatred!' },
  won: {
    es: 'Ohhh... Me desvanezco...\n¿Desaparecerá también mi rencor?\n\n¿Me salvaré ahora?\nNo lo sé... No lo sé...\n\n¿Adónde... voy...?\n\n¿Me espera la paz allí?\n\n¿O me tragará más rencor?\n\nNo lo sé...',
    en: "Ohhh... I'm fading...\nWill my hatred fade, too?\n\nWill I be saved now?\nI don't know... I don't know...\n\nWhere... am I... going?\n\nIs peace waiting for me there?\n\nOr will more hatred swallow me?\n\nI don't know...",
  },
};

const grunon = {
  revenge: {
    es: '¡Me las vas a pagar! ¡No lo olvides!\n¡La próxima no me ganas!\n\nCuando menos lo esperes,\n¡ahí voy a estar esperándote! ¡Bah!',
    en: "You'll pay for this! Don't forget!\nYou won't beat me next time!\n\nWhen you least expect it,\nI'll be there waiting! Bah!",
  },
};

export const CITY11_LATER: CityTexts = {
  // Colmillo, at the café: Mortaja lost, but the tower is still standing
  '1420': {
    es: 'Mortaja perdió, ¿y qué?\nLa torre sigue en pie.\n\nTe voy a embestir tan fuerte que\nno sabrás ni qué te pasó.\n\nJe, je, je...',
    en: "So Mortaja lost. So what?\nThe tower is still standing.\n\nI'll ram you so hard you won't\neven know what happened.\n\nHeh heh heh...",
  },
  '14F0': { es: '¿Y bien? ¿Te atreves...?', en: 'Well? Do you dare...?' },
  '1580': { es: 'Je, je, je... Lo sabía.', en: 'Heh heh heh... I knew it.' },
  '15EC': { es: '¡Qué poco juicio tienes...!', en: 'You have no sense at all...!' },
  '1688': {
    es: 'Parece que sabes jugar.\n\nPero no te creas tanto\npor haberme ganado.\n\nEn esta torre te esperan criaturas\nmucho más fuertes que yo.\n\nJe, je, je...',
    en: "Looks like you know how to play.\n\nBut don't get cocky\njust because you beat me.\n\nMuch stronger creatures than me\nare waiting in this tower.\n\nHeh heh heh...",
  },
  '1810': { es: 'Je, je, je...\n\nNo tienes ninguna oportunidad.\nEsta torre sigue siendo nuestra.\n\nJe, je, je...', en: "Heh heh heh...\n\nYou don't stand a chance.\nThis tower is still ours.\n\nHeh heh heh..." },
  '191C': DECKS.colmillo,

  // Tres Llaves, the keeper of the floors
  '1AEC': { es: '¿De verdad quieres pelear conmigo?\nMi hoz no perdona.\n\nY mis tres llaves cierran\ncualquier salida.', en: 'Do you really want to fight me?\nMy sickle shows no mercy.\n\nAnd my three keys lock\nevery way out.' },
  '1BDC': { es: '¿Seguro que quieres arriesgarte?', en: 'Are you sure you want to risk it?' },
  '1C74': { es: '¡Ja, ja, ja! Eso es.\nAhora es buen momento para huir.', en: "Ha ha ha! That's right.\nNow is a good time to run." },
  '1D08': { es: 'Escucha: ya giré la llave.', en: "Listen: I've already turned the key." },
  '1DA0': {
    es: '¿Quién eres...? ¿Cómo pude perder?\n¿Cómo... pude perder...?\n\nEsto no se va a quedar así.\n\n¡No acepto esta derrota!\n¡Tenemos que volver a jugar!\n\nVayas adonde vayas, te encontraré.\nNo hay cerradura que me detenga.\n\n¡No lo olvides!',
    en: "Who are you...? How could I lose?\nHow... could I lose...?\n\nThis isn't over.\n\nI refuse to accept this defeat!\nWe must play again!\n\nWherever you go, I'll find you.\nNo lock can keep me out.\n\nDon't you forget it!",
  },
  '1FA4': {
    es: '¿Qué tal se siente quedar bajo llave?\n\nEspero que hayas aprendido.\nVete a casa. Es lo mejor para ti.\n\nHmpf. Si este mundo depende de ti,\nno va a durar mucho.\n\nAquí, las llaves las tengo yo.\n\n¡Ja, ja, ja, ja!',
    en: "How does it feel to be locked in?\n\nI hope you've learned your lesson.\nGo home. It's best for you.\n\nHmph. If this world depends on you,\nit won't last long.\n\nHere, I'm the one with the keys.\n\nHa ha ha ha!",
  },
  '2194': DECKS.tresLlaves,

  // Marejada, the tide sentinel
  '2330': { es: 'Alerta de marea.\n\nRastreando...\nObjetivo a la vista.\n\nCorriente fijada.', en: 'Tide alert.\n\nTracking...\nTarget in sight.\n\nCurrent locked.' },
  '2460': MAREJADA.ask,
  '24FC': MAREJADA.no,
  '256C': MAREJADA.yes,
  '2604': MAREJADA.won,
  '2800': { es: 'Rastreo reanudado.\nObjetivo a la vista.\n\nObjetivo hundido.\n\nOleaje completado.\nOleaje completado.', en: 'Tracking resumed.\nTarget in sight.\n\nTarget sunk.\n\nSwell complete.\nSwell complete.' },
  '2980': DECKS.marejada,

  // Ravenous Mortaja, at the café after the ending: the fog will come back
  '3268': {
    es: 'Ja, ja, ja...\n\nLo que haces solo retrasa\nlo inevitable.\n\nMientras quede un poco de gris,\nla niebla volverá.\n\nMe basta esperar en lo más hondo\nde mi torre a que regrese.\n\nNos volveremos a ver...\n\nJa, ja, ja...',
    en: "Ha ha ha...\n\nAll you're doing is putting off\nthe inevitable.\n\nAs long as a little grey remains,\nthe fog will return.\n\nI only have to wait, deep in my tower,\nfor it to come back.\n\nWe shall meet again...\n\nHa ha ha...",
  },
  '34B4': MORTAJA.futile,
  '355C': MORTAJA.understand,
  '35F4': { es: 'Te voy a mostrar un mundo sin color.\n¡Ríndete al gris!', en: "I'll show you a world without color.\nSurrender to the grey!" },
  '36CC': MORTAJA.won,
  '3B78': MORTAJA.lost,
  '3DBC': DECKS.mortaja,

  // Casco, the armored king of the lake
  '3F50': casco.intro,
  '4114': casco.ask,
  '41A4': { es: '¡Ja, ja, ja!\n¿Entonces a qué viniste?', en: 'Ha ha ha!\nThen what did you come here for?' },
  '4230': casco.yes,
  '42C4': {
    es: '¡Ja, ja, ja!\n\n¡Me haces reír, aprendiz! ¡Mucho!\nHaz lo que quieras.\n\nSigue adelante y mira\nlo que te espera.\n\n¡Ja, ja, ja!',
    en: "Ha ha ha!\n\nYou crack me up, apprentice! Really!\nDo as you like.\n\nGo on ahead and see\nwhat's waiting for you.\n\nHa ha ha!",
  },
  '4428': { es: '¡Ja, ja, ja! ¿Eso es todo?\n¿Nada más?\n\nQué juego tan flojo. ¿Es una broma?\n¡Ja, ja, ja!\n\nFuera de aquí, aprendiz.', en: "Ha ha ha! Is that all you've got?\nThat's it?\n\nWhat a feeble game. Are you joking?\nHa ha ha!\n\nGet out of here, apprentice." },
  '456C': DECKS.casco,

  // Hilván, a puppet who only wants to play «Erase Everything»
  '4728': {
    es: '¿Qué quieres?\n¿Vienes a jugar conmigo otra vez?\n\n¡Bueno, juguemos!\nA ver qué tan bien juegas.\n\n¡Juguemos otra vez\na «Borrarlo todo»!\n\n¡Ja, ja, ja, ja!',
    en: "What do you want?\nCome to play with me again?\n\nOK, let's play!\nLet's see what you're made of.\n\nLet's play “Erase Everything”\nagain!\n\nHa ha ha ha!",
  },
  '48C0': hilvan.ask,
  '494C': { es: '¡Qué aburrimiento!', en: "You're so boring!" },
  '49B4': { es: '¡Bien! ¡Vamos con todo!\n¡Vas a perder seguro!', en: "Alright! Let's go all out!\nYou're going down for sure!" },
  '4A80': {
    es: '¡Aaah! ¡Rayos!\n¡Perdí otra vez!\n\n¿Por qué tuve que perder yo?\n¡Tenías que perder tú!\n\n¡Aaah! ¡Esto no es divertido!\n¡No me gusta!\n\n¡Ojalá nunca hubieras venido!\n\n¡Aaah!',
    en: "Argh! Darn it!\nI lost again!\n\nWhy did I have to lose?\nYou were supposed to lose!\n\nArgh! This is no fun!\nI don't like this!\n\nI wish you'd never come here!\n\nArgh!",
  },
  '4C4C': {
    es: '¡Ja, ja, ja, ja!\nJuegas muy flojo. ¡Qué aburrimiento!\n\n¡Ja, ja, ja, ja!\n\nContigo no es divertido jugar.\n¡Ve a jugar a otra parte!\n\nPero si de verdad quieres,\nsupongo que puedo jugar otra vez.\n\nAunque juegas muy flojo. ¡De verdad!\n\n¡Ja, ja, ja, ja!',
    en: "Ha ha ha ha!\nYou play so badly. How boring!\n\nHa ha ha ha!\n\nYou're no fun to play with!\nGo play somewhere else!\n\nBut if you really want,\nI guess I can play with you again.\n\nYou're just too weak, though. Really!\n\nHa ha ha ha!",
  },
  '4E7C': DECKS.hilvan,

  // Engranaje, who grinds shapes until they are grey
  '5034': {
    es: 'Mi ejército de máquinas existe\npara moler todas las formas.\n\n¡Voy a dejar este mundo gris\ny quieto!\n\nY para terminar el trabajo,\n¡disparo mi Cañón sin Fin!',
    en: "My army of machines exists\nto grind down every shape.\n\nI'll leave this world grey\nand still!\n\nAnd to finish the job,\nI'll fire my Endless Cannon!",
  },
  '51A8': { es: '¿Quieres que te muela a ti también?', en: 'Do you want to be ground down, too?' },
  '5248': { es: 'No hay dónde esconderse.', en: "There's nowhere to hide." },
  '52C0': { es: '¡Lo voy a moler todo!', en: "I'll grind everything down!" },
  '5368': {
    es: '¡Aaargh! ¿Cómo pude perder\ncontra alguien como tú?\n\n¡Nooo! ¡El amo Mortaja Voraz\nse va a enfurecer! ¡Tengo que huir!\n\n¿Qué? ¿El amo también perdió\ncontra ti? ¡Igual me da miedo!\n\n¡Nooo!',
    en: "Aaargh! How could I lose\nto someone like you!?\n\nNooo! Master Ravenous Mortaja\nwill be furious! I have to run!\n\nWhat? The master lost to you, too?\nI'm still scared of him!\n\nNooo!",
  },
  '5534': { es: '¡A moler! ¡A moler todo!\nYa no me puedes detener.\n\nSiéntate y mira cómo mi ejército\nhace su trabajo.\n\n¡Ah, el gris me llama!', en: "Grind! Grind it all!\nYou can't stop me now.\n\nSit back and watch my army\ndo its job.\n\nAh, the grey is calling me!" },
  '568C': DECKS.engranaje,

  // Dama Negra, servant of the Jester
  '5860': {
    es: '¡Oye, tú! ¿Qué haces aquí?\nEste no es lugar para aprendices.\n\n¿O viniste a buscar un castigo?\nPuedo dártelo con gusto.\n\nVas a aprender lo que es sufrir.\nAy, cómo voy a disfrutar esto.',
    en: "Hey, you! What are you doing here?\nThis is no place for apprentices.\n\nOr did you come looking for punishment?\nI'd be happy to give you some.\n\nYou're going to learn what suffering is.\nOh, I'm going to enjoy this.",
  },
  '59FC': damaNegra.ask,
  '5A98': damaNegra.no,
  '5B20': damaNegra.yes,
  '5BB8': { es: '¡Aaah! ¡Cómo te atreves!\n\n¡Si vuelves a mostrar tu cara por aquí,\nte arrepentirás!\n\n¡No puedo creerlo!', en: "Argh! How dare you!\n\nIf you ever show your face here again,\nyou'll regret it!\n\nI can't believe this!" },
  '5CE4': {
    es: '¿Ves? Te lo dije.\nEste no es lugar para aprendices.\n\n¿Aprendiste la lección?\nAhora vete a casa con tu mamá.\n\nAhí es donde deben estar los pequeños.\n\n¡Ja, ja, ja, ja, ja!',
    en: "See? I told you so.\nThis is no place for apprentices.\n\nHave you learned your lesson?\nNow go home to your mommy.\n\nThat's where little ones belong.\n\nHa ha ha ha ha!",
  },
  '5E78': DECKS.damaNegra,

  // the Jester wants to be the world's new villain and opens the second arena
  '5F20': { es: 'Me llaman el Bufón.\n¡Vaya! Se te ve con mucha energía.', en: 'They call me the Jester.\nMy! You look full of energy.' },
  '5FA4': me('¿Qué estás tramando?', 'What are you plotting?'),
  '6000': {
    es: 'Ja, ja, ja... ¡Qué pregunta tan grosera!\nNo estoy tramando nada.\n\nAlguien como tú no lo entendería.\n\nSolo quiero darle a este mundo\nalgo que le hace falta...\n\nSi quieres saber más,\nte espero en mi Arena.\n\nAllí lo verás todo.\nJa, ja, ja...',
    en: "Ha ha ha... What a rude question!\nI'm not plotting anything.\n\nSomeone like you wouldn't understand.\n\nI only want to give this world\nsomething it's been missing...\n\nIf you want to know more,\ncome to my Arena.\n\nThere you'll see it all.\nHa ha ha...",
  },
  '6424': bufon.missing,
  '65A4': { es: 'Nuestra función no termina nunca.\n¡Ja, ja, ja, ja, ja!\n\n¡Esto apenas comienza!', en: 'Our show never ends.\nHa ha ha ha ha!\n\nThis is only the beginning!' },
  '6678': bufon.ask,
  '6714': bufon.no,
  '67A4': bufon.yes,
  '6834': bufon.won,
  '6BD8': bufon.lost,
  '6E2C': DECKS.bufon,

  // Mangle
  '6FE8': { es: '¡Sss...!\n\n¡Sss...! Yo... vencerte.', en: 'Hsss...!\n\nHsss...! Me... beat you.' },
  '708C': { es: 'Tu dolor...\n¿empezar ahora?', en: 'Your pain...\nstart now?' },
  '7120': { es: 'Raíces... esperar.\nTu dolor... llegar igual.', en: 'Roots... wait.\nYour pain... come anyway.' },
  '7198': { es: '¡Sss...! ¡Tú... caer!', en: 'Hsss...! You... fall!' },
  '7234': mangle.won,
  '74F4': {
    es: '¡Sss...! ¡Sss...!\n\nMundo... volverse gris.\n¡Niebla... tragar todo!\n\n¡Sss...! Mundo... acabar pronto.\n\n¡Sss...!',
    en: 'Hsss...! Hsss...!\n\nWorld... turn grey.\nFog... swallow all!\n\nHsss...! World... end soon.\n\nHsss...!',
  },
  '7694': DECKS.mangle,

  // Plaga wants to play a new game and opens the third arena
  '7764': { es: 'Soy Plaga.\nQuiero jugar... un juego nuevo.', en: "I'm Plaga.\nI want to play... a new game." },
  '77E8': me('¿Qué juego?', 'What game?'),
  '7838': {
    es: '¡Grrr...!\n\nTienes que ganarme.\nSi no... la niebla se traga el mundo.\n\n¿Qué dices?\n¿Ya tienes ganas de jugar?\n\n¡Grrr...!',
    en: 'Grrr...!\n\nYou have to beat me.\nOr else... the fog swallows the world.\n\nWhat do you say?\nFeel like playing now?\n\nGrrr...!',
  },
  '7B74': {
    es: 'Tienes que ganarme.\nSi no... la niebla se traga el mundo.\n\n¿Qué dices?\n¿Ya tienes ganas de jugar?\n\n¡Grrr...!',
    en: 'You have to beat me.\nOr else... the fog swallows the world.\n\nWhat do you say?\nFeel like playing now?\n\nGrrr...!',
  },
  '7CA8': plaga.bored,
  '7DE4': { es: '¿Empezamos... el juego?', en: 'Shall we... start the game?' },
  '7E74': plaga.no,
  '7EF0': plaga.yes,
  '7F80': {
    es: 'Perdí... el juego.\n\nQué aburrido... Muy aburrido.\n\nPronto... empiezo un juego nuevo.\n\nOjalá... vuelvas a jugar.\n\n¡Grrr...!',
    en: "I lost... the game.\n\nThis is boring... So very boring.\n\nSoon... I'll start a new game.\n\nI hope... you'll play again.\n\nGrrr...!",
  },
  '8224': {
    es: 'Ya... basta.\n\nGanar este juego... no es divertido.\n\nUn día... jugaremos un juego de verdad.\n\nEl juego... más grande.\n\nEl último juego... de todos.\n\n¡Grrr...!',
    en: "That's... enough.\n\nWinning this game... is no fun.\n\nOne day... we'll play a real game.\n\nThe biggest... game.\n\nThe last game... of all.\n\nGrrr...!",
  },
  '83E0': DECKS.plaga,

  // the Blot opens the fourth arena
  '84A8': {
    es: 'Soy el Borrón...\nLo que queda de una criatura\nque perdió su forma.\n\nMe tocó cargar con todo el dolor\nde los que sí pudieron evolucionar.\n\nYa no pienso perdonar a nadie\npor ese peso.\n\nEs hora de pagar. ¡Este es el fin\ndel mundo! ¡Siente mi dolor!',
    en: "I am the Blot...\nWhat's left of a creature\nthat lost its shape.\n\nI was left to carry all the pain\nof those who got to evolve.\n\nI will no longer forgive anyone\nfor that burden.\n\nIt's time to pay. This is the end\nof the world! Feel my pain!",
  },
  '8674': me('¿De verdad crees que borrar el mundo\nte va a salvar?', 'Do you really think erasing the world\nwill save you?'),
  '86FC': {
    es: 'Hmpf. ¿Qué sabes tú?\nApenas estás empezando.\n\nNo voy a cambiar de idea.\nEl borrado ya comenzó.\n\nNadie puede detenerlo...\n¡Ja, ja, ja!',
    en: "Hmph. What do you know?\nYou're only just starting out.\n\nI won't change my mind.\nThe erasing has already begun.\n\nNo one can stop it...\nHa ha ha!",
  },
  '8AA0': { es: 'No voy a cambiar de idea.\nEl borrado ya comenzó.\n\nNadie puede detenerlo. ¡Ja, ja, ja!\nJa, ja, ja...', en: "I won't change my mind.\nThe erasing has already begun.\n\nNo one can stop it. Ha ha ha!\nHa ha ha..." },
  '8BC0': borron.pain,
  '8D30': { es: '¿Adónde... voy...?\n\n¿Encontraré la paz?\n\n¿O me tragará más rencor?\n\nNo lo sé...', en: "Where... am I... going?\n\nWill I find peace?\n\nOr will more hatred swallow me?\n\nI don't know..." },
  '8E64': borron.ask,
  '8EFC': borron.no,
  '8F64': borron.yes,
  '9000': borron.won,
  '9578': {
    es: 'Oh, el rencor crece dentro de mí.\n¡No lo puedo contener!\n\nTengo que librarme de él.\n¡Este mundo sentirá mi dolor!\n\nTe haré sentir mi dolor.\n\n¡No hay escapatoria!\n\n¡Esta es la venganza de los que\nno pudieron evolucionar!',
    en: "Oh, the hatred inside me is growing.\nI can't contain it!\n\nI must rid myself of it.\nThis world will feel my pain!\n\nI'll make you feel my pain.\n\nThere's no escape!\n\nThis is the revenge of those\nwho could never evolve!",
  },
  '9790': DECKS.borron,

  // Gruñón crossed the fog to pick fights (beating him again and again pays off)
  '983C': {
    es: '¡Soy Gruñón! ¡Crucé la niebla\nde punta a punta para llegar aquí!\n\n¡Juega conmigo! ¡Y ni se te ocurra\nescaparte!\n\n¡Dije que juegues conmigo!',
    en: "I'm Gruñón! I crossed the fog\nend to end to get here!\n\nPlay me! And don't even think\nabout running away!\n\nI said, play me!",
  },
  '995C': me('Bueno, si tanto insistes.', 'OK, if you insist.'),
  '99B8': {
    es: '¡Así me gusta!\n¡Que empiece el plato fuerte!\n\nY si me ganas varias veces,\nhasta te doy algo especial.\n¡Bah! ¡Como si pudieras!',
    en: "That's more like it!\nOn to the main event!\n\nAnd if you beat me a few times,\nI might even give you something special.\nBah! As if you could!",
  },
  '9BBC': { es: '¡Oye, tú!\n¡No hay tiempo para charlas!\n\n¡Apúrate! ¡Vamos a jugar!\n¡Ja, ja, ja, ja, ja!', en: "Hey, you!\nNo time for chitchat!\n\nHurry up! Let's play!\nHa ha ha ha ha!" },
  '9CA8': grunon.revenge,
  '9DC4': { es: '¡Vamos! ¿Jugamos o qué?', en: 'Come on! Are we playing or what?' },
  '9E54': { es: '¿Cómo que no?', en: 'What do you mean, no?' },
  '9EB4': { es: '¡Eso es!', en: "That's it!" },
  '9F44': {
    es: '¡Nooo! ¡Perdí!\n¡Juegas demasiado bien!\n\n¡Me las vas a pagar! ¡No lo olvides!\n¡La próxima no me ganas!\n\nCuando menos lo esperes,\n¡ahí voy a estar esperándote! ¡Bah!',
    en: "Nooo! I lost!\nYou're way too good!\n\nYou'll pay for this! Don't forget!\nYou won't beat me next time!\n\nWhen you least expect it,\nI'll be there waiting! Bah!",
  },
  A390: { es: '¡Ja, ja, ja, ja, ja!\n¡Te gané!\n\n¡Qué bien me siento! ¡Uf!\n\n¡Te enfrento cuando quieras!\n\n¡Ja, ja, ja, ja, ja!', en: "Ha ha ha ha ha!\nGot you!\n\nI feel great! Whew!\n\nI'll take you on anytime!\n\nHa ha ha ha ha!" },
  A4C8: DECKS.grunon,

  // the second arena: Casco, Hilván, Dama Negra and the Jester
  EBC0: casco.intro,
  EE24: casco.ask,
  EEB4: { es: '¡Ja, ja, ja! ¡Qué poco valor!\n¿Entonces a qué viniste?', en: 'Ha ha ha! Not much nerve, huh?\nThen what did you come here for?' },
  EF50: casco.yes,
  EFE4: {
    es: '¡Ja, ja, ja!\n\n¡Me haces reír, aprendiz! ¡Mucho!\nAdelante.\n\nVe a ver con tus propios ojos\nlo que te espera.\n\n¡Ja, ja, ja!',
    en: "Ha ha ha!\n\nYou crack me up, apprentice! Really!\nGo ahead.\n\nSee with your own eyes\nwhat lies ahead.\n\nHa ha ha!",
  },
  F150: { es: '¡Ja, ja, ja!\n¿Eso es todo?\n\n¡Qué poca cosa! No puedo creer\nque llegaras hasta aquí. ¡Ja, ja, ja!\n\n¡Largo de aquí, aprendiz!', en: "Ha ha ha!\nThat's it?\n\nHow feeble! I can't believe\nyou made it this far. Ha ha ha!\n\nScram, apprentice!" },
  F294: DECKS.casco,
  F3D8: {
    es: 'Soy Hilván.\n\n¿Qué pasa?\n¿Vienes a jugar conmigo?\n\n¡Bueno, juguemos!\n¿A qué jugamos?\n\n¡Ya sé! ¡Juguemos a «Borrarlo todo»!\n\n¡Ja, ja, ja, ja!',
    en: "I'm Hilván.\n\nWhat is it?\nDid you come to play with me?\n\nOK, let's play!\nWhat should we play?\n\nI know! Let's play “Erase Everything”!\n\nHa ha ha ha!",
  },
  F630: { es: '¿Empezamos ya?', en: 'Shall we get started?' },
  F6C0: { es: '¡Uf, qué aburrimiento contigo!', en: "Ugh, you're so boring!" },
  F730: { es: '¡Bien! ¡A jugar!\nTe vas a arrepentir.', en: "Alright! Let's play!\nYou're gonna be sorry." },
  F7F0: {
    es: '¡Aaah! ¡No es justo!\n¿Qué eres tú?\n\n¡Me hiciste perder!\n¡Tenías que perder tú! ¡Lo dijiste tú!\n\n¡Aaah! ¡Lo odio!\n¡Esto no es divertido!\n\n¡Fuera de mi vista!\n\n¡Aaah!',
    en: 'Argh! No fair!\nWhat are you?\n\nYou made me lose! You were supposed\nto lose! You said so yourself!\n\nArgh! I hate this!\nThis is no fun!\n\nGet out of my sight!\n\nArgh!',
  },
  F9D0: {
    es: '¡Ja, ja, ja! Qué aburrimiento.\nJuegas muy flojo.\n\n¡Ja, ja, ja, ja!\n\nContigo no es divertido jugar.\n¡Vete de aquí!\n\nBueno, si me lo pides de rodillas,\ntal vez juegue contigo otra vez.\n\nAunque te falta muchísimo.\n\n¡Ja, ja, ja, ja!',
    en: "Ha ha ha! That was boring.\nYou're too weak.\n\nHa ha ha ha!\n\nYou're no fun to play with!\nGo away!\n\nWell, if you beg on your knees,\nmaybe I'll play with you again.\n\nYou've got a long way to go, though.\n\nHa ha ha ha!",
  },
  FC00: DECKS.hilvan,
  FD44: {
    es: 'Soy Dama Negra,\nfiel servidora de mi señor, el Bufón.\n\n¡Oye, tú! ¿Qué haces aquí?\nEste no es lugar para aprendices.\n\n¿O viniste a buscar un castigo?\nPuedo dártelo con gusto.\n\nNo voy a tenerte compasión.\nAy, cómo voy a disfrutar esto.',
    en: "I am the Black Lady,\nloyal servant of my lord, the Jester.\n\nHey, you! What are you doing here?\nThis is no place for apprentices.\n\nOr did you come looking for punishment?\nI'd be happy to give you some.\n\nI won't go easy on you.\nOh, I'm going to enjoy this.",
  },
  FFE0: damaNegra.ask,
  '1007C': damaNegra.no,
  '10104': damaNegra.yes,
  '1019C': {
    es: '¡Aaah! ¡Te odio!\n\n¡Si vuelves a mostrar tu cara por aquí,\nte va a ir muy mal!\n\n¡Seguro que mi señor, el Bufón,\nacabará contigo!\n\n¡Aaah!',
    en: "Argh! I hate you!\n\nIf you ever show your face here again,\nyou'll be very sorry!\n\nI'm sure my lord, the Jester,\nwill finish you off!\n\nArgh!",
  },
  '10324': {
    es: '¿Ves? Te dije que este no es\nlugar para aprendices.\n\nEspero que hayas aprendido la lección.\nAhora vete a casa con tu mamá.\n\nAhí es donde deben estar los pequeños.\n\n¡Ja, ja, ja, ja, ja!',
    en: "You see? I told you this is no place\nfor apprentices.\n\nI hope you've learned your lesson.\nNow, go home to mommy!\n\nThat's where little ones belong.\n\nHa ha ha ha ha!",
  },
  '104B4': DECKS.damaNegra,
  '105D8': {
    es: '¡Ja, ja, ja! Por fin llegas.\nQué alegría verte.\n\nReconozco tu esfuerzo, pero\naquí termina tu viaje.\n\nSoy generoso con los jóvenes, pero\nno quiero que te metas en mi camino.\n\nA este mundo le falta un villano\nde verdad. ¡Y ese papel es mío!\n\nTus ojos me recuerdan a unos aprendices\nque conocí hace mucho.\n\nEres mala semilla.\nTe voy a arrancar de raíz.\n\nPerdona que te lo diga, pero aquí\nbaja el telón.\n\n¡Ja, ja, ja! ¡Te voy a aplastar!',
    en: "Ha ha ha! You finally made it.\nHow nice to see you.\n\nI admire your effort, but\nthis is where your journey ends.\n\nI'm generous with the young, but\nI won't have you in my way.\n\nThis world lacks a real villain.\nAnd that role is mine!\n\nYour eyes remind me of some apprentices\nI met long ago.\n\nYou're a bad seed.\nI'll pull you out by the roots.\n\nForgive me for saying so, but\nthis is where the curtain falls.\n\nHa ha ha! I'll crush you!",
  },
  '109EC': { es: '¿Quieres ver mi mejor número?', en: 'Would you like to see my best act?' },
  '10A88': { es: '¡Ja, ja, ja! Ya es tarde para irse.\nMereces un castigo.', en: "Ha ha ha! It's too late to leave now.\nYou deserve a punishment." },
  '10B18': { es: '¡Ja, ja, ja! ¡Arriba el telón!', en: 'Ha ha ha! Curtain up!' },
  '10BA4': {
    es: '¡NOOO! ¡No puedo creer que otra vez\nalguien tan joven arruine mis planes!\n\n¡Volveré! ¡Recuérdalo!\n¡Mi ambición no tiene fin!\n\nNuestra función no termina nunca.\n¡Ja, ja, ja, ja, ja!\n\n¡Esto apenas comienza!',
    en: "NOOO! I can't believe someone so young\nhas stopped my plans again!\n\nI'll be back! Mark my words!\nMy ambition has no end!\n\nOur show never ends.\nHa ha ha ha ha!\n\nThis is only the beginning!",
  },
  '10DD4': {
    es: 'Hace mucho, un grupo de aprendices\narruinó mis planes.\n\nPero esta vez no dejaré\nque nadie se interponga.\n\nNo permitiré que alguien como tú\nse cruce en mi camino.\n\n¡Nunca me vencerás!\n\n¡Ja, ja, ja! ¡Es cuestión de tiempo\nque el telón gris caiga sobre el mundo!',
    en: "Long ago, a group of apprentices\nruined my plans.\n\nBut this time, I won't let\nanyone get in my way.\n\nI won't let someone like you\nstand in my way.\n\nYou'll never defeat me!\n\nHa ha ha! It's only a matter of time\nuntil the grey curtain falls!",
  },
  '10FF8': DECKS.bufon,

  // the third arena: Ravenous Mortaja, the Jester, Mangle and Plaga
  '11420': { es: '¿Piensas resistirte?', en: 'Do you intend to resist?' },
  '114B8': { es: '¡Ja, ja, ja! Me alegra que por fin\nveas las cosas a mi manera.', en: "Ha ha ha! I'm glad you finally\nsee things my way." },
  '11554': MORTAJA.show,
  '11618': {
    es: 'Bien. Esto es lo más\nque puedo hacer con mi poder.\n\n¡No creas que acepto la derrota!\n\nPor más que lo intentes,\nel gris nunca se acaba.\n\nJa, ja, ja.\n\nLo que haces solo retrasa\nlo inevitable.\n\nMientras quede un poco de gris,\nla niebla volverá.\n\nTe espero en lo más hondo de la niebla.\n\nHasta pronto...\n\n¡Ja, ja, ja!',
    en: "Fine. This is the most\nI can do with my power.\n\nDon't think I accept defeat!\n\nNo matter how hard you try,\nthe grey never ends.\n\nHa ha ha.\n\nAll you're doing is putting off\nthe inevitable.\n\nAs long as a little grey remains,\nthe fog will return.\n\nI'll be waiting deep in the fog.\n\nUntil next time...\n\nHa ha ha!",
  },
  '11958': {
    es: '¡Ja, ja, ja!\n\n¿Ves lo poco que puedes hacer?\nNo puedes cambiar nada.\n\nNi siquiera tiene sentido intentarlo.\n\nSiéntate y mira cómo la niebla\nse traga este mundo.\n\nEs lo único que te queda.\n\n¡Ja, ja, ja!',
    en: "Ha ha ha!\n\nDo you see how little you can do?\nYou can't change a thing.\n\nIt's pointless to even try.\n\nSit back and watch the fog\nswallow this world.\n\nThat's all you have left.\n\nHa ha ha!",
  },
  '11B98': DECKS.mortaja,
  '11D3C': bufon.ask,
  '11DD8': bufon.no,
  '11E68': bufon.yes,
  '11EF8': bufon.won,
  '120C4': bufon.lost,
  '122D8': DECKS.bufon,
  '1241C': { es: '¡Sss...! ¡Sss...!\n\n¡Sss...! Yo... vencerte...\n\n¡Sss...! ¡Sss...!', en: 'Hsss...! Hsss...!\n\nHsss...! Me... beat you...\n\nHsss...! Hsss...!' },
  '125A4': mangle.ask,
  '12638': mangle.no,
  '126A8': mangle.yes,
  '12744': mangle.won,
  '128F8': mangle.lost,
  '12AA0': DECKS.mangle,
  '12BF0': { es: 'Empecemos... el juego...\n\n¡Grrr...!\n\nSe te acaba... el tiempo...\n\nQué juego... tan divertido...', en: "Let's start... the game...\n\nGrrr...!\n\nYou're... out of time...\n\nSuch a fun... fun... game..." },
  '12DDC': plaga.ask,
  '12E70': plaga.no,
  '12EEC': plaga.yes,
  '12F7C': {
    es: 'Perdí... el juego...\n\nNo puede ser... Tenía que ganar yo.\n\nPronto... empiezo un juego nuevo.\n\nVen a jugar... otra vez...\n\n¡Grrr...!',
    en: "I lost... the game...\n\nThis can't be... I was supposed to win.\n\nSoon... I'll start a new game.\n\nCome and play... again...\n\nGrrr...!",
  },
  '13184': plaga.end,
  '13300': DECKS.plaga,

  // the fourth arena: the same four, and the Blot at the top
  '13728': MORTAJA.futile,
  '137D0': MORTAJA.understand,
  '13868': MORTAJA.show,
  '1392C': MORTAJA.won,
  '13CCC': MORTAJA.lost,
  '13F18': DECKS.mortaja,
  '140BC': bufon.ask,
  '1415C': bufon.no,
  '141EC': bufon.yes,
  '1427C': bufon.won,
  '14448': bufon.lost,
  '1465C': DECKS.bufon,
  '14828': mangle.ask,
  '148BC': mangle.no,
  '1492C': mangle.yes,
  '149C8': mangle.won,
  '14B7C': mangle.lost,
  '14D28': DECKS.mangle,
  '14F1C': plaga.ask,
  '14FB0': plaga.no,
  '1502C': plaga.yes,
  '150BC': { es:`Perdí... el juego.\n\n${plaga.bored.es}`, en: `I lost... the game.\n\n${plaga.bored.en}` },
  '15248': plaga.end,
  '153C0': DECKS.plaga,
  '15508': { es: `¿Cómo podrías sentir este dolor?\n\n${borron.pain.es}`, en: `How could you ever feel this pain?\n\n${borron.pain.en}` },
  '15760': borron.ask,
  '157F8': borron.no,
  '15864': borron.yes,
  '1590C': borron.won,
  '15BC0': {
    es: 'El rencor crece dentro de mí...\nYa no lo puedo contener...\n\nTengo que derramarlo\ny cubrir este mundo de gris.\n\nHaré que todos sientan mi dolor.\n\n¡Sientan el dolor! ¡Sientan la angustia!\n\n¡Esta es la venganza de los que\nno pudieron evolucionar!',
    en: "The hatred inside me is growing...\nI can't hold it in any longer...\n\nI must pour it out\nand cover this world in grey.\n\nI will make everyone feel my pain.\n\nFeel the pain! Feel the agony!\n\nThis is the revenge of those\nwho could never evolve!",
  },
  '15E00': DECKS.borron,
};
