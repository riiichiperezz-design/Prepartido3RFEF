"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "./Avatar";
import { BackIcon, ForwardIcon, EditIcon, BriefingIcon, CalendarIcon, WatchIcon, CheckIcon } from "./icons";
import { formatDate } from "@/lib/format";

export interface CalTeamMini { id: string; name: string; shortName: string | null; crestUrl: string | null }
export interface CalMatch {
  id: string;
  home: CalTeamMini;
  away: CalTeamMini;
  date: string | null;
  stadium: string | null;
  status: string;
  designated: boolean;
  homeGoals: number | null;
  awayGoals: number | null;
  homeYellowCards: number;
  awayYellowCards: number;
  homeRedCards: number;
  awayRedCards: number;
  referee: string | null;
  assistant1: string | null;
  assistant2: string | null;
}

const STATUS_LABEL: Record<string, string> = { PENDING: "Pendiente", PREPARED: "Preparado", REFEREED: "Arbitrado" };

export default function CalendarView({
  matchdays,
  currentMd,
  selectedMd,
  matches,
}: {
  matchdays: number[];
  currentMd: number;
  selectedMd: number;
  matches: CalMatch[];
}) {
  const idx = matchdays.indexOf(selectedMd);
  const prev = idx > 0 ? matchdays[idx - 1] : null;
  const next = idx < matchdays.length - 1 ? matchdays[idx + 1] : null;

  return (
    <div className="space-y-4">
      {/* Navegación de jornadas */}
      <div className="card flex flex-wrap items-center gap-3 p-3">
        <Link href={prev ? `/calendar?md=${prev}` : "#"} aria-disabled={!prev} className={`btn-ghost text-sm ${!prev ? "pointer-events-none opacity-40" : ""}`}>
          <BackIcon className="h-4 w-4" /> Anterior
        </Link>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-ink-muted" strokeWidth={2} />
          <span className="text-lg font-semibold tracking-tight text-ink">Jornada {selectedMd}</span>
          {selectedMd === currentMd && <span className="chip bg-accent/10 text-accent">Actual</span>}
        </div>
        <Link href={next ? `/calendar?md=${next}` : "#"} aria-disabled={!next} className={`btn-ghost text-sm ${!next ? "pointer-events-none opacity-40" : ""}`}>
          Siguiente <ForwardIcon className="h-4 w-4" />
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {currentMd !== selectedMd && <Link href={`/calendar?md=${currentMd}`} className="btn-ghost text-xs">Ir a la jornada actual</Link>}
          <select
            className="input w-auto text-sm"
            value={selectedMd}
            onChange={(e) => { window.location.href = `/calendar?md=${e.target.value}`; }}
          >
            {matchdays.map((m) => <option key={m} value={m}>Jornada {m}</option>)}
          </select>
        </div>
      </div>

      {/* Partidos */}
      <div className="space-y-2">
        {matches.map((m) => <MatchCard key={m.id} match={m} />)}
      </div>
    </div>
  );
}

function MatchCard({ match }: { match: CalMatch }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const played = match.homeGoals != null && match.awayGoals != null;

  return (
    <div className={`card p-3 ${match.designated ? "ring-1 ring-accent" : ""}`}>
      <div className="flex items-center gap-3">
        {/* Equipos + resultado */}
        <div className="flex flex-1 items-center gap-2 text-sm">
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right">
            <span className="truncate font-medium text-ink">{match.home.shortName ?? match.home.name}</span>
            <Avatar name={match.home.shortName ?? match.home.name} src={match.home.crestUrl} size="sm" square variant="team" />
          </div>
          <div className="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-center text-sm font-semibold text-ink">
            {played ? `${match.homeGoals} - ${match.awayGoals}` : "vs"}
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Avatar name={match.away.shortName ?? match.away.name} src={match.away.crestUrl} size="sm" square variant="team" />
            <span className="truncate font-medium text-ink">{match.away.shortName ?? match.away.name}</span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
        <span>{formatDate(match.date)}</span>
        {match.stadium && <span className="hidden sm:inline">· {match.stadium}</span>}
        <span className="chip bg-gray-100 text-ink-muted">{STATUS_LABEL[match.status] ?? match.status}</span>
        {match.designated && <span className="chip bg-accent/10 text-accent"><WatchIcon className="h-3 w-3" /> Designado</span>}
        {(match.homeYellowCards + match.awayYellowCards) > 0 && <span className="chip bg-risk-mediumtint text-risk-medium">{match.homeYellowCards + match.awayYellowCards} amar.</span>}
        {(match.homeRedCards + match.awayRedCards) > 0 && <span className="chip bg-risk-hightint text-risk-high">{match.homeRedCards + match.awayRedCards} rojas</span>}

        <div className="ml-auto flex items-center gap-2">
          <Link
            href={`/match/briefing?home=${match.home.id}&away=${match.away.id}&round=${encodeURIComponent("Jornada")}&date=${match.date ?? ""}`}
            className="btn-ghost px-2 py-1 text-xs"
          >
            <BriefingIcon className="h-3.5 w-3.5" /> Briefing
          </Link>
          <button onClick={() => setOpen((o) => !o)} className="btn-ghost px-2 py-1 text-xs">
            <EditIcon className="h-3.5 w-3.5" /> {open ? "Cerrar" : "Editar"}
          </button>
        </div>
      </div>

      {open && <MatchEditor match={match} onDone={() => { setOpen(false); router.refresh(); }} />}
    </div>
  );
}

