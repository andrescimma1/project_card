# 02 — Después de la batalla: recompensas, colección, rangos y datos guardados

Fuente: desensamblado de `SLUS_013.28` y de los overlays `KAWSEG`, `SAISEG`, `OPENSEG`, `ENDSEG`
(`P.DRV`, cargan en `0x801DDF38`) + datos de `B.DRV` (`DECK2.DEK`, `CARD2.CDD`).
Leyenda: ✅ leído en código/datos (con dirección) · 🟡 probable (se dice por qué) · ❓ desconocido.
Scripts y volcados de trabajo: `PROG\w02\` (`packs.py`, `deck2.py`, `parts.py`, `gen_tables.py`,
`savemap.py`, `asm\*.asm`).

Notación: `save` = `*0x8006E050` (bloque de guardado), `opp` = `*0x8006E054` (contexto rival),
`ctx` = `*0x801D8340` (contexto de batalla), `P0/P1` = `*0x801D8348` / `*0x801D834C` (jugador / CPU).

## Resumen

* ✅ **No hay "cartas del mazo rival"**: tras ganar se recibe **un Prize Pack de 3 cartas** cuyo tipo
  lo fija el mazo rival (`DECK2` byte `+0x6B`). Perder no da sobre.
* ✅ **EXP** (solo para los Partners cuya carta va en el mazo): `EXP del rival` (`DECK2 +0x6C`, solo si ganas)
  `+ Σ bonos` (32 bonos, tabla `KAWSEG 0x801FC300`), luego `× (1 + boost%)` del Partner.
  Curva: subir del rango `r` al `r+1` cuando la EXP **acumulada** ≥ `(r+1)(r+3)`; rango máx. 99 (EXP 9999).
* ✅ Cada subida de rango puede dar **un Digi-Part** (tabla de 128 con el rango de aprendizaje por Partner)
  y cada 5 rangos **+10 a HP, ◯, △ o ✕ (al azar)**.
* ✅ "Lucky Name" **nunca se otorga** (el evaluador salta esa entrada).
* ✅ Rangos exactos: Tamer por victorias COM (10/25/50/100/200/300/500), Collector por copias y categorías
  completas, 2P Battle por victorias 2P (10/20/30/40/60/80/100). **Legendary Collector = colección completa
  sin haber hecho nunca un TRADE**.
* ✅ "Game Completion" = Σ pesos de 120 flags de historia / **166**.
* ✅ Bloque de guardado: **2 × 10 100 bytes** (1P y 2P); cada archivo de memory card guarda 1 bloque
  + 2 bytes de checksum. Layout completo en §5 (se cubre el 100 % de los offsets).
* ⚠️ Corrección al doc `02-formato-rom.md`: los registros de `DECK2.DEK` empiezan en **file+8** (no +6).

---

## 0. Mapa de código

| Dirección | Qué hace | Conf. |
|---|---|---|
| SLUS `0x8003EC4C` | driver de batalla: arranca, y al terminar llama a las pantallas post-batalla y actualiza récords | ✅ |
| SLUS `0x800416D8` | batalla vs COM contra el mazo `DECK2[i]`: copia el registro a `opp+0x08`, al final `save+0x18/+0x1A` (V/D COM) | ✅ |
| SLUS `0x80041A1C` | resultado 2P: `+0x1C/+0x1E` de ambos bloques | ✅ |
| KAWSEG `0x801F4A24` | pantalla "Earned Experience Points" + reparto de EXP + rank-up + Digi-Parts | ✅ |
| KAWSEG `0x801F4174` / `0x801FAA54` | detalle de EXP: "Experience Points from Opponent" + **lista de bonos** | ✅ |
| KAWSEG `0x801FB444` | anuncio de bono **durante** la batalla (banner) | ✅ |
| KAWSEG `0x801FA290` | al final: `save+0x848[id] += 1` por cada bono obtenido | ✅ |
| KAWSEG `0x801F5E50` | pantalla "Earned a Prize Pack" | ✅ |
| SLUS `0x8004635C` | **generador de sobres** (3 cartas) | ✅ |
| SLUS `0x80046864` / `0x80045B18` | añadir las 3 cartas / **añadir carta a la colección** | ✅ |
| SLUS `0x8002CC44` | recalcula los 3 rangos (Tamer / Collector / 2P) en `save+0x28` | ✅ |
| SAISEG `0x801E16B0` | PLAYER'S DATA: títulos y porcentajes | ✅ |
| ENDSEG `0x801DF47C` / `0x801DE80C` | "Player's Complete Stats" + título "You're …!" | ✅ |
| SLUS `0x8002D404` / `0x8002D51C` | malloc del bloque (20 200 B) / **inicialización de partida nueva** | ✅ |
| OPENSEG `0x801EEB9C` + SLUS `0x8002C30C`, `0x8002CC04`, `0x8002CBA0` | guardar/cargar en memory card, checksum | ✅ |

---

## 1. Flujo después de la batalla (vs COM) — SLUS `0x8003F3C0..0x8003F990`

1. ✅ `ctx+0x81E` = ganador (0 = jugador). Se fija en el KO (`KAWSEG 0x801ECFC8`).
2. ✅ Si `ctx+0x81F == 0` (🟡 no es el tutorial: `0x801EA708` lo pone y bloquea todos los récords) y modo vs COM:
   * `0x80047364(0)`: restaura los 3 slots de Partner desde la copia de seguridad `opp+0x78` (🟡 motivo: la batalla los modifica).
   * Si alguna de las 30 cartas del mazo de batalla es un Partner o su forma Armor (`0x80047B84` / `0x80048150`)
     → **pantalla de EXP** (`KAWSEG 0x801F4A24`) — también al **perder**.
   * Si ganó el jugador → **Prize Pack** (`KAWSEG 0x801F5E50`).
3. ✅ Récords (`0x8003F770..0x8003F98C`, todos con tope 999):
   * mazo rival `m = 0x800471F4(opp+0x04)` (une duplicados, ver tabla §6): `save+0xAC0[m] |= 0x8000` (mazo "conocido"),
     victoria → `save+0x888[m]++`, derrota → `save+0x9A4[m]++`.
   * mazo propio usado (`save+0x34`): `deck+0x10A` (victorias) o `deck+0x10C` (derrotas).
   * `save+0x18` (victorias COM) o `save+0x1A` (derrotas COM) en `0x800418FC..0x80041954`, luego `0x8002CC44` (rangos).

---

## 2. Experiencia, bonos y rangos del Partner

### 2.1 EXP base del rival — ✅
`KAWSEG 0x801F41C0`: si ganaste, `EXP_rival = opp+0x74` = **byte `+0x6C` del registro DECK2**; si perdiste, 0.
Valores por mazo en §6 (2…30; Apokarimon y "Darkness Wave"/"Pick Up" dan 25–30).

### 2.2 Lista de bonos — tabla `KAWSEG 0x801FC300` (32 × 8 B: `u8 id, u8 EXP, u16 0, char* nombre`) ✅
El evaluador `0x801FAA54` recorre la tabla **en orden**; cada bono concedido suma su valor al total de EXP
(`0x8020CA2C`, que empieza en `EXP_rival`) y marca `ctx+0x840+id = 1` (`0x801FA918`).
Si `ctx+0x81E != 0` (derrota) salta directo a las entradas 21–23 y luego a las comunes 24–31.
Los flags son bits de `P0+0x110` que la batalla va poniendo. La **prueba** es ✅; el **significado** del bit
es ✅ cuando se leyó el código que lo pone, 🟡 si se infiere del nombre.

| id | Bono | EXP | Condición (evaluador `0x801FAA54`) | Quién pone el bit / significado |
|---|---|---|---|---|
| 0 | All ◯ Attack Win | 3 | ganar sin bits 1 ni 2 | bits 0/1/2 = atacó con ◯/△/✕ (switch del ataque, `KAWSEG 0x801E7D48..0x801E7D90`) ✅ |
| 1 | All △ Attack Win | 3 | sin bits 0 ni 2 | ídem ✅ |
| 2 | All ✕ Attack Win | 3 | sin bits 0 ni 1 | ídem ✅ |
| 3 | All or Nothing Gamble Win | 5 | ganar con bit 16 = 0 | bit 16 se pone al resolver un soporte que **no** es Gamble o sin soporte (`0x801E6CF8`, `0x801E6F70`) ✅ → todas las fases de soporte fueron Gamble 🟡 |
| 4 | Last Chance Gamble Win | 2 | bono 3 **no** concedido y bit 17 | bit 17: la ronda final se ganó con `+0x178` bit 31 (Gamble) (`SLUS 0x80038C54..C70`) ✅/🟡 |
| 5 | No Support Card Win | 5 | bit 4 = 0 | bit 4 = jugó una carta de soporte (incl. Gamble) (`0x801E6D18`) ✅ |
| 6 | No Digivolve Win | 3 | bit 3 = 0 | bit 3 en estados de digivolución/armor (`SLUS 0x8003538C`, `0x80036A80`, `0x80036E08`) 🟡 |
| 7 | No Discard Win | 1 | bit 5 = 0 | bit 5 en el estado 5 ("Change all Cards") `SLUS 0x80034A0C` 🟡 |
| 8 | 4-of-a-Kind Win | 5 | bit 6 | 4 cartas iguales en la mano (`0x801FA780`) ✅ |
| 9 | 0 Online Card Left win | 2 | Online propio > 0 **y** Online rival = 0 | `0x80040220` = cartas en Online Deck ✅ |
| 10 | Partner Win | 1 | bit 14 | una ronda ganada por un Partner o su Armor (`SLUS 0x80038B30..0x80038C14`) ✅ |
| 11 | No Loss Win | 3 | rondas del rival = 0 (3-0) | ✅ |
| 12 | Come-Back Win | 3 | bit 7 | estuvo 0-2 abajo (`SLUS 0x80038A64..0x80038A9C`) ✅ |
| 13 | Desperate Win | 7 | 3-2 **y** ambos sin cartas en Online Deck **ni en mano** | `0x80040468` = huecos vacíos de la mano ✅ |
| 14 | All Gone Win | 2 | bono 13 no concedido **y** Online propio = 0 y mano vacía | ✅ |
| 15 | Ultimate Level Win | 3 | bits 19-20 ≠ 0 | KO hecho por una carta de nivel U (`0x801ECF98` → `0x801FB5D0`) ✅ |
| 16 | Option Maniac Win | 5 | ≥ 25 Option+Digivolve entre las 30 cartas del mazo de `P0` (`0x80046C0C(0,P0,0xC0)`) | 🟡 (máscaras 0x40 Option / 0x80 Digivolve leídas) |
| 17 | 8 DP Cards Win | 8 | DP Slot lleno (0 huecos, `0x80041214`) | ✅ |
| 18 | Lucky Seven Win | 1 | exactamente 7 cartas en el Online Deck propio | ✅ |
| 19 | Just Enough Attack Win | 3 | bit 22 | el golpe que da la 3ª ronda deja al rival en **0 HP exacto** (`0x801E79CC..0x801E79F4`) ✅ |
| 20 | 12 S-Jewel Cards Win | 10 | bit 28 | el mazo trae las 12 joyas ids 273–284 (Digi-Garnet…Digi-Turquoise) (`0x801FA198..0x801FA25C`) ✅ |
| 21 | Choked Loss | 2 | (derrota) bit 8 | estuvo 2-0 arriba (`SLUS 0x80038AB8`) ✅ |
| 22 | Loss by Gamble | 2 | (derrota) bit 18 | la ronda final la ganó el rival con Gamble ✅/🟡 |
| 23 | Total Loss | 1 | (derrota) 0-3 | ✅ |
| 24 | Rainbow | 2 | bit 15 | tus Digimon tuvieron las 5 especialidades en la batalla (bits 23–27) (`0x801FA30C`) ✅ |
| 25 | Damage Fever | 10 | bit 9 | daño infligido múltiplo de **1110** (1110, 2220…9990) (`0x801E7C74..CEC`) ✅ |
| 26 | HP Fever | 7 | bit 10 | HP propio ≠ 0 y múltiplo de **1110** (`0x801FA51C`, `0x801E794C`) ✅ |
| 27 | 3 Partners | 2 | bit 11 | 3 cartas Partner en la mano a la vez (`0x801FA8BC`) ✅ |
| 28 | 3 Partners Plus | 2 | bits 12-13 = 3 | contador +1 cada vez que un Partner/Armor entra o cambia en el Battle Slot (`0x801FA668..6A0`) ✅/🟡 |
| 29 | Partner Normal Digivolve | 2 | bit 29 | la carta en la posición 2 de la pila es un Partner y bit 30 = 0 (`0x801FA6B4..75C`) ✅ código, 🟡 significado ("Partner R→C→U normal") |
| 30 | Lucky Name | 1 | **nunca** — tras el 29 el puntero salta +16 (`0x801FB34C`) | ✅ entrada muerta |
| 31 | Super Bonus | 10 | ya se concedieron ≥ 7 bonos en esta lista | ✅ |

Notas ✅: la lista y la EXP solo se calculan en la pantalla de EXP, que solo existe vs COM (§1). Los banners
durante la batalla (`0x801FB444`) exigen jugador 0 y `P1+0x178` bits 17-18 = 1 (CPU) (`0x801FB470..0x801FB498`)
y salen solo la 1ª vez.
Contadores permanentes: `save+0x848[id]` (u16, tope 999, `0x801FA290`) = "Number of Bonuses" en ENDSEG.

### 2.3 Reparto de EXP — `KAWSEG 0x801F4A24` ✅
```
T = EXP_rival + Σ EXP de los bonos concedidos            (0x8020CA2C)
para cada slot de Partner i (0..2) cuya carta (o su Armor) está en el mazo de batalla y rango < 99:
    ganancia_i = T + floor(T * slot_i.boost / 100)          (0x801F4EAC..0x801F4F54; boost = +0x293)
