import { Card } from "@capita/ui";
import type { AnalysisSectionResult } from "@capita/db";

/** Renders the AI's custom narrative sections (Executive Summary, etc.). */
export function AnalysisSections({
  sections,
}: {
  sections: AnalysisSectionResult[] | null;
}) {
  if (!sections || sections.length === 0) return null;
  return (
    <div className="space-y-4">
      {sections.map((s) => (
        <Card key={s.key} className="p-6">
          <h3 className="font-display text-base font-semibold">{s.title}</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {s.body}
          </p>
        </Card>
      ))}
    </div>
  );
}
