/**
 * Extract the complete original card database from the user's own disc image files.
 *
 *   npm run extract:cards -- "<path to the extracted disc folder or B.DRV>"
 *
 * Writes src/data/cards.json. The game files themselves are never copied into the repo.
 */
import { existsSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readDrvFile } from './extract/drv';
import { KNOWN_ISSUES, KNOWN_NOTES } from './extract/knownIssues';
import { decodeCardTable } from '../src/engine/cards/decodeCdd';
import type { CardDatabase } from '../src/engine/cards/types';

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: npm run extract:cards -- "<folder with B.DRV | path to B.DRV>"');
  process.exit(1);
}
const drvPath = existsSync(arg) && statSync(arg).isDirectory() ? join(arg, 'B.DRV') : arg;
const cdd = readDrvFile(drvPath, 'CARD2.CDD');
const { cards, bytesConsumed, totalBytes } = decodeCardTable(cdd);
if (bytesConsumed !== totalBytes) {
  throw new Error(`Layout mismatch: consumed ${bytesConsumed} of ${totalBytes} bytes`);
}

for (const card of cards) {
  card.issues.push(...(KNOWN_ISSUES[card.name] ?? []));
  const manual = KNOWN_NOTES[card.name] ?? [];
  // A manual note replaces the automatic one on the same field.
  card.notes = [...card.notes.filter((n) => !manual.some((m) => m.field === n.field)), ...manual];
}

const db: CardDatabase = {
  game: 'Digimon Digital Card Battle (USA) SLUS-01328',
  extractedFrom: 'B.DRV/CARD2.CDD',
  cardCount: cards.length,
  generatedBy: 'tools/extract-cards.ts',
  cards,
};

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src', 'data', 'cards.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(db, null, 1) + '\n');

const by = (k: string) => cards.filter((c) => c.kind === k).length;
console.log(
  `OK ${cards.length} cards (${by('digimon')} digimon, ${by('option')} option, ${by('digivolve')} digivolve) ` +
    `from ${totalBytes} bytes -> ${out}`,
);
console.log(`Cards with open issues: ${cards.filter((c) => c.issues.length).length}, with text/behaviour notes: ${cards.filter((c) => c.notes.length).length}`);
