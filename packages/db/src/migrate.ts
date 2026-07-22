import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";

// Standalone migration runner: `pnpm db:migrate`.
config({ path: "../../.env" });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  const sql = neon(connectionString);
  const db = drizzle(sql);

  console.log("→ Running migrations…");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✓ Migrations complete");
}

main().catch((err) => {
  console.error("✗ Migration failed:", err);
  process.exit(1);
});
