/**
 * Mirador de las Nubes (city 8): a lookout above the clouds, with windmills, bells and telescopes. Zarpa
 * asks the player to find out what is happening at the Archivist's Tower, but first the player has to beat
 * her at her Arena; Clara, a traveller, dreams of a tower wrapped in grey fog; Abalorio runs the word
 * machine (the keywords) and opens the Arena with Altura. The Arena gives the pass to Cliff Road.
 * The later phases (the Extra Arena of Zarpa's other shapes, the Blot) are in city08later.ts.
 */
import { CITY08_LATER } from './city08later';
import type { CityTexts, Written } from './types';

const deck = (es: string, en: string): Written => ({ who: null, es, en });
const abalorioDeck = deck('*c3Mazo Chistera\nUn mazo de trucos, con muchas cartas\nde Apoyo y ataques de Instinto.', '*c3Top Hat Deck\nA deck of tricks, with lots of\nSupport cards and Instinct attacks.');
const alturaDeck = deck('*c3Mazo Caída Libre\nHecho para derribar criaturas Perfectas.', '*c3Free Fall Deck\nBuilt to take down Apex creatures.');
const zarpaDeck = deck('*c3Mazo Uña Afilada\nUn mazo Verde de ataques directos.', '*c3Sharp Claw Deck\nA Green deck of straight attacks.');
const claraDeck = deck('*c3Mazo Damas del Cielo\nUn mazo solo de damas.\nJuega suave y flexible.', '*c3Sky Ladies Deck\nA deck of ladies only.\nSmooth and flexible play.');

const fusionNotes: Written = { who: null, es: 'Recibiste *c6notas de fusión especial*c7.', en: 'You got *c6Special Fusion Notes*c7.' };
/** Abalorio, when the word machine rings out a card. */
const machineHit = { es: '¡Suenan las campanas!\n¡La máquina te dio una carta nueva!', en: 'The bells are ringing!\nThe machine gave you a new card!' };
const abalorio = {
  trick: { es: '¿Quieres ver mi Truco Final?', en: 'Do you want to see my Final Trick?' },
  lost: {
    es: 'Qué decepción. Así nunca vas\na deshacer mi Truco Final.',
    en: "How disappointing. You'll never\nundo my Final Trick like that.",
  },
};
const altura = {
  go: { es: '¡Eso! ¡Vamos allá!', en: 'Yeah! Here we go!' },
  stiff: { es: 'Jugaste con demasiada tensión.\nTienes que relajarte más.\n\n¡Disfruta las batallas!\nY vuelve a desafiarme.', en: "You played way too stiff.\nYou've got to relax more.\n\nEnjoy the battles!\nAnd come challenge me again." },
};
const zarpa = {
  begin: { es: '¿Empezamos?', en: 'Shall we begin?' },
  hurry: { es: '¡Rápido! No nos queda mucho tiempo.', en: "Hurry! We don't have much time." },
  go: { es: '¡Bien! ¡Vamos a lo nuestro!', en: "Good! Let's get down to it!" },
};
const clara = {
  bad: {
    es: 'Tengo un mal presentimiento...\nSigo soñando con esa torre enorme.\n\nNo sé dónde está, pero la niebla\ngris la cubre por completo.',
    en: "I have a bad feeling about this...\nI keep dreaming of that huge tower.\n\nI don't know where it is, but\nthe grey fog covers it completely.",
  },
};

