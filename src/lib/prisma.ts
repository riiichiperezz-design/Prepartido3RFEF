import { PrismaClient } from "@prisma/client";

/**
 * Cliente Prisma como singleton (PostgreSQL / Neon).
 * En desarrollo Next.js recarga módulos en caliente, por lo que guardamos la
 * instancia en globalThis para no abrir múltiples conexiones.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
