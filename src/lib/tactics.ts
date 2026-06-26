/**
 * Modelo de datos y geometría del campo táctico (pizarra arbitral).
 *
 * Coordenadas NORMALIZADAS: x (0-100) de izquierda a derecha del ancho del
 * campo; y (0-100) a lo largo del campo (0 = portería propia, 100 = portería
 * rival). Así el estado es independiente de la orientación (vertical/horizontal)
 * con la que se dibuje.
 */

export type Orientation = "vertical" | "horizontal";

export type FormationKey = "4-4-2" | "4-2-3-1" | "4-3-3" | "5-3-2" | "3-5-2" | "CUSTOM";

export const FORMATIONS: FormationKey[] = ["4-4-2", "4-2-3-1", "4-3-3", "5-3-2", "3-5-2", "CUSTOM"];

export interface FieldPlayer {
  id: string;
  x: number;
  y: number;
  role: string;
  label: string; // nombre corto o etiqueta
  dorsal?: number;
  playerId?: string; // jugador real asociado
}

export type ArrowKind = "attack" | "press" | "run" | "long" | "defense" | "conflict";
export type ZoneKind = "press" | "attack" | "offside" | "duel" | "protest" | "referee";
export type MarkerKind = "ball" | "whistle" | "card" | "assistant" | "referee" | "alert" | "bench";

