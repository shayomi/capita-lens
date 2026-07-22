export { db, type Database } from "./client";
export * as schema from "./schema";
export * from "./types";

// Re-export drizzle query helpers so apps import them from one place.
export {
  eq,
  and,
  or,
  ne,
  gt,
  gte,
  lt,
  lte,
  inArray,
  desc,
  asc,
  sql,
  count,
} from "drizzle-orm";
