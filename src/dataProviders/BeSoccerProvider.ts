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
 * Proveedor BeSoccer API (https://api.besoccer.com/).
 *
 * NOTA: está PREPARADO pero NO conectado. No se realizan llamadas reales si no
 * hay clave. Cuando configures BESOCCER_API_KEY en .env, aquí irían las
 * peticiones reales mapeando la respuesta a nuestros tipos.
 */
export class BeSoccerProvider implements DataProvider {
  readonly id = "besoccer";
  readonly label = "BeSoccer API";
  private readonly baseUrl = "https://api.besoccer.com/scripts/api";

  private get apiKey(): string | undefined {
    return process.env.BESOCCER_API_KEY || undefined;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  private ensureConfigured(): void {
    if (!this.isConfigured()) throw new ProviderNotConfiguredError(this.label);
  }

  /** Ayudante de petición preparado (BeSoccer usa la clave como query param). */
  private async request<T>(path: string, params: Record<string, string> = {}): Promise<T> {
    this.ensureConfigured();
    const qs = new URLSearchParams({ key: this.apiKey as string, format: "json", ...params });
    const res = await fetch(`${this.baseUrl}/${path}?${qs.toString()}`);
    if (!res.ok) throw new Error(`BeSoccer respondió ${res.status} en ${path}`);
    return (await res.json()) as T;
  }

  async getTeams(): Promise<ProviderTeam[]> {
    this.ensureConfigured();
    throw new Error("BeSoccer: mapeo de equipos pendiente de implementar.");
  }
  async getPlayers(_teamId: string): Promise<ProviderPlayer[]> {
    this.ensureConfigured();
    throw new Error("BeSoccer: mapeo de jugadores pendiente de implementar.");
  }
  async getPlayerStats(_playerId: string): Promise<ProviderStats> {
    this.ensureConfigured();
    throw new Error("BeSoccer: estadísticas de jugador pendiente de implementar.");
  }
  async getTeamStats(_teamId: string): Promise<ProviderStats> {
    this.ensureConfigured();
    throw new Error("BeSoccer: estadísticas de equipo pendiente de implementar.");
  }
  async getStandings(): Promise<StandingRow[]> {
    this.ensureConfigured();
    throw new Error("BeSoccer: clasificación pendiente de implementar.");
  }
  async getTopScorers(): Promise<ScorerRow[]> {
    this.ensureConfigured();
    throw new Error("BeSoccer: máximos goleadores pendiente de implementar.");
  }
  async getTopCards(): Promise<CardRow[]> {
    this.ensureConfigured();
    throw new Error("BeSoccer: tarjetas pendiente de implementar.");
  }
  async syncCompetition(): Promise<SyncResult> {
    if (!this.isConfigured()) {
      return { ok: false, message: "API no configurada (falta BESOCCER_API_KEY)." };
    }
    return { ok: false, message: "Sincronización con BeSoccer pendiente de implementar." };
  }
}
