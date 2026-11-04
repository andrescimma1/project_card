# 04 — El motor original, leído del código

Especificación del motor de reglas obtenida **desensamblando el juego** (ejecutable `SLUS_013.28`
y overlay de batalla `P.DRV/KAWSEG`, que carga en `0x801DDF38`). Todo lo de este documento es
✅ **VERIFICADO EN CÓDIGO**: describe lo que el juego ejecuta, con la dirección de la rutina.
Las primitivas ya están portadas 1:1 en
[`src/engine/rules/primitives.ts`](../../src/engine/rules/primitives.ts) con tests.

---

## 1. Estructuras

### Contexto de batalla (`*0x801D8340`)
| Campo | Significado |
|---|---|
| `+0x817` | **Jugador del turno** (0/1). Se invierte al final de cada turno (`0x80038F18`). |
| `+0x818` | Estado de la máquina de estados (40 estados, tabla `0x80011008`). |
| `+0x81E` | Ganador de la ronda / de la partida. |
| `+0x50` / `+0x54` | Puntero al jugador que ataca 1º / 2º en esta batalla. |

### Jugador (`*0x801D8348[i]`)
| Campo | Significado |
|---|---|
| `+0x11C` | HP actual. `+0x11E/+0x120/+0x122` poderes ◯△✕ persistentes. |
| `+0x158` | HP de trabajo durante la resolución. `+0x15C..+0x160` poderes base. `+0x168..+0x16C` poderes de esta batalla. |
| `+0x162` | Daño recibido en la batalla. `+0x164` HP comido (Eat-up). `+0x166` HP de "revivir". |
| `+0x178` | Flags: bits 0-1 ataque elegido · bits 2-3 ataque efectivo · `0x40` contraataque · `0x80` va a contraatacar · `0x100` atacar primero · `0x200` soporte Digimon anulado · `0x400` Option anulada · `0x800` Crash · `0x1000` Eat-up · `0x2000` X3 aplicado · `0x4000` revivir · bits 15-16 **estado anormal** (nivel con el que entró) · bits 19-21 **especialidad actual**. |
| `+0x17C` | Rondas ganadas. |
| `+0x17D` | Online Deck (30 posiciones). |
| `+0x19B` | Offline Pile (30). |
| `+0x1B9` | Mano (**4** posiciones). |
| `+0x1C2` | DP Slot (**8** posiciones; se llena de la 7 a la 0, la "de arriba" es la más reciente). |
| `+0x1CA` | Pila del Battle Slot (3 cartas: R → C → U). |

Todas las zonas son **arreglos fijos con huecos**: el *tope* es la primera posición ocupada desde el índice 0 y se inserta en la última vacía buscando desde el final. Lo que vuelve al Online Deck queda arriba; la carta de soporte sale de la mano al elegirla (`0x801ECB40`).

---

## 2. Turno (máquina de estados `SLUS 0x80034260`)

| Estados | Qué hace |
|---|---|
| 1–2 | **Robar** hasta llenar la mano (4) o vaciar el mazo. |
| 3 | Sin Digimon en el Battle Slot: si hay Digimon en mano → Entrada; si no hay y **queda mazo** → se descarta la mano entera y se roba de nuevo; si no hay y **el mazo está vacío** → **ese jugador pierde la partida**. |
| 6 | "Change all Cards": descartar la mano entera y volver a robar (se puede repetir). |
| 8–9 | **Entrada** del Digimon y Armor-digivolución del Partner (Digi-Egg). |
| 11–13 | **Cargar DP: UNA carta Digimon por turno.** Al colocarla, el estado avanza directo a la Digivolve Option. Con el slot lleno (8) se salta. |
| 14–16 | Digivolve Option. |
| 18–21 | Digievolucionar. Al hacerlo, **todas las cartas del DP Slot van al Offline Pile** (`KAWSEG 0x801ECE24`) y se salta a la batalla → **una digivolución por turno**. |
| 23 | Si el rival no tiene Digimon, no hay batalla. |
| 26–30 | Elección de soporte (primero el que ataca 2º). |
| 32 | **Resolución** (§4). |
| 35–36 | Animación, KO (§6), rondas. |
| 37 | Fin de turno: las cartas de soporte usadas van al Offline Pile; se restauran los poderes; `turno ^= 1`. |
| 39 | IA de la CPU. |

