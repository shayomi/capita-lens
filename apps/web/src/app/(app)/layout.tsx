import { requireUser } from "@capita/auth";
import { auth } from "@/lib/auth/server";
import { AppSidebar } from "@/components/app/app-sidebar";
import { AppTopbar } from "@/components/app/app-topbar";

// Authed routes read the session cookie, so they must render dynamically.
export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser(auth);

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar user={user} />
        <main className="flex-1 bg-muted/10 p-6">{children}</main>
      </div>
    </div>
  );
}
