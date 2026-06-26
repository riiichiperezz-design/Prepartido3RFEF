import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toInt } from "@/lib/format";

/** Lista las últimas actualizaciones semanales (opcionalmente por equipo). */
export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("teamId");
  const updates = await prisma.weeklyUpdate.findMany({
    where: teamId ? { teamId } : {},
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  return NextResponse.json(updates);
}

/**
 * Guardado en bloque de la jornada: actualiza estadísticas de jugadores y del
 * equipo de una sola vez y registra la actualización semanal. Pensado para ser
 * rápido (una sola petición).
 */
export async function POST(req: NextRequest) {
  const b = await req.json();
  if (!b.teamId || !b.week?.trim()) {
    return NextResponse.json({ error: "Faltan equipo o jornada." }, { status: 400 });
  }

  // Jugadores (solo estadística; nunca toca notas/etiquetas/riesgo manual)
  const players: { id: string; goals: number; yellowCards: number; redCards: number; minutes: number; matches: number }[] = b.players ?? [];
  for (const p of players) {
    await prisma.player.update({
      where: { id: p.id },
      data: {
        goals: toInt(p.goals),
        yellowCards: toInt(p.yellowCards),
        redCards: toInt(p.redCards),
        minutes: toInt(p.minutes),
        matches: toInt(p.matches),
      },
    });
  }

  // Equipo (clasificación y tarjetas agregadas)
  if (b.team) {
    await prisma.team.update({
      where: { id: b.teamId },
      data: {
        points: toInt(b.team.points),
        currentPosition: b.team.currentPosition ? toInt(b.team.currentPosition) : null,
        goalsFor: toInt(b.team.goalsFor),
        goalsAgainst: toInt(b.team.goalsAgainst),
        yellowCards: toInt(b.team.yellowCards),
        redCards: toInt(b.team.redCards),
      },
    });
  }

  // Registro de la actualización semanal
  const update = await prisma.weeklyUpdate.create({
    data: {
      week: b.week.trim(),
      season: b.season || null,
      teamId: b.teamId,
      notes: b.notes || null,
    },
  });

  // Nota de comportamiento (opcional) como nota arbitral del equipo
  if (b.behaviourNote?.trim()) {
    await prisma.refereeNote.create({
      data: {
        entityType: "TEAM",
        entityId: b.teamId,
        teamId: b.teamId,
        type: "BEHAVIOUR",
        importance: "MEDIUM",
        text: `[${b.week.trim()}] ${b.behaviourNote.trim()}`,
        source: "SELF",
        showInBriefing: false,
      },
    });
  }

  return NextResponse.json({ ok: true, id: update.id, playersUpdated: players.length });
}