---

## 3. Entrada al Battle Slot y digivolución

### Stats al poner una carta (`SLUS 0x8004080C`)
```
desplazamiento = max(nivel_con_que_entró − 1, 0)      R, A → 0 · C → 1 · U → 2
HP       = ⌊(HP_carta    >> desplazamiento) / 10⌋ × 10
◯ △ ✕    = ⌊(poder_carta >> desplazamiento) / 10⌋ × 10
especialidad actual = la de la carta
```
* Entrar con C = mitad de HP **y** de los 3 poderes; con U = un cuarto. Truncado a decenas.
* Digievolucionar **limpia** el estado anormal y carga los stats completos de la nueva carta
  (también restaura la especialidad: los cambios de especialidad por soporte duran hasta que el
  Digimon cambia de carta).

### DP (`SLUS 0x8004110C`)
`DP total = Σ +P de las cartas del DP Slot`, **tope 90**. No hay contador aparte: los DP *son*
las cartas del slot. Por eso descartar cartas del DP Slot baja los DP.

### Validación de digivolución del jugador (`KAWSEG 0x801E9F5C`, tabla `0x801DE17C`)
Niveles: R 0, A 1, C 2, U 3; "siguiente nivel" de R es C. La especialidad comparada es la **actual**
(un soporte que la cambió permite evolucionar a otro color).

| Con… | Regla en código |
|---|---|
| Ninguna option | No desde Armor. Siguiente nivel, **misma especialidad actual**, `DP ≥ requerido`. **No mira el estado anormal**: un C que entró directo puede digievolucionar con DP. |
| Special | No desde Armor. Siguiente nivel, **cualquier especialidad**, `DP + 20 ≥ requerido` (**20 DP menos**). |
| Warp | Solo desde R. Destino U, misma especialidad, `DP ≥ requerido`. |
| Speed | No desde Armor ni en estado anormal. Siguiente nivel, misma especialidad, **sin DP**. |
| Mutant | **Mismo nivel**, cualquier especialidad, `DP ≥ requerido`. |
| Download | Cualquier Digimon de destino, sin más condiciones. |
| ArmorCrush | Solo desde Armor; destino C o U, misma especialidad, `DP ≥ requerido`. |
| De-Armor | Solo desde Armor. |
| Digi-devolve | No desde Armor; necesita **al menos 2 cartas** en la pila de evolución. |

La pila de evolución se conserva: cada digivolución apila la nueva carta encima (`0x8004080C`).
La rutina de la IA (`0x801E3C00`) aplica las mismas reglas para Special, Warp, Speed y Mutant.

---|---|
| Special | No en Armor. Nivel destino = siguiente (R cuenta como 1 → C). **Sin chequeo de especialidad.** Válido si `DP_total + 20 ≥ DP_requerido` → **cuesta 20 DP menos**. |
| Warp | Solo desde R. Destino U. **Misma especialidad.** `DP_total ≥ requerido`. |
| Speed | No en Armor. **No en estado anormal.** Siguiente nivel, misma especialidad, **ignora DP**. |
| Mutant | **Mismo nivel**, ignora especialidad, `DP_total ≥ requerido`. |
| Digi-devolve, Download, ArmorCrush, De-Armor | Sin restricciones en esta rutina (validación en otro punto; ver texto de la carta). |

---

## 4. Resolución de soportes y efectos ✕ (`KAWSEG 0x801E6AA4`)

