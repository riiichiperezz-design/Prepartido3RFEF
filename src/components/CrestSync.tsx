"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, CheckIcon, AlertIcon } from "./icons";

interface Row { teamId: string; team: string; status: "found" | "notfound"; matchedName?: string; league?: string }

/** Botón para buscar escudos automáticamente en TheSportsDB (se ejecuta en el servidor). */
export default function CrestSync() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ checked: number; applied: number; results: Row[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(onlyMissing: boolean) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crests/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onlyMissing }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error ?? "Error");
      setData(json);
      router.refresh();
    } catch {
      setError("No se pudo completar la búsqueda. ¿Hay conexión a internet en el servidor?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-ink-muted" strokeWidth={2} />
        <h3 className="section-title">Escudos automáticos (TheSportsDB)</h3>
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        Busca e instala los escudos de los equipos desde TheSportsDB (gratis). Solo rellena los que no
        tengan escudo; los que hayas puesto a mano no se tocan. No todos los equipos de esta categoría
        estarán, y jugadores o tarjetas no se importan.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => run(true)} disabled={loading} className="btn-primary disabled:opacity-50">
          {loading ? "Buscando..." : "Buscar escudos automáticamente"}
        </button>
        {data && (
          <button onClick={() => run(false)} disabled={loading} className="btn-ghost text-sm disabled:opacity-50">
            Volver a buscar todos
          </button>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-risk-high">
          <AlertIcon className="h-4 w-4" strokeWidth={2} /> {error}
        </div>
      )}

      {data && (
        <div className="mt-4">
          <p className="text-sm text-ink">
            Comprobados <strong>{data.checked}</strong> · escudos instalados <strong className="text-risk-low">{data.applied}</strong>
          </p>
          <ul className="mt-2 divide-y divide-ink-line rounded-xl border border-ink-line">
            {data.results.map((r) => (
              <li key={r.teamId} className="flex items-center gap-2 px-3 py-2 text-sm">
                {r.status === "found" ? (
                  <CheckIcon className="h-4 w-4 shrink-0 text-risk-low" strokeWidth={2.5} />
                ) : (
                  <span className="h-4 w-4 shrink-0 text-center text-gray-300">—</span>
                )}
                <span className="font-medium text-ink">{r.team}</span>
                {r.status === "found" ? (
                  <span className="ml-auto truncate text-xs text-ink-muted">{r.matchedName}{r.league ? ` · ${r.league}` : ""}</span>
                ) : (
                  <span className="ml-auto text-xs text-gray-400">no encontrado (ponlo a mano)</span>
                )}
              </li>
            ))}
          </ul>
          {data.applied > 0 && <p className="mt-2 text-xs text-ink-muted">Revisa que los escudos instalados sean correctos; si alguno no lo es, edítalo en la ficha del equipo.</p>}
        </div>
      )}
    </div>
  );
}
