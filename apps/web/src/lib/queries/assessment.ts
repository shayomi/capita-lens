import { db, schema, eq, and, desc, type AnswerValue } from "@sadora/db";

/** The published default template with ordered sections, questions, categories. */
export async function getPublishedTemplate() {
  const template = await db.query.templates.findFirst({
    where: and(
      eq(schema.templates.isDefault, true),
      eq(schema.templates.status, "published"),
    ),
    with: {
      sections: {
        orderBy: schema.sections.displayOrder,
        with: {
          questions: {
            orderBy: schema.questions.displayOrder,
            with: { category: { columns: { key: true } } },
          },
        },
      },
    },
  });
  return template ?? null;
}

export type PublishedTemplate = NonNullable<
  Awaited<ReturnType<typeof getPublishedTemplate>>
>;
export type TemplateSection = PublishedTemplate["sections"][number];
export type TemplateQuestion = TemplateSection["questions"][number];

/**
 * Resume the user's in-progress assessment for this template, or start a new
 * one. Returns the assessment plus the answers already saved (keyed by
 * question id).
 */
export async function getOrCreateAssessment(
  userId: string,
  templateId: string,
  templateVersion: number,
) {
  let assessment = await db.query.assessments.findFirst({
    where: and(
      eq(schema.assessments.userId, userId),
      eq(schema.assessments.templateId, templateId),
      eq(schema.assessments.status, "in_progress"),
    ),
    orderBy: desc(schema.assessments.startedAt),
  });

  if (!assessment) {
    const [created] = await db
      .insert(schema.assessments)
      .values({ userId, templateId, templateVersion })
      .returning();
    assessment = created!;
  }

  const answerRows = await db.query.answers.findMany({
    where: eq(schema.answers.assessmentId, assessment.id),
  });

  const answersByQuestionId: Record<string, AnswerValue> = {};
  for (const a of answerRows) {
    if (a.value) answersByQuestionId[a.questionId] = a.value;
  }

  return { assessment, answersByQuestionId };
}
