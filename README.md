# Prepartido3RFEF ⚽🟨🟥

Herramienta **local, privada y personal** para preparar partidos como árbitro de
**Tercera Federación · Grupo 14 (Extremadura)**.

No es una app pública ni de resultados en directo. Sirve para preparar tus
partidos: equipos, plantillas, cuerpo técnico, tarjetas, goles, estilo de juego,
notas propias y, sobre todo, generar un **briefing arbitral** exportable a PDF.

> ⚠️ Los datos incluidos son **ficticios** (de prueba). Nombres de jugadores y
> cuerpo técnico inventados; estadísticas no reales. Sirven solo para probar la app.

---

## ✨ Funcionalidades (MVP 1)

- **Panel** con próximo partido, máximos goleadores, más amonestados, más rojas,
  equipos con más tarjetas, equipos con mayor riesgo arbitral y últimas notas.
- **Equipos**: tarjetas visuales con filtros (nombre, riesgo, protesta, localidad,
  clasificación) y ficha completa (plantilla, cuerpo técnico, estilo, notas,
  historial de partidos, editar equipo, añadir notas).
- **Jugadores**: tabla con filtros y ordenaciones (goles, amarillas, rojas, riesgo,
  edad) y ficha individual.
- **Preparar partido** → **Briefing arbitral** con:
  portada, comparativa rápida, jugadores clave, cuerpo técnico, estilo de juego,
  **alertas arbitrales automáticas**, instrucciones para asistentes y **exportar a PDF**.
- **Importador CSV/Excel** (equipos, jugadores, cuerpo técnico) que actualiza
  estadísticas **sin borrar tus notas**.
- **Sistema de riesgo arbitral** sencillo, transparente y editable (no predictivo).
- **Login local** básico por contraseña. Todo se guarda en **SQLite local**.
- Capa **`dataProviders`** preparada para conectar **BeSoccer** o **API-Football**
  en el futuro (la app funciona perfectamente sin ninguna API).

---

## 🧱 Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Prisma** + **SQLite** (base de datos local)
- **papaparse** + **xlsx** (importación CSV/Excel)
- Exportación a PDF mediante la impresión del navegador (estilos `@media print`)

---

## 🚀 Instalación y ejecución en local

Requisitos: **Node.js 18.18+** (recomendado 20 o 22) y npm.

```bash
# 1. Instalar dependencias (genera el cliente Prisma automáticamente)
npm install

# 2. Crear el archivo de entorno a partir del ejemplo
cp .env.example .env
#   Edita .env si quieres cambiar la contraseña (APP_PASSWORD).

# 3. Crear la base de datos y cargar los datos ficticios de prueba
npm run setup
#   (equivale a: prisma db push + seed)

# 4. Arrancar en modo desarrollo
npm run dev
```

Abre **http://localhost:3000** e inicia sesión con la contraseña de `APP_PASSWORD`
(por defecto: `arbitro`).

### Para producción local

```bash
npm run build
npm start
```

### Scripts útiles

| Script            | Qué hace                                              |
|-------------------|-------------------------------------------------------|
| `npm run dev`     | Servidor de desarrollo                                |
| `npm run build`   | Build de producción                                   |
| `npm start`       | Arranca el build de producción                        |
| `npm run setup`   | Crea la BD y siembra datos ficticios                  |
| `npm run db:seed` | Vuelve a sembrar los datos ficticios                  |
| `npm run db:reset`| Borra la BD y la recrea con datos de prueba           |

---

## ⚙️ Configuración (`.env`)

```env
DATABASE_URL="file:./dev.db"     # base de datos local
APP_PASSWORD="arbitro"           # contraseña de acceso
AUTH_SECRET="..."                # secreto para firmar la sesión
ACTIVE_DATA_PROVIDER=manual      # manual | csv | besoccer | apifootball
BESOCCER_API_KEY=                # (opcional) clave BeSoccer
API_FOOTBALL_KEY=                # (opcional) clave API-Football
```

La app funciona **sin ninguna API**. Si no hay clave, la pantalla de Ajustes
muestra *"API no configurada"*.

---

## 📥 Importar datos (no metas todo a mano cada semana)

1. Ve a **Importar datos**.
2. Elige el tipo (Equipos / Jugadores / Cuerpo técnico) y **descarga la plantilla**.
3. Rellena el CSV/Excel y súbelo.
4. Previsualiza (se detectan duplicados: *nuevo* vs *actualizar*).
5. Importa.

**Importante:** al importar se actualizan goles, tarjetas y demás estadísticas,
pero **tus notas propias se conservan siempre** (las notas arbitrales viven en una
tabla aparte y nunca se tocan; los campos de texto solo se sobrescriben si la
celda viene rellena).

---

## 🧠 Sistema de riesgo arbitral

Lógica **sencilla y editable** en `src/lib/risk.ts`. **No predice** nada: solo
ayuda a priorizar a qué prestar atención. Si fijas un riesgo manualmente en la
ficha, ese valor manda sobre el calculado.

---

## 🔌 Integración futura con APIs

La carpeta `src/dataProviders/` define un contrato común (`DataProvider`) con:
`getTeams`, `getPlayers`, `getPlayerStats`, `getTeamStats`, `getStandings`,
`getTopScorers`, `getTopCards`, `syncCompetition`.

Proveedores incluidos:
- `ManualDataProvider` — lee de la base de datos local (siempre disponible).
- `CsvDataProvider` — datos importados desde CSV/Excel.
- `BeSoccerProvider` — **preparado**, no conectado (necesita clave).
- `ApiFootballProvider` — **preparado**, no conectado (necesita clave).

No se hace scraping ni accesos no autorizados.

---

## 🔒 Privacidad

- Todo se guarda en **local** (SQLite, archivo `prisma/dev.db`, no versionado).
- No se envía nada a terceros salvo que **tú** configures una API.
- Cada equipo/jugador/técnico indica su **origen**: manual, importado o API.

---

## 🗂️ Estructura del proyecto

```
prisma/
  schema.prisma        # modelo de datos
  seed.ts              # datos ficticios de prueba
src/
  app/                 # rutas (App Router)
    (app)/             # app protegida (panel, equipos, jugadores, partido, ...)
    login/             # acceso
    api/               # endpoints (auth, notes, import, match, providers, teams)
  components/          # TeamCard, PlayerCard, MatchBriefing, ImportWizard, ...
  dataProviders/       # capa de proveedores (manual, csv, besoccer, apifootball)
  lib/                 # prisma, auth, risk, briefing, import, format, enums
```

---

## 🛠️ Próximos pasos (más allá del MVP)

- Conectar realmente BeSoccer / API-Football mapeando sus respuestas.
- Edición de jugadores y cuerpo técnico desde la interfaz.
- Histórico de partidos arbitrados con informe postpartido.
