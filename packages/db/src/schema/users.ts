import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userRoleEnum } from "./enums";
import { businesses } from "./businesses";
import { assessments } from "./assessments";

/**
 * Application user record.
 *
 * `id` mirrors the Neon Auth (Stack Auth) user id. We upsert this row on
 * first authenticated request so role + app data live in our own schema
 * rather than depending on the auth provider's synced tables.
 */
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Stack Auth user id
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").notNull().default("user"),
  isActive: boolean("is_active").notNull().default(true),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  businesses: many(businesses),
  assessments: many(assessments),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
