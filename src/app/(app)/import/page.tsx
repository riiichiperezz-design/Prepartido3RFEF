import { prisma } from "@/lib/prisma";
import ImportWizard from "@/components/ImportWizard";

export const dynamic = "force-dynamic";

export default async function ImportPage() {
  // Identificadores existentes para detectar duplicados en la previsualización.
  const [teams, players, staff] = await Promise.all([
    prisma.team.findMany({ select: { name: true } }),
    prisma.player.findMany({ select: { name: true, team: { select: { name: true } } } }),
    prisma.staffMember.findMany({ select: { name: true, team: { select: { name: true } } } }),
  ]);

  const existing = {
    teams: teams.map((t) => t.name),
    players: players.map((p) => `${p.team.name}||${p.name}`),
    staff: staff.map((s) => `${s.team.name}||${s.name}`),
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Importar datos</h1>
        <p className="text-sm text-ink-muted">
          Descarga la plantilla, rellénala y súbela. Sirve para no tener que meter todo a mano cada semana.
        </p>
      </div>
      <ImportWizard existing={existing} />
    </div>
  );
}
