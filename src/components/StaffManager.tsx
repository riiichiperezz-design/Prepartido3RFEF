"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { StaffMember } from "@prisma/client";
import StaffCard from "./StaffCard";
import StaffForm from "./StaffForm";
import { StaffIcon, PlusIcon, EditIcon, DeleteIcon, CloseIcon } from "./icons";

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
        <div className="flex items-center gap-2">
          <StaffIcon className="h-[18px] w-[18px] text-ink-muted" strokeWidth={2} />
          <h2 className="text-lg font-semibold tracking-tight text-ink">Cuerpo técnico</h2>
        </div>
        <button onClick={() => setAdding((a) => !a)} className="btn-ghost text-xs">
          {adding ? <CloseIcon className="h-3.5 w-3.5" /> : <PlusIcon className="h-3.5 w-3.5" />}
          {adding ? "Cancelar" : "Añadir técnico"}
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
                <button onClick={() => setEditingId(s.id)} className="inline-flex items-center gap-1 text-ink-muted hover:text-ink">
                  <EditIcon className="h-3.5 w-3.5" /> Editar
                </button>
                <button onClick={() => remove(s.id, s.name)} className="inline-flex items-center gap-1 text-risk-high hover:underline">
                  <DeleteIcon className="h-3.5 w-3.5" /> Borrar
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
