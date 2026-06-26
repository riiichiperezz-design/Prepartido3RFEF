import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getEnrichedTeams } from "@/lib/data";
import { RISK_ORDER } from "@/lib/risk";
import { formatDate } from "@/lib/format";
import { NOTE_TYPE_LABELS, type NoteType } from "@/lib/enums";
import RiskBadge from "@/components/RiskBadge";
import Avatar from "@/components/Avatar";
import {
  BriefingIcon,
  TargetIcon,
  ClockIcon,
  GoalIcon,
  CardsIcon,
  RiskIcon,
  NoteIcon,
  ForwardIcon,
  ChevronRightIcon,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [teams, nextMatch, topScorers, topCards, topReds, recentNotes] = await Promise.all([
    getEnrichedTeams(),
    prisma.match.findFirst({
      where: { status: { not: "REFEREED" } },
      orderBy: { date: "asc" },
      include: { homeTeam: true, awayTeam: true },
    }),
    prisma.player.findMany({ where: { goals: { gt: 0 } }, orderBy: { goals: "desc" }, take: 5, include: { team: { select: { shortName: true, name: true } } } }),
    prisma.player.findMany({ where: { yellowCards: { gt: 0 } }, orderBy: [{ yellowCards: "desc" }, { redCards: "desc" }], take: 5, include: { team: { select: { shortName: true, name: true } } } }),
    prisma.player.findMany({ where: { redCards: { gt: 0 } }, orderBy: { redCards: "desc" }, take: 5, include: { team: { select: { shortName: true, name: true } } } }),
    prisma.refereeNote.findMany({ orderBy: { date: "desc" }, take: 6 }),
  ]);

  const playersByRisk = teams
    .flatMap((t) => t.players.map((p) => ({ p, team: t.shortName ?? t.name })))
    .filter(({ p }) => RISK_ORDER[p.effectiveRisk] >= RISK_ORDER.MEDIUM)
    .sort((a, b) => RISK_ORDER[b.p.effectiveRisk] - RISK_ORDER[a.p.effectiveRisk])
    .slice(0, 5);
  const teamsByRisk = [...teams].sort((a, b) => RISK_ORDER[b.effectiveRisk] - RISK_ORDER[a.effectiveRisk]).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Tercera Federación · Grupo 14 · Extremadura</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Panel de control</h1>
      </div>

      {/* Próximo partido */}
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink-line px-5 py-2.5">
          <span className="eyebrow">Próximo partido</span>
          {nextMatch?.round && <span className="text-xs text-ink-muted">{nextMatch.round}</span>}
        </div>
        {nextMatch ? (
          <div className="flex flex-col items-center gap-5 p-5 md:flex-row md:justify-between">
            <div className="flex items-center gap-5">
              <TeamMini name={nextMatch.homeTeam.shortName ?? nextMatch.homeTeam.name} crest={nextMatch.homeTeam.crestUrl} />
              <span className="text-sm font-medium text-gray-400">vs</span>
              <TeamMini name={nextMatch.awayTeam.shortName ?? nextMatch.awayTeam.name} crest={nextMatch.awayTeam.crestUrl} />
            </div>
            <div className="text-center md:text-right">
              <div className="text-sm font-medium text-ink">{formatDate(nextMatch.date)}</div>
              <div className="text-xs text-ink-muted">{nextMatch.stadium}</div>
            </div>
            <Link
              href={`/match/briefing?home=${nextMatch.homeTeamId}&away=${nextMatch.awayTeamId}&round=${encodeURIComponent(nextMatch.round ?? "")}&date=${nextMatch.date?.toISOString() ?? ""}`}
              className="btn-primary"
            >
              Ver briefing
              <ForwardIcon className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        ) : (
          <div className="p-5 text-sm text-ink-muted">No hay partidos programados. Prepara uno nuevo.</div>
        )}
      </section>

      {/* Accesos rápidos */}
      <div className="grid gap-3 sm:grid-cols-3">
        <QuickAction href="/match" Icon={BriefingIcon} title="Preparar briefing" desc="Genera el dossier del partido" accent />
        <QuickAction href="/tactics" Icon={TargetIcon} title="Crear situación táctica" desc="Pizarra y campo táctico" />
        <QuickAction href="/weekly" Icon={ClockIcon} title="Actualizar jornada" desc="Datos rápidos de la semana" />
      </div>

      {/* Rankings de jugadores */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RankCard title="Máximos goleadores" Icon={GoalIcon} rows={topScorers.map((p) => ({ name: p.name, team: p.team.shortName ?? p.team.name, value: p.goals, id: p.id }))} unit="goles" />
        <RankCard title="Más amonestados" Icon={CardsIcon} rows={topCards.map((p) => ({ name: p.name, team: p.team.shortName ?? p.team.name, value: p.yellowCards, id: p.id }))} unit="amar." tone="warn" />
        <RankCard title="Más expulsiones" Icon={CardsIcon} rows={topReds.map((p) => ({ name: p.name, team: p.team.shortName ?? p.team.name, value: p.redCards, id: p.id }))} unit="rojas" tone="bad" />
      </div>

      {/* Riesgo + notas */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-4">
          <Header Icon={RiskIcon} title="Equipos con más riesgo" />
          <ul className="mt-3 space-y-2">
            {teamsByRisk.map((t) => (
              <li key={t.id} className="flex items-center justify-between text-sm">
                <Link href={`/teams/${t.id}`} className="text-ink hover:underline">{t.shortName ?? t.name}</Link>
                <RiskBadge level={t.effectiveRisk} size="sm" />
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-4">
          <Header Icon={RiskIcon} title="Jugadores a vigilar" />
          <ul className="mt-3 space-y-2">
            {playersByRisk.length === 0 && <li className="text-sm text-gray-400">Sin jugadores de riesgo medio/alto.</li>}
            {playersByRisk.map(({ p, team }) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <Link href={`/players/${p.id}`} className="min-w-0 hover:underline">
                  <span className="block truncate text-ink">{p.name}</span>
                  <span className="block text-xs text-gray-400">{team}</span>
                </Link>
                <RiskBadge level={p.effectiveRisk} size="sm" />
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-4">
          <Header Icon={NoteIcon} title="Últimas notas" />
          {recentNotes.length === 0 ? (
            <p className="mt-3 text-sm text-gray-400">Aún no has añadido notas.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {recentNotes.map((n) => (
                <li key={n.id} className="rounded-lg bg-gray-50 p-2 text-xs">
                  <span className="chip bg-ink text-white">{NOTE_TYPE_LABELS[n.type as NoteType] ?? n.type}</span>
                  <p className="mt-1 line-clamp-2 text-ink-muted">{n.text}</p>
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
    <div className="flex flex-col items-center gap-1.5">
      <Avatar name={name} src={crest} size="lg" square variant="team" />
      <span className="text-sm font-medium text-ink">{name}</span>
    </div>
  );
}

function QuickAction({ href, Icon, title, desc, accent }: { href: string; Icon: typeof BriefingIcon; title: string; desc: string; accent?: boolean }) {
  return (
    <Link href={href} className="card card-hover flex items-center gap-3 p-4">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent ? "bg-accent text-white" : "bg-gray-100 text-ink"}`}>
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <div className="text-sm font-medium text-ink">{title}</div>
        <div className="truncate text-xs text-ink-muted">{desc}</div>
      </div>
      <ChevronRightIcon className="ml-auto h-4 w-4 text-gray-300" />
    </Link>
  );
}

function Header({ Icon, title }: { Icon: typeof RiskIcon; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-ink-muted" strokeWidth={2} />
      <h3 className="section-title">{title}</h3>
    </div>
  );
}

function RankCard({ title, Icon, rows, unit, tone }: { title: string; Icon: typeof GoalIcon; rows: { name: string; team: string; value: number; id: string }[]; unit: string; tone?: "warn" | "bad" }) {
  const color = tone === "warn" ? "text-risk-medium" : tone === "bad" ? "text-risk-high" : "text-ink";
  return (
    <div className="card p-4">
      <Header Icon={Icon} title={title} />
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-gray-400">Sin datos.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {rows.map((r, i) => (
            <li key={r.id} className="flex items-center justify-between text-sm">
              <Link href={`/players/${r.id}`} className="flex min-w-0 items-center gap-2 hover:underline">
                <span className="w-4 text-gray-400">{i + 1}</span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{r.name}</span>
                  <span className="block text-xs text-gray-400">{r.team}</span>
                </span>
              </Link>
              <span className={`font-semibold ${color}`}>
                {r.value} <span className="text-xs font-normal text-gray-400">{unit}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
