/**
 * Battle flags read by the EXP bonuses (player +0x110, docs/research/progresion/02-resultados-y-guardado.md §2.2).
 * The engine sets them at the same points as the game; 🟡 marks moments inferred from the bonus name.
 */
import { cards } from '../cards/db';
import { SPECIALTY_CODE } from '../ai/view';
import { PARTNER_IDS } from './partner';
import type { PlayerState } from './types';

export const BONUS_BIT = {
  attackCircle: 0, // attack used in a hit (KAWSEG 0x801E7D48)
  attackTriangle: 1,
  attackCross: 2,
  digivolved: 3, // 🟡 digivolve or Armor-digivolve (SLUS 0x8003538C, 0x80036A80, 0x80036E08)
  supportUsed: 4, // a support was played, Gamble included (0x801E6D18)
  changedHand: 5, // 🟡 "Change all Cards" (state 5, SLUS 0x80034A0C)
  fourOfAKind: 6, // 4 equal cards in hand (0x801FA780)
  downZeroTwo: 7, // was 0-2 down (SLUS 0x80038A64)
  upTwoZero: 8, // was 2-0 up (SLUS 0x80038AB8)
  damageFever: 9, // dealt a multiple of 1110 (0x801E7C74)
  hpFever: 10, // own HP ≠ 0 and a multiple of 1110 (0x801E794C)
  threePartnersInHand: 11, // (0x801FA8BC)
  partnerEntries: 12, // 2-bit counter: partner or its Armor entered / changed in the Battle Slot (0x801FA668)
  partnerRound: 14, // a round won by the partner or its Armor (SLUS 0x80038B30)
  nonGambleSupport: 16, // a support other than Gamble, or none, was resolved (0x801E6CF8)
  finalRoundOwnGamble: 17, // the winning round was won with a Gamble (SLUS 0x80038C54)
  finalRoundRivalGamble: 18, // the losing round was lost to a rival Gamble
  ultimateKo: 19, // a KO made by a level-U Digimon (0x801ECF98)
  justEnough: 22, // the hit that won the 3rd round left the rival at exactly 0 HP (0x801E79CC)
  specialtySeen: 23, // 5 bits: specialties the active Digimon had (🟡 recorded at each battle)
  partnerNormalDigivolve: 29, // 🟡 a digivolution with a partner at the bottom of a 3-card stack (0x801FA6B4)
} as const;

export const hasFlag = (p: PlayerState, bit: number) => ((p.bonusFlags >>> bit) & 1) === 1;
export function setFlag(p: PlayerState, bit: number): void {
  p.bonusFlags = (p.bonusFlags | (1 << bit)) >>> 0;
}
export const partnerEntries = (p: PlayerState) => (p.bonusFlags >>> BONUS_BIT.partnerEntries) & 3;
export function countPartnerEntry(p: PlayerState): void {
  const n = Math.min(partnerEntries(p) + 1, 3);
  p.bonusFlags = ((p.bonusFlags & ~(3 << BONUS_BIT.partnerEntries)) | (n << BONUS_BIT.partnerEntries)) >>> 0;
}

export function markSpecialty(p: PlayerState): void {
  setFlag(p, BONUS_BIT.specialtySeen + SPECIALTY_CODE[p.specialty]);
}

/** HP fever: own HP ≠ 0 and a multiple of 1110. */
export function markHp(p: PlayerState, hp: number): void {
  if (hp !== 0 && hp % 1110 === 0) setFlag(p, BONUS_BIT.hpFever);
}

/** Hand checks: 4 equal cards, 3 partner cards. */
export function markHand(p: PlayerState): void {
  const ids = p.hand.filter((r): r is number => r !== null).map((r) => p.cards[r]);
  if (ids.length === 4 && ids.every((id) => id === ids[0])) setFlag(p, BONUS_BIT.fourOfAKind);
  if (ids.filter((id) => PARTNER_IDS.includes(id)).length >= 3) setFlag(p, BONUS_BIT.threePartnersInHand);
}

export const isUltimate = (id: number) => {
  const c = cards[id];
  return c.kind === 'digimon' && c.level === 'U';
};
