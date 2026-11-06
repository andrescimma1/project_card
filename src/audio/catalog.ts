/**
 * The sound catalogue: every sound of the game, what it is for, how often it may repeat, and which
 * cue plays it. All sounds are synthesised in code (audio/sfx/recipes.ts), so nothing is copied from
 * the original game. A recorded file can replace any of them later through `file`.
 * The written version of this table is docs/audio.md (a test keeps both in step).
 */
import type { AttackSlot, CrossEffect } from '../engine/cards/types';
import type { PlayerId } from '../engine/game/types';
import type { CueData, CueName } from './bus';

export type SoundGroup = 'ui' | 'card' | 'combat' | 'evolution' | 'result';

export interface SoundDef {
  group: SoundGroup;
  /** The action it answers (Spanish, shown in the docs). */
  action: string;
  /** Versions of the sound; each one is rendered ahead of time. */
  variants: string[];
  throttleMs: number;
  maxVoices: number;
  /** 0 interface, 1 cards, 2 combat / evolution / results. */
  priority: number;
  /** Base level (the buses add the player's volumes on top). */
  gain: number;
  /** Strong impacts: softer with "reduce intense effects". */
  intense?: boolean;
  /** A recorded file (served from /public) that replaces the synthesis. */
  file?: string;
}

const ui = (action: string, o: Partial<SoundDef> = {}): SoundDef => ({ group: 'ui', action, variants: [], throttleMs: 40, maxVoices: 2, priority: 0, gain: 0.8, ...o });
const card = (action: string, o: Partial<SoundDef> = {}): SoundDef => ({ group: 'card', action, variants: [], throttleMs: 30, maxVoices: 4, priority: 1, gain: 0.9, ...o });
const combat = (action: string, o: Partial<SoundDef> = {}): SoundDef => ({ group: 'combat', action, variants: [], throttleMs: 60, maxVoices: 2, priority: 2, gain: 1, ...o });
const evo = (action: string, o: Partial<SoundDef> = {}): SoundDef => ({ group: 'evolution', action, variants: [], throttleMs: 100, maxVoices: 1, priority: 2, gain: 1, ...o });
const result = (action: string, o: Partial<SoundDef> = {}): SoundDef => ({ group: 'result', action, variants: [], throttleMs: 300, maxVoices: 1, priority: 2, gain: 1, ...o });

/** ✕ families: each special effect colours the ✕ attack and the ability sound. */
export const CROSS_VARIANTS = ['plain', 'swift', 'null', 'counter', 'crash', 'drain', 'jam', 'fire', 'ice', 'nature', 'dark', 'rare'];

