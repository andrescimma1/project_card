# 07 — La progresión del original (modo historia)

Cómo avanza una partida fuera de la mesa de juego: el mundo, los rivales, lo que se gana, la colección,
el compañero, la fusión, el intercambio, los rangos y el guardado. Investigado igual que la Etapa 1:
desensamblando el juego y leyendo sus datos, y contrastado con las guías de la comunidad.

| Marca | Significado |
|---|---|
| ✅ | Verificado en el código o en los datos del disco (con dirección o archivo) |
| 🟡 | Probable: deducido, se explica por qué |
| ❓ | Desconocido |

Fuentes: **[COD]** desensamblado (`SLUS_013.28` y overlays de `P.DRV`), **[GUION]** guiones de las ciudades
(`C.DRV`), **[DATA]** tablas del disco, **[EXT]** guías de GameFAQs, Let's Play y manual
([`03-fuentes-externas.md`](03-fuentes-externas.md)). Las notas completas, con cada dirección, están en
[`progresion/`](progresion/).

## Resumen

* El mundo tiene **12 ciudades** en tres áreas. Cada una se abre al ganar el torneo de la anterior. ✅
* Todo lo que pasa en una ciudad lo decide su **guion**: quién está en el Battle Cafe, qué torneos hay,
  contra qué mazo se juega y qué se gana. Hay **296 batallas** escritas en los guiones, todas contra mazos
  de `DECK2.DEK`. ✅
* Ganar contra la CPU da **un sobre de 3 cartas** (el tipo lo fija el mazo rival) y **EXP** para el
  compañero. Perder no da sobre. ✅
* El compañero (3 de 6 posibles) **sube de nivel hasta 99**, aprende **Digi-Parts** (128 mejoras) y se
  **Armor-digievoluciona al entrar en batalla** con el Digi-Egg elegido. ✅
* La **fusión** combina dos cartas en una tercera con una fórmula exacta (valores de cada carta y una tabla
  de especialidades), más 20 fusiones especiales y una probabilidad de mutación. ✅
* La colección admite **6 copias** por carta y se juega con **3 mazos** de 30 (4 copias por mazo). ✅
* Hay tres rangos con umbrales exactos (Tamer, Collector, 2P Battle), un título final y un
  **% de juego completado** calculado sobre 166 puntos de historia. ✅

---

## 1. El mundo

Tres áreas en el mapa (Mega, Giga y Tera) con 12 ciudades. El índice es el del archivo `AREAxx.PAK`.
Cada ciudad aparece en el mapa cuando se activa su flag de historia (`SAISEG 0x801DE964`). ✅ [COD][GUION]

| # | Ciudad | Se abre al… | Torneo de historia (rivales en orden) |
|---|---|---|---|
| 0 | Beginner City | empezar | Agumon, Babamon |
| 1 | Flame City | ganar el torneo de Beginner | Meramon, Phoenixmon, Veemon |
| 2 | Jungle City | ganar el de Flame | Vegiemon, Ninjamon, Veedramon, Wormmon |
| 3 | Igloo City | hablar con Veedramon tras el torneo de Jungle | Frigimon, Whamon, Garurumon, Stingmon |
| 4 | Junk City | vencer a Garurumon en el Cafe de Igloo | Hagurumon, ShellNumemon, KingSukamon, Shadramon |
| 5 | Dark City | ganar el 2.º torneo de Junk | Wormmon, Stingmon, Shadramon, Quetzalmon, Digimon Emperor |
| 7 | Pyramid City | hablar con Wormmon tras Dark City | Centarumon, Tyrannomon, Angemon |
| 8 | Sky City | ganar el de Pyramid | Wizardmon, AeroVeedramon, Gatomon |
| 9 | Steep Road | ganar el de Sky | Goburimon, DemiDevimon, Megadramon (y después Gigadramon) |
| 10 | Wiseman Tower | ganar el 2.º torneo de Steep Road | Togemon, Kabuterimon, Ikkakumon, Birdramon, WereGarurumon, MetalGreymon |
| 11 | Infinity Tower | hablar con MetalGreymon tras Wiseman | Tuskmon, Phantomon, MegaSeadramon, Machinedramon, VenomMyotismon |
| 6 | Desert Island | hablar con Tai en Beginner, después del final | Leomon, Devimon, MetalEtemon, Myotismon (sin cartas Option) |

