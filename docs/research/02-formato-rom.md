# 02 — Formato de datos del ROM (ingeniería inversa)

Este documento describe **dónde y cómo** guarda el juego original sus datos de cartas y efectos.
Todo lo que figura acá se comprobó contra los archivos del disco del usuario
(`Digimon - Digital Card Battle (USA)`, SLUS-01328). El extractor reproducible es
[`tools/extract-cards.ts`](../../tools/extract-cards.ts) y el decodificador es
[`src/engine/cards/decodeCdd.ts`](../../src/engine/cards/decodeCdd.ts).

Leyenda de confianza (la misma que usa el código en `romTables.ts`):

| Marca | Significado |
|---|---|
| **ROM** | Leído literalmente de una tabla del ejecutable o del archivo de cartas. |
| **ROM+texto** | El significado del byte coincide con el texto in-game de *todas* las cartas que lo usan. |
| **Inferido** | Se deduce por simetría o consistencia; todavía no hay una carta que lo pruebe sola. |
| **Desconocido** | Aparece en los datos, su significado no está decodificado. |

---

## 1. Archivos del disco

| Archivo | Contenido relevante |
|---|---|
| `SLUS_013.28` | Ejecutable PS1 (carga en `0x80010000`). Tablas de etiquetas de efectos ✕, mensajes del sistema de batalla, nombres de fases (debug). |
| `B.DRV` | Archivo con directorio de registros de 32 bytes. Contiene **`CARD2.CDD`** (tabla de cartas), `BETA.MSD` (guion del tutorial), `DECK2.DEK` (mazos), imágenes de cartas, etc. |
| `P.DRV` | Overlays de código: `ENDSEG`, `EVOSEG`, `KAWSEG`, `OPENSEG`, `SAISEG`, `SUBSEG`, `SUGSEG`. Cargan en `0x801DDF38`. `KAWSEG` contiene la pantalla de ayuda "✕ Special Effect Descriptions". |
| `C.DRV` | Diálogos de eventos (NPCs), incluyen explicaciones de reglas (Armor, Partner, Digi-Eggs). |

### Directorio de un `.DRV`

Registros de 32 bytes al inicio del archivo:

```
+0x00  u8      0x01
+0x01  char[3] extensión ("ARC", "CDD", "MSD", "DEK", "TIM", "BIN"…)
+0x04  u32     sector inicial (sectores de 2048 bytes)
+0x08  u32     tamaño en bytes
+0x0C  u32     timestamp
+0x10  char[16] nombre
```

`CARD2.CDD` está en `B.DRV`, sector 11431, 84 312 bytes.

---

## 2. `CARD2.CDD` — la base de datos de cartas original

```
+0x0000  "0ACD"                    magic
+0x0004  u16  191                  cantidad de registros Digimon
+0x0006  u8   102                  cantidad de Option        (cargador SLUS 0x800457FC)
+0x0007  u8   8                    cantidad de Digivolve Option
+0x0008  191 × 316 bytes           Digimon        ids   0..190
+0xEBCC  102 × 226 bytes           Opciones       ids 191..292 (byte de tipo = 1)
+0x145D8   8 × 112 bytes           Opciones de Digivolución ids 293..300 (byte de tipo = 2)
                                   = 84 312 bytes exactos (el decodificador consume el 100 %)
```

**Total: 301 cartas** (191 Digimon + 102 Option + 8 Digivolve Option). Que el archivo se consuma
byte a byte sin sobrante es la principal prueba de que el layout es correcto.

**Verificación independiente:** se comparó campo a campo contra la tabla de Wikimon
(*Digimon World: Digital Card Arena*, versión japonesa del mismo juego). Coinciden las 301 cartas en
HP, DP requerido ("POW"), +P, poderes ◯ △ ✕, especialidad, efecto ✕, Support Speed y valores de
fusión. Las únicas diferencias son de nombre ("Rarity" = Rare, "Flame" = Fire).

### 2.1 Registro Digimon (316 bytes)

