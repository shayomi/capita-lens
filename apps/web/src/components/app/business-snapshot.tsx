import { Card } from "@capita/ui";
import type { SnapshotItem } from "@/lib/queries/dashboard";

/** "Your business" panel built from the profile answers. */
export function BusinessSnapshot({ items }: { items: SnapshotItem[] }) {
  if (items.length === 0) return null;
  return (
    <Card className="p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Your business
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="min-w-0">
            <dt className="text-2xs uppercase tracking-wide text-muted-foreground">
              {it.label}
            </dt>
            <dd className="mt-0.5 truncate text-sm font-medium">{it.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
