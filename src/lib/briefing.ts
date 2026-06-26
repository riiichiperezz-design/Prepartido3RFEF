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

/**
 * Lista deduplicada de jugadores a vigilar de un equipo, con una nota breve del
 * motivo (riesgo, tarjetas, expulsiones, nota propia). Pensada para mostrarse
 * con foto en el briefing.
 */
export function playersToWatch(
  key: KeyPlayers,
): { player: EnrichedPlayer; note: string }[] {
  const map = new Map<string, { player: EnrichedPlayer; note: string }>();
  const add = (player: EnrichedPlayer, note: string) => {
    if (map.has(player.id)) return;
    map.set(player.id, { player, note });
  };

  key.withImportantNotes.forEach(({ player, note }) => add(player, note));
  key.withReds.forEach((p) => add(p, `Expulsión esta temporada (${p.redCards} roja/s).`));
  key.risky.forEach((p) => add(p, p.riskReasons[0] ?? "Marcado como jugador de riesgo."));
  key.mostBooked.forEach((p) => add(p, `Acumula ${p.yellowCards} amarillas.`));

  return Array.from(map.values()).slice(0, 6);
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

/**
 * Resumen ejecutivo: 3-5 puntos críticos derivados de los datos, para tener una
 * foto rápida del partido al inicio del briefing.
 */
export function buildExecutiveSummary(
  home: EnrichedTeam,
  away: EnrichedTeam,
  alerts: BriefingAlert[],
): string[] {
  const points: string[] = [];
  const hName = home.shortName ?? home.name;
  const aName = away.shortName ?? away.name;

  // Protestas
  const protesters = [home, away].filter((t) => t.protestLevel === "HIGH");
  if (protesters.length === 2) {
    points.push("Ambos equipos protestan mucho: marcar autoridad pronto y gestionar a los capitanes.");
  } else if (protesters.length === 1) {
    const t = protesters[0];
    points.push(`${t.shortName ?? t.name} es un equipo muy protestón: cortar las quejas desde el inicio.`);
  }

  // Físico
  const physical = [home, away].filter((t) => t.physicalLevel === "HIGH");
  if (physical.length > 0) {
    points.push(`Partido físico (${physical.map((t) => t.shortName ?? t.name).join(" y ")}): uniformidad en el criterio de faltas y duelos.`);
  }

  // Jugadores con roja esta temporada
  const reds = [...home.players, ...away.players].filter((p) => p.redCards > 0);
  if (reds.length > 0) {
    points.push(`Atención a ${reds.length} jugador(es) con expulsión esta temporada en duelos y entradas.`);
  }

  // Balón parado
  if (home.setPieceNotes || away.setPieceNotes) {
    points.push("Vigilar las acciones a balón parado (agarrones y empujones en el área).");
  }

  // Banquillos calientes
  const hotBench = [home, away].filter((t) => t.staff.some((s) => s.refereeRisk === "HIGH"));
  if (hotBench.length > 0) {
    points.push(`Banquillo a vigilar: ${hotBench.map((t) => t.shortName ?? t.name).join(" y ")} (zona técnica).`);
  }

  if (points.length === 0) {
    points.push(`Partido sin factores de especial atención según los datos actuales (${hName} vs ${aName}).`);
  }
  return points.slice(0, 5);
}
