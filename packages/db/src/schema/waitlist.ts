import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

/** Pre-launch interest capture from the marketing site. */
export const waitlist = pgTable("waitlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  businessName: text("business_name"),
  source: text("source"), // e.g. "landing_hero", "landing_cta"
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type WaitlistEntry = typeof waitlist.$inferSelect;
export type NewWaitlistEntry = typeof waitlist.$inferInsert;
