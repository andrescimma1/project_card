/**
 * Game state for the rules engine. Plain serialisable data, no classes, no React.
 * Zones are FIXED SLOT ARRAYS with holes (null), exactly like the game's player struct:
 *   top   = first non-null slot from index 0
 *   insert = last null slot scanning from the end
 * See docs/research/04-motor-original.md §1.
 */
import type { AttackSlot, Level, Specialty } from '../cards/types';

export type PlayerId = 0 | 1;

/** Card instance = index into PlayerState.cards (0..29). */
export type CardRef = number;
export type Slot = CardRef | null;

export type SupportChoice = { kind: 'hand'; card: CardRef } | { kind: 'gamble'; card: CardRef } | { kind: 'none' };

/**
 * A partner slot (save + 0x80 + k·0x298): the partner card and its Armor form are rebuilt from these
 * values (SLUS 0x80048230) and the partner's card instances use those copies in battle (0x80046A38).
 */
export interface PartnerSlot {
  /** Partner card id: 175 Veemon, 182 Hawkmon, 190 Armadillomon, 184 Gatomon, 183 Patamon, 187 Wormmon. */
  id: number;
  /** Armor card id of the equipped Digi-Egg, or null. */
  armorId: number | null;
  /** 1..99 */
  level: number;
  /** +10 bonuses earned every 5 levels: HP, ◯, △, ✕. */
  bonus: [number, number, number, number];
  /** Equipped Digi-Parts (0..127), at most 3. */
  parts: number[];
}

export interface PlayerState {
  id: PlayerId;
  /** instance -> ROM card id */
  cards: number[];
  online: Slot[]; // 30
  offline: Slot[]; // 30
  hand: Slot[]; // 4
  dp: Slot[]; // 8, newest at the lowest occupied index
  stack: Slot[]; // 3, active Digimon at the lowest occupied index
  hp: number;
  /** Current powers ◯ △ ✕ of the active Digimon (already reduced if it entered as C/U). */
  powers: [number, number, number];
  /** Current specialty (supports can change it until the Digimon changes card). */
  specialty: Specialty;
  /** "Abnormal state": the level the active Digimon entered with directly from the hand. */
  enteredAs: Level | null;
  rounds: number;
  /** Attack chosen for the current battle. */
  attack: AttackSlot | null;
  /** Support chosen for the current battle; the card has already left its zone. */
  support: SupportChoice | null;
  /** Digivolve Option played this turn (waiting in the option slot). */
  digivolveOption: CardRef | null;
  /**
   * Flags bit 30: set when this player's turn reaches the battle step (state 23, SLUS 0x80037044),
   * cleared whenever stats are loaded (entering, digivolving, devolving). Read only by the CPU AI.
   */
  settled: boolean;
  /** Partner slots of this player (at most 3). */
  partners: PartnerSlot[];
  /** Per card instance: the partner slot whose copy it uses, or null (SLUS 0x80046A38). */
  partnerOf: (number | null)[];
}

export type Phase =
  | { name: 'turnStart' }
  | { name: 'mulligan' }
  | { name: 'entrance' }
  | { name: 'armorDigivolve' }
  | { name: 'dp' }
  | { name: 'digivolveOption' }
  | { name: 'digivolve' }
  | { name: 'attack' }
  | { name: 'support'; chooser: PlayerId }
  | { name: 'gameOver' };

export type EndReason = 'rounds' | 'noDigimon';

export interface GameState {
  players: [PlayerState, PlayerState];
  /** Turn player (attacks first by default). */
  turn: PlayerId;
  turnNumber: number;
  phase: Phase;
  /** Seeded PRNG state (uint32). */
  rng: number;
  winner: PlayerId | null;
  endReason: EndReason | null;
}

export type SupportSource = 'option' | 'support' | 'cross';

// `hp` fields below are snapshots (player 0, player 1) for the UI; they never feed back into the rules.

export type GameEvent =
  | { type: 'turnStart'; player: PlayerId; turnNumber: number }
  | { type: 'draw'; player: PlayerId; card: CardRef }
  | { type: 'handChanged'; player: PlayerId; auto: boolean }
  | { type: 'enter'; player: PlayerId; card: CardRef; enteredAs: Level | null }
  | { type: 'armorDigivolved'; player: PlayerId; card: CardRef; from: number; to: number }
  | { type: 'dpCharged'; player: PlayerId; card: CardRef; dpTotal: number }
  | { type: 'digivolveOptionPlayed'; player: PlayerId; card: CardRef }
  | { type: 'digivolved'; player: PlayerId; card: CardRef; from: CardRef | null }
  | { type: 'devolved'; player: PlayerId; discarded: CardRef }
  | { type: 'noBattle'; player: PlayerId }
  | { type: 'attackChosen'; player: PlayerId }
  | { type: 'supportChosen'; player: PlayerId; from: 'hand' | 'gamble' | 'none' }
  | { type: 'reveal'; attacks: [AttackSlot, AttackSlot]; hp: [number, number] }
  | { type: 'effect'; player: PlayerId; source: SupportSource; card: CardRef; speed: number; voided: boolean; conditionsMet: boolean; hp: [number, number]; attacks: [AttackSlot, AttackSlot] }
  | { type: 'attackOrder'; first: PlayerId; second: PlayerId }
  | { type: 'crash'; player: PlayerId; card: CardRef; power: number; hp: [number, number] }
  | { type: 'hit'; attacker: PlayerId; defender: PlayerId; attackerCard: CardRef; defenderCard: CardRef; damage: number; eaten: number; hp: [number, number] }
  | { type: 'ko'; player: PlayerId; card: CardRef; revived: boolean }
  | { type: 'roundWon'; player: PlayerId; rounds: number }
  | { type: 'cardsDiscarded'; player: PlayerId; cards: CardRef[]; from: 'hand' | 'online' | 'dp' | 'stack' | 'support' }
  | { type: 'gameOver'; winner: PlayerId; reason: EndReason };

export type SupportPick = { from: 'hand'; card: CardRef } | { from: 'gamble' } | { from: 'none' };

export type Action =
  | { type: 'keepHand'; player: PlayerId }
  | { type: 'changeHand'; player: PlayerId }
  | { type: 'enter'; player: PlayerId; card: CardRef }
  | { type: 'armorDigivolve'; player: PlayerId }
  | { type: 'skipArmorDigivolve'; player: PlayerId }
  | { type: 'chargeDp'; player: PlayerId; card: CardRef }
  | { type: 'skipDp'; player: PlayerId }
  | { type: 'playDigivolveOption'; player: PlayerId; card: CardRef }
  | { type: 'skipDigivolveOption'; player: PlayerId }
  | { type: 'digivolve'; player: PlayerId; card: CardRef }
  | { type: 'skipDigivolve'; player: PlayerId }
  | { type: 'chooseAttack'; player: PlayerId; slot: AttackSlot }
  | { type: 'chooseSupport'; player: PlayerId; choice: SupportPick };

export interface StepResult {
  state: GameState;
  events: GameEvent[];
}

export class IllegalActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IllegalActionError';
  }
}
