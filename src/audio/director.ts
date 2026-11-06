/**
 * Wires the audio system into the app once: the bus plays the catalogue's sounds through the
 * AudioManager, the match session feeds its events, the first gesture unlocks audio, and the
 * "reduce intense effects" setting reaches the CSS.
 */
import { sessionStore } from '../game/useSession';
import { emitCues, gameEvents } from './bus';
import { soundsFor } from './catalog';
import { audio } from './manager';
import { feedSessionCues } from './sessionCues';
import { installUiSounds } from './uiSounds';

function reflectSettings() {
  const root = document.documentElement;
  if (audio.settings.reduceIntense) root.dataset.reduceFx = 'true';
  else delete root.dataset.reduceFx;
}

export function installAudio(): () => void {
  const unlock = () => audio.unlock();
  const gestures = ['pointerdown', 'keydown', 'touchstart'] as const;
  for (const g of gestures) window.addEventListener(g, unlock, { capture: true, passive: true });

  const offBus = gameEvents.on('*', (data, name) => {
    for (const req of soundsFor(name, data)) audio.play(req);
    if (name === 'EVOLUTION_START') audio.duck(true);
    if (name === 'MONSTER_EVOLVED') setTimeout(() => audio.duck(false), 900);
  });

  const pending: (() => void)[] = [];
  const offSession = feedSessionCues(sessionStore, (cues) => pending.push(emitCues(cues)));

  const offUi = installUiSounds(document);
  reflectSettings();
  const offSettings = audio.subscribe(reflectSettings);

  if (import.meta.env.DEV) Object.assign(window, { __dcbAudio: audio, __dcbCues: gameEvents });

  return () => {
    for (const g of gestures) window.removeEventListener(g, unlock, { capture: true });
    offBus();
    offSession();
    offUi();
    offSettings();
    pending.forEach((cancel) => cancel());
  };
}
