/**
 * Digivolution rules — port of the player's check KAWSEG 0x801E9F5C and the stat loader
 * SLUS 0x8004080C. Level codes: R 0, A 1, C 2, U 3 ("next level" of R is C).
 */
import type { DigimonCard, DigivolveOptionCard, Level } from '../cards/types';
import { battleStat, dpTotal } from '../rules/primitives';
import { activeCard, cardOf } from './effects';
import type { CardRef, GameState, PlayerId, PlayerState } from './types';
import { cardsIn, count } from './zones';

const LEVEL_CODE: Record<Level, number> = { R: 0, A: 1, C: 2, U: 3 };

export function playerDp(p: PlayerState): number {
  return dpTotal(cardsIn(p.dp).map((r) => {
    const c = cardOf(p, r);
    return c.kind === 'digimon' ? c.dpGiven : 0;
  }));
}

/** "Abnormal state" bits = level code the Digimon entered with; R (0) is normal. */
export function isAbnormal(p: PlayerState): boolean {
  return p.enteredAs !== null && p.enteredAs !== 'R';
}

/** Load HP/powers/specialty of the card now on top of the Battle Slot. */
export function loadStats(p: PlayerState, card: DigimonCard, enteredAs: Level | null): void {
  const entered = enteredAs === 'R' ? null : enteredAs;
  p.hp = battleStat(card.hp, entered);
  p.powers = [battleStat(card.attacks.circle.power, entered), battleStat(card.attacks.triangle.power, entered), battleStat(card.attacks.cross.power, entered)];
  p.specialty = card.specialty;
  p.enteredAs = entered;
  p.settled = false; // flag bit 30 is cleared by every stat load (SLUS 0x80040A1C)
}

export function digivolveOptionOf(p: PlayerState): DigivolveOptionCard | null {
  if (p.digivolveOption === null) return null;
  const c = cardOf(p, p.digivolveOption);
  return c.kind === 'digivolve' ? c : null;
}

/** Can the player digivolve its active Digimon into `target` (a Digimon card in hand)? */
export function canDigivolve(state: GameState, player: PlayerId, target: CardRef): boolean {
  const p = state.players[player];
  const active = activeCard(p);
  if (!active || active.kind !== 'digimon') return false;
  if (!p.hand.includes(target)) return false;
  const t = cardOf(p, target);
  if (t.kind !== 'digimon') return false;

  const cur = LEVEL_CODE[active.level];
  const next = (cur === 0 ? 1 : cur) + 1;
  const tl = LEVEL_CODE[t.level];
  const sameSpec = t.specialty === p.specialty; // CURRENT specialty
  const dp = playerDp(p);
  const req = t.dpRequired;
  const option = digivolveOptionOf(p);

  if (!option) return cur !== 1 && sameSpec && tl === next && dp >= req;
  switch (option.digivolveType) {
    case 'special':
      return cur !== 1 && tl === next && dp + 20 >= req;
    case 'warp':
      return cur === 0 && sameSpec && tl === 3 && dp >= req;
    case 'speed':
      return cur !== 1 && !isAbnormal(p) && sameSpec && tl === next;
    case 'mutant':
      return tl === cur && dp >= req;
    case 'download':
      return true;
    case 'armorCrush':
      return cur === 1 && tl >= 2 && sameSpec && dp >= req;
    case 'digiDevolve':
    case 'deArmor':
      return false; // resolved when played, they have no hand target
  }
}

/** Digi-devolve / De-Armor preconditions (KAWSEG 0x801EA29C / 0x801EA2F8). */
export function canPlayDevolve(p: PlayerState, type: 'digiDevolve' | 'deArmor'): boolean {
  const active = activeCard(p);
  if (!active || active.kind !== 'digimon') return false;
  const stacked = count(p.stack) >= 2;
  return type === 'digiDevolve' ? active.level !== 'A' && stacked : active.level === 'A' && stacked;
}
