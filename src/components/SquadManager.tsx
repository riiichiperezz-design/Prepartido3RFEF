"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EnrichedPlayer } from "@/lib/data";
import PlayerCard from "./PlayerCard";
import PlayerForm from "./PlayerForm";
import { SquadIcon, PlusIcon, EditIcon, DeleteIcon, CloseIcon } from "./icons";

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
        <div className="flex items-center gap-2">
          <SquadIcon className="h-[18px] w-[18px] text-ink-muted" strokeWidth={2} />
          <h2 className="text-lg font-semibold tracking-tight text-ink">Plantilla ({players.length})</h2>
        </div>
        <button onClick={() => setAdding((a) => !a)} className="btn-ghost text-xs">
          {adding ? <CloseIcon className="h-3.5 w-3.5" /> : <PlusIcon className="h-3.5 w-3.5" />}
          {adding ? "Cancelar" : "Añadir jugador"}
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
                <button onClick={() => setEditingId(p.id)} className="inline-flex items-center gap-1 text-ink-muted hover:text-ink">
                  <EditIcon className="h-3.5 w-3.5" /> Editar
                </button>
                <button onClick={() => remove(p.id, p.name)} className="inline-flex items-center gap-1 text-risk-high hover:underline">
                  <DeleteIcon className="h-3.5 w-3.5" /> Borrar
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
