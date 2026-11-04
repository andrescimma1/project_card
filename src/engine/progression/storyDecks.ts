/**
 * Story-mode deck rules and partner equipment (docs/research/progresion/03-companero-fusion-intercambio.md §2-§3).
 *   SUBSEG 0x801ECE70  can add a card: never an Armor card, at most 4 copies per deck
 *   SUBSEG 0x801F10D8  the Auto-Deck adds each partner from its slot once; 🟡 the editor is assumed to allow
 *                      one copy per partner slot as well (partner cards are not in the collection)
 *   SLUS 0x800495B4    no repeated Digi-Part type on a partner; type 1 (all attacks) excludes types 1-4
 *   SLUS 0x800496E4    a part is owned and free, or equipped on some partner (each part on one at a time)
 *   SLUS 0x80047E64    a Digi-Egg can be chosen only if received
 */
import { cards } from '../cards/db';
import { copiesOf } from './collection';
import type { SaveData } from './save';
import { progression } from './tables';

export const ARMOR_IDS: readonly number[] = [172, 173, 174, 176, 177, 178, 179, 180, 181, 185, 186, 188, 189];
const MAX_PER_DECK = 4;
const MAX_PARTS = 3;

export function availableCopies(save: SaveData, id: number): number {
  if (ARMOR_IDS.includes(id)) return 0;
  if (id >= 172 && id <= 190) return save.partners.some((p) => p.slot.id === id) ? 1 : 0;
  return copiesOf(save.collection, id);
}

/** Error message, or null if `id` can be added to `deck`. */
export function canAddStoryCard(save: SaveData, deck: number[], id: number): string | null {
  if (ARMOR_IDS.includes(id)) return 'Las cartas Armor solo aparecen por Digi-Egg.';
  if (deck.length >= 30) return 'El mazo ya tiene 30 cartas.';
  const n = deck.filter((x) => x === id).length;
  if (n >= MAX_PER_DECK) return `Máximo ${MAX_PER_DECK} copias por mazo.`;
  if (n >= availableCopies(save, id)) return `Solo tienes ${availableCopies(save, id)} de ${cards[id].name}.`;
  return null;
}

/** Equip Digi-Part `part` on partner slot `k`. Error message, or null when equipped. */
export function equipPart(save: SaveData, k: number, part: number): string | null {
  const slot = save.partners[k].slot;
  if (!save.ownedParts[part]) return 'Esa Digi-Part no la tienes.';
  if (save.partners.some((p) => p.slot.parts.includes(part))) return 'Esa Digi-Part ya está equipada.';
  if (slot.parts.length >= MAX_PARTS) return `Cada compañero lleva ${MAX_PARTS} Digi-Parts como máximo.`;
  const type = progression.digiParts[part].type;
  const types = slot.parts.map((p) => progression.digiParts[p].type);
  const clash = types.includes(type) || (type === 1 && types.some((t) => t >= 1 && t <= 4)) || (type >= 1 && type <= 4 && types.includes(1));
  if (clash) return 'No se puede repetir el tipo de Digi-Part en un compañero.';
  save.partners[k].slot = { ...slot, parts: [...slot.parts, part] };
  return null;
}

export function unequipPart(save: SaveData, k: number, part: number): void {
  const slot = save.partners[k].slot;
  save.partners[k].slot = { ...slot, parts: slot.parts.filter((p) => p !== part) };
}

/** Equip the Digi-Egg `egg` (index) of partner slot `k`. */
export function chooseEgg(save: SaveData, k: number, egg: number): string | null {
  const p = save.partners[k];
  const armor = p.eggs[egg];
  if (!armor) return 'Ese Digi-Egg no lo tienes.';
  p.slot = { ...p.slot, armorId: armor };
  return null;
}
