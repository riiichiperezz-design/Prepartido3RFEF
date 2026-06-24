import { getEnrichedPlayersWithTeam } from "@/lib/data";
import PlayersExplorer, { type PlayerRow } from "@/components/PlayersExplorer";

export const dynamic = "force-dynamic";

export default async function PlayersPage() {
  const players = await getEnrichedPlayersWithTeam();
  const rows: PlayerRow[] = players.map((p) => ({
    id: p.id,
    name: p.name,
    teamName: p.teamName,
    dorsal: p.dorsal,
    age: p.age,
    position: p.position,
    goals: p.goals,
    yellowCards: p.yellowCards,
    redCards: p.redCards,
    previousSeasonYellowCards: p.previousSeasonYellowCards,
    previousSeasonRedCards: p.previousSeasonRedCards,
    behaviourTags: p.behaviourTags,
    effectiveRisk: p.effectiveRisk,
  }));
  const teams = Array.from(new Set(rows.map((r) => r.teamName))).sort();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Jugadores</h1>
        <p className="text-sm text-ink-muted">Tabla con filtros y ordenaciones. Pulsa un nombre para ver su ficha.</p>
      </div>
      <PlayersExplorer players={rows} teams={teams} />
    </div>
  );
}