| Offset | Tipo | Campo | Confianza | Evidencia |
|---|---|---|---|---|
| `+0x00` | u16 | id de carta | ROM | secuencial 0..190 |
| `+0x02` | u8 | tipo (0 = Digimon) | ROM | opciones = 1, digivolve = 2 |
| `+0x03` | char[21] | nombre | ROM | — (bytes tras el NUL son restos del texto japonés) |
| `+0x18` | u8,u8 | **Valores de fusión** (Composite, Result) | ROM + Wikimon | coinciden con las columnas *Composite Value* / *Result Value* de Wikimon en las 301 cartas. Solo modo historia (Card Fusion). |
| `+0x1A` | u8 | `especialidad << 4 \| nivel` | ROM+texto | nivel 0..3 = R, A, C, U; especialidad 0..4 = Fire, Ice, Nature, Darkness, Rare |
| `+0x1B` | u8 | **DP requerido** para digievolucionar a esta carta | ROM+texto | Frigimon = 30 (tutorial: *"to digivolve to Frigimon, I need 30 DP"*) |
| `+0x1C` | u8 | **DP que aporta** (+P) al ponerla en el DP Slot | ROM+texto | MoriShellmon = 30 (tutorial: *"You can collect 30 DP with this"*) |
| `+0x1D` | u8 | (siempre 0) | Desconocido | |
| `+0x1E` | u16 | **HP** | ROM | |
| `+0x20` | 28 B | Ataque ◯: `u16 poder, u16 animación, u16 fx, char[22] nombre` | ROM | |
| `+0x3C` | 28 B | Ataque △ (mismo formato) | ROM | |
| `+0x58` | 28 B | Ataque ✕ (mismo formato) | ROM | |
| `+0x74` | 2 × 32 B | Condiciones del efecto de soporte | ROM+texto | ver §3 |
| `+0xB4` | 3 × 16 B | Acciones del efecto de soporte | ROM+texto | ver §3 |
| `+0xE4` | u8 | **Efecto especial ✕** (0..15) | ROM | ver §2.4 |
| `+0xE5` | u8 | índice casi único por carta (190 valores distintos en 191 cartas) | Desconocido | ¿id de modelo 3D / arte? No afecta reglas. |
| `+0xE6` | u8 | **Support Speed**: 0 None, 1 Low, 2 Mid, 3 High | ROM + Wikimon | coincide en las 191 cartas. Cómo ordena la resolución: ❓ |
| `+0xE7` | 4 × char[21] | Texto del efecto de soporte (4 líneas) | ROM | el texto que muestra el juego |

Verificaciones cruzadas con el texto del juego:

* Frigimon (tutorial) requiere 30 DP → `+0x1B = 30`.
* MoriShellmon aporta 30 DP → `+0x1C = 30`.
* Todas las cartas con ✕ = *Counter* o *Crash* tienen poder ✕ = 0, consistente con las definiciones
  ("Counter with Opponent's power", "Attack Power becomes same as HP").

### 2.2 Registro Option (226 bytes)

| Offset | Campo |
|---|---|
| `+0x00` u16 | id |
| `+0x02` u8 | tipo = 1 |
| `+0x03` char[21] | nombre |
| `+0x18` u8,u8 | valores de fusión (Composite, Result) |
| `+0x1C` 2 × 32 B | condiciones (mismo formato que Digimon) |
| `+0x5C` 3 × 16 B | acciones (mismo formato) |
| `+0x8C` u8 | **Support Speed** 0..3 (confirmado con Wikimon en las 102 Option). High (3) solo en *Cherrymon's Mist* y *Mystic Sevens*, que anulan Soporte y Option: consistente con que la velocidad decide quién se aplica primero. |
| `+0x8D` 4 × char[21] | texto |

### 2.3 Registro Digivolve Option (112 bytes)

| Offset | Campo |
|---|---|
| `+0x00` u16 | id |
| `+0x02` u8 | tipo = 2 |
| `+0x03` char[21] | nombre |
| `+0x18` u8,u8 | valores de fusión |
| `+0x1A` u8 | tipo de digivolución: 0 Special, 1 Warp, 2 Speed, 3 Mutant, 4 Digi-devolve, 5 Download, 6 ArmorCrush, 7 De-Armor |
| `+0x1B` 4 × char[21] | texto |

Estas cartas **no tienen bytecode**: su comportamiento está en código (handler especial por tipo),
y su texto es la especificación. Ver `01-mecanicas-originales.md §5.4`.

### 2.4 Tabla de efectos ✕ (ROM: `SLUS_013.28`, tabla de punteros `0x8006E4BC`)

| Código | Etiqueta ROM | Id en el código |
|---|---|---|
| 0 | none | `none` |
| 1 | 1stAttack | `firstAttack` |
| 2 | ◯ to 0 | `circleTo0` |
| 3 | △ to 0 | `triangleTo0` |
| 4 | ✕ to 0 | `crossTo0` |
| 5 | ◯ Counter | `counterCircle` |
| 6 | △ Counter | `counterTriangle` |
| 7 | ✕ Counter | `counterCross` |
| 8 | Crash | `crash` |
| 9 | Eat-up HP | `eatUpHp` |
| 10 | Jamming | `jamming` |
| 11–15 | Fire / Ice / Nature / Darkness / Rare Foe X3 | `foeX3Fire` … `foeX3Rare` |

Las definiciones literales de cada efecto (pantalla de ayuda del juego) están en
`01-mecanicas-originales.md §6.3`.

### 2.5 Códigos de control del texto

