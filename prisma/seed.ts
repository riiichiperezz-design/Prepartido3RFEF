/**
 * Seed de datos FICTICIOS para probar la aplicación.
 *
 * IMPORTANTE: todos los nombres de jugadores y cuerpo técnico son inventados.
 * Los nombres de equipos/localidades son de prueba; las estadísticas no son
 * reales. Sirven únicamente para que la app tenga contenido con el que probar
 * el flujo de "Preparar partido".
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SeedPlayer = {
  name: string;
  dorsal: number;
  age: number;
  position: string;
  foot?: string;
  matches: number;
  minutes: number;
  goals: number;
  assists: number;
  yc: number;
  rc: number;
  pyc?: number;
  prc?: number;
  tags?: string;
  risk?: string;
  notes?: string;
};

type SeedStaff = {
  name: string;
  role: string;
  previousTeams?: string;
  yc?: number;
  rc?: number;
  protest?: string;
  risk?: string;
  notes?: string;
};

type SeedTeam = {
  name: string;
  shortName: string;
  city: string;
  stadium: string;
  stadiumAddress?: string;
  position: number;
  points: number;
  gf: number;
  ga: number;
  yc: number;
  rc: number;
  protest: string;
  physical: string;
  risk: string;
  style: string;
  tactical?: string;
  setPiece?: string;
  assistant?: string;
  general?: string;
  players: SeedPlayer[];
  staff: SeedStaff[];
};

const teams: SeedTeam[] = [
  {
    name: "CD Villafranca",
    shortName: "Villafranca",
    city: "Villafranca de los Barros",
    stadium: "Estadio Manuel Salas",
    stadiumAddress: "Av. del Deporte s/n, Villafranca de los Barros",
    position: 3,
    points: 41,
    gf: 38,
    ga: 22,
    yc: 52,
    rc: 4,
    protest: "HIGH",
    physical: "HIGH",
    risk: "HIGH",
    style: "Equipo intenso que presiona alto y juega muy directo. Carga mucho el área en jugadas a balón parado.",
    tactical: "1-4-4-2 con dos delanteros de referencia. Buscan segundas jugadas tras los rechaces.",
    setPiece: "Muy peligrosos a balón parado, sobre todo en córners al primer palo.",
    assistant: "Atentos al fuera de juego: la línea defensiva sube en bloque muy rápido.",
    general: "Banquillo muy protestón. El año pasado tuvieron varias expulsiones técnicas.",
    players: [
      { name: "Sergio Manceras", dorsal: 1, age: 29, position: "GK", foot: "R", matches: 22, minutes: 1980, goals: 0, assists: 0, yc: 3, rc: 0 },
      { name: "Adrián Calderón", dorsal: 4, age: 31, position: "CB", foot: "R", matches: 21, minutes: 1890, goals: 2, assists: 0, yc: 9, rc: 1, pyc: 11, prc: 1, tags: "reincidente,tarjetero", risk: "HIGH", notes: "Defensa contundente, llega tarde en duelos. Vigilar entradas por detrás." },
      { name: "Rubén Pacheco", dorsal: 5, age: 27, position: "CB", foot: "L", matches: 20, minutes: 1750, goals: 1, assists: 1, yc: 6, rc: 0 },
      { name: "Iván Trenado", dorsal: 2, age: 24, position: "FB", foot: "R", matches: 19, minutes: 1600, goals: 0, assists: 3, yc: 4, rc: 0 },
      { name: "Marco Lavado", dorsal: 6, age: 28, position: "DM", foot: "R", matches: 22, minutes: 1980, goals: 1, assists: 2, yc: 8, rc: 1, tags: "protestón", risk: "HIGH", notes: "Líder del centro del campo, protesta cada falta. Capitán." },
      { name: "Dani Borrallo", dorsal: 8, age: 26, position: "CM", foot: "R", matches: 21, minutes: 1700, goals: 4, assists: 5, yc: 5, rc: 0 },
      { name: "Jonatan Cidoncha", dorsal: 10, age: 30, position: "AM", foot: "L", matches: 22, minutes: 1850, goals: 7, assists: 6, yc: 3, rc: 0, notes: "El cerebro del equipo, lanza todas las faltas." },
      { name: "Carlos Mendiola", dorsal: 7, age: 23, position: "WINGER", foot: "R", matches: 20, minutes: 1500, goals: 6, assists: 4, yc: 4, rc: 0, tags: "rápido" },
      { name: "Aitor Galván", dorsal: 11, age: 22, position: "WINGER", foot: "L", matches: 18, minutes: 1300, goals: 5, assists: 3, yc: 2, rc: 0 },
      { name: "Fran Barrena", dorsal: 9, age: 33, position: "ST", foot: "R", matches: 21, minutes: 1750, goals: 12, assists: 2, yc: 7, rc: 1, pyc: 9, tags: "protestón,tarjetero", risk: "HIGH", notes: "Máximo goleador. Muy protestón con los asistentes en los fueras de juego." },
      { name: "Hugo Parejo", dorsal: 19, age: 20, position: "ST", foot: "R", matches: 15, minutes: 700, goals: 4, assists: 1, yc: 1, rc: 0, notes: "Joven promesa, entra a tramos finales." },
    ],
    staff: [
      { name: "José Luis Carmona", role: "Entrenador", previousTeams: "CF Extremadura B, Montijo", yc: 0, rc: 1, protest: "HIGH", risk: "HIGH", notes: "Muy vehemente en la banda. Fue expulsado en la primera vuelta por protestar." },
      { name: "Andrés Pizarro", role: "Segundo entrenador", protest: "MEDIUM", risk: "MEDIUM" },
      { name: "Manuel Gil", role: "Delegado", protest: "LOW", risk: "LOW" },
    ],
  },
  {
    name: "Jerez CF",
    shortName: "Jerez",
    city: "Jerez de los Caballeros",
    stadium: "Estadio Manuel Calzado Galván",
    stadiumAddress: "C/ Polideportivo, Jerez de los Caballeros",
    position: 8,
    points: 30,
    gf: 28,
    ga: 29,
    yc: 38,
    rc: 2,
    protest: "MEDIUM",
    physical: "MEDIUM",
    risk: "MEDIUM",
    style: "Equipo que intenta salir jugando desde atrás y combinar por dentro. Juego asociativo, menos físico.",
    tactical: "1-4-3-3 posicional. Buscan al mediapunta entre líneas.",
    setPiece: "Discretos a balón parado, prefieren jugarlo en corto.",
    assistant: "Laterales muy ofensivos, ojo a los desmarques de ruptura por banda.",
    general: "Equipo correcto en general. El 10 es el que más habla con el árbitro.",
    players: [
      { name: "Pablo Cerrato", dorsal: 13, age: 26, position: "GK", foot: "R", matches: 20, minutes: 1800, goals: 0, assists: 0, yc: 2, rc: 0 },
      { name: "Diego Maraver", dorsal: 3, age: 25, position: "FB", foot: "L", matches: 21, minutes: 1850, goals: 1, assists: 4, yc: 5, rc: 0 },
      { name: "Álvaro Cienfuegos", dorsal: 4, age: 29, position: "CB", foot: "R", matches: 22, minutes: 1980, goals: 2, assists: 0, yc: 6, rc: 1, tags: "reincidente", risk: "MEDIUM" },
      { name: "Nacho Tovar", dorsal: 5, age: 27, position: "CB", foot: "R", matches: 19, minutes: 1650, goals: 1, assists: 0, yc: 4, rc: 0 },
      { name: "Samuel Reguero", dorsal: 2, age: 23, position: "FB", foot: "R", matches: 18, minutes: 1500, goals: 0, assists: 2, yc: 3, rc: 0 },
      { name: "Cristian Bayón", dorsal: 6, age: 28, position: "DM", foot: "R", matches: 21, minutes: 1800, goals: 0, assists: 1, yc: 7, rc: 0, tags: "tarjetero", risk: "MEDIUM", notes: "Corta mucho el juego con faltas tácticas." },
      { name: "Marc Otero", dorsal: 8, age: 24, position: "CM", foot: "L", matches: 20, minutes: 1600, goals: 3, assists: 4, yc: 3, rc: 0 },
      { name: "Luismi Pavón", dorsal: 10, age: 31, position: "AM", foot: "R", matches: 22, minutes: 1900, goals: 6, assists: 7, yc: 4, rc: 0, tags: "protestón", risk: "MEDIUM", notes: "Capitán y referente. Protesta bastante pero sin pasarse." },
      { name: "Ismael Cortés", dorsal: 7, age: 22, position: "WINGER", foot: "R", matches: 19, minutes: 1400, goals: 5, assists: 3, yc: 2, rc: 0 },
      { name: "Adam Sissoko", dorsal: 11, age: 21, position: "WINGER", foot: "L", matches: 17, minutes: 1200, goals: 4, assists: 2, yc: 3, rc: 0, tags: "rápido", notes: "Desborde puro, busca mucho el uno contra uno." },
      { name: "Toni Almenara", dorsal: 9, age: 30, position: "ST", foot: "R", matches: 21, minutes: 1700, goals: 9, assists: 1, yc: 5, rc: 0 },
    ],
    staff: [
      { name: "Rafael Donaire", role: "Entrenador", previousTeams: "Azuaga, Don Benito B", protest: "MEDIUM", risk: "MEDIUM" },
      { name: "Quique Salazar", role: "Segundo entrenador", protest: "LOW", risk: "LOW" },
    ],
  },
  {
    name: "CD Montijo",
    shortName: "Montijo",
    city: "Montijo",
    stadium: "Estadio Emilio Macarro",
    position: 1,
    points: 48,
    gf: 44,
    ga: 18,
    yc: 33,
    rc: 1,
    protest: "LOW",
    physical: "MEDIUM",
    risk: "LOW",
    style: "Líder sólido. Equipo equilibrado, alterna juego directo y elaboración. Muy ordenado.",
    tactical: "1-4-2-3-1 con transiciones rápidas.",
    setPiece: "Bien trabajados, tienen rematadores altos.",
    assistant: "Equipo limpio, pocas protestas. Foco en posiciones, no en disciplina.",
    general: "Equipo muy deportivo, líder con autoridad. Trato fácil.",
    players: [
      { name: "Kike Mariño", dorsal: 1, age: 28, position: "GK", foot: "R", matches: 22, minutes: 1980, goals: 0, assists: 0, yc: 1, rc: 0 },
      { name: "Borja Liñán", dorsal: 4, age: 30, position: "CB", foot: "R", matches: 22, minutes: 1980, goals: 3, assists: 0, yc: 4, rc: 0 },
      { name: "Yeray Mota", dorsal: 5, age: 26, position: "CB", foot: "L", matches: 21, minutes: 1850, goals: 1, assists: 1, yc: 3, rc: 0 },
      { name: "Pedro Calvente", dorsal: 6, age: 27, position: "DM", foot: "R", matches: 20, minutes: 1700, goals: 1, assists: 2, yc: 5, rc: 0 },
      { name: "Joel Carrasco", dorsal: 8, age: 24, position: "CM", foot: "R", matches: 21, minutes: 1750, goals: 5, assists: 6, yc: 3, rc: 0 },
      { name: "Saúl Quintana", dorsal: 10, age: 29, position: "AM", foot: "L", matches: 22, minutes: 1900, goals: 10, assists: 8, yc: 2, rc: 0, notes: "Mejor jugador de la categoría según muchos." },
      { name: "Unai Belmonte", dorsal: 7, age: 23, position: "WINGER", foot: "R", matches: 20, minutes: 1550, goals: 7, assists: 5, yc: 2, rc: 0 },
      { name: "David Ferrón", dorsal: 9, age: 31, position: "ST", foot: "R", matches: 22, minutes: 1800, goals: 14, assists: 3, yc: 3, rc: 0, notes: "Máximo goleador de la liga." },
      { name: "Mario Cepeda", dorsal: 18, age: 19, position: "WINGER", foot: "L", matches: 14, minutes: 600, goals: 2, assists: 2, yc: 1, rc: 0, notes: "Canterano muy joven con proyección." },
    ],
    staff: [
      { name: "Francisco Acedo", role: "Entrenador", previousTeams: "Badajoz B", protest: "LOW", risk: "LOW" },
      { name: "Luis Bermejo", role: "Delegado", protest: "LOW", risk: "LOW" },
    ],
  },
  {
    name: "CD Azuaga",
    shortName: "Azuaga",
    city: "Azuaga",
    stadium: "Estadio Municipal de Azuaga",
    position: 15,
    points: 21,
    gf: 19,
    ga: 35,
    yc: 47,
    rc: 5,
    protest: "HIGH",
    physical: "HIGH",
    risk: "HIGH",
    style: "Equipo en apuros que compite con mucha tensión. Juego muy directo y físico, muchas faltas.",
    tactical: "1-5-3-2 defensivo, espera y sale a la contra.",
    setPiece: "Pelean cada balón dividido, riesgo de tángana en el área.",
    assistant: "Mucha queja en cada decisión. Banquillo caliente, vigilar la zona técnica.",
    general: "Partido potencialmente caliente. Han acumulado muchas tarjetas y dos expulsiones de banquillo.",
    players: [
      { name: "Raúl Mengual", dorsal: 1, age: 27, position: "GK", foot: "R", matches: 21, minutes: 1890, goals: 0, assists: 0, yc: 4, rc: 0, tags: "protestón", risk: "MEDIUM" },
      { name: "Cheikh Diallo", dorsal: 4, age: 26, position: "CB", foot: "R", matches: 20, minutes: 1750, goals: 1, assists: 0, yc: 10, rc: 2, pyc: 12, prc: 1, tags: "reincidente,tarjetero", risk: "HIGH", notes: "Dos rojas esta temporada. Muy duro en el cuerpo a cuerpo." },
      { name: "Fernando Lobato", dorsal: 6, age: 29, position: "DM", foot: "R", matches: 19, minutes: 1600, goals: 0, assists: 1, yc: 9, rc: 1, tags: "protestón,tarjetero", risk: "HIGH", notes: "Comete muchas faltas tácticas y protesta todas." },
      { name: "Álex Quirós", dorsal: 8, age: 24, position: "CM", foot: "L", matches: 18, minutes: 1400, goals: 2, assists: 2, yc: 6, rc: 0 },
      { name: "Moha El Amrani", dorsal: 10, age: 25, position: "AM", foot: "L", matches: 20, minutes: 1550, goals: 5, assists: 3, yc: 5, rc: 0, tags: "protestón", risk: "MEDIUM" },
      { name: "Juanjo Tena", dorsal: 7, age: 28, position: "WINGER", foot: "R", matches: 19, minutes: 1450, goals: 3, assists: 2, yc: 4, rc: 0 },
      { name: "Bryan Ortega", dorsal: 9, age: 23, position: "ST", foot: "R", matches: 20, minutes: 1500, goals: 6, assists: 1, yc: 7, rc: 1, tags: "tarjetero", risk: "HIGH", notes: "Delantero peleón, choca mucho con los centrales." },
      { name: "Iker Salas", dorsal: 3, age: 21, position: "FB", foot: "L", matches: 17, minutes: 1300, goals: 0, assists: 1, yc: 5, rc: 0 },
    ],
    staff: [
      { name: "Antonio Mellado", role: "Entrenador", previousTeams: "Fuente de Cantos", yc: 0, rc: 2, protest: "HIGH", risk: "HIGH", notes: "Dos expulsiones esta temporada. Muy protestón, vigilar zona técnica." },
      { name: "Sergio Risco", role: "Segundo entrenador", rc: 1, protest: "HIGH", risk: "HIGH", notes: "Expulsado del banquillo en la jornada 12." },
      { name: "Paco Durán", role: "Delegado", protest: "MEDIUM", risk: "MEDIUM" },
    ],
  },
  {
    name: "CD Badajoz B",
    shortName: "Badajoz B",
    city: "Badajoz",
    stadium: "Ciudad Deportiva del Vivero",
    position: 6,
    points: 33,
    gf: 31,
    ga: 27,
    yc: 35,
    rc: 2,
    protest: "LOW",
    physical: "MEDIUM",
    risk: "LOW",
    style: "Filial muy joven y técnico. Salen jugando desde el portero y presionan tras pérdida.",
    tactical: "1-4-3-3 de posesión, mucha rotación de jóvenes.",
    setPiece: "Poco peligro de cabeza por su baja estatura media.",
    assistant: "Equipo muy vertical, atentos a las contras y al fuera de juego alto.",
    general: "Plantilla jovencísima, edad media muy baja. Trato fácil pero ritmo altísimo.",
    players: [
      { name: "Marcos Valadés", dorsal: 1, age: 20, position: "GK", foot: "R", matches: 20, minutes: 1800, goals: 0, assists: 0, yc: 2, rc: 0 },
      { name: "Ousmane Faye", dorsal: 4, age: 19, position: "CB", foot: "R", matches: 21, minutes: 1850, goals: 1, assists: 0, yc: 4, rc: 0 },
      { name: "Pol Reverte", dorsal: 6, age: 18, position: "DM", foot: "R", matches: 19, minutes: 1500, goals: 0, assists: 3, yc: 5, rc: 0, notes: "Promesa del filial, muy maduro pese a su edad." },
      { name: "Hugo Marqués", dorsal: 8, age: 20, position: "CM", foot: "L", matches: 20, minutes: 1600, goals: 4, assists: 5, yc: 3, rc: 0 },
      { name: "Ander Goñi", dorsal: 10, age: 21, position: "AM", foot: "R", matches: 21, minutes: 1700, goals: 7, assists: 6, yc: 2, rc: 0 },
      { name: "Lamine Cissé", dorsal: 7, age: 18, position: "WINGER", foot: "L", matches: 18, minutes: 1300, goals: 5, assists: 4, yc: 1, rc: 0, tags: "rápido", notes: "Extremo eléctrico, el más desequilibrante." },
      { name: "Telmo Aguado", dorsal: 9, age: 22, position: "ST", foot: "R", matches: 20, minutes: 1550, goals: 8, assists: 2, yc: 3, rc: 0 },
      { name: "Iñaki Murua", dorsal: 3, age: 19, position: "FB", foot: "L", matches: 19, minutes: 1450, goals: 0, assists: 2, yc: 4, rc: 1, notes: "Lateral muy ofensivo, a veces temerario en el repliegue." },
    ],
    staff: [
      { name: "David Roldán", role: "Entrenador", previousTeams: "Cantera CD Badajoz", protest: "LOW", risk: "LOW" },
      { name: "Iván Pozo", role: "Segundo entrenador", protest: "LOW", risk: "LOW" },
    ],
  },
];

async function main() {
  console.log("🌱 Sembrando datos ficticios de prueba...");

  // Limpieza previa (orden por dependencias)
  await prisma.refereeNote.deleteMany();
  await prisma.match.deleteMany();
  await prisma.player.deleteMany();
  await prisma.staffMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.competition.deleteMany();
  await prisma.dataSource.deleteMany();

  const competition = await prisma.competition.create({
    data: {
      name: "Tercera Federación",
      season: "2025/2026",
      group: "Grupo 14 (Extremadura)",
      source: "MANUAL",
    },
  });

  const teamIdByName: Record<string, string> = {};

  for (const t of teams) {
    const created = await prisma.team.create({
      data: {
        competitionId: competition.id,
        name: t.name,
        shortName: t.shortName,
        city: t.city,
        stadium: t.stadium,
        stadiumAddress: t.stadiumAddress,
        category: "Tercera Federación",
        seasonsInCategory: 2,
        currentPosition: t.position,
        points: t.points,
        goalsFor: t.gf,
        goalsAgainst: t.ga,
        yellowCards: t.yc,
        redCards: t.rc,
        protestLevel: t.protest,
        physicalLevel: t.physical,
        refereeRisk: t.risk,
        playingStyle: t.style,
        tacticalNotes: t.tactical,
        setPieceNotes: t.setPiece,
        assistantNotes: t.assistant,
        generalNotes: t.general,
        dataOrigin: "MANUAL",
        players: {
          create: t.players.map((p) => ({
            name: p.name,
            dorsal: p.dorsal,
            age: p.age,
            position: p.position,
            dominantFoot: p.foot ?? "R",
            matches: p.matches,
            minutes: p.minutes,
            goals: p.goals,
            assists: p.assists,
            yellowCards: p.yc,
            redCards: p.rc,
            previousSeasonYellowCards: p.pyc ?? 0,
            previousSeasonRedCards: p.prc ?? 0,
            behaviourTags: p.tags,
            refereeRisk: p.risk ?? "LOW",
            notes: p.notes,
            dataOrigin: "MANUAL",
          })),
        },
        staff: {
          create: t.staff.map((s) => ({
            name: s.name,
            role: s.role,
            previousTeams: s.previousTeams,
            yellowCards: s.yc ?? 0,
            redCards: s.rc ?? 0,
            protestLevel: s.protest ?? "LOW",
            refereeRisk: s.risk ?? "LOW",
            notes: s.notes,
            dataOrigin: "MANUAL",
          })),
        },
      },
    });
    teamIdByName[t.name] = created.id;
  }

  // Partido de muestra: Villafranca vs Jerez
  const villafranca = teamIdByName["CD Villafranca"];
  const jerez = teamIdByName["Jerez CF"];
  await prisma.match.create({
    data: {
      homeTeamId: villafranca,
      awayTeamId: jerez,
      date: new Date("2026-09-13T17:00:00"),
      round: "Jornada 3",
      stadium: "Estadio Manuel Salas",
      status: "PENDING",
      referee: "(tú)",
      assistant1: "Asistente 1",
      assistant2: "Asistente 2",
      preMatchNotes:
        "Derbi comarcal. Atención al ambiente y al nivel de protesta del equipo local.",
    },
  });

  // Algunas notas arbitrales de ejemplo asociadas a equipos
  await prisma.refereeNote.create({
    data: {
      entityType: "TEAM",
      entityId: villafranca,
      type: "PROTEST",
      importance: "HIGH",
      text: "El banquillo protesta mucho los fueras de juego. Hablar con el 2º entrenador al inicio.",
      showInBriefing: true,
    },
  });
  await prisma.refereeNote.create({
    data: {
      entityType: "TEAM",
      entityId: teamIdByName["CD Azuaga"],
      type: "DISCIPLINARY",
      importance: "HIGH",
      text: "Equipo con muchas tarjetas y dos expulsiones de banquillo. Cortar pronto las tácticas.",
      showInBriefing: true,
    },
  });

  // Fuentes de datos de ejemplo
  await prisma.dataSource.createMany({
    data: [
      { name: "Edición manual", type: "MANUAL" },
      { name: "Importación CSV/Excel", type: "CSV" },
    ],
  });

  const players = await prisma.player.count();
  const staff = await prisma.staffMember.count();
  console.log(
    `✅ Listo: ${teams.length} equipos, ${players} jugadores, ${staff} miembros de cuerpo técnico, 1 partido de muestra.`,
  );
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
