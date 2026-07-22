import { pgEnum } from "drizzle-orm/pg-core";

/** Access roles. super_admin can manage admins; admin manages content + users. */
export const userRoleEnum = pgEnum("user_role", [
  "user",
  "admin",
  "super_admin",
]);

/** Lifecycle of a questionnaire template. Only `published` is served to users. */
export const templateStatusEnum = pgEnum("template_status", [
  "draft",
  "published",
  "archived",
]);

/** Input widget / value shape for a question. */
export const questionTypeEnum = pgEnum("question_type", [
  "short_text",
  "long_text",
  "number",
  "currency",
  "percent",
  "boolean", // yes / no
  "single_select",
  "multi_select",
  "date",
  "file", // evidence upload → R2
]);

/** Progress of a user's assessment run. */
export const assessmentStatusEnum = pgEnum("assessment_status", [
  "in_progress",
  "submitted",
  "analysing",
  "completed",
]);

/** Readiness bands derived from the overall score. */
export const readinessStatusEnum = pgEnum("readiness_status", [
  "emerging",
  "developing",
  "strong",
  "investment_ready",
]);

/** Category-level RAG status. */
export const scoreStatusEnum = pgEnum("score_status", [
  "critical",
  "attention",
  "on_track",
  "excellent",
]);

export const severityEnum = pgEnum("severity", ["low", "medium", "high"]);

export const difficultyEnum = pgEnum("difficulty", ["easy", "moderate", "hard"]);

export const recommendationStatusEnum = pgEnum("recommendation_status", [
  "pending",
  "in_progress",
  "completed",
  "dismissed",
]);

export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "starter",
  "professional",
  "business",
  "enterprise",
]);
