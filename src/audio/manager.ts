/**
 * AudioManager: the one place that makes sound. Buses (master → music / effects → interface), the
 * player's volumes, duplicate and voice control, pre-rendered buffers, music with crossfades, and the
 * browser's autoplay rule (nothing starts until the first click or key).
 */
import { SOUNDS, type SoundId, type SoundRequest } from './catalog';
import { SoundGate } from './gate';
import { MusicPlayer } from './music/player';
import type { TrackId } from './music/tracks';
import { busGains, loadAudio, normalizeAudio, saveAudio, type AudioSettings } from './settings';
import { RECIPES } from './sfx/recipes';

type KV = Pick<Storage, 'getItem' | 'setItem'>;

/** Longest a pre-rendered sound may ring (tails included). */
const RENDER_SECONDS = 2.4;

export class AudioManager {
  private ac: AudioContext | null = null;
  private master!: GainNode;
  private musicBus!: GainNode;
  private duckNode!: GainNode;
  private sfxBus!: GainNode;
  private uiBus!: GainNode;
  private music: MusicPlayer | null = null;
  private wanted: TrackId | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private rendering = new Set<string>();
  private lengths = new Map<string, number>();
  private gate = new SoundGate(() => performance.now(), 28);
  private listeners = new Set<() => void>();
  private preloaded = false;
  settings: AudioSettings;

  constructor(private storage: KV | null) {
    this.settings = loadAudio(storage);
  }

  /** Audio is running (the browser allowed it). */
  get ready(): boolean {
    return this.ac?.state === 'running';
  }

  get track(): TrackId | null {
    return this.music?.playing ?? null;
  }

  /** Call from a user gesture. Creates or resumes the audio context. */
  unlock() {
    if (!this.ac) this.create();
    const ac = this.ac;
    if (!ac) return;
    if (ac.state === 'running') return this.started();
    void ac.resume().then(() => this.started());
  }

  private create() {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ac = new Ctx({ latencyHint: 'interactive' });
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 12;
    comp.ratio.value = 4;
    comp.attack.value = 0.004;
    comp.release.value = 0.2;
    comp.connect(ac.destination);
    this.master = ac.createGain();
    this.master.connect(comp);
    this.musicBus = ac.createGain();
    this.musicBus.connect(this.master);
    this.duckNode = ac.createGain();
    this.duckNode.connect(this.musicBus);
    this.sfxBus = ac.createGain();
    this.sfxBus.connect(this.master);
    this.uiBus = ac.createGain();
    this.uiBus.connect(this.sfxBus);
    this.ac = ac;
    this.music = new MusicPlayer(ac, this.duckNode);
    this.applyGains(true);
  }

  private started() {
    if (this.wanted && this.music && this.music.playing !== this.wanted) this.music.play(this.wanted, 1.6);
    if (!this.preloaded) {
      this.preloaded = true;
      void this.preload();
    }
    this.notify();
  }

  private applyGains(instant = false) {
    if (!this.ac) return;
    const g = busGains(this.settings);
    const t = this.ac.currentTime;
    const set = (node: GainNode, v: number) => (instant ? node.gain.setValueAtTime(v, t) : node.gain.setTargetAtTime(v, t, 0.04));
    set(this.master, g.master);
    set(this.musicBus, g.music);
    set(this.sfxBus, g.sfx);
    set(this.uiBus, g.ui);
  }

  update(patch: Partial<AudioSettings>) {
    this.settings = normalizeAudio({ ...this.settings, ...patch });
    saveAudio(this.storage, this.settings);
    this.applyGains();
    this.notify();
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => void this.listeners.delete(fn);
  }

  private notify() {
    for (const fn of this.listeners) fn();
  }

  /** The music the screen asks for (it starts once audio is unlocked). */
  setTrack(id: TrackId | null) {
    this.wanted = id;
    if (!this.music || !this.ready) return;
    if (id) this.music.play(id);
    else this.music.stop();
  }

