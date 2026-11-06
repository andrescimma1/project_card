# Digimon Digital Card Battle (SLUS-01328): progresión según fuentes externas

Alcance: solo progresión (historia, mundo, rivales, recompensas, fusión, partner, trade, rangos, completado). Las reglas del duelo no se tratan. Todo lo de abajo sale de los txt de la carpeta scratchpad; no hay conocimiento externo. Lo que he calculado yo a partir de datos de los txt va marcado como **[derivado]**.

## 0. Leyenda de citas y calidad de las fuentes

Las citas son `[alias:línea]` o `[alias:inicio-fin]`; la línea es la del txt. Alias:

| Alias | Archivo | Nota |
|---|---|---|
| RJ | dcb_faq_gamefaqs_RJennings.txt | Walkthrough v1.0 (2001). Orden de ciudades y postgame |
| RY | dcb_faq_gamefaqs_RYakuto.txt | v3.7. Mazos, packs por arena, "Seasons" 1-3, fusión (Pagini), lista de opciones |
| YS | dcb_faq_gamefaqs_Yefri_S.txt | v6.0. Menús, partners, EXP, bugs, sevens, títulos |
| DS | dcb_faq_gamefaqs_De-thSh-dow.txt | v1.4. FAQ de preguntas, sevens, trade, % de completado |
| TM | dcb_faq_gamefaqs_TCG_Master.txt | v1.8. Recetas de fusión (684) |
| V00 | dcb_faq_vgm_26200.txt | Ficky v0.4. Incompleto (llega a Flame City); trae textos de diálogo y stats de ejemplo |
| V01 | dcb_faq_vgm_26201.txt | Copia de YS (solo cambian los e-mails). Se cita YS |
| V02 | dcb_faq_vgm_26202.txt | Hints de Gohanssj2 |
| V03 | dcb_faq_vgm_26203.txt | Copia de DS (solo cambian e-mails). Se cita DS |
| V06 | dcb_faq_vgm_26206.txt | Danaroth, guía del 100% (v0.70) |
| LP | dcb_lparchive_ephraim225.txt | Let's Play (partida NA, Armadillomon). Actualizaciones 01-19 |
| MAN | dcb_manual_US_SLUS-01328_ocr.txt | Manual US. OCR ruidoso; las cifras de la tabla de bonos son legibles pero hay letras corruptas |
| DL | dcb_decklists_ryakuto_gamefaqs.txt | Mazos CPU y mazos iniciales (la propia cabecera dice que la identificación de mazos iniciales es una inferencia, DL:3) |
| CL-RY | dcb_cardlist_ryakuto_gamefaqs.txt | Lista de cartas 000-300 |
| CL-WM | dcb_cardlist_wikimon.txt | Lista de cartas con "Composite Value" y "Result Value" (columnas finales) |

Cautelas generales:
- Muchas guías son de 2001-2002 y contienen erratas o contradicciones entre sí (ver sección 14).
- RY llama a Pyramid "Pyramid City" y a Jungle "Keely" por Yolei; los nombres de la versión NA difieren del japonés (p. ej. "Keely" en vez de Yolei, LP:147-148, RJ:219-220).
- El LP es la única fuente con contexto de la versión japonesa (comparaciones) y la única que menciona "Lucky Name" (LP:1682).

---

## 1. Estructura de la historia y del mundo

### 1.1 Áreas y ciudades (orden y desbloqueo)

El mundo tiene tres áreas con 11 ciudades en la partida principal, más una isla de postgame [RY:164 "11 Areas en season 1, 12 en 2/3"; V00:120-137].

| Área | Ciudades (orden) | Fuente |
|---|---|---|
| Mega Area | Beginner, Flame, Jungle, Igloo, Junk | [RJ:152-156; RY:223-229; V00:120-125] |
| Giga Area | Dark City, Pyramid City, Sky City (+ Desert Island, solo postgame) | [RJ:281-284; RY:588-592; V00:127-131] |
| Tera Area | Steep Road, Wiseman Tower, Infinity Tower | [RJ:327-329; RY:766-769; V00:133-137] |

Mecánica común:
- Cada ciudad tiene Battle Cafe (hablar con los personajes) y Battle Arena (torneo). Betamon lo explica: ganar el torneo da el passcode a la siguiente ciudad [V00:379-382]. El manual dice que hay que ganar el torneo completo antes de salir o se empieza desde el primer rival [MAN:685-688].
- El Arena suele estar cerrada hasta hablar con los NPC del Cafe [RJ:162-168, 190-195, 217-220; RY:318-320].
- Descripciones del manual por ciudad: Beginner (Betamon enseña), Flame (digimon Fire; Davis presiente algo raro), Jungle (Nature; Veedramon, maestro del arena, está raro), Igloo (Ice; "rescatar a Garurumon de un hechizo"), Junk (Rare; King Sukamon manda en el arena y pedirá ayuda) [MAN:745-792].
- Se puede guardar tras cada tres combates dentro de un arena [RJ:231-232; LP:186]; YS dice que no se puede guardar dentro del arena salvo en arenas de más de 3 rivales [YS:280-281].
- La Player's Room (estadísticas) solo existe en Beginner City, Sky City y Wiseman Tower [YS:283-288] (el LP confirma Sky City y Wiseman: LP:484, 592).
- Hay avatar fijo (protagonista de Digimon World) [LP:15]. DS especula con trajes alternativos desbloqueables, sin confirmar [DS:237-241].

### 1.2 Hilo argumental

- Arranque: eres un nuevo Card Tamer; Davis cuenta que "algo raro pasa en los arenas" [V00:506-518; RY:314-318].
- Ken (Digimon Emperor) envió a Wormmon a tomar los arenas; Wormmon aparece como "líder" de Jungle (Wormmon final) y luego rival de Igloo (Stingmon), Junk (Shadramon) y Dark City [RY:440-441, 505-515, 568-576, 603-656; RJ:225-232, 247-250, 266-272, 289-298].
- Los líderes "poseídos" (Veedramon, Garurumon) dan el passcode después de que se vayan los malos [RJ:233-235, 254-256; RY:450-459, 523-527]. King Sukamon "se echa atrás" y obliga a repetir el arena [RJ:273-278; LP:346-352].
- Tera Area: Ken ya no es malo y te da el tercer partner [RJ:334-336; RY:819-825; LP:532-535]. Wiseman Tower: las parejas de los DigiDestined originales (Togemon...MetalGreymon) [RJ:355-362; RY:826-884]. Infinity Tower: VenomMyotismon y los Dark Masters restantes [RJ:370-383; RY:921-987].
- Final: tras vencer a VenomMyotismon la torre se corrompe y aparece "A" (Analogman). No se puede guardar ni salir [RJ:382-390; LP:759-762]. Rosemon (programa de seguridad, no un digimon real) te pide que lo derrotes [LP:763-770; RY:1000-1034]. A tiene una trampa colocada por Rosemon [LP:767].
- Créditos con FMV; se pueden saltar presionando Start antes de que empiecen [DS:235-236]. Tras los créditos el juego continúa (el LP lo anuncia con Tai) [LP:799-803]; RJ avisa de que solo se ha completado "la primera mitad" [RJ:411-414]; YS habla de "finales" falsos y "verdadero" [YS:356-359]; RY lo divide en "Seasons" 1-3 [RY:156-164] y TM habla de tres seasons para acabar el juego [TM:84].
- Nota [LP:79-82, 810-812]: los personajes de TV (Davis, etc.) solo se pueden jugar en el postgame.

---

## 2. Tabla de progresión de la campaña principal (Season 1)

Leyenda de "Pack arena": pack extra por ganar el arena según RY (todos los packs tienen 3 cartas [RY:307-309; LP:45]). Los rivales de cada arena son los de RJ; las diferencias con RY/LP se indican.

