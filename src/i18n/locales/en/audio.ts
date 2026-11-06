/** Texts of the sound settings in English. Same keys as the Spanish file (the compiler checks it). */
import type { audio as es } from '../es/audio';

export const audio: typeof es = {
  button: 'Sound',
  buttonMuted: 'Sound (muted)',
  title: 'Sound',
  dialog: 'Sound settings',
  master: 'Master',
  music: 'Music',
  sfx: 'Effects',
  volume: (what: string) => `${what} volume`,
  muteAll: 'Mute everything',
  uiSounds: 'Interface sounds',
  uiSoundsHint: 'Pointer, clicks, tabs and panels.',
  reduce: 'Reduce intense effects',
  reduceHint: 'Softer impacts, no shaking or flashes, and a shorter evolution.',
  footnote: 'Original music and effects, synthesised in the browser. Saved in this browser.',
};
