import clsx from "clsx";

export type AlertLevel = "info" | "low" | "medium" | "high";

/**
 * Caja de alerta arbitral. Se usa en el briefing para destacar avisos
 * automáticos ("jugador con muchas amarillas", "equipo muy físico", etc.).
 */
const styles: Record<AlertLevel, { box: string; icon: string }> = {
  info: { box: "bg-slate-50 border-slate-200 text-ink", icon: "ℹ️" },
  low: { box: "bg-pitch-50 border-pitch-100 text-pitch-700", icon: "✅" },
  medium: { box: "bg-amber-50 border-amber-200 text-amber-800", icon: "⚠️" },
  high: { box: "bg-red-50 border-red-200 text-red-800", icon: "🚨" },
};

export default function AlertBox({
  level = "info",
  title,
  children,
}: {
  level?: AlertLevel;
  title?: string;
  children?: React.ReactNode;
}) {
  const s = styles[level];
  return (
    <div className={clsx("flex gap-3 rounded-xl border p-3 text-sm", s.box)}>
      <span className="text-base leading-5">{s.icon}</span>
      <div className="min-w-0">
        {title && <div className="font-semibold">{title}</div>}
        {children && <div className="text-[13px] leading-snug opacity-90">{children}</div>}
      </div>
    </div>
  );
}