la EXP se suma de a 1 (+0x28A); si EXP >= (r+1)*(r+3) -> r += 1  (0x801F5010; f = SLUS 0x80049934)
en cada subida de rango:
    Digi-Part = primera entrada k de la tabla KAWSEG 0x801FBB38 con lv[partner] == nuevo rango;
                si ya se posee, nada (0x80049840); si no, se marca en save+0x3C (0x8004950C)
    si nuevo rango % 5 == 0: k = rand() % 4 -> +10 a HP/◯/△/✕ del Partner (0x8004994C; +0x280..+0x286)
```
* ✅ La EXP es **acumulada** (no se resetea): umbrales 8, 15, 24, 35, 48 … (r=10: 143, r=50: 2703, r=98: 9999).
* ✅ Partner nuevo: rango 1, EXP 0, sin partes (`SLUS 0x80047620`). Tope rango 99 / EXP 9999 (`0x80047438`).
* ✅ Los Digi-Parts poseídos son **del jugador** (128 bits), no de cada Partner: si otro Partner ya lo aprendió, no se repite.
* ✅ Las mejoras +10 se suman a la copia de la carta del Partner **y** a la de su forma Armor (`0x800485B4..0x80048674`).

### 2.4 Digi-Parts (son las "habilidades" de los Partners) — tabla `KAWSEG 0x801FBB38`, 128 × 12 B ✅
`+0 char* texto`, `+4 u8 rango[6]` (orden de la tabla `SLUS 0x8006E518`: **Veemon, Hawkmon, Armadillomon,
Gatomon, Patamon, Wormmon**; 255 = nunca), `+10 u16 0`. Efecto: `SLUS 0x8006E9B4`, 128 × 8 B
(`+0 tipo 0..8`, `+1 subtipo`, `+4 valor`), aplicado por `0x80048230`. Tipos verificados ✅: 0 = HP +valor,
8/sub 0 = **EXP +valor %** (`+0x293`), 8/sub 1 = **carta rara +valor %** (`+0x294`). Resto 🟡 (coincide con el texto).
Equipables: 3 por Partner (`+0x28C`), cada parte en un solo Partner (`0x800496E4` devuelve 2 si ya está equipada).
Tabla completa en el Anexo A.

---

## 3. Cartas ganadas: Prize Pack

### 3.1 Qué sobre se recibe ✅
* Tras **ganar** vs COM: tipo = `opp+0x73` = **byte `+0x6B` del registro DECK2** (`KAWSEG 0x801F5C64`, `0x801F5D80`).
  En los 142 mazos COM solo aparecen 0 Basic (36), 1 Hyper (49), 2 Super (49), 3 Great (24) y 7 Black (1: VenomMyotismon).
* Por **evento**: comando de script `CMD11.9(n)` (`SAISEG 0x801E4138` guarda `n` en `0x801F46A5`; la pantalla
  `SAISEG 0x801F1C84` llama al mismo generador). Los scripts usan los tipos 4–15 (color y S-packs).
  `SAISEG 0x801F1B5C` es la variante "3 cartas fijas" (lee `save+0x2768`).

### 3.2 Generador `SLUS 0x8004635C(jugador, tipo)` ✅
```
para cada carta id 0..300 (registro de CARD2.CDD):
    v = registro +0x19   (= fusion.result de cards.json; verificado en las 301 cartas)
    si v == 0: nunca sale en sobres
    Digimon: idx = 2 si nivel R, 1 si C, 0 si U o A;  x = tabla[esp*3 + idx]
             si x < 0: rango [ -x , 99 ]  si no: rango [ 0 , x ]
    Option o Digivolve Option: rango [ tabla[16] , tabla[15] ]
    v en rango                      -> pool NORMAL
    x != 0 y max < v <= max+tabla[17] (y v >= min) -> pool RARO
