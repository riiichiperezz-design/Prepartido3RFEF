import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Guarda las instrucciones para asistentes de un partido.
 * Busca un partido existente con esos equipos (y fecha si se indica) o lo crea.
 * Al guardar, el partido pasa a estado PREPARED.
 */
export async function POST(req: NextRequest) {
  const { home, away, date, round, instructions } = await req.json();
  if (!home || !away) {
    return NextResponse.json({ error: "Faltan equipos." }, { status: 400 });
  }

  const dateObj = date ? new Date(date) : null;

  let match = await prisma.match.findFirst({
    where: { homeTeamId: home, awayTeamId: away, ...(dateObj ? { date: dateObj } : {}) },
  });

  if (!match) {
    match = await prisma.match.create({
      data: {
        homeTeamId: home,
        awayTeamId: away,
        date: dateObj,
        round: round || null,
        status: "PREPARED",
        assistantInstructions: JSON.stringify(instructions),
      },
    });
  } else {
    match = await prisma.match.update({
      where: { id: match.id },
      data: {
        status: match.status === "REFEREED" ? "REFEREED" : "PREPARED",
        round: round || match.round,
        assistantInstructions: JSON.stringify(instructions),
      },
    });
  }

  return NextResponse.json({ ok: true, matchId: match.id });
}
