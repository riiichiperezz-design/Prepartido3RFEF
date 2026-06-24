import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toInt, normalizeLevel } from "@/lib/format";

/**
 * Actualiza los datos de un equipo.
 * IMPORTANTE: solo toca campos del propio equipo; las notas arbitrales viven en
 * otra tabla y nunca se ven afectadas por esta edición.
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const b = await req.json();
  const updated = await prisma.team.update({
    where: { id: params.id },
    data: {
      name: b.name,
      shortName: b.shortName || null,
      crestUrl: b.crestUrl || null,
      city: b.city || null,
      stadium: b.stadium || null,
      stadiumAddress: b.stadiumAddress || null,
      currentPosition: b.currentPosition ? toInt(b.currentPosition) : null,
      points: toInt(b.points),
      goalsFor: toInt(b.goalsFor),
      goalsAgainst: toInt(b.goalsAgainst),
      yellowCards: toInt(b.yellowCards),
      redCards: toInt(b.redCards),
      protestLevel: normalizeLevel(b.protestLevel),
      physicalLevel: normalizeLevel(b.physicalLevel),
      // "AUTO" = sin override manual (se usará el riesgo calculado).
      refereeRisk: ["LOW", "MEDIUM", "HIGH"].includes(b.refereeRisk) ? b.refereeRisk : "AUTO",
      playingStyle: b.playingStyle || null,
      tacticalNotes: b.tacticalNotes || null,
      setPieceNotes: b.setPieceNotes || null,
      assistantNotes: b.assistantNotes || null,
      generalNotes: b.generalNotes || null,
    },
  });
  return NextResponse.json(updated);
}
