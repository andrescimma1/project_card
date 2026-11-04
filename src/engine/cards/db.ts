import raw from '../../data/cards.json';
import type { Card, CardDatabase, CrossEffect, DigimonCard } from './types';

export const cardDb = raw as unknown as CardDatabase;
export const cards: Card[] = cardDb.cards;

export const byId = new Map(cards.map((c) => [c.id, c]));

export function isDigimon(c: Card): c is DigimonCard {
  return c.kind === 'digimon';
}

export const CROSS_EFFECT_LABEL: Record<CrossEffect, string> = {
  none: 'Sin efecto',
  firstAttack: '1st Attack',
  circleTo0: '◯ to 0',
  triangleTo0: '△ to 0',
  crossTo0: '✕ to 0',
  counterCircle: '◯ Counter',
  counterTriangle: '△ Counter',
  counterCross: '✕ Counter',
  crash: 'Crash',
  eatUpHp: 'Eat-up HP',
  jamming: 'Jamming',
  foeX3Fire: 'Fire Foe X3',
  foeX3Ice: 'Ice Foe X3',
  foeX3Nature: 'Nature Foe X3',
  foeX3Darkness: 'Darkness Foe X3',
  foeX3Rare: 'Rare Foe X3',
};
