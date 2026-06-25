import { prisma } from "./prisma";
import { toInt, normalizeLevel } from "./format";

/**
 * Lógica de importación de datos desde filas (provenientes de CSV/Excel).
 *
 * PRINCIPIO CLAVE: al actualizar, se refrescan estadísticas (goles, tarjetas...)
 * pero NUNCA se borran tus notas propias:
 *  - Las notas arbitrales (tabla RefereeNote) viven aparte y no se tocan jamás.
 *  - Los campos de texto propios del equipo/jugador (notas, etiquetas, riesgo
 *    manual, notas tácticas...) solo se sobrescriben si la celda importada trae
 *    un valor; si viene vacía, se conserva lo que ya tenías.
 */

export type ImportType = "teams" | "players" | "staff";

export interface ImportRow {
  [key: string]: string | number | undefined;
}

export interface ImportResult {
  ok: boolean;
  created: number;
  updated: number;
  errors: string[];
  type: ImportType;
}

/** Normaliza la clave de una columna (sin acentos, minúsculas, guiones bajos). */
function key(k: string): string {
  return k
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // elimina acentos combinados
    .replace(/\s+/g, "_");
}

/** Reindexa una fila con claves normalizadas. */
function normRow(row: ImportRow): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(row)) {
    out[key(k)] = v === undefined || v === null ? "" : String(v).trim();
  }
  return out;
}

/** Devuelve el valor solo si no está vacío (para no pisar datos existentes). */
function keep<T>(incoming: string, current: T, transform: (s: string) => T): T {
  return incoming !== "" ? transform(incoming) : current;
}

/** Importa/actualiza equipos. Se identifican por nombre. */
export async function importTeams(rows: ImportRow[]): Promise<ImportResult> {
  const result: ImportResult = { ok: true, created: 0, updated: 0, errors: [], type: "teams" };

  for (let i = 0; i < rows.length; i++) {
    const r = normRow(rows[i]);
    const name = r["nombre"] || r["name"];
    if (!name) {
      result.errors.push(`Fila ${i + 2}: falta el nombre del equipo.`);
      continue;
    }

    const existing = await prisma.team.findFirst({ where: { name } });

    const stats = {
      currentPosition: r["posicion"] ? toInt(r["posicion"]) : existing?.currentPosition ?? null,
      points: r["puntos"] !== undefined && r["puntos"] !== "" ? toInt(r["puntos"]) : existing?.points ?? 0,
      goalsFor: r["goles_favor"] !== "" ? toInt(r["goles_favor"]) : existing?.goalsFor ?? 0,
      goalsAgainst: r["goles_contra"] !== "" ? toInt(r["goles_contra"]) : existing?.goalsAgainst ?? 0,
      yellowCards: r["amarillas"] !== "" ? toInt(r["amarillas"]) : existing?.yellowCards ?? 0,
      redCards: r["rojas"] !== "" ? toInt(r["rojas"]) : existing?.redCards ?? 0,
      protestLevel: r["nivel_protesta"] ? normalizeLevel(r["nivel_protesta"]) : existing?.protestLevel ?? "LOW",
      physicalLevel: r["nivel_fisico"] ? normalizeLevel(r["nivel_fisico"]) : existing?.physicalLevel ?? "MEDIUM",
    };

    if (existing) {
      await prisma.team.update({
        where: { id: existing.id },
        data: {
          shortName: keep(r["nombre_corto"] ?? "", existing.shortName, (s) => s),
          city: keep(r["localidad"] ?? "", existing.city, (s) => s),
          stadium: keep(r["estadio"] ?? "", existing.stadium, (s) => s),
          crestUrl: keep(r["escudo_url"] ?? "", existing.crestUrl, (s) => s),
          // Texto propio: solo se actualiza si viene relleno (conserva tus notas)
          playingStyle: keep(r["estilo_juego"] ?? "", existing.playingStyle, (s) => s),
          ...stats,
          dataOrigin: "CSV",
        },
      });
      result.updated++;
    } else {
      await prisma.team.create({
        data: {
          name,
          shortName: r["nombre_corto"] || null,
          city: r["localidad"] || null,
          stadium: r["estadio"] || null,
          crestUrl: r["escudo_url"] || null,
          playingStyle: r["estilo_juego"] || null,
          category: "Tercera Federación",
          ...stats,
          dataOrigin: "CSV",
        },
      });
      result.created++;
    }
  }
  return result;
}

