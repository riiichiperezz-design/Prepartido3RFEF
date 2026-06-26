"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import TacticsBoard, { type BoardPlayer } from "./TacticsBoard";
import { emptyBoard, buildFormation, type BoardState } from "@/lib/tactics";
import { SITUATION_TYPES, SITUATION_TYPE_LABELS, type SituationType } from "@/lib/enums";
import { DeleteIcon } from "../icons";

interface TeamOpt { id: string; name: string; shortName: string | null }
interface SavedLineup { id: string; name: string; formation: string; fieldData: string; updatedAt: string }
interface SavedSituation { id: string; title: string; type: string; importance: string; fieldData: string; description: string | null; refereeInstruction: string | null; assistant1Instruction: string | null; assistant2Instruction: string | null; visibleInBriefing: boolean }

const freshBoard = (): BoardState => ({ ...emptyBoard("vertical"), players: buildFormation("4-4-2") });

export default function TacticsBoardLoader({ teams }: { teams: TeamOpt[] }) {
  const [teamId, setTeamId] = useState(teams[0]?.id ?? "");
  const [players, setPlayers] = useState<BoardPlayer[]>([]);
  const [mode, setMode] = useState<"lineup" | "situation">("lineup");
  const [board, setBoard] = useState<BoardState>(freshBoard());
  const [boardKey, setBoardKey] = useState(0);
  const boardRef = useRef<BoardState>(board);

  const [lineups, setLineups] = useState<SavedLineup[]>([]);
  const [situations, setSituations] = useState<SavedSituation[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Metadatos
  const [lineupName, setLineupName] = useState("Alineación probable");
  const [sit, setSit] = useState({
    title: "", type: "HIGH_PRESS" as SituationType, importance: "MEDIUM",
    description: "", refereeInstruction: "", assistant1Instruction: "", assistant2Instruction: "", visibleInBriefing: true,
  });

  const onBoardChange = useCallback((b: BoardState) => { boardRef.current = b; setBoard(b); }, []);

  const loadLists = useCallback(async (tid: string) => {
    const [l, s] = await Promise.all([
      fetch(`/api/lineups?teamId=${tid}`).then((r) => r.json()),
      fetch(`/api/tactical-situations?teamId=${tid}`).then((r) => r.json()),
    ]);
    setLineups(l);
    setSituations(s);
  }, []);

  useEffect(() => {
    if (!teamId) return;
    fetch(`/api/tactics/players?teamId=${teamId}`).then((r) => r.json()).then(setPlayers);
    loadLists(teamId);
  }, [teamId, loadLists]);

  function resetBoard() {
    const b = freshBoard();
    boardRef.current = b;
    setBoard(b);
    setBoardKey((k) => k + 1);
    setEditId(null);
  }

  function loadBoard(fieldData: string) {
    try {
      const parsed = JSON.parse(fieldData) as BoardState;
      const b: BoardState = { ...freshBoard(), ...parsed };
      boardRef.current = b;
      setBoard(b);
      setBoardKey((k) => k + 1);
    } catch {
      resetBoard();
    }
  }

  async function saveLineup() {
    setSaving(true);
    const res = await fetch("/api/lineups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId ?? undefined, teamId, name: lineupName, formation: boardRef.current.formation, fieldData: boardRef.current }),
    });
    const saved = await res.json();
    setEditId(saved.id);
    setSaving(false);
    loadLists(teamId);
  }

  async function saveSituation() {
    if (!sit.title.trim()) { alert("Pon un título a la situación."); return; }
    setSaving(true);
    const res = await fetch("/api/tactical-situations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId ?? undefined, teamId, ...sit, fieldData: boardRef.current }),
    });
    const saved = await res.json();
    setEditId(saved.id);
    setSaving(false);
    loadLists(teamId);
  }

  async function del(kind: "lineup" | "situation", id: string) {
    if (!confirm("¿Eliminar?")) return;
    await fetch(`/api/${kind === "lineup" ? "lineups" : "tactical-situations"}?id=${id}`, { method: "DELETE" });
    if (editId === id) resetBoard();
    loadLists(teamId);
  }

  return (
    <div className="space-y-4">
      {/* Cabecera: equipo + modo */}
      <div className="card flex flex-wrap items-center gap-3 p-3">
        <select className="input w-auto" value={teamId} onChange={(e) => { setTeamId(e.target.value); resetBoard(); }}>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <div className="flex rounded-lg border border-ink-line p-0.5">
          {(["lineup", "situation"] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); resetBoard(); }} className={`rounded-md px-3 py-1.5 text-sm font-medium ${mode === m ? "bg-ink text-white" : "text-ink-muted hover:text-ink"}`}>
              {m === "lineup" ? "Alineación" : "Situación táctica"}
            </button>
          ))}
        </div>
        <button onClick={resetBoard} className="btn-ghost text-xs">Nuevo</button>
        {editId && <span className="text-xs text-ink-muted">Editando un elemento guardado</span>}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        {/* Editor */}
        <div>
          <TacticsBoard key={boardKey} initialBoard={board} players={players} onChange={onBoardChange} />
        </div>

        {/* Panel lateral: metadatos + guardados */}
        <div className="space-y-4">
          {mode === "lineup" ? (
            <div className="card space-y-3 p-4">
              <h3 className="section-title">Guardar alineación</h3>
              <div>
                <label className="label">Nombre</label>
                <input className="input" value={lineupName} onChange={(e) => setLineupName(e.target.value)} />
              </div>
              <button onClick={saveLineup} disabled={saving} className="btn-primary w-full disabled:opacity-50">
                {saving ? "Guardando..." : editId ? "Actualizar" : "Guardar alineación"}
              </button>
            </div>
          ) : (
            <div className="card space-y-3 p-4">
              <h3 className="section-title">Guardar situación</h3>
              <div>
                <label className="label">Título</label>
                <input className="input" value={sit.title} onChange={(e) => setSit({ ...sit, title: e.target.value })} placeholder="Ej: Córner a favor" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label">Tipo</label>
                  <select className="input" value={sit.type} onChange={(e) => setSit({ ...sit, type: e.target.value as SituationType })}>
                    {SITUATION_TYPES.map((t) => <option key={t} value={t}>{SITUATION_TYPE_LABELS[t]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Importancia</label>
                  <select className="input" value={sit.importance} onChange={(e) => setSit({ ...sit, importance: e.target.value })}>
                    <option value="LOW">Baja</option>
                    <option value="MEDIUM">Media</option>
                    <option value="HIGH">Alta</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Explicación</label>
                <textarea className="input min-h-[50px]" value={sit.description} onChange={(e) => setSit({ ...sit, description: e.target.value })} />
              </div>
              <div>
                <label className="label">Instrucción para el árbitro</label>
                <textarea className="input min-h-[44px]" value={sit.refereeInstruction} onChange={(e) => setSit({ ...sit, refereeInstruction: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="label">Asistente 1</label>
                  <textarea className="input min-h-[40px]" value={sit.assistant1Instruction} onChange={(e) => setSit({ ...sit, assistant1Instruction: e.target.value })} />
                </div>
                <div>
                  <label className="label">Asistente 2</label>
                  <textarea className="input min-h-[40px]" value={sit.assistant2Instruction} onChange={(e) => setSit({ ...sit, assistant2Instruction: e.target.value })} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-ink-muted">
                <input type="checkbox" checked={sit.visibleInBriefing} onChange={(e) => setSit({ ...sit, visibleInBriefing: e.target.checked })} />
                Mostrar en el briefing
              </label>
              <button onClick={saveSituation} disabled={saving} className="btn-primary w-full disabled:opacity-50">
                {saving ? "Guardando..." : editId ? "Actualizar" : "Guardar situación"}
              </button>
            </div>
          )}

          {/* Listado de guardados */}
          <div className="card p-4">
            <h3 className="section-title mb-2">{mode === "lineup" ? "Alineaciones guardadas" : "Situaciones guardadas"}</h3>
            <ul className="space-y-1.5">
              {mode === "lineup" && lineups.map((l) => (
                <SavedRow key={l.id} title={l.name} subtitle={l.formation} active={editId === l.id}
                  onLoad={() => { setEditId(l.id); setLineupName(l.name); loadBoard(l.fieldData); }}
                  onDelete={() => del("lineup", l.id)} />
              ))}
              {mode === "situation" && situations.map((s) => (
                <SavedRow key={s.id} title={s.title} subtitle={SITUATION_TYPE_LABELS[s.type as SituationType] ?? s.type} active={editId === s.id}
                  onLoad={() => {
                    setEditId(s.id);
                    setSit({ title: s.title, type: s.type as SituationType, importance: s.importance, description: s.description ?? "", refereeInstruction: s.refereeInstruction ?? "", assistant1Instruction: s.assistant1Instruction ?? "", assistant2Instruction: s.assistant2Instruction ?? "", visibleInBriefing: s.visibleInBriefing });
                    loadBoard(s.fieldData);
                  }}
                  onDelete={() => del("situation", s.id)} />
              ))}
              {((mode === "lineup" && lineups.length === 0) || (mode === "situation" && situations.length === 0)) && (
                <li className="text-sm text-gray-400">Nada guardado todavía.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SavedRow({ title, subtitle, active, onLoad, onDelete }: { title: string; subtitle: string; active: boolean; onLoad: () => void; onDelete: () => void }) {
  return (
    <li className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-sm ${active ? "bg-gray-100" : "hover:bg-gray-50"}`}>
      <button onClick={onLoad} className="min-w-0 text-left">
        <span className="block truncate font-medium text-ink">{title}</span>
        <span className="block text-xs text-ink-muted">{subtitle}</span>
      </button>
      <button onClick={onDelete} className="text-ink-muted hover:text-risk-high"><DeleteIcon className="h-4 w-4" /></button>
    </li>
  );
}
