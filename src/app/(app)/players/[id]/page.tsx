import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { enrichPlayer } from "@/lib/data";
import { POSITION_LABELS, FOOT_LABELS, type Position } from "@/lib/enums";
import { parseList } from "@/lib/format";
import Avatar from "@/components/Avatar";
import RiskBadge from "@/components/RiskBadge";
import StatCard from "@/components/StatCard";
import AlertBox from "@/components/AlertBox";
import NotesPanel from "@/components/NotesPanel";

export const dynamic = "force-dynamic";

export default async function PlayerDetailPage({ params }: { params: { id: string } }) {
  const player = await prisma.player.findUnique({
    where: { id: params.id },
    include: { team: true },
  });
  if (!player) notFound();

  const notes = await prisma.refereeNote.findMany({
    where: { entityType: "PLAYER", entityId: player.id },
    orderBy: { date: "desc" },
  });
  const hasImportantNote = notes.some((n) => n.importance === "HIGH" && n.showInBriefing);
  const enriched = enrichPlayer(player, hasImportantNote);
  const tags = parseList(player.behaviourTags);

  return (
    <div className="space-y-6">
      <Link href={`/teams/${player.teamId}`} className="text-sm text-ink-muted hover:underline">
        ← {player.team.name}
      </Link>

      <div className="card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar name={player.name} src={player.photoUrl} size="xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold text-ink">{player.name}</h1>
              {player.dorsal != null && <span className="chip bg-ink text-white">Dorsal {player.dorsal}</span>}
              <RiskBadge level={enriched.effectiveRisk} />
            </div>
            <p className="mt-1 text-sm text-ink-muted">
              {player.team.name}
              {player.position ? ` · ${POSITION_LABELS[player.position as Position] ?? player.position}` : ""}
              {player.age ? ` · ${player.age} años` : ""}
              {player.dominantFoot ? ` · ${FOOT_LABELS[player.dominantFoot] ?? player.dominantFoot}` : ""}
            </p>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {tags.map((t) => (
                  <span key={t} className="chip bg-slate-100 text-ink-muted">{t}</span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Link href={`/players/${player.id}/edit`} className="btn-ghost">
              ✏️ Editar
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Partidos" value={player.matches} />
        <StatCard label="Minutos" value={player.minutes} />
        <StatCard label="Goles" value={player.goals} tone="good" />
        <StatCard label="Asistencias" value={player.assists} />
        <StatCard label="Amarillas" value={player.yellowCards} tone="warn" />
        <StatCard label="Rojas" value={player.redCards} tone="bad" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {enriched.riskReasons.length > 0 && (
            <AlertBox
              level={enriched.effectiveRisk === "HIGH" ? "high" : enriched.effectiveRisk === "MEDIUM" ? "medium" : "low"}
              title="¿Por qué este nivel de riesgo?"
            >
              <ul className="list-disc pl-4">
                {enriched.riskReasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </AlertBox>
          )}

          <div className="card p-5">
            <h2 className="section-title mb-3">Histórico disciplinario</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="🟨 Esta temp." value={player.yellowCards} tone="warn" />
              <StatCard label="🟥 Esta temp." value={player.redCards} tone="bad" />
              <StatCard label="🟨 Temp. anterior" value={player.previousSeasonYellowCards} />
              <StatCard label="🟥 Temp. anterior" value={player.previousSeasonRedCards} />
            </div>
          </div>

          {player.notes && (
            <div className="card p-5">
              <h2 className="section-title mb-2">Observación de ficha</h2>
              <p className="text-sm text-slate-700">{player.notes}</p>
            </div>
          )}
        </div>

        <div>
          <NotesPanel entityType="PLAYER" entityId={player.id} notes={notes} />
        </div>
      </div>
    </div>
  );
}
