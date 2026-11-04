# 03 — Compañero (Partner), Digi-Eggs, Digi-Parts, Card Fusion e Intercambio

Fuente: código de `SLUS_013.28` y overlays de `P.DRV` (KAWSEG, EVOSEG, SAISEG, SUBSEG, OPENSEG) + datos de
`B.DRV`/`C.DRV`/`E.DRV`. Convención: ✅ verificado en código/datos (dirección o offset), 🟡 probable (se dice por
qué), ❓ desconocido. Direcciones de overlays = base `0x801DDF38`. Scripts de apoyo en `PROG/scripts/`
(`fusion.py`, `parts.py`, `partlv.py`, `pfparts.py`, `templates.py`, `deck_egg.py`, `gen_*.py`).
Tablas completas exportadas: `PROG/digiparts.csv` (128 Digi-Parts) y `PROG/fusion_pairs.csv` (37 401 pares de fusión).

## Resumen

- ✅ Hay **3 ranuras de compañero** en la partida (de 6 cartas Partner posibles). Cada ranura guarda una **copia
  propia** de la carta Rookie y de su Armor, ya modificadas por nivel y Digi-Parts; en batalla la carta Partner del
  mazo apunta a esa copia.
- ✅ Nivel 1–99. La EXP es acumulativa (máx. 9999). Para pasar del nivel L al L+1 hace falta **EXP ≥ (L+1)·(L+3)**.
  Cada nivel nuevo da **una Digi-Part fija por compañero**, y cada **5 niveles** da **+10** a un stat al azar (HP, ◯, △ o ✕).
- ✅ **13 Digi-Eggs** (3 de Veemon y 2 de cada uno de los otros 5). El huevo elegido hace que el Partner Armor-digievolucione al entrar
  en batalla (la CPU lo hace sola; al humano se le pregunta *"Do you want to Armor Digivolve?"*).
- ✅ **128 Digi-Parts** con 9 tipos: HP, ataques, ✕-efecto, +P, programa de soporte, % de EXP y % de carta rara.
  Las "skills" de EVOSEG/SUBSEG/KAWSEG son los **nombres de las Digi-Parts**.
- ✅ **Card Fusion**: la especialidad del resultado sale de una tabla 6×6 (especialidad A × especialidad B). El valor
  buscado es **Composite(A)+Composite(B)**: se toma la primera carta de esa especialidad cuyo **Result** coincide y,
  si no hay ninguna, se busca ±1, ±2… Además hay **20 fusiones especiales** fijas y una **"Fusion Mutation"** con
  probabilidad (⌊S/10⌋+1)%.
- ✅ **Partner Fusion**: la EXP que recibe el compañero es igual al **Composite** de la carta sacrificada. Hay 5 combinaciones por compañero que dan una
  Digi-Part en lugar de EXP.
- ✅ **Trade** (2 memory cards): hasta 3 cartas por lado. No se pueden intercambiar cartas con Composite 0, ni copias
  que estén en uso en un mazo, ni recibir más de 6 copias. Las copias llevan un **número de serie** que impide
  devolver "los mismos datos".

---

## 1. Estructuras de la partida (save)

### 1.1 Bloque por jugador ✅
`*0x8006E050` = `malloc(20200)` (`SLUS 0x8002D418`) = **2 bloques × 10 100 B (0x2774)**. El bloque 0 es el jugador.
El bloque 1 es el rival en batalla: la CPU, o la partida de la 2.ª memory card en 2P o en Trade. El índice siempre
se calcula como `jugador*0x2774` (patrón `(i<<6)-i …` en todas las funciones `0x80047xxx`).

| Offset | Tipo | Campo | Conf. | Evidencia |
|---|---|---|---|---|
| +0x10 | u16 | id de registro: si P1 == P2, sale *"You can't trade the same Data!"* | ✅ cmp / 🟡 nombre | OPENSEG 0x801EB4B8 |
| +0x28 | u32 | flags; **bit 10 = Trade habilitado** | ✅ | OPENSEG 0x801EB428 (P2: +0x279C) |
| +0x3C | 16 B | **bitfield de Digi-Parts poseídas** (128 bits) | ✅ | set 0x8004950C, test 0x800496E4 |
| +0x4C / +0x4E | u16 | cartas recibidas / dadas por Trade (tope 9999) | ✅ | OPENSEG 0x801E1C4C / 0x801E1E10 |
| +0x50 / +0x52 / +0x54 | u16 | nº de Card Fusions / cartas consumidas en fusión / mutaciones | ✅ | EVOSEG 0x801EBB48.. |
| +0x56 | u16 | compañero inicial elegido (0..2) | ✅ | OPENSEG 0x801E8440 |
| +0x80 + k·0x298 | 3 × 664 B | **ranuras de compañero** k=0..2 (§1.2) | ✅ | 0x80047620 |
| +0x848 | u16[32] | contador por bonus de EXP (se muestra como valor+1) | 🟡 | KAWSEG 0x801FA9B4 |
| +0xAC0 | u16[159] | flags por registro de DECK2 (el mazo inicial recibe OR 0x8000) | 🟡 | OPENSEG 0x801E83C8 |
| +0x14B2 | u8[301] | **colección**: bits 0-2 = copias (máx. **6**); 0x20 nueva; 0x40 "identificada"; 0x10/0x80 otros | ✅ cuenta / 🟡 flags | 0x80045B18, 0x80045F5C |
| +0x15E0 | u16[301][6] | **nº de serie aleatorio de cada copia** | ✅ | 0x80045968 (rand único), Trade |
| +0x2438 + d·0x110 | 3 mazos | +0 existe; +1 nombre; +0x14: 30 × 8 B `{kind,idx,u16 id,ptr}` | ✅ | 0x800469A4/0x80046A38 |
| +0x2768 | u16[3] | 3 cartas de premio de la última victoria | ✅ | 0x8004635C/0x80046864 |

### 1.2 Ranura de compañero (`S = bloque + 0x80 + k·0x298`) ✅
Constructor: `0x80047620`. Reconstrucción: `0x80048230`. Re-enlace tras cargar la partida: `0x80047438`.

| Offset en S | (offset que usa el código) | Campo |
|---|---|---|
| +0x000 | +0x080 | **copia de la carta Rookie** (316 B, registro CARD2), ya con Digi-Parts |
| +0x13C | +0x1BC | **copia de la carta Armor** del huevo elegido (si no hay huevo, copia del Rookie) |
| +0x278 / +0x27C | +0x2F8 / +0x2FC | puntero al registro base del Rookie / del Armor |
| +0x280 | +0x300 | u16 bonus de HP (subidas de nivel) |
| +0x282 | +0x302 | u16[3] bonus ◯ △ ✕ (subidas de nivel) |
| +0x288 | +0x308 | u8 **id de la carta Partner** (0 = ranura vacía) |
| +0x289 | +0x309 | s8 **nivel** (1..99) |
| +0x28A | +0x30A | u16 **EXP acumulada** |
| +0x28C | +0x30C | s8[3] **Digi-Parts equipadas** (−1 = vacío) |
| +0x28F | +0x30F | u8[3] **Digi-Eggs poseídos**: id de la carta Armor por índice de huevo (0 = no) |
| +0x292 | +0x312 | u8 **Armor elegido** (id de carta; 0 = ninguno) |
| +0x293 | +0x313 | u8 % de EXP extra (suma de Digi-Parts tipo 8 b1=0) |
| +0x294 | +0x314 | u8 % de carta rara (suma de Digi-Parts tipo 8 b1=1) |

`0x80047438` (al cargar): si nivel ≥ 99, deja nivel = 99 y EXP = need(98) = **9999**. También rehace los punteros
y vuelve a llamar a `0x80048230` ✅.

---

## 2. Compañeros

### 2.1 Las 6 cartas Partner y sus Armor ✅
Tablas de SLUS: partners `0x8006E518` (6 × u8) y armors `0x8006E520` (6 × 3 × u8, donde 0 = sin huevo).
El "índice de partner" (0..5) que usa todo el código es el de esta tabla (`0x80047A58`).

| idx | Partner (id) | Huevo 0 → Armor | Huevo 1 → Armor | Huevo 2 → Armor | Flags de script de los huevos | Nombre del huevo (🟡) |
|---|---|---|---|---|---|---|
| 0 | Veemon (175) | Flamedramon (172) | Raidramon (185) | Magnamon (173) | 295, 296, 297 | Courage / Friendship / Miracles |
| 1 | Hawkmon (182) | Halsemon (179) | Shurimon (188) | – | 299, 300 | Love / Sincerity |
| 2 | Armadillomon (190) | Digmon (189) | Submarimon (176) | – | 302, 303 | Knowledge / Reliability |
| 3 | Gatomon (184) | Nefertimon (181) | Tylomon (178) | – | 308, 309 | Light / Reliability |
| 4 | Patamon (183) | Pegasusmon (180) | Baronmon (174) | – | 305, 306 | Hope / Courage |
| 5 | Wormmon (187) | Shadramon (186) | Quetzalmon (177) | – | 311, 312 | Courage / Light |