| Ciudad | Cómo se desbloquea el arena | Rivales (orden) | Jefe / final | Recompensas y notas |
|---|---|---|---|---|
| Beginner | Hablar con Betamon (tutorial opcional) y luego con Babamon [RJ:161-168; RY:262-267] | 1 Agumon (Tricolor Starter), 2 Babamon (New Power) [RJ:171-176; RY:273-300] | Babamon (el arena dura 2 rivales) | Option Pack [RJ:176-177; RY:301; LP:57]; una carta Ultimate la primera vez (RJ no está seguro, depende del mazo inicial) [RJ:176-178; LP:58]; passcode de Flame [RJ:178-179; RY:299-300]. Arena repetible para farmear Option Packs [LP:57; RY:302-304] |
| Flame | Hablar con Davis y con "??????" (Rosemon sin nombre) [RJ:191-195; RY:314-320; V00:491-497] | Meramon, Phoenixmon, Veemon [RJ:198-204; RY:322-372] | Veemon | Red Pack [RY:372; LP:117]. Davis da el Digi-Egg del partner (Courage/Love/Knowledge) [RJ:206-211; V02:99-102]. Abre la Fusion Shop [RJ:211-212; YS:252-254; LP:129] |
| Jungle | Hablar con Yolei ("Keely") [RJ:217-221; RY:383-389] | Vegiemon, Ninjamon, Veedramon, Wormmon [RJ:223-231; RY:391-440] | Veedramon es el "líder normal" y Wormmon el último (Hyper Pack) [RY:421-440] | Green Pack [RY:443]. Sin premio por el arena en sí: Wormmon huye; hablar con Veedramon da el passcode [RJ:233-235; RY:450-459; LP:198-200]. Repetir el arena (ya "nuevo") da % de completado y un Ultimate extra [LP:201-202] |
| Igloo | Hablar con Cody, Garurumon y ?????? [RY:462-464; LP:214-218] | Frigimon, Whamon, Garurumon, Stingmon [RJ:241-250; RY:466-515] | Garurumon (RY lo llama líder normal); Stingmon es el final (Hyper Pack) [RY:492-515] | Blue Pack [RY:516]. Cody ofrece el 2.º partner: Patamon o Gatomon [RJ:252-255; RY:519-522]. Garurumon pide revancha en el Cafe para dar el passcode de Junk [RJ:254-256; RY:523-527]. LP: la revancha se acompaña de repetir el arena para el % y da una carta de recompensa [LP:271-278] |
| Junk | King Sukamon pide limpiar el arena [RJ:261-262; RY:530-532] | Hagurumon, ShellNumemon, King Sukamon (RJ) o "Sukamon" (RY), Shadramon [RJ:264-272; RY:534-576] | Sukamon (líder); Shadramon es el final (Hyper Pack) [RY:558-576] | Yellow Pack [RY:577]. Sukamon "te dejó ganar" y no da el passcode: hay que repetir el arena (sin Shadramon) [RJ:273-278; RY:580-586; LP:346-352]. El LP recibe Ultimate extra tras la 2.ª vuelta [LP:355] |
| Dark City | Hablar con Wormmon en el Cafe [RJ:289; RY:595-601] | Wormmon, Stingmon, Shadramon (RJ) o "Shardamon" (RY), Quetzalmon (Wormmon con el Digi-Egg of Light, RJ), Digimon Emperor (Ken) [RJ:291-294; RY:603-656] | Quetzalmon es "líder" según RY; Ken es el final | Black Pack [RY:657]. Wormmon da el 2.º Digi-Egg del partner (Friendship/Sincerity/Reliability) [RJ:296-298; RY:659-661]. El LP dice que Ken huye y hay que repetir el arena (premio: segunda armadura y Ultimate) [LP:426-433] |
| Pyramid | Hablar con Angemon [RJ:303; RY:665-669] | Centarumon, Tyrannomon, Angemon [RJ:305-307; RY:674-703] | Angemon | Green Pack [RY:706]. Segunda Fusion Shop (RY: combina R, C y opciones) [RY:709-710; LP:482]. Ultimate extra de un pool multicolor [LP:480]. Si tienes Patamon, T.K. da su primer Digi-Egg (Hope) [RJ:309-310; LP:481] |
| Sky | Hablar con Gatomon (te pide ir a Wiseman Tower; hay que combatirla antes) [RJ:315-316; RY:713-719] | Wizardmon, AeroVeedramon, Gatomon [RJ:318-320; RY:721-751] | Gatomon | Green Pack [RY:752]. Si tienes Gatomon, Kari da su Digi-Egg (Light, según RJ) [RJ:322-323; RY:762; LP:519]. Ultimate extra (MetalGreymon azul en el LP) [LP:517-518] |
| Steep Road | Hablar con Ken (elige el 3.er partner) y con Megadramon [RJ:334-336; RY:771-775] | Goburimon, Demidevimon, Megadramon; después repetir con Gigadramon al final [RJ:338-347; RY:776-817] | Megadramon no es el verdadero maestro: aparece Gigadramon y hay que repetir el arena [RJ:343-347; RY:805-808] | Black Pack [RY:818]. 3 packs de premio al final [LP:577] |
| Wiseman Tower | MetalGreymon (el Agumon de Beginner) abre el arena [RJ:352-353; RY:826-829; LP:593] | Togemon, Kabuterimon, Ikkakumon, Birdramon, WereGarurumon, MetalGreymon [RJ:358-362; RY:831-882] | MetalGreymon | S-Green, S-Blue y S-Red Pack [RY:885] (LP: 3 packs de premio [LP:654]). Hablar con WereGarurumon da la carta Hacking [RY:888-889; V06:157-158; LP:654]. MetalGreymon da el 1.er Digi-Egg del 3.er partner y abre el trade [RJ:364-365; RY:890-893; LP:656-661]. Mejor Fusion Shop [RJ:365-366; LP:666] |
| Infinity Tower | Hablar con VenomMyotismon [RJ:370-371; RY:921] | Tuskmon, Phantomon, MegaSeadramon, Machinedramon, VenomMyotismon [RJ:373-382; RY:930-987] | VenomMyotismon | Super Packs (rivales 1-4) y Black Pack (final) [RY:936-977]; arena S-Blue, S-Yellow, S-Black [RY:988]. Hay guardado antes del 4.º combate; después no se puede salir hasta limpiar la torre [RJ:378-379; LP:732] |
| Infinity Tower "A" | Tras vencer a VenomMyotismon la torre cambia; hablar con Rosemon abre el arena [RJ:384-399; RY:989-1000] | Un único rival: A / Analogman (deck "Darkness Wave") [RJ:400-410; RY:1012-1021] | A | Great Pack [RY:1019]. Créditos. No se puede guardar ni salir [RJ:388-390]. A mueve tus partners al fondo del mazo y no baraja su mazo [RJ:401-404; RY:1020-1021; LP:774-779] |

Notas por ciudad:
- Número de rivales en Beginner: 2 [RJ:171-176]; Jungle: 4 [RJ:223-231]; Igloo: 4 [RJ:241-250]; Junk: 4 [RJ:264-272]; Dark: 5 [RJ:291-294]; Pyramid: 3; Sky: 3; Steep: 3 (+1 al repetir) ; Wiseman: 6; Infinity: 5 [RJ].
- Los "Battle Cafe" del principio también permiten combatir a los NPC (Betamon, Babamon, Agumon) [RJ:167-169, 181-183]. Ficky lista a Betamon, Babamon y Agumon como Card Tamers del Cafe de Beginner [V00:358-366].
- Los rivales dejan bajo "Pack": basic en casi todo Mega; Hyper en los rivales finales de Jungle/Igloo/Junk y en casi todo Giga y Tera [RY:211-213, 439, 511, 574, 609-653, 680-702].
- RY indica el nombre del mazo de cada rival (p. ej. "Go Go Dinosaur" de Veemon, "V for Victory" de Veedramon) y valores de Attack/Defense/Digivolve speed 1-5 [RY:273-1019]. Analogman tiene 5/5/5 [RY:1013-1018]. DL contiene las listas de cartas de 125 mazos base [DL:1-9].

### 2.1 Mazos iniciales por partner (inferencia de DL)
Red Deck (Veemon), Green Deck (Hawkmon), Yellow Deck (Armadillomon), Shadra Deck (Wormmon) [DL:652-671; la identificación es inferencia de la cabecera, DL:3]. V00 confirma "First deck: Red Deck (Veemon)" y "Green Deck (Hawkmon)" [V00:72, 111]. El LP dice que Armadillomon trae mazo amarillo y azul [LP:67-68] y Veemon rojo y negro [LP:68].

---

## 3. Postgame: orden de los arcos

RJ y YS dan el orden. Resumo con las diferencias.

| Paso | Qué hacer | Rivales y recompensa | Fuentes |
|---|---|---|---|
| 1 | Volver a Beginner City y hablar con Tai | Tai pide vigilar a Myotismon; manda a Desert Island | [RJ:425-429; YS:366-367; LP:812] |
| 2 | Desert Island (Myotismon) | Regla: solo Myotismon usa cartas Option; no vale ningún mazo con Option. Rivales: Leomon, Devimon, MetalEtemon, Myotismon [RJ:430-439; RY:1080-1118]. Pack Super; arena pack S-Black [RY:1121]; el LP dice que no hay recompensa [LP:933] | [RJ:429-439; RY:1077-1121; LP:872, 933] |
| 3 | Beginner (Tai y Rosemon) | Rosemon avisa de problemas en Dark City. Babamon desaparece de la ciudad [LP:935] | [RJ:440-443; RY:1124-1126; LP:934-937] |
| 4 | Dark City: Haunted Arena | Bakemon, Devimon, (RY: SkullGreymon), Myotismon [RY:1131-1168; RJ:448-454]. RJ: 3 revanchas con Myotismon sin premio [RJ:452-454]; RY: pack Super y arena pack S-Black [RY:1168] | [RJ:444-454; RY:1127-1168; LP:937-966] |
| 5 | Beginner: Greymon abre un arena nuevo | Penguinmon, Rosemon, Greymon [RJ:505-508; RY:1171-1198]; Option Pack [RY:1199]. En el LP, Greymon reemplaza a MetalGreymon [LP:936] | [RJ:499-508; RY:1171-1199; YS:371-372] |
| 6 | Segundos DigiDestined en orden: Davis (Flame), Yolei (Jungle), Cody (Igloo), T.K. (Pyramid), Kari (Sky) | RJ: "aún no podrás con Ken" [RJ:458-462]; RY: Davis, Veemon, Yolie, Hawkmon, Cody, Armadillomon, Tk, Patamon, Kari, Gatomon [RY:1200-1204]. En cada ciudad hay luego un "Extra Arena" con las armaduras | [RJ:456-482; RY:1200-1344; LP:819-868] |
| 7 | Wizardmon en Sky City (varita) | Passwords: ver sección 10 | [RJ:481-494; RY:1051-1068; LP:813] |
| 8 | Extra Arenas / armaduras | Ver 3.1 | [RJ:497-551] |
| 9 | DigiDestined originales | Ver 3.2 | [RJ:553-594; RY:1346-1443] |
| 10 | Dark Masters (Infinity Tower) | Metalseadramon, Puppetmon, Ladydevimon, Piedmon [RJ:598-611] | [RJ:596-611; RY:1444-1455; LP:1542-1565] |
| 11 | Piximon / Pixiemon (Steep Road, sin arena) | Un combate en el Cafe; premio Speed Sevens | [RJ:613-619; YS:384-385, 692-693; RY:1465-1467; LP:1566-1570] |
| 12 | Wiseman Tower otra vez | Los 6 ultimates (Lilymon...Wargreymon) | [RJ:621-633; LP:1571-1574] |
| 13 | Segunda ronda de extras (Paildramon... Seraphimon) | Ver 3.3 | [RJ:635-707; YS:386-402] |
| 14 | Última cadena: Diaboromon, Omnimon, Imperialdramon, Apokarimon, BKMetalGarurumon, BlackWarGreymon | Ver 3.4 | [YS:389-413; LP:1576-1591, 1613-1700] |

