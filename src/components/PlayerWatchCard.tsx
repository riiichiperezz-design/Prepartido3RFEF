import Avatar from "./Avatar";
import RiskBadge from "./RiskBadge";
import type { EnrichedPlayer } from "@/lib/data";
import { POSITION_LABELS, type Position } from "@/lib/enums";

/** Ficha compacta de jugador a vigilar (con foto) para el briefing. */
export default function PlayerWatchCard({ player, note }: { player: EnrichedPlayer; note?: string }) {
  const pos = player.position ? POSITION_LABELS[player.position as Position] ?? player.position : "—";
  return (
    <div className="flex gap-3 rounded-xl border border-ink-line bg-white p-3">
      <div className="relative shrink-0">
        <Avatar name={player.name} src={player.photoUrl} size="lg" />
        {player.dorsal != null && (
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-white ring-2 ring-white">
            {player.dorsal}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate font-medium text-ink">{player.name}</div>
            <div className="text-xs text-ink-muted">{pos}{player.age ? ` · ${player.age} años` : ""}</div>
          </div>
          <RiskBadge level={player.effectiveRisk} size="sm" label={{ LOW: "Bajo", MEDIUM: "Medio", HIGH: "Alto" }[player.effectiveRisk]} />
        </div>
        <div className="mt-2 flex gap-3 text-xs text-ink-muted">
          <span><span className="font-semibold text-ink">{player.goals}</span> goles</span>
          <span><span className="font-semibold text-risk-medium">{player.yellowCards}</span> amar.</span>
          <span><span className="font-semibold text-risk-high">{player.redCards}</span> rojas</span>
        </div>
        {note && <p className="mt-1.5 text-xs leading-snug text-ink-muted">{note}</p>}
      </div>
    </div>
  );
}
