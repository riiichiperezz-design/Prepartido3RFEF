/**
 * Seed con los datos REALES del Grupo 14 de Tercera Federación (temporada
 * 2026-2027), extraídos del calendario oficial de la Federación Extremeña de
 * Fútbol: 18 equipos con su información (estadio, ciudad, teléfono, tipo de
 * césped y equipación) y el calendario completo de 34 jornadas (306 partidos).
 *
 * Los datos de plantillas, tarjetas, riesgo y notas los añade el árbitro a mano
 * o mediante importación; aquí solo se cargan equipos y calendario.
 */
import { PrismaClient } from "@prisma/client";
import { CAL_TEAMS, CAL_FIXTURES } from "./calendar-data";

const prisma = new PrismaClient();

/** Limpia el nombre del estadio (quita restos de guiones al final). */
function cleanStadium(s?: string): string | null {
  if (!s) return null;
  return s.replace(/\s*[-–]\s*$/, "").trim() || null;
}

async function main() {
  console.log("🌱 Cargando Grupo 14 (Tercera Federación 2026-2027)...");

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

  const competition = await prisma.competition.create({
    data: {
      name: "Tercera Federación",
      season: "2026-2027",
      group: "Grupo 14 (Extremadura)",
      source: "MANUAL",
    },
  });

  // Equipos
  const idByName: Record<string, string> = {};
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

  // Calendario (partidos). Hora orientativa 17:00.
  let matches = 0;
  for (const f of CAL_FIXTURES) {
    const home = idByName[f.home];
    const away = idByName[f.away];
    if (!home || !away) continue;
    const homeTeam = CAL_TEAMS.find((t) => t.name === f.home);
    await prisma.match.create({
      data: {
        homeTeamId: home,
        awayTeamId: away,
        date: new Date(`${f.date}T17:00:00`),
        round: `Jornada ${f.md}`,
        matchday: f.md,
        stadium: cleanStadium(homeTeam?.stadium),
        status: "PENDING",
      },
    });
    matches++;
  }

  await prisma.dataSource.createMany({
    data: [
      { name: "Edición manual", type: "MANUAL" },
      { name: "Importación CSV/Excel", type: "CSV" },
      { name: "Calendario oficial FExF", type: "MANUAL" },
    ],
  });

  console.log(`✅ Listo: ${CAL_TEAMS.length} equipos y ${matches} partidos (34 jornadas).`);
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
