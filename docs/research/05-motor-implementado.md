# 05 — El motor implementado (Etapa 3)

Motor de reglas en TypeScript, **independiente de React**, determinista y con estado serializable.
Es un port de las rutinas del juego descritas en [`04-motor-original.md`](04-motor-original.md).

## API

```ts
import { createGame, legalActions, applyAction } from 'src/engine';

let { state, events } = createGame({ decks: [mazoA, mazoB], seed: 42, firstPlayer: 0 });
legalActions(state, 0);                       // acciones válidas de ese jugador ahora
({ state, events } = applyAction(state, { type: 'keepHand', player: 0 }));
```

* `state` es un objeto plano (se puede guardar, comparar o reproducir). Las acciones ilegales lanzan `IllegalActionError`.
* `events` describe todo lo que pasó (robos, efectos aplicados o anulados, orden de ataque, golpes, KO, rondas): es lo que la interfaz animará.
* Con la misma semilla y las mismas acciones, la partida es idéntica.

## Módulos y rutina original que reproducen

| Archivo | Qué hace | Rutina del juego |
|---|---|---|
| `game/zones.ts` | Zonas como arreglos fijos con huecos | `SLUS 0x80040064…0x80041340` |
| `game/effects.ts` | `getVar`, `setVar`, intérprete de bytecode, efectos ✕ | `KAWSEG 0x801E7DD4`, `0x801E81DC`, `0x801E9C1C`, `0x801E9700` |
| `game/battle.ts` | Soportes por velocidad y ranura, orden de ataque, daño, KO, revivir, rondas | `KAWSEG 0x801E6AA4`, `0x801ECF0C` |
| `game/digivolve.ts` | Validación de digivolución y carga de stats | `KAWSEG 0x801E9F5C`, `SLUS 0x8004080C` |
| `game/turn.ts` | Máquina de estados del turno, acciones legales | `SLUS 0x80034260` |
| `rules/primitives.ts` | Aritmética, comparador, stats de entrada, DP | `0x801E9ABC`, `0x801E9BAC`, `0x8004080C`, `0x8004110C` |
| `ai/*.ts` | IA original de la CPU, una decisión por archivo | `KAWSEG 0x801DFF2C…0x801E6AA4` (ver 06) |

## Fases (`state.phase.name`)
`mulligan` → `entrance` (si el slot está vacío) → `dp` → `digivolveOption` → `digivolve` →
`attack` (ambos jugadores) → `support` (primero el que no tiene el turno) → resolución → turno siguiente.

## Decisiones provisionales (🟡)
Puntos donde el juego todavía no se leyó completo. El motor elige la opción más conservadora y lo
dice en el código (`🟡` en `turn.ts` / `digivolve.ts`):

| Punto | Comportamiento actual del motor |
|---|---|
| Cartas elegibles para la Entrada | Cualquier carta Digimon de la mano (incluido Armor, que entra sin reducción). |
| Cartas elegibles como soporte | Cualquier carta de la mano; una Digivolve Option no tiene efecto (el juego le asigna velocidad −1). |
| Cambiar la mano | Solo si el Online Deck tiene cartas. |
| Digi-devolve | Descarta la carta de arriba; la de abajo carga stats completos y HP ×2 (según el texto). No vacía el DP Slot. Después se pasa a la batalla. |
| De-Armor | Requiere Armor con una carta debajo; descarta el Armor. |
| Digivolve Option usada | Va al Offline Pile al terminar la fase de digivolución. |
| Mezclar el mazo | Orden aleatorio con semilla propia (no se reproduce la secuencia exacta del `rand()` de PS1). |
| KO de ambos en la misma batalla | Se procesa primero el jugador del turno. |

## Partida jugable (Etapa 4)

* `src/game/session.ts`: sesión humano contra CPU (store de Zustand sin React). La CPU actúa sola cuando
  le toca y elige su ataque enseguida, oculto hasta después de los soportes.
* La CPU juega con la **IA original** portada en la Etapa 6 (ver más abajo y [`06-ia-original.md`](06-ia-original.md)).
* Mazos: los originales de `DECK2.DEK` (3 mazos iniciales del jugador y los de los rivales).
* `src/game/describe.ts`: textos en español de los eventos (registro y reporte de batalla).

## Interfaz moderna (Etapa 5)

La interfaz **solo lee** lo que devuelve el motor; nunca decide reglas.

* **Escenas** (`src/game/scenes.ts`): los eventos del motor se agrupan en escenas (`digivolve`,
  `battle`) que la sesión encola y la UI reproduce en orden.
* **Cinemáticas** (`src/ui/play/Cinematics.tsx`): digivolución (destello y carta nueva) y batalla paso
  a paso (revelado de ataques, cada efecto con su velocidad y si se aplicó, se anuló o no cumplió la
  condición, orden de ataque, golpes con número de daño y barras de HP, Crash, Eat-up, KO). Se pueden
  saltar (Esc) o avanzar (Enter/Espacio) y respetan "reducir movimiento".
