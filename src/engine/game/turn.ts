/**
 * Turn flow — port of the battle state machine (SLUS 0x80034260, 40 states).
 * Public API: createGame, beginTurn, legalActions, applyAction, validateDeck, canDigivolve.
 *
 * Rules marked 🟡 below are not fully traced in the game code yet (see docs/research/01 §8).
 */
import { cards } from '../cards/db';
import type { DigimonCard } from '../cards/types';
import { DP_SLOT_SIZE, HAND_SIZE } from '../rules/primitives';
import { resolveBattle } from './battle';
import { canDigivolve, canPlayDevolve, digivolveOptionOf, loadStats, playerDp } from './digivolve';
import { activeCard, cardOf, drawCards } from './effects';
import { bindPartners, PARTNER_IDS, partnerCards, partnersFromDeck } from './partner';
import { BONUS_BIT, countPartnerEntry, markHand, setFlag } from './bonusFlags';
import { shuffleZone } from './rng';
import {
  IllegalActionError,
  type Action,
  type CardRef,
  type GameEvent,
  type GameState,
  type PlayerId,
  type PartnerSlot,
  type PlayerState,
  type StepResult,
} from './types';
import { cardsIn, count, free, popTop, pushTop, remove } from './zones';

export { canDigivolve } from './digivolve';

const other = (x: PlayerId): PlayerId => (x === 0 ? 1 : 0);
const MAX_COPIES = 4;
const DECK_SIZE = 30;

interface Ctx {
  state: GameState;
  events: GameEvent[];
}

export function validateDeck(deck: number[]): string[] {
  const errors: string[] = [];
  if (deck.length !== DECK_SIZE) errors.push(`El mazo debe tener ${DECK_SIZE} cartas (tiene ${deck.length}).`);
  const copies = new Map<number, number>();
  for (const id of deck) {
    if (!cards[id]) errors.push(`Carta desconocida: ${id}.`);
    copies.set(id, (copies.get(id) ?? 0) + 1);
  }
  for (const [id, n] of copies) if (n > MAX_COPIES) errors.push(`Más de ${MAX_COPIES} copias de ${cards[id]?.name ?? id}.`);
  if (!deck.some((id) => cards[id]?.kind === 'digimon')) errors.push('El mazo necesita cartas Digimon.');
  return errors;
}

function emptyPlayer(id: PlayerId, deck: number[], partners: PartnerSlot[]): PlayerState {
  return {
    id,
    cards: [...deck],
    online: deck.map((_, i) => i),
    offline: Array(30).fill(null),
    hand: Array(HAND_SIZE).fill(null),
    dp: Array(DP_SLOT_SIZE).fill(null),
    stack: Array(3).fill(null),
    hp: 0,
    powers: [0, 0, 0],
    specialty: 'fire',
    enteredAs: null,
    rounds: 0,
    attack: null,
    support: null,
    digivolveOption: null,
    settled: false,
    partners,
    partnerOf: bindPartners(deck, partners),
    bonusFlags: 0,
  };
}

/**
 * Start a match. Partner slots come from `partners` (story mode) or, by default, from the partner
 * cards of each deck with `eggs[i]` equipped (DECK2 +0x6D, as the game does for the CPU deck).
 */
export function createGame(opts: {
  decks: [number[], number[]];
  seed: number;
  firstPlayer: PlayerId;
  eggs?: [number, number];
  partners?: [PartnerSlot[], PartnerSlot[]];
}): StepResult {
  opts.decks.forEach((d, i) => {
    const errors = validateDeck(d);
    if (errors.length) throw new Error(`Mazo ${i + 1} inválido: ${errors.join(' ')}`);
  });
  const state: GameState = {
    players: [0, 1].map((i) =>
      emptyPlayer(i as PlayerId, opts.decks[i], opts.partners?.[i] ?? partnersFromDeck(opts.decks[i], opts.eggs?.[i] ?? 0)),
    ) as [PlayerState, PlayerState],
    turn: opts.firstPlayer,
    turnNumber: 1,
    phase: { name: 'turnStart' },
    rng: opts.seed >>> 0,
    winner: null,
    endReason: null,
  };
  shuffleZone(state, state.players[0].online);
  shuffleZone(state, state.players[1].online);
  return beginTurnMut({ state, events: [] });
}

