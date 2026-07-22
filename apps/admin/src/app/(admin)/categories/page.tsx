import { Badge } from "@capita/ui";
import { listCategories } from "@/lib/queries";
import { Table, THead, TH, TRow, TD, EmptyRow } from "@/components/data-table";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const categories = await listCategories();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          Scoring categories
        </h1>
        <p className="text-sm text-muted-foreground">
          The dimensions the Decision Intelligence Framework scores against.
          Weights control each category&apos;s contribution to the overall
          score.
        </p>
      </div>

      <Table>
        <THead>
          <tr>
            <TH>Category</TH>
            <TH>Key</TH>
            <TH>Weight</TH>
            <TH>Thresholds (crit / att / track)</TH>
          </tr>
        </THead>
        <tbody>
          {categories.length === 0 ? (
            <EmptyRow colSpan={4} label="No categories yet. Run the seed." />
          ) : (
            categories.map((c) => (
              <TRow key={c.id}>
                <TD>
                  <span className="font-medium">{c.label}</span>
                  {c.description ? (
                    <p className="text-xs text-muted-foreground">
                      {c.description}
                    </p>
                  ) : null}
                </TD>
                <TD>
                  <code className="text-xs text-muted-foreground">{c.key}</code>
                </TD>
                <TD className="tabular">
                  <Badge variant="brand">×{c.weight.toFixed(1)}</Badge>
                </TD>
                <TD className="tabular text-muted-foreground">
                  {c.thresholds
                    ? `${c.thresholds.critical} / ${c.thresholds.attention} / ${c.thresholds.onTrack}`
                    : "—"}
                </TD>
              </TRow>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