export interface FieldArrow {
  id: string;
  kind: ArrowKind;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface FieldZone {
  id: string;
  kind: ZoneKind;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FieldMarker {
  id: string;
  kind: MarkerKind;
  x: number;
  y: number;
  label?: string;
}

export interface FieldText {
  id: string;
  x: number;
  y: number;
  text: string;
}

export interface BoardState {
  orientation: Orientation;
  formation: FormationKey;
  players: FieldPlayer[];
  arrows: FieldArrow[];
  zones: FieldZone[];
  markers: FieldMarker[];
  texts: FieldText[];
}

export function emptyBoard(orientation: Orientation = "vertical"): BoardState {
  return { orientation, formation: "4-4-2", players: [], arrows: [], zones: [], markers: [], texts: [] };
}

// --- Metadatos visuales (etiquetas y colores sobrios) ---

export const ARROW_KINDS: Record<ArrowKind, { label: string; color: string; dashed?: boolean }> = {
  attack: { label: "Ataque por banda", color: "#1d4ed8" },
  press: { label: "Presión alta", color: "#b45309", dashed: true },
  run: { label: "Desmarque", color: "#15803d", dashed: true },
  long: { label: "Balón largo", color: "#7c3aed" },
  defense: { label: "Repliegue defensivo", color: "#334155", dashed: true },
  conflict: { label: "Zona de conflicto", color: "#991b1b" },
};

export const ZONE_KINDS: Record<ZoneKind, { label: string; color: string }> = {
  press: { label: "Zona de presión", color: "#b45309" },
  attack: { label: "Carga de ataques", color: "#1d4ed8" },
  offside: { label: "Fuera de juego", color: "#7c3aed" },
  duel: { label: "Zona de duelos", color: "#334155" },
  protest: { label: "Protestas habituales", color: "#991b1b" },
  referee: { label: "Vigilancia del árbitro", color: "#15803d" },
};

export const MARKER_KINDS: Record<MarkerKind, { label: string }> = {
  ball: { label: "Balón" },
  whistle: { label: "Silbato" },
  card: { label: "Tarjeta" },
  assistant: { label: "Bandera de asistente" },
  referee: { label: "Árbitro" },
  alert: { label: "Zona de alerta" },
  bench: { label: "Banquillo" },
};

// --- Formaciones (posiciones normalizadas, atacando hacia arriba) ---

type Pos = { x: number; y: number; role: string };

const F: Record<Exclude<FormationKey, "CUSTOM">, Pos[]> = {
  "4-4-2": [
    { x: 50, y: 7, role: "GK" },
    { x: 18, y: 25, role: "FB" }, { x: 38, y: 21, role: "CB" }, { x: 62, y: 21, role: "CB" }, { x: 82, y: 25, role: "FB" },
    { x: 18, y: 52, role: "WINGER" }, { x: 39, y: 49, role: "CM" }, { x: 61, y: 49, role: "CM" }, { x: 82, y: 52, role: "WINGER" },
    { x: 41, y: 78, role: "ST" }, { x: 59, y: 78, role: "ST" },
  ],
  "4-2-3-1": [
    { x: 50, y: 7, role: "GK" },
    { x: 18, y: 25, role: "FB" }, { x: 38, y: 21, role: "CB" }, { x: 62, y: 21, role: "CB" }, { x: 82, y: 25, role: "FB" },
    { x: 39, y: 42, role: "DM" }, { x: 61, y: 42, role: "DM" },
    { x: 22, y: 62, role: "WINGER" }, { x: 50, y: 60, role: "AM" }, { x: 78, y: 62, role: "WINGER" },
    { x: 50, y: 82, role: "ST" },
  ],
  "4-3-3": [
    { x: 50, y: 7, role: "GK" },
    { x: 18, y: 25, role: "FB" }, { x: 38, y: 21, role: "CB" }, { x: 62, y: 21, role: "CB" }, { x: 82, y: 25, role: "FB" },
    { x: 34, y: 47, role: "CM" }, { x: 50, y: 42, role: "DM" }, { x: 66, y: 47, role: "CM" },
    { x: 20, y: 72, role: "WINGER" }, { x: 50, y: 80, role: "ST" }, { x: 80, y: 72, role: "WINGER" },
  ],
  "5-3-2": [
    { x: 50, y: 7, role: "GK" },
    { x: 12, y: 30, role: "FB" }, { x: 32, y: 22, role: "CB" }, { x: 50, y: 20, role: "CB" }, { x: 68, y: 22, role: "CB" }, { x: 88, y: 30, role: "FB" },
    { x: 30, y: 52, role: "CM" }, { x: 50, y: 49, role: "CM" }, { x: 70, y: 52, role: "CM" },
    { x: 41, y: 78, role: "ST" }, { x: 59, y: 78, role: "ST" },
  ],
  "3-5-2": [
    { x: 50, y: 7, role: "GK" },
    { x: 30, y: 22, role: "CB" }, { x: 50, y: 20, role: "CB" }, { x: 70, y: 22, role: "CB" },
    { x: 12, y: 50, role: "WINGER" }, { x: 35, y: 47, role: "CM" }, { x: 50, y: 45, role: "CM" }, { x: 65, y: 47, role: "CM" }, { x: 88, y: 50, role: "WINGER" },
    { x: 41, y: 78, role: "ST" }, { x: 59, y: 78, role: "ST" },
  ],
};

/** Genera los 11 jugadores de una formación (sin asociar a jugadores reales). */
export function buildFormation(formation: FormationKey): FieldPlayer[] {
  const base = formation === "CUSTOM" ? F["4-4-2"] : F[formation];
  return base.map((p, i) => ({
    id: `p${i}`,
    x: p.x,
    y: p.y,
    role: p.role,
    label: p.role,
    dorsal: undefined,
    playerId: undefined,
  }));
}

// --- Geometría del campo en metros (campo 68 x 105) ---
// El espacio canónico es uniforme: 10 unidades por metro.

export const FIELD_W_M = 68;
export const FIELD_L_M = 105;
const U = 10; // unidades por metro

/** viewBox del SVG según orientación. */
export function viewBox(orientation: Orientation): string {
  return orientation === "vertical"
    ? `0 0 ${FIELD_W_M * U} ${FIELD_L_M * U}`
    : `0 0 ${FIELD_L_M * U} ${FIELD_W_M * U}`;
}

/** Convierte un punto en METROS (mx a lo ancho 0..68, my a lo largo 0..105) a coords SVG. */
export function meterToSvg(mx: number, my: number, orientation: Orientation): [number, number] {
  if (orientation === "vertical") {
    return [mx * U, (FIELD_L_M - my) * U]; // y=105 (rival) arriba
  }
  return [my * U, mx * U]; // horizontal: el largo va en X
}

/** Convierte un punto NORMALIZADO (0..100) a coords SVG. */
export function normToSvg(nx: number, ny: number, orientation: Orientation): [number, number] {
  return meterToSvg((nx / 100) * FIELD_W_M, (ny / 100) * FIELD_L_M, orientation);
}

/** Inversa: coords SVG (espacio del viewBox) a NORMALIZADO (0..100), recortado. */
export function svgToNorm(sx: number, sy: number, orientation: Orientation): [number, number] {
  let nx: number, ny: number;
  if (orientation === "vertical") {
    nx = (sx / (FIELD_W_M * U)) * 100;
    ny = 100 - (sy / (FIELD_L_M * U)) * 100;
  } else {
    ny = (sx / (FIELD_L_M * U)) * 100;
    nx = (sy / (FIELD_W_M * U)) * 100;
  }
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  return [clamp(nx), clamp(ny)];
}

/** Parsea de forma segura el JSON de una pizarra; devuelve null si no es válido. */
export function parseBoard(fieldData: string | null | undefined): BoardState | null {
  if (!fieldData) return null;
  try {
    const b = JSON.parse(fieldData) as Partial<BoardState>;
    if (!b || !Array.isArray(b.players)) return null;
    return {
      orientation: b.orientation === "horizontal" ? "horizontal" : "vertical",
      formation: (b.formation as FormationKey) ?? "4-4-2",
      players: b.players,
      arrows: b.arrows ?? [],
      zones: b.zones ?? [],
      markers: b.markers ?? [],
      texts: b.texts ?? [],
    };
  } catch {
    return null;
  }
}

let idCounter = 0;
/** Identificador corto para elementos nuevos de la pizarra. */
export function newId(prefix = "e"): string {
  idCounter += 1;
  return `${prefix}${Date.now().toString(36)}${idCounter}`;
}
