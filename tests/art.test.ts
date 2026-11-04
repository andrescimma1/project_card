/**
 * PS1 TIM decoding + PNG encoding used to extract the original card art (B.DRV LC000..LC300).
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { encodePng } from '../tools/extract/png';
import { decodeTim } from '../tools/extract/tim';
import { listDrv } from '../tools/extract/drv';
import { readFileSync } from 'node:fs';

/** 8bpp TIM, 2x1 pixels, CLUT of 2 colours: red (0x001F) and transparent black (0x0000). */
function tinyTim(): Uint8Array {
  const b: number[] = [];
  const u32 = (v: number) => b.push(v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255);
  const u16 = (v: number) => b.push(v & 255, (v >> 8) & 255);
  u32(0x10);
  u32(0x09); // 8bpp + CLUT
  u32(12 + 4); // clut block
  u16(0); u16(0); u16(2); u16(1);
  u16(0x001f); u16(0x0000);
  u32(12 + 2); // pixel block
  u16(0); u16(0); u16(1); u16(1); // width in 16-bit units = 1 -> 2 pixels at 8bpp
  b.push(0, 1);
  return Uint8Array.from(b);
}

describe('TIM decoder', () => {
  it('decodes an 8bpp TIM with its CLUT (colour 0x0000 is transparent)', () => {
    const img = decodeTim(tinyTim());
    expect(img.width).toBe(2);
    expect(img.height).toBe(1);
    expect(Array.from(img.rgba)).toEqual([255, 0, 0, 255, 0, 0, 0, 0]);
  });
});

describe('PNG encoder', () => {
  it('writes a valid signature, IHDR size and the raw scanlines', () => {
    const png = encodePng(2, 1, Uint8Array.from([255, 0, 0, 255, 0, 0, 0, 0]));
    expect(Array.from(png.slice(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    const dv = new DataView(png.buffer);
    expect(dv.getUint32(16)).toBe(2);
    expect(dv.getUint32(20)).toBe(1);
    const idatLen = dv.getUint32(33);
    const raw = inflateSync(png.slice(41, 41 + idatLen));
    expect(Array.from(raw)).toEqual([0, 255, 0, 0, 255, 0, 0, 0, 0]);
  });
});

const disc = process.env.DCB_DISC;
describe.skipIf(!disc || !existsSync(join(disc ?? '', 'B.DRV')))('card art on the disc', () => {
  it('has 301 card images LC000..LC300 of 64x64', () => {
    const drv = new Uint8Array(readFileSync(join(disc!, 'B.DRV')));
    const art = listDrv(drv).filter((e) => /^LC\d{3}$/.test(e.name));
    expect(art).toHaveLength(301);
    const img = decodeTim(drv.slice(art[2].offset, art[2].offset + art[2].size));
    expect([img.width, img.height]).toEqual([64, 64]);
  });
});
