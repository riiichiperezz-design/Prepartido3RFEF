"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Player } from "@prisma/client";
import { POSITIONS, POSITION_LABELS } from "@/lib/enums";
import ImageUpload from "./ImageUpload";

/**
 * Formulario para CREAR o EDITAR un jugador.
 * - Para crear: pasar `teamId` (y opcional `onSaved` para uso embebido).
 * - Para editar: pasar `player`.
 * No afecta a las notas arbitrales del jugador.
 */
export default function PlayerForm({
  player,
  teamId,
  onSaved,
  onCancel,
}: {
  player?: Player;
  teamId?: string;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(player);
  const [form, setForm] = useState({
    name: player?.name ?? "",
    photoUrl: player?.photoUrl ?? "",
    dorsal: player?.dorsal ?? "",
    age: player?.age ?? "",
    position: player?.position ?? "",
    dominantFoot: player?.dominantFoot ?? "",
    matches: player?.matches ?? 0,
    minutes: player?.minutes ?? 0,
    goals: player?.goals ?? 0,
    assists: player?.assists ?? 0,
    yellowCards: player?.yellowCards ?? 0,
    redCards: player?.redCards ?? 0,
    previousSeasonYellowCards: player?.previousSeasonYellowCards ?? 0,
    previousSeasonRedCards: player?.previousSeasonRedCards ?? 0,
    behaviourTags: player?.behaviourTags ?? "",
    refereeRisk: player && ["LOW", "MEDIUM", "HIGH"].includes(player.refereeRisk) ? player.refereeRisk : "AUTO",
    notes: player?.notes ?? "",
  });
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(isEdit ? `/api/players/${player!.id}` : "/api/players", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, teamId }),
    });
    await res.json();
    setSaving(false);
    router.refresh();
    if (onSaved) onSaved();
    else if (isEdit) router.push(`/players/${player!.id}`);
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <label className="label">Foto</label>
        <ImageUpload name={form.name} value={form.photoUrl} onChange={(v) => set("photoUrl", v)} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Nombre" className="col-span-2"><input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} required /></Field>
        <Field label="Dorsal"><input type="number" className="input" value={form.dorsal} onChange={(e) => set("dorsal", e.target.value)} /></Field>
        <Field label="Edad"><input type="number" className="input" value={form.age} onChange={(e) => set("age", e.target.value)} /></Field>
        <Field label="Posición">
          <select className="input" value={form.position} onChange={(e) => set("position", e.target.value)}>
            <option value="">—</option>
            {POSITIONS.map((p) => <option key={p} value={p}>{POSITION_LABELS[p]}</option>)}
          </select>
        </Field>
        <Field label="Pie">
          <select className="input" value={form.dominantFoot} onChange={(e) => set("dominantFoot", e.target.value)}>
            <option value="">—</option>
            <option value="R">Diestro</option>
            <option value="L">Zurdo</option>
            <option value="BOTH">Ambidiestro</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        <Field label="Partidos"><input type="number" className="input" value={form.matches} onChange={(e) => set("matches", Number(e.target.value))} /></Field>
        <Field label="Minutos"><input type="number" className="input" value={form.minutes} onChange={(e) => set("minutes", Number(e.target.value))} /></Field>
        <Field label="Goles"><input type="number" className="input" value={form.goals} onChange={(e) => set("goals", Number(e.target.value))} /></Field>
        <Field label="Asist."><input type="number" className="input" value={form.assists} onChange={(e) => set("assists", Number(e.target.value))} /></Field>
        <Field label="Amar."><input type="number" className="input" value={form.yellowCards} onChange={(e) => set("yellowCards", Number(e.target.value))} /></Field>
        <Field label="Rojas"><input type="number" className="input" value={form.redCards} onChange={(e) => set("redCards", Number(e.target.value))} /></Field>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="🟨 temp. anterior"><input type="number" className="input" value={form.previousSeasonYellowCards} onChange={(e) => set("previousSeasonYellowCards", Number(e.target.value))} /></Field>
        <Field label="🟥 temp. anterior"><input type="number" className="input" value={form.previousSeasonRedCards} onChange={(e) => set("previousSeasonRedCards", Number(e.target.value))} /></Field>
        <Field label="Riesgo">
          <select className="input" value={form.refereeRisk} onChange={(e) => set("refereeRisk", e.target.value)}>
            <option value="AUTO">Automático</option>
            <option value="LOW">Bajo</option>
            <option value="MEDIUM">Medio</option>
            <option value="HIGH">Alto</option>
          </select>
        </Field>
        <Field label="Etiquetas (coma)"><input className="input" value={form.behaviourTags} onChange={(e) => set("behaviourTags", e.target.value)} placeholder="protestón,reincidente" /></Field>
      </div>

      <Field label="Notas (observación de ficha)">
        <textarea className="input min-h-[60px]" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
      </Field>

      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Añadir jugador"}
        </button>
        <button type="button" onClick={() => (onCancel ? onCancel() : router.back())} className="btn-ghost">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
