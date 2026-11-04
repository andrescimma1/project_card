/**
 * Player's Complete Stats — ENDSEG 0x801DF47C. One scrolling page; its sections, top to bottom:
 *   "Cards you own."                 per card: No., name, copies, "Received by Trading." (0x08); Digimon also
 *                                    rounds won/lost (+0x11B6/+0x1334) and "Max ◯△✕ Attack Power" (+0xD3C);
 *                                    cards never obtained show "?????????????"
 *   "Wins & Losses per Event Deck"   every DECK2 deck with +0xAC0 ≠ 0: "<name> Deck", wins (b0-13) / +0xBFE
 *   "Wins & Losses per Com"          COM decks with +0x888 ≠ 0, by owner: +0x888 / +0x9A4
 *   'Number of "Bonuses"'            +0x848, all except entry 30 (Lucky Name, never granted)
 *   "Trading Info." / "Fusion Info." +0x4E, +0x4C / +0x52, +0x50, +0x54
 *   "Player's Attack Rate"           +0x36: use × 1000 / total
 *   "Speciality Data of Each Card"   0x801DE80C: per specialty Σ rounds won/lost and copies of cards 0..190,
 *                                    ranked by rounds won (bubble sort, ties keep the order), plus "All Cards"
 *   results, saves (+0x0D), the three titles and "You're "<title>"!"
 */
import { cards } from '../cards/db';
import { decks } from '../cards/decks';
import type { Specialty } from '../cards/types';
import { copiesOf, FLAG } from './collection';
import { finalTitle, rankTitles } from './ranks';
import type { SaveData } from './save';
import { progression } from './tables';

const SPECIALTIES: Specialty[] = ['fire', 'ice', 'nature', 'darkness', 'rare'];
const LUCKY_NAME = 30;
const COM_DECKS = 142;

export interface CardStat {
  id: number;
  known: boolean;
  copies: number;
  traded: boolean;
  digimon: { wins: number; losses: number; max: number[] } | null;
}

export interface SpecialtyRow {
  specialty: Specialty;
  wins: number;
  losses: number;
  cards: number;
}

export interface CompleteStats {
  cards: CardStat[];
  eventDecks: { index: number; name: string; wins: number; losses: number }[];
  comDecks: { index: number; owner: string; wins: number; losses: number }[];
  bonuses: { id: number; name: string; times: number }[];
  trading: { given: number; received: number };
  fusion: { used: number; fused: number; mutations: number };
  /** Tenths of a percent for ◯ △ ✕. */
  attackRate: number[];
  specialty: { rows: SpecialtyRow[]; all: Omit<SpecialtyRow, 'specialty'> };
  results: { com: [number, number]; twoP: [number, number]; saves: number };
  titles: { tamer: string; collector: string; battle2p: string };
  finalTitle: string;
}

export function completeStats(save: SaveData): CompleteStats {
  const c = save.collection;
  const cardStats: CardStat[] = cards.map((card) => {
    const known = (c.flags[card.id] & FLAG.obtained) !== 0;
    return {
      id: card.id,
      known,
      copies: copiesOf(c, card.id),
      traded: (c.flags[card.id] & FLAG.traded) !== 0,
      digimon: known && card.kind === 'digimon' ? { wins: save.roundsWon[card.id], losses: save.roundsLost[card.id], max: [...save.maxAttack[card.id]] } : null,
    };
  });

  const eventDecks = Object.entries(save.eventRecords)
    .map(([k, r]) => ({ index: Number(k), r }))
    .filter(({ r }) => r.known || r.base || r.wins > 0)
    .sort((a, b) => a.index - b.index)
    .map(({ index, r }) => ({ index, name: decks[index].name, wins: r.wins, losses: r.losses }));

  const comDecks = Object.entries(save.deckRecords)
    .map(([k, r]) => ({ index: Number(k), owner: decks[Number(k)].owner, wins: r.wins, losses: r.losses }))
    .filter((d) => d.index < COM_DECKS && d.wins > 0)
    .sort((a, b) => a.index - b.index);

  const total = save.attackUse.reduce((a, b) => a + b, 0);
  const attackRate = save.attackUse.map((n) => (total ? Math.trunc((n * 1000) / total) : 0));

  const per = SPECIALTIES.map((specialty) => ({ specialty, wins: 0, losses: 0, cards: 0 }));
  for (let id = 0; id <= 190; id++) {
    const card = cards[id];
    if (card.kind !== 'digimon') continue;
    const row = per[SPECIALTIES.indexOf(card.specialty)];
    row.wins += save.roundsWon[id];
    row.losses += save.roundsLost[id];
    row.cards += copiesOf(c, id);
  }
  const all = per.reduce((t, r) => ({ wins: t.wins + r.wins, losses: t.losses + r.losses, cards: t.cards + r.cards }), { wins: 0, losses: 0, cards: 0 });
  const rows = [...per].sort((a, b) => b.wins - a.wins); // stable, like the bubble sort at 0x801DE9C0

  return {
    cards: cardStats,
    eventDecks,
    comDecks,
    bonuses: progression.bonuses.filter((b) => b.id !== LUCKY_NAME).map((b) => ({ id: b.id, name: b.name, times: save.bonusCounts[b.id] })),
    trading: { given: save.trades.given, received: save.trades.received },
    fusion: { used: save.fusion.used, fused: save.fusion.fused, mutations: save.fusion.mutations },
    attackRate,
    specialty: { rows, all },
    results: { com: [save.winsCom, save.lossesCom], twoP: [save.wins2p, save.losses2p], saves: save.saveCount },
    titles: rankTitles(save.ranks),
    finalTitle: finalTitle(per.map((r) => r.wins), save.attackUse),
  };
}