* "Veemon alone has 3 Digi-Eggs" ✅ por la tabla. En total hay 13 huevos ✅.
* Flags: SAISEG `0x801E0D8C` lee 13 variables del motor de script con los ids de la tabla `SAISEG 0x801DE2FC`
  (columna "Flags"). Para cada ranura ocupada, si la variable vale ≠ 0, llama a `0x80047C38(0, idx, huevo)`.
  También guarda una máscara de 13 bits en `*0x8006E054+0x1020`. Así, un huevo recibido antes de tener a ese
  compañero se aplica en cuanto se consigue. ✅
* 🟡 Los nombres de huevo se asignan a cada Armor por el orden canónico del anime y por los diálogos
  (`C.DRV` @0x565406.., @0x567EB6.., @0x5E51DE "Digi-Egg of Miracles"). El código solo usa índices.
* EVOSEG usa **otro orden** para los mismos 6 partners (`EVOSEG 0x801EFED4`: Veemon, Hawkmon, Armadillomon,
  **Patamon, Gatomon**, Wormmon) ✅. Cuidado al leer las tablas de Partner Fusion.

### 2.2 Obtención de compañeros ✅
* **Inicial** (OPENSEG `0x801E8280..`): el jugador elige entre Veemon, Hawkmon y Armadillomon (texto @OPENSEG
  0x801DE8B8). Se llama a `0x80047A38(0, elección)` → `0x80047620(…, flag=1)`. Además:
  - Mazo 1 = registro DECK2 **142/143/144** (Red/Green/Yellow). Cada carta que no sea Partner se añade 1 vez a la colección.
  - **5 cartas extra**: por cada par de la tabla `OPENSEG 0x801F04C4` se elige una al 50 % (`rand()%2`):

    | Partner | pares (se elige 1 de cada) |
    |---|---|
    | Veemon | Meteormon/Andromon · BomberNanimon/Zassomon · Solarmon/Aruraumon · Candlemon/Sharmamon · Circle Hitter/Fire Spot |
    | Hawkmon | Piximon/Etemon · MoriShellmon/SandYanmamon · Palmon/Hagurumon · Elecmon/ModokiBetamon · Triangle Hitter/High Speed Disk |
    | Armadillomon | BlueMeramon/Mamemon · Icemon/Geremon · Gizamon/ToyAgumon · SnowGoburimon/Vi-Elecmon · Cross Hitter/Ice Crystal |
  - Se da la **Digi-Part inicial** del compañero (tabla `0x8006EEFC`): Veemon 10 (◯+100), Hawkmon 15 (△+50),
    Armadillomon 0 (HP+50), Gatomon 38 (+10 DP), Patamon 100 (Recover HP +200), Wormmon 20 (✕+50). Coinciden con el
    "nivel 1" de la tabla de niveles (§3.3). ✅
* **2.º y 3.er compañero**: pantalla "PARTNER GET / Is this Partner OK?" (SAISEG `0x801F2ABC`). Muestra una lista de
  candidatos de hasta 4 ids (`0x801F5408`, −1 = vacío) y llama a `0x80047A38`. ✅ código.
  🟡 Por los diálogos, los da un PNJ (p. ej. Cody: *"It's a new Partner Card… I can only give you one of them"*,
  C.DRV @0x5B3F72). La regla *"6 different Partner Cards, but you can only get 3"* (C.DRV @0x5E23AE) coincide con
  las 3 ranuras. ❓ Qué script rellena la lista y con qué candidatos.
* `0x80047620` busca la primera ranura cuyo +0x308 sea igual al partner (y entonces no hace nada) o que esté vacía,
  y la inicializa con nivel 1, EXP 0, sin piezas, sin huevos y bonus a 0. Con flag=1 marca colección `|=0xF0` y da la
  pieza inicial; con flag=0 (CPU) marca `|=0x50`. ✅
* **CPU**: `0x8003F9EC` carga el mazo rival de DECK2. Por cada carta Partner del mazo crea una ranura en el bloque 1
  (nivel 1, sin piezas) y, si el byte de huevo del registro es ≠ 0, le da y equipa ese huevo
  (`0x80047C38(1, idx, byte-1)`) ✅. Ver §7 (corrección del formato DECK2).

### 2.3 Nivel y experiencia ✅
* Umbral: `need(L) = (L+1)·(L+3)` (`SLUS 0x80049934`). La EXP se compara **acumulada**: se sube de L a L+1 cuando
  `EXP ≥ need(L)`. Ejemplos: 1→2: 8 · 2→3: 15 · 4→5: 35 · 9→10: 120 · 19→20: 440 · 49→50: 2600 · 98→99: **9999**.
* **EXP en batalla** (KAWSEG `0x801F4A24`, solo el jugador 0):
  - Total `E` = EXP del rival + bonus (`KAWSEG 0x801FAA54`). La EXP del rival es el byte `*0x8006E054+0x74` (= DECK2 +0x6C, ver
    §7) y solo cuenta si el jugador ganó (`ctx+0x81E == 0`, `KAWSEG 0x801F41CC`). Los bonus se leen de la tabla
    `KAWSEG 0x801FC300` (8 B: id, EXP, puntero al nombre). Entre ellos: *Partner Win* +1, *3 Partners* +2,
    *3 Partners Plus* +2, *Partner Normal Digivolve* +2 y *Super Bonus* +10 (con ≥7 bonus). Las condiciones exactas son flags del jugador
    `+0x110` (bits 14, 11, 12-13==3, 29): 🟡 los nombres son del juego, ❓ el momento en que se activan.
  - Una ranura gana EXP solo si su Partner (o el Armor que tiene equipado, que en batalla reemplaza a la carta) está
    entre las 30 cartas del mazo usado (`0x80047B84`/`0x80048150` sobre `jugador+0x16+i*8`) y su nivel es < 99.
  - Ganancia = `E + ⌊E·bonus%/100⌋`, donde bonus% es la ranura +0x313 (Digi-Parts 123–125). La EXP se suma de 1 en 1:
    en cada nivel nuevo se comprueba la Digi-Part (§3.3) y el stat-up.
* **Stat-up cada 5 niveles** (`0x8004994C`): si el nivel nuevo es múltiplo de 5, `r = rand()%4` → **+10** al bonus de
  HP (r=0), ◯ (1), △ (2) o ✕ (3) (+0x300..+0x306). Entre los niveles 5 y 95 hay 19 subidas: **+190 en total**,
  repartidos al azar. ✅
* **EXP por Partner Fusion**: igual al Composite de la carta sacrificada, **sin** el % de EXP (EVOSEG `0x801EB3D4`,
  `0x801EB670`) ✅. Ver §4.7.
* Nivel máximo 99. Al llegar se muestra "RANK MAX!" y la EXP restante se pierde (EVOSEG 0x801EB7DC/0x801EB89C) ✅.

### 2.4 Digi-Eggs fuera de batalla ✅
* `0x80047C38(jug, idx, huevo)` = **dar huevo**: guarda el id Armor en +0x30F+huevo, marca la colección de ese
  Armor `|=0x50` y, si no había Armor elegido (+0x312==0), lo **equipa** (`0x80047E64`).
* `0x80047E64(jug, idx, huevo)` = **elegir huevo**: exige tenerlo; pone +0x312 = id Armor y +0x2FC = su registro, y
  reconstruye. Desde el menú se llama en SUBSEG `0x801E2D88`. 🟡 Según la FAQ, con L1/R1.
* `0x80048014(jug, idx)` devuelve el índice del huevo equipado, o −1. ❓ No se encontró cómo quitar el huevo
  (dejar +0x312 = 0) una vez puesto.

### 2.5 El compañero en batalla ✅
* **Carta personalizada**: `0x80046A38` construye los 30 punteros del mazo. Si el id de una carta coincide con el
  +0x308 de una ranura, su puntero va a **S+0x000** (la copia modificada) en vez de al registro de CARD2. Así se aplican
  en batalla todas las Digi-Parts sin código especial.
* **Armor-digivolución al entrar**:
  - Estado 8 (turno de la CPU; decisión "qué Digimon entra", ver doc 06): si la carta que entra es un Partner con ranura
    (`0x80047B84`) y tiene huevo equipado (`0x80048014`), espera 60 frames, ejecuta la animación KAWSEG `0x801F6214(1,j)` y
    llama a `0x80040A48`. **Es automático.**
  - Estado 9 (jugador humano): la misma comprobación, pero muestra *"Do you want to Armor Digivolve?"*
    (`SLUS 0x80010D3C`, `0x8003528C`). Respuesta 1 → `0x80040A48`. 🟡 El significado exacto de las otras respuestas
    (0/2) no se trazó.
  - `0x80040A48(jug, ranura)`: reescribe **en el sitio** la entrada del mazo de la carta en el Battle Slot. Le pone el
    id del Armor (`0x80046BAC`) y el puntero **S+0x13C** (la copia Armor con bonus de HP y ataques). Fija la
    especialidad, **HP = HP del Armor** y los tres poderes del Armor. No apila: el Rookie se convierte en el Armor.
  - El texto de SLUS "Preparation: Digi-Egg Power-Up." (@0x1DA4) es solo un nombre de fase de depuración.
