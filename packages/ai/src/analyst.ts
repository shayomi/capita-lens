import { z } from "zod";
import { getOpenAI, DEFAULT_MODEL } from "./client";
import { buildResponseSchema } from "./schema";
import { buildMessages } from "./prompt";
import type { AnalysisInput, AiResult } from "./types";

/** Thrown when the AI layer can't run; the caller should fall back to the engine. */
export class AiUnavailableError extends Error {}

const resultSchema = z.object({
  summary: z.string(),
  categoryAnalysis: z.array(
    z.object({ categoryKey: z.string(), rationale: z.string() }),
  ),
  risks: z.array(
    z.object({
      title: z.string(),
      detail: z.string(),
      severity: z.enum(["low", "medium", "high"]),
      categoryKey: z.string().nullable(),
    }),
  ),
  recommendations: z.array(
    z.object({
      title: z.string(),
      why: z.string(),
      difficulty: z.enum(["easy", "moderate", "hard"]),
      timeToComplete: z.string(),
      categoryKey: z.string().nullable(),
    }),
  ),
  sections: z.array(
    z.object({ key: z.string(), title: z.string(), body: z.string() }),
  ),
});

/**
 * Run the OpenAI analyst with structured outputs. The engine has already
 * produced the scores (hybrid mode); the AI adds the narrative, risks,
 * recommendations and configured sections. Throws AiUnavailableError when the
 * key/config is missing so the caller can fall back to the deterministic path.
 */
export async function runAiAnalysis(
  input: AnalysisInput,
): Promise<AiResult & { model: string }> {
  if (!input.config?.enabled) {
    throw new AiUnavailableError("AI analysis disabled for this template");
  }
  const openai = getOpenAI();
  if (!openai) throw new AiUnavailableError("OPENAI_API_KEY not set");

  const categoryKeys = input.categories.map((c) => c.key);
  const schema = buildResponseSchema(input.config, categoryKeys);
  const { system, user } = buildMessages(input);
  const model = input.config.model?.trim() || DEFAULT_MODEL;

  const completion = await openai.chat.completions.create({
    model,
    temperature: input.config.temperature ?? 0.4,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "capital_readiness_analysis", schema, strict: true },
    },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new AiUnavailableError("Empty AI response");

  const parsed = resultSchema.parse(JSON.parse(content));
  return { ...parsed, model };
}
