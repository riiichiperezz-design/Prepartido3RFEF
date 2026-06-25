import type { ImportType } from "./import";

/**
 * Definición de las columnas de cada plantilla de importación y una fila de
 * ejemplo. Se usa tanto para generar el CSV de muestra como para mostrar la
 * cabecera esperada en la pantalla de importación.
 */
export const TEMPLATES: Record<
  ImportType,
  { columns: string[]; example: Record<string, string> }
> = {
  teams: {
    columns: [
      "nombre", "nombre_corto", "localidad", "estadio", "escudo_url", "posicion",
      "puntos", "goles_favor", "goles_contra", "amarillas", "rojas",
      "nivel_protesta", "nivel_fisico", "estilo_juego",
    ],
    example: {
      nombre: "CD Ejemplo",
      nombre_corto: "Ejemplo",
      localidad: "Mérida",
      estadio: "Estadio Municipal",
      escudo_url: "https://ejemplo.com/escudo.png",
      posicion: "7",
      puntos: "32",
      goles_favor: "30",
      goles_contra: "25",
      amarillas: "40",
      rojas: "2",
      nivel_protesta: "MEDIO",
      nivel_fisico: "ALTO",
      estilo_juego: "Equipo directo que presiona alto",
    },
  },
  players: {
    columns: [
      "equipo", "nombre", "dorsal", "edad", "posicion", "pie", "partidos",
      "minutos", "goles", "asistencias", "amarillas", "rojas",
      "amarillas_temp_anterior", "rojas_temp_anterior", "etiquetas", "foto_url", "notas",
    ],
    example: {
      equipo: "CD Ejemplo",
      nombre: "Juan Pérez",
      foto_url: "",
      dorsal: "10",
      edad: "27",
      posicion: "AM",
      pie: "R",
      partidos: "20",
      minutos: "1700",
      goles: "8",
      asistencias: "5",
      amarillas: "6",
      rojas: "1",
      amarillas_temp_anterior: "7",
      rojas_temp_anterior: "0",
      etiquetas: "protestón,reincidente",
      notas: "Lanza todas las faltas, vigilar protestas",
    },
  },
  staff: {
    columns: [
      "equipo", "nombre", "rol", "equipos_anteriores", "amarillas", "rojas",
      "nivel_protesta", "notas",
    ],
    example: {
      equipo: "CD Ejemplo",
      nombre: "Antonio López",
      rol: "Entrenador",
      equipos_anteriores: "CD Otro, UD Tercero",
      amarillas: "1",
      rojas: "0",
      nivel_protesta: "ALTO",
      notas: "Muy vehemente en la banda",
    },
  },
};

/** Genera el contenido CSV de la plantilla (cabecera + fila de ejemplo). */
export function templateCsv(type: ImportType): string {
  const { columns, example } = TEMPLATES[type];
  const header = columns.join(",");
  const row = columns
    .map((c) => {
      const v = example[c] ?? "";
      return v.includes(",") ? `"${v}"` : v;
    })
    .join(",");
  return `${header}\n${row}\n`;
}
