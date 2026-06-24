import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TeamEditForm from "@/components/TeamEditForm";

export const dynamic = "force-dynamic";

export default async function EditTeamPage({ params }: { params: { id: string } }) {
  const team = await prisma.team.findUnique({ where: { id: params.id } });
  if (!team) notFound();

  return (
    <div className="space-y-5">
      <Link href={`/teams/${team.id}`} className="text-sm text-ink-muted hover:underline">
        ← Volver a la ficha
      </Link>
      <h1 className="text-2xl font-extrabold text-ink">Editar: {team.name}</h1>
      <p className="text-sm text-ink-muted">
        Tus notas arbitrales no se ven afectadas al guardar estos cambios.
      </p>
      <TeamEditForm team={team} />
    </div>
  );
}
