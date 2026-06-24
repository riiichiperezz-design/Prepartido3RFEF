import { prisma } from "./prisma";
import { computePlayerRisk, computeTeamRisk, pickRisk, RISK_ORDER } from "./risk";
import { averageAge } from "./format";
import type { RiskLevel } from "./enums";
import type { Player, Team, StaffMember, RefereeNote } from "@prisma/client";

/**
 * Capa de acceso a datos "enriquecidos": añade a equipos y jugadores el riesgo
 * calculado (respetando el manual), edad media, máximos goleadores, etc.
 * Centralizar esto evita repetir la lógica en cada pantalla.
 */

export interface EnrichedPlayer extends Player {
  computedRisk: RiskLevel;
  riskReasons: string[];
  effectiveRisk: RiskLevel;
}

export interface EnrichedTeam extends Team {
  players: EnrichedPlayer[];
  staff: StaffMember[];
  computedRisk: RiskLevel;
  riskReasons: string[];
  effectiveRisk: RiskLevel;
  avgAge: number | null;
  topScorer: EnrichedPlayer | null;
  briefingNotes: RefereeNote[];
}

function maxStaffRisk(staff: StaffMember[]): RiskLevel {
  let max: RiskLevel = "LOW";
  for (const s of staff) {
    const r = (s.refereeRisk as RiskLevel) ?? "LOW";
    if (RISK_ORDER[r] > RISK_ORDER[max]) max = r;
  }
  return max;
}

export function enrichPlayer(p: Player, hasImportantNote = false): EnrichedPlayer {
  const result = computePlayerRisk({
    yellowCards: p.yellowCards,
    redCards: p.redCards,
    previousSeasonYellowCards: p.previousSeasonYellowCards,
    previousSeasonRedCards: p.previousSeasonRedCards,
    behaviourTags: p.behaviourTags,
    hasImportantNote,
  });
  return {
    ...p,
    computedRisk: result.level,
    riskReasons: result.reasons,
    effectiveRisk: pickRisk(p.refereeRisk, result.level),
  };
}

/** Obtiene un equipo con toda su información enriquecida para la ficha/briefing. */
export async function getEnrichedTeam(teamId: string): Promise<EnrichedTeam | null> {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { players: true, staff: true },
  });
  if (!team) return null;

  const notes = await prisma.refereeNote.findMany({
    where: { entityType: "TEAM", entityId: teamId, showInBriefing: true },
    orderBy: { date: "desc" },
  });
  const hasImportantTeamNote = notes.some((n) => n.importance === "HIGH");

  // Notas por jugador (para subir su riesgo si tienen nota importante)
  const playerNotes = await prisma.refereeNote.findMany({
    where: {
      entityType: "PLAYER",
      entityId: { in: team.players.map((p) => p.id) },
      showInBriefing: true,
      importance: "HIGH",
    },
  });
  const playersWithImportantNote = new Set(playerNotes.map((n) => n.entityId));

  const enrichedPlayers = team.players
    .map((p) => enrichPlayer(p, playersWithImportantNote.has(p.id)))
    .sort((a, b) => (b.dorsal ?? 99) - (a.dorsal ?? 99));

  const teamRisk = computeTeamRisk({
    yellowCards: team.yellowCards,
    redCards: team.redCards,
    protestLevel: team.protestLevel,
    physicalLevel: team.physicalLevel,
    staffMaxRisk: maxStaffRisk(team.staff),
    hasImportantNote: hasImportantTeamNote,
  });

  const topScorer =
    [...enrichedPlayers].sort((a, b) => b.goals - a.goals)[0] ?? null;

  return {
    ...team,
    players: enrichedPlayers,
    staff: team.staff,
    computedRisk: teamRisk.level,
    riskReasons: teamRisk.reasons,
    effectiveRisk: pickRisk(team.refereeRisk, teamRisk.level),
    avgAge: averageAge(team.players),
    topScorer: topScorer && topScorer.goals > 0 ? topScorer : null,
    briefingNotes: notes,
  };
}

/** Lista de todos los equipos enriquecidos (para panel y pantalla de equipos). */
export async function getEnrichedTeams(): Promise<EnrichedTeam[]> {
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });
  const result: EnrichedTeam[] = [];
  for (const t of teams) {
    const e = await getEnrichedTeam(t.id);
    if (e) result.push(e);
  }
  return result;
}

/** Todos los jugadores con nombre de equipo y riesgo, para la pantalla de jugadores. */
export async function getEnrichedPlayersWithTeam() {
  const players = await prisma.player.findMany({
    include: { team: { select: { name: true, shortName: true } } },
  });
  return players.map((p) => {
    const e = enrichPlayer(p);
    return { ...e, teamName: p.team.shortName ?? p.team.name };
  });
}
