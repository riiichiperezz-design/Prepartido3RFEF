import type { EnrichedTeam } from "@/lib/data";
import { type KeyPlayers, playersToWatch } from "@/lib/briefing";
import Avatar from "./Avatar";
import PlayerWatchCard from "./PlayerWatchCard";
import { GoalIcon } from "./icons";

/** Jugadores clave / a vigilar de un equipo, con fotos. */
export default function KeyPlayersSection({ team, kp }: { team: EnrichedTeam; kp: KeyPlayers }) {
  const watch = playersToWatch(kp);

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Avatar name={team.shortName ?? team.name} src={team.crestUrl} size="sm" square variant="team" />
        <h3 className="section-title">{team.shortName ?? team.name}</h3>
      </div>

      {kp.topScorer && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">
          <GoalIcon className="h-4 w-4 text-ink-muted" strokeWidth={2} />
          <span className="text-ink-muted">Máximo goleador:</span>
          <span className="font-medium text-ink">{kp.topScorer.name}</span>
          <span className="ml-auto font-semibold text-ink">{kp.topScorer.goals} goles</span>
        </div>
      )}

      {watch.length === 0 ? (
        <p className="text-sm text-gray-400">Sin jugadores de especial atención.</p>
      ) : (
        <div className="space-y-2">
          <p className="eyebrow">Jugadores a vigilar</p>
          {watch.map(({ player, note }) => (
            <PlayerWatchCard key={player.id} player={player} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
