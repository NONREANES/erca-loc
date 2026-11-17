import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL não definida. Configure a variável de ambiente (veja .env.example).");
  }
  const client = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  globalForPrisma.prisma = client;
  return client;
}

/**
 * Cliente do banco criado só no primeiro uso.
 * Assim o build (que roda sem acesso ao banco na Railway) não precisa de DATABASE_URL.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_alvo, prop) {
    const client = getClient();
    const valor = Reflect.get(client, prop, client);
    return typeof valor === "function" ? valor.bind(client) : valor;
  },
});
