/**
 * Small synthesis toolkit over the Web Audio API. Works on a live AudioContext and on an
 * OfflineAudioContext (the manager pre-renders sounds into buffers with the same code).
 */
export type AC = BaseAudioContext;

export const midi = (n: number) => 440 * 2 ** ((n - 69) / 12);

const noiseCache = new WeakMap<AC, AudioBuffer>();

/** One second of white noise (deterministic, so pre-rendered sounds are always the same). */
export function noiseBuffer(ac: AC): AudioBuffer {
  let b = noiseCache.get(ac);
  if (b) return b;
  b = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
  const d = b.getChannelData(0);
  let x = 0x2f6b9e1;
  for (let i = 0; i < d.length; i++) {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    d[i] = x / 2147483648 - 1;
  }
  noiseCache.set(ac, b);
  return b;
}

export interface Env {
  /** Attack (s). */
  a?: number;
  /** Time held at the peak (s). */
  hold?: number;
  /** Decay to silence (s). */
  d: number;
  peak?: number;
}

const length = (e: Env) => (e.a ?? 0.004) + (e.hold ?? 0) + e.d;

export function envelope(ac: AC, t: number, e: Env): GainNode {
  const g = ac.createGain();
  const a = e.a ?? 0.004;
  const peak = e.peak ?? 1;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + a);
  if (e.hold) g.gain.setValueAtTime(peak, t + a + e.hold);
  g.gain.exponentialRampToValueAtTime(0.0001, t + length(e));
  return g;
}

export interface ToneOpts extends Env {
  type?: OscillatorType;
  f: number;
  /** Glide target. */
  f2?: number;
  /** Glide time (default: the whole sound). */
  glide?: number;
  detune?: number;
}

export function tone(ac: AC, out: AudioNode, t: number, o: ToneOpts): number {
  const osc = ac.createOscillator();
  osc.type = o.type ?? 'sine';
  osc.frequency.setValueAtTime(o.f, t);
  const dur = length(o);
  if (o.f2 !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.f2), t + (o.glide ?? dur));
  if (o.detune) osc.detune.value = o.detune;
  osc.connect(envelope(ac, t, o)).connect(out);
  osc.start(t);
  osc.stop(t + dur + 0.02);
  return dur;
}

export interface NoiseOpts extends Env {
  filter?: BiquadFilterType;
  f?: number;
  f2?: number;
  q?: number;
  rate?: number;
}

export function noise(ac: AC, out: AudioNode, t: number, o: NoiseOpts): number {
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac);
  src.loop = true;
  if (o.rate) src.playbackRate.value = o.rate;
  const dur = length(o);
  let node: AudioNode = src;
  if (o.filter) {
    const bq = ac.createBiquadFilter();
    bq.type = o.filter;
    bq.frequency.setValueAtTime(o.f ?? 1000, t);
    if (o.f2) bq.frequency.exponentialRampToValueAtTime(o.f2, t + dur);
    bq.Q.value = o.q ?? 0.8;
    node.connect(bq);
    node = bq;
  }
  node.connect(envelope(ac, t, o)).connect(out);
  // a different stretch of the noise each time, but always the same for the same start time
  src.start(t, (t * 7.31) % 0.8);
  src.stop(t + dur + 0.02);
  return dur;
}

export interface FmOpts extends Env {
  f: number;
  /** Modulator / carrier frequency ratio (non-integer = metallic). */
  ratio: number;
  /** Modulation depth at the start, in multiples of the carrier frequency. */
  index: number;
  /** …and at the end. */
  index2?: number;
  type?: OscillatorType;
}

/** Two-operator FM: bells, metal, glassy shimmer. */
export function fm(ac: AC, out: AudioNode, t: number, o: FmOpts): number {
  const car = ac.createOscillator();
  const mod = ac.createOscillator();
  const depth = ac.createGain();
  const dur = length(o);
  car.type = o.type ?? 'sine';
  car.frequency.value = o.f;
  mod.frequency.value = o.f * o.ratio;
  depth.gain.setValueAtTime(Math.max(1, o.index * o.f), t);
  depth.gain.exponentialRampToValueAtTime(Math.max(1, (o.index2 ?? o.index * 0.08) * o.f), t + dur);
  mod.connect(depth).connect(car.frequency);
  car.connect(envelope(ac, t, o)).connect(out);
  car.start(t);
  mod.start(t);
  car.stop(t + dur + 0.02);
  mod.stop(t + dur + 0.02);
  return dur;
}

export function filter(ac: AC, out: AudioNode, type: BiquadFilterType, f: number, q = 0.7): BiquadFilterNode {
  const b = ac.createBiquadFilter();
  b.type = type;
  b.frequency.value = f;
  b.Q.value = q;
  b.connect(out);
  return b;
}

/** A filter whose cutoff moves from f to f2 between t and t + dur. */
export function sweep(ac: AC, out: AudioNode, type: BiquadFilterType, f: number, f2: number, t: number, dur: number, q = 0.7): BiquadFilterNode {
  const b = filter(ac, out, type, f, q);
  b.frequency.setValueAtTime(f, t);
  b.frequency.exponentialRampToValueAtTime(f2, t + dur);
  return b;
}

export function level(ac: AC, out: AudioNode, v: number): GainNode {
  const g = ac.createGain();
  g.gain.value = v;
  g.connect(out);
  return g;
}

/** Soft clipping: grit for the heavy hits. */
export function drive(ac: AC, out: AudioNode, k: number): WaveShaperNode {
  const ws = ac.createWaveShaper();
  const n = 1024;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    curve[i] = Math.tanh(k * x) / Math.tanh(k);
  }
  ws.curve = curve;
  ws.connect(out);
  return ws;
}

/** Dry + a feedback echo; returns the input to connect sources to. */
export function echo(ac: AC, out: AudioNode, time: number, feedback: number, wet: number): GainNode {
  const input = ac.createGain();
  const delay = ac.createDelay(1);
  const fb = ac.createGain();
  const w = ac.createGain();
  const damp = filter(ac, fb, 'lowpass', 2400);
  delay.delayTime.value = time;
  fb.gain.value = feedback;
  w.gain.value = wet;
  input.connect(out);
  input.connect(delay);
  delay.connect(damp);
  fb.connect(delay);
  delay.connect(w).connect(out);
  return input;
}