  /** Lower the music under a big moment. */
  duck(on: boolean) {
    if (!this.ac) return;
    this.duckNode.gain.setTargetAtTime(on ? 0.4 : 1, this.ac.currentTime, on ? 0.08 : 0.4);
  }

  play(req: SoundRequest) {
    const ac = this.ac;
    if (!ac || ac.state !== 'running' || this.settings.muted) return;
    const def = SOUNDS[req.id];
    if (def.group === 'ui' && !this.settings.uiSounds) return;
    const key = `${req.id}:${req.variant ?? ''}`;
    const length = this.lengths.get(key) ?? 0.6;
    if (!this.gate.admit(key, def, length * 1000)) return;

    const t = ac.currentTime + 0.004;
    const out = ac.createGain();
    out.gain.value = def.gain * (req.gain ?? 1) * (this.settings.reduceIntense && def.intense ? 0.55 : 1);
    if (req.pan) {
      const p = ac.createStereoPanner();
      p.pan.value = req.pan;
      out.connect(p).connect(def.group === 'ui' ? this.uiBus : this.sfxBus);
    } else out.connect(def.group === 'ui' ? this.uiBus : this.sfxBus);

    const buf = this.buffers.get(key);
    if (buf) {
      const src = ac.createBufferSource();
      src.buffer = buf;
      src.connect(out);
      src.onended = () => out.disconnect();
      src.start(t);
    } else {
      const len = RECIPES[req.id](ac, out, t, req.variant ?? '');
      this.lengths.set(key, len);
      setTimeout(() => out.disconnect(), (len + 1) * 1000);
      void this.render(req.id, req.variant ?? '');
    }
  }

  /** Render one sound into a buffer (a recorded file when the catalogue names one). */
  private async render(id: SoundId, variant: string) {
    const key = `${id}:${variant}`;
    if (!this.ac || this.buffers.has(key) || this.rendering.has(key)) return;
    this.rendering.add(key);
    try {
      const file = SOUNDS[id].file;
      if (file) {
        const buf = await this.ac.decodeAudioData(await (await fetch(file)).arrayBuffer());
        this.buffers.set(key, buf);
        this.lengths.set(key, buf.duration);
        return;
      }
      const sr = this.ac.sampleRate;
      const off = new OfflineAudioContext(1, Math.ceil(RENDER_SECONDS * sr), sr);
      const len = RECIPES[id](off, off.destination, 0.005, variant);
      const full = await off.startRendering();
      this.buffers.set(key, trim(this.ac, full, len));
      this.lengths.set(key, len);
    } catch {
      // the live synthesis keeps working
    } finally {
      this.rendering.delete(key);
    }
  }

  /** Render every sound and variant ahead of time, a few at a time, without blocking the page. */
  private async preload() {
    const order = (Object.keys(SOUNDS) as SoundId[]).sort((a, b) => SOUNDS[b].priority - SOUNDS[a].priority);
    for (const id of order) {
      const variants = SOUNDS[id].variants.length ? SOUNDS[id].variants : [''];
      for (const v of variants) {
        await this.render(id, v);
        await new Promise((r) => setTimeout(r, 8));
      }
    }
  }

  /** Debug: what is loaded and ringing. */
  stats() {
    return { state: this.ac?.state ?? 'none', track: this.track, wanted: this.wanted, buffers: this.buffers.size, voices: this.gate.active };
  }
}

/** Cut the silence after the sound's last audible sample. */
function trim(ac: BaseAudioContext, buf: AudioBuffer, len: number): AudioBuffer {
  const d = buf.getChannelData(0);
  let end = d.length - 1;
  while (end > 0 && Math.abs(d[end]) < 1e-4) end--;
  const n = Math.max(Math.ceil((len + 0.02) * buf.sampleRate), end + 1);
  const out = ac.createBuffer(1, Math.min(n, d.length), buf.sampleRate);
  out.copyToChannel(d.subarray(0, out.length), 0);
  return out;
}

export const audio = new AudioManager(typeof localStorage === 'undefined' ? null : localStorage);
