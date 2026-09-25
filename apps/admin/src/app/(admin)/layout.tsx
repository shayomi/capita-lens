import { requireAdmin } from "@sadora/auth";
import { auth } from "@/lib/auth/server";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminTopbar } from "@/components/admin-topbar";

// Authed routes read the session cookie, so they must render dynamically.
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin(auth);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