RJ termina en Seraphimon (no incluye Diaboromon, Omnimon, Imperialdramon ni Apokarimon) [RJ:702-707].

### 3.1 Extra Arenas (primer ciclo)
| Ciudad | Anfitrión que abre el arena | Rivales | Fuentes |
|---|---|---|---|
| Beginner | Greymon (reabre el arena) | Penguinmon, Rosemon, Greymon | [RJ:500-508; RY:1171-1198] |
| Flame | Exveemon | Exveemon, Flamedramon, Raidramon (último con Super Pack) | [RJ:510-519; RY:1217-1262] |
| Jungle | Hawkmon | Hawkmon, Aquilamon, Halsemon | [RJ:520-525; RY:1276-1314] |
| Jungle (Beet Arena) | Hercules Kabuterimon | RJ: Kuwagamon y Hercules Kabuterimon (2); RY: Kuwagamon, Ninjamon, HKabuterimon (3); LP: tres rondas, Kuwagamon en la 1.ª [LP:1153-1166] | [RJ:526-527; RY:1360-1368; LP:1153-1167] |
| Igloo | (Armadillomon) | Armadillomon, Ankylomon, Digmon | [RJ:528-531; RY:1317-1329; LP:1168-1181] |
| Junk | Thundermon | Thundermon, Metal Mamemon, Superstarmon | [RJ:533-537; RY:1381-1393; LP:1042-1055] |
| Pyramid | (Patamon) | RJ: Angemon, Baronmon, Pegasusmon; RY: Patamon, Baronmon, Pegasusmon; LP confirma Patamon con mazo solo de Rookies | [RJ:538-542; RY:1330-1332; LP:1230] |
| Sky | Gatomon | Gatomon, Nefertimon, Tylomon | [RJ:543-551; RY:1337-1339; LP:1251] |

Dónde se obtienen las cartas del Beet Arena: pack verde [LP:1151, 1167].
Los extra arenas no tienen mejora de premio ("las recompensas nunca mejoran") [LP:1478].

### 3.2 DigiDestined originales (tras vencer a Piedmon... y a las armaduras)
- Hay que combatir primero la forma Ultimate de su digimon y luego a la persona. Orden: Tai, Sora, Mimi, Matt, Joe, Izzy [RJ:555-557; V00:150-157; YS:374-383].
- Beginner: Wargreymon abre el arena (mismo que el anterior pero con WarGreymon) y luego Tai [RJ:559-565; RY:1346-1357; LP:1265-1267]. En el LP, solo cambia el último rival y hay que rehacerlo todo [LP:1267]. Tai, tras vencerle, da el Digi-Egg (Tylomon para Gatomon) [YS:375-378; LP:1281-1283].
- Flame: Garudamon y luego Sora. Paildramon aparece en el Cafe pero no se puede retar aún [RJ:566-570; YS:379-387; RY:1403-1408].
- Jungle: Lilymon y Mimi [RJ:571-574; RY:1409-1413].
- Igloo: MetalGarurumon y Matt; luego el arena de Igloo cambia (MetalGarurumon en vez de Garurumon) y es permanente [RJ:575-580; LP:1376-1385]. Importante: si no se completó el arena original de Garurumon antes, se pierde ese % para siempre [LP:272, 1376].
- Junk: Zudomon y Joe [RJ:581-585; RY:1421-1429]. Joe usa un mazo con Imperialdramon (el LP lo considera raro) [LP:1537].
- Dark City: MegaKabuterimon e Izzy; Izzy da la Mutant Fusing data [RJ:586-594; RY:1430-1443; LP:1461, 1541].
- Recompensa de todo el set: Mutant Fusion data [RJ:591-594]. Beat Izzy desbloquea también un nuevo arena en Infinity Tower (Dark Masters) [LP:1542].

### 3.3 Segunda ronda: Ultimates de armadura
Cada ciudad añade un nuevo rival en su Extra Arena (hay que rehacer el arena entero cada vez) [YS:386-395; LP:1058, 1267].
| Ciudad | Nuevo final | Previos | Fuentes |
|---|---|---|---|
| Flame | Paildramon (no se puede retar en el Cafe) | Flamedramon, Raidramon | [RJ:635-645; RY:1467-1470] |
| Jungle | Shurimon | Aquilamon, Halsemon | [RJ:647-651; RY:1471] |
| Igloo | Submarimon | Ankylomon, Digmon | [RJ:653-658; RY:1472-1473] |
| Pyramid | Magnaangemon | Baronmon, Pegasusmon | [RJ:660-665; RY:1473-1474] |
| Sky | Angewomon | Nefertimon, Tylomon | [RJ:667-671; RY:1474-1475] |
| Steep Road | Grankuwagamon; luego Ken (6 veces en total, ver 11) | — | [RJ:673-679; RY:1475; YS:391; LP:1479-1494] |
| Infinity Tower | Diaboromon abre un arena | Infermon antes de Diaboromon (LP) | [YS:390; LP:1576-1578; RY:1476] |
| Flame (otra vez) | Magnamon (Veemon) | Raidramon, Paildramon | [RJ:681-686; LP:1496-1499] |
| Jungle | Sylphymon | Halsemon, Shurimon | [RJ:688-694; LP:1500] |
| Igloo | Shakkoumon | Digmon, Submarimon | [RJ:696-700; LP:1503-1505] |
| Pyramid | Seraphimon | Baronmon, Pegasusmon | [RJ:702-706; LP:1506-1508] |
| Sky | Magnadramon (LP) | — | [LP:1510] |
| Wiseman | Omnimon abre arena; da el 2.º Digi-Egg del tercer partner | Seis rivales otra vez | [YS:396-398; LP:1584-1591] |
| Flame | Imperialdramon | — | [YS:399-401; LP:1619] |
| Igloo | BKMetalGarurumon | — | [YS:401-402, 407-408; LP:1628-1635] |
| Infinity Tower | Apokarimon | — | [YS:402-406; LP:1636-1641] |
| Beginner | BlackWarGreymon (requiere 300 victorias) | — | [YS:409-412; LP:1642-1700] |

RY resume el "Season 3": rehacer las extras con las armaduras (Flamedramon, Raidramon, Paildramon...), luego "Magnamon, Valkyrimon, Vikemon, Seraphimon, Magnadramon" y luego Wiseman con Omnimon [RY:1459-1482]; después "otras 100 batallas" y BKWarGreymon [RY:1482-1483]. RY nombra Valkyrimon y Vikemon donde YS/LP no las lista como rivales; no hay más detalle.

### 3.4 Los dos jefes finales extra
- BlackWarGreymon (Beginner City): aparece tras 300 victorias y vencer a BKMetalGarurumon [V06:201-202; LP:1688; YS:409-412 "300 veces o más"; DS:194 (corregido en DS:196-198)]. Recompensas: tercer Digi-Egg de Veemon (Miracles) [YS:444-446; V02:103-105]; pantalla de estadísticas y título final [YS:439-443; DS:444-450]; Betamon pasa a usar un mazo de ultimates [YS:447-455; LP:1690-1692].
- A / Analogman: único rival del "Infinity Tower A" (ver sección 2).

---

## 4. Recompensas tras los combates