1. Al empezar, se copian HP y poderes base a los valores de batalla y se limpian los flags de la batalla anterior.
2. Se arma una lista de **6 ranuras** (1º = jugador del turno):

   | Ranura | Contenido | Velocidad |
   |---|---|---|
   | 0 | Option del jugador del turno | Support Speed de la carta |
   | 1 | Option del rival | ídem |
   | 2 | Soporte Digimon del jugador del turno | Support Speed |
   | 3 | Soporte Digimon del rival | ídem |
   | 4 | Efecto ✕ del jugador del turno | tabla `0x8006E4FC` |
   | 5 | Efecto ✕ del rival | ídem |

   Una Digivolve Option jugada como soporte (o salida en el *Gamble*) tiene velocidad −1: **no hace nada**.
3. Se recorre **velocidad 3 → 2 → 1** (la 0 nunca se ejecuta) y, dentro de cada velocidad, las ranuras **0 → 5**.
   * **Desempate a igual velocidad:** Option antes que soporte Digimon antes que efecto ✕; dentro de cada tipo, el **jugador del turno** primero.
4. Ranuras 0–1: se saltan si el jugador tiene `0x400` (Option anulada). Ranuras 2–3: si tiene `0x200`.
   Ranuras 4–5: **solo si el dueño eligió ✕**.
5. Anular solo afecta a efectos que **todavía no se ejecutaron**.

### Velocidades de los efectos ✕
| Velocidad 3 | Velocidad 2 | Velocidad 1 |
|---|---|---|
| Jamming | 1st Attack, Eat-up HP | ◯/△/✕ to 0, Counters, Crash, Foe X3 |

### Efectos ✕ (`KAWSEG 0x801E9700`)
| Efecto | Qué hace exactamente |
|---|---|
| 1st Attack | flag `0x100` en sí mismo. |
| ◯/△/✕ to 0 | Pone a 0 ese poder del rival, elija lo que elija. |
| Counter ◯/△/✕ | **Solo si el rival eligió ese ataque**: flag de contraataque propio y borra el del rival. |
| Crash | flag `0x800` (se resuelve justo antes de atacar, §5). |
| Eat-up HP | flag `0x1000`. |
| Jamming | Anula el soporte **Digimon** del rival (`0x200`); las Option no se ven afectadas. |
| Foe X3 | Si la especialidad **actual** del rival coincide, ✕ propio ×3 (tope 9990). |

---

## 5. Orden de ataque y daño (`KAWSEG 0x801E7658` en adelante)

```
primero = jugador del turno, segundo = rival
si segundo tiene "atacar primero":
    si primero también → se anulan ambos (sigue primero el del turno)
    si no             → se intercambian
si primero tiene "contraataque":
    si segundo también → se anulan y TODOS los poderes de ambos pasan a 0 (nadie hace daño)
    si no             → se intercambian (quien contraataca pasa a atacar segundo)
si segundo tiene "contraataque":
    poder[segundo.ataque] = poder[primero.ataque]   (devuelve el poder final del atacante)
    todos los poderes de primero = 0                 (el ataque "falla")

-- primer golpe --
si primero tiene Crash:  (si segundo contraataca → el contraataque vale HP(primero); si no → ✕(primero) = HP(primero)); HP(primero) = 10
daño = poder[primero.ataque]
si primero tiene Eat-up: cura min(daño, HP(segundo)), tope 9990
HP(segundo) −= daño;  si ≤ 0 → KO y el segundo NO ataca

-- segundo golpe (si sigue vivo) --
igual que arriba con los papeles invertidos; el Crash del segundo usa su HP DESPUÉS de recibir el primer golpe
```

---

## 6. KO y rondas (`KAWSEG 0x801ECF0C`, estados 36–37)

