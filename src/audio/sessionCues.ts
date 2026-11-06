/**
 * Listens to the match session and turns each new batch of engine events into cues. Cues that come
 * after a cinematic (battle replay, digivolution) wait until the board has shown it.
 */
import type { StoreApi } from 'zustand/vanilla';
import type { PlayerId } from '../engine/game/types';
import type { LogEntry, SessionState } from '../game/session';
import type { Cue } from './bus';
import { planCues } from './cues';

export function feedSessionCues(store: StoreApi<SessionState>, emit: (cues: Cue[]) => void): () => void {
  let seen: LogEntry[] = store.getState().log;
  let pending: { threshold: number; cues: Cue[] }[] = [];

  const flush = (s: SessionState) => {
    const ready = pending.filter((p) => s.sceneSeq >= p.threshold);
    if (!ready.length) return;
    pending = pending.filter((p) => s.sceneSeq < p.threshold);
    for (const p of ready) emit(p.cues);
  };

  return store.subscribe((s) => {
    if (s.log !== seen) {
      const newGame = s.log.length < seen.length || s.log[0] !== seen[0];
      const added = newGame ? s.log : s.log.slice(seen.length);
      seen = s.log;
      if (newGame) pending = [];
      if (added.length) {
        const humans: PlayerId[] = s.twoPlayer ? [0, 1] : [0];
        const plan = planCues(
          added.map((l) => l.event),
          { humans },
        );
        // scenes of this batch are the last `plan.scenes` of the queue
        const base = s.sceneSeq + Math.max(0, s.scenes.length - plan.scenes);
        const groups = new Map<number, Cue[]>();
        for (const c of plan.cues) {
          const g = groups.get(c.afterScenes) ?? [];
          g.push({ name: c.name, data: c.data, delay: c.delay });
          groups.set(c.afterScenes, g);
        }
        if (newGame) {
          const first = (groups.get(0) ?? []).map((c) => ({ ...c, delay: (c.delay ?? 0) + 480 }));
          groups.set(0, [{ name: 'DECK_SHUFFLED' }, ...first]);
        }
        for (const [k, cues] of groups) pending.push({ threshold: base + k, cues });
      }
    }
    flush(s);
  });
}
