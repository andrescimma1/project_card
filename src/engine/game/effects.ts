/**
 * Port of the game's support-effect interpreter (battle overlay KAWSEG):
 *   getVar 0x801E7DD4 · setVar 0x801E81DC · interpreter 0x801E9C1C · ✕ effects 0x801E9700
 * Behaviour notes and evidence: docs/research/04-motor-original.md
 */
import { cards } from '../cards/db';
import { SPECIALTY_BY_CODE } from '../cards/romTables';
import type { AttackSlot, Card, CrossEffect, EffectProgram, Level, Specialty } from '../cards/types';
import { arith, compare, VALUE_CAP } from '../rules/primitives';
import { partnerCards } from './partner';
import { randomInt, shuffleZone } from './rng';
import type { CardRef, GameEvent, GameState, PlayerId, PlayerState } from './types';
import { cardsIn, count, free, popTop, pushFirst, pushTop, remove, top } from './zones';

export const SLOTS: AttackSlot[] = ['circle', 'triangle', 'cross'];
export const SLOT_CODE: Record<AttackSlot, number> = { circle: 0, triangle: 1, cross: 2 };
const LEVEL_CODE: Record<Level, number> = { R: 0, A: 1, C: 2, U: 3 };
const SPEC_CODE: Record<Specialty, number> = { fire: 0, ice: 1, nature: 2, darkness: 3, rare: 4 };

/** The 6 Partner Cards (fetched by command 0x2E). */
const PARTNERS = new Set(['Veemon', 'Hawkmon', 'Armadillomon', 'Patamon', 'Gatomon', 'Wormmon']);

/** Per-battle values of one player (the game's +0x158.. block and +0x178 flags). */
export interface Fighter {
  hp: number;
  power: [number, number, number];
  counter: boolean; // 0x40
  first: boolean; // 0x100
  voidDigimon: boolean; // 0x200
  voidOption: boolean; // 0x400
  crash: boolean; // 0x800
  eatUp: boolean; // 0x1000
  revive: number | null; // 0x4000 + HP at +0x166
}

export interface BattleCtx {
  state: GameState;
  f: [Fighter, Fighter];
  events: GameEvent[];
  temp: number;
  /** Simulation mode (resolver called with a0 = 1 by the CPU AI): zone commands are skipped. */
  sim?: boolean;
}

/**
 * setVar targets that return immediately in simulation mode (KAWSEG 0x801E81DC): random discards,
 * hand → deck, deck top discards, Offline → deck, DP discards, shuffles, partner to hand, draws.
 * They are also the only ones that use rand().
 */
const SIM_SKIPPED = new Set([0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x2a, 0x2b, 0x2e, 0x31, 0x32]);

/** The card an instance uses: the ROM record, or its partner slot copy (SLUS 0x80046A38 / 0x80040A48). */
export function cardOf(p: PlayerState, ref: CardRef): Card {
  const k = p.partnerOf?.[ref];
  if (k !== null && k !== undefined) {
    const slot = p.partners[k];
    const copies = partnerCards(slot);
    if (p.cards[ref] === slot.id) return copies.card;
    if (p.cards[ref] === slot.armorId && copies.armor) return copies.armor;
  }
  return cards[p.cards[ref]];
}

export function activeCard(p: PlayerState): Card | null {
  const t = top(p.stack);
  return t === null ? null : cardOf(p, t);
}

const other = (x: PlayerId): PlayerId => (x === 0 ? 1 : 0);

function levelCode(p: PlayerState): number {
  const c = activeCard(p);
  return c && c.kind === 'digimon' ? LEVEL_CODE[c.level] : 0;
}

function supportCardRef(p: PlayerState): CardRef | null {
  return p.support && p.support.kind !== 'none' ? p.support.card : null;
}

