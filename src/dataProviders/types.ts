/**
 * Contrato común para todos los proveedores de datos.
 *
 * La idea: la app no sabe (ni le importa) de dónde vienen los datos. Puede ser
 * edición manual, un CSV/Excel importado o una API externa (BeSoccer,
 * API-Football...). Todos implementan esta misma interfaz, así que conectar una
 * API en el futuro no obliga a tocar la interfaz de la aplicación.
 */

export interface ProviderTeam {
  externalId?: string;
  name: string;
  shortName?: string;
  crestUrl?: string;
  city?: string;
  stadium?: string;
  currentPosition?: number;
  points?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  yellowCards?: number;
  redCards?: number;
}

export interface ProviderPlayer {
  externalId?: string;
  teamExternalId?: string;
  name: string;
  dorsal?: number;
  age?: number;
  position?: string;
  matches?: number;
  minutes?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
}

export interface ProviderStats {
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  matches?: number;
  minutes?: number;
}

export interface StandingRow {
  position: number;
  teamName: string;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface ScorerRow {
  playerName: string;
  teamName: string;
  goals: number;
}

export interface CardRow {
  name: string;
  teamName: string;
  yellowCards: number;
  redCards: number;
}

export interface SyncResult {
  ok: boolean;
  message: string;
  teams?: number;
  players?: number;
}

/**
 * Interfaz que TODO proveedor debe cumplir. Las funciones marcadas como
 * "preparadas" devuelven datos o lanzan un error claro si la fuente no está
 * configurada (por ejemplo, una API sin clave).
 */
export interface DataProvider {
  readonly id: string;
  readonly label: string;
  /** ¿Está lista para usarse? (p.ej. la API tiene clave configurada) */
  isConfigured(): boolean;

  getTeams(): Promise<ProviderTeam[]>;
  getPlayers(teamId: string): Promise<ProviderPlayer[]>;
  getPlayerStats(playerId: string): Promise<ProviderStats>;
  getTeamStats(teamId: string): Promise<ProviderStats>;
  getStandings(): Promise<StandingRow[]>;
  getTopScorers(): Promise<ScorerRow[]>;
  getTopCards(): Promise<CardRow[]>;
  syncCompetition(): Promise<SyncResult>;
}

/** Error estándar cuando una fuente externa no está configurada. */
export class ProviderNotConfiguredError extends Error {
  constructor(provider: string) {
    super(`API no configurada: ${provider}. Añade la clave en el archivo .env.`);
    this.name = "ProviderNotConfiguredError";
  }
}