* **Quirk ✕=100**: en `0x80048230`, si la ✕ base del Rookie (o del Armor) vale 0, pasa a 100. Al final, si el
  ✕-efecto es Counter/Crash (ids 5–8), la ✕ se vuelve a poner a 0 (`0x8004933C..`). En la práctica, un Partner con
  Counter conserva ✕=0. Si una Digi-Part tipo 5 le cambia el efecto, su ✕ parte de 100. ✅
* **Quirk de soporte en el Armor**: una Digi-Part tipo 7 (soporte) reemplaza el **programa** (condiciones y acciones)
  solo en la copia del Rookie. En la copia Armor reemplaza únicamente el **texto** y la **velocidad de soporte**: el Armor
  conserva su programa original pero muestra el texto de la pieza. ✅ código (`0x80048C1C..0x800490E8`, ninguna
  escritura en S+0x13C+0x74/+0xB4). Hay que reproducirlo tal cual.

---

## 3. Digi-Parts (128) ✅

### 3.1 Formato y tipos
Tabla `SLUS 0x8006E9B4`: 128 entradas × 8 B = `{u8 tipo, u8 b1, u8 b2, u8 b3, s16 valor, u8 b6, u8 b7}`.
Las aplica `0x80048230` con un switch de 9 casos (tabla `0x8001274C`). Se aplican a la copia Rookie (R) y a la copia
Armor (A) de la ranura:

| tipo | ids | efecto |
|---|---|---|
| 0 | 0–6 | HP += valor (R y A) |
| 1 | 7–9 | ◯, △ y ✕ += valor (R y A) |
| 2 / 3 / 4 | 10–14 / 15–19 / 20–23 | ◯ / △ / ✕ += valor (R y A) |
| 5 | 24–37 | ✕-efecto := b1 (R y A); ✕ += valor (−100/−200), y si valor = 0, ✕ := 0 |
| 6 | 38–40 | +P (DP que da la carta, rec. +0x1C) += valor (10/20/30) (R y A) |
| 7 | 41–122 | **programa de soporte nuevo** (ver abajo) |
| 8 | 123–127 | b1=0: +0x313 += valor (**% EXP**: 10/20/30); b1=1: +0x314 += valor (**% carta rara**: 10/20) |

Al final todos los poderes negativos se recortan a 0.

**Tipo 7**: desactiva las 2 condiciones y las 3 acciones del Rookie y borra el texto (R y A). Después:
* Si b1 ≠ 0, copia la condición plantilla `b1` desde `0x8006E534` (18 × 32 B) en la condición 0 y pone su literal o0 = valor.
* Copia `b3` acciones desde la plantilla `b2`, `b2+1`… (`0x8006E774`, 36 × 16 B) y pone el literal o2 = valor.
* Texto: tabla de punteros `0x8006EDB4[id−41]` (cadena con `\n`, 4 líneas de 21). Velocidad de soporte (+0xE6) = b6.

El formato es el del bytecode documentado en `02-formato-rom.md §3`. Ejemplos de plantillas decodificadas:
* Condiciones: 1–5 = `var2 (especialidad rival) == 0..4`; 6/7/8/18 = `var13 (nivel propio) == R/C/U/A`;
  9 = `HP propio < HP rival`; 10–12 = `ataque rival == ◯/△/✕`; 13/14/15/17 = mano rival / DP rival / Online rival /
  Online propio ≥ 1; 16 = Offline propio no vacío.
* Acciones: 1 = `poder += lit`; 2 = `poder ×= lit`; 3–8 = lo mismo para ◯/△/✕ concretos; 9/10 = poder propio/rival
  := 0; 11 = Eat-up; 15 = contraataque; 16 = robar; 17 = buscar Partner; 18 = barajar; 28 = revivir; 31 = poder ÷2 y
  HP +lit; 33 = poder := HP; 34 = atacar primero; 35/36 = HP +200 y todos los ataques +100.

Los iconos de nivel del texto: `*e3`=R, `*e4`=C, `*e5`=U, `*ea`=A. ✅ Lo confirman las condiciones 6/7/8/18
(nivel 0/2/3/1).

### 3.2 Reglas de equipamiento ✅
* **3 huecos** por compañero (+0x30C..+0x30E).
* Las piezas son **globales**: un solo bit de propiedad por pieza (bloque +0x3C). `0x800496E4` devuelve 0 = no la
  tienes, 1 = la tienes libre, 2 = equipada en algún compañero. Para equipar (`0x800493EC`) hace falta el estado 1:
  **una pieza solo puede estar en un compañero a la vez**. Quitar: `0x8004949C`. En los diálogos: *"A Digi-Part can be
  used by anyone on any of the Partner Cards"* (C.DRV @0x59EE22).
* Compatibilidad (`0x800495B4`, desde SUBSEG): **no se pueden repetir tipos** en un compañero. Además el tipo 1
  (todos los ataques) excluye a los tipos 1–4. Consecuencias: un solo programa de soporte y un solo tipo 8, así que
  **no** se pueden combinar % EXP y % carta rara en el mismo compañero.

### 3.3 Cómo se obtienen ✅
1. **Por nivel**: tabla de 128 × 12 B `{char* nombre, s8 nivel[6] (orden SLUS), 2 B}` en `KAWSEG 0x801FBB38`
   (copia idéntica en `EVOSEG 0x801EF8D4`). `0x80049840` devuelve la pieza cuyo nivel, para ese compañero, es igual al
   nivel nuevo (si aún no la tienes). **Cada compañero tiene exactamente 1 pieza por nivel, del 1 al 99**: 99 piezas.
   La del nivel 1 es la inicial.
2. **Partner Fusion**: 5 combinaciones por compañero (§4.7).
3. **Eventos**: pantalla "GET DIGIPARTS LIST" en SAISEG (`0x801F32CC` → `0x8004950C`). Hay 7 piezas que no
   aparecen en ningún nivel ni en Partner Fusion: **45, 61, 85, 86, 92, 99, 114**. ❓ Qué eventos las dan
   (C.DRV tiene *"You got a Digi-Part"* en varios scripts).
4. "Digi-Parts Stock" (SAISEG) = bits poseídos / 128 (*"Collected Digi-Parts ratio, 128 total"*). 🟡

### 3.4 Las "habilidades" que preguntaba el encargo
* *"Boost Battle Experience by 10/20/30%"* = piezas 123/124/125 (tipo 8, b1=0). Solo afectan a la EXP de batalla
  del compañero que las lleva (KAWSEG 0x801F4F20) ✅. Lo mismo dice un PNJ: *"It only boosts the Experience of
  the Partner equipped with it"* (C.DRV @0x561736).
* *"Rare Card might appear / even more likely"* = piezas 126/127 (+10/+20). En `0x8004635C` (premio tras ganar)
  `s1 = Σ +0x314` de **todas** las ranuras ocupadas, estén o no en el mazo. Con `rand()%100 < s1`, la **1.ª de las
  3 cartas de premio** sale de la lista "rara". Esa lista son las cartas cuyo valor Result supera el máximo del pack
  por una ventana (tabla `0x8006E35C`, 18 B por pack). Máximo efectivo: 10+20 = **30 %**, porque cada pieza existe
  una sola vez ✅.
* *"Draw until there are 4 Cards"*, *"If KO'd in battle, revive w/ HP 1000"*, etc. son piezas tipo 7: dan a la
  carta Partner un **nuevo programa de soporte** que ejecuta el intérprete normal (KAWSEG 0x801E9C1C). No hay código
  aparte ✅.
* **"ABILITIES: Deck Color / Attack / Defense / Digivolve Speed"** (SAISEG 0x801E7D1C) **no son del compañero**.
  Los valores vienen de variables del script (`*(*0x801F4838+8)` +0x14 máscara de especialidades, +0x18 Attack,
  +0x1C Defense, +0x20 Digivolve Speed) ✅. 🟡 Es la ficha del mazo de un rival que el script de la ciudad muestra antes
  de combatir.
* `E.DRV SKILL/SKILL%d.MSD` (solo 729, 998, 999 en el disco) **no son habilidades del compañero**. `0x8002DC30`
  las carga con el id de animación/efecto de cada ataque (registro +0x22/+0x3E/+0x5A y +0x24/+0x40/+0x5C,
  `0x8002DF98..`). 998 y 999 se cargan siempre (`0x8002E0E8`). Son scripts de animación de ataques ✅.

### 3.5 Tabla completa de Digi-Parts
Niveles de obtención por compañero (orden SLUS). "PF" = Partner Fusion (compañero + carta). Nombre = cadena corta del
juego (KAWSEG); el texto de soporte completo de los tipo 7 está en `digiparts.csv`.