/** getVar(self, opp, id, literal, slot) — 29 cases, anything else reads 0. */
export function getVar(ctx: BattleCtx, self: PlayerId, id: number, literal: number, slot: number): number {
  const opp = other(self);
  const P = ctx.state.players;
  const own = id % 2 === 1; // pairs are (own, opp) = (odd, even)
  switch (id) {
    case 0:
      return literal;
    case 1:
    case 2:
      return SPEC_CODE[P[own ? self : opp].specialty];
    case 3:
    case 4:
      return ctx.f[own ? self : opp].hp;
    case 5:
    case 7:
    case 9:
      return ctx.f[self].power[(id - 5) >> 1];
    case 6:
    case 8:
    case 10:
      return ctx.f[opp].power[(id - 6) >> 1];
    case 11:
      return ctx.f[self].power[slot];
    case 12:
      return ctx.f[opp].power[slot];
    case 13:
    case 14:
      return levelCode(P[own ? self : opp]);
    case 15:
    case 16: {
      const p = P[own ? self : opp];
      const empty = free(p.stack);
      if (empty === 0) return 1;
      if (empty !== 1) return -1;
      const bottom = p.stack[2];
      const c = bottom === null ? null : cardOf(p, bottom);
      return c && c.kind === 'digimon' && c.level !== 'R' ? 0 : -1;
    }
    case 17:
    case 18: {
      const a = P[own ? self : opp].attack;
      return a ? SLOT_CODE[a] : 0;
    }
    case 19: {
      const ref = supportCardRef(P[opp]);
      if (ref === null) return -1;
      const kind = cardOf(P[opp], ref).kind;
      return kind === 'digimon' ? 0 : kind === 'option' ? 1 : -1;
    }
    case 20:
      return self !== ctx.state.turn ? 1 : 0;
    case 21:
    case 22:
      return count(P[id === 21 ? self : opp].hand);
    case 23:
    case 24:
      return count(P[id === 23 ? self : opp].dp);
    case 25:
      return count(P[self].offline) === 0 ? 1 : 0;
    case 26:
      return ctx.temp;
    case 27:
    case 28:
      return count(P[id === 27 ? self : opp].online);
    default:
      return 0;
  }
}

function discard(ctx: BattleCtx, who: PlayerId, refs: CardRef[], from: 'hand' | 'online' | 'dp' | 'stack' | 'support') {
  if (!refs.length) return;
  for (const r of refs) pushTop(ctx.state.players[who].offline, r);
  ctx.events.push({ type: 'cardsDiscarded', player: who, cards: refs, from });
}

function randomHandCards(ctx: BattleCtx, p: PlayerState, n: number): CardRef[] {
  const out: CardRef[] = [];
  for (let i = 0; i < n && count(p.hand) > 0; i++) {
    const inHand = cardsIn(p.hand);
    const pick = inHand[randomInt(ctx.state, inHand.length)];
    remove(p.hand, pick);
    out.push(pick);
  }
  return out;
}

export function drawCards(ctx: { state: GameState; events: GameEvent[] }, who: PlayerId, n: number): number {
  const p = ctx.state.players[who];
  let drawn = 0;
  while (drawn < n && count(p.online) > 0 && free(p.hand) > 0) {
    const c = popTop(p.online)!;
    pushFirst(p.hand, c);
    ctx.events.push({ type: 'draw', player: who, card: c });
    drawn++;
  }
  return drawn;
}

/** setVar(self, opp, target, value, slot) — 54 cases; unlisted ids are no-ops. */
export function setVar(ctx: BattleCtx, self: PlayerId, target: number, value: number, slot: number): void {
  if (ctx.sim && SIM_SKIPPED.has(target)) return;
  const opp = other(self);
  const P = ctx.state.players;
  const who = target % 2 === 0 ? self : opp; // most writes come in (own, opp) = (even, odd) pairs
  switch (target) {
    case 0x00:
    case 0x01:
      P[who].specialty = SPECIALTY_BY_CODE[((value % 5) + 5) % 5];
      return;
    case 0x02:
    case 0x03:
      ctx.f[who].hp = value;
      return;
    case 0x04:
    case 0x05:
    case 0x06:
    case 0x07:
    case 0x08:
    case 0x09:
      ctx.f[who].power[(target - (who === self ? 4 : 5)) >> 1] = value;
      return;
    case 0x0a:
    case 0x0b:
      ctx.f[who].power[slot] = value;
      return;
    case 0x10:
    case 0x11: {
      const s = value & 3;
      if (s < 3) P[target === 0x10 ? self : opp].attack = SLOTS[s];
      return;
    }
    case 0x19:
      ctx.temp = value;
      return;
    case 0x1a:
    case 0x1b: {
      const w = target === 0x1a ? self : opp;
      discard(ctx, w, randomHandCards(ctx, P[w], value), 'hand');
      return;
    }
    case 0x1e:
    case 0x1f: {
      const w = target === 0x1e ? self : opp;
      for (const c of randomHandCards(ctx, P[w], value)) pushTop(P[w].online, c);
      return;
    }
    case 0x20:
    case 0x21: {
      const w = target === 0x20 ? self : opp;
      const out: CardRef[] = [];
      for (let i = 0; i < value && count(P[w].online) > 0; i++) out.push(popTop(P[w].online)!);
      discard(ctx, w, out, 'online');
      return;
    }
    case 0x22:
    case 0x23: {
      const w = target === 0x22 ? self : opp;
      for (let i = 0; i < value && count(P[w].offline) > 0; i++) pushTop(P[w].online, popTop(P[w].offline)!);
      return;
    }
    case 0x24:
    case 0x25: {
      const w = target === 0x24 ? self : opp;
      const out: CardRef[] = [];
      for (let i = 0; i < value && count(P[w].dp) > 0; i++) out.push(popTop(P[w].dp)!);
      discard(ctx, w, out, 'dp');
      return;
    }
    case 0x2a:
    case 0x2b:
      shuffleZone(ctx.state, P[target === 0x2a ? self : opp].online);
      return;
    case 0x2c:
      ctx.f[opp].voidDigimon = true;
      return;
    case 0x2d:
      ctx.f[opp].voidDigimon = true;
      ctx.f[opp].voidOption = true;
      return;
    case 0x2e: {
      const p = P[self];
      if (count(p.online) === 0 || free(p.hand) === 0) return;
      const partners = cardsIn(p.online).filter((r) => PARTNERS.has(cardOf(p, r).name));
      if (!partners.length) return;
      const pick = partners[randomInt(ctx.state, partners.length)];
      remove(p.online, pick);
      pushFirst(p.hand, pick);
      return;
    }
    case 0x2f: {
      const a = P[opp].attack;
      if (a) P[opp].attack = SLOTS[(SLOT_CODE[a] + 1) % 3];
      return;
    }
    case 0x30:
      ctx.f[self].revive = value;
      return;
    case 0x31:
    case 0x32:
      drawCards(ctx, target === 0x31 ? self : opp, value);
      return;
    case 0x33:
      ctx.f[self].eatUp = true;
      return;
    case 0x34:
      ctx.f[self].counter = true;
      ctx.f[opp].counter = false;
      return;
    case 0x35:
      ctx.f[self].first = true;
      return;
    default:
      return;
  }
}

