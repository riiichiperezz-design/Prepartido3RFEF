"use client";

import { useState } from "react";

export interface Instructions {
  assistant1: string;
  assistant2: string;
  benches: string;
  areas: string;
  offside: string;
  setPieces: string;
  communication: string;
  finalRemarks: string;
}

const FIELDS: { key: keyof Instructions; label: string; placeholder: string }[] = [
  { key: "assistant1", label: "Asistente 1", placeholder: "Banda, indicaciones específicas..." },
  { key: "assistant2", label: "Asistente 2", placeholder: "Banda, indicaciones específicas..." },
  { key: "benches", label: "Banquillos", placeholder: "Control de zonas técnicas, técnicos a vigilar..." },
  { key: "areas", label: "Áreas", placeholder: "Atención a forcejeos, agarrones en córner..." },
  { key: "offside", label: "Fuera de juego", placeholder: "Línea defensiva, ritmo de subida..." },
  { key: "setPieces", label: "Balón parado", placeholder: "Reparto en córners y faltas peligrosas..." },
  { key: "communication", label: "Comunicación arbitral", placeholder: "Señales acordadas, uso de intercom/banderín..." },
  { key: "finalRemarks", label: "Observaciones finales", placeholder: "Cualquier otra indicación..." },
];

/** Formulario editable de instrucciones para los asistentes (sección G). */
export default function AssistantInstructions({
  home,
  away,
  date,
  round,
  initial,
}: {
  home: string;
  away: string;
  date?: string;
  round?: string;
  initial?: Partial<Instructions>;
}) {
  const empty: Instructions = {
    assistant1: "", assistant2: "", benches: "", areas: "",
    offside: "", setPieces: "", communication: "", finalRemarks: "",
  };
  const [data, setData] = useState<Instructions>({ ...empty, ...initial });
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  function set(key: keyof Instructions, value: string) {
    setData((d) => ({ ...d, [key]: value }));
    setState("idle");
  }

  async function save() {
    setState("saving");
    await fetch("/api/match/instructions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ home, away, date, round, instructions: data }),
    });
    setState("saved");
  }

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="section-title">Instrucciones para asistentes</h3>
        <button onClick={save} disabled={state === "saving"} className="btn-primary no-print disabled:opacity-50">
          {state === "saving" ? "Guardando..." : state === "saved" ? "Guardado" : "Guardar"}
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="label">{f.label}</label>
            <textarea
              className="input min-h-[64px]"
              value={data[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              placeholder={f.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
