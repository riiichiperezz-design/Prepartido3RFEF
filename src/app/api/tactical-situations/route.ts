import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Lista las situaciones tácticas de un equipo. */
export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("teamId");
  const situations = await prisma.tacticalSituation.findMany({
    where: teamId ? { teamId } : {},
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(situations);
}

/** Crea o actualiza una situación táctica. */
export async function POST(req: NextRequest) {
  const b = await req.json();
  if (!b.title?.trim()) {
    return NextResponse.json({ error: "Falta el título." }, { status: 400 });
  }
  const data = {
    title: b.title.trim(),
    teamId: b.teamId || null,
    matchId: b.matchId || null,
    type: b.type || "OTHER",
    importance: ["LOW", "MEDIUM", "HIGH"].includes(b.importance) ? b.importance : "MEDIUM",
    fieldData: typeof b.fieldData === "string" ? b.fieldData : JSON.stringify(b.fieldData ?? {}),
    description: b.description || null,
    refereeInstruction: b.refereeInstruction || null,
    assistant1Instruction: b.assistant1Instruction || null,
    assistant2Instruction: b.assistant2Instruction || null,
    visibleInBriefing: b.visibleInBriefing ?? true,
  };

  const situation = b.id
    ? await prisma.tacticalSituation.update({ where: { id: b.id }, data })
    : await prisma.tacticalSituation.create({ data });

  return NextResponse.json(situation);
}

/** Elimina una situación táctica. */
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta id." }, { status: 400 });
  await prisma.tacticalSituation.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
