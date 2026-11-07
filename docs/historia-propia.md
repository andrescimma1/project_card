# Historia propia del modo historia

El modo historia ya no lee los guiones del disco: usa **nuestros guiones**, que funcionan en el sitio publicado.

## Qué se conserva y qué es nuestro

| Del juego original (no se toca) | Nuestro |
|---|---|
| Orden de los 12 lugares y qué abre cada victoria | Nombres de los lugares, regiones y arenas |
| Torneos, rondas y mazos rivales | Nombres de los personajes |
| Premios (sobres, cartas, piezas) y flags | Todos los diálogos, en español y en inglés |

## El mundo

**Las Tierras Quietas.**
- Las personas se fueron hace mucho. Las criaturas heredaron sus pueblos y sus oficios: relojeros, barqueros, ferias abandonadas…
- Las cartas guardan la forma de cada criatura, y evolucionar es alcanzar una forma mayor.
- El jugador llega como aprendiz y viaja de pueblo en pueblo ganando torneos.
- Desde una torre al final del mapa, una niebla gris está borrando las formas de las criaturas.
- Lo que queda de una criatura que perdió su forma es **el Borrón**: vaga por los pueblos, lleno de rencor contra los que sí pudieron evolucionar.

Lugares, regiones, arenas y personajes (los 117 tienen nombre): `src/story/own/world.ts`.

### El arco, ciudad por ciudad

Sigue el orden del juego original, que no cambia.

1. **Aldea del Cruce.** El jugador llega. Nilo le explica el mundo y la Abuela Retama le da el pase.
2. **Hornos Viejos, Bosque Hondo y Puerto Escarcha.** Otros viajeros que volvieron (Dante, Lía, Iker…) cuentan que alguien se está quedando con las Arenas. Es **el Coleccionista**, un viajero que acapara cartas y deja a las criaturas sin voluntad, «bajo su hechizo».
3. **Chatarral y Ciudad sin Faroles.** Aparecen sus secuaces y criaturas de la facción Sombría. En Ciudad sin Faroles el jugador vence al Coleccionista, que huye sin decir quién es. Más adelante, Madreselva le pide que eche de allí a unos extraños.
4. **Templo Hundido.** Tomás le habla de la Torre del Archivero, la Arena más difícil de todas.
5. **Mirador de las Nubes.** Zarpa le pide que vaya a la torre a averiguar qué pasa.
6. **Camino del Risco.** El Coleccionista se muestra sin máscara: es **Fermín**. Pide perdón, abandona lo que estaba haciendo y le da al jugador un compañero.
7. **Torre del Archivero.** Un archivo antiguo donde se guardaba el registro de todas las formas, defendido por **Yunque**. Junto al lago apareció otra torre, la **Torre sin Fin**, de donde sale la niebla gris.
8. **Torre sin Fin.** **Mortaja Voraz** quiere que todas las formas se vuelvan grises y quietas. Es la batalla final.
9. **Después del final, en la Isla de Arena.** Mortaja vuelve con sus aliados (Melena, Grajo y Latón) para vengarse. Tadeo, otro viajero, lo estaba buscando.

### Vocabulario

| Original | Español | Inglés |
|---|---|---|
| Digi-land | las Tierras Quietas | the Quiet Lands |
| Digimon | criatura | creature |
| Card Tamer | aprendiz, jugador de cartas | apprentice, card player |
| Battle Cafe / Battle Arena | Café de batallas / Arena | Battle Cafe / Arena |
| Passcode | pase | pass |
| Rookie / Champion / Ultimate | Novato / Campeón / Perfecto | Novice / Veteran / Apex |
| Option / Digivolve Card | carta de Apoyo / de Evolución | Support / Evolution card |
| DP | PE | EP |
| Fire / Ice / Nature / Darkness / Rare | facción Roja / Azul / Verde / Sombría / Rara | Red / Blue / Green / Shadow / Rare faction |
| Digi-Egg / partner | huevo / compañero | egg / partner |
| Digivolve | evolucionar | evolve |

## Cómo funciona

1. **`tools/lift-scripts.ts`** genera `public/story/CITYnn.json` a partir de los guiones de tu disco. Contiene la lógica de cada ciudad (saltos, flags, menús, batallas, premios), sin ningún texto.
   - Solo hace falta volver a correrlo si cambia el levantador.
   - Las hojas de trabajo que escribe (una por ciudad, con el texto original de cada diálogo para saber de qué trata) quedan fuera del repositorio.
2. **`src/story/own/ir.ts`** compila esa lógica más nuestro texto en un guion MSCD. El mismo intérprete y el mismo anfitrión de siempre lo ejecutan.
   - El test `tests/story/ownScripts.test.ts` comprueba que la lógica con el texto original reconstruye cada guion byte a byte.
3. **`src/story/own/source.ts`** decide qué texto va en cada diálogo, en este orden:
   1. lo escrito para esa ciudad (`texts/cityNN.ts`);
   2. las líneas que se repiten en todos los pueblos (`texts/shared.ts`);
   3. un texto genérico según lo que sigue: la pregunta de un menú o el aviso de un premio;
   4. si un personaje todavía no tiene diálogo, dice «…» una sola vez.

## Cómo escribir una ciudad

Corre la herramienta con una carpeta para las hojas de trabajo:

```bash
npx tsx tools/lift-scripts.ts ../hojas
```

En la hoja de la ciudad, cada diálogo aparece con su identificador, por ejemplo `## 2CF4 s [Agumon]`. Escribe nuestra versión en `src/story/own/texts/cityNN.ts`:

```ts
'2CF4': { es: '¡Hola, soy Brezo!\n¿Tú también vas a la Arena?', en: "Hi, I'm Brezo!\nAre you going to the Arena, too?" },
```

- **Líneas y páginas:** las líneas se separan con `\n` y las páginas con una línea en blanco.
- **Diálogos `p` (una pregunta antes de un menú):** la última página es la pregunta.
- **Quién habla (`who`):**
  - si no se indica, habla el personaje de la lógica;
  - `'me'` es el jugador;
  - `null` es nadie (un aviso o la descripción de un mazo).
- **Personajes nuevos:** van en `CHARACTERS`, en `world.ts`.

## Estado

- **Las 12 ciudades están escritas**, con 2.846 diálogos en español y en inglés. Solo 2 diálogos quedan sin texto a propósito: son cabeceras sin contenido, en Ciudad sin Faroles.
- **Los 117 personajes tienen nombre propio.** La regla del mundo: cuando una criatura alcanza otra forma, toma otro nombre (Brezo → Tizón → Yunque → Fragua).
- **Palabras clave del Mirador de las Nubes:** se aceptan las nuestras (`KEYWORDS` en `world.ts`) y también las originales, y dan el mismo premio.
- **Pendiente de refinar:** el tono de cada personaje entre ciudades, los nombres de mazos y algunos consejos que vienen del original y no se comprobaron contra el motor.