| Código | Render | Fuente |
|---|---|---|
| `*a0`…`*a4` | Fire, Ice, Nature, Darkness, Rare | ROM ("*a3 Darkness", "*a2 Nature" en menús; *Red/Blue/Green/Black/Yellow Digivice* usan `*a0..*a4` en orden) |
| `*b0`, `*b1`, `*b2`, `*b3` | ◯, △, ✕, □ | ROM (tutorial: "*b0 is usually the most powerful… *b2 often comes with a Special Effect") |
| `*e3`, `*e4`, `*e5`, `*ea` | Nivel R, C, U, A | ROM+texto (tutorial "Level *e3 to *e4 and *e4 to *e5") |
| `*e1`, `*e2` | glifos de las dos cartas *Omnimon* | Desconocido (se muestran como `⟨e1⟩`/`⟨e2⟩`) |

---

## 3. El bytecode de efectos de soporte

**Hallazgo central:** el juego original **no** implementa cada efecto de soporte con código propio.
Cada carta (Digimon y Option) trae un pequeño programa declarativo: **2 condiciones + 3 acciones**,
que ejecuta un intérprete genérico (`KAWSEG 0x801E9C1C`). El formato de abajo está ✅ **verificado en
el código del intérprete**; el detalle de cada rutina está en [`04-motor-original.md`](04-motor-original.md).

### 3.1 Operandos
Cada operando son dos `s16`: un **id de variable** y un **literal**. Si el id es 0 se usa el literal;
si no, el valor de la variable (`getVar`, `0x801E7DD4`).

### 3.2 Condición (32 bytes)
```
+0x00 u8      enabled
+0x02..+0x0C  6 × s16 ids de variable      (o0..o5)
+0x0E..+0x18  6 × s16 literales            (o0..o5)
+0x1A u8      comparador
+0x1B..+0x1E  4 × u8 operaciones aritméticas
condición:  (o0 op0 o1 op1 o2)  CMP  (o3 op2 o4 op3 o5)      (aritmética de izquierda a derecha)
```
* Las condiciones habilitadas se combinan con **AND**: si una falla, **no se ejecuta ninguna acción** de la carta.
* Comparador (`0x801E9BAC`): 0 `<`, 1 `<=`, 2 `>`, 3 `>=`, 4 `!=`, 5 `==`; **cualquier otro valor da falso** (Aquilamon usa `0xFF`: su soporte nunca se activa).
* Muchas condiciones deshabilitadas traen bytes de restos: se ignoran.

### 3.3 Acción (16 bytes)
```
+0x00 u8      enabled
+0x01 u8      destino (variable o comando)
+0x02/04/06   3 × s16 ids de variable      (o0, o1, o2)
+0x08/0A/0C   3 × s16 literales
+0x0E u8      operación exterior
+0x0F u8      operación interior
destino := (o2 interior o1) exterior o0
```
* Si el destino es el poder de ataque propio o rival (0x0A/0x0B), la fórmula se evalúa **una vez por
  cada ataque (◯, △, ✕)**, y las variables 11/12 leen el poder de ese ataque.
* Aritmética (`0x801E9ABC`): 0 suma (tope 9990), 1 resta (mínimo 0), 2 multiplicación (tope 9990),
  3 división (**0 si algún operando es 0; si no, se trunca, mínimo 10, y se redondea hacia abajo a decenas**), otro → 0.

| Carta | Programa | Texto del juego |
|---|---|---|
| Imperialdramon | `poder[r] := (cartas_DP × 100) + poder[r]` | "Add number of DP Cards in DP Slot x100 to own Attack Power." |
| Ogremon | `poder[r] := poder[r] × cartas_DP`; luego descartar DP | "Discard Cards in own DP Slot and multiply Attack Power by number of discards." |
| Grand Sevens | `poder[r] := poder[r] + HP` | "Own Attack Power is boosted by the number of own HP." |
| Tankmon | `HP := 10`; `poder[r] := poder[r] + 500` | "Own HP become 10. Boost own Attack Power +500." |
| Seadramon | `poder_rival[r] := poder_rival[r] ÷ 2` | "Opponent's Attack Power is halved." |
| Garudamon | si `ataque_propio == ◯` → atacar primero | "If own Attack is ◯, attack first." |

### 3.4 Variables de LECTURA (`getVar`, 29 casos)
| Id | Variable | Id | Variable |
|---|---|---|---|
| 0 | literal | 15 / 16 | estado de la pila de evolución (sin uso en cartas) |
| 1 / 2 | especialidad actual own / opp | 17 / 18 | ataque elegido own / opp (0 ◯, 1 △, 2 ✕) |
| 3 / 4 | HP own / opp | 19 | tipo de la carta de soporte rival (0 Digimon, 1 Option, −1 Digivolve) |
| 5 / 6 | poder ◯ own / opp | 20 | 1 si **no** soy el jugador del turno |
| 7 / 8 | poder △ own / opp | 21 / 22 | cartas en mano own / opp |
| 9 / 10 | poder ✕ own / opp | 23 / 24 | cartas en DP Slot own / opp |
| 11 / 12 | poder del ataque en evaluación own / opp | 25 | 1 si el Offline Pile propio está vacío |
| 13 / 14 | nivel own / opp (0 R, 1 A, 2 C, 3 U) | 26 | registro temporal |
| | | 27 / 28 | cartas en Online Deck own / opp |

