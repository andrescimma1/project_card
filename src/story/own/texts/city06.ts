/**
 * Isla de Arena (city 6), after the ending: a lonely island of dunes and shipwrecks. Mortaja comes back
 * for revenge with his allies Melena, Grajo and Latón, and his Arena only lets in decks without Support
 * or Evolution cards. Gruñón drifts in on a barrel, and the Blot wanders the island too.
 */
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });
const melenaDeck = deck('*c3Mazo Garra de Selva\nUn mazo especialista Verde\ncon fuerza de la facción Sombría.', '*c3Jungle Claw Deck\nA Green specialist deck\nwith Shadow faction power.');
const grajoDeck = deck('*c3Mazo Ala Helada\nUn mazo cruel, Sombrío y Azul,\nque busca tus puntos débiles.', '*c3Frozen Wing Deck\nA cruel Shadow and Blue deck\nthat hunts for your weak spots.');
const latonDeck = deck('*c3Mazo Fanfarria\nUn mazo especialista de la facción\nRara, muy bien equilibrado.', '*c3Fanfare Deck\nA well-balanced Rare\nfaction specialist deck.');
const mortajaDeck = deck('*c3Mazo Gris Renacido\nUn mazo Sombrío que volvió de la niebla.\nTodavía está incompleto.', '*c3Grey Reborn Deck\nA Shadow deck back from the fog.\nIt is still incomplete.');

const mortaja = {
  bigTalk: { es: 'Te crees muy fuerte, ¿no?', en: "You think you're something, huh?" },
  coward: { es: 'Entonces vete.\nHuir se te da muy bien...', en: "Then go.\nYou're good at running away..." },
  crush: { es: 'Voy a aplastar tu confianza.', en: "I'll crush your confidence." },
};
const melena = {
  start: { es: '¡Dame con todo lo que tienes!', en: "Hit me with all you've got!" },
  won: {
    es: '¡Gané!\n\n¿Te dolió perder?\nEntonces desafíame otra vez.\n\nTe enfrento cuando quieras.\nJa, ja, ja, ja...\n\n¡Te espero!',
    en: "I won!\n\nDid losing sting, kid?\nIf so, challenge me again.\n\nI'll take you on anytime.\nHa ha ha ha...\n\nI'll be waiting!",
  },
};