### 4.1 Packs
- Cada victoria da un pack de 3 cartas aleatorias [RY:179-181, 307-309; LP:45; MAN:1769-1771]. Además hay un "Arena Pack" extra por ganar el arena [RY:305-307].
- Tipos de pack según RY [RY:183-196]:
  - Multicolor: Basic (rookies de todos los tipos), Super (campeones, rookies y opciones), Hyper (campeones, algunos rookies y ultimates).
  - Color: Red, Blue, Green, Black, Yellow (campeones del color y algunos rookies).
  - S-Color: S-Red, S-Blue, S-Green (ultimates del color y algunos campeones). RY también menciona S-Black y S-Yellow como arena packs [RY:988, 1121].
  - Option Pack. "Great Pack" es el mejor (LP: el mejor pack; mazo de A) [LP:1552; RY:1019].
- En Season 1 Mega Domain solo salen packs Basic de los combates normales; a veces color packs por rematch de rivales que piden revancha [RY:198-209]. En Giga y Tera salen más Hyper [RY:211-213].
- RY y V02 aconsejan repetir un arena para obtener mejores cartas [RY:146-152; V02:33-34]. DS: repetir el arena de Wormmon ya no da Ultimates [DS:174-176]; V02:39-41 dice lo contrario (Dark City da pack y Ultimate); conflicto.
- Digi-parts de rarezas: las partes S-effect 126 y 127 suben la probabilidad de carta rara tras el combate [DS:80-83]. Llevar ambas no mejora; podría empeorar [DS:167-170].
- Premio de ultimates "bonus" tras limpiar un arena por primera vez o en su repetición [RJ:176-178; LP:58, 202, 355, 433, 480, 517-518].

### 4.2 Experiencia del partner y Digi-Parts
- Los partners ganan EXP en cada victoria mientras estén en el mazo usado; si no hay partner en el mazo no hay EXP ni Digi-Parts [YS:233-239, 561; RY:244-246; MAN:1769-1772]. Todos los partners reciben la misma EXP [LP:313].
- Cada subida de rango puede dar Digi-Parts; el orden de reparto cambia por partner [LP:52, 124-126]. Los stats base suben cada 5 rangos [V00:558-560; LP:115]. Hay +10 aleatorio a un stat (hasta 20 veces) [LP:383]. Rango máximo 99, EXP máxima 9999 [YS:795-796].
- Cada partner lleva hasta 3 Digi-Parts a la vez [RY:248-250; LP:124]. Efectos: stats, cambiar el efecto de soporte, el efecto X; también afectan a las armaduras [LP:124].
- Total de Digi-Parts: 128 (0 a 127) [V06:103; DS:459-462]. Por subida de nivel de los partners salen 118; el 118 llega con el último partner en rango 96 [V06:104-105]. Otros: ganar a Keely, T.K., Ken 7 veces; Cody 8 veces; Davis 10 veces [V06:107-109]; fusión de partner con su forma final (Veemon-Imperialdramon (?), Hawkmon-Valkyrimon, Armadillomon-Vikemon, Patamon-AeroVeedramon, Gatomon-Magnadramon (?), Wormmon-GranKuwagamon (?)) [V06:110-116]; Nanimon 5 veces [V06:117]; GranKuwagamon 5 seguidas = Digi-Part #99 [V06:118; YS:1228-1231; DS:459-464]; Ken 4 seguidas = #114 [YS:1232-1235]. DS dice que la fusión con la forma final es solo rumor y no le funcionó [DS:478-480].
- Con tres partners (Veemon, Patamon y Wormmon) el tester de TM tenía rango 99 + 3/2/2 Digi-Eggs [TM:869-871].
- Convertir cartas sobrantes en EXP del partner se hace en la Fusion Shop ("Partner Card Fusion"); más EXP si el color coincide [MAN:702-703; LP:132, 578; RY:517-518].

### 4.3 Bonos de EXP (nombre: puntos)
Fuentes: manual [MAN:2276-2604], YS [YS:487-560] y LP [LP:1654-1682]. Los números del manual vienen del OCR.

| Bono | Puntos según MAN | YS | LP / notas |
|---|---|---|---|
| EXP del rival | — | Depende del rival; ganar a A da 30 [YS:489-491] | V06 dice 50 para A [V06:120-121]; Betamon (postgame) 33 [YS:452-453], >30 [V02:17-18]; Apokarimon 25 [YS:710-711] |
| All O / All T / All X Attack Win | 3 cada uno [MAN:2297-2318] | 3 [YS:492-497] | "All Same Attack" [LP:1656] |
| All Gamble Win | 5 [MAN:2321-2324] | — | [LP:1657] |
| All-or-Nothing Gamble Win | 2 [MAN:2330-2337] | "Last Chance Gamble Win" 2 [YS:500-501] | "Final Gamble" [LP:1658] |
| No Support Card Win | 5 [MAN:2340-2346] | 5 [YS:502-503] | [LP:1659] |
| No Digivolve Win | 3 [MAN:2349-2355] | 3; las armaduras cuentan como digievolución [YS:504-505] | [LP:1660] |
| No Discard Win | 1 [MAN:2358-2364] | 1 [YS:506-507] | [LP:1661] |
| 4-of-a-Kind Win | 5 [MAN:2367-2373] | sin cifra [YS:508] | [LP:1662] |
| Online Card Left Win | 2 [MAN:2376-2383] | 2 [YS:509-510] | "Empty Deck" [LP:1663] |
| Partner Win | 1 [MAN:2386-2392] | 1 [YS:511-512] | [LP:1664] |
| No Loss Win | 3 [MAN:2395-2401] | 3 [YS:513] | [LP:1665] |
| Comeback Win | 3 [MAN:2404-2410] | 3 [YS:515-516] | [LP:1666] |
| Desperate Win | cifra ilegible en OCR ("7") [MAN:2413-2421] | sin cifra [YS:517] | [LP:1667] |
| All Gone Win | 2 [MAN:2424-2427] | 2 [YS:518-519] | "Nothing Left" [LP:1668] |
| Ultimate Level Win | 3 [MAN:2430-2436] | 3 [YS:520-521] | [LP:1669] |
| Option Maniac Win | 5, "más de 25 opciones" [MAN:2439-2445] | sin cifra [YS:522] | "24 Options" [LP:1670]; conflicto 25/24 |
| 8 DP Card Win | 8 [MAN:2448-2454] | 8 [YS:523-524] | [LP:1671] |
| Lucky Seven Win | 1, "7 cartas en el Online Deck" [MAN:2457-2463] | "último golpe con contraataque" [YS:525-526] | [LP:1672]; conflicto de definición |
| Just Enough Attack Win | 3 [MAN:2466-2472] | 3 [YS:527-528] | [LP:1673] |
| 12 S-Jewel Cards Win | cifra ilegible [MAN:2475-2480] | [YS:529-530] | "Digi-Jewels" [LP:1674] |
| Choke Loss | 2 [MAN:2510-2516] | 2 [YS:531-534] | — |
| Loss by Gamble | 2 [MAN:2519-2526] | [YS:535-536] | — |
| Total Loss | 1 [MAN:2529-2535] | 1 [YS:537-538] | — |
| Rainbow | 2 [MAN:2542-2548] | 2; necesita Mutant o Special Digivolve [YS:539-544] | usa los 5 colores en la partida [LP:1651, 1675] |
| Damage Fever ("Mega Damage") | 10, tres cifras iguales (ej. 1110) [MAN:2551-2558] | 5/10/15 por 1110, 2220… [YS:545-549] | [LP:1676] |
| HP Fever ("Mega HP") | 7 [MAN:2561-2567] | 7 por HP 1110, 2220, 3330 [YS:550-551] | [LP:1677] |
| 3 Partners | 2 [MAN:2570-2576] | [YS:552-553] | [LP:1678] |
| 3 Partners Plus | 2 [MAN:2579-2585] | [YS:554] | [LP:1679] |
| Partner Normal Digivolve | 2, subir a Level U sin cartas de digievolución [MAN:2588-2595] | 3, "a U" [YS:555-557] | LP: "Partner Evolution" a Champion [LP:1680]; conflicto |
| Super Bonus | 10, "más de 7 bonos" [MAN:2598-2604] | 10, "8 bonos distintos" [YS:558-559] | "siete o más" [LP:1653, 1681] |
| Lucky Name | no aparece en MAN | no aparece | "exclusivo de la versión japonesa" si el mazo tiene cierto nombre [LP:1682] |

Notas:
- HP Fever fácil: dejar el HP del rookie en exactamente 1110 [DS:216-222]; Armadillomon con HP+100/+400 y curar [V02:10-15; V06:137-139]; Vegiemon con Small Recovery Floppy [V02:13-15].
- Super Bonus fácil: usar a Betamon con mazo "pick-up" tras BKWarGreymon, con trucos descritos en V02:16-32 y V06:119-135; LP recomienda mazo de 3 partners + 27 opciones y jugar contra Ninjamon [LP:1683-1685]; la estrategia de partners + opciones también da Partner Win, Option Maniac [LP:1603-1605].
- "Red Knight" no aparece en ninguna fuente.

---

## 5. Partners, Digi-Eggs y armaduras

