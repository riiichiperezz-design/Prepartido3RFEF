import { prisma } from "@/lib/prisma";
import TacticsBoardLoader from "@/components/tactics/TacticsBoardLoader";

export const dynamic = "force-dynamic";

export default async function TacticsPage() {
  const teams = await prisma.team.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, shortName: true },
  });

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow">Pizarra arbitral</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Campo táctico</h1>
        <p className="text-sm text-ink-muted">
          Crea alineaciones y situaciones sobre el terreno: coloca jugadores, asócialos a tu base de
          datos, dibuja flechas y zonas, y marca tu posición y la de los asistentes.
        </p>
      </div>
      {teams.length === 0 ? (
        <div className="card p-8 text-center text-sm text-ink-muted">Añade algún equipo primero.</div>
      ) : (
        <TacticsBoardLoader teams={teams} />
      )}
    </div>
  );
}
