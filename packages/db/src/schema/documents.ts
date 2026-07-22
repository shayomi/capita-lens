import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { assessments } from "./assessments";
import { questions } from "./templates";

/**
 * A file stored in Cloudflare R2. `key` is the object key; the file is
 * served via presigned URL or the public R2 domain. Optionally linked to
 * the question (evidence upload) it was provided for.
 */
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  assessmentId: uuid("assessment_id").references(() => assessments.id, {
    onDelete: "cascade",
  }),
  questionId: uuid("question_id").references(() => questions.id, {
    onDelete: "set null",
  }),
  key: text("key").notNull().unique(), // R2 object key
  fileName: text("file_name").notNull(),
  contentType: text("content_type"),
  sizeBytes: integer("size_bytes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const documentsRelations = relations(documents, ({ one }) => ({
  owner: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
  assessment: one(assessments, {
    fields: [documents.assessmentId],
    references: [assessments.id],
  }),
}));

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
