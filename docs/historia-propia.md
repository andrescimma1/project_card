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
- Desde una torre al final del mapa, algo está borrando las formas de las criaturas:
  - lo que queda de una criatura que perdió su forma es **el Borrón**;
  - en la Torre del Archivero vive quien quiere guardar todas las formas para siempre.

Lugares, regiones, arenas y personajes: `src/story/own/world.ts`.

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

- **Aldea del Cruce:** escrita la llegada, el guía Nilo, Brezo, Pipa, la Abuela Retama y el primer torneo. Faltan los personajes de fases posteriores.
- **Las otras 11 ciudades:** se pueden jugar enteras. Muestran los textos compartidos y los genéricos, y sus personajes todavía dicen «…».
- **Personajes:** 10 tienen nombre propio; el resto, unos 110, todavía muestra el nombre original.
