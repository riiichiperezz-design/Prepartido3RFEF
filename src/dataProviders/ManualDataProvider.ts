import { prisma } from "@/lib/prisma";
import type {
  DataProvider,
  ProviderTeam,
  ProviderPlayer,
  ProviderStats,
  StandingRow,
  ScorerRow,
  CardRow,
  SyncResult,
} from "./types";

/**
 * Proveedor por defecto: lee directamente de la base de datos local (los datos
 * que tú metes a mano o importas). Siempre está disponible y no depende de red.
 */
export class ManualDataProvider implements DataProvider {
  readonly id: string = "manual";
  readonly label: string = "Datos manuales";

  isConfigured(): boolean {
    return true;
  }

  async getTeams(): Promise<ProviderTeam[]> {
    const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });
    return teams.map((t) => ({
      externalId: t.id,
      name: t.name,
      shortName: t.shortName ?? undefined,
      crestUrl: t.crestUrl ?? undefined,
      city: t.city ?? undefined,
      stadium: t.stadium ?? undefined,
      currentPosition: t.currentPosition ?? undefined,
      points: t.points ?? undefined,
      goalsFor: t.goalsFor,
      goalsAgainst: t.goalsAgainst,
      yellowCards: t.yellowCards,
      redCards: t.redCards,
    }));
  }

  async getPlayers(teamId: string): Promise<ProviderPlayer[]> {
    const players = await prisma.player.findMany({ where: { teamId } });
    return players.map((p) => ({
      externalId: p.id,
      teamExternalId: p.teamId,
      name: p.name,
      dorsal: p.dorsal ?? undefined,
      age: p.age ?? undefined,
      position: p.position ?? undefined,
      matches: p.matches,
      minutes: p.minutes,
      goals: p.goals,
      assists: p.assists,
      yellowCards: p.yellowCards,
      redCards: p.redCards,
    }));
  }

  async getPlayerStats(playerId: string): Promise<ProviderStats> {
    const p = await prisma.player.findUnique({ where: { id: playerId } });
    if (!p) return {};
    return {
      goals: p.goals,
      assists: p.assists,
      yellowCards: p.yellowCards,
      redCards: p.redCards,
      matches: p.matches,
      minutes: p.minutes,
    };
  }

  async getTeamStats(teamId: string): Promise<ProviderStats> {
    const t = await prisma.team.findUnique({ where: { id: teamId } });
    if (!t) return {};
    return {
      goals: t.goalsFor,
      yellowCards: t.yellowCards,
      redCards: t.redCards,
    };
  }

  async getStandings(): Promise<StandingRow[]> {
    const teams = await prisma.team.findMany({
      orderBy: [{ points: "desc" }, { goalsFor: "desc" }],
    });
    return teams.map((t, i) => ({
      position: t.currentPosition ?? i + 1,
      teamName: t.name,
      points: t.points ?? 0,
      goalsFor: t.goalsFor,
      goalsAgainst: t.goalsAgainst,
    }));
  }

  async getTopScorers(): Promise<ScorerRow[]> {
    const players = await prisma.player.findMany({
      where: { goals: { gt: 0 } },
      orderBy: { goals: "desc" },
      take: 20,
      include: { team: true },
    });
    return players.map((p) => ({
      playerName: p.name,
      teamName: p.team.name,
      goals: p.goals,
    }));
  }

  async getTopCards(): Promise<CardRow[]> {
    const players = await prisma.player.findMany({
      where: { yellowCards: { gt: 0 } },
      orderBy: [{ yellowCards: "desc" }, { redCards: "desc" }],
      take: 20,
      include: { team: true },
    });
    return players.map((p) => ({
      name: p.name,
      teamName: p.team.name,
      yellowCards: p.yellowCards,
      redCards: p.redCards,
    }));
  }

  async syncCompetition(): Promise<SyncResult> {
    const teams = await prisma.team.count();
    const players = await prisma.player.count();
    return {
      ok: true,
      message: "Datos manuales: no hay sincronización externa.",
      teams,
      players,
    };
  }
}
