"use client";

import { useMemo, useState } from "react";
import TeamCard from "./TeamCard";
import type { EnrichedTeam } from "@/lib/data";
import { RISK_ORDER } from "@/lib/risk";

/** Pantalla de equipos: tarjetas visuales + filtros en memoria (rápido). */
export default function TeamsExplorer({ teams }: { teams: EnrichedTeam[] }) {
  const [name, setName] = useState("");
  const [risk, setRisk] = useState("");
  const [protest, setProtest] = useState("");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState("position");

  const cities = useMemo(
    () => Array.from(new Set(teams.map((t) => t.city).filter(Boolean))) as string[],
    [teams],
  );

  const filtered = useMemo(() => {
    let list = teams.filter((t) => {
      if (name && !t.name.toLowerCase().includes(name.toLowerCase())) return false;
      if (risk && t.effectiveRisk !== risk) return false;
      if (protest && t.protestLevel !== protest) return false;
      if (city && t.city !== city) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "risk":
          return RISK_ORDER[b.effectiveRisk] - RISK_ORDER[a.effectiveRisk];
        case "cards":
          return b.yellowCards + b.redCards * 2 - (a.yellowCards + a.redCards * 2);
        case "name":
          return a.name.localeCompare(b.name);
        default: // position
          return (a.currentPosition ?? 99) - (b.currentPosition ?? 99);
      }
    });
    return list;
  }, [teams, name, risk, protest, city, sort]);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="card grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="label">Nombre</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Buscar equipo..." />
        </div>
        <div>
          <label className="label">Riesgo arbitral</label>
          <select className="input" value={risk} onChange={(e) => setRisk(e.target.value)}>
            <option value="">Todos</option>
            <option value="HIGH">Alto</option>
            <option value="MEDIUM">Medio</option>
            <option value="LOW">Bajo</option>
          </select>
        </div>
        <div>
          <label className="label">Nivel de protesta</label>
          <select className="input" value={protest} onChange={(e) => setProtest(e.target.value)}>
            <option value="">Todos</option>
            <option value="HIGH">Muy protestón</option>
            <option value="MEDIUM">A veces</option>
            <option value="LOW">Tranquilo</option>
          </select>
        </div>
        <div>
          <label className="label">Localidad</label>
          <select className="input" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Todas</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Ordenar por</label>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="position">Clasificación</option>
            <option value="risk">Mayor riesgo</option>
            <option value="cards">Más tarjetas</option>
            <option value="name">Nombre</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-ink-muted">{filtered.length} equipos</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <TeamCard key={t.id} team={t} />
        ))}
      </div>
    </div>
  );
}
