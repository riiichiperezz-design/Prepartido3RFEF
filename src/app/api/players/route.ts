import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toInt } from "@/lib/format";

/** Crea un jugador en un equipo (edición manual). */
export async function POST(req: NextRequest) {
  const b = await req.json();
  if (!b.teamId || !b.name?.trim()) {
    return NextResponse.json({ error: "Faltan equipo o nombre." }, { status: 400 });
  }
  const player = await prisma.player.create({
    data: {
      teamId: b.teamId,
      name: b.name.trim(),
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
      dataOrigin: "MANUAL",
    },
  });
  return NextResponse.json(player);
}
