import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toInt, normalizeLevel } from "@/lib/format";

/** Actualiza un miembro del cuerpo técnico. */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const b = await req.json();
  const updated = await prisma.staffMember.update({
    where: { id: params.id },
    data: {
      name: b.name,
      role: b.role || null,
      photoUrl: b.photoUrl || null,
      previousTeams: b.previousTeams || null,
      yellowCards: toInt(b.yellowCards),
      redCards: toInt(b.redCards),
      protestLevel: normalizeLevel(b.protestLevel),
      refereeRisk: normalizeLevel(b.refereeRisk),
      notes: b.notes || null,
    },
  });
  return NextResponse.json(updated);
}

/** Elimina un miembro del cuerpo técnico y sus notas. */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.refereeNote.deleteMany({ where: { entityType: "STAFF", entityId: params.id } });
  await prisma.staffMember.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
