import { NextRequest, NextResponse } from "next/server";
import { providers, getProvidersStatus, type ProviderKey } from "@/dataProviders";

/** Devuelve el estado de configuración de los proveedores. */
export async function GET() {
  return NextResponse.json(getProvidersStatus());
}

/** Lanza una sincronización de prueba con el proveedor indicado. */
export async function POST(req: NextRequest) {
  const { id } = await req.json();
  const provider = providers[id as ProviderKey];
  if (!provider) {
    return NextResponse.json({ ok: false, message: "Proveedor desconocido." }, { status: 400 });
  }
  try {
    const result = await provider.syncCompetition();
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ ok: false, message: e instanceof Error ? e.message : "Error desconocido." });
  }
}
