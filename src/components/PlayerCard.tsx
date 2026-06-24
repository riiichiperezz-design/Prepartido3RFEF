import Link from "next/link";
import Avatar from "./Avatar";
import RiskBadge from "./RiskBadge";
import type { EnrichedPlayer } from "@/lib/data";
import { POSITION_LABELS, type Position } from "@/lib/enums";
import { parseList } from "@/lib/format";

/** Tarjeta visual de jugador. */
export default function PlayerCard({
  player,
  href,
}: {
  player: EnrichedPlayer;
  href?: string;
}) {
  const pos = player.position ? POSITION_LABELS[player.position as Position] ?? player.position : "—";
  const tags = parseList(player.behaviourTags);

  const inner = (
    <div className="card card-hover h-full p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar name={player.name} src={player.photoUrl} size="md" />
          {player.dorsal != null && (
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-white ring-2 ring-white">
              {player.dorsal}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-ink">{player.name}</div>
          <div className="text-xs text-ink-muted">
            {pos}
            {player.age ? ` · ${player.age} años` : ""}
          </div>
        </div>
        <RiskBadge level={player.effectiveRisk} size="sm" label={riskShort(player.effectiveRisk)} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <Stat value={player.goals} label="Goles" />
        <Stat value={player.yellowCards} label="Amar." tone="warn" />
        <Stat value={player.redCards} label="Rojas" tone="bad" />
      </div>

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {tags.map((t) => (
            <span key={t} className="chip bg-slate-100 text-ink-muted">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  ) : (
    inner
  );
}

function riskShort(level: "LOW" | "MEDIUM" | "HIGH") {
  return { LOW: "Bajo", MEDIUM: "Medio", HIGH: "Alto" }[level];
}

function Stat({ value, label, tone }: { value: number; label: string; tone?: "warn" | "bad" }) {
  const color = tone === "warn" ? "text-amber-600" : tone === "bad" ? "text-red-600" : "text-ink";
  return (
    <div className="rounded-lg bg-slate-50 py-1.5">
      <div className={`font-bold ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  );
}
