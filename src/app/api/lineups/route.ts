import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Lista las alineaciones de un equipo. */
export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("teamId");
  const lineups = await prisma.lineup.findMany({
    where: teamId ? { teamId } : {},
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(lineups);
}

/** Crea o actualiza una alineación (la pizarra se guarda como JSON en fieldData). */
export async function POST(req: NextRequest) {
  const b = await req.json();
  if (!b.name?.trim() || !b.fieldData) {
    return NextResponse.json({ error: "Faltan datos." }, { status: 400 });
  }
  const data = {
    teamId: b.teamId || null,
    matchId: b.matchId || null,
    name: b.name.trim(),
    formation: b.formation || "4-4-2",
    fieldData: typeof b.fieldData === "string" ? b.fieldData : JSON.stringify(b.fieldData),
    source: b.source || "SELF",
    notes: b.notes || null,
  };

  const lineup = b.id
    ? await prisma.lineup.update({ where: { id: b.id }, data })
    : await prisma.lineup.create({ data });

  // Sincroniza las posiciones de jugadores reales (tabla PlayerFieldPosition)
  try {
    const board = JSON.parse(data.fieldData);
    await prisma.playerFieldPosition.deleteMany({ where: { lineupId: lineup.id } });
    const positions = (board.players ?? [])
      .filter((p: { playerId?: string }) => p.playerId)
      .map((p: { playerId: string; x: number; y: number; role?: string }) => ({
        lineupId: lineup.id,
        playerId: p.playerId,
        x: p.x,
        y: p.y,
        role: p.role ?? null,
      }));
    if (positions.length) await prisma.playerFieldPosition.createMany({ data: positions });
  } catch {
    /* fieldData no parseable: se ignora la sincronización de posiciones */
  }

  return NextResponse.json(lineup);
}

/** Elimina una alineación. */
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta id." }, { status: 400 });
  await prisma.lineup.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