Los rivales de cada torneo coinciden uno a uno con las guías [EXT]. ✅

**Qué hay en una ciudad** ✅ [GUION]: un **Battle Cafe** (personajes con los que hablar y combatir), una
**Battle Arena** (torneos de 1 a 6 rondas; perder una ronda te saca del torneo), a veces **Extra Arenas**,
una **Fusion Shop** (Flame, Pyramid y Wiseman) y un **Menu** (editar mazos, guardar). Cada ciudad tiene hasta
8 torneos; cuál está abierto depende de flags de historia, con condiciones exactas por torneo
([`progresion/01-mundo-y-guiones.md §9.1`](progresion/01-mundo-y-guiones.md)).

**El final y lo que sigue** ✅ [GUION]: tras VenomMyotismon la torre se corrompe y la última batalla es
contra "A" (mazo *Darkness Wave*). Después del final siguen, en orden de flags: Desert Island, la Haunted
Arena de Dark City, los DigiDestined en cada ciudad, las Extra Arenas con las formas Armor, los Dark Masters,
Diaboromon, Omnimon, Imperialdramon y Apokarimon. Los dos últimos jefes exigen victorias acumuladas:
**BK MetalGarurumon necesita ≥ 200 victorias** y **BlackWarGreymon ≥ 300**. Vencer a BlackWarGreymon muestra
las estadísticas completas y el título final.

**Cómo se guarda la historia** ✅ [COD]: los guiones usan 372 variables. 351 de ellas son flags de un bit
que se guardan en la partida (`save+0x23FC`) y 9 son contadores (`save+0x242C`).

## 2. Rivales y recompensas por guion

| Recompensa | Cuándo | Estado |
|---|---|---|
| Sobre del tipo que indica el mazo rival | cada victoria contra la CPU | ✅ [COD] |
| Sobre de color de la ciudad + **1 carta al azar de 8** | 1.ª victoria en el torneo de historia; el grupo de 8 depende del compañero inicial | ✅ [GUION] |
| Sobre (a veces S-sobre) | torneos posteriores, 1.ª vez y repeticiones | ✅ [GUION] |
| Sobre con probabilidad 1/10 | combates del Battle Cafe | ✅ [GUION] |
| Cartas únicas | Rosemon: Rosemon's Lure (1.ª victoria) y **Download Digivolve (10 victorias seguidas en una visita)**; Piedmon: Dark Sevens (5 seguidas); Nanimon: Grand Sevens (10 victorias)… | ✅ [GUION] |
| Mazo prestado | 2, 5 y 8 combates con Davis, Keely, Cody, T.K., Kari y Ken: te prestan su mazo para una batalla | ✅ [GUION] |
| Digi-Parts | eventos de Flame, Jungle, Igloo, Pyramid, Steep Road e Infinity Tower | 🟡 (texto "You got a Digi-Part"; el comando no se trazó) |
| 10 palabras clave | Wizardmon en Sky City: cada palabra da una carta Ultimate, una sola vez | ✅ [GUION] |
| Apokarimon errante | tras 10 victorias aparece en una ciudad al azar; da un S-Black Pack y, 1 de cada 10 veces, su carta | ✅ [GUION] |

## 3. Sobres

Tabla de 16 sobres en `SLUS 0x8006E35C` y generador en `SLUS 0x8004635C`. ✅ [COD][DATA]

* Cada sobre define, por especialidad y nivel, un **rango del valor "Result"** de la carta (el mismo valor
  que usa la fusión, `CARD2 +0x19`). Las cartas cuyo valor cae en el rango forman el grupo normal; las que
  están justo por encima, el **grupo raro**.
* La 1.ª carta sale del grupo raro con una probabilidad igual al bonus de "carta rara" de los compañeros:
  **0 % sin las Digi-Parts 126/127** (+10 % y +20 %). Las otras dos cartas siempre salen del grupo normal.
* Tras una victoria contra la CPU el sobre es Basic, Hyper, Super o Great según el mazo (en un único mazo,
  Black). Los sobres de color y los S-sobres solo los dan los guiones.
