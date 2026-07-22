import type {
  CategoryThresholds,
  ReadinessStatus,
  ScoreStatus,
} from "../types";

const DEFAULT_THRESHOLDS: CategoryThresholds = {
  critical: 40,
  attention: 60,
  onTrack: 80,
};

/** Map a 0–100 category score to a RAG band using its thresholds. */
export function categoryStatus(
  score: number,
  thresholds?: CategoryThresholds | null,
): ScoreStatus {
  const t = thresholds ?? DEFAULT_THRESHOLDS;
  if (score < t.critical) return "critical";
  if (score < t.attention) return "attention";
  if (score < t.onTrack) return "on_track";
  return "excellent";
}

/** Map an overall 0–100 score to a readiness band. */
export function readinessStatus(overall: number): ReadinessStatus {
  if (overall < 45) return "emerging";
  if (overall < 65) return "developing";
  if (overall < 82) return "strong";
  return "investment_ready";
}

export const READINESS_LABELS: Record<ReadinessStatus, string> = {
  emerging: "Emerging",
  developing: "Developing",
  strong: "Strong",
  investment_ready: "Investment Ready",
};
