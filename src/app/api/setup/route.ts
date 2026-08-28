import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { populateDatabase } from "@/lib/seedCore";

export const maxDuration = 60;

/**
 * Configuración inicial: siembra la base de datos con el Grupo 14 (equipos,
 * calendario y plantillas). Pensado para el despliegue con base de datos en la
 * nube: se llama UNA vez tras conectar la BD.
 *
 * Por seguridad, si ya hay equipos NO hace nada (para no borrar tus datos),
 * salvo que se pase { force: true } explícitamente.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const force = body.force === true;

  const count = await prisma.team.count().catch(() => -1);
  if (count === -1) {
    return NextResponse.json(
      { ok: false, error: "No hay conexión con la base de datos. ¿Está configurada DATABASE_URL?" },
      { status: 500 },
    );
  }
  if (count > 0 && !force) {
    return NextResponse.json({ ok: true, alreadySeeded: true, teams: count });
  }

  const result = await populateDatabase(prisma, { reset: force });
  return NextResponse.json({ ok: true, seeded: true, ...result });
}

/** Estado rápido: cuántos equipos hay (para saber si falta sembrar). */
export async function GET() {
  const teams = await prisma.team.count().catch(() => -1);
  return NextResponse.json({ connected: teams >= 0, teams });
}
