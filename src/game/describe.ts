/** Human-readable (Spanish) text for engine events. Player 0 is the human; with `names`, two named players (2P). */
import { cards } from '../engine/cards/db';
import type { CardRef, GameEvent, GameState, PlayerId } from '../engine/game/types';

const SLOT = { circle: '◯', triangle: '△', cross: '✕' } as const;

function cardName(state: GameState, player: PlayerId, ref: CardRef): string {
  const id = state.players[player].cards[ref];
  return id === undefined ? '¿?' : cards[id].name;
}


const your = (p: PlayerId) => (p === 0 ? 'Tu' : 'El');
const who = (p: PlayerId) => (p === 0 ? 'Tú' : 'La CPU');

export function describeEvent(e: GameEvent, state: GameState, names?: [string, string]): string {
  return names ? describeBetween(e, state, names) : describeVsCpu(e, state);
}

/** 2 Player Battle: third person for both players. */
function describeBetween(e: GameEvent, state: GameState, names: [string, string]): string {
  const of = (p: PlayerId, ref: CardRef) => `${cardName(state, p, ref)} de ${names[p]}`;
  switch (e.type) {
    case 'turnStart':
      return `Turno ${e.turnNumber}: juega ${names[e.player]}.`;
    case 'draw':
      return `${names[e.player]} roba una carta.`;
    case 'handChanged':
      return e.auto ? `${names[e.player]} no tenía Digimon: se descarta la mano y se roba de nuevo.` : `${names[e.player]} cambia toda la mano.`;
    case 'enter':
      return `${names[e.player]} entra con ${cardName(state, e.player, e.card)}${e.enteredAs ? ` (entra como ${e.enteredAs}: stats reducidos)` : ''}.`;
    case 'armorDigivolved':
      return `${names[e.player]} Armor-digievoluciona: ${cards[e.from].name} pasa a ${cards[e.to].name}.`;
    case 'dpCharged':
      return `${names[e.player]} pone ${cardName(state, e.player, e.card)} en el DP Slot (${e.dpTotal} DP).`;
    case 'digivolveOptionPlayed':
      return `${names[e.player]} usa ${cardName(state, e.player, e.card)}.`;
    case 'digivolved':
      return `${names[e.player]} digievoluciona a ${cardName(state, e.player, e.card)}.`;
    case 'devolved':
      return `${names[e.player]} vuelve a un nivel anterior.`;
    case 'noBattle':
      return `${names[e.player]} no tiene Digimon: no hay batalla.`;
    case 'attackChosen':
      return `${names[e.player]} elige ataque.`;
    case 'supportChosen':
      return `${names[e.player]} ${e.from === 'none' ? 'no usa soporte' : e.from === 'gamble' ? 'apuesta con la carta del mazo' : 'elige un soporte'}.`;
    case 'reveal':
      return `Ataques: ${names[0]} ${SLOT[e.attacks[0]]}, ${names[1]} ${SLOT[e.attacks[1]]}.`;
    case 'effect': {
      const label = e.source === 'option' ? 'La Option' : e.source === 'support' ? 'El soporte' : 'El efecto ✕ de';
      const base = `${label} ${of(e.player, e.card)}`;
      if (e.voided) return `${base} fue ${e.source === 'option' ? 'anulada' : 'anulado'}.`;
      if (!e.conditionsMet) return `${base} no cumple su condición.`;
      return `${base} se aplica.`;
    }
    case 'attackOrder':
      return `Ataca primero ${names[e.first]}.`;
    case 'crash':
      return `${of(e.player, e.card)} usa Crash con ${e.power} de poder.`;
    case 'hit': {
      const text = `${of(e.attacker, e.attackerCard)} golpea a ${of(e.defender, e.defenderCard)} por ${e.damage}.`;
      return e.eaten ? `${text} Recupera ${e.eaten} HP (Eat-up).` : text;
    }
    case 'ko':
      return e.revived ? `${of(e.player, e.card)} queda KO… ¡pero revive!` : `${of(e.player, e.card)} queda KO.`;
    case 'roundWon':
      return `${names[e.player]} gana la ronda (${e.rounds} de 3).`;
    case 'cardsDiscarded':
      return `${names[e.player]}: ${e.cards.length} carta(s) al Offline Pile.`;
    case 'gameOver':
      return `${names[e.winner]} gana la partida.`;
  }
}

