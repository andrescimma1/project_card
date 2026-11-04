/**
 * CPU AI — battle evaluation by simulation, KAWSEG 0x801E0CCC.
 * For each own attack (all three, or only the one already chosen) it runs the real resolver in
 * simulation mode for every combination of
 *   own support    (each Digimon/Option card in its hand, or "the card already in the slot / none")
 *   × foe support  (each Digimon/Option card in the FOE'S HAND, or the foe's already chosen support)
 *   × foe attack   (◯ △ ✕)
 * and accumulates final HPs and KOs. Like the game, it reads the opponent's hand and its face-down
 * support; it does not read the opponent's chosen attack.
 */
import type { AttackSlot } from '../cards/types';
import { simulateBattle } from '../game/battle';
import { cardOf, SLOT_CODE, SLOTS } from '../game/effects';
import type { GameState, PlayerId, PlayerState, SupportChoice } from '../game/types';
import { top } from '../game/zones';

export interface EvalEntry {
  cpuHp: number;
  oppHp: number;
}

/** S(a, s) at A(a) + 0x0C + s × 0x7C. */
export interface EvalSub {
  /** Starts at -1 and is only ever written -1 (the "both alive → 1" branch is dead code). */
  status: number;
  oppKo: number;
  cpuKo: number;
  /** E(a, s, t, b) at index t × 3 + b. */
  E: EvalEntry[];
}

/** A(a) at ctx + 0x5C + a × 0x278. */
export interface EvalRow {
  /** 0 every simulation KO'd the foe · 1 some left both alive · -1 some KO'd the CPU (foe alive). */
  status: number;
  oppKo: number;
  cpuKo: number;
  cpuHpSum: number;
  oppHpSum: number;
  S: EvalSub[];
}

export interface EvalResult {
  rows: EvalRow[];
  /** Return value: in practice always -1. */
  ret: number;
}

const other = (x: PlayerId): PlayerId => (x === 0 ? 1 : 0);

/** Support simulated for candidate i: hand[i] (0..3) or the support slot (4). null = not simulated. */
export function supportCandidate(p: PlayerState, i: number): SupportChoice | null {
  if (i === 4) return p.support && p.support.kind !== 'none' ? p.support : { kind: 'none' };
  const c = p.hand[i];
  if (c === null || cardOf(p, c).kind === 'digivolve') return null; // 0x801E0C50
  return { kind: 'hand', card: c };
}

const emptyRow = (): EvalRow => ({
  status: 0,
  oppKo: 0,
  cpuKo: 0,
  cpuHpSum: 0,
  oppHpSum: 0,
  S: Array.from({ length: 5 }, () => ({ status: 0, oppKo: 0, cpuKo: 0, E: Array.from({ length: 15 }, () => ({ cpuHp: 0, oppHp: 0 })) })),
});

export function evaluate(state: GameState, cpu: PlayerId): EvalResult {
  const opp = other(cpu);
  const rows = [emptyRow(), emptyRow(), emptyRow()];
  if (top(state.players[0].stack) === null || top(state.players[1].stack) === null) return { rows, ret: -1 };

  // The simulated support stays in the hand, as in the game (only the slot +0x1CD is written).
  const sim = structuredClone(state);
  const P = sim.players;
  const chosen = state.players[cpu].attack;
  const lock = chosen === null ? 3 : SLOT_CODE[chosen];
  for (let a = 0; a < 3; a++) {
    const row = rows[a];
    if (!(lock === 3 || lock === a)) continue;
    for (let s = 0; s < 5; s++) {
      const S = row.S[s];
      S.status = -1;
      const cpuSup = supportCandidate(state.players[cpu], s);
      if (!cpuSup) continue;
      for (let t = 0; t < 5; t++) {
        const oppSup = supportCandidate(state.players[opp], t);
        if (!oppSup) continue;
        for (let b = 0; b < 3; b++) {
          P[cpu].attack = SLOTS[a] as AttackSlot;
          P[opp].attack = SLOTS[b] as AttackSlot;
          P[cpu].support = cpuSup;
          P[opp].support = oppSup;
          const hp = simulateBattle(sim);
          const ch = hp[cpu];
          const oh = hp[opp];
          S.E[t * 3 + b] = { cpuHp: ch, oppHp: oh };
          row.cpuHpSum += ch;
          row.oppHpSum += oh;
          if (oh <= 0) {
            row.oppKo++;
            S.oppKo++;
          } else if (ch <= 0) {
            row.cpuKo++;
            S.cpuKo++;
            row.status = -1;
            S.status = -1;
          } else {
            if (row.status === 0) row.status = 1;
            if (S.status === 0) S.status = 1; // never true: S.status starts at -1
          }
        }
      }
    }
  }

  // 0x801E1404
  let ret = -1;
  for (let a = 0; a < 3; a++) {
    for (let s = 0; s < 5; s++) {
      if (s !== 4 && !supportCandidate(state.players[cpu], s)) continue;
      if (rows[a].S[s].status === 1) return { rows, ret: 0 };
      if (rows[a].S[s].status === 2) ret = 1;
    }
  }
  return { rows, ret };
}
