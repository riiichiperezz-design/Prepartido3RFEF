import type { EnrichedTeam } from "@/lib/data";
import { PROTEST_LABELS, PHYSICAL_LABELS, type RiskLevel } from "@/lib/enums";
import { formatDate } from "@/lib/format";
import { RISK_ORDER } from "@/lib/risk";

/** Estimación sobria del "estado emocional" del equipo (no predictivo). */
function emotionalState(t: EnrichedTeam): string {
  const score =
    RISK_ORDER[t.protestLevel as RiskLevel] + RISK_ORDER[t.physicalLevel as RiskLevel] + (t.redCards >= 3 ? 1 : 0);
  if (score >= 3) return "Tenso";
  if (score >= 2) return "Competitivo";
  return "Tranquilo";
}

/** Comparativa rápida entre los dos equipos. */
export default function TeamComparison({ home, away }: { home: EnrichedTeam; away: EnrichedTeam }) {
  const rows: { label: string; home: React.ReactNode; away: React.ReactNode }[] = [
    { label: "Clasificación", home: pos(home.currentPosition), away: pos(away.currentPosition) },
    { label: "Puntos", home: home.points ?? 0, away: away.points ?? 0 },
    { label: "Goles a favor", home: home.goalsFor, away: away.goalsFor },
    { label: "Goles en contra", home: home.goalsAgainst, away: away.goalsAgainst },
    { label: "Amarillas", home: home.yellowCards, away: away.yellowCards },
    { label: "Rojas", home: home.redCards, away: away.redCards },
    { label: "Nivel de protesta", home: PROTEST_LABELS[home.protestLevel as RiskLevel], away: PROTEST_LABELS[away.protestLevel as RiskLevel] },
    { label: "Nivel físico", home: PHYSICAL_LABELS[home.physicalLevel as RiskLevel], away: PHYSICAL_LABELS[away.physicalLevel as RiskLevel] },
    { label: "Estado emocional", home: emotionalState(home), away: emotionalState(away) },
    { label: "Edad media", home: home.avgAge ? `${home.avgAge} años` : "—", away: away.avgAge ? `${away.avgAge} años` : "—" },
    { label: "Últimos datos", home: formatDate(home.updatedAt), away: formatDate(away.updatedAt) },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-3 border-b border-ink-line bg-gray-50">
        <div className="p-3 text-center text-sm font-semibold text-ink">{home.shortName ?? home.name}</div>
        <div className="flex items-center justify-center p-3 text-center"><span className="eyebrow">Comparativa</span></div>
        <div className="p-3 text-center text-sm font-semibold text-ink">{away.shortName ?? away.name}</div>
      </div>
      <div className="divide-y divide-ink-line">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-3 items-center">
            <div className="p-2.5 text-center text-sm font-semibold text-ink">{r.home}</div>
            <div className="p-2.5 text-center text-[11px] font-medium uppercase tracking-wide text-ink-muted">{r.label}</div>
            <div className="p-2.5 text-center text-sm font-semibold text-ink">{r.away}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function pos(p: number | null) {
  return p ? `${p}.º` : "—";
}
