import type {
  EngineQuestion,
  EngineCategory,
  RiskResult,
  RecommendationResult,
  CategoryResult,
} from "../types";

export interface ScoredQuestion {
  question: EngineQuestion;
  score: number; // 0–100
}

const difficultyFor = (gap: number): RecommendationResult["difficulty"] =>
  gap > 60 ? "hard" : gap > 30 ? "moderate" : "easy";

const timeFor = (difficulty: RecommendationResult["difficulty"]): string =>
  difficulty === "hard" ? "2–4 weeks" : difficulty === "moderate" ? "1–2 weeks" : "1–3 days";

/**
 * Turn the scored breakdown into human-facing risks and a prioritised
 * improvement roadmap. Priority = potential readiness uplift (weighted gap),
 * so the highest-impact, most-achievable actions surface first.
 */
export function buildInsights(
  scored: ScoredQuestion[],
  categories: EngineCategory[],
  categoryResults: CategoryResult[],
): { risks: RiskResult[]; recommendations: RecommendationResult[] } {
  const labelByKey = new Map(categories.map((c) => [c.key, c.label]));

  // Risks: any category that isn't on track, worst first.
  const risks: RiskResult[] = categoryResults
    .filter((c) => c.status === "critical" || c.status === "attention")
    .sort((a, b) => a.score - b.score)
    .map((c) => ({
      categoryKey: c.key,
      title: `${c.label} needs attention`,
      detail: `Your ${c.label.toLowerCase()} score is ${Math.round(c.score)}/100, below the level lenders typically expect.`,
      severity: c.status === "critical" ? "high" : "medium",
    }));

  // Recommendations: individual weak answers, ranked by weighted uplift.
  const recommendations: RecommendationResult[] = scored
    .filter((s) => s.score < 70 && s.question.scoring)
    .map((s) => {
      const gap = 100 - s.score;
      const weight = s.question.scoring?.weight ?? 1;
      const impactScore = gap * weight;
      const difficulty = difficultyFor(gap);
      return {
        categoryKey: s.question.categoryKey ?? undefined,
        title: `Improve: ${s.question.label}`,
        why: s.question.categoryKey
          ? `Strengthens your ${labelByKey.get(s.question.categoryKey) ?? "readiness"} score, a factor lenders weigh heavily.`
          : "Improves your overall capital readiness profile.",
        estimatedImpact: Math.round(Math.min(15, impactScore / 8)),
        difficulty,
        timeToComplete: timeFor(difficulty),
        priority: -impactScore, // lower = higher priority
      };
    })
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 8)
    .map((r, i) => ({ ...r, priority: i + 1 }));

  return { risks, recommendations };
}
