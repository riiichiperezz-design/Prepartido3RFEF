"use client";

import { useState } from "react";

interface ProviderStatus {
  id: string;
  label: string;
  configured: boolean;
  active: boolean;
}

/** Tarjeta de proveedor de datos con botón de prueba de sincronización. */
export default function ProviderCard({ provider }: { provider: ProviderStatus }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function test() {
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/providers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: provider.id }),
    });
    const data = await res.json();
    setMsg(data.message ?? (data.ok ? "OK" : "Sin respuesta"));
    setLoading(false);
  }

  return (
    <div className={`card p-5 ${provider.active ? "ring-2 ring-pitch-500" : ""}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-ink">{provider.label}</h3>
        {provider.active && <span className="chip bg-pitch-100 text-pitch-700">Activo</span>}
      </div>

      <div className="mt-2">
        {provider.configured ? (
          <span className="chip bg-pitch-100 text-pitch-700">✓ Configurado</span>
        ) : (
          <span className="chip bg-amber-100 text-amber-700">⚠️ API no configurada</span>
        )}
      </div>

      <button onClick={test} disabled={loading} className="btn-ghost mt-4 text-xs disabled:opacity-50">
        {loading ? "Probando..." : "Probar sincronización"}
      </button>

      {msg && <p className="mt-2 text-xs text-ink-muted">{msg}</p>}
    </div>
  );
}
