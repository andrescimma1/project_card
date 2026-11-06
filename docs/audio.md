# Sistema de audio

El juego suena como un juego de cartas de mesa con un toque de fantasía:
- **Interfaz y cartas:** pergamino, cartas de cartón, madera, cuero y bronce.
- **Golpes:** metal y madera.
- **Lo mágico:** arpa, campanas y destellos.
- **Los grandes momentos:** tambores, gongs y cuernos.

**Ningún sonido sale del juego original**: todo se sintetiza en el navegador con la Web Audio API (código
propio en `src/audio/`), así que no hay archivos de audio que licenciar ni enlaces externos de los que
depender.

El audio **no toca las reglas**: el motor sigue igual y el audio solo escucha sus eventos.

## Cómo está armado

```
motor (src/engine)  ──eventos──▶  sesión (src/game/session.ts)
                                       │
            ┌──────────────────────────┼─────────────────────────────┐
            ▼                          ▼                             ▼
 audio/sessionCues.ts         ui/play/Playback.tsx           ui/play/Cinematics.tsx
 (robos, entradas, PE,        (cada paso de la batalla,      (las etapas de la
  descartes; espera a las      sincronizado con su            evolución)
  escenas)                     animación)
            └──────────────┬───────────┴─────────────────────────────┘
                           ▼
        audio/bus.ts  gameEvents.emit('CARD_DRAWN' | 'ATTACK_RESOLVED' | …)
                           │
          ┌────────────────┼──────────────────────────┐
          ▼                ▼                          ▼
 audio/director.ts   efectos visuales          audio/uiSounds.ts
 (señal → sonido,     (sacudida del tablero,    (cursor, clics, pestañas,
  catalog.ts)          destellos)                errores: delegación global)
          ▼
 audio/manager.ts  AudioManager: buses, volúmenes, duplicados, voces, precarga,
                   autoplay, música (music/player.ts)
```

- **`audio/bus.ts`**: el bus de eventos del juego (`gameEvents`). Lista cerrada de señales (`CUE_NAMES`).
  Los ataques viajan con su categoría (`action: 'fury' | 'technique' | 'instinct'`).
- **`audio/cues.ts`**: traduce eventos del motor en señales.
  - `planCues` cubre lo que cambia en el tablero. Lo que viene después de una batalla o una evolución
    espera a que la escena termine, así un robo nunca suena mientras la batalla anterior todavía se
    está mostrando. Lo que va justo antes de una escena se comprime en 650 ms para no arrastrarse
    encima de ella.
  - `battleStepCues` cubre cada paso de la batalla, con el golpe a los 220 ms, cuando la embestida
    llega al rival.
- **`audio/catalog.ts`**: el catálogo central. Qué sonido responde a cada señal, cuántas veces se puede
  repetir y cuántas voces a la vez.
- **`audio/sfx/recipes.ts`**: una receta de síntesis por sonido, construida con "materiales": madera,
  metal, papel, golpe sordo, arpa, campana, cuerno, tambor y soplido. Las piezas de bajo nivel están en
  `audio/sfx/dsp.ts`.
- **`audio/music/tracks.ts`**: la música, escrita como datos (acordes y patrones de 16 pasos).
  - `music/instruments.ts` tiene los instrumentos: cuerdas, contrabajo, arpa, trompa o flauta,
    celesta, taiko, pandero, sonajero y palillos.
  - `music/player.ts` toca las pistas.
  - `music/select.ts` elige la pista según la pantalla y el momento.
- **`audio/manager.ts`**: el `AudioManager`.
- **`audio/settings.ts`**: preferencias, guardadas en este navegador (`localStorage`, clave `dcb.audio`).

### AudioManager

- **Buses:** general → música / efectos → interfaz. Un compresor final evita que se sature.
- **Volúmenes:** general, música y efectos. Silenciar todo. Activar o desactivar solo los sonidos de interfaz.
- **Duplicados:** el mismo sonido dentro de su ventana (`throttleMs`) se descarta (`audio/gate.ts`).
- **Simultáneos:** un máximo de voces por sonido y uno total. Si todo está ocupado, pasan solo los
  importantes (combate, evolución, resultado).
- **Precarga:** después de la primera interacción, cada sonido y cada variante se renderiza a un búfer
  con un `OfflineAudioContext`.
- **Autoplay:** el contexto de audio se crea y se reanuda con el primer clic o tecla. La música pedida
  antes empieza en ese momento.
- **Música:** fundido cruzado entre pistas (1,2 s), y baja bajo el gong de la evolución.
- **Reducir efectos intensos:** los impactos suenan más suaves, no hay sacudidas ni destellos y la
  evolución lleva menos partículas.

### Reemplazar sonidos o música por archivos

