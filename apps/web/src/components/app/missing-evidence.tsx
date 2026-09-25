import { FileX2, FileCheck2 } from "lucide-react";
import { Card } from "@sadora/ui";

/** Evidence gaps a lender would expect you to provide. */
export function MissingEvidence({ items }: { items: string[] }) {
  if (items.length === 0) {
    return (
      <Card className="flex items-center gap-3 p-5 text-sm">
        <FileCheck2 className="size-5 shrink-0 text-success" />
        <span>Your core evidence is in place. Nothing outstanding.</span>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">
        Lenders will expect to see these. Add them to strengthen your file:
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((label) => (
          <li key={label} className="flex items-center gap-2.5 text-sm">
            <FileX2 className="size-4 shrink-0 text-warning" />
            {label}
          </li>
        ))}
      </ul>
    </Card>
  );
}
