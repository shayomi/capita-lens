import { db, schema, eq, and, desc } from "@capita/db";

export interface DashboardData {
  assessment: typeof schema.assessments.$inferSelect;
  categories: Array<{
    key: string;
    label: string;
    score: number;
    status: string;
  }>;
  risks: (typeof schema.risks.$inferSelect)[];
  recommendations: (typeof schema.recommendations.$inferSelect)[];
}

/**
 * Load the most recent completed assessment for a user, joined with its
 * category scores, risks and prioritised recommendations. Returns null when
 * the user hasn't finished an assessment yet.
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

  const [scores, categoryRows, risks, recommendations] = await Promise.all([
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
  ]);

  const labelById = new Map(categoryRows.map((c) => [c.id, c]));
  const categories = scores.map((s) => {
    const cat = labelById.get(s.categoryId);
    return {
      key: cat?.key ?? s.categoryId,
      label: cat?.label ?? "Category",
      score: s.score,
      status: s.status,
    };
  });

  return { assessment, categories, risks, recommendations };
}