function hasDigimonInHand(p: PlayerState): boolean {
  return cardsIn(p.hand).some((r) => cardOf(p, r).kind === 'digimon');
}

function lose(ctx: Ctx, loser: PlayerId) {
  ctx.state.winner = other(loser);
  ctx.state.endReason = 'noDigimon';
  ctx.state.phase = { name: 'gameOver' };
  ctx.events.push({ type: 'gameOver', winner: other(loser), reason: 'noDigimon' });
}

function discardHand(ctx: Ctx, who: PlayerId) {
  const p = ctx.state.players[who];
  const gone = cardsIn(p.hand);
  for (const r of gone) {
    remove(p.hand, r);
    pushTop(p.offline, r);
  }
}

/** States 2-6: draw to 4; with no Digimon anywhere, auto-redraw or lose. */
function prepareHand(ctx: Ctx, who: PlayerId): void {
  const p = ctx.state.players[who];
  for (;;) {
    drawCards(ctx, who, HAND_SIZE);
    if (count(p.stack) > 0 || hasDigimonInHand(p)) break;
    if (count(p.online) === 0) return lose(ctx, who);
    discardHand(ctx, who);
    ctx.events.push({ type: 'handChanged', player: who, auto: true });
  }
  ctx.state.phase = { name: 'mulligan' };
}

function beginTurnMut(ctx: Ctx): StepResult {
  const s = ctx.state;
  s.players[s.turn].digivolveOption = null;
  ctx.events.push({ type: 'turnStart', player: s.turn, turnNumber: s.turnNumber });
  prepareHand(ctx, s.turn);
  for (const pl of s.players) markHand(pl);
  return { state: s, events: ctx.events };
}

export function beginTurn(input: GameState): StepResult {
  return beginTurnMut({ state: structuredClone(input), events: [] });
}

function endTurn(ctx: Ctx): void {
  const s = ctx.state;
  const p = s.players[s.turn];
  if (p.digivolveOption !== null) {
    pushTop(p.offline, p.digivolveOption);
    p.digivolveOption = null;
  }
  s.turn = other(s.turn);
  s.turnNumber += 1;
  beginTurnMut(ctx);
}

/** Partner slot with an equipped Digi-Egg whose partner card is `ref` (0x80047B84 + 0x80048014), or null. */
function armorSlotOf(p: PlayerState, ref: CardRef): number | null {
  const k = p.partnerOf[ref];
  if (k === null || k === undefined) return null;
  const slot = p.partners[k];
  return p.cards[ref] === slot.id && slot.armorId !== null ? k : null;
}

/**
 * SLUS 0x80040A48: the partner in the Battle Slot becomes its Armor in place (same instance, no
 * stacking): specialty, HP and powers of the Armor copy; flag bit 30 cleared; the abnormal-state
 * bits are left as they were.
 */
function armorDigivolve(ctx: Ctx, who: PlayerId): void {
  const p = ctx.state.players[who];
  const ref = p.stack.find((x) => x !== null)!;
  const slot = p.partners[armorSlotOf(p, ref)!];
  const armor = partnerCards(slot).armor!;
  p.cards[ref] = slot.armorId!;
  p.specialty = armor.specialty;
  p.hp = armor.hp;
  p.powers = [armor.attacks.circle.power, armor.attacks.triangle.power, armor.attacks.cross.power];
  p.settled = false;
  setFlag(p, BONUS_BIT.digivolved);
  countPartnerEntry(p);
  ctx.events.push({ type: 'armorDigivolved', player: who, card: ref, from: slot.id, to: slot.armorId! });
}

/** After the Digivolve phase: battle, or (opponent without Digimon) straight to the next turn. */
function toBattle(ctx: Ctx): void {
  const s = ctx.state;
  const p = s.players[s.turn];
  p.settled = true; // state 23 sets flag bit 30 for the turn player before anything else
  if (p.digivolveOption !== null) {
    pushTop(p.offline, p.digivolveOption);
    p.digivolveOption = null;
  }
  if (count(s.players[other(s.turn)].stack) === 0) {
    ctx.events.push({ type: 'noBattle', player: other(s.turn) });
    return endTurn(ctx);
  }
  s.phase = { name: 'attack' };
}

