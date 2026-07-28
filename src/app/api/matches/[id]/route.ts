import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toInt } from "@/lib/format";

/** Actualiza un partido del calendario (resultado, tarjetas, estado, designación...). */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const b = await req.json();
  const data: Record<string, unknown> = {};

  if ("date" in b) data.date = b.date ? new Date(b.date) : null;
  if ("status" in b && ["PENDING", "PREPARED", "REFEREED"].includes(b.status)) data.status = b.status;
  if ("designated" in b) data.designated = Boolean(b.designated);
  if ("homeGoals" in b) data.homeGoals = b.homeGoals === "" || b.homeGoals == null ? null : toInt(b.homeGoals);
  if ("awayGoals" in b) data.awayGoals = b.awayGoals === "" || b.awayGoals == null ? null : toInt(b.awayGoals);
  if ("homeYellowCards" in b) data.homeYellowCards = toInt(b.homeYellowCards);
  if ("awayYellowCards" in b) data.awayYellowCards = toInt(b.awayYellowCards);
  if ("homeRedCards" in b) data.homeRedCards = toInt(b.homeRedCards);
  if ("awayRedCards" in b) data.awayRedCards = toInt(b.awayRedCards);
  if ("referee" in b) data.referee = b.referee || null;
  if ("assistant1" in b) data.assistant1 = b.assistant1 || null;
  if ("assistant2" in b) data.assistant2 = b.assistant2 || null;
  if ("fourthOfficial" in b) data.fourthOfficial = b.fourthOfficial || null;
  if ("postMatchNotes" in b) data.postMatchNotes = b.postMatchNotes || null;
  if ("incidents" in b) data.incidents = b.incidents || null;

  const match = await prisma.match.update({ where: { id: params.id }, data });
  return NextResponse.json(match);
}