| id | tipo | efecto (nombre corto del juego) | Vee | Hawk | Arma | Gato | Pata | Worm | otra fuente |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 0 | HP+50. | 3 | 5 | 1 | 99 | 3 | 7 | inicial Armadillomon |
| 1 | 0 | HP+100. | 17 | 16 | 8 | 12 | 14 | 19 |  |
| 2 | 0 | HP+150. | 29 | 32 | 19 | 25 | 32 | 33 |  |
| 3 | 0 | HP+200. | 45 | 48 | 31 | 40 | 52 | 59 |  |
| 4 | 0 | HP+300. | 61 | 67 | 51 | 57 | 68 | 78 |  |
| 5 | 0 | HP+400. | 96 | 89 | 71 | 81 | 91 | 88 |  |
| 6 | 0 | HP+500. | 99 | – | 75 | 91 | – | 95 | PF: Armadillomon+Vikemon |
| 7 | 1 | All Attack Powers +50. | 18 | 39 | 54 | 30 | 57 | 28 |  |
| 8 | 1 | All Attack Powers +100. | 39 | 86 | 72 | 50 | 89 | 51 |  |
| 9 | 1 | All Attack Powers +200. | 75 | – | 90 | 93 | – | 84 | PF: Veemon+Imperialdramon |
| 10 | 2 | ◯ Attack Power +100. | 1 | 9 | 15 | 5 | 4 | 2 | inicial Veemon |
| 11 | 2 | ◯ Attack Power +150. | 10 | 21 | 38 | 22 | 16 | 15 |  |
| 12 | 2 | ◯ Attack Power +200. | 27 | 54 | 62 | 41 | 39 | 30 |  |
| 13 | 2 | ◯ Attack Power +250. | 48 | – | 78 | 61 | 62 | 61 |  |
| 14 | 2 | ◯ Attack Power +300. | 67 | – | – | 85 | 82 | 79 |  |
| 15 | 3 | △ Attack Power +50. | 4 | 1 | 12 | 2 | 6 | 13 | inicial Hawkmon |
| 16 | 3 | △ Attack Power +100. | 12 | 7 | 22 | 16 | 18 | 29 |  |
| 17 | 3 | △ Attack Power +150. | 32 | 28 | 45 | 36 | 45 | 43 |  |
| 18 | 3 | △ Attack Power +200. | 51 | 44 | – | 56 | 67 | 66 |  |
| 19 | 3 | △ Attack Power +250. | 77 | – | – | 76 | 86 | 96 |  |
| 20 | 4 | ✕ Attack Power +50. | 6 | 6 | 2 | 4 | 10 | 1 | inicial Wormmon |
| 21 | 4 | ✕ Attack Power +100. | 19 | 36 | 20 | 19 | 27 | 9 |  |
| 22 | 4 | ✕ Attack Power +150. | 35 | 69 | 42 | 38 | 53 | 24 |  |
| 23 | 4 | ✕ Attack Power +200. | 82 | – | 63 | 67 | – | 48 |  |
| 24 | 5 | ◯ to 0, ✕ Attack Power -100. | 24 | 12 | 4 | 14 | – | 34 |  |
| 25 | 5 | △ to 0, ✕ Attack Power -100. | 46 | 23 | 9 | 35 | – | 17 |  |
| 26 | 5 | ✕ to 0, ✕ Attack Power -100. | 58 | 71 | 36 | 10 | – | 71 |  |
| 27 | 5 | Counter ◯,✕ Attack Power to 0. | 11 | 26 | – | – | 40 | 62 |  |
| 28 | 5 | Counter △,✕ Attack Power to 0. | 36 | 14 | – | – | 24 | 49 |  |
| 29 | 5 | Counter ✕,✕ Attack Power to 0. | 40 | 57 | – | – | 11 | 21 |  |
| 30 | 5 | Opponent Fire X3, ✕ Attack Power -200. | 87 | 92 | 39 | 69 | 31 | 50 |  |
| 31 | 5 | Opponent Ice X3, ✕ Attack Power -200. | 25 | 97 | – | 42 | 77 | 73 |  |
| 32 | 5 | Opponent Nature X3, ✕ Attack Power -200. | 37 | – | 66 | – | 83 | 4 |  |
| 33 | 5 | Opponent Darkness X3, ✕ Attack Power -200. | 68 | 33 | 46 | 21 | 5 | 97 |  |
| 34 | 5 | Opponent Rare X3, ✕ Attack Power -200. | 52 | 41 | 6 | – | – | 25 |  |
| 35 | 5 | 1st Attack, ✕ Attack Power -200. | 76 | 50 | 95 | 62 | – | – | PF: Wormmon+MegaKabuterimon |
| 36 | 5 | Jamming Support, ✕ Attack Power -100. | – | 74 | 27 | – | 54 | 10 |  |
| 37 | 5 | Eat-up HP, ✕ Attack Power -200. | – | 87 | 50 | – | 73 | – |  |
| 38 | 6 | Add + 10 DP. | 42 | 4 | 61 | 1 | 9 | – | inicial Gatomon |
| 39 | 6 | Add + 20 DP. | 91 | 29 | 79 | 27 | 21 | – |  |
| 40 | 6 | Add + 30 DP. | – | 98 | 97 | 60 | 78 | 85 | PF: Patamon+Seraphimon |
| 41 | 7 | Boost Attack Power +50. | 2 | 10 | 13 | 3 | 7 | 11 |  |
| 42 | 7 | Boost Attack Power +100. | 21 | 42 | 56 | 33 | 36 | 35 |  |
| 43 | 7 | Boost Attack Power +200. | 26 | 81 | 73 | 46 | 84 | 44 |  |
| 44 | 7 | Boost Attack Power +300. | 69 | – | 84 | 82 | – | 80 |  |
| 45 | 7 | Attack Power is Doubled. | – | – | – | – | – | – |  |
| 46 | 7 | Boost ◯ Attack Power +300. | 8 | 30 | 47 | 17 | 26 | 12 |  |
| 47 | 7 | Boost ◯ Attack Power +400. | 34 | 77 | 74 | 47 | 46 | 39 |  |
| 48 | 7 | Boost ◯ Attack Power +500. | 55 | – | 88 | 88 | 66 | 74 | PF: Veemon+MasterTyrannomon |
| 49 | 7 | ◯ Attack Power is Doubled. | 13 | 64 | 67 | 58 | 33 | 63 |  |
| 50 | 7 | ◯ Attack Power is Tripled. | 59 | – | 94 | 74 | – | 86 | PF: Patamon+AeroVeedramon |
| 51 | 7 | Boost △ Attack Power +200. | 15 | 2 | – | 7 | 22 | 18 |  |
| 52 | 7 | Boost △ Attack Power +300. | 28 | 19 | – | 23 | 41 | 36 |  |
| 53 | 7 | Boost △ Attack Power +400. | 43 | 70 | – | 92 | 59 | 53 | PF: Hawkmon+Phoenixmon |
| 54 | 7 | △ Attack Power is Doubled. | 22 | 13 | 59 | 34 | – | 67 |  |
| 55 | 7 | △ Attack Power is Tripled. | 83 | – | 91 | 94 | – | 89 | PF: Gatomon+Wizardmon |
| 56 | 7 | Boost ✕ Attack Power +100. | 23 | 40 | 10 | 18 | – | 8 |  |
| 57 | 7 | Boost ✕ Attack Power +200. | 38 | 58 | 40 | 43 | – | 20 |  |
| 58 | 7 | Boost ✕ Attack Power +300. | 71 | – | 60 | 63 | – | 90 | PF: Armadillomon+SuperStarmon |
| 59 | 7 | ✕ Attack Power is Doubled. | 44 | 72 | 48 | 51 | – | 40 |  |
| 60 | 7 | ✕ Attack Power is Tripled. | 88 | – | 85 | 95 | – | 65 | PF: Wormmon+Piedmon |
| 61 | 7 | Attack Power becomes same as HP. | – | – | – | – | – | – |  |
| 62 | 7 | Get 1st Attack. | 53 | 55 | 98 | 71 | 85 | – | PF: Hawkmon+Aquilamon |
| 63 | 7 | Attack becomes Eat-up HP. | – | 93 | 80 | – | 61 | 55 | PF: Wormmon+Stingmon |
| 64 | 7 | Lower Opponent's ◯ Attack Power to 0. | 54 | – | 17 | – | 28 | 75 |  |
| 65 | 7 | Lower Opponent's △ Attack Power to 0. | 84 | 24 | 28 | – | 15 | – |  |
| 66 | 7 | Lower Opponent's ✕ Attack Power to 0. | – | 66 | 24 | – | 13 | 45 |  |
| 67 | 7 | ◯ Counterattack (Attack 2nd). | 7 | – | 33 | – | 47 | 14 |  |
| 68 | 7 | △ Counterattack (Attack 2nd). | 33 | 17 | – | – | 37 | 26 |  |
| 69 | 7 | ✕ Counterattack (Attack 2nd). | 47 | 43 | 5 | – | – | 37 |  |
| 70 | 7 | If Fire Opponent, X2 own Attack Power. | 74 | 79 | – | 77 | 25 | 38 |  |
| 71 | 7 | If Fire Opponent, X3 own Attack Power. | – | 91 | – | 65 | 74 | 82 | PF: Patamon+MetalGarurumon |
| 72 | 7 | If Ice Opponent, X2 own Attack Power. | 5 | 47 | 64 | 26 | 80 | 76 |  |
| 73 | 7 | If Ice Opponent, X3 own Attack Power. | 60 | – | 89 | 83 | 98 | 91 | PF: Veemon+Paildramon |
| 74 | 7 | If Nature Opponent, X2 own Attack Power. | 50 | 27 | 58 | 59 | 42 | 6 |  |
| 75 | 7 | If Nature Opponent, X3 own Attack Power. | 79 | – | 93 | – | 93 | 70 | PF: Wormmon+Diaboromon |
| 76 | 7 | If Darkness Opponent, X2 own Attack Power. | 56 | 37 | 44 | 6 | 19 | 93 |  |
| 77 | 7 | If Darkness Opponent, X3 own Attack Power. | 92 | 60 | 87 | 79 | 63 | – | PF: Hawkmon+Sylphymon |
| 78 | 7 | If Rare Opponent, X2 own Attack Power. | 78 | 76 | 26 | 72 | 69 | 46 |  |
| 79 | 7 | If Rare Opponent, X3 own Attack Power. | 89 | 96 | 55 | – | – | 68 | PF: Armadillomon+Ankylomon |
| 80 | 7 | Change own Specialty to Fire. | 9 | 35 | – | 48 | 96 | – |  |
| 81 | 7 | Change own Specialty to Ice. | – | 99 | 30 | 87 | 58 | – |  |
| 82 | 7 | Change own Specialty to Nature. | 97 | 3 | 41 | 8 | 12 | 94 |  |
| 83 | 7 | Change own Specialty to Darkness. | 30 | – | 68 | 98 | 81 | 3 |  |
| 84 | 7 | Change own Specialty to Rare. | 95 | 82 | 14 | 52 | 76 | 99 |  |
| 85 | 7 | Switch Opponent's Specialty to own. | – | – | – | – | – | – |  |
| 86 | 7 | Swap Specialty with Opponent's. | – | – | – | – | – | – |  |
| 87 | 7 | If Fire Opponent, lower its AP to 0. | 66 | 52 | – | 97 | 43 | – |  |
| 88 | 7 | If Ice Opponent, lower its AP to 0. | 41 | 61 | 34 | 84 | 8 | – |  |
| 89 | 7 | If Nature Opponent, lower its AP to 0. | – | 11 | 52 | – | 64 | 22 |  |
| 90 | 7 | If Darkness Opponent, lower its AP to 0. | – | 25 | 37 | 13 | 2 | 72 |  |
| 91 | 7 | If Rare Opponent, lower its AP to 0. | – | 75 | 16 | – | 34 | 52 |  |
| 92 | 7 | Reduce both Players' Atk Pwr to 0. | – | – | – | – | – | – |  |
| 93 | 7 | If R, boost Attack Power +200. | 14 | 31 | – | 9 | 48 | 23 |  |
| 94 | 7 | If C, boost Attack Power +300. | 31 | 53 | – | 20 | 38 | 57 |  |
| 95 | 7 | If U, boost Attack Power +400. | 57 | – | 81 | 70 | 95 | 77 | PF: Patamon+MagnaAngemon |
| 96 | 7 | Opponent uses ◯ Attack. | 16 | 62 | – | 28 | 97 | 31 |  |
| 97 | 7 | Opponent uses △ Attack. | 62 | 18 | 11 | 39 | – | 47 |  |
| 98 | 7 | Opponent uses ✕ Attack. | 94 | 8 | 21 | – | 44 | 58 |  |
| 99 | 7 | Opponent uses same Attack. | – | – | – | – | – | – |  |
| 100 | 7 | Recover HP +200. | 72 | 15 | 32 | 11 | 1 | 81 | inicial Patamon |
| 101 | 7 | Recover HP +300. | 90 | 38 | 53 | 31 | 17 | – |  |
| 102 | 7 | Recover HP +400. | – | 68 | 92 | 73 | 55 | – | PF: Gatomon+Angewomon |
| 103 | 7 | Halve Attack Power, recover HP +400. | 93 | 20 | 43 | 15 | 23 | – |  |
| 104 | 7 | Halve Attack Power, recover HP +600. | – | 46 | 86 | 44 | 60 | – | PF: Gatomon+Lillymon |
| 105 | 7 | If HP < Opponent's HP, add HP +500. | 98 | 59 | 23 | 37 | 29 | – |  |
| 106 | 7 | If HP < Opponent's HP, add HP +700. | – | 83 | 69 | 53 | 56 | – |  |
| 107 | 7 | If KO'd in battle, revive w/ HP 300. | 49 | 34 | – | 24 | 30 | 42 |  |
| 108 | 7 | If KO'd in battle, revive w/ HP 600. | – | 63 | – | 49 | 49 | 64 |  |
| 109 | 7 | If KO'd in battle, revive w/ HP 1000. | – | 94 | – | 64 | 65 | 98 | PF: Gatomon+Rosemon |
| 110 | 7 | Drop 1 Card in Opponent's Hand. | 63 | 22 | 3 | 45 | 75 | 27 |  |
| 111 | 7 | Drop 2 Cards in Opponent's Hand. | – | 78 | 25 | – | 92 | 56 |  |
| 112 | 7 | Drop Opponent's Top 2 DP Cards shown. | – | 56 | 18 | 86 | 35 | 5 |  |
| 113 | 7 | Drop Opponent's Top 3 DP Cards shown. | – | 88 | 49 | – | 90 | 32 |  |
| 114 | 7 | Drop Opponent's Top 4 DP Cards shown. | – | – | – | – | – | – |  |
| 115 | 7 | Drop 2 Cards in Opponent's Online Deck. | – | 51 | 7 | 29 | – | 16 |  |
| 116 | 7 | Drop 3 Cards in Opponent's Online Deck. | – | 95 | 35 | 89 | – | 54 |  |
| 117 | 7 | Move Offline Top Card to Online Deck. | 86 | – | 70 | 78 | 50 | – | PF: Armadillomon+Zudomon |
| 118 | 7 | Void Opponent's Support Effect. | – | 84 | 65 | – | 87 | 69 | PF: Armadillomon+Shakkoumon |
| 119 | 7 | Draw until there are 4 Cards. | 64 | 45 | 29 | 54 | 20 | – |  |
| 120 | 7 | Draw Online Partner Card, then Shuffle. | 65 | 80 | 82 | 68 | 72 | – | PF: Veemon+ExVeemon |
| 121 | 7 | If R, HP + 200 & all Attack Powers +100. | 73 | 73 | – | 55 | 94 | 83 | PF: Patamon+Angemon |
| 122 | 7 | If A, HP + 200 & all Attack Powers +100. | 81 | – | 76 | 66 | 79 | 87 | PF: Hawkmon+Valkyrimon |
| 123 | 8 | Boost Battle Experience by 10%. | 20 | 49 | 57 | 32 | 71 | 41 |  |
| 124 | 8 | Boost Battle Experience by 20%. | 85 | 65 | 77 | 75 | 88 | 92 | PF: Hawkmon+Garudamon |
| 125 | 8 | Boost Battle Experience by 30%. | 80 | – | 96 | 90 | 99 | 60 | PF: Wormmon+GranKuwagamon |
| 126 | 8 | Rare Card might appear after battle. | 70 | 85 | 83 | 80 | 51 | – | PF: Veemon+WarGreymon |
| 127 | 8 | Rare Card even more likely to appear. | – | 90 | 99 | 96 | 70 | – | PF: Gatomon+Magnadramon |

