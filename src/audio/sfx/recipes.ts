/**
 * One synthesis recipe per sound of the catalogue. Each draws into `out` starting at `t` and returns
 * its length in seconds. Card sounds mix a physical layer (paper, table: filtered noise, thumps) with a
 * digital one (blips, chimes), like console card games. All original, generated here.
 */
import type { SoundId } from '../catalog';
import { drive, echo, filter, fm, level, midi, noise, sweep, tone, type AC } from './dsp';

export type Recipe = (ac: AC, out: AudioNode, t: number, variant: string) => number;

/** Colour of a ✕ special effect, layered over the ✕ attack and the ability sound. */
function crossColour(ac: AC, out: AudioNode, t: number, v: string): number {
  switch (v) {
    case 'swift':
      noise(ac, out, t, { a: 0.005, d: 0.08, peak: 0.3, filter: 'highpass', f: 3000 });
      tone(ac, out, t, { type: 'triangle', f: midi(88), f2: midi(100), d: 0.09, peak: 0.08 });
      return 0.2;
    case 'null':
      tone(ac, filter(ac, out, 'lowpass', 3000), t + 0.05, { type: 'square', f: 1400, f2: 70, d: 0.32, peak: 0.08 });
      for (let i = 0; i < 5; i++) noise(ac, out, t + 0.08 + i * 0.045, { d: 0.012, peak: 0.16, filter: 'bandpass', f: 4000 - i * 500, q: 3 });
      return 0.45;
    case 'counter':
      tone(ac, filter(ac, out, 'lowpass', 5000), t, { type: 'sawtooth', f: 500, f2: 2600, glide: 0.12, d: 0.16, peak: 0.07 });
      fm(ac, out, t + 0.1, { f: midi(91), ratio: 2, index: 2, d: 0.35, peak: 0.08 });
      return 0.5;
    case 'crash': {
      const grit = drive(ac, level(ac, filter(ac, out, 'lowpass', 1600), 0.45), 6);
      tone(ac, grit, t, { type: 'sawtooth', f: 62, f2: 38, a: 0.02, d: 0.5, peak: 0.35 });
      noise(ac, out, t, { a: 0.01, d: 0.4, peak: 0.2, filter: 'lowpass', f: 1400, f2: 300 });
      return 0.6;
    }
    case 'drain':
      noise(ac, out, t, { a: 0.22, d: 0.12, peak: 0.25, filter: 'bandpass', f: 5200, f2: 300, q: 2 });
      tone(ac, out, t + 0.05, { f: 900, f2: 180, d: 0.38, peak: 0.08 });
      return 0.5;
    case 'jam':
      for (let i = 0; i < 10; i++) {
        noise(ac, out, t + i * 0.035 + ((i * 7) % 3) * 0.006, { d: 0.012, peak: 0.22, filter: 'bandpass', f: 1500 + ((i * 53) % 5) * 700, q: 1.5 });
        if (i % 3 === 0) tone(ac, out, t + i * 0.035, { type: 'square', f: 1900 + i * 40, d: 0.015, peak: 0.04 });
      }
      return 0.45;
    case 'fire':
      noise(ac, out, t, { a: 0.03, d: 0.45, peak: 0.28, filter: 'lowpass', f: 600, f2: 200 });
      for (let i = 0; i < 12; i++) noise(ac, out, t + 0.02 + i * 0.033 + ((i * 11) % 4) * 0.004, { d: 0.01, peak: 0.18, filter: 'bandpass', f: 2600 + ((i * 37) % 4) * 600, q: 2 });
      return 0.55;
    case 'ice':
      for (let i = 0; i < 3; i++) fm(ac, out, t + i * 0.05, { f: midi(96 + i * 3), ratio: 3.01, index: 1.2, d: 0.55, peak: 0.06 });
      noise(ac, out, t, { a: 0.02, d: 0.3, peak: 0.1, filter: 'highpass', f: 7000 });
      return 0.7;
    case 'nature':
      noise(ac, out, t, { a: 0.12, d: 0.4, peak: 0.2, filter: 'bandpass', f: 800, f2: 1600, q: 3 });
      tone(ac, out, t + 0.04, { type: 'triangle', f: midi(67), d: 0.16, peak: 0.12 });
      tone(ac, out, t + 0.12, { type: 'triangle', f: midi(74), d: 0.2, peak: 0.1 });
      return 0.6;
    case 'dark': {
      const lp = filter(ac, out, 'lowpass', 700);
      tone(ac, lp, t, { type: 'sawtooth', f: midi(38), a: 0.05, d: 0.6, peak: 0.12 });
      tone(ac, lp, t, { type: 'sawtooth', f: midi(39), a: 0.05, d: 0.6, peak: 0.12 });
      noise(ac, out, t, { a: 0.1, d: 0.5, peak: 0.15, filter: 'lowpass', f: 300 });
      return 0.7;
    }
    case 'rare':
      [88, 92, 95, 100].forEach((n, i) => fm(ac, out, t + i * 0.045, { f: midi(n), ratio: 3.5, index: 1.4, d: 0.7, peak: 0.055 }));
      return 0.9;
    default:
      return 0;
  }
}

