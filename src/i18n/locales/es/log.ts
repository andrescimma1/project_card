/**
 * The match log in neutral Latin American Spanish. Each language builds its own sentences (grammar
 * differs); describe.ts only gathers the data. `vsCpu`: player 1 is "tú"; `between`: two named players.
 */
type Source = 'option' | 'support' | 'cross';
type Outcome = 'voided' | 'notMet' | 'applies';
type Pick = 'none' | 'gamble' | 'hand';

const outcome = (o: Outcome, feminine: boolean) => (o === 'voided' ? `fue ${feminine ? 'anulada' : 'anulado'}.` : o === 'notMet' ? 'no cumple su condición.' : 'se aplica.');
const reduced = (level: string | null) => (level ? ` (entra como ${level}: stats reducidos)` : '');

export const log = {
  between: {
    turnStart: (n: number, name: string) => `Turno ${n}: juega ${name}.`,
    draw: (name: string) => `${name} roba una carta.`,
    handRedrawn: (name: string, creatures: string) => `${name} no tenía ${creatures}: se descarta la mano y se roba de nuevo.`,
    handChanged: (name: string) => `${name} cambia toda la mano.`,
    enter: (name: string, card: string, level: string | null) => `${name} entra con ${card}${reduced(level)}.`,
    eggEvolved: (name: string, verb: string, from: string, to: string) => `${name} ${verb}: ${from} pasa a ${to}.`,
    dpCharged: (name: string, card: string, zone: string, total: number, dp: string) => `${name} pone ${card} en la ${zone} (${total} ${dp}).`,
    uses: (name: string, card: string) => `${name} usa ${card}.`,
    evolved: (name: string, verb: string, card: string) => `${name} ${verb} a ${card}.`,
    devolved: (name: string) => `${name} vuelve a un nivel anterior.`,
    noBattle: (name: string, creature: string) => `${name} no tiene ${creature}: no hay batalla.`,
    attackChosen: (name: string) => `${name} elige ataque.`,
    supportChosen: (name: string, pick: Pick) => `${name} ${pick === 'none' ? 'no usa soporte' : pick === 'gamble' ? 'apuesta con la carta del mazo' : 'elige un soporte'}.`,
    reveal: (a: string, aAttack: string, b: string, bAttack: string) => `Ataques: ${a} ${aAttack}, ${b} ${bAttack}.`,
    effect: (source: Source, card: string, owner: string, o: Outcome, supportCard: string, instinctEffect: string) =>
      `${source === 'option' ? `La ${supportCard}` : source === 'support' ? 'El soporte' : `El ${instinctEffect} de`} ${card} de ${owner} ${outcome(o, source === 'option')}`,
    attackFirst: (name: string) => `Ataca primero ${name}.`,
    crash: (card: string, owner: string, power: number) => `${card} de ${owner} usa Embestida con ${power} de poder.`,
    hit: (attacker: string, aOwner: string, defender: string, dOwner: string, damage: number) => `${attacker} de ${aOwner} golpea a ${defender} de ${dOwner} por ${damage}.`,
    ko: (card: string, owner: string, revived: boolean) => `${card} de ${owner} queda KO${revived ? '… ¡pero revive!' : '.'}`,
    roundWon: (name: string, rounds: number) => `${name} gana la ronda (${rounds} de 3).`,
    discarded: (name: string, n: number, discard: string) => `${name}: ${n} carta(s) al ${discard}.`,
    gameOver: (name: string) => `${name} gana la partida.`,
  },
  vsCpu: {
    turnStart: (n: number, you: boolean) => `Turno ${n}: ${you ? 'te toca' : 'juega la CPU'}.`,
    draw: (you: boolean, card: string) => (you ? `Robas ${card}.` : 'La CPU roba una carta.'),
    handRedrawn: (you: boolean, creatures: string) => `${you ? 'No tenías' : 'La CPU no tenía'} ${creatures}: se descarta la mano y se roba de nuevo.`,
    handChanged: (you: boolean): string => (you ? 'Cambias toda la mano.' : 'La CPU cambia toda la mano.'),
    enter: (you: boolean, card: string, level: string | null) => `${you ? 'Entras' : 'La CPU entra'} con ${card}${reduced(level)}.`,
    eggEvolved: (you: boolean, verb: string, from: string, to: string) => `${you ? 'Evolucionas con tu huevo' : `La CPU ${verb}`}: ${from} pasa a ${to}.`,
    dpCharged: (you: boolean, card: string, zone: string, total: number, dp: string) => `${you ? 'Pones' : 'La CPU pone'} ${card} en la ${zone} (${total} ${dp}).`,
    uses: (you: boolean, card: string) => `${you ? 'Usas' : 'La CPU usa'} ${card}.`,
    evolved: (you: boolean, verb: string, card: string) => `${you ? 'Evolucionas' : `La CPU ${verb}`} a ${card}.`,
    devolved: (you: boolean): string => (you ? 'Vuelves a un nivel anterior.' : 'La CPU vuelve a un nivel anterior.'),
    noBattle: (you: boolean, creature: string) => `${you ? 'No tienes' : 'La CPU no tiene'} ${creature}: no hay batalla.`,
    attackChosen: (you: boolean): string => (you ? 'Eliges ataque.' : 'La CPU elige ataque.'),
    supportChosen: (you: boolean, pick: Pick) =>
      you
        ? pick === 'none'
          ? 'No usas soporte.'
          : pick === 'gamble'
            ? 'Apuestas con la carta del mazo.'
            : 'Eliges un soporte.'
        : `La CPU ${pick === 'none' ? 'no usa soporte' : pick === 'gamble' ? 'apuesta con la carta del mazo' : 'elige un soporte'}.`,
    reveal: (yours: string, theirs: string) => `Ataques: tú ${yours}, la CPU ${theirs}.`,
    effect: (source: Source, card: string, you: boolean, o: Outcome, supportCard: string, instinctEffect: string) => {
      const label = source === 'option' ? supportCard : source === 'support' ? 'soporte' : `${instinctEffect} de`;
      const theirs = source === 'option' ? `La ${supportCard}` : source === 'support' ? 'El soporte' : `El ${instinctEffect} de`;
      return `${you ? `Tu ${label} ${card}` : `${theirs} ${card} de la CPU`} ${outcome(o, source === 'option')}`;
    },
    attackFirst: (you: boolean, creature: string) => `Ataca primero ${you ? `tu ${creature}` : 'la CPU'}.`,
    crash: (you: boolean, card: string, power: number) => `${you ? `Tu ${card}` : `La ${card} de la CPU`} usa Embestida con ${power} de poder.`,
    hit: (youAttack: boolean, attacker: string, defender: string, damage: number) =>
      youAttack ? `Tu ${attacker} golpea a ${defender} por ${damage}.` : `${attacker} de la CPU golpea a tu ${defender} por ${damage}.`,
    ko: (you: boolean, card: string, revived: boolean) =>
      revived ? `${card} ${you ? '(tuya)' : 'de la CPU'} queda KO… ¡pero revive!` : `${you ? `Tu ${card}` : `La ${card} de la CPU`} queda KO.`,
    roundWon: (you: boolean, rounds: number) => `${you ? 'Ganas' : 'La CPU gana'} la ronda (${rounds} de 3).`,
    discarded: (you: boolean, n: number, discard: string) => `${you ? 'Tú' : 'La CPU'}: ${n} carta(s) al ${discard}.`,
    gameOver: (you: boolean): string => (you ? '¡Ganaste la partida!' : 'La CPU gana la partida.'),
  },
  drain: (n: number, hp: string) => ` Absorbe ${n} ${hp}.`,
};
