import { nanoid } from "nanoid";

/** Sanitise a filename for safe object keys while keeping the extension. */
export function sanitiseFileName(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
  return cleaned.slice(0, 120) || "file";
}

/**
 * Build a namespaced object key. Evidence is scoped per user (and assessment
 * when known) so listing and cleanup stay simple.
 */
export function buildDocumentKey(params: {
  userId: string;
  assessmentId?: string;
  fileName: string;
}): string {
  const scope = params.assessmentId
    ? `assessments/${params.assessmentId}`
    : "uploads";
  return `users/${params.userId}/${scope}/${nanoid(12)}-${sanitiseFileName(params.fileName)}`;
}
