import type { AnalysisInput } from "./types";

/** Assemble the system + user messages for the analysis call. */
export function buildMessages(input: AnalysisInput): {
  system: string;
  user: string;
} {
  const { config, overallScore, readinessStatus, categories, answers } = input;

  const rubric =
    config.rubric?.trim() ||
    "You are a UK SME capital-readiness analyst. Assess the business the way a commercial lender or investor would, and be specific, practical and honest.";

  const rulesBlock =
    config.rules.length > 0
      ? config.rules
          .map((r, i) => `${i + 1}. IF ${r.condition} THEN ${r.effect}`)
          .join("\n")
      : "No additional structured rules.";

  const sectionsBlock =
    config.outputSections.length > 0
      ? config.outputSections
          .map((s) => `- ${s.key} ("${s.title}"): ${s.guidance}`)
          .join("\n")
      : "No custom sections.";

  const system = [
    rubric,
    "",
    "You are given the answers to a capital-readiness assessment and the deterministic scores already computed by a rules engine. Do NOT recompute or contradict the numeric scores; explain and build on them.",
    "",
    "Apply these assessment rules:",
    rulesBlock,
    "",
    "Produce the following custom narrative sections (use the exact key):",
    sectionsBlock,
    "",
    "Write in clear British English. Be concrete and reference the business's actual answers. Avoid hedging and boilerplate. Never invent facts that aren't supported by the answers.",
  ].join("\n");

  const categoryLines = categories
    .map(
      (c) =>
        `- ${c.label} (${c.key}): ${Math.round(c.score)}/100 [${c.status}]`,
    )
    .join("\n");

  const answerLines = answers
    .map((a) => `- [${a.section}] ${a.label}: ${a.value}`)
    .join("\n");

  const user = [
    `OVERALL READINESS: ${Math.round(overallScore)}/100 (${readinessStatus})`,
    "",
    "CATEGORY SCORES (from the engine — treat as fixed):",
    categoryLines,
    "",
    "ASSESSMENT ANSWERS:",
    answerLines,
    "",
    "Now produce the structured analysis: an executive summary, a rationale per category, the key risks, prioritised recommendations, and each configured narrative section.",
  ].join("\n");

  return { system, user };
}