function describeVsCpu(e: GameEvent, state: GameState): string {
  switch (e.type) {
    case 'turnStart':
      return `Turno ${e.turnNumber}: ${e.player === 0 ? 'te toca' : 'juega la CPU'}.`;
    case 'draw':
      return e.player === 0 ? `Robas ${cardName(state, 0, e.card)}.` : 'La CPU roba una carta.';
    case 'handChanged':
      return e.auto ? `${who(e.player)} no tenía Digimon: se descarta la mano y se roba de nuevo.` : `${who(e.player)} cambia toda la mano.`;
    case 'enter':
      return `${who(e.player)} entra con ${cardName(state, e.player, e.card)}${e.enteredAs ? ` (entra como ${e.enteredAs}: stats reducidos)` : ''}.`;
    case 'armorDigivolved':
      return `${who(e.player)} Armor-digievoluciona${e.player === 0 ? 's' : ''}: ${cards[e.from].name} pasa a ${cards[e.to].name}.`;
    case 'dpCharged':
      return `${who(e.player)} pone ${cardName(state, e.player, e.card)} en el DP Slot (${e.dpTotal} DP).`;
    case 'digivolveOptionPlayed':
      return `${who(e.player)} usa ${cardName(state, e.player, e.card)}.`;
    case 'digivolved':
      return `${who(e.player)} digievoluciona a ${cardName(state, e.player, e.card)}.`;
    case 'devolved':
      return `${who(e.player)} vuelve a un nivel anterior.`;
    case 'noBattle':
      return `${e.player === 0 ? 'No tienes' : 'La CPU no tiene'} Digimon: no hay batalla.`;
    case 'attackChosen':
      return `${who(e.player)} ${e.player === 0 ? 'eliges' : 'elige'} ataque.`;
    case 'supportChosen':
      return `${who(e.player)} ${e.from === 'none' ? 'no usa soporte' : e.from === 'gamble' ? 'apuesta con la carta del mazo' : 'elige un soporte'}.`;
    case 'reveal':
      return `Ataques: tú ${SLOT[e.attacks[0]]}, la CPU ${SLOT[e.attacks[1]]}.`;
    case 'effect': {
      const label = e.source === 'option' ? 'Option' : e.source === 'support' ? 'soporte' : 'efecto ✕ de';
      const name = cardName(state, e.player, e.card);
      const base = e.player === 0 ? `Tu ${label} ${name}` : `${label === 'Option' ? 'La Option' : label === 'soporte' ? 'El soporte' : 'El efecto ✕ de'} ${name} de la CPU`;
      if (e.voided) return `${base} fue ${e.source === 'option' ? 'anulada' : 'anulado'}.`;
      if (!e.conditionsMet) return `${base} no cumple su condición.`;
      return `${base} se aplica.`;
    }
    case 'attackOrder':
      return `Ataca primero ${e.first === 0 ? 'tu Digimon' : 'la CPU'}.`;
    case 'crash':
      return `${your(e.player)} ${cardName(state, e.player, e.card)}${e.player === 1 ? ' de la CPU' : ''} usa Crash con ${e.power} de poder.`;
    case 'hit': {
      const attacker = cardName(state, e.attacker, e.attackerCard);
      const defender = cardName(state, e.defender, e.defenderCard);
      const text = e.attacker === 0 ? `Tu ${attacker} golpea a ${defender} por ${e.damage}.` : `${attacker} de la CPU golpea a tu ${defender} por ${e.damage}.`;
      return e.eaten ? `${text} Recupera ${e.eaten} HP (Eat-up).` : text;
    }
    case 'ko':
      return e.revived
        ? `${cardName(state, e.player, e.card)} ${e.player === 0 ? '(tuyo)' : 'de la CPU'} queda KO… ¡pero revive!`
        : `${e.player === 0 ? 'Tu' : 'El'} ${cardName(state, e.player, e.card)}${e.player === 1 ? ' de la CPU' : ''} queda KO.`;
    case 'roundWon':
      return `${e.player === 0 ? 'Ganas' : 'La CPU gana'} la ronda (${e.rounds} de 3).`;
    case 'cardsDiscarded':
      return `${who(e.player)}: ${e.cards.length} carta(s) al Offline Pile.`;
    case 'gameOver':
      return e.winner === 0 ? '¡Ganaste la partida!' : 'La CPU gana la partida.';
  }
}
