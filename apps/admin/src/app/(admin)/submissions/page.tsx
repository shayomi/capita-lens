import Link from "next/link";
import { Badge } from "@sadora/ui";
import { listSubmissions } from "@/lib/queries";
import { Table, THead, TH, TRow, TD, EmptyRow } from "@/components/data-table";

export const metadata = { title: "Submissions" };

const STATUS_VARIANT = {
  in_progress: "warning",
  submitted: "info",
  analysing: "info",
  completed: "success",
} as const;

const STATUS_LABEL: Record<string, string> = {
  in_progress: "In progress",
  submitted: "Submitted",
  analysing: "Analysing",
  completed: "Completed",
};

export default async function SubmissionsPage() {
  const submissions = await listSubmissions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Submissions</h1>
        <p className="text-sm text-muted-foreground">
          Every assessment run across the platform. Select a row to view the
          full response.
        </p>
      </div>

      <Table>
        <THead>
          <tr>
            <TH>User</TH>
            <TH>Template</TH>
            <TH>Status</TH>
            <TH>Score</TH>
            <TH>Submitted</TH>
          </tr>
        </THead>
        <tbody>
          {submissions.length === 0 ? (
            <EmptyRow colSpan={5} label="No submissions yet." />
          ) : (
            submissions.map((s) => (
              <TRow key={s.id} className="cursor-pointer">
                <TD className="font-medium">
                  <Link
                    href={`/submissions/${s.id}`}
                    className="hover:text-brand"
                  >
                    {s.user?.displayName ?? s.user?.email ?? "—"}
                  </Link>
                </TD>
                <TD className="text-muted-foreground">{s.template?.name}</TD>
                <TD>
                  <Badge variant={STATUS_VARIANT[s.status]}>
                    {STATUS_LABEL[s.status] ?? s.status}
                  </Badge>
                </TD>
                <TD className="tabular">
                  {s.overallScore != null ? Math.round(s.overallScore) : "—"}
                </TD>
                <TD className="text-muted-foreground">
                  {s.submittedAt
                    ? new Date(s.submittedAt).toLocaleDateString("en-GB")
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
