/**
 * Sistema de riesgo arbitral.
 *
 * MUY IMPORTANTE (filosofía): esta lógica NO es predictiva ni dice que algo
 * "va a pasar". Solo ayuda a priorizar a qué prestar atención al preparar el
 * partido. Es sencilla, transparente y fácil de editar.
 *
 * Se calcula una puntuación con reglas claras y se traduce a un nivel
 * LOW / MEDIUM / HIGH. Si tú ya has fijado un riesgo manualmente, ese valor
 * manual siempre manda sobre el calculado (lo respetamos con `pickRisk`).
 */

import type { RiskLevel } from "./enums";

export interface PlayerRiskInput {
  yellowCards: number;
  redCards: number;
  previousSeasonYellowCards: number;
  previousSeasonRedCards: number;
  behaviourTags?: string | null;
  hasImportantNote?: boolean;
  refereeRisk?: string | null; // riesgo fijado manualmente
}

export interface TeamRiskInput {
  yellowCards: number;
  redCards: number;
  protestLevel: string;
  physicalLevel: string;
  staffMaxRisk?: RiskLevel;
  hasImportantNote?: boolean;
  refereeRisk?: string | null;
}

export interface RiskResult {
  level: RiskLevel;
  score: number;
  reasons: string[];
}

/** Convierte una puntuación numérica en nivel de riesgo. */
function scoreToLevel(score: number): RiskLevel {
  if (score >= 6) return "HIGH";
  if (score >= 3) return "MEDIUM";
  return "LOW";
}

/** Etiquetas de comportamiento que suben el riesgo. */
const RISKY_TAGS = ["protestón", "proteston", "reincidente", "agresivo", "tarjetero"];

function parseTags(tags?: string | null): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Calcula el riesgo de un jugador a partir de reglas simples.
 * Reglas (editables):
 *  - Muchas amarillas (temporada actual) → suma.
 *  - Rojas esta temporada → suma fuerte.
 *  - Historial disciplinario de la temporada anterior → suma leve.
 *  - Etiqueta "protestón"/"reincidente"/... → suma.
 *  - Nota importante visible en briefing → suma.
 */
export function computePlayerRisk(p: PlayerRiskInput): RiskResult {
  let score = 0;
  const reasons: string[] = [];

  if (p.yellowCards >= 6) {
    score += 3;
    reasons.push(`Acumula muchas amarillas (${p.yellowCards})`);
  } else if (p.yellowCards >= 4) {
    score += 2;
    reasons.push(`Bastantes amarillas (${p.yellowCards})`);
  } else if (p.yellowCards >= 2) {
    score += 1;
  }

  if (p.redCards >= 2) {
    score += 4;
    reasons.push(`${p.redCards} rojas esta temporada`);
  } else if (p.redCards === 1) {
    score += 3;
    reasons.push("Roja esta temporada");
  }

  if (p.previousSeasonRedCards > 0) {
    score += 1;
    reasons.push("Antecedentes de roja la temporada anterior");
  }
  if (p.previousSeasonYellowCards >= 8) {
    score += 1;
    reasons.push("Muy amonestado la temporada anterior");
  }

  const tags = parseTags(p.behaviourTags);
  const matchedTags = tags.filter((t) => RISKY_TAGS.includes(t));
  if (matchedTags.length > 0) {
    score += matchedTags.length;
    reasons.push(`Etiquetas a vigilar: ${matchedTags.join(", ")}`);
  }

  if (p.hasImportantNote) {
    score += 2;
    reasons.push("Tiene una nota importante en el briefing");
  }

  return { level: scoreToLevel(score), score, reasons };
}

/**
 * Calcula el riesgo de un equipo.
 * Reglas (editables):
 *  - Muchas tarjetas del equipo → suma.
 *  - Nivel de protesta alto → suma.
 *  - Cuerpo técnico con riesgo alto → suma.
 *  - Nivel físico alto → suma.
 *  - Notas importantes → suma.
 */
export function computeTeamRisk(t: TeamRiskInput): RiskResult {
  let score = 0;
  const reasons: string[] = [];

  if (t.yellowCards >= 45) {
    score += 3;
    reasons.push(`Equipo muy amonestado (${t.yellowCards} amarillas)`);
  } else if (t.yellowCards >= 30) {
    score += 2;
    reasons.push(`Bastantes amarillas de equipo (${t.yellowCards})`);
  } else if (t.yellowCards >= 18) {
    score += 1;
  }

  if (t.redCards >= 4) {
    score += 2;
    reasons.push(`Varias rojas de equipo (${t.redCards})`);
  } else if (t.redCards >= 2) {
    score += 1;
  }

  if (t.protestLevel === "HIGH") {
    score += 3;
    reasons.push("Equipo con alto nivel de protesta");
  } else if (t.protestLevel === "MEDIUM") {
    score += 1;
  }

  if (t.physicalLevel === "HIGH") {
    score += 2;
    reasons.push("Equipo muy físico");
  } else if (t.physicalLevel === "MEDIUM") {
    score += 0;
  }

  if (t.staffMaxRisk === "HIGH") {
    score += 2;
    reasons.push("Cuerpo técnico con riesgo alto");
  } else if (t.staffMaxRisk === "MEDIUM") {
    score += 1;
  }

  if (t.hasImportantNote) {
    score += 1;
    reasons.push("Notas previas relevantes");
  }

  return { level: scoreToLevel(score), score, reasons };
}

/**
 * Devuelve el riesgo a mostrar: si hay un valor manual válido, lo respeta;
 * si no, usa el calculado.
 */
export function pickRisk(manual: string | null | undefined, computed: RiskLevel): RiskLevel {
  if (manual === "LOW" || manual === "MEDIUM" || manual === "HIGH") {
    return manual;
  }
  return computed;
}

/** Orden numérico para comparar/ordenar niveles de riesgo. */
export const RISK_ORDER: Record<RiskLevel, number> = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
};
