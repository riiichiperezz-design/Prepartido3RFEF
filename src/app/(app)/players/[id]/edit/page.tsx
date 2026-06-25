import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PlayerForm from "@/components/PlayerForm";

export const dynamic = "force-dynamic";

export default async function EditPlayerPage({ params }: { params: { id: string } }) {
  const player = await prisma.player.findUnique({ where: { id: params.id } });
  if (!player) notFound();

  return (
    <div className="space-y-5">
      <Link href={`/players/${player.id}`} className="text-sm text-ink-muted hover:underline">
        ← Volver a la ficha
      </Link>
      <h1 className="text-2xl font-extrabold text-ink">Editar: {player.name}</h1>
      <p className="text-sm text-ink-muted">Tus notas arbitrales del jugador no se ven afectadas.</p>
      <div className="card p-5">
        <PlayerForm player={player} />
      </div>
    </div>
  );
}
