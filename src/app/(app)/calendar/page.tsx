import { prisma } from "@/lib/prisma";
import CalendarView, { type CalMatch } from "@/components/CalendarView";

export const dynamic = "force-dynamic";

const TEAM_SEL = { select: { id: true, name: true, shortName: true, crestUrl: true } };

export default async function CalendarPage({ searchParams }: { searchParams: { md?: string } }) {
  // Todas las jornadas existentes
  const distinct = await prisma.match.findMany({
    where: { matchday: { not: null } },
    distinct: ["matchday"],
    select: { matchday: true },
    orderBy: { matchday: "asc" },
  });
  const matchdays = distinct.map((d) => d.matchday!).filter((n) => n != null);

  if (matchdays.length === 0) {
    return (
      <div className="space-y-5">
        <Header />
        <div className="card p-8 text-center text-sm text-ink-muted">
          No hay partidos cargados. Ejecuta el seed del calendario.
        </div>
      </div>
    );
  }

  // Jornada actual = la del próximo partido por jugar (o la última si ya pasó todo)
  const now = new Date();
  const nextMatch = await prisma.match.findFirst({
    where: { date: { gte: now } },
    orderBy: { date: "asc" },
    select: { matchday: true },
  });
  const currentMd = nextMatch?.matchday ?? matchdays[matchdays.length - 1];

  // Jornada seleccionada
  const req = Number(searchParams.md);
  const selectedMd = matchdays.includes(req) ? req : currentMd;

  const rows = await prisma.match.findMany({
    where: { matchday: selectedMd },
    orderBy: { date: "asc" },
    include: { homeTeam: TEAM_SEL, awayTeam: TEAM_SEL },
  });

  const matches: CalMatch[] = rows.map((m) => ({
    id: m.id,
    home: m.homeTeam,
    away: m.awayTeam,
    date: m.date ? m.date.toISOString() : null,
    stadium: m.stadium,
    status: m.status,
    designated: m.designated,
    homeGoals: m.homeGoals,
    awayGoals: m.awayGoals,
    homeYellowCards: m.homeYellowCards,
    awayYellowCards: m.awayYellowCards,
    homeRedCards: m.homeRedCards,
    awayRedCards: m.awayRedCards,
    referee: m.referee,
    assistant1: m.assistant1,
    assistant2: m.assistant2,
  }));

  return (
    <div className="space-y-5">
      <Header />
      <CalendarView matchdays={matchdays} currentMd={currentMd} selectedMd={selectedMd} matches={matches} />
    </div>
  );
}

function Header() {
  return (
    <div>
      <p className="eyebrow">Tercera Federación · Grupo 14 · 2026-2027</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Calendario</h1>
      <p className="text-sm text-ink-muted">
        Consulta las jornadas, edita resultados y tarjetas, marca el partido que te han designado y prepara el briefing.
      </p>
    </div>
  );
}
