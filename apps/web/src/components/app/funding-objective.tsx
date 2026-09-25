import { Target } from "lucide-react";
import { Card } from "@sadora/ui";
import type { FundingObjective } from "@/lib/queries/dashboard";

/** "What you're pursuing" banner that frames the dashboard around the goal. */
export function FundingObjectiveBanner({
  objective,
}: {
  objective: FundingObjective;
}) {
  if (!objective.type && !objective.amount) return null;

  const parts = [objective.amount, objective.type].filter(Boolean).join(" ");

  return (
    <Card className="flex items-center gap-4 border-brand/30 bg-brand-muted/40 p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground">
        <Target className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-2xs uppercase tracking-wide text-brand">
          You&apos;re preparing for
        </p>
        <p className="mt-0.5 font-display text-lg font-semibold">
          {parts || "External funding"}
          {objective.timing ? (
            <span className="font-normal text-muted-foreground">
              {" "}
              · needed {objective.timing.toLowerCase()}
            </span>
          ) : null}
        </p>
        {objective.purpose ? (
          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
            {objective.purpose}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