* Hay cartas que **nunca salen en sobres** (valor Result 0): los Partners y sus Armor (172–190), las 12
  joyas, los Sevens, Fake Sevens, Rosemon's Lure, Download Digivolve, Apokarimon y los 16 Digimon que solo
  salen por fusión especial (Imperialdramon, Omnimon, Vikemon…). Se obtienen por eventos, fusión especial o
  mutación.

Composición completa de cada sobre en [`progresion/02-resultados-y-guardado.md §3`](progresion/02-resultados-y-guardado.md).

## 4. Colección y mazos

* **6 copias** como máximo por carta en la colección. Un sobre que daría la 7.ª muestra "FULL SET!". ✅ [COD]
* Cada copia lleva un **número de serie aleatorio**, que sirve para el intercambio. ✅ [COD]
* **3 mazos** de 30 cartas, con 4 copias por mazo como máximo. ✅ [COD][EXT]
* Las cartas 172–190 (Partners y Armor) **no se pueden recibir como cartas**: el compañero entra al mazo desde
  su ranura y su forma Armor solo aparece por Digi-Egg. ✅ [COD]
* Las cartas que están en uso en un mazo no se pueden fusionar ni intercambiar. ✅ [COD]

## 5. El compañero

* **3 ranuras** de compañero entre 6 posibles (Veemon, Hawkmon, Armadillomon, Gatomon, Patamon, Wormmon). El
  primero se elige al empezar (Veemon, Hawkmon o Armadillomon), con su mazo inicial y 5 cartas extra al azar
  de pares fijos. Los otros dos los dan personajes de la historia. ✅ [COD] / 🟡 qué personaje da cuál.
* Cada ranura guarda una **copia propia de la carta**, mejorada. En batalla, la carta del compañero usa esa
  copia: así funcionan las mejoras sin reglas aparte. ✅ [COD]
* **Niveles 1–99.** Se sube del nivel L al L+1 al acumular **(L+1)·(L+3) EXP** (8, 15, 24… hasta 9999). Cada 5
  niveles, **+10 a HP, ◯, △ o ✕ al azar**. ✅ [COD]
* **EXP por batalla** = EXP del mazo rival (solo si ganas) + los bonos obtenidos (§6), multiplicado por el
  bonus de EXP de las Digi-Parts. Solo la reciben los compañeros que estaban en el mazo usado. ✅ [COD]
* **128 Digi-Parts** de 9 tipos: HP, ataques, efecto ✕, +P, programa de soporte, % de EXP y % de carta rara.
  Cada compañero aprende una fija en ciertos niveles, se equipan 3 por compañero y cada parte en uno solo.
  ✅ [COD]
* **13 Digi-Eggs** (3 de Veemon, 2 del resto). El huevo elegido define la forma Armor. ✅ [COD]
* **Armor-digivolución al entrar en batalla**: si el Digimon que entra es un compañero con huevo, la CPU se
  transforma sola y al jugador humano se le pregunta *"Do you want to Armor Digivolve?"*. La carta se
  **reemplaza en el sitio** por la Armor: HP y ataques de la Armor, sin apilar. ✅ [COD] `SLUS 0x80040A48`

## 6. Bonos de EXP

32 bonos (`KAWSEG 0x801FC300`) que se evalúan al terminar cada batalla contra la CPU. ✅ [COD]

