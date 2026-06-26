import { prisma } from "@/lib/prisma";
import WeeklyUpdater from "@/components/WeeklyUpdater";

export const dynamic = "force-dynamic";

export default async function WeeklyPage() {
  const teams = await prisma.team.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true, name: true, points: true, currentPosition: true,
      goalsFor: true, goalsAgainst: true, yellowCards: true, redCards: true,
    },
  });

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow">Rutina de jornada</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Actualización semanal</h1>
        <p className="text-sm text-ink-muted">
          Actualiza rápido goles, tarjetas, minutos y clasificación cada lunes. Pensado para hacerlo en 30-40 minutos.
        </p>
      </div>
      {teams.length === 0 ? (
        <div className="card p-8 text-center text-sm text-ink-muted">Añade algún equipo primero.</div>
      ) : (
        <WeeklyUpdater teams={teams} />
      )}
    </div>
  );
}
