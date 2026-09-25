"use server";

import { revalidatePath } from "next/cache";
import { db, schema, eq } from "@sadora/db";
import { requireAdmin } from "@sadora/auth";
import { analysisConfigSchema } from "@sadora/core";
import { auth } from "@/lib/auth/server";

/** Save a template's AI analysis configuration. */
export async function saveAnalysisConfig(templateId: string, config: unknown) {
  await requireAdmin(auth);
  const parsed = analysisConfigSchema.parse(config);

  await db
    .update(schema.templates)
    .set({ analysisConfig: parsed, updatedAt: new Date() })
    .where(eq(schema.templates.id, templateId));

  revalidatePath(`/templates/${templateId}/analysis`);
  return { ok: true };
}
