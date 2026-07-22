import type { AnalysisConfig } from "@capita/db";

/**
 * Build a strict JSON Schema for OpenAI structured outputs from the admin's
 * output configuration. Section keys are constrained to the configured set so
 * the model can only emit sections the dashboard knows how to render.
 */
export function buildResponseSchema(
  config: AnalysisConfig,
  categoryKeys: string[],
) {
  const sectionKeys = config.outputSections.map((s) => s.key);

  return {
    type: "object",
    additionalProperties: false,
    required: [
      "summary",
      "categoryAnalysis",
      "risks",
      "recommendations",
      "sections",
    ],
    properties: {
      summary: {
        type: "string",
        description: "A concise executive overview of capital readiness.",
      },
      categoryAnalysis: {
        type: "array",
        description: "One rationale per scoring category.",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["categoryKey", "rationale"],
          properties: {
            categoryKey: { type: "string", enum: categoryKeys },
            rationale: { type: "string" },
          },
        },
      },
      risks: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "detail", "severity", "categoryKey"],
          properties: {
            title: { type: "string" },
            detail: { type: "string" },
            severity: { type: "string", enum: ["low", "medium", "high"] },
            categoryKey: { type: ["string", "null"] },
          },
        },
      },
      recommendations: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "title",
            "why",
            "difficulty",
            "timeToComplete",
            "categoryKey",
          ],
          properties: {
            title: { type: "string" },
            why: { type: "string" },
            difficulty: {
              type: "string",
              enum: ["easy", "moderate", "hard"],
            },
            timeToComplete: { type: "string" },
            categoryKey: { type: ["string", "null"] },
          },
        },
      },
      sections: {
        type: "array",
        description:
          "One entry per configured output section, using the exact key.",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["key", "title", "body"],
          properties: {
            key:
              sectionKeys.length > 0
                ? { type: "string", enum: sectionKeys }
                : { type: "string" },
            title: { type: "string" },
            body: { type: "string" },
          },
        },
      },
    },
  } as const;
}
