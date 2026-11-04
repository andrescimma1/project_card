# 01 — Mecánicas originales de Digimon Digital Card Battle (PS1, SLUS-01328)

**Etapa 1 — Investigación.** Este documento es la especificación de reglas que el motor tiene que
reproducir. Cada afirmación lleva su fuente y su estado.

| Estado | Significado |
|---|---|
| ✅ **VERIFICADO** | Leído del propio juego: código, datos o texto in-game (o del manual oficial). Se cita la fuente. |
| 🟡 **PROBABLE** | Una sola fuente secundaria, o deducción fuerte a partir de datos verificados. |
| ❓ **DESCONOCIDO** | No hay dato. **No se implementa por suposición**; queda como pendiente. |
| ⚠️ **CONFLICTO** | Las fuentes no coinciden. |

### Fuentes primarias (todas del disco del usuario)

| Id | Fuente | Qué aporta |
|---|---|---|
| **[COD]** | Desensamblado del ejecutable y del overlay de batalla `KAWSEG` | El motor real: intérprete de efectos, orden de resolución, daño, KO, DP, digivolución. Detalle en [`04-motor-original.md`](04-motor-original.md). |
| **[CDD]** | `B.DRV/CARD2.CDD` | Tabla completa de 301 cartas con stats y bytecode de efectos ([`02-formato-rom.md`](02-formato-rom.md)). |
| **[TUT]** | `B.DRV/BETA.MSD` | Guion del tutorial de Betamon. |
| **[EXE]** | `SLUS_013.28` | Mensajes del sistema de batalla, nombres internos de fase. |
| **[HLP]** | `KAWSEG` @ `0x801FC168` | Ayuda "✕ Special Effect Descriptions". |
| **[EVT]** | `C.DRV` | Diálogos de NPCs (Armor, Partner, Digi-Eggs). |

### Fuentes externas (detalle y contraste en [`03-fuentes-externas.md`](03-fuentes-externas.md))

| Id | Fuente | Qué aporta |
|---|---|---|
| **[MAN]** | Manual oficial US (archive.org) | Límite de copias, penalización C/U, orden por velocidad, manos abiertas. |
| **[WKM]** | Wikimon (*Digital Card Arena*, versión JP de este juego) | Tabla de cartas: coincide al 100 % con el ROM. |
| **[G]** | FAQs de GameFAQs (2001–2003) | Comportamiento observado, bugs de cartas. |
| **[LP]** | Let's Play de Ephraim225 | Partidas observadas. |

Si una fuente externa contradice al ROM, manda el ROM; si contradice al código, manda el código.

---

## 1. Componentes del juego

| Elemento | Regla | Estado | Fuente |
|---|---|---|---|
| Mazo | **30 cartas**. | ✅ | [EVT] *"A Deck is a group of 30 Cards."*, [MAN] |
| Online Deck / Offline Pile | Mazo de robo / descarte (30 posiciones cada uno). | ✅ | [COD], [EXE] |
| Mano | **4 cartas**. Al inicio del turno propio se roba hasta 4. No se roba en el turno rival. | ✅ | [COD] array de 4; [TUT]; [MAN] |
| Battle Slot | Un Digimon por jugador; guarda la pila de evolución (hasta 3 cartas: R → C → U). | ✅ | [COD] |
| DP Slot | Hasta **8 cartas** Digimon. | ✅ | [COD] |
| Cartas Partner | 6 Partner Cards; solo se obtienen 3. | ✅ | [EVT] |
| Digi-Eggs | Ítems (no cartas) que habilitan la Armor-digivolución del Partner. | ✅ | [EVT], [MAN] |

### Construcción de mazo
| Regla | Estado | Fuente |
|---|---|---|
| **Máximo 4 copias** de la misma carta. | ✅ | [MAN] p.20 *"You can put up to four of the same Card into a Deck."* |
| El mazo debe tener cartas Digimon. | ✅ | [EXE] *"Please place Digimon Cards in a Deck."* |
| Sin límites por nivel, color u Option. | 🟡 | [MAN] (solo da consejos) |
| Solo 1 copia en la colección de las *Sevens*, *Download Digivolve* y *Rosemon's Lure*. | 🟡 | [G] |

---

## 2. Cartas (base de datos completa extraída del ROM)

**301 cartas** ✅ [CDD]: 191 Digimon, 102 Option, 8 Digivolve Option, en `src/data/cards.json`
(`npm run extract:cards`). Todos los valores numéricos coinciden con [WKM].

