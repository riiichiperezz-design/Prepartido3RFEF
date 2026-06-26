"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { TEMPLATES, templateCsv } from "@/lib/templates";
import type { ImportType } from "@/lib/import";
import AlertBox from "./AlertBox";
import { DownloadIcon } from "./icons";

type Row = Record<string, string>;

const TYPE_LABELS: Record<ImportType, string> = {
  teams: "Equipos",
  players: "Jugadores",
  staff: "Cuerpo técnico",
};

/** Asistente de importación de datos CSV/Excel. */
export default function ImportWizard({
  existing,
}: {
  existing: { teams: string[]; players: string[]; staff: string[] };
}) {
  const router = useRouter();
  const [type, setType] = useState<ImportType>("teams");
  const [rows, setRows] = useState<Row[]>([]);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [result, setResult] = useState<{ created: number; updated: number; errors: string[] } | null>(null);
  const [importing, setImporting] = useState(false);

  const columns = TEMPLATES[type].columns;
  const existingSet = useMemo(() => new Set(existing[type]), [existing, type]);

  /** Clave para detectar duplicados, según el tipo. */
  function rowKey(r: Row): string {
    if (type === "teams") return (r["nombre"] ?? "").trim();
    return `${(r["equipo"] ?? "").trim()}||${(r["nombre"] ?? "").trim()}`;
  }

  function downloadTemplate() {
    const csv = templateCsv(type);
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plantilla_${type}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setParseError(null);
    setResult(null);

    try {
      let parsed: Row[] = [];
      if (file.name.toLowerCase().endsWith(".csv")) {
        const text = await file.text();
        const res = Papa.parse<Row>(text, { header: true, skipEmptyLines: true });
        parsed = res.data;
      } else {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        parsed = XLSX.utils.sheet_to_json<Row>(sheet, { defval: "" });
      }
      // Solo filas con algún contenido
      parsed = parsed.filter((r) => Object.values(r).some((v) => String(v).trim() !== ""));
      if (parsed.length === 0) setParseError("El archivo no contiene filas con datos.");
      setRows(parsed);
    } catch (err) {
      setParseError("No se ha podido leer el archivo. ¿Es un CSV o Excel válido?");
      setRows([]);
    }
  }

  async function doImport() {
    setImporting(true);
    const res = await fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, rows }),
    });
    const data = await res.json();
    setResult(data);
    setImporting(false);
    router.refresh();
  }

  const newCount = rows.filter((r) => !existingSet.has(rowKey(r))).length;
  const updateCount = rows.length - newCount;

  return (
    <div className="space-y-5">
      {/* Paso 1: tipo + plantilla */}
      <div className="card p-5">
        <h2 className="section-title mb-3">1. ¿Qué quieres importar?</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TYPE_LABELS) as ImportType[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setType(t);
                setRows([]);
                setResult(null);
                setFileName("");
              }}
              className={`btn ${type === t ? "bg-ink text-white" : "bg-slate-100 text-ink"}`}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button onClick={downloadTemplate} className="btn-accent">
            <DownloadIcon className="h-4 w-4" strokeWidth={2} />
            Descargar plantilla {TYPE_LABELS[type].toLowerCase()}
          </button>
          <span className="text-xs text-ink-muted">
            Columnas: {columns.join(", ")}
          </span>
        </div>
      </div>

      {/* Paso 2: subir archivo */}
      <div className="card p-5">
        <h2 className="section-title mb-3">2. Sube tu archivo (CSV o Excel)</h2>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={onFile}
          className="block w-full text-sm text-ink-muted file:mr-4 file:rounded-xl file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-ink-soft"
        />
        {fileName && <p className="mt-2 text-xs text-ink-muted">Archivo: {fileName}</p>}
        {parseError && (
          <div className="mt-3">
            <AlertBox level="high" title="Error al leer el archivo">{parseError}</AlertBox>
          </div>
        )}
      </div>

      {/* Paso 3: previsualización */}
      {rows.length > 0 && (
        <div className="card p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="section-title">3. Previsualización ({rows.length} filas)</h2>
            <div className="flex gap-2 text-xs">
              <span className="chip bg-risk-lowtint text-risk-low">{newCount} nuevos</span>
              <span className="chip bg-risk-mediumtint text-risk-medium">{updateCount} a actualizar</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full min-w-[600px] text-xs">
              <thead className="bg-slate-50 text-left text-ink-muted">
                <tr>
                  <th className="px-2 py-2">Estado</th>
                  {columns.map((c) => (
                    <th key={c} className="px-2 py-2">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.slice(0, 50).map((r, i) => {
                  const isDup = existingSet.has(rowKey(r));
                  return (
                    <tr key={i}>
                      <td className="px-2 py-1.5">
                        <span className={`chip ${isDup ? "bg-risk-mediumtint text-risk-medium" : "bg-risk-lowtint text-risk-low"}`}>
                          {isDup ? "actualizar" : "nuevo"}
                        </span>
                      </td>
                      {columns.map((c) => (
                        <td key={c} className="px-2 py-1.5 text-slate-600">{r[c] ?? ""}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {rows.length > 50 && <p className="mt-2 text-xs text-slate-400">Mostrando 50 de {rows.length} filas.</p>}

          <div className="mt-4">
            <AlertBox level="info" title="Tus notas están a salvo">
              Al importar se actualizan estadísticas y tarjetas, pero tus notas propias (y las
              etiquetas/observaciones que ya tengas) no se borran.
            </AlertBox>
          </div>

          <button onClick={doImport} disabled={importing} className="btn-primary mt-4 disabled:opacity-50">
            {importing ? "Importando..." : `Importar ${rows.length} filas`}
          </button>
        </div>
      )}

      {/* Resultado */}
      {result && (
        <div className="card p-5">
          <h2 className="section-title mb-3">Resultado</h2>
          <div className="flex flex-wrap gap-2">
            <span className="chip bg-risk-lowtint text-risk-low">{result.created} creados</span>
            <span className="chip bg-risk-mediumtint text-risk-medium">{result.updated} actualizados</span>
            <span className="chip bg-slate-100 text-ink-muted">{result.errors.length} errores</span>
          </div>
          {result.errors.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-red-600">
              {result.errors.map((e, i) => (
                <li key={i}>• {e}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
