/**
 * Every word the interface uses for game concepts, in one place. Change a term here and it changes
 * everywhere. The rules keep their original names in the code (digimon, dp, digivolve…); only what
 * the player reads is ours.
 */
import type { CrossEffect, Level } from '../../engine/cards/types';
import type { ActionKind } from './actions';
import { FACTIONS, factionOfSpecialty } from './factions';

export const TERMS = {
  /** The game's name (shown in the top bar and the browser tab). */
  game: 'Card Evolution',
  creature: 'Criatura',
  creatures: 'Criaturas',
  activeCreature: 'Criatura activa',
  /** The Battle Slot. */
  arena: 'Arena',
  evolution: 'Evolución',
  evolve: 'Evolucionar',
  evolves: 'evoluciona',
  /** Armor-digivolution: a partner evolving with its egg on entry. */
  eggEvolution: 'Evolución con huevo',
  eggEvolves: 'evoluciona con su huevo',
  levels: { R: 'Novato', C: 'Campeón', U: 'Perfecto', A: 'Armadura' } satisfies Record<Level, string>,
  levelShort: { R: 'N', C: 'C', U: 'P', A: 'A' } satisfies Record<Level, string>,
  /** DP */
  dp: 'PE',
  dpLong: 'Puntos de evolución',
  /** +P, what a card adds when charged */
  dpGiven: '+PE',
  /** DP Slot */
  dpZone: 'Reserva',
  /** Online Deck / Offline Pile */
  deck: 'Mazo',
  discard: 'Descarte',
  hand: 'Mano',
  hp: 'HP',
  /** Option card */
  supportCard: 'Carta de apoyo',
  supportShort: 'Apoyo',
  /** Digivolve Option card */
  evolutionCard: 'Carta de evolución',
  evolutionShort: 'Evol.',
  support: 'Soporte',
  supportEffect: 'Efecto de soporte',
  /** The ✕ special effect */
  instinctEffect: 'Efecto de Instinto',
  gamble: 'Apostar',
  partner: 'Compañero',
  /** Digi-Egg */
  egg: 'Huevo',
  /** Digi-Parts */
  parts: 'Reliquias',
  part: 'Reliquia',
  round: 'Ronda',
  rounds: 'Rondas',
  firstAttack: '1.er ataque',
  secondAttack: '2.º ataque',
  faction: 'Facción',
  habitat: 'Hábitat',
  element: 'Elemento',
  actions: { fury: 'Furia', technique: 'Técnica', instinct: 'Instinto' } satisfies Record<ActionKind, string>,
  phases: { prep: 'Preparación', dp: 'Puntos de evolución', evolutionCard: 'Carta de evolución', evolution: 'Evolución', battle: 'Batalla' },
};

export const levelName = (l: Level) => TERMS.levels[l];
export const factionName = (s: Parameters<typeof factionOfSpecialty>[0]) => FACTIONS[factionOfSpecialty(s)].name;

/**
 * A card's text as the disc wrote it, shown with our names: ◯ △ ✕ become Furia, Técnica and Instinto,
 * DP becomes PE. The card data itself is untouched.
 */
export function cardText(raw: string): string {
  return raw
    .replace(/◯/g, TERMS.actions.fury)
    .replace(/△/g, TERMS.actions.technique)
    .replace(/✕/g, TERMS.actions.instinct)
    .replace(/\bDP\b/g, TERMS.dp);
}

/** The special effect of the Instinto attack (the rules' cross effect). */
export function crossEffectLabel(e: CrossEffect): string {
  const A = TERMS.actions;
  switch (e) {
    case 'none':
      return 'Sin efecto';
    case 'firstAttack':
      return 'Primer golpe';
    case 'circleTo0':
      return `Anula ${A.fury}`;
    case 'triangleTo0':
      return `Anula ${A.technique}`;
    case 'crossTo0':
      return `Anula ${A.instinct}`;
    case 'counterCircle':
      return `Contra ${A.fury}`;
    case 'counterTriangle':
      return `Contra ${A.technique}`;
    case 'counterCross':
      return `Contra ${A.instinct}`;
    case 'crash':
      return 'Embestida';
    case 'eatUpHp':
      return 'Absorber HP';
    case 'jamming':
      return 'Interferencia';
    case 'foeX3Fire':
      return `×3 contra ${factionName('fire')}`;
    case 'foeX3Ice':
      return `×3 contra ${factionName('ice')}`;
    case 'foeX3Nature':
      return `×3 contra ${factionName('nature')}`;
    case 'foeX3Darkness':
      return `×3 contra ${factionName('darkness')}`;
    case 'foeX3Rare':
      return `×3 contra ${factionName('rare')}`;
  }
}
