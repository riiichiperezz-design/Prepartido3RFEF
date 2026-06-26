import Link from "next/link";
import type { EnrichedTeam } from "@/lib/data";
import type { BriefingAlert, KeyPlayers, StyleFlags } from "@/lib/briefing";
import type { RiskLevel } from "@/lib/enums";
import { PROTEST_LABELS, RISK_LABELS } from "@/lib/enums";
import { formatDate } from "@/lib/format";
import Avatar from "./Avatar";
import RiskBadge from "./RiskBadge";
import TeamComparison from "./TeamComparison";
import KeyPlayersSection from "./KeyPlayersSection";
import AlertBox from "./AlertBox";
import AssistantInstructions, { type Instructions } from "./AssistantInstructions";
import PDFExportButton from "./PDFExportButton";
import BoardRenderer from "./tactics/BoardRenderer";
import { parseBoard } from "@/lib/tactics";
import { SITUATION_TYPE_LABELS, type SituationType } from "@/lib/enums";
import type { Lineup, TacticalSituation } from "@prisma/client";
import { BackIcon, CheckIcon, RiskIcon, NoteIcon } from "./icons";

interface Props {
  home: EnrichedTeam;
  away: EnrichedTeam;
  homeKey: KeyPlayers;
  awayKey: KeyPlayers;
  homeStyle: StyleFlags;
  awayStyle: StyleFlags;
  alerts: BriefingAlert[];
  executiveSummary: string[];
  globalRisk: RiskLevel;
  date?: string;
  round?: string;
  stadium?: string;
  referee?: string;
  assistant1?: string;
  assistant2?: string;
  initialInstructions?: Partial<Instructions>;
  homeLineup?: Lineup | null;
  awayLineup?: Lineup | null;
  homeSituations?: TacticalSituation[];
  awaySituations?: TacticalSituation[];
  playerMeta?: Record<string, { risk?: string | null; photoUrl?: string | null }>;
}

