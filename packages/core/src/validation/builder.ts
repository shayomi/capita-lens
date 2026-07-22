import { z } from "zod";

// ── Admin questionnaire-builder schemas ──────────────────────────────

export const questionTypeSchema = z.enum([
  "short_text",
  "long_text",
  "number",
  "currency",
  "percent",
  "boolean",
  "single_select",
  "multi_select",
  "date",
  "file",
]);

export const questionOptionSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

export const questionScoringSchema = z.object({
  weight: z.number().min(0).max(10),
  points: z.record(z.string(), z.number()).optional(),
  numericBands: z
    .array(z.object({ upTo: z.number().nullable(), score: z.number() }))
    .optional(),
  presentScore: z.number().optional(),
  missingScore: z.number().optional(),
});

export const conditionalLogicSchema = z.object({
  mode: z.enum(["all", "any"]),
  conditions: z.array(
    z.object({
      questionKey: z.string(),
      operator: z.enum([
        "eq",
        "neq",
        "gt",
        "gte",
        "lt",
        "lte",
        "in",
        "not_in",
        "answered",
      ]),
      value: z
        .union([z.string(), z.number(), z.boolean(), z.array(z.string())])
        .optional(),
    }),
  ),
});

export const upsertQuestionSchema = z.object({
  id: z.string().uuid().optional(),
  sectionId: z.string().uuid(),
  categoryId: z.string().uuid().nullable().optional(),
  key: z.string().min(1).regex(/^[a-z0-9_]+$/, "lowercase, digits, underscores"),
  label: z.string().min(1),
  helpText: z.string().optional(),
  placeholder: z.string().optional(),
  type: questionTypeSchema,
  options: z.array(questionOptionSchema).optional(),
  required: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  conditionalLogic: conditionalLogicSchema.nullable().optional(),
  scoring: questionScoringSchema.nullable().optional(),
});

export const upsertSectionSchema = z.object({
  id: z.string().uuid().optional(),
  templateId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  intro: z.string().optional(),
  displayOrder: z.number().int().default(0),
});

export const upsertTemplateSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  description: z.string().optional(),
  estimatedMinutes: z.number().int().positive().default(18),
});

export const reorderSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export type UpsertQuestionInput = z.infer<typeof upsertQuestionSchema>;
export type UpsertSectionInput = z.infer<typeof upsertSectionSchema>;
export type UpsertTemplateInput = z.infer<typeof upsertTemplateSchema>;
