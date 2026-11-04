/**
 * Extract the progression tables (packs, fusion, Digi-Parts, partners, bonuses) from the user's own disc.
 *   npm run extract:progression -- "<folder with SLUS_013.28 and P.DRV>"
 * Writes src/data/progression.json.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeProgressionTables } from '../src/engine/progression/decodeTables';
import { readDrvFile } from './extract/drv';

const dir = process.argv[2];
if (!dir) {
  console.error('Usage: npm run extract:progression -- "<folder with SLUS_013.28 and P.DRV>"');
  process.exit(1);
}
const p = join(dir, 'P.DRV');
const tables = decodeProgressionTables(new Uint8Array(readFileSync(join(dir, 'SLUS_013.28'))), {
  KAWSEG: readDrvFile(p, 'KAWSEG.BIN'),
  EVOSEG: readDrvFile(p, 'EVOSEG.BIN'),
  OPENSEG: readDrvFile(p, 'OPENSEG.BIN'),
});
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'progression.json');
const doc = {
  game: 'Digimon Digital Card Battle (USA) SLUS-01328',
  extractedFrom: 'SLUS_013.28 + P.DRV (KAWSEG, EVOSEG, OPENSEG)',
  generatedBy: 'tools/extract-progression.ts',
  ...tables,
};
writeFileSync(out, JSON.stringify(doc, null, 1) + '\n');
console.log(`OK ${tables.packs.length} packs, ${tables.digiParts.length} Digi-Parts, ${tables.fusion.specials.length} special fusions -> ${out}`);
