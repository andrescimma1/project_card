# 05 — Estadísticas completas, récords por mazo, Auto Deck, nombre y batalla 2P

Fuente: desensamblado de `SLUS_013.28` y de los overlays `ENDSEG`, `KAWSEG`, `OPENSEG`, `SUBSEG` (`P.DRV`).
Marcas: ✅ verificado en el código · 🟡 probable · ❓ desconocido.

## 1. Récords después de cada batalla (`SLUS 0x8003F72C..0x8003F990`) ✅

* **Tutorial** (`ctx+0x81F ≠ 0`): no se guarda ningún récord, pero `save+0xAC0[0]` y `save+0xAC0[158]` reciben
  `|= 0x8000` (mazos "conocidos").
* Para cada jugador `p` (0 y 1): `m = 0x800471F4(mazo prestado de p)` (`opp+0x1008+2p`, −1 si usa su mazo).
  * Mazo propio (`m = −1`): el mazo del slot activo (`save+0x34`) suma victoria (`+0x10A`) o derrota (`+0x10C`).
  * Mazo prestado (CMD11.17): `save+0xAC0[m] |= 0x8000` y victoria → bits 0-13 `+1` (tope 999); derrota →
    `save+0xBFE[m] +1` (tope 999). **El slot propio no se toca.**
* Contra la CPU: `m = 0x800471F4(mazo rival)`, `save+0xAC0[m] |= 0x8000`, victoria → `+0x888[m]`, derrota →
  `+0x9A4[m]` (tope 999).
* `0x800471F4` (unión de récords): 117 y 121–127 → 114 · 128–131 → 119 · 132..139 y 141 → tabla de bytes
  `SLUS 0x8006E50C` (`85 92 90 82 88 79 13 0 · 48 · 0`; el 140 no la usa) · el resto, igual.
* Partida nueva (`OPENSEG 0x801E83C8`): el mazo inicial (DECK2 142/143/144) queda `|= 0x8000`.

### Bits de `save+0xAC0[i]` (159 mazos de DECK2) ✅
`b15` conocido · `b14` **mazo base** (ver §4) · `b0-13` victorias con ese mazo prestado.

## 2. Poder máximo y rondas por carta ✅

* `KAWSEG 0x801EA5F4` (lo llama el golpe, `0x801E78C0` / `0x801E7A64`): poder del ataque usado
  (`P+0x168+2·slot`) en el momento del golpe; si supera `save+0xD3C[id·3+slot]`, se guarda. Se salta en el
  tutorial y para el jugador del bloque 1 (la CPU, o el jugador 2 en 2P).
* `KAWSEG 0x801ED0A0`: en cada KO, `+0x11B6[id]` (rondas ganadas) del Digimon del ganador en **su** bloque y
  `+0x1334[id]` (rondas perdidas) del perdedor en el suyo, tope 999. Cuenta también cuando el Digimon revive.

## 3. Player's Complete Stats (`ENDSEG 0x801DF47C`) ✅

Una sola página con scroll. Arriba/abajo de a 40 píxeles, L1/R1 rápido, **L2/R2 saltan de sección**, Start sale.
Modo `k` = argumento de `0x8004A2DC(k)`:
* `CMD11.19(0)` → **final**: vídeo STR y vuelta al título, con un diálogo de tarjeta de memoria en medio (🟡 guardar).
* `CMD11.19(1)` → ENDSEG modo 1: empieza 240 px abajo y **se desplaza solo** como unos créditos; al final,
  *"Push ✕ Button to Quit"*. Lo lanza el guion de Beginner City tras BlackWarGreymon (v29, v360).
* modo 2: desde PLAYER'S DATA (`CMD10.7`) con la variable de historia v15 y el botón ◯
  (*"◯: Player's Complete Stats"*, SAISEG).
* Al salir: `save+0x28 |= 0x1000` (`ENDSEG 0x801E0B30`).

Secciones, en orden:

| Sección | Datos |
|---|---|
| *Cards you own.* | 301 cartas, 80 px cada una: `No.<id>`, nombre o `?????????????` si nunca se obtuvo (`0x40`); copias (`"%d Cards"`); *"Received by Trading."* si la colección tiene el bit **`0x08`**; para Digimon, rondas ganadas/perdidas y *"Max ◯/△/✕ Attack Power"* |
| *Wins & Losses per Event Deck* | mazos `i` con `+0xAC0[i] ≠ 0`: `"<nombre> Deck"`, victorias (`b0-13`) y `+0xBFE[i]` |
| *Wins & Losses per Com* | mazos `i < 142` con `+0x888[i] ≠ 0`, por **dueño**: `+0x888` / `+0x9A4` |
| *Number of "Bonuses"* | `+0x848[i]` para los 32 bonos **menos el 30** (*Lucky Name*, que nunca se da) |
| *Trading Info.* / *Fusion Info.* | `+0x4E`, `+0x4C` / `+0x52`, `+0x50`, `+0x54` |
| *Player's Attack Rate* | `uso[k]·1000/total` de `+0x36`, como `%3d.%1d%` |
| *Speciality Data of Each Card* | `0x801DE80C`: por especialidad Σ rondas ganadas/perdidas y copias de las cartas 0..190, ordenadas por rondas ganadas (burbuja estable: empate → orden Fire, Ice, Nature, Darkness, Rare), filas *"Rank 1ST..5TH"* y *"All Cards"* |
| *COM / 2P Battle Results*, *Number of Saves* | `+0x18/+0x1A`, `+0x1C/+0x1E`, `+0x0D` |
| títulos | Tamer, Collector, 2P y *"You're "<título>"!"* (§4.2 de `02`) |

