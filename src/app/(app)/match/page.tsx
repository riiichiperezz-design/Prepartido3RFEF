import { prisma } from "@/lib/prisma";
import MatchSetup from "@/components/MatchSetup";

export const dynamic = "force-dynamic";

export default async function MatchPage({ searchParams }: { searchParams: { home?: string } }) {
  const teams = await prisma.team.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, shortName: true, crestUrl: true, stadium: true },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Preparar partido</h1>
        <p className="text-sm text-ink-muted">
          Elige local y visitante, indica fecha y jornada, y genera tu briefing arbitral.
        </p>
      </div>
      <MatchSetup teams={teams} defaultHome={searchParams.home} />
    </div>
  );
}
