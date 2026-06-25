"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EnrichedPlayer } from "@/lib/data";
import PlayerCard from "./PlayerCard";
import PlayerForm from "./PlayerForm";

/**
 * Gestión de la plantilla desde la ficha del equipo:
 * añadir, editar y borrar jugadores a mano.
 */
export default function SquadManager({
  teamId,
  players,
}: {
  teamId: string;
  players: EnrichedPlayer[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function remove(id: string, name: string) {
    if (!confirm(`¿Eliminar a ${name}? Esta acción no se puede deshacer.`)) return;
    await fetch(`/api/players/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="section-title">👥 Plantilla ({players.length})</h2>
        <button onClick={() => setAdding((a) => !a)} className="btn-ghost text-xs">
          {adding ? "Cancelar" : "+ Añadir jugador"}
        </button>
      </div>

      {adding && (
        <div className="card mb-4 p-4">
          <h3 className="mb-3 font-semibold text-ink">Nuevo jugador</h3>
          <PlayerForm teamId={teamId} onSaved={() => setAdding(false)} onCancel={() => setAdding(false)} />
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {players.map((p) =>
          editingId === p.id ? (
            <div key={p.id} className="card p-4 sm:col-span-2">
              <h3 className="mb-3 font-semibold text-ink">Editar: {p.name}</h3>
              <PlayerForm player={p} onSaved={() => setEditingId(null)} onCancel={() => setEditingId(null)} />
            </div>
          ) : (
            <div key={p.id} className="space-y-1">
              <PlayerCard player={p} href={`/players/${p.id}`} />
              <div className="flex justify-end gap-3 px-1 text-xs">
                <button onClick={() => setEditingId(p.id)} className="text-ink-muted hover:underline">
                  ✏️ Editar
                </button>
                <button onClick={() => remove(p.id, p.name)} className="text-red-500 hover:underline">
                  🗑️ Borrar
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
