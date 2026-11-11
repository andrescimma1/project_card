/**
 * How the story looks: the map of the Tierras Quietas (where each town sits, the road, the fog), the
 * background of each town and the faces of the characters.
 *
 * Pictures are drawn with GPT (docs/arte/prompts-historia.md) and live in /story-art. Until one exists,
 * the screens fall back to a painted gradient (towns, map) or a monogram (faces).
 * Creatures show the art of their own card, cropped to the face.
 */
import type { SaveData } from '../../engine/progression/save';
import { cards } from '../../engine/cards/db';
import { AREAS, CHARACTERS, characterName, PORTRAITS } from '../../story/own/world';
import { visibleCities } from '../../story/present';
import { CUSTOM_ART } from '../art';

const ART_ROOT = '/story-art';

export interface Town {
  /** Spot on the map, as a fraction of its width and height. */
  at: [number, number];
  /** Colour of the town's card and of its painted fallback. */
  tint: string;
}

/** Index = town (CITIES). */
export const TOWNS: Town[] = [
  { at: [0.16, 0.78], tint: '#86ad59' }, // Aldea del Cruce
  { at: [0.29, 0.66], tint: '#d9583f' }, // Hornos Viejos
  { at: [0.21, 0.5], tint: '#4f7a3a' }, // Bosque Hondo
  { at: [0.4, 0.83], tint: '#6f9fc2' }, // Puerto Escarcha
  { at: [0.45, 0.59], tint: '#8c7a5e' }, // Chatarral
  { at: [0.57, 0.46], tint: '#5b4e78' }, // Ciudad sin Faroles
  { at: [0.78, 0.82], tint: '#e3b551' }, // Isla de Arena
  { at: [0.49, 0.32], tint: '#3f7e6c' }, // Templo Hundido
  { at: [0.64, 0.22], tint: '#9fb8cf' }, // Mirador de las Nubes
  { at: [0.75, 0.4], tint: '#a0705a' }, // Camino del Risco
  { at: [0.84, 0.48], tint: '#a48cc6' }, // Torre del Archivero
  { at: [0.92, 0.19], tint: '#7d7f86' }, // Torre sin Fin
];

/** Where the name of each region (AREAS) is written on the map. */
export const AREA_LABELS: [number, number][] = [
  [0.25, 0.94],
  [0.47, 0.13],
  [0.87, 0.6],
];

/** The road between towns, in the order the story opens them (the island is reached by sea). */
export const MAP_ROUTE = [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11];
/** The sea route to the island. */
export const SEA_ROUTE: [number, number] = [3, 6];

export const MAP_IMAGE = `${ART_ROOT}/mapa.webp`;
export const CARD_BACK = `${ART_ROOT}/dorso.webp`;
export const townBackground = (city: number) => `${ART_ROOT}/pueblos/${String(city).padStart(2, '0')}.webp`;

/** Pictures of the place cards, by menu id (CMD11.1 places): 1 player's room, 2 café, 3..6 arenas, 7 shop, 0 menu. */
export function placeImage(id: number): string {
  const name = id === 2 ? 'cafe' : id >= 3 && id <= 6 ? 'arena' : id === 7 ? 'tienda' : id === 1 ? 'sala' : id === 0 ? 'menu' : 'mapa';
  return `${ART_ROOT}/lugares/${name}.webp`;
}
export const LEAVE_IMAGE = `${ART_ROOT}/lugares/mapa.webp`;

/** Regions (AREAS index) still under the grey fog: none of their towns is on the map yet. */
export function foggedAreas(save: SaveData): number[] {
  const open = visibleCities(save);
  return AREAS.map((a, i) => (a.cities.some((c) => open.includes(c)) ? -1 : i)).filter((i) => i >= 0);
}

/* ---------- faces ---------- */

export interface Face {
  src: string;
  /** CSS background size and position that frame the face. */
  size: string;
  position: string;
  /** Shown darkened (the black forms reuse their normal form's art). */
  dark: boolean;
}

/** Black forms that borrow their normal form's art, darkened. */
const DARK_OF: Record<string, string> = { BlackWarGreymon: 'WarGreymon', BKMetalGarurumon: 'MetalGarurumon' };
/** Character keys whose card has another name. */
const CARD_NAME: Record<string, string> = { Omnimon: 'Omnimon ⟨e1⟩' };
/** Where the face is in a card's art, when it is not near the top centre. */
const FOCUS: Record<number, [x: number, y: number]> = {
  7: [0.72, 0.29], 9: [0.6, 0.2], 16: [0.78, 0.39], 18: [0.6, 0.31], 19: [0.44, 0.21], 20: [0.53, 0.23], 27: [0.7, 0.57],
  33: [0.62, 0.21], 109: [0.86, 0.33], 114: [0.64, 0.16], 166: [0.78, 0.62], 175: [0.65, 0.33], 190: [0.64, 0.35],
};
/** How much a card's art is enlarged to show the face, and the shape of the portrait frame (width / height). */
const FACE_ZOOM = 3;
const FRAME_RATIO = 6 / 7;

/** CSS background-position that puts the point (fx, fy) of a square picture at the centre of the frame. */
export function focusPosition([fx, fy]: [number, number], zoom = FACE_ZOOM, ratio = FRAME_RATIO): string {
  const axis = (f: number, k: number) => Math.min(100, Math.max(0, Math.round(((0.5 - f * k) / (1 - k)) * 100)));
  return `${axis(fx, zoom)}% ${axis(fy, zoom * ratio)}%`;
}

const portrait = (file: string): Face => ({ src: `${ART_ROOT}/caras/${file}.webp`, size: 'cover', position: 'center 30%', dark: false });

function cardFace(key: string, dark: boolean): Face | null {
  const name = CARD_NAME[key] ?? key;
  const card = cards.find((c) => c.name === name && CUSTOM_ART[c.id]);
  if (!card) return null;
  return { src: CUSTOM_ART[card.id]!.file, size: `${FACE_ZOOM * 100}%`, position: focusPosition(FOCUS[card.id] ?? [0.5, 0.32]), dark };
}

/** The face of a character (its key in CHARACTERS), or null when it has none yet. */
export function faceOf(key: string): Face | null {
  if (PORTRAITS[key]) return portrait(PORTRAITS[key]);
  if (DARK_OF[key]) return cardFace(DARK_OF[key], true);
  return cardFace(key, false);
}

/** The player's face: one of the apprentices drawn for it. */
export const AVATARS = 4;
export const avatarFace = (i: number): Face => portrait(`aprendiz-${(i % AVATARS) + 1}`);

const BY_NAME = new Map<string, string>();
for (const key of Object.keys(CHARACTERS)) {
  if (!key) continue;
  for (const l of ['es', 'en'] as const) BY_NAME.set(characterName(key, l), key);
}

/** The character a dialogue header names (our name, in either language), or null. */
export const speakerKey = (name: string): string | null => BY_NAME.get(name.trim()) ?? null;
