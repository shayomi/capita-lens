/**
 * Shared jsonb column types. Kept here (not in @sadora/core) so the schema
 * package stays dependency-free, and re-exported by core for app use.
 */

/** An option for select / multi-select questions. */
export interface QuestionOption {
  value: string;
  label: string;
}

/** Stored answer value — shape depends on question type. */
export type AnswerValue =
  | { kind: "text"; value: string }
  | { kind: "number"; value: number }
  | { kind: "boolean"; value: boolean }
  | { kind: "single"; value: string }
  | { kind: "multi"; value: string[] }
  | { kind: "date"; value: string } // ISO date
  | { kind: "file"; documentIds: string[] };

/** Comparison operators for conditional visibility. */
export type ConditionOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "not_in"
  | "answered";

/** A single visibility rule referencing another question's answer. */
export interface Condition {
  questionKey: string;
  operator: ConditionOperator;
  value?: string | number | boolean | string[];
}

/** Show this question only when the rules pass (AND / OR across rules). */
export interface ConditionalLogic {
  mode: "all" | "any";
  conditions: Condition[];
}

/**
 * Conversational microcopy keyed by the answer that triggers it. This is the
 * "learning while answering" layer — e.g. answering "no" reveals guidance.
 */
export interface ResponseFeedback {
  /** Keyed by answer value (or "*" for any answer). */
  [answerValue: string]: {
    tone: "info" | "reassure" | "caution";
    message: string;
  };
}

/**
 * How a question contributes to its category score. `points` maps a discrete
 * answer to a 0–100 quality score; `numericBands` scores numeric answers by
 * range; `weight` scales its contribution within the category.
 */
export interface QuestionScoring {
  weight: number;
  /** Map of answer value → 0–100 score. Use "*" as a fallback. */
  points?: Record<string, number>;
  /** Ordered bands for numeric/currency/percent answers. */
  numericBands?: Array<{ upTo: number | null; score: number }>;
  /** For file questions: score when at least one document is provided. */
  presentScore?: number;
  /** Score used when the question is unanswered/skipped. */
  missingScore?: number;
}

/** Score → status band cutoffs for a category (and the overall score). */
export interface CategoryThresholds {
  critical: number; // below this → critical
  attention: number; // below this → attention
  onTrack: number; // below this → on_track, at/above → excellent
}

// ── AI analysis configuration (admin-authored, per template) ──────────

/** A structured assessment rule the AI must apply. */
export interface AnalysisRule {
  id: string;
  condition: string; // natural language, may reference question keys
  effect: string; // what the AI should do when the condition holds
}

/** A custom narrative output the AI must produce and the dashboard renders. */
export interface OutputSection {
  key: string; // stable slug, e.g. "executive_summary"
  title: string; // display title
  guidance: string; // what the AI should write in this section
}

/**
 * Per-template AI analysis configuration. Drives the OpenAI prompt and the
 * structured output schema. Editable in the admin Analysis Studio.
 */
export interface AnalysisConfig {
  enabled: boolean;
  model: string; // OpenAI model id
  temperature: number;
  rubric: string; // prose instructions / persona
  rules: AnalysisRule[];
  outputSections: OutputSection[];
}

/** A produced narrative section (result of an OutputSection). */
export interface AnalysisSectionResult {
  key: string;
  title: string;
  body: string;
}
