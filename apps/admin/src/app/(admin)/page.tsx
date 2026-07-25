import Link from "next/link";
import {
  Users,
  FileStack,
  Inbox,
  CheckCircle2,
  Mails,
  Gauge,
  Timer,
  Percent,
} from "lucide-react";
import {
  Stat,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  TrendChart,
  BarBreakdown,
  type BreakdownDatum,
} from "@capita/ui";
import {
  getOverviewStats,
  getSignupsSeries,
  getSubmissionsSeries,
  getStatusBreakdown,
  getReadinessBreakdown,
  getRecentSubmissions,
} from "@/lib/queries";
import { Table, THead, TH, TRow, TD, EmptyRow } from "@/components/data-table";

export const metadata = { title: "Overview" };

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

const STATUS_COLOR: Record<string, BreakdownDatum["color"]> = {
  in_progress: "warning",
  submitted: "info",
  analysing: "info",
  completed: "success",
};

const READINESS_LABEL: Record<string, string> = {
  emerging: "Emerging",
  developing: "Developing",
  strong: "Strong",
  investment_ready: "Investment-ready",
};

const READINESS_COLOR: Record<string, BreakdownDatum["color"]> = {
  emerging: "danger",
  developing: "warning",
  strong: "info",
  investment_ready: "success",
};

export default async function OverviewPage() {
  const [stats, signups, submissionsSeries, statusRows, readinessRows, recent] =
    await Promise.all([
      getOverviewStats(),
      getSignupsSeries(30),
      getSubmissionsSeries(30),
      getStatusBreakdown(),
      getReadinessBreakdown(),
      getRecentSubmissions(6),
    ]);

  const statusData: BreakdownDatum[] = statusRows.map((r) => ({
    label: STATUS_LABEL[r.status] ?? r.status,
    value: Number(r.n),
    color: STATUS_COLOR[r.status] ?? "brand",
  }));

  const readinessData: BreakdownDatum[] = readinessRows.map((r) => ({
    label: READINESS_LABEL[r.status] ?? r.status,
    value: Number(r.n),
    color: READINESS_COLOR[r.status] ?? "brand",
  }));

  const newSignups30 = signups.reduce((a, p) => a + p.value, 0);
  const newSubs30 = submissionsSeries.reduce((a, p) => a + p.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Platform activity at a glance.
        </p>
      </div>

      {/* KPI tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <Stat
          label="Users"
          value={stats.users}
          icon={<Users className="size-4" />}
        />
        <Stat
          label="Waitlist"
          value={stats.waitlist}
          icon={<Mails className="size-4" />}
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
        <Stat
          label="In progress"
          value={stats.inProgress}
          icon={<Timer className="size-4" />}
        />
        <Stat
          label="Completion"
          value={`${stats.completionRate}%`}
          icon={<Percent className="size-4" />}
        />
        <Stat
          label="Avg score"
          value={stats.avgScore}
          icon={<Gauge className="size-4" />}
        />
        <Stat
          label="Templates"
          value={stats.templates}
          icon={<FileStack className="size-4" />}
        />
      </div>

      {/* Trend charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle className="text-base">Waitlist sign-ups</CardTitle>
            <CardDescription>
              {newSignups30} in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4 p-0">
            <TrendChart data={signups} color="brand" valueLabel="Sign-ups" />
          </CardContent>
        </Card>

        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle className="text-base">Assessments started</CardTitle>
            <CardDescription>{newSubs30} in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="mt-4 p-0">
            <TrendChart
              data={submissionsSeries}
              color="info"
              valueLabel="Started"
            />
          </CardContent>
        </Card>
      </div>

      {/* Breakdowns */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle className="text-base">Submissions by status</CardTitle>
            <CardDescription>
              Where every assessment run currently sits
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4 p-0">
            {statusData.length ? (
              <BarBreakdown data={statusData} />
            ) : (
              <EmptyChart />
            )}
          </CardContent>
        </Card>

        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle className="text-base">Readiness distribution</CardTitle>
            <CardDescription>
              Bands across completed assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4 p-0">
            {readinessData.length ? (
              <BarBreakdown data={readinessData} defaultColor="success" />
            ) : (
              <EmptyChart />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent submissions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            Recent submissions
          </h2>
          <Link
            href="/submissions"
            className="text-sm text-brand hover:underline"
          >
            View all
          </Link>
        </div>
        <Table>
          <THead>
            <tr>
              <TH>User</TH>
              <TH>Template</TH>
              <TH>Status</TH>
              <TH>Score</TH>
              <TH>Started</TH>
            </tr>
          </THead>
          <tbody>
            {recent.length === 0 ? (
              <EmptyRow colSpan={5} label="No submissions yet." />
            ) : (
              recent.map((s) => (
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
                    {new Date(s.startedAt).toLocaleDateString("en-GB")}
                  </TD>
                </TRow>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
      No data yet.
    </div>
  );
}
