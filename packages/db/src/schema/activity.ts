import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";

/**
 * Append-only activity feed. Powers "Recent Activity" for users and the
 * audit trail for admins (who did what, including admin actions on users).
 */
export const activityLog = pgTable("activity_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: text("actor_id").references(() => users.id, {
    onDelete: "set null",
  }),
  subjectId: text("subject_id"), // affected user/assessment/etc (free-form id)
  action: text("action").notNull(), // e.g. "assessment.submitted", "user.role_changed"
  summary: text("summary"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ActivityLog = typeof activityLog.$inferSelect;
export type NewActivityLog = typeof activityLog.$inferInsert;
