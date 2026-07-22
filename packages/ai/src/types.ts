import type {
  AnalysisConfig,
  AnalysisSectionResult,
} from "@capita/db";

export type { AnalysisConfig, AnalysisSectionResult };

/** A single answer, formatted for the prompt. */
export interface AnalysisAnswer {
  section: string;
  label: string;
  value: string;
}

/** A category with its engine-computed score (hybrid mode). */
export interface AnalysisCategory {
  key: string;
  label: string;
  description?: string | null;
  score: number;
  status: string;
}

/** Everything the analyst needs to produce its output. */
export interface AnalysisInput {
  config: AnalysisConfig;
  overallScore: number;
  readinessStatus: string;
  categories: AnalysisCategory[];
  answers: AnalysisAnswer[];
}

export interface AiRisk {
  title: string;
  detail: string;
  severity: "low" | "medium" | "high";
  categoryKey: string | null;
}

export interface AiRecommendation {
  title: string;
  why: string;
  difficulty: "easy" | "moderate" | "hard";
  timeToComplete: string;
  categoryKey: string | null;
}

export interface AiCategoryAnalysis {
  categoryKey: string;
  rationale: string;
}

/** The structured result the AI returns (narrative layer over engine scores). */
export interface AiResult {
  summary: string;
  categoryAnalysis: AiCategoryAnalysis[];
  risks: AiRisk[];
  recommendations: AiRecommendation[];
  sections: AnalysisSectionResult[];
}