/** Interpreter (0x801E9C1C). Returns false when a condition fails (then no action runs). */
export function runProgram(ctx: BattleCtx, self: PlayerId, program: EffectProgram): boolean {
  for (const c of program.conditions) {
    if (!c.enabled) continue;
    const v = c.operands.map((o) => getVar(ctx, self, o.ref?.id ?? 0, o.value, 0));
    const left = arith(arith(v[0], c.ops[0], v[1]), c.ops[1], v[2]);
    const right = arith(arith(v[3], c.ops[2], v[4]), c.ops[3], v[5]);
    if (!compare(left, c.cmp, right)) return false;
  }
  for (const a of program.actions) {
    if (!a.enabled) continue;
    const eval3 = (slot: number) => {
      const [o0, o1, o2] = a.operands.map((o) => getVar(ctx, self, o.ref?.id ?? 0, o.value, slot));
      return arith(arith(o2, a.opInner, o1), a.opOuter, o0);
    };
    if (a.target.id === 0x0a || a.target.id === 0x0b) {
      const values = [0, 1, 2].map(eval3); // the game evaluates all slots before writing
      values.forEach((v, slot) => setVar(ctx, self, a.target.id, v, slot));
    } else {
      setVar(ctx, self, a.target.id, eval3(0), 0);
    }
  }
  return true;
}

const COUNTER_SLOT: Partial<Record<CrossEffect, number>> = { counterCircle: 0, counterTriangle: 1, counterCross: 2 };
const TO0_SLOT: Partial<Record<CrossEffect, number>> = { circleTo0: 0, triangleTo0: 1, crossTo0: 2 };
const X3_SPEC: Partial<Record<CrossEffect, Specialty>> = {
  foeX3Fire: 'fire',
  foeX3Ice: 'ice',
  foeX3Nature: 'nature',
  foeX3Darkness: 'darkness',
  foeX3Rare: 'rare',
};

/** ✕ special effects (0x801E9700). Called only when the owner's attack is ✕. */
export function applyCrossEffect(ctx: BattleCtx, self: PlayerId, effect: CrossEffect): void {
  const opp = other(self);
  if (effect === 'firstAttack') ctx.f[self].first = true;
  else if (effect in TO0_SLOT) ctx.f[opp].power[TO0_SLOT[effect]!] = 0;
  else if (effect in COUNTER_SLOT) {
    const a = ctx.state.players[opp].attack;
    if (a && SLOT_CODE[a] === COUNTER_SLOT[effect]) {
      ctx.f[self].counter = true;
      ctx.f[opp].counter = false;
    }
  } else if (effect === 'crash') ctx.f[self].crash = true;
  else if (effect === 'eatUpHp') ctx.f[self].eatUp = true;
  else if (effect === 'jamming') ctx.f[opp].voidDigimon = true;
  else if (effect in X3_SPEC) {
    if (ctx.state.players[opp].specialty === X3_SPEC[effect]) ctx.f[self].power[2] = Math.min(ctx.f[self].power[2] * 3, VALUE_CAP);
  }
}
