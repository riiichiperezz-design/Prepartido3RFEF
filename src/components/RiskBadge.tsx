import clsx from "clsx";
import type { RiskLevel } from "@/lib/enums";
import { RISK_LABELS } from "@/lib/enums";

/**
 * Insignia de nivel de riesgo arbitral con tonos sobrios.
 * Verde apagado = bajo · Ámbar = medio · Rojo oscuro = alto.
 */
const styles: Record<RiskLevel, string> = {
  LOW: "bg-risk-lowtint text-risk-low ring-1 ring-risk-low/15",
  MEDIUM: "bg-risk-mediumtint text-risk-medium ring-1 ring-risk-medium/15",
  HIGH: "bg-risk-hightint text-risk-high ring-1 ring-risk-high/20",
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
    <span className={clsx("chip", styles[level], size === "sm" ? "text-[11px]" : "text-xs")}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", dot[level])} />
      {label ?? `Riesgo ${RISK_LABELS[level].toLowerCase()}`}
    </span>
  );
}
