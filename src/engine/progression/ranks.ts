/**
 * Ranks, PLAYER'S DATA percentages and the final title
 * (docs/research/progresion/02-resultados-y-guardado.md §4).
 *   SLUS 0x8002CC44  each rank climbs step by step from the current one (it never goes down)
 *   SAISEG 0x801E16B0  percentages in tenths: story points / 166, cards obtained / 301, Digi-Parts / 128
 *   ENDSEG 0x801DE80C  "You're …!" title from the rounds won per specialty and the attacks used
 */
import { cards } from '../cards/db';
import { SPECIALTY_CODE } from '../ai/view';
import { copiesOf, FLAG, type Collection } from './collection';
import { progression } from './tables';

/** Code immediates of 0x8002CC44. */
export const TAMER_WINS = [10, 25, 50, 100, 200, 300, 500];
export const BATTLE2P_WINS = [10, 20, 30, 40, 60, 80, 100];
export const COLLECTOR_COPIES = [100, 200];
export const STORY_POINTS = 166;

export interface Ranks {
  tamer: number;
  collector: number;
  battle2p: number;
}

/** Copies of ids 0–171 and 191–300, and categories (5 specialties of Digimon 0–171, then all Options) with ≥ 1 copy of every card. */
export function collectorStats(c: Collection): { copies: number; complete: number } {
  const owned = [0, 0, 0, 0, 0, 0];
  let copies = 0;
  for (const card of cards) {
    if (card.id >= 172 && card.id <= 190) continue;
    const n = copiesOf(c, card.id);
    if (n === 0) continue;
    copies += n;
    owned[card.kind === 'digimon' ? SPECIALTY_CODE[card.specialty] : 5]++;
  }
  const complete = owned.filter((n, i) => n === progression.ranks.categorySizes[i]).length;
  return { copies, complete };
}

function climb(current: number, steps: boolean[]): number {
  let r = current;
  while (r < steps.length && steps[r]) r++;
  return r;
}

export function updateRanks(r: Ranks, s: { winsCom: number; wins2p: number; collection: Collection; traded: boolean }): Ranks {
  const { copies, complete } = collectorStats(s.collection);
  return {
    tamer: climb(r.tamer, TAMER_WINS.map((w) => s.winsCom >= w)),
    battle2p: climb(r.battle2p, BATTLE2P_WINS.map((w) => s.wins2p >= w)),
    collector: climb(r.collector, [copies >= COLLECTOR_COPIES[0], copies >= COLLECTOR_COPIES[1], complete >= 1, complete >= 3, complete >= 5, complete === 6, !s.traded]),
  };
}

export function rankTitles(r: Ranks): { tamer: string; collector: string; battle2p: string } {
  const t = progression.ranks;
  return { tamer: t.tamer[r.tamer], collector: t.collector[r.collector], battle2p: t.battle2p[r.battle2p] };
}

/** Tenths of a percent, as shown with "%3d.%1d%%". */
export function percentages(s: { storyPoints: number; collection: Collection; ownedParts: boolean[] }): { game: number; cards: number; parts: number } {
  const obtained = s.collection.flags.filter((f) => f & FLAG.obtained).length;
  return {
    game: Math.floor((s.storyPoints * 1000) / STORY_POINTS),
    cards: Math.floor((obtained * 1000) / cards.length),
    parts: Math.floor((s.ownedParts.filter(Boolean).length * 1000) / 128),
  };
}

/** Pair titles 6..15 for specialties a < b, in the order the table lists them. */
const PAIRS: [number, number][] = [[0, 1], [0, 2], [1, 2], [0, 3], [1, 3], [2, 3], [0, 4], [1, 4], [2, 4], [3, 4]];

/**
 * ENDSEG 0x801DE80C. `rounds[e]` = rounds won by Digimon of specialty e (save+0x11B6 summed);
 * `attacks[k]` = times ◯ △ ✕ were used (save+0x36). 🟡 Ties keep specialty/attack order.
 */
export function finalTitle(rounds: number[], attacks: number[]): string {
  const o = [0, 1, 2, 3, 4].sort((a, b) => rounds[b] - rounds[a]);
  const top = rounds[o[0]];
  const atLeast = (e: number, pct: number) => rounds[e] * 100 >= pct * top;
  let i: number;
  if (atLeast(o[4], 90)) i = 0;
  else if (atLeast(o[4], 80)) i = 1;
  else if (atLeast(o[3], 90)) i = 2;
  else if (atLeast(o[3], 80)) i = 3;
  else if (atLeast(o[2], 95)) i = 4;
  else if (atLeast(o[2], 90)) i = 5;
  else if (atLeast(o[1], 90)) {
    const pair = [o[0], o[1]].sort((a, b) => a - b);
    i = 6 + PAIRS.findIndex(([a, b]) => a === pair[0] && b === pair[1]);
  } else {
    const t = [0, 1, 2].sort((a, b) => attacks[b] - attacks[a]);
    i = attacks[t[1]] * 10 > attacks[t[0]] * 9 ? 16 + o[0] : 21 + 5 * t[0] + o[0];
  }
  return progression.finalTitles[i];
}