const CAFE: CityTexts = {
  // Abalorio, at the café: his deck and the word machine
  '1510': { es: 'Nadie escapa de mi Truco Final.\n\nTodavía estás a tiempo de huir.\n¡Ja, ja, ja!', en: "Nobody escapes my Final Trick.\n\nThere's still time to run away.\nHa ha ha!" },
  '15C0': abalorio.trick,
  '1660': { es: '¿No? Me sorprende que hayas\nllegado tan lejos con tan poco valor.', en: "No? I'm surprised you made it\nthis far with so little nerve." },
  '16DC': { es: 'Valor no te falta, pero...\n¡el valor no basta contra un buen truco!', en: "You've got nerve, but...\nnerve won't beat a good trick!" },
  '1780': {
    es: '¡Vaya! Deshiciste mi Truco Final.\n\nTienes talento. Algún día podrías\ntener tu propia Arena.\n\nTe deseo suerte.\n¡Hasta pronto!',
    en: 'Well! You undid my Final Trick.\n\nYou have talent. One day you might\nrun an Arena of your own.\n\nGood luck to you.\nSee you soon!',
  },
  '18E4': {
    es: `${abalorio.lost.es}\n\nPara tener tu propia Arena\nhace falta más talento.\n\nTe deseo suerte.\n¡Hasta pronto!`,
    en: `${abalorio.lost.en}\n\nRunning an Arena of your own\ntakes more talent than that.\n\nGood luck to you.\nSee you soon!`,
  },
  '1A68': abalorioDeck,
  '1B28': {
    es: '¡Qué bueno que viniste!\n¿Ves esta máquina?\n\nLa mueven los molinos del mirador.\nYo la llamo la máquina de palabras.\n\nLe dices una palabra clave y,\nsi es la buena, suenan las campanas...\n\n...¡y sale una carta nueva!\n\n¿Qué te parece? ¿Quieres probarla?',
    en: "Glad you came by!\nDo you see this machine?\n\nThe lookout's windmills drive it.\nI call it the word machine.\n\nSay a keyword to it, and if it's\nthe right one, the bells ring...\n\n...and out comes a new card!\n\nWhat do you think? Want to try it?",
  },
  '1CD0': { es: '¡Qué gusto verte!\n¿Quieres probar la máquina de palabras?', en: 'Good to see you!\nWant to try the word machine?' },
  '1D64': { es: 'Bueno, bueno...\n¿Quieres probar otra vez?', en: 'Well, well...\nWant to try again?' },
  '1E24': { es: 'Bueno, qué lástima.\n\nSi quieres usar la máquina,\nven a verme.\n\n¡Hasta la próxima!', en: 'Oh well, too bad.\n\nIf you want to use the machine,\ncome and see me.\n\nSee you next time!' },
  '1F40': { es: '¡Bien!\nEntonces, di la palabra clave.', en: 'Alright!\nThen say the keyword.' },
  '20CC': machineHit,
  '21C4': machineHit,
  '22B8': machineHit,
  '23B0': machineHit,
  '24A8': machineHit,
  '25A0': machineHit,
  '269C': machineHit,
  '2794': machineHit,
  '2884': machineHit,
  '2978': machineHit,
  '2A54': { es: 'Un momento... Esa carta\nya salió una vez.\n\nLa misma palabra no sirve dos veces.\nPrueba con otra.', en: "Wait a moment... That card\ncame out once already.\n\nThe same word won't work twice.\nTry another one." },
  '2B68': { es: '¡No se puede inventar!\nTiene que ser una palabra clave.', en: "You can't just make one up!\nIt has to be a real keyword." },
  '2C10': { es: '¿Eh? ¿Cambiaste de idea?', en: 'Huh? Did you change your mind?' },

  // Altura, at the café
  '2D98': {
    es: 'Soy bastante salvaje. Ten cuidado,\nque te puedes lastimar.\n\n¡Era broma, no muerdo!\nNo pongas esa cara. ¡Ja, ja, ja!\n\nTe doy unos consejos útiles.\n\nUn mazo de una facción, como el Rojo,\nlleva sobre todo cartas Rojas.\n\nPara juntar cartas de una facción,\nbusca a alguien que juegue con ella.\n\nSi le ganas, te llevas\nalgunas de sus cartas.',
    en: "I'm pretty wild. Be careful,\nor you might get hurt.\n\nKidding, I don't bite!\nDon't make that face. Ha ha ha!\n\nHere are some useful tips.\n\nA one-faction deck, like a Red deck,\nhas mostly Red cards.\n\nTo collect cards of a faction,\nfind someone who plays it.\n\nBeat them, and you'll get\nsome of their cards.",
  },
  '3080': { es: '¿Una partida? ¡Yo siempre tengo ganas!', en: "A match? I'm always up for one!" },
  '3118': { es: 'Oye, ya te lo dije...\nNo hace falta tener miedo.', en: "Hey, like I said...\nThere's no need to be scared." },
  '31B0': altura.go,
  '3250': {
    es: '¡Uy! Me confié demasiado.\nNo pensé que iba a perder.\n\nOye, suelta los hombros.\nRelájate un poco, ¿sí?\n\nEn una batalla hay que disfrutar.\n\nGanar importa, claro, pero también\nhay que pasarla bien.\n\nEse es mi consejo.',
    en: "Whoa! I got too cocky.\nI didn't think I'd lose.\n\nHey, loosen up those shoulders.\nRelax a little, OK?\n\nYou've got to enjoy a battle.\n\nWinning matters, sure, but you've\ngot to have fun, too.\n\nThat's my advice.",
  },
  '34E8': { es: `¿Qué pasó? ¿Te dio miedo la altura?\n\n${altura.stiff.es}`, en: `What happened? Scared of heights?\n\n${altura.stiff.en}` },
  '3664': alturaDeck,

  // Zarpa asks for help
  '3708': { es: 'Soy Zarpa. Te doy la bienvenida\nal Mirador de las Nubes.', en: "I'm Zarpa. Welcome to\nCloud Lookout." },
  '377C': { who: 'me', es: '¡Hola! Soy *h0.', en: "Hi! I'm *h0!" },
  '37CC': { es: 'Para llegar hasta aquí arriba,\ndebes jugar muy bien a las cartas.', en: 'To make it all the way up here,\nyou must play cards very well.' },
  '385C': { who: 'me', es: '¡Me encanta jugar a las cartas!', en: 'I love playing cards!' },
  '38C4': { es: 'Mmm... Sí.\nTal vez tú puedas hacerlo.', en: 'Hmm... Yes.\nMaybe you can do it.' },
  '3938': { who: 'me', es: '¿Eh? ¿De qué hablas?', en: 'Huh? What are you talking about?' },
  '399C': {
    es: 'Nada, hablaba sola.\n\nSupongo que pasaste por otros\npueblos para llegar aquí.\n\n¿Notaste algo raro en el camino?',
    en: 'Nothing, just talking to myself.\n\nI suppose you passed through\nother towns to get here.\n\nDid you notice anything strange?',
  },
  '3ABC': {
    who: 'me',
    es: 'Sí. Un tal Coleccionista andaba\nquedándose con las Arenas.\n\nDejaba a las criaturas sin voluntad,\n«bajo su hechizo». Le gané en Ciudad\nsin Faroles, pero se escapó.\n\nTambién oí a unas criaturas hablar\nde «él» y de una «niebla gris».\n\nPero no sé quién es «él»,\nni qué es esa niebla.',
    en: 'Yes. Someone called the Collector\nwas taking over the Arenas.\n\nHe left creatures with no will,\n"under his spell." I beat him in\nLampless City, but he got away.\n\nI also heard some creatures talk\nabout "him" and a "grey fog."\n\nBut I don\'t know who "he" is,\nor what that fog is.',
  },
  '3C94': { es: '¿Una niebla gris...?\n\nYa veo.', en: 'A grey fog...?\n\nI see.' },
  '3D1C': { who: 'me', es: 'Oye, ¿qué está pasando?', en: "Hey, what's going on?" },
  '3D74': {
    es: 'Verás, viajo con Clara,\nuna viajera como tú.\n\nÚltimamente tiene pesadillas.\n\nClara siente cosas que otros no.\nLo malo la alcanza antes que a nadie.\n\nY no va a aguantar mucho más así.\n\nAquí en el mirador todo está tranquilo.\nEl problema debe de estar más adelante.\n\nMe gustaría ir a ver yo misma,\npero no puedo dejar sola a Clara.\n\nTengo que quedarme a su lado.\n\nSi vas hacia la Torre del Archivero,\n¿podrías averiguar qué pasa allí?',
    en: "You see, I travel with Clara,\na traveller like you.\n\nLately she's been having nightmares.\n\nClara feels things others don't.\nEvil reaches her before anyone else.\n\nAnd she can't take much more of it.\n\nHere at the lookout, all is calm.\nThe trouble must be further ahead.\n\nI'd like to go and see for myself,\nbut I can't leave Clara alone.\n\nI have to stay by her side.\n\nIf you head for the Archivist's Tower,\ncould you find out what's going on?",
  },
  '40CC': { who: 'me', es: 'Claro. Cuenta conmigo.', en: 'Sure. You can count on me.' },
  '4124': {
    es: '¿De verdad? Te lo agradezco mucho.\n\nPero antes de irte, tienes que\nganar en mi Arena.\n\nPerdona que te lo ponga difícil,\npero las reglas son las reglas.\n\nSé que puedes ganar. Cuento contigo.\nTe espero en la Arena.',
    en: "Really? Thank you so much.\n\nBut before you go, you have to\nwin at my Arena.\n\nSorry to make it hard for you,\nbut rules are rules.\n\nI know you can win. I'm counting on you.\nI'll be waiting at the Arena.",
  },
  '4428': { es: 'Siento ponerte esta prueba después\nde que aceptaste ayudarme.\n\nPero así son las cosas.\n\nConfía en lo que sabes hacer.\nTe espero en la Arena.', en: "I'm sorry to test you after\nyou agreed to help me.\n\nBut that's how things are.\n\nTrust in what you can do.\nI'll be waiting at the Arena." },
  '454C': { es: 'Lo sabía: juegas muy bien.\n\nPor cierto, hace tiempo encontré esto.\nCreo que a ti te va a servir más.', en: "I knew it: you play very well.\n\nBy the way, I found this a while back.\nI think it'll be more useful to you." },
  '4658': fusionNotes,
  '46B4': { es: 'Creo que se usan en la tienda\nde fusión. Ojalá te sirvan.\n\nHasta pronto. Juguemos otra vez.', en: "I think they're used at the fusion\nshop. I hope they help.\n\nSee you. Let's play again sometime." },
  '47A0': { es: 'Yo también tengo que mejorar,\no no podré proteger a Clara.\n\nMe encantaría aprender\nun poco de cómo juegas.', en: "I need to improve too,\nor I won't be able to protect Clara.\n\nI'd love to learn a bit\nfrom the way you play." },
  '489C': zarpa.begin,
  '4920': zarpa.hurry,
  '4994': zarpa.go,
  '4A38': {
    es: 'Eres fuerte, como pensaba...\nMi poder no alcanza contra el tuyo.\n\nTengo que entrenar más.\nDebo proteger a Clara.\n\nMe encantaría aprender de ti.',
    en: "You're strong, just as I thought...\nMy power is no match for yours.\n\nI must train harder.\nI have to protect Clara.\n\nI'd love to learn from you.",
  },
  '4CAC': { es: 'Sé que puedes jugar mucho mejor.\nSe nota.\n\nSi tienes tiempo,\n¿jugamos otra?', en: 'I know you can play much better.\nI can tell.\n\nIf you have time,\nhow about another match?' },
  '4DB4': zarpaDeck,

  // Clara, a traveller who dreams of a tower
  '4E90': { es: '...', en: '...' },
  '4EE8': { es: '...\n\n¡Ah, hola! Soy Clara. Mucho gusto.', en: "...\n\nOh, hi! I'm Clara. Nice to meet you." },
  '4F80': { who: 'me', es: 'Hola, soy *h0.', en: "Hi, I'm *h0!" },
  '4FD0': { es: '¿Acabas de llegar?', en: 'Did you just get here?' },
  '5028': { who: 'me', es: 'Sí, así es...', en: "Yes, that's right..." },
  '5080': { es: '¿Has visto algo raro últimamente?', en: 'Have you seen anything strange lately?' },
  '50F0': { who: 'me', es: 'Bueno, tal vez...\n\nUn problema ya lo resolví,\npero hay otro que todavía no sé.', en: "Well, maybe...\n\nI solved one problem,\nbut I'm not sure about the other." },
  '51B4': { who: 'me', es: 'Oye, ¿has visto a una criatura\ncon una flor en la cabeza?', en: 'Hey, have you seen a creature\nwith a flower for a head?' },
  '524C': { es: '¿Eh...? (¿Hablará de Azucena?)\nNo, no la he visto.', en: "Huh...? (Could that be Azucena?)\nNo, I haven't seen her." },
  '52E4': { who: 'me', es: 'Ya veo...', en: 'I see...' },
  '5330': {
    es: 'Tengo un mal presentimiento...\nSiempre sueño con una torre enorme.\n\nLa envuelve una niebla gris.\nLa busco con los telescopios,\npero no sé dónde está.',
    en: "I have a bad feeling...\nI keep dreaming of a huge tower.\n\nA grey fog surrounds it.\nI search for it with the telescopes,\nbut I don't know where it is.",
  },
  '5440': { who: 'me', es: '¿Una torre...?\n¿Será la Torre del Archivero?', en: "A tower...?\nCould it be the Archivist's Tower?" },
  '54B8': { es: 'No lo sé.\n\nSiento algo extraño del otro lado\ndel Camino del Risco.\n\n¡Ay, no me gusta nada sentirme así!', en: "I don't know.\n\nI feel something strange on the far\nside of Cliff Road.\n\nUgh, I hate feeling like this!" },
  '55C0': { who: 'me', es: 'No te preocupes.\nYo voy a averiguarlo.\n\nEs lo menos que puedo hacer.', en: "Don't worry.\nI'll find out.\n\nIt's the least I can do." },
  '5670': { es: 'Gracias.', en: 'Thank you.' },
  '5934': clara.bad,
  '5A88': {
    es: '¡Juegas muy bien!\nYo no juego tan bien como tú, pero...\n\n¿Jugarías conmigo alguna vez?\n\nAh, tu compañero es Zarpa.\n\nEntonces usa esto.\n¡Es un huevo para Zarpa!',
    en: "You play really well!\nI'm not as good as you, but...\n\nWould you play with me sometime?\n\nOh, your partner is Zarpa.\n\nThen please use this.\nIt's an egg for Zarpa!",
  },
  '5C3C': { who: null, es: 'Recibiste el *c3huevo de la Luz*c7 de Zarpa.', en: "You got Zarpa's *c3Egg of Light*c7!" },
  '5CB4': { es: 'Con este huevo, en batalla,\nZarpa puede evolucionar en Esfinge.\n\nOjalá te sirva.', en: 'With this egg, in battle,\nZarpa can evolve into Esfinge.\n\nI hope it helps.' },
  '5D88': { who: 'me', es: '¡Gracias!\n¡Es genial!', en: 'Thanks!\nThis is great!' },
  '5DF0': { es: '¡Mucha suerte!', en: 'Good luck!' },
  '5E5C': { es: '¡Juegas de maravilla! Yo no tengo\ntu nivel, pero...\n\n¿Me dejas desafiarte alguna vez?\n\n¡Mucha suerte!', en: "You're amazing! I'm not at\nyour level, but...\n\nCan I challenge you sometime?\n\nGood luck!" },
  '5F88': { es: '¿Jugamos una partida?', en: 'How about a match?' },
  '6014': { es: 'Ah... Bueno, está bien.', en: 'Oh... OK, then.' },
  '60C8': { es: '¡Bien! ¡Empecemos!', en: "OK! Let's start!" },
  '610C': { es: 'Quiero pedirte un favor...', en: 'I have a favor to ask you...' },
  '6158': { es: 'Esta vez, ¿jugarías con el\n*c3Mazo Esfinge*c7 que armé yo?', en: 'This time, would you play with\nthe *c3Esfinge Deck*c7 I made?' },
  '61C4': { es: '¡Es un mazo precioso!', en: "It's a really lovely deck!" },
  '6218': { es: 'Tengo otro favor que pedirte...', en: 'I have another favor to ask...' },
  '626C': { es: 'Esta vez, ¿jugarías con el\n*c3Mazo Ancla*c7 que acabo de armar?', en: 'This time, would you play with\nthe *c3Ancla Deck*c7 I just made?' },
  '62D8': { es: '¡Este es muy fuerte!', en: 'This one is really strong!' },
  '63B4': {
    es: '¡Ay, perdí!\n¡De verdad juegas muy bien!\n\nBueno, es lógico.\nYa ganaste un montón de Arenas.\n\nIgual, gracias. Me divertí mucho.\n\nNo soy tan buena, pero...\n¿jugarías conmigo cuando tengas tiempo?',
    en: "Oh, I lost!\nYou really are good!\n\nWell, it makes sense.\nYou've won so many Arenas.\n\nThanks anyway. I had a lot of fun.\n\nI'm not that good, but...\nwill you play with me when you're free?",
  },
  '6780': {
    es: '¡Eh! ¡Gané!\n¿Qué te pasó?\n\nNo te sientes bien, ¿verdad?\nEsto no es normal.\n\nGracias igual. Fue divertido.\n\n¿Jugamos otra vez? Seguro que\nla próxima no tengo tanta suerte.',
    en: "Hey! I won!\nWhat happened?\n\nYou're not feeling well, are you?\nThis isn't like you.\n\nThanks anyway. It was fun.\n\nWant to play again? I bet I won't\nbe so lucky next time.",
  },
  '6928': claraDeck,
};