/** Briefing arbitral profesional (dossier prepartido). */
export default function MatchBriefing(props: Props) {
  const { home, away, homeKey, awayKey, homeStyle, awayStyle, alerts, globalRisk } = props;
  const personalNotes = [...home.briefingNotes, ...away.briefingNotes];

  return (
    <div className="print-page space-y-5">
      {/* Barra de acciones (no se imprime) */}
      <div className="no-print flex items-center justify-between">
        <Link href="/match" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <BackIcon className="h-4 w-4" /> Cambiar partido
        </Link>
        <PDFExportButton />
      </div>

      {/* 1. Portada */}
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink-line px-6 py-2.5">
          <span className="eyebrow">Dossier arbitral · Prepartido</span>
          <span className="text-xs text-ink-muted">Tercera Federación · Grupo 14</span>
        </div>
        <div className="grid grid-cols-3 items-center gap-2 p-6">
          <TeamHead team={home} role="Local" />
          <div className="text-center">
            <div className="text-2xl font-semibold tracking-tight text-gray-300">VS</div>
            <div className="mt-2 text-sm font-medium text-ink">{props.round ?? "Jornada"}</div>
            <div className="text-xs text-ink-muted">{formatDate(props.date)}</div>
            <div className="text-xs text-gray-400">{props.stadium ?? home.stadium}</div>
          </div>
          <TeamHead team={away} role="Visitante" />
        </div>
        <div className="grid grid-cols-2 gap-px border-t border-ink-line bg-ink-line text-sm sm:grid-cols-4">
          <Meta label="Árbitro" value={props.referee || "(por asignar)"} />
          <Meta label="Asistente 1" value={props.assistant1 || "(por asignar)"} />
          <Meta label="Asistente 2" value={props.assistant2 || "(por asignar)"} />
          <Meta label="Riesgo global" value={<RiskBadge level={globalRisk} size="sm" />} />
        </div>
      </section>

      {/* 2. Resumen ejecutivo */}
      <section className="card p-5">
        <SectionHeader n={1} title="Resumen ejecutivo" />
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-ink-line p-4 text-center">
            <p className="eyebrow">Riesgo global del partido</p>
            <div className="mt-2 flex justify-center"><RiskBadge level={globalRisk} /></div>
            <p className="mt-2 text-xs text-ink-muted">
              Local {RISK_LABELS[home.effectiveRisk]} · Visitante {RISK_LABELS[away.effectiveRisk]}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="eyebrow mb-2">Puntos críticos</p>
            <ul className="space-y-1.5">
              {props.executiveSummary.map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Comparativa de equipos */}
      <section>
        <SectionHeader n={2} title="Comparativa de equipos" />
        <div className="mt-3"><TeamComparison home={home} away={away} /></div>
      </section>

      {/* 4. Jugadores a vigilar */}
      <section>
        <SectionHeader n={3} title="Jugadores a vigilar" />
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <KeyPlayersSection team={home} kp={homeKey} />
          <KeyPlayersSection team={away} kp={awayKey} />
        </div>
      </section>

      {/* 5. Cuerpo técnico */}
      <section>
        <SectionHeader n={4} title="Cuerpo técnico" />
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <StaffBriefing team={home} />
          <StaffBriefing team={away} />
        </div>
      </section>

      {/* 6. Análisis táctico (estilo + alineación probable sobre el campo) */}
      <section>
        <SectionHeader n={5} title="Análisis táctico" />
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <TacticalColumn team={home} style={homeStyle} lineup={props.homeLineup} playerMeta={props.playerMeta} />
          <TacticalColumn team={away} style={awayStyle} lineup={props.awayLineup} playerMeta={props.playerMeta} />
        </div>
      </section>

      {/* 7. Situaciones preparadas */}
      {(((props.homeSituations?.length ?? 0) + (props.awaySituations?.length ?? 0)) > 0) && (
        <section>
          <SectionHeader n={6} title="Situaciones preparadas" />
          <div className="mt-3 space-y-3">
            {[...(props.homeSituations ?? []), ...(props.awaySituations ?? [])].map((s) => (
              <SituationCard key={s.id} situation={s} playerMeta={props.playerMeta} />
            ))}
          </div>
        </section>
      )}

      {/* 8. Alertas */}
      <section>
        <SectionHeader n={7} title="Alertas arbitrales" />
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {alerts.map((a, i) => (
            <AlertBox key={i} level={a.level} title={a.title}>{a.detail}</AlertBox>
          ))}
        </div>
      </section>

      {/* 9. Instrucciones para asistentes */}
      <section className="print-break">
        <SectionHeader n={8} title="Instrucciones para asistentes" />
        <div className="mt-3">
          <AssistantInstructions
            home={home.id}
            away={away.id}
            date={props.date}
            round={props.round}
            initial={props.initialInstructions}
          />
        </div>
      </section>

      {/* 10. Notas personales */}
      {personalNotes.length > 0 && (
        <section>
          <SectionHeader n={9} title="Notas personales" />
          <div className="mt-3 card divide-y divide-ink-line">
            {personalNotes.map((n) => (
              <div key={n.id} className="flex gap-3 p-3">
                <NoteIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" strokeWidth={2} />
                <p className="text-sm text-ink">{n.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="text-center text-xs text-gray-400">
        Documento generado localmente · Uso privado · Esta herramienta solo ayuda a preparar el partido; no predice incidencias.
      </p>
    </div>
  );
}

function TeamHead({ team, role }: { team: EnrichedTeam; role: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <Avatar name={team.shortName ?? team.name} src={team.crestUrl} size="xl" square variant="team" />
      <div className="font-semibold tracking-tight text-ink">{team.name}</div>
      <RiskBadge level={team.effectiveRisk} size="sm" />
      <span className="eyebrow">{role}</span>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-white px-4 py-3">
      <div className="eyebrow">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-ink">{value}</div>
    </div>
  );
}

function SectionHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink text-xs font-semibold text-white">{n}</span>
      <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
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

function TacticalColumn({
  team,
  style,
  lineup,
  playerMeta,
}: {
  team: EnrichedTeam;
  style: StyleFlags;
  lineup?: Lineup | null;
  playerMeta?: Record<string, { risk?: string | null; photoUrl?: string | null }>;
}) {
  const board = lineup ? parseBoard(lineup.fieldData) : null;
  return (
    <div className="space-y-3">
      <StyleCard team={team} style={style} />
      {board && (
        <div className="card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="section-title">Alineación probable</h3>
            <span className="chip bg-gray-100 text-ink-muted">{board.formation}</span>
          </div>
          <div className="mx-auto" style={{ maxWidth: board.orientation === "vertical" ? 320 : 520 }}>
            <BoardRenderer board={board} playerMeta={playerMeta} className="w-full" />
          </div>
        </div>
      )}
    </div>
  );
}

function SituationCard({
  situation,
  playerMeta,
}: {
  situation: TacticalSituation;
  playerMeta?: Record<string, { risk?: string | null; photoUrl?: string | null }>;
}) {
  const board = parseBoard(situation.fieldData);
  const impColor = { LOW: "bg-risk-lowtint text-risk-low", MEDIUM: "bg-risk-mediumtint text-risk-medium", HIGH: "bg-risk-hightint text-risk-high" }[situation.importance] ?? "bg-gray-100 text-ink-muted";
  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="section-title">{situation.title}</h3>
        <span className="chip bg-gray-100 text-ink-muted">{SITUATION_TYPE_LABELS[situation.type as SituationType] ?? situation.type}</span>
        <span className={`chip ${impColor}`}>{{ LOW: "Baja", MEDIUM: "Media", HIGH: "Alta" }[situation.importance] ?? ""}</span>
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-[260px_1fr]">
        {board && (
          <div className="mx-auto w-full" style={{ maxWidth: board.orientation === "vertical" ? 260 : 420 }}>
            <BoardRenderer board={board} playerMeta={playerMeta} className="w-full" />
          </div>
        )}
        <div className="space-y-2 text-sm">
          {situation.description && <p className="text-ink">{situation.description}</p>}
          {situation.refereeInstruction && <InstrLine label="Árbitro" text={situation.refereeInstruction} />}
          {situation.assistant1Instruction && <InstrLine label="Asistente 1" text={situation.assistant1Instruction} />}
          {situation.assistant2Instruction && <InstrLine label="Asistente 2" text={situation.assistant2Instruction} />}
        </div>
      </div>
    </div>
  );
}

function InstrLine({ label, text }: { label: string; text: string }) {
  return (
    <p className="text-ink-muted">
      <span className="font-semibold text-ink">{label}:</span> {text}
    </p>
  );
}

function StyleCard({ team, style }: { team: EnrichedTeam; style: StyleFlags }) {
  return (
    <div className="card p-4">
      <h3 className="section-title mb-3">{team.shortName ?? team.name}</h3>
      <div className="grid grid-cols-2 gap-2">
        {STYLE_ITEMS.map((it) => {
          const on = style[it.key];
          return (
            <div
              key={it.key}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs ${on ? "bg-accent/10 font-medium text-accent" : "bg-gray-50 text-gray-400"}`}
            >
              {on ? <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} /> : <span className="h-3.5 w-3.5 text-center">·</span>}
              {it.label}
            </div>
          );
        })}
      </div>
      {team.playingStyle && <p className="mt-3 text-sm text-ink">{team.playingStyle}</p>}
      {team.tacticalNotes && <p className="mt-2 text-xs text-ink-muted">{team.tacticalNotes}</p>}
      {team.setPieceNotes && (
        <p className="mt-2 text-xs text-ink-muted"><span className="font-medium text-ink">Balón parado:</span> {team.setPieceNotes}</p>
      )}
    </div>
  );
}

function StaffBriefing({ team }: { team: EnrichedTeam }) {
  const coach =
    team.staff.find((s) => (s.role ?? "").toLowerCase().includes("entrenador") && !(s.role ?? "").toLowerCase().includes("segundo")) ??
    team.staff[0];
  return (
    <div className="card p-4">
      <h3 className="section-title mb-3">{team.shortName ?? team.name}</h3>
      {!coach ? (
        <p className="text-sm text-gray-400">Sin cuerpo técnico registrado.</p>
      ) : (
        <div className="flex gap-3">
          <Avatar name={coach.name} src={coach.photoUrl} size="lg" />
          <div className="min-w-0 flex-1 space-y-1 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-ink">{coach.name}</span>
              <RiskBadge level={(coach.refereeRisk as RiskLevel) ?? "LOW"} size="sm" />
            </div>
            <div className="text-xs text-ink-muted">{coach.role ?? "Entrenador"}</div>
            {coach.previousTeams && <div className="text-xs text-gray-400">Antes: {coach.previousTeams}</div>}
            <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
              <span className="chip bg-gray-100 text-ink-muted">Protesta: {PROTEST_LABELS[(coach.protestLevel as RiskLevel) ?? "LOW"]}</span>
              {coach.yellowCards > 0 && <span className="chip bg-risk-mediumtint text-risk-medium">{coach.yellowCards} amar.</span>}
              {coach.redCards > 0 && <span className="chip bg-risk-hightint text-risk-high">{coach.redCards} rojas</span>}
            </div>
            {coach.notes && <p className="text-xs text-ink-muted">{coach.notes}</p>}
          </div>
        </div>
      )}
      {team.staff.filter((s) => s !== coach && s.refereeRisk !== "LOW").map((s) => (
        <div key={s.id} className="mt-2 flex items-start gap-2 rounded-lg bg-risk-mediumtint p-2 text-xs text-risk-medium">
          <RiskIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} />
          <span><span className="font-medium">{s.name}</span> ({s.role}) — {s.notes ?? "vigilar zona técnica"}</span>
        </div>
      ))}
    </div>
  );
}
