/** The match log in English. Same keys as the Spanish file (the compiler checks it). */
import type { log as es } from '../es/log';

type Source = 'option' | 'support' | 'cross';
type Outcome = 'voided' | 'notMet' | 'applies';
type Pick = 'none' | 'gamble' | 'hand';

const outcome = (o: Outcome) => (o === 'voided' ? 'was voided.' : o === 'notMet' ? 'does not meet its condition.' : 'applies.');
const reduced = (level: string | null) => (level ? ` (entered as ${level}: reduced stats)` : '');
const what = (source: Source, supportCard: string, instinctEffect: string) =>
  source === 'option' ? supportCard.toLowerCase() : source === 'support' ? 'support' : instinctEffect.toLowerCase() + ' of';

export const log: typeof es = {
  between: {
    turnStart: (n, name) => `Turn ${n}: ${name} plays.`,
    draw: (name) => `${name} draws a card.`,
    handRedrawn: (name, creatures) => `${name} had no ${creatures}: the hand is discarded and drawn again.`,
    handChanged: (name) => `${name} changes the whole hand.`,
    enter: (name, card, level) => `${name} enters with ${card}${reduced(level)}.`,
    eggEvolved: (name, verb, from, to) => `${name} ${verb}: ${from} becomes ${to}.`,
    dpCharged: (name, card, zone, total, dp) => `${name} puts ${card} into the ${zone.toLowerCase()} (${total} ${dp}).`,
    uses: (name, card) => `${name} uses ${card}.`,
    evolved: (name, verb, card) => `${name} ${verb} into ${card}.`,
    devolved: (name) => `${name} goes back a level.`,
    noBattle: (name, creature) => `${name} has no ${creature}: no battle.`,
    attackChosen: (name) => `${name} chooses an attack.`,
    supportChosen: (name, pick: Pick) => `${name} ${pick === 'none' ? 'uses no support' : pick === 'gamble' ? 'gambles with the top card of the deck' : 'chooses a support'}.`,
    reveal: (a, aAttack, b, bAttack) => `Attacks: ${a} ${aAttack}, ${b} ${bAttack}.`,
    effect: (source: Source, card, owner, o: Outcome, supportCard, instinctEffect) => `${owner}'s ${what(source, supportCard, instinctEffect)} ${card} ${outcome(o)}`,
    attackFirst: (name) => `${name} attacks first.`,
    crash: (card, owner, power) => `${owner}'s ${card} rams with ${power} power.`,
    hit: (attacker, aOwner, defender, dOwner, damage) => `${aOwner}'s ${attacker} hits ${dOwner}'s ${defender} for ${damage}.`,
    ko: (card, owner, revived) => `${owner}'s ${card} is knocked out${revived ? '… but revives!' : '.'}`,
    roundWon: (name, rounds) => `${name} wins the round (${rounds} of 3).`,
    discarded: (name, n, discard) => `${name}: ${n} card(s) to the ${discard.toLowerCase()}.`,
    gameOver: (name) => `${name} wins the battle.`,
  },
  vsCpu: {
    turnStart: (n, you) => `Turn ${n}: ${you ? 'your turn' : 'the CPU plays'}.`,
    draw: (you, card) => (you ? `You draw ${card}.` : 'The CPU draws a card.'),
    handRedrawn: (you, creatures) => `${you ? 'You had' : 'The CPU had'} no ${creatures}: the hand is discarded and drawn again.`,
    handChanged: (you) => (you ? 'You change your whole hand.' : 'The CPU changes its whole hand.'),
    enter: (you, card, level) => `${you ? 'You enter' : 'The CPU enters'} with ${card}${reduced(level)}.`,
    eggEvolved: (you, verb, from, to) => `${you ? 'You evolve with your egg' : `The CPU ${verb}`}: ${from} becomes ${to}.`,
    dpCharged: (you, card, zone, total, dp) => `${you ? 'You put' : 'The CPU puts'} ${card} into the ${zone.toLowerCase()} (${total} ${dp}).`,
    uses: (you, card) => `${you ? 'You use' : 'The CPU uses'} ${card}.`,
    evolved: (you, verb, card) => `${you ? 'You evolve' : `The CPU ${verb}`} into ${card}.`,
    devolved: (you) => (you ? 'You go back a level.' : 'The CPU goes back a level.'),
    noBattle: (you, creature) => `${you ? "You don't have" : "The CPU doesn't have"} a ${creature}: no battle.`,
    attackChosen: (you) => (you ? 'You choose an attack.' : 'The CPU chooses an attack.'),
    supportChosen: (you, pick: Pick) =>
      `${you ? 'You' : 'The CPU'} ${
        pick === 'none' ? (you ? 'use no support' : 'uses no support') : pick === 'gamble' ? (you ? 'gamble' : 'gambles') + ' with the top card of the deck' : you ? 'choose a support' : 'chooses a support'
      }.`,
    reveal: (yours, theirs) => `Attacks: you ${yours}, the CPU ${theirs}.`,
    effect: (source: Source, card, you, o: Outcome, supportCard, instinctEffect) => `${you ? 'Your' : "The CPU's"} ${what(source, supportCard, instinctEffect)} ${card} ${outcome(o)}`,
    attackFirst: (you, creature) => `${you ? `Your ${creature}` : 'The CPU'} attacks first.`,
    crash: (you, card, power) => `${you ? 'Your' : "The CPU's"} ${card} rams with ${power} power.`,
    hit: (youAttack, attacker, defender, damage) =>
      youAttack ? `Your ${attacker} hits ${defender} for ${damage}.` : `The CPU's ${attacker} hits your ${defender} for ${damage}.`,
    ko: (you, card, revived) => `${you ? 'Your' : "The CPU's"} ${card} is knocked out${revived ? '… but revives!' : '.'}`,
    roundWon: (you, rounds) => `${you ? 'You win' : 'The CPU wins'} the round (${rounds} of 3).`,
    discarded: (you, n, discard) => `${you ? 'You' : 'The CPU'}: ${n} card(s) to the ${discard.toLowerCase()}.`,
    gameOver: (you) => (you ? 'You won the battle!' : 'The CPU wins the battle.'),
  },
  drain: (n, hp) => ` Drains ${n} ${hp}.`,
};
