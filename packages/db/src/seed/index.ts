import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import * as schema from "../schema";
import { seedCategories } from "./categories";
import { capitalReadinessV1 } from "./template-v1";

// Idempotent seed: categories + the default published template.
config({ path: "../../.env" });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  const sql = neon(connectionString);
  const db = drizzle(sql, { schema });

  console.log("→ Seeding categories…");
  const categoryIdByKey = new Map<string, string>();
  for (const c of seedCategories) {
    const [row] = await db
      .insert(schema.categories)
      .values(c)
      .onConflictDoUpdate({
        target: schema.categories.key,
        set: {
          label: c.label,
          description: c.description,
          weight: c.weight,
          thresholds: c.thresholds,
          displayOrder: c.displayOrder,
        },
      })
      .returning({ id: schema.categories.id, key: schema.categories.key });
    categoryIdByKey.set(row!.key, row!.id);
  }

  const t = capitalReadinessV1;
  console.log(`→ Seeding template "${t.name}"…`);

  // Replace any existing default template with this slug for a clean seed.
  const existing = await db.query.templates.findFirst({
    where: eq(schema.templates.slug, t.slug),
  });
  if (existing) {
    await db.delete(schema.templates).where(eq(schema.templates.id, existing.id));
  }

  const [tpl] = await db
    .insert(schema.templates)
    .values({
      slug: t.slug,
      name: t.name,
      description: t.description,
      estimatedMinutes: t.estimatedMinutes,
      status: "published",
      isDefault: true,
      version: 1,
      publishedAt: new Date(),
    })
    .returning({ id: schema.templates.id });

  for (const [sIdx, section] of t.sections.entries()) {
    const [sec] = await db
      .insert(schema.sections)
      .values({
        templateId: tpl!.id,
        title: section.title,
        description: section.description,
        intro: section.intro,
        displayOrder: sIdx,
      })
      .returning({ id: schema.sections.id });

    const questionRows = section.questions.map((q, qIdx) => ({
      sectionId: sec!.id,
      categoryId: q.categoryKey ? categoryIdByKey.get(q.categoryKey) : undefined,
      key: q.key,
      label: q.label,
      helpText: q.helpText,
      placeholder: q.placeholder,
      type: q.type,
      options: q.options,
      required: q.required ?? false,
      displayOrder: qIdx,
      conditionalLogic: q.conditionalLogic,
      responseFeedback: q.responseFeedback,
      scoring: q.scoring,
    }));
    if (questionRows.length) {
      await db.insert(schema.questions).values(questionRows);
    }
  }

  console.log("✓ Seed complete");
}

main().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exit(1);
});
