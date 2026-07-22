import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load env from the repo root (.env) regardless of where drizzle-kit runs.
config({ path: "../../.env" });

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
