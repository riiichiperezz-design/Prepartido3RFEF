import Link from "next/link";
import type { EnrichedTeam } from "@/lib/data";
import type { BriefingAlert, KeyPlayers, StyleFlags } from "@/lib/briefing";
import type { RiskLevel } from "@/lib/enums";
import { PROTEST_LABELS } from "@/lib/enums";
import { formatDate } from "@/lib/format";
import Avatar from "./Avatar";
import RiskBadge from "./RiskBadge";
import TeamComparison from "./TeamComparison";
import KeyPlayersSection from "./KeyPlayersSection";
import AlertBox from "./AlertBox";
import AssistantInstructions, { type Instructions } from "./AssistantInstructions";
import PDFExportButton from "./PDFExportButton";

interface Props {
  home: EnrichedTeam;
  away: EnrichedTeam;
  homeKey: KeyPlayers;
  awayKey: KeyPlayers;
  homeStyle: StyleFlags;
  awayStyle: StyleFlags;
  alerts: BriefingAlert[];
  globalRisk: RiskLevel;
  date?: string;
  round?: string;
  stadium?: string;
  initialInstructions?: Partial<Instructions>;
}

/** Briefing arbitral completo (secciones A–H). */
export default function MatchBriefing(props: Props) {
  const { home, away, homeKey, awayKey, homeStyle, awayStyle, alerts, globalRisk } = props;

  return (
    <div className="print-page space-y-6">
      {/* Barra de acciones (no se imprime) */}
      <div className="no-print flex items-center justify-between">
        <Link href="/match" className="text-sm text-ink-muted hover:underline">
          ← Cambiar partido
        </Link>
        <PDFExportButton />
      </div>

      {/* A. Portada */}
      <section className="card overflow-hidden">
        <div className="bg-ink px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-pitch-500">
          Briefing arbitral · 3ª RFEF Grupo 14
        </div>
        <div className="grid grid-cols-3 items-center gap-2 p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Avatar name={home.shortName ?? home.name} src={home.crestUrl} size="xl" square />
            <div className="font-bold text-ink">{home.name}</div>
            <RiskBadge level={home.effectiveRisk} size="sm" />
            <span className="text-[10px] uppercase tracking-wide text-slate-400">Local</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-ink-muted">VS</div>
            <div className="mt-2 text-sm font-semibold text-ink">{props.round ?? "Jornada"}</div>
            <div className="text-xs text-ink-muted">{formatDate(props.date)}</div>
            <div className="text-xs text-slate-400">{props.stadium ?? home.stadium}</div>
            <div className="mt-3">
              <div className="text-[10px] uppercase tracking-wide text-slate-400">Riesgo global</div>
              <RiskBadge level={globalRisk} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Avatar name={away.shortName ?? away.name} src={away.crestUrl} size="xl" square />
            <div className="font-bold text-ink">{away.name}</div>
            <RiskBadge level={away.effectiveRisk} size="sm" />
            <span className="text-[10px] uppercase tracking-wide text-slate-400">Visitante</span>
          </div>
        </div>
      </section>

      {/* F. Alertas (arriba por relevancia) */}
      <section className="space-y-2">
        <h2 className="section-title">🚨 Alertas arbitrales</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {alerts.map((a, i) => (
            <AlertBox key={i} level={a.level} title={a.title}>
              {a.detail}
            </AlertBox>
          ))}
        </div>
      </section>

      {/* B. Comparativa rápida */}
      <section>
        <h2 className="section-title mb-2">📊 Comparativa rápida</h2>
        <TeamComparison home={home} away={away} />
      </section>

      {/* C. Jugadores clave */}
      <section>
        <h2 className="section-title mb-2">⭐ Jugadores clave</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <KeyPlayersSection team={home} kp={homeKey} />
          <KeyPlayersSection team={away} kp={awayKey} />
        </div>
      </section>

      {/* E. Estilo de juego */}
      <section>
        <h2 className="section-title mb-2">⚽ Estilo de juego</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <StyleCard team={home} style={homeStyle} />
          <StyleCard team={away} style={awayStyle} />
        </div>
      </section>

      {/* D. Cuerpo técnico */}
      <section>
        <h2 className="section-title mb-2">🎽 Cuerpo técnico</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <StaffBriefing team={home} />
          <StaffBriefing team={away} />
        </div>
      </section>

      {/* G. Instrucciones para asistentes */}
      <section>
        <AssistantInstructions
          home={home.id}
          away={away.id}
          date={props.date}
          round={props.round}
          initial={props.initialInstructions}
        />
      </section>

      <p className="no-print text-center text-xs text-slate-400">
        Generado localmente · Datos privados · Esta herramienta solo ayuda a preparar; no predice incidencias.
      </p>
    </div>
  );
}

