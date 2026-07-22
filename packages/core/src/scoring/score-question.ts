import type { AnswerValue, QuestionScoring } from "../types";

/**
 * Score a single question's answer on a 0–100 quality scale, or return null
 * if the question carries no scoring config (informational only).
 *
 * Handles the discrete `points` map, `numericBands` for numeric answers,
 * `presentScore`/`missingScore` for file evidence, and a `missingScore`
 * fallback for unanswered scored questions.
 */
export function scoreQuestion(
  scoring: QuestionScoring | null | undefined,
  answer: AnswerValue | undefined,
): number | null {
  if (!scoring) return null;

  // Unanswered
  if (!answer) return scoring.missingScore ?? 0;

  switch (answer.kind) {
    case "boolean": {
      const key = answer.value ? "yes" : "no";
      return pointsLookup(scoring, key);
    }
    case "single":
    case "text":
    case "date":
      return pointsLookup(scoring, String(answer.value));

    case "multi": {
      // Sum the points contributed by each selected option (capped at 100).
      if (!scoring.points) return null;
      const total = answer.value.reduce(
        (sum, v) => sum + (scoring.points?.[v] ?? 0),
        0,
      );
      return Math.min(100, total);
    }

    case "number":
      return scoreNumeric(scoring, answer.value);

    case "file":
      return answer.documentIds.length > 0
        ? (scoring.presentScore ?? 100)
        : (scoring.missingScore ?? 0);

    default:
      return null;
  }
}

function pointsLookup(scoring: QuestionScoring, key: string): number | null {
  if (!scoring.points) return null;
  return scoring.points[key] ?? scoring.points["*"] ?? scoring.missingScore ?? 0;
}

function scoreNumeric(scoring: QuestionScoring, value: number): number | null {
  if (!scoring.numericBands || scoring.numericBands.length === 0) return null;
  for (const band of scoring.numericBands) {
    if (band.upTo === null || value <= band.upTo) return band.score;
  }
  // Fallback to the last band's score.
  return scoring.numericBands[scoring.numericBands.length - 1]!.score;
}
