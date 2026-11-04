/**
 * CPU AI — decision code 3 (SLUS state 11): digivolution plan + which card goes to the DP Slot.
 * The coroutine (SLUS 0x80039000) runs, in order:
 *   r = checkHand (0x801E157C) → planWithOptions (0x801E3FF4) → chooseTarget(r) (0x801E3AF8)
 *   → answer = pickDpCard (0x801E363C)
 * The plan table it leaves in AiMemory is read later by decisions 4 and 5.
 */
import type { DigimonCard } from '../cards/types';
import { isAbnormal, playerDp } from '../game/digivolve';
import { cardOf } from '../game/effects';
import type { CardRef, GameState, PlayerId, PlayerState } from '../game/types';
import { count, top } from '../game/zones';
import {
  DV_TYPE_CODE,
  handCountSpecialty,
  handDigimonCount,
  KIND_CODE,
  LEVEL_CODE,
  SPECIALTY_CODE,
  supportActionCount,
  type AiCtx,
  type AiMemory,
} from './view';

const kindOf = (p: PlayerState, ref: number): number => KIND_CODE[cardOf(p, ref).kind];
const digi = (p: PlayerState, ref: number) => cardOf(p, ref) as DigimonCard;
const lvl = (p: PlayerState, ref: number) => LEVEL_CODE[digi(p, ref).level];
const handAt = (p: PlayerState, i: number): number => p.hand[i] ?? -1;

/** 0x801E157C: next normal digivolution reachable from the hand? Fills the plan table. */
export function checkHand(p: PlayerState, mem: AiMemory): -1 | 0 | 1 | 2 {
  const active = top(p.stack);
  if (active === null) return -1; // leaves the table untouched
  mem.plan = null;
  const T = mem.T;
  for (let i = 0; i < 4; i++) {
    const c = handAt(p, i);
    T[i] = { card: c, flag: -1, need: 100, extra: -1 };
    if (c === -1 || kindOf(p, c) !== KIND_CODE.digimon) continue;
    T[i].flag = 0;
    let aLvl = lvl(p, active);
    const d = digi(p, c).dpRequired - playerDp(p);
    T[i].need = d < 0 ? 0 : d;
    if (SPECIALTY_CODE[digi(p, c).specialty] !== SPECIALTY_CODE[p.specialty]) continue; // CURRENT specialty
    if (aLvl === LEVEL_CODE.A) continue;
    if (aLvl === LEVEL_CODE.R) aLvl = 1;
    if (lvl(p, c) !== aLvl + 1) continue;
    if (d <= 0) {
      T[i].flag = 1;
      continue;
    }
    for (let j = 0; j < 4; j++) {
      if (j === i) continue;
      const o = handAt(p, j);
      if (o === -1 || kindOf(p, o) !== KIND_CODE.digimon) continue;
      if (digi(p, o).dpGiven >= d) {
        T[i].flag = 1;
        break;
      }
      T[i].flag = 2;
    }
  }
  if (T.some((t) => t.flag === 1)) return 1;
  return T.some((t) => t.flag === 2) ? 2 : 0;
}

