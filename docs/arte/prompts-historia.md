# Prompts de arte del modo historia

Guía para dibujar con ChatGPT las imágenes del modo historia de **Card Evolution**: los fondos de los 12 pueblos, el mapa, el dorso de las cartas de pueblo, las 6 cartas de lugar y las caras de los personajes.

## Cómo usarla

1. **Una imagen por mensaje.** Copia un bloque de código entero y pégalo como mensaje. Cada prompt trae todo lo necesario: no hace falta explicar nada más.
2. **Adjunta siempre la misma referencia de estilo:** el jabalí de guerra, `public/cards-art/Armored Boar in the Misty Forest.png`. Solo esa imagen, en cada mensaje.
3. **Empieza un chat nuevo cada 2 o 3 imágenes.** GPT copia sus propias imágenes anteriores dentro de un mismo chat: colores, ojos, caras y cielos se empiezan a parecer.
   - En un mismo chat, mejor mezclar tipos (un pueblo, una cara y un lugar) que hacer tres caras seguidas.
   - Única excepción: **Fermín y el Coleccionista** son la misma persona. Hazlos en el mismo chat, uno detrás del otro, para que la cara coincida.
4. **Guarda cada imagen con el nombre exacto** que aparece en su título, dentro de `public/cards-art/historia/`. Por ejemplo, el fondo de Puerto Escarcha va en `public/cards-art/historia/pueblos/03.png`.
   - Esa carpeta no se sube a git: son los originales.
   - El juego usa copias en WebP en `public/story-art/`, con las mismas rutas; esas se preparan después a partir de estos originales.
5. **Tamaños:** cada prompt dice cuál usar. Son los tres que ofrece ChatGPT: horizontal 1536×1024, vertical 1024×1536 y cuadrado 1024×1024.

### Si algo sale mal

- **Aparece texto o letras:** pide «Quita todo el texto y las letras; no cambies nada más».
- **Se parece al jabalí o a una imagen anterior:** abre un chat nuevo y vuelve a pegar el prompt.
- **Manos con dedos de más o de menos:** los prompts esconden las manos siempre que pueden. Si una sale mal, corrígela con *Editar* y una selección con el pincel, una mano a la vez.
- **Una cara con otro encuadre:** pide «Aleja (o acerca) la cámara para que los ojos queden a un 40 % de la altura, contando desde arriba». Todas las caras se recortan en el mismo marco pequeño, así que el encuadre tiene que coincidir.

## Lista de archivos

Todas las rutas son dentro de `public/cards-art/historia/`.

| # | Archivo | Qué es | Tamaño | Hecho |
|---|---|---|---|---|
| 1 | `pueblos/00.png` | Aldea del Cruce | 1536×1024 | ☐ |
| 2 | `pueblos/01.png` | Hornos Viejos | 1536×1024 | ☐ |
| 3 | `pueblos/02.png` | Bosque Hondo | 1536×1024 | ☐ |
| 4 | `pueblos/03.png` | Puerto Escarcha | 1536×1024 | ☐ |
| 5 | `pueblos/04.png` | Chatarral | 1536×1024 | ☐ |
| 6 | `pueblos/05.png` | Ciudad sin Faroles | 1536×1024 | ☐ |
| 7 | `pueblos/06.png` | Isla de Arena | 1536×1024 | ☐ |
| 8 | `pueblos/07.png` | Templo Hundido | 1536×1024 | ☐ |
| 9 | `pueblos/08.png` | Mirador de las Nubes | 1536×1024 | ☐ |
| 10 | `pueblos/09.png` | Camino del Risco | 1536×1024 | ☐ |
| 11 | `pueblos/10.png` | Torre del Archivero | 1536×1024 | ☐ |
| 12 | `pueblos/11.png` | Torre sin Fin | 1536×1024 | ☐ |
| 13 | `mapa.png` | Mapa de las Tierras Quietas | 1536×1024 | ☐ |
| 14 | `dorso.png` | Dorso de las cartas de pueblo | 1024×1536 | ☐ |
| 15 | `lugares/cafe.png` | Café de batallas | 1024×1536 | ☐ |
| 16 | `lugares/arena.png` | Arena | 1024×1536 | ☐ |
| 17 | `lugares/tienda.png` | Tienda de fusión | 1024×1536 | ☐ |
| 18 | `lugares/menu.png` | Mazos y compañeros | 1024×1536 | ☐ |
| 19 | `lugares/sala.png` | Cuarto del aprendiz | 1024×1536 | ☐ |
| 20 | `lugares/mapa.png` | Volver al mapa | 1024×1536 | ☐ |
| 21 | `caras/tadeo.png` | Tadeo, viajero | 1024×1024 | ☐ |
| 22 | `caras/dante.png` | Dante, viajero | 1024×1024 | ☐ |
| 23 | `caras/soledad.png` | Soledad, viajera | 1024×1024 | ☐ |
| 24 | `caras/mina.png` | Mina, viajera | 1024×1024 | ☐ |
| 25 | `caras/lia.png` | Lía, viajera | 1024×1024 | ☐ |
| 26 | `caras/mateo.png` | Mateo, viajero | 1024×1024 | ☐ |
| 27 | `caras/iker.png` | Iker, viajero | 1024×1024 | ☐ |
| 28 | `caras/jacinto.png` | Jacinto, viajero | 1024×1024 | ☐ |
| 29 | `caras/isidro.png` | Isidro, viajero | 1024×1024 | ☐ |
| 30 | `caras/tomas.png` | Tomás, viajero | 1024×1024 | ☐ |
| 31 | `caras/clara.png` | Clara, viajera | 1024×1024 | ☐ |
| 32 | `caras/fermin.png` | Fermín, sin máscara | 1024×1024 | ☐ |
| 33 | `caras/coleccionista.png` | El Coleccionista, con máscara | 1024×1024 | ☐ |
| 34 | `caras/a.png` | «A» | 1024×1024 | ☐ |
| 35 | `caras/encapuchado.png` | El desconocido de los «???????» | 1024×1024 | ☐ |
| 36 | `caras/abuela-retama.png` | Abuela Retama | 1024×1024 | ☐ |
| 37 | `caras/rey-basural.png` | Rey Basural | 1024×1024 | ☐ |
| 38 | `caras/aprendiz-1.png` | Aprendiz 1 (jugador) | 1024×1024 | ☐ |
| 39 | `caras/aprendiz-2.png` | Aprendiz 2 (jugador) | 1024×1024 | ☐ |
| 40 | `caras/aprendiz-3.png` | Aprendiz 3 (jugador) | 1024×1024 | ☐ |
| 41 | `caras/aprendiz-4.png` | Aprendiz 4 (jugador) | 1024×1024 | ☐ |

---

## Pueblos

Fondos horizontales. El juego pone las cartas de lugar en la cuarta parte izquierda y el cuadro de diálogo en la cuarta parte de abajo; por eso esas zonas van más tranquilas y oscuras, y el lugar principal del pueblo va en el centro-derecha.

### `pueblos/00.png` — Aldea del Cruce

