"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { POSITION_LABELS, type Position } from "@/lib/enums";

interface ParsedRow { dorsal?: number; name: string; position?: string }

// Diccionario de posiciones (español y abreviaturas) → códigos de la app
const POS_MAP: Record<string, string> = {
  portero: "GK", por: "GK", pt: "GK", gk: "GK",
  central: "CB", cb: "CB", ct: "CB",
  defensa: "CB", def: "CB", df: "CB", defensacentral: "CB",
  lateral: "FB", ld: "FB", li: "FB", lat: "FB", fb: "FB", carrilero: "FB",
  pivote: "DM", mediocentrodefensivo: "DM", dm: "DM", mcd: "DM",
  medio: "CM", mediocentro: "CM", centrocampista: "CM", med: "CM", mc: "CM", cm: "CM",
  mediapunta: "AM", enganche: "AM", am: "AM", mp: "AM",
  extremo: "WINGER", ext: "WINGER", ei: "WINGER", ed: "WINGER", banda: "WINGER", winger: "WINGER",
  delantero: "ST", del: "ST", dl: "ST", punta: "ST", ariete: "ST", dc: "ST", st: "ST", delanterocentro: "ST",
};

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
}

/** Parsea el texto pegado en filas {dorsal, nombre, posición}. */
export function parseSquad(text: string): ParsedRow[] {
  return text
    .split(/\r?\n/)
    .map((raw) => raw.replace(/\t/g, " ").trim())
    .filter(Boolean)
    .map((line) => {
      let rest = line;
      let dorsal: number | undefined;
      const md = rest.match(/^(\d{1,2})\s*[.\-)]?\s+/);
      if (md) {
        dorsal = parseInt(md[1], 10);
        rest = rest.slice(md[0].length);
      }
      // Detecta posición en el primer o último token
      const tokens = rest.split(/\s+/).filter(Boolean);
      let position: string | undefined;
      if (tokens.length > 1) {
        const last = normalize(tokens[tokens.length - 1]);
        const first = normalize(tokens[0]);
        if (POS_MAP[last]) { position = POS_MAP[last]; tokens.pop(); }
        else if (POS_MAP[first]) { position = POS_MAP[first]; tokens.shift(); }
      }
      // "APELLIDO, NOMBRE" → "Nombre Apellido" (opcional, más legible)
      let name = tokens.join(" ").replace(/\s*,\s*/g, ", ").trim();
      const comma = name.match(/^([^,]+),\s*(.+)$/);
      if (comma) name = `${titleCase(comma[2])} ${titleCase(comma[1])}`;
      else name = titleCase(name);
      return { dorsal, name, position };
    })
    .filter((r) => r.name.length > 1);
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/** Formulario para pegar una plantilla entera y crearla de golpe. */
export default function BulkAddPlayers({ teamId, onDone }: { teamId: string; onDone: () => void }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null);

  const rows = useMemo(() => parseSquad(text), [text]);

  async function submit() {
    if (rows.length === 0) return;
    setSaving(true);
    const res = await fetch("/api/players/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId, players: rows }),
    });
    const data = await res.json();
    setResult(data);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-ink-muted">
        Copia la lista de jugadores desde la web de la FExF (o de donde sea) y pégala aquí. Una línea por
        jugador. Detecta el dorsal al principio y la posición si aparece (Portero, Defensa, Medio, Delantero...).
      </p>
      <textarea
        className="input min-h-[160px] font-mono text-xs"
        placeholder={"1 Sergio Manceras Portero\n4 Adrián Calderón Central\n10 Jonatan Cidoncha Mediapunta\n..."}
        value={text}
        onChange={(e) => { setText(e.target.value); setResult(null); }}
        autoFocus
      />

      {rows.length > 0 && !result && (
        <div className="rounded-xl border border-ink-line">
          <div className="border-b border-ink-line px-3 py-2 text-xs text-ink-muted">{rows.length} jugadores detectados</div>
          <ul className="max-h-52 divide-y divide-ink-line overflow-y-auto text-sm">
            {rows.map((r, i) => (
              <li key={i} className="flex items-center gap-2 px-3 py-1.5">
                <span className="w-8 text-xs text-gray-400">{r.dorsal ?? "—"}</span>
                <span className="flex-1 text-ink">{r.name}</span>
                <span className="text-xs text-ink-muted">{r.position ? POSITION_LABELS[r.position as Position] ?? r.position : ""}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result ? (
        <div className="rounded-xl bg-risk-lowtint px-3 py-2 text-sm text-risk-low">
          Creados {result.created} jugadores{result.skipped ? ` · ${result.skipped} ya existían (omitidos)` : ""}.
        </div>
      ) : (
        <div className="flex gap-2">
          <button onClick={submit} disabled={saving || rows.length === 0} className="btn-primary disabled:opacity-50">
            {saving ? "Creando..." : `Crear ${rows.length} jugadores`}
          </button>
          <button onClick={onDone} className="btn-ghost">Cerrar</button>
        </div>
      )}
      {result && <button onClick={onDone} className="btn-ghost">Cerrar</button>}
    </div>
  );
}
