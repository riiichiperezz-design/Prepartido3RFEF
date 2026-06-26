import {
  normToSvg,
  ARROW_KINDS,
  ZONE_KINDS,
  type FieldPlayer,
  type FieldArrow,
  type FieldZone,
  type FieldMarker,
  type FieldText,
  type Orientation,
  type MarkerKind,
} from "@/lib/tactics";

const R = 22; // radio del token de jugador en unidades SVG (~2.2 m)

const RISK_COLOR: Record<string, string> = {
  LOW: "#15803d",
  MEDIUM: "#b45309",
  HIGH: "#991b1b",
};

/** Ficha de jugador sobre el campo (con dorsal, etiqueta, foto y aro de riesgo). */
export function PlayerToken({
  player,
  orientation,
  risk,
  photoUrl,
  selected,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
}: {
  player: FieldPlayer;
  orientation: Orientation;
  risk?: string | null;
  photoUrl?: string | null;
  selected?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  onPointerEnter?: (e: React.PointerEvent) => void;
  onPointerLeave?: () => void;
}) {
  const [x, y] = normToSvg(player.x, player.y, orientation);
  const ring = risk ? RISK_COLOR[risk] ?? "#111827" : "#111827";
  const clip = `clip-${player.id}`;
  return (
    <g
      transform={`translate(${x},${y})`}
      style={{ cursor: onPointerDown ? "grab" : "default" }}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {selected && <circle r={R + 6} fill="none" stroke="#ffffff" strokeWidth={2} strokeDasharray="4 3" />}
      <circle r={R} fill="#ffffff" stroke={ring} strokeWidth={4} />
      {photoUrl ? (
        <>
          <clipPath id={clip}>
            <circle r={R - 3} />
          </clipPath>
          <image href={photoUrl} x={-(R - 3)} y={-(R - 3)} width={(R - 3) * 2} height={(R - 3) * 2} clipPath={`url(#${clip})`} preserveAspectRatio="xMidYMid slice" />
        </>
      ) : (
        <text textAnchor="middle" dominantBaseline="central" fontSize={18} fontWeight={700} fill="#111827">
          {player.dorsal ?? ""}
        </text>
      )}
      {/* Etiqueta inferior */}
      <g transform={`translate(0,${R + 14})`}>
        <rect x={-28} y={-11} width={56} height={20} rx={5} fill="rgba(17,24,39,0.78)" />
        <text textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600} fill="#fff">
          {(player.dorsal != null ? player.dorsal + " " : "") + (player.label || player.role)}
        </text>
      </g>
    </g>
  );
}

export function ArrowShape({ arrow, orientation }: { arrow: FieldArrow; orientation: Orientation }) {
  const [x1, y1] = normToSvg(arrow.x1, arrow.y1, orientation);
  const [x2, y2] = normToSvg(arrow.x2, arrow.y2, orientation);
  const meta = ARROW_KINDS[arrow.kind];
  const mid = `ah-${arrow.id}`;
  return (
    <g>
      <defs>
        <marker id={mid} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={meta.color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={meta.color} strokeWidth={4} strokeDasharray={meta.dashed ? "10 7" : undefined} markerEnd={`url(#${mid})`} />
    </g>
  );
}

export function ZoneShape({ zone, orientation }: { zone: FieldZone; orientation: Orientation }) {
  const [ax, ay] = normToSvg(zone.x, zone.y, orientation);
  const [bx, by] = normToSvg(zone.x + zone.w, zone.y + zone.h, orientation);
  const meta = ZONE_KINDS[zone.kind];
  const x = Math.min(ax, bx), y = Math.min(ay, by);
  const w = Math.abs(bx - ax), h = Math.abs(by - ay);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={meta.color} fillOpacity={0.16} stroke={meta.color} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="8 5" />
      <text x={x + 8} y={y + 18} fontSize={13} fontWeight={600} fill={meta.color}>{meta.label}</text>
    </g>
  );
}

/** Marcador arbitral (árbitro, asistente, balón, tarjeta, etc.) en SVG, sin emojis. */
export function MarkerShape({ marker, orientation }: { marker: FieldMarker; orientation: Orientation }) {
  const [x, y] = normToSvg(marker.x, marker.y, orientation);
  return (
    <g transform={`translate(${x},${y})`}>
      <MarkerGlyph kind={marker.kind} />
      {marker.label && (
        <text textAnchor="middle" y={30} fontSize={12} fontWeight={600} fill="#fff" style={{ paintOrder: "stroke" }} stroke="rgba(17,24,39,0.7)" strokeWidth={3}>
          {marker.label}
        </text>
      )}
    </g>
  );
}

/** Glifos SVG sobrios para cada tipo de marcador (sin emojis, exportables a PNG). */
export function MarkerGlyph({ kind }: { kind: MarkerKind }) {
  switch (kind) {
    case "ball":
      return (
        <g>
          <circle r={11} fill="#fff" stroke="#111827" strokeWidth={2} />
          <path d="M0,-5 L4.7,-1.5 L2.9,4 L-2.9,4 L-4.7,-1.5 Z" fill="#111827" />
        </g>
      );
    case "referee":
      return (
        <g>
          <circle r={14} fill="#111827" />
          <text textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700} fill="#fff">ÁR</text>
        </g>
      );
    case "assistant":
      return (
        <g>
          <circle r={14} fill="#b45309" />
          <path d="M-3,-7 L-3,7" stroke="#fff" strokeWidth={2} />
          <path d="M-3,-7 L7,-4 L-3,-1 Z" fill="#fff" />
        </g>
      );
    case "whistle":
      return (
        <g>
          <circle r={13} fill="#374151" />
          <circle cx={-2} cy={0} r={5} fill="#fff" />
          <rect x={2} y={-3} width={9} height={6} rx={2} fill="#fff" />
        </g>
      );
    case "card":
      return <rect x={-7} y={-10} width={14} height={20} rx={2} fill="#b45309" stroke="#fff" strokeWidth={1.5} />;
    case "alert":
      return (
        <g>
          <path d="M0,-13 L13,10 L-13,10 Z" fill="#991b1b" stroke="#fff" strokeWidth={1.5} />
          <text textAnchor="middle" y={8} fontSize={13} fontWeight={800} fill="#fff">!</text>
        </g>
      );
    case "bench":
      return (
        <g>
          <rect x={-13} y={-4} width={26} height={7} rx={2} fill="#374151" />
          <rect x={-11} y={3} width={3} height={7} fill="#374151" />
          <rect x={8} y={3} width={3} height={7} fill="#374151" />
        </g>
      );
    default:
      return <circle r={10} fill="#374151" />;
  }
}

export function TextShape({ text, orientation }: { text: FieldText; orientation: Orientation }) {
  const [x, y] = normToSvg(text.x, text.y, orientation);
  return (
    <text x={x} y={y} fontSize={15} fontWeight={600} fill="#fff" style={{ paintOrder: "stroke" }} stroke="rgba(17,24,39,0.65)" strokeWidth={3}>
      {text.text}
    </text>
  );
}