```
Pueblo 00 — Aldea del Cruce. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: horizontal, 1536×1024. Vista pintada del pueblo, como fondo de escena.
Concepto: una aldea pequeña y tranquila donde se cruzan dos caminos de tierra junto a un río angosto. Las personas se fueron hace mucho y ahora la cuidan criaturas. Es el primer pueblo del viaje: tiene que sentirse como una bienvenida.
Casas: bajas, de piedra y madera, con techos de paja; huertas, cercas de troncos y una cuerda con ropa tendida.
Lugar principal (centro-derecha): un puente de piedra en arco justo donde se cruzan los caminos y, al lado, una arena redonda y baja hecha de troncos y piedras, rodeada de arbustos de retama con flores amarillas. Una balsa de madera amarrada en la orilla.
Paleta: verde pradera fresco como color principal; amarillo retama de acento; paja ocre y piedra gris tibia.
Luz y clima: media mañana de primavera, sol suave desde la izquierda, cielo celeste con nubes altas; una brisa mueve el pasto.
Cámara: desde una loma baja, un poco elevada, mirando hacia el cruce.
Composición: la cuarta parte izquierda, tranquila y más oscura: la sombra de un roble grande en primer plano. La cuarta parte de abajo, también tranquila y en sombra: pasto y camino sin detalles.
Gente: sin personas ni criaturas; como mucho, dos o tres siluetas diminutas a lo lejos, sobre el puente.
Sin texto, letras, números, logos ni marcos en la imagen; sin carteles escritos. Diseño original, que no se parezca a ninguna franquicia existente.
```

### `pueblos/01.png` — Hornos Viejos

```
Pueblo 01 — Hornos Viejos. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: horizontal, 1536×1024. Vista pintada del pueblo, como fondo de escena.
Concepto: un pueblo de antiguos hornos de cerámica, construido en terrazas sobre una ladera de arcilla. Chimeneas altas que todavía echan humo; hileras de vasijas y tejas secándose al sol en las terrazas.
Lugar principal (centro-derecha): el horno grande, una cúpula enorme de ladrillo con forma de colmena, con brasas naranjas en la boca y una chimenea gruesa. Al lado, la arena: un ring cuadrado de ladrillo con cuerdas gruesas, como de boxeo.
Paleta: rojo ladrillo y terracota como color principal; gris carbón; naranja brasa solo en las bocas de los hornos.
Luz y clima: tarde calurosa y seca; cielo color durazno pálido, velado por el humo; ceniza fina que cae despacio como nieve gris clara.
Cámara: desde abajo, al pie de la ladera, mirando hacia arriba a las chimeneas.
Composición: la cuarta parte izquierda, tranquila y más oscura: un muro de ladrillo en sombra en primer plano. La cuarta parte de abajo, también tranquila y en sombra: un callejón empedrado con algunas vasijas.
Gente: sin personas ni criaturas; como mucho, dos o tres siluetas diminutas a lo lejos, en las terrazas.
Sin texto, letras, números, logos ni marcos en la imagen; sin carteles escritos. Diseño original, que no se parezca a ninguna franquicia existente.
```

### `pueblos/02.png` — Bosque Hondo

```
Pueblo 02 — Bosque Hondo. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: horizontal, 1536×1024. Vista pintada del pueblo, como fondo de escena.
Concepto: un pueblo dentro de un bosque profundo de árboles gigantes, con raíces altas como muros y musgo grueso en todas partes. Casas redondas construidas en los huecos de los troncos, unidas por puentes colgantes de cuerda y tablas.
Lugar principal (centro-derecha): un árbol colosal, con el tronco más ancho que una casa, y en sus ramas una plataforma circular de madera que es la arena, a la que llegan tres puentes colgantes.
Paleta: verde bosque profundo como color principal; verde musgo amarillento; corteza café rojiza; pequeños hongos naranjas de acento.
Luz y clima: mediodía nublado bajo el follaje; luz verde, difusa y pareja, sin rayos de sol; llovizna fina y vapor entre los troncos.
Cámara: desde el suelo del bosque, mirando hacia arriba en diagonal.
Composición: la cuarta parte izquierda, tranquila y más oscura: un tronco enorme cubierto de musgo, en sombra profunda. La cuarta parte de abajo, también tranquila y en sombra: helechos y raíces.
Gente: sin personas ni criaturas; como mucho, dos o tres siluetas diminutas a lo lejos, cruzando un puente.
Sin texto, letras, números, logos ni marcos en la imagen; sin carteles escritos. Diseño original, que no se parezca a ninguna franquicia existente.
```

### `pueblos/03.png` — Puerto Escarcha

```
Pueblo 03 — Puerto Escarcha. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: horizontal, 1536×1024. Vista pintada del pueblo, como fondo de escena.
Concepto: un puerto de pescadores congelado: muelles de madera cubiertos de escarcha, barcos atrapados en el mar helado, casas de tablas pintadas con nieve en los techos y redes duras de hielo.
Lugar principal (centro-derecha): un faro de piedra con franjas blancas y azul oscuro al final de un muelle largo y, junto a él, la arena: una pista circular sobre el mar congelado, marcada con boyas.
Paleta: azul hielo como color principal; blanco nieve; gris acero; dos o tres botes de rojo apagado como único acento cálido.
Luz y clima: primera hora de la mañana; luz fría y baja desde la derecha; cielo blanco celeste; cae nieve suave y sube vapor helado del agua que queda libre.
Cámara: a la altura del muelle, mirando a lo largo del puerto hacia el faro.
Composición: la cuarta parte izquierda, tranquila y más oscura: cajas heladas y el casco de un bote en sombra. La cuarta parte de abajo, también tranquila y en sombra: las tablas nevadas del muelle.
Gente: sin personas ni criaturas; como mucho, dos o tres siluetas diminutas a lo lejos, junto al faro.
Sin texto, letras, números, logos ni marcos en la imagen; sin carteles escritos ni nombres en los barcos. Diseño original, que no se parezca a ninguna franquicia existente.
```

### `pueblos/04.png` — Chatarral

```
Pueblo 04 — Chatarral. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: horizontal, 1536×1024. Vista pintada del pueblo, como fondo de escena.
Concepto: un pueblo armado con chatarra: casas hechas de calderas viejas, tinas, ruedas de carreta, láminas oxidadas y engranajes, entre montañas de basura de metal. Desordenado, pero con cierta gracia.
No dibujes autos ni maquinaria moderna: la chatarra es antigua (calderas, ollas, catres, faroles rotos, resortes, ruedas de madera con aro de hierro).
Lugar principal (centro-derecha): la montaña de chatarra más alta, con un trono torcido en la cima hecho de una tina y un sillón viejo, bajo una grúa oxidada. Al pie, la arena: un círculo cercado con rejas y ruedas.
Paleta: marrón óxido y caqui como color principal; verde cobre (pátina) de acento; gris polvo.
Luz y clima: tarde nublada y ventosa; cielo amarillo grisáceo; el viento levanta polvo y hace volar trapos y hojas secas.
Cámara: elevada, desde lo alto de otra montaña de chatarra, mirando hacia el valle.
Composición: la cuarta parte izquierda, tranquila y más oscura: un montón de chatarra en sombra en primer plano. La cuarta parte de abajo, también tranquila y en sombra: suelo de tierra polvorienta.
Gente: sin personas ni criaturas; como mucho, dos o tres siluetas diminutas a lo lejos, entre las casas.
Sin texto, letras, números, logos ni marcos en la imagen; sin carteles escritos ni etiquetas. Diseño original, que no se parezca a ninguna franquicia existente.
```

### `pueblos/05.png` — Ciudad sin Faroles

