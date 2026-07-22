import type {
  AnswerMap,
  AssessmentResult,
  CategoryResult,
  EngineCategory,
  EngineQuestion,
} from "../types";
import { isVisible } from "../conditions";
import { scoreQuestion } from "./score-question";
import { categoryStatus, readinessStatus } from "./status";
import { buildInsights, type ScoredQuestion } from "./insights";

export interface EngineInput {
  questions: EngineQuestion[];
  categories: EngineCategory[];
  answers: AnswerMap;
}

/**
 * The Decision Intelligence Framework — a pure function.
 *
 *   (answers + template) → overall score, category scores, risks, roadmap
 *
 * Everything it needs (weights, thresholds, per-answer points) is data on
 * the questions/categories, so admins tune behaviour without a deploy. This
 * is also the seam where a future AI layer augments the deterministic core.
 */
export function runAssessment(input: EngineInput): AssessmentResult {
  const { questions, categories, answers } = input;

  // 1. Score every visible, scorable question.
  const scored: ScoredQuestion[] = [];
  for (const q of questions) {
    if (!isVisible(q.conditionalLogic, answers)) continue;
    const score = scoreQuestion(q.scoring, answers[q.key]);
    if (score === null) continue;
    scored.push({ question: q, score });
  }

  // 2. Roll up into weighted category scores.
  const categoryResults = computeCategoryScores(scored, categories);

  // 3. Overall = category scores weighted by category weight.
  const overallScore = weightedOverall(categoryResults, categories);

  // 4. Derive risks + prioritised recommendations.
  const { risks, recommendations } = buildInsights(
    scored,
    categories,
    categoryResults,
  );

  return {
    overallScore: Math.round(overallScore),
    readinessStatus: readinessStatus(overallScore),
    categories: categoryResults,
    risks,
    recommendations,
  };
}

function computeCategoryScores(
  scored: ScoredQuestion[],
  categories: EngineCategory[],
): CategoryResult[] {
  return categories
    .map((cat) => {
      const items = scored.filter((s) => s.question.categoryKey === cat.key);
      if (items.length === 0) return null;

      let weightSum = 0;
      let acc = 0;
      for (const item of items) {
        const w = item.question.scoring?.weight ?? 1;
        acc += item.score * w;
        weightSum += w;
      }
      const score = weightSum === 0 ? 0 : acc / weightSum;
      return {
        key: cat.key,
        label: cat.label,
        score: Math.round(score),
        status: categoryStatus(score, cat.thresholds),
      } satisfies CategoryResult;
    })
    .filter((c): c is CategoryResult => c !== null);
}

function weightedOverall(
  results: CategoryResult[],
  categories: EngineCategory[],
): number {
  const weightByKey = new Map(categories.map((c) => [c.key, c.weight]));
  let weightSum = 0;
  let acc = 0;
  for (const r of results) {
    const w = weightByKey.get(r.key) ?? 1;
    acc += r.score * w;
    weightSum += w;
  }
  return weightSum === 0 ? 0 : acc / weightSum;
}
