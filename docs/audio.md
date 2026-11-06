# Sistema de audio

El juego suena como un juego de consola: interfaz, cartas, combate, evolución y música reaccionan a lo
que pasa en la partida. **Ningún sonido sale del juego original**: todo se sintetiza en el navegador con
la Web Audio API (código propio en `src/audio/`), así que no hay archivos de audio que licenciar ni
enlaces externos de los que depender.

El audio **no toca las reglas**: el motor sigue igual y el audio solo escucha sus eventos.

## Cómo está armado

```
motor (src/engine)  ──eventos──▶  sesión (src/game/session.ts)
                                       │
            ┌──────────────────────────┼─────────────────────────────┐
            ▼                          ▼                             ▼
 audio/sessionCues.ts         ui/play/Playback.tsx           ui/play/Cinematics.tsx
 (robos, entradas, DP,        (cada paso de la batalla,      (las etapas de la
  descartes; espera a las      sincronizado con su            evolución)
  escenas)                     animación)
            └──────────────┬───────────┴─────────────────────────────┘
                           ▼
        audio/bus.ts  gameEvents.emit('CARD_DRAWN' | 'ATTACK_RESOLVED' | …)
                           │
          ┌────────────────┼──────────────────────────┐
          ▼                ▼                          ▼
 audio/director.ts   efectos visuales          audio/uiSounds.ts
 (cue → sonido,       (sacudida del tablero,    (hover, clics, pestañas,
  catalog.ts)          destellos)                errores: delegación global)
          ▼
 audio/manager.ts  AudioManager: buses, volúmenes, duplicados, voces, precarga,
                   autoplay, música (music/player.ts)
```

- **`audio/bus.ts`**: el bus de eventos del juego (`gameEvents`). Lista cerrada de señales (`CUE_NAMES`).
- **`audio/cues.ts`**: traduce eventos del motor en señales. `planCues` para lo que cambia en el tablero;
  lo que viene después de una batalla o una evolución espera a que la escena termine, así un robo nunca
  suena mientras la batalla anterior todavía se está mostrando. Lo que va justo antes de una escena se
  comprime en 650 ms para no arrastrarse encima de ella. `battleStepCues` para cada paso de la
  batalla, con el golpe a los 220 ms, cuando la embestida llega al rival.
- **`audio/catalog.ts`**: el catálogo central. Qué sonido responde a cada señal, cuántas veces se puede
  repetir y cuántas voces a la vez.
- **`audio/sfx/recipes.ts`**: una receta de síntesis por sonido (`audio/sfx/dsp.ts` tiene las piezas).
- **`audio/music/tracks.ts`**: la música, escrita como datos (acordes y patrones de 16 pasos).
  `music/player.ts` la toca y `music/select.ts` elige la pista según la pantalla y el momento.
- **`audio/manager.ts`**: el `AudioManager`.
- **`audio/settings.ts`**: preferencias, guardadas en este navegador (`localStorage`, clave `dcb.audio`).

### AudioManager

- **Buses:** general → música / efectos → interfaz. Un compresor final evita que se sature.
- **Volúmenes:** general, música y efectos. Silenciar todo. Activar o desactivar solo los sonidos de interfaz.
- **Duplicados:** el mismo sonido dentro de su ventana (`throttleMs`) se descarta (`audio/gate.ts`).
- **Simultáneos:** un máximo de voces por sonido y uno total. Si todo está ocupado, pasan solo los
  importantes (combate, evolución, resultado).
- **Precarga:** después de la primera interacción, cada sonido y cada variante se renderiza a un búfer
  con un `OfflineAudioContext`. Reproducirlos después cuesta casi nada.
- **Autoplay:** el contexto de audio se crea y se reanuda con el primer clic o tecla. La música pedida
  antes empieza en ese momento.
