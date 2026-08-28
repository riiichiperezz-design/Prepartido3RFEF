/**
 * Siembra la base de datos con el Grupo 14 real (2026-2027): equipos, calendario
 * y plantillas aportadas. La lógica vive en src/lib/seedCore.ts para poder
 * reutilizarla también desde la app (/api/setup) en el despliegue en la nube.
 */
import { PrismaClient } from "@prisma/client";
import { populateDatabase } from "../src/lib/seedCore";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Cargando Grupo 14 (Tercera Federación 2026-2027)...");
  const r = await populateDatabase(prisma, { reset: true });
  console.log(`✅ Listo: ${r.teams} equipos, ${r.matches} partidos, ${r.players} jugadores.`);
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