`+0x0D` (*Number of Saves*) sube al guardar en la tarjeta (`OPENSEG 0x801EF6C4`), con tope 255.

## 4. Mazo base y Auto Deck (SUBSEG) ✅

* **Mazo base** (`SUBSEG 0x801E11D4`, *"Do you want to choose from a Base Deck?"*): antes, `SLUS 0x800461C0`
  marca `b14` en cada mazo conocido cuyas 30 cartas tienes (copias ≥ las que pide). **El bit no se borra.**
  La lista muestra los conocidos y solo se puede elegir uno con `b14`; copia sus 30 cartas al mazo.
  Un mazo con una carta Partner nunca cumple (las copias de los Partner en la colección son 0).
* **Auto Deck** (`SUBSEG 0x801F10D8`, menú `0x801F0024`: *Specialty* · *Offensive / Defensive* ·
  *Option Cards Many / Few* · *Create*):
  1. 20 grupos: especialidad × {R (y A), C, U}, Options **ofensivas** (15) y **defensivas** (16) según
     `SUBSEG 0x801F228C` (un byte 0/1 por carta 191..300), Digivolve (17). Cada carta que tienes entra
     `min(copias, 4)` veces; Partners y Armor no. Cada grupo se baraja: `swap(i, |rand() % n|)`.
  2. Especialidad "segunda": la que más cartas tiene en sus 3 grupos, sin contar la elegida (empate → la última).
  3. Plantilla `SUBSEG 0x801DF9B4`: Many = 10 Options, 10 R, 6 C, 4 U · Few = 5, 12, 8, 5.
  4. Options: el tipo preferido, luego Digivolve, luego el otro tipo.
  5. Las cartas Partner de las ranuras, después R (cuentan los Partner), C y U de la especialidad elegida,
     completando cada nivel con la segunda.
  6. Si faltan cartas para 30: todos los grupos en orden, lo que quede.

## 5. Nombre del jugador y del mazo ✅

* *User Registration* (`OPENSEG 0x801E7EC4`): *"Please enter your nickname for this World."*, antes de
  *STARTER SELECT*. El cursor no pasa de la posición 11 (`OPENSEG 0x801E7D24`): **12 letras**. Vacío →
  *"A name has not been entered!"*; después *"Is this name OK?"*. 🟡 Empieza con el nombre actual
  (`"Player"`). ❓ El juego de caracteres exacto (teclado en pantalla); el remake acepta ASCII imprimible sin `*`.
* Nombre del mazo (`SUBSEG 0x801E0A60`): también 12 letras.

## 6. Intercambio: qué copia viaja (corrige `03` §5) ✅

* `OPENSEG 0x801E195C` elige el número de serie: el **primero** de las copias del que da que sea distinto de
  **alguna** copia del que recibe (o la primera copia). Por eso puede entregar una serie que el otro ya tiene,
  aunque el límite (`0x801E1840`) cuente solo las que no tiene.
* `0x801E1C8C` (dar): quita esa copia (las siguientes suben), recalcula rangos y `+0x4E += 1` (tope 9999).
* `0x801E1AA4` (recibir): pone la serie, `0x20` si el byte era 0, `+1` copia, `0x10` si llega a 6 o la carta
  no se fusiona, **`|= 0xC8`** (`0x08` = recibida por intercambio, `0x40`, `0x80`), recalcula rangos y
  `+0x4C += 1` (tope 9999).
* `OPENSEG 0x801E48CC`: el bit 11 de `+0x28` (hizo intercambio) se pone en los dos bloques **antes** de mover
  cartas, así que ningún intercambio da el título *Legendary Collector*.

## 7. Batalla 2P (*2 Player Battle*, OPENSEG) ✅ / 🟡

* Cada jugador carga su partida y juega con su mazo activo y sus compañeros.
* Resultado (`SLUS 0x80041A1C` → `0x8003EC4C` sin la parte de CPU): para cada bloque, el slot de mazo usado
  suma victoria o derrota (§1), y `+0x1C` / `+0x1E` (tope 999). No hay EXP, ni sobre, ni récords de CPU.
  Rondas por carta para los dos (§2); poder máximo solo para el jugador 1.
* 🟡 Quién empieza (al azar, como en la historia) y dónde se cuenta `+0x36` (uso de ◯△✕): el remake lo cuenta
  en cada revelación de ataque de cada jugador.
* ❓ Si el juego exige registros distintos, como el intercambio. El remake solo exige dos partidas distintas.