### 5.1 Elección de partners
- Inicio: Veemon (fuego), Hawkmon (digievolución rápida, nature) o Armadillomon (defensa, rare) [YS:123-132; RJ:144-146]. Cada partner trae su mazo inicial [MAN:480-481; RJ:145-146].
- Segundo partner: Cody (Igloo) ofrece Patamon o Gatomon [RJ:252-255; RY:519-522; LP:279-282].
- Tercer partner: Ken (Steep Road) ofrece los que no tengas [RJ:334-336; RY:822-825; LP:532-535]. RY: se puede elegir entre los seis excepto los ya obtenidos [RY:822-825]; YS: los tres partners tardíos son Wormmon/Patamon/Gatomon y se elige uno [YS:138-146]; LP: la encuesta de la 3.ª incluía Veemon y Hawkmon [LP:435-440]. Si eliges Veemon aquí ya no puedes tener su 3.ª armadura [RY:824-825; LP:437-438].
- Solo se pueden usar 3 partners; el resto solo existen como hueco del Digidex y se consiguen prestados de los DigiDestined [YS:148, 477-481; V06:87-97].
- Los partners pueden estar en un mismo mazo (hasta 4 copias); el LP destaca que solo 3 cartas por mazo pueden tener Digi-Parts si no se duplica [LP:125].

### 5.2 Armaduras por partner
| Partner | Armaduras | Fuente |
|---|---|---|
| Veemon | Flamedramon, Raidramon, Magnamon | [YS:126-128; RJ:208-209] |
| Hawkmon | Halsemon, Shurimon | [YS:129-130; RJ:209-210] |
| Armadillomon | Digmon, Submarimon | [YS:131-132; RJ:210-211] |
| Wormmon | Shadramon, Quetzalmon | [YS:140-141] |
| Patamon | Pegasusmon, Baronmon | [YS:142-143] |
| Gatomon | Nefertimon, Tylomon | [YS:144-145] |
Todos tienen dos armaduras, salvo Veemon con tres solo si fue el primer partner [YS:147; RY:252-254; V02:60-62; LP:11, 437-438].

### 5.3 Cuándo se consiguen los Digi-Eggs
| Partner | 1.er Digi-Egg | 2.º Digi-Egg | 3.er Digi-Egg |
|---|---|---|---|
| 1.º (Veemon/Hawkmon/Armadillomon) | Davis, Flame City (Courage/Love/Knowledge) [RJ:206-211; V02:99-102] | Wormmon en Dark City (Friendship/Sincerity/Reliability) [RJ:296-298; RY:659-661]; el LP lo recibe tras repetir el arena [LP:430-432] | Solo Veemon: BlackWarGreymon tras vencerle (Miracles) [YS:152, 444-446; V02:103-105] |
| 2.º (Patamon) | T.K., Pyramid (Hope) [RJ:309-310; YS:148] | Tai, postgame [YS:150] | — |
| 2.º (Gatomon) | Kari, Sky City (Light, según RJ) [RJ:322-323; RY:762; LP:519] | Tai [YS:150; LP:1281-1283]; RY lo da al terminar el arena de Beginner (Digi-egg of Reliability) [RY:1355-1357] | — |
| 3.º | MetalGreymon, Wiseman Tower [RJ:364; RY:890-893; YS:149; LP:660] | Omnimon, Wiseman Tower [YS:151; LP:1591] | — |

El nombre de los Digi-Eggs se contradice entre fuentes (ver sección 14).
- Cambio de armadura: L1/R1 en Partner [RY:254-257; YS:272-273]. Armor Digivolve sin coste, no llegan a Champion/Ultimate normalmente [LP:122].
- El enemigo A manda al fondo del mazo las cartas de partner [RJ:402-404; V06:151-153]; "Partner Finder" y "Hacking" son las cartas citadas para compensarlo [RJ:392-408; V06:154-158; LP:710].

### 5.4 Prestar mazos de partners (DigiDestined)
- Davis presta mazos de Veemon, Keely de Hawkmon, Kari de Gatomon, T.K. de Patamon, Cody de Armadillomon, Ken de Wormmon [DS:122-129]. El orden de préstamo es fijo y distinto según partida (a DS le tocó Kari, luego Davis, luego Keely) [DS:130-132].
- Para tener la carta de partner (y armaduras) que no elegiste hay que usar esos mazos prestados: cada 3.ª ronda te obligan a usar su mazo (sin EXP) [LP:825-828]; V06 dice que se obtienen vencerles muchas veces y Ken solo después de vencer a los antiguos DigiDestined y a GranKuwagamon [V06:87-97].

---

## 6. Fusion Shop

### 6.1 Dónde y cuándo
| Tienda | Cuándo se abre | Qué permite | Fuentes |
|---|---|---|---|
| Flame City | Tras ganar el arena de Flame | Rookies y opciones; no se sabe el resultado excepto el color | [RJ:211-212; YS:252-254; LP:129-131] |
| Pyramid City | Tras ganar el arena | Rookie + Champion + Option | [RY:709-710; LP:482] |
| Sky City | YS aconseja no fusionar "en Flame ni en Sky" | Sin más datos | [YS:784-785] |
| Wiseman Tower | Tras ganar el arena | Fusiona cualquier nivel; el juego muestra el resultado exacto antes de confirmar | [RJ:365-366; LP:666; V02:47-48] |

- Andromon: YS dice que en Wiseman Tower "Andromon dice el resultado" [YS:783-786]. RY menciona a "AndromonNo.2" (avisa si saldrá una carta de digievolución) y "AndromonNo.3" (cuenta lo que saldrá) [RY:909-914] y que Tuskmon + Guardromon hace Hacking en el Fusion Shop de Wiseman [RY:916-918]. Ninguna otra fuente nombra a Andromon como dependiente.
- Mutación: Izzy da la "Mutant Fusing data" (avisa de fusiones anómalas) [RJ:591-594; RY:1440-1443]; LP: tras Izzy ya no se sabe qué carta saldrá en una mutación [LP:1541]; DS: antes de Izzy la mutación se indica y se conoce el resultado [DS:72-79]; V06: hacer mutaciones antes de Izzy [V06:61]. TM dice que las mutaciones solo ocurren tras Izzy [TM:536-538]: conflicto.
- Gatomon da un objeto que avisa si la combinación es una Special Fusion (LP:816-817, explicado como el 0,6% de completado que faltaba LP:810, 817). Solo el LP lo cuenta.

### 6.2 Costes
Ninguna fuente menciona un coste en dinero. El coste son las dos cartas entregadas [LP:130; MAN:698]. Máximo 6 copias por carta; las sobrantes se fusionan [YS:248-250; LP:130]. El % de colección no baja al fusionar [YS:266-269]. Las fusiones son por tanto gratuitas; el límite es tener cartas.

### 6.3 Reglas de color
| Resultado | Entradas | Fuentes |
|---|---|---|
| Fire (rojo) | Darkness+Ice, Darkness+Rare, Fire+Option | [YS:630-632; RY:1503-1506; LP:674, 678] |
| Ice (azul) | Nature+Darkness, Fire+Rare, Ice+Option | [YS:633-635; RY:1507-1510; LP:672, 676] |
| Nature (verde) | Fire+Ice, Ice+Rare, Nature+Option | [YS:636-638; RY:1511-1513; LP:669, 675] |
| Darkness (negro) | Nature+Rare, Fire+Nature, Darkness+Option | [YS:639-641; LP:670, 677] |
| Rare (amarillo) | Fire+Darkness, Ice+Nature, Rare+Option | [YS:642-644; RY:1519-1522; LP:671, 673] |
- Igual color o dos Options = Option [YS:628-629; RY:1523; LP:679]. Un Digimon + Option = carta del color del Digimon [YS:630-644; LP:679].
- Discrepancia: RY lista como Dark "Nature + Water" (= Nature + Ice) [RY:1514-1516]; YS y LP dicen que Ice+Nature da Rare [YS:644; LP:673]. Probablemente errata en RY.
- Gráfico de Eon Strife [YS:645-665] resume lo mismo.
- V02 sugiere que para Water se fusiona Fire con otro tipo [V02:82-86].

### 6.4 Reglas de nivel y de resultado
Tres modelos en las fuentes:
1. Tabla de niveles del LP: R+R=R; R+C=C; R+U=C; C+C=C; C+U=C; U+U=U; con Option depende de la opción [LP:680-687]. Choca con recetas de TM: Machinedramon (U) + Whamon (C) = MetalGreymon (Ultimate) [TM:104] y Piedmon (U) + Numemon (C) = Vermilimon (Ultimate) [TM:115] (Whamon y Numemon son Champion: CL-WM:54, 162).
2. Regla de posición de Ronald Pascal: el resultado es la media (redondeada abajo) de las posiciones de las dos cartas en su tipo; hay un tope por tipo: Fire hasta WarGreymon, Ice hasta MetalGarurumon, Nature hasta HerculesKabuterimon, Dark hasta Piedmon, Rare hasta Shakkoumon; sobre eso solo vale fusión especial o ganando [DS:97-121; YS:718-743].
3. Regla de puntos (Pagini, vía RY): cada carta tiene "Fusion Points" y "Result Points"; ejemplo: Were-Monzaemon (Dark, 19) + Zudomon (Water, 16) = War-Greymon (Fire, resultado 35) [RY:1524-1584]. CL-WM tiene las columnas "Composite Value" y "Result Value" con esos mismos números (p. ej. WarGreymon 18 / 35, Paildramon 17 / 33) [CL-WM:4, 7, 9; RY:1533-1535].
- **[derivado]** Comprobé la regla de puntos contra TM: de las 73 recetas Digimon+Digimon de TM cuyas tres cartas están en la tabla de Pagini, 71 cumplen suma de Fusion Points = Result Points de la carta resultante (a falta de la mayoría de Rookies y Champions, que no están en la tabla). Las dos excepciones: Shakkoumon + WaruMonzaemon = WarGreymon (suma 36, resultado 35; consistente con un tope Fire) [TM:99] y MetalSeadramon + Kuwagamon = MetalMamemon (suma 24, resultado 27) [TM:324]. La regla de la media de posiciones no se pudo contrastar con las cartas porque no hay tabla de posiciones.
- El color y el nivel del resultado quedan entonces fijados por el valor y las reglas de color (la tabla del LP es una simplificación). Esto es una interpretación mía de las tres fuentes; ninguna fuente lo enuncia así.

