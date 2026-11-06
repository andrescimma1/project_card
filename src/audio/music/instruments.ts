/**
 * The music's instruments, all synthesised: a soft pad, bass, plucked arpeggio, lead, FM bell and a
 * small drum kit.
 */
import { envelope, filter, fm, midi, noise, tone, type AC } from '../sfx/dsp';

export function pad(ac: AC, out: AudioNode, t: number, dur: number, notes: number[], gain: number, wave: OscillatorType = 'sawtooth', cutoff = 1400) {
  const lp = filter(ac, out, 'lowpass', cutoff, 0.5);
  const a = Math.min(0.35, dur * 0.3);
  for (const n of notes)
    for (const det of [-7, 7]) {
      const o = ac.createOscillator();
      o.type = wave;
      o.frequency.value = midi(n);
      o.detune.value = det;
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(gain / notes.length, t + a);
      g.gain.setValueAtTime(gain / notes.length, t + Math.max(a, dur - 0.05));
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.45);
      o.connect(g).connect(lp);
      o.start(t);
      o.stop(t + dur + 0.5);
    }
}

export function bass(ac: AC, out: AudioNode, t: number, dur: number, note: number, gain: number) {
  const lp = ac.createBiquadFilter();
  lp.type = 'lowpass';
  lp.Q.value = 4;
  lp.frequency.setValueAtTime(1000, t);
  lp.frequency.exponentialRampToValueAtTime(200, t + 0.2);
  lp.connect(out);
  tone(ac, lp, t, { type: 'sawtooth', f: midi(note), hold: Math.max(0, dur - 0.08), d: 0.12, peak: gain });
  tone(ac, out, t, { f: midi(note), hold: Math.max(0, dur - 0.08), d: 0.12, peak: gain * 0.9 });
}

export function pluck(ac: AC, out: AudioNode, t: number, note: number, gain: number, wave: OscillatorType = 'triangle') {
  tone(ac, filter(ac, out, 'lowpass', 3200), t, { type: wave, f: midi(note), a: 0.003, d: 0.24, peak: gain });
}

export function lead(ac: AC, out: AudioNode, t: number, dur: number, note: number, gain: number, wave: OscillatorType = 'square', cutoff = 2600) {
  const o = ac.createOscillator();
  o.type = wave;
  o.frequency.value = midi(note);
  // a little vibrato on held notes
  const lfo = ac.createOscillator();
  const depth = ac.createGain();
  lfo.frequency.value = 5.5;
  depth.gain.setValueAtTime(0, t);
  depth.gain.linearRampToValueAtTime(dur > 0.3 ? 9 : 0, t + Math.min(dur, 0.35));
  lfo.connect(depth).connect(o.detune);
  const g = envelope(ac, t, { a: 0.012, hold: Math.max(0, dur - 0.06), d: 0.14, peak: gain });
  o.connect(g).connect(filter(ac, out, 'lowpass', cutoff));
  const end = t + dur + 0.2;
  o.start(t);
  lfo.start(t);
  o.stop(end);
  lfo.stop(end);
}

export function bell(ac: AC, out: AudioNode, t: number, note: number, gain: number) {
  fm(ac, out, t, { f: midi(note), ratio: 3.5, index: 1.3, d: 1.1, peak: gain });
}

export function kick(ac: AC, out: AudioNode, t: number, gain: number) {
  tone(ac, out, t, { f: 150, f2: 42, glide: 0.1, d: 0.32, peak: gain });
}

export function snare(ac: AC, out: AudioNode, t: number, gain: number) {
  noise(ac, out, t, { d: 0.16, peak: gain, filter: 'bandpass', f: 1900, q: 0.7 });
  tone(ac, out, t, { type: 'triangle', f: 185, d: 0.08, peak: gain * 0.6 });
}

export function hat(ac: AC, out: AudioNode, t: number, gain: number, open: boolean) {
  noise(ac, out, t, { d: open ? 0.18 : 0.035, peak: gain, filter: 'highpass', f: 7500 });
}

export function clap(ac: AC, out: AudioNode, t: number, gain: number) {
  for (let i = 0; i < 3; i++) noise(ac, out, t + i * 0.012, { d: i === 2 ? 0.12 : 0.01, peak: gain, filter: 'bandpass', f: 1400, q: 1.2 });
}
