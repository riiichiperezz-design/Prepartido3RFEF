import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getEnrichedTeams } from "@/lib/data";
import { RISK_ORDER } from "@/lib/risk";
import { formatDate } from "@/lib/format";
import { NOTE_TYPE_LABELS, type NoteType } from "@/lib/enums";
import RiskBadge from "@/components/RiskBadge";
import Avatar from "@/components/Avatar";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [teams, nextMatch, topScorers, topCards, topReds, recentNotes] = await Promise.all([
    getEnrichedTeams(),
    prisma.match.findFirst({
      where: { status: { not: "REFEREED" } },
      orderBy: { date: "asc" },
      include: { homeTeam: true, awayTeam: true },
    }),
    prisma.player.findMany({
      where: { goals: { gt: 0 } },
      orderBy: { goals: "desc" },
      take: 5,
      include: { team: { select: { shortName: true, name: true } } },
    }),
    prisma.player.findMany({
      where: { yellowCards: { gt: 0 } },
      orderBy: [{ yellowCards: "desc" }, { redCards: "desc" }],
      take: 5,
      include: { team: { select: { shortName: true, name: true } } },
    }),
    prisma.player.findMany({
      where: { redCards: { gt: 0 } },
      orderBy: { redCards: "desc" },
      take: 5,
      include: { team: { select: { shortName: true, name: true } } },
    }),
    prisma.refereeNote.findMany({ orderBy: { date: "desc" }, take: 6 }),
  ]);

  const teamsByCards = [...teams].sort((a, b) => b.yellowCards + b.redCards * 2 - (a.yellowCards + a.redCards * 2)).slice(0, 5);
  const teamsByRisk = [...teams]
    .sort((a, b) => RISK_ORDER[b.effectiveRisk] - RISK_ORDER[a.effectiveRisk])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Cabecera + CTA */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Panel del árbitro</h1>
          <p className="text-sm text-ink-muted">
            Tercera Federación · Grupo 14 (Extremadura) · {teams.length} equipos
          </p>
        </div>
        <Link href="/match" className="btn-accent px-6 py-3 text-base shadow-card">
          📋 Preparar partido
        </Link>
      </div>

      {/* Próximo partido */}
      <section className="card overflow-hidden">
        <div className="bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-widest text-pitch-500">
          Próximo partido
        </div>
        {nextMatch ? (
          <div className="flex flex-col items-center gap-4 p-5 md:flex-row md:justify-between">
            <div className="flex items-center gap-4">
              <TeamMini name={nextMatch.homeTeam.shortName ?? nextMatch.homeTeam.name} crest={nextMatch.homeTeam.crestUrl} />
              <span className="text-lg font-bold text-ink-muted">vs</span>
              <TeamMini name={nextMatch.awayTeam.shortName ?? nextMatch.awayTeam.name} crest={nextMatch.awayTeam.crestUrl} />
            </div>
            <div className="text-center md:text-right">
              <div className="font-semibold text-ink">{nextMatch.round ?? "Jornada"}</div>
              <div className="text-sm text-ink-muted">{formatDate(nextMatch.date)}</div>
              <div className="text-xs text-slate-400">{nextMatch.stadium}</div>
            </div>
            <Link
              href={`/match/briefing?home=${nextMatch.homeTeamId}&away=${nextMatch.awayTeamId}&round=${encodeURIComponent(nextMatch.round ?? "")}&date=${nextMatch.date?.toISOString() ?? ""}`}
              className="btn-primary"
            >
              Ver briefing →
            </Link>
          </div>
        ) : (
          <div className="p-5 text-sm text-ink-muted">No hay partidos programados. Prepara uno nuevo.</div>
        )}
      </section>

      {/* Rankings de jugadores */}
      <div className="grid gap-4 md:grid-cols-3">
        <RankCard title="⚽ Máximos goleadores" rows={topScorers.map((p) => ({ name: p.name, team: p.team.shortName ?? p.team.name, value: p.goals, id: p.id }))} unit="goles" />
        <RankCard title="🟨 Más amonestados" rows={topCards.map((p) => ({ name: p.name, team: p.team.shortName ?? p.team.name, value: p.yellowCards, id: p.id }))} unit="amar." tone="warn" />
        <RankCard title="🟥 Más expulsiones" rows={topReds.map((p) => ({ name: p.name, team: p.team.shortName ?? p.team.name, value: p.redCards, id: p.id }))} unit="rojas" tone="bad" />
      </div>

      {/* Rankings de equipos + notas */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-4">
          <h3 className="section-title mb-3 text-base">🟨 Equipos con más tarjetas</h3>
          <ul className="space-y-2">
            {teamsByCards.map((t, i) => (
              <li key={t.id} className="flex items-center justify-between text-sm">
                <Link href={`/teams/${t.id}`} className="flex items-center gap-2 hover:underline">
                  <span className="w-5 text-slate-400">{i + 1}.</span>
                  {t.shortName ?? t.name}
                </Link>
                <span className="font-semibold text-amber-600">
                  {t.yellowCards}🟨 {t.redCards}🟥
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-4">
          <h3 className="section-title mb-3 text-base">🚨 Mayor riesgo arbitral</h3>
          <ul className="space-y-2">
            {teamsByRisk.map((t) => (
              <li key={t.id} className="flex items-center justify-between text-sm">
                <Link href={`/teams/${t.id}`} className="hover:underline">
                  {t.shortName ?? t.name}
                </Link>
                <RiskBadge level={t.effectiveRisk} size="sm" />
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-4">
          <h3 className="section-title mb-3 text-base">📝 Últimas notas</h3>
          {recentNotes.length === 0 ? (
            <p className="text-sm text-slate-400">Aún no has añadido notas.</p>
          ) : (
            <ul className="space-y-2">
              {recentNotes.map((n) => (
                <li key={n.id} className="rounded-lg bg-slate-50 p-2 text-xs">
                  <span className="chip bg-ink text-white">{NOTE_TYPE_LABELS[n.type as NoteType] ?? n.type}</span>
                  <p className="mt-1 line-clamp-2 text-slate-600">{n.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function TeamMini({ name, crest }: { name: string; crest?: string | null }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Avatar name={name} src={crest} size="lg" square />
      <span className="text-sm font-semibold text-ink">{name}</span>
    </div>
  );
}

function RankCard({
  title,
  rows,
  unit,
  tone,
}: {
  title: string;
  rows: { name: string; team: string; value: number; id: string }[];
  unit: string;
  tone?: "warn" | "bad";
}) {
  const color = tone === "warn" ? "text-amber-600" : tone === "bad" ? "text-red-600" : "text-pitch-700";
  return (
    <div className="card p-4">
      <h3 className="section-title mb-3 text-base">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-400">Sin datos.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r, i) => (
            <li key={r.id} className="flex items-center justify-between text-sm">
              <Link href={`/players/${r.id}`} className="flex min-w-0 items-center gap-2 hover:underline">
                <span className="w-5 text-slate-400">{i + 1}.</span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{r.name}</span>
                  <span className="block text-xs text-slate-400">{r.team}</span>
                </span>
              </Link>
              <span className={`font-bold ${color}`}>
                {r.value} <span className="text-xs font-normal text-slate-400">{unit}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
