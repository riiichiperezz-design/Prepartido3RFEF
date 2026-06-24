/** Pequeñas utilidades de formato y cálculo reutilizadas en toda la app. */

/** Edad media (redondeada) de una lista de jugadores con campo `age`. */
export function averageAge(players: { age?: number | null }[]): number | null {
  const ages = players.map((p) => p.age).filter((a): a is number => typeof a === "number" && a > 0);
  if (ages.length === 0) return null;
  return Math.round(ages.reduce((s, a) => s + a, 0) / ages.length);
}

/** Diferencia de goles. */
export function goalDiff(gf: number, ga: number): string {
  const d = gf - ga;
  return d > 0 ? `+${d}` : `${d}`;
}

/** Fecha legible en español (ej: "sáb 24 ago 2026"). */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "Sin fecha";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Sin fecha";
  return d.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Iniciales para avatares cuando no hay foto/escudo. */
export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** Convierte etiquetas separadas por comas en array limpio. */
export function parseList(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

/** Convierte un valor de Excel/CSV en número seguro (0 por defecto). */
export function toInt(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;
  const n = parseInt(String(value).replace(/[^0-9-]/g, ""), 10);
  return isNaN(n) ? 0 : n;
}

/** Normaliza nivel de riesgo/protesta/físico desde texto libre. */
export function normalizeLevel(value: unknown): "LOW" | "MEDIUM" | "HIGH" {
  const v = String(value ?? "").trim().toUpperCase();
  if (["HIGH", "ALTO", "ALTA", "H"].includes(v)) return "HIGH";
  if (["MEDIUM", "MEDIO", "MEDIA", "M"].includes(v)) return "MEDIUM";
  return "LOW";
}
