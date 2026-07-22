import type {
  AnswerValue,
  QuestionScoring,
  ConditionalLogic,
  CategoryThresholds,
} from "@capita/db";

export type {
  AnswerValue,
  QuestionScoring,
  ConditionalLogic,
  CategoryThresholds,
};

/** Readiness band derived from the overall score. */
export type ReadinessStatus =
  | "emerging"
  | "developing"
  | "strong"
  | "investment_ready";

/** Category RAG band. */
export type ScoreStatus = "critical" | "attention" | "on_track" | "excellent";

/** A question as the engine needs it — decoupled from the DB row shape. */
export interface EngineQuestion {
  key: string;
  categoryKey?: string | null;
  type: string;
  label: string;
  scoring?: QuestionScoring | null;
  conditionalLogic?: ConditionalLogic | null;
}

/** A scoring category as the engine needs it. */
export interface EngineCategory {
  key: string;
  label: string;
  weight: number;
  thresholds?: CategoryThresholds | null;
}

/** Answers keyed by question key. */
export type AnswerMap = Record<string, AnswerValue | undefined>;

export interface CategoryResult {
  key: string;
  label: string;
  score: number;
  status: ScoreStatus;
}

export interface RiskResult {
  categoryKey?: string;
  title: string;
  detail?: string;
  severity: "low" | "medium" | "high";
}

export interface RecommendationResult {
  categoryKey?: string;
  title: string;
  why: string;
  estimatedImpact: number;
  difficulty: "easy" | "moderate" | "hard";
  timeToComplete: string;
  priority: number;
}

export interface AssessmentResult {
  overallScore: number;
  readinessStatus: ReadinessStatus;
  categories: CategoryResult[];
  risks: RiskResult[];
  recommendations: RecommendationResult[];
}
