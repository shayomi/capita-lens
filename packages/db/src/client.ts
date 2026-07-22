import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

type DrizzleClient = ReturnType<typeof createDb>;

/**
 * Drizzle client backed by Neon's HTTP driver. Works in every runtime (node,
 * edge, serverless) with no WebSocket polyfill, which suits Vercel + Next.
 */
function createDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

const globalForDb = globalThis as unknown as { db?: DrizzleClient };

function getDb(): DrizzleClient {
  if (!globalForDb.db) globalForDb.db = createDb();
  return globalForDb.db;
}

/**
 * Lazy proxy: the connection is only created on first property access, so
 * importing `db` never throws at build/collect time when env isn't present.
 */
export const db = new Proxy({} as DrizzleClient, {
  get(_target, prop) {
    const client = getDb();
    const value = client[prop as keyof DrizzleClient];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export type Database = DrizzleClient;
