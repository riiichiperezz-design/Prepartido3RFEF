import Link from "next/link";
import { ClockIcon, ImportIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default function WeeklyPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow">Rutina de jornada</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Actualización semanal</h1>
        <p className="text-sm text-ink-muted">
          Pensada para actualizar datos rápido cada lunes: goles, tarjetas, alineaciones y notas del partido.
        </p>
      </div>

      <div className="card flex flex-col items-center justify-center gap-3 p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-ink">
          <ClockIcon className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <h2 className="text-lg font-semibold text-ink">Módulo en preparación</h2>
        <p className="max-w-md text-sm text-ink-muted">
          La actualización semanal rápida se está incorporando. Mientras tanto, puedes actualizar datos
          desde la importación CSV/Excel o editando cada equipo y jugador a mano.
        </p>
        <Link href="/import" className="btn-primary mt-2">
          <ImportIcon className="h-4 w-4" /> Importar datos
        </Link>
      </div>
    </div>
  );
}
