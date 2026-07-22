import {
  pgTable,
  uuid,
  text,
  integer,
  real,
  timestamp,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
  assessmentStatusEnum,
  readinessStatusEnum,
  scoreStatusEnum,
  severityEnum,
  difficultyEnum,
  recommendationStatusEnum,
} from "./enums";
import { users } from "./users";
import { businesses } from "./businesses";
import { templates, questions, categories } from "./templates";
import type { AnswerValue, AnalysisSectionResult } from "../types";

/** A single run of a template by a user for a business. */
export const assessments = pgTable("assessments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  businessId: uuid("business_id").references(() => businesses.id, {
    onDelete: "set null",
  }),
  templateId: uuid("template_id")
    .notNull()
    .references(() => templates.id, { onDelete: "restrict" }),
  templateVersion: integer("template_version").notNull(),
  status: assessmentStatusEnum("status").notNull().default("in_progress"),
  overallScore: real("overall_score"),
  readinessStatus: readinessStatusEnum("readiness_status"),
  currentSectionOrder: integer("current_section_order").default(0),
  // AI analysis outputs (hybrid: engine scores, AI narrates).
  summary: text("summary"),
  analysisSections: jsonb("analysis_sections").$type<AnalysisSectionResult[]>(),
  aiModel: text("ai_model"),
  aiGeneratedAt: timestamp("ai_generated_at", { withTimezone: true }),
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** One stored answer per question per assessment. Value shape is typed union. */
export const answers = pgTable(
  "answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assessmentId: uuid("assessment_id")
      .notNull()
      .references(() => assessments.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    value: jsonb("value").$type<AnswerValue>(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    onePerQuestion: unique("answers_assessment_question_uq").on(
      t.assessmentId,
      t.questionId,
    ),
  }),
);

/** Per-category rollup produced by the scoring engine. */
export const categoryScores = pgTable("category_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  score: real("score").notNull(),
  status: scoreStatusEnum("status").notNull(),
  rationale: text("rationale"), // AI explanation for this category's standing
});

/** Risks surfaced by the engine for this assessment. */
export const risks = pgTable("risks", {
  id: uuid("id").primaryKey().defaultRandom(),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  detail: text("detail"),
  severity: severityEnum("severity").notNull().default("medium"),
  displayOrder: integer("display_order").notNull().default(0),
});

/** Prioritised improvement actions with progress + evidence tracking. */
export const recommendations = pgTable("recommendations", {
  id: uuid("id").primaryKey().defaultRandom(),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  why: text("why"),
  estimatedImpact: integer("estimated_impact"), // points of readiness gained
  difficulty: difficultyEnum("difficulty").notNull().default("moderate"),
  timeToComplete: text("time_to_complete"),
  status: recommendationStatusEnum("status").notNull().default("pending"),
  priority: integer("priority").notNull().default(0), // lower = higher priority
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  user: one(users, {
    fields: [assessments.userId],
    references: [users.id],
  }),
  business: one(businesses, {
    fields: [assessments.businessId],
    references: [businesses.id],
  }),
  template: one(templates, {
    fields: [assessments.templateId],
    references: [templates.id],
  }),
  answers: many(answers),
  categoryScores: many(categoryScores),
  risks: many(risks),
  recommendations: many(recommendations),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  assessment: one(assessments, {
    fields: [answers.assessmentId],
    references: [assessments.id],
  }),
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));

export type Assessment = typeof assessments.$inferSelect;
export type Answer = typeof answers.$inferSelect;
export type CategoryScore = typeof categoryScores.$inferSelect;
export type Risk = typeof risks.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;
export type NewAssessment = typeof assessments.$inferInsert;
export type NewAnswer = typeof answers.$inferInsert;
export type NewRecommendation = typeof recommendations.$inferInsert;
