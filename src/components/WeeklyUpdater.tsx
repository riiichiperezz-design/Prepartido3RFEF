"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TargetIcon, NoteIcon } from "./icons";

interface TeamRow {
  id: string;
  name: string;
  points: number | null;
  currentPosition: number | null;
  goalsFor: number;
  goalsAgainst: number;
  yellowCards: number;
  redCards: number;
}

interface PlayerRow {
  id: string;
  name: string;
  dorsal: number | null;
  matches: number;
  minutes: number;
  goals: number;
  yellowCards: number;
  redCards: number;
}

function currentIsoWeek(): string {
  const d = new Date();
  const day = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - day + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((d.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${d.getUTCFullYear()}-J${String(week).padStart(2, "0")}`;
}

/** Vista de actualización semanal: edición rápida de estadísticas por equipo. */
export default function WeeklyUpdater({ teams }: { teams: TeamRow[] }) {
  const [teamId, setTeamId] = useState(teams[0]?.id ?? "");
  const [week, setWeek] = useState(currentIsoWeek());
  const [season, setSeason] = useState("2025/2026");
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [team, setTeam] = useState<TeamRow | null>(teams[0] ?? null);
  const [behaviour, setBehaviour] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [recent, setRecent] = useState<{ id: string; week: string; createdAt: string }[]>([]);

  const selectedTeam = useMemo(() => teams.find((t) => t.id === teamId) ?? null, [teams, teamId]);

  useEffect(() => {
    if (!teamId) return;
    setTeam(selectedTeam);
    fetch(`/api/tactics/players?teamId=${teamId}`).then((r) => r.json()).then(setPlayers);
    fetch(`/api/weekly?teamId=${teamId}`).then((r) => r.json()).then(setRecent);
  }, [teamId, selectedTeam]);

  function setP(id: string, key: keyof PlayerRow, value: number) {
    setPlayers((ps) => ps.map((p) => (p.id === id ? { ...p, [key]: value } : p)));
    setState("idle");
  }
  function setT(key: keyof TeamRow, value: number) {
    setTeam((t) => (t ? { ...t, [key]: value } : t));
    setState("idle");
  }

  async function save() {
    if (!team) return;
    setState("saving");
    await fetch("/api/weekly", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId, week, season, behaviourNote: behaviour,
        team: { points: team.points, currentPosition: team.currentPosition, goalsFor: team.goalsFor, goalsAgainst: team.goalsAgainst, yellowCards: team.yellowCards, redCards: team.redCards },
        players: players.map((p) => ({ id: p.id, goals: p.goals, yellowCards: p.yellowCards, redCards: p.redCards, minutes: p.minutes, matches: p.matches })),
      }),
    });
    setBehaviour("");
    setState("saved");
    fetch(`/api/weekly?teamId=${teamId}`).then((r) => r.json()).then(setRecent);
  }

  return (
    <div className="space-y-4">
      {/* Cabecera */}
      <div className="card flex flex-wrap items-center gap-3 p-3">
        <div>
          <label className="label">Equipo</label>
          <select className="input w-auto" value={teamId} onChange={(e) => setTeamId(e.target.value)}>
            {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Jornada</label>
          <input className="input w-28" value={week} onChange={(e) => setWeek(e.target.value)} />
        </div>
        <div>
          <label className="label">Temporada</label>
          <input className="input w-28" value={season} onChange={(e) => setSeason(e.target.value)} />
        </div>
        <button onClick={save} disabled={state === "saving" || !team} className="btn-primary ml-auto self-end disabled:opacity-50">
          {state === "saving" ? "Guardando..." : state === "saved" ? "Jornada guardada" : "Guardar jornada"}
        </button>
      </div>

      {/* Datos de equipo */}
      {team && (
        <div className="card p-4">
          <h3 className="section-title mb-3">Clasificación del equipo</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Num label="Posición" value={team.currentPosition ?? 0} onChange={(v) => setT("currentPosition", v)} />
            <Num label="Puntos" value={team.points ?? 0} onChange={(v) => setT("points", v)} />
            <Num label="GF" value={team.goalsFor} onChange={(v) => setT("goalsFor", v)} />
            <Num label="GC" value={team.goalsAgainst} onChange={(v) => setT("goalsAgainst", v)} />
            <Num label="Amarillas" value={team.yellowCards} onChange={(v) => setT("yellowCards", v)} />
            <Num label="Rojas" value={team.redCards} onChange={(v) => setT("redCards", v)} />
          </div>
        </div>
      )}

      {/* Estadística de jugadores (rápida) */}
      <div className="card overflow-hidden">
        <div className="border-b border-ink-line px-4 py-2.5"><h3 className="section-title">Estadística de jugadores</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-2">Jugador</th>
                <th className="px-2 py-2 text-center">PJ</th>
                <th className="px-2 py-2 text-center">Min</th>
                <th className="px-2 py-2 text-center">Goles</th>
                <th className="px-2 py-2 text-center">Amar.</th>
                <th className="px-2 py-2 text-center">Rojas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-line">
              {players.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-1.5">
                    {p.dorsal != null && <span className="mr-1 text-xs text-gray-400">#{p.dorsal}</span>}
                    {p.name}
                  </td>
                  <td className="px-2 py-1.5"><Cell value={p.matches} onChange={(v) => setP(p.id, "matches", v)} /></td>
                  <td className="px-2 py-1.5"><Cell value={p.minutes} onChange={(v) => setP(p.id, "minutes", v)} w={64} /></td>
                  <td className="px-2 py-1.5"><Cell value={p.goals} onChange={(v) => setP(p.id, "goals", v)} /></td>
                  <td className="px-2 py-1.5"><Cell value={p.yellowCards} onChange={(v) => setP(p.id, "yellowCards", v)} /></td>
                  <td className="px-2 py-1.5"><Cell value={p.redCards} onChange={(v) => setP(p.id, "redCards", v)} /></td>
                </tr>
              ))}
              {players.length === 0 && <tr><td colSpan={6} className="px-4 py-4 text-gray-400">Sin jugadores en este equipo.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comportamiento + accesos */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <h3 className="section-title mb-2">Comportamiento (equipo y banquillo)</h3>
          <textarea className="input min-h-[80px]" value={behaviour} onChange={(e) => setBehaviour(e.target.value)} placeholder="Cómo se comportó el equipo, el banquillo, incidencias..." />
          <p className="mt-1 text-xs text-ink-muted">Se guarda como nota del equipo asociada a la jornada.</p>
        </div>
        <div className="card p-4">
          <h3 className="section-title mb-2">Nuevas situaciones observadas</h3>
          <p className="text-sm text-ink-muted">¿Has visto algo táctico nuevo esta jornada? Créalo en el campo táctico.</p>
          <Link href="/tactics" className="btn-ghost mt-3"><TargetIcon className="h-4 w-4" /> Ir al campo táctico</Link>
          {recent.length > 0 && (
            <div className="mt-4">
              <p className="eyebrow mb-1">Últimas jornadas guardadas</p>
              <ul className="flex flex-wrap gap-1.5">
                {recent.map((r) => <li key={r.id} className="chip bg-gray-100 text-ink-muted"><NoteIcon className="h-3 w-3" /> {r.week}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type="number" className="input" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function Cell({ value, onChange, w = 56 }: { value: number; onChange: (v: number) => void; w?: number }) {
  return (
    <input
      type="number"
      className="mx-auto block rounded-md border border-ink-line px-2 py-1 text-center text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
      style={{ width: w }}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}