```
Pueblo 05 — Ciudad sin Faroles. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: horizontal, 1536×1024. Vista pintada del pueblo, como fondo de escena.
Concepto: una ciudad de calles angostas, casas altas y apretadas con techos de pizarra muy empinados, y cientos de faroles de hierro en hilera, todos apagados. Aquí siempre es el atardecer y los faroles nunca se encienden. Silenciosa y un poco fantasmal, pero no de terror.
No dibujes faroles encendidos ni ventanas con luz.
Lugar principal (centro-derecha): un teatro antiguo con cúpula y columnas, convertido en arena, al final de una avenida de faroles apagados; sobre la cúpula, una veleta de hierro con forma de luna creciente.
Paleta: índigo y violeta como color principal; una franja de rosa frío en el cielo junto al horizonte; gris pizarra.
Luz y clima: crepúsculo quieto y despejado, justo después de que se fue el sol; las primeras estrellas en el cielo violeta; una neblina baja muy leve entre las calles.
Cámara: a la altura de la calle, mirando a lo largo de la avenida en perspectiva.
Composición: la cuarta parte izquierda, tranquila y más oscura: la fachada de una casa en sombra profunda, con un farol apagado. La cuarta parte de abajo, también tranquila y en sombra: adoquines húmedos.
Gente: sin personas ni criaturas; como mucho, dos o tres siluetas diminutas a lo lejos, al final de la avenida.
Sin texto, letras, números, logos ni marcos en la imagen; sin carteles escritos. Diseño original, que no se parezca a ninguna franquicia existente.
```

### `pueblos/06.png` — Isla de Arena

```
Pueblo 06 — Isla de Arena. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: horizontal, 1536×1024. Vista pintada del pueblo, como fondo de escena.
Concepto: una isla solitaria de dunas en medio del mar, con restos de barcos naufragados medio enterrados en la arena, palmeras torcidas por el viento y barriles que trajo la marea.
Lugar principal (centro-derecha): el casco de un gran barco de madera varado sobre una duna, abierto por un costado y convertido en arena, con banderas de tela lisa en los mástiles rotos; a su lado, un ancla gigante clavada en la arena.
Paleta: dorado arena como color principal; turquesa del mar cerca de la orilla y azul profundo más lejos; madera blanqueada por el sol.
Luz y clima: mediodía de sol fuerte y alto, sombras cortas; el viento levanta arena de las crestas de las dunas. En el horizonte del mar, hacia la derecha, un banco de niebla gris, quieto y espeso, que amenaza la isla.
Cámara: desde lo alto de una duna, mirando a lo largo de la costa.
Composición: la cuarta parte izquierda, tranquila y más oscura: la ladera de una duna en sombra, con pasto seco. La cuarta parte de abajo, también tranquila y en sombra: arena lisa.
Gente: sin personas ni criaturas; como mucho, dos o tres siluetas diminutas a lo lejos, junto al barco.
Sin texto, letras, números, logos ni marcos en la imagen; sin nombres en los barcos. Diseño original, que no se parezca a ninguna franquicia existente.
```

### `pueblos/07.png` — Templo Hundido

```
Pueblo 07 — Templo Hundido. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: horizontal, 1536×1024. Vista pintada del pueblo, como fondo de escena.
Concepto: un antiguo templo de piedra, escalonado, que se hundió a medias en un lago de agua verde y quieta; sus escaleras bajan y se pierden bajo el agua. Un lugar sagrado y silencioso, con casitas de piedra sobre pilotes alrededor.
Lugar principal (centro-derecha): el arco más alto del templo, con una campana de bronce enorme colgada, y delante una plataforma de piedra apenas sobre el agua que hace de arena, unida al resto por pasarelas de piedra.
Paleta: verde azulado profundo como color principal (agua y piedra con musgo); bronce verdoso de la campana; blanco de los nenúfares de acento.
Luz y clima: mañana temprano y nublada, luz gris perla y pareja; lluvia suave que hace círculos en el agua. Muy a lo lejos, a la derecha, unas hebras finas de niebla gris sobre el horizonte.
Cámara: casi a ras del agua, mirando hacia el templo.
Composición: la cuarta parte izquierda, tranquila y más oscura: columnas caídas cubiertas de musgo, en sombra. La cuarta parte de abajo, también tranquila y en sombra: agua oscura y quieta, con reflejos suaves.
Gente: sin personas ni criaturas; como mucho, dos o tres siluetas diminutas a lo lejos, en las pasarelas.
Sin texto, letras, números, logos ni marcos en la imagen; sin inscripciones en la piedra. Diseño original, que no se parezca a ninguna franquicia existente.
```

### `pueblos/08.png` — Mirador de las Nubes

```
Pueblo 08 — Mirador de las Nubes. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: horizontal, 1536×1024. Vista pintada del pueblo, como fondo de escena.
Concepto: un mirador en lo alto de unos picos, por encima de un mar de nubes: casitas de madera colgadas de la roca, molinos de viento con aspas de tela, campanas y telescopios de bronce que apuntan al horizonte.
Lugar principal (centro-derecha): una torre de vigía de piedra y madera con un gran telescopio de bronce en la terraza, junto a un molino que mueve una máquina llena de campanas; la arena es una terraza redonda con barandas, colgada sobre el vacío.
Paleta: azul cielo pálido y gris nube como color principal; madera color miel y bronce de acento; blanco.
Luz y clima: tarde clara de viento fuerte; las aspas giran, banderines de tela lisa flamean y las nubes pasan rápido; sol alto y frío. A lo lejos, en el borde derecho del horizonte, una mancha baja de niebla gris.
Cámara: desde un pico vecino, a la misma altura que el mirador, con el mar de nubes abajo.
Composición: la cuarta parte izquierda, tranquila y más oscura: una roca en sombra con un pino solitario doblado por el viento. La cuarta parte de abajo, también tranquila y en sombra: el mar de nubes, liso y sin detalles.
Gente: sin personas ni criaturas; como mucho, dos o tres siluetas diminutas a lo lejos, en la terraza.
Sin texto, letras, números, logos ni marcos en la imagen; sin carteles escritos. Diseño original, que no se parezca a ninguna franquicia existente.
```

### `pueblos/09.png` — Camino del Risco

```
Pueblo 09 — Camino del Risco. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: horizontal, 1536×1024. Vista pintada del pueblo, como fondo de escena.
Concepto: un camino angosto tallado en la pared de un acantilado altísimo de roca rojiza, con tramos de puentes de tablas y cadenas sobre el vacío y unas pocas casitas de piedra metidas en la roca. Es el último tramo antes de la Torre del Archivero.
Lugar principal (centro-derecha): una saliente ancha de roca donde el camino forma un rellano con una arena improvisada (piedras en círculo y estacas con cuerdas) y, detrás, un arco natural de roca por donde sigue el camino.
Paleta: terracota y ocre rojizo como color principal; sombras de violeta grisáceo; cielo amarillo pálido.
Luz y clima: atardecer con viento; sol bajo desde la izquierda que pinta la roca de naranja. Una niebla gris llena el valle de abajo y sube despacio por las grietas.
Cámara: de lado, desde el aire, frente al acantilado, viendo el camino en diagonal.
Composición: la cuarta parte izquierda, tranquila y más oscura: una pared de roca en sombra, muy cerca. La cuarta parte de abajo, también tranquila: la niebla gris del valle, lisa y pareja.
Gente: sin personas ni criaturas; como mucho, dos o tres siluetas diminutas a lo lejos, sobre un puente.
Sin texto, letras, números, logos ni marcos en la imagen; sin carteles escritos. Diseño original, que no se parezca a ninguna franquicia existente.
```

### `pueblos/10.png` — Torre del Archivero