| Bono | EXP | Condición |
|---|---|---|
| All ◯ / △ / ✕ Attack Win | 3 | ganar usando solo ese ataque |
| All or Nothing Gamble Win | 5 | ganar apostando con el mazo en todos los soportes |
| Last Chance Gamble Win | 2 | ganar la última ronda con una apuesta |
| No Support Card Win | 5 | ganar sin usar soportes |
| No Digivolve Win | 3 | ganar sin digievolucionar |
| No Discard Win | 1 | ganar sin cambiar la mano |
| 4-of-a-Kind Win | 5 | tener 4 cartas iguales en la mano |
| 0 Online Card Left Win | 2 | el rival se queda sin mazo y tú no |
| Partner Win | 1 | una ronda ganada por el compañero |
| No Loss Win | 3 | ganar 3-0 |
| Come-Back Win | 3 | ganar tras ir 0-2 |
| Desperate Win | 7 | ganar 3-2 con los dos sin mazo ni mano |
| All Gone Win | 2 | ganar sin mazo ni mano propios |
| Ultimate Level Win | 3 | un KO hecho por un Digimon de nivel U |
| Option Maniac Win | 5 | ≥ 25 cartas Option o Digivolve en el mazo |
| 8 DP Cards Win | 8 | ganar con el DP Slot lleno |
| Lucky Seven Win | 1 | ganar con exactamente 7 cartas en el mazo |
| Just Enough Attack Win | 3 | el golpe de la victoria deja al rival en 0 HP exactos |
| 12 S-Jewel Cards Win | 10 | llevar las 12 joyas en el mazo |
| Rainbow | 2 | usar Digimon de las 5 especialidades |
| Damage Fever | 10 | infligir un daño múltiplo de 1110 |
| HP Fever | 7 | terminar una batalla con HP múltiplo de 1110 |
| 3 Partners | 2 | 3 compañeros en la mano a la vez |
| 3 Partners Plus | 2 | 3 entradas o cambios de compañero en el Battle Slot |
| Partner Normal Digivolve | 2 | digievolucionar normalmente desde el compañero |
| Super Bonus | 10 | conseguir 7 bonos o más |
| Choked Loss / Loss by Gamble / Total Loss | 2 / 2 / 1 | derrotas: tras ir 2-0, por una apuesta, 0-3 |
| Lucky Name | 1 | **nunca se concede**: el código salta esa entrada |

## 7. Fusión de cartas

Tres tiendas (Andromon No.1, No.2 y No.3, en Flame, Pyramid y Wiseman) limitan el nivel: R y Option; hasta C;
cualquier carta. La fusión no cuesta nada más que las dos cartas. ✅ [COD][GUION]

**Algoritmo** (`EVOSEG 0x801ECCA0`) ✅ [COD]:
1. **S = Composite(A) + Composite(B)**: los dos valores de fusión que ya tenemos en `cards.json`.
2. La **especialidad del resultado** sale de una tabla fija:

| A \ B | Fire | Ice | Nature | Darkness | Rare | Option |
|---|---|---|---|---|---|---|
| **Fire** | Option | Nature | Darkness | Rare | Ice | Fire |
| **Ice** | Nature | Option | Rare | Fire | Nature | Ice |
| **Nature** | Darkness | Rare | Option | Ice | Darkness | Nature |
| **Darkness** | Rare | Fire | Ice | Option | Fire | Darkness |
| **Rare** | Ice | Nature | Darkness | Fire | Option | Rare |
| **Option** | Fire | Ice | Nature | Darkness | Rare | Option |

3. El resultado es la carta de esa especialidad cuyo **Result** vale S. Si no hay ninguna, se busca S±1, S±2…
   Para Digimon es determinista; para Option se sortea entre las que tienen ese valor.
4. **20 fusiones especiales** fijas tienen prioridad, por ejemplo WarGreymon + MetalGarurumon = Omnimon y
   ExVeemon + Stingmon = Paildramon. Coinciden con las guías.
5. **Mutación** con probabilidad (⌊S/10⌋+1) %: a veces una de las 12 joyas, a veces Fake Sevens y a veces el
   resultado desplazado unos puntos.

Ejemplo de las guías comprobado: WaruMonzaemon (Darkness, 19) + Zudomon (Ice, 16) → Fire, 35 → **WarGreymon**.
La tabla completa de los 37 401 pares posibles con sus probabilidades se puede regenerar desde el disco.

**Partner Fusion** ✅ [COD]: se sacrifica una carta para dar al compañero EXP = su Composite. Cada compañero
tiene 5 cartas concretas que le dan una Digi-Part en vez de EXP.

No se pueden fusionar: Partners, Armor, los 7 Sevens, Rosemon's Lure ni Download Digivolve (Composite 0). ✅

## 8. Intercambio

Entre dos tarjetas de memoria, con hasta 3 cartas por lado; regalar sin recibir también vale. No se pueden
intercambiar cartas con Composite 0 ni copias en uso, y el receptor no puede pasar de 6. La copia conserva
su número de serie, así que no se puede devolver la misma. Se habilita al hablar con MetalGreymon en
Wiseman Tower después de su torneo: el guion pone el bit que la pantalla de intercambio exige. ✅ [COD][GUION]

