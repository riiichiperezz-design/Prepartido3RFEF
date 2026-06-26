"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RefereeNote } from "@prisma/client";
import {
  NOTE_TYPES,
  NOTE_TYPE_LABELS,
  NOTE_SOURCES,
  NOTE_SOURCE_LABELS,
  RISK_LABELS,
  type NoteType,
  type NoteSource,
  type EntityType,
} from "@/lib/enums";
import { formatDate } from "@/lib/format";
import { NoteIcon } from "./icons";

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
  const [tags, setTags] = useState("");
  const [source, setSource] = useState<NoteSource>("SELF");
  const [saving, setSaving] = useState(false);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType, entityId, type, importance, text, showInBriefing, tags, source }),
    });
    setText("");
    setType("OTHER");
    setImportance("MEDIUM");
    setTags("");
    setSource("SELF");
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
    LOW: "bg-risk-lowtint text-risk-low",
    MEDIUM: "bg-risk-mediumtint text-risk-medium",
    HIGH: "bg-risk-hightint text-risk-high",
  };

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NoteIcon className="h-4 w-4 text-ink-muted" strokeWidth={2} />
          <h3 className="section-title">Notas propias</h3>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-ghost text-xs">
          {open ? "Cancelar" : "Añadir nota"}
        </button>
      </div>

      {open && (
        <form onSubmit={addNote} className="mb-4 space-y-3 rounded-xl bg-gray-50 p-3">
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
            <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Etiquetas (coma)" />
            <select className="input" value={source} onChange={(e) => setSource(e.target.value as NoteSource)}>
              {NOTE_SOURCES.map((s) => (
                <option key={s} value={s}>Fuente: {NOTE_SOURCE_LABELS[s]}</option>
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
        <p className="text-sm text-gray-400">Sin notas todavía.</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((n) => (
            <li key={n.id} className="rounded-xl border border-ink-line p-3">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="chip bg-ink text-white">{NOTE_TYPE_LABELS[n.type as NoteType] ?? n.type}</span>
                <span className={`chip ${impColor[n.importance] ?? ""}`}>{RISK_LABELS[n.importance as "LOW" | "MEDIUM" | "HIGH"]}</span>
                {n.showInBriefing && <span className="chip bg-gray-100 text-ink-muted">en briefing</span>}
                {n.source && <span className="chip bg-gray-100 text-ink-muted">{NOTE_SOURCE_LABELS[n.source as NoteSource] ?? n.source}</span>}
                <span className="ml-auto text-xs text-gray-400">{formatDate(n.date)}</span>
                <button onClick={() => remove(n.id)} className="text-xs text-risk-high hover:underline">
                  borrar
                </button>
              </div>
              <p className="text-sm text-ink">{n.text}</p>
              {n.tags && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {n.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                    <span key={t} className="chip bg-gray-100 text-ink-muted">{t}</span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
