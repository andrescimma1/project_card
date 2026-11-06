/**
 * One synthesis recipe per sound of the catalogue. Each draws into `out` starting at `t` and returns its
 * length in seconds. The palette is physical and old-world: paper and card stock, a wooden table,
 * leather, bronze and iron; magic is harp, bells and shimmer; big moments are drums, gongs and horns.
 * All original, generated here (no recorded or extracted audio).
 */
import type { SoundId } from '../catalog';
import { drive, echo, filter, fm, level, midi, noise, sweep, tone, type AC } from './dsp';

export type Recipe = (ac: AC, out: AudioNode, t: number, variant: string) => number;

// ── materials ──

/** A knock on wood: a short resonant body and a dry click. */
function wood(ac: AC, out: AudioNode, t: number, f = 520, peak = 0.5) {
  noise(ac, out, t, { d: 0.05, peak, filter: 'bandpass', f, q: 7 });
  tone(ac, out, t, { type: 'triangle', f: f * 0.5, f2: f * 0.42, d: 0.07, peak: peak * 0.5 });
  noise(ac, out, t, { d: 0.012, peak: peak * 0.35, filter: 'highpass', f: 3500 });
}

/** Struck metal: inharmonic partials with a long ring. */
function metal(ac: AC, out: AudioNode, t: number, f = 640, d = 0.7, peak = 0.12) {
  fm(ac, out, t, { f, ratio: 2.76, index: 2.6, index2: 0.2, d, peak });
  fm(ac, out, t, { f: f * 1.51, ratio: 1.41, index: 1.4, d: d * 0.7, peak: peak * 0.55 });
}

/** Paper or card stock sliding: a band of noise that moves. */
function paper(ac: AC, out: AudioNode, t: number, f: number, f2: number, d: number, peak = 0.28) {
  noise(ac, out, t, { a: Math.min(0.03, d / 3), d, peak, filter: 'bandpass', f, f2, q: 1.1 });
}

/** A soft heavy thud (leather, a card on the table, a body). */
function thud(ac: AC, out: AudioNode, t: number, f = 150, d = 0.12, peak = 0.5) {
  tone(ac, out, t, { f, f2: f * 0.4, d, peak });
  noise(ac, out, t, { d: d * 0.5, peak: peak * 0.5, filter: 'lowpass', f: 900 });
}

/** A plucked harp string. */
function harp(ac: AC, out: AudioNode, t: number, n: number, peak = 0.1, d = 0.7) {
  tone(ac, filter(ac, out, 'lowpass', 3600), t, { type: 'triangle', f: midi(n), a: 0.003, d, peak });
  tone(ac, out, t, { f: midi(n + 12), a: 0.003, d: d * 0.5, peak: peak * 0.3 });
}

/** A small bell. */
function bell(ac: AC, out: AudioNode, t: number, n: number, peak = 0.07, d = 0.9) {
  fm(ac, out, t, { f: midi(n), ratio: 3.5, index: 1.2, d, peak });
}

/** A brass horn note: saw through a soft filter, slow attack, a little vibrato. */
function horn(ac: AC, out: AudioNode, t: number, n: number, d: number, peak = 0.07) {
  const lp = sweep(ac, out, 'lowpass', 500, 1900, t, Math.min(0.25, d));
  tone(ac, lp, t, { type: 'sawtooth', f: midi(n), a: 0.06, hold: Math.max(0, d - 0.2), d: 0.2, peak });
  tone(ac, lp, t, { type: 'sawtooth', f: midi(n), detune: 8, a: 0.08, hold: Math.max(0, d - 0.2), d: 0.2, peak: peak * 0.6 });
}

/** A big drum (taiko-like): a falling body and a skin of noise. */
function drum(ac: AC, out: AudioNode, t: number, f = 95, d = 0.6, peak = 0.75) {
  tone(ac, out, t, { f, f2: f * 0.45, d, peak });
  noise(ac, out, t, { d: d * 0.35, peak: peak * 0.4, filter: 'lowpass', f: 700, f2: 200 });
}

/** Air moving: a swing, a whoosh. */
function whoosh(ac: AC, out: AudioNode, t: number, f: number, f2: number, d: number, peak = 0.35) {
  noise(ac, out, t, { a: d * 0.45, d: d * 0.55, peak, filter: 'bandpass', f, f2, q: 0.9 });
}

