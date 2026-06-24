import clsx from "clsx";
import type { RiskLevel } from "@/lib/enums";
import { RISK_LABELS } from "@/lib/enums";

/**
 * Insignia de color para el nivel de riesgo arbitral.
 * Verde = bajo, Ámbar = medio, Rojo = alto (según la paleta acordada).
 */
const styles: Record<RiskLevel, string> = {
  LOW: "bg-pitch-100 text-pitch-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-red-100 text-red-700",
};

const dot: Record<RiskLevel, string> = {
  LOW: "bg-risk-low",
  MEDIUM: "bg-risk-medium",
  HIGH: "bg-risk-high",
};

export default function RiskBadge({
  level,
  label,
  size = "md",
}: {
  level: RiskLevel;
  label?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={clsx(
        "chip font-semibold",
        styles[level],
        size === "sm" ? "text-[11px]" : "text-xs",
      )}
    >
      <span className={clsx("h-2 w-2 rounded-full", dot[level])} />
      {label ?? `Riesgo ${RISK_LABELS[level].toLowerCase()}`}
    </span>
  );
}