const STYLE_ITEMS: { key: keyof StyleFlags; label: string }[] = [
  { key: "direct", label: "Juego directo" },
  { key: "buildUp", label: "Sale desde atrás" },
  { key: "crossing", label: "Carga el área" },
  { key: "wings", label: "Juega por bandas" },
  { key: "highPress", label: "Presiona alto" },
  { key: "setPieces", label: "Fuerte a balón parado" },
  { key: "protests", label: "Suele protestar" },
];

function StyleCard({ team, style }: { team: EnrichedTeam; style: StyleFlags }) {
  return (
    <div className="card p-4">
      <h3 className="section-title mb-3 text-base">{team.shortName ?? team.name}</h3>
      <div className="grid grid-cols-2 gap-2">
        {STYLE_ITEMS.map((it) => {
          const on = style[it.key];
          return (
            <div
              key={it.key}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                on ? "bg-pitch-50 text-pitch-700" : "bg-slate-50 text-slate-400"
              }`}
            >
              <span>{on ? "✓" : "·"}</span>
              {it.label}
            </div>
          );
        })}
      </div>
      {team.playingStyle && <p className="mt-3 text-sm text-slate-700">{team.playingStyle}</p>}
      {team.tacticalNotes && <p className="mt-2 text-xs text-ink-muted">{team.tacticalNotes}</p>}
    </div>
  );
}

function StaffBriefing({ team }: { team: EnrichedTeam }) {
  const coach = team.staff.find((s) => (s.role ?? "").toLowerCase().includes("entrenador") && !(s.role ?? "").toLowerCase().includes("segundo"))
    ?? team.staff[0];
  return (
    <div className="card p-4">
      <h3 className="section-title mb-3 text-base">{team.shortName ?? team.name}</h3>
      {!coach ? (
        <p className="text-sm text-slate-400">Sin cuerpo técnico registrado.</p>
      ) : (
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink">{coach.name}</span>
            <RiskBadge level={(coach.refereeRisk as RiskLevel) ?? "LOW"} size="sm" />
          </div>
          <div className="text-xs text-ink-muted">{coach.role ?? "Entrenador"}</div>
          {coach.previousTeams && (
            <div className="text-xs text-slate-500">
              <span className="font-medium">Historial:</span> {coach.previousTeams}
            </div>
          )}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="chip bg-slate-100 text-ink-muted">Protesta: {PROTEST_LABELS[(coach.protestLevel as RiskLevel) ?? "LOW"]}</span>
            {coach.yellowCards > 0 && <span className="chip bg-amber-100 text-amber-700">{coach.yellowCards} 🟨</span>}
            {coach.redCards > 0 && <span className="chip bg-red-100 text-red-700">{coach.redCards} 🟥</span>}
          </div>
          {coach.notes && <p className="text-xs text-slate-600">{coach.notes}</p>}
        </div>
      )}
      {/* Resto del cuerpo técnico marcado como riesgo */}
      {team.staff.filter((s) => s !== coach && s.refereeRisk !== "LOW").map((s) => (
        <div key={s.id} className="mt-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
          <span className="font-semibold">{s.name}</span> ({s.role}) — {s.notes ?? "vigilar"}
        </div>
      ))}
    </div>
  );
}
