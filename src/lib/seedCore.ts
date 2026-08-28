import type { PrismaClient } from "@prisma/client";
import { CAL_TEAMS, CAL_FIXTURES } from "./calendar-data";
import { SQUADS } from "./squads-data";

/** Limpia el nombre del estadio (quita restos de guiones al final). */
function cleanStadium(s?: string): string | null {
  if (!s) return null;
  return s.replace(/\s*[-–]\s*$/, "").trim() || null;
}

/**
 * Puebla la base de datos con el Grupo 14 real (equipos + calendario 2026-2027)
 * y las plantillas aportadas. Reutilizable desde el seed (CLI) y desde la API
 * de configuración (/api/setup) para el despliegue con base de datos en la nube.
 */
export async function populateDatabase(
  prisma: PrismaClient,
  { reset = true }: { reset?: boolean } = {},
): Promise<{ teams: number; matches: number; players: number }> {
  if (reset) {
    await prisma.playerFieldPosition.deleteMany();
    await prisma.lineup.deleteMany();
    await prisma.tacticalSituation.deleteMany();
    await prisma.weeklyUpdate.deleteMany();
    await prisma.refereeNote.deleteMany();
    await prisma.match.deleteMany();
    await prisma.player.deleteMany();
    await prisma.staffMember.deleteMany();
    await prisma.team.deleteMany();
    await prisma.competition.deleteMany();
    await prisma.dataSource.deleteMany();
  }

  const competition = await prisma.competition.create({
    data: { name: "Tercera Federación", season: "2026-2027", group: "Grupo 14 (Extremadura)", source: "MANUAL" },
  });

  const idByName: Record<string, string> = {};

  // Equipos (se crean uno a uno para obtener sus IDs)
  for (const t of CAL_TEAMS) {
    const created = await prisma.team.create({
      data: {
        competitionId: competition.id,
        name: t.name,
        shortName: t.short,
        city: t.city ?? null,
        stadium: cleanStadium(t.stadium),
        category: "Tercera Federación",
        pitchType: t.pitch ?? null,
        kitHome: t.kit ?? null,
        contactPhone: t.phone ?? null,
        federationCode: t.code ?? null,
        dataOrigin: "MANUAL",
      },
    });
    idByName[t.name] = created.id;
  }

  // Jugadores y partidos en lote (menos viajes de red)
  const playerData = CAL_TEAMS.flatMap((t) =>
    (SQUADS[t.short] ?? []).map((p) => ({
      teamId: idByName[t.name],
      name: p.name,
      position: p.position ?? null,
      notes: p.trajectory ? `Trayectoria: ${p.trajectory}` : null,
      previousSeasonGoals: p.prevGoals ?? 0,
      previousSeasonYellowCards: p.prevYellow ?? 0,
      previousSeasonRedCards: p.prevRed ?? 0,
      dataOrigin: "MANUAL",
    })),
  );
  if (playerData.length) await prisma.player.createMany({ data: playerData });

  const matchData = CAL_FIXTURES.filter((f) => idByName[f.home] && idByName[f.away]).map((f) => ({
    homeTeamId: idByName[f.home],
    awayTeamId: idByName[f.away],
    date: new Date(`${f.date}T17:00:00`),
    round: `Jornada ${f.md}`,
    matchday: f.md,
    stadium: cleanStadium(CAL_TEAMS.find((t) => t.name === f.home)?.stadium),
    status: "PENDING",
  }));
  if (matchData.length) await prisma.match.createMany({ data: matchData });

  const players = playerData.length;
  const matches = matchData.length;

  await prisma.dataSource.createMany({
    data: [
      { name: "Edición manual", type: "MANUAL" },
      { name: "Importación CSV/Excel", type: "CSV" },
      { name: "Calendario oficial FExF", type: "MANUAL" },
    ],
  });

  return { teams: CAL_TEAMS.length, matches, players };
}
