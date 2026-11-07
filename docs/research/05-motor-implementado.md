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

## Interfaz: remasterización del tablero original

La interfaz **solo lee** lo que devuelve el motor; nunca decide reglas. El tablero sigue la composición
de la pantalla de batalla de PS1 (capturas de referencia del juego) con una presentación moderna propia:
no usa texturas ni gráficos de la interfaz original, solo el arte de las cartas extraído del disco.

* **Composición** (`src/ui/play/PlayScreen.tsx`): barra de fase arriba (*"Preparación: preparando la
  mano"*), zona del rival arriba (marco cobre) y la del jugador abajo (marco azul), cada una con sus cuatro
  huecos de mano, Online Deck y Offline Pile, DP Slot, nombre, mazo, rondas y la pestaña vertical
  *1.er / 2.º ataque*. En el centro, los dos Battle Slots enfrentados en espejo: DP por fuera, ◯ △ ✕ en
  rojo, verde y azul, y el arte hacia el centro con su HP. Abajo, la barra de órdenes de cada fase.
* Mientras se decide el ataque, la mano de cada jugador se reemplaza por su **lista de ataques**, como en el
  original (*"Battle: Deciding an Attack"*); "Ver cartas" vuelve a mostrar la mano.
* **Marco de juego** (`src/ui/play/Stage.tsx`): el tablero se dibuja a 900 de alto y se escala para entrar
  en la ventana, de 4:3 a ultrapanorámico; la página nunca se desplaza (las listas largas de otras
  pantallas se desplazan dentro de su panel). En vertical pide girar el dispositivo.
* **Escenas** (`src/game/scenes.ts`): cada escena guarda el tablero sobre el que se reproduce (`state`):
  la batalla, el de antes de la batalla; la digivolución, el de justo después. Así el tablero nunca
  adelanta lo que todavía no se vio.
* **Batalla en el tablero** (`src/ui/play/Playback.tsx`): la resolución se reproduce sobre los propios
  Battle Slots: revelado de ataques, cada efecto con su carta, velocidad y si se aplicó, orden de ataque,
  embestida, número de daño, barras de HP que bajan con estela, KO y rondas. Enter/Espacio avanza, Esc salta.
* **Digivolución** (`src/ui/play/Cinematics.tsx`): destello y carta nueva sobre el tablero.
* Los eventos llevan **instantáneas de HP, ataques y poderes** (`hp`, `attacks`, `powers`) para animar
  cada paso; no vuelven nunca a las reglas.
* **Cartas** (`src/ui/play/CardFace.tsx`): marco metálico del color de la especialidad, nivel, +P, HP,
  ◯ △ ✕, brillo holográfico e inclinación 3D al pasar el puntero; la ventana de carta muestra el texto
  completo y la ficha técnica.
* **Arte original** de las 301 cartas, pixelado, extraído del disco (`npm run extract:art`).
* Atajos: teclas 1/2/3 eligen ◯/△/✕.

## Identidad propia (sobre el mismo motor)

El juego dejó de ser un remake: conserva el motor, el DP, la evolución, los efectos y la progresión, pero
la interfaz habla con vocabulario y estética propios. **Las reglas no cambiaron** (ningún archivo de
`src/engine` se tocó en este paso).

* **Vocabulario** (`src/ui/vocab/`): todo lo que el jugador lee sale de ahí y es configurable.
  * `actions.ts`: los tres ataques son **Furia**, **Técnica** e **Instinto** (`fury`, `technique`,
    `instinct`). Es una capa de compatibilidad: el motor y los datos del disco siguen llamando a los
    espacios `circle / triangle / cross`, y la interfaz convierte solo en el borde (`slotOf`, `actionOf`).
  * `factions.ts`: la especialidad de las reglas se muestra como **facción** (Roja, Azul, Verde, Sombría,
    Dorada) con su paleta. Facción, hábitat y elemento son conceptos distintos: la facción es
    temperamento y la usan las reglas; hábitat y elemento son solo presentación.
  * `terms.ts`: Criatura, Evolución, Novato / Campeón / Perfecto, Puntos de evolución (PE), Reserva,
    Mazo, Descarte, Carta de apoyo, Carta de evolución, Reliquias, Huevo… Los textos de las cartas del
    disco se muestran con esos nombres (`cardText`), sin tocar los datos.
* **Tema** (`src/index.css`, `src/ui/play/glyphs.tsx`): fantasía ilustrada con piedra tallada, cuero,
  bronce y pergamino, más texturas de papel y grabados generados con SVG. Fuentes Grenze (títulos y
  números) y Alegreya Sans (texto). Iconos SVG propios: espadas cruzadas, mira, escudo, emblemas de
  facción y el sello del dorso. Las cartas son físicas: esquinas redondeadas y marco del color de su
  facción.
* `tests/vocab.test.ts` revisa que ningún texto visible de la interfaz use términos de Digimon ni
  ◯ △ ✕, y que esté en español latino neutro.

## Idiomas

* Todo texto que lee el jugador sale de un diccionario por idioma (`src/i18n/locales/<idioma>/`):
  español latino neutro e inglés, con selector en la barra superior (se recuerda en el navegador; el
  español es el idioma por defecto). El compilador obliga a que cada idioma tenga todas las claves.
* Los textos de las cartas (efectos de soporte y de evolución) están reescritos en ambos idiomas con
  nuestro vocabulario en `src/i18n/cards/`, con el texto original del disco como clave; los datos no
  cambian. Los nombres de criaturas y ataques siguen siendo los del disco.
* El motor conserva sus mensajes (errores de mazo, fusión, intercambio…); `src/i18n/engineMessages.ts`
  los reconoce y los muestra en el idioma actual.
* Para agregar un idioma: copiar `locales/en`, traducirlo y sumarlo en `src/i18n/index.ts`.
  `tests/i18n.test.ts` revisa que esté completo, sin vocabulario de Digimon y sin texto escrito dentro
  de los componentes.

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

## Progresión y modo historia (Etapa 6, en curso)

| Módulo | Qué hace | Rutina del juego |
|---|---|---|
| `progression/collection.ts` | Colección: 6 copias, marcas nueva / obtenida / completa, números de serie | `SLUS 0x80045B18`, `0x80045E1C`, `0x80045968` |
| `progression/partnerExp.ts` | EXP acumulada, niveles 1–99, Digi-Part por nivel, +10 cada 5 niveles | `SLUS 0x80049934`, `KAWSEG 0x801F4A24`, `SLUS 0x80049840`, `0x8004994C` |
| `game/bonusFlags.ts` + `progression/bonuses.ts` | Las marcas de batalla (`+0x110`) que pone el motor y los 32 bonos de EXP | `KAWSEG 0x801FAA54`, tabla `0x801FC300` |
| `progression/ranks.ts` | Rangos Tamer / Collector / 2P (escalón a escalón, nunca bajan), porcentajes y título final | `SLUS 0x8002CC44`, `SAISEG 0x801E16B0`, `ENDSEG 0x801DE80C` |
| `progression/save.ts` | Partida nueva y resultado de una batalla contra la CPU (récords, EXP, Prize Pack, rangos) | `OPENSEG 0x801E8280`, `SLUS 0x8003F3C0` |
| `story/vm.ts` | Máquina virtual de los guiones MSCD | `SLUS 0x80020F54` |
| `story/cityHost.ts` | Comandos de las ciudades convertidos en peticiones a la interfaz; flags de historia en la partida | `SAISEG 0x801E390C`, `0x801E0B70` / `0x801E0A74` |

* `npm run extract:scripts` copia los guiones de las ciudades de tu disco a `public/scripts/` (ignorado por git:
  contienen los diálogos del juego). La pestaña **Historia** los ejecuta: partidas en 3 ranuras, mapa con las
  ciudades que abren los flags, Battle Cafe, torneos, recompensas y batallas con el motor y la IA original.
* 🟡 Decisiones: quién empieza una batalla de la historia (al azar); la Digi-Part inicial queda poseída pero sin
  equipar; los menús siempre ofrecen cancelar (−1), que los guiones tratan; la batalla del tutorial (mazo 0) no
  guarda resultado, como en el juego, pero se juega con tu mazo y no con el guion `BETA.MSD`.
* También: mazos con la colección, Auto Deck y mazo base, Digi-Parts y huevos (SUBSEG), las tiendas de fusión
  (EVOSEG), el intercambio, la batalla 2P (OPENSEG) y las estadísticas completas (ENDSEG). Detalle en
  [`07-progresion.md`](07-progresion.md) §12.1 y [`progresion/05`](progresion/05-estadisticas-autodeck-2p.md).
