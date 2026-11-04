/**
 * Revisión por carta, que se fusiona en la base extraída (se muestra en la UI, por eso en español).
 *
 * NOTES  = diferencias RESUELTAS entre el TEXTO de la carta y lo que EJECUTA el juego. El remake
 *          reproduce la ejecución (el bytecode que corre el intérprete del juego), nunca el texto.
 * ISSUES = preguntas todavía abiertas.
 *
 * Evidencia: intérprete del overlay de batalla KAWSEG (docs/research/04-motor-original.md),
 * corroborado por GameFAQs (G) y el Let's Play (LP) cuando reportaron el mismo comportamiento.
 */
type Entry = { field: string; note: string };

export const KNOWN_NOTES: Record<string, Entry[]> = {
  Aquilamon: [
    {
      field: 'support.conditions[0].cmp',
      note: 'Comparador 0xFF: la rutina compare() del juego devuelve falso para códigos ≥ 6, así que este soporte NUNCA se activa. G y LP reportan exactamente eso ("nunca funciona").',
    },
  ],
  Dolphmon: [
    {
      field: 'support.conditions[0]',
      note: 'Ejecuta "si el ataque del RIVAL no es ◯, recupera +300" (variable 18), aunque el texto dice "own Attack". G reporta que se comporta al revés de su texto.',
    },
  ],
  Veedramon: [
    {
      field: 'support.conditions[0]',
      note: 'Ejecuta "si el nivel del RIVAL es U" (variable 14), aunque el texto dice "own Level". Explica el reporte de G de que "falla para el jugador".',
    },
  ],
  AeroVeedramon: [
    { field: 'support.conditions[0]', note: 'Igual que Veedramon: comprueba el nivel del RIVAL, no el propio.' },
  ],
  Sylphymon: [
    {
      field: 'support.actions[0]',
      note: 'El texto dice "attack second", pero el juego ejecuta "atacar primero" (comando 0x35). G y LP confirman que ataca primero.',
    },
  ],
  Betamon: [{ field: 'support.conditions[0].cmp', note: 'El texto dice "less than 200"; el juego comprueba HP ≤ 200 (comparador 1).' }],
  'R-Gatomon': [{ field: 'support.conditions[0].cmp', note: 'El texto dice "less than 500"; el juego comprueba HP ≤ 500.' }],
  PlatinumSukamon: [{ field: 'support.conditions[0]', note: 'Condición previa: solo funciona si el Offline Pile propio tiene cartas (variable 25 == 0).' }],
  'Digimon Analyzer': [{ field: 'support.conditions[0]', note: 'Condición previa: solo funciona si el Offline Pile propio tiene cartas.' }],
  'Reverse Sevens': [{ field: 'support.conditions[0]', note: 'Condición previa: solo funciona si el Offline Pile propio tiene cartas.' }],
  "Devil's Chip": [{ field: 'support.actions[0]', note: 'El descarte de la mano es al azar (el comando 0x1A siempre elige al azar), aunque el texto no lo diga.' }],
  'Special Digivolve': [
    {
      field: 'text',
      note: '"by adding DP +20" significa DP_total + 20 ≥ DP requerido: cuesta 20 DP MENOS (KAWSEG 0x801E3EDC). Además: solo al siguiente nivel, cualquier especialidad, no en Armor. Coincide con G y LP.',
    },
  ],
  'Fake Sevens': [{ field: 'support', note: 'El registro no tiene texto ni efecto: no hace nada (Support Speed 0 nunca se aplica).' }],
};

export const KNOWN_ISSUES: Record<string, Entry[]> = {
  MetalSeadramon: [
    {
      field: 'support',
      note: 'G reporta que este soporte "rara vez funciona para el jugador", pero el bytecode y el orden de resolución parecen correctos. Sin explicar; verificar en emulador.',
    },
  ],
};