function digivolveInto(ctx: Ctx, who: PlayerId, target: CardRef): void {
  const p = ctx.state.players[who];
  const from = p.stack.find((x) => x !== null) ?? null;
  remove(p.hand, target);
  pushTop(p.stack, target);
  loadStats(p, cardOf(p, target) as DigimonCard, null);
  let c: CardRef | null;
  const gone: CardRef[] = [];
  while ((c = popTop(p.dp)) !== null) {
    pushTop(p.offline, c);
    gone.push(c);
  }
  setFlag(p, BONUS_BIT.digivolved);
  const bottom = p.stack[2];
  if (count(p.stack) === 3 && bottom !== null && PARTNER_IDS.includes(p.cards[bottom])) setFlag(p, BONUS_BIT.partnerNormalDigivolve);
  ctx.events.push({ type: 'digivolved', player: who, card: target, from });
  if (gone.length) ctx.events.push({ type: 'cardsDiscarded', player: who, cards: gone, from: 'dp' });
}

/** 🟡 Digi-devolve / De-Armor effect (texts: "HP double when successful" / "Level becomes R"). */
function devolve(ctx: Ctx, who: PlayerId, doubleHp: boolean): void {
  const p = ctx.state.players[who];
  const gone = popTop(p.stack)!;
  pushTop(p.offline, gone);
  const now = activeCard(p) as DigimonCard;
  loadStats(p, now, null);
  if (doubleHp) p.hp = Math.min(p.hp * 2, 9990);
  ctx.events.push({ type: 'devolved', player: who, discarded: gone });
}

export function legalActions(state: GameState, player: PlayerId): Action[] {
  const ph = state.phase;
  const p = state.players[player];
  const handCards = cardsIn(p.hand);
  const isTurn = player === state.turn;
  switch (ph.name) {
    case 'mulligan':
      if (!isTurn) return [];
      return [{ type: 'keepHand', player }, ...(count(p.online) > 0 ? [{ type: 'changeHand', player } as const] : [])];
    case 'entrance':
      if (!isTurn) return [];
      return handCards.filter((r) => cardOf(p, r).kind === 'digimon').map((card) => ({ type: 'enter', player, card }));
    case 'armorDigivolve':
      if (!isTurn) return [];
      return [
        { type: 'armorDigivolve', player },
        { type: 'skipArmorDigivolve', player },
      ];
    case 'dp':
      if (!isTurn) return [];
      return [
        ...(free(p.dp) > 0 ? handCards.filter((r) => cardOf(p, r).kind === 'digimon').map((card) => ({ type: 'chargeDp', player, card }) as const) : []),
        { type: 'skipDp', player },
      ];
    case 'digivolveOption':
      if (!isTurn) return [];
      return [
        ...handCards
          .filter((r) => {
            const c = cardOf(p, r);
            if (c.kind !== 'digivolve') return false;
            return c.digivolveType === 'digiDevolve' || c.digivolveType === 'deArmor' ? canPlayDevolve(p, c.digivolveType) : true;
          })
          .map((card) => ({ type: 'playDigivolveOption', player, card }) as const),
        { type: 'skipDigivolveOption', player },
      ];
    case 'digivolve':
      if (!isTurn) return [];
      return [
        ...handCards.filter((r) => canDigivolve(state, player, r)).map((card) => ({ type: 'digivolve', player, card }) as const),
        { type: 'skipDigivolve', player },
      ];
    case 'attack':
      if (p.attack !== null || count(p.stack) === 0) return [];
      return (['circle', 'triangle', 'cross'] as const).map((slot) => ({ type: 'chooseAttack', player, slot }));
    case 'support':
      if (ph.chooser !== player) return [];
      return [
        // 🟡 any hand card may be chosen; a Digivolve Option does nothing in battle
        ...handCards.map((card) => ({ type: 'chooseSupport', player, choice: { from: 'hand', card } }) as const),
        ...(count(p.online) > 0 ? [{ type: 'chooseSupport', player, choice: { from: 'gamble' } } as const] : []),
        { type: 'chooseSupport', player, choice: { from: 'none' } },
      ];
    default:
      return [];
  }
}