/** 0x801E3FF4: plans digivolutions through the Digivolve Options in hand. */
export function planWithOptions(p: PlayerState, mem: AiMemory): void {
  const T = mem.T;
  const active = top(p.stack);
  if (active === null) return;
  const hpNow = p.hp; // +0x126, the displayed HP (equal to the real one when the CPU decides)
  const commit = (s4: number, s6: number) => {
    T[s4].extra = T[s6].card;
    mem.plan = s4;
  };
  const coverLoop = (s4: number, s6: number) => {
    for (let a = 0; a < 4; a++) {
      if (T[s4].need !== 0 && a === s4) continue;
      const c = handAt(p, a);
      if (c === -1 || kindOf(p, c) !== KIND_CODE.digimon) continue;
      if (digi(p, c).dpGiven < T[s4].need) continue;
      T[s4].flag = 1;
      commit(s4, s6);
    }
  };

  // phase 1 (0x801E404C): a reachable natural digivolution to a Champion → no plan
  for (let i = 0; i < 4; i++) {
    const c = T[i].card;
    if (c === -1 || kindOf(p, c) !== KIND_CODE.digimon) continue;
    if (T[i].flag !== 1) continue;
    if (lvl(p, c) === LEVEL_CODE.C) return;
  }

  // phase 2 (0x801E4104): every Digivolve Option × every Digimon in hand; the last match wins
  for (let s6 = 0; s6 < 4; s6++) {
    const opt = T[s6].card;
    if (opt === -1 || kindOf(p, opt) !== KIND_CODE.digivolve) continue;
    const optCard = cardOf(p, opt);
    if (optCard.kind !== 'digivolve') continue;
    const type = DV_TYPE_CODE[optCard.digivolveType];
    for (let s4 = 0; s4 < 4; s4++) {
      const tgt = T[s4].card;
      if (tgt === -1 || kindOf(p, tgt) !== KIND_CODE.digimon) continue;
      const curSpec = SPECIALTY_CODE[p.specialty];
      let aLvl = lvl(p, active);
      const tSpec = SPECIALTY_CODE[digi(p, tgt).specialty];
      const tLvl = lvl(p, tgt);
      switch (type) {
        case 0: {
          // Special (0x801E4308): any specialty, next level; need − 20 if a hand card covers the rest
          if (aLvl === LEVEL_CODE.A) break;
          if (aLvl === LEVEL_CODE.R) aLvl = 1;
          if (tLvl !== aLvl + 1) break;
          const local = [0, 0, 0, 0];
          for (let a = 0; a < 4; a++) {
            local[a] = 100;
            if (T[s4].need - 20 > 0 && a === s4) continue;
            const c = handAt(p, a);
            if (c === -1 || kindOf(p, c) !== KIND_CODE.digimon) continue;
            const v = T[s4].need - 20;
            if (digi(p, c).dpGiven < v) continue;
            local[a] = v < 0 ? 0 : v;
            T[s4].flag = 1;
            commit(s4, s6);
          }
          for (let a = 0; a < 4; a++) if (local[a] < T[s4].need) T[s4].need = local[a] & 0xff;
          break;
        }
        case 1: // Warp (0x801E4538): R → U, same current specialty
          if (aLvl !== LEVEL_CODE.R || tLvl !== LEVEL_CODE.U || tSpec !== curSpec) break;
          coverLoop(s4, s6);
          break;
        case 2: // Speed (0x801E4688): next level, same specialty, not in the abnormal state; no DP
          if (aLvl === LEVEL_CODE.A) break;
          if (aLvl === LEVEL_CODE.R) aLvl = 1;
          if (isAbnormal(p) || tLvl !== aLvl + 1 || tSpec !== curSpec) break;
          T[s4].flag = 1;
          T[s4].need = 0;
          commit(s4, s6);
          break;
        case 3: // Mutant (0x801E4714): same level, settled, (more HP or abnormal), no plan yet
          if (aLvl !== tLvl || !p.settled) break;
          if (!(hpNow < digi(p, tgt).hp || isAbnormal(p))) break;
          if (mem.plan !== null) break;
          coverLoop(s4, s6);
          break;
        case 4: // Digi-devolve (0x801E4918): ≥ 2 stacked cards and HP < 300; ignores the target
          if (3 - count(p.stack) >= 2 || hpNow >= 300) break;
          T[s4].flag = 1;
          T[s4].need = 0;
          commit(s4, s6);
          break;
        case 5: // Download (0x801E498C): any higher level (raw level codes)
          if (!(aLvl < tLvl)) break;
          T[s4].flag = 1;
          T[s4].need = 0;
          commit(s4, s6);
          break;
        case 6: // ArmorCrush (0x801E49D0): from A to U, or to C with HP < 300; same specialty
          if (aLvl !== LEVEL_CODE.A || tSpec !== curSpec) break;
          if (!(tLvl === LEVEL_CODE.U || (tLvl === LEVEL_CODE.C && hpNow < 300))) break;
          coverLoop(s4, s6);
          break;
        case 7: // De-Armor (0x801E4B5C): Armor in play and HP < 300; ignores the target
          if (aLvl !== LEVEL_CODE.A || hpNow >= 300) break;
          T[s4].flag = 1;
          T[s4].need = 0;
          commit(s4, s6);
          break;
      }
    }
  }

  // phase 3 (0x801E4C0C): no plan → duplicated Digivolve Options point at each other
  if (mem.plan !== null) return;
  for (let s6 = 0; s6 < 4; s6++) {
    const a = T[s6].card;
    if (a === -1 || kindOf(p, a) !== KIND_CODE.digivolve) continue;
    for (let s4 = 0; s4 < 4; s4++) {
      if (s4 === s6) continue;
      const b = T[s4].card;
      if (b === -1 || kindOf(p, b) !== KIND_CODE.digivolve) continue;
      const ta = cardOf(p, a);
      const tb = cardOf(p, b);
      if (ta.kind === 'digivolve' && tb.kind === 'digivolve' && ta.digivolveType === tb.digivolveType) T[s4].extra = a;
    }
  }
}

