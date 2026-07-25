import { db, schema, count, desc, eq, and, gte, sql } from "@capita/db";

/** Headline counts for the admin overview. */
export async function getOverviewStats() {
  const [users, templates, submissions, completed, inProgress, waitlist, avg] =
    await Promise.all([
      db.select({ n: count() }).from(schema.users),
      db.select({ n: count() }).from(schema.templates),
      db.select({ n: count() }).from(schema.assessments),
      db
        .select({ n: count() })
        .from(schema.assessments)
        .where(eq(schema.assessments.status, "completed")),
      db
        .select({ n: count() })
        .from(schema.assessments)
        .where(eq(schema.assessments.status, "in_progress")),
      db.select({ n: count() }).from(schema.waitlist),
      db
        .select({ v: sql<number>`coalesce(avg(${schema.assessments.overallScore}), 0)::float` })
        .from(schema.assessments)
        .where(eq(schema.assessments.status, "completed")),
    ]);

  const submissionsTotal = submissions[0]?.n ?? 0;
  const completedTotal = completed[0]?.n ?? 0;

  return {
    users: users[0]?.n ?? 0,
    templates: templates[0]?.n ?? 0,
    submissions: submissionsTotal,
    completed: completedTotal,
    inProgress: inProgress[0]?.n ?? 0,
    waitlist: waitlist[0]?.n ?? 0,
    avgScore: Math.round(avg[0]?.v ?? 0),
    completionRate: submissionsTotal
      ? Math.round((completedTotal / submissionsTotal) * 100)
      : 0,
  };
}

/** A single point in a daily time series, ready for a chart. */
export interface SeriesPoint {
  label: string;
  value: number;
}

/** Gap-fill grouped `{ day, n }` rows into a continuous `days`-long series. */
function fillDays(
  rows: Array<{ day: string; n: number | string }>,
  days: number,
): SeriesPoint[] {
  const map = new Map(rows.map((r) => [r.day, Number(r.n)]));
  const out: SeriesPoint[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({
      label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      value: map.get(key) ?? 0,
    });
  }
  return out;
}

/** Daily waitlist sign-ups over the last `days`. */
export async function getSignupsSeries(days = 30): Promise<SeriesPoint[]> {
  const since = new Date(Date.now() - days * 86_400_000);
  const dayExpr = sql<string>`to_char(date_trunc('day', ${schema.waitlist.createdAt}), 'YYYY-MM-DD')`;
  const rows = await db
    .select({ day: dayExpr, n: count() })
    .from(schema.waitlist)
    .where(gte(schema.waitlist.createdAt, since))
    .groupBy(dayExpr)
    .orderBy(dayExpr);
  return fillDays(rows, days);
}

/** Daily assessment starts over the last `days`. */
export async function getSubmissionsSeries(days = 30): Promise<SeriesPoint[]> {
  const since = new Date(Date.now() - days * 86_400_000);
  const dayExpr = sql<string>`to_char(date_trunc('day', ${schema.assessments.startedAt}), 'YYYY-MM-DD')`;
  const rows = await db
    .select({ day: dayExpr, n: count() })
    .from(schema.assessments)
    .where(gte(schema.assessments.startedAt, since))
    .groupBy(dayExpr)
    .orderBy(dayExpr);
  return fillDays(rows, days);
}

/** Assessment counts grouped by lifecycle status. */
export async function getStatusBreakdown() {
  return db
    .select({ status: schema.assessments.status, n: count() })
    .from(schema.assessments)
    .groupBy(schema.assessments.status);
}

/** Completed-assessment counts grouped by readiness band. */
export async function getReadinessBreakdown() {
  const rows = await db
    .select({ status: schema.assessments.readinessStatus, n: count() })
    .from(schema.assessments)
    .groupBy(schema.assessments.readinessStatus);
  return rows.filter((r) => r.status != null) as Array<{
    status: NonNullable<(typeof rows)[number]["status"]>;
    n: number;
  }>;
}

/** Most recent submissions for the overview feed. */
export async function getRecentSubmissions(limit = 6) {
  return db.query.assessments.findMany({
    orderBy: desc(schema.assessments.startedAt),
    limit,
    with: {
      user: { columns: { email: true, displayName: true } },
      template: { columns: { name: true } },
    },
  });
}

export async function listTemplates() {
  return db.query.templates.findMany({
    orderBy: desc(schema.templates.updatedAt),
    with: { sections: { columns: { id: true } } },
  });
}

export async function listUsers() {
  return db.query.users.findMany({
    orderBy: desc(schema.users.createdAt),
    limit: 100,
  });
}

export async function listSubmissions() {
  return db.query.assessments.findMany({
    orderBy: desc(schema.assessments.submittedAt),
    limit: 100,
    with: {
      user: { columns: { email: true, displayName: true } },
      template: { columns: { name: true } },
    },
  });
}

export async function listCategories() {
  return db.query.categories.findMany({
    orderBy: schema.categories.displayOrder,
  });
}

export async function listWaitlist() {
  return db.query.waitlist.findMany({
    orderBy: desc(schema.waitlist.createdAt),
    limit: 500,
  });
}

/**
 * A single submission with everything an admin needs to review it: the user,
 * template, every answer (with its question + section + category), and the
 * engine/AI outputs (category scores, risks, recommendations, narrative).
 */
export async function getSubmissionDetail(id: string) {
  return db.query.assessments.findFirst({
    where: eq(schema.assessments.id, id),
    with: {
      user: {
        columns: { id: true, email: true, displayName: true, createdAt: true },
      },
      template: { columns: { name: true, slug: true } },
      business: true,
      answers: {
        with: {
          question: {
            columns: {
              id: true,
              key: true,
              label: true,
              type: true,
              displayOrder: true,
            },
            with: {
              section: {
                columns: { id: true, title: true, displayOrder: true },
              },
              category: { columns: { label: true } },
            },
          },
        },
      },
      categoryScores: {
        with: { category: { columns: { label: true } } },
      },
      risks: { orderBy: schema.risks.displayOrder },
      recommendations: { orderBy: schema.recommendations.priority },
    },
  });
}

export type SubmissionDetail = NonNullable<
  Awaited<ReturnType<typeof getSubmissionDetail>>
>;

/** Full template with ordered sections and their ordered questions. */
export async function getTemplateDetail(id: string) {
  return db.query.templates.findFirst({
    where: eq(schema.templates.id, id),
    with: {
      sections: {
        orderBy: schema.sections.displayOrder,
        with: {
          questions: {
            orderBy: schema.questions.displayOrder,
            with: { category: { columns: { label: true } } },
          },
        },
      },
    },
  });
}
