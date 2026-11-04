/**
 * CPU AI — decision code 7 (states 26/29): which support to use. KAWSEG 0x801E5710, run right
 * after the evaluation 0x801E0CCC. It reads the opponent's hand (when the opponent has not chosen
 * yet), the opponent's face-down support (when it has), and the top card of the opponent's deck.
 */
import { cardOf, SLOT_CODE } from '../game/effects';
import type { GameState, PlayerId, PlayerState, SupportPick } from '../game/types';
import { count, top } from '../game/zones';
import { evaluate, supportCandidate, type EvalRow } from './evaluate';
import { DISRUPTORS, HEALERS, inTable, VOIDERS, type AiCtx } from './view';

/**
 * Value the routine writes to ctx+0x804: -2 gamble with the top deck card, -1 none, a hand card ref;
 * or 'unwritten' when it returns without writing (Q3).
 */
export type SupportAnswer = number | 'unwritten';

interface Rec {
  sumMine: number;
  sumOpp: number;
  ko: number;
  win: number;
  lose: number;
}

const other = (x: PlayerId): PlayerId => (x === 0 ? 1 : 0);

/**
 * Selection index 4 (+0x1BD) is a snapshot of the top card of the Online Deck, taken by the human's
 * selection screen. 🟡 Modelled as the current top card, or the gambled card if the player just
 * gambled with it (the snapshot was taken before the card moved).
 */
function deckTopSnapshot(p: PlayerState): number {
  if (p.support?.kind === 'gamble') return p.support.card;
  return top(p.online) ?? -1;
}

