import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enrichPlayer } from "@/lib/data";

/** Devuelve los jugadores de un equipo en el formato que usa la pizarra. */
export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("teamId");
  if (!teamId) return NextResponse.json([]);

  const players = await prisma.player.findMany({
    where: { teamId },
    orderBy: [{ dorsal: "asc" }, { name: "asc" }],
  });

  const result = players.map((p) => {
    const e = enrichPlayer(p);
    return {
      id: p.id,
      name: p.name,
      shortName: p.name.split(" ")[0],
      photoUrl: p.photoUrl,
      dorsal: p.dorsal,
      age: p.age,
      position: p.position,
      matches: p.matches,
      minutes: p.minutes,
      goals: p.goals,
      yellowCards: p.yellowCards,
      redCards: p.redCards,
      behaviourTags: p.behaviourTags,
      effectiveRisk: e.effectiveRisk,
      notes: p.notes,
    };
  });
  return NextResponse.json(result);
}
