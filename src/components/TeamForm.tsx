"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Team } from "@prisma/client";
import ImageUpload from "./ImageUpload";

/**
 * Formulario para CREAR o EDITAR un equipo (incluye subida de escudo).
 * Si recibe `team`, edita; si no, crea uno nuevo.
 * No afecta a las notas arbitrales.
 */
export default function TeamForm({ team }: { team?: Team }) {
  const router = useRouter();
  const isEdit = Boolean(team);
  const [form, setForm] = useState({
    name: team?.name ?? "",
    shortName: team?.shortName ?? "",
    crestUrl: team?.crestUrl ?? "",
    city: team?.city ?? "",
    stadium: team?.stadium ?? "",
    stadiumAddress: team?.stadiumAddress ?? "",
    currentPosition: team?.currentPosition ?? "",
    points: team?.points ?? 0,
    goalsFor: team?.goalsFor ?? 0,
    goalsAgainst: team?.goalsAgainst ?? 0,
    yellowCards: team?.yellowCards ?? 0,
    redCards: team?.redCards ?? 0,
    protestLevel: team?.protestLevel ?? "LOW",
    physicalLevel: team?.physicalLevel ?? "MEDIUM",
    refereeRisk: team && ["LOW", "MEDIUM", "HIGH"].includes(team.refereeRisk) ? team.refereeRisk : "AUTO",
    playingStyle: team?.playingStyle ?? "",
    tacticalNotes: team?.tacticalNotes ?? "",
    setPieceNotes: team?.setPieceNotes ?? "",
    assistantNotes: team?.assistantNotes ?? "",
    generalNotes: team?.generalNotes ?? "",
  });
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(isEdit ? `/api/teams/${team!.id}` : "/api/teams", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    router.push(`/teams/${isEdit ? team!.id : data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <section className="card p-5">
        <h2 className="section-title mb-4">Escudo y datos</h2>
        <div className="mb-4">
          <label className="label">Escudo del equipo</label>
          <ImageUpload name={form.shortName || form.name} value={form.crestUrl} onChange={(v) => set("crestUrl", v)} square />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nombre"><input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} required /></Field>
          <Field label="Nombre corto"><input className="input" value={form.shortName} onChange={(e) => set("shortName", e.target.value)} /></Field>
          <Field label="Localidad"><input className="input" value={form.city} onChange={(e) => set("city", e.target.value)} /></Field>
          <Field label="Estadio"><input className="input" value={form.stadium} onChange={(e) => set("stadium", e.target.value)} /></Field>
          <Field label="Dirección del estadio"><input className="input" value={form.stadiumAddress} onChange={(e) => set("stadiumAddress", e.target.value)} /></Field>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="section-title mb-4">Clasificación y estadística</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Field label="Posición"><input type="number" className="input" value={form.currentPosition} onChange={(e) => set("currentPosition", e.target.value)} /></Field>
          <Field label="Puntos"><input type="number" className="input" value={form.points} onChange={(e) => set("points", Number(e.target.value))} /></Field>
          <Field label="Goles a favor"><input type="number" className="input" value={form.goalsFor} onChange={(e) => set("goalsFor", Number(e.target.value))} /></Field>
          <Field label="Goles en contra"><input type="number" className="input" value={form.goalsAgainst} onChange={(e) => set("goalsAgainst", Number(e.target.value))} /></Field>
          <Field label="Amarillas"><input type="number" className="input" value={form.yellowCards} onChange={(e) => set("yellowCards", Number(e.target.value))} /></Field>
          <Field label="Rojas"><input type="number" className="input" value={form.redCards} onChange={(e) => set("redCards", Number(e.target.value))} /></Field>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="section-title mb-4">Valoración arbitral</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Nivel de protesta">
            <select className="input" value={form.protestLevel} onChange={(e) => set("protestLevel", e.target.value)}>
              <option value="LOW">Tranquilo</option>
              <option value="MEDIUM">Protesta a veces</option>
              <option value="HIGH">Muy protestón</option>
            </select>
          </Field>
          <Field label="Nivel físico">
            <select className="input" value={form.physicalLevel} onChange={(e) => set("physicalLevel", e.target.value)}>
              <option value="LOW">Suave</option>
              <option value="MEDIUM">Normal</option>
              <option value="HIGH">Muy físico</option>
            </select>
          </Field>
          <Field label="Riesgo arbitral">
            <select className="input" value={form.refereeRisk} onChange={(e) => set("refereeRisk", e.target.value)}>
              <option value="AUTO">Automático (calculado)</option>
              <option value="LOW">Bajo (manual)</option>
              <option value="MEDIUM">Medio (manual)</option>
              <option value="HIGH">Alto (manual)</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="section-title mb-4">Estilo de juego y notas</h2>
        <div className="space-y-3">
          <Field label="Estilo de juego"><textarea className="input min-h-[60px]" value={form.playingStyle} onChange={(e) => set("playingStyle", e.target.value)} /></Field>
          <Field label="Notas tácticas"><textarea className="input min-h-[60px]" value={form.tacticalNotes} onChange={(e) => set("tacticalNotes", e.target.value)} /></Field>
          <Field label="Balón parado"><textarea className="input min-h-[60px]" value={form.setPieceNotes} onChange={(e) => set("setPieceNotes", e.target.value)} /></Field>
          <Field label="Para los asistentes"><textarea className="input min-h-[60px]" value={form.assistantNotes} onChange={(e) => set("assistantNotes", e.target.value)} /></Field>
          <Field label="Observaciones generales"><textarea className="input min-h-[60px]" value={form.generalNotes} onChange={(e) => set("generalNotes", e.target.value)} /></Field>
        </div>
      </section>

      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear equipo"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">
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
