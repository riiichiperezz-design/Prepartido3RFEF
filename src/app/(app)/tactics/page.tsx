import Link from "next/link";
import { TargetIcon, BriefingIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default function TacticsPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow">Pizarra arbitral</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Campo táctico</h1>
        <p className="text-sm text-ink-muted">
          Crea alineaciones y situaciones sobre el terreno de juego para preparar tu posicionamiento y el de los asistentes.
        </p>
      </div>

      <div className="card flex flex-col items-center justify-center gap-3 p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-ink">
          <TargetIcon className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <h2 className="text-lg font-semibold text-ink">Módulo en preparación</h2>
        <p className="max-w-md text-sm text-ink-muted">
          El campo táctico (formaciones, jugadores colocables, flechas, zonas y posición arbitral) se
          está incorporando. Mientras tanto, el briefing ya incluye el análisis táctico por escrito de
          cada equipo.
        </p>
        <Link href="/match" className="btn-primary mt-2">
          <BriefingIcon className="h-4 w-4" /> Preparar partido
        </Link>
      </div>
    </div>
  );
}
