/**
 * Game vocabulary in neutral Latin American Spanish. The rules keep their original identifiers
 * (digimon, dp, digivolve, circle…); only what the player reads lives here.
 */
export const terms = {
  /** The game's name (top bar and browser tab). */
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
  levels: { R: 'Novato', C: 'Campeón', U: 'Perfecto', A: 'Armadura' },
  levelShort: { R: 'N', C: 'C', U: 'P', A: 'A' },
  /** DP */
  dp: 'PE',
  dpLong: 'Puntos de evolución',
  /** +P, what a card adds when charged */
  dpGiven: '+PE',
  /** DP Slot */
  dpZone: 'Reserva',
  deck: 'Mazo',
  discard: 'Descarte',
  hand: 'Mano',
  card: 'Carta',
  hp: 'HP',
  /** Option card */
  supportCard: 'Carta de apoyo',
  supportShort: 'Apoyo',
  supportBadge: 'Ap',
  /** Digivolve Option card */
  evolutionCard: 'Carta de evolución',
  evolutionShort: 'Evol.',
  evolutionBadge: 'Ev',
  support: 'Soporte',
  supportEffect: 'Efecto de soporte',
  /** The ✕ special effect */
  instinctEffect: 'Efecto de Instinto',
  gamble: 'Apostar',
  partner: 'Compañero',
  /** Digi-Egg */
  egg: 'Huevo',
  eggs: 'Huevos',
  /** Digi-Parts */
  parts: 'Reliquias',
  part: 'Reliquia',
  round: 'Ronda',
  rounds: 'Rondas',
  firstAttack: '1.er ataque',
  secondAttack: '2.º ataque',
  faction: 'Facción',
  /** "Facción Roja" */
  factionNamed: (name: string) => `Facción ${name}`,
  habitat: 'Hábitat',
  element: 'Elemento',
  actions: { fury: 'Furia', technique: 'Técnica', instinct: 'Instinto' },
  phases: { prep: 'Preparación', battle: 'Batalla' },
  speed: ['ninguna', 'baja', 'media', 'alta'],
  factions: {
    red: { name: 'Roja', temperament: 'Agresividad, valentía, orgullo y ataque frontal' },
    blue: { name: 'Azul', temperament: 'Calma, paciencia y control (provisional)' },
    green: { name: 'Verde', temperament: 'Resistencia, crecimiento y defensa (provisional)' },
    shadow: { name: 'Sombría', temperament: 'Astucia, engaño y desgaste (provisional)' },
    gold: { name: 'Rara', temperament: 'Rareza, nobleza y equilibrio (provisional)' },
  },
  elements: {
    fire: 'Fuego',
    water: 'Agua',
    ice: 'Hielo',
    earth: 'Tierra',
    rock: 'Roca',
    air: 'Aire',
    plant: 'Planta',
    lightning: 'Rayo',
    metal: 'Metal',
    light: 'Luz',
    shadow: 'Sombra',
  },
  /** The special effect of the Instinto attack (the rules' cross effect). */
  crossEffects: {
    none: 'Sin efecto',
    firstAttack: 'Primer golpe',
    nullify: (action: string) => `Anula ${action}`,
    counter: (action: string) => `Contra ${action}`,
    crash: 'Embestida',
    eatUpHp: 'Absorber HP',
    jamming: 'Interferencia',
    foeX3: (faction: string) => `×3 contra ${faction}`,
  },
};
