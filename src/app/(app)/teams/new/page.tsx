import Link from "next/link";
import TeamForm from "@/components/TeamForm";
import { BackIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default function NewTeamPage() {
  return (
    <div className="space-y-5">
      <Link href="/teams" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> Volver a equipos
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Nuevo equipo</h1>
      <p className="text-sm text-ink-muted">
        Crea un equipo a mano. Después podrás añadirle jugadores y cuerpo técnico desde su ficha.
      </p>
      <TeamForm />
    </div>
  );
}
