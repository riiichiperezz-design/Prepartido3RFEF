"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { StaffMember } from "@prisma/client";
import StaffCard from "./StaffCard";
import StaffForm from "./StaffForm";

/**
 * Gestión del cuerpo técnico desde la ficha del equipo:
 * añadir, editar y borrar a mano.
 */
export default function StaffManager({
  teamId,
  staff,
}: {
  teamId: string;
  staff: StaffMember[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function remove(id: string, name: string) {
    if (!confirm(`¿Eliminar a ${name}?`)) return;
    await fetch(`/api/staff/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="section-title">🎽 Cuerpo técnico</h2>
        <button onClick={() => setAdding((a) => !a)} className="btn-ghost text-xs">
          {adding ? "Cancelar" : "+ Añadir técnico"}
        </button>
      </div>

      {adding && (
        <div className="card mb-4 p-4">
          <h3 className="mb-3 font-semibold text-ink">Nuevo miembro del cuerpo técnico</h3>
          <StaffForm teamId={teamId} onSaved={() => setAdding(false)} onCancel={() => setAdding(false)} />
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {staff.map((s) =>
          editingId === s.id ? (
            <div key={s.id} className="card p-4 sm:col-span-2">
              <h3 className="mb-3 font-semibold text-ink">Editar: {s.name}</h3>
              <StaffForm staff={s} onSaved={() => setEditingId(null)} onCancel={() => setEditingId(null)} />
            </div>
          ) : (
            <div key={s.id} className="space-y-1">
              <StaffCard staff={s} />
              <div className="flex justify-end gap-3 px-1 text-xs">
                <button onClick={() => setEditingId(s.id)} className="text-ink-muted hover:underline">
                  ✏️ Editar
                </button>
                <button onClick={() => remove(s.id, s.name)} className="text-red-500 hover:underline">
                  🗑️ Borrar
                </button>
              </div>
            </div>
          ),
        )}
        {staff.length === 0 && !adding && (
          <p className="text-sm text-slate-400">Sin cuerpo técnico. Pulsa "Añadir técnico".</p>
        )}
      </div>
    </section>
  );
}