### 2.1 Carta Digimon
| Campo | Detalle | Estado |
|---|---|---|
| Especialidad | Fire (rojo), Ice (azul), Nature (verde), Darkness (negro), Rare (amarillo): 38/38/40/39/36. | ✅ |
| Nivel | R 41, C 75, U 62, A 13. | ✅ |
| HP, ataques ◯ △ ✕ | Valores exactos. | ✅ |
| Efecto ✕ | Uno de 16 (§6.3), cada uno con su velocidad. | ✅ [CDD]+[COD] |
| DP requerido | Para digievolucionar **a** esta carta. R y A = 0. | ✅ |
| +P | DP que aporta en el DP Slot: 0/10/20/30. | ✅ |
| Efecto de Soporte | Bytecode de 2 condiciones + 3 acciones + texto. | ✅ [COD] |
| Support Speed | None / Low / Mid / High (0–3). | ✅ [CDD]+[COD]+[MAN] |
| Valores de fusión | Solo para Card Fusion del modo historia. | ✅ |

### 2.2 Option
Solo se usan como **Soporte**. Mismo bytecode que el soporte Digimon. No aportan DP. ✅ [TUT], [CDD]

### 2.3 Digivolve Option (8 cartas)
Se juegan en la fase de Digivolución. Como soporte de batalla **no hacen nada** ✅ [COD], [MAN]. Reglas
exactas por tipo en §5.3.

---

## 3. Flujo de una partida

### 3.1 Estructura
| Regla | Estado | Fuente |
|---|---|---|
| Gana la partida quien gana **3 rondas**. Cada KO es una ronda, sin importar el nivel. | ✅ | [COD], [TUT], [MAN] |
| Quién empieza se decide eligiendo una carta boca abajo. | ✅ | [EXE] |
| Turno = **Preparación → Digivolución → Batalla**; al final, `turno ^= 1`. | ✅ | [COD] |

### 3.2 Preparación
| Paso | Regla | Estado | Fuente |
|---|---|---|---|
| Robo | Hasta 4 cartas o hasta vaciar el mazo. | ✅ | [COD] |
| Cambiar mano | Descartar la mano **entera** y robar de nuevo, sin límite de veces. | ✅ | [TUT], [MAN], [COD] |
| Sin Digimon en juego ni en mano | Si queda mazo: la mano se descarta y se roba de nuevo automáticamente. Si **el mazo está vacío: ese jugador pierde**. | ✅ | [COD] estado 3 |
| Entrada | Si el Battle Slot está vacío, se coloca un Digimon de la mano. | ✅ | [COD], [TUT] |
| Entrar con C o U | Permitido, en **estado anormal**: C con la mitad de HP y de los 3 poderes, U con un cuarto, truncado a decenas. | ✅ | [COD] `0x8004080C`, [MAN] |
| Salir del estado anormal | Al digievolucionar (stats completos de la nueva carta). Speed Digivolve no se puede usar en ese estado. | ✅ | [COD] |
| Digivolución normal con DP desde estado anormal | Permitida (la validación normal no mira el estado anormal). | ✅ | [COD] `0x801E9F5C` |
| Armor | Paso "Digi-Egg Power-Up": el Partner Armor-digievoluciona con su Digi-Egg. | ✅ existe / 🟡 detalle | [EXE], [MAN] |

### 3.3 Digivolución
| Paso | Regla | Estado | Fuente |
|---|---|---|---|
| Cargar DP | **Una carta Digimon por turno** de la mano al DP Slot. Con el slot lleno (8) se salta. | ✅ | [COD] estado 13 |
| Digivolve Option | Opcional (§5.3). | ✅ | [COD] |
| Digievolucionar | §5. **Una por turno** (tras hacerlo se pasa directo a la batalla). | ✅ | [COD] |

### 3.4 Batalla
| Paso | Regla | Estado | Fuente |
|---|---|---|---|
| Sin rival | Si el rival no tiene Digimon, no hay batalla (por eso el primer turno no tiene ataque). | ✅ | [COD], [TUT] |
| Elegir ataque | Ambos a la vez, sin verse. Los ataques no se revelan hasta elegir soportes. | ✅ | [TUT], [LP] |
| Manos abiertas | Ambas manos son visibles. | ✅ | [MAN], [TUT] |
| Elegir soporte | **Primero el que ataca 2º**, después el que ataca 1º (viendo el soporte rival). Una carta de la mano, la carta superior del mazo (*All-or-Nothing Gamble*) o nada. | ✅ | [TUT], [MAN] |
| Gamble "sin efecto" | Si sale una Digivolve Option no hace nada (velocidad −1). Un Digimon u Option funcionan normalmente. | ✅ | [COD] |
| Resolución | Por velocidad y ranura (§6.2). | ✅ | [COD], [MAN] |
| Fin de turno | Las cartas de soporte usadas van al Offline Pile. | ✅ | [COD], [TUT] |