* Los eventos llevan **instantáneas de HP y de ataques** (`hp`, `attacks`) para animar cada paso; no
  vuelven nunca a las reglas.
* **Tablero**: arena central (tu Digimon contra el de la CPU), indicador de DP segmentado hasta 90,
  pilas, rondas, riel de fases y mano con animaciones de layout (la carta "viaja" al slot o al DP Slot).
* **Arte original** de las 301 cartas, pixelado, extraído del disco (`npm run extract:art`).
* Atajos: teclas 1/2/3 eligen ◯/△/✕.

## Mazos propios (Etapa 6)

* `src/game/deckbook.ts`: reglas de construcción del original (30 cartas, máximo 4 copias, al menos un
  Digimon) y guardado en `localStorage`. Pestaña **Mazos**: crear vacío o copiar cualquiera de los 159
  mazos originales, filtrar las 301 cartas, añadir y quitar copias.
* Sin progresión todavía, todas las cartas están disponibles (en el original dependen de tu colección).

## Tests (`tests/engine/`)
* `battle.test.ts` — 24 casos de resolución con cartas reales (orden por velocidad, desempates, Jamming, Counter, Crash, Eat-up, X3, revivir, KO, rondas).
* `turn.test.ts` — 17 casos de flujo (robo, redibujado automático, derrota sin Digimon, entrada C/U, una carta de DP por turno, digivolución normal y con options, orden de elección de soporte, sin batalla).
* `match.test.ts` — partidas completas aleatorias con 8 semillas (siempre terminan, nunca se pierde una carta) y Digivolve Options restantes.
* `cpu.test.ts` — la CPU solo juega acciones legales y completa partidas CPU contra CPU con los mazos originales.
* `session.test.ts` — la sesión arranca, deja jugar a la CPU sola y rechaza acciones ilegales.

## IA original (Etapa 6)

* `src/engine/ai/`: port de las 7 decisiones de la CPU con sus rutinas auxiliares (detalle en
  [`06-ia-original.md`](06-ia-original.md)). Entrada pública: `createAi(personalidad, semilla)` y
  `chooseAiAction(state, jugador, ai)`, que devuelve siempre una acción legal.
* `simulateBattle(state)` (`game/battle.ts`): modo simulación del resolvedor que usa la evaluación de
  la IA (misma batalla, sin comandos de zonas ni azar). Devuelve el HP final de los dos jugadores.
* `PlayerState.settled`: bit 30 de los flags del jugador, que lee la IA (Mutant Digivolve).
* La partida pasa a la CPU la personalidad del mazo rival (`OriginalDeck.ai`), que se ve en la pantalla
  de nueva partida.

## Compañero y Armor-digivolución (Etapa 6, progresión)

* `game/partner.ts`: ranuras de compañero (`PlayerState.partners`) y copia de su carta y de su forma Armor
  (`SLUS 0x80048230`: copia, ✕ 0 → 100, bonus de nivel, poderes negativos a 0, ✕ a 0 con Counter/Crash). Las
  instancias del compañero en el mazo usan esa copia (`PlayerState.partnerOf`, `SLUS 0x80046A38`); `cardOf` la
  devuelve, con las Digi-Parts equipadas aplicadas (9 tipos; el tipo 7 copia las plantillas de soporte del ROM y,
  como en el juego, en la Armor solo cambia el texto y la velocidad).
* Sin modo historia, cada mazo crea sus ranuras como hace el juego con el mazo de la CPU (`SLUS 0x8003F9EC`):
  una por carta Partner, nivel 1, con el Digi-Egg del mazo (`OriginalDeck.partnerEgg`). 🟡 El jugador humano usa la
  misma regla en partida libre (sus mazos iniciales no traen huevo).
* Nueva fase `armorDigivolve` tras la Entrada si entra un compañero con huevo: el humano decide
  (`armorDigivolve` / `skipArmorDigivolve`, estado 9) y la CPU siempre acepta (estado 8). La carta se convierte en
  la Armor **en el sitio** (`SLUS 0x80040A48`): especialidad, HP y poderes de la Armor; se borra el bit 30; el
  estado anormal no cambia.

## Tablas y reglas de progresión (Etapa 6, en curso)

* `npm run extract:progression` → `src/data/progression.json`: 16 sobres, tabla de fusión 6×6, 20 fusiones
  especiales, Partner Fusion, 128 Digi-Parts (efecto, texto y nivel de aprendizaje por compañero), Digi-Part y
  cartas iniciales, plantillas de soporte y los 32 bonos de EXP. Se lee del disco del usuario
  (`SLUS_013.28` y `P.DRV`); el test lo vuelve a decodificar y lo compara.
* `progression/packs.ts`: generador de sobres (`SLUS 0x8004635C`). Los grupos coinciden con la simulación
  independiente de la investigación; la regla del grupo raro (límite superior ≠ 0) se leyó en `0x8004667C`.
