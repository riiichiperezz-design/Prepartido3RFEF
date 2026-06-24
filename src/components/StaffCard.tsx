import Avatar from "./Avatar";
import RiskBadge from "./RiskBadge";
import type { StaffMember } from "@prisma/client";
import { PROTEST_LABELS, type RiskLevel } from "@/lib/enums";

/** Tarjeta de miembro del cuerpo técnico. */
export default function StaffCard({ staff }: { staff: StaffMember }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <Avatar name={staff.name} src={staff.photoUrl} size="md" />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-ink">{staff.name}</div>
          <div className="text-xs text-ink-muted">{staff.role ?? "Cuerpo técnico"}</div>
        </div>
        <RiskBadge level={(staff.refereeRisk as RiskLevel) ?? "LOW"} size="sm" />
      </div>

      {staff.previousTeams && (
        <p className="mt-2 text-xs text-slate-500">
          <span className="font-medium text-ink-muted">Antes:</span> {staff.previousTeams}
        </p>
      )}

      <div className="mt-2 flex flex-wrap gap-2 text-xs text-ink-muted">
        <span className="chip bg-slate-100">
          Protesta: {PROTEST_LABELS[(staff.protestLevel as RiskLevel) ?? "LOW"]}
        </span>
        {staff.yellowCards > 0 && <span className="chip bg-amber-100 text-amber-700">{staff.yellowCards} 🟨</span>}
        {staff.redCards > 0 && <span className="chip bg-red-100 text-red-700">{staff.redCards} 🟥</span>}
      </div>

      {staff.notes && <p className="mt-2 text-sm text-slate-600">{staff.notes}</p>}
    </div>
  );
}
