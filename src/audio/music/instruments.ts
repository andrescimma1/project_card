/**
 * The music's instruments, all synthesised but acoustic in spirit, to match the illustrated
 * old-world look: a string ensemble, plucked bass, harp, horn or flute lead, a celesta-like bell, and
 * hand percussion (taiko, frame drum, shaker, wooden sticks).
 */
import { envelope, filter, fm, midi, noise, tone, type AC } from '../sfx/dsp';

/** String ensemble: detuned saws through a soft filter, slow bow attack. */
export function pad(ac: AC, out: AudioNode, t: number, dur: number, notes: number[], gain: number, wave: OscillatorType = 'sawtooth', cutoff = 1100) {
  const lp = filter(ac, out, 'lowpass', cutoff, 0.4);
  const a = Math.min(0.45, dur * 0.35);
  for (const n of notes)
    for (const det of [-9, 0, 9]) {
      const o = ac.createOscillator();
      o.type = wave;
      o.frequency.value = midi(n);
      o.detune.value = det;
      const g = ac.createGain();
      const peak = gain / notes.length / 1.6;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(peak, t + a);
      g.gain.setValueAtTime(peak, t + Math.max(a, dur - 0.05));
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.5);
      o.connect(g).connect(lp);
      o.start(t);
      o.stop(t + dur + 0.55);
    }
}

/** Plucked double bass: round and short. */
export function bass(ac: AC, out: AudioNode, t: number, dur: number, note: number, gain: number) {
  const lp = filter(ac, out, 'lowpass', 650, 0.7);
  const d = Math.min(0.55, Math.max(0.18, dur));
  tone(ac, lp, t, { type: 'triangle', f: midi(note), a: 0.004, d, peak: gain });
  tone(ac, out, t, { f: midi(note), a: 0.004, d: d * 0.9, peak: gain * 0.8 });
  noise(ac, out, t, { d: 0.02, peak: gain * 0.25, filter: 'bandpass', f: 900, q: 2 });
}

/** Harp: a bright pluck with a soft octave. */
export function pluck(ac: AC, out: AudioNode, t: number, note: number, gain: number, wave: OscillatorType = 'triangle') {
  tone(ac, filter(ac, out, 'lowpass', 3400), t, { type: wave, f: midi(note), a: 0.003, d: 0.45, peak: gain });
  tone(ac, out, t, { f: midi(note + 12), a: 0.003, d: 0.22, peak: gain * 0.3 });
}

/** Lead: a horn when written as sawtooth, otherwise a breathy flute. Vibrato on held notes. */
export function lead(ac: AC, out: AudioNode, t: number, dur: number, note: number, gain: number, wave: OscillatorType = 'square', cutoff = 2600) {
  const horn = wave === 'sawtooth';
  const o = ac.createOscillator();
  o.type = horn ? 'sawtooth' : 'triangle';
  o.frequency.value = midi(note);
  const lfo = ac.createOscillator();
  const depth = ac.createGain();
  lfo.frequency.value = horn ? 5 : 5.6;
  depth.gain.setValueAtTime(0, t);
  depth.gain.linearRampToValueAtTime(dur > 0.3 ? 10 : 0, t + Math.min(dur, 0.4));
  lfo.connect(depth).connect(o.detune);
  const g = envelope(ac, t, { a: horn ? 0.05 : 0.03, hold: Math.max(0, dur - 0.08), d: 0.16, peak: gain });
  o.connect(g).connect(filter(ac, out, 'lowpass', horn ? Math.min(cutoff, 1700) : cutoff));
  if (!horn) noise(ac, out, t, { a: 0.02, hold: Math.max(0, dur - 0.1), d: 0.12, peak: gain * 0.12, filter: 'bandpass', f: midi(note) * 2, q: 6 });
  const end = t + dur + 0.25;
  o.start(t);
  lfo.start(t);
  o.stop(end);
  lfo.stop(end);
}

/** Celesta-like bell. */
export function bell(ac: AC, out: AudioNode, t: number, note: number, gain: number) {
  fm(ac, out, t, { f: midi(note), ratio: 3.5, index: 1.1, d: 1.1, peak: gain });
}

/** Taiko: a deep drum with a skin of noise. */
export function kick(ac: AC, out: AudioNode, t: number, gain: number) {
  tone(ac, out, t, { f: 120, f2: 48, glide: 0.14, d: 0.42, peak: gain });
  noise(ac, out, t, { d: 0.08, peak: gain * 0.3, filter: 'lowpass', f: 600 });
}

/** Frame drum with a few jingles. */
export function snare(ac: AC, out: AudioNode, t: number, gain: number) {
  tone(ac, out, t, { type: 'triangle', f: 220, f2: 170, d: 0.12, peak: gain * 0.7 });
  noise(ac, out, t, { d: 0.12, peak: gain * 0.6, filter: 'bandpass', f: 1300, q: 0.8 });
  noise(ac, out, t + 0.005, { d: 0.09, peak: gain * 0.35, filter: 'highpass', f: 7000 });
}

/** Shaker (open = a longer shake). */
export function hat(ac: AC, out: AudioNode, t: number, gain: number, open: boolean) {
  noise(ac, out, t, { a: 0.012, d: open ? 0.16 : 0.05, peak: gain, filter: 'bandpass', f: 5600, q: 1.2 });
}

/** Wooden sticks. */
export function clap(ac: AC, out: AudioNode, t: number, gain: number) {
  noise(ac, out, t, { d: 0.04, peak: gain, filter: 'bandpass', f: 1800, q: 6 });
  tone(ac, out, t, { type: 'triangle', f: 900, d: 0.04, peak: gain * 0.4 });
}