```
Pueblo 10 — Torre del Archivero. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: horizontal, 1536×1024. Vista pintada del pueblo, como fondo de escena.
Concepto: un archivo antiguo donde se guardaba el registro de la forma de cada criatura: una torre de piedra muy alta y ancha, con muchos pisos de ventanas redondas, escaleras por fuera y puentes entre sus alas. Una enredadera de madreselva con flores color crema la trepa hasta la mitad. Está a la orilla de un lago, al pie de una montaña.
Lugar principal (centro-derecha): la torre, con una gran puerta de piedra y un patio redondo delante que es la arena. Muy al fondo, al otro lado del lago, la silueta pálida de otra torre, oscura, delgada y altísima, medio borrada por la niebla gris.
Paleta: lavanda y gris piedra como color principal; verde oscuro de la enredadera; crema de las flores.
Luz y clima: anochecer después de la lluvia; cielo lavanda y azul con nubes que se abren; charcos en el patio; luz suave y pareja. Niebla gris sobre el lago.
Cámara: desde el camino de llegada, a la altura del suelo, un poco por debajo de la torre.
Composición: la cuarta parte izquierda, tranquila y más oscura: un pilar de piedra de la entrada, con enredadera, en sombra. La cuarta parte de abajo, también tranquila y en sombra: losas mojadas con charcos.
Gente: sin personas ni criaturas; como mucho, dos o tres siluetas diminutas a lo lejos, en las escaleras de la torre.
Sin texto, letras, números, logos ni marcos en la imagen; sin libros con títulos ni inscripciones. Diseño original, que no se parezca a ninguna franquicia existente.
```

### `pueblos/11.png` — Torre sin Fin

```
Pueblo 11 — Torre sin Fin. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: horizontal, 1536×1024. Vista pintada del lugar, como fondo de escena.
Concepto: una torre oscura, delgada y altísima que apareció de pronto sobre un lago; sus pisos se repiten sin fin hasta perderse entre las nubes. De ella sale una niebla gris que borra las formas y apaga los colores. Inquietante y silenciosa.
No dibujes un castillo de villano con pinchos, ni lava, ni rayos, ni ventanas encendidas.
Lugar principal (centro-derecha): la torre, que nace del agua quieta, con hileras de ventanas iguales que son huecos oscuros; una pasarela larga de piedra cruza el lago hasta su puerta. La cima no se ve.
Paleta: grises (gris acero y gris ceniza) como color principal, casi sin color. Solo los juncos de la orilla cercana conservan un poco de verde y ocre apagados, y se vuelven grises a medida que se acercan a la niebla.
Luz y clima: sin hora clara; luz plana y gris, sin sol; niebla espesa que se arrastra sobre el agua y sube por la torre; el lago, liso como un espejo.
Cámara: desde la orilla, muy abajo, mirando hacia arriba.
Composición: la cuarta parte izquierda, tranquila y más oscura: la orilla con juncos en sombra. La cuarta parte de abajo, también tranquila y oscura: agua quieta.
Gente: sin personas ni criaturas; como mucho, una o dos siluetas diminutas en la pasarela, casi borradas por la niebla.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

---

## Mapa

### `mapa.png` — Mapa de las Tierras Quietas

El juego pone encima de cada lugar un marcador, la ruta y la niebla de las regiones que todavía no se abrieron; por eso el mapa no lleva caminos marcados ni nombres. Las posiciones del prompt son las de los marcadores del juego.

```
Mapa de las Tierras Quietas. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: horizontal, 1536×1024.
Concepto: un mapa ilustrado visto desde arriba, pintado a mano sobre papel, de una tierra tranquila de la que las personas se fueron hace mucho. Cada lugar es un pequeño dibujo (un hito), no una ciudad con nombre.
Geografía: tierra firme en casi todo el cuadro. El mar ocupa la franja de abajo, desde un poco antes del centro hasta el borde derecho, y sube por la esquina de abajo a la derecha. Montañas en el norte y en el noreste; un lago grande en la esquina de arriba a la derecha.
Regiones:
- Tierras Bajas, al suroeste: campos verdes y cálidos, hornos, un bosque profundo, un puerto helado en la costa y un depósito de chatarra.
- Tierras Altas, en el centro y el norte: colinas y montañas en tonos azul verdoso, una ciudad oscura, un templo hundido en un lago y un mirador sobre picos rodeados de nubes.
- Tierras Lejanas, al este: rocas rojizas y ocres, más frías y grises hacia el noreste.
Hitos (posición aproximada: primero el porcentaje del ancho desde la izquierda, después el porcentaje del alto desde arriba):
- 16 %, 78 %: casitas con techo de paja donde se cruzan dos caminos, con campos verdes alrededor.
- 29 %, 66 %: hornos de ladrillo con chimeneas que echan humo.
- 21 %, 50 %: un bosque muy espeso de árboles gigantes.
- 40 %, 83 %: un puerto helado en la costa, con un faro y muelles blancos.
- 45 %, 59 %: montañas de chatarra oxidada con una grúa torcida.
- 57 %, 46 %: una ciudad oscura de techos de pizarra, siempre en sombra.
- 49 %, 32 %: un templo de piedra medio hundido en un lago verde.
- 64 %, 22 %: una torre de vigía con molinos sobre picos rodeados de nubes.
- 75 %, 40 %: un camino angosto tallado en un acantilado rojizo.
- 84 %, 48 %: una torre antigua de piedra cubierta de enredaderas.
- 92 %, 19 %: una torre oscura y altísima sobre el lago, rodeada de niebla gris.
- 78 %, 82 %: una isla de dunas en el mar, con un barco naufragado.
Niebla: solo alrededor de la torre oscura del noreste: un manto gris que se derrama sobre el lago y apaga los colores de ese rincón.
Caminos: senderos de tierra apenas marcados, o ninguno.
Paleta: verdes y ocres suaves, mar azul grisáceo, papel color crema.
Luz: pareja, de día claro, sin sombras fuertes.
Encuadre: todo el mapa dentro del cuadro, sin cortar islas ni costas importantes; sin marco, sin rosa de los vientos, sin cartelas ni leyendas.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

---

## Dorso de las cartas de pueblo

### `dorso.png` — Dorso de carta

```
Dorso de carta. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: vertical, 1024×1536.
Concepto: el reverso de una carta de pueblo de las Tierras Quietas: un emblema propio, como el sello de una baraja antigua, dibujado a tinta sobre papel.
Simetría: perfectamente simétrico de izquierda a derecha; los adornos de arriba se repiten abajo.
Emblema central: un huevo de pie dentro de un círculo doble; sobre el huevo, una estrella de cuatro puntas en forma de cruce de caminos. Alrededor del círculo, cinco símbolos pequeños repartidos en anillo, con uno arriba al centro: una llama, una gota, una hoja, una luna creciente y una espiral.
Fondo: azul petróleo profundo, con un patrón fino de rombos que se repite, en un tono apenas más claro.
Borde: una guarda fina de hojas pequeñas, a un 6 % del borde, con un adorno igual en cada esquina; la franja de afuera, lisa y del color del fondo.
Paleta: azul petróleo, crema y dorado viejo; nada más.
Luz: plana y pareja, sin reflejos ni brillo metálico.
Encuadre: el emblema en el centro exacto, ocupando unos dos tercios del ancho.
Sin texto, letras, números, logos ni marcos de carta en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

---

## Cartas de lugar

Viñetas verticales pequeñas: un objeto o un rincón que se entienda en miniatura.

### `lugares/cafe.png` — Café de batallas

```
Carta de lugar — Café de batallas. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: vertical, 1024×1536.
Concepto: el rincón de un café acogedor donde se juega a las cartas: una mesa redonda de madera con dos tazas humeantes y un mazo de cartas boca abajo, junto a dos sillas de madera.
Cartas: con el dorso liso, sin dibujos, letras ni números.
Paleta: café y ámbar miel como color principal; crema; un toque de verde en una planta pequeña.
Luz: cálida, de una lámpara que no se ve, desde arriba a la izquierda; vapor suave saliendo de las tazas.
Fondo: una pared de tablas y una ventana pequeña con cortina, muy simples, que se funden con el papel hacia los bordes.
Encuadre: viñeta; la mesa en el centro, ocupando dos tercios del alto, con margen alrededor. Siluetas claras y buen contraste, para que se entienda en miniatura.
Gente: sin personas ni criaturas.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

