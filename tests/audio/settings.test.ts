import { describe, expect, it } from 'vitest';
import { AUDIO_KEY, busGains, DEFAULT_AUDIO, loadAudio, normalizeAudio, saveAudio } from '../../src/audio/settings';

function memory() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), m };
}

describe('audio settings', () => {
  it('fills missing or wrong values with the defaults and clamps volumes to 0..1', () => {
    expect(normalizeAudio(null)).toEqual(DEFAULT_AUDIO);
    expect(normalizeAudio({ master: 3, music: -1, sfx: 'x', muted: 'yes', uiSounds: false })).toEqual({ ...DEFAULT_AUDIO, master: 1, music: 0, uiSounds: false });
  });

  it('round-trips through storage and survives broken JSON', () => {
    const s = memory();
    expect(loadAudio(s)).toEqual(DEFAULT_AUDIO);
    saveAudio(s, { ...DEFAULT_AUDIO, music: 0.2, reduceIntense: true });
    expect(loadAudio(s)).toEqual({ ...DEFAULT_AUDIO, music: 0.2, reduceIntense: true });
    s.m.set(AUDIO_KEY, '{nope');
    expect(loadAudio(s)).toEqual(DEFAULT_AUDIO);
    expect(loadAudio(null)).toEqual(DEFAULT_AUDIO);
  });

  it('turns the sliders into bus gains: muted silences everything, UI sounds can be switched off alone', () => {
    const g = busGains({ ...DEFAULT_AUDIO, master: 1, music: 0.5, sfx: 1 });
    expect(g.master).toBe(1);
    expect(g.music).toBeCloseTo(0.25);
    expect(g.sfx).toBe(1);
    expect(g.ui).toBeGreaterThan(0);
    expect(busGains({ ...DEFAULT_AUDIO, muted: true }).master).toBe(0);
    expect(busGains({ ...DEFAULT_AUDIO, uiSounds: false }).ui).toBe(0);
  });
});
