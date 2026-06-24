import { NextRequest, NextResponse } from "next/server";
import { runImport, type ImportType } from "@/lib/import";

/**
 * Recibe filas ya parseadas en el navegador (CSV/Excel) y las importa.
 * Devuelve cuántos registros se crearon/actualizaron y los errores por fila.
 */
export async function POST(req: NextRequest) {
  const { type, rows } = await req.json();
  if (!type || !Array.isArray(rows)) {
    return NextResponse.json({ error: "Datos de importación no válidos." }, { status: 400 });
  }
  const result = await runImport(type as ImportType, rows);
  return NextResponse.json(result);
}
