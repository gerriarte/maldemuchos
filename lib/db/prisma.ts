import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function assertDatabaseConfig(): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }
  const url = process.env.DATABASE_URL?.trim();
  if (url?.startsWith("file:")) {
    throw new Error("SQLite DATABASE_URL is not allowed in production");
  }
}

assertDatabaseConfig();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
