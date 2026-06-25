import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getEnrichedTeam } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { PROTEST_LABELS, PHYSICAL_LABELS, MATCH_STATUS_LABELS, type RiskLevel, type MatchStatus, DATA_ORIGIN_LABELS } from "@/lib/enums";
import Avatar from "@/components/Avatar";
import RiskBadge from "@/components/RiskBadge";
import StatCard from "@/components/StatCard";
import SquadManager from "@/components/SquadManager";
import StaffManager from "@/components/StaffManager";
import NotesPanel from "@/components/NotesPanel";
import AlertBox from "@/components/AlertBox";

export const dynamic = "force-dynamic";

export default async function TeamDetailPage({ params }: { params: { id: string } }) {
  const team = await getEnrichedTeam(params.id);
  if (!team) notFound();

  const [allNotes, matches] = await Promise.all([
    prisma.refereeNote.findMany({
      where: { entityType: "TEAM", entityId: team.id },
      orderBy: { date: "desc" },
    }),
    prisma.match.findMany({
      where: { OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }] },
      orderBy: { date: "desc" },
      include: { homeTeam: { select: { shortName: true, name: true } }, awayTeam: { select: { shortName: true, name: true } } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <Link href="/teams" className="text-sm text-ink-muted hover:underline">
        ← Volver a equipos
      </Link>

      {/* Cabecera */}
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
          <Avatar name={team.shortName ?? team.name} src={team.crestUrl} size="xl" square />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold text-ink">{team.name}</h1>
              <RiskBadge level={team.effectiveRisk} />
              <span className="chip bg-slate-100 text-ink-muted">{DATA_ORIGIN_LABELS[team.dataOrigin] ?? team.dataOrigin}</span>
            </div>
            <p className="mt-1 text-sm text-ink-muted">
              {team.city} · {team.stadium}
              {team.stadiumAddress ? ` (${team.stadiumAddress})` : ""}
            </p>
            <p className="text-xs text-slate-400">
              {team.category} · {team.currentPosition ? `${team.currentPosition}º clasificado` : "Sin clasificación"}
              {team.seasonsInCategory ? ` · ${team.seasonsInCategory} temporadas en la categoría` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/teams/${team.id}/edit`} className="btn-ghost">
              ✏️ Editar
            </Link>
            <Link href={`/match?home=${team.id}`} className="btn-primary">
              Preparar partido
            </Link>
          </div>
        </div>
      </div>

      {/* Estadística rápida */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Posición" value={team.currentPosition ? `${team.currentPosition}º` : "—"} />
        <StatCard label="Puntos" value={team.points ?? 0} />
        <StatCard label="Goles a favor" value={team.goalsFor} tone="good" />
        <StatCard label="Goles en contra" value={team.goalsAgainst} tone="bad" />
        <StatCard label="Amarillas" value={team.yellowCards} tone="warn" />
        <StatCard label="Rojas" value={team.redCards} tone="bad" />
      </div>

      {/* Motivos de riesgo */}
      {team.riskReasons.length > 0 && (
        <AlertBox level={team.effectiveRisk === "HIGH" ? "high" : team.effectiveRisk === "MEDIUM" ? "medium" : "low"} title="Factores de riesgo detectados">
          <ul className="list-disc pl-4">
            {team.riskReasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </AlertBox>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna principal */}
        <div className="space-y-6 lg:col-span-2">
          {/* Estilo de juego */}
          <section className="card p-5">
            <h2 className="section-title mb-3">⚽ Estilo de juego y notas tácticas</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <Pill label="Protesta" value={PROTEST_LABELS[team.protestLevel as RiskLevel]} />
              <Pill label="Físico" value={PHYSICAL_LABELS[team.physicalLevel as RiskLevel]} />
              <Pill label="Edad media" value={team.avgAge ? `${team.avgAge} años` : "—"} />
            </div>
            <NoteBlock title="Estilo de juego" text={team.playingStyle} />
            <NoteBlock title="Notas tácticas" text={team.tacticalNotes} />
            <NoteBlock title="Balón parado" text={team.setPieceNotes} />
            <NoteBlock title="Para los asistentes" text={team.assistantNotes} />
            <NoteBlock title="Observaciones generales" text={team.generalNotes} />
          </section>

          {/* Plantilla (añadir/editar/borrar a mano) */}
          <SquadManager teamId={team.id} players={team.players} />

          {/* Cuerpo técnico (añadir/editar/borrar a mano) */}
          <StaffManager teamId={team.id} staff={team.staff} />
        </div>

        {/* Columna lateral */}
        <div className="space-y-6">
          <NotesPanel entityType="TEAM" entityId={team.id} notes={allNotes} />

          {/* Historial de partidos */}
          <section className="card p-4">
            <h3 className="section-title mb-3 text-base">📅 Partidos arbitrados / programados</h3>
            {matches.length === 0 ? (
              <p className="text-sm text-slate-400">Sin partidos registrados.</p>
            ) : (
              <ul className="space-y-2">
                {matches.map((m) => (
                  <li key={m.id} className="rounded-lg bg-slate-50 p-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-ink">
                        {m.homeTeam.shortName ?? m.homeTeam.name} - {m.awayTeam.shortName ?? m.awayTeam.name}
                      </span>
                      <span className="chip bg-white text-ink-muted">{MATCH_STATUS_LABELS[m.status as MatchStatus] ?? m.status}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {m.round} · {formatDate(m.date)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="font-semibold text-ink">{value}</div>
    </div>
  );
}

function NoteBlock({ title, text }: { title: string; text?: string | null }) {
  if (!text) return null;
  return (
    <div className="mt-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{title}</div>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  );
}