### `lugares/arena.png` — Arena

```
Carta de lugar — Arena. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: vertical, 1024×1536.
Concepto: una arena de torneo pequeña, vista un poco desde arriba: un ring redondo de piedra con un círculo marcado en el centro y dos tarimas enfrentadas para los jugadores, rodeado de gradas bajas y banderines de tela.
Banderines: lisos, sin escudos ni símbolos.
Paleta: piedra color arena como color principal; rojo bermellón en los banderines; sombras café.
Luz y clima: mediodía despejado, sol desde la izquierda, una brisa que mueve los banderines.
Fondo: cielo celeste pálido, liso, que se funde con el papel hacia los bordes.
Encuadre: viñeta; el ring en el centro, ocupando dos tercios del alto, con margen alrededor. Siluetas claras y buen contraste, para que se entienda en miniatura.
Gente: sin personas ni criaturas.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

### `lugares/tienda.png` — Tienda de fusión

```
Carta de lugar — Tienda de fusión. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: vertical, 1024×1536.
Concepto: una máquina de fusión sobre un mostrador de madera: dos embudos de bronce por los que entran dos cartas, unos tubos de vidrio con líquido violeta que se unen en un alambique, y abajo una bandeja donde sale una sola carta.
Cartas: con el dorso liso, sin dibujos, letras ni números.
Paleta: bronce y violeta como color principal; madera oscura; burbujas lila claro.
Luz y clima: luz fría de mañana desde una ventana a la derecha; vapor que sale del alambique.
Fondo: una pared con estantes de frascos de colores, muy simples, que se funden con el papel hacia los bordes.
Encuadre: viñeta; la máquina en el centro, ocupando dos tercios del alto, con margen alrededor. Siluetas claras y buen contraste, para que se entienda en miniatura.
Gente: sin personas ni criaturas.
Sin texto, letras, números, logos ni marcos en la imagen; sin etiquetas en los frascos. Diseño original, que no se parezca a ninguna franquicia existente.
```

### `lugares/menu.png` — Mazos y compañeros

```
Carta de lugar — Mazos y compañeros. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: vertical, 1024×1536.
Concepto: sobre una mesa, una caja de mazo de cuero abierta con cartas en abanico, boca abajo, y al lado un huevo moteado en un nido de paja: el mazo y el compañero del aprendiz.
Cartas: con el dorso liso, sin dibujos, letras ni números.
Paleta: verde musgo (el cuero) y crema como color principal; el huevo, crema con motas color óxido; paja dorada.
Luz: cálida de tarde, desde la derecha.
Fondo: un mantel liso color arena que se funde con el papel hacia los bordes.
Encuadre: viñeta; la caja y el huevo en el centro, ocupando dos tercios del alto, con margen alrededor. Siluetas claras y buen contraste, para que se entienda en miniatura.
Gente: sin personas ni criaturas.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

### `lugares/sala.png` — Cuarto del aprendiz

```
Carta de lugar — Cuarto del aprendiz. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: vertical, 1024×1536.
Concepto: el rincón de un cuarto pequeño bajo el techo: una cama angosta con una colcha de retazos, una mochila de viaje en el piso y una mesita con una vela y unas cartas boca abajo.
Cartas: con el dorso liso, sin dibujos, letras ni números.
Paleta: azul noche (paredes) como color principal; la colcha de retazos en rojo, mostaza y verde apagados; madera clara.
Luz y clima: amanecer; luz rosada que entra por una ventana redonda en la pared de la izquierda; afuera, cielo despejado.
Fondo: la pared inclinada del techo, de tablas, que se funde con el papel hacia los bordes.
Encuadre: viñeta; la cama y la mesita en el centro, ocupando dos tercios del alto, con margen alrededor. Siluetas claras y buen contraste, para que se entienda en miniatura.
Gente: sin personas ni criaturas.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

### `lugares/mapa.png` — Volver al mapa

```
Carta de lugar — Volver al mapa. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: vertical, 1024×1536.
Concepto: un mapa de papel medio desenrollado, con un caminito punteado, colinas y un río dibujados, una brújula de bronce encima y un bastón de caminante apoyado al lado: la hora de seguir el viaje.
Mapa y brújula: sin letras, números ni puntos cardinales escritos.
Paleta: pergamino crema como color principal; verde azulado en el río y las colinas; bronce.
Luz y clima: día claro y ventoso; luz suave desde arriba; una esquina del mapa levantada por el viento.
Fondo: pasto corto y liso que se funde con el papel hacia los bordes.
Encuadre: viñeta; el mapa y la brújula en el centro, ocupando dos tercios del alto, con margen alrededor. Siluetas claras y buen contraste, para que se entienda en miniatura.
Gente: sin personas ni criaturas.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

---

## Caras

Retratos cuadrados de busto. El juego los recorta en un marco pequeño, así que **todos llevan el mismo encuadre**: cabeza y hombros, tres cuartos mirando hacia la izquierda de la imagen, ojos a un 40 % de la altura y fondo liso de un solo color. Las manos quedan fuera del cuadro.

### Viajeros

Personas que volvieron a las Tierras Quietas, como el jugador.

#### `caras/tadeo.png` — Tadeo

```
Retrato — Tadeo, viajero. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: Tadeo, un chico de unos 15 años que volvió a las Tierras Quietas para perseguir a una banda de criaturas malvadas. Seguro de sí mismo, alegre y un poco fanfarrón.
Cara: piel morena oscura, cara ancha de mandíbula marcada, una cicatriz fina y corta en el mentón.
Ojos: almendrados, café oscuro, con cejas gruesas y rectas; una ceja levantada.
Pelo: negro, con los lados rapados y rizos cortos y apretados arriba.
Expresión: media sonrisa confiada, de lado, con la boca cerrada.
Ropa: chaqueta de lona color caqui, gastada y con muchos bolsillos; un pañuelo rojo óxido anudado al cuello; una cuerda enrollada cruzada sobre el pecho, como de rastreador.
Silueta: hombros anchos y cuello firme, con la cabeza un poco adelantada.
Luz: cálida de tarde, desde arriba a la izquierda.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, caqui oliva apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes de aviador sobre la cabeza, gorras, sombreros ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/dante.png` — Dante

```
Retrato — Dante, viajero. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: Dante, un chico de unos 13 años, amable y entusiasta, que arma sus propios mazos. Siempre tiene un mal presentimiento sobre lo que pasa en las Arenas.
Cara: piel clara con muchas pecas en la nariz y las mejillas, cara redonda.
Ojos: grandes y redondos, color avellana, con las cejas levantadas en el centro, de preocupación.
Pelo: castaño, ondulado y despeinado, con mechones que le caen sobre la frente y le tapan las orejas.
Expresión: sonrisa nerviosa que deja ver los dientes de arriba, de quien intenta parecer tranquilo.
Ropa: chaleco acolchado verde botella sobre una camiseta de manga larga a rayas crema y café; un parche de tela con forma de llama cosido en el chaleco.
Silueta: delgado, con los hombros un poco encogidos hacia arriba.
Luz: tibia y pareja, de frente.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, rojo ladrillo apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes de aviador sobre la cabeza, gorras, sombreros ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/soledad.png` — Soledad

