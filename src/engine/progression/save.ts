/**
 * Story-mode save (one player block, docs/research/progresion/02-resultados-y-guardado.md §5) and what
 * happens after a battle against the CPU (SLUS 0x8003F3C0..0x8003F990):
 *   records → EXP screen (KAWSEG 0x801F4A24, if a partner was in the deck, also on a loss)
 *   → Prize Pack (KAWSEG 0x801F5E50, wins only) → ranks (SLUS 0x8002CC44)
 */
import { decks as originalDecks } from '../cards/decks';
import type { OriginalDeck } from '../cards/decodeDecks';
import { newPartnerSlot, PARTNER_IDS, partnerBoosts } from '../game/partner';
import type { GameEvent, GameState } from '../game/types';
import { evaluateBonuses, type BonusResult } from './bonuses';
import { addCard, newCollection, type Collection } from './collection';
import { openPack } from './packs';
import { battleExpGain, gainExp, MAX_LEVEL, type PartnerProgress } from './partnerExp';
import { updateRanks, type Ranks } from './ranks';
import { progression } from './tables';

type Rand = { next(): number };
const CAP = 999;

export interface PartnerSave extends PartnerProgress {
  /** Armor card id received for each Digi-Egg index (0 = not yet), slot +0x28F. */
  eggs: number[];
}

export interface SavedDeckSlot {
  name: string;
  cards: number[];
  wins: number;
  losses: number;
}

export interface SaveData {
  version: 1;
  name: string;
  winsCom: number;
  lossesCom: number;
  wins2p: number;
  losses2p: number;
  ranks: Ranks;
  /** +0x28 bit 11: a trade was ever made (blocks Legendary Collector). */
  traded: boolean;
  /** +0x28 bit 10: trading unlocked by the story. */
  tradeEnabled: boolean;
  collection: Collection;
  /** +0x3C: 128 Digi-Parts owned (shared by all partners). */
  ownedParts: boolean[];
  partners: PartnerSave[];
  /** 3 decks (+0x2438); an empty card list is an unused slot. */
  decks: SavedDeckSlot[];
  selectedDeck: number;
  /** +0x848: times each EXP bonus was earned. */
  bonusCounts: number[];
  /** +0x888 / +0x9A4: record against each DECK2 deck. */
  deckRecords: Record<number, { wins: number; losses: number }>;
  /** +0x11B6 / +0x1334: rounds won / lost by each Digimon card (0..190). */
  roundsWon: number[];
  roundsLost: number[];
  /** +0x36: times ◯ △ ✕ were used. */
  attackUse: [number, number, number];
  /** Story script state: flags (+0x23FC, 12 × u32), counters (+0x242C), points (+0x14), current city (+0x0E). */
  story: { flags: number[]; counters: number[]; points: number; city: number };
  /** +0x50/+0x52/+0x54: fusion statistics. */
  fusion: { fused: number; used: number; mutations: number };
  /** +0x2768: the 3 cards of the last pack. */
  lastPack: number[];
}

/** Starter partners offered at the start (OPENSEG 0x801DE8B8): Veemon, Hawkmon, Armadillomon. */
export const STARTER_PARTNERS = [175, 182, 190];
/** Their decks: DECK2 records 142 / 143 / 144 (Red, Green, Yellow). */
const STARTER_DECK = [142, 143, 144];

export function newGame(choice: 0 | 1 | 2, rand: Rand): SaveData {
  const id = STARTER_PARTNERS[choice];
  const deck = originalDecks[STARTER_DECK[choice]];
  const save: SaveData = {
    version: 1,
    name: 'Player',
    winsCom: 0,
    lossesCom: 0,
    wins2p: 0,
    losses2p: 0,
    ranks: { tamer: 0, collector: 0, battle2p: 0 },
    traded: false,
    tradeEnabled: false,
    collection: newCollection(),
    ownedParts: Array(128).fill(false),
    partners: [{ slot: newPartnerSlot(id), exp: 0, eggs: [0, 0, 0] }],
    decks: [{ name: deck.name, cards: [...deck.cards], wins: 0, losses: 0 }, emptyDeck(), emptyDeck()],
    selectedDeck: 0,
    bonusCounts: Array(32).fill(0),
    deckRecords: {},
    roundsWon: Array(191).fill(0),
    roundsLost: Array(191).fill(0),
    attackUse: [0, 0, 0],
    story: { flags: Array(12).fill(0), counters: Array(9).fill(0), points: 0, city: 0 },
    fusion: { fused: 0, used: 0, mutations: 0 },
    lastPack: [],
  };
  // 🟡 the starting Digi-Part is given (owned); whether it starts equipped is not traced
  save.ownedParts[progression.partners.initialPart[PARTNER_IDS.indexOf(id)]] = true;
  save.collection.flags[id] |= 0xf0;
  for (const card of deck.cards) if (!PARTNER_IDS.includes(card)) addCard(save.collection, card, 1, rand);
  for (const [a, b] of progression.partners.starterPairs[choice]) addCard(save.collection, rand.next() % 2 === 0 ? a : b, 1, rand);
  save.ranks = updateRanks(save.ranks, { winsCom: 0, wins2p: 0, collection: save.collection, traded: false });
  return save;
}

