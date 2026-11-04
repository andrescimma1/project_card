/**
 * Copy the story scripts from the user's own disc so the browser can run them:
 *   C.DRV DEBUG/CITY00..11.MSD (cities) and EVENT/UNIT00..02.MSD (Fusion Shops) → public/scripts/
 *   npm run extract:scripts -- "<folder with C.DRV>"
 * The files contain the game's dialogue: they are git-ignored and never distributed.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readDrvPath } from './extract/drv';

const dir = process.argv[2];
if (!dir) {
  console.error('Usage: npm run extract:scripts -- "<folder with C.DRV>"');
  process.exit(1);
}
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'scripts');
mkdirSync(out, { recursive: true });
const files = [
  ...Array.from({ length: 12 }, (_, i) => `DEBUG/CITY${String(i).padStart(2, '0')}.MSD`),
  ...Array.from({ length: 3 }, (_, i) => `EVENT/UNIT0${i}.MSD`),
];
for (const f of files) writeFileSync(join(out, f.split('/')[1]), readDrvPath(join(dir, 'C.DRV'), f));
console.log(`OK ${files.length} scripts -> ${out}`);