---

## 4. Sistema de DP
| Regla | Estado | Fuente |
|---|---|---|
| Los DP son **la suma del +P de las cartas del DP Slot**, con **tope 90**. No hay otro contador. | ✅ | [COD] `0x8004110C` |
| Solo las cartas Digimon dan DP. | ✅ | [TUT], [CDD] |
| Se acumulan entre turnos mientras no se digievolucione. | ✅ | [COD], [TUT] |
| Para digievolucionar: `DP total ≥ DP requerido` de la carta destino. | ✅ | [COD], [TUT] |
| **Al digievolucionar, todas las cartas del DP Slot van al Offline Pile** (también el exceso). | ✅ | [COD] `0x801ECE24`, [TUT] |
| Descartar cartas del DP Slot (efectos) baja los DP; se descarta primero la más reciente. | ✅ | [COD] |
| Tras un KO el DP Slot **se conserva**. | ✅ | [COD] |

---

## 5. Digivolución
### 5.1 Normal
| Regla | Estado | Fuente |
|---|---|---|
| R → C → U, un nivel por vez, **misma especialidad**, la carta destino en la mano. | ✅ | [TUT], [MAN] |
| El HP pasa a ser el HP completo de la nueva carta; también los poderes. | ✅ | [COD], [TUT] |
| La especialidad vuelve a ser la de la nueva carta (se pierden los cambios por soporte). | ✅ | [COD] |
| Las cartas quedan apiladas en el Battle Slot (permite *Digi-devolve*). | ✅ | [COD] |

### 5.2 Armor
| Regla | Estado | Fuente |
|---|---|---|
| Solo el Partner, con su Digi-Egg. | ✅ | [EVT], [MAN] |
| En nivel A no puede pasar a C ni U (salvo *ArmorCrush Digivolve*). | ✅ | [EVT] |
| Cartas Armor: DP requerido 0, +P 0. | ✅ | [CDD] |

### 5.3 Digivolve Options — reglas en código (`KAWSEG 0x801E3C00`)
| Carta | Regla | Estado |
|---|---|---|
| Special Digivolve | Siguiente nivel, **cualquier especialidad**, no en Armor; válido si `DP + 20 ≥ requerido` → **cuesta 20 DP menos**. | ✅ [COD] (resuelve el conflicto: el texto "+20 DP" es engañoso; [G] y [LP] tenían razón) |
| Warp Digivolve | Solo de R a U, misma especialidad, `DP ≥ requerido`. | ✅ [COD] |
| Speed Digivolve | Siguiente nivel, misma especialidad, **sin DP**, no en Armor ni en estado anormal. | ✅ [COD] |
| Mutant Digivolve | **Mismo nivel**, cualquier especialidad, `DP ≥ requerido`. | ✅ [COD] |
| Download Digivolve | Cualquier Digimon de destino, sin otras condiciones. | ✅ [COD] |
| ArmorCrush Digivolve | Desde Armor a C o U, misma especialidad, `DP ≥ requerido`. | ✅ [COD] |
| De-Armor Digivolve | Solo desde Armor (vuelve a la carta de abajo). | ✅ condición [COD] / 🟡 efecto |
| Digi-devolve | No desde Armor; requiere ≥ 2 cartas apiladas; descarta la de arriba. *"HP double"* según el texto. | ✅ condición [COD] / 🟡 efecto |

### 5.4 Fusión
Solo en el modo historia (*Card Fusion*). No hay fusión dentro de la batalla. ✅ [P.DRV], [G]

---

## 6. Combate y efectos
Algoritmo completo en [`04-motor-original.md §4–§5`](04-motor-original.md). Resumen:

### 6.1 Daño
| Regla | Estado |
|---|---|
| Daño = poder del ataque elegido tras aplicar todos los efectos. Sin defensa ni ventaja de tipo intrínseca. | ✅ [COD] |
| Ataca primero el jugador del turno, salvo "atacar primero" / contraataque (§6.4). | ✅ [COD] |
| Si el primer golpe deja KO, el defensor **no** contraataca. | ✅ [COD] |
| HP y poderes tienen tope 9990. | ✅ [COD] |

