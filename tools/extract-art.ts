/**
 * Extract the original card art (B.DRV, LC000..LC300, 64x64 TIM) as PNG into public/card-art/.
 *   npm run extract:art -- "<folder with B.DRV | path to B.DRV>"
 * The images are generated from the user's own disc and are git-ignored (not distributed).
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listDrv } from './extract/drv';
import { encodePng } from './extract/png';
import { decodeTim } from './extract/tim';

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: npm run extract:art -- "<folder with B.DRV | path to B.DRV>"');
  process.exit(1);
}
const drvPath = existsSync(arg) && statSync(arg).isDirectory() ? join(arg, 'B.DRV') : arg;
const drv = new Uint8Array(readFileSync(drvPath));
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'card-art');
mkdirSync(out, { recursive: true });
let n = 0;
for (const e of listDrv(drv).filter((x) => /^LC\d{3}$/.test(x.name))) {
  const img = decodeTim(drv.slice(e.offset, e.offset + e.size));
  writeFileSync(join(out, `${e.name}.png`), encodePng(img.width, img.height, img.rgba));
  n++;
}
console.log(`OK ${n} card images -> ${out}`);