```
Retrato — Soledad, viajera. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: Soledad, una chica de unos 15 años, tranquila y segura, que juega mucho mejor de lo que parece. Su compañera es una serpiente emplumada.
Cara: piel morena media de tono cálido, cara alargada con pómulos altos.
Ojos: alargados y finos, negros, con los párpados de arriba un poco bajos; mirada serena.
Pelo: negro, lacio y muy largo, en una sola trenza gruesa que le cae sobre un hombro.
Expresión: sonrisa pequeña y tranquila, con la boca cerrada.
Ropa: un poncho corto gris azulado con una guarda tejida de plumas verdes y turquesa en el borde; un arete largo de una sola pluma verde.
Silueta: espalda recta, cuello largo, postura erguida.
Luz: fresca de mañana, desde la derecha.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, verde salvia apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes de aviador sobre la cabeza, gorras, sombreros ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/mina.png` — Mina

```
Retrato — Mina, viajera. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: Mina, una chica de unos 14 años que se aburre de todo, extraña su casa y no soporta perder. Una criatura flor no la deja en paz.
Cara: piel muy clara con mejillas sonrosadas, cara en forma de corazón, nariz respingada.
Ojos: verdes, con los párpados medio caídos de aburrimiento y pestañas largas.
Pelo: rizos abundantes color cobre oscuro, recogidos en lo alto de la cabeza en un moño grande y esponjado, atado con un lazo de tela crema; algunos rizos sueltos.
Expresión: puchero de fastidio, con una mejilla inflada y la barbilla levantada.
Ropa: un suéter tejido color crema, grueso, con un cuello ancho y enrollado; un broche con forma de flor blanca.
Silueta: hombros caídos y un poco hacia atrás; el cuello del suéter, muy voluminoso.
Luz: suave y rosada, desde arriba.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, lila apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes de aviador sobre la cabeza, gorras, sombreros, pelo rosado ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/lia.png` — Lía

```
Retrato — Lía, viajera. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: Lía, una chica de unos 12 años, alegre e ingeniosa, que arma sus propios mazos y adora ganar con una trampa bien pensada.
Cara: piel aceitunada, cara pequeña y redonda, una curita cruzada sobre la nariz.
Ojos: grandes, redondos y muy oscuros; guiña un ojo.
Pelo: negro, corte tipo casco a la altura de la mandíbula, con el borde disparejo porque se lo corta ella misma; dos pasadores de colores a un lado.
Expresión: sonrisa enorme y pícara, guiñando un ojo.
Ropa: overol de mezclilla azul con el bolsillo del pecho lleno de cartas lisas, clips y un lápiz; camiseta amarilla debajo.
Silueta: pequeña, de hombros estrechos, con la cabeza un poco ladeada.
Luz: brillante de mediodía, desde arriba a la izquierda.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, coral apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes de aviador sobre la cabeza, gorras, sombreros ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen; las cartas del bolsillo, lisas. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/mateo.png` — Mateo

```
Retrato — Mateo, viajero. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: Mateo, un chico de unos 16 años, serio, frío y muy competitivo: odia perder. Su compañero es un lobo de acero.
Cara: piel pálida, cara angulosa de mandíbula fina, una pequeña cicatriz que le corta una ceja.
Ojos: estrechos y afilados, gris claro, con cejas rectas y bajas.
Pelo: negro azabache, lacio, hasta la mandíbula, con raya al medio y un lado metido detrás de la oreja.
Expresión: ceño fruncido, labios apretados, mirada desafiante.
Ropa: abrigo largo color carbón con el cuello levantado, una bufanda gris acero y un colmillo de lobo de metal colgado de un cordón.
Silueta: alto, de hombros angulosos; el cuello alto del abrigo le enmarca la cara.
Luz: fría y lateral, desde la derecha, con sombras marcadas.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, gris pizarra azulado apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes de aviador sobre la cabeza, gorras, sombreros, pelo rubio ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/iker.png` — Iker

```
Retrato — Iker, viajero. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: Iker, un niño de unos 11 años, muy educado, formal y humilde: siempre pide permiso y da las gracias. Es el más joven de los viajeros.
Cara: piel café clara, cara redonda de niño, orejas un poco grandes.
Ojos: pequeños y redondos, café oscuro, con mirada atenta y sincera y cejas suaves.
Pelo: castaño oscuro, corto y muy bien peinado, con raya al lado.
Expresión: sonrisa pequeña y educada con la boca cerrada; la cabeza un poco inclinada, como en un saludo respetuoso.
Ropa: camisa blanca abotonada hasta arriba bajo un chaleco tejido azul marino; la correa de cuero de una bandolera.
Silueta: pequeña, de hombros estrechos y rectos, muy derecho.
Luz: suave de interior, desde la izquierda.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, beige arena apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes de aviador sobre la cabeza, gorras, sombreros ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/jacinto.png` — Jacinto

```
Retrato — Jacinto, viajero. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: Jacinto, un muchacho de unos 17 años, nervioso y responsable, que siempre siente que debería estar estudiando. Lleva un botiquín para curar a quien lo necesite.
Cara: piel clara, cara larga y delgada, cuello largo, ojeras suaves.
Ojos: café, caídos en las puntas, con ojeras y cejas preocupadas.
Pelo: negro, ondulado y algo largo, revuelto como si se pasara las manos por la cabeza todo el tiempo.
Expresión: sonrisa torcida y nerviosa, con la boca entreabierta.
Ropa: un suéter sin mangas color beige sobre una camisa celeste; la correa de un bolso de botiquín de lona verde cruzada sobre el pecho, con una cruz blanca dentro de un círculo verde y una venda enrollada que asoma.
Silueta: alto y flaco, de hombros huesudos, un poco encorvado.
Luz: blanca y pareja, de día nublado.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, verde menta apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes, lentes de aviador sobre la cabeza, gorras, sombreros ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/isidro.png` — Isidro

```
Retrato — Isidro, viajero. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: Isidro, un chico de unos 14 años, estudioso y muy conversador. Estudia las reglas de las Tierras Quietas, lo cuenta todo (contó 312 faroles apagados) y guarda notas sobre las fusiones de cartas.
Cara: piel morena oscura, cara ovalada, nariz ancha.
Ojos: grandes, detrás de unos lentes redondos de marco grueso color carey; cejas muy levantadas de entusiasmo.
Pelo: rizos negros en una nube redonda y grande, con un lápiz clavado entre los rizos.
Expresión: boca abierta a mitad de una explicación, entusiasmado, a punto de contar un dato curioso.
Ropa: chaqueta de pana color mostaza con coderas, sobre una camisa a cuadros; del bolsillo del pecho asoma una libreta gruesa llena de separadores de papel de colores.
Silueta: hombros redondeados y la cabeza adelantada; la nube de pelo ensancha la silueta.
Luz: cálida, como de lámpara de escritorio, desde la izquierda.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, azul índigo apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes de aviador sobre la cabeza, gorras, sombreros, pelo rojo ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen; la libreta, sin nada escrito a la vista. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/tomas.png` — Tomás

