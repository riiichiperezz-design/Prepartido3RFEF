# Entrada BORJITA DELUXE PRODUCCIONES — generador de PNG

Página web de una sola pieza (`index.html`) para que cada invitado escriba su
nombre y, al pulsar **Confirmar asistencia y descargar**, se genere y descargue
su **entrada personalizada en PNG de alta resolución** (2000 × 2828 px), con el
mismo formato, colores y ubicación de todos los elementos del diseño de
referencia, cambiando solo el nombre del invitado.

- El **nombre** que aparece en la entrada es el que se escribe en el formulario.
- El **QR**, al escanearlo, muestra el mensaje:
  **«¡TOCA Y VETE CACAHUETE EN LA FIESTA DE CAÑETE!»** (probado y verificado).
- Cada entrada lleva un **código único** generado a partir del nombre.

## Cómo usarla

- **Rápido:** abre `index.html` haciendo doble clic (cualquier navegador).
- **Publicarla:** sube la carpeta `invitacion/` a cualquier hosting estático
  (GitHub Pages, Netlify, Vercel, Cloudflare Pages…). No necesita servidor ni build.

Es autónoma: incluye el generador de QR embebido. Solo carga las tipografías
(Anton + Oswald) desde Google Fonts cuando hay conexión.

## Personalizar

Todo el texto está en el bloque `CONFIG` al principio del `<script>` de la app,
dentro de `index.html`: fecha, sitio, promo, descripción, correo, footer y el
mensaje del `qrData`. El diseño y la posición de cada elemento se mantienen
aunque cambies los textos; el nombre se ajusta de tamaño solo si es muy largo.

## Nota sobre la marca

El diseño de referencia era una entrada de la plataforma **NYXELL**. Para no
reproducir la marca de otra empresa, el logo y el texto legal inferiores se han
sustituido por los de **Borjita Deluxe Producciones**. El resto (maquetación,
colores y campos) reproduce fielmente el original.

`ejemplo-invitacion.pdf` es solo una muestra del resultado; la web descarga PNG.
