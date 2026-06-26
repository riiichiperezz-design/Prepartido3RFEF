import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TeamForm from "@/components/TeamForm";
import { BackIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function EditTeamPage({ params }: { params: { id: string } }) {
  const team = await prisma.team.findUnique({ where: { id: params.id } });
  if (!team) notFound();

  return (
    <div className="space-y-5">
      <Link href={`/teams/${team.id}`} className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <BackIcon className="h-4 w-4" /> Volver a la ficha
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Editar: {team.name}</h1>
      <p className="text-sm text-ink-muted">
        Tus notas arbitrales no se ven afectadas al guardar estos cambios.
      </p>
      <TeamForm team={team} />
    </div>
  );
}
