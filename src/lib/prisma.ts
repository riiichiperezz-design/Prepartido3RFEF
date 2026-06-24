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
 * Resuelve la URL de la base de datos.
 *
 * En local: usa DATABASE_URL (archivo ./dev.db).
 *
 * En serverless de SOLO LECTURA (Vercel): el sistema de archivos del proyecto no
 * es escribible, pero /tmp sí. Volcamos ahí la BD ya sembrada (embebida en
 * base64) para que la demo tenga datos. OJO: /tmp es efímero, por lo que en la
 * versión online los cambios pueden no persistir entre arranques en frío. Para
 * persistencia real, conectar una base de datos en la nube (Postgres).
 */
function resolveDatabaseUrl(): string {
  if (process.env.VERCEL) {
    const tmpDb = "/tmp/dev.db";
    try {
      if (!fs.existsSync(tmpDb)) {
        fs.writeFileSync(tmpDb, Buffer.from(SEED_DB_BASE64, "base64"));
      }
    } catch {
      // si falla, Prisma devolverá un error claro al consultar
    }
    return `file:${tmpDb}`;
  }
  return process.env.DATABASE_URL || "file:./dev.db";
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: resolveDatabaseUrl() } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