## 9. Rangos, títulos y porcentajes

Se recalculan tras cada batalla y nunca bajan (`SLUS 0x8002CC44`). ✅ [COD]

| Rango | Dato | Umbrales |
|---|---|---|
| Tamer | victorias contra la CPU | 0 Beginner · 10 Regular · 25 Mid Level · 50 High Level · 100 Expert · 200 Master · 300 Genius · 500 Invincible |
| Collector | copias y categorías completas | 0 General Public · 100 copias Hobby · 200 copias Serious · 1 categoría completa Top Level · 3 Famous · 5 Great · todas Perfect · **Legendary** = todas sin haber intercambiado nunca |
| 2P Battle | victorias contra amigos | 0 Beginner · 10 Expert · 20 Specialist · 30 Champion · 40 Master · 60 Lord · 80 King · 100 Emperor |

* **Título final** "You're …!": 36 posibles (por ejemplo *Red Knight*, *Jamming King*, *Emperor Cassiopeia*),
  elegidos por las rondas ganadas con cada especialidad y por el ataque más usado. ✅ [COD]
* **% de juego completado** = puntos de historia / 166 (120 flags con peso); **% de colección** = cartas
  distintas / 301; **% de Digi-Parts** = partes / 128. ✅ [COD][GUION]

## 10. Guardado

Un bloque de **10 100 bytes** por jugador, con el layout entero mapeado: nombre, victorias y derrotas,
rangos, Digi-Parts, 3 ranuras de compañero, contadores de bonos, récords por mazo rival y por carta,
colección, números de serie, flags de historia y 3 mazos. Cada archivo de tarjeta de memoria guarda un
bloque y una suma de comprobación. ✅ [COD]

---

## 11. Contraste con las guías

| Tema | Guías | Lo que dice el juego |
|---|---|---|
| Rivales de cada torneo | listas por ciudad | ✅ idénticas a los guiones |
| Fusión | "suma de puntos = resultado", más reglas de color | ✅ correcto; el código añade la búsqueda ±d, las 20 especiales y la mutación |
| AeroVeedramon | una guía da los números de Sylphymon | ✅ Veedramon + Phoenixmon |
| Mutación solo tras Izzy | una guía lo afirma | ✅ falso: siempre puede haber mutación; Izzy solo da el aviso |
| Victorias para los Sevens y Download Digivolve | 1 a "más de 60" según la guía | ✅ guiones: Download 10 seguidas, Dark 5, Grand 10… |
| Umbrales de rango | ninguna guía los da | ✅ tabla del §9 |
| "Red Knight" | no aparece en ninguna | ✅ título final de Fire con △ |
| "Lucky Name" | solo el Let's Play, como exclusivo japonés | ✅ en el código está, pero nunca se concede |
| Tope de cartas | 6 en colección, 4 por mazo | ✅ |

## 12. Lo que esto cambia en lo ya hecho

* **`DECK2.DEK`** ✅: cada registro empieza 2 bytes después de lo que leía nuestro extractor. Las cartas, el
  nombre y la personalidad de la IA estaban bien (misma posición relativa), pero lo que guardábamos como
  "cabecera desconocida" de cada mazo son los dos últimos bytes del mazo anterior: la **EXP que da** y el
  **Digi-Egg del compañero de la CPU**. El byte `+0x6B` es el **tipo de sobre**. **Hecho**: el extractor ya lo lee.
* **Batalla** ✅: faltaba la **Armor-digivolución del compañero al entrar** (estados 8 y 9) y que la carta del
  compañero use su copia mejorada. **Hecho** (ver [`05-motor-implementado.md`](05-motor-implementado.md)); las
  Digi-Parts de la copia llegan con la colección. Afecta también a las partidas sueltas: los mazos rivales con huevo (por
  ejemplo, el de Davis o el del Digimon Emperor) se transforman al entrar.
* **Desert Island** ✅: los torneos con regla de mazo (sin Option) se comprueban antes de entrar.
* **Constructor de mazos** ✅: en el modo historia los mazos salen de la colección (no más copias de las que
  tienes, 4 por mazo, nunca cartas Armor; SUBSEG `0x801ECE70`). **Hecho**; la pestaña Mazos sigue libre para
  las partidas sueltas.