```
Retrato — Tomás, viajero. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: Tomás, un chico de unos 13 años, soñador y optimista. Su gran sueño es jugar en la Torre del Archivero, la Arena más difícil de todas.
Cara: piel clara y bronceada, cara alargada, nariz fina, los dientes de adelante un poco grandes.
Ojos: grandes, café claro, llenos de ilusión, mirando un poco hacia arriba, como quien imagina algo lejano.
Pelo: castaño oscuro, ondulado, hasta el cuello de la camisa, echado hacia atrás por el viento, con la frente despejada.
Expresión: sonrisa abierta y feliz, con la boca abierta.
Ropa: un rompevientos color mostaza con la capucha bajada y una bufanda a rayas; la correa de una mochila grande, con una colchoneta enrollada que asoma por detrás del hombro.
Silueta: delgado; la colchoneta enrollada detrás del hombro alarga la silueta.
Luz: dorada de amanecer, desde la izquierda.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, verde azulado (petróleo claro) apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes de aviador sobre la cabeza, gorras, gorros, sombreros, pelo rubio ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/clara.png` — Clara

```
Retrato — Clara, viajera. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: Clara, una chica de unos 12 años, muy sensible: siente lo malo antes que nadie. Tiene pesadillas con una torre enorme envuelta en niebla gris. Viaja con una criatura gata que la protege.
Cara: piel clara y pálida, con un leve tono gris de cansancio; cara pequeña y suave.
Ojos: muy grandes y oscuros, con la mirada perdida, sin enfocar, como si viera algo que los demás no ven.
Pelo: castaño oscuro, largo, ondulado y suelto, con dos trencitas finas a los lados de la cara y un solo mechón gris claro junto a la sien.
Expresión: tristeza suave; boca cerrada y cejas un poco juntas; tranquila, pero inquieta.
Ropa: una capa de lana color crema con la capucha bajada, cerrada con un broche de bronce en forma de luna; debajo, una túnica azul noche.
Silueta: pequeña y frágil; la capucha bajada forma un cuello grande y redondo.
Luz: fría y tenue, desde arriba.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, azul pervinca apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes de aviador sobre la cabeza, gorras, sombreros ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/fermin.png` — Fermín (el Coleccionista sin máscara)

Hazlo en el mismo chat que el Coleccionista, uno detrás del otro: la cara tiene que ser la misma.

```
Retrato — Fermín, viajero arrepentido. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: Fermín, un chico de unos 14 años que fue el Coleccionista: acaparó cartas y hechizó criaturas. Ya sin máscara, está arrepentido y pide perdón.
Rasgos fijos (los mismos que el Coleccionista): piel trigueña; cara delgada con el mentón en punta; pelo negro, lacio y corto, con un mechón largo que le cae sobre la frente hacia la derecha de la imagen; un lunar pequeño junto a la comisura de la boca.
Ojos: café oscuro, mirando hacia abajo, con los párpados pesados y las cejas inclinadas de culpa.
Expresión: arrepentido; labios apretados en una sonrisa pequeña y triste.
Ropa: la misma capa del Coleccionista, morado ciruela con ribete dorado, pero gastada: el ribete descosido y el cuello alto desabrochado y caído. Debajo, una camisa blanca sencilla. Sin máscara.
Silueta: hombros caídos, cabeza un poco gacha.
Luz: gris y suave, de día nublado, desde arriba.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, malva grisáceo apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes de aviador sobre la cabeza, lentes oscuros, gorras, sombreros ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/coleccionista.png` — El Coleccionista (con máscara)

```
Retrato — el Coleccionista. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: el Coleccionista, un viajero misterioso que se queda con las Arenas, acapara cartas y deja a las criaturas sin voluntad, bajo su hechizo. Arrogante y cruel. Nadie sabe quién es.
Rasgos fijos (los mismos que Fermín): un chico de unos 14 años; piel trigueña; cara delgada con el mentón en punta; pelo negro, lacio y corto, con un mechón largo que le cae sobre la frente hacia la derecha de la imagen; un lunar pequeño junto a la comisura de la boca.
Máscara: media máscara de porcelana marfil que le tapa la frente, los ojos y la nariz, decorada con pequeñas placas doradas con forma de carta, superpuestas como escamas. Dos aberturas finas para los ojos. La boca y el mentón quedan a la vista.
Ojos: apenas se ven; oscuros y en sombra detrás de las aberturas, sin brillo.
Expresión: sonrisa de superioridad, de lado, con la barbilla levantada.
Ropa: capa morado ciruela con cuello alto, rígido y en punta, ribete dorado y hombreras; en el pecho, un broche grande con forma de abanico de cartas.
Silueta: el cuello alto de la capa enmarca la cabeza; las hombreras ensanchan los hombros.
Luz: dura, desde abajo a la derecha, con sombras marcadas.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, vino tinto apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes oscuros, visor, lentes de aviador, gorras, sombreros ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen; las cartas del broche, lisas. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/a.png` — «A»

```
Retrato — una presencia antigua. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: una persona antiquísima, de cuando las personas todavía vivían en estas tierras. La encerraron dormida en el fondo de un lago, pero su voluntad se separó del cuerpo y salió. Ominosa, burlona, sin cuerpo.
No dibujes un fantasma de sábana, una calavera ni un monstruo: es una cara humana, demacrada y sin edad.
Cara: piel gris verdosa, como piedra mojada; pómulos muy marcados; manchas de agua y algas finas pegadas a la piel.
Ojos: iris gris muy pálido con pupilas diminutas y párpados pesados; sin brillo.
Pelo: largo y sin color, blanco grisáceo, flotando hacia arriba como si estuviera bajo el agua; todo dentro del cuadro.
Expresión: sonrisa delgada y burlona, sin mostrar los dientes; mirada fría.
Ropa: un cuello alto y antiguo de bronce corroído, verdoso, con algas enredadas, sobre una túnica oscura. Desde los hombros hacia abajo, el cuerpo se deshace en niebla gris.
Silueta: el pelo flotante abre la silueta hacia arriba; los hombros se borran en la niebla.
Luz: fría y verdosa, desde arriba, como la luz que entra bajo el agua.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, gris verdoso muy oscuro; sin degradado, sin objetos.
Manos: fuera del cuadro.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

### Otros

#### `caras/encapuchado.png` — El desconocido (los «???????»)

```
Retrato — un desconocido encapuchado. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: alguien que no dice su nombre y aparece en varios pueblos para advertir al aprendiz de que algo malo se acerca. Misterioso, pero no amenazante.
Cara: no se ve. El interior de la capucha está en sombra total; como mucho, se adivina la punta del mentón. Sin ojos visibles.
Capucha: profunda, de lana gruesa color gris musgo, gastada y con el borde deshilachado; en la orilla, una hilera de hojas y flores de madreselva bordadas con hilo crema; una ramita de madreselva prendida en el pecho.
Expresión: ninguna visible; la cabeza un poco inclinada hacia abajo, como quien escucha.
Silueta: la capucha en punta y la capa ancha sobre los hombros forman un triángulo.
Luz: tenue, desde arriba a la izquierda; dentro de la capucha, oscuridad.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la capucha girada hacia la izquierda de la imagen. Capucha centrada a lo ancho; la zona de los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la capucha; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, terracota apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/abuela-retama.png` — Abuela Retama

```
Retrato — Abuela Retama, criatura. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: la Abuela Retama, una criatura anciana que dirige la primera Arena del viaje. Cariñosa, conversadora y competitiva; se ríe a carcajadas y le dice «criatura» a todo el mundo. Es una cabra montés muy vieja, con ropa y gestos de abuela.
No dibujes una cabra normal ni una persona: es una criatura con hocico de cabra, barbita blanca, cuernos enormes y ropa de abuela.
Ojos: color ámbar con pupila horizontal, entrecerrados por la risa, con arrugas alrededor; unos lentes pequeños y redondos sobre el hocico.
Pelaje: gris plata y crema, con un copete blanco recogido en un moño pequeño entre los cuernos, atado con una ramita de retama con flores amarillas.
Expresión: carcajada con la boca abierta, alegre, con la cabeza un poco echada hacia atrás.
Ropa: un chal tejido a mano color verde oliva, con flecos, cerrado con un broche de madera; un collar de cuentas de barro.
Silueta: cuernos grandes que se enroscan hacia atrás a cada lado de la cabeza; hombros redondos y encorvados.
Luz: cálida de media mañana, desde la izquierda.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; los cuernos enteros dentro del cuadro, con margen arriba; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, amarillo mantequilla apagado; sin degradado, sin objetos.
Anatomía: dos cuernos y dos orejas; las manos, fuera del cuadro.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/rey-basural.png` — Rey Basural

```
Retrato — Rey Basural, criatura. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: el Rey Basural, una criatura que gobierna las montañas de chatarra de su pueblo. Mandón y presumido, nunca admite una derrota y tiene hipo todo el tiempo. Es un sapo enorme y gordo que se cree muy elegante con lo que recoge de la chatarra.
No dibujes un sapo normal ni un rey de cuento: es una criatura gorda y verrugosa con corona y capa hechas de basura.
Piel: verde mostaza con verrugas color óxido y una papada enorme.
Ojos: saltones, dorados, con pupila negra redonda; uno más abierto que el otro por el hipo; párpados pesados.
Corona: una lata abollada recortada en picos, con tapas de botella clavadas, una cuchara doblada y un resorte; sin etiquetas ni letras. Torcida hacia un lado.
Expresión: altanero, con la barbilla levantada y las mejillas infladas a mitad de un hipo; una burbujita le sale de la boca.
Ropa: una capa hecha con una cortina vieja de terciopelo rojo, remendada; un cuello de encaje hecho con un mantel roto; una medalla que es una tapa de olla.
Silueta: muy ancho y sin cuello; la cabeza y el cuerpo forman un solo bulto redondo.
Luz: cálida y polvorienta de tarde, desde la derecha.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; la corona entera dentro del cuadro, con margen arriba; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, berenjena apagado; sin degradado, sin objetos.
Anatomía: las manos, fuera del cuadro.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

