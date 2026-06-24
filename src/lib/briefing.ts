import type { EnrichedTeam, EnrichedPlayer } from "./data";
import { RISK_ORDER } from "./risk";
import type { RiskLevel } from "./enums";
import type { AlertLevel } from "@/components/AlertBox";

/**
 * Motor del briefing arbitral.
 *
 * Recuerda la filosofía: NO predice. Solo resume y destaca a qué prestar
 * atención. Todas las alertas se derivan de los datos y notas que tú gestionas.
 */

export interface BriefingAlert {
  level: AlertLevel;
  title: string;
  detail?: string;
  team?: string;
}

export interface KeyPlayers {
  topScorer: EnrichedPlayer | null;
  mostBooked: EnrichedPlayer[];
  withReds: EnrichedPlayer[];
  risky: EnrichedPlayer[];
  withImportantNotes: { player: EnrichedPlayer; note: string }[];
  youngest: EnrichedPlayer | null;
  veteran: EnrichedPlayer | null;
}

export interface StyleFlags {
  direct: boolean;
  buildUp: boolean;
  crossing: boolean;
  wings: boolean;
  highPress: boolean;
  setPieces: boolean;
  protests: boolean;
}

function has(text: string | null | undefined, ...keywords: string[]): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  return keywords.some((k) => t.includes(k));
}

/** Deriva "banderas" de estilo a partir de las notas y niveles del equipo. */
export function deriveStyle(team: EnrichedTeam): StyleFlags {
  const blob = [team.playingStyle, team.tacticalNotes, team.setPieceNotes, team.generalNotes]
    .filter(Boolean)
    .join(" ");
  return {
    direct: has(blob, "directo", "balón largo", "balones largos"),
    buildUp: has(blob, "salir jugando", "desde atrás", "salida de balón", "posesión", "asociativo"),
    crossing: has(blob, "carga", "área", "centros", "remate"),
    wings: has(blob, "banda", "bandas", "extremo", "desborde"),
    highPress: has(blob, "presiona", "presión alta", "presión tras pérdida", "presionan"),
    setPieces: has(blob, "balón parado", "córner", "corner", "falta", "estrategia") || Boolean(team.setPieceNotes),
    protests: team.protestLevel !== "LOW" || has(blob, "protesta", "protestón"),
  };
}

/** Selecciona los jugadores clave de un equipo para el briefing. */
export function selectKeyPlayers(
  team: EnrichedTeam,
  importantNotes: Map<string, string>,
): KeyPlayers {
  const players = team.players;
  const byGoals = [...players].sort((a, b) => b.goals - a.goals);
  const byYellow = [...players].sort((a, b) => b.yellowCards - a.yellowCards);
  const withAge = players.filter((p) => p.age && p.age > 0);

  return {
    topScorer: byGoals[0] && byGoals[0].goals > 0 ? byGoals[0] : null,
    mostBooked: byYellow.filter((p) => p.yellowCards >= 4).slice(0, 3),
    withReds: players.filter((p) => p.redCards > 0).sort((a, b) => b.redCards - a.redCards),
    risky: players
      .filter((p) => RISK_ORDER[p.effectiveRisk] >= RISK_ORDER.MEDIUM)
      .sort((a, b) => RISK_ORDER[b.effectiveRisk] - RISK_ORDER[a.effectiveRisk]),
    withImportantNotes: players
      .filter((p) => importantNotes.has(p.id))
      .map((p) => ({ player: p, note: importantNotes.get(p.id)! })),
    youngest: withAge.length ? [...withAge].sort((a, b) => (a.age ?? 0) - (b.age ?? 0))[0] : null,
    veteran: withAge.length ? [...withAge].sort((a, b) => (b.age ?? 0) - (a.age ?? 0))[0] : null,
  };
}

/** Genera las alertas automáticas para el partido (sección F). */
export function buildAlerts(
  home: EnrichedTeam,
  away: EnrichedTeam,
  homeKey: KeyPlayers,
  awayKey: KeyPlayers,
): BriefingAlert[] {
  const alerts: BriefingAlert[] = [];

  for (const [team, key] of [
    [home, homeKey],
    [away, awayKey],
  ] as const) {
    const tName = team.shortName ?? team.name;

    // Jugadores con muchas amarillas
    key.mostBooked.forEach((p) => {
      if (p.yellowCards >= 6) {
        alerts.push({
          level: "high",
          team: tName,
          title: `${p.name} (${tName}): ${p.yellowCards} amarillas acumuladas`,
          detail: "Atención, está al límite de ciclo de amonestaciones.",
        });
      }
    });

    // Jugadores con rojas esta temporada
    key.withReds.forEach((p) => {
      alerts.push({
        level: "high",
        team: tName,
        title: `${p.name} (${tName}): ${p.redCards} roja(s) esta temporada`,
        detail: p.notes ?? "Jugador con antecedentes de expulsión.",
      });
    });

    // Equipo con alto nivel de protesta
    if (team.protestLevel === "HIGH") {
      alerts.push({
        level: "medium",
        team: tName,
        title: `${tName}: equipo con alto nivel de protesta`,
        detail: "Cortar las protestas pronto y comunicar con el capitán.",
      });
    }

    // Equipo muy físico
    if (team.physicalLevel === "HIGH") {
      alerts.push({
        level: "medium",
        team: tName,
        title: `${tName}: equipo muy físico`,
        detail: "Vigilar entradas duras y duelos; uniformidad en el criterio de faltas.",
      });
    }

    // Banquillo / cuerpo técnico con riesgo alto
    const riskyStaff = team.staff.filter((s) => s.refereeRisk === "HIGH");
    riskyStaff.forEach((s) => {
      alerts.push({
        level: "medium",
        team: tName,
        title: `Banquillo de ${tName}: ${s.name} (${s.role ?? "técnico"}) con riesgo alto`,
        detail: s.notes ?? "Vigilar la zona técnica.",
      });
    });

    // Balón parado
    if (team.setPieceNotes) {
      alerts.push({
        level: "info",
        team: tName,
        title: `Atención a balón parado de ${tName}`,
        detail: team.setPieceNotes,
      });
    }

    // Notas previas relevantes del árbitro
    team.briefingNotes
      .filter((n) => n.importance === "HIGH")
      .forEach((n) => {
        alerts.push({
          level: "high",
          team: tName,
          title: `Nota previa relevante (${tName})`,
          detail: n.text,
        });
      });
  }

  if (alerts.length === 0) {
    alerts.push({
      level: "low",
      title: "Sin alertas destacadas",
      detail: "No se han detectado factores de especial atención con los datos actuales.",
    });
  }

  return alerts;
}

/** Riesgo global del partido = el más alto de ambos equipos. */
export function globalRisk(home: EnrichedTeam, away: EnrichedTeam): RiskLevel {
  return RISK_ORDER[home.effectiveRisk] >= RISK_ORDER[away.effectiveRisk]
    ? home.effectiveRisk
    : away.effectiveRisk;
}
