/**
 * Human-readable text for engine events, in the current language and our vocabulary. This file only
 * gathers the data; each language builds its sentences (src/i18n/locales/<lang>/log.ts).
 * Player 0 is the human; with `names`, two named players (2P).
 */
import { cards } from '../engine/cards/db';
import type { AttackSlot } from '../engine/cards/types';
import type { CardRef, GameEvent, GameState, PlayerId } from '../engine/game/types';
import { m } from '../i18n';
import { actionOf } from '../ui/vocab/actions';
import { TERMS } from '../ui/vocab/terms';

const action = (s: AttackSlot) => TERMS.actions[actionOf(s)];

function cardName(state: GameState, player: PlayerId, ref: CardRef): string {
  const id = state.players[player].cards[ref];
  return id === undefined ? '¿?' : cards[id].name;
}

type Outcome = 'voided' | 'notMet' | 'applies';
const outcomeOf = (e: Extract<GameEvent, { type: 'effect' }>): Outcome => (e.voided ? 'voided' : !e.conditionsMet ? 'notMet' : 'applies');

export function describeEvent(e: GameEvent, state: GameState, names?: [string, string]): string {
  return names ? describeBetween(e, state, names) : describeVsCpu(e, state);
}

/** 2 Player Battle: third person for both players. */
function describeBetween(e: GameEvent, state: GameState, names: [string, string]): string {
  const L = m().log.between;
  const card = (p: PlayerId, ref: CardRef) => cardName(state, p, ref);
  switch (e.type) {
    case 'turnStart':
      return L.turnStart(e.turnNumber, names[e.player]);
    case 'draw':
      return L.draw(names[e.player]);
    case 'handChanged':
      return e.auto ? L.handRedrawn(names[e.player], TERMS.creatures.toLowerCase()) : L.handChanged(names[e.player]);
    case 'enter':
      return L.enter(names[e.player], card(e.player, e.card), e.enteredAs ? TERMS.levels[e.enteredAs] : null);
    case 'armorDigivolved':
      return L.eggEvolved(names[e.player], TERMS.eggEvolves, cards[e.from].name, cards[e.to].name);
    case 'dpCharged':
      return L.dpCharged(names[e.player], card(e.player, e.card), TERMS.dpZone.toLowerCase(), e.dpTotal, TERMS.dp);
    case 'digivolveOptionPlayed':
      return L.uses(names[e.player], card(e.player, e.card));
    case 'digivolved':
      return L.evolved(names[e.player], TERMS.evolves, card(e.player, e.card));
    case 'devolved':
      return L.devolved(names[e.player]);
    case 'noBattle':
      return L.noBattle(names[e.player], TERMS.creature.toLowerCase());
    case 'attackChosen':
      return L.attackChosen(names[e.player]);
    case 'supportChosen':
      return L.supportChosen(names[e.player], e.from);
    case 'reveal':
      return L.reveal(names[0], action(e.attacks[0]), names[1], action(e.attacks[1]));
    case 'effect':
      return L.effect(e.source, card(e.player, e.card), names[e.player], outcomeOf(e), TERMS.supportCard.toLowerCase(), TERMS.instinctEffect.toLowerCase());
    case 'attackOrder':
      return L.attackFirst(names[e.first]);
    case 'crash':
      return L.crash(card(e.player, e.card), names[e.player], e.power);
    case 'hit': {
      const text = L.hit(card(e.attacker, e.attackerCard), names[e.attacker], card(e.defender, e.defenderCard), names[e.defender], e.damage);
      return e.eaten ? text + m().log.drain(e.eaten, TERMS.hp) : text;
    }
    case 'ko':
      return L.ko(card(e.player, e.card), names[e.player], e.revived);
    case 'roundWon':
      return L.roundWon(names[e.player], e.rounds);
    case 'cardsDiscarded':
      return L.discarded(names[e.player], e.cards.length, TERMS.discard.toLowerCase());
    case 'gameOver':
      return L.gameOver(names[e.winner]);
  }
}

function describeVsCpu(e: GameEvent, state: GameState): string {
  const L = m().log.vsCpu;
  const card = (p: PlayerId, ref: CardRef) => cardName(state, p, ref);
  switch (e.type) {
    case 'turnStart':
      return L.turnStart(e.turnNumber, e.player === 0);
    case 'draw':
      return L.draw(e.player === 0, card(0, e.card));
    case 'handChanged':
      return e.auto ? L.handRedrawn(e.player === 0, TERMS.creatures.toLowerCase()) : L.handChanged(e.player === 0);
    case 'enter':
      return L.enter(e.player === 0, card(e.player, e.card), e.enteredAs ? TERMS.levels[e.enteredAs] : null);
    case 'armorDigivolved':
      return L.eggEvolved(e.player === 0, TERMS.eggEvolves, cards[e.from].name, cards[e.to].name);
    case 'dpCharged':
      return L.dpCharged(e.player === 0, card(e.player, e.card), TERMS.dpZone.toLowerCase(), e.dpTotal, TERMS.dp);
    case 'digivolveOptionPlayed':
      return L.uses(e.player === 0, card(e.player, e.card));
    case 'digivolved':
      return L.evolved(e.player === 0, TERMS.evolves, card(e.player, e.card));
    case 'devolved':
      return L.devolved(e.player === 0);
    case 'noBattle':
      return L.noBattle(e.player === 0, TERMS.creature.toLowerCase());
    case 'attackChosen':
      return L.attackChosen(e.player === 0);
    case 'supportChosen':
      return L.supportChosen(e.player === 0, e.from);
    case 'reveal':
      return L.reveal(action(e.attacks[0]), action(e.attacks[1]));
    case 'effect':
      return L.effect(e.source, card(e.player, e.card), e.player === 0, outcomeOf(e), TERMS.supportCard.toLowerCase(), TERMS.instinctEffect.toLowerCase());
    case 'attackOrder':
      return L.attackFirst(e.first === 0, TERMS.creature.toLowerCase());
    case 'crash':
      return L.crash(e.player === 0, card(e.player, e.card), e.power);
    case 'hit': {
      const text = L.hit(e.attacker === 0, card(e.attacker, e.attackerCard), card(e.defender, e.defenderCard), e.damage);
      return e.eaten ? text + m().log.drain(e.eaten, TERMS.hp) : text;
    }
    case 'ko':
      return L.ko(e.player === 0, card(e.player, e.card), e.revived);
    case 'roundWon':
      return L.roundWon(e.player === 0, e.rounds);
    case 'cardsDiscarded':
      return L.discarded(e.player === 0, e.cards.length, TERMS.discard.toLowerCase());
    case 'gameOver':
      return L.gameOver(e.winner === 0);
  }
}
