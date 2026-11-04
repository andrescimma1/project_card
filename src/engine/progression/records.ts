/**
 * Records kept after each battle and per DECK2 deck (SLUS 0x8003F72C..0x8003F990):
 *   0x800471F4  repeated rival decks share one record (117, 121-127 → 114; 128-131 → 119; 132-139, 141 from
 *               the byte table SLUS 0x8006E50C; the rest unchanged)
 *   save+0xAC0  per deck: b15 known (faced or used), b14 Base Deck (0x800461C0), b0-13 wins with a loaned deck
 *   save+0xBFE  losses with a loaned deck
 *   save+0xD3C  highest ◯△✕ power reached by each Digimon (KAWSEG 0x801EA5F4, player 0 only)
 */
import { decks } from '../cards/decks';
import type { GameEvent, GameState, PlayerId } from '../game/types';
import { copiesOf } from './collection';
import type { SaveData } from './save';

const CAP = 999;
const SLOT_INDEX = { circle: 0, triangle: 1, cross: 2 } as const;
const TABLE_132 = [85, 92, 90, 82, 88, 79, 13, 0, 48, 0]; // SLUS 0x8006E50C, for 132..141 (140 is not looked up)

export interface DeckRecord {
  /** b15: the deck has been faced or used. */
  known: boolean;
  /** b14: every card of it was owned at some point, so it can start a new deck. */
  base: boolean;
  wins: number;
  losses: number;
}

export function recordIndex(deck: number): number {
  if (deck === 117 || (deck >= 121 && deck <= 127)) return 114;
  if (deck >= 128 && deck <= 131) return 119;
  if ((deck >= 132 && deck <= 139) || deck === 141) return TABLE_132[deck - 132];
  return deck;
}

const eventRecord = (save: SaveData, i: number): DeckRecord => (save.eventRecords[i] ??= { known: false, base: false, wins: 0, losses: 0 });

/**
 * 0x8003F770..0x8003F98C for player 0: a loaned deck records the result in +0xAC0/+0xBFE, otherwise the
 * deck slot in use does; against the CPU the rival deck becomes known and its record counts the result.
 */
export function applyBattleRecords(save: SaveData, b: { win: boolean; lent: number | null; rival: number | null }): void {
  if (b.lent !== null) {
    const r = eventRecord(save, recordIndex(b.lent));
    r.known = true;
    if (b.win) r.wins = Math.min(r.wins + 1, CAP);
    else r.losses = Math.min(r.losses + 1, CAP);
  } else {
    const own = save.decks[save.selectedDeck];
    if (own && b.win) own.wins = Math.min(own.wins + 1, CAP);
    else if (own) own.losses = Math.min(own.losses + 1, CAP);
  }
  if (b.rival === null) return;
  const m = recordIndex(b.rival);
  eventRecord(save, m).known = true;
  const rec = (save.deckRecords[m] ??= { wins: 0, losses: 0 });
  if (b.win) rec.wins = Math.min(rec.wins + 1, CAP);
  else rec.losses = Math.min(rec.losses + 1, CAP);
}

/** The tutorial (ctx+0x81F set) keeps no record, but decks 0 and 158 become known (0x8003F744). */
export function markTutorial(save: SaveData): void {
  eventRecord(save, 0).known = true;
  eventRecord(save, 158).known = true;
}

/** 0x800461C0: a known deck whose 30 cards are all owned becomes a Base Deck (never cleared). */
export function refreshBaseDecks(save: SaveData): void {
  for (const [key, r] of Object.entries(save.eventRecords)) {
    const deck = decks[Number(key)];
    if (!r.known || r.base || !deck) continue;
    const need = new Map<number, number>();
    for (const id of deck.cards) need.set(id, (need.get(id) ?? 0) + 1);
    if ([...need].every(([id, n]) => copiesOf(save.collection, id) >= n)) r.base = true;
  }
}

/** KAWSEG 0x801EA5F4: the power of each hit by player 0 is kept if it is the highest for that Digimon and attack. */
export function recordMaxAttack(save: SaveData, state: GameState, events: GameEvent[]): void {
  for (const e of events) {
    if (e.type !== 'hit' || e.attacker !== 0) continue;
    const id = state.players[0].cards[e.attackerCard];
    if (id === undefined || id > 190) continue;
    const k = SLOT_INDEX[e.slot];
    if (save.maxAttack[id][k] < e.damage) save.maxAttack[id][k] = e.damage;
  }
}

/**
 * KAWSEG 0x801ED0A0: at each KO the winner's Digimon gets a round won (+0x11B6) in the winner's save and the
 * loser's a round lost (+0x1334) in the loser's, up to 999. Here: the part that belongs to player `p`.
 */
export function recordRounds(save: SaveData, p: PlayerId, state: GameState, events: GameEvent[]): void {
  const active: (number | null)[] = [null, null];
  for (const e of events) {
    if (e.type === 'hit') {
      active[e.attacker] = e.attackerCard;
      active[e.defender] = e.defenderCard;
    }
    if (e.type !== 'ko') continue;
    const ref = e.player === p ? e.card : active[p];
    const id = ref === null ? undefined : state.players[p].cards[ref];
    if (id === undefined || id > 190) continue;
    const list = e.player === p ? save.roundsLost : save.roundsWon;
    list[id] = Math.min(list[id] + 1, CAP);
  }
}

/** Times ◯ △ ✕ were used (+0x36). 🟡 counted at each reveal of player `p`'s attack. */
export function recordAttackUse(save: SaveData, p: PlayerId, events: GameEvent[]): void {
  for (const e of events) if (e.type === 'reveal') save.attackUse[SLOT_INDEX[e.attacks[p]]]++;
}