---

## 4. Card Fusion (tiendas de Andromon) ✅

### 4.1 Las tres tiendas y su límite de nivel
EVOSEG es el overlay de la tienda. Carga el script `C:\EVENT\unit0%d.MSD` (`EVOSEG 0x801DF2E8`; UNIT00/01/02 =
Andromon No.1/No.2/No.3). El nivel máximo de Digimon fusionable lo pone **el script** en la variable `vars+0x30`
(`EVOSEG 0x801EA140` lo copia a `0x801F5358`).

| Tienda | Diálogo (C.DRV EVENT) | Límite |
|---|---|---|
| No.1 (UNIT00) | *"only Fuse Level *e3 and Option Cards"* | R ✅ texto / 🟡 valor 0 |
| No.2 (UNIT01) | *"Fuse up to Level *e4 Cards"* | C ✅ texto / 🟡 valor 2 |
| No.3 (UNIT02) | *"Fuse any Cards"* | U ✅ texto / 🟡 valor 3 |

Los datos se comparten entre tiendas: si ya visitaste una tienda de mayor nivel, las demás también usan ese límite
(diálogos *"I already got your data from No.2/No.3"*). ❓ En qué flags de script se guarda.

### 4.2 Selección y restricciones (`EVOSEG 0x801EABB0`) ✅
* Una carta **no se puede elegir** si:
  - su **Composite = 0**. Son las 19 cartas Partner/Armor (172–190), las 7 *Sevens* (285–291), Rosemon's Lure (292) y
    Download Digivolve (293).
  - es un Digimon (kind 0) cuyo nivel (+0x1A & 0xF; R0 A1 C2 U3) supera el límite de la tienda. Las Option no
    tienen esta restricción.
  - no te quedan copias libres. Copias libres = copias en colección − **máximo de copias en cualquiera de tus 3 mazos**
    (`EVOSEG 0x801E6398`). Las cartas que usa un mazo están protegidas.
* Un id entre 172 y 190 da un mensaje: si es un Partner, *"You can't use Partner Cards in Fusion."*; si es un Armor,
  *"You can't use that Card in Fusion."*.
