import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db, schema, eq, type AnalysisConfig } from "@sadora/db";
import { AnalysisStudio } from "@/components/analysis-studio";

export const metadata = { title: "Analysis Studio" };

const DEFAULT_CONFIG: AnalysisConfig = {
  enabled: false,
  model: "gpt-4o",
  temperature: 0.4,
  rubric: "",
  rules: [],
  outputSections: [],
};

export default async function AnalysisStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = await db.query.templates.findFirst({
    where: eq(schema.templates.id, id),
    columns: { id: true, name: true, analysisConfig: true },
  });
  if (!template) notFound();

  const config = template.analysisConfig ?? DEFAULT_CONFIG;

  return (
    <div className="space-y-6">
      <Link
        href={`/templates/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {template.name}
      </Link>

      <div>
        <h1 className="font-display text-2xl font-semibold">Analysis Studio</h1>
        <p className="text-sm text-muted-foreground">
          Configure how the AI analyses submissions for this template.
        </p>
      </div>

      <AnalysisStudio templateId={id} initial={config} />
    </div>
  );
}
