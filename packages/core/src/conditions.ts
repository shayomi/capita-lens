import type { AnswerMap, ConditionalLogic } from "./types";
import type { Condition } from "@capita/db";

/** Extract a comparable primitive/array from a stored answer value. */
function rawValue(map: AnswerMap, key: string): unknown {
  const a = map[key];
  if (!a) return undefined;
  switch (a.kind) {
    case "text":
    case "single":
    case "date":
      return a.value;
    case "number":
      return a.value;
    case "boolean":
      return a.value;
    case "multi":
      return a.value;
    case "file":
      return a.documentIds.length > 0 ? a.documentIds : undefined;
  }
}

function evaluateCondition(c: Condition, map: AnswerMap): boolean {
  let actual = rawValue(map, c.questionKey);
  const expected = c.value;

  // Tolerate boolean answers authored against "yes"/"no" (or "true"/"false")
  // strings, so admin-written logic works regardless of representation.
  if (typeof actual === "boolean" && typeof expected === "string") {
    actual = actual ? "yes" : "no";
  }

  switch (c.operator) {
    case "answered":
      return actual !== undefined && actual !== "" ;
    case "eq":
      return actual === expected;
    case "neq":
      return actual !== expected;
    case "gt":
      return typeof actual === "number" && typeof expected === "number" && actual > expected;
    case "gte":
      return typeof actual === "number" && typeof expected === "number" && actual >= expected;
    case "lt":
      return typeof actual === "number" && typeof expected === "number" && actual < expected;
    case "lte":
      return typeof actual === "number" && typeof expected === "number" && actual <= expected;
    case "in":
      return Array.isArray(expected) && expected.includes(actual as string);
    case "not_in":
      return Array.isArray(expected) && !expected.includes(actual as string);
    default:
      return true;
  }
}

/**
 * Decide whether a question should be shown/scored given current answers.
 * Questions with no logic are always visible.
 */
export function isVisible(
  logic: ConditionalLogic | null | undefined,
  map: AnswerMap,
): boolean {
  if (!logic || logic.conditions.length === 0) return true;
  const results = logic.conditions.map((c) => evaluateCondition(c, map));
  return logic.mode === "all" ? results.every(Boolean) : results.some(Boolean);
}
