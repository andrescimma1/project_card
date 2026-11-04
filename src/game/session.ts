/**
 * Match session: human (player 0) vs the original CPU AI (player 1).
 * Framework-free Zustand store; the React layer only subscribes to it.
 */
import { createStore } from 'zustand/vanilla';
import { chooseAiAction, createAi, type AiCtx, type AiProfile } from '../engine/ai';
import { applyAction, createGame, legalActions } from '../engine/game/turn';
import type { Action, GameEvent, GameState, PartnerSlot, PlayerId } from '../engine/game/types';
import { buildScenes, type Scene } from './scenes';

export const HUMAN: PlayerId = 0;
export const CPU: PlayerId = 1;

export interface LogEntry {
  id: number;
  turnNumber: number;
  event: GameEvent;
}

export interface StartOptions {
  human: number[];
  cpu: number[];
  seed: number;
  humanFirst: boolean;
  /** Personality of the CPU deck (DECK2.DEK, `OriginalDeck.ai`). */
  cpuAi?: AiProfile;
  /** Digi-Egg of the CPU partner (DECK2.DEK +0x6D, `OriginalDeck.partnerEgg`). */
  cpuEgg?: number;
  /** Partner slots of each player (story mode); by default they come from each deck. */
  partners?: [PartnerSlot[], PartnerSlot[]];
}

export interface SessionState {
  game: GameState | null;
  log: LogEntry[];
  /** Events of the most recent battle, from the reveal to the KO/rounds (null before the first battle). */
  battleReport: GameEvent[] | null;
  /** Cinematics waiting to be played by the UI, oldest first. */
  scenes: Scene[];
  /** Increments every time a scene is consumed (stable React key for the current cinematic). */
  sceneSeq: number;
  error: string | null;
  seed: number;
  /** The CPU player: personality, rand() and plan memory of the original AI. */
  cpu: AiCtx | null;
  start: (opts: StartOptions) => void;
  act: (action: Action) => void;
  dismissReport: () => void;
  popScene: () => void;
  reset: () => void;
}

function cpuShouldAct(game: GameState): boolean {
  if (game.phase.name === 'gameOver') return false;
  const cpuActions = legalActions(game, CPU);
  if (!cpuActions.length) return false;
  // simultaneous attack choice: the CPU commits right away (hidden until the reveal)
  if (game.phase.name === 'attack') return true;
  return legalActions(game, HUMAN).length === 0;
}

export function createSession() {
  return createStore<SessionState>((set, get) => {
    let nextId = 0;

    const advance = (game: GameState, events: GameEvent[]) => {
      let g = game;
      const all = [...events];
      let guard = 0;
      const ai = get().cpu!;
      while (cpuShouldAct(g) && guard++ < 500) {
        const r = applyAction(g, chooseAiAction(g, CPU, ai));
        g = r.state;
        all.push(...r.events);
      }
      const log = [...get().log, ...all.map((event) => ({ id: nextId++, turnNumber: g.turnNumber, event }))];
      const reveal = all.findIndex((e) => e.type === 'reveal');
      let battleReport = get().battleReport;
      if (reveal >= 0) {
        const end = all.findIndex((e, i) => i > reveal && e.type === 'turnStart');
        battleReport = all.slice(reveal, end < 0 ? undefined : end);
      }
      set({ game: g, log, battleReport, scenes: [...get().scenes, ...buildScenes(all)], error: null });
    };

    return {
      game: null,
      log: [],
      battleReport: null,
      scenes: [],
      sceneSeq: 0,
      error: null,
      seed: 1,
      cpu: null,
      start: (opts) => {
        nextId = 0;
        set({ log: [], battleReport: null, scenes: [], error: null, seed: opts.seed, cpu: createAi(opts.cpuAi ?? [0, 0, 0, 0], opts.seed * 7919) });
        const r = createGame({ decks: [opts.human, opts.cpu], seed: opts.seed, firstPlayer: opts.humanFirst ? HUMAN : CPU, eggs: [0, opts.cpuEgg ?? 0], partners: opts.partners });
        advance(r.state, r.events);
      },
      act: (action) => {
        const game = get().game;
        if (!game) return;
        try {
          const r = applyAction(game, action);
          advance(r.state, r.events);
        } catch (e) {
          set({ error: e instanceof Error ? e.message : String(e) });
        }
      },
      dismissReport: () => set({ battleReport: null }),
      popScene: () => set({ scenes: get().scenes.slice(1), sceneSeq: get().sceneSeq + 1 }),
      reset: () => set({ game: null, log: [], battleReport: null, scenes: [], error: null, cpu: null }),
    };
  });
}
