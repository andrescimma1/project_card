/** Progression tables extracted from the user's disc (npm run extract:progression). */
import data from '../../data/progression.json';
import type { ProgressionTables } from './decodeTables';

const { game: _game, extractedFrom: _from, generatedBy: _by, ...tables } = data;

export const progression = tables as unknown as ProgressionTables;
