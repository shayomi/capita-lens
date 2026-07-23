"use server";

import { z } from "zod";
import { db, schema } from "@capita/db";

const schemaInput = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

/** Public: capture a marketing waitlist signup. Idempotent on email. */
export async function joinWaitlist(input: { email: string; source?: string }) {
  const parsed = schemaInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Please enter a valid email address." };
  }

  await db
    .insert(schema.waitlist)
    .values({
      email: parsed.data.email.toLowerCase(),
      source: parsed.data.source ?? "landing",
    })
    .onConflictDoNothing({ target: schema.waitlist.email });

  return { ok: true as const };
}
