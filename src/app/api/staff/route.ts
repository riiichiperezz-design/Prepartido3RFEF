import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toInt, normalizeLevel } from "@/lib/format";

/** Crea un miembro del cuerpo técnico (edición manual). */
export async function POST(req: NextRequest) {
  const b = await req.json();
  if (!b.teamId || !b.name?.trim()) {
    return NextResponse.json({ error: "Faltan equipo o nombre." }, { status: 400 });
  }
  const staff = await prisma.staffMember.create({
    data: {
      teamId: b.teamId,
      name: b.name.trim(),
      role: b.role || null,
      photoUrl: b.photoUrl || null,
      previousTeams: b.previousTeams || null,
      yellowCards: toInt(b.yellowCards),
      redCards: toInt(b.redCards),
      protestLevel: normalizeLevel(b.protestLevel),
      refereeRisk: normalizeLevel(b.refereeRisk),
      notes: b.notes || null,
      dataOrigin: "MANUAL",
    },
  });
  return NextResponse.json(staff);
}
