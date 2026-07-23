import { Card, Progress, Badge } from "@capita/ui";
import { LENDER_CONTEXT } from "@/lib/lender-context";

type StatusMeta = {
  label: string;
  variant: "success" | "info" | "warning" | "danger";
  bar: string;
};

const DEFAULT_META: StatusMeta = {
  label: "On track",
  variant: "info",
  bar: "bg-info",
};

const STATUS_META: Record<string, StatusMeta> = {
  excellent: { label: "Excellent", variant: "success", bar: "bg-success" },
  on_track: DEFAULT_META,
  attention: { label: "Attention", variant: "warning", bar: "bg-warning" },
  critical: { label: "Critical", variant: "danger", bar: "bg-danger" },
};

export function CategoryGrid({
  categories,
}: {
  categories: Array<{
    key: string;
    label: string;
    score: number;
    status: string;
    rationale?: string | null;
  }>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {categories.map((c) => {
        const meta = STATUS_META[c.status] ?? DEFAULT_META;
        return (
          <Card key={c.key} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{c.label}</span>
              <Badge variant={meta.variant}>{meta.label}</Badge>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="tabular font-display text-2xl font-semibold">
                {Math.round(c.score)}
              </span>
              <Progress
                value={c.score}
                indicatorClassName={meta.bar}
                className="flex-1"
              />
            </div>
            {LENDER_CONTEXT[c.key] ? (
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground/70">
                  Why lenders care:
                </span>{" "}
                {LENDER_CONTEXT[c.key]}
              </p>
            ) : null}
            {c.rationale ? (
              <p className="mt-2 border-l-2 border-brand/40 pl-3 text-xs leading-relaxed text-muted-foreground">
                {c.rationale}
              </p>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}