Cualquier sonido del catálogo acepta `file: '/audio/sfx/nombre.ogg'`, y cualquier pista de música
`file: '/audio/music/nombre.ogg'`. Los archivos van en `public/audio/`. Si el archivo existe, reemplaza
a la síntesis y todo lo demás sigue igual. Usar solo audio propio o con licencia compatible, nunca
extraído del juego original.

## Señales del juego

| Señal | Cuándo |
| --- | --- |
| `UI_HOVER` | El cursor o el foco del teclado entra en un botón |
| `UI_CONFIRM` / `UI_CANCEL` / `UI_NAV` / `UI_TAB` | Botón principal, cerrar o volver, opción común, pestaña |
| `PANEL_OPEN` / `PANEL_CLOSE` | Registro, ventana de carta, ajustes de sonido |
| `UI_ERROR` / `UI_DENIED` | Aparece un mensaje de error; clic en un botón desactivado |
| `PHASE_BANNER` | El cartel de fase entra en pantalla |
| `CARD_HOVER` / `CARD_SELECTED` | Cursor sobre una carta jugable; elegir una carta de la mano |
| `CARD_DRAWN` / `DECK_SHUFFLED` | Robo; barajado al empezar y al cambiar la mano |
| `CARD_MOVED` / `CARD_PLACED` | Una carta viaja de la mano a otra zona; llega a la mesa |
| `DP_CHARGED` / `OPTION_PLAYED` | Carga de puntos de evolución; carta de evolución jugada |
| `CARD_SET` / `CARD_REVEALED` | Soporte boca abajo; el soporte se da vuelta en la batalla |
| `SUPPORT_ACTIVATED` | El efecto de soporte o de apoyo se activa |
| `CARD_DISCARDED` | Cartas al descarte |
| `ATTACK_SELECTED` / `ATTACK_LOCKED` | Eliges Furia, Técnica o Instinto; la CPU fija el suyo |
| `ATTACK_REVEALED` / `CLASH_START` | Se revelan los ataques; empieza el enfrentamiento |
| `ORDER_SWAPPED` | Un efecto cambia quién ataca primero |
| `ATTACK_RESOLVED` | Una criatura ataca (identidad de su categoría; Instinto según su efecto) |
| `HIT_TAKEN` / `ATTACK_BLOCKED` | El golpe llega (con daño); el golpe no hace daño |
| `COUNTER` | Un contraataque de Instinto devuelve el golpe |
| `ABILITY_ACTIVATED` | Efecto de Instinto o Embestida |
| `EFFECT_VOIDED` / `EFFECT_FIZZLED` | Efecto anulado; condición no cumplida |
| `STAT_UP` / `STAT_DOWN` / `HP_RECOVERED` | Cambia un poder; se recupera HP |
| `MONSTER_DEFEATED` / `MONSTER_DEVOLVED` | KO; una criatura retrocede de nivel |
| `ROUND_WON` | Ronda ganada |
| `EVOLUTION_START` … `EVOLUTION_STATS` | Las etapas de la evolución (ver abajo) |
| `BATTLE_WON` / `BATTLE_LOST` | Fin de la partida |

No hay golpes críticos porque las reglas no los tienen. El impacto suena más fuerte solo cuando el daño
real es grande (la mitad del HP o más) y más grave cuando es el golpe final.

## Catálogo de sonidos

Todos sintetizados (receta en `src/audio/sfx/recipes.ts`).

### Interfaz

| Sonido | Acción | Material |
| --- | --- | --- |
| `ui.hover` | Cursor o foco sobre un botón | Roce de pergamino |
| `ui.nav` | Navegar entre menús y opciones | Toque de madera |
| `ui.confirm` | Confirmar, botón principal | Golpe de madera con un brillo de bronce |
| `ui.cancel` | Cancelar, cerrar, saltar, volver | Cuero que cae |
| `ui.tab` | Cambiar de pestaña | Página que pasa |
| `ui.open` | Abrir un panel | Pergamino que se despliega |
| `ui.close` | Cerrar un panel | Pergamino que se enrolla |
| `ui.error` | Mensaje de error | Hierro sordo, dos veces |
| `ui.denied` | Botón desactivado | Madera apagada |
| `ui.phase` | Cartel de fase | Soplido y campana de bronce |

### Cartas (cartón sobre una mesa de madera)

| Sonido | Acción | Material |
| --- | --- | --- |
| `card.hover` | Cursor sobre una carta jugable | Roce de papel |
| `card.draw` | Robar | Carta que se desliza del mazo |
| `card.select` | Tomar una carta de la mano | Chasquido de cartón |
| `card.move` | Una carta cambia de zona | Soplido de papel |
| `card.place` | Colocar en la mesa | Cartón que golpea la madera |
| `card.set` | Soporte boca abajo | Golpe suave y una nota de arpa |
| `card.discard` | Descartar | Carta arrojada |
| `card.shuffle` | Barajar | Dieciséis chasquidos de naipes y un golpe sobre la mesa |
| `card.flip` | Dar vuelta una carta | Giro de cartón |
| `card.support` | Soporte o carta de apoyo activados | Arpa ascendente y campana (dos variantes) |
| `card.dp` | Cargar puntos de evolución | Monedas en un cuenco de bronce; más agudas con más PE |
| `card.option` | Carta de evolución | Golpe y tres campanas |