* Al elegir la carta B, el resultado **ya queda decidido** (§4.3) **antes** de confirmar. Así las tiendas pueden
  avisar: No.1 dice la especialidad, No.2 el nivel o tipo de Option y No.3 el nombre exacto (script vars +0x2C
  resultado, +0x3C nivel, +0x40 especialidad, 5 = Option, 6 = Digivolve Option, +0x44 = 0/1/2 normal/especial/mutación).
  Los avisos de "Special Fusion" y "Fusion Mutation" solo aparecen con los datos de predicción, que son flags de
  script (❓).
* **Tope de 6 copias**: `0x801EAAE8`. Si el resultado normal o especial ya tiene 6 copias, `vars+0x2C = −1` y la tienda
  responde *"you have the maximum of this Card"*. Las **mutaciones no comprueban este tope**.
* **Coste**: se pierde 1 copia de A y 1 de B (`0x80045E1C` ×2) y se gana 1 copia del resultado (`0x80045B18`). No
  hay coste en dinero. Estadísticas: +0x50 +1, +0x52 +2 y, si es mutación, +0x54 +1. ✅

### 4.3 Algoritmo exacto (`EVOSEG 0x801ECCA0`, búsqueda `0x801ED5F4`) ✅
```
S   = (s8)(A.composite + B.composite)            // CARD2 +0x18
cat(X) = especialidad (rec+0x1A >> 4: 0 Fire,1 Ice,2 Nature,3 Darkness,4 Rare) si X es Digimon; 5 si Option/DV
R   = MIX[cat(A)][cat(B)]                         // tabla 6x6 EVOSEG 0x801EFEDC (§4.4)
si (A,B) o (B,A) está en ESPECIALES (20 entradas, EVOSEG 0x801DF03C) -> resultado fijo, tipo=1 (sin mutación)
si no:
  r = |rand() % 100|
  si r <= S/10:                                   // MUTACIÓN: prob = (floor(S/10)+1) %
     tipo=2;  r2 = |rand() % 100|
     r2 <= 20 : res = 273 + rand()%12  (Digi-Garnet..Digi-Turquoise); si ya tienes 6 -> res = 200 (Fake Sevens)
     r2 <= 60 : res = 200 (Fake Sevens)
     si no    : k = rand()%3 + 1;  res = BUSCAR(R, S+k) con la expansión normal (abajo)
  si no: tipo=0; res = BUSCAR(R, S)
BUSCAR(R, v):                                      // 0x801ED5F4
   v = v & 0xFF;  v = max(v,2);  si v >= 36 -> v = 35    // ojo: v negativo da 0xFF.. -> 35
   R in 0..4: PRIMER id del rango de la especialidad con Result(+0x19) == v   (no excluye A ni B)
   R == 5   : candidatos = ids de 191..272 y 294..300 con Result == v (en la 1.ª búsqueda se excluyen A y B);
              se barajan (swap a[i] con a[rand()%n]) y se toma a[0]
   si res == A o res == B -> res = -1
   mientras res == -1:  d = 1,2,…
       c1 = BUSCAR(R, v+d) ; c2 = BUSCAR(R, v-d)       // sin excluir A/B
       ambos -> res = c1 o c2 al 50 % ; uno -> ese
       si res == A o B -> res = -1 (y se prueba el siguiente d)
```
* Rangos (`EVOSEG 0x801EFF00`, pares s16): Fire 0–33, Ice 34–68, Nature 69–102, Darkness 103–138, Rare 139–171,
  Option 191–272 y 294–300. Las 172–190 (Partner/Armor), 273–293 y el resto **no son resultados normales**.
* Los valores Result son únicos dentro de cada especialidad, así que el resultado Digimon es **determinista**. Las Option
  son aleatorias entre los candidatos del mismo valor. El barajado tiene un sesgo pequeño a favor del 2.º candidato
  (p. ej. n=3: 33.3/37.0/29.6 %).
* Ejemplo de la FAQ comprobado: WaruMonzaemon (Darkness, 19) + Zudomon (Ice, 16) → MIX[3][1] = Fire, S = 35 →
  **WarGreymon** (Result 35) ✅.
* Caso límite: si el resultado buscado es la propia A o B (p. ej. WarGreymon + Golden Banana → Fire 36→35 =
  WarGreymon), la expansión elige al 50 % hasta dar con otra. Resultado: Phoenixmon 50 %, Paildramon 25 %… (ver CSV).

### 4.4 Tablas
**MIX 6×6** (`EVOSEG 0x801EFEDC`, fila = A, columna = B; simétrica). Misma especialidad → Option:

| A \ B | Fire | Ice | Nature | Darkness | Rare | Option |
|---|---|---|---|---|---|---|
| Fire | Option | Nature | Darkness | Rare | Ice | Fire |
| Ice | Nature | Option | Rare | Fire | Nature | Ice |
| Nature | Darkness | Rare | Option | Ice | Darkness | Nature |
| Darkness | Rare | Fire | Ice | Option | Fire | Darkness |
| Rare | Ice | Nature | Darkness | Fire | Option | Rare |
| Option | Fire | Ice | Nature | Darkness | Rare | Option |

**20 fusiones especiales** (`EVOSEG 0x801DF03C`, 4 B `{A, B, resultado, flag}`). El orden de A y B da igual. Todos
los resultados tienen Result 0, así que **solo se obtienen así**. El 4.º byte (0xEC..0xFD) se guarda en
`0x801F2C00`. 🟡 Parece un id de animación o mensaje.

| # | A | B | Resultado |
|---|---|---|---|
| 0 | Omnimon ⟨e1⟩ (1) | Paildramon (4) | Imperialdramon (0) |
| 1 | Paildramon (4) | Omnimon ⟨e2⟩ (35) | Imperialdramon (0) |
| 2 | WarGreymon (2) | MetalGarurumon (37) | Omnimon ⟨e1⟩ (1) |
| 3 | RealMetalGreymon (6) | WereGarurumon (39) | Omnimon ⟨e2⟩ (35) |
| 4 | Shakkoumon (142) | Zudomon (40) | Vikemon (34) |
| 5 | MegaSeadramon (42) | WaruSeadramon (43) | MetalSeadramon (36) |
| 6 | Sylphymon (76) | Garudamon (7) | Valkyrimon (69) |
| 7 | Angewomon (77) | MagnaAngemon (75) | Magnadramon (71) |
| 8 | MagnaAngemon (75) | Jijimon (143) | Seraphimon (70) |
| 9 | Veedramon (81) | Phoenixmon (3) | AeroVeedramon (72) |
| 10 | Megadramon (112) | HerculesKabuterimon (74) | GranKuwagamon (104) |
| 11 | Lillymon (78) | Myotismon (111) | Rosemon (73) |
| 12 | LadyDevimon (110) | Myotismon (111) | VenomMyotismon (106) |
| 13 | Infermon (109) | Digitamamon (144) | Diaboromon (105) |
| 14 | Monzaemon (147) | WaruMonzaemon (115) | Puppetmon (139) |
| 15 | Etemon (150) | Andromon (116) | MetalEtemon (141) |
| 16 | Vademon (145) | MarineAngemon (38) | SuperStarmon (140) |
| 17 | ExVeemon (12) | Stingmon (117) | Paildramon (4) |
| 18 | R-Gatomon (83) | Aquilamon (13) | Sylphymon (76) |
| 19 | Angemon (82) | Ankylomon (151) | Shakkoumon (142) |

**Alcance** ✅ (`scripts/fusion.py`): 155 de los 172 Digimon normales salen por fusión normal; 16 solo por
fusión especial; **Apokarimon (103)** nunca sale. Fake Sevens y las 12 joyas Digi-* salen solo por mutación. Las
7 *Sevens*, Rosemon's Lure y Download Digivolve no se obtienen por fusión.

**Valor buscado → resultado** (búsqueda base `BUSCAR(R, v)`; con expansión ±d si la celda está vacía):

