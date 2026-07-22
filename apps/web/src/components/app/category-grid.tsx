import { Card, Progress, Badge } from "@capita/ui";

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
  categories: Array<{ key: string; label: string; score: number; status: string }>;
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
          </Card>
        );
      })}
    </div>
  );
}
