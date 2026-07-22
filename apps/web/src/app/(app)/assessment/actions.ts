"use server";

import { revalidatePath } from "next/cache";
import {
  db,
  schema,
  eq,
  and,
  type AnswerValue,
  type QuestionOption,
} from "@capita/db";
import { requireUser } from "@capita/auth";
import {
  runAssessment,
  type EngineQuestion,
  type EngineCategory,
  type AnswerMap,
} from "@capita/core";
import {
  runAiAnalysis,
  AiUnavailableError,
  type AnalysisSectionResult,
} from "@capita/ai";
import { buildDocumentKey, getUploadUrl } from "@capita/storage";
import { auth } from "@/lib/auth/server";
import { formatAnswer } from "@/lib/format-answer";

type AiSection = AnalysisSectionResult;
type TemplateQuestionMeta = { type: string; options: QuestionOption[] | null };

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

  // Deterministic scores (always).
  const result = runAssessment({ questions, categories, answers });
  const idByCategoryKey = new Map(categoryRows.map((c) => [c.key, c.id]));

  // AI analysis layer (hybrid): the engine owns the numbers, the model writes
  // the narrative. Falls back to the engine's risks/recommendations if the AI
  // is unavailable (no key, disabled, or an error).
  const template = await db.query.templates.findFirst({
    where: eq(schema.templates.id, assessment.templateId),
    columns: { analysisConfig: true },
  });

  const descByKey = new Map(categoryRows.map((c) => [c.key, c.description]));
  const sectionTitleByQ = new Map<string, string>();
  const optionsByQ = new Map<string, TemplateQuestionMeta>();
  for (const s of sections)
    for (const q of s.questions) {
      sectionTitleByQ.set(q.id, s.title);
      optionsByQ.set(q.id, { type: q.type, options: q.options });
    }

  const analysisAnswers = answerRows
    .filter((a) => a.value)
    .map((a) => {
      const meta = optionsByQ.get(a.questionId);
      const q = questionRows.find((x) => x.id === a.questionId);
      return {
        section: sectionTitleByQ.get(a.questionId) ?? "",
        label: q?.label ?? "",
        value: formatAnswer(a.value!, meta?.type ?? "short_text", meta?.options),
      };
    });

  let summary: string | null = null;
  let analysisSections: AiSection[] | null = null;
  let aiModel: string | null = null;
  const rationaleByCat = new Map<string, string>();
  let risksToWrite = result.risks.map((r, i) => ({
    categoryKey: r.categoryKey ?? null,
    title: r.title,
    detail: r.detail ?? null,
    severity: r.severity,
    displayOrder: i,
  }));
  let recsToWrite = result.recommendations.map((r) => ({
    categoryKey: r.categoryKey ?? null,
    title: r.title,
    why: r.why,
    estimatedImpact: r.estimatedImpact as number | null,
    difficulty: r.difficulty,
    timeToComplete: r.timeToComplete,
    priority: r.priority,
  }));

  if (template?.analysisConfig?.enabled) {
    try {
      const ai = await runAiAnalysis({
        config: template.analysisConfig,
        overallScore: result.overallScore,
        readinessStatus: result.readinessStatus,
        categories: result.categories.map((c) => ({
          ...c,
          description: descByKey.get(c.key) ?? null,
        })),
        answers: analysisAnswers,
      });
      summary = ai.summary;
      analysisSections = ai.sections;
      aiModel = ai.model;
      for (const ca of ai.categoryAnalysis)
        rationaleByCat.set(ca.categoryKey, ca.rationale);
      risksToWrite = ai.risks.map((r, i) => ({
        categoryKey: r.categoryKey,
        title: r.title,
        detail: r.detail,
        severity: r.severity,
        displayOrder: i,
      }));
      recsToWrite = ai.recommendations.map((r, i) => ({
        categoryKey: r.categoryKey,
        title: r.title,
        why: r.why,
        estimatedImpact: null,
        difficulty: r.difficulty,
        timeToComplete: r.timeToComplete,
        priority: i + 1,
      }));
    } catch (err) {
      if (!(err instanceof AiUnavailableError)) {
        console.error("AI analysis failed, using engine fallback:", err);
      }
    }
  }

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
        rationale: rationaleByCat.get(c.key) ?? null,
      })),
    );
  }

  if (risksToWrite.length) {
    await db.insert(schema.risks).values(
      risksToWrite.map((r) => ({
        assessmentId,
        categoryId: r.categoryKey ? idByCategoryKey.get(r.categoryKey) : null,
        title: r.title,
        detail: r.detail,
        severity: r.severity,
        displayOrder: r.displayOrder,
      })),
    );
  }

  if (recsToWrite.length) {
    await db.insert(schema.recommendations).values(
      recsToWrite.map((r) => ({
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
      summary,
      analysisSections,
      aiModel,
      aiGeneratedAt: summary ? new Date() : null,
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
