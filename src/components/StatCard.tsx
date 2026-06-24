import clsx from "clsx";

/** Tarjeta de estadística compacta para paneles y comparativas. */
export default function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "default" | "good" | "warn" | "bad";
}) {
  const toneClass = {
    default: "text-ink",
    good: "text-pitch-700",
    warn: "text-amber-600",
    bad: "text-red-600",
  }[tone];

  return (
    <div className="card p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</div>
      <div className={clsx("mt-1 text-2xl font-extrabold", toneClass)}>{value}</div>
      {hint && <div className="mt-0.5 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}
