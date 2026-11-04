/**
 * PlayStation TIM image decoder (4/8/16 bpp). Colour 0x0000 is transparent (PSX convention).
 *   header: u32 0x10, u32 flags (bits 0-2 mode: 0 4bpp, 1 8bpp, 2 16bpp; bit 3 has CLUT)
 *   [CLUT block: u32 len, u16 x, u16 y, u16 w, u16 h, w*h × u16 BGR555]
 *   pixel block: u32 len, u16 x, u16 y, u16 w (in 16-bit units), u16 h, data
 */
export interface Rgba {
  width: number;
  height: number;
  rgba: Uint8Array;
}

function bgr555(c: number, out: Uint8Array, o: number) {
  if (c === 0) {
    out.set([0, 0, 0, 0], o);
    return;
  }
  out[o] = ((c & 31) * 255) / 31;
  out[o + 1] = (((c >> 5) & 31) * 255) / 31;
  out[o + 2] = (((c >> 10) & 31) * 255) / 31;
  out[o + 3] = 255;
}

export function decodeTim(b: Uint8Array): Rgba {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  if (dv.getUint32(0, true) !== 0x10) throw new Error('Not a TIM image');
  const flags = dv.getUint32(4, true);
  const mode = flags & 7;
  let o = 8;
  let clut: number[] = [];
  if (flags & 8) {
    const len = dv.getUint32(o, true);
    const w = dv.getUint16(o + 8, true);
    clut = Array.from({ length: w }, (_, i) => dv.getUint16(o + 12 + i * 2, true)); // first palette
    o += len;
  }
  const wUnits = dv.getUint16(o + 8, true);
  const height = dv.getUint16(o + 10, true);
  const px = o + 12;
  const width = mode === 0 ? wUnits * 4 : mode === 1 ? wUnits * 2 : wUnits;
  const rgba = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let c: number;
      if (mode === 0) {
        const byte = b[px + y * wUnits * 2 + (x >> 1)];
        c = clut[x & 1 ? byte >> 4 : byte & 15];
      } else if (mode === 1) c = clut[b[px + y * wUnits * 2 + x]];
      else c = dv.getUint16(px + (y * wUnits + x) * 2, true);
      bgr555(c ?? 0, rgba, (y * width + x) * 4);
    }
  }
  return { width, height, rgba };
}
