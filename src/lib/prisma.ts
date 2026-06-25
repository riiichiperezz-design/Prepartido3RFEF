import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import { SEED_DB_BASE64 } from "./seedDb";

/**
 * Cliente Prisma como singleton.
 * En desarrollo Next.js recarga los módulos en caliente, por lo que guardamos
 * la instancia en globalThis para no abrir múltiples conexiones a SQLite.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Crea el cliente Prisma.
 *
 * - En LOCAL: no se toca la configuración; Prisma usa DATABASE_URL del schema
 *   (file:./dev.db), que resuelve la ruta relativa respecto a la carpeta prisma/.
 *
 * - En serverless de SOLO LECTURA (Vercel): el sistema de archivos del proyecto
 *   no es escribible, pero /tmp sí. Volcamos ahí la BD ya sembrada (embebida en
 *   base64) y apuntamos Prisma a esa ruta ABSOLUTA (importante: una ruta
 *   relativa pasada por `datasources` se resolvería respecto al cwd, no al
 *   schema). OJO: /tmp es efímero; en la versión online los cambios pueden no
 *   persistir entre arranques en frío. Para persistencia real, usar Postgres.
 */
function createPrismaClient(): PrismaClient {
  const log: ("error" | "warn")[] =
    process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];

  if (process.env.VERCEL) {
    const tmpDb = "/tmp/dev.db";
    try {
      if (!fs.existsSync(tmpDb)) {
        fs.writeFileSync(tmpDb, Buffer.from(SEED_DB_BASE64, "base64"));
      }
    } catch {
      // si falla, Prisma devolverá un error claro al consultar
    }
    return new PrismaClient({
      datasources: { db: { url: `file:${tmpDb}` } },
      log,
    });
  }

  return new PrismaClient({ log });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
