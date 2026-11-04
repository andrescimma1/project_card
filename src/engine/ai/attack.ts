/**
 * CPU AI — decision code 6 (state 24): which attack to use. KAWSEG 0x801E4E58, run right after
 * the evaluation 0x801E0CCC. Only the row headers of the evaluation are used.
 */
import type { AttackSlot } from '../cards/types';
import { SLOTS } from '../game/effects';
import type { GameState, PlayerId } from '../game/types';
import { evaluate, type EvalRow } from './evaluate';
import type { AiCtx } from './view';

/** Weighted pick 2/3/5 between the rows whose status is `want`. */
function weighted(st: number[], want: number, r: number): number {
  if (st[0] === want) return r < 2 ? 0 : st[1] !== want ? 2 : r < 5 ? 1 : 2;
  return st[1] !== want ? 2 : r < 3 ? 1 : 2;
}
const weight = (st: number[], want: number) => (st[0] === want ? 2 : 0) + (st[1] === want ? 3 : 0) + (st[2] === want ? 5 : 0);

/** 0x801E4E58 → 0 ◯ · 1 △ · 2 ✕ (written to ctx+0x804, then to flags bits 2-3). */
export function chooseAttackIndex(rows: EvalRow[], state: GameState, cpu: PlayerId, ai: AiCtx): number {
  const st = rows.map((r) => r.status);
  const cpuSum = rows.map((r) => r.cpuHpSum);
  const oppSum = rows.map((r) => r.oppHpSum);
  const n0 = st.filter((x) => x === 0).length;
  const n1 = st.filter((x) => x === 1).length;
  let ans = 0;
  const finish = () => (ans < 0 ? ai.rand.next() % 3 : ans); // 0x801E56B0

  // guaranteed KO rows
  if (n0 === 1) return st.indexOf(0);
  if (n0 >= 2) {
    const w = weight(st, 0);
    ans = weighted(st, 0, w !== 0 ? ai.rand.next() % w : 0);
    return finish();
  }
  if (n1 === 1) {
    ans = st.indexOf(1);
    return finish();
  }

  const personality = ai.profile[1] & 3;
  let ties = 3;
  if (personality !== 2 && (ai.rand.next() & 1) !== 0) {
    const m = state.turn === cpu ? cpuSum : oppSum;
    ans = 0;
    for (let i = 1; i < 3; i++) if (state.turn === cpu ? m[i] > m[ans] : m[i] < m[ans]) ans = i;
    ties = m.filter((v) => v === m[ans]).length;
  }
  if (ties < 2) return finish();
  if (n1 >= 2) ans = weighted(st, 1, ai.rand.next() % weight(st, 1));
  else ans = ai.rand.next() % 3;
  return finish();
}

export function aiAttack(state: GameState, cpu: PlayerId, ai: AiCtx): AttackSlot {
  const { rows } = evaluate(state, cpu);
  return SLOTS[chooseAttackIndex(rows, state, cpu, ai)] as AttackSlot;
}
