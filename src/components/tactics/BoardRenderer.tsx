import FootballPitch from "./FootballPitch";
import { PlayerToken, ArrowShape, ZoneShape, MarkerShape, TextShape } from "./boardElements";
import type { BoardState } from "@/lib/tactics";

interface PlayerMeta {
  risk?: string | null;
  photoUrl?: string | null;
}

/**
 * Renderiza un estado de pizarra en modo SOLO LECTURA (para el briefing o
 * previsualizaciones). No es interactivo.
 */
export default function BoardRenderer({
  board,
  playerMeta = {},
  className,
}: {
  board: BoardState;
  playerMeta?: Record<string, PlayerMeta>;
  className?: string;
}) {
  const o = board.orientation;
  return (
    <FootballPitch orientation={o} className={className}>
      {board.zones.map((z) => <ZoneShape key={z.id} zone={z} orientation={o} />)}
      {board.arrows.map((a) => <ArrowShape key={a.id} arrow={a} orientation={o} />)}
      {board.texts.map((t) => <TextShape key={t.id} text={t} orientation={o} />)}
      {board.markers.map((m) => <MarkerShape key={m.id} marker={m} orientation={o} />)}
      {board.players.map((p) => {
        const meta = p.playerId ? playerMeta[p.playerId] : undefined;
        return <PlayerToken key={p.id} player={p} orientation={o} risk={meta?.risk} photoUrl={meta?.photoUrl} />;
      })}
    </FootballPitch>
  );
}
