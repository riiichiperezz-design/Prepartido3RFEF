/**
 * Fuente única de verdad para los valores tipo "enum".
 * Como SQLite (vía Prisma) no soporta enums nativos, se almacenan como String
 * y aquí definimos los valores válidos y sus etiquetas en castellano.
 */

export const RISK_LEVELS = ["LOW", "MEDIUM", "HIGH"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const RISK_LABELS: Record<RiskLevel, string> = {
  LOW: "Bajo",
  MEDIUM: "Medio",
  HIGH: "Alto",
};

export const PROTEST_LABELS: Record<RiskLevel, string> = {
  LOW: "Tranquilo",
  MEDIUM: "Protesta a veces",
  HIGH: "Muy protestón",
};

export const PHYSICAL_LABELS: Record<RiskLevel, string> = {
  LOW: "Suave",
  MEDIUM: "Normal",
  HIGH: "Muy físico",
};

export const POSITIONS = [
  "GK",
  "CB",
  "FB",
  "DM",
  "CM",
  "AM",
  "WINGER",
  "ST",
] as const;
export type Position = (typeof POSITIONS)[number];

export const POSITION_LABELS: Record<Position, string> = {
  GK: "Portero",
  CB: "Central",
  FB: "Lateral",
  DM: "Mediocentro defensivo",
  CM: "Centrocampista",
  AM: "Mediapunta",
  WINGER: "Extremo",
  ST: "Delantero",
};

export const FOOT_LABELS: Record<string, string> = {
  L: "Zurdo",
  R: "Diestro",
  BOTH: "Ambidiestro",
};

export const NOTE_TYPES = [
  "TACTICAL",
  "DISCIPLINARY",
  "PROTEST",
  "BENCH",
  "ASSISTANT",
  "SET_PIECE",
  "AREA",
  "BEHAVIOUR",
  "OTHER",
] as const;
export type NoteType = (typeof NOTE_TYPES)[number];

export const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  TACTICAL: "Táctica",
  DISCIPLINARY: "Disciplina",
  PROTEST: "Protestas",
  BENCH: "Banquillo",
  ASSISTANT: "Asistentes",
  SET_PIECE: "Balón parado",
  AREA: "Áreas",
  BEHAVIOUR: "Comportamiento",
  OTHER: "Otros",
};

export const ENTITY_TYPES = ["TEAM", "PLAYER", "STAFF", "MATCH"] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export const MATCH_STATUS = ["PENDING", "PREPARED", "REFEREED"] as const;
export type MatchStatus = (typeof MATCH_STATUS)[number];

export const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  PENDING: "Pendiente",
  PREPARED: "Preparado",
  REFEREED: "Arbitrado",
};

export const DATA_ORIGIN_LABELS: Record<string, string> = {
  MANUAL: "Manual",
  CSV: "Importado (CSV/Excel)",
  API: "API externa",
};

export const SITUATION_TYPES = [
  "HIGH_PRESS", "BUILD_UP", "ATTACK_RIGHT", "ATTACK_LEFT", "SET_PIECE_OFF",
  "SET_PIECE_DEF", "CORNER", "WIDE_FREE_KICK", "DIRECT_FREE_KICK",
  "TRANSITION_OFF", "TRANSITION_DEF", "OFFSIDE", "AREA", "BENCH",
  "PROTEST", "PLAYER_WATCH", "REFEREE_POSITION", "ASSISTANTS", "OTHER",
] as const;
export type SituationType = (typeof SITUATION_TYPES)[number];

export const SITUATION_TYPE_LABELS: Record<SituationType, string> = {
  HIGH_PRESS: "Presión alta",
  BUILD_UP: "Salida de balón",
  ATTACK_RIGHT: "Ataque por banda derecha",
  ATTACK_LEFT: "Ataque por banda izquierda",
  SET_PIECE_OFF: "Balón parado ofensivo",
  SET_PIECE_DEF: "Balón parado defensivo",
  CORNER: "Córner",
  WIDE_FREE_KICK: "Falta lateral",
  DIRECT_FREE_KICK: "Tiro libre directo",
  TRANSITION_OFF: "Transición ofensiva",
  TRANSITION_DEF: "Transición defensiva",
  OFFSIDE: "Fuera de juego",
  AREA: "Situación de área",
  BENCH: "Gestión de banquillos",
  PROTEST: "Zona de protestas",
  PLAYER_WATCH: "Vigilancia de jugador",
  REFEREE_POSITION: "Posicionamiento arbitral",
  ASSISTANTS: "Instrucciones para asistentes",
  OTHER: "Otra",
};

export const NOTE_SOURCES = ["SELF", "VIDEO", "EXTERNAL", "INTUITION", "PREVIOUS_REPORT"] as const;
export type NoteSource = (typeof NOTE_SOURCES)[number];

export const NOTE_SOURCE_LABELS: Record<NoteSource, string> = {
  SELF: "Observado por mí",
  VIDEO: "Visto en vídeo",
  EXTERNAL: "Dato externo",
  INTUITION: "Intuición",
  PREVIOUS_REPORT: "Informe anterior",
};

export const DATA_PROVIDERS = ["manual", "csv", "besoccer", "apifootball"] as const;
export type DataProviderId = (typeof DATA_PROVIDERS)[number];

export const DATA_PROVIDER_LABELS: Record<DataProviderId, string> = {
  manual: "Datos manuales",
  csv: "Datos CSV/Excel",
  besoccer: "BeSoccer API",
  apifootball: "API-Football",
};
