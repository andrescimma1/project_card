/** Texts of the research screens in neutral Latin American Spanish. */
export const research = {
  /** How each decoded value was verified (the rules' Confidence). */
  confidence: {
    code: 'Código del juego',
    rom: 'ROM',
    'rom+text': 'ROM + texto',
    inferred: 'Inferido',
    unknown: 'Desconocido',
  },
  /** The card database: filters and list. */
  browser: {
    filters: 'Filtros',
    search: 'Buscar nombre, ataque o efecto',
    /** Examples of what can be searched: card names and texts as they are on the disc. */
    searchPlaceholder: 'WarGreymon, Eat-up, Draw…',
    kind: 'Tipo de carta',
    all: 'Todas',
    level: 'Nivel',
    any: 'Cualquiera',
    onlyIssues: 'Solo cartas con dudas o con texto que no coincide',
    count: (shown: number, total: number) => `${shown} de ${total} cartas`,
    clear: 'Limpiar',
    cards: 'Cartas',
    noMatch: 'Ninguna carta cumple estos filtros. Quita alguno o usa “Limpiar”.',
  },
  /** A card in the database list. */
  tile: {
    label: (name: string, number: string) => `${name}, carta ${number}`,
    issues: (n: number) => (n === 1 ? '1 punto a verificar' : `${n} puntos a verificar`),
    mismatch: 'El texto no coincide con el juego',
  },
  /** The detail panel of a card, with its decoded data. */
  detail: {
    label: (name: string) => `Detalle de ${name}`,
    ids: (number: string, id: number) => `#${number}, id ROM ${id}`,
    /** "Facción Roja, Novato". `faction`: the word for faction; `name`: the faction's name. */
    factionLevel: (faction: string, name: string, level: string) => `${faction} ${name}, ${level}`,
    close: 'Cerrar',
    dpToEvolve: (dp: string) => `${dp} para evolucionar`,
    dpGiven: (dp: string) => `Aporta ${dp}`,
    attacks: 'Ataques',
    cardText: 'Texto de la carta',
    /** Title over the support text exactly as the disc has it. */
    supportText: (supportEffect: string) => `${supportEffect} (texto del juego)`,
    noText: 'Sin texto.',
    speed: 'Velocidad de soporte',
    /** `none`: the name of speed 0. */
    speedNone: (none: string) => `Con velocidad “${none}” el efecto nunca se aplica.`,
    speedOrder: (supportCard: string, creature: string, instinctEffect: string) =>
      `Los efectos se aplican de velocidad alta a baja; a igual velocidad: ${supportCard}, luego soporte de ${creature}, luego ${instinctEffect}, y primero el jugador del turno.`,
    bytecode: 'Bytecode original decodificado',
    confidenceHint: 'El punto de color indica la confianza de cada variable: verde, leída del intérprete del juego; ámbar, inferida; gris, sin decodificar.',
    behaviour: 'Comportamiento',
    noBytecode: (typeRaw: number, type: string) =>
      `Las cartas de evolución no traen bytecode: su lógica vive en código del juego (tipo ${typeRaw}, ${type}). El motor necesitará un handler dedicado.`,
    notes: 'El texto dice una cosa, el juego hace otra',
    notesHint: 'El remake reproduce lo que ejecuta el juego, no el texto.',
    issues: 'Puntos a verificar',
    source: 'Origen del dato',
    /** `offset` is already in hexadecimal. */
    sourceText: (file: string, offset: string, size: number, composite: number, result: number) =>
      `${file}, offset 0x${offset}, ${size} bytes. Valores de fusión (modo historia): ${composite} / ${result}.`,
    unknownFields: 'Campos sin decodificar:',
    /** The decoded effect program (conditions and actions of the bytecode). */
    program: {
      empty: 'El registro no tiene condiciones ni acciones activas.',
      condition: (n: number) => `Condición ${n}`,
      disabled: '(desactivada en el ROM)',
      never: (code: number) => `nunca (código ${code})`,
      action: (n: number) => `Acción ${n}`,
      amount: 'cantidad =',
    },
  },
  /** The research documents (written in Spanish only). */
  docs: {
    nav: 'Documentos',
    /** Titles in the list, by document id (file name without number). A missing id shows the document's own heading. */
    titles: {
      'mecanicas-originales': 'Mecánicas del juego original (PS1, SLUS-01328)',
      'formato-rom': 'Formato de datos del ROM (ingeniería inversa)',
      'fuentes-externas': 'Fuentes externas y contraste con el ROM',
      'motor-original': 'El motor original, leído del código',
      'motor-implementado': 'El motor implementado (Etapa 3)',
      'ia-original': 'La IA original de la CPU (portada)',
      progresion: 'La progresión del original (modo historia)',
    },
    legend: {
      verified: 'Verificado en el juego',
      probable: 'Probable',
      unknown: 'Desconocido, no se implementa',
      conflict: 'Conflicto entre fuentes',
    },
    /** Shown over each document when the interface is not in Spanish; empty here. */
    languageNote: '',
  },
};
