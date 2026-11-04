/**
 * Story mode: save slots, new game, the world map, city scripts (story/cityHost.ts) and battles against
 * the CPU through the match session. Framework-free store; dependencies are injected for tests.
 */
import { createStore, type StoreApi } from 'zustand/vanilla';
import { decks } from '../engine/cards/decks';
import { partnersFromDeck } from '../engine/game/partner';
import { validateDeck } from '../engine/game/turn';
import type { GameEvent, GameState } from '../engine/game/types';
import { psxRand } from '../engine/ai/rand';
import { applyComResult, newGame as createSave, type ComResult, type SaveData } from '../engine/progression/save';
import { advance, enterCity as hostEnter, type CityHost, type StoryRequest, type StoryResponse } from '../story/cityHost';
import { npcNames } from '../story/present';
import { deleteSave, listSaves, loadSave, writeSave, type SaveSummary } from './saveSlots';
import type { SessionState } from './session';

type KV = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export type StoryView = 'slots' | 'newGame' | 'map' | 'city' | 'battle' | 'result';

export interface StoryState {
  view: StoryView;
  slots: (SaveSummary | null)[];
  slot: number | null;
  save: SaveData | null;
  host: CityHost | null;
  request: StoryRequest | null;
  /** Battle Cafe names of the current city (presentation). */
  npcs: Record<number, string>;
  battle: { deck: number; lent: number | null } | null;
  result: ComResult | null;
  /** Outcome of the last battle, handed back to the script (v1). */
  won: boolean;
  error: string | null;
  refreshSlots: () => void;
  chooseNewGame: (slot: number) => void;
  newGame: (slot: number, partner: 0 | 1 | 2) => Promise<void>;
  continueGame: (slot: number) => void;
  deleteSlot: (slot: number) => void;
  enterCity: (city: number) => Promise<void>;
  reply: (r: StoryResponse) => void;
  finishBattle: (state: GameState, events: GameEvent[]) => void;
  closeResult: () => void;
  saveNow: () => void;
  toSlots: () => void;
}

export interface StoryDeps {
  loadScript: (city: number) => Promise<Uint8Array>;
  storage: KV | null;
  session: StoreApi<SessionState>;
  seed: number;
}

/** Scripts copied from the user's disc by `npm run extract:scripts`. */
export async function fetchCityScript(city: number): Promise<Uint8Array> {
  const res = await fetch(`/scripts/CITY${String(city).padStart(2, '0')}.MSD`);
  if (!res.ok) throw new Error('No están los guiones de las ciudades. Ejecuta `npm run extract:scripts -- "<carpeta del disco>"`.');
  return new Uint8Array(await res.arrayBuffer());
}

/** DECK2 index of the tutorial deck: the game keeps no record of that battle (ctx+0x81F). */
const TUTORIAL_DECK = 0;

export function createStoryStore(deps: StoryDeps) {
  const rand = psxRand(deps.seed);
  return createStore<StoryState>((set, get) => {
    const persist = () => {
      const { slot, save } = get();
      if (slot !== null && save) writeSave(slot, save, deps.storage);
      set({ slots: listSaves(deps.storage) });
    };

    /** Show a request; handle the ones that need no screen. */
    const show = (req: StoryRequest) => {
      const { host } = get();
      if (!host) return;
      if (req.kind === 'end') {
        set({ view: 'map', host: null, request: null });
        return;
      }
      if (req.kind === 'screen' && req.screen === 'save') {
        persist();
        return show(advance(host, rand, { kind: 'ack' }));
      }
      if (req.kind === 'battle') return startBattle(req.deck, req.lent);
      set({ view: 'city', request: req });
    };

    const startBattle = (deck: number, lent: number | null) => {
      const save = get().save!;
      const human = lent !== null ? decks[lent].cards : save.decks[save.selectedDeck]?.cards ?? [];
      if (validateDeck(human).length) {
        set({ error: 'Tu mazo activo no es válido (30 cartas). Elige otro en Menú → Mazos.', view: 'city' });
        return;
      }
      const rival = decks[deck];
      const seed = rand.next() * 65536 + rand.next();
      deps.session.getState().start({
        human,
        cpu: rival.cards,
        cpuAi: rival.ai,
        cpuEgg: rival.partnerEgg,
        seed,
        humanFirst: seed % 2 === 0, // 🟡 who starts a story battle is not traced
        partners: [save.partners.map((p) => p.slot), partnersFromDeck(rival.cards, rival.partnerEgg)],
      });
      set({ view: 'battle', battle: { deck, lent }, request: null, error: null });
    };

    return {
      view: 'slots',
      slots: listSaves(deps.storage),
      slot: null,
      save: null,
      host: null,
      request: null,
      npcs: {},
      battle: null,
      result: null,
      won: false,
      error: null,
      refreshSlots: () => set({ slots: listSaves(deps.storage) }),
      chooseNewGame: (slot) => set({ view: 'newGame', slot }),
      newGame: async (slot, partner) => {
        const save = createSave(partner, rand);
        set({ slot, save });
        persist();
        await get().enterCity(0); // the game starts in Beginner City
      },
      continueGame: (slot) => {
        const save = loadSave(slot, deps.storage);
        if (save) set({ slot, save, view: 'map', error: null });
      },
      deleteSlot: (slot) => {
        deleteSave(slot, deps.storage);
        set({ slots: listSaves(deps.storage) });
      },
      enterCity: async (city) => {
        try {
          const bytes = await deps.loadScript(city);
          const host = hostEnter(get().save!, city, bytes);
          set({ host, npcs: npcNames(host.script), error: null });
          show(advance(host, rand));
        } catch (e) {
          set({ error: e instanceof Error ? e.message : String(e), view: 'map' });
        }
      },
      reply: (r) => {
        const { host } = get();
        if (host) show(advance(host, rand, r));
      },
      finishBattle: (state, events) => {
        const { save, battle } = get();
        if (!save || !battle) return;
        const human = battle.lent !== null ? decks[battle.lent].cards : save.decks[save.selectedDeck].cards;
        const result =
          battle.deck === TUTORIAL_DECK
            ? null
            : applyComResult(save, { state, events, rival: decks[battle.deck], deckUsed: human }, rand);
        set({ view: 'result', result, won: state.winner === 0, save: { ...save } });
      },
      closeResult: () => {
        const { host } = get();
        deps.session.getState().reset();
        set({ result: null, battle: null });
        if (host) show(advance(host, rand, { kind: 'battleResult', win: get().won }));
      },
      saveNow: () => persist(),
      toSlots: () => set({ view: 'slots', slot: null, save: null, host: null, request: null, slots: listSaves(deps.storage) }),
    };
  });
}
