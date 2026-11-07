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
import { applyComResult, newGame as createSave, STARTER_DECK, type ComResult, type SaveData } from '../engine/progression/save';
import { ARMOR_IDS, availableCopies, chooseEgg, equipPart, unequipPart } from '../engine/progression/storyDecks';
import { fuseCards, partnerFusion, visitShop } from '../engine/progression/fusion';
import { trade, tradeBlocked } from '../engine/progression/trade';
import { apply2pResult } from '../engine/progression/twoPlayer';
import { markTutorial, refreshBaseDecks } from '../engine/progression/records';
import { autoDeck, type AutoDeckOptions } from '../engine/progression/autoDeck';
import { advance, enterCity as hostEnter, type CityHost, type StoryRequest, type StoryResponse } from '../story/cityHost';
import { npcNames } from '../story/present';
import { deckLabel, ownerName } from '../story/own/decks';
import { deleteSave, listSaves, loadSave, writeSave, type SaveSummary } from './saveSlots';
import type { SessionState } from './session';
import { m } from '../i18n';
import { localizeMessage } from '../i18n/engineMessages';

type KV = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export type StoryView = 'slots' | 'newGame' | 'map' | 'city' | 'battle' | 'result' | 'trade' | 'duel';

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
  /** Level limit of the Fusion Shop being visited (CMD11.4). */
  shopLevel: number;
  /** The two save slots being traded between (player 1, player 2). */
  trade: { slots: [number, number]; saves: [SaveData, SaveData] } | null;
  /** "2 Player Battle" between two save slots; `winner` once it is over. */
  duel: { slots: [number, number]; saves: [SaveData, SaveData]; winner: number | null } | null;
  error: string | null;
  refreshSlots: () => void;
  chooseNewGame: (slot: number) => void;
  /** Start a game in `slot`; the name is checked like NAME ENTRY (OPENSEG 0x801E7EC4). Error message, or null. */
  newGame: (slot: number, partner: 0 | 1 | 2, name?: string) => Promise<string | null>;
  continueGame: (slot: number) => void;
  deleteSlot: (slot: number) => void;
  enterCity: (city: number) => Promise<void>;
  reply: (r: StoryResponse) => void;
  finishBattle: (state: GameState, events: GameEvent[]) => void;
  closeResult: () => void;
  saveNow: () => void;
  toSlots: () => void;
  /** Store deck slot `k` (story rules, SUBSEG 0x801ECE70). Error message, or null. */
  saveDeck: (k: number, name: string, cards: number[]) => string | null;
  selectDeck: (k: number) => string | null;
  partnerAction: (a: PartnerAction) => string | null;
  fuse: (a: number, b: number) => ReturnType<typeof fuseCards>;
  autoDeck: (o: AutoDeckOptions) => number[];
  /** Known decks that can start a new deck (SUBSEG 0x801E11D4, after 0x800461C0). */
  baseDecks: () => { index: number; name: string; owner: string; cards: number[] }[];
  /** Leave the Complete Stats (ENDSEG 0x801E0B30 sets +0x28 bit 12) and go back to the script. */
  closeStats: () => void;
  openDuel: () => void;
  /** Start a 2 Player Battle (OPENSEG "2 Player Battle"). Error message, or null. */
  startDuel: (a: number, b: number) => string | null;
  /** SLUS 0x80041A1C: both saves keep the result. */
  finishDuel: (state: GameState, events: GameEvent[]) => void;
  closeDuel: () => void;
  openTrade: () => void;
  pickTrade: (a: number, b: number) => string | null;
  doTrade: (giveA: number[], giveB: number[]) => string | null;
  partnerFuse: (k: number, b: number) => ReturnType<typeof partnerFusion>;
}

export type PartnerAction =
  | { kind: 'equip'; partner: number; part: number }
  | { kind: 'unequip'; partner: number; part: number }
  | { kind: 'egg'; partner: number; egg: number };

/** Why a whole deck cannot be stored, or null. */
function deckError(save: SaveData, ids: number[]): string | null {
  const S = m().game.story;
  if (ids.length > 30) return S.maxCards;
  if (ids.some((id) => ARMOR_IDS.includes(id))) return localizeMessage('Las cartas Armor solo aparecen por Digi-Egg.');
  for (const id of new Set(ids)) {
    const n = ids.filter((x) => x === id).length;
    if (n > 4) return S.maxCopiesPerDeck(4);
    if (n > availableCopies(save, id)) return S.youOnlyHave(availableCopies(save, id));
  }
  return null;
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
  if (!res.ok) throw new Error(m().game.story.noScripts);
  return new Uint8Array(await res.arrayBuffer());
}

