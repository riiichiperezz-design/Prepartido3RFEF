import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toInt } from "@/lib/format";

/** Actualiza un jugador. No afecta a sus notas arbitrales (tabla aparte). */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const b = await req.json();
  const updated = await prisma.player.update({
    where: { id: params.id },
    data: {
      name: b.name,
      photoUrl: b.photoUrl || null,
      dorsal: b.dorsal ? toInt(b.dorsal) : null,
      age: b.age ? toInt(b.age) : null,
      position: b.position || null,
      dominantFoot: b.dominantFoot || null,
      matches: toInt(b.matches),
      minutes: toInt(b.minutes),
      goals: toInt(b.goals),
      assists: toInt(b.assists),
      yellowCards: toInt(b.yellowCards),
      redCards: toInt(b.redCards),
      previousSeasonYellowCards: toInt(b.previousSeasonYellowCards),
      previousSeasonRedCards: toInt(b.previousSeasonRedCards),
      behaviourTags: b.behaviourTags || null,
      refereeRisk: ["LOW", "MEDIUM", "HIGH"].includes(b.refereeRisk) ? b.refereeRisk : "AUTO",
      notes: b.notes || null,
    },
  });
  return NextResponse.json(updated);
}

/** Elimina un jugador y sus notas asociadas. */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.refereeNote.deleteMany({ where: { entityType: "PLAYER", entityId: params.id } });
  await prisma.player.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
