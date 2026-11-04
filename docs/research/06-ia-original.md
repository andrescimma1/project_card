# 06 — La IA original de la CPU (portada)

La CPU del juego vive en el overlay de batalla `KAWSEG` (`0x801DFF2C…0x801E6AA4`, unas 6 900
instrucciones). Está **portada a TypeScript decisión por decisión** en [`src/engine/ai/`](../../src/engine/ai/),
con la dirección original en cada bloque y tests en `tests/engine/ai/`. Todo lo descrito aquí es
✅ **leído del código**, salvo lo marcado 🟡.

## Cómo se le pide una decisión

La máquina de estados escribe un código en `ctx+0x816` y despierta la corrutina `SLUS 0x80038F68`, que
llama a la rutina y deja la respuesta en `ctx+0x804`. Solo se le pregunta al jugador cuyos flags
tienen los bits 17-18 a 1 (CPU).

| Código | Estado | Decisión | Rutinas | Port |
|---|---|---|---|---|
| 1 | 4 | Quedarse la mano o cambiarla (se vuelve a preguntar tras cada cambio) | `0x801E19EC` | `mulligan.ts` |
| 2 | 8 | Qué Digimon entra | `0x801E2100` + respaldo del estado 8 (`SLUS 0x80034D88`) | `entrance.ts` |
| 3 | 11 | Plan de digivolución y carta al DP Slot | `0x801E157C` → `0x801E3FF4` → `0x801E3AF8` → `0x801E363C` | `dp.ts` |
| 4 | 14 | Qué Digivolve Option jugar | `0x801DFFD4` + `0x801E4E08` | `option.ts` |
| 5 | 18/19 | A qué digievolucionar | `0x801E3C00` (el estado lo revalida con `0x801E9F5C`) | `option.ts` |
| 6 | 24 | Qué ataque usar | `0x801E0CCC` + `0x801E4E58` | `evaluate.ts`, `attack.ts` |
| 7 | 26/29 | Qué soporte usar | `0x801E0CCC` + `0x801E5710` | `evaluate.ts`, `support.ts` |

`src/engine/ai/index.ts` convierte cada respuesta en la acción del motor que ejecutaría el estado. Si el
motor no la permite (por ejemplo, una Option que ya no está en la mano), usa la acción de "pasar" de la
fase, igual que el juego, que en esos casos no hace nada.

## Personalidad

Cada mazo de `DECK2.DEK` trae 4 bytes en `+0x66` (`OriginalDeck.ai`). `SLUS 0x8003FE7C` los copia en ese
orden a los bits 22-23, 24-25, 26-27 y 28-29 de los flags del jugador 1. Cada uno lo usa una sola decisión:

| Byte | Decisión | 0 | 1 | 2 | 3 |
|---|---|---|---|---|---|
| `ai[0]` | Entrada y carta al DP | filtros (orden A) | filtros (orden B en el DP) | al azar | no decide (respaldo) |
| `ai[1]` | Ataque | moneda: azar o "listo" | igual que 0 | siempre azar ponderado | igual que 0 |
| `ai[2]` | Cambiar la mano | ≥ 3 cartas por ronda que falta | ≥ 4 | 1 de cada 3 | nunca sin Digimon; siempre con Digimon |
| `ai[3]` | Soporte | prudente (disrupción, apostar con el mazo) | anuladores según la carta de arriba del rival | al azar | sin respuesta |

En `DECK2.DEK` solo aparecen los valores 0, 1 y 2.

## Información que usa (y un jugador humano no tiene)

* El **contenido** de su propio Online Deck (entrada, cambiar la mano).
* La **mano del rival**: la evaluación simula con cada carta de soporte que el rival podría jugar, y
  la decisión de cambiar la mano mira si el rival tiene un anulador.
* El **soporte boca abajo del rival** cuando la CPU elige segunda.
* La **carta de arriba del mazo del rival** (soporte, personalidad 1).
* **No** mira el ataque elegido por el rival.

## Evaluación por simulación (`0x801E0CCC`)

Para cada ataque propio (los tres, o solo el ya elegido) llama al resolvedor real `0x801E6AA4` en
**modo simulación** (`a0 = 1`) con cada combinación de soporte propio, soporte del rival y ataque del
rival, y acumula HP finales y KOs por ataque y por soporte. El modo simulación hace la misma batalla,
pero se salta los comandos de zonas (`0x1A–0x25`, `0x2A`, `0x2B`, `0x2E`, `0x31`, `0x32`) y no usa
`rand()`. En el motor es `simulateBattle` (`game/battle.ts`). La carta simulada como soporte sigue en la
mano, como en el juego.

## Lo que hace cada decisión

