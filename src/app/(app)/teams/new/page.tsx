import Link from "next/link";
import TeamForm from "@/components/TeamForm";

export const dynamic = "force-dynamic";

export default function NewTeamPage() {
  return (
    <div className="space-y-5">
      <Link href="/teams" className="text-sm text-ink-muted hover:underline">
        ← Volver a equipos
      </Link>
      <h1 className="text-2xl font-extrabold text-ink">Nuevo equipo</h1>
      <p className="text-sm text-ink-muted">
        Crea un equipo a mano. Después podrás añadirle jugadores y cuerpo técnico desde su ficha.
      </p>
      <TeamForm />
    </div>
  );
}
