/** Texts of the sound settings in neutral Latin American Spanish. */
export const audio = {
  button: 'Sonido',
  buttonMuted: 'Sonido (silenciado)',
  title: 'Sonido',
  dialog: 'Ajustes de sonido',
  master: 'General',
  music: 'Música',
  sfx: 'Efectos',
  volume: (what: string) => `Volumen ${what.toLowerCase()}`,
  muteAll: 'Silenciar todo',
  uiSounds: 'Sonidos de interfaz',
  uiSoundsHint: 'Cursor, clics, pestañas y paneles.',
  reduce: 'Reducir efectos intensos',
  reduceHint: 'Impactos más suaves, sin sacudidas ni destellos y evolución más breve.',
  footnote: 'Música y efectos originales, sintetizados en el navegador. Se guarda en este navegador.',
};
