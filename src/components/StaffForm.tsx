"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { StaffMember } from "@prisma/client";
import ImageUpload from "./ImageUpload";

/**
 * Formulario para CREAR o EDITAR un miembro del cuerpo técnico.
 * - Para crear: pasar `teamId` y `onSaved`.
 * - Para editar: pasar `staff`.
 */
export default function StaffForm({
  staff,
  teamId,
  onSaved,
  onCancel,
}: {
  staff?: StaffMember;
  teamId?: string;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(staff);
  const [form, setForm] = useState({
    name: staff?.name ?? "",
    role: staff?.role ?? "",
    photoUrl: staff?.photoUrl ?? "",
    previousTeams: staff?.previousTeams ?? "",
    yellowCards: staff?.yellowCards ?? 0,
    redCards: staff?.redCards ?? 0,
    protestLevel: staff?.protestLevel ?? "LOW",
    refereeRisk: staff?.refereeRisk ?? "LOW",
    notes: staff?.notes ?? "",
  });
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(isEdit ? `/api/staff/${staff!.id}` : "/api/staff", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, teamId }),
    });
    await res.json();
    setSaving(false);
    router.refresh();
    if (onSaved) onSaved();
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <label className="label">Foto</label>
        <ImageUpload name={form.name} value={form.photoUrl} onChange={(v) => set("photoUrl", v)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Nombre"><input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} required /></Field>
        <Field label="Rol"><input className="input" value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Entrenador, Segundo, Delegado..." /></Field>
      </div>

      <Field label="Equipos anteriores"><input className="input" value={form.previousTeams} onChange={(e) => set("previousTeams", e.target.value)} /></Field>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Amarillas"><input type="number" className="input" value={form.yellowCards} onChange={(e) => set("yellowCards", Number(e.target.value))} /></Field>
        <Field label="Rojas"><input type="number" className="input" value={form.redCards} onChange={(e) => set("redCards", Number(e.target.value))} /></Field>
        <Field label="Protesta">
          <select className="input" value={form.protestLevel} onChange={(e) => set("protestLevel", e.target.value)}>
            <option value="LOW">Tranquilo</option>
            <option value="MEDIUM">A veces</option>
            <option value="HIGH">Muy protestón</option>
          </select>
        </Field>
        <Field label="Riesgo">
          <select className="input" value={form.refereeRisk} onChange={(e) => set("refereeRisk", e.target.value)}>
            <option value="LOW">Bajo</option>
            <option value="MEDIUM">Medio</option>
            <option value="HIGH">Alto</option>
          </select>
        </Field>
      </div>

      <Field label="Notas">
        <textarea className="input min-h-[60px]" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
      </Field>

      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Añadir técnico"}
        </button>
        <button type="button" onClick={() => (onCancel ? onCancel() : router.back())} className="btn-ghost">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
