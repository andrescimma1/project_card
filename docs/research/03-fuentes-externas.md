# 03 — Fuentes externas y contraste con el ROM

Fuentes web consultadas para contrastar lo extraído del disco. **Regla del proyecto:** si una
fuente externa contradice al ROM, manda el ROM; si el ROM no dice nada, la fuente externa puede
elevar un punto a ✅ solo si es el **manual oficial** o si dos fuentes independientes coinciden.

> Nota de identidad: el juego norteamericano *Digimon Digital Card Battle* (SLUS-01328, 2001) es la
> localización de **_Digimon World: Digital Card Arena_** (SLPS-03101, 2000), no del japonés
> *Digimon Card Battle* (1999). Por eso las tablas de Wikimon de *Digital Card Arena* coinciden con
> nuestro ROM.

## Fuentes

| Id | Fuente | Tipo | Fiabilidad |
|---|---|---|---|
| **[COD]** | Desensamblado del propio juego ([`04-motor-original.md`](04-motor-original.md)) | Primaria | Máxima: es lo que ejecuta la consola |
| **[MAN]** | Manual oficial US (SLUS-01328) — [archive.org](https://archive.org/details/Digimon_Digital_Card_Battle_2001_Bandai_US_SLUS-01328) | Oficial | Alta (texto del editor; escueto en detalles) |
| **[WKM]** | [Wikimon, Digital Card Arena](https://wikimon.net/Digimon_World:_Digital_Card_Arena) y su lista de cartas | Wiki comunitaria | Alta en stats (coincide 100 % con el ROM); su columna de nivel está mal (todos los R figuran como IV) |
| **[G1–G4]** | FAQs de GameFAQs (De@thSh@dow, Yefri S, Rover Yakuto, Robert Jennings), vía [mirror gopher](https://gopherproxy.meulie.net/gopher.endangeredsoft.org/1/gamefaqs-archive/ps/digimon-digital-card-battle/) | Comunidad 2001–2003 | Media: observaciones de juego reales, alguna teoría errónea |
| **[LP]** | [Let's Play Archive, Ephraim225](https://lparchive.org/Digimon-Digital-Card-Battle/) — el autor reconstruyó el juego en Tabletop Simulator | Comunidad | Media-alta: describe partidas observadas |

## Lo que las fuentes externas confirman o añaden

| Tema | Hallazgo | Estado final | Fuente |
|---|---|---|---|
| Copias por carta | **Máximo 4 copias** de una carta por mazo. Se pueden guardar 3 mazos. | ✅ | [MAN] p.20 *"You can put up to four of the same Card into a Deck."*, [G4], [WKM] |
| Cartas únicas | Solo se puede poseer 1 de las *Sevens*, *Download Digivolve* y *Rosemon's Lure*. | 🟡 (colección, no batalla) | [G1], [G2] |
| Robo | Al inicio del turno propio se roba hasta tener 4. No se roba en el turno rival. | ✅ | [MAN] *"Draw 4 Cards"*, [LP], [WKM] + ROM |
| Cambio de mano | Repetible (descartar y robar de nuevo). | ✅ | [MAN] p.15, [LP] *"I had to throw out my hand and re-draw twice"* |
| "Malfunction" al entrar con C/U | **C entra con la mitad de HP y ataque; U con un cuarto.** | ✅ | [MAN] p.15 *"the HP and Attack Power of a Level C Digimon would be cut to half and a Level U Digimon to a quarter."*, [WKM] |
| Recuperar el estado anormal | Digievolucionar con una Digivolve Option restaura los stats completos; Speed Digivolve no se puede usar en ese estado. | ✅ | [MAN] p.16, [LP] + texto ROM de Speed Digivolve |
| DP por turno | Una sola carta Digimon al DP Slot por turno, solo en el turno propio. | ✅ | [LP] + [COD] |
| Manos abiertas | Ambas manos son visibles y se pueden leer los efectos de soporte rivales. | ✅ | [MAN] p.18, [LP], tutorial ROM |
| Ataques ocultos | Los ataques no se revelan hasta después de elegir soportes. | ✅ | [LP] + tutorial ROM *"nobody knows which Attack the other player has chosen"* |
| **Orden de soportes** | **Se aplican por Support Speed: los más rápidos primero.** | ✅ | [MAN] p.19 *"Faster Effects activate first."* + byte Support Speed del ROM |
| Empate de velocidad | [MAN]: *"1st Attack player's Effect will activate first."* — [LP]: Option → Digimon → ✕, y a igualdad el jugador del turno. | ✅ **resuelto en código**: Option → Digimon → ✕; dentro de cada tipo, el jugador del turno. [LP] era exacto. | [COD] |
| Counter en la práctica | Anula el ataque correspondiente y devuelve al atacante su propio poder. | ✅ | [LP], [G1], [G2] + ayuda ROM |
| Crash en la práctica | Daño = HP propio, luego HP propio = 10. Un Counter devuelve ese daño. | ✅ | [LP], [G1], [G2] + ayuda ROM |
| "to 0" vs Crash | Los efectos "a 0" no detienen Crash. | ✅ | [G1] + [COD] |
| Eat-up HP | Cura lo infligido, con tope en el HP que le quedaba al rival. | ✅ | [LP] + [COD] |
| Foe X3 | Se aplica a velocidad Low: después de los soportes High/Mid y de los Low de la misma velocidad. | ✅ | [LP] + [COD] |
| Ronda | Cada KO gana una ronda, sin importar el nivel; 3 rondas ganan. | ✅ | [MAN] p.19 + tutorial ROM |
| Mazo vacío | **No** es derrota inmediata. Se pierde cuando hay que sacar un Digimon y no hay ninguno en mano ni mazo. | ✅ | [MAN] p.26, [LP], [G], [WKM] + [COD] |
| Perfil de especialidades | Fire: HP bajo/ataque alto. Ice: HP alto/ataque bajo. Nature: equilibrado/fácil de evolucionar. Dark: ataque alto/arriesgado. Rare: débil/disruptivo. | ✅ (diseño; sin ventaja de tipo intrínseca) | [MAN] p.10 |
| Mazos iniciales | Veemon = mazo rojo (Fire/Darkness), Hawkmon = verde, Armadillomon = amarillo (Rare/Ice). Listas de 30 cartas en [G3]. | ✅ colores / 🟡 listas (verificar con `DECK2.DEK` del ROM) | [MAN] p.5, [LP], [G3] + diálogos ROM |

## Contraste: dónde chocan las fuentes con el ROM

| Tema | ROM | Externo | Decisión |
|---|---|---|---|
| DP al digievolucionar | Tutorial: *"After digivolving, all DP in DP slot will be deleted."* | [LP]: *"if you have enough DP to pay the cost"* (ambiguo) | **Manda el ROM**: se borran todos los DP. ✅ |
| Mazo vacío | Mensaje *"There are no more Cards, so %s loses!"* | Varias fuentes: no hay derrota inmediata | ✅ Compatibles: la derrota ocurre en Preparación, sin Digimon en juego ni en mano y con el mazo vacío ([COD] estado 3). |
| Special Digivolve | Texto: *"by adding DP +20"* | [G1], [G3], [LP]: cuesta 20 DP **menos**; [G2]: cuesta +20 | ✅ [COD]: válido si `DP + 20 ≥ requerido` → **20 DP menos**. |
| Sylphymon | Texto "attack second", bytecode "attack first" | [G1], [LP]: en la práctica ataca primero | **El bytecode es correcto**; el texto engaña. ✅ |
| Aquilamon | Comparador `0xFF` | [G1], [G2], [LP]: el soporte "nunca funciona" | ✅ [COD]: comparador fuera de 0..5 → falso. |
| Veedramon / AeroVeedramon | Bytecode compara el nivel **rival** == U | [G2]: "falla para el jugador" | El ROM explica el bug. Se implementa el bytecode. ✅ |
| Dolphmon | Bytecode mira el ataque **rival** != ◯ | [G2]: se comporta al revés de su texto | ✅ [COD]: el juego ejecuta el bytecode. |
| MetalSeadramon | Bytecode correcto (velocidad High) | [G2]: "rara vez funciona para el jugador" | ❓ no explicado por los datos. |
| Listas de Option #258–262, Digi-Amethyst, Dark Sevens | ROM sin ambigüedad | Las listas web discrepan entre sí | **Manda el ROM.** |

## Resuelto después con el código ([`04-motor-original.md`](04-motor-original.md))

* Tras un KO, la pila de evolución va al Offline Pile y el DP Slot se conserva.
* Los cambios de especialidad duran hasta que el Digimon cambia de carta.
* Desempate de velocidad y Special Digivolve (filas de arriba).

**Sigue abierto:** si un C/U entrado directamente puede digievolucionar normalmente con DP.
