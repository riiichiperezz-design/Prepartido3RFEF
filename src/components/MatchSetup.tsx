"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "./Avatar";
import { BriefingIcon } from "./icons";

interface TeamOption {
  id: string;
  name: string;
  shortName: string | null;
  crestUrl: string | null;
  stadium: string | null;
}

/** Formulario de selección del partido a preparar. */
export default function MatchSetup({
  teams,
  defaultHome,
}: {
  teams: TeamOption[];
  defaultHome?: string;
}) {
  const router = useRouter();
  const [home, setHome] = useState(defaultHome ?? "");
  const [away, setAway] = useState("");
  const [date, setDate] = useState("");
  const [round, setRound] = useState("");

  const homeTeam = teams.find((t) => t.id === home);
  const awayTeam = teams.find((t) => t.id === away);

  function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!home || !away || home === away) return;
    const params = new URLSearchParams({ home, away });
    if (date) params.set("date", new Date(date).toISOString());
    if (round) params.set("round", round);
    router.push(`/match/briefing?${params.toString()}`);
  }

  return (
    <form onSubmit={generate} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Local */}
        <div className="card p-5">
          <label className="label">Equipo local</label>
          <select className="input" value={home} onChange={(e) => setHome(e.target.value)} required>
            <option value="">Selecciona equipo local...</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id} disabled={t.id === away}>
                {t.name}
              </option>
            ))}
          </select>
          {homeTeam && (
            <div className="mt-4 flex items-center gap-3">
              <Avatar name={homeTeam.shortName ?? homeTeam.name} src={homeTeam.crestUrl} size="lg" square />
              <div>
                <div className="font-bold text-ink">{homeTeam.name}</div>
                <div className="text-xs text-ink-muted">{homeTeam.stadium}</div>
              </div>
            </div>
          )}
        </div>

        {/* Visitante */}
        <div className="card p-5">
          <label className="label">Equipo visitante</label>
          <select className="input" value={away} onChange={(e) => setAway(e.target.value)} required>
            <option value="">Selecciona equipo visitante...</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id} disabled={t.id === home}>
                {t.name}
              </option>
            ))}
          </select>
          {awayTeam && (
            <div className="mt-4 flex items-center gap-3">
              <Avatar name={awayTeam.shortName ?? awayTeam.name} src={awayTeam.crestUrl} size="lg" square />
              <div>
                <div className="font-bold text-ink">{awayTeam.name}</div>
                <div className="text-xs text-ink-muted">{awayTeam.stadium}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <label className="label">Fecha y hora</label>
          <input type="datetime-local" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="label">Jornada</label>
          <input className="input" value={round} onChange={(e) => setRound(e.target.value)} placeholder="Ej: Jornada 3" />
        </div>
      </div>

      <button
        type="submit"
        disabled={!home || !away || home === away}
        className="btn-accent w-full py-3.5 text-base shadow-card disabled:opacity-40"
      >
        <BriefingIcon className="h-5 w-5" strokeWidth={2} />
        Generar briefing arbitral
      </button>
      {home && away && home === away && (
        <p className="text-center text-sm text-risk-high">El equipo local y el visitante deben ser distintos.</p>
      )}
    </form>
  );
}
