/**
 * Partner EXP and levels (docs/research/progresion/02-resultados-y-guardado.md §2.3,
 * 03-companero-fusion-intercambio.md §2.3):
 *   SLUS 0x80049934  EXP needed to leave level L: (L+1)·(L+3), cumulative, 9999 at 98 → 99
 *   KAWSEG 0x801F4A24  EXP is added one point at a time; each threshold crossed is a new level
 *   SLUS 0x80049840  the new level teaches the part whose level for this partner equals it (if not owned)
 *   SLUS 0x8004994C  every 5 levels: rand() % 4 → +10 to HP, ◯, △ or ✕
 */
import { PARTNER_IDS } from '../game/partner';
import type { PartnerSlot } from '../game/types';
import { progression } from './tables';

export const MAX_LEVEL = 99;
export const MAX_EXP = 9999;

/** A partner slot of the save with its cumulative EXP (+0x28A). */
export interface PartnerProgress {
  slot: PartnerSlot;
  exp: number;
}

export const expNeeded = (level: number) => (level + 1) * (level + 3);

/** Battle EXP for one slot: T + ⌊T · EXP% / 100⌋ (0x801F4EAC). */
export const battleExpGain = (total: number, expPercent: number) => total + Math.floor((total * expPercent) / 100);

export interface ExpResult {
  levelsGained: number;
  /** Digi-Parts learned (now owned). */
  learned: number[];
}

/** Add EXP point by point. `ownedParts` (save+0x3C, 128 flags) is updated with the parts learned. */
export function gainExp(p: PartnerProgress, amount: number, ownedParts: boolean[], rand: { next(): number }): ExpResult {
  const idx = PARTNER_IDS.indexOf(p.slot.id);
  const out: ExpResult = { levelsGained: 0, learned: [] };
  for (let i = 0; i < amount && p.slot.level < MAX_LEVEL; i++) {
    p.exp = Math.min(p.exp + 1, MAX_EXP);
    if (p.exp < expNeeded(p.slot.level)) continue;
    p.slot = { ...p.slot, level: p.slot.level + 1 };
    out.levelsGained++;
    const part = progression.digiParts.find((d) => d.levels[idx] === p.slot.level);
    if (part && !ownedParts[part.id]) {
      ownedParts[part.id] = true;
      out.learned.push(part.id);
    }
    if (p.slot.level % 5 === 0) {
      const bonus = [...p.slot.bonus] as PartnerSlot['bonus'];
      bonus[rand.next() % 4] += 10;
      p.slot = { ...p.slot, bonus };
    }
  }
  return out;
}