function impact(ac: AC, out: AudioNode, t: number, v: string): number {
  switch (v) {
    case 'triangle': // sharp, snappy
      tone(ac, out, t, { f: 280, f2: 90, d: 0.14, peak: 0.55 });
      noise(ac, out, t, { d: 0.09, peak: 0.5, filter: 'bandpass', f: 3200, q: 0.9 });
      tone(ac, out, t, { type: 'square', f: 1900, d: 0.02, peak: 0.06 });
      return 0.2;
    case 'cross': // metallic
      tone(ac, out, t, { f: 190, f2: 60, d: 0.24, peak: 0.6 });
      fm(ac, out, t, { f: 420, ratio: 1.47, index: 5, d: 0.42, peak: 0.15 });
      noise(ac, out, t, { d: 0.12, peak: 0.35, filter: 'bandpass', f: 2400 });
      return 0.45;
    case 'lethal': {
      const tail = echo(ac, out, 0.16, 0.35, 0.35);
      impact(ac, tail, t, 'circle');
      tone(ac, out, t + 0.02, { f: 70, f2: 28, d: 0.95, peak: 0.35 });
      noise(ac, out, t + 0.04, { a: 0.05, d: 0.8, peak: 0.2, filter: 'lowpass', f: 700, f2: 150 });
      return 1.2;
    }
    case 'plain':
      tone(ac, out, t, { f: 160, f2: 55, d: 0.22, peak: 0.6 });
      noise(ac, out, t, { d: 0.14, peak: 0.4, filter: 'lowpass', f: 2000 });
      return 0.25;
    default: {
      // circle: heavy, big low end and crunch
      tone(ac, out, t, { f: 135, f2: 38, d: 0.42, peak: 0.6 });
      noise(ac, drive(ac, level(ac, out, 0.45), 4), t, { a: 0.002, d: 0.24, peak: 0.55, filter: 'lowpass', f: 1700, f2: 400 });
      noise(ac, out, t, { d: 0.025, peak: 0.22, filter: 'highpass', f: 3000 });
      return 0.45;
    }
  }
}