### Combate

| Sonido | Acción | Material |
| --- | --- | --- |
| `combat.select.fury` | Confirmar Furia | Acero que se desenvaina |
| `combat.select.technique` | Confirmar Técnica | Cuerda que se tensa y un clic |
| `combat.select.instinct` | Confirmar Instinto | Escudo que se levanta |
| `combat.select` | Confirmar un ataque oculto (2 jugadores, no revela cuál) | Dos toques de madera |
| `combat.locked` | La CPU fijó su ataque | Clac de madera |
| `combat.reveal` | Revelación de ataques | Redoble y metal |
| `combat.clash` | Inicio del enfrentamiento | Tambor grave y choque metálico |
| `combat.order` | Cambia el orden de ataque | Soplido y nota de arpa |
| `combat.fury` | Ataque de Furia: potente | Gruñido grave y un soplido ancho y lento |
| `combat.technique` | Ataque de Técnica: rápido y preciso | Silbido fino, como una flecha |
| `combat.instinct` | Ataque de Instinto: distintivo | Carga resonante con el color de su efecto: `plain`, `swift` (Primer golpe), `null` (Anula), `counter` (Contra), `crash` (Embestida), `drain` (Absorber HP), `jam` (Interferencia), `fire`, `ice`, `nature`, `dark`, `rare` (×3 contra una facción) |
| `combat.impact` | Golpe recibido | Furia: golpe sordo y crujido. Técnica: seco. Instinto: escudo que resuena. `lethal` con eco y tambor |
| `combat.block` | Golpe sin daño | Choque contra escudo |
| `combat.counter` | Contraataque | Parada metálica y respuesta |
| `combat.ability` | Habilidad (efecto de Instinto, Embestida) | Glissando de arpa con el color del efecto |
| `combat.voided` | Efecto anulado | Arpa que cae y magia que se apaga |
| `combat.fizzle` | Condición no cumplida | Dos notas que se apagan |
| `combat.statUp` / `combat.statDown` | Cambia un poder | Tres notas de arpa que suben o bajan |
| `combat.heal` | Recuperación de HP | Campanas suaves |
| `combat.ko` | Criatura derrotada | Tambor y caída |
| `combat.devolve` | Retrocede de nivel | Arpa descendente |

### Resultado

| Sonido | Acción | Material |
| --- | --- | --- |
| `result.round` | Ronda ganada (`win`) o perdida (`lose`) | Llamada de cuerno, ascendente o descendente |
| `result.victory` | Victoria | Fanfarria de metales y tambor |
| `result.defeat` | Derrota | Cuerno grave |

### Evolución

La animación de evolución (`src/ui/play/Cinematics.tsx`) tiene etapas con su sonido:

| Momento | Sonido | Qué se ve |
| --- | --- | --- |
| 0 ms | `evo.start`: tambores lejanos y un zumbido grave | Se oscurece el tablero; la carta actual al centro |
| 350 ms | `evo.charge`: la magia crece (arpa que se acelera, siseo que sube) | Partículas que convergen, rayos de luz que giran, la carta brilla y tiembla |
| 1900 ms | `evo.burst`: gong | Destello cálido y onda expansiva; la carta vieja se disuelve |
| 2250 ms | `evo.complete`: campanas y metales | Aparece la nueva criatura |
| 2700 ms + | `evo.stat` × 4 | HP, Furia, Técnica e Instinto cuentan desde los valores anteriores hasta los nuevos |

Mientras dura, suena la pista `evolution` y la música de batalla vuelve al terminar.

## Música

Composiciones originales, tocadas en vivo por el secuenciador con instrumentos acústicos sintetizados.
Cambia con fundido cruzado.

| Pista | Dónde suena |
| --- | --- |
| `menu` | Partidas guardadas del modo historia, cartas y reglas |
| `story` | Mapa y ciudades del modo historia |
| `deckSelect` | Selección de mazos antes de una partida libre |
| `deckBuild` | Pestaña Mazos y edición de mazos en la historia |
| `prep` | Preparación: todo el turno 1 (no hay batalla) y la mano inicial y entrada del turno 2 |
| `battle` | Batalla |
| `climax` | Algún jugador está a una ronda de ganar |
| `evolution` | Durante la animación de evolución |
| `victory` | Fanfarria y tema de victoria |
| `defeat` | Tema de derrota |

## Ajustes

El botón **Sonido** de la barra superior abre los ajustes:
- Volumen general, de música y de efectos.
- Silenciar todo.
- Sonidos de interfaz.
- Reducir efectos audiovisuales intensos.

Se guardan en este navegador.
