import { getEnrichedTeams } from "@/lib/data";
import TeamsExplorer from "@/components/TeamsExplorer";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const teams = await getEnrichedTeams();
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Equipos</h1>
          <p className="text-sm text-ink-muted">Filtra por riesgo, protesta o localidad y abre la ficha de cada equipo.</p>
        </div>
        <Link href="/teams/new" className="btn-primary">
          + Nuevo equipo
        </Link>
      </div>
      <TeamsExplorer teams={teams} />
    </div>
  );
}
