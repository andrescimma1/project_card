/** Every text of the game in English, by screen. */
import type { Messages } from '../es';
import { audio } from './audio';
import { board } from './board';
import { common } from './common';
import { decks } from './decks';
import { game } from './game';
import { log } from './log';
import { research } from './research';
import { story } from './story';
import { terms } from './terms';

export const en: Messages = { terms, common, board, log, audio, game, story, decks, research };
