"use client";

import { useEffect, useRef, useState } from "react";
import FootballPitch from "./FootballPitch";
import { PlayerToken, ArrowShape, ZoneShape, MarkerShape, TextShape } from "./boardElements";
import {
  buildFormation,
  svgToNorm,
  newId,
  FORMATIONS,
  ARROW_KINDS,
  ZONE_KINDS,
  MARKER_KINDS,
  type BoardState,
  type FormationKey,
  type Orientation,
  type ArrowKind,
  type ZoneKind,
  type MarkerKind,
} from "@/lib/tactics";
import {
  EditIcon,
  DeleteIcon,
  DownloadIcon,
  PlusIcon,
} from "../icons";

export interface BoardPlayer {
  id: string;
  name: string;
  shortName?: string | null;
  photoUrl?: string | null;
  dorsal?: number | null;
  age?: number | null;
  position?: string | null;
  goals: number;
  yellowCards: number;
  redCards: number;
  behaviourTags?: string | null;
  effectiveRisk: string;
  notes?: string | null;
}

type Tool = "move" | "arrow" | "zone" | "marker" | "text";

/** Editor interactivo de la pizarra táctica. */
export default function TacticsBoard({
  initialBoard,
  players,
  onChange,
}: {
  initialBoard: BoardState;
  players: BoardPlayer[];
  onChange?: (board: BoardState) => void;
}) {
  const [board, setBoard] = useState<BoardState>(initialBoard);
  const [tool, setTool] = useState<Tool>("move");
  const [arrowKind, setArrowKind] = useState<ArrowKind>("attack");
  const [zoneKind, setZoneKind] = useState<ZoneKind>("press");
  const [markerKind, setMarkerKind] = useState<MarkerKind>("referee");
  const [selected, setSelected] = useState<{ type: string; id: string } | null>(null);
  const [hover, setHover] = useState<{ player: BoardPlayer; x: number; y: number } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ type: string; id: string } | null>(null);
  const draft = useRef<{ kind: "arrow" | "zone"; sx: number; sy: number } | null>(null);
  const [draftEl, setDraftEl] = useState<BoardState["arrows"][0] | BoardState["zones"][0] | null>(null);

  useEffect(() => onChange?.(board), [board, onChange]);

  const meta = (playerId?: string) => {
    const p = playerId ? players.find((pl) => pl.id === playerId) : undefined;
    return { risk: p?.effectiveRisk, photoUrl: p?.photoUrl };
  };

  /** Convierte un evento de puntero a coords normalizadas del campo. */
  function toNorm(e: React.PointerEvent | PointerEvent): [number, number] {
    const svg = svgRef.current!;
    const ctm = svg.getScreenCTM();
    if (!ctm) return [50, 50];
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const u = pt.matrixTransform(ctm.inverse());
    return svgToNorm(u.x, u.y, board.orientation);
  }

  function setFormation(formation: FormationKey) {
    setBoard((b) => {
      // Conserva asociaciones existentes por orden
      const fresh = buildFormation(formation);
      const merged = fresh.map((fp, i) => {
        const prev = b.players[i];
        return prev ? { ...fp, playerId: prev.playerId, dorsal: prev.dorsal, label: prev.label } : fp;
      });
      return { ...b, formation, players: merged };
    });
  }

  function startElementDrag(e: React.PointerEvent, type: string, id: string) {
    if (tool !== "move") return;
    e.stopPropagation();
    drag.current = { type, id };
    setSelected({ type, id });
    svgRef.current?.setPointerCapture(e.pointerId);
  }

  function onPointerDown(e: React.PointerEvent) {
    const [nx, ny] = toNorm(e);
    if (tool === "marker") {
      setBoard((b) => ({ ...b, markers: [...b.markers, { id: newId("m"), kind: markerKind, x: nx, y: ny, label: MARKER_KINDS[markerKind].label }] }));
      return;
    }
    if (tool === "text") {
      const text = window.prompt("Texto a añadir:");
      if (text) setBoard((b) => ({ ...b, texts: [...b.texts, { id: newId("t"), x: nx, y: ny, text }] }));
      return;
    }
    if (tool === "arrow" || tool === "zone") {
      draft.current = { kind: tool, sx: nx, sy: ny };
      svgRef.current?.setPointerCapture(e.pointerId);
      return;
    }
    setSelected(null); // move: clic en vacío deselecciona
  }

  function onPointerMove(e: React.PointerEvent) {
    if (drag.current) {
      const [nx, ny] = toNorm(e);
      const { type, id } = drag.current;
      setBoard((b) => {
        if (type === "player") return { ...b, players: b.players.map((p) => (p.id === id ? { ...p, x: nx, y: ny } : p)) };
        if (type === "marker") return { ...b, markers: b.markers.map((m) => (m.id === id ? { ...m, x: nx, y: ny } : m)) };
        if (type === "text") return { ...b, texts: b.texts.map((t) => (t.id === id ? { ...t, x: nx, y: ny } : t)) };
        return b;
      });
      return;
    }
    if (draft.current) {
      const [nx, ny] = toNorm(e);
      const d = draft.current;
      if (d.kind === "arrow") {
        setDraftEl({ id: "draft", kind: arrowKind, x1: d.sx, y1: d.sy, x2: nx, y2: ny });
      } else {
        setDraftEl({ id: "draft", kind: zoneKind, x: Math.min(d.sx, nx), y: Math.min(d.sy, ny), w: Math.abs(nx - d.sx), h: Math.abs(ny - d.sy) });
      }
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    if (drag.current) {
      drag.current = null;
      return;
    }
    if (draft.current) {
      const [nx, ny] = toNorm(e);
      const d = draft.current;
      if (d.kind === "arrow") {
        const dist = Math.hypot(nx - d.sx, ny - d.sy);
        if (dist > 3) setBoard((b) => ({ ...b, arrows: [...b.arrows, { id: newId("a"), kind: arrowKind, x1: d.sx, y1: d.sy, x2: nx, y2: ny }] }));
      } else {
        const w = Math.abs(nx - d.sx), h = Math.abs(ny - d.sy);
        if (w > 4 && h > 4) setBoard((b) => ({ ...b, zones: [...b.zones, { id: newId("z"), kind: zoneKind, x: Math.min(d.sx, nx), y: Math.min(d.sy, ny), w, h }] }));
      }
      draft.current = null;
      setDraftEl(null);
    }
  }

  function assignPlayer(tokenId: string, realId: string) {
    const real = players.find((p) => p.id === realId);
    setBoard((b) => ({
      ...b,
      players: b.players.map((p) =>
        p.id === tokenId ? { ...p, playerId: realId || undefined, dorsal: real?.dorsal ?? undefined, label: real ? (real.shortName ?? real.name.split(" ")[0]) : p.role } : p,
      ),
    }));
  }

  function deleteSelected() {
    if (!selected) return;
    const { type, id } = selected;
    setBoard((b) => ({
      ...b,
      arrows: type === "arrow" ? b.arrows.filter((a) => a.id !== id) : b.arrows,
      zones: type === "zone" ? b.zones.filter((z) => z.id !== id) : b.zones,
      markers: type === "marker" ? b.markers.filter((m) => m.id !== id) : b.markers,
      texts: type === "text" ? b.texts.filter((t) => t.id !== id) : b.texts,
    }));
    setSelected(null);
  }

  function downloadPng() {
    const svg = svgRef.current;
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const svg64 = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(xml)));
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = (svg.viewBox.baseVal.width || 680) * scale;
      canvas.height = (svg.viewBox.baseVal.height || 1050) * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "situacion-tactica.png";
      a.click();
    };
    img.src = svg64;
  }

  const o: Orientation = board.orientation;
  const selectedPlayer = selected?.type === "player" ? board.players.find((p) => p.id === selected.id) : null;

  return (
    <div className="space-y-3">
      {/* Barra de herramientas */}
      <div className="card flex flex-wrap items-center gap-2 p-3">
        <select className="input w-auto" value={board.formation} onChange={(e) => setFormation(e.target.value as FormationKey)}>
          {FORMATIONS.map((f) => <option key={f} value={f}>{f === "CUSTOM" ? "Personalizado" : f}</option>)}
        </select>
        <button onClick={() => setBoard((b) => ({ ...b, orientation: b.orientation === "vertical" ? "horizontal" : "vertical" }))} className="btn-ghost text-xs">
          Vista: {o === "vertical" ? "Vertical" : "Horizontal"}
        </button>

        <span className="mx-1 h-6 w-px bg-ink-line" />

        <ToolButton active={tool === "move"} onClick={() => setTool("move")} label="Mover" Icon={EditIcon} />
        <div className="flex items-center gap-1">
          <ToolButton active={tool === "arrow"} onClick={() => setTool("arrow")} label="Flecha" Icon={PlusIcon} />
          {tool === "arrow" && (
            <select className="input w-auto text-xs" value={arrowKind} onChange={(e) => setArrowKind(e.target.value as ArrowKind)}>
              {Object.entries(ARROW_KINDS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          )}
        </div>
        <div className="flex items-center gap-1">
          <ToolButton active={tool === "zone"} onClick={() => setTool("zone")} label="Zona" Icon={PlusIcon} />
          {tool === "zone" && (
            <select className="input w-auto text-xs" value={zoneKind} onChange={(e) => setZoneKind(e.target.value as ZoneKind)}>
              {Object.entries(ZONE_KINDS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          )}
        </div>
        <div className="flex items-center gap-1">
          <ToolButton active={tool === "marker"} onClick={() => setTool("marker")} label="Marcador" Icon={PlusIcon} />
          {tool === "marker" && (
            <select className="input w-auto text-xs" value={markerKind} onChange={(e) => setMarkerKind(e.target.value as MarkerKind)}>
              {Object.entries(MARKER_KINDS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          )}
        </div>
        <ToolButton active={tool === "text"} onClick={() => setTool("text")} label="Texto" Icon={PlusIcon} />

        <span className="mx-1 h-6 w-px bg-ink-line" />
        <button onClick={deleteSelected} disabled={!selected} className="btn-ghost text-xs disabled:opacity-40">
          <DeleteIcon className="h-3.5 w-3.5" /> Borrar
        </button>
        <button onClick={downloadPng} className="btn-ghost text-xs">
          <DownloadIcon className="h-3.5 w-3.5" /> PNG
        </button>
      </div>

      {/* Panel de asociación de jugador */}
      {selectedPlayer && (
        <div className="card flex flex-wrap items-center gap-2 p-3 text-sm">
          <span className="text-ink-muted">Asociar <strong className="text-ink">{selectedPlayer.label}</strong> a jugador real:</span>
          <select className="input w-auto" value={selectedPlayer.playerId ?? ""} onChange={(e) => assignPlayer(selectedPlayer.id, e.target.value)}>
            <option value="">— Sin asociar —</option>
            {players.map((p) => <option key={p.id} value={p.id}>{p.dorsal ? `${p.dorsal} · ` : ""}{p.name}</option>)}
          </select>
        </div>
      )}

      {/* Pizarra */}
      <div
        ref={wrapRef}
        className="relative mx-auto"
        style={{ maxWidth: o === "vertical" ? 460 : 760 }}
        onPointerMove={(e) => {
          if (!hover) return;
          const rect = wrapRef.current?.getBoundingClientRect();
          if (rect) setHover((h) => (h ? { ...h, x: e.clientX - rect.left, y: e.clientY - rect.top } : h));
        }}
      >
        <FootballPitch
          orientation={o}
          innerRef={svgRef}
          className="w-full select-none rounded-xl shadow-card"
        >
          <g onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
            {/* Capa de fondo para capturar eventos en zonas vacías */}
            <rect x={-50} y={-50} width="200%" height="200%" fill="transparent" />
            {board.zones.map((z) => (
              <g key={z.id} onPointerDown={(e) => startElementDrag(e, "zone", z.id)}><ZoneShape zone={z} orientation={o} /></g>
            ))}
            {board.arrows.map((a) => (
              <g key={a.id} onPointerDown={(e) => { e.stopPropagation(); setSelected({ type: "arrow", id: a.id }); }}><ArrowShape arrow={a} orientation={o} /></g>
            ))}
            {draftEl && "x1" in draftEl && <ArrowShape arrow={draftEl} orientation={o} />}
            {draftEl && "w" in draftEl && <ZoneShape zone={draftEl} orientation={o} />}
            {board.texts.map((t) => (
              <g key={t.id} onPointerDown={(e) => startElementDrag(e, "text", t.id)}><TextShape text={t} orientation={o} /></g>
            ))}
            {board.markers.map((m) => (
              <g key={m.id} onPointerDown={(e) => startElementDrag(e, "marker", m.id)}><MarkerShape marker={m} orientation={o} /></g>
            ))}
            {board.players.map((p) => {
              const mt = meta(p.playerId);
              const real = p.playerId ? players.find((pl) => pl.id === p.playerId) : null;
              return (
                <PlayerToken
                  key={p.id}
                  player={p}
                  orientation={o}
                  risk={mt.risk}
                  photoUrl={mt.photoUrl}
                  selected={selected?.type === "player" && selected.id === p.id}
                  onPointerDown={(e) => startElementDrag(e, "player", p.id)}
                  onPointerEnter={real ? (e) => {
                    const rect = wrapRef.current?.getBoundingClientRect();
                    setHover({ player: real, x: rect ? e.clientX - rect.left : 0, y: rect ? e.clientY - rect.top : 0 });
                  } : undefined}
                  onPointerLeave={() => setHover(null)}
                />
              );
            })}
          </g>
        </FootballPitch>

        {hover && <PlayerTooltip player={hover.player} x={hover.x} y={hover.y} />}
      </div>
    </div>
  );
}

function ToolButton({ active, onClick, label, Icon }: { active: boolean; onClick: () => void; label: string; Icon: typeof EditIcon }) {
  return (
    <button onClick={onClick} className={`btn text-xs ${active ? "bg-ink text-white" : "border border-ink-line bg-white text-ink hover:bg-gray-50"}`}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function PlayerTooltip({ player, x, y }: { player: BoardPlayer; x: number; y: number }) {
  const tags = (player.behaviourTags ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  return (
    <div
      className="pointer-events-none absolute z-20 w-56 rounded-xl border border-ink-line bg-white p-3 shadow-cardhover"
      style={{ left: Math.min(x + 12, 320), top: y + 12 }}
    >
      <div className="flex items-center gap-2">
        {player.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={player.photoUrl} alt={player.name} className="h-10 w-10 rounded-full border border-ink-line object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-ink-muted">
            {player.dorsal ?? "—"}
          </div>
        )}
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-ink">{player.name}</div>
          <div className="text-xs text-ink-muted">{player.position ?? "—"}{player.age ? ` · ${player.age} años` : ""}</div>
        </div>
      </div>
      <div className="mt-2 flex gap-3 text-xs text-ink-muted">
        <span><strong className="text-ink">{player.goals}</strong> goles</span>
        <span><strong className="text-risk-medium">{player.yellowCards}</strong> amar.</span>
        <span><strong className="text-risk-high">{player.redCards}</strong> rojas</span>
      </div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((t) => <span key={t} className="chip bg-gray-100 text-ink-muted">{t}</span>)}
        </div>
      )}
      {player.notes && <p className="mt-2 text-xs text-ink-muted">{player.notes}</p>}
    </div>
  );
}