### 6.5 Fusión de opciones
- La fusión de opciones usa tablas aleatorias que dependen de las cartas usadas: cartas bajas dan opciones bajas; las jewels son mutaciones raras [RY:168-177]. RY: no se puede predecir por fórmula como en Digimon [RY:168-170].
- TM lista "Option Fusions 1" (dos opciones, mismos inputs con varios resultados, por eso es aleatorio) [TM:587-737] y "Option Fusions 2" (dos digimon del mismo tipo en Wiseman; cuanto más alto el nivel mejor la opción) [TM:739-831]. Ejemplo: Golden Banana + Whistle da Cherrymon's Mist, Devil's Chip, Giga Hand o Shining Mane [TM:611-614].
- RY: lista de resultados de opciones con sus recetas (formato ambiguo) [RY:1594-1801].
- D+O Fusions: Digimon + Option; el resultado depende del tipo de Digimon [TM:377-510].
- Consejos: Yanmamon + Yanmamon o 2 Akatorimon suelen dar opciones de digievolución [RY:906-912].

### 6.6 Fusiones especiales (Special Fusion)
Muestran animación 3D [V02:106-108; LP:1024-1025].
| Resultado | Receta | Fuentes |
|---|---|---|
| Paildramon | ExVeemon + Stingmon | [TM:515; YS:677 (012+117); V02:111] |
| Omnimon I | MetalGarurumon + WarGreymon | [TM:516; YS:673 (002+037); V02:114] |
| Omnimon II | WereGarurumon + RealMetalGreymon | [TM:517; YS:672 (006+039); V02:113] |
| Imperialdramon | TM/V02: Paildramon + Omnimon II. YS/V06: 001+004 (= Omnimon I + Paildramon). V06 añade 004+035 | [TM:514; V02:47-48, 116; YS:675; V06:72] |
| Vikemon | Shakkoumon + Zudomon | [TM:518; YS:673] |
| MetalSeadramon | MegaSeadramon + WaruSeadramon | [TM:519; YS:677] |
| AeroVeedramon | TM/V02: Phoenixmon + Veedramon. YS/V06: 013+083 (= Aquilamon + R-Gatomon) | [TM:520; V02:42-43; YS:671; V06:69] |
| Rosemon | Myotismon + Lillymon | [TM:521; YS:679; V02:54-55] |
| Seraphimon | MagnaAngemon + Jijimon | [TM:522; YS:672; V02:56-57] |
| Valkyrimon | Sylphymon + Garudamon | [TM:523; YS:678; V02:58-59] |
| Sylphymon | Aquilamon + R.Gatomon | [TM:524; V02:112] |
| Magnadramon | MagnaAngemon + Angewomon | [TM:525; YS:676; V02:117] |
| GranKuwagamon | HerculesKabuterimon + Megadramon (V06 añade 005+074 = Gigadramon + HKabuterimon) | [TM:526; YS:676; V06:71] |
| Diaboromon | Digitamamon + Infermon | [TM:527; YS:678; V02:44-45] |
| VenomMyotismon | LadyDevimon + Myotismon | [TM:528; YS:678; V02:119] |
| SuperStarmon | Vademon + MarineAngemon | [TM:529; YS:671; V02:122] |
| MetalEtemon | Andromon + Etemon | [TM:530; YS:675; V02:52-53] |
| Puppetmon | WaruMonzaemon + Monzaemon | [TM:531; YS:674; V02:109] |
| Shakkoumon | Angemon + Ankylomon | [TM:532; YS:674; V02:115] |
- Los números de YS se descifran con CL-RY (001 Omnimon I, 013 Aquilamon, 083 R-Gatomon, etc.) [CL-RY:15-134, 159-167].
- V02 incluye otros: Infermon = Paildramon + Silphymon o Silphymon + Shakkoumon [V02:121]; Digitamamon = HKabuterimon + Brachiomon [V02:120]. TM da Infermon como fusión normal Dark [TM:278-279] y Digitamamon como normal Rare [TM:345]. V02 también se contradice: pone Paildramon con "Shakkoumon + WaruMonzaemon" [V02:49-50] y esa misma pareja para WarGreymon [V02:65-66].
- Fusiones simples útiles: Piedmon = MetalEtemon + Angewomon [V02:52-53] (TM da Piedmon con Imperialdramon+Seraphimon, WarGreymon+AeroVeedramon, etc. [TM:267-270]); Rosemon y Seraphimon como arriba.

### 6.7 Mutaciones y Digi-Jewels
- Una mutación sustituye el resultado esperado por una carta rara; son 13 cartas "malas" para el LP [LP:688-689]. Hay 12 Digi-Jewels (Garnet a Turquoise, 273-284) [CL-RY:290-301; LP:899; MAN:2475-2480]; las jewels solo se obtienen con mutación [DS:70-79; LP:899].
- La mutación es aleatoria; las cartas Jewel y las U tienen más probabilidad; no importa tener 6 copias [V06:58-66].
- Lista de mutaciones de TM (46): Fake Sevens (muchos pares), Digi-Diamond, Digi-Turquoise, Digi-Sapphire, Digi-Topaz, Digi-Amethyst, Digi-Pearl, Digi-Aquamarine, Shogun's Order, Evil Program, Devil's Chip, Whistle, Shining Mane, Dark Bone [TM:540-578].
- Las jewels dan EXP de partner a granel y son la razón por la que casi nadie logra el 100% de cartas [LP:899]; el 12-jewels es un bono de EXP [MAN:2475-2480].

---

## 7. Cartas únicas (solo una copia)

| Carta | Cómo se obtiene | Notas | Fuentes |
|---|---|---|---|
| Rosemon's Lure | Vencer a Rosemon una vez | No se puede tradear; 1 copia | [YS:688-689; V06:46; DS:204-206, 157-158] |
| Download Digivolve | Vencer a Rosemon varias veces seguidas sin salir del Cafe | Ver tabla de conflicto | [YS:690-691; DS:199-203; V06:55; RY:1493] |
| Speed Sevens | Vencer a Pixiemon/Piximon (Steep Road) | | [YS:692-693; DS:195; V06:53; RY:1465-1467] |
| Grand Sevens | Nanimon (aparición aleatoria) | | [YS:694-695; DS:189; V06:50; LP:889-890] |
| Mystic Sevens | Kari (Sky City) | | [YS:696-697; DS:193; V06:52] |
| Dark Sevens | Piedmon (Infinity Tower) | | [YS:698-699; DS:190; V06:49] |
| Wild Sevens | Imperialdramon (Flame) | | [YS:700-701; DS:192; V06:47] |
| Holy Sevens | Seraphimon | DS: Pyramid City; YS: Sky City; LP: Pyramid [LP:1506-1508] | [DS:191; YS:702-703; V06:51] |
| Reverse Sevens | BKMetalGarurumon (Igloo) | DS corrige: no BlackWarGreymon sino BKMetalGarurumon | [YS:704-705; DS:190-198; V06:54; LP:1634-1635] |
| Apokarimon | Vencer a Apokarimon; luego aparece en ubicación aleatoria | El LP permite varias copias y dice que aparece si el nº de victorias termina en 9 [LP:1636-1640]; YS dice 1 copia salvo Apokarimon [YS:687] | [YS:706-711; DS:93-96; V06:56-57; LP:1636-1640] |

- Restricciones: Sevens, Lure y Download Digivolve: 1 copia cada uno, no tradeables [YS:251-256; DS:157-158]; no se duplican con el truco de la memory card [V02:36-38]; no puede haber dos Download Digivolve [DS:171-173]. Las cartas de partner tampoco se tradean; las jewels sí [DS:157-158].
- Wizardmon da una sola copia de cada carta [DS:85-92].
- Nanimon aparece en Junk City (combates 1.º y 8.º), Dark City (4.º y 9.º), Steep Road (2.º y 7.º), Infinity Tower (5.º y 10.º) y Desert Island (3.º y 6.º) [LP:875-880]; al vencerle se mueve a la siguiente ciudad y da un pack de Option [LP:883]. Diez victorias dan Grand Sevens [LP:888-890; V06:50; RY:1463-1465]. DS describe a Nanimon como aleatorio y dice que también da Speed Sevens si no la tienes [DS:133-136]; YS lo da como cuestión de "varias veces" [YS:694-695].
- Satisfacer la receta de Sevens exige muchas victorias seguidas sin salir del Cafe [DS:207-208; YS:696-703].