/** 0x801E3AF8: without an option plan, target the last entry flagged 1 (or 2) by checkHand. */
export function chooseTarget(mem: AiMemory, r: number): void {
  if (mem.plan !== null) return;
  if (r === 0) mem.plan = null;
  else if (r === 1 || r === 2) mem.T.forEach((t, i) => t.flag === r && (mem.plan = i));
}

/**
 * 0x801E363C: global card id (player × 30 + ref) to put in the DP Slot, or -1.
 * Candidates and filters work on global ids, like the game (this matters for the `bgtz` below).
 */
export function pickDpCard(p: PlayerState, player: PlayerId, ai: AiCtx): number {
  const active = top(p.stack);
  if (active === null) return -1;
  const mem = ai.memory;
  const ref = (gid: number) => gid % 30;
  const plusP = (gid: number) => digi(p, ref(gid)).dpGiven;
  let want = (lvl(p, active) === LEVEL_CODE.A ? 60 : 50) - playerDp(p);
  const plan = mem.plan === null ? null : mem.T[mem.plan];
  if (plan) {
    if (plan.flag === 1 && plan.need === 0) return -1;
    if (plan.flag > 0) want = plan.need;
  }
  if (want <= 0) return -1;

  const cand = [-1, -1, -1, -1];
  let n = 0;
  for (let i = 0; i < 4; i++) {
    const c = handAt(p, i);
    if (c === -1) continue;
    cand[i] = player * 30 + c;
    if (cardOf(p, c).kind !== 'digimon') cand[i] = -1; // record type +0x02
    else if (plusP(cand[i]) === 0) cand[i] = -1;
    else if (plan && plan.card === c) cand[i] = -1; // never the planned target
    if (cand[i] !== -1) n++;
  }
  if (n === 0) return -1;
  if (n === 1) return cand.find((c) => c !== -1)!; // before looking at the personality

  /** Common shape of the filters: -1 none match (cand untouched), the id if one, -2 if several. */
  const narrow = (ok: (gid: number) => boolean): number => {
    const k = cand.filter((c) => c !== -1 && ok(c)).length;
    if (k === 0) return -1;
    for (let i = 0; i < 4; i++) if (cand[i] !== -1 && !ok(cand[i])) cand[i] = -1;
    return k === 1 ? cand.find((c) => c !== -1)! : -2;
  };
  const smallestSufficient = () => {
    // 0x801E2A50
    let best = 100;
    for (const c of cand) if (c !== -1 && plusP(c) >= want && plusP(c) < best) best = plusP(c);
    return narrow((c) => plusP(c) === best);
  };
  const largest = () => {
    // 0x801E2C98
    let best = -1;
    for (const c of cand) if (c !== -1 && plusP(c) > best) best = plusP(c);
    return narrow((c) => plusP(c) === best);
  };
  const uniqueSpecialty = () => narrow((c) => handCountSpecialty(p, SPECIALTY_CODE[digi(p, ref(c)).specialty]) === 1); // 0x801E2ED8
  const sameLevel = () => narrow((c) => lvl(p, ref(c)) === lvl(p, active)); // 0x801E30D0
  const withSupport = () => narrow((c) => supportActionCount(cardOf(p, ref(c))) > 0); // 0x801E3364
  const random = () => {
    // 0x801E3574
    const left = cand.filter((c) => c !== -1);
    return left.length === 0 ? -1 : left[ai.rand.next() % left.length];
  };

  let r: number;
  switch (ai.profile[0] & 3) {
    case 0:
      if ((r = smallestSufficient()) >= 0) return r;
      if ((r = largest()) > 0) return r; // bgtz: a global id 0 counts as "no result"
      if ((r = uniqueSpecialty()) >= 0) return r;
      if ((r = sameLevel()) >= 0) return r;
      if ((r = withSupport()) >= 0) return r;
      return random();
    case 1:
      if (lvl(p, active) === LEVEL_CODE.R && handDigimonCount(p) < 2) return -1; // unreachable with n ≥ 2
      if ((r = smallestSufficient()) >= 0) return r;
      if ((r = uniqueSpecialty()) >= 0) return r;
      if ((r = withSupport()) >= 0) return r;
      if ((r = largest()) > 0) return r;
      if ((r = sameLevel()) >= 0) return r;
      return random();
    case 2:
      return random();
    default:
      return -1;
  }
}

/** Decision 3: card ref to place in the DP Slot, or -1 to place nothing. */
export function aiDp(state: GameState, player: PlayerId, ai: AiCtx): CardRef | -1 {
  const p = state.players[player];
  const r = checkHand(p, ai.memory);
  planWithOptions(p, ai.memory);
  chooseTarget(ai.memory, r);
  const gid = pickDpCard(p, player, ai);
  return gid < 0 ? -1 : gid % 30;
}
