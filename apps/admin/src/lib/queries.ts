import { db, schema, count, desc, eq } from "@capita/db";

/** Headline counts for the admin overview. */
export async function getOverviewStats() {
  const [users, templates, submissions, completed] = await Promise.all([
    db.select({ n: count() }).from(schema.users),
    db.select({ n: count() }).from(schema.templates),
    db.select({ n: count() }).from(schema.assessments),
    db
      .select({ n: count() })
      .from(schema.assessments)
      .where(eq(schema.assessments.status, "completed")),
  ]);

  return {
    users: users[0]?.n ?? 0,
    templates: templates[0]?.n ?? 0,
    submissions: submissions[0]?.n ?? 0,
    completed: completed[0]?.n ?? 0,
  };
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
