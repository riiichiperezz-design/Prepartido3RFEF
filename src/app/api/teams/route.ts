import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toInt, normalizeLevel } from "@/lib/format";

/** Crea un equipo nuevo (edición manual). */
export async function POST(req: NextRequest) {
  const b = await req.json();
  if (!b.name?.trim()) {
    return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 });
  }

  // Asocia el equipo a la competición existente (si la hay).
  const competition = await prisma.competition.findFirst();

  const team = await prisma.team.create({
    data: {
      competitionId: competition?.id ?? null,
      name: b.name.trim(),
      shortName: b.shortName || null,
      crestUrl: b.crestUrl || null,
      city: b.city || null,
      stadium: b.stadium || null,
      stadiumAddress: b.stadiumAddress || null,
      category: "Tercera Federación",
      currentPosition: b.currentPosition ? toInt(b.currentPosition) : null,
      points: toInt(b.points),
      goalsFor: toInt(b.goalsFor),
      goalsAgainst: toInt(b.goalsAgainst),
      yellowCards: toInt(b.yellowCards),
      redCards: toInt(b.redCards),
      protestLevel: normalizeLevel(b.protestLevel),
      physicalLevel: normalizeLevel(b.physicalLevel),
      refereeRisk: ["LOW", "MEDIUM", "HIGH"].includes(b.refereeRisk) ? b.refereeRisk : "AUTO",
      playingStyle: b.playingStyle || null,
      tacticalNotes: b.tacticalNotes || null,
      setPieceNotes: b.setPieceNotes || null,
      assistantNotes: b.assistantNotes || null,
      generalNotes: b.generalNotes || null,
      dataOrigin: "MANUAL",
    },
  });
  return NextResponse.json(team);
}
