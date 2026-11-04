/**
 * Partner cards (docs/research/07-progresion.md §5).
 *   SLUS 0x8006E518  the 6 partners · 0x8006E520  their Armor per Digi-Egg (0 = none)
 *   SLUS 0x8003F9EC  slots for the partner cards of a CPU deck (level 1, deck Digi-Egg equipped)
 *   SLUS 0x80048230  rebuild of the partner copy and of its Armor copy
 *   SLUS 0x80046A38  deck instances of a partner use the slot copy instead of the ROM record
 */
import { cards } from '../cards/db';
import { CROSS_EFFECT_BY_CODE } from '../cards/romTables';
import type { AttackSlot, DigimonCard } from '../cards/types';
import { progression } from '../progression/tables';
import type { DigiPartDef } from '../progression/decodeTables';
import type { PartnerSlot } from './types';

export const PARTNER_IDS: readonly number[] = [175, 182, 190, 184, 183, 187];
/** Armor card id per partner and Digi-Egg index (0 = that egg does not exist). */
export const PARTNER_ARMORS: readonly (readonly number[])[] = [
  [172, 185, 173],
  [179, 188, 0],
  [189, 176, 0],
  [181, 178, 0],
  [180, 174, 0],
  [186, 177, 0],
];
const MAX_SLOTS = 3;

export function newPartnerSlot(id: number, egg: number | null = null): PartnerSlot {
  const armor = egg === null ? 0 : (PARTNER_ARMORS[PARTNER_IDS.indexOf(id)]?.[egg] ?? 0);
  return { id, armorId: armor || null, level: 1, bonus: [0, 0, 0, 0], parts: [] };
}

/** Slots for the partner cards of a deck, in deck order; `partnerEgg` is DECK2 +0x6D (0 = none). */
export function partnersFromDeck(deck: number[], partnerEgg: number): PartnerSlot[] {
  const slots: PartnerSlot[] = [];
  for (const id of deck) {
    if (!PARTNER_IDS.includes(id) || slots.some((s) => s.id === id) || slots.length >= MAX_SLOTS) continue;
    slots.push(newPartnerSlot(id, partnerEgg > 0 ? partnerEgg - 1 : null));
  }
  return slots;
}

/** Slot index used by each card instance of a deck (0x80046A38). */
export function bindPartners(deck: number[], slots: PartnerSlot[]): (number | null)[] {
  return deck.map((id) => {
    const k = slots.findIndex((s) => s.id === id);
    return k < 0 ? null : k;
  });
}

const COUNTER_OR_CRASH = new Set(['counterCircle', 'counterTriangle', 'counterCross', 'crash']);
const SLOTS: AttackSlot[] = ['circle', 'triangle', 'cross'];

/**
 * Type 7 (0x80048C1C..0x800490E8): the partner's conditions and actions are disabled; template condition
 * b1 (1-based) goes to condition 0 with the part value as operand-0 literal; templates b2, b2+1, … (b3 of
 * them) go to actions 0.. with the value as operand-2 literal. Text and support speed change on both
 * copies, but the Armor keeps its own program (the code never writes it).
 */
function applySupportPart(r: DigimonCard, a: DigimonCard | null, d: DigiPartDef): void {
  const prog = r.support.program;
  for (const c of prog.conditions) c.enabled = false;
  for (const x of prog.actions) x.enabled = false;
  if (d.b1 !== 0) {
    const c = structuredClone(progression.supportTemplates.conditions[d.b1 - 1]);
    c.operands[0] = { ...c.operands[0], value: d.value };
    prog.conditions[0] = c;
  }
  if (d.b2 !== 0 && d.b3 !== 0) {
    for (let j = 0; j < d.b3; j++) {
      const x = structuredClone(progression.supportTemplates.actions[d.b2 - 1 + j]);
      x.operands[2] = { ...x.operands[2], value: d.value };
      prog.actions[j] = x;
    }
  }
  for (const c of a ? [r, a] : [r]) {
    c.support = { ...c.support, textRaw: [d.text], text: d.text };
    c.supportSpeed = d.speed as DigimonCard['supportSpeed'];
  }
}

/** Effect switch of 0x80048230 (table 0x8001274C), applied to the partner copy r and its Armor copy a. */
function applyPart(r: DigimonCard, a: DigimonCard | null, d: DigiPartDef): void {
  const both = (f: (c: DigimonCard) => void) => {
    f(r);
    if (a) f(a);
  };
  switch (d.type) {
    case 0:
      return both((c) => (c.hp += d.value));
    case 1:
      return both((c) => SLOTS.forEach((s) => (c.attacks[s].power += d.value)));
    case 2:
    case 3:
    case 4:
      return both((c) => (c.attacks[SLOTS[d.type - 2]].power += d.value));
    case 5:
      return both((c) => {
        c.crossEffect = CROSS_EFFECT_BY_CODE[d.b1];
        c.attacks.cross.power = d.value === 0 ? 0 : c.attacks.cross.power + d.value;
      });
    case 6:
      return both((c) => (c.dpGiven += d.value));
    case 7:
      return applySupportPart(r, a, d);
    default:
      return; // type 8: EXP % / rare % of the slot (partnerBoosts)
  }
}

function rebuild(base: DigimonCard, armorBase: DigimonCard | null, slot: PartnerSlot): { card: DigimonCard; armor: DigimonCard | null } {
  const r = structuredClone(base);
  const a = armorBase ? structuredClone(armorBase) : null;
  const all = a ? [r, a] : [r];
  for (const c of all) if (c.attacks.cross.power === 0) c.attacks.cross.power = 100; // 0x800484F4
  for (const c of all) {
    c.hp += slot.bonus[0];
    SLOTS.forEach((s, i) => (c.attacks[s].power += slot.bonus[i + 1]));
  }
  for (const id of slot.parts) applyPart(r, a, progression.digiParts[id]);
  for (const c of all) for (const s of SLOTS) if (c.attacks[s].power < 0) c.attacks[s].power = 0;
  for (const c of all) if (COUNTER_OR_CRASH.has(c.crossEffect)) c.attacks.cross.power = 0; // 0x8004933C
  return { card: r, armor: a };
}

/** EXP % and rare-card % of a slot: Σ of its type-8 parts (+0x313 / +0x314). */
export function partnerBoosts(slot: PartnerSlot): { expPercent: number; rarePercent: number } {
  let expPercent = 0;
  let rarePercent = 0;
  for (const id of slot.parts) {
    const d = progression.digiParts[id];
    if (d.type !== 8) continue;
    if (d.b1 === 0) expPercent += d.value;
    else rarePercent += d.value;
  }
  return { expPercent, rarePercent };
}

const memo = new Map<string, { card: DigimonCard; armor: DigimonCard | null }>();

/** The partner copy and its Armor copy (null without an equipped Digi-Egg). */
export function partnerCards(slot: PartnerSlot): { card: DigimonCard; armor: DigimonCard | null } {
  const key = JSON.stringify(slot);
  let hit = memo.get(key);
  if (!hit) {
    const base = cards[slot.id];
    const armor = slot.armorId === null ? null : cards[slot.armorId];
    if (base.kind !== 'digimon' || (armor && armor.kind !== 'digimon')) throw new Error(`Not a partner: ${slot.id}`);
    hit = rebuild(base, armor as DigimonCard | null, slot);
    memo.set(key, hit);
  }
  return hit;
}
