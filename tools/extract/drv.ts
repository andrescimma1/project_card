/**
 * Reader for the *.DRV archives of Digimon Digital Card Battle.
 *
 * The archive starts with a directory of 32-byte records:
 *   +0x00 u8  0x01, then 3-char extension ("ARC", "CDD", "TIM", "BIN"...)
 *   +0x04 u32 start sector (2048-byte sectors, relative to the archive start)
 *   +0x08 u32 size in bytes
 *   +0x0C u32 timestamp
 *   +0x10 char[16] name (NUL padded)
 */
import { readFileSync } from 'node:fs';

export interface DrvEntry {
  name: string;
  ext: string;
  offset: number;
  size: number;
}

const SECTOR = 2048;

export function listDrv(buf: Uint8Array): DrvEntry[] {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const out: DrvEntry[] = [];
  for (let o = 0; o + 32 <= Math.min(buf.length, 64 * 1024); o += 32) {
    if (buf[o] !== 0x01) continue;
    const ext = String.fromCharCode(buf[o + 1], buf[o + 2], buf[o + 3]);
    if (!/^[A-Z0-9]{3}$/.test(ext)) continue;
    let name = '';
    for (let i = 0; i < 16 && buf[o + 16 + i]; i++) name += String.fromCharCode(buf[o + 16 + i]);
    out.push({ name, ext, offset: dv.getUint32(o + 4, true) * SECTOR, size: dv.getUint32(o + 8, true) });
  }
  return out;
}

export function readDrvFile(drvPath: string, fileName: string): Uint8Array {
  const buf = new Uint8Array(readFileSync(drvPath));
  const [name, ext] = fileName.toUpperCase().split('.');
  const e = listDrv(buf).find((x) => x.name.toUpperCase() === name && x.ext === ext);
  if (!e) throw new Error(`${fileName} not found in ${drvPath}`);
  return buf.slice(e.offset, e.offset + e.size);
}

/**
 * A file by path inside a DRV with sub-directories ("DEBUG/CITY00.MSD"): directory records have type 0x80
 * and their sector points to another listing.
 */
export function readDrvPath(drvPath: string, path: string): Uint8Array {
  const buf = new Uint8Array(readFileSync(drvPath));
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const parts = path.toUpperCase().split('/');
  let base = 0;
  for (let i = 0; i < parts.length; i++) {
    const last = i === parts.length - 1;
    const [name, ext] = parts[i].split('.');
    let found = -1;
    for (let o = base; o + 32 <= buf.length && buf[o] !== 0; o += 32) {
      let n = '';
      for (let k = 0; k < 16 && buf[o + 16 + k]; k++) n += String.fromCharCode(buf[o + 16 + k]);
      const e = String.fromCharCode(buf[o + 1], buf[o + 2], buf[o + 3]);
      if (n.toUpperCase() !== name) continue;
      if (last && buf[o] === 0x01 && e === ext) {
        const at = dv.getUint32(o + 4, true) * SECTOR;
        return buf.slice(at, at + dv.getUint32(o + 8, true));
      }
      if (!last && buf[o] === 0x80) {
        found = dv.getUint32(o + 4, true) * SECTOR;
        break;
      }
    }
    if (found < 0) throw new Error(`${path} not found in ${drvPath}`);
    base = found;
  }
  throw new Error(`${path} not found in ${drvPath}`);
}
