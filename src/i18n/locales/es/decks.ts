/** Texts of the decks screens in neutral Latin American Spanish. */
export const decks = {
  /** The list of saved decks (free play). */
  list: {
    title: 'Tus mazos',
    /** `creature`: the game's word for a creature, in lower case. */
    intro: (creature: string) =>
      `Arma mazos con las reglas originales: 30 cartas, hasta 4 copias de cada una y al menos una ${creature}. Todavía no hay progresión, así que las 301 cartas están disponibles. Los mazos se guardan en este navegador.`,
    newDeckName: 'Mazo nuevo',
    createEmpty: 'Crear mazo vacío',
    startFrom: 'O empezar desde un mazo original',
    copy: 'Copiar',
    copyName: (name: string) => `${name} (copia)`,
    empty: 'Todavía no guardaste ningún mazo.',
    /** "12/30 cartas, 8 criaturas." `one` / `many`: the creature word in singular and plural, in lower case. */
    summary: (total: number, size: number, creatures: number, one: string, many: string) =>
      `${total}/${size} cartas, ${creatures} ${creatures === 1 ? one : many}.`,
    ready: 'Listo para jugar.',
    incomplete: 'Incompleto.',
    edit: 'Editar',
    delete: 'Borrar',
    confirmDelete: (name: string) => `¿Borrar el mazo "${name}"?`,
  },
  /** The buttons under the editor in free play. */
  builder: {
    save: 'Guardar mazo',
    saved: 'Guardado',
    confirmLeave: 'Hay cambios sin guardar. ¿Salir igual?',
    back: 'Volver a mis mazos',
  },
  /** The deck editor shared by free play and story mode. */
  editor: {
    available: 'Cartas disponibles',
    search: 'Buscar',
    searchPlaceholder: 'Nombre de la carta',
    all: 'Todas',
    noMatch: 'Ninguna carta coincide con los filtros.',
    /** `owned`: copies in the collection (story mode), or undefined. */
    addCard: (name: string, inDeck: number, owned?: number) =>
      `Añadir ${name} (${inDeck} en el mazo${owned !== undefined ? `, tienes ${owned}` : ''})`,
    details: (name: string) => `Ver detalle de ${name}`,
    yourDeck: 'Tu mazo',
    deckName: 'Nombre del mazo',
    cards: 'Cartas',
    /** "8 criaturas (4 Novato, 4 Campeón…), 5 de apoyo, 2 de evolución." Words in lower case. */
    composition: (c: { creatures: number; creatureWord: string; levels: string; support: number; supportWord: string; evolution: number; evolutionWord: string }) =>
      `${c.creatures} ${c.creatureWord} (${c.levels}), ${c.support} de ${c.supportWord}, ${c.evolution} de ${c.evolutionWord}.`,
    /** `faction`: the game's word for a faction. */
    factionSplit: (faction: string) => `Reparto por ${faction.toLowerCase()}`,
    removeCopy: (name: string) => `Quitar una copia de ${name}`,
    addCopy: (name: string) => `Añadir una copia de ${name}`,
  },
};
