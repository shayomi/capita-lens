import { Badge } from "@sadora/ui";
import { listUsers } from "@/lib/queries";
import { Table, THead, TH, TRow, TD, EmptyRow } from "@/components/data-table";

export const metadata = { title: "Users" };

const ROLE_VARIANT = {
  user: "default",
  admin: "info",
  super_admin: "brand",
} as const;

export default async function UsersPage() {
  const users = await listUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Everyone with a Sadora-Lens account. Role changes are restricted to
          super admins.
        </p>
      </div>

      <Table>
        <THead>
          <tr>
            <TH>User</TH>
            <TH>Email</TH>
            <TH>Role</TH>
            <TH>Status</TH>
            <TH>Joined</TH>
          </tr>
        </THead>
        <tbody>
          {users.length === 0 ? (
            <EmptyRow colSpan={5} label="No users yet." />
          ) : (
            users.map((u) => (
              <TRow key={u.id}>
                <TD className="font-medium">{u.displayName ?? "—"}</TD>
                <TD className="text-muted-foreground">{u.email}</TD>
                <TD>
                  <Badge variant={ROLE_VARIANT[u.role]}>{u.role}</Badge>
                </TD>
                <TD>
                  <Badge variant={u.isActive ? "success" : "danger"}>
                    {u.isActive ? "active" : "disabled"}
                  </Badge>
                </TD>
                <TD className="text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString("en-GB")}
                </TD>
              </TRow>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
