/**
 * React side of the audio system: settings as state, reacting to cues, emitting cues timed with an
 * animation, and panel open/close sounds.
 */
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { emitCues, gameEvents, type Cue, type CueData, type CueName } from './bus';
import { audio } from './manager';
import type { AudioSettings } from './settings';

export function useAudioSettings(): AudioSettings {
  return useSyncExternalStore(
    (fn) => audio.subscribe(fn),
    () => audio.settings,
  );
}

/** Run `fn` when a cue fires (visual reactions: shake, flash…). */
export function useCue(name: CueName | CueName[], fn: (data: CueData, name: CueName) => void) {
  const ref = useRef(fn);
  ref.current = fn;
  const key = Array.isArray(name) ? name.join(',') : name;
  useEffect(() => {
    const names = key.split(',') as CueName[];
    return gameEvents.on('*', (d, n) => {
      if (names.includes(n)) ref.current(d, n);
    });
  }, [key]);
}

/** Emit cues once for `key` (e.g. a replay step); pending ones are cancelled if it changes first. */
export function useCues(key: string | null, cues: () => Cue[]) {
  const build = useRef(cues);
  build.current = cues;
  useEffect(() => {
    if (key === null) return;
    return emitCues(build.current());
  }, [key]);
}

/** PANEL_OPEN / PANEL_CLOSE as a panel shows and hides. */
export function usePanelCue(open: boolean) {
  const was = useRef(open);
  useEffect(() => {
    if (open === was.current) return;
    was.current = open;
    gameEvents.emit(open ? 'PANEL_OPEN' : 'PANEL_CLOSE');
  }, [open]);
}