### 3.5 Destinos de ESCRITURA y comandos (`setVar`, 54 casos)
Ver la tabla de comandos en [`04-motor-original.md §7`](04-motor-original.md). Resumen: 0x00–0x0B
especialidad, HP y poderes; 0x10/0x11 forzar ataque; 0x19 temporal; 0x1A–0x25 mover cartas entre
mano, mazo, descarte y DP; 0x2A/0x2B barajar; 0x2C/0x2D anular; 0x2E buscar Partner; 0x2F rotar
ataque; 0x30 revivir; 0x31/0x32 robar; 0x33 Eat-up; 0x34 contraatacar; 0x35 atacar primero.

### 3.6 Texto vs. comportamiento
Cuando el texto de una carta no coincide con lo que ejecuta el juego, **el remake reproduce lo que
ejecuta el juego**. Casos (todos explicados por el código y varios confirmados por las FAQs):
Aquilamon (nunca se activa), Dolphmon y Veedramon/AeroVeedramon (miran al rival), Sylphymon
(ataca primero), Betamon/R-Gatomon (`<=`), Devil's Chip (descarte al azar), PlatinumSukamon /
Digimon Analyzer / Reverse Sevens (requieren Offline Pile con cartas), Special Digivolve (−20 DP),
Fake Sevens (no hace nada). Lista en [`tools/extract/knownIssues.ts`](../../tools/extract/knownIssues.ts).

**Abierto:** MetalSeadramon. Las FAQs dicen que "rara vez funciona", pero su bytecode es correcto.

---

## 5. `DECK2.DEK` — mazos originales del juego

En `B.DRV`, 17 498 bytes. Extractor: `npm run extract:decks` → `src/data/decks.json`.

```
+0x0000  "30KD" magic, u16 (¿checksum?)
+0x0006  159 registros × 110 bytes (+ 2 bytes de relleno)
Registro:
+0x00  u16        desconocido (¿grupo / dificultad?)
+0x02  30 × u16   ids de carta (índice de CARD2.CDD)
+0x3E  char[19]   nombre del mazo
+0x51  char[19]   dueño (personaje rival, o "Player")
+0x64  u16        desconocido
+0x66  4 × u8     parámetros de personalidad de la CPU (0–2) → flags del jugador bits 22..29
+0x6A  4 bytes    desconocidos
```

* Registro 0: mazo **Tutorial** de Betamon.
* Registros 142–157: mazos del dueño **"Player"**. Los tres primeros, **Red / Green / Yellow**, son los
  mazos iniciales de Veemon, Hawkmon y Armadillomon, como dicen el manual y el Let's Play.
* El resto (Agumon, Davis, Imperialdramon, Apokarimon…) son los mazos de los rivales.
* Ningún mazo supera las **4 copias** de una carta: los datos confirman la regla del manual.

> **Corrección (investigación de la progresión, [`07-progresion.md`](07-progresion.md)) ✅** El código lee los
> registros en `archivo + 8 + 110·i` (`SLUS 0x8003FA20`), no en `+6`. Con el registro real:
> `+0x00` 30 cartas · `+0x3C` nombre · `+0x4F` dueño · `+0x62` u16 · `+0x64` 4 bytes de personalidad ·
> `+0x68..0x6A` presentación del rival · **`+0x6B` tipo de sobre de premio** · **`+0x6C` EXP que da** ·
> **`+0x6D` Digi-Egg del compañero de la CPU**. Las cartas, el nombre, el dueño y la personalidad ya se
> leían bien (misma posición relativa). Lo que el extractor llama `unknown.head` de cada mazo son en realidad
> los bytes de EXP y Digi-Egg del mazo **anterior**. El extractor ya está corregido: `decks.json` trae `exp`,
> `prizePack`, `partnerEgg` y `presentation`.

---

## 6. Arte de las cartas — `LC000…LC300` en `B.DRV`

Directorio interno en `B.DRV` @ `0x800`: 301 registros `LC###.TIM` (uno por carta, el número es el
id de `CARD2.CDD`). Cada uno es un TIM de **64×64 a 8 bpp con CLUT de 256 colores** (4 640 bytes).
Extractor: `npm run extract:art` → `public/card-art/LC###.png`. Las imágenes **no se suben a git**:
cada usuario las genera desde su propio disco. La interfaz funciona sin ellas (muestra la inicial).
