import { Users, FileStack, Inbox, CheckCircle2 } from "lucide-react";
import { Stat } from "@capita/ui";
import { getOverviewStats } from "@/lib/queries";

export const metadata = { title: "Overview" };

export default async function OverviewPage() {
  const stats = await getOverviewStats();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Platform activity at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Users"
          value={stats.users}
          icon={<Users className="size-4" />}
        />
        <Stat
          label="Templates"
          value={stats.templates}
          icon={<FileStack className="size-4" />}
        />
        <Stat
          label="Submissions"
          value={stats.submissions}
          icon={<Inbox className="size-4" />}
        />
        <Stat
          label="Completed"
          value={stats.completed}
          icon={<CheckCircle2 className="size-4" />}
        />
      </div>
    </div>
  );
}