const ARENA: CityTexts = {
  'ABBC': { who: null, es: '¿Seguro que quieres\nentrar a la Arena?', en: 'Are you sure you want\nto enter the Arena?' },

  // Abalorio, the first opponent
  'AD38': { es: 'Soy Abalorio, tu primer rival.\n\nNadie escapa de mi Truco Final.\nTodavía puedes huir. ¡Ja, ja, ja!', en: "I'm Abalorio, your first opponent.\n\nNobody escapes my Final Trick.\nYou can still run. Ha ha ha!" },
  'AEEC': abalorio.trick,
  'AF88': { es: '¿No? ¡Me sorprende que llegaras\nhasta aquí con tan poco valor!', en: "No? I'm surprised you got this far\nwith so little nerve!" },
  'B014': { es: '¡Así me gusta! ¡Adelante!', en: "That's the spirit! Bring it on!" },
  'B0B4': {
    es: '¡Vaya, qué sorpresa!\nDeshiciste mi Truco Final.\n\n¡Tienes jugadas increíbles!\n\nPero cuidado: la maestra\nde esta Arena es muy fuerte.\n\nTe deseo suerte.\n¡Hasta pronto!',
    en: "Well, what a surprise!\nYou undid my Final Trick.\n\nYou've got amazing moves!\n\nBut watch out: the master\nof this Arena is very strong.\n\nGood luck to you.\nSee you soon!",
  },
  'B278': {
    es: `${abalorio.lost.es}\n\nTe falta talento para llegar lejos.\n\nIgual, para seguir adelante\ntienes que ganar en esta Arena.\n\n¡Desafíame cuantas veces quieras!\nSuerte.\n\n¡Hasta pronto!`,
    en: `${abalorio.lost.en}\n\nYou need more talent to go far.\n\nStill, to move on, you have\nto win in this Arena.\n\nChallenge me as often as you like!\nGood luck.\n\nSee you soon!`,
  },
  'B4B0': abalorioDeck,

  // Altura, the second opponent
  'B5F0': {
    es: 'Soy Altura, tu segundo rival.\n\nSoy bastante salvaje. Ten cuidado,\nque te puedes lastimar.\n\n¡Era broma, no muerdo!\nNo tengas tanto miedo. ¡Ja, ja, ja!',
    en: "I'm Altura, your second opponent.\n\nI'm pretty wild. Be careful,\nor you might get hurt.\n\nKidding, I don't bite!\nDon't be so scared. Ha ha ha!",
  },
  'B818': { es: '¿Empezamos? ¡Yo siempre tengo ganas!', en: "Shall we? I'm always up for it!" },
  'B8B8': { es: 'Como te dije,\nno hace falta tener miedo.', en: "Like I said,\nthere's no need to be scared." },
  'B948': altura.go,
  'B9E4': {
    es: '¡Rayos! Me confié demasiado.\nNo pensé que iba a perder.\n\n¿Sabes qué deberías hacer?\nRelajarte más.\n\n¿No crees?\n\n¡Suelta los hombros!\nDisfruta la partida.\n\nGanar importa, claro, pero en una\ncompetencia también hay que disfrutar.\n\nEse es mi consejo.\n¡Suerte, y tómalo con calma!',
    en: "Darn! I got too cocky.\nI didn't think I'd lose.\n\nYou know what you should do?\nRelax more.\n\nDon't you think?\n\nLoosen up those shoulders!\nEnjoy the match.\n\nWinning matters, sure, but you've\ngot to enjoy competing, too.\n\nThat's my advice.\nGood luck, and take it easy!",
  },
  'BC94': { es: `¿Viste eso? ¡No pierdo tan fácil!\n\n${altura.stiff.es}\n\n¡Hasta la próxima!`, en: `Did you see that? I don't lose easily!\n\n${altura.stiff.en}\n\nUntil next time!` },
  'BE6C': alturaDeck,

  // Zarpa, master of the Arena
  'BF8C': {
    es: 'Soy Zarpa, la maestra de esta Arena.\n\nEstoy muy preocupada por Clara.\n\nMe cuesta pedírtelo, pero\nnecesito que me hagas un favor.\n\nIría yo misma, pero no puedo\ndejar sola a Clara.\n\nQuiero que vayas a la Torre\ndel Archivero y veas qué pasa allí.\n\nPero no te dejaré pasar sin más.\nPrimero tienes que vencerme.\n\nSi no puedes conmigo, olvídate\nde llegar a la Torre del Archivero.\n\nConfío en lo que sabes hacer.\nEntonces, ¡empecemos!',
    en: "I'm Zarpa, master of this Arena.\n\nI'm very worried about Clara.\n\nIt's hard for me to ask, but\nI need you to do me a favor.\n\nI'd go myself, but I can't\nleave Clara alone.\n\nI want you to go to the Archivist's\nTower and see what's happening there.\n\nBut I won't just let you through.\nYou have to beat me first.\n\nIf you can't beat me, forget about\nreaching the Archivist's Tower.\n\nI trust in what you can do.\nNow, let's begin!",
  },
  'C3A0': zarpa.begin,
  'C424': zarpa.hurry,
  'C498': zarpa.go,
  'C550': {
    es: 'Lo sabía...\nPuedo dejar esta misión en tus manos.\n\nSé que te pido mucho,\npero por favor, hazlo por mí.\n\nBuen viaje.\nAdiós.',
    en: "I knew it...\nI can leave this mission in your hands.\n\nI know I'm asking a lot,\nbut please, do this for me.\n\nSafe travels.\nGoodbye.",
  },
  'C6A4': { who: null, es: '¡Felicitaciones por la victoria!\nRecibiste el pase al Camino del Risco.', en: 'Congratulations on your win!\nYou got the pass to Cliff Road.' },
  'D1EC': {
    es: 'Eres fuerte, como pensaba.\nMi poder no alcanza contra el tuyo.\n\nYo también tengo que hacerme fuerte,\no no podré proteger a Clara.\n\nMe encantaría aprender\nun poco de cómo juegas.\n\nTe espero en el Café de batallas.\nAdiós.',
    en: "You're strong, just as I thought.\nMy power is no match for yours.\n\nI must get stronger, too,\nor I can't protect Clara.\n\nI'd love to learn a bit\nfrom the way you play.\n\nI'll be waiting at the Battle Cafe.\nGoodbye.",
  },
  'D4A8': {
    es: 'Sé que no diste todo lo que tienes.\nSe nota.\n\n¿Lo intentamos otra vez? Solo tú\npuedes cumplir esta misión.\n\nPor favor. Cuento contigo.\n\nAdiós.',
    en: "I know you didn't give it everything.\nI can tell.\n\nShall we try again? Only you\ncan carry out this mission.\n\nPlease. I'm counting on you.\n\nGoodbye.",
  },
  'D640': {
    es: '¡Sí! Pero... ¿no te contuviste?\n\nO tal vez yo me estoy\nhaciendo más fuerte.\n\nComo sea, fue una buena lección.\n\nPuedes volver a esta Arena\ncuando quieras.\n\nAdiós.',
    en: "Yes! But... did you hold back?\n\nOr maybe I'm just\ngetting stronger.\n\nEither way, it was a good lesson.\n\nYou can come back to this Arena\nanytime, my friend.\n\nGoodbye.",
  },
  'D7E4': zarpaDeck,
  'D8B4': { who: null, es: '¿Seguro que quieres\nsalir de la Arena?', en: 'Are you sure you want\nto leave the Arena?' },
};

export const CITY08: CityTexts = { ...CAFE, ...ARENA, ...CITY08_LATER };
