import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

/** Tarjeta de estadística compacta y sobria. */
export default function StatCard({
  label,
  value,
  hint,
  tone = "default",
  Icon,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "default" | "good" | "warn" | "bad";
  Icon?: LucideIcon;
}) {
  const toneClass = {
    default: "text-ink",
    good: "text-risk-low",
    warn: "text-risk-medium",
    bad: "text-risk-high",
  }[tone];

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-3.5 w-3.5 text-ink-muted" strokeWidth={2} />}
        <div className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">{label}</div>
      </div>
      <div className={clsx("mt-1 text-2xl font-semibold tracking-tight", toneClass)}>{value}</div>
      {hint && <div className="mt-0.5 text-xs text-gray-400">{hint}</div>}
    </div>
  );
}
