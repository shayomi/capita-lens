import Link from "next/link";
import { Plus } from "lucide-react";
import { Button, Badge } from "@capita/ui";
import { listTemplates } from "@/lib/queries";
import { Table, THead, TH, TRow, TD, EmptyRow } from "@/components/data-table";

export const metadata = { title: "Templates" };

const STATUS_VARIANT = {
  draft: "warning",
  published: "success",
  archived: "default",
} as const;

export default async function TemplatesPage() {
  const templates = await listTemplates();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            Questionnaire templates
          </h1>
          <p className="text-sm text-muted-foreground">
            Build and publish the assessments users complete.
          </p>
        </div>
        <Button disabled>
          <Plus className="size-4" />
          New template
        </Button>
      </div>

      <Table>
        <THead>
          <tr>
            <TH>Name</TH>
            <TH>Status</TH>
            <TH>Version</TH>
            <TH>Sections</TH>
            <TH>Updated</TH>
          </tr>
        </THead>
        <tbody>
          {templates.length === 0 ? (
            <EmptyRow colSpan={5} label="No templates yet. Run the seed to create Capital Readiness v1." />
          ) : (
            templates.map((t) => (
              <TRow key={t.id}>
                <TD>
                  <Link
                    href={`/templates/${t.id}`}
                    className="font-medium hover:underline"
                  >
                    {t.name}
                  </Link>
                  {t.isDefault ? (
                    <Badge variant="brand" className="ml-2">
                      Default
                    </Badge>
                  ) : null}
                </TD>
                <TD>
                  <Badge variant={STATUS_VARIANT[t.status]}>{t.status}</Badge>
                </TD>
                <TD className="tabular text-muted-foreground">v{t.version}</TD>
                <TD className="tabular text-muted-foreground">
                  {t.sections.length}
                </TD>
                <TD className="text-muted-foreground">
                  {new Date(t.updatedAt).toLocaleDateString("en-GB")}
                </TD>
              </TRow>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
