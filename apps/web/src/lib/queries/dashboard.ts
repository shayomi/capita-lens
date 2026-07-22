import { db, schema, eq, and, desc, type AnswerValue } from "@capita/db";
import { formatAnswer } from "@/lib/format-answer";

export interface SnapshotItem {
  label: string;
  value: string;
}

export interface DashboardData {
  assessment: typeof schema.assessments.$inferSelect;
  snapshot: SnapshotItem[];
  categories: Array<{
    key: string;
    label: string;
    score: number;
    status: string;
    rationale: string | null;
  }>;
  risks: (typeof schema.risks.$inferSelect)[];
  recommendations: (typeof schema.recommendations.$inferSelect)[];
}

// Business Profile / Funding fields surfaced in the "Business Snapshot" panel.
const SNAPSHOT_FIELDS: Array<{ key: string; label: string }> = [
  { key: "business_name", label: "Business" },
  { key: "legal_structure", label: "Structure" },
  { key: "years_trading", label: "Years trading" },
  { key: "employees", label: "Employees" },
  { key: "annual_turnover", label: "Turnover" },
  { key: "funding_type", label: "Funding sought" },
  { key: "funding_amount", label: "Amount" },
];

/**
 * Load the most recent completed assessment for a user, joined with its
 * category scores (+ AI rationale), risks, prioritised recommendations, and a
 * business snapshot built from the profile answers. Returns null when the user
 * hasn't finished an assessment yet.
 */
export async function getDashboardData(
  userId: string,
): Promise<DashboardData | null> {
  const assessment = await db.query.assessments.findFirst({
    where: and(
      eq(schema.assessments.userId, userId),
      eq(schema.assessments.status, "completed"),
    ),
    orderBy: desc(schema.assessments.completedAt),
  });
  if (!assessment) return null;

  const [scores, categoryRows, risks, recommendations, sections, answerRows] =
    await Promise.all([
      db.query.categoryScores.findMany({
        where: eq(schema.categoryScores.assessmentId, assessment.id),
      }),
      db.query.categories.findMany(),
      db.query.risks.findMany({
        where: eq(schema.risks.assessmentId, assessment.id),
        orderBy: schema.risks.displayOrder,
      }),
      db.query.recommendations.findMany({
        where: eq(schema.recommendations.assessmentId, assessment.id),
        orderBy: schema.recommendations.priority,
      }),
      db.query.sections.findMany({
        where: eq(schema.sections.templateId, assessment.templateId),
        with: { questions: true },
      }),
      db.query.answers.findMany({
        where: eq(schema.answers.assessmentId, assessment.id),
      }),
    ]);

  const labelById = new Map(categoryRows.map((c) => [c.id, c]));
  const categories = scores.map((s) => {
    const cat = labelById.get(s.categoryId);
    return {
      key: cat?.key ?? s.categoryId,
      label: cat?.label ?? "Category",
      score: s.score,
      status: s.status,
      rationale: s.rationale,
    };
  });

  // Build a lookup of question meta + answer by question key for the snapshot.
  const questions = sections.flatMap((s) => s.questions);
  const qByKey = new Map(questions.map((q) => [q.key, q]));
  const answerByQId = new Map<string, AnswerValue>();
  for (const a of answerRows) if (a.value) answerByQId.set(a.questionId, a.value);

  const snapshot: SnapshotItem[] = [];
  for (const field of SNAPSHOT_FIELDS) {
    const q = qByKey.get(field.key);
    if (!q) continue;
    const value = answerByQId.get(q.id);
    if (!value) continue;
    snapshot.push({
      label: field.label,
      value: formatAnswer(value, q.type, q.options),
    });
  }

  return { assessment, snapshot, categories, risks, recommendations };
}
