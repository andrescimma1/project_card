/** Lines that every town repeats (key = `shared` of the run in the city logic). */
import type { Written } from './types';

export const SHARED: Record<string, Written> = {
  arenaClosed: { who: null, es: 'La Arena está cerrada por ahora.\nVuelve más tarde.', en: 'The Arena is closed for now.\nPlease come back later.' },
  arenaOpen: { who: null, es: '*c6¡La Arena está abierta!\n*c6¡Que pasen los valientes!', en: '*c6The Arena is now open!\n*c6Those who are ready, come on in!' },
  enterArena: { who: null, es: '¿Seguro que quieres\nentrar a la Arena?', en: 'Are you sure you want\nto enter the Arena?' },
  enterExtraArena: { who: null, es: '¿Seguro que quieres\nentrar a la Arena Extra?', en: 'Are you sure you want\nto enter the Extra Arena?' },
  leaveArena: { who: null, es: '¿Seguro que quieres\nsalir de la Arena?', en: 'Are you sure you want\nto leave the Arena?' },
  congrats: { who: null, es: '¡Felicitaciones por la victoria!', en: 'Congratulations on your win!' },
  farewell: { who: null, es: 'Te esperamos pronto.', en: 'We hope to see you again soon.' },
  whoTalk: { who: null, es: '¿Con quién quieres hablar?', en: 'Who do you want to talk to?' },
  whereGo: { who: null, es: '¿Adónde quieres ir?', en: 'Where do you want to go?' },
  pickOption: { who: null, es: 'Elige una opción.', en: 'Pick an option.' },
};

/** Text written for runs nobody has written yet, from what follows them. */
export const GENERIC = {
  /** A question before a yes / no menu. */
  yesNo: { es: '¿Qué dices?', en: 'What do you say?' },
  /** A question before the Talk / Combat / Information menu. */
  whatToDo: { es: '¿Qué quieres hacer?', en: 'What do you want to do?' },
  pack: { es: 'Recibiste un sobre.', en: 'You got a pack.' },
  cards: (n: number) => (n === 1 ? { es: 'Recibiste una carta.', en: 'You got a card.' } : { es: `Recibiste ${n} cartas.`, en: `You got ${n} cards.` }),
  part: { es: 'Recibiste una reliquia para tu compañero.', en: 'You got a relic for your partner.' },
  /** A character whose lines are not written yet. */
  silent: '…',
};
