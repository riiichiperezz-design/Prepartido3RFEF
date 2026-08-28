"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertIcon } from "./icons";

/**
 * Banner que aparece cuando la base de datos está vacía (p. ej. tras conectar
 * Neon por primera vez). Permite cargar los datos del Grupo 14 con un clic.
 */
export default function SetupBanner() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function seed() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/setup", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Error");
      router.refresh();
    } catch {
      setError("No se pudo cargar. Revisa que la base de datos esté conectada.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card border-amber-200 bg-risk-mediumtint p-5">
      <div className="flex items-start gap-3">
        <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-risk-medium" strokeWidth={2} />
        <div className="flex-1">
          <h2 className="font-semibold text-ink">La base de datos está vacía</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Carga los datos del Grupo 14 (18 equipos, calendario 2026-2027 y las plantillas aportadas).
          </p>
          <button onClick={seed} disabled={loading} className="btn-primary mt-3 disabled:opacity-50">
            {loading ? "Cargando..." : "Cargar datos del Grupo 14"}
          </button>
          {error && <p className="mt-2 text-sm text-risk-high">{error}</p>}
        </div>
      </div>
    </div>
  );
}