| valor | Fire | Ice | Nature | Darkness | Rare | Option (candidatos) |
|---|---|---|---|---|---|---|
| 2 | – | – | – | – | – | 270 Defense Disk ◯, 271 Defense Disk △, 272 Defense Disk ✕ |
| 3 | – | – | – | – | – | 267 Attack Disk ◯, 268 Attack Disk △, 269 Attack Disk ✕ |
| 4 | 33 Goburimon | 68 SnowGoburimon | 102 Kunemon | 138 Sharmamon | 171 ModokiBetamon | 264 Attack Chip, 266 Recovery Floppy |
| 5 | 32 D-Otamamon | 67 SnowAgumon | 101 Gotsumon | 137 Aruraumon | 170 Psychemon | 263 Disrupt Ray, 300 Digi-devolve |
| 6 | 31 Candlemon | 66 Otamamon | 100 Elecmon | 136 Dokunemmon | 169 Vi-Elecmon | 258 Fire Spot, 259 Ice Crystal, 260 Earth Charm, 261 Black Gear, 262 Stuffed Animal |
| 7 | 30 Muchomon | 65 Gizamon | 99 Salamon | 135 Tsukaimon | 168 ClearAgumon | 252 Suka's Curse, 255 Digimon Grave, 256 Data Copy, 257 Partner Finder |
| 8 | 29 Biyomon | 64 Penguinmon | 98 Palmon | 134 Kokuwamon | 167 ToyAgumon | 246 Med. Rec. Floppy, 247 Digimon Analyzer, 248 Training Manual, 249 Circle Hitter, 250 Triangle Hitter, 251 Cross Hitter |
| 9 | 28 Solarmon | 63 Betamon | 97 Tentomon | 133 BKGatomon | 166 Hagurumon | 242 Deluxe Mushroom, 243 Lucky Mushroom, 244 Premium Steak, 245 Short Lance |
| 10 | 27 Agumon | 62 Gabumon | 96 MoriShellmon | 132 DemiDevimon | 165 L-ToyAgumon | 236 Coral Charm, 237 Patch of Love, 238 Mystery Egg, 239 Miracle Ruby, 240 Cyber Parts, 241 Liquid Crystal |
| 11 | 26 Flarerizamon | 61 Gomamon | 95 J-Mojyamon | 131 Zassomon | 164 SandYanmamon | 231 Level Balancer, 232 Level Manager, 233 Level Booster, 234 Armor Clash, 235 Silver Ball |
| 12 | 25 BomberNanimon | 60 Icemon | 94 Yanmamon | 130 Darkrizamon | 163 MudFrigimon | 225 Heap of Junk, 226 Beam Gun, 227 Chain Saw, 228 Metal Parts, 229 Metal Armor, 230 Mega Hand |
| 13 | 24 Akatorimon | 59 Hyogamon | 93 Kokatorimon | 129 Saberdramon | 162 ShimaUnimon | 222 Mega Def. Disk ◯, 223 Mega Def. Disk △, 224 Mega Def. Disk ✕ |
| 14 | 23 Piddomon | 58 IceDevimon | 92 Vegiemon | 128 Fugamon | 161 NiseDrimogemon | 221 Sup. Rec. Floppy, 265 High Speed Disk, 297 Warp Digivolve, 298 De-Armor Digivolve, 299 Speed Digivolve |
| 15 | 22 RedVegiemon | 57 Sorcerimon | 91 Drimogemon | 127 Soulmon | 160 Geremon | 216 Fire Altar, 217 Ice Altar, 218 Nature Altar, 219 Darkness Altar, 220 Rare Altar |
| 16 | 21 Tankmon | 56 Shellmon | 90 Kuwagamon | 126 Gururumon | 159 Rockmon | 215 Coliseum, 295 Special Digivolve, 296 Mutant Digivolve |
| 17 | 20 Birdramon | 55 Mojyamon | 89 Ninjamon | 125 Tekkamon | 158 Sukamon | 214 Evil Program |
| 18 | 19 Centarumon | 54 Coelamon | 88 Unimon | 124 Guardromon | 157 Numemon | 213 UnInstall |
| 19 | 18 Meramon | 53 Gekomon | 87 Airdramon | 123 Bakemon | 156 Nanimon | 212 Another Dimension |
| 20 | 17 Monochromon | 52 Frigimon | 86 Kabuterimon | 122 Ogremon | 155 ShellNumemon | 206 Red Digivice, 207 Blue Digivice, 208 Green Digivice, 209 Black Digivice, 210 Yellow Digivice, 211 Pink Digivice, 254 Hacking |
| 21 | 16 Tyrannomon | 51 Gesomon | 85 Leomon | 121 Tuskmon | 154 PlatinumSukamon | 205 Dark Bone, 294 ArmorCrush Digivolve |
| 22 | 15 Apemon | 50 Seadramon | 84 Togemon | 120 Devimon | 153 Thundermon | 204 Beetle Diamond |
| 23 | 14 Greymon | 49 Whamon | 83 R-Gatomon | 119 Devidramon | 152 Starmon | 203 Shogun's Order |
| 24 | 13 Aquilamon | 48 Dolphmon | 82 Angemon | 118 Wizardmon | 151 Ankylomon | 202 Missile Pod |
| 25 | 12 ExVeemon | 47 Ikkakumon | 81 Veedramon | 117 Stingmon | 150 Etemon | 201 Net Worm |
| 26 | 11 Meteormon | 46 Garurumon | 80 Piximon | 116 Andromon | 149 Mamemon | – |
| 27 | 10 Vermilimon | 45 BlueMeramon | 79 MegaKabuterimon | 115 WaruMonzaemon | 148 MetalMamemon | 199 Dark Lord's Cape |
| 28 | 9 MetalGreymon | 44 Brachiomon | 78 Lillymon | 114 Phantomon | 147 Monzaemon | 198 Mega Attack Chip |
| 29 | 8 MasterTyrannomon | 43 WaruSeadramon | 77 Angewomon | 113 SkullGreymon | 146 Giromon | 197 Mega Rec. Floppy |
| 30 | 7 Garudamon | 42 MegaSeadramon | 76 Sylphymon | 112 Megadramon | 145 Vademon | 195 Metallic Banana, 196 Shining Mane |
| 31 | 6 RealMetalGreymon | 41 Panjyamon | 75 MagnaAngemon | 111 Myotismon | 144 Digitamamon | – |
| 32 | 5 Gigadramon | 40 Zudomon | 74 HerculesKabuterimon | 110 LadyDevimon | 143 Jijimon | 194 Giga Hand, 253 Cherrymon's Mist |
| 33 | 4 Paildramon | 39 WereGarurumon | – | 109 Infermon | 142 Shakkoumon | 193 Whistle |
| 34 | 3 Phoenixmon | 38 MarineAngemon | – | 108 Machinedramon | – | 192 Devil's Chip |
| 35 | 2 WarGreymon | 37 MetalGarurumon | – | 107 Piedmon | – | 191 Golden Banana |

Nota de la tabla: ninguna especialidad Digimon tiene valores 2–3, así que la expansión sube al valor 4. Nature no pasa
de 32 y Rare no pasa de 33: por encima, la expansión baja a la carta más alta. Los 37 401 pares posibles, con probabilidades exactas del camino normal, están en
`PROG/fusion_pairs.csv`. Columnas: `A,B,cat,S,special,normal(id:prob),p_mut`; las mutaciones se calculan con §4.3.
Hay 32 217 pares deterministas.

### 4.5 Mutación ("Fusion Mutation") ✅
Probabilidad = (⌊S/10⌋+1) %: 1 % si S<10, 2 % si S está entre 10 y 19, 3 % entre 20 y 29, 4 % si S ≥ 30.
Reparto dentro de la mutación:
* 21 %: una de las 12 joyas (273–284) al azar, o Fake Sevens si ya tienes 6 de esa joya.
* 40 %: Fake Sevens (200).
* 39 %: el resultado normal desplazado +1, +2 o +3 en el valor.

Las mutaciones no comprueban el tope de 6 copias. El FAQ decía que las joyas son "Rare fusion mutations": es
correcto ✅.

### 4.6 Qué NO hace la fusión
No hay coste en bits ni dinero, ni restricción de "carta única". Las Digivolve Option 294–300 se pueden fusionar y
pueden salir como resultado, porque cuentan como "Option" en la categoría. La 293 no, porque su Composite es 0. ✅

### 4.7 Partner Fusion ✅ (`EVOSEG 0x801EB2A0`, `0x801EB670`, commit `0x801EB0F4`)
* Se elige un compañero y una carta B, con las mismas restricciones de §4.2. B **se consume** (`0x80045E1C`; stats +0x52 +1).
* Si (compañero, B) es una de sus 5 combinaciones (`EVOSEG 0x801EFF1C`, 6 × 5 × `{u8 carta, u8 pieza}`, en el orden
  EVOSEG) y **no tienes** esa pieza, recibes la **Digi-Part y no EXP**. Si no, recibes **EXP = Composite(B)**.
  La EXP se suma de 1 en 1 con las mismas subidas que en batalla (pieza por nivel y +10 cada 5).

| Compañero | carta → Digi-Part |
|---|---|
| Veemon | Imperialdramon→9 (All AP +200) · Paildramon→73 (Ice X3) · ExVeemon→120 (Draw Partner) · MasterTyrannomon→48 (◯+500) · WarGreymon→126 (Rare card) |
| Hawkmon | Valkyrimon→122 (If A: HP+200 & AP+100) · Sylphymon→77 (Darkness X3) · Aquilamon→62 (1st Attack) · Phoenixmon→53 (△+400) · Garudamon→124 (EXP +20 %) |
| Armadillomon | Vikemon→6 (HP+500) · Shakkoumon→118 (Void support) · Ankylomon→79 (Rare X3) · SuperStarmon→58 (✕+300) · Zudomon→117 (Offline→Online) |
| Patamon | Seraphimon→40 (+30 DP) · MagnaAngemon→95 (If U: AP+400) · Angemon→121 (If R: HP+200 & AP+100) · AeroVeedramon→50 (◯×3) · MetalGarurumon→71 (Fire X3) |
| Gatomon | Magnadramon→127 (Rare card+) · Angewomon→102 (Recover 400) · Rosemon→109 (Revive 1000) · Wizardmon→55 (△×3) · Lillymon→104 (Halve & +600) |
| Wormmon | GranKuwagamon→125 (EXP +30 %) · Diaboromon→75 (Nature X3) · Stingmon→63 (Eat-up) · Piedmon→60 (✕×3) · MegaKabuterimon→35 (1st Attack, ✕−200) |