rare% = Σ (+0x294) de los slots con Partner          (Digi-Parts 126 = +10, 127 = +20)
carta 1 = (rand()%100 < rare%) ? RARO[rand()%nR] : NORMAL[rand()%nN]
cartas 2 y 3 = NORMAL[rand()%nN]                      -> save+0x2768/+0x276A/+0x276C
```
* ✅ **Sin las partes "Rare Card…" el pool raro es inalcanzable.** Máximo 30 % (las dos partes, cada una
  en un solo Partner).
* ✅ Las cartas con `+0x19 = 0` nunca salen en sobres: ids 0, 1, 34–36, 69–73, 103–106, 139–141, 172–190,
  200, 273–293 (incluye las 12 S-Jewels, los Partners y los Armor) → vienen de eventos, trade o fusión.

### 3.3 Tabla de sobres — `SLUS 0x8006E35C`, 16 × 18 B (nombres: punteros `0x8006E31C`) ✅
`R/C/UA` = byte para nivel R, C y U-o-A de cada especialidad (negativo = mínimo). `opt` = max/min de Option y
Digivolve, `+raro` = margen del pool raro. `N`/`R` = tamaño de los pools resultantes (simulado con `packs.py`).

| # | Sobre | Fire R/C/UA | Ice | Nature | Dark | Rare | opt max/min · +raro | N | R | Pool raro |
|---|---|---|---|---|---|---|---|---|---|---|
| 0 | Basic Pack | 99/13/0 | 99/14/0 | 99/12/0 | 99/13/0 | 99/13/0 | 0/0 · 1 | 50 | 5 | 23 Piddomon, 57 Sorcerimon, 93 Kokatorimon, 128 Fugamon, 161 NiseDrimogemon |
| 1 | Hyper Pack | 99/22/26 | 99/23/27 | 99/21/26 | 99/22/26 | 99/22/25 | 0/0 · 1 | 100 | 10 | 10 Vermilimon, 14 Greymon, 44 Brachiomon, 48 Dolphmon, 79 MegaKabuterimon, 84 Togemon, 115 WaruMonzaemon, 119 Devidramon, 149 Mamemon, 152 Starmon |
| 2 | Super Pack | 0/99/30 | 0/99/31 | 0/99/30 | 0/99/30 | 0/99/29 | 10/0 · 1 | 135 | 10 | 6 RealMetalGreymon, 40 Zudomon, 75 MagnaAngemon, 111 Myotismon, 145 Vademon, 231 Level Balancer, 232 Level Manager, 233 Level Booster, 234 Armor Clash, 235 Silver Ball |
| 3 | Great Pack | 0/-18/34 | 0/-20/34 | 0/-19/31 | 0/-19/34 | 0/-18/32 | 99/10 · 5 | 135 | 5 | 2 WarGreymon, 37 MetalGarurumon, 74 HerculesKabuterimon, 107 Piedmon, 142 Shakkoumon |
| 4 | Red Pack | 99/99/25 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0 · 3 | 22 | 3 | 9 MetalGreymon, 10 Vermilimon, 11 Meteormon |
| 5 | Blue Pack | 0/0/0 | 99/99/26 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0 · 3 | 23 | 3 | 43 WaruSeadramon, 44 Brachiomon, 45 BlueMeramon |
| 6 | Green Pack | 0/0/0 | 0/0/0 | 99/99/25 | 0/0/0 | 0/0/0 | 0/0 · 3 | 22 | 3 | 78 Lillymon, 79 MegaKabuterimon, 80 Piximon |
| 7 | Black Pack | 0/0/0 | 0/0/0 | 0/0/0 | 99/99/25 | 0/0/0 | 0/0 · 3 | 22 | 3 | 114 Phantomon, 115 WaruMonzaemon, 116 Andromon |
| 8 | Yellow Pack | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 99/99/24 | 0/0 · 3 | 21 | 3 | 148 MetalMamemon, 149 Mamemon, 150 Etemon |
| 9 | Option Pack | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 15/0 · 1 | 59 | 3 | 215 Coliseum, 295 Special Digivolve, 296 Mutant Digivolve |
| 10 | S-Red Pack | 0/99/32 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0 · 3 | 22 | 3 | 2 WarGreymon, 3 Phoenixmon, 4 Paildramon |
| 11 | S-Blue Pack | 0/0/0 | 0/99/32 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0 · 3 | 21 | 3 | 37 MetalGarurumon, 38 MarineAngemon, 39 WereGarurumon |
| 12 | S-Green Pack | 0/0/0 | 0/0/0 | 0/99/29 | 0/0/0 | 0/0/0 | 0/0 · 3 | 20 | 3 | 74 HerculesKabuterimon, 75 MagnaAngemon, 76 Sylphymon |
| 13 | S-Black Pack | 0/0/0 | 0/0/0 | 0/0/0 | 0/99/32 | 0/0/0 | 0/0 · 3 | 22 | 3 | 107 Piedmon, 108 Machinedramon, 109 Infermon |
| 14 | S-Yellow Pack | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 0/99/30 | 0/0 · 3 | 20 | 3 | 142 Shakkoumon, 143 Jijimon, 144 Digitamamon |
| 15 | S-Option Pack | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 29/10 · 6 | 52 | 7 | 191 Golden Banana, 192 Devil's Chip, 193 Whistle, 194 Giga Hand, 195 Metallic Banana, 196 Shining Mane, 253 Cherrymon's Mist |

Pools normales completos (ids): Anexo B.

### 3.4 Añadir a la colección — `SLUS 0x80045B18(jugador, id, n)` ✅
* ids **172–190** (Armor + Partners) → `-3`, no se pueden recibir como carta.
* Byte `save+0x14B2+id`: **bits 0-2 = copias (máximo 6)**, bit 4 = completo (6 copias o `+0x19 = 0`),
  bit 5 = "nueva" (primera vez), bit 6 = obtenida alguna vez, bit 7 = 🟡 "recién recibida" (se limpia en `0x80045A58`).
* Ya tenía 6 → no se agrega, devuelve `-2` → la pantalla muestra **"FULL SET!"** (`KAWSEG 0x801F5B94`,
  resultado en `save+0x276E[i]`, negativo = FULL SET, si no "RECEIVED!").
* Cada copia recibe un número de serie u16 aleatorio distinto (`0x80045968` → `save+0x15E0[id][copia]`) — uso ❓ (🟡 trade).
* Otras entradas de cartas ✅: TRADE (`OPENSEG 0x801E826C`), fusión (`EVOSEG 0x801EBA08`: quita 2 con `0x80045E1C`, agrega 1), sobres de evento.

---

## 4. Títulos, rangos y porcentajes

### 4.1 Los 3 rangos — `SLUS 0x8002CC44(jugador)` → `save+0x28` ✅
Se recalculan tras cada batalla y al recibir cartas; **nunca bajan** (el `switch` arranca en el rango actual).

| Rango (bits de +0x28) | Dato | Umbrales → título (tabla de punteros) |
|---|---|---|
| **Tamer** (0-2) | `+0x18` victorias COM | <10 Beginner · 10 Regular · 25 Mid Level · 50 High Level · 100 Expert · 200 Master · 300 Genius · 500 Invincible Tamer (`0x8006E058`) |
| **Collector** (3-5) | copias y categorías | 0 General Public · ≥100 copias Hobby · ≥200 copias Serious · ≥1 categoría completa Top Level · ≥3 Famous · ≥5 Great · 6 = todas Perfect · **Legendary** si además `+0x28` bit 11 = 0 (`0x8006E078`) |
| **2P Battle** (6-8) | `+0x1C` victorias 2P | <10 Battle Beginner · 10 Expert · 20 Specialist · 30 Champion · 40 Master · 60 Lord · 80 King · 100 Emperor (`0x8006E098`) |

* ✅ "copias" = Σ (bits 0-2) de ids 0–171 y 191–300 (no cuenta 172–190).
* ✅ "categorías completas": Digimon 0–171 por especialidad Fire/Ice/Nature/Dark/Rare y Options 191–300; se
  compara con `SLUS 0x8006E0B8` = **[34, 35, 34, 36, 33, 110]**.
* ✅ `+0x28` bit 11 lo pone el **TRADE** confirmado en los dos bloques (`OPENSEG 0x801E48CC..0x801E48E8`) →
  **Legendary Collector = colección completa sin haber hecho nunca un trade** (el texto de SAISEG dice
  "7 Titles … plus one more").
* ✅ En SAISEG/ENDSEG la etiqueta "Battle Title" muestra el **título Tamer**; "2P Battle Title" el de `Battle *`.

### 4.2 Título especial "You're "%s"!" — `ENDSEG 0x801DE80C` (36 punteros en `ENDSEG 0x801E0BB4`) ✅
```
A[e] = Σ save+0x11B6[id] (rondas ganadas) de los Digimon 0..190 de especialidad e      (e = Fire..Rare)
ordenar especialidades por A desc: o0..o4;  ordenar ◯△✕ por save+0x36[k] desc: t0,t1
si A[o4] >= 0.9·A[o0] -> 0   ; si A[o4] >= 0.8·A[o0] -> 1
si A[o3] >= 0.9·A[o0] -> 2   ; si A[o3] >= 0.8·A[o0] -> 3
si A[o2] >= 0.95·A[o0] -> 4  ; si A[o2] >= 0.9·A[o0] -> 5
si A[o1] >= 0.9·A[o0] -> título de pareja (o0,o1)  (6..15)
si no: si uso[t1] > 0.9·uso[t0] -> 16+o0 ; si no 21+o0 (◯) / 26+o0 (△) / 31+o0 (✕)
```
(Con 0 rondas ganadas todo vale 0 ≥ 0 → "Emperor Cassiopeia".)

| # | Título | # | Título | # | Título |
|---|---|---|---|---|---|
| 0 | Emperor Cassiopeia (5 equilibradas) | 12 | Paradise Machine (Fire+Rare) | 24 | Black Assasin (Dark ◯) |
| 1 | King of 5 Worlds | 13 | Cheerful Pirate (Ice+Rare) | 25 | Golden Invincible (Rare ◯) |
| 2 | Guardian of 4 Stars | 14 | Survivor (Nature+Rare) | 26 | Red Knight (Fire △) |
| 3 | Illusive Sky Master | 15 | Dark Clown (Dark+Rare) | 27 | Blue Ice Lord (Ice △) |
| 4 | Tricolor Master | 16 | 3-headed Dragon (Fire, ataques parejos) | 28 | Emerald Meteor (Nature △) |
| 5 | Sorcerer of Swords | 17 | King of the Sea (Ice) | 29 | Black Lightning (Dark △) |
| 6 | Fire Ocean Master (Fire+Ice) | 18 | Clover Prince (Nature) | 30 | Pyramid Mirage (Rare △) |
| 7 | Lonely Red Wolf (Fire+Nature) | 19 | Dark Orion (Dark) | 31 | Scarlet Magician (Fire ✕) |
| 8 | Time Traveler (Ice+Nature) | 20 | Mysterious Alien (Rare) | 32 | Blue Guardian (Ice ✕) |
| 9 | Freed Fire Demon (Fire+Dark) | 21 | Bomber King (Fire ◯) | 33 | Prophet of the Wild (Nature ✕) |
| 10 | Mystic Magician (Ice+Dark) | 22 | Legendary Tsunami (Ice ◯) | 34 | Shadowy Doom (Dark ✕) |
| 11 | Wild Black Lion (Nature+Dark) | 23 | Wild Hunter (Nature ◯) | 35 | Jamming King (Rare ✕) |

✅ ENDSEG lo carga `SLUS 0x8004A2DC` (por puntero, sin `jal`): es la pantalla "Player's Complete Stats"
(también tras el final 🟡); al salir pone `save+0x28 |= 0x1000` (`ENDSEG 0x801E0B30`).

### 4.3 Porcentajes de PLAYER'S DATA — `SAISEG 0x801E16B0` ✅ (mostrados como `%3d.%1d%%`, en ‰)
* **Game Completion** = `save+0x14 × 1000 / 166`.
  `save+0x14` lo recalcula el script: `CMD10.19` → 0 (`SAISEG 0x801E3ED4`) y `CMD11.18(w)` → `+= w`
  (`SAISEG 0x801E42CC`), una vez por cada flag de historia activo. Bloque al inicio de `CITY00.MSD` (volcado `w01`; la misma secuencia está en los 12 `CITYxx`):
  **120 flags, Σ pesos = 166** ✅ (coincide con el divisor del código).
  Pesos ✅ (vN = variable de script N del volcado `w01`; 🟡 si esa numeración es el índice del arreglo de variables, vN es el bit N−12 de `save+0x23FC`): peso>1: v12=3, v32=4, v56=5, v87=5, v119=5, v120=2, v138=5, v160=5, v168=4, v186=4, v204=4, v205=4, v224=5, v245=5; todos los demás pesan 1: v13 v14 v15 v23 v26 v30 v31 v33 v34 v35 v36 v48 v50 v55 v57 v58 v59 v60 v61 v62 v79 v80 v82 v89 v90 v91 v92 v93 v106 v108 v112 v117 v121 v131 v133 v139 v140 v154 v156 v169 v170 v171 v177 v187 v188 v189 v195 v213 v215 v219 v225 v226 v246 v247 v248 v265 v266 v267 v282 v283 v284 v285 v286 v287 v288 v289 v290 v291 v292 v293 v313 v314 v315 v316 v317 v318 v319 v320 v323 v324 v325 v326 v327 v328 v329 v330 v331 v332 v333 v334 v335 v336 v337 v338 v339 v340 v341 v342 v343 v344 v345 v346 v347 v349 v360 v361.
* **Card Collection** = (nº de ids con bit 6) × 1000 / 301.
* **Digi-Parts** = (partes poseídas) × 1000 / 128.

---

## 5. Datos guardados

### 5.1 El bloque en RAM ✅
* `SLUS 0x8002D404`: `save = malloc(20200)`, `opp = malloc(4140)`, `opp+0x100C = malloc(428)`.
* `20200 = 2 × 10100`: **bloque 1P en `save+0`, bloque 2P en `save+0x2774`** (el de "Battle with Friend").
  `0x8002D51C` inicializa los dos en un bucle con paso 10100 y después copia `"Player"` (`0x800107F0`) al nombre del 1P.
  Todo el código indexa con `save + jugador*10100` (p. ej. `0x80045B58`); KAWSEG/OPENSEG leen el 2P en `+0x2774+off`.
* El layout de abajo cubre los 10 100 bytes sin huecos (cada región sigue exactamente a la anterior).

### 5.2 Layout del bloque de jugador (10 100 B)
| Offset | Tipo | Campo | Conf. / evidencia |
|---|---|---|---|
| 0x0000 | char[≤13] | nombre del jugador | ✅ init `"Player"`; la batalla lo copia a `P+0x1CE` (`0x8003FDBC`). Largo exacto ❓ |
| 0x000D | u8 | nº de guardados ("Number of Saves") | ✅ ENDSEG `0x801E0830`, OPENSEG `0x801EEB9C` |
| 0x000E | u8 | ❓ (SAISEG `0x801E1254`, `0x801F00F4`; OPENSEG `0x801EBF20`) | ❓ |
| 0x000F | u8 | ❓ (SAISEG `0x801E390C`, OPENSEG `0x801EBF20`, SLUS `0x8002EB1C`) | ❓ |
| 0x0010 | u16 | `rand()` al crear la partida | ✅ `0x8002D59C`; uso 🟡 (TRADE `OPENSEG 0x801EA874`) |
| 0x0012 | u16 | nº de cartas distintas obtenidas alguna vez (bit 6) | ✅ `0x80046908` |
| 0x0014 | u16 | progreso de historia (0..166) | ✅ §4.3 |
| 0x0016 | u16 | = 10100 (largo del bloque; usado para el checksum al cargar) | ✅ `0x8002D5EC`, `OPENSEG 0x801EF36C` |
| 0x0018 / 0x001A | u16 | victorias / derrotas COM (tope 999) | ✅ `0x800418FC` |
| 0x001C / 0x001E | u16 | victorias / derrotas 2P (tope 999) | ✅ `0x80041B28` |
| 0x0020 | u32 | flags (bits 0-3 limpiados al iniciar; KAWSEG `0x801F7B2C`, OPENSEG `0x801E6454`) | ❓ |
| 0x0024 | u32 | ❓ | ❓ |
| 0x0028 | u32 | b0-2 Tamer · b3-5 Collector · b6-8 2P Battle · b10 (script `CMD10.18`) · **b11 hizo TRADE** · b12 vio Complete Stats (ENDSEG) · b9/b13 se limpian al iniciar | ✅ |
| 0x002C | u32 | b0/b1 = vars de script 266/267 (`SAISEG 0x801E09F4`) | ✅ (sentido ❓) |
| 0x0030 | u32 | escrito por script (`SAISEG 0x801E40B0`) | ❓ |
| 0x0034 | s8 | mazo seleccionado (0..2, −1) | ✅ `0x8003F884` |
| 0x0036 | u16[3] | veces que usaste ◯ / △ / ✕ ("Player's Attack Rate") | ✅ ENDSEG `0x801E0468` |
| 0x003C | u8[16] | **Digi-Parts poseídos** (128 bits, bit k%8 del byte k/8) | ✅ `0x8004950C` / `0x800496E4` |
| 0x004C / 0x004E | u16 | cartas recibidas / entregadas por TRADE | ✅ ENDSEG `0x801E027C` / `0x801E020C` |
| 0x0050 / 0x0052 / 0x0054 | u16 | fusión: Fused Cards / Used Cards / Fusion Mutations | ✅ ENDSEG `0x801E0394/0324/0404` |
| 0x0056 | u16 | ❓ (se pasa a `0x8002F920` al iniciar la batalla; 🟡 BGM) | ❓ |
| 0x0058 | u8[40] | ❓ (EVOSEG `0x801EC434`) | ❓ |
| 0x0080 | 3 × 0x298 | **slots de Partner** (§5.3) | ✅ |
| 0x0848 | u16[32] | veces obtenido cada bono | ✅ |
| 0x0888 / 0x09A4 | u16[142] | victorias / derrotas contra cada mazo COM (índice unido, §6) | ✅ |
| 0x0AC0 | u16[159] | mazos de evento: b0-13 victorias, b15 = mazo conocido | ✅ |
| 0x0BFE | u16[159] | derrotas con mazo de evento | ✅ |
| 0x0D3C | u16[191][3] | poder ◯△✕ máximo logrado con cada Digimon ("Max ◯ Attack Power") | ✅ ENDSEG `0x801DFC44`, KAWSEG `0x801EA5F4` |
| 0x11B6 / 0x1334 | u16[191] | rondas ganadas / perdidas por cada carta Digimon | ✅ KO `0x801ED0A0..0x801ED1AC` |
| 0x14B2 | u8[301] | **colección** (§3.4) | ✅ |
| 0x15DF | u8 | relleno | 🟡 |
| 0x15E0 | u16[301][6] | número de serie de cada copia | ✅ (uso ❓) |
| 0x23FC | u32[12] | **flags de historia**: vars de script 12..362 (bit LSB primero) | ✅ `SAISEG 0x801E0A74` (guardar) / `0x801E0B70` (cargar) |
| 0x242C | u8[9] | vars de script 363..371 | ✅ ídem |
| 0x2435 | u8[3] | relleno | 🟡 |
| 0x2438 | 3 × 0x110 | **mazos** (§5.4) | ✅ |
| 0x2768 | u16[3] | las 3 cartas del último sobre | ✅ `0x800467B4..0x8004681C` |
| 0x276E | s8[3] | resultado de agregarlas (copias, o <0 = FULL SET) | ✅ `0x800468D8` |
| 0x2771 | u8[3] | relleno hasta 0x2774 | 🟡 |

### 5.3 Slot de Partner (0x298 = 664 B, base `0x80 + 0x298·i`)
| Off | Tipo | Campo | Conf. |
|---|---|---|---|
| +0x000 | 316 B | copia del registro CARD2 del Partner **con mejoras aplicadas** | ✅ `0x80048230` |
| +0x13C | 316 B | copia del registro de su forma **Armor** (Digi-Egg elegido) | ✅ |
| +0x278 / +0x27C | u32 | punteros (runtime) a los registros originales | ✅ `0x80047558`, `0x800475D8` |
| +0x280 / +0x282 / +0x284 / +0x286 | u16 | mejoras HP / ◯ / △ / ✕ (+10 cada 5 rangos) | ✅ |
| +0x288 | u8 | id de la carta Partner (0 = vacío; 175/182/190/184/183/187) | ✅ |
| +0x289 | s8 | rango (1..99) | ✅ |
| +0x28A | u16 | EXP acumulada (≤ 9999) | ✅ |
| +0x28C | s8[3] | Digi-Parts equipados (−1 = vacío) | ✅ |
| +0x28F | u8[3] | 🟡 Digi-Eggs poseídos (tema de otro informe) | 🟡 |
| +0x292 | u8 | id de la carta Armor elegida (0 = ninguna) | ✅ `0x80047560` |
| +0x293 | u8 | % extra de EXP (Σ partes tipo 8/0) | ✅ |
| +0x294 | u8 | % de carta rara (Σ partes tipo 8/1) | ✅ |
| +0x295 | u8[3] | relleno | 🟡 |

### 5.4 Mazo guardado (0x110 = 272 B, base `0x2438 + 0x110·d`) ✅
`+0x00 u8 en uso` · `+0x01..0x13` ❓ (🟡 nombre: SUBSEG "NAME ENTRY") · `+0x14 + 8·k` (k = 0..29):
`u8 tipo (0 Digimon, 1 Option, 2 Digivolve)`, `u8 índice dentro del tipo`, `u16 id`, `u32 puntero runtime`
(`0x80046BAC`, `0x80046EA0`) · `+0x104` ❓ · `+0x108 u16` 🟡 (sube al guardar el mazo, `0x80046E5C`) ·
`+0x10A u16 victorias` · `+0x10C u16 derrotas` (`0x8003F8A8..0x8003F8F0`) · `+0x10E` ❓.

### 5.5 Memory card ✅
* Archivos `BASLUS-01328_A`, `_B`, `_C` (punteros `OPENSEG 0x801F07FC`), **2 bloques** cada uno
  (`OPENSEG 0x801EF134` → `0x8002C30C(slot, 2, buf, nombre)`).
* Contenido: cabecera/ícono PS1 (512 B copiados desde `*0x801E81A0`, ❓ detalle) + **un bloque de jugador
  de 10 100 B + 2 bytes de checksum**: `0x8002CC04(10100, buf)` escribe `XOR` de todos los bytes y luego la
  `suma` de 8 bits; al cargar `0x8002CBA0(buf+0x16 = 10100, buf)` los verifica (error si no coincide).
  🟡 `OPENSEG 0x801EF568` copia `save + jugador·10100` a un buffer de 16 KB (`0x801EBF00`) antes de guardar.
* `+0x0D` (nº de guardados) se incrementa al guardar (OPENSEG `0x801EEB9C`).

### 5.6 `opp = *0x8006E054` (4 140 B) — lo relevante para recompensas
✅ `+0x00` puntero al DECK2 cargado · `+0x04 u8` índice del mazo rival · **`+0x08` copia del registro DECK2
(110 B)**: `+0x44` nombre, `+0x57` dueño, `+0x6C..0x6F` IA, `+0x70..0x72` presentación (🟡 música/modelo/arena:
`0x8002B024`, `0x8003EAF4`), **`+0x73` tipo de sobre**, **`+0x74` EXP**, `+0x75` nivel de Digi-Egg de la CPU (🟡) ·
`+0x78` copia de seguridad de los slots de Partner (2 jugadores × 3 × 0x298) · `+0x1008 s16[2]` mazo de evento por
jugador (−1 = propio) · `+0x100C` puntero a 428 B.

---

## 6. Corrección a `02-formato-rom.md` §5 (DECK2.DEK) y datos por mazo

✅ `SLUS 0x800417A0..0x80041890`: `registro_i = archivo + 8 + 110·i` (cabecera de **8** bytes, no 6) y se copian
110 bytes a `opp+0x08`. Con ese límite: `+0x00 u16[30] cartas`, `+0x3C nombre[19]`, `+0x4F dueño[19]`,
`+0x62 u16 ❓`, `+0x64 4×IA`, `+0x68..+0x6A` presentación, **`+0x6B sobre`**, **`+0x6C EXP`**, `+0x6D` nivel de
huevo de la CPU. El "`+0x00 u16` desconocido" del doc actual es en realidad la cola (EXP, huevo) del mazo
**anterior**, y los "2 bytes de relleno" finales son la cola del mazo 158. En `decks.json`, `unknown.head`
del mazo *i* = EXP/huevo del mazo *i−1*.

Mazos COM (0–141): EXP base, sobre al ganar, bytes `+0x68..+0x6A`, huevo CPU y unión de récords
(`0x800471F4`: 117,121–127→114 · 128–131→119 · 132→85 · 133→92 · 134→90 · 135→82 · 136→88 · 137→79 · 138→13 ·
139→0 · 141→0; tabla `SLUS 0x8006E50C` + saltos `0x80011968`). Mazos 142–158 ("Player") traen todo en 0
salvo el huevo (Flame 1, Raidra 2, Magna 3…).

| # | Dueño | Mazo | EXP | Sobre | +68 +69 +6A | Huevo | Récord en |
|---|---|---|---|---|---|---|---|
| 0 | Betamon | Tutorial | 2 | 0 Basic | 8f 93 20 | 0 |  |
| 1 | Agumon | Tricolor Starter | 3 | 0 Basic | 8f 93 20 | 0 |  |
| 2 | Penguinmon | Penguinmon Color | 4 | 0 Basic | 8f 93 20 | 0 |  |
| 3 | Babamon | New Power | 5 | 0 Basic | 8f 93 20 | 0 |  |
| 4 | Meramon | Burning Hot! | 4 | 0 Basic | 8f 93 21 | 0 |  |
| 5 | Phoenixmon | Big Red Sky | 4 | 0 Basic | 8f 93 21 | 0 |  |
| 6 | Veemon | Go Go Dinosaur | 5 | 0 Basic | 2e 25 21 | 0 |  |
| 7 | Vegiemon | Quick Digivolve | 5 | 0 Basic | 8f 93 22 | 0 |  |
| 8 | Ninjamon | Switching | 5 | 0 Basic | 8f 93 22 | 0 |  |
| 9 | Veedramon | V For Victory | 6 | 0 Basic | 8f 93 22 | 0 |  |
| 10 | Wormmon | Tryout | 7 | 1 Hyper | 2f 2c 22 | 0 |  |
| 11 | Frigimon | Hearty Meal | 5 | 0 Basic | 8f 93 23 | 0 |  |
| 12 | Whamon | Guarding Sea | 5 | 0 Basic | 8f 93 23 | 0 |  |
| 13 | Garurumon | Fightback | 6 | 0 Basic | 2e 25 23 | 0 |  |
| 14 | Stingmon | Black Storm | 7 | 1 Hyper | 2f 2c 23 | 0 |  |
| 15 | Hagurumon | Toy Party | 5 | 0 Basic | 8f 93 24 | 0 |  |
| 16 | ShellNumemon | Jam-Jam | 5 | 0 Basic | 8f 93 24 | 0 |  |
| 17 | KingSukamon | Hail King Sukamon | 6 | 0 Basic | 8f 93 24 | 0 |  |
| 18 | Shadramon | Evil Fire | 7 | 1 Hyper | 2f 2c 24 | 1 |  |
| 19 | Wormmon | Get Serious | 5 | 1 Hyper | 2f 2c 25 | 0 |  |
| 20 | Stingmon | Black Storm Again | 6 | 1 Hyper | 2f 2c 25 | 0 |  |
| 21 | Shadramon | Evil Fire Revived | 7 | 1 Hyper | 2f 2c 25 | 1 |  |
| 22 | Quetzalmon | Bad Luck Wind | 8 | 1 Hyper | 2f 2c 25 | 2 |  |
| 23 | Digimon Emperor | Binding Chain | 15 | 2 Super | 90 94 25 | 2 |  |
| 24 | Centarumon | Gate of Fire | 5 | 1 Hyper | 8f 93 26 | 0 |  |
| 25 | Tyrannomon | Paleo-Energy | 6 | 1 Hyper | 8f 93 26 | 0 |  |
| 26 | Angemon | Evil Slayer | 7 | 1 Hyper | 2e 25 26 | 0 |  |
| 27 | Davis | Fire Heart | 8 | 1 Hyper | 2e 25 21 | 1 |  |
| 28 | Keely | Bingo!! | 8 | 1 Hyper | 2e 25 22 | 1 |  |
| 29 | Cody | Ready To Go | 8 | 1 Hyper | 2e 25 23 | 1 |  |
| 30 | T.K. | Wings of Hope | 7 | 1 Hyper | 2e 25 26 | 1 |  |
| 31 | Wizardmon | Magic Strike | 6 | 1 Hyper | 2e 25 28 | 0 |  |
| 32 | AeroVeedramon | Slayer | 7 | 1 Hyper | 8f 93 28 | 0 |  |
| 33 | Gatomon | Cat Attack | 8 | 1 Hyper | 2e 25 28 | 0 |  |
| 34 | Kari | Ladies' Night | 8 | 1 Hyper | 2e 25 28 | 1 |  |
| 35 | Goburimon | Out of Control | 5 | 1 Hyper | 8f 93 29 | 0 |  |
| 36 | DemiDevimon | Dark Digivolution | 6 | 1 Hyper | 90 94 29 | 0 |  |
| 37 | Megadramon | Mega Shock | 7 | 1 Hyper | 90 94 29 | 0 |  |
| 38 | Gigadramon | Mega Giga | 8 | 1 Hyper | 90 94 29 | 0 |  |
| 39 | Togemon | Spiky | 8 | 1 Hyper | 2e 25 2a | 0 |  |
| 40 | Kabuterimon | Anti-A | 8 | 1 Hyper | 2e 25 2a | 0 |  |
| 41 | Ikkakumon | Anti-Fire | 8 | 1 Hyper | 2e 25 2a | 0 |  |
| 42 | Birdramon | First Attack | 8 | 1 Hyper | 2e 25 2a | 0 |  |
| 43 | WereGarurumon | Howl to the Moon | 8 | 1 Hyper | 2e 25 2a | 0 |  |
| 44 | MetalGreymon | SEVEN | 8 | 1 Hyper | 2e 25 2a | 0 |  |
| 45 | Tuskmon | Fighting Monsters | 8 | 2 Super | 90 94 2b | 0 |  |
| 46 | Phantomon | Sickle Slayer | 8 | 2 Super | 90 94 2b | 0 |  |
| 47 | MegaSeadramon | Mega Flood | 8 | 2 Super | 90 94 2b | 0 |  |
| 48 | VenomMyotismon | Evil King | 10 | 7 Black | 90 94 2b | 0 |  |
| 49 | Leomon | Battle Gear | 8 | 2 Super | 90 94 27 | 0 |  |
| 50 | Devimon | Cool Devil | 9 | 2 Super | 90 94 27 | 0 |  |
| 51 | MetalEtemon | Steel Gate | 9 | 2 Super | 90 94 27 | 0 |  |
| 52 | Myotismon | Dark Revival | 10 | 2 Super | 90 94 27 | 0 |  |
| 53 | Greymon | Digivolution! | 8 | 2 Super | 2e 25 20 | 0 |  |
| 54 | ExVeemon | Strong-V | 8 | 1 Hyper | 2e 25 21 | 0 |  |
| 55 | Flamedramon | Rocket Bomb | 9 | 1 Hyper | 2e 25 21 | 1 |  |
| 56 | Raidramon | Raiden Blade | 10 | 2 Super | 2e 25 21 | 2 |  |
| 57 | Hawkmon | Quick Draw | 8 | 1 Hyper | 2e 25 22 | 0 |  |
| 58 | Aquilamon | Storm Bringer | 8 | 1 Hyper | 2e 25 22 | 0 |  |
| 59 | Halsemon | Burning Love | 10 | 2 Super | 2e 25 22 | 1 |  |
| 60 | Armadillomon | Mountain Crusher | 8 | 1 Hyper | 2e 25 23 | 0 |  |
| 61 | Ankylomon | Rock Head | 9 | 1 Hyper | 2e 25 23 | 0 |  |
| 62 | Digmon | Mountain CrusherDX | 10 | 2 Super | 2e 25 23 | 1 |  |
| 63 | Thundermon | Blitzkrieg | 8 | 1 Hyper | 8f 93 24 | 0 |  |
| 64 | MetalMamemon | Bean Stalk | 9 | 1 Hyper | 8f 93 24 | 0 |  |
| 65 | SuperStarmon | Star Force | 10 | 2 Super | 8f 93 24 | 0 |  |
| 66 | Bakemon | Dancing Ghosts | 8 | 1 Hyper | 8f 93 25 | 0 |  |
| 67 | Devimon | Devil's Call | 9 | 1 Hyper | 8f 93 25 | 0 |  |
| 68 | SkullGreymon | Stealth Skull | 10 | 2 Super | 8f 93 25 | 0 |  |
| 69 | Myotismon | Dark Prince | 11 | 2 Super | 8f 93 25 | 0 |  |
| 70 | Patamon | Friendly | 8 | 1 Hyper | 2e 25 26 | 0 |  |
| 71 | Baronmon | Twin Meteor | 9 | 1 Hyper | 2e 25 26 | 2 |  |
| 72 | Pegasusmon | Great Hope | 10 | 2 Super | 2e 25 26 | 1 |  |
| 73 | Gatomon | Call of Destiny | 8 | 1 Hyper | 2e 25 28 | 0 |  |
| 74 | Nefertimon | Divine Monster | 9 | 1 Hyper | 2e 25 28 | 1 |  |
| 75 | Tylomon | Swirling Light | 10 | 2 Super | 2e 25 28 | 2 |  |
| 76 | Tentomon | No Can Do | 10 | 1 Hyper | 2e 25 22 | 0 |  |
| 77 | Kuwagamon | Head-On Collision | 10 | 1 Hyper | 8f 93 22 | 0 |  |
| 78 | HerculesKabuterimon | Beetle Cross | 13 | 2 Super | 8f 93 22 | 0 |  |
| 79 | WarGreymon | Fire Heart | 10 | 2 Super | 2e 25 20 | 0 |  |
| 80 | Tai | Go All The Way | 10 | 2 Super | 2e 25 20 | 0 |  |
| 81 | Paildramon | Three Signs | 10 | 2 Super | 2e 25 21 | 0 |  |
| 82 | Garudamon | Sun's Gift | 10 | 2 Super | 2e 25 21 | 0 |  |
| 83 | Sora | Hyper Digivolution | 10 | 2 Super | 2e 25 21 | 0 |  |
| 84 | Shurimon | Ninja | 10 | 2 Super | 2e 25 22 | 2 |  |
| 85 | Lillymon | Flower Fairies | 10 | 2 Super | 2e 25 22 | 0 |  |
| 86 | Mimi | Princess | 10 | 2 Super | 2e 25 22 | 0 |  |
| 87 | Submarimon | Yellow Submarine | 10 | 2 Super | 2e 25 23 | 2 |  |
| 88 | MetalGarurumon | Shoot Everything! | 10 | 2 Super | 2e 25 23 | 0 |  |
| 89 | Matt | Bonding | 10 | 2 Super | 2e 25 23 | 0 |  |
| 90 | Zudomon | Armed | 10 | 2 Super | 2e 25 24 | 0 |  |
| 91 | Joe | First Aid | 10 | 2 Super | 2e 25 24 | 0 |  |
| 92 | MegaKabuterimon | Intercepting Traps | 10 | 2 Super | 2e 25 25 | 0 |  |
| 93 | Izzy | Program | 10 | 2 Super | 2e 25 25 | 0 |  |
| 94 | MagnaAngemon | Divine Sword | 10 | 2 Super | 2e 25 26 | 1 |  |
| 95 | Angewomon | Shining Goddess | 10 | 2 Super | 2e 25 28 | 1 |  |
| 96 | GranKuwagamon | Black King | 10 | 2 Super | 2e 25 29 | 1 |  |
| 97 | Ken | Wormhole | 10 | 2 Super | 2e 25 29 | 1 |  |
| 98 | MetalSeadramon | Rough Sea King | 12 | 2 Super | 90 94 2b | 0 |  |
| 99 | Puppetmon | Toy Castle | 12 | 2 Super | 90 94 2b | 0 |  |
| 100 | Machinedramon | Machine Empire | 9 | 2 Super | 90 94 2b | 0 |  |
| 101 | LadyDevimon | Evil Flower | 12 | 2 Super | 90 94 2b | 0 |  |
| 102 | Piedmon | 4 Strong Monsters | 12 | 3 Great | 2f 2c 2b | 0 |  |
| 103 | Magnamon | Miracle Knight's | 12 | 3 Great | 2e 25 21 | 3 |  |
| 104 | Sylphymon | Storm Tamer | 12 | 3 Great | 2e 25 22 | 0 |  |
| 105 | Shakkoumon | Ancient Legend | 12 | 3 Great | 2e 25 23 | 0 |  |
| 106 | Seraphimon | Heaven's Gate | 12 | 3 Great | 2e 25 26 | 1 |  |
| 107 | Magnadramon | Divine Dragon | 12 | 3 Great | 2e 25 28 | 1 |  |
| 108 | Infermon | Forever Increase | 13 | 2 Super | 2f 2c 2b | 0 |  |
| 109 | Diaboromon | Time Bomb | 14 | 3 Great | 2f 2c 2b | 0 |  |
| 110 | Imperialdramon | Invincible Emperor | 15 | 3 Great | 2e 25 21 | 2 |  |
| 111 | Valkyrimon | Warrior Princess | 15 | 3 Great | 2e 25 22 | 1 |  |
| 112 | Vikemon | Permafrost | 15 | 3 Great | 2e 25 23 | 2 |  |
| 113 | Omnimon | Blue Star Red Moon | 15 | 3 Great | 2e 25 2a | 0 |  |
| 114 | Apokarimon | Desperate Space | 25 | 3 Great | 90 94 2b | 0 |  |
| 115 | BK WarGreymon | Black Fire Heart | 16 | 3 Great | 2e 25 20 | 0 |  |
| 116 | BK MetalGarurumon | Patriot | 16 | 3 Great | 2e 25 23 | 0 |  |
| 117 | Apokarimon | Desperate Space | 25 | 3 Great | 90 94 20 | 0 | 114 |
| 118 | Rosemon | Rose Garden | 5 | 0 Basic | 8f 93 20 | 0 |  |
| 119 | Nanimon | Who Are You? | 10 | 1 Hyper | 8f 93 24 | 0 |  |
| 120 | Piximon | Return | 12 | 2 Super | 8f 93 29 | 0 |  |
| 121 | Apokarimon | Desperate Space | 25 | 3 Great | 90 94 20 | 0 | 114 |
| 122 | Apokarimon | Desperate Space | 25 | 3 Great | 90 94 21 | 0 | 114 |
| 123 | Apokarimon | Desperate Space | 25 | 3 Great | 90 94 24 | 0 | 114 |
| 124 | Apokarimon | Desperate Space | 25 | 3 Great | 90 94 27 | 0 | 114 |
| 125 | Apokarimon | Desperate Space | 25 | 3 Great | 90 94 26 | 0 | 114 |
| 126 | Apokarimon | Desperate Space | 25 | 3 Great | 90 94 28 | 0 | 114 |
| 127 | Apokarimon | Desperate Space | 25 | 3 Great | 90 94 29 | 0 | 114 |
| 128 | Nanimon | Who Are You? | 10 | 1 Hyper | 8f 93 25 | 0 | 119 |
| 129 | Nanimon | Who Are You? | 10 | 1 Hyper | 8f 93 27 | 0 | 119 |
| 130 | Nanimon | Who Are You? | 10 | 1 Hyper | 8f 93 29 | 0 | 119 |
| 131 | Nanimon | Who Are You? | 10 | 1 Hyper | 8f 93 2b | 0 | 119 |
| 132 | Lillymon | Flower Fairies | 10 | 2 Super | 2e 25 2a | 0 | 85 |
| 133 | MegaKabuterimon | Intercepting Traps | 10 | 2 Super | 2e 25 2a | 0 | 92 |
| 134 | Zudomon | Armed | 10 | 2 Super | 2e 25 2a | 0 | 90 |
| 135 | Garudamon | Sun's Gift | 10 | 2 Super | 2e 25 2a | 0 | 82 |
| 136 | MetalGarurumon | Shooter | 10 | 2 Super | 2e 25 2a | 0 | 88 |
| 137 | WarGreymon | Fire Heart | 10 | 2 Super | 2e 25 2a | 0 | 79 |
| 138 | Garurumon | Fightback | 6 | 0 Basic | 2e 25 23 | 0 | 13 |
| 139 | Betamon | Betamon | 2 | 0 Basic | 8f 93 20 | 0 | 0 |
| 140 | A | Darkness Wave | 30 | 3 Great | 90 94 2b | 0 |  |
| 141 | Betamon | Pick Up | 30 | 3 Great | 8f 93 20 | 0 | 0 |

---

## Dudas
1. ❓ Semántica exacta de los bits de `P0+0x110` marcados 🟡 (0-2, 3, 5, 16, 17/18 y el bit 31 de `+0x178`
   "Gamble", 29/30). Se leyó la prueba y el sitio que los pone, no todo el contexto del estado.
2. ❓ "3 Partners Plus": confirmar que `0x801FA4E4` se llama en cada entrada/digivolución (solo hay llamadas por
   puntero) y si cuenta también las del CPU.
3. ❓ Option Maniac: confirmar que `0x80046C0C` cuenta sobre las 30 cartas del mazo de batalla (mask 0xC0).
4. ❓ Campos `+0x0E`, `+0x0F`, `+0x20`, `+0x24`, `+0x30`, `+0x56`, `+0x58[40]`, `deck+0x01..0x13`, `+0x104`,
   `+0x108`, slot `+0x28F[3]`; largo máximo del nombre.
5. ❓ Uso de los números de serie `+0x15E0` (¿TRADE?) y de `+0x10` (rand al crear).
6. ❓ Formato exacto de la cabecera de 512 B del archivo de memory card y en qué offset del archivo empieza el bloque.
7. ❓ Efectos de Digi-Parts tipos 1–7 (texto coherente, pero solo se leyó en detalle el 0 y el 8).
8. 🟡 `CMD10.18` (pone `+0x28` bit 10) — ¿"historia terminada"? Lo lee el TRADE (`OPENSEG 0x801EB428`).

## Datos extraíbles
| Tabla | Dónde | Formato |
|---|---|---|
| Bonos | `KAWSEG.BIN` +0x1E3C8 (`0x801FC300`) | 32 × {u8 id, u8 EXP, u16 0, u32 ptr nombre} |
| Saltos de bonos en batalla | `KAWSEG.BIN` +0x1EF4 (`0x801DFE2C`) | 22 × u32 (ids 8..29) |
| Digi-Parts (texto + rango) | `KAWSEG.BIN` +0x1DC00 (`0x801FBB38`) | 128 × {u32 ptr, u8 rango[6] (255 = no), u16 0} |
| Digi-Parts (efecto) | `SLUS` file 0x5F1B4 (`0x8006E9B4`) | 128 × 8 B {u8 tipo, u8 sub, …, u16 valor @+4, u8 @+6} |
| Orden de Partners | `SLUS` file 0x5ED18 (`0x8006E518`) | 6 × u8 ids [175,182,190,184,183,187] |
| Sobres | `SLUS` file 0x5EB5C (`0x8006E35C`) | 16 × 18 × s8 {[esp·3+idx] ×15, opt max, opt min, +raro} |
| Nombres de sobres | `SLUS` file 0x5EB1C (`0x8006E31C`) | 16 × ptr |
| Títulos Tamer/Collector/2P | `SLUS` file 0x5E858 / 0x5E878 / 0x5E898 | 3 × 8 × ptr (índice = rango) |
| Totales de categoría | `SLUS` file 0x5E8B8 (`0x8006E0B8`) | 6 × u8 [34,35,34,36,33,110] |
| Títulos especiales | `ENDSEG.BIN` +0x2C7C (`0x801E0BB4`) | 36 × ptr (texto con prefijo de color `*cN`) |
| EXP/sobre/huevo por mazo | `DECK2.DEK` (B.DRV, file 0x168D000) | registro = 8 + 110·i; +0x6B, +0x6C, +0x6D |
| Unión de mazos para récords | `SLUS` file 0x5ED0C (`0x8006E50C`) + saltos file 0x2168 | ids 132..141 → u8 |
| Pesos de completitud | script `CITY00.MSD` (volcado `PROG\w01\CITY00.txt`, tras `CMD10.19`) | 120 × (`if vN` → `CMD11.18(w)`) |
| Umbrales (constantes en código) | `SLUS 0x8002CCD8..0x8002D3A8`, `0x80049934`, `0x8004994C` | Tamer 10/25/50/100/200/300/500 · Collector 100/200 copias, 1/3/5/6 categorías · 2P 10/20/30/40/60/80/100 · EXP (r+1)(r+3) · +10 cada 5 rangos |
| Pools de sobres | se derivan en runtime de `cards.json` (`fusion.result`, nivel, especialidad, tipo) | regla §3.2 (`PROG\w02\packs.py`) |

---

## Anexo A — Digi-Parts (rango de aprendizaje: Veemon Hawkmon Armadillomon Gatomon Patamon Wormmon; — = nunca)
| # | Texto | V H A G P W | efecto (8 B hex) |
|---|---|---|---|
| 0 | HP+50. | 3 5 1 99 3 7 | 0000000032000000 |
| 1 | HP+100. | 17 16 8 12 14 19 | 0000000064000000 |
| 2 | HP+150. | 29 32 19 25 32 33 | 0000000096000000 |
| 3 | HP+200. | 45 48 31 40 52 59 | 00000000c8000000 |
| 4 | HP+300. | 61 67 51 57 68 78 | 000000002c010000 |
| 5 | HP+400. | 96 89 71 81 91 88 | 0000000090010000 |
| 6 | HP+500. | 99 — 75 91 — 95 | 00000000f4010000 |
| 7 | All Attack Powers +50. | 18 39 54 30 57 28 | 0100000032000000 |
| 8 | All Attack Powers +100. | 39 86 72 50 89 51 | 0100000064000000 |
| 9 | All Attack Powers +200. | 75 — 90 93 — 84 | 01000000c8000000 |
| 10 | ◯ Attack Power +100. | 1 9 15 5 4 2 | 0200000064000000 |
| 11 | ◯ Attack Power +150. | 10 21 38 22 16 15 | 0200000096000000 |
| 12 | ◯ Attack Power +200. | 27 54 62 41 39 30 | 02000000c8000000 |
| 13 | ◯ Attack Power +250. | 48 — 78 61 62 61 | 02000000fa000000 |
| 14 | ◯ Attack Power +300. | 67 — — 85 82 79 | 020000002c010000 |
| 15 | △ Attack Power +50. | 4 1 12 2 6 13 | 0300000032000000 |
| 16 | △ Attack Power +100. | 12 7 22 16 18 29 | 0300000064000000 |
| 17 | △ Attack Power +150. | 32 28 45 36 45 43 | 0300000096000000 |
| 18 | △ Attack Power +200. | 51 44 — 56 67 66 | 03000000c8000000 |
| 19 | △ Attack Power +250. | 77 — — 76 86 96 | 03000000fa000000 |
| 20 | ✕ Attack Power +50. | 6 6 2 4 10 1 | 0400000032000000 |
| 21 | ✕ Attack Power +100. | 19 36 20 19 27 9 | 0400000064000000 |
| 22 | ✕ Attack Power +150. | 35 69 42 38 53 24 | 0400000096000000 |
| 23 | ✕ Attack Power +200. | 82 — 63 67 — 48 | 04000000c8000000 |
| 24 | ◯ to 0, ✕ Attack Power -100. | 24 12 4 14 — 34 | 050200009cff0000 |
| 25 | △ to 0, ✕ Attack Power -100. | 46 23 9 35 — 17 | 050300009cff0000 |
| 26 | ✕ to 0, ✕ Attack Power -100. | 58 71 36 10 — 71 | 050400009cff0000 |
| 27 | Counter ◯,✕ Attack Power to 0. | 11 26 — — 40 62 | 0505000000000000 |
| 28 | Counter △,✕ Attack Power to 0. | 36 14 — — 24 49 | 0506000000000000 |
| 29 | Counter ✕,✕ Attack Power to 0. | 40 57 — — 11 21 | 0507000000000000 |
| 30 | Opponent Fire X3, ✕ Attack Power -200. | 87 92 39 69 31 50 | 050b000038ff0000 |
| 31 | Opponent Ice X3, ✕ Attack Power -200. | 25 97 — 42 77 73 | 050c000038ff0000 |
| 32 | Opponent Nature X3, ✕ Attack Power -200. | 37 — 66 — 83 4 | 050d000038ff0000 |
| 33 | Opponent Darkness X3, ✕ Attack Power -200. | 68 33 46 21 5 97 | 050e000038ff0000 |
| 34 | Opponent Rare X3, ✕ Attack Power -200. | 52 41 6 — — 25 | 050f000038ff0000 |
| 35 | 1st Attack, ✕ Attack Power -200. | 76 50 95 62 — — | 0501000038ff0000 |
| 36 | Jamming Support, ✕ Attack Power -100. | — 74 27 — 54 10 | 050a00009cff0000 |
| 37 | Eat-up HP, ✕ Attack Power -200. | — 87 50 — 73 — | 0509000038ff0000 |
| 38 | Add + 10 DP. | 42 4 61 1 9 — | 060000000a000000 |
| 39 | Add + 20 DP. | 91 29 79 27 21 — | 0600000014000000 |
| 40 | Add + 30 DP. | — 98 97 60 78 85 | 060000001e000000 |
| 41 | Boost Attack Power +50. | 2 10 13 3 7 11 | 0700010132000100 |
| 42 | Boost Attack Power +100. | 21 42 56 33 36 35 | 0700010164000100 |
| 43 | Boost Attack Power +200. | 26 81 73 46 84 44 | 07000101c8000100 |
| 44 | Boost Attack Power +300. | 69 — 84 82 — 80 | 070001012c010100 |
| 45 | Attack Power is Doubled. | — — — — — — | 0700020102000100 |
| 46 | Boost ◯ Attack Power +300. | 8 30 47 17 26 12 | 070003012c010100 |
| 47 | Boost ◯ Attack Power +400. | 34 77 74 47 46 39 | 0700030190010100 |
| 48 | Boost ◯ Attack Power +500. | 55 — 88 88 66 74 | 07000301f4010100 |
| 49 | ◯ Attack Power is Doubled. | 13 64 67 58 33 63 | 0700040102000100 |
| 50 | ◯ Attack Power is Tripled. | 59 — 94 74 — 86 | 0700040103000100 |
| 51 | Boost △ Attack Power +200. | 15 2 — 7 22 18 | 07000501c8000100 |
| 52 | Boost △ Attack Power +300. | 28 19 — 23 41 36 | 070005012c010100 |
| 53 | Boost △ Attack Power +400. | 43 70 — 92 59 53 | 0700050190010100 |
| 54 | △ Attack Power is Doubled. | 22 13 59 34 — 67 | 0700060102000100 |
| 55 | △ Attack Power is Tripled. | 83 — 91 94 — 89 | 0700060103000100 |
| 56 | Boost ✕ Attack Power +100. | 23 40 10 18 — 8 | 0700070164000100 |
| 57 | Boost ✕ Attack Power +200. | 38 58 40 43 — 20 | 07000701c8000100 |
| 58 | Boost ✕ Attack Power +300. | 71 — 60 63 — 90 | 070007012c010100 |
| 59 | ✕ Attack Power is Doubled. | 44 72 48 51 — 40 | 0700080102000100 |
| 60 | ✕ Attack Power is Tripled. | 88 — 85 95 — 65 | 0700080103000100 |
| 61 | Attack Power becomes same as HP. | — — — — — — | 0700210100000100 |
| 62 | Get 1st Attack. | 53 55 98 71 85 — | 0700220100000200 |
| 63 | Attack becomes Eat-up HP. | — 93 80 — 61 55 | 07000b0100000200 |
| 64 | Lower Opponent's ◯ Attack Power to 0. | 54 — 17 — 28 75 | 07000c0100000100 |
| 65 | Lower Opponent's △ Attack Power to 0. | 84 24 28 — 15 — | 07000d0100000100 |
| 66 | Lower Opponent's ✕ Attack Power to 0. | — 66 24 — 13 45 | 07000e0100000100 |
| 67 | ◯ Counterattack (Attack 2nd). | 7 — 33 — 47 14 | 070a0f0100000200 |
| 68 | △ Counterattack (Attack 2nd). | 33 17 — — 37 26 | 070b0f0100000200 |
| 69 | ✕ Counterattack (Attack 2nd). | 47 43 5 — — 37 | 070c0f0100000200 |
| 70 | If Fire Opponent, X2 own Attack Power. | 74 79 — 77 25 38 | 0701020102000100 |
| 71 | If Fire Opponent, X3 own Attack Power. | — 91 — 65 74 82 | 0701020103000100 |
| 72 | If Ice Opponent, X2 own Attack Power. | 5 47 64 26 80 76 | 0702020102000100 |
| 73 | If Ice Opponent, X3 own Attack Power. | 60 — 89 83 98 91 | 0702020103000100 |
| 74 | If Nature Opponent, X2 own Attack Power. | 50 27 58 59 42 6 | 0703020102000100 |
| 75 | If Nature Opponent, X3 own Attack Power. | 79 — 93 — 93 70 | 0703020103000100 |
| 76 | If Darkness Opponent, X2 own Attack Power. | 56 37 44 6 19 93 | 0704020102000100 |
| 77 | If Darkness Opponent, X3 own Attack Power. | 92 60 87 79 63 — | 0704020103000100 |
| 78 | If Rare Opponent, X2 own Attack Power. | 78 76 26 72 69 46 | 0705020102000100 |
| 79 | If Rare Opponent, X3 own Attack Power. | 89 96 55 — — 68 | 0705020103000100 |
| 80 | Change own Specialty to Fire. | 9 35 — 48 96 — | 07001a0100000200 |
| 81 | Change own Specialty to Ice. | — 99 30 87 58 — | 07001a0101000200 |
| 82 | Change own Specialty to Nature. | 97 3 41 8 12 94 | 07001a0102000200 |
| 83 | Change own Specialty to Darkness. | 30 — 68 98 81 3 | 07001a0103000200 |
| 84 | Change own Specialty to Rare. | 95 82 14 52 76 99 | 07001a0104000200 |
| 85 | Switch Opponent's Specialty to own. | — — — — — — | 0700180100000200 |
| 86 | Swap Specialty with Opponent's. | — — — — — — | 0700170300000200 |
| 87 | If Fire Opponent, lower its AP to 0. | 66 52 — 97 43 — | 07010a0100000100 |
| 88 | If Ice Opponent, lower its AP to 0. | 41 61 34 84 8 — | 07020a0100000100 |
| 89 | If Nature Opponent, lower its AP to 0. | — 11 52 — 64 22 | 07030a0100000100 |
| 90 | If Darkness Opponent, lower its AP to 0. | — 25 37 13 2 72 | 07040a0100000100 |
| 91 | If Rare Opponent, lower its AP to 0. | — 75 16 — 34 52 | 07050a0100000100 |
| 92 | Reduce both Players' Atk Pwr to 0. | — — — — — — | 0700090200000100 |
| 93 | If R, boost Attack Power +200. | 14 31 — 9 48 23 | 07060101c8000100 |
| 94 | If C, boost Attack Power +300. | 31 53 — 20 38 57 | 070701012c010100 |
| 95 | If U, boost Attack Power +400. | 57 — 81 70 95 77 | 0708010190010100 |
| 96 | Opponent uses ◯ Attack. | 16 62 — 28 97 31 | 07001b0100000200 |
| 97 | Opponent uses △ Attack. | 62 18 11 39 — 47 | 07001b0101000200 |
| 98 | Opponent uses ✕ Attack. | 94 8 21 — 44 58 | 07001b0102000200 |
| 99 | Opponent uses same Attack. | — — — — — — | 07001e0100000200 |
| 100 | Recover HP +200. | 72 15 32 11 1 81 | 07002001c8000200 |
| 101 | Recover HP +300. | 90 38 53 31 17 — | 070020012c010200 |
| 102 | Recover HP +400. | — 68 92 73 55 — | 0700200190010200 |
| 103 | Halve Attack Power, recover HP +400. | 93 20 43 15 23 — | 07001f0290010200 |
| 104 | Halve Attack Power, recover HP +600. | — 46 86 44 60 — | 07001f0258020200 |
| 105 | If HP < Opponent's HP, add HP +500. | 98 59 23 37 29 — | 07092001f4010200 |
| 106 | If HP < Opponent's HP, add HP +700. | — 83 69 53 56 — | 07092001bc020200 |
| 107 | If KO'd in battle, revive w/ HP 300. | 49 34 — 24 30 42 | 07001c012c010100 |
| 108 | If KO'd in battle, revive w/ HP 600. | — 63 — 49 49 64 | 07001c0158020100 |
| 109 | If KO'd in battle, revive w/ HP 1000. | — 94 — 64 65 98 | 07001c01e8030100 |
| 110 | Drop 1 Card in Opponent's Hand. | 63 22 3 45 75 27 | 070d1d0101000200 |
| 111 | Drop 2 Cards in Opponent's Hand. | — 78 25 — 92 56 | 070d1d0102000200 |
| 112 | Drop Opponent's Top 2 DP Cards shown. | — 56 18 86 35 5 | 070e130102000200 |
| 113 | Drop Opponent's Top 3 DP Cards shown. | — 88 49 — 90 32 | 070e130103000200 |
| 114 | Drop Opponent's Top 4 DP Cards shown. | — — — — — — | 070e130104000200 |
| 115 | Drop 2 Cards in Opponent's Online Deck. | — 51 7 29 — 16 | 070f140102000200 |
| 116 | Drop 3 Cards in Opponent's Online Deck. | — 95 35 89 — 54 | 070f140103000200 |
| 117 | Move Offline Top Card to Online Deck. | 86 — 70 78 50 — | 0710150101000200 |
| 118 | Void Opponent's Support Effect. | — 84 65 — 87 69 | 0700160100000300 |
| 119 | Draw until there are 4 Cards. | 64 45 29 54 20 — | 0711100104000200 |
| 120 | Draw Online Partner Card, then Shuffle. | 65 80 82 68 72 — | 0711110200000200 |
| 121 | If R, HP + 200 & all Attack Powers +100. | 73 73 — 55 94 83 | 07062302c8000100 |
| 122 | If A, HP + 200 & all Attack Powers +100. | 81 — 76 66 79 87 | 07122302c8000100 |
| 123 | Boost Battle Experience by 10%. | 20 49 57 32 71 41 | 080000000a000000 |
| 124 | Boost Battle Experience by 20%. | 85 65 77 75 88 92 | 0800000014000000 |
| 125 | Boost Battle Experience by 30%. | 80 — 96 90 99 60 | 080000001e000000 |
| 126 | Rare Card might appear after battle. | 70 85 83 80 51 — | 080100000a000000 |
| 127 | Rare Card even more likely to appear. | — 90 99 96 70 — | 0801000014000000 |

## Anexo B — Pools normales de cada sobre (ids de carta; simulación de `0x8004635C` sobre CARD2.CDD)
```
Basic Pack     normal: 24 25 26 27 28 29 30 31 32 33 58 59 60 61 62 63 64 65 66 67 68 94 95 96 97 98 99 100 101 102 129 130 131 132 133 134 135 136 137 138 162 163 164 165 166 167 168 169 170 171
Hyper Pack     normal: 11 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 45 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 80 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100 101 102 116 120 121 122 123 124 125 126 127 128 129 130 131 132 133 134 135 136 137 138 150 153 154 155 156 157 158 159 160 161 162 163 164 165 166 167 168 169 170 171
Super Pack     normal: 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 129 130 131 146 147 148 149 150 151 152 153 154 155 156 157 158 159 160 161 162 163 164 236 237 238 239 240 241 242 243 244 245 246 247 248 249 250 251 252 255 256 257 258 259 260 261 262 263 264 266 267 268 269 270 271 272 300
Great Pack     normal: 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 75 76 77 78 79 80 81 82 83 84 85 86 87 108 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 143 144 145 146 147 148 149 150 151 152 153 154 155 156 157 191 192 193 194 195 196 197 198 199 201 202 203 204 205 206 207 208 209 210 211 212 213 214 215 216 217 218 219 220 221 222 223 224 225 226 227 228 229 230 231 232 233 234 235 236 237 238 239 240 241 253 254 265 294 295 296 297 298 299
Red Pack       normal: 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33
Blue Pack      normal: 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68
Green Pack     normal: 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100 101 102
Black Pack     normal: 117 118 119 120 121 122 123 124 125 126 127 128 129 130 131 132 133 134 135 136 137 138
Yellow Pack    normal: 151 152 153 154 155 156 157 158 159 160 161 162 163 164 165 166 167 168 169 170 171
Option Pack    normal: 216 217 218 219 220 221 222 223 224 225 226 227 228 229 230 231 232 233 234 235 236 237 238 239 240 241 242 243 244 245 246 247 248 249 250 251 252 255 256 257 258 259 260 261 262 263 264 265 266 267 268 269 270 271 272 297 298 299 300
S-Red Pack     normal: 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26
S-Blue Pack    normal: 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60
S-Green Pack   normal: 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96
S-Black Pack   normal: 110 111 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 129 130 131
S-Yellow Pack  normal: 145 146 147 148 149 150 151 152 153 154 155 156 157 158 159 160 161 162 163 164
S-Option Pack  normal: 197 198 199 201 202 203 204 205 206 207 208 209 210 211 212 213 214 215 216 217 218 219 220 221 222 223 224 225 226 227 228 229 230 231 232 233 234 235 236 237 238 239 240 241 254 265 294 295 296 297 298 299
```