export const RECIPES: Record<SoundId, Recipe> = {
  // ── interface ──
  'ui.hover': (ac, out, t) => tone(ac, out, t, { f: 2100, f2: 2350, d: 0.035, peak: 0.12 }) + 0.01,
  'ui.nav': (ac, out, t) => {
    tone(ac, out, t, { type: 'triangle', f: 1250, f2: 1080, d: 0.06, peak: 0.26 });
    noise(ac, out, t, { d: 0.015, peak: 0.1, filter: 'highpass', f: 5000 });
    return 0.08;
  },
  'ui.confirm': (ac, out, t) => {
    const lp = filter(ac, out, 'lowpass', 4200);
    tone(ac, lp, t, { type: 'square', f: midi(81), d: 0.07, peak: 0.13 });
    tone(ac, lp, t + 0.065, { type: 'square', f: midi(88), d: 0.15, peak: 0.13 });
    tone(ac, out, t + 0.065, { f: midi(100), d: 0.12, peak: 0.05 });
    return 0.24;
  },
  'ui.cancel': (ac, out, t) => {
    const lp = filter(ac, out, 'lowpass', 2400);
    tone(ac, lp, t, { type: 'square', f: midi(76), d: 0.06, peak: 0.12 });
    tone(ac, lp, t + 0.06, { type: 'square', f: midi(69), d: 0.12, peak: 0.12 });
    return 0.2;
  },
  'ui.tab': (ac, out, t) => {
    noise(ac, out, t, { a: 0.01, d: 0.09, peak: 0.18, filter: 'bandpass', f: 1800, f2: 5200, q: 1.4 });
    tone(ac, out, t + 0.03, { type: 'triangle', f: midi(86), d: 0.07, peak: 0.15 });
    return 0.14;
  },
  'ui.open': (ac, out, t) => {
    noise(ac, out, t, { a: 0.05, d: 0.16, peak: 0.15, filter: 'bandpass', f: 600, f2: 4000, q: 1.2 });
    tone(ac, out, t + 0.06, { f: midi(84), d: 0.18, peak: 0.11 });
    tone(ac, out, t + 0.1, { f: midi(91), d: 0.22, peak: 0.07 });
    return 0.34;
  },
  'ui.close': (ac, out, t) => {
    noise(ac, out, t, { a: 0.01, d: 0.14, peak: 0.13, filter: 'bandpass', f: 3600, f2: 500, q: 1.2 });
    tone(ac, out, t + 0.02, { f: midi(86), f2: midi(79), d: 0.12, peak: 0.09 });
    return 0.2;
  },
  'ui.error': (ac, out, t) => {
    const lp = filter(ac, out, 'lowpass', 1400);
    tone(ac, lp, t, { type: 'square', f: 196, hold: 0.03, d: 0.09, peak: 0.2 });
    tone(ac, lp, t + 0.14, { type: 'square', f: 185, hold: 0.04, d: 0.16, peak: 0.2 });
    return 0.38;
  },
  'ui.denied': (ac, out, t) => {
    tone(ac, out, t, { f: 160, f2: 90, d: 0.1, peak: 0.35 });
    noise(ac, out, t, { d: 0.04, peak: 0.12, filter: 'lowpass', f: 900 });
    return 0.14;
  },
  'ui.phase': (ac, out, t) => {
    noise(ac, out, t, { a: 0.12, d: 0.3, peak: 0.2, filter: 'bandpass', f: 500, f2: 3000, q: 0.9 });
    fm(ac, out, t + 0.18, { f: midi(76), ratio: 3.5, index: 1.2, d: 0.6, peak: 0.08 });
    fm(ac, out, t + 0.24, { f: midi(83), ratio: 3.5, index: 1.2, d: 0.7, peak: 0.06 });
    return 0.95;
  },

  // ── cards ──
  'card.hover': (ac, out, t) => noise(ac, out, t, { a: 0.01, d: 0.05, peak: 0.08, filter: 'bandpass', f: 3000, f2: 4500, q: 1.2 }) + 0.01,
  'card.draw': (ac, out, t) => {
    noise(ac, out, t, { a: 0.03, d: 0.13, peak: 0.3, filter: 'bandpass', f: 1600, f2: 5200, q: 0.9 });
    tone(ac, out, t + 0.07, { f: midi(91), f2: midi(96), d: 0.06, peak: 0.06 });
    return 0.22;
  },
  'card.select': (ac, out, t) => {
    noise(ac, out, t, { d: 0.02, peak: 0.35, filter: 'highpass', f: 2500 });
    tone(ac, out, t + 0.005, { type: 'triangle', f: midi(88), d: 0.08, peak: 0.16 });
    return 0.12;
  },
  'card.move': (ac, out, t) => noise(ac, out, t, { a: 0.05, d: 0.2, peak: 0.26, filter: 'bandpass', f: 3200, f2: 700, q: 1.1 }) + 0.02,
  'card.place': (ac, out, t) => {
    tone(ac, out, t, { f: 170, f2: 55, d: 0.12, peak: 0.6 });
    noise(ac, out, t, { d: 0.05, peak: 0.35, filter: 'lowpass', f: 2200 });
    tone(ac, out, t + 0.04, { f: midi(88), d: 0.09, peak: 0.07 });
    tone(ac, out, t + 0.07, { f: midi(95), d: 0.12, peak: 0.05 });
    return 0.22;
  },
  'card.set': (ac, out, t) => {
    tone(ac, out, t, { f: 140, f2: 60, d: 0.1, peak: 0.35 });
    noise(ac, out, t, { d: 0.05, peak: 0.22, filter: 'lowpass', f: 1500 });
    fm(ac, out, t + 0.05, { f: midi(62), ratio: 1.5, index: 2, d: 0.35, peak: 0.06 });
    return 0.42;
  },
  'card.discard': (ac, out, t) => {
    noise(ac, out, t, { a: 0.02, d: 0.22, peak: 0.24, filter: 'bandpass', f: 2400, f2: 400 });
    tone(ac, out, t + 0.04, { type: 'triangle', f: midi(79), f2: midi(67), d: 0.18, peak: 0.06 });
    return 0.28;
  },
  'card.shuffle': (ac, out, t) => {
    for (let i = 0; i < 16; i++)
      noise(ac, out, t + i * 0.028 + ((i * 37) % 7) * 0.002, { d: 0.018, peak: 0.13 + 0.05 * ((i * 13) % 3), filter: 'bandpass', f: 2500 + ((i * 53) % 5) * 350, q: 1.6 });
    noise(ac, out, t + 0.5, { d: 0.05, peak: 0.3, filter: 'lowpass', f: 1800 });
    tone(ac, out, t + 0.5, { f: 150, f2: 70, d: 0.08, peak: 0.3 });
    return 0.6;
  },
  'card.flip': (ac, out, t) => {
    noise(ac, out, t, { a: 0.02, d: 0.1, peak: 0.25, filter: 'bandpass', f: 1200, f2: 4800 });
    fm(ac, out, t + 0.08, { f: midi(98), ratio: 2.01, index: 1.5, d: 0.4, peak: 0.07 });
    return 0.5;
  },
  'card.support': (ac, out, t, v) => {
    const notes = v === 'option' ? [74, 78, 81, 86] : [72, 76, 79, 84];
    const lp = filter(ac, out, 'lowpass', 5000);
    notes.forEach((n, i) => tone(ac, lp, t + i * 0.055, { type: 'triangle', f: midi(n), d: 0.2, peak: 0.11 }));
    noise(ac, out, t + 0.1, { a: 0.05, d: 0.3, peak: 0.06, filter: 'highpass', f: 6000 });
    tone(ac, out, t, { f: midi(notes[0] - 12), a: 0.08, d: 0.4, peak: 0.06 });
    return 0.6;
  },
  'card.dp': (ac, out, t, v) => {
    const base = v === 'high' ? 67 : v === 'mid' ? 64 : 60;
    tone(ac, filter(ac, out, 'lowpass', 2000), t, { type: 'square', f: midi(base), f2: midi(base + 12), glide: 0.25, a: 0.02, d: 0.26, peak: 0.07 });
    tone(ac, out, t, { f: midi(base), f2: midi(base + 12), glide: 0.25, a: 0.02, d: 0.28, peak: 0.12 });
    fm(ac, out, t + 0.24, { f: midi(base + 24), ratio: 3, index: 1, d: 0.3, peak: 0.09 });
    tone(ac, out, t + 0.27, { f: midi(base + 31), d: 0.35, peak: 0.06 });
    return 0.65;
  },
  'card.option': (ac, out, t) => {
    tone(ac, out, t, { f: 160, f2: 60, d: 0.1, peak: 0.45 });
    noise(ac, out, t, { d: 0.04, peak: 0.25, filter: 'lowpass', f: 2000 });
    [79, 83, 86].forEach((n, i) => fm(ac, out, t + 0.06 + i * 0.05, { f: midi(n), ratio: 3.5, index: 1, d: 0.4, peak: 0.06 }));
    return 0.55;
  },

  // ── combat ──
  'combat.select.circle': (ac, out, t) => {
    tone(ac, out, t, { f: 110, f2: 80, d: 0.18, peak: 0.5 });
    tone(ac, filter(ac, out, 'lowpass', 900), t, { type: 'square', f: midi(45), d: 0.2, peak: 0.12 });
    fm(ac, out, t + 0.02, { f: midi(69), ratio: 1, index: 0.6, d: 0.3, peak: 0.1 });
    return 0.35;
  },
  'combat.select.triangle': (ac, out, t) => {
    tone(ac, out, t, { type: 'triangle', f: midi(84), d: 0.05, peak: 0.18 });
    tone(ac, out, t + 0.06, { type: 'triangle', f: midi(91), d: 0.08, peak: 0.18 });
    noise(ac, out, t, { d: 0.03, peak: 0.1, filter: 'highpass', f: 4000 });
    return 0.18;
  },
  'combat.select.cross': (ac, out, t) => {
    fm(ac, out, t, { f: midi(79), ratio: 1.414, index: 3, d: 0.45, peak: 0.13 });
    tone(ac, out, t, { f: midi(91), d: 0.1, peak: 0.06 });
    return 0.5;
  },
  'combat.select': (ac, out, t) => {
    const lp = filter(ac, out, 'lowpass', 3000);
    tone(ac, lp, t, { type: 'square', f: midi(74), d: 0.07, peak: 0.12 });
    tone(ac, lp, t + 0.07, { type: 'square', f: midi(81), d: 0.14, peak: 0.12 });
    return 0.24;
  },
  'combat.locked': (ac, out, t) => {
    tone(ac, out, t, { f: 220, f2: 180, d: 0.08, peak: 0.25 });
    noise(ac, out, t, { d: 0.03, peak: 0.15, filter: 'lowpass', f: 1200 });
    tone(ac, out, t + 0.05, { f: midi(76), d: 0.12, peak: 0.05 });
    return 0.2;
  },
  'combat.reveal': (ac, out, t) => {
    noise(ac, out, t, { a: 0.35, d: 0.05, peak: 0.26, filter: 'bandpass', f: 800, f2: 5000 });
    fm(ac, out, t + 0.38, { f: midi(93), ratio: 2.76, index: 2, d: 0.6, peak: 0.11 });
    tone(ac, out, t + 0.38, { f: midi(81), d: 0.5, peak: 0.07 });
    return 1.0;
  },
  'combat.clash': (ac, out, t) => {
    tone(ac, out, t, { f: 90, f2: 38, d: 0.6, peak: 0.7 });
    noise(ac, out, t, { a: 0.005, d: 0.35, peak: 0.42, filter: 'lowpass', f: 900 });
    fm(ac, drive(ac, out, 2), t, { f: 340, ratio: 1.47, index: 4, d: 0.7, peak: 0.13 });
    return 0.9;
  },
  'combat.order': (ac, out, t) => {
    noise(ac, out, t, { a: 0.08, d: 0.18, peak: 0.24, filter: 'bandpass', f: 400, f2: 2600, q: 1.2 });
    tone(ac, out, t, { type: 'triangle', f: midi(72), f2: midi(84), glide: 0.15, d: 0.18, peak: 0.08 });
    return 0.35;
  },
  'combat.circle': (ac, out, t) => {
    // heavy wind-up: a low growl and a big, slow whoosh
    tone(ac, drive(ac, filter(ac, out, 'lowpass', 500), 3), t, { type: 'sawtooth', f: 72, f2: 52, a: 0.04, d: 0.32, peak: 0.22 });
    noise(ac, out, t, { a: 0.08, d: 0.25, peak: 0.5, filter: 'bandpass', f: 220, f2: 1100, q: 0.8 });
    return 0.4;
  },
  'combat.triangle': (ac, out, t) => {
    // quick and technical: three rising zips and a thin swish
    const lp = filter(ac, out, 'lowpass', 3500);
    for (let i = 0; i < 3; i++) tone(ac, lp, t + i * 0.05, { type: 'square', f: midi(76 + i * 5), f2: midi(88 + i * 5), glide: 0.045, d: 0.05, peak: 0.08 });
    noise(ac, out, t, { a: 0.01, d: 0.12, peak: 0.24, filter: 'bandpass', f: 3000, f2: 6000, q: 1.1 });
    return 0.25;
  },
  'combat.cross': (ac, out, t, v) => {
    // distinctive: a metallic ring over a reversed sweep, coloured by the special effect
    noise(ac, out, t, { a: 0.18, d: 0.04, peak: 0.2, filter: 'bandpass', f: 1000, f2: 6000 });
    fm(ac, out, t + 0.12, { f: midi(72), ratio: 1.414, index: 4, index2: 0.3, d: 0.5, peak: 0.12 });
    const extra = crossColour(ac, level(ac, out, 0.85), t + 0.12, v);
    return Math.max(0.75, 0.12 + extra);
  },
  'combat.impact': (ac, out, t, v) => impact(ac, out, t, v),
  'combat.block': (ac, out, t) => {
    fm(ac, out, t, { f: 1100, ratio: 2.7, index: 2, d: 0.35, peak: 0.12 });
    tone(ac, out, t, { f: 120, f2: 80, d: 0.08, peak: 0.3 });
    noise(ac, out, t, { d: 0.03, peak: 0.18, filter: 'highpass', f: 3500 });
    return 0.4;
  },
  'combat.counter': (ac, out, t) => {
    noise(ac, out, t, { a: 0.14, d: 0.03, peak: 0.3, filter: 'bandpass', f: 600, f2: 3500 });
    tone(ac, filter(ac, out, 'lowpass', 4000), t, { type: 'sawtooth', f: 500, f2: 2200, glide: 0.12, d: 0.16, peak: 0.08 });
    fm(ac, out, t + 0.14, { f: midi(91), ratio: 2, index: 2, d: 0.35, peak: 0.1 });
    return 0.5;
  },
  'combat.ability': (ac, out, t, v) => {
    tone(ac, sweep(ac, out, 'lowpass', 400, 4000, t, 0.3), t, { type: 'sawtooth', f: midi(60), f2: midi(72), a: 0.1, d: 0.3, peak: 0.08 });
    [0, 4, 7, 12].forEach((n, i) => tone(ac, out, t + 0.05 * i, { f: midi(72 + n), d: 0.2, peak: 0.07 }));
    const extra = crossColour(ac, level(ac, out, 0.7), t + 0.12, v);
    return Math.max(0.7, 0.12 + extra);
  },
  'combat.voided': (ac, out, t) => {
    tone(ac, filter(ac, out, 'lowpass', 2500), t, { type: 'square', f: 880, f2: 110, d: 0.3, peak: 0.1 });
    for (let i = 0; i < 6; i++) noise(ac, out, t + i * 0.04, { d: 0.01, peak: 0.15, filter: 'bandpass', f: 3000, q: 4 });
    tone(ac, filter(ac, out, 'lowpass', 800), t + 0.1, { type: 'sawtooth', f: 98, hold: 0.1, d: 0.25, peak: 0.08 });
    return 0.5;
  },
  'combat.fizzle': (ac, out, t) => {
    tone(ac, out, t, { f: midi(74), d: 0.15, peak: 0.08 });
    tone(ac, out, t + 0.12, { f: midi(70), d: 0.18, peak: 0.07 });
    noise(ac, out, t, { d: 0.15, peak: 0.1, filter: 'lowpass', f: 800 });
    return 0.4;
  },
  'combat.statUp': (ac, out, t) => {
    [79, 83, 86].forEach((n, i) => tone(ac, out, t + i * 0.05, { type: 'triangle', f: midi(n), d: 0.08, peak: 0.1 }));
    return 0.25;
  },
  'combat.statDown': (ac, out, t) => {
    [79, 75, 72].forEach((n, i) => tone(ac, out, t + i * 0.05, { type: 'triangle', f: midi(n), d: 0.08, peak: 0.1 }));
    return 0.25;
  },
  'combat.heal': (ac, out, t) => {
    [84, 88, 91, 96].forEach((n, i) => tone(ac, out, t + i * 0.06, { f: midi(n), d: 0.3, peak: 0.08 }));
    noise(ac, out, t, { a: 0.1, d: 0.4, peak: 0.05, filter: 'highpass', f: 7000 });
    tone(ac, out, t, { f: midi(72), a: 0.15, d: 0.4, peak: 0.06 });
    tone(ac, out, t, { f: midi(76), a: 0.15, d: 0.4, peak: 0.05 });
    return 0.75;
  },
  'combat.ko': (ac, out, t) => {
    tone(ac, filter(ac, out, 'lowpass', 1600), t, { type: 'sawtooth', f: 420, f2: 35, a: 0.01, d: 0.9, peak: 0.16 });
    tone(ac, out, t + 0.05, { f: 80, f2: 30, d: 0.8, peak: 0.6 });
    for (let i = 0; i < 14; i++) noise(ac, out, t + 0.2 + i * 0.05, { d: 0.015, peak: 0.14 * (1 - i / 14), filter: 'highpass', f: 4000 });
    return 1.2;
  },
  'combat.devolve': (ac, out, t) => {
    tone(ac, filter(ac, out, 'lowpass', 1800), t, { type: 'square', f: 660, f2: 165, glide: 0.4, d: 0.45, peak: 0.07 });
    noise(ac, out, t, { d: 0.4, peak: 0.15, filter: 'bandpass', f: 2000, f2: 300 });
    return 0.55;
  },

  // ── results ──
  'result.round': (ac, out, t, v) => {
    const lp = filter(ac, out, 'lowpass', 3500);
    if (v === 'lose') {
      [69, 65, 62].forEach((n, i) => tone(ac, lp, t + i * 0.12, { type: 'triangle', f: midi(n), d: 0.3, peak: 0.12 }));
      return 0.8;
    }
    [72, 76, 79].forEach((n, i) => tone(ac, lp, t + i * 0.09, { type: 'square', f: midi(n), d: 0.12, peak: 0.08 }));
    tone(ac, lp, t + 0.27, { type: 'square', f: midi(84), hold: 0.15, d: 0.4, peak: 0.08 });
    fm(ac, out, t + 0.27, { f: midi(96), ratio: 3.5, index: 1, d: 0.6, peak: 0.05 });
    return 0.9;
  },
  'result.victory': (ac, out, t) => {
    const lp = filter(ac, out, 'lowpass', 3000);
    [60, 64, 67, 72].forEach((n) => tone(ac, lp, t, { type: 'sawtooth', f: midi(n), hold: 0.1, d: 0.9, peak: 0.055 }));
    tone(ac, out, t, { f: 110, f2: 45, d: 0.4, peak: 0.5 });
    noise(ac, out, t + 0.05, { a: 0.05, d: 0.8, peak: 0.06, filter: 'highpass', f: 7000 });
    return 1.4;
  },
  'result.defeat': (ac, out, t) => {
    const lp = filter(ac, out, 'lowpass', 900);
    [45, 48, 52].forEach((n) => tone(ac, lp, t, { type: 'sawtooth', f: midi(n), a: 0.05, d: 1.4, peak: 0.07 }));
    tone(ac, out, t, { f: 220, f2: 110, d: 1.2, peak: 0.08 });
    return 1.6;
  },

  // ── evolution ──
  'evo.start': (ac, out, t) => {
    tone(ac, out, t, { f: 55, a: 0.5, hold: 0.2, d: 0.5, peak: 0.35 });
    noise(ac, out, t, { a: 0.5, d: 0.6, peak: 0.22, filter: 'lowpass', f: 220 });
    fm(ac, out, t + 0.1, { f: midi(79), ratio: 1.5, index: 1, a: 0.4, d: 0.6, peak: 0.04 });
    return 1.3;
  },
  'evo.charge': (ac, out, t) => {
    // energy building up: a rising, opening saw, a rising hiss and ticks that speed up
    tone(ac, sweep(ac, out, 'lowpass', 300, 6000, t, 1.45), t, { type: 'sawtooth', f: 110, f2: 880, glide: 1.45, a: 1.4, d: 0.08, peak: 0.12 });
    noise(ac, sweep(ac, out, 'highpass', 800, 8000, t, 1.45), t, { a: 1.4, d: 0.06, peak: 0.2 });
    let at = 0;
    for (let k = 0; k < 16; k++) {
      tone(ac, out, t + at, { f: midi(84 + k), d: 0.03, peak: 0.035 + k * 0.004 });
      at += 0.16 * (1 - k / 18);
    }
    return 1.6;
  },
  'evo.burst': (ac, out, t) => {
    noise(ac, out, t, { a: 0.003, d: 0.9, peak: 0.38, filter: 'lowpass', f: 6000, f2: 800 });
    tone(ac, out, t, { f: 120, f2: 30, d: 1.0, peak: 0.55 });
    [84, 88, 91].forEach((n) => fm(ac, out, t + 0.02, { f: midi(n), ratio: 2, index: 2, d: 1.2, peak: 0.07 }));
    noise(ac, out, t, { d: 0.6, peak: 0.3, filter: 'bandpass', f: 300, f2: 100 });
    return 1.4;
  },
  'evo.complete': (ac, out, t) => {
    [72, 76, 79, 84, 88].forEach((n, i) => fm(ac, out, t + i * 0.07, { f: midi(n), ratio: 3.5, index: 1.2, d: 0.9, peak: 0.08 }));
    const lp = filter(ac, out, 'lowpass', 2500);
    [60, 64, 67].forEach((n) => tone(ac, lp, t, { type: 'sawtooth', f: midi(n), a: 0.2, d: 1.2, peak: 0.045 }));
    noise(ac, out, t, { a: 0.2, d: 0.8, peak: 0.05, filter: 'highpass', f: 7000 });
    return 1.6;
  },
  'evo.stat': (ac, out, t, v) => {
    const n = [79, 83, 86, 91][Number(v) || 0];
    tone(ac, out, t, { type: 'triangle', f: midi(n), d: 0.08, peak: 0.12 });
    tone(ac, out, t, { f: midi(n + 12), d: 0.12, peak: 0.05 });
    return 0.16;
  },
};
