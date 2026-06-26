import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getEnrichedTeam } from "@/lib/data";
import {
  deriveStyle,
  selectKeyPlayers,
  buildAlerts,
  buildExecutiveSummary,
  globalRisk,
} from "@/lib/briefing";
import MatchBriefing from "@/components/MatchBriefing";
import type { Instructions } from "@/components/AssistantInstructions";

export const dynamic = "force-dynamic";

export default async function BriefingPage({
  searchParams,
}: {
  searchParams: { home?: string; away?: string; date?: string; round?: string };
}) {
  const { home: homeId, away: awayId, date, round } = searchParams;

  if (!homeId || !awayId) {
    return <InvalidSelection message="Faltan equipos. Vuelve a elegir el partido." />;
  }

  const [home, away] = await Promise.all([getEnrichedTeam(homeId), getEnrichedTeam(awayId)]);
  if (!home || !away) {
    return <InvalidSelection message="No se han encontrado los equipos seleccionados." />;
  }

  // Notas importantes por jugador (para destacarlas en jugadores clave)
  const playerIds = [...home.players, ...away.players].map((p) => p.id);
  const playerNotes = await prisma.refereeNote.findMany({
    where: { entityType: "PLAYER", entityId: { in: playerIds }, importance: "HIGH", showInBriefing: true },
    orderBy: { date: "desc" },
  });
  const notesMap = new Map<string, string>();
  for (const n of playerNotes) {
    if (!notesMap.has(n.entityId)) notesMap.set(n.entityId, n.text);
  }

  const homeKey = selectKeyPlayers(home, notesMap);
  const awayKey = selectKeyPlayers(away, notesMap);
  const homeStyle = deriveStyle(home);
  const awayStyle = deriveStyle(away);
  const alerts = buildAlerts(home, away, homeKey, awayKey);
  const executiveSummary = buildExecutiveSummary(home, away, alerts);

  // Instrucciones previas guardadas (si existe el partido)
  const existing = await prisma.match.findFirst({
    where: { homeTeamId: homeId, awayTeamId: awayId, ...(date ? { date: new Date(date) } : {}) },
  });
  let initialInstructions: Partial<Instructions> | undefined;
  if (existing?.assistantInstructions) {
    try {
      initialInstructions = JSON.parse(existing.assistantInstructions);
    } catch {
      initialInstructions = undefined;
    }
  }

  return (
    <MatchBriefing
      home={home}
      away={away}
      homeKey={homeKey}
      awayKey={awayKey}
      homeStyle={homeStyle}
      awayStyle={awayStyle}
      alerts={alerts}
      executiveSummary={executiveSummary}
      globalRisk={globalRisk(home, away)}
      date={date}
      round={round}
      stadium={existing?.stadium ?? home.stadium ?? undefined}
      referee={existing?.referee ?? undefined}
      assistant1={existing?.assistant1 ?? undefined}
      assistant2={existing?.assistant2 ?? undefined}
      initialInstructions={initialInstructions}
    />
  );
}

function InvalidSelection({ message }: { message: string }) {
  return (
    <div className="card p-8 text-center">
      <p className="text-ink-muted">{message}</p>
      <Link href="/match" className="btn-primary mt-4 inline-flex">
        Ir a preparar partido
      </Link>
    </div>
  );
}