function sameAction(a: Action, b: Action): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function applyAction(input: GameState, action: Action): StepResult {
  if (!legalActions(input, action.player).some((a) => sameAction(a, action))) {
    throw new IllegalActionError(`Acción ilegal en la fase "${input.phase.name}": ${JSON.stringify(action)}`);
  }
  const ctx: Ctx = { state: structuredClone(input), events: [] };
  const s = ctx.state;
  const p = s.players[action.player];

  switch (action.type) {
    case 'keepHand':
      s.phase = count(p.stack) > 0 ? { name: 'dp' } : { name: 'entrance' };
      break;
    case 'changeHand':
      setFlag(p, BONUS_BIT.changedHand);
      discardHand(ctx, action.player);
      ctx.events.push({ type: 'handChanged', player: action.player, auto: false });
      prepareHand(ctx, action.player);
      break;
    case 'enter': {
      const card = cardOf(p, action.card) as DigimonCard;
      remove(p.hand, action.card);
      pushTop(p.stack, action.card);
      loadStats(p, card, card.level);
      ctx.events.push({ type: 'enter', player: action.player, card: action.card, enteredAs: p.enteredAs });
      if (p.partnerOf[action.card] !== null && p.partnerOf[action.card] !== undefined) countPartnerEntry(p);
      s.phase = armorSlotOf(p, action.card) === null ? { name: 'dp' } : { name: 'armorDigivolve' };
      break;
    }
    case 'armorDigivolve':
      armorDigivolve(ctx, action.player);
      s.phase = { name: 'dp' };
      break;
    case 'skipArmorDigivolve':
      s.phase = { name: 'dp' };
      break;
    case 'chargeDp':
      remove(p.hand, action.card);
      pushTop(p.dp, action.card);
      ctx.events.push({ type: 'dpCharged', player: action.player, card: action.card, dpTotal: playerDp(p) });
      s.phase = { name: 'digivolveOption' };
      break;
    case 'skipDp':
      s.phase = { name: 'digivolveOption' };
      break;
    case 'playDigivolveOption': {
      remove(p.hand, action.card);
      p.digivolveOption = action.card;
      ctx.events.push({ type: 'digivolveOptionPlayed', player: action.player, card: action.card });
      const opt = digivolveOptionOf(p)!;
      if (opt.digivolveType === 'digiDevolve' || opt.digivolveType === 'deArmor') {
        devolve(ctx, action.player, opt.digivolveType === 'digiDevolve');
        toBattle(ctx);
      } else s.phase = { name: 'digivolve' };
      break;
    }
    case 'skipDigivolveOption':
      s.phase = { name: 'digivolve' };
      break;
    case 'digivolve':
      digivolveInto(ctx, action.player, action.card);
      toBattle(ctx);
      break;
    case 'skipDigivolve':
      toBattle(ctx);
      break;
    case 'chooseAttack': {
      p.attack = action.slot;
      ctx.events.push({ type: 'attackChosen', player: action.player });
      const [a, b] = s.players;
      if ((a.attack !== null || count(a.stack) === 0) && (b.attack !== null || count(b.stack) === 0)) {
        s.phase = { name: 'support', chooser: other(s.turn) };
      }
      break;
    }
    case 'chooseSupport': {
      const c = action.choice;
      if (c.from === 'hand') {
        remove(p.hand, c.card);
        p.support = { kind: 'hand', card: c.card };
      } else if (c.from === 'gamble') p.support = { kind: 'gamble', card: popTop(p.online)! };
      else p.support = { kind: 'none' };
      ctx.events.push({ type: 'supportChosen', player: action.player, from: c.from });
      if (action.player !== s.turn) {
        s.phase = { name: 'support', chooser: s.turn };
        break;
      }
      const r = resolveBattle(s);
      ctx.state = r.state;
      ctx.events.push(...r.events);
      if (r.state.winner === null) endTurn(ctx);
      break;
    }
  }
  for (const pl of ctx.state.players) markHand(pl);
  return { state: ctx.state, events: ctx.events };
}

