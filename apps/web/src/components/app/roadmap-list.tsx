import { Card, Badge } from "@capita/ui";
import type { schema } from "@capita/db";

const DIFF_VARIANT = {
  easy: "success",
  moderate: "warning",
  hard: "danger",
} as const;

export function RoadmapList({
  recommendations,
}: {
  recommendations: (typeof schema.recommendations.$inferSelect)[];
}) {
  if (recommendations.length === 0) {
    return (
      <Card className="p-6 text-sm text-muted-foreground">
        No outstanding actions, you&apos;re in great shape.
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {recommendations.map((r) => (
        <Card key={r.id} className="flex items-start gap-4 p-4">
          <span className="tabular mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
            {r.priority}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{r.title}</p>
            {r.why ? (
              <p className="mt-1 text-xs text-muted-foreground">{r.why}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant={DIFF_VARIANT[r.difficulty]}>{r.difficulty}</Badge>
              {r.timeToComplete ? (
                <span className="text-2xs text-muted-foreground">
                  {r.timeToComplete}
                </span>
              ) : null}
              {r.estimatedImpact ? (
                <span className="text-2xs text-brand">
                  +{r.estimatedImpact} readiness
                </span>
              ) : null}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