/** Colour of an Instinto special effect, layered over the Instinto attack and the ability sound. */
function instinctColour(ac: AC, out: AudioNode, t: number, v: string): number {
  switch (v) {
    case 'swift':
      whoosh(ac, out, t, 1800, 5200, 0.12, 0.3);
      harp(ac, out, t + 0.04, 91, 0.06, 0.25);
      return 0.3;
    case 'null':
      [86, 82, 77, 72].forEach((n, i) => harp(ac, out, t + i * 0.06, n, 0.06, 0.3));
      noise(ac, out, t + 0.1, { d: 0.3, peak: 0.12, filter: 'bandpass', f: 2600, f2: 600, q: 2 });
      return 0.5;
    case 'counter':
      metal(ac, out, t, 980, 0.5, 0.09);
      whoosh(ac, out, t + 0.05, 600, 3000, 0.14, 0.25);
      return 0.55;
    case 'crash': {
      const grit = drive(ac, level(ac, filter(ac, out, 'lowpass', 1400), 0.45), 5);
      tone(ac, grit, t, { type: 'sawtooth', f: 60, f2: 38, a: 0.02, d: 0.5, peak: 0.35 });
      drum(ac, out, t, 80, 0.5, 0.35);
      return 0.6;
    }
    case 'drain':
      noise(ac, out, t, { a: 0.22, d: 0.12, peak: 0.22, filter: 'bandpass', f: 4800, f2: 300, q: 2 });
      tone(ac, out, t + 0.05, { f: 880, f2: 180, d: 0.38, peak: 0.07 });
      return 0.5;
    case 'jam':
      for (let i = 0; i < 9; i++) wood(ac, out, t + i * 0.038 + ((i * 7) % 3) * 0.006, 700 + ((i * 53) % 5) * 160, 0.18);
      return 0.45;
    case 'fire':
      noise(ac, out, t, { a: 0.04, d: 0.45, peak: 0.26, filter: 'lowpass', f: 700, f2: 220 });
      for (let i = 0; i < 12; i++) noise(ac, out, t + 0.02 + i * 0.033 + ((i * 11) % 4) * 0.004, { d: 0.01, peak: 0.16, filter: 'bandpass', f: 2400 + ((i * 37) % 4) * 600, q: 2 });
      return 0.55;
    case 'ice':
      [96, 99, 103].forEach((n, i) => bell(ac, out, t + i * 0.05, n, 0.05, 0.6));
      noise(ac, out, t, { a: 0.02, d: 0.3, peak: 0.08, filter: 'highpass', f: 7000 });
      return 0.7;
    case 'nature':
      noise(ac, out, t, { a: 0.12, d: 0.4, peak: 0.18, filter: 'bandpass', f: 800, f2: 1500, q: 3 });
      wood(ac, out, t + 0.05, 420, 0.22);
      wood(ac, out, t + 0.14, 560, 0.18);
      return 0.6;
    case 'dark': {
      const lp = filter(ac, out, 'lowpass', 700);
      tone(ac, lp, t, { type: 'sawtooth', f: midi(38), a: 0.05, d: 0.6, peak: 0.11 });
      tone(ac, lp, t, { type: 'sawtooth', f: midi(39), a: 0.05, d: 0.6, peak: 0.11 });
      noise(ac, out, t, { a: 0.1, d: 0.5, peak: 0.13, filter: 'lowpass', f: 300 });
      return 0.7;
    }
    case 'rare':
      [88, 92, 95, 100].forEach((n, i) => bell(ac, out, t + i * 0.045, n, 0.05, 0.7));
      return 0.9;
    default:
      return 0;
  }
}

