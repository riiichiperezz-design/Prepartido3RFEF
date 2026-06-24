import type { EnrichedTeam } from "@/lib/data";
import type { KeyPlayers } from "@/lib/briefing";
import { POSITION_LABELS, type Position } from "@/lib/enums";
import RiskBadge from "./RiskBadge";

/** Jugadores clave de un equipo en el briefing (sección C). */
export default function KeyPlayersSection({ team, kp }: { team: EnrichedTeam; kp: KeyPlayers }) {
  return (
    <div className="card p-4">
      <h3 className="section-title mb-3 text-base">
        Jugadores clave · {team.shortName ?? team.name}
      </h3>

      <div className="space-y-3 text-sm">
        {kp.topScorer && (
          <Row label="⚽ Máximo goleador">
            <PlayerLine name={kp.topScorer.name} pos={kp.topScorer.position} extra={`${kp.topScorer.goals} goles`} />
          </Row>
        )}

        {kp.mostBooked.length > 0 && (
          <Row label="🟨 Más amonestados">
            <div className="space-y-1">
              {kp.mostBooked.map((p) => (
                <PlayerLine key={p.id} name={p.name} pos={p.position} extra={`${p.yellowCards} amarillas`} tone="warn" />
              ))}
            </div>
          </Row>
        )}

        {kp.withReds.length > 0 && (
          <Row label="🟥 Con rojas">
            <div className="space-y-1">
              {kp.withReds.map((p) => (
                <PlayerLine key={p.id} name={p.name} pos={p.position} extra={`${p.redCards} roja(s)`} tone="bad" />
              ))}
            </div>
          </Row>
        )}

        {kp.risky.length > 0 && (
          <Row label="⚠️ Marcados como riesgo">
            <div className="space-y-1">
              {kp.risky.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <PlayerLine name={p.name} pos={p.position} />
                  <RiskBadge level={p.effectiveRisk} size="sm" />
                </div>
              ))}
            </div>
          </Row>
        )}

        {kp.withImportantNotes.length > 0 && (
          <Row label="📝 Con notas importantes">
            <div className="space-y-1">
              {kp.withImportantNotes.map(({ player, note }) => (
                <div key={player.id} className="rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
                  <span className="font-semibold">{player.name}:</span> {note}
                </div>
              ))}
            </div>
          </Row>
        )}

        <Row label="👶 / 🧓 Edades a destacar">
          <div className="flex flex-wrap gap-2 text-xs">
            {kp.youngest && (
              <span className="chip bg-slate-100 text-ink-muted">
                Más joven: {kp.youngest.name} ({kp.youngest.age})
              </span>
            )}
            {kp.veteran && (
              <span className="chip bg-slate-100 text-ink-muted">
                Más veterano: {kp.veteran.name} ({kp.veteran.age})
              </span>
            )}
          </div>
        </Row>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-slate-100 pt-2 first:border-0 first:pt-0">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</div>
      {children}
    </div>
  );
}

function PlayerLine({ name, pos, extra, tone }: { name: string; pos?: string | null; extra?: string; tone?: "warn" | "bad" }) {
  const color = tone === "warn" ? "text-amber-600" : tone === "bad" ? "text-red-600" : "text-ink-muted";
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-ink">
        {name}
        {pos && <span className="ml-1 text-xs text-slate-400">{POSITION_LABELS[pos as Position] ?? pos}</span>}
      </span>
      {extra && <span className={`text-xs font-semibold ${color}`}>{extra}</span>}
    </div>
  );
}
