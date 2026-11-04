# 01 — El mundo y los guiones (formato MSCD, intérprete, ciudades, rivales, recompensas)

Fuentes: disco extraído (C.DRV, B.DRV, P.DRV, SLUS_013.28), `src/data/decks.json`, `src/data/cards.json`.
Herramientas (todas en `PROG\w01\`): `cdrv.py` (lee ficheros de los DRV sin copiarlos), `msdis.py` (desensamblador
MSCD), `pp.py` (listado legible, se regenera: `python -I pp.py CITY03`), `cfa.py` (análisis de flujo + condiciones),
`report.py` (genera las tablas por ciudad), `gates.py` (condiciones exactas DNF de entrada a cada torneo),
`flags.py` (índice de quién pone cada flag → `flags_index.txt`), `chk9.py`. Direcciones = RAM PSX (SLUS en
0x80010000, overlays P.DRV en 0x801DDF38). "vN" = variable N del guion.

Leyenda: ✅ verificado en código/datos · 🟡 probable (se dice por qué) · ❓ desconocido.

---

## 0. Resumen

- ✅ Los guiones MSCD son bytecode de una **VM común en SLUS 0x80020F54**; cada overlay aporta su propio
  manejador de "comandos" (op 10–14). Las ciudades (CITY00..11) las ejecuta **SAISEG** (manejador 0x801E390C),
  no SUGSEG. No existe comprobación de la firma "MSCD" en código (se salta la cabecera: código = base+16).
- ✅ El `CITYxx.MSD` que se ejecuta realmente es el bloque tipo 2 / id 200+xx dentro de `C:\AREAxx.PAK`
  (idéntico byte a byte a `C.DRV DEBUG/CITYxx.MSD`, que es la copia de depuración).
- ✅ **Batalla = `CMD11.2(N)`**, N = índice de DECK2.DEK (296 batallas en los 12 guiones; en 296/296 el que habla
  antes coincide con `owner` de decks.json). Tras la batalla el guion se reanuda y **v1 = 1 si ganó el jugador**.
- ✅ Recompensas por guion: `CMD13.1(c1,c2,c3)` da hasta 3 cartas por id; `CMD11.9(p)` da un sobre (tabla de 16
  sobres en SLUS 0x8006E31C); `CMD11.17(N)` presta al jugador el mazo DECK2[N] para la siguiente batalla;
  `CMD11.16(n)` Digi-Part; los Digi-Eggs se registran sólo por flags (`CMD11.12` es no-op en SAISEG).
- ✅ Las 12 zonas (orden de índice = save+0x0E = nº de PAK): Beginner, Flame, Jungle, Igloo, Junk, Dark,
  Desert Island, Pyramid, Sky, Steep Road, Wiseman Tower, Infinity Tower. Cada una se abre en el mapa con el flag
  **v(282+i)**; los guiones ponen esos flags (tabla §6).
- ✅ Cada ciudad tiene hasta 8 "torneos" (slots v274..v281) con 1–6 rondas; T0 = torneo de historia (da el
  Passcode), el resto son torneos de fases posteriores / Extra Arenas. Condiciones exactas en §9.1 y tablas en §9.2.

---

## 1. Formato de fichero MSCD ✅

| Offset | Tipo | Valor / significado | Evidencia |
|---|---|---|---|
| +0x00 | char[4] | "MSCD" (no se comprueba en código) | búsqueda de la constante en EXE+overlays: 0 resultados |
| +0x04 | u32 | 3 (versión) en los 16 ficheros | datos |
| +0x08 | u32 | **fin del código** (= tamaño del fichero en todos) | VM: `vm+0x10 = hdr+8` (SLUS 0x80020E68) y bucle `while (pc-base) < end` (0x80021910) |
| +0x0C | u32 | **nº de variables** (CITY 372, UNIT 30, BETA 10) | SAISEG reserva `372*4` (0x801E4E30 `addiu a0,zero,372`) |
| +0x10 | … | código (no hay tablas de offsets ni tabla de textos separada: el texto va *inline*) | VM: `vm+4 = vm+8 = base+16` |

Instrucción = `u16 op, u16 a` + operandos, y el PC se **alinea a 4** tras cada instrucción (SLUS 0x800218E4..EC).
Saltos: `destino = base + 16 + u32` (relativos al inicio del código).

| op | tamaño | formato | semántica (SLUS 0x80020F54, tabla de saltos 0x80010060) |
|---|---|---|---|
| 5 | 8 | `05 00 xx xx · u32 t` | `goto code+t` |
| 6 | 4+len | `06 00 len · bytes[len]` | comando "texto inline" devuelto al host (no lo usa ningún guion de ciudad) |
| 7 | 12 | `07 00 var · u16 sub · u16 mode · u32 val` | `v[var] (=,+=,-=,*=,/=,%=, =rand()%(x+1))[sub 0..6] x`; x = val si mode=0, `v[val]` si ≠0 (tabla 0x80010088) |
| 8 | 6+len | `08 00 var · u16 len · bytes[len]` | `v[var] = puntero a los bytes inline` (así se pasan todas las cadenas: `v4 = "texto"`) |
| 9 | 12 | `09 00 var · u16 sub · u16 mode · u32 val` | **salta la instrucción siguiente si** `v[var] (==,<=,<,!=,>,>=)[sub 0..5] x` (tabla 0x800100A8). Si la propia op9 está siendo saltada, también salta la siguiente (encadenado = OR) |
| 10..14 | 4+4k | `op · u16 cmd · k×(u16 mode,u16 val)` | **comando del host** con k = op−10 parámetros (mode 0 = inmediato, ≠0 = `v[val]` (16 bits bajos)). La VM guarda `vm+0x14=ptr, +0x18=op, +0x1A=cmd, +0x1C..=params` y devuelve 1 |

- ✅ En los 16 guiones toda op9 va seguida de op5 (`chk9.py`): el compilador emite `if (!cond) goto L`. En los
  listados `pp.py` se muestra ya plegado como `if (vX OP n) goto L`.
- ✅ Struct VM (40 B, SLUS 0x80020E34): +0 base, +4 código, +8 PC, +0xC PC−base, +0x10 fin, +0x14 ptr comando
  pendiente, +0x18 op, +0x1A cmd, +0x1C params[4] (u16), +0x24 halt (0x80021954 lo borra, 0x8002195C lo pone).
  Retorno: 1 = comando pendiente, 0 = fin de código, −1 = parado.
- ✅ Texto: ASCII + SJIS de 2 bytes (0x81..0x98) + escapes `*` letra [dígito] (impresor SAISEG 0x801DFE70:
  `*a`..`*w` validados en tabla 0x801DE294). Uso observado 🟡: `*cN` color, `*h0` nombre del jugador, `*bN` icono
  de botón, `*eN` icono de nivel, `*sN`/`*wN` tamaño/espaciado. Comillas = byte 0x22.
- ✅ Dónde vive cada guion y quién lo ejecuta (llamadas a 0x80020F54):

| Guion | Carga | Host (paso VM) | nvars | Persistencia |
|---|---|---|---|---|
| CITY00..11 | SAISEG 0x801EB628: `sprintf("C:\area%2.2d.pak", save+0x0E)`, bloque (tipo 2, id 200+área) vía 0x8001BB44 → ctx(+0x100C)+0x190 | SAISEG 0x801E390C | 372 | ✅ §3 |
| EVENT/UNIT0k.MSD | EVOSEG 0x801E8708 `"C:\EVENT\unit0%d.MSD"`, k = arg de 0x8002ECDC | EVOSEG 0x801E81C4 | 30 | ❓ |
| B:\BETA.MSD (tutorial) | KAWSEG 0x801EA708 (pone ctx_batalla+0x81F=1) | KAWSEG 0x801EAB4C (también 0x801F663C) | 10 | — |
| otros | SUGSEG 0x801E8678; EVOSEG 0x801EE69C (196 vars; 🟡 E:\SKILL\SKILL%d.MSD) | | | |

Nota: el mismo número de comando significa cosas distintas en cada host (p.ej. en UNIT el texto se imprime con
CMD10.0 y se pagina con CMD10.11; en BETA `CMD12.1(slot, carta)` rellena el mazo "Practice"). Este documento
decodifica en detalle sólo el host de ciudades (SAISEG).

---

## 2. Ciclo de ejecución de una ciudad ✅

1. SAISEG main 0x801E4D80 crea el objeto guion (0x801E4700: `{msd, vm, vars}` → global 0x801F4838), reserva 372
   vars (0x801E46AC), las carga de la partida (0x801E0B70) y pone v0=1.
2. 0x801E390C ejecuta la VM y despacha comandos: op10 → tabla 0x801DE494 (23 cmds), op11 → tabla 0x801DE4F4 (22),
   op13 → 0x801E44B4 (cmd 0,1). Op12/op14 no se usan en ciudades.
3. Comandos que **salen del guion** escriben código de salida en 0x801F4695 (=0x801F4588+0x10D) y argumento en
   0x801F4678 (+0xF0), guardan el PC (ctx+0x198 o save+0x30) y ponen v0=0. SAISEG (0x801E5240, tabla 0x801DE5D4)
   lanza:

| Código | Comando | Destino | Vuelta |
|---|---|---|---|
| 1 | `CMD11.2(N)` | SLUS 0x800416D8(N): carga kawseg.bin + DECK2.DEK, copia el registro N (110 B) a `*0x8006E054+8`, índice en +4, batalla | recarga saiseg; ctx+0x1A6 = resultado |
| 2 | `CMD10.9` | 0x8002EE50(1) → SUBSEG | SAISEG |
| 3 | `CMD11.6(k)` | 0x8002E8EC → OPENSEG con save+0x0F=k, PC en save+0x30 | SAISEG |
| 4 | `CMD11.4(k)` | 0x8002ECDC(k) → EVOSEG tarea 0x801E8E88(k) → UNIT0k.MSD | SAISEG |
| 5 | `CMD10.17` | 0x8002F074(1) → SUBSEG | SAISEG |
| 6 | `CMD11.19(k)` | 0x8004A2DC(k): k=0 → vídeo/STR (0x80064B04) y vuelta al título; k≠0 → ENDSEG 0x801DF47C(…,k) | SAISEG |

4. ✅ Resultado de batalla: 0x800416D8 recibe s0 de la tarea de batalla; si no es tutorial (ctx_batalla+0x81F==0):
   s0==0 → **save+0x18 (victorias)++**, si no **save+0x1A (derrotas)++** (tope 999). Al volver, SAISEG 0x801E5E68
   restaura el PC y hace **v1 = ctx+0x1A6 XOR 1** (0x801E5F6C) ⇒ v1=1 ganó el jugador. Coherente con el texto: tras
   `if (v1 == 0)` vienen las frases de victoria del rival en 296/296 batallas.

---

## 3. Variables de guion de ciudad

| Rango | Almacenamiento | Uso | Estado |
|---|---|---|---|
| v0 | RAM | 1 = seguir; 0 = salir (lo ponen los comandos de salida) | ✅ 0x801E4E50, 0x801E3CD8 |
| v1 | RAM | resultado de menú (1..n, −1 cancelar), de batalla (1 = victoria), de CMD10.16 (victorias), de CMD11.21, de CMD10.15 (palabra clave) | ✅/🟡 |
| v2 | RAM | NPC elegido en el Battle Cafe (= id pasado a CMD11.3) | 🟡 (dispatch `if v2==k` ↔ CMD11.3(k) y hablante) |
| v3 | RAM | aleatorio (`v3 = rand%(n)` → 0..n) | ✅ op7 sub 6 |
| v4 | RAM | puntero de texto para CMD10.4 | ✅ |
| v5..v11 | RAM | presentación del rival de torneo (CMD10.13): v9 nombre, v10 retrato, v5 máscara de tipos, v6/v7/v8 Ataque/Defensa/Velocidad (1–4), v11 ❓ | 🟡 (Babamon v5=28,v6..8=2 = "Fire Nature Water, 2/2/2" en FAQ) |
| v12..v362 | **bits** en save+0x23FC (12 u32): bit (v−12) | flags de historia | ✅ carga 0x801E0B70, guardado 0x801E0A74 |
| v363..v371 | **bytes** en save+0x242C | contadores | ✅ mismas funciones |

Flags notables (todas ✅ por código de guion o de SAISEG):

| Flag | Significado | Evidencia |
|---|---|---|
| v282..v293 | ciudad i = v−282 visible/abierta en el mapa | SAISEG 0x801EFF24, tabla 0x801DE964 = [282..293], test 0x801EC108 |
| v287 / v291 | además abren los nodos 12/13 (Mega/Giga Area) y 14/15 (Giga/Tera) del mapa | 0x801F0018..0x801F005C |
| v268..v272 | rondas ganadas en el torneo en curso (se ponen a 0 al volver al menú de ciudad) | guiones |
| v274..v281 | "dentro del torneo slot T0..T3 / X0..X3" (para reanudar tras batalla/guardado) | prólogo de cada CITY |
| v294, v298, v301, v304, v307, v310 | compañero obtenido: Veemon, Hawkmon, Armadillomon, Patamon, Gatomon, Wormmon | SAISEG 0x801E0988 tabla 0x801DE2F0 (mismo orden que SLUS 0x8006E518) 🟡 nombres |
| v308, v311 … | Digi-Egg recibido (p.ej. v308 Huevo de la Luz de Gatomon, v311 del Valor de Wormmon) | CITY10 @0x5E84/0x5F14 |
| v317 | tiene ya los 3 compañeros base (Ken da Veemon/Hawkmon/Armadillomon, CITY09 @0x551C..) | 🟡 |
| v323..v332 | palabra clave 0..9 ya usada (Wizardmon, Sky City) | CITY08 |
| v351..v358 | ciudad donde aparece el Apokarimon "errante" (se re-sortea al vencerle) | CITY00 @0xA8AC… |
| v359 | Apokarimon ya vencido en esta visita (v359=0 al entrar en la ciudad) | prólogo |
| v360 | ≥300 victorias y v89 (BK MetalGarurumon vencido) → torneo T3 de Beginner (BlackWarGreymon) | CITY00 @0x4C..0x8C (CMD10.16 + `v1>=300`) |
| v361 | ≥200 victorias y v248 → torneo T2 de Igloo (BK MetalGarurumon) | CITY03 @0x20..0x60 |
| v362 | estamos en el submenú "Menu" de la ciudad | |
| v363 | victorias contra Nanimon (5 → Digi-Part 45; 10 → Grand Sevens + Nanimon) | CITY11 |
| v364 | victorias desde el último Apokarimon (≥10 lo hace aparecer) | `v364 += 1` en cada victoria |
| v365 | victorias seguidas en esta visita contra el NPC especial (Rosemon 10 → Download Digivolve; Piedmon 5 → Dark Sevens…) | prólogo `v365 = 0` |
| v366..v371 | nº de batallas con Davis/Keely/Cody/T.K./Kari/Ken (2/5/8 → te prestan mazo DECK2 145..157) | CITY01/02/03/07/08/09 |
| v160, v187, v245, v226, v248 | fases globales (ver §7) | |

✅ **% de juego completado**: todas las ciudades repiten en su prólogo `CMD10.19` (save+0x14 = 0) y 120 bloques
`if (vN) CMD11.18(w)` (save+0x14 += w); la suma de pesos es 166. SAISEG 0x801E1738 calcula `pts*1000/166`
(décimas de %). Pesos (flag:peso), extraídos de CITY00: `v12:3 v13:1 v14:1 v15:1 v23:1 v26:1 v30:1 v31:1 v32:4 v33:1 v34:1 v35:1 v36:1 v48:1 v50:1 v55:1 v56:5 v57:1 v58:1 v59:1 v60:1 v61:1 v62:1 v79:1 v80:1 v82:1 v87:5 v89:1 v90:1 v91:1 v92:1 v93:1 v106:1 v108:1 v112:1 v117:1 v119:5 v120:2 v121:1 v131:1 v133:1 v138:5 v139:1 v140:1 v154:1 v156:1 v160:5 v168:4 v169:1 v170:1 v171:1 v177:1 v186:4 v187:1 v188:1 v189:1 v195:1 v204:4 v205:4 v213:1 v215:1 v219:1 v224:5 v225:1 v226:1 v245:5 v246:1 v247:1 v248:1 v265:1 v266:1 v267:1 v282:1 v283:1 v284:1 v285:1 v286:1 v287:1 v288:1 v289:1 v290:1 v291:1 v292:1 v293:1 v313:1 v314:1 v315:1 v316:1 v317:1 v318:1 v319:1 v320:1 v323:1 v324:1 v325:1 v326:1 v327:1 v328:1 v329:1 v330:1 v331:1 v332:1 v333:1 v334:1 v335:1 v336:1 v337:1 v338:1 v339:1 v340:1 v341:1 v342:1 v343:1 v344:1 v345:1 v346:1 v347:1 v349:1 v360:1 v361:1`

---

## 4. Comandos del host de ciudades (SAISEG 0x801E390C)

| Cmd | Handler | Semántica | Estado |
|---|---|---|---|
| 10.0 | 0x801E39D0 | inicio de escena / fundido (tarea 0x801E55F8) | 🟡 (siempre tras CMD11.8 al entrar) |
| 10.1 | 0x801E3A6C | ejecuta el menú montado con 11.0/11.1 → v1. Antes guarda vars a la partida (0x801E0A74), simula cada opción (v1=1..n con 0x801E1190) y restaura | ✅ código / 🟡 uso |
| 10.2 | 0x801E3B00 | abre la vista del Battle Cafe (tarea 0x801E77F4) | 🟡 |
| 10.3 | 0x801E3BC8 | "Who do you want to talk to?" → v2 | 🟡 |
| 10.4 | 0x801E3C04 | imprime línea `v4` (0x801DFC00) | ✅ |
| 10.5 | 0x801E3C30 | espera botón / fin de página | 🟡 |
| 10.6 | 0x801E3C4C | limpia ventana de texto (0x801DFB6C) | 🟡 |
| 10.7 | 0x801E3C60 | guarda vars (0x801E0D8C) y abre pantalla SAISEG 0x801E186C (lee save+0x14 = % completado; si v15 y botón → ENDSEG(2)) | 🟡 ❓ cuál pantalla |
| 10.9 | 0x801E3CD8 | salida 2 → SUBSEG | ✅ |
| 10.10/10.11 | 0x801E3CF4 / 0x801E3D1C | tarea 0x801F2ABC / reinicia lista 0x801F4698 (sólo Igloo, Steep Road, con 11.10) | ❓ |
| 10.12 | 0x801E3D54 | animación de entrada a la arena (tarea 0x801E8DD8) | 🟡 |
| 10.13 | 0x801E3DF8 | presentación del rival (0x801E84BC, usa v5..v11) | 🟡 |
| 10.14 | → 0x801E45D8 | no-op | ✅ |
| 10.15 | 0x801E3E08 | entrada de texto "KEYWORD" (tarea 0x801EB1F8) → v1 = índice en tabla 0x801F36E0 (10 palabras) o −1/−2 | ✅ tabla e índice→carta (CITY08) / 🟡 escritura de v1 |
| 10.16 | 0x801E3E7C | v1 = save+0x18 (victorias) | ✅ |
| 10.17 | 0x801E3E98 | salida 5 → SUBSEG | ✅ |
| 10.18 | 0x801E3EB4 | save+0x28 \|= 0x400 (habilita intercambio de cartas; texto de MetalGreymon) | ✅ código / 🟡 significado (no se localizó el lector del bit) |
| 10.19 | 0x801E3ED4 | save+0x14 = 0 | ✅ |
| 10.20/10.21 | tareas 0x801E9F28 / 0x801E9F18 | efectos de Infinity Tower | ❓ |
| 10.22 | 0x801E3F2C | rótulo con v9 (0x80019EA4) | 🟡 |
| 11.0(x) | 0x801E0174 | abre menú (x=120: 5 huecos grandes; otro: 3 pequeños) | 🟡 |
| 11.1(id) | 0x801E0390 | añade opción gráfica id (recorte `(id−12)*16` de textura) | 🟡 ids: 0..7 sitios de la ciudad (1 Menu, 2 Battle Cafe, 3 Battle Arena, 4 Extra Arena, 7 Fusion Shop, 5/6 otras arenas 🟡), 8/9 entrar/no, 12/13/14 hablar/batalla/info, 16/17 sí/no, 15/18/19 submenú |
| **11.2(N)** | 0x801E3FD8 | **batalla vs DECK2[N]**; ctx+0x1A9=1, ctx+0x198=PC, salida 1 | ✅ |
| 11.3(n) | 0x801E4028 | añade el NPC n al Battle Cafe (0x801E0C54) | 🟡 |
| **11.4(k)** | 0x801E4044 | Fusion Shop: EVOSEG + UNIT0k (k=0 Flame, 1 Pyramid, 2 Wiseman) | ✅ |
| 11.6(k) | 0x801E407C | salida 3 → OPENSEG con save+0x0F=k (k=1 desde "Menu": 🟡 guardar; k=2..5 en arenas ❓) | ✅ código |
| 11.7(x) | 0x801E40E4 | ctx+0x1A7 = x | ❓ |
| 11.8(x) | 0x801E4108 | escena/lugar actual (ctx+0x1A8): 1 = Battle Cafe, 2 = Arena, 0/3/4/5/0xFFFF otros | 🟡 |
| **11.9(p)** | 0x801E4138 | **da sobre p** (tarea 0x801F0ECC modo 0 → SLUS 0x8004635C(0,p)) | ✅ (199/199 textos "You got a X Pack" coinciden con la tabla) |
| 11.10(x) | 0x801E4188 | apila x en 0x801F4698 | ❓ |
| 11.12 | → 0x801E45D8 | **no-op** en SAISEG (el huevo se registra por flag) | ✅ |
| 11.13(n) | 0x801E41C4 | efecto de sonido/jingle (0x8002B498) | 🟡 |
| 11.14(n) | 0x801E41E0 | espera n frames (0x80014C08) | ✅ |
| 11.15(n) | 0x801E41FC | música n (0x8002BA6C(0,n,100), ctx+0x19C=n; n=111 o v184≠0 → no cambia) | ✅ código / 🟡 |
| **11.16(n)** | 0x801E4280 | **Digi-Part n** (tarea 0x801F32CC) | 🟡 (texto "You got a Digi-Part") |
| **11.17(N)** | 0x801E42B0 | **mazo prestado**: ctx+0x1008=N; KAWSEG 0x801F0804 usa DECK2[N] (SLUS 0x8003F9EC) como mazo del jugador en la siguiente batalla en vez del suyo (save+0x2438+save+0x34*0x110) y lo borra | ✅ |
| 11.18(w) | 0x801E42CC | save+0x14 += w (puntos de completado) | ✅ |
| 11.19(k) | 0x801E42F0 | salida 6 (final / ENDSEG) | ✅ código / 🟡 |
| 11.20(k) | 0x801E4370 | tarea 0x801E9E10(k) (efecto) | ❓ |
| 11.21(m) | 0x801E43A0 | comprueba los 3 mazos del jugador con SLUS 0x80046C0C(0,mazo,m); marca válidos en ctx+0x1023..; v1=0 si alguno vale, 1 si ninguno (Desert Island: m=192, "sin cartas Option") | ✅ |
| 13.0(s,a,b) | 0x801E44DC | atenuación/posición de los 2 retratos del diálogo | 🟡 |
| **13.1(c1,c2,c3)** | 0x801E4544 | **da hasta 3 cartas** (0xFFFF = nada): tarea 0x801F0ECC modo 1 → 0x801F1B5C → SLUS 0x80045B18(0,id,1); ids en save+0x2768[3] | ✅ (227/236 textos coinciden; resto = diferencias de nombre, ver Dudas) |

---

## 5. Estructura típica de un CITYxx ✅ (por lectura de los listados)

`L10:` prólogo (reset v359/v365; si v274..v281 → reanudar el torneo correspondiente; música; CMD10.0) →
`La4/L2bc:` v268..v272=0, recálculo de % completado → menú de lugares ("Where do you want to go?", CMD11.0(120)
+ CMD11.1 ids) → Battle Cafe (CMD11.8(1); NPCs con CMD11.3 condicionados por flags; CMD10.3 → bloque por NPC con
submenú Hablar/Batalla/Info) | Battle Arena (despacho por flags al torneo vigente; "Battle Arena is closed" si
ninguno) | Extra/otras arenas | Fusion Shop (CMD11.4) | Menu (v362=1; submenú: CMD10.9, CMD10.17, CMD11.6(1)) |
cancelar → fin del guion (vuelta al mapa).

Torneo: `vSLOT=1; CMD11.8(2); CMD10.12;` luego por ronda: presentación (v5..v11, CMD10.13), menú Batalla/Info,
`CMD11.2(N)`, si gana `v26x=1` y siguiente ronda; si pierde → fuera (`vSLOT=0`). Tras la última ronda: premios.

---

## 6. Las 12 zonas y su desbloqueo ✅

Nombres: tabla OPENSEG 0x801F0684 (12 ciudades + 4 "Area" + 4 entradas); arenas 0x801F06D4 (4 por ciudad).
El índice coincide con `CITYxx`/`AREAxx.PAK` (save+0x0E, SAISEG 0x801EB644) y con el texto de Passcode de cada guion.

| i | Zona | Flag mapa | Se pone en | Condición (necesaria) |
|---|---|---|---|---|
| 0 | Beginner City | v282 | CITY00 @0x0040, primera entrada | — |
| 1 | Flame City | v283 | CITY00 @0xC978, 1ª victoria torneo T0 (Agumon→Babamon) junto a v12 | v54 (hablar con Babamon) |
| 2 | Jungle City | v284 | CITY01 @0xC8C8, 1ª victoria T0 (Meramon→Phoenixmon→Veemon) | v40, v69 |
| 3 | Igloo City | v285 | CITY02 @0x34A0, hablar con Veedramon (NPC 3 del Cafe) tras el torneo T0 (…→Wormmon) | (NPC condicionado) |
| 4 | Junk City | v286 | CITY03 @0x4214, Garurumon (NPC 3 del Cafe) tras vencerle (DECK2 138) | v114, v286!=1 |
| 5 | Dark City | v287 | CITY04 @0xD608, 1ª victoria T1 (Hagurumon→ShellNumemon→KingSukamon) | v119, v136 |
| 6 | Desert Island | v288 | CITY00 @0x6498, hablar con Tai en el Cafe (Tai sólo aparece con **v245**, fin de Infinity Tower) | v245 |
| 7 | Pyramid City | v289 | CITY05 @0x17D0, Wormmon (tras el torneo de Dark City) | v138, v142 |
| 8 | Sky City | v290 | CITY07 @0xB974, 1ª victoria T0 (Centarumon→Tyrannomon→Angemon) | v150, v175, v176 |
| 9 | Steep Road | v291 | CITY08 @0xD1D4, 1ª victoria T0 (Wizardmon→AeroVeedramon→Gatomon) | v194 |
| 10 | Wiseman Tower | v292 | CITY09 @0xD290, 1ª victoria T1 (…→Gigadramon) | v204, v211 |
| 11 | Infinity Tower | v293 | CITY10 @0x6188/0x6398, MetalGreymon tras el torneo T0 (también CMD10.18 = intercambio) | v224, v233 |

Orden de historia resultante: 0→1→2→3→4→5→7→8→9→10→11→(fase 2) 6. Los nodos de área 12..15 del mapa se abren con
v287 (Dark City) y v291 (Steep Road).

---

## 7. Fases globales y post-game ✅ (flags) / 🟡 (interpretación)

| Flag | Se pone | Efecto (despachos de arena/NPC que lo prueban) |
|---|---|---|
| v245 (+v184) | CITY11 T0 (…→Machinedramon→VenomMyotismon) y evento "?????????" | Tai aparece en Beginner (→ Desert Island); v184=1 = "mundo corrupto" de Infinity Tower (bloquea música/torneos; lo devuelve a 0 la batalla final) |
| v160 | CITY06 T0 (Leomon→Devimon→MetalEtemon→Myotismon, sin cartas Option) | abre T1 en Beginner y NPCs de fase 2 en varias ciudades |
| v187 | CITY08 T1 (Gatomon→Nefertimon→Tylomon) | abre T2 de Beginner |
| v226 | CITY10 T2 (…→Omnimon) | abre X0 de Flame (Imperialdramon), T3 de Infinity |
| v248 | CITY11 T3 (…→Apokarimon 114) | con ≥200 victorias → v361 → T2 de Igloo (BK MetalGarurumon) |
| v89 | CITY03 T2 (BK MetalGarurumon) | con ≥300 victorias → v360 → T3 de Beginner (BlackWarGreymon); su victoria lanza `CMD11.19(1)` (ENDSEG) |
| v167 | CITY11 (Rosemon) | batalla final X0 contra "A" (DECK2 140 Darkness Wave) y `CMD11.19(0)` (final) |

---

## 8. Recompensas definidas por guion ✅

Todas las recompensas de batalla/evento salen de los guiones (no hay tabla de botín en código para estas):
1. **Torneo T0 (1ª vez)**: Passcode (flag de mapa), sobre del color de la ciudad y **1 carta al azar de 8**
   (`v3 = rand%7` → 0..7). El pool depende del compañero elegido: `v298` (Hawkmon) / `v301` (Armadillomon) /
   resto. En fases posteriores (`v317`) el pool es de 4 cartas. Repeticiones: sólo el sobre.
2. **Torneos T1..T3/X**: 1ª vez sobre (a veces S-sobre) + flag; repeticiones: el mismo sobre.
3. **Batallas de Cafe**: normalmente `v364 += 1` y con p=1/10 un sobre (`v3=rand%9`, sólo el caso 9 da sobre);
   primeras victorias contra ciertos NPC dan sobre fijo/carta (p.ej. Rosemon: S-Option + Rosemon's Lure la 1ª
   vez; 10 seguidas en una visita → Download Digivolve).
4. **Contadores**: Davis/Keely/Cody/T.K./Kari/Ken: a las 2/5/8 batallas te prestan mazos (CMD11.17 DECK2 145..157);
   Nanimon; Apokarimon errante (S-Black Pack + p=1/10 carta Apokarimon, y se mueve a otra ciudad).
5. **Digi-Parts** (CMD11.16): 61 Flame, 85 Jungle, 86 Igloo, 92 Pyramid, 99/114 Steep Road, 45 Infinity.
6. **Palabras clave** (CMD10.15, Wizardmon en Sky City): 0 OMNIMON-1→carta 1, 1 WARGREYMON→2, 2 OMNIMON-2→35,
   3 MTLGARURUMON→37, 4 A-VEEDRAMON→72, 5 H-KBUTERIMON→74, 6 VENOMMYOTIS→106, 7 PIEDMON→107, 8 MTLETEMON→141,
   9 JIJIMON→143 (una vez cada una, flags v323..v332). Tabla: SAISEG 0x801F36E0 (punteros a cadenas).

---

## 9. Tablas decodificadas por ciudad

### 9.1 Condiciones EXACTAS de entrada a cada torneo (DNF, `gates.py`) ✅

Caminos desde el menú de lugares hasta `vSLOT = 1` (OR de conjunciones). "[lugar]" = opción del menú.

```
### CITY00 Beginner City
  T0 @0b1d8 [Battle Arena]: v360!=1 & v187!=1 & v160!=1 & v54==1
  T1 @0cd9c [Battle Arena]: v360!=1 & v187!=1 & v160==1 & v27==1
  T2 @0e4f8 [Battle Arena]: v360!=1 & v187==1 & v28==1
  T3 @0fcfc [Battle Arena]: v360==1 & v29==1
### CITY01 Flame City
  T0 @0ab08 [Battle Arena]: v40==1 & v69!=0
  T1 @0cd34 [Extra Arena]: v226!=1 & v215!=1 & v26!=1 & v52==1
  T2 @0e594 [Extra Arena]: v226!=1 & v215!=1 & v26==1
  T3 @0fbe4 [Extra Arena]: v226!=1 & v215==1
  X0 @112f8 [Extra Arena]: v226==1
### CITY02 Jungle City
  T0 @0b674 [Battle Arena]: v56!=1 & v67==1
  T1 @0db6c [Battle Arena]: v56==1 & v84==1
  T2 @16c88 [item5]: v81==1
  T3 @0fef0 [Extra Arena]: v36!=1 & v35!=1 & v34!=1 & v83==1
  X0 @11a9c [Extra Arena]: v36!=1 & v35!=1 & v34==1
  X1 @134e8 [Extra Arena]: v36!=1 & v35==1
  X2 @14fbc [Extra Arena]: v36==1
### CITY03 Igloo City
  T0 @0c628 [Battle Arena]: v248!=1 & v80!=1 & v87!=1 & v134!=0 & v98!=0 & v113==1
  T1 @0e94c [Battle Arena]: v248!=1 & v80!=1 & v87==1 & v286==1
  T2 @12460 [Battle Arena]: v248==1 & v361!=0 & v118==1
  X3 @10d18 [Battle Arena]: v248!=1 & v80==1 & v106==1  OR  v248==1 & v361==0 & v106==1
  T3 @13e94 [Extra Arena]: v62!=1 & v61!=1 & v60!=1 & v110==1
  X0 @15a94 [Extra Arena]: v62!=1 & v61!=1 & v60==1
  X1 @173d8 [Extra Arena]: v62!=1 & v61==1
  X2 @18c84 [Extra Arena]: v62==1
### CITY04 Junk City
  T0 @08ebc [Battle Arena]: v13!=1 & v119!=1 & v123==1
  T1 @0b4e4 [Battle Arena]: v13!=1 & v119==1 & v136==1
  T2 @0dab0 [Battle Arena]: v13==1 & v135==1
### CITY05 Dark City
  T0 @09060 [Battle Arena]: v138!=1 & v142==1
  T1 @0c890 [Battle Arena]: v138==1 & v157==1
  T2 @0f66c [item6]: v152==1
### CITY06 Desert Island
  T0 @051fc [Battle Arena]: v165==1
### CITY07 Pyramid City
  T0 @09728 [Battle Arena]: v175==1 & v176!=0 & v150!=0
  T1 @0beb4 [Extra Arena]: v92!=1 & v91!=1 & v179==1
  T2 @0db30 [Extra Arena]: v92!=1 & v91==1
  T3 @0f544 [Extra Arena]: v92==1
### CITY08 Sky City
  T0 @0ac3c [Battle Arena]: v194==1
  T1 @0da64 [Extra Arena]: v171!=1 & v170!=1 & v197==1
  T2 @0fa78 [Extra Arena]: v171!=1 & v170==1
  T3 @116c8 [Extra Arena]: v171==1
### CITY09 Steep Road
  T0 @091b0 [Battle Arena]: v204!=1 & v209==1
  T1 @0b588 [Battle Arena]: v204==1 & v211==1
### CITY10 Wiseman Tower
  T0 @0ab08 [Battle Arena]: v226!=1 & v247!=1 & v225!=1 & v246!=1 & v233==1  OR  v226!=1 & v247!=1 & v225==1 & v233==1  OR  v226==1 & v233==1
  T1 @0ee5c [Battle Arena]: v226!=1 & v247!=1 & v225!=1 & v246==1 & v244==1
  T2 @12994 [Battle Arena]: v226!=1 & v247==1 & v243==1
### CITY11 Infinity Tower
  T0 @0a694 [Battle Arena]: v248!=1 & v226!=1 & v225!=1 & v156!=1 & v245!=1 & v253==1
  T1 @0eaa8 [Battle Arena]: v248!=1 & v226!=1 & v225!=1 & v156==1 & v246!=1 & v259==1
  T2 @11280 [Battle Arena]: v248!=1 & v226!=1 & v225==1 & v265!=1 & v247!=1 & v262==1  OR  v248!=1 & v226!=1 & v225==1 & v265==1  OR  v248==1 & v265!=1 & v247!=1 & v262==1  OR  v248==1 & v265==1
  T3 @13574 [Battle Arena]: v248!=1 & v226==1 & v264==1
  X0 @17984 [Battle Arena]: v167==1
```

### 9.2 Batallas, NPCs y efectos al ganar (`report.py`)

Cómo leerlas:
- "Cond. necesarias" = intersección de condiciones de todos los caminos que llegan a la batalla (análisis de
  flujo *must*; ✅ son necesarias, pero si la entrada real es una disyunción ver §9.1). Se ocultan v268..v281/v362.
- "Efectos al ganar" = lo que ejecuta la rama `v1≠0` hasta la siguiente batalla/menú: `[cond]` = condición
  sobre flags; `1 de {…} (rand/8)` = pool equiprobable; `(p=1/10)` = premio sólo en 1 de 10 resultados del
  `rand`; `flags:` = asignaciones a variables persistentes.
- NPC "default" = rama por defecto del despacho de v2 (no se pudo atribuir a un único CMD11.3).
- Deck = índice DECK2 + nombre (dueño) de `decks.json`; cartas = id + nombre de `cards.json`.

#### CITY00 — Beginner City

**Torneos** (slot T0..T3 = v274..v277, X0..X3 = v278..v281; ronda = 1 + nº de v268..v272 a 1)

| Slot | Ronda | @pc | Rival (deck DECK2) | Cond. necesarias (∩ caminos) | Efectos al ganar |
|---|---|---|---|---|---|
| T0 | 1 | 0b5a0 | 1 Tricolor Starter (Agumon) | v54==1, v160!=1, v187!=1, v360!=1 | flags: v364+=1 |
| T0 | 2 | 0bc2c | 3 New Power (Babamon) | v54==1, v160!=1, v187!=1, v360!=1 | [v12!=1] PACK 9 Option<br>[v12!=1 & v298!=1 & v301!=1] 1 de {113 SkullGreymon, 114 Phantomon, 115 WaruMonzaemon, 116 Andromon, 8 MasterTyrannomon, 9 MetalGreymon, 10 Vermilimon, 11 Meteormon} (rand/8)<br>[v12!=1 & v298==1] 1 de {147 Monzaemon, 148 MetalMamemon, 149 Mamemon, 150 Etemon, 77 Angewomon, 78 Lillymon, 79 MegaKabuterimon, 80 Piximon} (rand/8)<br>[v12!=1 & v298!=1 & v301==1] 1 de {42 MegaSeadramon, 43 WaruSeadramon, 44 Brachiomon, 45 BlueMeramon, 147 Monzaemon, 148 MetalMamemon, 149 Mamemon, 150 Etemon} (rand/8)<br>[v12==1] PACK 9 Option<br>flags: v364+=1, v12=1 [v12!=1], v283=1 |
| T1 | 1 | 0d190 | 2 Penguinmon Color (Penguinmon) | v27==1, v160==1, v187!=1, v360!=1 | flags: v364+=1 |
| T1 | 2 | 0d714 | 118 Rose Garden (Rosemon) | v27==1, v160==1, v187!=1, v360!=1 | flags: v364+=1 |
| T1 | 3 | 0de34 | 53 Digivolution! (Greymon) | v27==1, v160==1, v187!=1, v360!=1 | [v13!=1] PACK 9 Option<br>[v13==1] PACK 9 Option<br>flags: v364+=1, v13=1 [v13!=1] |
| T2 | 1 | 0e81c | 118 Rose Garden (Rosemon) | v28==1, v187==1, v360!=1 | flags: v364+=1 |
| T2 | 2 | 0edb4 | 53 Digivolution! (Greymon) | v28==1, v187==1, v360!=1 | flags: v364+=1 |
| T2 | 3 | 0f594 | 79 Fire Heart (WarGreymon) | v28==1, v187==1, v360!=1 | [v14!=1] PACK 9 Option<br>[v14==1] PACK 9 Option<br>flags: v364+=1, v14=1 [v14!=1] |
| T3 | 1 | 10010 | 53 Digivolution! (Greymon) | v29==1, v360==1 | flags: v364+=1 |
| T3 | 2 | 10600 | 79 Fire Heart (WarGreymon) | v29==1, v360==1 | flags: v364+=1 |
| T3 | 3 | 10ee0 | 115 Black Fire Heart (BK WarGreymon) | v29==1, v360==1 | [v15!=1] PACK 15 S-Option<br>[v15==1] PACK 15 S-Option<br>flags: v364+=1, v15=1 [v15!=1] |

**Battle Cafe / NPCs** (v2 = id de NPC de CMD11.3)

| NPC (v2) | Hablante | Aparece si (CMD11.3) | @pc | Deck | Cond. necesarias | Efectos al ganar |
|---|---|---|---|---|---|---|
| 10 | Betamon | - | 02080 | 0 Tutorial (Betamon) | v23!=1 | - |
| 10 | Betamon | - | 024f0 | 0 Tutorial (Betamon) | v23==1 | - |
| 10 | Betamon | - | 0283c | 139 Betamon (Betamon) | v15!=1, v23==1 | - |
| 10 | Betamon | - | 0284c | 141 Pick Up (Betamon) | v15==1, v23==1 | - |
| 1 | Agumon | v12!=0, v13!=1, v14!=1, v160!=1, v187!=1 / v13==1, v14!=1, v187!=1 / v14==1 | 033a0 | 1 Tricolor Starter (Agumon) | - | - |
| 2 | Penguinmon | v12!=0, v13!=0 | 03b3c | 2 Penguinmon Color (Penguinmon) | - | flags: v364+=1 |
| 3 | Rosemon | v160==1 | 04edc | 118 Rose Garden (Rosemon) | - | [v31!=1 & v340!=1 & v365!=10] PACK 15 S-Option; CARD 292 Rosemon's Lure<br>[v340!=1 & v365==10] CARD 293 Download Digivolve<br>PACK 15 S-Option (p=1/10)<br>flags: v364+=1, v365+=1, v31=1 [v31!=1 & v340!=1 & v365!=10], v340=1 [v340!=1 & v365==10] |
| 4 | Greymon | v13!=1, v14!=1, v160==1, v187!=1 / v13==1, v14!=1, v187!=1 / v14==1 | 05d14 | 53 Digivolution! (Greymon) | v27==1 | PACK 9 Option (p=1/10)<br>flags: v364+=1 |
| 5 | Tai | v245!=0 | 06e80 | 80 Go All The Way (Tai) | v20==1 | [v26!=1] PACK 15 S-Option<br>[v26==1] PACK 15 S-Option (p=1/10)<br>flags: v364+=1, v26=1 [v26!=1] |
| 9 | Babamon | v160!=1 | 08174 | 3 New Power (Babamon) | v54==1 | PACK 9 Option (p=1/10)<br>flags: v364+=1 |
| 6 | WarGreymon | v14!=1, v187==1 / v14==1 | 08e18 | 79 Fire Heart (WarGreymon) | v28==1 | PACK 9 Option (p=1/10)<br>flags: v364+=1 |
| 7 | BlackWarGreymon | v360!=0 | 09ef0 | 115 Black Fire Heart (BK WarGreymon) | v29==1 | PACK 15 S-Option (p=1/10)<br>flags: v364+=1 |
| 8 | Apokarimon | v352!=0, v364>=10 | 0a8ac | 121 Desperate Space (Apokarimon) | v359!=1 | PACK 13 S-Black<br>CARD 103 Apokarimon (p=1/10)<br>flags: v359=1, v351=0, v352=0, v353=0, v354=0, v355=0, v356=0, v357=0, v358=0, v364=0, v351=1, v352=1, v353=1, v354=1, v355=1, v356=1, v357=1 |

**Desbloqueos / eventos**

- desbloquea mapa Beginner City (v282=1) @00040 [v282!=1]
- desbloquea mapa Desert Island (v288=1) @06498 [-]
- desbloquea mapa Flame City (v283=1) @0c978 [v54==1, v160!=1, v187!=1, v360!=1]
- ENDSEG(1) @1128c [v29==1, v360==1]


#### CITY01 — Flame City

**Torneos** (slot T0..T3 = v274..v277, X0..X3 = v278..v281; ronda = 1 + nº de v268..v272 a 1)

| Slot | Ronda | @pc | Rival (deck DECK2) | Cond. necesarias (∩ caminos) | Efectos al ganar |
|---|---|---|---|---|---|
| T0 | 1 | 0aebc | 4 Burning Hot! (Meramon) | v40==1, v69!=0 | flags: v364+=1 |
| T0 | 2 | 0b528 | 5 Big Red Sky (Phoenixmon) | v40==1, v69!=0 | flags: v364+=1 |
| T0 | 3 | 0bc0c | 6 Go Go Dinosaur (Veemon) | v40==1, v69!=0 | [v32!=1] PACK 4 Red<br>[v298!=1 & v301!=1 & v32!=1] 1 de {113 SkullGreymon, 114 Phantomon, 115 WaruMonzaemon, 116 Andromon, 8 MasterTyrannomon, 9 MetalGreymon, 10 Vermilimon, 11 Meteormon} (rand/8)<br>[v298==1 & v32!=1] 1 de {147 Monzaemon, 148 MetalMamemon, 149 Mamemon, 150 Etemon, 77 Angewomon, 78 Lillymon, 79 MegaKabuterimon, 80 Piximon} (rand/8)<br>[v298!=1 & v301==1 & v32!=1] 1 de {42 MegaSeadramon, 43 WaruSeadramon, 44 Brachiomon, 45 BlueMeramon, 147 Monzaemon, 148 MetalMamemon, 149 Mamemon, 150 Etemon} (rand/8)<br>[v32==1] PACK 4 Red<br>flags: v364+=1, v32=1 [v32!=1], v284=1 |
| T1 | 1 | 0d1cc | 54 Strong-V (ExVeemon) | v26!=1, v52==1, v215!=1, v226!=1 | flags: v364+=1 |
| T1 | 2 | 0d864 | 55 Rocket Bomb (Flamedramon) | v26!=1, v52==1, v215!=1, v226!=1 | flags: v364+=1 |
| T1 | 3 | 0df38 | 56 Raiden Blade (Raidramon) | v26!=1, v52==1, v215!=1, v226!=1 | [v33!=1] PACK 4 Red<br>[v33==1] PACK 4 Red<br>flags: v364+=1, v33=1 [v33!=1] |
| T2 | 1 | 0e854 | 55 Rocket Bomb (Flamedramon) | v26==1, v215!=1, v226!=1 | flags: v364+=1 |
| T2 | 2 | 0edc0 | 56 Raiden Blade (Raidramon) | v26==1, v215!=1, v226!=1 | flags: v364+=1 |
| T2 | 3 | 0f540 | 81 Three Signs (Paildramon) | v26==1, v215!=1, v226!=1 | [v34!=1] PACK 4 Red<br>[v34==1] PACK 4 Red<br>flags: v364+=1, v34=1 [v34!=1] |
| T3 | 1 | 0fec0 | 56 Raiden Blade (Raidramon) | v215==1, v226!=1 | flags: v364+=1 |
| T3 | 2 | 104c0 | 81 Three Signs (Paildramon) | v215==1, v226!=1 | flags: v364+=1 |
| T3 | 3 | 10c74 | 103 Miracle Knight's (Magnamon) | v215==1, v226!=1 | [v35!=1] PACK 10 S-Red<br>[v35==1] PACK 10 S-Red<br>flags: v364+=1, v35=1 [v35!=1] |
| X0 | 1 | 115dc | 81 Three Signs (Paildramon) | v226==1 | flags: v364+=1 |
| X0 | 2 | 11c10 | 103 Miracle Knight's (Magnamon) | v226==1 | flags: v364+=1 |
| X0 | 3 | 12408 | 110 Invincible Emperor (Imperialdramon) | v226==1 | [v36!=1] PACK 10 S-Red<br>[v36==1] PACK 10 S-Red<br>flags: v364+=1, v36=1 [v36!=1] |

**Battle Cafe / NPCs** (v2 = id de NPC de CMD11.3)

| NPC (v2) | Hablante | Aparece si (CMD11.3) | @pc | Deck | Cond. necesarias | Efectos al ganar |
|---|---|---|---|---|---|---|
| default | Meramon | ? | 01abc | 4 Burning Hot! (Meramon) | - | flags: v364+=1 |
| 2 | Phoenixmon | v32!=0 | 0213c | 5 Big Red Sky (Phoenixmon) | - | flags: v364+=1 |
| 3 | Veemon | v32!=0, v245!=1 / v26!=1, v32!=0, v215!=1, v226!=1, v245==1 / v13==1, v26!=1, v32!=0, v33==1, v215!=1, v226!=1, v245==1 | 028e8 | 6 Go Go Dinosaur (Veemon) | - | PACK 4 Red (p=1/10)<br>flags: v364+=1 |
| 4 | Davis | - | 04500 | 27 Fire Heart (Davis) | v40==1 | [v55!=1] PACK 4 Red<br>[v55==1] PACK 4 Red (p=1/5)<br>[v342!=1] DIGIPART(61)<br>flags: v364+=1, v366+=1 [v245!=0 & v317!=0], v55=1 [v55!=1], v366=0 [v366==9], v342=1 [v342!=1] |
| 5 | ExVeemon | v13==1, v26!=1, v32!=0, v33!=1, v55!=0, v215!=1, v226!=1, v245==1 / v13==1, v26!=1, v32!=0, v33==1, v215!=1, v226!=1, v245==1 / v26==1, v32!=0, v34==1, v215!=1, v226!=1, v245==1 | 05444 | 54 Strong-V (ExVeemon) | - | - |
| 13 | Flamedramon | v13==1, v26!=1, v32!=0, v33==1, v215!=1, v226!=1, v245==1 / v26==1, v32!=0, v34==1, v215!=1, v226!=1, v245==1 / v32!=0, v35==1, v215==1, v226!=1, v245==1 | 059c4 | 55 Rocket Bomb (Flamedramon) | - | flags: v364+=1 |
| 6 | Raidramon | v13==1, v26!=1, v32!=0, v33==1, v215!=1, v226!=1, v245==1 / v26==1, v32!=0, v34==1, v215!=1, v226!=1, v245==1 / v32!=0, v35==1, v215==1, v226!=1, v245==1 | 06038 | 56 Raiden Blade (Raidramon) | - | PACK 4 Red (p=1/10)<br>flags: v364+=1 |
| 7 | Paildramon | v26==1, v32!=0, v34!=1, v215!=1, v226!=1, v245==1 / v26==1, v32!=0, v34==1, v215!=1, v226!=1, v245==1 / v32!=0, v35==1, v215==1, v226!=1, v245==1 | 067d8 | 81 Three Signs (Paildramon) | - | PACK 4 Red (p=1/10)<br>flags: v364+=1 |
| 8 | Magnamon | v32!=0, v35!=1, v215==1, v226!=1, v245==1 / v32!=0, v35==1, v215==1, v226!=1, v245==1 / v32!=0, v36==1, v226==1, v245==1 | 06ff0 | 103 Miracle Knight's (Magnamon) | - | PACK 10 S-Red (p=1/10)<br>flags: v364+=1 |
| 9 | Imperialdramon | v32!=0, v36!=1, v226==1, v245==1 / v32!=0, v36==1, v226==1, v245==1 | 079a4 | 110 Invincible Emperor (Imperialdramon) | - | PACK 10 S-Red (p=1/10)<br>[v333!=1 & v365==5] CARD 285 Wild Sevens<br>flags: v364+=1, v365+=1, v333=1 [v333!=1 & v365==5] |
| 10 | Garudamon | v26!=0, v32!=0, v245==1 | 0865c | 82 Sun's Gift (Garudamon) | v47==1 | [v48!=1] PACK 10 S-Red<br>[v48==1] PACK 10 S-Red (p=1/10)<br>flags: v364+=1, v48=1 [v48!=1] |
| 11 | Sora | v26!=0, v32!=0, v245==1 | 09258 | 83 Hyper Digivolution (Sora) | - | [v50!=1] PACK 10 S-Red<br>[v50==1] PACK 10 S-Red (p=1/10)<br>flags: v364+=1, v50=1 [v50!=1] |
| 12 | Apokarimon | v32!=0, v245==1, v353!=0, v364>=10 | 09ca4 | 122 Desperate Space (Apokarimon) | v359!=1 | PACK 13 S-Black<br>CARD 103 Apokarimon (p=1/10)<br>flags: v359=1, v351=0, v352=0, v353=0, v354=0, v355=0, v356=0, v357=0, v358=0, v364=0, v351=1, v352=1, v353=1, v354=1, v355=1, v356=1, v357=1 |

**Desbloqueos / eventos**

- PLAYERDECK 145 Flame @042d0 [v40==1, v294!=1, v317!=0, v366==2]
- PLAYERDECK 146 Raidra @043e4 [v40==1, v294!=1, v317!=0, v366!=2, v366==5]
- PLAYERDECK 147 Magna @044f8 [v40==1, v294!=1, v317!=0, v366!=2, v366!=5, v366==8]
- DIGIPART(61) @04858 [v40==1, v342!=1]
- desbloquea mapa Jungle City (v284=1) @0c8c8 [v40==1, v69!=0]
- FUSIONSHOP(UNIT00) @12ae4 [-]


#### CITY02 — Jungle City

**Torneos** (slot T0..T3 = v274..v277, X0..X3 = v278..v281; ronda = 1 + nº de v268..v272 a 1)

| Slot | Ronda | @pc | Rival (deck DECK2) | Cond. necesarias (∩ caminos) | Efectos al ganar |
|---|---|---|---|---|---|
| T0 | 1 | 0ba80 | 7 Quick Digivolve (Vegiemon) | v56!=1, v67==1 | flags: v364+=1 |
| T0 | 2 | 0c188 | 8 Switching (Ninjamon) | v56!=1, v67==1 | flags: v364+=1 |
| T0 | 3 | 0ca8c | 9 V For Victory (Veedramon) | v56!=1, v67==1 | flags: v364+=1 |
| T0 | 4 | 0d34c | 10 Tryout (Wormmon) | v56!=1, v67==1 | flags: v364+=1, v56=1 |
| T1 | 1 | 0de4c | 7 Quick Digivolve (Vegiemon) | v56==1, v84==1 | flags: v364+=1 |
| T1 | 2 | 0e44c | 8 Switching (Ninjamon) | v56==1, v84==1 | flags: v364+=1 |
| T1 | 3 | 0ec70 | 9 V For Victory (Veedramon) | v56==1, v84==1 | [v57!=1] PACK 6 Green<br>[v317!=0 & v57!=1] 1 de {77 Angewomon, 78 Lillymon, 79 MegaKabuterimon, 80 Piximon} (rand/4)<br>[v298!=1 & v301!=1 & v317==0 & v57!=1] 1 de {113 SkullGreymon, 114 Phantomon, 115 WaruMonzaemon, 116 Andromon, 8 MasterTyrannomon, 9 MetalGreymon, 10 Vermilimon, 11 Meteormon} (rand/8)<br>[v298==1 & v317==0 & v57!=1] 1 de {147 Monzaemon, 148 MetalMamemon, 149 Mamemon, 150 Etemon, 77 Angewomon, 78 Lillymon, 79 MegaKabuterimon, 80 Piximon} (rand/8)<br>[v298!=1 & v301==1 & v317==0 & v57!=1] 1 de {42 MegaSeadramon, 43 WaruSeadramon, 44 Brachiomon, 45 BlueMeramon, 147 Monzaemon, 148 MetalMamemon, 149 Mamemon, 150 Etemon} (rand/8)<br>[v57==1] PACK 6 Green<br>flags: v364+=1, v57=1 [v57!=1] |
| T3 | 1 | 10344 | 57 Quick Draw (Hawkmon) | v34!=1, v35!=1, v36!=1, v83==1 | flags: v364+=1 |
| T3 | 2 | 10af0 | 58 Storm Bringer (Aquilamon) | v34!=1, v35!=1, v36!=1, v83==1 | flags: v364+=1 |
| T3 | 3 | 113e4 | 59 Burning Love (Halsemon) | v34!=1, v35!=1, v36!=1, v83==1 | [v59!=1] PACK 6 Green<br>[v59==1] PACK 6 Green<br>flags: v364+=1, v59=1 [v59!=1] |
| X0 | 1 | 11dc0 | 58 Storm Bringer (Aquilamon) | v34==1, v35!=1, v36!=1 | flags: v364+=1 |
| X0 | 2 | 124fc | 59 Burning Love (Halsemon) | v34==1, v35!=1, v36!=1 | flags: v364+=1 |
| X0 | 3 | 12d78 | 84 Ninja (Shurimon) | v34==1, v35!=1, v36!=1 | [v60!=1] PACK 6 Green<br>[v60==1] PACK 6 Green<br>flags: v364+=1, v60=1 [v60!=1] |
| X1 | 1 | 137c8 | 59 Burning Love (Halsemon) | v35==1, v36!=1 | flags: v364+=1 |
| X1 | 2 | 13eb8 | 84 Ninja (Shurimon) | v35==1, v36!=1 | flags: v364+=1 |
| X1 | 3 | 14764 | 104 Storm Tamer (Sylphymon) | v35==1, v36!=1 | [v61!=1] PACK 12 S-Green<br>[v61==1] PACK 12 S-Green<br>flags: v364+=1, v61=1 [v61!=1] |
| X2 | 1 | 152e8 | 84 Ninja (Shurimon) | v36==1 | flags: v364+=1 |
| X2 | 2 | 159e4 | 104 Storm Tamer (Sylphymon) | v36==1 | flags: v364+=1 |
| X2 | 3 | 163e8 | 111 Warrior Princess (Valkyrimon) | v36==1 | [v62!=1] PACK 12 S-Green<br>[v62==1] PACK 12 S-Green<br>flags: v364+=1, v62=1 [v62!=1] |
| T2 | 1 | 1707c | 77 Head-On Collision (Kuwagamon) | v59!=0, v81==1 | flags: v364+=1 |
| T2 | 2 | 17888 | 8 Switching (Ninjamon) | v59!=0, v81==1 | flags: v364+=1 |
| T2 | 3 | 18164 | 78 Beetle Cross (HerculesKabuterimon) | v59!=0, v81==1 | [v58!=1] PACK 12 S-Green<br>[v58==1] PACK 12 S-Green<br>flags: v364+=1, v58=1 [v58!=1] |

**Battle Cafe / NPCs** (v2 = id de NPC de CMD11.3)

| NPC (v2) | Hablante | Aparece si (CMD11.3) | @pc | Deck | Cond. necesarias | Efectos al ganar |
|---|---|---|---|---|---|---|
| default | Vegiemon | ? | 01b24 | 7 Quick Digivolve (Vegiemon) | - | flags: v364+=1 |
| 2 | Ninjamon | v56!=0 | 0230c | 8 Switching (Ninjamon) | - | flags: v364+=1 |
| 3 | Veedramon | v56!=0 | 038ec | 9 V For Victory (Veedramon) | v84==1 | PACK 6 Green (p=1/10)<br>flags: v364+=1 |
| 4 | Keely | - | 04a74 | 28 Bingo!! (Keely) | v67==1 | [v82!=1] PACK 6 Green<br>[v82==1] PACK 6 Green (p=1/5)<br>[v343!=1] DIGIPART(85)<br>flags: v364+=1, v367+=1 [v245!=0 & v317!=0], v82=1 [v82!=1], v367=0 [v367==6], v343=1 [v343!=1] |
| 5 | Kuwagamon | v58!=0, v59!=0 | 05318 | 77 Head-On Collision (Kuwagamon) | - | flags: v364+=1 |
| 6 | HerculesKabuterimon | v59!=0 | 05dc4 | 78 Beetle Cross (HerculesKabuterimon) | v81==1 | PACK 12 S-Green (p=1/10)<br>flags: v364+=1 |
| 7 | Hawkmon | v33==1, v34!=1, v35!=1, v36!=1, v59!=1, v82!=0 / v33==1, v34!=1, v35!=1, v36!=1, v59==1 / v34==1, v35!=1, v36!=1, v60==1 | 06ca8 | 57 Quick Draw (Hawkmon) | - | flags: v364+=1 |
| 8 | Aquilamon | v33==1, v34!=1, v35!=1, v36!=1, v59==1 / v34==1, v35!=1, v36!=1, v60==1 / v35==1, v36!=1, v61==1 | 07320 | 58 Storm Bringer (Aquilamon) | - | - |
| 9 | Halsemon | v33==1, v34!=1, v35!=1, v36!=1, v59==1 / v34==1, v35!=1, v36!=1, v60==1 / v35==1, v36!=1, v61==1 | 07af8 | 59 Burning Love (Halsemon) | - | PACK 6 Green (p=1/10)<br>flags: v364+=1 |
| 10 | Shurimon | v34==1, v35!=1, v36!=1, v60!=1 / v34==1, v35!=1, v36!=1, v60==1 / v35==1, v36!=1, v61==1 | 0833c | 84 Ninja (Shurimon) | - | PACK 6 Green (p=1/10)<br>flags: v364+=1 |
| 11 | Sylphymon | v35==1, v36!=1, v61!=1 / v35==1, v36!=1, v61==1 / v36==1, v62==1 | 08b94 | 104 Storm Tamer (Sylphymon) | - | PACK 12 S-Green (p=1/10)<br>flags: v364+=1 |
| 12 | Valkyrimon | v36==1, v62!=1 / v36==1, v62==1 | 095a4 | 111 Warrior Princess (Valkyrimon) | - | PACK 12 S-Green (p=1/10)<br>flags: v364+=1 |
| 13 | Lillymon | v50!=0 | 0a0e0 | 85 Flower Fairies (Lillymon) | v77==1 | [v79!=1] PACK 12 S-Green<br>[v79==1] PACK 12 S-Green (p=1/10)<br>flags: v364+=1, v79=1 [v79!=1] |
| 14 | Mimi | v50!=0 | 0aea4 | 86 Princess (Mimi) | - | [v80!=1] PACK 12 S-Green<br>[v80==1] PACK 12 S-Green (p=1/10)<br>flags: v364+=1, v80=1 [v80!=1] |

**Desbloqueos / eventos**

- desbloquea mapa Igloo City (v285=1) @034a0 [-]
- PLAYERDECK 148 Holse @0495c [v67==1, v298!=1, v317!=0, v367==2]
- PLAYERDECK 149 Shuri @04a6c [v67==1, v298!=1, v317!=0, v367==5, v367!=2]
- DIGIPART(85) @04db0 [v67==1, v343!=1]


#### CITY03 — Igloo City

**Torneos** (slot T0..T3 = v274..v277, X0..X3 = v278..v281; ronda = 1 + nº de v268..v272 a 1)

| Slot | Ronda | @pc | Rival (deck DECK2) | Cond. necesarias (∩ caminos) | Efectos al ganar |
|---|---|---|---|---|---|
| T0 | 1 | 0c9e4 | 11 Hearty Meal (Frigimon) | v80!=1, v87!=1, v98!=0, v113==1, v134!=0, v248!=1 | flags: v364+=1 |
| T0 | 2 | 0d110 | 12 Guarding Sea (Whamon) | v80!=1, v87!=1, v98!=0, v113==1, v134!=0, v248!=1 | flags: v364+=1 |
| T0 | 3 | 0d984 | 13 Fightback (Garurumon) | v80!=1, v87!=1, v98!=0, v113==1, v134!=0, v248!=1 | flags: v364+=1 |
| T0 | 4 | 0e100 | 14 Black Storm (Stingmon) | v80!=1, v87!=1, v98!=0, v113==1, v134!=0, v248!=1 | flags: v364+=1, v87=1 |
| T1 | 1 | 0ebf0 | 11 Hearty Meal (Frigimon) | v80!=1, v87==1, v248!=1, v286==1 | flags: v364+=1 |
| T1 | 2 | 0f190 | 12 Guarding Sea (Whamon) | v80!=1, v87==1, v248!=1, v286==1 | flags: v364+=1 |
| T1 | 3 | 0f9b0 | 138 Fightback (Garurumon) | v80!=1, v87==1, v248!=1, v286==1 | [v88!=1] PACK 5 Blue<br>[v317!=0 & v88!=1] 1 de {42 MegaSeadramon, 43 WaruSeadramon, 44 Brachiomon, 45 BlueMeramon} (rand/4)<br>[v298!=1 & v301!=1 & v317==0 & v88!=1] 1 de {113 SkullGreymon, 114 Phantomon, 115 WaruMonzaemon, 116 Andromon, 8 MasterTyrannomon, 9 MetalGreymon, 10 Vermilimon, 11 Meteormon} (rand/8)<br>[v298==1 & v317==0 & v88!=1] 1 de {147 Monzaemon, 148 MetalMamemon, 149 Mamemon, 150 Etemon, 77 Angewomon, 78 Lillymon, 79 MegaKabuterimon, 80 Piximon} (rand/8)<br>[v298!=1 & v301==1 & v317==0 & v88!=1] 1 de {42 MegaSeadramon, 43 WaruSeadramon, 44 Brachiomon, 45 BlueMeramon, 147 Monzaemon, 148 MetalMamemon, 149 Mamemon, 150 Etemon} (rand/8)<br>[v88==1] PACK 5 Blue<br>flags: v364+=1, v88=1 [v88!=1] |
| X3 | 1 | 10fc0 | 11 Hearty Meal (Frigimon) | v106==1 | flags: v364+=1 |
| X3 | 2 | 11560 | 12 Guarding Sea (Whamon) | v106==1 | flags: v364+=1 |
| X3 | 3 | 11db0 | 88 Shoot Everything! (MetalGarurumon) | v106==1 | PACK 11 S-Blue<br>flags: v364+=1 |
| T2 | 1 | 1272c | 138 Fightback (Garurumon) | v118==1, v248==1, v361!=0 | flags: v364+=1 |
| T2 | 2 | 12cf4 | 88 Shoot Everything! (MetalGarurumon) | v118==1, v248==1, v361!=0 | flags: v364+=1 |
| T2 | 3 | 13574 | 116 Patriot (BK MetalGarurumon) | v118==1, v248==1, v361!=0 | [v89!=1] PACK 11 S-Blue<br>[v89==1] PACK 11 S-Blue<br>flags: v364+=1, v89=1 [v89!=1] |
| T3 | 1 | 1433c | 60 Mountain Crusher (Armadillomon) | v60!=1, v61!=1, v62!=1, v110==1 | flags: v364+=1 |
| T3 | 2 | 14b08 | 61 Rock Head (Ankylomon) | v60!=1, v61!=1, v62!=1, v110==1 | flags: v364+=1 |
| T3 | 3 | 15364 | 62 Mountain CrusherDX (Digmon) | v60!=1, v61!=1, v62!=1, v110==1 | [v90!=1] PACK 8 Yellow<br>[v90==1] PACK 8 Yellow<br>flags: v364+=1, v90=1 [v90!=1] |
| X0 | 1 | 15d78 | 61 Rock Head (Ankylomon) | v60==1, v61!=1, v62!=1 | flags: v364+=1 |
| X0 | 2 | 16474 | 62 Mountain CrusherDX (Digmon) | v60==1, v61!=1, v62!=1 | flags: v364+=1 |
| X0 | 3 | 16c54 | 87 Yellow Submarine (Submarimon) | v60==1, v61!=1, v62!=1 | [v91!=1] PACK 8 Yellow<br>[v91==1] PACK 8 Yellow<br>flags: v364+=1, v91=1 [v91!=1] |
| X1 | 1 | 176bc | 62 Mountain CrusherDX (Digmon) | v61==1, v62!=1 | flags: v364+=1 |
| X1 | 2 | 17d64 | 87 Yellow Submarine (Submarimon) | v61==1, v62!=1 | flags: v364+=1 |
| X1 | 3 | 18548 | 105 Ancient Legend (Shakkoumon) | v61==1, v62!=1 | [v92!=1] PACK 14 S-Yellow<br>[v92==1] PACK 14 S-Yellow<br>flags: v364+=1, v92=1 [v92!=1] |
| X2 | 1 | 18f78 | 87 Yellow Submarine (Submarimon) | v62==1 | flags: v364+=1 |
| X2 | 2 | 195b8 | 105 Ancient Legend (Shakkoumon) | v62==1 | flags: v364+=1 |
| X2 | 3 | 19de8 | 112 Permafrost (Vikemon) | v62==1 | [v93!=1] PACK 14 S-Yellow<br>[v93==1] PACK 14 S-Yellow<br>flags: v364+=1, v93=1 [v93!=1] |

**Battle Cafe / NPCs** (v2 = id de NPC de CMD11.3)

| NPC (v2) | Hablante | Aparece si (CMD11.3) | @pc | Deck | Cond. necesarias | Efectos al ganar |
|---|---|---|---|---|---|---|
| default | Frigimon | ? | 01c20 | 11 Hearty Meal (Frigimon) | - | flags: v364+=1 |
| 2 | Whamon | v87!=0 | 02570 | 12 Guarding Sea (Whamon) | - | flags: v364+=1 |
| 3 | Garurumon | v80!=1 / v80==1, v108==1 | 03e68 | 138 Fightback (Garurumon) | v114==1 | PACK 5 Blue (p=1/10)<br>flags: v364+=1, v286=1 [v286!=1] |
| 4 | Cody | - | 05aa0 | 29 Ready To Go (Cody) | v98==1 | [v117!=1] PACK 8 Yellow<br>[v117==1] PACK 8 Yellow (p=1/5)<br>[v344!=1] DIGIPART(86)<br>flags: v364+=1, v368+=1 [v245!=0 & v317!=0], v117=1 [v117!=1], v368=0 [v368==6], v344=1 [v344!=1] |
| 5 | Armadillomon | v59==1, v60!=1, v61!=1, v62!=1, v90!=1, v117!=0 / v59==1, v60!=1, v61!=1, v62!=1, v90==1, v117!=0 / v60==1, v61!=1, v62!=1, v91==1 | 06a18 | 60 Mountain Crusher (Armadillomon) | - | flags: v364+=1 |
| 6 | Ankylomon | v59==1, v60!=1, v61!=1, v62!=1, v90==1, v117!=0 / v60==1, v61!=1, v62!=1, v91==1 / v61==1, v62!=1, v92==1 | 06ffc | 61 Rock Head (Ankylomon) | - | - |
| 7 | Digmon | v59==1, v60!=1, v61!=1, v62!=1, v90==1, v117!=0 / v60==1, v61!=1, v62!=1, v91==1 / v61==1, v62!=1, v92==1 | 077b0 | 62 Mountain CrusherDX (Digmon) | - | PACK 8 Yellow (p=1/10)<br>flags: v364+=1 |
| 8 | Submarimon | v60==1, v61!=1, v62!=1, v91!=1 / v60==1, v61!=1, v62!=1, v91==1 / v61==1, v62!=1, v92==1 | 07fb0 | 87 Yellow Submarine (Submarimon) | - | PACK 8 Yellow (p=1/10)<br>flags: v364+=1 |
| 9 | Shakkoumon | v61==1, v62!=1, v92!=1 / v61==1, v62!=1, v92==1 / v62==1, v93==1 | 08874 | 105 Ancient Legend (Shakkoumon) | - | PACK 14 S-Yellow (p=1/10)<br>flags: v364+=1 |
| 10 | Vikemon | v62==1, v93!=1 / v62==1, v93==1 | 091ec | 112 Permafrost (Vikemon) | - | PACK 11 S-Blue (p=1/10)<br>flags: v364+=1 |
| 11 | MetalGarurumon | v80==1, v108!=1 / v80==1, v108==1 | 09ce0 | 88 Shoot Everything! (MetalGarurumon) | v105==1 | [v106!=1] PACK 11 S-Blue<br>[v106==1] PACK 11 S-Blue (p=1/10)<br>flags: v364+=1, v106=1 [v106!=1] |
| 12 | Matt | v80!=0 | 0a860 | 89 Bonding (Matt) | - | [v108!=1] PACK 11 S-Blue<br>[v108==1] PACK 11 S-Blue (p=1/10)<br>flags: v364+=1, v108=1 [v108!=1] |
| 13 | BKMetalGarurumon | v247!=0, v361!=0 | 0b444 | 116 Patriot (BK MetalGarurumon) | v118==1 | [v339!=1] CARD 291 Reverse Sevens<br>[v339==1] PACK 11 S-Blue (p=1/10)<br>flags: v364+=1, v112=1, v339=1 [v339!=1] |

**Desbloqueos / eventos**

- desbloquea mapa Junk City (v286=1) @04214 [v114==1, v286!=1]
- PLAYERDECK 150 Dig @05928 [v98==1, v301!=1, v317!=0, v368==2]
- PLAYERDECK 151 Submarine @05a98 [v98==1, v301!=1, v317!=0, v368!=2, v368==5]
- DIGIPART(86) @05e38 [v98==1, v344!=1]


#### CITY04 — Junk City

**Torneos** (slot T0..T3 = v274..v277, X0..X3 = v278..v281; ronda = 1 + nº de v268..v272 a 1)

| Slot | Ronda | @pc | Rival (deck DECK2) | Cond. necesarias (∩ caminos) | Efectos al ganar |
|---|---|---|---|---|---|
| T0 | 1 | 092cc | 15 Toy Party (Hagurumon) | v13!=1, v119!=1, v123==1 | flags: v364+=1 |
| T0 | 2 | 09ae8 | 16 Jam-Jam (ShellNumemon) | v13!=1, v119!=1, v123==1 | flags: v364+=1 |
| T0 | 3 | 0a464 | 17 Hail King Sukamon (KingSukamon) | v13!=1, v119!=1, v123==1 | flags: v364+=1 |
| T0 | 4 | 0ae24 | 18 Evil Fire (Shadramon) | v13!=1, v119!=1, v123==1 | flags: v364+=1, v119=1 |
| T1 | 1 | 0b7d0 | 15 Toy Party (Hagurumon) | v13!=1, v119==1, v136==1 | flags: v364+=1 |
| T1 | 2 | 0bde4 | 16 Jam-Jam (ShellNumemon) | v13!=1, v119==1, v136==1 | flags: v364+=1 |
| T1 | 3 | 0c7a0 | 17 Hail King Sukamon (KingSukamon) | v13!=1, v119==1, v136==1 | [v120!=1] PACK 8 Yellow<br>[v120!=1 & v317!=0] 1 de {147 Monzaemon, 142 Shakkoumon, 145 Vademon, 150 Etemon} (rand/4)<br>[v120!=1 & v298!=1 & v301!=1 & v317==0] 1 de {113 SkullGreymon, 114 Phantomon, 115 WaruMonzaemon, 116 Andromon, 8 MasterTyrannomon, 9 MetalGreymon, 10 Vermilimon, 11 Meteormon} (rand/8)<br>[v120!=1 & v298==1 & v317==0] 1 de {147 Monzaemon, 148 MetalMamemon, 149 Mamemon, 150 Etemon, 77 Angewomon, 78 Lillymon, 79 MegaKabuterimon, 80 Piximon} (rand/8)<br>[v120!=1 & v298!=1 & v301==1 & v317==0] 1 de {42 MegaSeadramon, 43 WaruSeadramon, 44 Brachiomon, 45 BlueMeramon, 147 Monzaemon, 148 MetalMamemon, 149 Mamemon, 150 Etemon} (rand/8)<br>[v120==1] PACK 8 Yellow<br>flags: v364+=1, v120=1 [v120!=1], v287=1 |
| T2 | 1 | 0ded4 | 63 Blitzkrieg (Thundermon) | v13==1, v135==1 | flags: v364+=1 |
| T2 | 2 | 0e6bc | 64 Bean Stalk (MetalMamemon) | v13==1, v135==1 | flags: v364+=1 |
| T2 | 3 | 0ef88 | 65 Star Force (SuperStarmon) | v13==1, v135==1 | [v121!=1] PACK 14 S-Yellow<br>[v121==1] PACK 14 S-Yellow<br>flags: v364+=1, v121=1 [v121!=1] |

**Battle Cafe / NPCs** (v2 = id de NPC de CMD11.3)

| NPC (v2) | Hablante | Aparece si (CMD11.3) | @pc | Deck | Cond. necesarias | Efectos al ganar |
|---|---|---|---|---|---|---|
| 1 | Hagurumon | v119!=0 | 015dc | 15 Toy Party (Hagurumon) | - | flags: v364+=1 |
| 2 | ShellNumemon | v119!=0 | 02080 | 16 Jam-Jam (ShellNumemon) | - | flags: v364+=1 |
| 3 | KingSukamon | - | 03ac4 | 17 Hail King Sukamon (KingSukamon) | v136==1 | PACK 8 Yellow (p=1/10)<br>flags: v364+=1 |
| 4 | Zudomon | v108!=0 | 0458c | 90 Armed (Zudomon) | v130==1 | [v131!=1] PACK 11 S-Blue<br>[v131==1] PACK 11 S-Blue (p=1/10)<br>flags: v364+=1, v131=1 [v131!=1] |
| 5 | Joe | v108!=0 | 050e4 | 91 First Aid (Joe) | - | [v133!=1] PACK 11 S-Blue<br>[v133==1] PACK 11 S-Blue (p=1/10)<br>flags: v364+=1, v133=1 [v133!=1] |
| 7 | Thundermon | v13!=0 | 05ef8 | 63 Blitzkrieg (Thundermon) | v135==1 | flags: v364+=1 |
| 8 | MetalMamemon | v13!=0, v121!=0 | 06604 | 64 Bean Stalk (MetalMamemon) | - | flags: v364+=1 |
| 9 | SuperStarmon | v13!=0, v121!=0 | 06dac | 65 Star Force (SuperStarmon) | - | PACK 14 S-Yellow (p=1/10)<br>flags: v364+=1 |
| 10 | Nanimon | v245!=0, v349!=1 / v245!=0, v349==1 | 07af8 | 119 Who Are You? (Nanimon) | v348==1, v350!=1 | [v349!=1] PACK 15 S-Option<br>[v349==1] PACK 15 S-Option (p=1/10)<br>flags: v364+=1, v363+=1 [v349!=1], v350=1 [v349!=1], v350=1 [v349==1] |
| 11 | Apokarimon | v354!=0, v364>=10 | 08588 | 123 Desperate Space (Apokarimon) | v359!=1 | PACK 13 S-Black<br>CARD 103 Apokarimon (p=1/10)<br>flags: v359=1, v351=0, v352=0, v353=0, v354=0, v355=0, v356=0, v357=0, v358=0, v364=0, v351=1, v352=1, v353=1, v354=1, v355=1, v356=1, v357=1 |

**Desbloqueos / eventos**

- desbloquea mapa Dark City (v287=1) @0d608 [v13!=1, v119==1, v136==1]


#### CITY05 — Dark City

**Torneos** (slot T0..T3 = v274..v277, X0..X3 = v278..v281; ronda = 1 + nº de v268..v272 a 1)

| Slot | Ronda | @pc | Rival (deck DECK2) | Cond. necesarias (∩ caminos) | Efectos al ganar |
|---|---|---|---|---|---|
| T0 | 1 | 094f8 | 19 Get Serious (Wormmon) | v138!=1, v142==1 | flags: v364+=1 |
| T0 | 2 | 09c20 | 20 Black Storm Again (Stingmon) | v138!=1, v142==1 | flags: v364+=1 |
| T0 | 3 | 0a354 | 21 Evil Fire Revived (Shadramon) | v138!=1, v142==1 | flags: v364+=1 |
| T0 | 4 | 0ac00 | 22 Bad Luck Wind (Quetzalmon) | v138!=1, v142==1 | flags: v364+=1 |
| T0 | 5 | 0be1c | 23 Binding Chain (Digimon Emperor) | v138!=1, v142==1 | flags: v364+=1, v138=1 |
| T1 | 1 | 0cd38 | 19 Get Serious (Wormmon) | v138==1, v157==1 | flags: v364+=1 |
| T1 | 2 | 0d47c | 20 Black Storm Again (Stingmon) | v138==1, v157==1 | flags: v364+=1 |
| T1 | 3 | 0dad4 | 21 Evil Fire Revived (Shadramon) | v138==1, v157==1 | flags: v364+=1 |
| T1 | 4 | 0e2f8 | 22 Bad Luck Wind (Quetzalmon) | v138==1, v157==1 | [v139!=1] PACK 7 Black<br>[v139!=1 & v317!=0] 1 de {113 SkullGreymon, 114 Phantomon, 115 WaruMonzaemon, 116 Andromon} (rand/4)<br>[v139!=1 & v298!=1 & v301!=1 & v317==0] 1 de {4 Paildramon, 5 Gigadramon, 6 RealMetalGreymon, 7 Garudamon, 8 MasterTyrannomon, 9 MetalGreymon, 10 Vermilimon, 11 Meteormon} (rand/8)<br>[v139!=1 & v298==1 & v317==0] 1 de {73 Rosemon, 74 HerculesKabuterimon, 75 MagnaAngemon, 76 Sylphymon, 77 Angewomon, 78 Lillymon, 79 MegaKabuterimon, 80 Piximon} (rand/8)<br>[v139!=1 & v298!=1 & v301==1 & v317==0] 1 de {143 Jijimon, 144 Digitamamon, 145 Vademon, 146 Giromon, 147 Monzaemon, 148 MetalMamemon, 149 Mamemon, 150 Etemon} (rand/8)<br>[v139==1] PACK 7 Black<br>flags: v364+=1, v139=1 [v139!=1] |
| T2 | 1 | 0fa20 | 66 Dancing Ghosts (Bakemon) | v152==1 | flags: v364+=1 |
| T2 | 2 | 101b8 | 67 Devil's Call (Devimon) | v152==1 | flags: v364+=1 |
| T2 | 3 | 10978 | 68 Stealth Skull (SkullGreymon) | v152==1 | flags: v364+=1 |
| T2 | 4 | 11324 | 69 Dark Prince (Myotismon) | v152==1 | [v140!=1] PACK 13 S-Black<br>[v140==1] PACK 13 S-Black<br>flags: v364+=1, v140=1 [v140!=1] |

**Battle Cafe / NPCs** (v2 = id de NPC de CMD11.3)

| NPC (v2) | Hablante | Aparece si (CMD11.3) | @pc | Deck | Cond. necesarias | Efectos al ganar |
|---|---|---|---|---|---|---|
| 1 | Wormmon | v138!=1 / v138==1, v157!=1 / v138==1, v157==1 | 02450 | 19 Get Serious (Wormmon) | v142==1 | flags: v364+=1 |
| 2 | Stingmon | v138==1, v157==1 | 02da4 | 20 Black Storm Again (Stingmon) | - | flags: v364+=1 |
| 3 | Shadramon | v138==1, v157==1 | 036c0 | 21 Evil Fire Revived (Shadramon) | - | flags: v364+=1 |
| 4 | Quetzalmon | v138==1, v157==1 | 03d54 | 22 Bad Luck Wind (Quetzalmon) | - | PACK 7 Black (p=1/10)<br>flags: v364+=1 |
| 5 | Bakemon | v24!=0, v140!=0 | 04584 | 66 Dancing Ghosts (Bakemon) | - | flags: v364+=1 |
| 6 | Devimon | v24!=0, v140!=0 | 04dac | 67 Devil's Call (Devimon) | - | flags: v364+=1 |
| 7 | SkullGreymon | v24!=0, v140!=0 | 05434 | 68 Stealth Skull (SkullGreymon) | - | flags: v364+=1 |
| 8 | Myotismon | v24!=0 | 062a8 | 69 Dark Prince (Myotismon) | v152==1 | PACK 13 S-Black (p=1/10)<br>flags: v364+=1 |
| 9 | MegaKabuterimon | v133!=0 | 06dec | 92 Intercepting Traps (MegaKabuterimon) | v153==1 | [v154!=1] PACK 12 S-Green<br>[v154==1] PACK 12 S-Green (p=1/10)<br>flags: v364+=1, v154=1 [v154!=1] |
| 10 | Izzy | v133!=0 | 07a10 | 93 Program (Izzy) | - | [v156!=1] PACK 12 S-Green<br>[v156==1] PACK 12 S-Green (p=1/10)<br>flags: v364+=1, v156=1 [v156!=1], v267=1 |
| 12 | Nanimon | v245!=0, v349!=1 / v245!=0, v349==1 | 08a40 | 128 Who Are You? (Nanimon) | v348==1, v350!=1 | [v349!=1] PACK 15 S-Option<br>[v349==1] PACK 15 S-Option (p=1/10)<br>flags: v364+=1, v363+=1 [v349!=1], v350=1 [v349!=1], v350=1 [v349==1] |

**Desbloqueos / eventos**

- desbloquea mapa Pyramid City (v289=1) @017d0 [v138!=0, v142==1, v157!=1]


#### CITY06 — Desert Island

**Torneos** (slot T0..T3 = v274..v277, X0..X3 = v278..v281; ronda = 1 + nº de v268..v272 a 1)

| Slot | Ronda | @pc | Rival (deck DECK2) | Cond. necesarias (∩ caminos) | Efectos al ganar |
|---|---|---|---|---|---|
| T0 | 1 | 055bc | 49 Battle Gear (Leomon) | v165==1 | flags: v364+=1 |
| T0 | 2 | 05df4 | 50 Cool Devil (Devimon) | v165==1 | flags: v364+=1 |
| T0 | 3 | 066b8 | 51 Steel Gate (MetalEtemon) | v165==1 | flags: v364+=1 |
| T0 | 4 | 06fb4 | 52 Dark Revival (Myotismon) | v165==1 | [v160!=1] PACK 13 S-Black<br>[v160==1] PACK 13 S-Black<br>flags: v364+=1, v160=1 [v160!=1] |

**Battle Cafe / NPCs** (v2 = id de NPC de CMD11.3)

| NPC (v2) | Hablante | Aparece si (CMD11.3) | @pc | Deck | Cond. necesarias | Efectos al ganar |
|---|---|---|---|---|---|---|
| 1 | Leomon | v160!=0 | 0141c | 49 Battle Gear (Leomon) | - | flags: v364+=1 |
| 2 | Devimon | v160!=0 | 01b68 | 50 Cool Devil (Devimon) | - | flags: v364+=1 |
| 3 | MetalEtemon | v160!=0 | 0227c | 51 Steel Gate (MetalEtemon) | - | flags: v364+=1 |
| 4 | Myotismon | - | 03198 | 52 Dark Revival (Myotismon) | v165==1 | PACK 13 S-Black (p=1/10)<br>flags: v364+=1 |
| 5 | Apokarimon | v355!=0, v364>=10 | 03bcc | 124 Desperate Space (Apokarimon) | v359!=1 | PACK 13 S-Black<br>CARD 103 Apokarimon (p=1/10)<br>flags: v359=1, v351=0, v352=0, v353=0, v354=0, v355=0, v356=0, v357=0, v358=0, v364=0, v351=1, v352=1, v353=1, v354=1, v355=1, v356=1, v357=1 |
| 6 | Nanimon | v245!=0, v349!=1 / v245!=0, v349==1 | 04aac | 129 Who Are You? (Nanimon) | v348==1, v350!=1 | [v349!=1] PACK 15 S-Option<br>[v349==1] PACK 15 S-Option (p=1/10)<br>flags: v364+=1, v363+=1 [v349!=1], v350=1 [v349!=1], v350=1 [v349==1] |

**Desbloqueos / eventos**

- CMD11.21(192) @050bc [v165==1]
- CMD11.21(192) @05258 [v165==1]
- CMD11.21(192) @05998 [v165==1]
- CMD11.21(192) @061a0 [v165==1]
- CMD11.21(192) @06ae4 [v165==1]


#### CITY07 — Pyramid City

**Torneos** (slot T0..T3 = v274..v277, X0..X3 = v278..v281; ronda = 1 + nº de v268..v272 a 1)

| Slot | Ronda | @pc | Rival (deck DECK2) | Cond. necesarias (∩ caminos) | Efectos al ganar |
|---|---|---|---|---|---|
| T0 | 1 | 09b28 | 24 Gate of Fire (Centarumon) | v150!=0, v175==1, v176!=0 | flags: v364+=1 |
| T0 | 2 | 0a2a0 | 25 Paleo-Energy (Tyrannomon) | v150!=0, v175==1, v176!=0 | flags: v364+=1 |
| T0 | 3 | 0ab98 | 26 Evil Slayer (Angemon) | v150!=0, v175==1, v176!=0 | [v168!=1] PACK 6 Green<br>[v168!=1] 1 de {4 Paildramon, 5 Gigadramon, 6 RealMetalGreymon, 7 Garudamon, 8 MasterTyrannomon, 9 MetalGreymon, 10 Vermilimon, 11 Meteormon, 73 Rosemon, 74 HerculesKabuterimon, 75 MagnaAngemon, 76 Sylphymon, 77 Angewomon, 78 Lillymon, 79 MegaKabuterimon, 80 Piximon, 143 Jijimon, 144 Digitamamon, 145 Vademon, 146 Giromon, 147 Monzaemon, 148 MetalMamemon, 149 Mamemon, 150 Etemon} (rand/8)<br>[v168==1] PACK 6 Green<br>flags: v364+=1, v168=1 [v168!=1], v290=1 |
| T1 | 1 | 0c360 | 70 Friendly (Patamon) | v91!=1, v92!=1, v179==1 | flags: v364+=1 |
| T1 | 2 | 0cb08 | 71 Twin Meteor (Baronmon) | v91!=1, v92!=1, v179==1 | flags: v364+=1 |
| T1 | 3 | 0d330 | 72 Great Hope (Pegasusmon) | v91!=1, v92!=1, v179==1 | [v169!=1] PACK 6 Green<br>[v169==1] PACK 6 Green<br>flags: v364+=1, v169=1 [v169!=1] |
| T2 | 1 | 0de10 | 71 Twin Meteor (Baronmon) | v91==1, v92!=1 | flags: v364+=1 |
| T2 | 2 | 0e4b4 | 72 Great Hope (Pegasusmon) | v91==1, v92!=1 | flags: v364+=1 |
| T2 | 3 | 0ed54 | 94 Divine Sword (MagnaAngemon) | v91==1, v92!=1 | [v170!=1] PACK 6 Green<br>[v170==1] PACK 6 Green<br>flags: v364+=1, v170=1 [v170!=1] |
| T3 | 1 | 0f848 | 72 Great Hope (Pegasusmon) | v92==1 | flags: v364+=1 |
| T3 | 2 | 0ff58 | 94 Divine Sword (MagnaAngemon) | v92==1 | flags: v364+=1 |
| T3 | 3 | 10858 | 106 Heaven's Gate (Seraphimon) | v92==1 | [v171!=1] PACK 12 S-Green<br>[v171==1] PACK 12 S-Green<br>flags: v364+=1, v171=1 [v171!=1] |

**Battle Cafe / NPCs** (v2 = id de NPC de CMD11.3)

| NPC (v2) | Hablante | Aparece si (CMD11.3) | @pc | Deck | Cond. necesarias | Efectos al ganar |
|---|---|---|---|---|---|---|
| default | Centarumon | ? | 01840 | 24 Gate of Fire (Centarumon) | - | flags: v364+=1 |
| 2 | Tyrannomon | v168!=0 | 01e90 | 25 Paleo-Energy (Tyrannomon) | - | flags: v364+=1 |
| 3 | Angemon | - / v90==1, v91!=1, v92!=1, v169==1, v177!=0 / v90==1, v91==1, v92!=1, v170==1, v177!=0 | 02d38 | 26 Evil Slayer (Angemon) | v175==1 | PACK 6 Green (p=1/10)<br>flags: v364+=1 |
| 4 | T.K. | - | 04464 | 30 Wings of Hope (T.K.) | v117!=0, v176==1 | [v177!=1 & v245!=1] PACK 6 Green<br>[v177!=1 & v245==1] PACK 6 Green<br>[v177==1] PACK 6 Green (p=1/5)<br>[v345!=1] DIGIPART(92)<br>flags: v364+=1, v177=1 [v177!=1 & v245!=1], v369+=1 [v245!=0 & v245==1 & v317!=0], v177=1 [v177!=1 & v245==1], v369=0 [v369==6], v345=1 [v345!=1] |
| 5 | Patamon | v90==1, v91!=1, v92!=1, v169!=1, v177!=0 / v90==1, v91!=1, v92!=1, v169==1, v177!=0 / v90==1, v91==1, v92!=1, v170==1, v177!=0 | 05540 | 70 Friendly (Patamon) | - | flags: v364+=1 |
| 6 | Baronmon | v90==1, v91!=1, v92!=1, v169==1, v177!=0 / v90==1, v91==1, v92!=1, v170==1, v177!=0 / v90==1, v92==1, v171==1, v177!=0 | 05c68 | 71 Twin Meteor (Baronmon) | - | flags: v364+=1 |
| 7 | Pegasusmon | v90==1, v91!=1, v92!=1, v169==1, v177!=0 / v90==1, v91==1, v92!=1, v170==1, v177!=0 / v90==1, v92==1, v171==1, v177!=0 | 06340 | 72 Great Hope (Pegasusmon) | - | PACK 6 Green (p=1/10)<br>flags: v364+=1 |
| 8 | MagnaAngemon | v90==1, v91==1, v92!=1, v170!=1, v177!=0 / v90==1, v91==1, v92!=1, v170==1, v177!=0 / v90==1, v92==1, v171==1, v177!=0 | 06c78 | 94 Divine Sword (MagnaAngemon) | - | PACK 6 Green (p=1/10)<br>flags: v364+=1 |
| 9 | Seraphimon | v90==1, v92==1, v171!=1, v177!=0 / v90==1, v92==1, v171==1, v177!=0 | 075c8 | 106 Heaven's Gate (Seraphimon) | - | PACK 12 S-Green (p=1/10)<br>[v334!=1 & v365==5] CARD 286 Holy Sevens<br>flags: v364+=1, v365+=1, v334=1 [v334!=1 & v365==5] |
| 10 | Apokarimon | v356!=0, v364>=10 | 08104 | 125 Desperate Space (Apokarimon) | v359!=1 | PACK 13 S-Black<br>CARD 103 Apokarimon (p=1/10)<br>flags: v359=1, v351=0, v352=0, v353=0, v354=0, v355=0, v356=0, v357=0, v358=0, v364=0, v351=1, v352=1, v353=1, v354=1, v355=1, v356=1, v357=1 |

**Desbloqueos / eventos**

- PLAYERDECK 152 Pegasus @0433c [v117!=0, v176==1, v304!=1, v317!=0, v369==2]
- PLAYERDECK 153 Baro @0445c [v117!=0, v176==1, v304!=1, v317!=0, v369==5, v369!=2]
- DIGIPART(92) @04a84 [v117!=0, v176==1, v345!=1]
- desbloquea mapa Sky City (v290=1) @0b974 [v150!=0, v175==1, v176!=0]
- FUSIONSHOP(UNIT01) @10f18 [-]


#### CITY08 — Sky City

**Torneos** (slot T0..T3 = v274..v277, X0..X3 = v278..v281; ronda = 1 + nº de v268..v272 a 1)

| Slot | Ronda | @pc | Rival (deck DECK2) | Cond. necesarias (∩ caminos) | Efectos al ganar |
|---|---|---|---|---|---|
| T0 | 1 | 0b058 | 31 Magic Strike (Wizardmon) | v194==1 | flags: v364+=1 |
| T0 | 2 | 0b988 | 32 Slayer (AeroVeedramon) | v194==1 | flags: v364+=1 |
| T0 | 3 | 0c4e0 | 33 Cat Attack (Gatomon) | v194==1 | [v186!=1] PACK 6 Green<br>[v186!=1] 1 de {4 Paildramon, 5 Gigadramon, 6 RealMetalGreymon, 7 Garudamon, 8 MasterTyrannomon, 9 MetalGreymon, 10 Vermilimon, 11 Meteormon, 73 Rosemon, 74 HerculesKabuterimon, 75 MagnaAngemon, 76 Sylphymon, 77 Angewomon, 78 Lillymon, 79 MegaKabuterimon, 80 Piximon, 143 Jijimon, 144 Digitamamon, 145 Vademon, 146 Giromon, 147 Monzaemon, 148 MetalMamemon, 149 Mamemon, 150 Etemon} (rand/8)<br>[v186==1] PACK 6 Green<br>flags: v364+=1, v186=1 [v186!=1], v291=1 |
| T1 | 1 | 0def0 | 73 Call of Destiny (Gatomon) | v170!=1, v171!=1, v197==1 | flags: v364+=1 |
| T1 | 2 | 0e848 | 74 Divine Monster (Nefertimon) | v170!=1, v171!=1, v197==1 | flags: v364+=1 |
| T1 | 3 | 0f1ec | 75 Swirling Light (Tylomon) | v170!=1, v171!=1, v197==1 | [v187!=1] PACK 6 Green<br>[v187==1] PACK 6 Green<br>flags: v364+=1, v187=1 [v187!=1] |
| T2 | 1 | 0fd80 | 74 Divine Monster (Nefertimon) | v170==1, v171!=1 | flags: v364+=1 |
| T2 | 2 | 1050c | 75 Swirling Light (Tylomon) | v170==1, v171!=1 | flags: v364+=1 |
| T2 | 3 | 10f78 | 95 Shining Goddess (Angewomon) | v170==1, v171!=1 | [v188!=1] PACK 6 Green<br>[v188==1] PACK 6 Green<br>flags: v364+=1, v188=1 [v188!=1] |
| T3 | 1 | 11990 | 75 Swirling Light (Tylomon) | v171==1 | flags: v364+=1 |
| T3 | 2 | 121c0 | 95 Shining Goddess (Angewomon) | v171==1 | flags: v364+=1 |
| T3 | 3 | 12a7c | 107 Divine Dragon (Magnadramon) | v171==1 | [v189!=1] PACK 12 S-Green<br>[v189==1] PACK 12 S-Green<br>flags: v364+=1, v189=1 [v189!=1] |

**Battle Cafe / NPCs** (v2 = id de NPC de CMD11.3)

| NPC (v2) | Hablante | Aparece si (CMD11.3) | @pc | Deck | Cond. necesarias | Efectos al ganar |
|---|---|---|---|---|---|---|
| 1 | Wizardmon | v186!=0 | 01724 | 31 Magic Strike (Wizardmon) | - | flags: v364+=1 |
| 2 | AeroVeedramon | v186!=0 | 031f4 | 32 Slayer (AeroVeedramon) | - | flags: v364+=1 |
| 5 | Gatomon | - | 049dc | 33 Cat Attack (Gatomon) | v193==1 | PACK 6 Green (p=1/10)<br>flags: v364+=1 |
| 4 | Kari | - | 06324 | 34 Ladies' Night (Kari) | v177!=0, v193!=0, v194==1 | [v195!=1] PACK 6 Green<br>[v195==1] PACK 6 Green (p=1/5)<br>[v337!=1] CARD 289 Mystic Sevens<br>flags: v364+=1, v370+=1 [v245!=0 & v317!=0], v195=1 [v195!=1], v370=0 [v370==6], v337=1 [v337!=1] |
| 3 | Gatomon | v169==1, v170!=1, v171!=1, v187!=1, v195!=0 / v169==1, v170!=1, v171!=1, v187==1 / v169==1, v170==1, v171!=1, v188==1 | 075bc | 73 Call of Destiny (Gatomon) | - | flags: v364+=1 |
| 6 | Nefertimon | v169==1, v170!=1, v171!=1, v187==1 / v169==1, v170==1, v171!=1, v188==1 / v169==1, v171==1, v189==1 | 07d40 | 74 Divine Monster (Nefertimon) | - | flags: v364+=1 |
| 7 | Tylomon | v169==1, v170!=1, v171!=1, v187==1 / v169==1, v170==1, v171!=1, v188==1 / v169==1, v171==1, v189==1 | 08528 | 75 Swirling Light (Tylomon) | - | PACK 6 Green (p=1/10)<br>flags: v364+=1 |
| 8 | Angewomon | v169==1, v170==1, v171!=1, v188!=1 / v169==1, v170==1, v171!=1, v188==1 / v169==1, v171==1, v189==1 | 08f34 | 95 Shining Goddess (Angewomon) | - | PACK 6 Green (p=1/10)<br>flags: v364+=1 |
| 9 | Magnadramon | v169==1, v171==1, v189!=1 / v169==1, v171==1, v189==1 | 09810 | 107 Divine Dragon (Magnadramon) | - | PACK 12 S-Green (p=1/10)<br>flags: v364+=1 |
| 10 | Apokarimon | v357!=0, v364>=10 | 0a344 | 126 Desperate Space (Apokarimon) | v359!=1 | PACK 13 S-Black<br>CARD 103 Apokarimon (p=1/10)<br>flags: v359=1, v351=0, v352=0, v353=0, v354=0, v355=0, v356=0, v357=0, v358=0, v364=0, v351=1, v352=1, v353=1, v354=1, v355=1, v356=1, v357=1 |

**Desbloqueos / eventos**

- PLAYERDECK 154 Neferti @06204 [v177!=0, v193!=0, v194==1, v307!=1, v317!=0, v370==2]
- PLAYERDECK 155 Tylo @0631c [v177!=0, v193!=0, v194==1, v307!=1, v317!=0, v370!=2, v370==5]
- desbloquea mapa Steep Road (v291=1) @0d1d4 [v194==1]


#### CITY09 — Steep Road

**Torneos** (slot T0..T3 = v274..v277, X0..X3 = v278..v281; ronda = 1 + nº de v268..v272 a 1)

| Slot | Ronda | @pc | Rival (deck DECK2) | Cond. necesarias (∩ caminos) | Efectos al ganar |
|---|---|---|---|---|---|
| T0 | 1 | 09680 | 35 Out of Control (Goburimon) | v204!=1, v209==1 | flags: v364+=1 |
| T0 | 2 | 0a080 | 36 Dark Digivolution (DemiDevimon) | v204!=1, v209==1 | flags: v364+=1 |
| T0 | 3 | 0aa2c | 37 Mega Shock (Megadramon) | v204!=1, v209==1 | flags: v364+=1, v204=1 |
| T1 | 1 | 0b8cc | 35 Out of Control (Goburimon) | v204==1, v211==1 | flags: v364+=1 |
| T1 | 2 | 0bf78 | 36 Dark Digivolution (DemiDevimon) | v204==1, v211==1 | flags: v364+=1 |
| T1 | 3 | 0c75c | 37 Mega Shock (Megadramon) | v204==1, v211==1 | flags: v364+=1 |
| T1 | 4 | 0cfb4 | 38 Mega Giga (Gigadramon) | v204==1, v211==1 | [v205!=1] PACK 7 Black<br>[v205==1] PACK 7 Black<br>flags: v364+=1, v205=1 [v205!=1], v292=1 |

**Battle Cafe / NPCs** (v2 = id de NPC de CMD11.3)

| NPC (v2) | Hablante | Aparece si (CMD11.3) | @pc | Deck | Cond. necesarias | Efectos al ganar |
|---|---|---|---|---|---|---|
| 1 | Goburimon | v204!=0 | 014f0 | 35 Out of Control (Goburimon) | - | flags: v364+=1 |
| 2 | DemiDevimon | v204!=0 | 01f44 | 36 Dark Digivolution (DemiDevimon) | - | flags: v364+=1 |
| 3 | Megadramon | - | 02fbc | 37 Mega Shock (Megadramon) | v209==1 | flags: v364+=1 |
| 4 | Gigadramon | v204!=0 | 03a70 | 38 Mega Giga (Gigadramon) | v211==1 | PACK 7 Black (p=1/10)<br>flags: v364+=1 |
| 5 | GranKuwagamon | v188!=0 | 0457c | 96 Black King (GranKuwagamon) | v212==1 | [v213!=1 & v346!=1 & v365!=5] PACK 13 S-Black<br>[v346!=1 & v365==5] DIGIPART(99)<br>PACK 13 S-Black (p=1/10)<br>flags: v364+=1, v365+=1, v213=1 [v213!=1 & v346!=1 & v365!=5], v346=1 [v346!=1 & v365==5] |
| 6 | Ken | - | 065b8 | 97 Wormhole (Ken) | v214==1 | [v215!=1] PACK 13 S-Black<br>[v215==1] PACK 13 S-Black (p=1/5)<br>[v347!=1] DIGIPART(114)<br>flags: v364+=1, v371+=1 [v245!=0 & v317!=0], v215=1 [v215!=1], v371=0 [v371==6], v347=1 [v347!=1] |
| 7 | Apokarimon | v358!=0, v364>=10 | 072a0 | 127 Desperate Space (Apokarimon) | v359!=1 | PACK 13 S-Black<br>CARD 103 Apokarimon (p=1/10)<br>flags: v359=1, v351=0, v352=0, v353=0, v354=0, v355=0, v356=0, v357=0, v358=0, v364=0, v351=1, v352=1, v353=1, v354=1, v355=1, v356=1, v357=1 |
| 8 | Piximon | v246!=0 | 07f60 | 120 Return (Piximon) | v218==1 | [v219!=1] PACK 12 S-Green<br>CARD 290 Speed Sevens<br>[v219==1] PACK 12 S-Green (p=1/10)<br>flags: v364+=1, v219=1 [v219!=1], v338=1 |
| 9 | Nanimon | v245!=0, v349!=1 / v245!=0, v349==1 | 08b7c | 130 Who Are You? (Nanimon) | v348==1, v350!=1 | [v349!=1] PACK 15 S-Option<br>[v349==1] PACK 15 S-Option (p=1/10)<br>flags: v364+=1, v363+=1 [v349!=1], v350=1 [v349!=1], v350=1 [v349==1] |

**Desbloqueos / eventos**

- DIGIPART(99) @049d8 [v212==1, v346!=1, v365==5]
- PLAYERDECK 156 Shadra @06464 [v214==1, v310!=1, v317!=0, v371==2]
- PLAYERDECK 157 Quetzal @065b0 [v214==1, v310!=1, v317!=0, v371==5, v371!=2]
- DIGIPART(114) @06a0c [v214==1, v347!=1]
- desbloquea mapa Wiseman Tower (v292=1) @0d290 [v204==1, v211==1]


#### CITY10 — Wiseman Tower

**Torneos** (slot T0..T3 = v274..v277, X0..X3 = v278..v281; ronda = 1 + nº de v268..v272 a 1)

| Slot | Ronda | @pc | Rival (deck DECK2) | Cond. necesarias (∩ caminos) | Efectos al ganar |
|---|---|---|---|---|---|
| T0 | 1 | 0b010 | 39 Spiky (Togemon) | v233==1 | flags: v364+=1 |
| T0 | 2 | 0ba44 | 40 Anti-A (Kabuterimon) | v233==1 | flags: v364+=1 |
| T0 | 3 | 0c288 | 41 Anti-Fire (Ikkakumon) | v233==1 | flags: v364+=1 |
| T0 | 4 | 0cd1c | 42 First Attack (Birdramon) | v233==1 | flags: v364+=1 |
| T0 | 5 | 0d7f8 | 43 Howl to the Moon (WereGarurumon) | v233==1 | flags: v364+=1 |
| T0 | 6 | 0e0c8 | 44 SEVEN (MetalGreymon) | v233==1 | [v224!=1 & v245!=1] PACK 12 S-Green; PACK 11 S-Blue; PACK 10 S-Red<br>[v224==1 & v245!=1] PACK 12 S-Green; PACK 11 S-Blue; PACK 10 S-Red<br>[v245==1] PACK 12 S-Green; PACK 11 S-Blue; PACK 10 S-Red<br>flags: v364+=1, v224=1 [v224!=1 & v245!=1] |
| T1 | 1 | 0f320 | 132 Flower Fairies (Lillymon) | v225!=1, v226!=1, v244==1, v246==1, v247!=1 | flags: v364+=1 |
| T1 | 2 | 0fcb8 | 133 Intercepting Traps (MegaKabuterimon) | v225!=1, v226!=1, v244==1, v246==1, v247!=1 | flags: v364+=1 |
| T1 | 3 | 10558 | 134 Armed (Zudomon) | v225!=1, v226!=1, v244==1, v246==1, v247!=1 | flags: v364+=1 |
| T1 | 4 | 10de8 | 135 Sun's Gift (Garudamon) | v225!=1, v226!=1, v244==1, v246==1, v247!=1 | flags: v364+=1 |
| T1 | 5 | 11688 | 136 Shooter (MetalGarurumon) | v225!=1, v226!=1, v244==1, v246==1, v247!=1 | flags: v364+=1 |
| T1 | 6 | 11f50 | 137 Fire Heart (WarGreymon) | v225!=1, v226!=1, v244==1, v246==1, v247!=1 | [v225!=1] PACK 12 S-Green; PACK 11 S-Blue; PACK 10 S-Red<br>[v225==1] PACK 12 S-Green; PACK 11 S-Blue; PACK 10 S-Red<br>flags: v364+=1, v225=1 [v225!=1] |
| T2 | 1 | 12ca4 | 132 Flower Fairies (Lillymon) | v226!=1, v243==1, v247==1 | flags: v364+=1 |
| T2 | 2 | 13414 | 133 Intercepting Traps (MegaKabuterimon) | v226!=1, v243==1, v247==1 | flags: v364+=1 |
| T2 | 3 | 13b1c | 134 Armed (Zudomon) | v226!=1, v243==1, v247==1 | flags: v364+=1 |
| T2 | 4 | 14234 | 135 Sun's Gift (Garudamon) | v226!=1, v243==1, v247==1 | flags: v364+=1 |
| T2 | 5 | 14a58 | 113 Blue Star Red Moon (Omnimon) | v226!=1, v243==1, v247==1 | [v226!=1] PACK 15 S-Option<br>[v226==1] PACK 15 S-Option<br>flags: v364+=1, v226=1 [v226!=1] |

**Battle Cafe / NPCs** (v2 = id de NPC de CMD11.3)

| NPC (v2) | Hablante | Aparece si (CMD11.3) | @pc | Deck | Cond. necesarias | Efectos al ganar |
|---|---|---|---|---|---|---|
| 1 | Togemon | v224!=0 | 016dc | 39 Spiky (Togemon) | - | PACK 6 Green (p=1/10)<br>flags: v364+=1 |
| 2 | Kabuterimon | v224!=0 | 0215c | 40 Anti-A (Kabuterimon) | - | PACK 6 Green (p=1/10)<br>flags: v364+=1 |
| 3 | Ikkakumon | v224!=0 | 02a54 | 41 Anti-Fire (Ikkakumon) | - | PACK 5 Blue (p=1/10)<br>flags: v364+=1 |
| 4 | Birdramon | v224!=0 | 03544 | 42 First Attack (Birdramon) | - | PACK 4 Red (p=1/10)<br>flags: v364+=1 |
| 5 | WereGarurumon | v224!=0, v226!=1, v247!=1 / v224!=0, v226==1, v320!=0 | 043f0 | 43 Howl to the Moon (WereGarurumon) | - | PACK 5 Blue (p=1/10)<br>flags: v364+=1 |
| 6 | MetalGreymon | - / v224!=0, v226==1, v320!=0 | 07a88 | 44 SEVEN (MetalGreymon) | v233==1 | PACK 4 Red (p=1/10)<br>flags: v364+=1 |
| 7 | Omnimon | v224!=0 | 08f50 | 113 Blue Star Red Moon (Omnimon) | v243==1 | PACK 15 S-Option (p=1/10)<br>flags: v364+=1 |

**Desbloqueos / eventos**

- TRADE_ENABLE @06178 [v224!=0, v233==1, v234!=1, v317!=0, v318!=1]
- desbloquea mapa Infinity Tower (v293=1) @06188 [v224!=0, v233==1, v317!=0, v318!=1]
- TRADE_ENABLE @06388 [v224!=0, v233==1, v234!=1]
- desbloquea mapa Infinity Tower (v293=1) @06398 [v224!=0, v233==1]
- FUSIONSHOP(UNIT02) @15188 [-]


#### CITY11 — Infinity Tower

**Torneos** (slot T0..T3 = v274..v277, X0..X3 = v278..v281; ronda = 1 + nº de v268..v272 a 1)

| Slot | Ronda | @pc | Rival (deck DECK2) | Cond. necesarias (∩ caminos) | Efectos al ganar |
|---|---|---|---|---|---|
| T0 | 1 | 0aaf8 | 45 Fighting Monsters (Tuskmon) | v156!=1, v184!=1, v225!=1, v226!=1, v245!=1, v248!=1, v253==1 | flags: v364+=1 |
| T0 | 2 | 0b3d8 | 46 Sickle Slayer (Phantomon) | v156!=1, v184!=1, v225!=1, v226!=1, v245!=1, v248!=1, v253==1 | flags: v364+=1 |
| T0 | 3 | 0bc94 | 47 Mega Flood (MegaSeadramon) | v156!=1, v184!=1, v225!=1, v226!=1, v245!=1, v248!=1, v253==1 | flags: v364+=1 |
| T0 | 4 | 0c5a0 | 100 Machine Empire (Machinedramon) | v156!=1, v184!=1, v225!=1, v226!=1, v245!=1, v248!=1, v253==1 | flags: v364+=1 |
| T0 | 5 | 0d058 | 48 Evil King (VenomMyotismon) | v156!=1, v184!=1, v225!=1, v226!=1, v245!=1, v248!=1, v253==1 | PACK 11 S-Blue; PACK 14 S-Yellow; PACK 13 S-Black<br>flags: v364+=1, v184=1, v245=1 |
| T1 | 1 | 0ef88 | 98 Rough Sea King (MetalSeadramon) | v156==1, v184!=1, v225!=1, v226!=1, v246!=1, v248!=1, v259==1 | flags: v364+=1 |
| T1 | 2 | 0f794 | 99 Toy Castle (Puppetmon) | v156==1, v184!=1, v225!=1, v226!=1, v246!=1, v248!=1, v259==1 | flags: v364+=1 |
| T1 | 3 | 10140 | 101 Evil Flower (LadyDevimon) | v156==1, v184!=1, v225!=1, v226!=1, v246!=1, v248!=1, v259==1 | flags: v364+=1 |
| T1 | 4 | 10b48 | 102 4 Strong Monsters (Piedmon) | v156==1, v184!=1, v225!=1, v226!=1, v246!=1, v248!=1, v259==1 | PACK 13 S-Black<br>flags: v364+=1, v246=1 |
| T2 | 1 | 115bc | 48 Evil King (VenomMyotismon) | v184!=1 | flags: v364+=1 |
| T2 | 2 | 11e9c | 102 4 Strong Monsters (Piedmon) | v184!=1 | flags: v364+=1 |
| T2 | 3 | 126e8 | 108 Forever Increase (Infermon) | v184!=1 | flags: v364+=1 |
| T2 | 4 | 12f20 | 109 Time Bomb (Diaboromon) | v184!=1 | PACK 13 S-Black<br>flags: v364+=1, v247=1 |
| T3 | 1 | 138d0 | 48 Evil King (VenomMyotismon) | v184!=1, v226==1, v248!=1, v264==1 | flags: v364+=1 |
| T3 | 2 | 14220 | 102 4 Strong Monsters (Piedmon) | v184!=1, v226==1, v248!=1, v264==1 | flags: v364+=1 |
| T3 | 3 | 1496c | 108 Forever Increase (Infermon) | v184!=1, v226==1, v248!=1, v264==1 | flags: v364+=1 |
| T3 | 4 | 15060 | 109 Time Bomb (Diaboromon) | v184!=1, v226==1, v248!=1, v264==1 | flags: v364+=1 |
| T3 | 5 | 158b0 | 114 Desperate Space (Apokarimon) | v184!=1, v226==1, v248!=1, v264==1 | PACK 13 S-Black<br>flags: v364+=1, v248=1, v351=1 |
| X0 | 1 | 18228 | 140 Darkness Wave (A) | v167==1 | flags: v364+=1, v184=0 |

**Battle Cafe / NPCs** (v2 = id de NPC de CMD11.3)

| NPC (v2) | Hablante | Aparece si (CMD11.3) | @pc | Deck | Cond. necesarias | Efectos al ganar |
|---|---|---|---|---|---|---|
| default | Tuskmon | ? | 0162c | 45 Fighting Monsters (Tuskmon) | v184!=1 | flags: v364+=1 |
| 1 | Phantomon | v184!=1, v245!=0 | 01d44 | 46 Sickle Slayer (Phantomon) | v184!=1 | flags: v364+=1 |
| 2 | MegaSeadramon | v184!=1, v245!=0 | 025a8 | 47 Mega Flood (MegaSeadramon) | v184!=1 | flags: v364+=1 |
| 4 | VenomMyotismon | v184!=1 | 03670 | 48 Evil King (VenomMyotismon) | v184!=1, v253==1 | PACK 13 S-Black (p=1/10)<br>flags: v364+=1 |
| 5 | MetalSeadramon | v156!=0, v184!=1, v246!=0 | 04268 | 98 Rough Sea King (MetalSeadramon) | v184!=1 | flags: v364+=1 |
| 6 | Puppetmon | v156!=0, v184!=1, v246!=0 | 04a24 | 99 Toy Castle (Puppetmon) | v184!=1 | flags: v364+=1 |
| 7 | Machinedramon | v184!=1, v245!=0 | 0530c | 100 Machine Empire (Machinedramon) | v184!=1 | flags: v364+=1 |
| 8 | LadyDevimon | v156!=0, v184!=1, v246!=0 | 05b5c | 101 Evil Flower (LadyDevimon) | v184!=1 | flags: v364+=1 |
| 9 | Piedmon | v156!=0, v184!=1 | 067d8 | 102 4 Strong Monsters (Piedmon) | v184!=1, v259==1 | PACK 13 S-Black (p=1/10)<br>[v335!=1 & v365==5] CARD 287 Dark Sevens<br>flags: v364+=1, v365+=1, v335=1 [v335!=1 & v365==5] |
| 10 | Infermon | v184!=1, v189!=0, v225!=0, v247!=0 | 071d8 | 108 Forever Increase (Infermon) | v184!=1 | PACK 13 S-Black (p=1/10)<br>flags: v364+=1 |
| 11 | Diaboromon | v184!=1, v189!=0, v225!=0 | 07f24 | 109 Time Bomb (Diaboromon) | v184!=1, v262==1 | PACK 13 S-Black (p=1/10)<br>flags: v364+=1 |
| 12 | Apokarimon | v184!=1, v226!=0, v248!=1 / v93!=0, v184!=1, v226!=0, v351!=0, v364>=10 | 08fb0 | 121 Desperate Space (Apokarimon) | v184!=1, v264==1, v359!=1 | PACK 13 S-Black<br>[v265!=1] CARD 103 Apokarimon<br>[v265==1] CARD 103 Apokarimon (p=1/10)<br>flags: v359=1, v265=1 [v265!=1], v351=0, v352=0, v353=0, v354=0, v355=0, v356=0, v357=0, v358=0, v364=0, v351=1, v352=1, v353=1, v354=1, v355=1, v356=1, v357=1 |
| 13 | Nanimon | v184!=1, v245!=0, v349!=1 / v184!=1, v245!=0, v349==1 | 09ee8 | 131 Who Are You? (Nanimon) | v184!=1, v348==1, v350!=1 | [v349!=1] PACK 15 S-Option<br>[v349!=1 & v363==5] DIGIPART(45)<br>[v363==10 & v363!=5] CARD 288 Grand Sevens+156 Nanimon<br>[v349==1] PACK 15 S-Option (p=1/10)<br>flags: v364+=1, v363+=1 [v349!=1], v350=1 [v349!=1], v341=1 [v349!=1 & v363==5], v349=1 [v349!=1 & v363==10 & v363!=5], v336=1 [v363==10 & v363!=5], v350=1 [v349==1] |

**Desbloqueos / eventos**

- DIGIPART(45) @0a188 [v184!=1, v348==1, v349!=1, v363==5]
- ENDSEG(0) @191dc [v167==1]

---

## 10. Eventos UNIT (Fusion Shops)

- ✅ UNIT00/01/02 = Andromon No.1 (Flame City, `CMD11.4(0)`), No.2 (Pyramid, `CMD11.4(1)`), No.3 (Wiseman,
  `CMD11.4(2)`). Host EVOSEG 0x801E81C4.
- 🟡 Nivel de fusión desbloqueado (por diálogo + flags del guion UNIT): sólo nivel III y Option al principio;
  hasta IV tras visitar una segunda tienda; "any Cards" tras la tercera (vars UNIT v24..v29 = tiendas visitadas).
  No se ha decodificado el set de comandos de EVOSEG ni dónde persisten esas 30 vars ❓.

---

## Dudas

1. ❓ Persistencia de las 30 vars de UNIT y semántica de los comandos EVOSEG (fusión, "Partner Fusion").
2. ❓ `CMD11.6(k)` para k=2..5 (aparecen en arenas, varias en bloques sin etiqueta → código muerto por análisis
   estático); k=1 (submenú Menu) 🟡 guardar en OPENSEG.
3. ❓ Qué modo de SUBSEG abre `CMD10.9` (0x8002EE50) vs `CMD10.17` (0x8002F074) — ítems 18/19 del submenú.
4. ❓ `CMD10.7` / ítem 0 del menú de lugares (sólo Beginner, Sky City, Wiseman Tower): pantalla SAISEG 0x801E186C
   que lee el % completado; ENDSEG(2) si v15 + botón.
5. ❓ `CMD11.7`, `CMD11.10`, `CMD10.10/10.11`, `CMD11.20`, `CMD10.20/10.21`; v11 de la presentación del rival.
6. ❓ Decks 76 (No Can Do/Tentomon) y 117 (Desperate Space/Apokarimon) no aparecen en ningún `CMD11.2`;
   142..144 (Red/Green/Yellow, Player) no se usan en guiones (🟡 mazos iniciales de OPENSEG); 158 = Practice (BETA).
7. Textos vs id (el juego usa el id): "MetalSeadramon Card" da la carta 42 (MegaSeadramon en cards.json), "Blue
   Mamemon/BlueMamemon" da 45 (BlueMeramon), "MetalGreymon Card" da 6 (RealMetalGreymon); CMD13.1(288,156) da Grand
   Sevens + Nanimon aunque el texto final sólo nombra a Nanimon. Revisar nombres de cards.json para 6/42/45.
8. 🟡 DECK2 registro, byte `tail[4]` − 0x20 = ciudad donde se usa el mazo en 279/296 casos; 6↔7 (Desert/Pyramid)
   aparecen intercambiados → probablemente fondo/arena de batalla, no ciudad.
9. ❓ Tutorial: `CMD11.2(0)` (deck 0 "Tutorial") con el diálogo "how to play"; la conexión deck 0 → BETA.MSD en
   KAWSEG no se ha localizado (0x801EA708 no tiene llamadas directas).

## Datos extraíbles

| Tabla | Ubicación | Formato |
|---|---|---|
| Guiones de ciudad | `AREAxx.PAK` bloque (tipo 2, id 200+xx) = `C.DRV DEBUG/CITYxx.MSD` | MSCD (§1); `msdis.decode()` |
| Batallas por ciudad | instrucciones `0B 00 02 00 · 00 00 NN NN` (CMD11.2, 1 parámetro inmediato) | N = índice DECK2 |
| Cartas regaladas | `0D 00 01 00` + 3×(u16 mode,u16 id) | id 0xFFFF = nada |
| Sobres regalados | `0B 00 09 00 · 00 00 pp 00` | p → nombres SLUS 0x8006E31C (16 punteros) |
| Mazos prestados | `0B 00 11 00 · 00 00 NN 00` | N = DECK2 145..157 |
| Pesos de % completado | prólogo de cualquier CITY: `CMD10.19` + 120×(`if vN` + `CMD11.18(w)`) | Σw = 166 |
| Flags de mapa | SAISEG 0x801DE964 | 12×u16 = 282..293 |
| Flags de compañero | SAISEG 0x801DE2F0 | 6×u16 = 294,298,301,307,304,310 |
| Palabras clave | SAISEG 0x801F36E0 | 10 punteros a ASCII; premio en CITY08 (índice → CMD13.1) |
| Nombres de lugares/arenas | OPENSEG 0x801F0684 / 0x801F06D4 | 20 + 12×4 punteros |
| Flags de historia | save+0x23FC (bits, v12..v362), save+0x242C (bytes, v363..v371) | §3 |
| Victorias/derrotas | save+0x18 / save+0x1A (u16, tope 999) | SLUS 0x80041904..0x80041954 |
| % completado | save+0x14 (u16, puntos/166) | SAISEG 0x801E1738 |
| Generadores | `PROG\w01\report.py`, `gates.py`, `flags.py` | reproducen §9 desde el disco |
