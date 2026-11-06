/**
 * Audio preferences, kept in this browser (localStorage). Pure functions: the AudioManager and the
 * settings panel both go through them.
 */
type KV = Pick<Storage, 'getItem' | 'setItem'>;

export interface AudioSettings {
  /** 0..1 */
  master: number;
  music: number;
  sfx: number;
  muted: boolean;
  /** Hover, clicks, tabs, panels. Off leaves game sounds on. */
  uiSounds: boolean;
  /** Softer impacts, no screen shake or flashes, fewer particles. */
  reduceIntense: boolean;
}

export const DEFAULT_AUDIO: AudioSettings = { master: 0.8, music: 0.6, sfx: 0.8, muted: false, uiSounds: true, reduceIntense: false };

export const AUDIO_KEY = 'dcb.audio';

const unit = (v: unknown, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : fallback);
const flag = (v: unknown, fallback: boolean) => (typeof v === 'boolean' ? v : fallback);

export function normalizeAudio(raw: unknown): AudioSettings {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const d = DEFAULT_AUDIO;
  return {
    master: unit(o.master, d.master),
    music: unit(o.music, d.music),
    sfx: unit(o.sfx, d.sfx),
    muted: flag(o.muted, d.muted),
    uiSounds: flag(o.uiSounds, d.uiSounds),
    reduceIntense: flag(o.reduceIntense, d.reduceIntense),
  };
}

export function loadAudio(storage: KV | null): AudioSettings {
  try {
    const raw = storage?.getItem(AUDIO_KEY);
    return normalizeAudio(raw ? JSON.parse(raw) : null);
  } catch {
    return { ...DEFAULT_AUDIO };
  }
}

export function saveAudio(storage: KV | null, s: AudioSettings): void {
  try {
    storage?.setItem(AUDIO_KEY, JSON.stringify(s));
  } catch {
    // private mode or full storage: the settings still apply for this visit
  }
}

export interface BusGains {
  master: number;
  music: number;
  sfx: number;
  /** Relative to the effects bus. */
  ui: number;
}

/** Sliders feel linear to the ear with a square curve. */
const curve = (v: number) => v * v;

export function busGains(s: AudioSettings): BusGains {
  return { master: s.muted ? 0 : curve(s.master), music: curve(s.music), sfx: curve(s.sfx), ui: s.uiSounds ? 0.8 : 0 };
}