function emptyDeck(): SavedDeckSlot {
  return { name: '', cards: [], wins: 0, losses: 0 };
}

export interface ComResult {
  win: boolean;
  bonuses: BonusResult;
  /** EXP added to each partner slot (0 if it was not in the deck). */
  expGained: number[];
  levelsGained: number[];
  learned: number[];
  /** Prize Pack card ids (empty on a loss) and the result of adding each one (copies, or < 0). */
  pack: number[];
  packResults: number[];
  ranksBefore: Ranks;
}

/** Apply the end of a battle against the CPU to the save (player 0 is the save owner). */
export function applyComResult(
  save: SaveData,
  m: { state: GameState; events: GameEvent[]; rival: OriginalDeck; deckUsed: number[] },
  rand: Rand,
): ComResult {
  const win = m.state.winner === 0;
  const ranksBefore = { ...save.ranks };
  const rec = (save.deckRecords[m.rival.index] ??= { wins: 0, losses: 0 });
  const own = save.decks[save.selectedDeck];
  if (win) {
    rec.wins = Math.min(rec.wins + 1, CAP);
    if (own) own.wins = Math.min(own.wins + 1, CAP);
    save.winsCom = Math.min(save.winsCom + 1, CAP);
  } else {
    rec.losses = Math.min(rec.losses + 1, CAP);
    if (own) own.losses = Math.min(own.losses + 1, CAP);
    save.lossesCom = Math.min(save.lossesCom + 1, CAP);
  }

  // EXP screen
  const bonuses = evaluateBonuses(m.state, 0, m.rival.exp);
  for (const b of bonuses.granted) save.bonusCounts[b.id] = Math.min(save.bonusCounts[b.id] + 1, CAP);
  const expGained: number[] = [];
  const levelsGained: number[] = [];
  const learned: number[] = [];
  for (const p of save.partners) {
    const inDeck = m.deckUsed.includes(p.slot.id) || (p.slot.armorId !== null && m.deckUsed.includes(p.slot.armorId));
    if (!inDeck || p.slot.level >= MAX_LEVEL) {
      expGained.push(0);
      levelsGained.push(0);
      continue;
    }
    const gain = battleExpGain(bonuses.exp, partnerBoosts(p.slot).expPercent);
    const r = gainExp(p, gain, save.ownedParts, rand);
    expGained.push(gain);
    levelsGained.push(r.levelsGained);
    learned.push(...r.learned);
  }

  // Prize Pack
  let pack: number[] = [];
  let packResults: number[] = [];
  if (win) {
    const rare = save.partners.reduce((s, p) => s + partnerBoosts(p.slot).rarePercent, 0);
    pack = openPack(m.rival.prizePack, rare, rand);
    packResults = pack.map((id) => addCard(save.collection, id, 1, rand));
    save.lastPack = pack;
  }

  // per-card rounds (KO 0x801ED0A0) and attack use (🟡 counted at each reveal)
  let lastHit: Extract<GameEvent, { type: 'hit' }> | null = null;
  for (const e of m.events) {
    if (e.type === 'hit') lastHit = e;
    if (e.type === 'reveal') save.attackUse[['circle', 'triangle', 'cross'].indexOf(e.attacks[0])]++;
    if (e.type === 'ko') {
      const loserId = m.state.players[e.player].cards[e.card];
      if (e.player === 0 && loserId <= 190) save.roundsLost[loserId]++;
      if (lastHit && lastHit.attacker === 0 && e.player === 1) {
        const id = m.state.players[0].cards[lastHit.attackerCard];
        if (id <= 190) save.roundsWon[id]++;
      }
    }
  }

  save.ranks = updateRanks(save.ranks, { winsCom: save.winsCom, wins2p: save.wins2p, collection: save.collection, traded: save.traded });
  return { win, bonuses, expGained, levelsGained, learned, pack, packResults, ranksBefore };
}
