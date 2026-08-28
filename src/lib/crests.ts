/**
 * Búsqueda de escudos de equipo en TheSportsDB (API gratuita).
 *
 * IMPORTANTE: esta función hace peticiones a internet, por lo que solo funciona
 * donde la app tenga salida de red (tu ordenador o el despliegue en Vercel).
 * TheSportsDB es colaborativa: no todos los equipos de 5ª categoría estarán, y
 * puede haber homónimos, por eso se filtra por país (España) y se devuelve el
 * nombre encontrado para que puedas revisarlo.
 */

const BASE = "https://www.thesportsdb.com/api/v1/json/3";

interface SdbTeam {
  strTeam?: string;
  strTeamBadge?: string;
  strBadge?: string;
  strCountry?: string;
  strLeague?: string;
}

export interface BadgeResult {
  badge: string;
  matchedName: string;
  league?: string;
}

/** Limpia el nombre de un equipo para buscarlo (quita prefijos de club y comillas). */
export function crestSearchCandidates(name: string, shortName?: string | null): string[] {
  const cands = new Set<string>();
  if (shortName) cands.add(shortName);

  let n = name
    .replace(/"/g, "")
    .replace(/\b(C\.?D\.?|C\.?F\.?|U\.?D\.?|U\.?P\.?|A\.?D\.?|S\.?P\.?|ESC\.?FUT\.?|ATLETICO CLUB|CLUB)\b/gi, "")
    .replace(/\bA\b\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
  if (n) cands.add(n);

  return Array.from(cands).filter(Boolean);
}

async function fetchTeams(query: string): Promise<SdbTeam[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${BASE}/searchteams.php?t=${encodeURIComponent(query)}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { teams?: SdbTeam[] | null };
    return data.teams ?? [];
  } catch {
    return []; // sin conexión / bloqueado / timeout
  } finally {
    clearTimeout(timer);
  }
}

/** Busca el mejor escudo (equipo español con badge) probando varios nombres. */
export async function findBadge(name: string, shortName?: string | null): Promise<BadgeResult | null> {
  const candidates = crestSearchCandidates(name, shortName);
  for (const q of candidates) {
    const teams = await fetchTeams(q);
    // Preferimos equipos de España con escudo
    const spanish = teams.filter((t) => (t.strCountry ?? "").toLowerCase() === "spain");
    const pool = spanish.length ? spanish : teams;
    const withBadge = pool.find((t) => t.strTeamBadge || t.strBadge);
    if (withBadge) {
      return {
        badge: (withBadge.strTeamBadge || withBadge.strBadge) as string,
        matchedName: withBadge.strTeam ?? q,
        league: withBadge.strLeague ?? undefined,
      };
    }
  }
  return null;
}
