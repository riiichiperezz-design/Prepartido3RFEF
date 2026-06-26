import { meterToSvg, viewBox, FIELD_W_M, FIELD_L_M, type Orientation } from "@/lib/tactics";

/**
 * Terreno de juego en SVG con líneas reglamentarias, dibujado en una pizarra
 * sobria (césped verde apagado con franjas). Soporta orientación vertical u
 * horizontal. Los hijos se renderizan en el mismo espacio de coordenadas SVG.
 */
export default function FootballPitch({
  orientation = "vertical",
  className,
  children,
  innerRef,
}: {
  orientation?: Orientation;
  className?: string;
  children?: React.ReactNode;
  innerRef?: React.Ref<SVGSVGElement>;
}) {
  const o = orientation;
  const pt = (mx: number, my: number) => meterToSvg(mx, my, o);
  const line = (x1: number, y1: number, x2: number, y2: number, key: string) => {
    const [a, b] = pt(x1, y1);
    const [c, d] = pt(x2, y2);
    return <line key={key} x1={a} y1={b} x2={c} y2={d} stroke="rgba(255,255,255,0.7)" strokeWidth={2.5} />;
  };
  const rect = (mx1: number, my1: number, mx2: number, my2: number, key: string) => {
    const [a, b] = pt(mx1, my1);
    const [c, d] = pt(mx2, my2);
    return (
      <rect key={key} x={Math.min(a, c)} y={Math.min(b, d)} width={Math.abs(c - a)} height={Math.abs(d - b)} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2.5} />
    );
  };
  // Polilínea que aproxima el arco del área (la "D")
  const arc = (spotY: number, dir: 1 | -1, key: string) => {
    const r = 9.15, cx = 34;
    const pts: string[] = [];
    for (let i = 0; i <= 20; i++) {
      const x = cx - 7.31 + (14.62 * i) / 20;
      const dy = Math.sqrt(Math.max(0, r * r - (x - cx) * (x - cx)));
      const [sx, sy] = pt(x, spotY + dir * dy);
      pts.push(`${sx},${sy}`);
    }
    return <polyline key={key} points={pts.join(" ")} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2.5} />;
  };

  const [cx, cy] = pt(34, 52.5);
  const [spot1x, spot1y] = pt(34, 11);
  const [spot2x, spot2y] = pt(34, 94);
  const stripes = Array.from({ length: 10 });

  return (
    <svg
      ref={innerRef}
      viewBox={viewBox(o)}
      className={className}
      preserveAspectRatio="xMidYMid meet"
      style={{ touchAction: "none" }}
    >
      <defs>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c6b3c" />
          <stop offset="100%" stopColor="#15512f" />
        </linearGradient>
      </defs>

      {/* Césped */}
      <rect x={0} y={0} width="100%" height="100%" fill="url(#grass)" rx={6} />
      {/* Franjas suaves */}
      {stripes.map((_, i) => {
        const m1 = (FIELD_L_M / 10) * i;
        const m2 = (FIELD_L_M / 10) * (i + 1);
        const [, y1] = meterToSvg(0, m1, o);
        const [, y2] = meterToSvg(0, m2, o);
        const [x1] = meterToSvg(0, m1, o);
        const [x2] = meterToSvg(FIELD_W_M, m1, o);
        if (i % 2 === 1) return null;
        if (o === "vertical") {
          return <rect key={i} x={0} y={Math.min(y1, y2)} width={FIELD_W_M * 10} height={Math.abs(y2 - y1)} fill="rgba(255,255,255,0.035)" />;
        }
        const [px1] = meterToSvg(0, m1, o);
        const [px2] = meterToSvg(0, m2, o);
        return <rect key={i} x={Math.min(px1, px2)} y={0} width={Math.abs(px2 - px1)} height={FIELD_W_M * 10} fill="rgba(255,255,255,0.035)" />;
      })}

      {/* Líneas reglamentarias */}
      {rect(0, 0, FIELD_W_M, FIELD_L_M, "bound")}
      {line(0, 52.5, FIELD_W_M, 52.5, "half")}
      <circle cx={cx} cy={cy} r={9.15 * 10} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={3} fill="rgba(255,255,255,0.8)" />

      {/* Áreas (propia y rival) */}
      {rect(13.84, 0, 54.16, 16.5, "pa1")}
      {rect(24.84, 0, 43.16, 5.5, "ga1")}
      {rect(13.84, 88.5, 54.16, 105, "pa2")}
      {rect(24.84, 99.5, 43.16, 105, "ga2")}
      <circle cx={spot1x} cy={spot1y} r={3} fill="rgba(255,255,255,0.8)" />
      <circle cx={spot2x} cy={spot2y} r={3} fill="rgba(255,255,255,0.8)" />
      {arc(11, 1, "arc1")}
      {arc(94, -1, "arc2")}

      {/* Porterías */}
      {rect(30.34, -1.5, 37.66, 0, "goal1")}
      {rect(30.34, 105, 37.66, 106.5, "goal2")}

      {children}
    </svg>
  );
}