const DEFS = {
  // interface
  'ui.hover': ui('Pasar el cursor o el foco del teclado por un botón', { gain: 0.5, throttleMs: 35 }),
  'ui.nav': ui('Navegar entre menús y opciones'),
  'ui.confirm': ui('Confirmar una selección o pulsar un botón principal'),
  'ui.cancel': ui('Cancelar, cerrar, saltar o volver'),
  'ui.tab': ui('Cambiar de pestaña o de vista'),
  'ui.open': ui('Abrir un panel (registro, carta, ajustes)'),
  'ui.close': ui('Cerrar un panel'),
  'ui.error': ui('Mensaje de error', { throttleMs: 300, maxVoices: 1 }),
  'ui.denied': ui('Acción no permitida (botón desactivado)', { throttleMs: 150, maxVoices: 1 }),
  'ui.phase': ui('Cartel de fase (Preparación, Digivolución, Batalla)', { throttleMs: 400, maxVoices: 1, priority: 1 }),
  // cards
  'card.hover': card('Pasar el cursor por una carta que se puede jugar', { gain: 0.6, throttleMs: 60, maxVoices: 2, priority: 0 }),
  'card.draw': card('Robar una carta del mazo'),
  'card.select': card('Seleccionar una carta de la mano'),
  'card.move': card('Mover una carta de una zona a otra'),
  'card.place': card('Colocar una carta en el tablero'),
  'card.set': card('Dejar una carta de soporte boca abajo'),
  'card.discard': card('Descartar cartas al Offline Pile'),
  'card.shuffle': card('Barajar el mazo', { maxVoices: 1, throttleMs: 300 }),
  'card.flip': card('Revelar una carta (soporte del rival, apuesta)'),
  'card.support': card('Activar una carta de soporte o una Option', { variants: ['support', 'option'], priority: 2 }),
  'card.dp': card('Cargar DP (más brillante cuanto más DP)', { variants: ['low', 'mid', 'high'] }),
  'card.option': card('Jugar una Digivolve Option'),
  // combat
  'combat.select.circle': combat('Confirmar el ataque ◯', { throttleMs: 120 }),
  'combat.select.triangle': combat('Confirmar el ataque △', { throttleMs: 120 }),
  'combat.select.cross': combat('Confirmar el ataque ✕', { throttleMs: 120 }),
  'combat.select': combat('Confirmar un ataque que queda oculto (2 jugadores)', { throttleMs: 120 }),
  'combat.locked': combat('El rival fijó su ataque', { gain: 0.8 }),
  'combat.reveal': combat('Revelación de los ataques de ambos'),
  'combat.clash': combat('Inicio del enfrentamiento', { intense: true }),
  'combat.order': combat('Cambia quién ataca primero'),
  'combat.circle': combat('Ataque ◯: potente, de impacto fuerte', { intense: true }),
  'combat.triangle': combat('Ataque △: rápido y técnico'),
  'combat.cross': combat('Ataque ✕: distintivo, cambia con su efecto especial', { variants: CROSS_VARIANTS }),
  'combat.impact': combat('Golpe recibido (según el ataque; más grave si es el golpe final)', { variants: ['circle', 'triangle', 'cross', 'plain', 'lethal'], intense: true }),
  'combat.block': combat('Ataque bloqueado: el golpe no hace daño'),
  'combat.counter': combat('Contraataque (✕ Counter)'),
  'combat.ability': combat('Activación de habilidad (efecto ✕, Crash)', { variants: CROSS_VARIANTS }),
  'combat.voided': combat('Efecto anulado'),
  'combat.fizzle': combat('Efecto sin la condición cumplida'),
  'combat.statUp': combat('Sube un poder ◯ △ ✕', { gain: 0.8 }),
  'combat.statDown': combat('Baja un poder ◯ △ ✕', { gain: 0.8 }),
  'combat.heal': combat('Recuperación de HP'),
  'combat.ko': combat('Digimon derrotado', { intense: true }),
  'combat.devolve': combat('Un Digimon retrocede de nivel'),
  // results
  'result.round': result('Ronda ganada (o perdida, si la gana el rival)', { variants: ['win', 'lose'] }),
  'result.victory': result('Victoria'),
  'result.defeat': result('Derrota'),
  // evolution
  'evo.start': evo('Evolución: comienza la animación'),
  'evo.charge': evo('Evolución: la energía se acumula'),
  'evo.burst': evo('Evolución: destello de transición', { intense: true }),
  'evo.complete': evo('Evolución: transformación completada'),
  'evo.stat': evo('Evolución: se actualiza una estadística (HP, ◯, △, ✕)', { variants: ['0', '1', '2', '3'], maxVoices: 2, throttleMs: 40 }),
} satisfies Record<string, SoundDef>;

export type SoundId = keyof typeof DEFS;
export const SOUNDS: Record<SoundId, SoundDef> = DEFS;

export interface SoundRequest {
  id: SoundId;
  variant?: string;
  /** Multiplies the sound's level. */
  gain?: number;
  /** −1 left … 1 right. The player's Digimon stands left of centre, the rival's right. */
  pan?: number;
}

export function crossVariant(effect?: CrossEffect): string {
  switch (effect) {
    case 'firstAttack':
      return 'swift';
    case 'circleTo0':
    case 'triangleTo0':
    case 'crossTo0':
      return 'null';
    case 'counterCircle':
    case 'counterTriangle':
    case 'counterCross':
      return 'counter';
    case 'crash':
      return 'crash';
    case 'eatUpHp':
      return 'drain';
    case 'jamming':
      return 'jam';
    case 'foeX3Fire':
      return 'fire';
    case 'foeX3Ice':
      return 'ice';
    case 'foeX3Nature':
      return 'nature';
    case 'foeX3Darkness':
      return 'dark';
    case 'foeX3Rare':
      return 'rare';
    default:
      return 'plain';
  }
}

const pan = (p?: PlayerId) => (p === undefined ? 0 : p === 0 ? -0.28 : 0.28);
/** The rival's card handling sits a little further back. */
const seat = (p?: PlayerId) => (p === 1 ? 0.75 : 1);