* El rival del Digimon derrotado **gana la ronda** (`+0x17C += 1`). A las **3** termina la partida.
* **Revivir:** el Digimon queda con el HP indicado, pero **la ronda igual cuenta para el rival**. No se aplica si el **ganador** ya tenía 2 rondas (`0x801ED008` lee las rondas del ganador).
* Sin revivir: **toda la pila de evolución va al Offline Pile**. El **DP Slot se conserva**.
* Si el jugador derrotado no tiene Digimon en el slot, ni cartas Digimon en mano, y su Online Deck está vacío → **pierde la partida** (*"Since %s has no more Digimon, the winner is %s!"*).

---

## 7. Comandos del bytecode (`KAWSEG 0x801E81DC`)

| Comando | Comportamiento |
|---|---|
| Descartar de la mano (0x1A/0x1B) | **Siempre al azar**, hasta la cantidad pedida o la que haya. |
| Descartar del mazo (0x20/0x21) | Del tope del Online Deck al Offline Pile; para si el mazo se vacía. |
| Offline → Online (0x22/0x23) | Mueve del tope del Offline Pile. |
| Descartar DP (0x24/0x25) | Empieza por la carta **más reciente**; "todas" = cantidad ≥ 8. |
| Robar (0x31/0x32) | Para al llenar la mano (4) o vaciar el mazo. |
| Rotar ataque rival (0x2F) | ◯ → △ → ✕ → ◯. |
| Contraatacar (0x34) | Activa el propio y **borra el del rival**. |
| Revivir (0x30) | Guarda el HP y activa el flag. |
| Cambiar especialidad (0x00/0x01) | Dura hasta que ese Digimon cambia de carta. |
| Escribir HP (0x02/0x03) | Persiste entre batallas. |
| Escribir poderes (0x04–0x0B) | Solo esta batalla (se restauran al resolver la siguiente). |
| 0x0C–0x0F, 0x12–0x18, 0x26–0x29 | No hacen nada. |
| 0x1C / 0x1D | Sin decodificar; **ninguna carta los usa**. |

---

## 8. La IA de la CPU (mapa)

La CPU es una **corrutina aparte** (`SLUS 0x80038F68`). La máquina de estados le pide una decisión
escribiendo un código en `ctx+0x816`; el índice del jugador CPU está en `ctx+0x827` y la respuesta
vuelve en `ctx+0x804`. El módulo ocupa `KAWSEG 0x801DFF2C…0x801E6AA4` (~6 900 instrucciones, 47 funciones).

| Código | Estado que pregunta | Decisión | Rutinas |
|---|---|---|---|
| 1 | 4 | Quedarse con la mano o cambiarla | `0x801E19EC` |
| 2 | 8 | Qué Digimon entra | `0x801E2100` |
| 3 | 11 | Qué carta va al DP Slot (y plan de digivolución) | `0x801E157C`, `0x801E3FF4`, `0x801E3AF8`, `0x801E363C` |
| 4 | 14 | Qué Digivolve Option jugar | `0x801DFFD4`, `0x801E4E08` |
| 5 | 18/19 | A qué digievolucionar | `0x801E3C00` (mismas reglas que la validación del jugador) |
| 6 | 24 | Qué ataque elegir | `0x801E0CCC` + `0x801E4E58` |
| 7 | 26/29 | Qué soporte usar | `0x801E0CCC` + `0x801E5710` |

* **Personalidad:** cada mazo de `DECK2.DEK` trae 4 parámetros (0–2) en `+0x66`, que `SLUS 0x8003FE7C`
  copia a los flags del jugador (bits 22-23, 24-25, 26-27 y 28-29). Por ejemplo, la rutina de cambiar
  mano bifurca según los bits 26-27.
* **Simulación:** la evaluación `0x801E0CCC` llama a la resolución real de batalla (`0x801E6AA4`) en
  **modo simulación** (sin animaciones ni efectos sobre las zonas) para comparar opciones.

La IA está portada completa: ver [`06-ia-original.md`](06-ia-original.md).