export function chooseSupportAnswer(rows: EvalRow[], state: GameState, cpu: PlayerId, ai: AiCtx): SupportAnswer {
  const opp = other(cpu);
  const C = state.players[cpu];
  const O = state.players[opp];
  const atk = C.attack === null ? 0 : SLOT_CODE[C.attack];
  const hand = (i: number): number => C.hand[i] ?? -1;
  /** sel(cpu)[i]: the hand for 0..3; index 4 is the CPU's own deck top, which is never in the hand → none. */
  const sel = (i: number): number => (i === 4 ? -1 : hand(i));
  const oppTop = deckTopSnapshot(O);
  const rec: Rec[] = Array.from({ length: 5 }, () => ({ sumMine: 0, sumOpp: 0, ko: 0, win: 0, lose: 0 }));
  const acc = (i: number, j: number, t: number) => {
    const { cpuHp: x, oppHp: y } = rows[atk].S[i].E[j * 3 + t];
    if (x > 0) rec[i].win++;
    else rec[i].lose++;
    if (y <= 0) rec[i].ko++;
    rec[i].sumMine += x;
    rec[i].sumOpp += y;
  };
  const valid = (p: PlayerState, i: number) => i === 4 || supportCandidate(p, i) !== null;
  const lastOf = (key: keyof Rec) => {
    let cnt = 0;
    let last = 0;
    for (let i = 0; i < 5; i++)
      if (rec[i][key]) {
        cnt++;
        last = i;
      }
    return { cnt, last };
  };
  const disruptorWith = (key: keyof Rec): number | null => {
    for (let i = 0; i < 4; i++) if (rec[i][key] && inTable(C, hand(i), DISRUPTORS)) return hand(i);
    return null;
  };
  const randomPick = (): number => {
    // 0x801E6A08: 1/6 gamble, 1/6 none, 4/6 a hand position (possibly empty)
    const r = (ai.rand.next() % 6) - 2;
    return r >= 0 ? hand(r) : r;
  };
  const randomWin4 = (): number => {
    // 0x801E6100
    const start = ai.rand.next() % 4;
    for (let s = start; s < start + 4; s++) if (rec[s % 4].win) return hand(s % 4);
    return -1;
  };

  if (O.support && O.support.kind !== 'none') {
    // branch A: the foe already placed its support (column 4 = its real card)
    for (let i = 0; i < 5; i++) if (valid(C, i)) for (let t = 0; t < 3; t++) acc(i, 4, t);
  } else {
    // branch B: every support the foe could play from its hand
    for (let i = 0; i < 5; i++) {
      if (!valid(C, i)) continue;
      for (let j = 0; j < 5; j++) if (valid(O, j)) for (let t = 0; t < 3; t++) acc(i, j, t);
    }
  }

  let koTotal = 0;
  let winTotal = 0;
  for (const r of rec) {
    winTotal += r.win;
    koTotal += r.ko;
  }

  if (koTotal !== 0) {
    if (koTotal === 1) {
      for (let i = 0; i < 4; i++) if (rec[i].ko) return hand(i);
      return -1;
    }
    if (oppTop !== -1) {
      const d = disruptorWith('ko');
      if (d !== null) return d;
    }
    let best = 0;
    for (const r of rec) if (r.ko && best < r.sumMine) best = r.sumMine;
    for (const r of rec) if (r.ko && r.sumMine !== best) r.ko = 0;
    const { cnt, last } = lastOf('ko');
    if (cnt === 1) return sel(last);
    if (rec[4].ko) return -1;
    const start = ai.rand.next() % 5;
    for (let s = start; s < start + 5; s++) if (rec[s % 5].ko) return hand(s % 5);
    return -2; // unreachable while HPs are ≥ 0 (Q5)
  }

  const deck = count(C.online);
  const pers = ai.profile[3] & 3;
  if (winTotal !== 0) {
    if (pers === 2) return randomPick();
    if (pers === 3) return 'unwritten';
    if (pers === 0) {
      if (oppTop !== -1) {
        const d = disruptorWith('win');
        if (d !== null) return d;
      }
      let min = 10000;
      for (const r of rec) if (r.win && r.sumOpp < min) min = r.sumOpp;
      for (const r of rec) if (r.win && r.sumOpp !== min) r.win = 0;
      const { cnt, last } = lastOf('win');
      if (cnt === 1) return sel(last);
      const rounds = C.rounds;
      if (deck < (3 - rounds) * 2 || (rounds === 2 && O.rounds === 0)) return randomWin4();
      return -2;
    }
    // pers 1 (its "max own HP" filter clears .ko instead of .win and filters nothing — Q2)
    let { cnt, last } = lastOf('win');
    if (cnt === 1) return sel(last);
    let min = 10000;
    for (const r of rec) if (r.win && r.sumOpp < min) min = r.sumOpp;
    for (const r of rec) if (r.win && r.sumOpp !== min) r.win = 0;
    ({ cnt, last } = lastOf('win'));
    if (cnt === 1) return sel(last);
    if (oppTop === -1) return randomPick();
    for (let i = 0; i < 4; i++) {
      if (!rec[i].win || !inTable(C, hand(i), VOIDERS)) continue;
      if (!(inTable(O, oppTop, HEALERS) || inTable(O, oppTop, DISRUPTORS))) return 'unwritten';
      return hand(i);
    }
    return randomPick();
  }

  // every evaluated scenario KOs the CPU (its "least foe HP" filters clear .win and filter nothing — Q2)
  if (pers === 2) return randomPick();
  if (pers === 3) return 'unwritten';
  const { cnt, last } = lastOf('lose');
  if (pers === 0) {
    if (oppTop !== -1 && C.rounds !== 2) {
      const d = disruptorWith('lose');
      if (d !== null) return d;
    }
    if (cnt === 1) return sel(last);
    if (deck < (3 - C.rounds) * 2) {
      const start = ai.rand.next() % 5;
      // the game indexes rec[s] without the modulo; rec[4].lose ≥ 3 here, so it never goes past 4 (Q4)
      for (let s = start; s < start + 5; s++) if (rec[s % 5].lose) return sel(s % 5);
      return -1;
    }
    return -2;
  }
  if (cnt === 1) return sel(last);
  if (oppTop !== -1) {
    const d = disruptorWith('lose');
    if (d !== null) return d;
  }
  return randomPick();
}

/**
 * How states 26/29 apply the answer: -2 gambles if the deck is not empty; a ref is played only if it
 * is in the hand and is not a Digivolve Option; anything else is no support.
 * 🟡 'unwritten' leaves the previous ctx+0x804 value (most likely the attack index 0..2, which is
 * never one of the CPU's card ids): modelled as no support.
 */
export function supportPickOf(state: GameState, cpu: PlayerId, ans: SupportAnswer): SupportPick {
  const p = state.players[cpu];
  if (ans === -2) return count(p.online) > 0 ? { from: 'gamble' } : { from: 'none' };
  if (ans === 'unwritten' || ans < 0) return { from: 'none' };
  if (!p.hand.includes(ans) || cardOf(p, ans).kind === 'digivolve') return { from: 'none' };
  return { from: 'hand', card: ans };
}

export function aiSupport(state: GameState, cpu: PlayerId, ai: AiCtx): SupportPick {
  const { rows } = evaluate(state, cpu);
  return supportPickOf(state, cpu, chooseSupportAnswer(rows, state, cpu, ai));
}
