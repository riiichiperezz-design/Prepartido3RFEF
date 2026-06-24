import Link from "next/link";
import Avatar from "./Avatar";
import RiskBadge from "./RiskBadge";
import type { EnrichedTeam } from "@/lib/data";
import { goalDiff } from "@/lib/format";

/** Tarjeta visual de equipo para el listado. */
export default function TeamCard({ team }: { team: EnrichedTeam }) {
  return (
    <Link href={`/teams/${team.id}`} className="card card-hover block p-4">
      <div className="flex items-start gap-3">
        <Avatar name={team.shortName ?? team.name} src={team.crestUrl} size="lg" square />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-base font-bold text-ink">{team.name}</h3>
            {team.currentPosition && (
              <span className="chip bg-slate-100 text-ink-muted">{team.currentPosition}º</span>
            )}
          </div>
          <p className="truncate text-xs text-ink-muted">
            {team.city ?? "—"} · {team.stadium ?? "Estadio sin definir"}
          </p>
          <div className="mt-2">
            <RiskBadge level={team.effectiveRisk} size="sm" />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        <Mini label="Pts" value={team.points ?? 0} />
        <Mini label="GF·GC" value={`${team.goalsFor}·${team.goalsAgainst}`} hint={goalDiff(team.goalsFor, team.goalsAgainst)} />
        <Mini label="Amar." value={team.yellowCards} tone="warn" />
        <Mini label="Rojas" value={team.redCards} tone="bad" />
      </div>
    </Link>
  );
}

function Mini({ label, value, hint, tone }: { label: string; value: React.ReactNode; hint?: string; tone?: "warn" | "bad" }) {
  const color = tone === "warn" ? "text-amber-600" : tone === "bad" ? "text-red-600" : "text-ink";
  return (
    <div className="rounded-lg bg-slate-50 py-1.5">
      <div className={`text-sm font-bold ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      {hint && <div className="text-[10px] text-slate-400">{hint}</div>}
    </div>
  );
}