- **Música:** fundido cruzado entre pistas (1,2 s), y se baja durante la evolución.
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
| `PANEL_OPEN` / `PANEL_CLOSE` | Registro, ventana de carta, ajustes de audio |
| `UI_ERROR` / `UI_DENIED` | Aparece un mensaje de error; clic en un botón desactivado |
| `PHASE_BANNER` | El cartel de fase entra en pantalla |
| `CARD_HOVER` / `CARD_SELECTED` | Cursor sobre una carta jugable; elegir una carta de la mano |
| `CARD_DRAWN` / `DECK_SHUFFLED` | Robo; barajado al empezar y al cambiar la mano |
| `CARD_MOVED` / `CARD_PLACED` | Una carta viaja de la mano a otra zona; llega al Battle Slot |
| `DP_CHARGED` / `OPTION_PLAYED` | Carga de DP; Digivolve Option jugada |
| `CARD_SET` / `CARD_REVEALED` | Soporte boca abajo; el soporte se da vuelta en la batalla |
| `SUPPORT_ACTIVATED` | El efecto de soporte u Option se activa |
| `CARD_DISCARDED` | Cartas al Offline Pile |
| `ATTACK_SELECTED` / `ATTACK_LOCKED` | Elegís ◯ △ ✕; la CPU fija el suyo |
| `ATTACK_REVEALED` / `CLASH_START` | Se revelan los ataques; empieza el enfrentamiento |
| `ORDER_SWAPPED` | Un efecto cambia quién ataca primero |
| `ATTACK_RESOLVED` | Un Digimon ataca (identidad de ◯ △ ✕; ✕ según su efecto) |
| `HIT_TAKEN` / `ATTACK_BLOCKED` | El golpe llega (con daño); el golpe no hace daño |
| `COUNTER` | ✕ Counter devuelve el ataque |
| `ABILITY_ACTIVATED` | Efecto ✕ o Crash |
| `EFFECT_VOIDED` / `EFFECT_FIZZLED` | Efecto anulado; condición no cumplida |
| `STAT_UP` / `STAT_DOWN` / `HP_RECOVERED` | Cambia un poder; se recupera HP |
| `MONSTER_DEFEATED` / `MONSTER_DEVOLVED` | KO; un Digimon retrocede de nivel |
| `ROUND_WON` | Ronda ganada |
| `EVOLUTION_START` … `EVOLUTION_STATS` | Las etapas de la evolución (ver abajo) |
| `BATTLE_WON` / `BATTLE_LOST` | Fin de la partida |

No hay golpes críticos porque el juego original no los tiene. El impacto suena más fuerte solo cuando
el daño real es grande (la mitad del HP o más) y más grave cuando es el golpe final.

## Catálogo de sonidos

Todos sintetizados (receta en `src/audio/sfx/recipes.ts`).

### Interfaz

| Sonido | Acción | Síntesis |
| --- | --- | --- |
| `ui.hover` | Cursor o foco sobre un botón | Pulso senoidal muy corto y agudo |
| `ui.nav` | Navegar entre menús y opciones | Clic triangular con un tic de ruido |
| `ui.confirm` | Confirmar, botón principal | Dos notas cuadradas ascendentes |
| `ui.cancel` | Cancelar, cerrar, saltar, volver | Dos notas cuadradas descendentes |
| `ui.tab` | Cambiar de pestaña | Barrido de ruido y una nota |
| `ui.open` | Abrir un panel | Barrido ascendente y dos campanitas |
| `ui.close` | Cerrar un panel | Barrido descendente |
| `ui.error` | Mensaje de error | Doble zumbido grave |
| `ui.denied` | Botón desactivado | Golpe sordo corto |
| `ui.phase` | Cartel de fase | Ráfaga de aire y campana FM |

### Cartas (capa física + capa digital)

| Sonido | Acción | Síntesis |
| --- | --- | --- |
| `card.hover` | Cursor sobre una carta jugable | Roce de papel |
| `card.draw` | Robar | Deslizamiento de papel y un destello digital |
| `card.select` | Elegir de la mano | Chasquido y una nota |
| `card.move` | Una carta cambia de zona | Soplido que baja |
| `card.place` | Colocar en el tablero | Golpe sobre la mesa, palmada de papel y un "lock" digital |
| `card.set` | Soporte boca abajo | Golpe suave y una nota misteriosa |
| `card.discard` | Descartar | Barrido descendente |
| `card.shuffle` | Barajar | Dieciséis chasquidos de naipes y un golpe final |
| `card.flip` | Revelar una carta | Soplido y destello metálico |
| `card.support` | Soporte u Option activado | Arpegio ascendente con brillo (dos variantes) |
| `card.dp` | Cargar DP | Subida de energía y moneda; más aguda con más DP |
| `card.option` | Digivolve Option | Golpe y tres campanas |

