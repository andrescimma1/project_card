/**
 * EXP bonuses after a battle against the CPU — KAWSEG 0x801FAA54 over the table 0x801FC300 (32 entries),
 * evaluated in table order (docs/research/progresion/02-resultados-y-guardado.md §2.2). A loss jumps to
 * entries 21-23 and then to the shared ones (24-31). Lucky Name (30) is skipped by the code.
 */
import { cards } from '../cards/db';
import { BONUS_BIT, hasFlag, partnerEntries } from '../game/bonusFlags';
import type { GameState, PlayerId } from '../game/types';
import { count, free } from '../game/zones';
import type { BonusDef } from './decodeTables';
import { progression } from './tables';

export interface BonusResult {
  granted: BonusDef[];
  /** Rival EXP (only when winning) + Σ bonus EXP; the slot EXP % is applied per partner afterwards. */
  exp: number;
}

const JEWELS = Array.from({ length: 12 }, (_, i) => 273 + i);

export function evaluateBonuses(state: GameState, player: PlayerId, rivalExp: number): BonusResult {
  const me = state.players[player];
  const foe = state.players[player === 0 ? 1 : 0];
  const f = (bit: number) => hasFlag(me, bit);
  const handEmpty = (p: typeof me) => count(p.hand) === 0;
  const deck = me.cards;
  const win = state.winner === player;
  const ids = new Set<number>();
  const grant = (id: number, cond: boolean) => cond && ids.add(id);

  if (win) {
    grant(0, !f(BONUS_BIT.attackTriangle) && !f(BONUS_BIT.attackCross));
    grant(1, !f(BONUS_BIT.attackCircle) && !f(BONUS_BIT.attackCross));
    grant(2, !f(BONUS_BIT.attackCircle) && !f(BONUS_BIT.attackTriangle));
    grant(3, !f(BONUS_BIT.nonGambleSupport));
    grant(4, !ids.has(3) && f(BONUS_BIT.finalRoundOwnGamble));
    grant(5, !f(BONUS_BIT.supportUsed));
    grant(6, !f(BONUS_BIT.digivolved));
    grant(7, !f(BONUS_BIT.changedHand));
    grant(8, f(BONUS_BIT.fourOfAKind));
    grant(9, count(me.online) > 0 && count(foe.online) === 0);
    grant(10, f(BONUS_BIT.partnerRound));
    grant(11, foe.rounds === 0);
    grant(12, f(BONUS_BIT.downZeroTwo));
    grant(13, me.rounds === 3 && foe.rounds === 2 && count(me.online) === 0 && count(foe.online) === 0 && handEmpty(me) && handEmpty(foe));
    grant(14, !ids.has(13) && count(me.online) === 0 && handEmpty(me));
    grant(15, f(BONUS_BIT.ultimateKo));
    grant(16, deck.filter((id) => cards[id].kind !== 'digimon').length >= 25);
    grant(17, free(me.dp) === 0);
    grant(18, count(me.online) === 7);
    grant(19, f(BONUS_BIT.justEnough));
    grant(20, JEWELS.every((j) => deck.includes(j)));
  } else {
    grant(21, f(BONUS_BIT.upTwoZero));
    grant(22, f(BONUS_BIT.finalRoundRivalGamble));
    grant(23, me.rounds === 0);
  }
  grant(24, [0, 1, 2, 3, 4].every((s) => f(BONUS_BIT.specialtySeen + s)));
  grant(25, f(BONUS_BIT.damageFever));
  grant(26, f(BONUS_BIT.hpFever));
  grant(27, f(BONUS_BIT.threePartnersInHand));
  grant(28, partnerEntries(me) === 3);
  grant(29, f(BONUS_BIT.partnerNormalDigivolve));
  // 30 Lucky Name: the evaluator jumps over it (KAWSEG 0x801FB34C)
  grant(31, ids.size >= 7);

  const granted = progression.bonuses.filter((b) => ids.has(b.id));
  return { granted, exp: (win ? rivalExp : 0) + granted.reduce((s, b) => s + b.exp, 0) };
}