### 6.2 Soportes y orden de resolución
| Regla | Estado |
|---|---|
| Se aplican por velocidad: **High → Mid → Low**; Speed None nunca se aplica. | ✅ [COD], [MAN] |
| A igual velocidad: **Option → soporte Digimon → efecto ✕**, y dentro de cada tipo **primero el jugador del turno**. | ✅ [COD] (resuelve el conflicto [MAN] vs [LP]: ambas eran parcialmente ciertas) |
| Anular solo afecta a efectos que todavía no se aplicaron. | ✅ [COD] |
| Las dos condiciones del bytecode se combinan con AND; si fallan, no se aplica ninguna acción. | ✅ [COD] |
| Cambios de poder: solo para esa batalla. Cambios de HP: permanentes. Cambios de especialidad: hasta que el Digimon cambia de carta. | ✅ [COD] |
| Descartar de la mano por efecto siempre es al azar. | ✅ [COD] |

### 6.3 Efectos ✕ (solo si el dueño eligió ✕)
| Efecto | Texto del juego [HLP] | Comportamiento real [COD] | Velocidad |
|---|---|---|---|
| ◯/△/✕ to 0 | *Lowers Opponent's ◯/△/✕ Attack Power to 0.* | Pone a 0 ese poder del rival. | Low |
| ◯/△/✕ Counter | *If Opponent uses ◯ Attack, it will miss. Then you Counter with Opponent's ◯ Attack power.* | Solo si el rival eligió ese ataque: su ataque hace 0 y recibe su propio poder final. | Low |
| Foe X3 | *If Opponent's Specialty is X, own ✕ Attack is Tripled.* | Compara con la especialidad **actual** del rival. | Low |
| Crash | *Attack Power becomes same as HP. HP becomes 10. No Effect until just before Attack.* | Justo antes de atacar: ✕ = HP actual y HP = 10. Contraatacable. | Low |
| Eat-up HP | *Recover the same amount of HP as the damage inflicted.* | Cura `min(daño, HP que le quedaba al rival)`. | Mid |
| 1st Attack | *Attack first, regardless of Turn. If you're 1st, Void Foe's "1st Attack."* | Si ambos lo tienen, se anulan y sigue primero el del turno. | Mid |
| Jamming | *Opponent's Support Effect is Voided. Can't Void Option Effect.* | Anula el soporte Digimon rival, no las Option. | **High** |

### 6.4 Interacciones resueltas
* Si los dos tienen contraataque, se anulan y **nadie hace daño**. ✅ [COD]
* "Atacar primero" se evalúa antes que el contraataque: un contraataque siempre termina atacando segundo. ✅ [COD]
* "to 0" **no** detiene Crash (Crash fija el poder después). ✅ [COD], [G]
* El Crash del que ataca segundo usa el HP que le quedó tras el primer golpe. ✅ [COD]

---

## 7. Victoria y derrota
| Condición | Estado | Fuente |
|---|---|---|
| Ganar 3 rondas. | ✅ | [COD], [TUT], [MAN] |
| En Preparación, sin Digimon en juego ni en mano y **sin mazo** → pierde. | ✅ | [COD] estado 3 |
| Tras un KO, sin Digimon en slot, ni en mano, ni mazo → pierde (*"no more Digimon"*). | ✅ | [COD] |
| Quedarse sin mazo con un Digimon en juego **no** hace perder. | ✅ | [COD], [MAN] *All Gone Win* |
| **Revivir** (Phoenixmon, Miracle Ruby…): el Digimon sigue con ese HP, pero la ronda cuenta para el rival. No aplica a la ronda que da la victoria. | ✅ | [COD] |
| Tras un KO sin revivir, la pila de evolución va al Offline Pile; el DP Slot se conserva. | ✅ | [COD] |

---

## 8. Pendientes
| # | Pendiente | Cómo resolverlo |
|---|---|---|
| 1 | Efecto exacto de Digi-devolve (¿HP ×2?) y De-Armor; ¿se vacía el DP Slot? | Rastrear el estado 16. |
| 2 | Comandos 0x1C/0x1D y variables 15/16 | Sin uso en cartas; baja prioridad. |
| 3 | Por qué MetalSeadramon "rara vez funciona" según [G] | Probar en emulador. |
| 4 | Mazos iniciales y rivales en `DECK2.DEK` | Parseo (Etapa 6). |
| 5 | Armor-digivolución con Digi-Egg y habilidades de Partner | ✅ Resuelto: ver [`07-progresion.md §5`](07-progresion.md) (falta portarlo al motor). |
| 6 | Qué cartas marca "OK" la UI del juego para Entrada y Soporte (¿Armor directo? ¿Digivolve Option como soporte?) | Rastrear `KAWSEG 0x801EBACC`. |

Las decisiones provisionales que tomó el motor sobre estos puntos están listadas en
[`05-motor-implementado.md`](05-motor-implementado.md).
