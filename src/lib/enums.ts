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

export const DATA_PROVIDERS = ["manual", "csv", "besoccer", "apifootball"] as const;
export type DataProviderId = (typeof DATA_PROVIDERS)[number];

export const DATA_PROVIDER_LABELS: Record<DataProviderId, string> = {
  manual: "Datos manuales",
  csv: "Datos CSV/Excel",
  besoccer: "BeSoccer API",
  apifootball: "API-Football",
};