/** NAME ENTRY: 12 characters (the cursor stops at 11, OPENSEG 0x801E7D24). 🟡 "*" (text codes) is left out. */
export function cleanName(raw: string): string {
  return raw.replace(/[^ -~]|\*/g, '').slice(0, 12).trim();
}

/** DECK2 index of the tutorial deck: the game keeps no record of that battle (ctx+0x81F). */
const TUTORIAL_DECK = 0;

export function createStoryStore(deps: StoryDeps) {
  const rand = psxRand(deps.seed);
  return createStore<StoryState>((set, get) => {
    /** Apply a change to the save; the city host keeps working on the same object. */
    const update = <T,>(fn: (save: SaveData) => T): T => {
      const save = get().save!;
      const r = fn(save);
      const next = { ...save };
      const { host } = get();
      if (host) host.save = next;
      set({ save: next });
      return r;
    };

    /** Write the slot; `counted` = a save the player made (OPENSEG 0x801EF6C4: +0x0D up to 255). */
    const persist = (counted = false) => {
      if (counted) update((s) => void (s.saveCount = Math.min((s.saveCount ?? 0) + 1, 255)));
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
        persist(true);
        return show(advance(host, rand, { kind: 'ack' }));
      }
      if (req.kind === 'battle') return startBattle(req.deck, req.lent);
      if (req.kind === 'screen' && req.screen === 'fusion') set({ shopLevel: update((s) => visitShop(s, req.arg)) });
      set({ view: 'city', request: req });
    };

    const startBattle = (deck: number, lent: number | null) => {
      const save = get().save!;
      const human = lent !== null ? decks[lent].cards : save.decks[save.selectedDeck]?.cards ?? [];
      if (validateDeck(human).length) {
        set({ error: m().game.story.invalidActiveDeck(m().game.story.activeDeckMenu), view: 'city' });
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
        names: [save.name, ownerName(rival.owner)],
        deckNames: [lent !== null ? deckLabel(lent) : (save.decks[save.selectedDeck]?.name ?? ''), deckLabel(rival.index)],
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
      shopLevel: 0,
      trade: null,
      duel: null,
      error: null,
      refreshSlots: () => set({ slots: listSaves(deps.storage) }),
      chooseNewGame: (slot) => set({ view: 'newGame', slot }),
      newGame: async (slot, partner, name = 'Player') => {
        const clean = cleanName(name);
        if (!clean) return m().game.story.nameRequired;
        const save = createSave(partner, rand);
        save.name = clean;
        save.decks[0].name = deckLabel(STARTER_DECK[partner]);
        set({ slot, save });
        persist();
        await get().enterCity(0); // the game starts in Beginner City
        return null;
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
            : applyComResult(save, { state, events, rival: decks[battle.deck], deckUsed: human, lent: battle.lent }, rand);
        if (battle.deck === TUTORIAL_DECK) markTutorial(save);
        update(() => undefined);
        set({ view: 'result', result, won: state.winner === 0 });
      },
      closeResult: () => {
        const { host } = get();
        deps.session.getState().reset();
        set({ result: null, battle: null });
        if (host) show(advance(host, rand, { kind: 'battleResult', win: get().won }));
      },
      saveNow: () => persist(true),
      saveDeck: (k, name, ids) => {
        const save = get().save!;
        const why = deckError(save, ids) ?? (k === save.selectedDeck && ids.length !== 30 ? m().game.story.activeDeck30 : null);
        if (why) return why;
        // DECK NAME entry: 12 characters (the cursor stops at 11, SUBSEG 0x801E0A60)
        update((s) => {
          s.decks = s.decks.map((d, i) => (i === k ? { ...d, name: cleanName(name) || m().game.deck.defaultName(k + 1), cards: [...ids] } : d));
        });
        return null;
      },
      selectDeck: (k) => {
        if (get().save!.decks[k]?.cards.length !== 30) return m().game.story.only30;
        update((s) => {
          s.selectedDeck = k;
        });
        return null;
      },
      partnerAction: (a) =>
        update((s) => {
          if (a.kind === 'equip') return localizeMessage(equipPart(s, a.partner, a.part));
          if (a.kind === 'unequip') return unequipPart(s, a.partner, a.part), null;
          return localizeMessage(chooseEgg(s, a.partner, a.egg));
        }),
      fuse: (a, b) => {
        const r = update((s) => fuseCards(s, a, b, get().shopLevel, rand));
        return 'error' in r && typeof r.error === 'string' ? { ...r, error: localizeMessage(r.error) } : r;
      },
      autoDeck: (o) => autoDeck(get().save!, o, rand),
      baseDecks: () =>
        update((s) => {
          refreshBaseDecks(s);
          return Object.entries(s.eventRecords)
            .filter(([, r]) => r.base)
            .map(([k]) => decks[Number(k)])
            .map((d) => ({ index: d.index, name: d.name, owner: d.owner, cards: [...d.cards] }));
        }),
      openDuel: () => set({ view: 'duel', duel: null, slots: listSaves(deps.storage) }),
      startDuel: (i, j) => {
        if (i === j) return m().game.story.twoDifferentSaves;
        const a = loadSave(i, deps.storage);
        const b = loadSave(j, deps.storage);
        if (!a || !b) return m().game.story.twoDifferentSaves;
        for (const [k, s] of [a, b].entries()) {
          const deck = s.decks[s.selectedDeck]?.cards ?? [];
          if (validateDeck(deck).length) return m().game.story.duelInvalidDeck(s.name, k + 1);
        }
        const seed = rand.next() * 65536 + rand.next();
        deps.session.getState().start({
          human: a.decks[a.selectedDeck].cards,
          cpu: b.decks[b.selectedDeck].cards,
          seed,
          humanFirst: seed % 2 === 0, // 🟡 who starts is not traced
          partners: [a.partners.map((p) => p.slot), b.partners.map((p) => p.slot)],
          twoPlayer: true,
          names: [a.name, b.name],
          deckNames: [a.decks[a.selectedDeck].name, b.decks[b.selectedDeck].name],
        });
        set({ view: 'duel', duel: { slots: [i, j], saves: [a, b], winner: null }, error: null });
        return null;
      },
      finishDuel: (state, events) => {
        const d = get().duel;
        if (!d) return;
        const [a, b] = d.saves;
        apply2pResult([a, b], { state, events });
        writeSave(d.slots[0], a, deps.storage);
        writeSave(d.slots[1], b, deps.storage);
        set({ duel: { ...d, saves: [{ ...a }, { ...b }], winner: state.winner }, slots: listSaves(deps.storage) });
      },
      closeDuel: () => {
        deps.session.getState().reset();
        set({ view: 'slots', duel: null, slots: listSaves(deps.storage) });
      },
      closeStats: () => {
        update((s) => void (s.statsViewed = true));
        const { host, request } = get();
        if (host && request?.kind === 'screen' && request.screen === 'ending') show(advance(host, rand, { kind: 'ack' }));
      },
      partnerFuse: (k, b) => {
        const r = update((s) => partnerFusion(s, k, b, rand, get().shopLevel));
        return 'error' in r && typeof r.error === 'string' ? { ...r, error: localizeMessage(r.error) } : r;
      },
      openTrade: () => set({ view: 'trade', trade: null, slots: listSaves(deps.storage) }),
      pickTrade: (i, j) => {
        const a = loadSave(i, deps.storage);
        const b = loadSave(j, deps.storage);
        if (!a || !b || i === j) return m().game.story.twoDifferentSaves;
        const why = tradeBlocked(a, b);
        if (why) return localizeMessage(why);
        set({ trade: { slots: [i, j], saves: [a, b] } });
        return null;
      },
      doTrade: (giveA, giveB) => {
        const t = get().trade;
        if (!t) return m().game.story.twoSaves;
        const [a, b] = t.saves;
        const why = trade(a, b, giveA, giveB);
        if (why) return localizeMessage(why);
        writeSave(t.slots[0], a, deps.storage);
        writeSave(t.slots[1], b, deps.storage);
        set({ trade: { slots: t.slots, saves: [{ ...a }, { ...b }] }, slots: listSaves(deps.storage) });
        return null;
      },
      toSlots: () => set({ view: 'slots', slot: null, save: null, host: null, request: null, slots: listSaves(deps.storage) }),
    };
  });
}