function MatchEditor({ match, onDone }: { match: CalMatch; onDone: () => void }) {
  const [f, setF] = useState({
    homeGoals: match.homeGoals ?? "",
    awayGoals: match.awayGoals ?? "",
    homeYellowCards: match.homeYellowCards,
    awayYellowCards: match.awayYellowCards,
    homeRedCards: match.homeRedCards,
    awayRedCards: match.awayRedCards,
    status: match.status,
    designated: match.designated,
    referee: match.referee ?? "",
    assistant1: match.assistant1 ?? "",
    assistant2: match.assistant2 ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/matches/${match.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    });
    setSaving(false);
    onDone();
  }

  const H = match.home.shortName ?? match.home.name;
  const A = match.away.shortName ?? match.away.name;

  return (
    <div className="mt-3 space-y-3 rounded-xl bg-gray-50 p-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label={`Goles ${H}`}><input type="number" className="input" value={f.homeGoals} onChange={(e) => setF({ ...f, homeGoals: e.target.value })} /></Field>
        <Field label={`Goles ${A}`}><input type="number" className="input" value={f.awayGoals} onChange={(e) => setF({ ...f, awayGoals: e.target.value })} /></Field>
        <Field label="Estado">
          <select className="input" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
            <option value="PENDING">Pendiente</option>
            <option value="PREPARED">Preparado</option>
            <option value="REFEREED">Arbitrado</option>
          </select>
        </Field>
        <label className="flex items-end gap-2 pb-2 text-sm text-ink-muted">
          <input type="checkbox" checked={f.designated} onChange={(e) => setF({ ...f, designated: e.target.checked })} />
          Me lo han designado
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label={`Amarillas ${H}`}><input type="number" className="input" value={f.homeYellowCards} onChange={(e) => setF({ ...f, homeYellowCards: Number(e.target.value) })} /></Field>
        <Field label={`Amarillas ${A}`}><input type="number" className="input" value={f.awayYellowCards} onChange={(e) => setF({ ...f, awayYellowCards: Number(e.target.value) })} /></Field>
        <Field label={`Rojas ${H}`}><input type="number" className="input" value={f.homeRedCards} onChange={(e) => setF({ ...f, homeRedCards: Number(e.target.value) })} /></Field>
        <Field label={`Rojas ${A}`}><input type="number" className="input" value={f.awayRedCards} onChange={(e) => setF({ ...f, awayRedCards: Number(e.target.value) })} /></Field>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="Árbitro"><input className="input" value={f.referee} onChange={(e) => setF({ ...f, referee: e.target.value })} placeholder="(yo)" /></Field>
        <Field label="Asistente 1"><input className="input" value={f.assistant1} onChange={(e) => setF({ ...f, assistant1: e.target.value })} /></Field>
        <Field label="Asistente 2"><input className="input" value={f.assistant2} onChange={(e) => setF({ ...f, assistant2: e.target.value })} /></Field>
      </div>
      <div className="flex gap-2">
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-50">
          <CheckIcon className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
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