* **Cambiar la mano.** Sin Digimon en juego: se la queda con un R en mano, o si una Digivolve Option
  "encaja"; si no, decide la personalidad. Con Digimon en juego: se la queda si una Option encaja. Después
  solo se plantea cambiar cuando el rival está a una ronda de ganar, salvo que tenga una carta de
  recuperación o que su siguiente digivolución ya sea alcanzable.
* **Entrada.** Un compañero Armor (Veemon, Hawkmon, Armadillomon, Gatomon, Patamon, Wormmon) entra
  siempre el primero. Si no hay ninguno, se prueban los niveles en el orden R, A (solo si hay uno), C y U.
  Con varios Rookies prefiere la especialidad con más Armor en la mano, luego la que más abunda en su
  mazo, luego una carta sin efecto de soporte. Con C/U prefiere la especialidad más escasa en su mazo,
  luego una sin soporte, luego la de más DP requerido.
* **DP y plan.** Marca qué Digimon de la mano serían su siguiente digivolución natural y cuántos DP
  faltan. Con Digivolve Options, planifica una digivolución que cumpla las reglas de cada tipo, más
  condiciones propias: Mutant solo si el activo ya llegó a la batalla de su turno (bit 30), y De-Armor y
  Digi-devolve solo con HP < 300. Pone en el DP Slot la carta de menor +P que cubre lo que falta (50 DP
  por defecto, 60 con un Armor en juego), nunca el objetivo ni una carta de +0. Con un solo candidato
  lo pone siempre.
* **Option y digivolución.** Juega la Option que eligió el plan y evoluciona al objetivo del plan.
* **Ataque.** Usa un ataque con KO seguro; si hay varios, elige al azar con pesos 2/3/5 entre ◯△✕. Sin
  KO, usa el único ataque sin riesgo. En otro caso, o lanza una moneda (en su turno maximiza su HP final,
  fuera de él minimiza el del rival) o elige al azar.
* **Soporte.** Si algún soporte deja KO al rival, lo usa (con preferencia por las cartas de disrupción).
  Si no, depende de `ai[3]`: el soporte que deja al rival con menos HP, apostar con la carta de arriba
  del mazo, un anulador o el azar.

## Peculiaridades del original que se reproducen

* **Options por índice de catálogo.** Al cambiar la mano, la IA distingue las Digivolve Options por el
  byte `+0x15` de su entrada, que es `id − 293` (`SLUS 0x80046BAC`), mientras que sus ramas parecen
  escritas para el código de tipo. Por eso ArmorCrush recibe la lógica de Warp. El plan del DP sí usa
  el tipo real.
* La evaluación **siempre devuelve −1**: el estado "ambos vivos" de cada soporte se inicializa a −1 y
  solo se escribe cuando vale 0. Así, la condición de la mulligan que la consulta nunca se cumple.
* Tres filtros del soporte borran el campo equivocado y no filtran nada. Se omiten.
* Al cambiar la mano, los casos 6 y 7 de la tabla son inalcanzables, porque el bucle para en 6.
* En la entrada, el filtro "sin cartas de su especialidad en mano" nunca filtra: la cuenta incluye a
  la propia carta.

## Decisiones del port (🟡)

| Punto | Qué hace el port |
|---|---|
| Contador de efectos de soporte de la entrada (nunca se pone a 0 en el original) | Empieza en 0. Se conserva el arrastre de los candidatos Armor descartados hacia C/U, con test. |
| Instantánea de la carta de arriba del mazo (`+0x1BD`, la toma la pantalla del humano) | La carta de arriba actual. Si el rival acaba de apostar, la carta apostada. |
| Soporte "sin respuesta" (`ctx+0x804` conserva el valor anterior) | Sin soporte. Lo más probable es que el valor heredado sea un índice de ataque (0..2), que nunca es una carta de la CPU. |
| Respuesta "carta de arriba del mazo propio" (índice 4) | Sin soporte, porque el estado solo busca la carta en la mano. |
| HP mostrado (`+0x126`) | El HP actual: coinciden cuando la CPU decide. |
| `rand()` | El LCG de la PS1 (`psxRand`), con un generador propio de la CPU sembrado con la semilla de la partida. No es la secuencia global del juego. |
| Bit 30 de los flags | `PlayerState.settled`: se pone al llegar al paso de batalla del turno (estado 23) y se borra en cada carga de stats. |
| `ctx` y `temp` tras simular | No se restauran en el original; en el port cada simulación parte de una copia limpia. |

## Cambios en el motor

* `PlayerState.settled` (flag bit 30) y `simulateBattle` (modo simulación del resolvedor).
* La CPU provisional (`game/cpu.ts`) se eliminó: la partida usa `chooseAiAction` con la personalidad del
  mazo rival.