const SELECT: Record<AttackSlot, SoundId> = { circle: 'combat.select.circle', triangle: 'combat.select.triangle', cross: 'combat.select.cross' };
const SWING: Record<AttackSlot, SoundId> = { circle: 'combat.circle', triangle: 'combat.triangle', cross: 'combat.cross' };

const simple: Partial<Record<CueName, SoundId>> = {
  UI_HOVER: 'ui.hover',
  UI_CONFIRM: 'ui.confirm',
  UI_CANCEL: 'ui.cancel',
  UI_NAV: 'ui.nav',
  UI_TAB: 'ui.tab',
  PANEL_OPEN: 'ui.open',
  PANEL_CLOSE: 'ui.close',
  UI_ERROR: 'ui.error',
  UI_DENIED: 'ui.denied',
  PHASE_BANNER: 'ui.phase',
  CARD_HOVER: 'card.hover',
  CARD_SELECTED: 'card.select',
  DECK_SHUFFLED: 'card.shuffle',
  ATTACK_REVEALED: 'combat.reveal',
  CLASH_START: 'combat.clash',
  EFFECT_VOIDED: 'combat.voided',
  EFFECT_FIZZLED: 'combat.fizzle',
  EVOLUTION_START: 'evo.start',
  EVOLUTION_CHARGE: 'evo.charge',
  EVOLUTION_BURST: 'evo.burst',
  MONSTER_EVOLVED: 'evo.complete',
  BATTLE_WON: 'result.victory',
  BATTLE_LOST: 'result.defeat',
};

const seated: Partial<Record<CueName, SoundId>> = {
  CARD_DRAWN: 'card.draw',
  CARD_MOVED: 'card.move',
  CARD_PLACED: 'card.place',
  CARD_SET: 'card.set',
  CARD_DISCARDED: 'card.discard',
  CARD_REVEALED: 'card.flip',
  OPTION_PLAYED: 'card.option',
  ATTACK_LOCKED: 'combat.locked',
  ORDER_SWAPPED: 'combat.order',
  ATTACK_BLOCKED: 'combat.block',
  COUNTER: 'combat.counter',
  STAT_UP: 'combat.statUp',
  STAT_DOWN: 'combat.statDown',
  HP_RECOVERED: 'combat.heal',
  MONSTER_DEFEATED: 'combat.ko',
  MONSTER_DEVOLVED: 'combat.devolve',
};

/** The sounds that answer a cue. */
export function soundsFor(name: CueName, d: CueData = {}): SoundRequest[] {
  const s = simple[name];
  if (s) return [{ id: s }];
  const sd = seated[name];
  if (sd) return [{ id: sd, pan: pan(d.player), gain: SOUNDS[sd].group === 'card' ? seat(d.player) : 1 }];
  switch (name) {
    case 'SUPPORT_ACTIVATED':
      return [{ id: 'card.support', variant: d.source === 'option' ? 'option' : 'support', pan: pan(d.player) }];
    case 'DP_CHARGED': {
      const dp = d.dp ?? 0;
      return [{ id: 'card.dp', variant: dp >= 60 ? 'high' : dp >= 30 ? 'mid' : 'low', pan: pan(d.player), gain: seat(d.player) }];
    }
    case 'ATTACK_SELECTED':
      return [{ id: d.slot ? SELECT[d.slot] : 'combat.select' }];
    case 'ATTACK_RESOLVED': {
      const slot = d.slot ?? 'circle';
      return [{ id: SWING[slot], variant: slot === 'cross' ? crossVariant(d.effect) : undefined, pan: pan(d.player) }];
    }
    case 'HIT_TAKEN':
      return [{ id: 'combat.impact', variant: d.lethal ? 'lethal' : (d.slot ?? 'plain'), gain: d.heavy ? 1.15 : 1, pan: pan(d.player) }];
    case 'ABILITY_ACTIVATED':
      return [{ id: 'combat.ability', variant: crossVariant(d.effect), pan: pan(d.player) }];
    case 'ROUND_WON':
      return [{ id: 'result.round', variant: d.win === false ? 'lose' : 'win' }];
    case 'EVOLUTION_STATS':
      return [{ id: 'evo.stat', variant: String(Math.min(3, Math.max(0, d.index ?? 0))) }];
    default:
      return [];
  }
}
