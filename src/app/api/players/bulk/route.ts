import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toInt } from "@/lib/format";

/**
 * Alta en bloque de jugadores (pegar plantilla). Recibe una lista ya parseada
 * en el navegador. No duplica: si ya existe un jugador con ese nombre en el
 * equipo, lo omite (no toca sus datos ni notas).
 */
export async function POST(req: NextRequest) {
  const { teamId, players } = await req.json();
  if (!teamId || !Array.isArray(players)) {
    return NextResponse.json({ error: "Faltan datos." }, { status: 400 });
  }

  const existing = await prisma.player.findMany({ where: { teamId }, select: { name: true } });
  const have = new Set(existing.map((p) => p.name.trim().toLowerCase()));

  let created = 0;
  let skipped = 0;
  for (const p of players as { name?: string; dorsal?: number | string; position?: string }[]) {
    const name = (p.name ?? "").trim();
    if (!name) continue;
    if (have.has(name.toLowerCase())) {
      skipped++;
      continue;
    }
    await prisma.player.create({
      data: {
        teamId,
        name,
        dorsal: p.dorsal ? toInt(p.dorsal) : null,
        position: p.position || null,
        dataOrigin: "MANUAL",
      },
    });
    have.add(name.toLowerCase());
    created++;
  }

  return NextResponse.json({ ok: true, created, skipped });
}
