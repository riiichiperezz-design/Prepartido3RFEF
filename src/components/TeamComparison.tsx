import type { EnrichedTeam } from "@/lib/data";
import { PROTEST_LABELS, PHYSICAL_LABELS, type RiskLevel } from "@/lib/enums";

/** Comparativa rápida entre los dos equipos (sección B del briefing). */
export default function TeamComparison({ home, away }: { home: EnrichedTeam; away: EnrichedTeam }) {
  const rows: { label: string; home: React.ReactNode; away: React.ReactNode; highlight?: "home" | "away" | "both" }[] = [
    { label: "Clasificación", home: pos(home.currentPosition), away: pos(away.currentPosition) },
    { label: "Puntos", home: home.points ?? 0, away: away.points ?? 0 },
    { label: "Goles a favor", home: home.goalsFor, away: away.goalsFor },
    { label: "Goles en contra", home: home.goalsAgainst, away: away.goalsAgainst },
    { label: "Amarillas", home: home.yellowCards, away: away.yellowCards, highlight: "both" },
    { label: "Rojas", home: home.redCards, away: away.redCards, highlight: "both" },
    { label: "Nivel de protesta", home: PROTEST_LABELS[home.protestLevel as RiskLevel], away: PROTEST_LABELS[away.protestLevel as RiskLevel] },
    { label: "Nivel físico", home: PHYSICAL_LABELS[home.physicalLevel as RiskLevel], away: PHYSICAL_LABELS[away.physicalLevel as RiskLevel] },
    { label: "Edad media", home: home.avgAge ? `${home.avgAge} años` : "—", away: away.avgAge ? `${away.avgAge} años` : "—" },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-3 bg-ink text-white">
        <div className="p-3 text-center text-sm font-bold">{home.shortName ?? home.name}</div>
        <div className="p-3 text-center text-xs uppercase tracking-widest text-pitch-500">Comparativa</div>
        <div className="p-3 text-center text-sm font-bold">{away.shortName ?? away.name}</div>
      </div>
      <div className="divide-y divide-slate-100">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-3 items-center">
            <div className="p-2.5 text-center text-lg font-bold text-ink">{r.home}</div>
            <div className="p-2.5 text-center text-xs font-medium uppercase tracking-wide text-ink-muted">{r.label}</div>
            <div className="p-2.5 text-center text-lg font-bold text-ink">{r.away}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function pos(p: number | null) {
  return p ? `${p}º` : "—";
}