### 7.1 Conflicto de nº de victorias (Sevens, Download Digivolve)
| Carta | YS | DS | V06 | RY | LP |
|---|---|---|---|---|---|
| Download Digivolve | 10 seguidas | 11 seguidas (algunos a la 6.ª) | 10 seguidas | "más de 60 intentos" | primera vez [LP:972-974] |
| Mystic Sevens | 6 seguidas | solo "vence a Kari" | 7 | 7 | — |
| Dark Sevens | 5 | solo "vence a Piedmon" | 5 | 7 | 5 en el Cafe [LP:1564] |
| Holy Sevens | 5 | — | 5 | 8 | 5 [LP:1508] |
| Wild Sevens | 5 | — | 5 | 3 | 5 [LP:1619] |
| Grand Sevens | "varias" | aleatorio | 10 | 10 | 10 [LP:889-890] |
| Reverse Sevens | 1 | tras 300 wins (corregido) | 1 | 1 | 1 [LP:1634-1635] |
Citas: [YS:688-705; DS:187-208; V06:44-55; RY:1487-1493; LP:889-890, 972-974, 1508, 1564, 1619, 1634-1635].
Nota adicional: DS indica que antes del Download Digivolve se recibe Rosemon's Lure y un S-option pack [DS:204-206].

---

## 8. Trade, mazos y límites

### 8.1 Trade
- El trade se desbloquea en el modo historia: al ganar el arena de Wiseman Tower [YS:41-43; LP:660-661; MAN:2023-2024; RY:890-893]. No se puede tradear en partida nueva [YS:43].
- Se usa "Battle with Friend" con dos memory cards [MAN:1994-2021; YS:40-44].
- Reglas (DS:145-160 y YS:39-44): no se puede tradear con tu propio archivo, incluso con copia; con un mismo amigo no se puede intercambiar una carta tras 6 intercambios; las cartas recibidas no cuentan hasta salir y guardar; no se pueden tradear cartas que están en un mazo (las sobrantes sí); Sevens, Rosemon's Lure y partners no se tradean; las jewels sí; las cartas por encima de 6 desaparecen.
- YS: trade es "solo coger" (no hace falta dar) [YS:44].
- Duplicación de cartas: copiar el archivo a otra memory card y tradear (no sirve para Sevens ni Download/Lure) [DS:137-144; V02:35-38].

### 8.2 Mazos
- 3 mazos como máximo en el inventario [MAN:1078; YS:228-229; LP:47]. Cada mazo tiene 30 cartas [YS:228-229; MAN:1800].
- Hasta 4 copias de la misma carta por mazo [YS:232; MAN:1967-1968; RJ:92-94 (RJ nota la incoherencia con el máximo 6 en colección)]. Máximo 6 copias por carta en la colección [YS:248-250; MAN:811-812; DS:159-160].
- Composición recomendada: 10 R, 7 C, 3 U, 10 opciones [YS:234-236; RJ:97-98; LP:986]. El manual: 10+ R, 5-9 C, 0-6 U y 5-8 opciones [MAN:2238-2248]. RY: no más de 7 opciones [RY:444]. YS: máximo 10 [YS:178-179].
- Máximo 1-3 colores [RJ:109-113; MAN:2229-2230].
- Se pueden usar mazos de rivales una vez vencidos si tienes las cartas: presionar cuadrado al elegir mazo [YS:254-265; DS:221-229; LP:1707].
- Desert Island: no se pueden usar mazos con opciones [RY:1080-1081; RJ:430-433; LP:872].
- Guardados: se muestra "Save amount" (máx. 255) y horas máx. 999 [YS:793-794; TM:880-891].
- Una estrella en una carta: YS dice que significa colección completa (6) o solo tener 0-1 [YS:236-238]; DS especula que son cartas obtenidas fuera de los 3 de las batallas [DS:447-455]. Conflicto menor.

---

## 9. Rangos, títulos y estadísticas

- La Player's Room muestra: Game Completion, Card Collection, Digi-Part Stock (porcentajes), estadísticas de COM y 2P y de cada mazo, título de batalla y de coleccionista [RY:230-239; V00:60-84, 100-112; TM:857-871].
- Títulos observados:
  - Rango de Tamer: "Rookie Tamer" [V00:109], "High Level Tamer" [V00:68], "Invincible Tamer" [TM:858]. Betamon llama "Rookie Tamer" al principio [V00:373]. VS Player: "battlebeginner" [DS:491].
  - Título de coleccionista: "Serious Collector" [V00:69], "Great Collector" [TM:859].
  - No hay ninguna cifra de umbral en ninguna fuente. Pistas: High Level Tamer con 101 combates (85 victorias) y Serious Collector con 42,5% de cartas [V00:61-69]; Invincible Tamer con 999 victorias y Great Collector con 97,6% de cartas [TM:857-863]. RY dice solo que los títulos de batalla y de coleccionista son interesantes pero nada más [RY:233-235].
  - "Red Knight" no aparece en ninguna fuente; tampoco hay texto sobre "Foxhound rank", que el LP menciona solo como broma [LP:1713].
- Título final ("Grand title"): se recibe una sola vez al vencer a BlackWarGreymon y no vuelve a cambiar [YS:1173-1175; DS:446, 494-498]. YS: puede cambiar antes de eso [YS:1218-1222]; DS: si consigues todo menos BKWG, el apodo es el que se queda al vencerle [DS:494-498]. Se muestra con el color de la especialidad más usada [YS:1176, 1215]; LP: probablemente depende del color más usado, no se sabe cómo funciona [LP:1714].
- Títulos grandes vistos: Lonely Red Wolf (Fire), Bomber King (Fire), Wild Hunter (Nature), Scarlet Magician, Cheerful Pirate / Blue Guardian (Ice), Black Assassin (Darkness) [YS:1177-1212; TM:880]. El LP dice que a las 500 victorias hay otro título [LP:1687].
- Estadísticas finales: tras BlackWarGreymon aparecen estadísticas de fusión (cartas usadas, fusionadas, mutaciones), tasa de ataque O/T/X y rendimiento por especialidad [YS:416-437; TM:875-891; LP:1702-1713].

---

## 10. Wizardmon, contraseñas y contenido secreto

### 10.1 Varita de Wizardmon
- Desde el postgame, hablar con Wizardmon (Sky City) e introducir un password da una carta Ultimate [RJ:481-494; RY:1051-1068; YS:459-473; V02:67-81; LP:813].
- Los passwords estaban ocultos en el manual (el manual lo dice: "escondí hechizos en este manual") [MAN:2252-2258; LP:813]. El texto OCR no los muestra.
- Lista de las 10 cartas [RJ:484-494; V02:71-81; V06:188-200]:
| Password | Carta |
|---|---|
| A-VEEDRAMON | Aeroveedramon |
| H-KBUTERIMON | Hercules Kabuterimon |
| JIJIMON | Jijimon |
| MTLETEMON | Metaletemon |
| MTLGARURUMON | Metalgarurumon |
| OMNIMON-1 | Omnimon (fuego) |
| OMNIMON-2 | Omnimon (agua) |
| PIEDMON | Piedmon |
| VENOMMYOTIS | Venommyotismon |
| WARGREYMON | Wargreymon |
- Para el LP estas cartas son flojas [LP:814]. RY agrupa los passwords por tipo (Fire, Water, Rare, Nature, Darkness) [RY:1053-1066].
- V06 afirma que hay que introducir los 10 passwords para el 100% del juego [V06:184-189]; el LP no lo menciona y atribuye el último 0,6% al objeto de Gatomon [LP:810, 816-817].

### 10.2 Otros contenidos secretos o poco evidentes
- Betamon "pick-up deck" tras BKWarGreymon: mazo con más de 7 Sevens, Download Digivolve y Rosemon's Lure, todo Ultimates; es una fuente de EXP [YS:447-455; V02:16-32; V06:121-135; LP:1690-1693].
- Bonificación Rosemon: Rosemon juega "cartas de verdad" en Beginner City postgame y da Lure/Download [LP:967-974].
- Hacking de WereGarurumon: carta clave para A [RY:888-889; V06:157-158; LP:654].
- Nanimon (ver sección 7), Apokarimon (sección 7), Pixiemon, Desert Island (solo postgame, regla "solo Myotismon usa opciones").
- Versión japonesa (según LP): modo extra en la pantalla de título [LP:8], música de anime en combates [LP:103-104, 190, 236-237, 273], el bono "Lucky Name" [LP:1682].
- Trucos de la propia memory card (duplicar partidas) y GS/Gameshark [DS:137-144, 172-173; V02:35-38; YS:1247-1252].

---

## 11. Porcentaje de completado