function impact(ac: AC, out: AudioNode, t: number, v: string): number {
  switch (v) {
    case 'technique': // sharp and dry: a whip or an arrow hitting home
      noise(ac, out, t, { d: 0.06, peak: 0.5, filter: 'bandpass', f: 2600, q: 1.4 });
      thud(ac, out, t, 260, 0.1, 0.45);
      wood(ac, out, t, 900, 0.25);
      return 0.2;
    case 'instinct': // a shield or armour taking the blow
      thud(ac, out, t, 170, 0.2, 0.55);
      metal(ac, out, t, 430, 0.55, 0.12);
      return 0.6;
    case 'lethal': {
      const tail = echo(ac, out, 0.17, 0.33, 0.33);
      impact(ac, tail, t, 'fury');
      drum(ac, out, t + 0.02, 62, 1, 0.45);
      return 1.2;
    }
    case 'plain':
      thud(ac, out, t, 160, 0.22, 0.6);
      return 0.25;
    default: {
      // fury: heavy, a deep body blow with crunch
      tone(ac, out, t, { f: 130, f2: 38, d: 0.42, peak: 0.6 });
      noise(ac, drive(ac, level(ac, out, 0.45), 4), t, { a: 0.002, d: 0.24, peak: 0.55, filter: 'lowpass', f: 1500, f2: 350 });
      wood(ac, out, t, 380, 0.3);
      return 0.45;
    }
  }
}

