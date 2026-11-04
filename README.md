# Digimon Digital Card Battle — remake 1:1

Reproducción fiel de las reglas, cartas y efectos de *Digimon Digital Card Battle* (PS1, SLUS-01328),
con una interfaz moderna. La única modernización es visual: las reglas salen del juego original.

## Estado: Etapa 6 (contenido) en curso

* Pestaña **Mazos**: constructor con las reglas originales; los mazos guardados se pueden usar al jugar.
* IA original de la CPU: portada completa desde el código del juego (`src/engine/ai/`, ver
  `docs/research/06-ia-original.md`), con la personalidad de cada mazo rival.
* Progresión del original investigada (mundo, guiones, sobres, compañero, fusión, rangos, guardado):
  `docs/research/07-progresion.md`. Todavía sin implementar.

## Etapa 5 (interfaz moderna)

* Tablero rediseñado con el **arte original** de las cartas, arena central, indicador de DP,
  cinemáticas de **digivolución** y de **batalla paso a paso**, animaciones de layout y atajos de teclado.

## Etapa 4 (primera partida jugable)

* Pestaña **Jugar**: partida completa contra la CPU, con los mazos originales del juego
  (`DECK2.DEK`). Desde la Etapa 6 la CPU usa la IA original.

## Etapa 3 (motor de reglas)

* **Motor de reglas** (`src/engine/`): port de las rutinas de batalla del juego, sin React,
  determinista. API `createGame` / `legalActions` / `applyAction`. Ver
  [`docs/research/05-motor-implementado.md`](docs/research/05-motor-implementado.md).

## Etapa 1 (investigación)

* **Base de datos completa de las 301 cartas**, extraída del disco original
  (`B.DRV/CARD2.CDD`) — stats, ataques, efecto ✕, DP, +P y el **bytecode original** de cada
  efecto de soporte. Ver `src/data/cards.json`.
* **Especificación de reglas** con estado verificado / probable / desconocido:
  [`docs/research/01-mecanicas-originales.md`](docs/research/01-mecanicas-originales.md).
* **Formato binario del ROM** y decodificación de los efectos:
  [`docs/research/02-formato-rom.md`](docs/research/02-formato-rom.md).
* **El motor original leído del código** (desensamblado del overlay de batalla): orden de
  resolución, daño, contraataques, KO, DP y digivolución —
  [`docs/research/04-motor-original.md`](docs/research/04-motor-original.md). Primitivas portadas 1:1
  en `src/engine/rules/primitives.ts`.
* Contraste con fuentes externas (manual, GameFAQs, Wikimon):
  [`docs/research/03-fuentes-externas.md`](docs/research/03-fuentes-externas.md).
* Visor web para recorrer las cartas y los documentos.

## Uso

```bash
npm install
npm run dev            # visor en http://localhost:5173
npm test               # tests de fidelidad de datos
npm run typecheck
```

Regenerar cartas y mazos desde tu propio disco (los archivos del juego nunca se copian al repo):

```bash
npm run extract:cards -- "C:/ruta/Digimon - Digital Card Battle (USA)_extracted"
```

```bash
npm run extract:decks -- "C:/ruta/Digimon - Digital Card Battle (USA)_extracted"
```

```bash
npm run extract:art -- "C:/ruta/Digimon - Digital Card Battle (USA)_extracted"
```

El arte va a `public/card-art/` y no se sube a git.

Para que los tests también re-decodifiquen el disco y lo comparen byte a byte con el JSON,
definir `DCB_DISC` con esa misma carpeta.

## Estructura

```
src/engine/cards/   modelo de cartas + decodificador del ROM (sin React)
src/data/cards.json base de datos generada
src/ui/             visor (React + Tailwind + Zustand + Motion)
tools/              extractor de datos desde los .DRV
docs/research/      especificación de reglas y formato del ROM
tests/              tests de fidelidad contra hechos documentados del juego
```
