/** Every text of the game in neutral Latin American Spanish, by screen. */
import { audio } from './audio';
import { board } from './board';
import { common } from './common';
import { decks } from './decks';
import { game } from './game';
import { log } from './log';
import { research } from './research';
import { story } from './story';
import { terms } from './terms';

export const es = { terms, common, board, log, audio, game, story, decks, research };

/** The shape every language must have (the compiler checks each one against it). */
export type Messages = typeof es;
