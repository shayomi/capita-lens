"use server";

import { revalidatePath } from "next/cache";
import {
  db,
  schema,
  eq,
  and,
  type AnswerValue,
} from "@capita/db";
import { requireUser } from "@capita/auth";
import {
  runAssessment,
  type EngineQuestion,
  type EngineCategory,
  type AnswerMap,
} from "@capita/core";
import { buildDocumentKey, getUploadUrl } from "@capita/storage";
import { auth } from "@/lib/auth/server";

/** Ensure the assessment exists and belongs to the current user. */
async function assertOwnedAssessment(assessmentId: string, userId: string) {
  const assessment = await db.query.assessments.findFirst({
    where: and(
      eq(schema.assessments.id, assessmentId),
      eq(schema.assessments.userId, userId),
    ),
  });
  if (!assessment) throw new Error("Assessment not found");
  return assessment;
}

/** Upsert a batch of answers for the assessment (save & continue). */
export async function saveAnswers(
  assessmentId: string,
  entries: Array<{ questionId: string; value: AnswerValue }>,
) {
  const user = await requireUser(auth);
  await assertOwnedAssessment(assessmentId, user.id);

  for (const entry of entries) {
    await db
      .insert(schema.answers)
      .values({
        assessmentId,
        questionId: entry.questionId,
        value: entry.value,
      })
      .onConflictDoUpdate({
        target: [schema.answers.assessmentId, schema.answers.questionId],
        set: { value: entry.value, updatedAt: new Date() },
      });
  }

  await db
    .update(schema.assessments)
    .set({ updatedAt: new Date() })
    .where(eq(schema.assessments.id, assessmentId));

  return { ok: true };
}

/**
 * Run the Decision Intelligence Framework over the saved answers and persist
 * the overall score, category scores, risks and recommendations. Marks the
 * assessment completed.
 */
export async function submitAssessment(assessmentId: string) {
  const user = await requireUser(auth);
  const assessment = await assertOwnedAssessment(assessmentId, user.id);

  // Load the template's questions (with category key) and all categories.
  const sections = await db.query.sections.findMany({
    where: eq(schema.sections.templateId, assessment.templateId),
    with: {
      questions: { with: { category: { columns: { key: true } } } },
    },
  });
  const questionRows = sections.flatMap((s) => s.questions);
  const categoryRows = await db.query.categories.findMany();
  const answerRows = await db.query.answers.findMany({
    where: eq(schema.answers.assessmentId, assessmentId),
  });

  // Build engine inputs.
  const keyByQuestionId = new Map(questionRows.map((q) => [q.id, q.key]));
  const answers: AnswerMap = {};
  for (const a of answerRows) {
    const key = keyByQuestionId.get(a.questionId);
    if (key && a.value) answers[key] = a.value;
  }

  const questions: EngineQuestion[] = questionRows.map((q) => ({
    key: q.key,
    categoryKey: q.category?.key ?? null,
    type: q.type,
    label: q.label,
    scoring: q.scoring,
    conditionalLogic: q.conditionalLogic,
  }));

  const categories: EngineCategory[] = categoryRows.map((c) => ({
    key: c.key,
    label: c.label,
    weight: c.weight,
    thresholds: c.thresholds,
  }));

  const result = runAssessment({ questions, categories, answers });

  const idByCategoryKey = new Map(categoryRows.map((c) => [c.key, c.id]));

  // Persist: replace any prior derived rows, then write the fresh results.
  await db
    .delete(schema.categoryScores)
    .where(eq(schema.categoryScores.assessmentId, assessmentId));
  await db.delete(schema.risks).where(eq(schema.risks.assessmentId, assessmentId));
  await db
    .delete(schema.recommendations)
    .where(eq(schema.recommendations.assessmentId, assessmentId));

  if (result.categories.length) {
    await db.insert(schema.categoryScores).values(
      result.categories.map((c) => ({
        assessmentId,
        categoryId: idByCategoryKey.get(c.key)!,
        score: c.score,
        status: c.status,
      })),
    );
  }

  if (result.risks.length) {
    await db.insert(schema.risks).values(
      result.risks.map((r, i) => ({
        assessmentId,
        categoryId: r.categoryKey ? idByCategoryKey.get(r.categoryKey) : null,
        title: r.title,
        detail: r.detail,
        severity: r.severity,
        displayOrder: i,
      })),
    );
  }

  if (result.recommendations.length) {
    await db.insert(schema.recommendations).values(
      result.recommendations.map((r) => ({
        assessmentId,
        categoryId: r.categoryKey ? idByCategoryKey.get(r.categoryKey) : null,
        title: r.title,
        why: r.why,
        estimatedImpact: r.estimatedImpact,
        difficulty: r.difficulty,
        timeToComplete: r.timeToComplete,
        priority: r.priority,
      })),
    );
  }

  await db
    .update(schema.assessments)
    .set({
      status: "completed",
      overallScore: result.overallScore,
      readinessStatus: result.readinessStatus,
      submittedAt: new Date(),
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(schema.assessments.id, assessmentId));

  revalidatePath("/dashboard");
  return { ok: true, score: result.overallScore };
}

/** Presign a direct browser → R2 upload for an evidence (file) question. */
export async function createUploadUrl(
  assessmentId: string,
  fileName: string,
  contentType: string,
) {
  const user = await requireUser(auth);
  await assertOwnedAssessment(assessmentId, user.id);
  const key = buildDocumentKey({ userId: user.id, assessmentId, fileName });
  const url = await getUploadUrl(key, contentType);
  return { url, key };
}

/** Record an uploaded object as a document and return its id. */
export async function confirmUpload(input: {
  assessmentId: string;
  questionId: string;
  key: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}) {
  const user = await requireUser(auth);
  await assertOwnedAssessment(input.assessmentId, user.id);
  const [doc] = await db
    .insert(schema.documents)
    .values({
      userId: user.id,
      assessmentId: input.assessmentId,
      questionId: input.questionId,
      key: input.key,
      fileName: input.fileName,
      contentType: input.contentType,
      sizeBytes: input.sizeBytes,
    })
    .returning({ id: schema.documents.id });
  return { id: doc!.id };
}
