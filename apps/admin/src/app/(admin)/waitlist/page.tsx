import { Badge } from "@capita/ui";
import { listWaitlist } from "@/lib/queries";
import { Table, THead, TH, TRow, TD, EmptyRow } from "@/components/data-table";
import { ExportCsv } from "@/components/export-csv";

export const metadata = { title: "Waitlist" };

export default async function WaitlistPage() {
  const entries = await listWaitlist();

  const csvRows = entries.map((e) => ({
    email: e.email,
    name: e.name ?? "",
    businessName: e.businessName ?? "",
    source: e.source ?? "",
    createdAt: new Date(e.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Waitlist</h1>
          <p className="text-sm text-muted-foreground">
            People who signed up for early access from the landing page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="brand">{entries.length} signups</Badge>
          <ExportCsv
            rows={csvRows}
            columns={[
              { key: "email", label: "Email" },
              { key: "name", label: "Name" },
              { key: "businessName", label: "Business" },
              { key: "source", label: "Source" },
              { key: "createdAt", label: "Signed up" },
            ]}
            filename="capita-lens-waitlist.csv"
          />
        </div>
      </div>

      <Table>
        <THead>
          <tr>
            <TH>Email</TH>
            <TH>Business</TH>
            <TH>Source</TH>
            <TH>Signed up</TH>
          </tr>
        </THead>
        <tbody>
          {entries.length === 0 ? (
            <EmptyRow colSpan={4} label="No signups yet." />
          ) : (
            entries.map((e) => (
              <TRow key={e.id}>
                <TD className="font-medium">{e.email}</TD>
                <TD className="text-muted-foreground">
                  {e.businessName ?? "—"}
                </TD>
                <TD>
                  <Badge variant="outline">{e.source ?? "landing"}</Badge>
                </TD>
                <TD className="text-muted-foreground">
                  {new Date(e.createdAt).toLocaleString("en-GB")}
                </TD>
              </TRow>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