export const RECIPES: Record<SoundId, Recipe> = {
  // ── interface ──
  'ui.hover': (ac, out, t) => {
    paper(ac, out, t, 3200, 4600, 0.035, 0.07);
    return 0.05;
  },
  'ui.nav': (ac, out, t) => {
    wood(ac, out, t, 760, 0.3);
    return 0.09;
  },
  'ui.confirm': (ac, out, t) => {
    wood(ac, out, t, 620, 0.42);
    metal(ac, out, t + 0.03, 1320, 0.35, 0.05);
    return 0.4;
  },
  'ui.cancel': (ac, out, t) => {
    thud(ac, out, t, 190, 0.1, 0.35);
    paper(ac, out, t, 2400, 900, 0.1, 0.12);
    return 0.16;
  },
  'ui.tab': (ac, out, t) => {
    paper(ac, out, t, 1400, 4200, 0.12, 0.2);
    wood(ac, out, t + 0.08, 880, 0.15);
    return 0.2;
  },
  'ui.open': (ac, out, t) => {
    paper(ac, out, t, 500, 3200, 0.22, 0.2);
    thud(ac, out, t + 0.2, 230, 0.06, 0.2);
    return 0.32;
  },
  'ui.close': (ac, out, t) => {
    paper(ac, out, t, 3000, 600, 0.16, 0.18);
    thud(ac, out, t + 0.14, 200, 0.06, 0.22);
    return 0.24;
  },
  'ui.error': (ac, out, t) => {
    metal(ac, filter(ac, out, 'lowpass', 1200), t, 196, 0.25, 0.16);
    metal(ac, filter(ac, out, 'lowpass', 1200), t + 0.16, 185, 0.3, 0.16);
    return 0.5;
  },
  'ui.denied': (ac, out, t) => {
    wood(ac, filter(ac, out, 'lowpass', 900), t, 300, 0.45);
    return 0.12;
  },
  'ui.phase': (ac, out, t) => {
    whoosh(ac, out, t, 400, 2200, 0.3, 0.18);
    metal(ac, out, t + 0.2, midi(64), 1.2, 0.08);
    bell(ac, out, t + 0.26, 83, 0.04, 0.8);
    return 1.4;
  },

  // ── cards ──
  'card.hover': (ac, out, t) => {
    paper(ac, out, t, 2800, 4200, 0.05, 0.08);
    return 0.07;
  },
  'card.draw': (ac, out, t) => {
    paper(ac, out, t, 1500, 4800, 0.13, 0.3);
    noise(ac, out, t + 0.12, { d: 0.02, peak: 0.12, filter: 'highpass', f: 3000 });
    return 0.18;
  },
  'card.select': (ac, out, t) => {
    noise(ac, out, t, { d: 0.018, peak: 0.35, filter: 'highpass', f: 2600 });
    paper(ac, out, t + 0.01, 2400, 3600, 0.05, 0.14);
    return 0.09;
  },
  'card.move': (ac, out, t) => {
    paper(ac, out, t, 3000, 700, 0.2, 0.26);
    return 0.22;
  },
  'card.place': (ac, out, t) => {
    // card stock slapping on a wooden table
    thud(ac, out, t, 170, 0.1, 0.55);
    noise(ac, out, t, { d: 0.04, peak: 0.35, filter: 'bandpass', f: 1900, q: 0.8 });
    wood(ac, out, t + 0.005, 470, 0.22);
    return 0.16;
  },
  'card.set': (ac, out, t) => {
    thud(ac, out, t, 140, 0.1, 0.35);
    wood(ac, out, t, 360, 0.18);
    harp(ac, out, t + 0.06, 62, 0.05, 0.45);
    return 0.5;
  },
  'card.discard': (ac, out, t) => {
    paper(ac, out, t, 2200, 380, 0.22, 0.24);
    thud(ac, out, t + 0.18, 210, 0.06, 0.18);
    return 0.28;
  },
  'card.shuffle': (ac, out, t) => {
    for (let i = 0; i < 16; i++)
      noise(ac, out, t + i * 0.028 + ((i * 37) % 7) * 0.002, { d: 0.018, peak: 0.13 + 0.05 * ((i * 13) % 3), filter: 'bandpass', f: 2400 + ((i * 53) % 5) * 330, q: 1.6 });
    thud(ac, out, t + 0.5, 160, 0.08, 0.35);
    wood(ac, out, t + 0.5, 420, 0.2);
    return 0.6;
  },
  'card.flip': (ac, out, t) => {
    paper(ac, out, t, 1100, 4600, 0.1, 0.26);
    noise(ac, out, t + 0.1, { d: 0.025, peak: 0.2, filter: 'highpass', f: 2200 });
    return 0.16;
  },
  'card.support': (ac, out, t, v) => {
    // a spell: a harp run and a ring of bells
    const notes = v === 'option' ? [74, 78, 81, 86] : [72, 76, 79, 84];
    notes.forEach((n, i) => harp(ac, out, t + i * 0.055, n, 0.09, 0.6));
    bell(ac, out, t + 0.22, notes[3] + 12, 0.045, 0.9);
    noise(ac, out, t + 0.1, { a: 0.08, d: 0.35, peak: 0.05, filter: 'highpass', f: 6500 });
    return 0.95;
  },
  'card.dp': (ac, out, t, v) => {
    // amber coins dropping into a bronze bowl, brighter with more PE
    const base = v === 'high' ? 79 : v === 'mid' ? 76 : 72;
    metal(ac, out, t, midi(base), 0.45, 0.07);
    metal(ac, out, t + 0.07, midi(base + 7), 0.5, 0.06);
    thud(ac, out, t, 220, 0.05, 0.2);
    return 0.6;
  },
  'card.option': (ac, out, t) => {
    thud(ac, out, t, 160, 0.1, 0.45);
    [79, 83, 86].forEach((n, i) => bell(ac, out, t + 0.06 + i * 0.05, n, 0.05, 0.6));
    return 0.75;
  },

  // ── combat ──
  'combat.select.fury': (ac, out, t) => {
    // steel drawn from a scabbard
    noise(ac, out, t, { a: 0.02, d: 0.22, peak: 0.18, filter: 'bandpass', f: 3200, f2: 6400, q: 3 });
    metal(ac, out, t + 0.16, 880, 0.5, 0.07);
    return 0.65;
  },
  'combat.select.technique': (ac, out, t) => {
    // a bowstring pulled tight and a click
    tone(ac, filter(ac, out, 'lowpass', 1800), t, { type: 'sawtooth', f: 140, f2: 210, glide: 0.18, a: 0.02, d: 0.18, peak: 0.08 });
    wood(ac, out, t + 0.17, 1100, 0.25);
    return 0.25;
  },
  'combat.select.instinct': (ac, out, t) => {
    // a shield raised: leather and a dull bronze knock
    thud(ac, out, t, 150, 0.14, 0.45);
    metal(ac, filter(ac, out, 'lowpass', 2400), t + 0.01, 340, 0.4, 0.08);
    return 0.45;
  },
  'combat.select': (ac, out, t) => {
    wood(ac, out, t, 560, 0.35);
    wood(ac, out, t + 0.08, 700, 0.3);
    return 0.16;
  },
  'combat.locked': (ac, out, t) => {
    wood(ac, out, t, 420, 0.3);
    thud(ac, out, t, 200, 0.06, 0.2);
    return 0.12;
  },
  'combat.reveal': (ac, out, t) => {
    // a short drum roll and a struck cymbal-like metal
    for (let i = 0; i < 8; i++) drum(ac, out, t + i * 0.045, 150 + i * 4, 0.08, 0.12 + i * 0.02);
    metal(ac, out, t + 0.38, 520, 0.9, 0.08);
    noise(ac, out, t + 0.38, { d: 0.5, peak: 0.08, filter: 'highpass', f: 5000 });
    return 1.3;
  },
  'combat.clash': (ac, out, t) => {
    drum(ac, out, t, 85, 0.7, 0.75);
    metal(ac, drive(ac, out, 2), t, 340, 0.7, 0.11);
    return 0.9;
  },
  'combat.order': (ac, out, t) => {
    whoosh(ac, out, t, 400, 2400, 0.28, 0.24);
    harp(ac, out, t + 0.12, 79, 0.05, 0.3);
    return 0.42;
  },
  'combat.fury': (ac, out, t) => {
    // a heavy weapon swung: a low growl and a broad, slow whoosh
    tone(ac, drive(ac, filter(ac, out, 'lowpass', 480), 3), t, { type: 'sawtooth', f: 72, f2: 52, a: 0.04, d: 0.32, peak: 0.2 });
    whoosh(ac, out, t, 200, 1000, 0.32, 0.5);
    return 0.4;
  },
  'combat.technique': (ac, out, t) => {
    // quick and precise: a thin whistle, like an arrow or a fast blade
    noise(ac, out, t, { a: 0.01, d: 0.14, peak: 0.75, filter: 'bandpass', f: 2500, f2: 6200, q: 4 });
    whoosh(ac, out, t, 1200, 3600, 0.12, 0.3);
    tone(ac, out, t, { f: 1700, f2: 2600, d: 0.12, peak: 0.1 });
    return 0.2;
  },
  'combat.instinct': (ac, out, t, v) => {
    // distinctive: a resonant charge in the creature's own way, coloured by its special effect
    whoosh(ac, out, t, 900, 4800, 0.2, 0.18);
    metal(ac, out, t + 0.12, midi(72), 0.5, 0.08);
    harp(ac, out, t + 0.12, 79, 0.05, 0.4);
    const extra = instinctColour(ac, level(ac, out, 0.85), t + 0.12, v);
    return Math.max(0.75, 0.12 + extra);
  },
  'combat.impact': (ac, out, t, v) => impact(ac, out, t, v),
  'combat.block': (ac, out, t) => {
    metal(ac, out, t, 1050, 0.45, 0.1);
    thud(ac, out, t, 130, 0.08, 0.3);
    return 0.5;
  },
  'combat.counter': (ac, out, t) => {
    metal(ac, out, t, 1240, 0.35, 0.09);
    whoosh(ac, out, t + 0.06, 700, 3600, 0.16, 0.3);
    return 0.42;
  },
  'combat.ability': (ac, out, t, v) => {
    // magic gathering: a harp glissando under a soft swell
    [72, 76, 79, 84, 88].forEach((n, i) => harp(ac, out, t + i * 0.035, n, 0.06, 0.5));
    noise(ac, sweep(ac, out, 'bandpass', 600, 4000, t, 0.3), t, { a: 0.18, d: 0.15, peak: 0.12 });
    const extra = instinctColour(ac, level(ac, out, 0.7), t + 0.15, v);
    return Math.max(0.75, 0.15 + extra);
  },
  'combat.voided': (ac, out, t) => {
    [84, 80, 75, 70].forEach((n, i) => harp(ac, out, t + i * 0.05, n, 0.06, 0.25));
    noise(ac, out, t + 0.05, { d: 0.3, peak: 0.14, filter: 'bandpass', f: 2200, f2: 300, q: 1.6 });
    return 0.45;
  },
  'combat.fizzle': (ac, out, t) => {
    harp(ac, out, t, 74, 0.06, 0.25);
    harp(ac, out, t + 0.12, 70, 0.05, 0.3);
    noise(ac, out, t, { d: 0.15, peak: 0.08, filter: 'lowpass', f: 800 });
    return 0.45;
  },
  'combat.statUp': (ac, out, t) => {
    [79, 83, 86].forEach((n, i) => harp(ac, out, t + i * 0.05, n, 0.08, 0.3));
    return 0.4;
  },
  'combat.statDown': (ac, out, t) => {
    [79, 75, 72].forEach((n, i) => harp(ac, out, t + i * 0.05, n, 0.08, 0.3));
    return 0.4;
  },
  'combat.heal': (ac, out, t) => {
    [84, 88, 91, 96].forEach((n, i) => bell(ac, out, t + i * 0.06, n, 0.05, 0.6));
    tone(ac, out, t, { f: midi(72), a: 0.15, d: 0.45, peak: 0.05 });
    tone(ac, out, t, { f: midi(76), a: 0.15, d: 0.45, peak: 0.04 });
    return 0.8;
  },
  'combat.ko': (ac, out, t) => {
    drum(ac, out, t + 0.02, 70, 0.9, 0.6);
    tone(ac, filter(ac, out, 'lowpass', 1200), t, { type: 'sawtooth', f: 300, f2: 40, a: 0.01, d: 0.8, peak: 0.1 });
    for (let i = 0; i < 10; i++) noise(ac, out, t + 0.25 + i * 0.06, { d: 0.02, peak: 0.1 * (1 - i / 10), filter: 'bandpass', f: 1600, q: 1.2 });
    return 1.2;
  },
  'combat.devolve': (ac, out, t) => {
    [81, 76, 72, 69].forEach((n, i) => harp(ac, out, t + i * 0.07, n, 0.06, 0.35));
    noise(ac, out, t, { d: 0.4, peak: 0.12, filter: 'bandpass', f: 1800, f2: 300 });
    return 0.65;
  },

  // ── results ──
  'result.round': (ac, out, t, v) => {
    if (v === 'lose') {
      horn(ac, out, t, 57, 0.35, 0.1);
      horn(ac, out, t + 0.3, 53, 0.6, 0.1);
      return 1.0;
    }
    horn(ac, out, t, 60, 0.18, 0.06);
    horn(ac, out, t + 0.16, 64, 0.18, 0.06);
    horn(ac, out, t + 0.32, 67, 0.55, 0.07);
    bell(ac, out, t + 0.32, 91, 0.04, 0.8);
    return 1.1;
  },
  'result.victory': (ac, out, t) => {
    [60, 64, 67].forEach((n) => horn(ac, out, t, n, 0.9, 0.05));
    horn(ac, out, t, 72, 0.9, 0.04);
    drum(ac, out, t, 90, 0.5, 0.5);
    return 1.4;
  },
  'result.defeat': (ac, out, t) => {
    horn(ac, out, t, 45, 1.2, 0.07);
    horn(ac, out, t + 0.05, 48, 1.15, 0.05);
    drum(ac, out, t, 60, 0.9, 0.35);
    return 1.6;
  },

  // ── evolution ──
  'evo.start': (ac, out, t) => {
    // distant drums and a low hum
    tone(ac, out, t, { f: 55, a: 0.5, hold: 0.2, d: 0.5, peak: 0.3 });
    drum(ac, out, t, 70, 0.6, 0.3);
    drum(ac, out, t + 0.45, 72, 0.6, 0.25);
    return 1.3;
  },
  'evo.charge': (ac, out, t) => {
    // magic building up: an opening swell, a rising hiss and harp notes that speed up
    tone(ac, sweep(ac, out, 'lowpass', 300, 4000, t, 1.45), t, { type: 'sawtooth', f: 110, f2: 440, glide: 1.45, a: 1.4, d: 0.08, peak: 0.08 });
    noise(ac, sweep(ac, out, 'bandpass', 600, 6000, t, 1.45), t, { a: 1.4, d: 0.06, peak: 0.16 });
    let at = 0;
    for (let k = 0; k < 16; k++) {
      harp(ac, out, t + at, 72 + ((k * 5) % 24), 0.03 + k * 0.003, 0.3);
      at += 0.16 * (1 - k / 18);
    }
    return 1.6;
  },
  'evo.burst': (ac, out, t) => {
    // a great gong
    metal(ac, out, t, 110, 2.2, 0.16);
    drum(ac, out, t, 60, 1, 0.5);
    noise(ac, out, t, { a: 0.003, d: 0.8, peak: 0.25, filter: 'lowpass', f: 5000, f2: 600 });
    return 2.2;
  },
  'evo.complete': (ac, out, t) => {
    [72, 76, 79, 84, 88].forEach((n, i) => bell(ac, out, t + i * 0.07, n, 0.06, 1));
    [60, 64, 67].forEach((n) => horn(ac, out, t, n, 1, 0.035));
    return 1.6;
  },
  'evo.stat': (ac, out, t, v) => {
    const n = [79, 83, 86, 91][Number(v) || 0];
    harp(ac, out, t, n, 0.1, 0.3);
    return 0.32;
  },
};
