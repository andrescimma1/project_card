/**
 * Every word the interface uses for game concepts, in the current language (src/i18n/locales/<lang>/terms.ts).
 * `TERMS.dp`, `TERMS.actions.fury`… read the current language on every access. The rules keep their
 * original names in the code (digimon, dp, digivolve…); only what the player reads is ours.
 */
import type { CrossEffect, Level } from '../../engine/cards/types';
import { getLocale, m, type Messages } from '../../i18n';
import { CARD_TEXTS } from '../../i18n/cards';
import { FACTIONS, factionOfSpecialty } from './factions';

type Terms = Messages['terms'];

/** The current language's terms (always fresh: never cache it in a module constant). */
export const TERMS: Terms = new Proxy({} as Terms, {
  get: (_, key) => m().terms[key as keyof Terms],
});

export const levelName = (l: Level) => TERMS.levels[l];
export const factionName = (s: Parameters<typeof factionOfSpecialty>[0]) => FACTIONS[factionOfSpecialty(s)].name;

/**
 * A card's text in the current language and our vocabulary. The card data (the disc's text) is the key;
 * a text not translated yet is shown with our names: ◯ △ ✕ become the action kinds, DP the points.
 */
export function cardText(raw: string): string {
  const own = CARD_TEXTS[getLocale()][raw];
  if (own) return own;
  return raw
    .replace(/◯/g, TERMS.actions.fury)
    .replace(/△/g, TERMS.actions.technique)
    .replace(/✕/g, TERMS.actions.instinct)
    .replace(/\bDP\b/g, TERMS.dp);
}

/** The special effect of the Instinto attack (the rules' cross effect). */
export function crossEffectLabel(e: CrossEffect): string {
  const A = TERMS.actions;
  const C = TERMS.crossEffects;
  switch (e) {
    case 'none':
      return C.none;
    case 'firstAttack':
      return C.firstAttack;
    case 'circleTo0':
      return C.nullify(A.fury);
    case 'triangleTo0':
      return C.nullify(A.technique);
    case 'crossTo0':
      return C.nullify(A.instinct);
    case 'counterCircle':
      return C.counter(A.fury);
    case 'counterTriangle':
      return C.counter(A.technique);
    case 'counterCross':
      return C.counter(A.instinct);
    case 'crash':
      return C.crash;
    case 'eatUpHp':
      return C.eatUpHp;
    case 'jamming':
      return C.jamming;
    case 'foeX3Fire':
      return C.foeX3(factionName('fire'));
    case 'foeX3Ice':
      return C.foeX3(factionName('ice'));
    case 'foeX3Nature':
      return C.foeX3(factionName('nature'));
    case 'foeX3Darkness':
      return C.foeX3(factionName('darkness'));
    case 'foeX3Rare':
      return C.foeX3(factionName('rare'));
  }
}