* 🟡 Si el compañero ya está en el nivel 99, la carta se consume igual y solo aparece "RANK MAX!".

---

## 5. Intercambio (Trade, 2 memory cards) ✅ (OPENSEG)

* **Requisitos para entrar** (`OPENSEG 0x801EB2E8`):
  - Los ids de registro (+0x10) de las dos partidas deben ser distintos. Si son iguales: *"You can't trade the same Data!"*.
  - Cada partida debe tener el **bit 10 de +0x28** (Trade habilitado). Si no: *"Trade is disabled."* o
    *"Player 1/2's trade is disabled."*. ❓ Qué evento de la historia lo activa. El FAQ lo sitúa al final, tras hablar
    con alguien en la torre.
* **Cantidad intercambiable** por carta y jugador p (`OPENSEG 0x801E2068`):
  `tradable = copias − copias_en_mazos` (tabla `0x801F1880`, rellenada en `0x801E1E5C`; 🟡 máximo por mazo, como en la
  fusión). Después:
  - se limita a las copias cuyo **nº de serie no tenga ya el otro jugador** (`0x801E1840`);
  - se limita a `6 − copias_del_otro`, para que el receptor no pase de 6;
  - nunca baja de 0.
* **Al elegir una carta** (`OPENSEG 0x801E3214`):
  - si la colección no tiene el bit 0x40 → *"This Card is unidentified!"*;
  - si **Composite = 0** → *"You can't trade this Card!"* (Partners/Armors, Sevens, Rosemon's Lure, Download Digivolve);
  - si `tradable = 0` → *"You can't transfer any more Cards!"*;
  - si no, ocupa uno de los **3 huecos por jugador** (`0x801F1610`).
* *"You can't Trade between 0 Cards!"* solo sale si los dos lados están vacíos. **El regalo unilateral está
  permitido** (`0x801E2B34`). Para confirmar hay que mantener ✕ (*"press and hold ✕"*).
* **Transferencia**: `0x801E1C8C` quita la copia (y su serie) al que da, con +0x4E += 1. `0x801E1AA4` se la añade al
  que recibe **con el mismo nº de serie**, con +0x4C += 1. Así se impide "devolver" la misma copia.
* Archivos: `B.DRV TRADE.ARC` = 7 TIM de interfaz (tabla de offsets u32 + TIM). `FRIEND.ARC` = interfaz de 2P. ✅

---

## 6. Otros archivos y pantallas
* `B.DRV PARTNER.ARC` (SUBSEG) y `P_CARD.ARC` (OPENSEG/SAISEG): tabla de offsets u32 seguida de TIM. PARTNER.ARC
  tiene 22 imágenes: 2 de 40×48 a 4 bpp, 19 retratos de 40×40 a 8 bpp y 1 de 128×32. P_CARD.ARC tiene 19 retratos de
  40×40. ✅ formato / 🟡 que los 19 retratos sean las cartas 172–190.
* KAWSEG (pantalla de resultados) tiene sus propias copias de los nombres de piezas y de la tabla de niveles. EVOSEG
  tiene otra copia de esa tabla, con los mismos niveles ✅.
* `C.DRV EVENT/UNIT00-02.MSD`: diálogos de Andromon No.1–3 (§4.1). Las condiciones (datos compartidos, datos de
  predicción) son lógica del script. ❓

## 7. Corrección del formato de `DECK2.DEK` (afecta a doc 02) ✅
El código lee las cartas en `fichero + 8 + 110·i` (`0x8003FA20`, `0x801E8308`). Por tanto **el registro real empieza en
+8**, no en +6: `+0x00 30×u16 cartas · +0x3C nombre · +0x4F dueño · +0x62 u16 · +0x64 4×u8 IA · +0x68 4 B ·
+0x6C u8 EXP · +0x6D u8 huevo`. El "head u16" que el proyecto atribuye al registro i+1 son en realidad los bytes
+0x6C/+0x6D del registro i.
* **+0x6C = EXP que da el rival** (se lee como `*0x8006E054+0x74`; la estructura del rival tiene el registro en +8).
  Los valores van de 2 (Tutorial) a 25 (Apokarimon) y 30 (decks 140/141). Los mazos "Player" tienen 0.
* **+0x6D = huevo (1..3) del Partner de la CPU**. Ejemplos: Davis → Flamedramon, Magnamon (103) → 3 = Magnamon,
  Digimon Emperor (23) → Quetzalmon; los decks Player 145–157 tienen el huevo de su nombre (Flame, Raidra, Magna…).
  Lista completa: `scripts/deck_egg.py`.

---

## Dudas
1. ❓ Qué script/evento rellena la lista de "PARTNER GET" (SAISEG 0x801F5408) y en qué orden se ofrecen Gatomon,
   Patamon y Wormmon (y si también se ofrecen los iniciales no elegidos).
2. ❓ Qué eventos ponen a 1 las variables de huevo 295–312, aunque los diálogos de MetalGreymon, Kari, T.K. y el
   "Proof of Miracles" lo sugieren. Tampoco se sabe para qué son las variables 298/301/304/307/310 que quedan en medio
   (🟡 ¿flags de "tienes este Partner"?).
3. ❓ Qué eventos dan las piezas 45, 61, 85, 86, 92, 99 y 114 (y cuál es el disparador de la pantalla "GET DIGIPARTS
   LIST").
4. 🟡 Los valores numéricos exactos del límite de nivel de cada tienda (0/2/3) y dónde guarda el script los datos
   compartidos y las "predicciones".
5. ❓ Qué evento activa el bit 10 de +0x28 (Trade).
6. 🟡 Cuándo se activan los flags del jugador +0x110 (bits 11, 12-13, 14 y 29) de los bonus *3 Partners*,
   *3 Partners Plus*, *Partner Win* y *Partner Normal Digivolve*.
7. ❓ Si se puede quitar el Digi-Egg una vez equipado, y qué hacen las respuestas 0 y 2 del menú *"Do you want to
   Armor Digivolve?"*.
8. 🟡 El significado de los bits 0x10 y 0x80 de la colección. 0x10 se pone al llegar a 6 copias o si Result = 0;
   0x40/0x80 se ponen al obtener la carta.

## Datos extraíbles
| Tabla | Ubicación | Formato |
|---|---|---|
| Partners | SLUS 0x8006E518 | 6 × u8 id |
| Armor por huevo | SLUS 0x8006E520 | 6 × 3 × u8 id (0 = no hay) |
| Pieza inicial por partner | SLUS 0x8006EEFC | 6 × u8 id de Digi-Part |
| Digi-Parts | SLUS 0x8006E9B4 | 128 × 8 B `{tipo,b1,b2,b3,s16 valor,b6,b7}` |
| Plantillas de condición | SLUS 0x8006E534 | 18 × 32 B (formato condición CARD2) |
| Plantillas de acción | SLUS 0x8006E774 | 36 × 16 B (formato acción CARD2) |
| Texto de soporte de las piezas 41–122 | SLUS 0x8006EDB4 | 82 × ptr → cadena con `\n` |
| Nombre corto y nivel por partner | KAWSEG 0x801FBB38 (o EVOSEG 0x801EF8D4) | 128 × 12 B `{ptr nombre, s8 nivel[6], 2 B}` |
| Fórmula de EXP | SLUS 0x80049934 | `(L+1)*(L+3)` |
| Bonus de EXP | KAWSEG 0x801FC300 | 32 × 8 B `{u8 id, u8 EXP, 2 B, ptr nombre}` |
| Fusión: mezcla | EVOSEG 0x801EFEDC | 6 × 6 × s8 |
| Fusión: rangos | EVOSEG 0x801EFF00 | 7 × `{s16 ini, s16 fin}` |
| Fusión: especiales | EVOSEG 0x801DF03C | 20 × `{u8 A, u8 B, u8 res, u8 flag}` |
| Fusión: ids de partner (orden EVOSEG) | EVOSEG 0x801EFED4 | 6 × u8 |
| Partner Fusion → pieza | EVOSEG 0x801EFF1C | 6 × 5 × `{u8 carta, u8 pieza}` |
| Cartas extra al empezar | OPENSEG 0x801F04C4 | 3 × 5 × 2 × s16 |
| Flags de huevos (vars de script) | SAISEG 0x801DE2FC | 13 × s16 |
| EXP y huevo del rival | DECK2 registro +0x6C / +0x6D | u8 / u8 (registro en fichero+8+110·i) |
| Tabla de packs (premio y carta rara) | SLUS 0x8006E35C | 18 B por pack: 5 especialidades × 3 niveles (s8 máx/−mín) + Option máx/mín + ventana rara |
| Valores Composite/Result | CARD2 +0x18/+0x19 | ya en `cards.json` (`fusion`) |
| Resultados precalculados | `PROG/fusion_pairs.csv`, `PROG/digiparts.csv` | CSV |
