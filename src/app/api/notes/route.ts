import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Crea una nota arbitral asociada a una entidad (equipo, jugador, staff, partido). */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { entityType, entityId, type, importance, text, showInBriefing, tags, source } = body;

  if (!entityType || !entityId || !text?.trim()) {
    return NextResponse.json({ error: "Faltan datos obligatorios." }, { status: 400 });
  }

  const note = await prisma.refereeNote.create({
    data: {
      entityType,
      entityId,
      type: type || "OTHER",
      importance: importance || "MEDIUM",
      text: text.trim(),
      showInBriefing: showInBriefing ?? true,
      tags: tags?.trim() || null,
      source: source || null,
      // Asociación directa según el tipo de entidad (para consultas futuras)
      teamId: entityType === "TEAM" ? entityId : body.teamId || null,
      playerId: entityType === "PLAYER" ? entityId : body.playerId || null,
    },
  });
  return NextResponse.json(note);
}

/** Elimina una nota por id (?id=...). */
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta id." }, { status: 400 });
  await prisma.refereeNote.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
