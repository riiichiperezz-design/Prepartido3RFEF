import {
  DataProvider,
  ProviderTeam,
  ProviderPlayer,
  ProviderStats,
  StandingRow,
  ScorerRow,
  CardRow,
  SyncResult,
  ProviderNotConfiguredError,
} from "./types";

/**
 * Proveedor API-Football (https://www.api-football.com/).
 *
 * NOTA: está PREPARADO pero NO conectado. No se realizan llamadas reales si no
 * hay clave. Cuando configures API_FOOTBALL_KEY en .env, aquí es donde irían
 * las peticiones `fetch` reales mapeando la respuesta a nuestros tipos.
 *
 * No se incluye scraping ni acceso no autorizado: solo la API oficial con tu
 * propia clave y bajo tu responsabilidad/plan.
 */
export class ApiFootballProvider implements DataProvider {
  readonly id = "apifootball";
  readonly label = "API-Football";
  private readonly baseUrl = "https://v3.football.api-sports.io";

  private get apiKey(): string | undefined {
    return process.env.API_FOOTBALL_KEY || undefined;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  private ensureConfigured(): void {
    if (!this.isConfigured()) throw new ProviderNotConfiguredError(this.label);
  }

  /** Ayudante de petición ya preparado (cabecera de autenticación incluida). */
  private async request<T>(path: string): Promise<T> {
    this.ensureConfigured();
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: { "x-apisports-key": this.apiKey as string },
    });
    if (!res.ok) {
      throw new Error(`API-Football respondió ${res.status} en ${path}`);
    }
    return (await res.json()) as T;
  }

  // Las funciones quedan preparadas. Mientras no haya implementación de mapeo
  // real, lanzan un error claro para no devolver datos inventados.
  async getTeams(): Promise<ProviderTeam[]> {
    this.ensureConfigured();
    throw new Error("API-Football: mapeo de equipos pendiente de implementar.");
  }
  async getPlayers(_teamId: string): Promise<ProviderPlayer[]> {
    this.ensureConfigured();
    throw new Error("API-Football: mapeo de jugadores pendiente de implementar.");
  }
  async getPlayerStats(_playerId: string): Promise<ProviderStats> {
    this.ensureConfigured();
    throw new Error("API-Football: mapeo de estadísticas pendiente de implementar.");
  }
  async getTeamStats(_teamId: string): Promise<ProviderStats> {
    this.ensureConfigured();
    throw new Error("API-Football: mapeo de estadísticas de equipo pendiente.");
  }
  async getStandings(): Promise<StandingRow[]> {
    this.ensureConfigured();
    throw new Error("API-Football: clasificación pendiente de implementar.");
  }
  async getTopScorers(): Promise<ScorerRow[]> {
    this.ensureConfigured();
    throw new Error("API-Football: máximos goleadores pendiente de implementar.");
  }
  async getTopCards(): Promise<CardRow[]> {
    this.ensureConfigured();
    throw new Error("API-Football: tarjetas pendiente de implementar.");
  }
  async syncCompetition(): Promise<SyncResult> {
    if (!this.isConfigured()) {
      return { ok: false, message: "API no configurada (falta API_FOOTBALL_KEY)." };
    }
    return { ok: false, message: "Sincronización con API-Football pendiente de implementar." };
  }
}