export const CITY06: CityTexts = {
  // Mortaja arrives at the café, explains his rules and opens the island's Arena
  '2698': { es: '¡Soy Mortaja!\nVine a esta isla a vengarme.', en: 'I am Mortaja!\nI came to this island for revenge!' },
  '271C': { who: 'me', es: '¿A vengarte?', en: 'Revenge!?' },
  '2768': { es: '¿Y tú quién eres? Mmm... Esos ojos...\n\nMe recuerdan a los viajeros\nque me vencieron. ¡Qué asco!', en: 'And who are you? Hmm... Those eyes...\n\nThey remind me of the travelers\nwho beat me. How disgusting!' },
  '2854': {
    who: 'me',
    es: '(¡Mortaja! ¡Es la criatura que\ntanto preocupaba a Tadeo!)\n\nNo sé qué te pasa,\npero cálmate un poco.',
    en: "(Mortaja! That's the creature\nTadeo was so worried about!)\n\nI don't know what your problem is,\nbut you need to calm down!",
  },
  '2950': { es: 'Ven a mi Arena,\naunque quizá te arrepientas.\n\nEn mi Arena se juega\ncon reglas especiales.', en: 'Come to my Arena,\nthough you may regret it.\n\nMy Arena plays by\na special set of rules!' },
  '2A38': { who: 'me', es: '¿Reglas especiales?', en: 'Special rules?' },
  '2A94': {
    es: 'Así es. En mi Arena no se permiten\ncartas de Apoyo ni de Evolución.\n\nSolo pueden entrar mazos\nsin ninguna de esas cartas.\n\n¡Las únicas cartas de Apoyo\nque se juegan aquí son las mías!\n¡Ja, ja, ja, ja!\n\nRevisaré tu mazo carta por carta.\n\n¿Te atreves a entrar\nen mi Arena?\n\n¡Ja, ja, ja, ja!',
    en: "That's right. No Support or Evolution\ncards are allowed in my Arena.\n\nOnly decks without a single\none of those cards may enter.\n\nThe only Support cards\nplayed here are mine!\nHa ha ha ha ha!\n\nI'll check your deck card by card.\n\nAre you brave enough\nto enter my Arena?\n\nHa ha ha ha ha!",
  },

  // Mortaja at the café
  '2E68': { es: 'Si quieres detenerme, ven a la Arena.\nAunque quizá te arrepientas.\n\n¡Ja, ja, ja, ja!', en: 'If you want to stop me,\ncome to the Arena.\nYou may regret it, though.\n\nHa ha ha ha ha!' },
  '2F50': { es: '¿Será este mi destino?\n\nQue así sea. Pero aun así,\nquiero la revancha.', en: 'Is this my destiny?\n\nSo be it. Even so,\nI still want a rematch.' },
  '3034': mortaja.bigTalk,
  '30D0': mortaja.coward,
  '3150': mortaja.crush,
  '31F4': {
    es: '¡No! No puedo creerlo...\n¡Esto no puede estar pasando!\n\n¿Otra vez pierdo contra los viajeros?\n¿Será este mi destino?\n\nQue así sea. Pero aun así,\nquiero la revancha.\n\nYa lo decidí.',
    en: "No! I can't believe it...\nThis can't be happening!\n\nI lost to the travelers again...?\nIs this my destiny?\n\nSo be it. Even so,\nI still want a rematch.\n\nMy mind is made up.",
  },
  '34D8': { es: '¡Ja, ja, ja, ja!\n\n¿Todavía confías tanto\nen tu manera de jugar?\n\nMaldice tu debilidad.\n¡Ja, ja, ja, ja!', en: 'Ha ha ha ha ha!\n\nAre you still so sure\nof your skills now?\n\nCurse your weakness.\nHa ha ha ha ha!' },
  '3610': mortajaDeck,

  // Melena at the café: free of Mortaja's orders, she only wants to enjoy the game
  '1218': { es: 'Desde ahora solo quiero\ndisfrutar de las batallas.\n\n¿Me ayudas con eso?', en: 'From now on, I just want\nto enjoy battles.\n\nWill you help me with that?' },
  '12DC': { es: '¿Empezamos una partida?', en: 'Shall we get started?' },
  '1368': { es: '¿No? Bueno... de mí no te escapas\npor mucho tiempo.', en: "No? Well... you can't escape\nfrom me for long." },
  '13D8': melena.start,
  '1478': {
    es: '¡No! ¡Perdí!\nBien jugado.\n\nCreo que me importa\ndemasiado ganar.\n\nDesde ahora solo quiero\ndisfrutar de las batallas.\n\n¿Me ayudas con eso?\n¡Te espero!',
    en: "No! I lost!\nGreat job, kid.\n\nLooks like I care\ntoo much about winning.\n\nFrom now on, I just want\nto enjoy battles.\n\nWill you help me with that?\nI'll be waiting for you!",
  },
  '160C': melena.won,
  '1768': melenaDeck,

  // Grajo at the café: the grey always follows the color
  '1910': { es: 'Como la sombra sigue a la luz,\nel gris siempre sigue al color.\n\n¡No lo olvides!', en: "As a shadow follows the light,\nthe grey always follows the color.\n\nDon't you forget it!" },
  '19E0': { es: '¿Quieres un viaje sin regreso\na la niebla gris?', en: 'Want a one-way trip\ninto the grey fog?' },
  '1A7C': { es: 'Ja, ja, ja...\nHuye si quieres. Ya es tarde...', en: "Ha ha ha...\nRun if you like.\nIt's already too late..." },
  '1B00': { es: 'Ríndete. No puedes hacer nada.\nJa, ja, ja...', en: 'Give it up. There is nothing you can do.\nHa ha ha...' },
  '1BC4': {
    es: 'Ja, ja, ja...\nEsto no termina aquí.\n\nComo la sombra sigue a la luz,\nel gris siempre sigue al color.\n\n¡No lo olvides!\n\nJa, ja, ja...',
    en: "Ha ha ha...\nIt's not over yet.\n\nAs a shadow follows the light,\nthe grey always follows the color.\n\nDon't forget that!\n\nHa ha ha...",
  },
  '1D20': {
    es: 'Ja, ja, ja... Ahora conoces\nel terror de la niebla gris.\n\nDe este miedo no hay escape.\nTe perderás en mi niebla sin fin.\n\nJa, ja, ja...',
    en: 'Ha ha ha... Now you know\nthe terror of the grey fog.\n\nThere is no escape from this fear.\nBe lost in my endless fog!\n\nHa ha ha...',
  },
  '1E68': grajoDeck,

  // Latón at the café: a vain brass showman who gets mad easily
  '2020': { es: '¡Oye, tú! ¿No deberías estar\nen la cama a esta hora?', en: "Hey, kiddo!\nIsn't it past your bedtime?" },
  '20AC': { es: '¿Qué? ¿De verdad quieres jugar?', en: 'What? You really want to battle?' },
  '2148': { es: 'Ya sé, ya sé.\nTe entiendo: te doy miedo.', en: 'I know, I know.\nI get it: I scare you.' },
  '21D8': { es: 'Muy bien. No me voy a contener.\n\n¡Cuidado! No pienso tenerte piedad.', en: "Okay then, I'm not holding back.\n\nWatch out! I'll have no mercy on you." },
  '22D8': {
    es: '¡Nooo! ¡Perdí!\n¿Y ahora qué hago? ¿Qué hago?\n\n¡Rayos! ¡Me haces enojar!\n¡Qué insolencia!\n\n¡Vas a jugar conmigo otra vez!\nEsto no se queda así.',
    en: "Oh noooo! I lost!\nWhat to do? What to do?\n\nDarn! You make me mad!\nYou little brat!\n\nYou'd better battle me again!\nI won't let this go!",
  },
  '2440': {
    es: 'Vaya, vaya... ¡Gané!\nComo era de esperar, claro.\n\nEspero que hayas aprendido la lección:\nnunca hagas enojar a Latón.\n\nOye, tú: todavía te falta mucho.\n\n¡Hasta luego!',
    en: "Well, well... I won!\nOnly natural, of course!\n\nI hope you learned your lesson:\nnever make Latón mad!\n\nHey, kiddo! You're still green.\n\nSee you later, kiddo!",
  },
  '25F4': latonDeck,

  // the Blot wanders the island
  '37DC': {
    es: 'Nunca vas a entender el dolor\nde los que se quedaron sin forma.\n\n¡Lo desprecio todo!\n\nVoy a odiar hasta borrar\ntodo lo que hay en este mundo.',
    en: "You'll never understand the pain\nof those left without a shape!\n\nI despise everything!\n\nI will hate until I erase\neverything in this world.",
  },
  '3944': { es: '¿Adónde... voy...?\n\n¿Me espera la paz?\n\n¿O me tragará más rencor?\n\nNo lo sé...', en: 'Where... am I... going?\n\nIs peace waiting for me?\n\nOr will more hatred swallow me?\n\nI do not know...' },
  '3A7C': { es: '¿Pretendes vencerme?', en: 'Do you intend to defeat me?' },
  '3B14': { es: 'Entonces, ¡fuera de mi vista!', en: 'Then get out of my sight!' },
  '3B88': { es: '¡Que te trague mi rencor!', en: 'Be swallowed by my hatred!' },
  '3C1C': {
    es: 'Ohhh... me apago...\n¿Se apagará también mi rencor?\n\n¿Será esta mi salvación?\nNo lo sé... No lo sé...\n\n¿Adónde... voy...?\n\n¿Me espera la paz allí?\n\n¿O me tragará más rencor?\n\nNo lo sé...',
    en: "Ohhh... I'm fading...\nWill my hatred fade, too?\n\nCould this be salvation?\nI don't know... I don't know...\n\nWhere... am I... going?\n\nIs peace waiting for me there?\n\nOr will more hatred swallow me?\n\nI do not know...",
  },
  '413C': {
    es: '¡Ohhh! El rencor crece dentro de mí.\n¡No lo puedo contener!\n\nTengo que librarme de él.\n¡Ya no lo soporto!\n\nHaré que todos sientan mi dolor.\n\n¡Siente mi dolor! ¡Siente mi angustia!\n\n¡Esta es la venganza de los que\nnunca pudieron evolucionar!',
    en: "Ohhh! The hatred inside me is growing.\nI can't contain it!\n\nI must rid myself of it.\nI can't take it anymore!\n\nI will make everyone feel my pain.\n\nFeel my pain! Feel my agony!\n\nThis is the revenge of those\nwho never got to evolve!",
  },
  '4360': deck('*c3Mazo Vacío Desesperado\nEl mazo más maligno y poderoso.', '*c3Desperate Void Deck\nThe most evil and powerful deck.'),

  // Gruñón drifts in on a barrel and won't take no for an answer
  '440C': {
    es: '¡Soy Gruñón! Crucé el mar en un barril\nsolo para llegar a esta isla.\n\n¡Juega conmigo! ¡Y ni se te\nocurra salir corriendo!\n\n¡Dije que juegues conmigo!',
    en: "I'm Gruñón! I crossed the sea\nin a barrel to reach this island!\n\nPlay me! And don't even think\nabout running away!\n\nI said, play me!",
  },
  '4530': { who: 'me', es: 'Bueno... si tanto insistes.', en: 'OK... if you really want to.' },
  '458C': { es: '¡Así me gusta!\n¡Que empiece la batalla!\n\n¡Ja, ja, ja, ja!', en: "That's more like it!\nLet the battle begin!\n\nHa ha ha ha ha!" },
  '478C': { es: '¡Oye, tú! ¡No hay tiempo para charlas!\n\n¡Apúrate y juguemos!\n¡Ja, ja, ja, ja!', en: "Hey, you! There's no time to chat!\n\nHurry up and let's play!\nHa ha ha ha ha!" },
  '4870': {
    es: 'Ya me las vas a pagar. ¡Acuérdate!\nLa próxima no me ganas.\n\nCuando menos lo esperes,\n¡ahí voy a estar! ¡Ja, ja, ja, ja!',
    en: "I'll get you for this. Mark my words!\nYou won't beat me next time!\n\nWhen you least expect it,\nthere I'll be! Ha ha ha ha!",
  },
  '498C': { es: '¡Vamos! ¿Empezamos o no?', en: 'Come on! Shall we start or not?' },
  '4A18': { es: '¿Cómo que no?', en: 'What do you mean, no?' },
  '4A78': { es: '¡Así se habla!', en: "That's the spirit!" },
  '4B08': {
    es: '¡Nooo! ¡Perdí!\n¡Juegas demasiado bien!\n\nYa me las vas a pagar.\n¡La próxima no me ganas!\n\nCuando menos lo esperes,\n¡ahí voy a estar! ¡Ja, ja, ja, ja!',
    en: "Oh nooo! I lost!\nYou're too strong!\n\nI'll get you for this, punk!\nYou won't beat me next time!\n\nWhen you least expect it,\nthere I'll be! Ha ha ha ha!",
  },
  '4E20': { es: '¡Ja, ja, ja, ja!\n¡Te gané!\n\n¡Qué bien me siento!\n\nTe enfrento cuando quieras.\n¡Ja, ja, ja, ja!', en: "Ha ha ha ha ha!\nGot you!\n\nMan, I feel great!\n\nI'll take you on anytime.\nHa ha ha ha ha!" },
  '4F58': deck('*c3Mazo Caras Raras\nUn mazo lleno de criaturas\nde lo más estrafalarias.', '*c3Funny Faces Deck\nA deck full of\nthe oddest-looking creatures.'),

  // the Arena only lets in decks without Support or Evolution cards (CITY06 checks mask 0xC0)
  '50EC': {
    who: null,
    es: 'No tienes ningún mazo sin cartas\nde Apoyo ni de Evolución.\n\nEn esta Arena no se permiten\ncartas de Apoyo ni de Evolución.\n\nSi quieres entrar, arma un mazo\nsin cartas de Apoyo ni de Evolución.',
    en: "You don't have any deck without\nSupport or Evolution cards.\n\nSupport and Evolution cards\naren't allowed in this Arena.\n\nTo enter, build a deck with\nno Support or Evolution cards.",
  },

  // the tournament: Melena, Grajo, Latón, then Mortaja
  '5314': { es: 'Soy... Melena.\n\nMi misión es acabar\ncon los viajeros.', en: 'I am... Melena.\n\nMy mission is to finish off\nthe travelers.' },
  '5478': { es: '¿Comenzamos?', en: 'Are you ready to begin?' },
  '5508': { es: 'De mí no se escapa nadie.', en: 'There is no escape from me.' },
  '5578': { es: '¡Muéstrame todo lo que tienes!', en: "Show me all you've got!" },
  '5618': {
    es: '¡Uf! Perdí...\nBien jugado.\n\nMe importaba tanto ganar\nque seguí a Mortaja sin pensar.\n\nDesde ahora solo quiero\ndisfrutar del juego.\n\n¿Me ayudas con eso?\n¡Te espero!',
    en: "Whoa! I lost...\nGreat job, kid.\n\nI cared so much about winning\nthat I followed Mortaja blindly.\n\nFrom now on, I just want\nto enjoy playing.\n\nWill you help me with that?\nI'll be waiting for you!",
  },
  '57BC': melena.won,
  '591C': melenaDeck,

  '5A54': {
    es: 'Soy Grajo, el heraldo de la niebla\ngris que cubre este mundo.\n\nVine a dejar a todos\nsin color y sin forma.\n\nA quien se cruce en mi camino,\nlo hundo en la niebla. ¡Ja, ja, ja!',
    en: "I am Grajo, herald of the grey fog\nthat covers this world.\n\nI'm here to leave everyone\nwithout color or shape.\n\nWhoever stands in my way sinks\ninto the fog! Ha ha ha!",
  },
  '5C74': { es: '¿Tanta prisa tienes\npor volverte gris?', en: 'In such a hurry\nto turn grey?' },
  '5D0C': { es: 'Ja, ja, ja...\nYa es demasiado tarde.', en: "Ha ha ha...\nIt's already too late!" },
  '5D90': { es: 'Ríndete. No hay nada que puedas hacer.\nJa, ja, ja.', en: 'Give it up. There is nothing you can do.\nHa ha ha!' },
  '5E50': {
    es: 'Ja, ja, ja...\nNo creas que esto terminó.\n\nComo la sombra sigue a la luz,\nel gris siempre sigue al color.\n\nVolveré. ¡Prepárate!\n\nJa, ja, ja.',
    en: "Ha ha ha...\nDon't think this is over yet.\n\nAs a shadow follows the light,\nthe grey always follows the color.\n\nI shall return. Be prepared!\n\nHa ha ha!",
  },
  '5FCC': {
    es: '¡Ja, ja, ja! Ahora conoces\nel terror de la niebla gris.\n\nDe este miedo no hay escape.\n¡Te perderás en mi niebla sin fin!\n\n¡Ja, ja, ja!',
    en: "Ha ha ha! Now you know\nthe terror of the grey fog.\n\nThere is no escape from this fear.\nYou'll be lost in my endless fog!\n\nHa ha ha!",
  },
  '6114': grajoDeck,

  '6260': {
    es: '¡Soy Latón, la estrella más brillante\nde toda la isla!\n¡Vaya, vaya! ¡Qué insolencia!\n\nNo me gusta cómo me miras.\nTe voy a dar tu merecido.\n\nMe hiciste enojar,\ny te vas a arrepentir.\n\nPídeme perdón ahora\nsi no quieres pasarla mal.',
    en: "I'm Latón, the shiniest star\non the whole island!\nMy, my! Aren't you a little brat?\n\nI don't like the way you look at me.\nI'm gonna punish you for that.\n\nYou made me mad, and\nnow you're gonna regret it!\n\nYou'd better apologize now\nif you don't want to get hurt!",
  },
  '64F0': { es: '¿Qué? ¿De verdad quieres jugar?', en: 'What? You really want to play?' },
  '658C': { es: 'Ya sé, ya sé.\nEntiendo cómo te sientes.', en: 'I know, I know.\nI understand how you feel.' },
  '661C': { es: 'Muy bien, no me voy a contener.\n\n¡Cuidado! No pienso tenerte piedad.', en: "Okay, I'm not gonna hold back.\n\nWatch out! I'll have no mercy on you." },
  '6714': {
    es: '¡Nooo! ¡Perdí!\n¿Y ahora qué hago?\n\n¡Rayos! ¡Me haces enojar tanto!\n¡Qué insolencia!\n\n¡Exijo la revancha!\nEsto no se queda así.\n\n¡Vuelve a jugar conmigo!',
    en: "Oh noooo! I lost!\nNow what do I do?\n\nDarn! You make me so mad!\nYou little brat!\n\nI demand a rematch!\nI won't let you get away with this!\n\nCome back for another battle!",
  },
  '68CC': {
    es: 'Vaya, vaya... ¡Gané!\nComo era de esperar, claro.\n\nEspero que hayas aprendido la lección:\nno debiste hacerme enojar.\n\nLo siento: todavía\nte falta mucho camino.\n\n¡Hasta luego!',
    en: "Well, well... I won!\nOnly natural, of course!\n\nI hope you learned your lesson.\nYou shouldn't have made me mad!\n\nSorry, kiddo.\nYou're still green!\n\nSee you later!",
  },
  '6A78': latonDeck,

  '6BA0': {
    es: '¡Ja, ja, ja, ja!\nPor fin llegas.\n\nVerte me recuerda a esos viajeros.\nQué desagradable.\n\nTe aplastaré con mis propias manos.\n\nDesde esta isla, mi niebla gris\nvolverá a cubrir el mundo.\n¡Y tú serás lo primero en caer!\n\n¡Ja, ja, ja, ja!',
    en: "Ha ha ha ha ha!\nSo, you're finally here.\n\nLooking at you reminds me of\nthose travelers. How unpleasant.\n\nI'll crush you with my own hands.\n\nFrom this island, my grey fog\nwill cover the world again.\nAnd you will be the first to fall!\n\nHa ha ha ha ha!",
  },
  '6E50': mortaja.bigTalk,
  '6EEC': mortaja.coward,
  '6F6C': mortaja.crush,
  '7010': {
    es: '¡No! No puedo creerlo...\nEsto no puede estar pasando...\n\n¡Otra vez pierdo contra los viajeros!\n¿Será este mi destino?\n\nQue así sea. ¡Exijo la revancha!\n\n¡Voy a cambiar mi destino!',
    en: "No! I can't believe it...\nThis can't be happening...\n\nI lost to the travelers again!\nIs this my destiny?\n\nSo be it. I demand a rematch!\n\nI must change my destiny!",
  },
  '7368': { es: '¡Ja, ja, ja, ja!\n\n¿Todavía confías en tu manera\nde jugar? ¡Dímelo!\n\nMaldice tu impotencia.\n¡Ja, ja, ja, ja!', en: 'Ha ha ha ha ha!\n\nDo you still trust your skills?\nTell me!\n\nCurse your powerlessness!\nHa ha ha ha ha!' },
  '74A4': mortajaDeck,
};