### 12.1 Cómo quedó implementado (y qué se decidió sin dato exacto)

| Pieza | Código | Decisión 🟡 |
|---|---|---|
| Mazos de la historia | `src/engine/progression/storyDecks.ts`, `src/ui/decks/DeckEditor.tsx` | Cada carta Partner cuenta como 1 copia si está en tus ranuras (no está en la colección). El nombre del mazo tiene hasta 12 letras (✅ SUBSEG `0x801E0A60`). El mazo activo no se puede guardar con menos de 30 cartas. |
| Digi-Parts y Digi-Eggs | `equipPart` / `unequipPart` / `chooseEgg` | Reglas de `0x800495B4`, `0x800496E4` y `0x80047E64`. ❓ Cómo se quita un huevo ya puesto: no se ofrece. |
| PARTNER GET | `cityHost.ts` (10.11 / 11.10 / 10.10), `StoryMenus.tsx` | Se elige con la pregunta "¿Este compañero está bien?"; ❓ si el original deja rechazar todos. |
| Tiendas de fusión | `fusion.ts` (`fuseCards`, `partnerFusion`, `visitShop`), `FusionShop.tsx` | Límite R / C / cualquiera con valores 0 / 2 / 3. La tienda más alta visitada fija el límite de todas (diálogo *"I already got your data"*); se guarda en `save.fusionShop` porque no se sabe en qué variable de los guiones UNIT lo guarda el juego. Los diálogos de Andromon (UNIT00-02) no se ejecutan: su juego de comandos de EVOSEG no está decodificado (❓), así que la pantalla va directo a fusionar y no da pistas del resultado. En la búsqueda ±d, cuál de los dos candidatos es "arriba" al 50 % no está confirmado. |
| Intercambio | `trade.ts`, `TradeView.tsx` | Dos de las tres partidas hacen de dos tarjetas de memoria. La copia que viaja, las marcas y el orden de los rangos son los del original (`progresion/05` §6). |
| Estadísticas completas | `records.ts`, `stats.ts`, `CompleteStats.tsx` | Récords por mazo con la unión de `0x800471F4`, mazos conocidos y prestados, poder máximo y rondas por carta, y la página de ENDSEG en su orden (`progresion/05` §1-§3). Se ven al final secreto (desplazamiento solo), desde los datos del jugador con la historia terminada (v15), y el final (`CMD11.19(0)`) muestra "Fin" en lugar del vídeo. |
| Auto Deck y mazo base | `autoDeck.ts`, `StoryMenus.tsx` | Algoritmo y tablas de SUBSEG (`progresion/05` §4). El mazo base se valida con tu colección al guardarlo (el original no lo comprueba al copiarlo). |
| Nombre | `cleanName`, pantalla de registro | 12 letras, no vacío. 🟡 Se omite `*` (códigos de texto del juego). |
| Batalla 2P | `twoPlayer.ts`, `DuelView.tsx`, sesión con dos jugadores | Las dos partidas comparten la pantalla; el tablero dice a quién le toca. Resultado de `0x80041A1C` (`progresion/05` §7). |
| Número de registro | `save.registration` | `rand()` al crear la partida, antes de elegir las cartas iniciales (`0x8002D59C`). Las partidas guardadas antes de esta versión reciben uno al azar al cargarse. |

## 13. Desconocido

* ❓ Qué personaje da el 2.º y el 3.er compañero y con qué candidatos, y el evento exacto de cada Digi-Egg.
* ❓ Los comandos de los guiones de las tiendas de fusión (los avisos de "fusión especial" y "mutación") y
  dónde se guardan sus variables. Por eso la tienda del remake no muestra los diálogos de Andromon.
* ❓ El teclado de la pantalla de nombre (qué caracteres ofrece) y si la batalla 2P exige partidas con registro distinto.
* ❓ 7 Digi-Parts obtenidas por evento (45, 61, 85, 86, 92, 99, 114): se sabe dónde aparecen, no el comando.
* ❓ Algunos comandos menores de los guiones (efectos visuales de Infinity Tower, dos modos de la pantalla de
  mazos).
* ❓ Dos mazos que no usa ningún guion (76 *No Can Do* y 117 *Desperate Space*).
