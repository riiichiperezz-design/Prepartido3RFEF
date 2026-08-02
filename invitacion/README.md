# Invitación BORJA DELUXE — generador de PNG

Página web de una sola pieza (`index.html`) para que cada invitado escriba su
nombre y, al pulsar **Confirmar asistencia y descargar**, se genere y descargue
su invitación personalizada en **PNG de alta resolución** (2000 × 2880 px),
respetando exactamente el diseño dorado original: mismo formato, mismos colores
y misma ubicación de todos los elementos, cambiando solo el nombre del invitado.

## Cómo usarla

- **Rápido:** abre `index.html` haciendo doble clic (funciona en cualquier navegador).
- **Publicarla en internet:** sube la carpeta `invitacion/` a cualquier hosting
  estático (GitHub Pages, Netlify, Vercel, Cloudflare Pages…). No necesita
  servidor, base de datos ni build.

Es autónoma: incluye el generador de QR embebido. Solo carga las tipografías
(Anton + Oswald) desde Google Fonts cuando hay conexión.

## Personalizar el evento

Todo el texto está en el bloque `CONFIG` al principio del `<script>` de la app
dentro de `index.html`. Puedes cambiar en un sitio:

- `titleLine1` / `titleLine2` — el nombre de la fiesta (ej. `BORJITI` / `HOUSE`).
- `dateLine`, `doorsLine`, `activities` — fecha, hora y actividades.
- `extra1`, `extra2` — las dos líneas de detalles.
- `qrData` — el contenido que codifica el QR (por defecto, personalizado con el
  nombre del invitado).

El diseño y la posición de cada elemento se mantienen intactos aunque cambies
los textos; el nombre del invitado se ajusta solo de tamaño si es muy largo.
