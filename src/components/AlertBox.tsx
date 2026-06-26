import clsx from "clsx";
import { CheckIcon, AlertIcon, RiskIcon, ActivityIcon } from "./icons";

export type AlertLevel = "info" | "low" | "medium" | "high";

/**
 * Aviso arbitral con icono de trazo (sin emojis). Se usa en el briefing para
 * destacar alertas automáticas.
 */
const styles: Record<AlertLevel, { box: string; icon: string; Icon: typeof CheckIcon }> = {
  info: { box: "bg-gray-50 border-ink-line text-ink", icon: "text-ink-muted", Icon: ActivityIcon },
  low: { box: "bg-risk-lowtint border-risk-low/15 text-risk-low", icon: "text-risk-low", Icon: CheckIcon },
  medium: { box: "bg-risk-mediumtint border-risk-medium/20 text-risk-medium", icon: "text-risk-medium", Icon: AlertIcon },
  high: { box: "bg-risk-hightint border-risk-high/20 text-risk-high", icon: "text-risk-high", Icon: RiskIcon },
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
    <div className={clsx("flex gap-3 rounded-xl border p-3", s.box)}>
      <s.Icon className={clsx("mt-0.5 h-4 w-4 shrink-0", s.icon)} strokeWidth={2} />
      <div className="min-w-0 text-sm">
        {title && <div className="font-semibold leading-snug">{title}</div>}
        {children && <div className="mt-0.5 text-[13px] leading-snug text-ink-muted">{children}</div>}
      </div>
    </div>
  );
}