/** Importa/actualiza jugadores. Se identifican por equipo + nombre. */
export async function importPlayers(rows: ImportRow[]): Promise<ImportResult> {
  const result: ImportResult = { ok: true, created: 0, updated: 0, errors: [], type: "players" };

  for (let i = 0; i < rows.length; i++) {
    const r = normRow(rows[i]);
    const teamName = r["equipo"] || r["team"];
    const name = r["nombre"] || r["name"];
    if (!teamName || !name) {
      result.errors.push(`Fila ${i + 2}: falta equipo o nombre del jugador.`);
      continue;
    }

    const team = await prisma.team.findFirst({ where: { name: teamName } });
    if (!team) {
      result.errors.push(`Fila ${i + 2}: el equipo "${teamName}" no existe (impórtalo antes).`);
      continue;
    }

    const existing = await prisma.player.findFirst({ where: { teamId: team.id, name } });

    const stats = {
      dorsal: r["dorsal"] ? toInt(r["dorsal"]) : existing?.dorsal ?? null,
      age: r["edad"] ? toInt(r["edad"]) : existing?.age ?? null,
      position: keep(r["posicion"] ?? "", existing?.position ?? null, (s) => s.toUpperCase()),
      dominantFoot: keep(r["pie"] ?? "", existing?.dominantFoot ?? null, (s) => s.toUpperCase()),
      matches: r["partidos"] !== "" ? toInt(r["partidos"]) : existing?.matches ?? 0,
      minutes: r["minutos"] !== "" ? toInt(r["minutos"]) : existing?.minutes ?? 0,
      goals: r["goles"] !== "" ? toInt(r["goles"]) : existing?.goals ?? 0,
      assists: r["asistencias"] !== "" ? toInt(r["asistencias"]) : existing?.assists ?? 0,
      yellowCards: r["amarillas"] !== "" ? toInt(r["amarillas"]) : existing?.yellowCards ?? 0,
      redCards: r["rojas"] !== "" ? toInt(r["rojas"]) : existing?.redCards ?? 0,
      previousSeasonYellowCards: r["amarillas_temp_anterior"] !== "" ? toInt(r["amarillas_temp_anterior"]) : existing?.previousSeasonYellowCards ?? 0,
      previousSeasonRedCards: r["rojas_temp_anterior"] !== "" ? toInt(r["rojas_temp_anterior"]) : existing?.previousSeasonRedCards ?? 0,
    };

    if (existing) {
      await prisma.player.update({
        where: { id: existing.id },
        data: {
          ...stats,
          // Conserva etiquetas y notas si la celda viene vacía
          behaviourTags: keep(r["etiquetas"] ?? "", existing.behaviourTags, (s) => s),
          photoUrl: keep(r["foto_url"] ?? "", existing.photoUrl, (s) => s),
          notes: keep(r["notas"] ?? "", existing.notes, (s) => s),
          dataOrigin: "CSV",
        },
      });
      result.updated++;
    } else {
      await prisma.player.create({
        data: {
          teamId: team.id,
          name,
          ...stats,
          behaviourTags: r["etiquetas"] || null,
          photoUrl: r["foto_url"] || null,
          notes: r["notas"] || null,
          dataOrigin: "CSV",
        },
      });
      result.created++;
    }
  }
  return result;
}

/** Importa/actualiza cuerpo técnico. Se identifican por equipo + nombre. */
export async function importStaff(rows: ImportRow[]): Promise<ImportResult> {
  const result: ImportResult = { ok: true, created: 0, updated: 0, errors: [], type: "staff" };

  for (let i = 0; i < rows.length; i++) {
    const r = normRow(rows[i]);
    const teamName = r["equipo"] || r["team"];
    const name = r["nombre"] || r["name"];
    if (!teamName || !name) {
      result.errors.push(`Fila ${i + 2}: falta equipo o nombre.`);
      continue;
    }
    const team = await prisma.team.findFirst({ where: { name: teamName } });
    if (!team) {
      result.errors.push(`Fila ${i + 2}: el equipo "${teamName}" no existe.`);
      continue;
    }

    const existing = await prisma.staffMember.findFirst({ where: { teamId: team.id, name } });
    const data = {
      role: keep(r["rol"] ?? "", existing?.role ?? null, (s) => s),
      previousTeams: keep(r["equipos_anteriores"] ?? "", existing?.previousTeams ?? null, (s) => s),
      yellowCards: r["amarillas"] !== "" ? toInt(r["amarillas"]) : existing?.yellowCards ?? 0,
      redCards: r["rojas"] !== "" ? toInt(r["rojas"]) : existing?.redCards ?? 0,
      protestLevel: r["nivel_protesta"] ? normalizeLevel(r["nivel_protesta"]) : existing?.protestLevel ?? "LOW",
      notes: keep(r["notas"] ?? "", existing?.notes ?? null, (s) => s),
    };

    if (existing) {
      await prisma.staffMember.update({ where: { id: existing.id }, data: { ...data, dataOrigin: "CSV" } });
      result.updated++;
    } else {
      await prisma.staffMember.create({ data: { teamId: team.id, name, ...data, dataOrigin: "CSV" } });
      result.created++;
    }
  }
  return result;
}

export async function runImport(type: ImportType, rows: ImportRow[]): Promise<ImportResult> {
  switch (type) {
    case "teams":
      return importTeams(rows);
    case "players":
      return importPlayers(rows);
    case "staff":
      return importStaff(rows);
    default:
      return { ok: false, created: 0, updated: 0, errors: ["Tipo de importación no válido."], type };
  }
}
