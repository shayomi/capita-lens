import type { AnswerValue, QuestionOption } from "@sadora/db";

/** Render a stored answer as human-readable text for the AI prompt / snapshot. */
export function formatAnswer(
  value: AnswerValue | undefined,
  type: string,
  options?: QuestionOption[] | null,
): string {
  if (!value) return "—";
  const labelFor = (v: string) =>
    options?.find((o) => o.value === v)?.label ?? v;

  switch (value.kind) {
    case "text":
      return value.value || "—";
    case "number":
      if (type === "currency") return `£${value.value.toLocaleString("en-GB")}`;
      if (type === "percent") return `${value.value}%`;
      return String(value.value);
    case "boolean":
      return value.value ? "Yes" : "No";
    case "single":
      return labelFor(value.value);
    case "multi":
      return value.value.length ? value.value.map(labelFor).join(", ") : "None";
    case "date":
      return value.value;
    case "file":
      return value.documentIds.length
        ? `${value.documentIds.length} file(s) provided`
        : "Not provided";
  }
}
