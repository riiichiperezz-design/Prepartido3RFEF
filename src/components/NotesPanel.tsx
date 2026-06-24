"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RefereeNote } from "@prisma/client";
import {
  NOTE_TYPES,
  NOTE_TYPE_LABELS,
  RISK_LABELS,
  type NoteType,
  type EntityType,
} from "@/lib/enums";
import { formatDate } from "@/lib/format";

/**
 * Panel para ver y añadir notas propias del árbitro sobre una entidad.
 * Las notas NO se borran al importar datos: son siempre tuyas.
 */
export default function NotesPanel({
  entityType,
  entityId,
  notes,
}: {
  entityType: EntityType;
  entityId: string;
  notes: RefereeNote[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [type, setType] = useState<NoteType>("OTHER");
  const [importance, setImportance] = useState("MEDIUM");
  const [showInBriefing, setShowInBriefing] = useState(true);
  const [saving, setSaving] = useState(false);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType, entityId, type, importance, text, showInBriefing }),
    });
    setText("");
    setType("OTHER");
    setImportance("MEDIUM");
    setOpen(false);
    setSaving(false);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar esta nota?")) return;
    await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  const impColor: Record<string, string> = {
    LOW: "bg-pitch-100 text-pitch-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    HIGH: "bg-red-100 text-red-700",
  };

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="section-title text-base">📝 Notas propias</h3>
        <button onClick={() => setOpen((o) => !o)} className="btn-ghost text-xs">
          {open ? "Cancelar" : "+ Añadir nota"}
        </button>
      </div>

      {open && (
        <form onSubmit={addNote} className="mb-4 space-y-3 rounded-xl bg-slate-50 p-3">
          <textarea
            className="input min-h-[70px]"
            placeholder="Escribe tu observación..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
          <div className="grid grid-cols-2 gap-2">
            <select className="input" value={type} onChange={(e) => setType(e.target.value as NoteType)}>
              {NOTE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {NOTE_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
            <select className="input" value={importance} onChange={(e) => setImportance(e.target.value)}>
              {(["LOW", "MEDIUM", "HIGH"] as const).map((i) => (
                <option key={i} value={i}>
                  Importancia: {RISK_LABELS[i]}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input type="checkbox" checked={showInBriefing} onChange={(e) => setShowInBriefing(e.target.checked)} />
            Mostrar en el briefing del partido
          </label>
          <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-50">
            {saving ? "Guardando..." : "Guardar nota"}
          </button>
        </form>
      )}

      {notes.length === 0 ? (
        <p className="text-sm text-slate-400">Sin notas todavía.</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((n) => (
            <li key={n.id} className="rounded-xl border border-slate-100 p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="chip bg-ink text-white">{NOTE_TYPE_LABELS[n.type as NoteType] ?? n.type}</span>
                <span className={`chip ${impColor[n.importance] ?? ""}`}>{RISK_LABELS[n.importance as "LOW" | "MEDIUM" | "HIGH"]}</span>
                {n.showInBriefing && <span className="chip bg-slate-100 text-ink-muted">en briefing</span>}
                <span className="ml-auto text-xs text-slate-400">{formatDate(n.date)}</span>
                <button onClick={() => remove(n.id)} className="text-xs text-red-500 hover:underline">
                  borrar
                </button>
              </div>
              <p className="text-sm text-slate-700">{n.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
