import { db, schema, eq, and, desc, type AnswerValue } from "@capita/db";
import { formatAnswer } from "@/lib/format-answer";

export interface SnapshotItem {
  label: string;
  value: string;
}

export interface FundingObjective {
  type: string | null;
  amount: string | null;
  timing: string | null;
  purpose: string | null;
}

export interface DashboardData {
  assessment: typeof schema.assessments.$inferSelect;
  business: SnapshotItem[];
  objective: FundingObjective;
  categories: Array<{
    key: string;
    label: string;
    score: number;
    status: string;
    rationale: string | null;
  }>;
  risks: (typeof schema.risks.$inferSelect)[];
  recommendations: (typeof schema.recommendations.$inferSelect)[];
  missingEvidence: string[];
  potentialGain: number | null;
}

const BUSINESS_FIELDS: Array<{ key: string; label: string }> = [
  { key: "business_name", label: "Business" },
  { key: "legal_structure", label: "Structure" },
  { key: "years_trading", label: "Years trading" },
  { key: "annual_turnover", label: "Turnover" },
];

/** Load the latest completed assessment reframed as a funding story. */
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

  // Answer lookups keyed by question.
  const questions = sections.flatMap((s) => s.questions);
  const qByKey = new Map(questions.map((q) => [q.key, q]));
  const answerByQId = new Map<string, AnswerValue>();
  for (const a of answerRows) if (a.value) answerByQId.set(a.questionId, a.value);

  const readKey = (key: string): string | null => {
    const q = qByKey.get(key);
    if (!q) return null;
    const v = answerByQId.get(q.id);
    return v ? formatAnswer(v, q.type, q.options) : null;
  };

  const business: SnapshotItem[] = [];
  for (const f of BUSINESS_FIELDS) {
    const value = readKey(f.key);
    if (value) business.push({ label: f.label, value });
  }

  const objective: FundingObjective = {
    type: readKey("funding_type"),
    amount: readKey("funding_amount"),
    timing: readKey("funding_timing"),
    purpose: readKey("funding_purpose"),
  };

  // Missing evidence: file/documentation questions with nothing provided.
  const missingEvidence: string[] = [];
  for (const q of questions) {
    if (q.type !== "file") continue;
    const v = answerByQId.get(q.id);
    const provided = v?.kind === "file" && v.documentIds.length > 0;
    if (!provided) missingEvidence.push(q.label);
  }

  // Potential readiness gain from the recommended actions (engine mode only).
  const gain = recommendations.reduce(
    (sum, r) => sum + (r.estimatedImpact ?? 0),
    0,
  );
  const potentialGain = gain > 0 ? gain : null;

  return {
    assessment,
    business,
    objective,
    categories,
    risks,
    recommendations,
    missingEvidence,
    potentialGain,
  };
}
