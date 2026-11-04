/**
 * Extract the game's built-in decks (B.DRV/DECK2.DEK) from the user's own disc files.
 *   npm run extract:decks -- "<folder with B.DRV | path to B.DRV>"
 * Writes src/data/decks.json.
 */
import { existsSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readDrvFile } from './extract/drv';
import { decodeDeckFile } from '../src/engine/cards/decodeDecks';

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: npm run extract:decks -- "<folder with B.DRV | path to B.DRV>"');
  process.exit(1);
}
const drvPath = existsSync(arg) && statSync(arg).isDirectory() ? join(arg, 'B.DRV') : arg;
const decks = decodeDeckFile(readDrvFile(drvPath, 'DECK2.DEK'));
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'decks.json');
writeFileSync(out, JSON.stringify(decks, null, 1) + '\n');
console.log(`OK ${decks.length} decks -> ${out}`);
