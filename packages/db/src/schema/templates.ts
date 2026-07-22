import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  real,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { templateStatusEnum, questionTypeEnum } from "./enums";
import { users } from "./users";
import type {
  ConditionalLogic,
  QuestionOption,
  QuestionScoring,
  ResponseFeedback,
  CategoryThresholds,
} from "../types";

/**
 * Scoring category (e.g. Financial Health, Credit Risk). These are the
 * dimensions the Decision Intelligence Framework rolls answers up into.
 * Admins tune `weight` (relative contribution to overall score) and
 * `thresholds` (score → status band) — no code change needed.
 */
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(), // stable slug used by the engine
  label: text("label").notNull(),
  description: text("description"),
  weight: real("weight").notNull().default(1),
  thresholds: jsonb("thresholds").$type<CategoryThresholds>(),
  displayOrder: integer("display_order").notNull().default(0),
});

/** A questionnaire template. Only one published version is served per slug. */
export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: templateStatusEnum("status").notNull().default("draft"),
  version: integer("version").notNull().default(1),
  isDefault: boolean("is_default").notNull().default(false),
  estimatedMinutes: integer("estimated_minutes").default(18),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** An ordered group of questions within a template. */
export const sections = pgTable("sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  templateId: uuid("template_id")
    .notNull()
    .references(() => templates.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  intro: text("intro"), // conversational lead-in shown at top of the step
  displayOrder: integer("display_order").notNull().default(0),
});

/**
 * A single question. `scoring`, `conditionalLogic` and `responseFeedback`
 * are jsonb so the whole assessment behaviour is data-driven and editable
 * from the admin builder.
 */
export const questions = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sectionId: uuid("section_id")
      .notNull()
      .references(() => sections.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    key: text("key").notNull(), // stable within a template
    label: text("label").notNull(),
    helpText: text("help_text"),
    placeholder: text("placeholder"),
    type: questionTypeEnum("type").notNull(),
    options: jsonb("options").$type<QuestionOption[]>(),
    required: boolean("required").notNull().default(false),
    displayOrder: integer("display_order").notNull().default(0),
    conditionalLogic: jsonb("conditional_logic").$type<ConditionalLogic>(),
    responseFeedback: jsonb("response_feedback").$type<ResponseFeedback>(),
    scoring: jsonb("scoring").$type<QuestionScoring>(),
  },
  (t) => ({
    keyPerSection: unique("questions_section_key_uq").on(t.sectionId, t.key),
  }),
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  questions: many(questions),
}));

export const templatesRelations = relations(templates, ({ many, one }) => ({
  sections: many(sections),
  author: one(users, {
    fields: [templates.createdBy],
    references: [users.id],
  }),
}));

export const sectionsRelations = relations(sections, ({ many, one }) => ({
  template: one(templates, {
    fields: [sections.templateId],
    references: [templates.id],
  }),
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  section: one(sections, {
    fields: [questions.sectionId],
    references: [sections.id],
  }),
  category: one(categories, {
    fields: [questions.categoryId],
    references: [categories.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type Template = typeof templates.$inferSelect;
export type Section = typeof sections.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type NewTemplate = typeof templates.$inferInsert;
export type NewSection = typeof sections.$inferInsert;
export type NewQuestion = typeof questions.$inferInsert;