### Combate

| Sonido | Acción | Síntesis |
| --- | --- | --- |
| `combat.select.circle` | Confirmar ◯ | Cerrojo grave |
| `combat.select.triangle` | Confirmar △ | Doble pulso rápido |
| `combat.select.cross` | Confirmar ✕ | Ping metálico |
| `combat.select` | Confirmar un ataque oculto (2 jugadores, no revela cuál) | Dos notas neutras |
| `combat.locked` | La CPU fijó su ataque | Clic grave |
| `combat.reveal` | Revelación de ataques | Ruido en reversa y destello |
| `combat.clash` | Inicio del enfrentamiento | Estruendo grave y choque metálico |
| `combat.order` | Cambia el orden de ataque | Soplido de ida y vuelta |
| `combat.circle` | Ataque ◯: potente | Gruñido grave saturado y soplido lento y ancho |
| `combat.triangle` | Ataque △: rápido, técnico | Tres zumbidos veloces ascendentes |
| `combat.cross` | Ataque ✕: distintivo | Anillo metálico FM y barrido en reversa, con el color de su efecto: `plain`, `swift` (1st Attack), `null` (to 0), `counter`, `crash`, `drain` (Eat-up HP), `jam` (Jamming), `fire`, `ice`, `nature`, `dark`, `rare` (Foe X3) |
| `combat.impact` | Golpe recibido | Según el ataque: ◯ grave y crujiente, △ seco, ✕ metálico; `lethal` con cola de eco |
| `combat.block` | Golpe sin daño | Campanazo de rebote |
| `combat.counter` | Contraataque | Barrido en reversa y "zing" |
| `combat.ability` | Habilidad (efecto ✕, Crash) | Subida mágica con el color del efecto |
| `combat.voided` | Efecto anulado | Glitch descendente |
| `combat.fizzle` | Condición no cumplida | Dos notas que se apagan |
| `combat.statUp` / `combat.statDown` | Cambia un poder | Tres notas que suben o bajan |
| `combat.heal` | Recuperación de HP | Arpegio brillante |
| `combat.ko` | Digimon derrotado | Caída de tono, estruendo y desintegración |
| `combat.devolve` | Retrocede de nivel | Tono que se desinfla |

### Resultado

| Sonido | Acción | Síntesis |
| --- | --- | --- |
| `result.round` | Ronda ganada (`win`) o perdida (`lose`) | Arpegio mayor o menor |
| `result.victory` | Victoria | Acorde de metales y estruendo |
| `result.defeat` | Derrota | Acorde menor grave que cae |

### Evolución

La animación de evolución (`src/ui/play/Cinematics.tsx`) tiene etapas con su sonido:

| Momento | Sonido | Qué se ve |
| --- | --- | --- |
| 0 ms | `evo.start`: retumbo que crece | Se oscurece el tablero; la carta actual al centro |
| 350 ms | `evo.charge`: la energía sube (sierra que se abre, siseo, pulsos que se aceleran) | Partículas que convergen, rayos de luz que giran, la carta brilla y tiembla |
| 1900 ms | `evo.burst`: destello de transición | Destello blanco y onda expansiva; la carta vieja se disuelve |
| 2250 ms | `evo.complete`: transformación completada | Aparece la nueva criatura |
| 2700 ms + | `evo.stat` × 4 | HP, ◯, △ y ✕ cuentan desde los valores anteriores hasta los nuevos |

Mientras dura, suena la pista `evolution` y la música de batalla vuelve al terminar.

## Música

Composiciones originales, tocadas en vivo por el secuenciador. Cambia con fundido cruzado.

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

El botón de sonido de la barra superior abre los ajustes:
- Volumen general, de música y de efectos.
- Silenciar todo.
- Sonidos de interfaz.
- Reducir efectos audiovisuales intensos.

Se guardan en este navegador.