### Aprendices (la cara del jugador)

Cuatro aprendices muy distintos entre sí; el jugador elige uno al empezar una partida nueva.

#### `caras/aprendiz-1.png` — Aprendiz 1

```
Retrato — aprendiz recién llegada. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: una chica de unos 13 años que acaba de llegar a las Tierras Quietas para aprender a jugar a las cartas. Valiente y curiosa, con ganas de empezar el viaje.
Cara: piel morena oscura, cara redonda de mejillas llenas.
Ojos: grandes y ovalados, café oscuro, con mirada decidida y cejas firmes.
Pelo: muchas trenzas finas recogidas en un moño alto sobre la cabeza, atado con una cinta naranja.
Expresión: sonrisa amplia y confiada, mostrando los dientes.
Ropa: un impermeable naranja con la capucha bajada, una bufanda corta verde y la correa de un morral de lona.
Silueta: el moño alto alarga la silueta hacia arriba.
Luz: clara de mañana, desde la izquierda.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; el moño entero dentro del cuadro, con margen arriba; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, azul cielo apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes de aviador sobre la cabeza, gorras, sombreros ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/aprendiz-2.png` — Aprendiz 2

```
Retrato — aprendiz recién llegado. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: un chico de unos 15 años que acaba de llegar a las Tierras Quietas para aprender a jugar a las cartas. Tranquilo, observador y decidido.
Cara: piel morena media, cara cuadrada, cejas gruesas, nariz recta.
Ojos: pequeños y rasgados, negros, con mirada tranquila.
Pelo: negro, rapado muy corto y parejo en toda la cabeza.
Expresión: serio pero amable, con una sonrisa apenas marcada en una comisura.
Ropa: una bufanda gruesa de lana verde bosque enrollada alta, hasta la barbilla; una chaqueta acolchada gris ceniza; la correa de cuero de una mochila.
Silueta: hombros anchos; el cuello, cubierto por la bufanda gruesa.
Luz: fría de invierno, desde la derecha.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, naranja calabaza apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes de aviador sobre la cabeza, gorras, sombreros ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/aprendiz-3.png` — Aprendiz 3

```
Retrato — aprendiz que acaba de llegar. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: un niño o niña de unos 12 años, de aspecto andrógino, que acaba de llegar a las Tierras Quietas para aprender a jugar a las cartas. Soñador y curioso: todo lo asombra.
Cara: piel aceitunada clara, cara pequeña y delgada, orejas un poco salidas.
Ojos: muy grandes, gris claro, bien abiertos de asombro.
Pelo: castaño claro, ondulado, a la altura del mentón, con un remolino en la coronilla que le levanta un mechón.
Expresión: boca un poco abierta de asombro y cejas levantadas.
Ropa: un suéter tejido color mostaza, grande y holgado, con el cuello enrollado y un parche cosido en el hombro; la correa de un morral.
Silueta: pequeña; el suéter le queda ancho y caído en los hombros.
Luz: suave y difusa, de día nublado.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, verde pistacho apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes de aviador sobre la cabeza, gorras, sombreros ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```

#### `caras/aprendiz-4.png` — Aprendiz 4

```
Retrato — aprendiz recién llegada. De la imagen adjunta toma SOLO el estilo de dibujo; no copies nada de la criatura ni del fondo.
Estilo: línea de tinta dibujada a mano, sombreado plano en dos tonos, paleta limitada y textura de papel. Sin brillo plástico, sin contraluz, sin ojos brillantes.
Formato: cuadrado, 1024×1024.
Concepto: una chica de unos 16 años que acaba de llegar a las Tierras Quietas para aprender a jugar a las cartas. Segura de sí misma y estratega: siempre piensa la jugada siguiente.
Cara: piel muy clara con pecas suaves, cara alargada y mentón firme.
Ojos: alargados, azul grisáceo, con la mirada de reojo, calculadora; una ceja levantada.
Pelo: rubio ceniza muy claro, lacio, hasta los hombros, con raya al lado y un pasador de madera.
Expresión: media sonrisa astuta, con los labios cerrados.
Ropa: una capa de viaje azul petróleo con la capucha bajada, cerrada con un broche redondo de bronce; debajo, una camisa de lino crema.
Silueta: la capa ancha sobre los hombros y el cuello largo.
Luz: lateral de atardecer, desde la izquierda.
Encuadre: retrato de busto (cabeza y hombros), en vista de tres cuartos con la cara girada hacia la izquierda de la imagen. Cara centrada a lo ancho; los ojos a un 40 % de la altura, contando desde arriba; margen libre sobre la cabeza; los hombros los corta el borde de abajo.
Fondo: liso, de un solo color, rosa viejo apagado; sin degradado, sin objetos.
Manos: fuera del cuadro.
No dibujes: lentes de aviador sobre la cabeza, gorras, sombreros ni pelo en punta.
Sin texto, letras, números, logos ni marcos en la imagen. Diseño original, que no se parezca a ninguna franquicia existente.
```
