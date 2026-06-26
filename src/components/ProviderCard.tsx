"use client";

import { useState } from "react";
import { CheckIcon, AlertIcon } from "./icons";

interface ProviderStatus {
  id: string;
  label: string;
  configured: boolean;
  active: boolean;
}

/** Tarjeta de proveedor de datos con prueba de sincronización. */
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
    setMsg(data.message ?? (data.ok ? "Correcto" : "Sin respuesta"));
    setLoading(false);
  }

  return (
    <div className={`card p-5 ${provider.active ? "ring-2 ring-accent" : ""}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink">{provider.label}</h3>
        {provider.active && <span className="chip bg-accent/10 text-accent">Activo</span>}
      </div>

      <div className="mt-2">
        {provider.configured ? (
          <span className="chip bg-risk-lowtint text-risk-low">
            <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} /> Configurado
          </span>
        ) : (
          <span className="chip bg-risk-mediumtint text-risk-medium">
            <AlertIcon className="h-3.5 w-3.5" strokeWidth={2} /> API no configurada
          </span>
        )}
      </div>

      <button onClick={test} disabled={loading} className="btn-ghost mt-4 text-xs disabled:opacity-50">
        {loading ? "Probando..." : "Probar sincronización"}
      </button>

      {msg && <p className="mt-2 text-xs text-ink-muted">{msg}</p>}
    </div>
  );
}
