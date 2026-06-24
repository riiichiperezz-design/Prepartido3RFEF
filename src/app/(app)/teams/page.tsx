import { getEnrichedTeams } from "@/lib/data";
import TeamsExplorer from "@/components/TeamsExplorer";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const teams = await getEnrichedTeams();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Equipos</h1>
        <p className="text-sm text-ink-muted">Filtra por riesgo, protesta o localidad y abre la ficha de cada equipo.</p>
      </div>
      <TeamsExplorer teams={teams} />
    </div>
  );
}
