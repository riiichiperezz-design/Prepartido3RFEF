import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findBadge } from "@/lib/crests";

// Permite hasta 60s en Vercel (recorrer 18 equipos con peticiones a TheSportsDB).
export const maxDuration = 60;

export interface CrestSyncRow {
  teamId: string;
  team: string;
  status: "found" | "notfound";
  matchedName?: string;
  league?: string;
}

/**
 * Recorre los equipos y busca su escudo en TheSportsDB, aplicándolo al que lo
 * encuentre. Por defecto solo rellena los equipos SIN escudo (no pisa los que
 * ya tengas puestos a mano). Se ejecuta en el servidor: necesita salida a
 * internet (Vercel o tu ordenador).
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const onlyMissing = body.onlyMissing !== false;
  const limit: number | undefined = body.limit;

  let teams = await prisma.team.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, shortName: true, crestUrl: true } });
  if (onlyMissing) teams = teams.filter((t) => !t.crestUrl);
  if (limit && limit > 0) teams = teams.slice(0, limit);

  const results: CrestSyncRow[] = [];
  let applied = 0;

  for (const t of teams) {
    const found = await findBadge(t.name, t.shortName);
    if (found?.badge) {
      await prisma.team.update({ where: { id: t.id }, data: { crestUrl: found.badge } });
      applied++;
      results.push({ teamId: t.id, team: t.shortName ?? t.name, status: "found", matchedName: found.matchedName, league: found.league });
    } else {
      results.push({ teamId: t.id, team: t.shortName ?? t.name, status: "notfound" });
    }
  }

  return NextResponse.json({ ok: true, checked: teams.length, applied, results });
}
