"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RISK_ORDER } from "@/lib/risk";
import { POSITIONS, POSITION_LABELS, type Position, type RiskLevel } from "@/lib/enums";
import { parseList } from "@/lib/format";
import RiskBadge from "./RiskBadge";

export interface PlayerRow {
  id: string;
  name: string;
  teamName: string;
  dorsal: number | null;
  age: number | null;
  position: string | null;
  goals: number;
  yellowCards: number;
  redCards: number;
  previousSeasonYellowCards: number;
  previousSeasonRedCards: number;
  behaviourTags: string | null;
  effectiveRisk: RiskLevel;
}

/** Tabla visual de jugadores con filtros y ordenaciones. */
export default function PlayersExplorer({
  players,
  teams,
}: {
  players: PlayerRow[];
  teams: string[];
}) {
  const [q, setQ] = useState("");
  const [team, setTeam] = useState("");
  const [position, setPosition] = useState("");
  const [risk, setRisk] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState("goals");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    players.forEach((p) => parseList(p.behaviourTags).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [players]);

  const rows = useMemo(() => {
    let list = players.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (team && p.teamName !== team) return false;
      if (position && p.position !== position) return false;
      if (risk && p.effectiveRisk !== risk) return false;
      if (tag && !parseList(p.behaviourTags).includes(tag)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "yellow": return b.yellowCards - a.yellowCards;
        case "red": return b.redCards - a.redCards;
        case "risk": return RISK_ORDER[b.effectiveRisk] - RISK_ORDER[a.effectiveRisk];
        case "young": return (a.age ?? 99) - (b.age ?? 99);
        case "veteran": return (b.age ?? 0) - (a.age ?? 0);
        default: return b.goals - a.goals;
      }
    });
    return list;
  }, [players, q, team, position, risk, tag, sort]);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="card grid grid-cols-2 gap-3 p-4 md:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 md:col-span-1">
          <label className="label">Buscar</label>
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nombre..." />
        </div>
        <div>
          <label className="label">Equipo</label>
          <select className="input" value={team} onChange={(e) => setTeam(e.target.value)}>
            <option value="">Todos</option>
            {teams.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Posición</label>
          <select className="input" value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="">Todas</option>
            {POSITIONS.map((p) => <option key={p} value={p}>{POSITION_LABELS[p]}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Riesgo</label>
          <select className="input" value={risk} onChange={(e) => setRisk(e.target.value)}>
            <option value="">Todos</option>
            <option value="HIGH">Alto</option>
            <option value="MEDIUM">Medio</option>
            <option value="LOW">Bajo</option>
          </select>
        </div>
        <div>
          <label className="label">Etiqueta</label>
          <select className="input" value={tag} onChange={(e) => setTag(e.target.value)}>
            <option value="">Todas</option>
            {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Ordenar por</label>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="goals">Más goles</option>
            <option value="yellow">Más amarillas</option>
            <option value="red">Más rojas</option>
            <option value="risk">Mayor riesgo</option>
            <option value="young">Más joven</option>
            <option value="veteran">Más veterano</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-ink-muted">{rows.length} jugadores</p>

      {/* Tabla */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Jugador</th>
                <th className="px-3 py-3">Equipo</th>
                <th className="px-3 py-3">Pos.</th>
                <th className="px-3 py-3 text-center">Edad</th>
                <th className="px-3 py-3 text-center">⚽</th>
                <th className="px-3 py-3 text-center">🟨</th>
                <th className="px-3 py-3 text-center">🟥</th>
                <th className="px-3 py-3 text-center">Etiquetas</th>
                <th className="px-3 py-3 text-center">Riesgo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5">
                    <Link href={`/players/${p.id}`} className="font-medium text-ink hover:underline">
                      {p.dorsal != null && <span className="mr-1 text-xs text-slate-400">#{p.dorsal}</span>}
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-ink-muted">{p.teamName}</td>
                  <td className="px-3 py-2.5 text-ink-muted">{p.position ? POSITION_LABELS[p.position as Position] ?? p.position : "—"}</td>
                  <td className="px-3 py-2.5 text-center">{p.age ?? "—"}</td>
                  <td className="px-3 py-2.5 text-center font-semibold">{p.goals}</td>
                  <td className="px-3 py-2.5 text-center text-amber-600 font-semibold">{p.yellowCards}</td>
                  <td className="px-3 py-2.5 text-center text-red-600 font-semibold">{p.redCards}</td>
                  <td className="px-3 py-2.5 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {parseList(p.behaviourTags).map((t) => (
                        <span key={t} className="chip bg-slate-100 text-ink-muted text-[10px]">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <RiskBadge level={p.effectiveRisk} size="sm" label={{ LOW: "Bajo", MEDIUM: "Medio", HIGH: "Alto" }[p.effectiveRisk]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