- La partida muestra Game Completion, Card Collection y Digi-Parts Stock como porcentajes [RY:235-238; TM:860-862].
- Cómo se llega al 100% de Game Completion según las fuentes:
  - V06: vencer a BKWarGreymon (300 victorias) y haber introducido los 10 passwords de Wizardmon; tener todas las cartas y partes no basta [V06:182-189].
  - DS: al conseguir la Digi-Part 99 los tres porcentajes subieron a 100% [DS:478-490]; los "porcentajes que faltan" se atribuyen a Sevens, otros partners y todas las Digi-Parts [DS:444-447]. No hace falta perseguir a Apokarimon para el %, pero da cartas [DS:461-467].
  - LP: el % se pierde con arenas repetidos: Jungle (tras que Wormmon se va, arena "nuevo") [LP:201-202], Igloo (repetir tras Garurumon; luego cambia a MetalGarurumon) [LP:272, 1376, 1385], Dark City (Ken se va) [LP:427-428], Junk [LP:346-352], Steep Road [LP:567-568]; Extra Arenas jugadas varias veces (los cinco extra arenas "5 veces") [LP:1058, 1506]; objeto de Gatomon [LP:810, 816-817]; necesita 300 victorias para BKWG [LP:1642-1644]; con el mínimo de arenas se queda en 98,7% [LP:201, 1641]. Hay que jugar los Extra Arenas 3 veces y los tres primeros una 4.ª [LP:1506].
  - YS: "100% de cartas, historia y digiparts" [YS:413-414].
- Datos de ejemplo: 45,7% de completado en Infinity Tower con 101 combates [V00:60-64]; 99,3% completado con 97,6% de cartas y 99,2% de Digi-Parts [TM:857-862]; DS: 100/100/100 con 887-0 [DS:482-490]; LP: 98,7% antes de las 300 victorias [LP:1641].
- Cartas difíciles para el 100% de colección: jewels (solo por mutación) [LP:899], Apokarimon [LP:1636-1640], Sevens/Lure/Download [DS:84-92].
- Las "Seasons": RY dice 11 áreas en Season 1 y 12 en 2 y 3 [RY:164].

---

## 12. Rematches y rivales secretos o postgame (resumen)

| Rival | Dónde | Notas | Fuentes |
|---|---|---|---|
| Agumon, Babamon, Betamon | Cafe de Beginner | Rematches libres | [RJ:167-169, 181-183] |
| Garurumon (Igloo) | Cafe de Igloo | Revancha obligatoria para el passcode | [RJ:254-256; RY:523-527; LP:271] |
| King Sukamon (Junk) | Arena | Repetir sin Shadramon | [RJ:273-278; LP:346-352] |
| Wormmon / Ken (Jungle, Dark) | Arenas | Ken huye; repetir arena | [LP:199-202, 426-433] |
| Megadramon / Gigadramon | Steep Road | Repetir con Gigadramon | [RJ:343-347; RY:805-808] |
| Myotismon (Desert Island) | Arena | Sin opciones | [RJ:429-439; LP:872] |
| Myotismon (Haunted Arena) | Dark City | Se puede revancha; sin premio (RJ) | [RJ:452-454] |
| DigiDestined 2.ª (5 personajes) | Cafes | 6 victorias cada uno (Davis 9) para el LP; Digi-Part por cantidad; packs de color | [LP:825-829; V06:107-109] |
| Armadura de cada ciudad | Extra Arenas | 3 vueltas | [LP:1058, 1506] |
| Nanimon | Aleatorio | 10 victorias → Grand Sevens | [LP:875-890] |
| Piximon/Pixiemon | Steep Road | 1 victoria → Speed Sevens | [YS:692-693; LP:1566-1570] |
| BKMetalGarurumon, Seraphimon, Imperialdramon, Piedmon, Kari, Rosemon | Cafes | Sevens / Download | sección 7 |
| Apokarimon | Infinity Tower, luego aleatorio | Carta propia | sección 7 |
| BlackWarGreymon | Beginner City | 300 victorias | sección 3.4 |
| Betamon (postgame) | Cafe de Beginner | Mazo de Ultimates | sección 10 |

---

## 13. Descripción breve de rivales especiales

- A / Analogman: HP/ataque altísimos; su mazo contiene los 7 Sevens, Download Digivolve y Rosemon's Lure; arranca con DemiDevimon y Download Digivolve y mueve tus partners al fondo; no baraja [V06:150-158; LP:774-783; RJ:401-410; DL:647-651]. A da 30 EXP según YS [YS:490-491] y 50 según V06 [V06:120]. Sugerencias: Hacking, Chain Saw, ToyAgumon, mazo Crash [YS:349-354; V06:159-181; RJ:391-395].
- VenomMyotismon: los 4 combates previos dan Super Packs [RY:936-977].
- Ken: 6 combates (postgame) y borrows de mazos si Wormmon no es tu partner [LP:1491-1494].
- GranKuwagamon: 5 victorias seguidas dan la Digi-Part #99 [YS:1228-1231; V06:118].

---

## 14. Discrepancias consolidadas entre fuentes

| Tema | Versión A | Versión B | Notas |
|---|---|---|---|
| Quién da el Mutant Fusion data | Izzy [RJ:591-594; RY:1440-1443; DS:77-79; LP:1461, 1541] | Gatomon da un objeto que avisa de Special Fusions [LP:816-817] | Son dos objetos distintos según LP |
| ¿Mutaciones antes de Izzy? | Sí, y se indican/predicen [DS:72-79; V06:61] | Solo tras Izzy [TM:536-538] | TM contradice a DS/V06 |
| Nivel del resultado de fusión | Tabla C+U=C [LP:684-685] | Recetas U+C=U [TM:104, 115] | Ver 6.4 |
| Regla de resultado | Media de posiciones [DS:100-108; YS:720-729] | Suma de puntos [RY:1524-1584] | La suma se cumple en 71/73 recetas (derivado) |
| Dark = Nature + ? | Nature+Water [RY:1516] | Nature+Rare [YS:639; LP:670] | Errata probable en RY |
| Jungle Beet Arena | 2 rivales [RJ:526-527] | 3 rivales [RY:1362-1366; LP:1153-1166] | |
| Pyramid Extra | Angemon, Baronmon, Pegasusmon [RJ:539-542] | Patamon, Baronmon, Pegasusmon [RY:1330-1332; LP:1230] | |
| 3.er partner | Entre Wormmon/Patamon/Gatomon [YS:138-146] | Cualquiera de los 6 salvo los tuyos [RY:822-825; RJ:334-336] | |
| Digi-Egg 2.º de Gatomon / nombres | Light (Kari) [RJ:322-323], Reliability para Armadillomon [RJ:298] | Reliability para Gatomon/Tylomon [RJ:548-549; RY:1355-1357] | RJ se contradice a sí mismo |
| Quién da la 2.ª egg de Gatomon | Tai [YS:150; LP:1281-1283] | WarGreymon del arena de Beginner [RY:1355-1357] | |
| Egg 2 de Wormmon | Tras vencer a Ken [RJ:296-298; RY:659-661] | Tras repetir el arena [LP:426-433] | |
| Premio de Desert Island | S-Black Pack [RY:1121] | Ninguno [LP:933] | |
| Premio de Myotismon (Haunted) | Pack (RY:1168) | "no nada importante" [RJ:452-454] | |
| Seraphimon Sevens | Pyramid [DS:191; LP:1506-1508] | Sky City [YS:703] | |
| Veces para Sevens / Download | ver 7.1 | | |
| Arena Dark City: 3.er rival | Shadramon [RJ:292] | Shardamon [RY:627] | Probable errata |
| EXP de A | 30 [YS:490-491] | 50 [V06:120] | |
| Lucky Seven / Option Maniac / Partner Digivolve / Super Bonus | ver sección 4.3 | | |
| Passwords y % | V06: necesarios para 100% [V06:184-189] | LP: falta es el objeto de Gatomon [LP:810, 816-817] | |
| Estrella en carta | Completa o ≤1 copia [YS:236-238] | Obtenida por otra vía [DS:447-455] | |
| Digi-Part con partner fusion | Sí [V06:110-116] | No funcionó [DS:478-480] | |
| Digi-Parts por veces | Keely/T.K./Ken 7, Cody 8, Davis 10 [V06:107-109] | 6 veces cada uno, Davis 9 [LP:825] | LP habla del sidequest, no de Digi-Parts concretas |
| Speed Sevens | Pixiemon [YS:692-693; DS:195] | Nanimon también "si no la tienes" [DS:136] | |
| V02 Paildramon / WarGreymon | misma receta Shakkoumon+WaruMonzaemon [V02:49-50, 65-66] | TM: WarGreymon [TM:99] | |

---

## 15. Lagunas (lo que ninguna fuente dice)

- Umbrales numéricos de los títulos de Tamer/Collector/Battle.
- Cualquier coste en monedas o de otro tipo en la Fusion Shop: ninguno mencionado.
- Texto de los passwords de Wizardmon del manual (OCR sin ellos).
- Nombre de la "tienda de Andromon" como tal; solo se cita a Andromon por YS y RY.
- "Red Knight" y qué determina el título final.
- Dónde se consigue exactamente la Digi-Part de partners (orden por partner): solo se dice que cambia con el partner [LP:126].
- Qué ofrece el modo extra de la pantalla de título japonesa [LP:8].
