import { z } from "zod";

/** Validated shape of a stored answer value (mirrors db AnswerValue union). */
export const answerValueSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("text"), value: z.string() }),
  z.object({ kind: z.literal("number"), value: z.number() }),
  z.object({ kind: z.literal("boolean"), value: z.boolean() }),
  z.object({ kind: z.literal("single"), value: z.string() }),
  z.object({ kind: z.literal("multi"), value: z.array(z.string()) }),
  z.object({ kind: z.literal("date"), value: z.string() }),
  z.object({ kind: z.literal("file"), documentIds: z.array(z.string()) }),
]);

/** Payload to save/update a single answer within an assessment. */
export const saveAnswerSchema = z.object({
  assessmentId: z.string().uuid(),
  questionId: z.string().uuid(),
  value: answerValueSchema,
});

export type SaveAnswerInput = z.infer<typeof saveAnswerSchema>;
