/**
 * Plays the tracks of music/tracks.ts with a look-ahead scheduler (notes are placed on the audio clock a
 * little ahead of time, so timers jittering never makes the music stutter). Switching crossfades.
 */
import * as I from './instruments';
import { steps, TRACKS, type Layer, type TrackDef, type TrackId } from './tracks';

interface Prepared {
  layer: Layer;
  pattern: string;
  /** Index of each hit (for melodies and arpeggios), -1 elsewhere. */
  hit: number[];
}

interface Voice {
  id: TrackId;
  def: TrackDef;
  gain: GainNode;
  layers: Prepared[];
  step: number;
  next: number;
  timer: ReturnType<typeof setInterval> | null;
  source: AudioBufferSourceNode | null;
}

const HIT = /[xXo]/;

/** The tracks are written quiet (many voices add up); this brings them to a level that sits under the effects. */
const LEVEL = 2.4;

function prepare(def: TrackDef): Prepared[] {
  return def.layers.map((layer) => {
    const pattern = steps(layer.pattern).repeat((def.bars * 16) / steps(layer.pattern).length);
    let k = 0;
    return { layer, pattern, hit: [...pattern].map((c) => (HIT.test(c) ? k++ : -1)) };
  });
}

/** Steps a note lasts: itself plus the holds that follow it. */
function held(pattern: string, i: number): number {
  let n = 1;
  while (pattern[i + n] === '-') n++;
  return n;
}

export class MusicPlayer {
  private current: Voice | null = null;
  private files = new Map<string, AudioBuffer | null>();

  constructor(
    private ac: AudioContext,
    private out: AudioNode,
  ) {}

  get playing(): TrackId | null {
    return this.current?.id ?? null;
  }

  play(id: TrackId, fade = 1.2) {
    if (this.current?.id === id) return;
    this.fadeOut(fade);
    const def = TRACKS[id];
    const now = this.ac.currentTime;
    const gain = this.ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(LEVEL, now + fade);
    gain.connect(this.out);
    const v: Voice = { id, def, gain, layers: prepare(def), step: 0, next: now + 0.06, timer: null, source: null };
    this.current = v;
    if (def.file) void this.playFile(v, def.file);
    else v.timer = setInterval(() => this.schedule(v), 25);
  }

  stop(fade = 1) {
    this.fadeOut(fade);
  }

  private fadeOut(fade: number) {
    const old = this.current;
    if (!old) return;
    this.current = null;
    const now = this.ac.currentTime;
    old.gain.gain.cancelScheduledValues(now);
    old.gain.gain.setValueAtTime(Math.max(0.0001, old.gain.gain.value), now);
    old.gain.gain.exponentialRampToValueAtTime(0.0001, now + fade);
    setTimeout(
      () => {
        if (old.timer) clearInterval(old.timer);
        old.source?.stop();
        old.gain.disconnect();
      },
      fade * 1000 + 600,
    );
  }

  /** A recorded track (TrackDef.file) instead of the sequencer. */
  private async playFile(v: Voice, url: string) {
    let buf = this.files.get(url);
    if (buf === undefined) {
      try {
        buf = await this.ac.decodeAudioData(await (await fetch(url)).arrayBuffer());
      } catch {
        buf = null;
      }
      this.files.set(url, buf);
    }
    if (this.current !== v) return;
    if (!buf) {
      v.timer = setInterval(() => this.schedule(v), 25);
      return;
    }
    const src = this.ac.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.connect(v.gain);
    src.start();
    v.source = src;
  }

  private schedule(v: Voice) {
    if (v.timer === null) return;
    // background tabs run timers once a second: schedule further ahead there
    const ahead = this.ac.currentTime + (typeof document !== 'undefined' && document.hidden ? 1.6 : 0.2);
    const stepDur = 60 / v.def.bpm / 4;
    if (v.next < this.ac.currentTime - 0.1) v.next = this.ac.currentTime + 0.02; // resumed after a pause
    while (v.next < ahead) {
      this.playStep(v, v.step, v.next, stepDur);
      v.step++;
      if (v.step >= v.def.bars * 16) v.step = (v.def.intro ?? 0) * 16;
      v.next += stepDur;
    }
  }

  private playStep(v: Voice, step: number, t: number, stepDur: number) {
    const chord = v.def.chords[Math.floor(step / 16)];
    const ac = this.ac;
    const out = v.gain;
    for (const p of v.layers) {
      const c = p.pattern[step];
      if (!HIT.test(c)) continue;
      const accent = c === 'X' ? 1.35 : 1;
      const l = p.layer;
      const dur = held(p.pattern, step) * stepDur;
      const g = l.gain * accent;
      switch (l.kind) {
        case 'pad':
          I.pad(ac, out, t, dur, chord.map((n) => n + (l.shift ?? 0)), g, l.wave, l.cutoff);
          break;
        case 'bass': {
          const root = (chord[0] % 12) + 12 * ((l.octave ?? 2) + 1);
          I.bass(ac, out, t, Math.max(dur, stepDur) * 0.9, c === 'o' ? root + 12 : root, g);
          break;
        }
        case 'arp': {
          const k = p.hit[step];
          const ns = chord.map((n) => n + (l.shift ?? 0));
          const seq = l.order === 'down' ? [...ns].reverse() : l.order === 'updown' ? [...ns, ...ns.slice(1, -1).reverse()] : ns;
          I.pluck(ac, out, t, seq[k % seq.length], g, l.wave);
          break;
        }
        case 'lead':
          I.lead(ac, out, t, dur, l.notes[p.hit[step] % l.notes.length], g, l.wave, l.cutoff);
          break;
        case 'bell':
          I.bell(ac, out, t, l.notes[p.hit[step] % l.notes.length], g);
          break;
        case 'kick':
          I.kick(ac, out, t, g);
          break;
        case 'snare':
          I.snare(ac, out, t, g);
          break;
        case 'hat':
          I.hat(ac, out, t, g, c === 'o');
          break;
        case 'clap':
          I.clap(ac, out, t, g);
          break;
      }
    }
  }
}
