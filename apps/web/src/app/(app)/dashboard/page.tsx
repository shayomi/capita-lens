import { requireUser, type AppUser } from "@capita/auth";
import { READINESS_LABELS } from "@capita/core";
import { ScoreRing, Card, Badge } from "@capita/ui";
import { auth } from "@/lib/auth/server";
import { getDashboardData } from "@/lib/queries/dashboard";
import { EmptyAssessment } from "@/components/app/empty-assessment";
import { CategoryGrid } from "@/components/app/category-grid";
import { RoadmapList } from "@/components/app/roadmap-list";
import { BusinessSnapshot } from "@/components/app/business-snapshot";
import { AnalysisSections } from "@/components/app/analysis-sections";
import { Sparkles } from "lucide-react";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user: AppUser = await requireUser(auth);
  const data = await getDashboardData(user.id);

  if (!data) return <EmptyAssessment />;

  const { assessment, snapshot, categories, risks, recommendations } = data;
  const readiness = assessment.readinessStatus ?? "developing";
  const overall = assessment.overallScore ?? 0;
  const ringStatus = overall >= 80 ? "excellent" : overall >= 65 ? "on_track" : overall >= 45 ? "attention" : "critical";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            Capital Readiness
          </h1>
          <p className="text-sm text-muted-foreground">
            Last assessed{" "}
            {assessment.completedAt
              ? new Date(assessment.completedAt).toLocaleDateString("en-GB")
              : "recently"}
          </p>
        </div>
        <Badge variant="brand">{READINESS_LABELS[readiness]}</Badge>
      </div>

      <BusinessSnapshot items={snapshot} />

      {assessment.summary ? (
        <Card className="border-brand/30 bg-brand-muted/40 p-6">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand">
            <Sparkles className="size-3.5" />
            AI summary
          </h2>
          <p className="mt-2 text-[0.95rem] leading-relaxed">
            {assessment.summary}
          </p>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="flex flex-col items-center justify-center p-8">
          <ScoreRing value={overall} status={ringStatus} label="Overall" size={220} />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {READINESS_LABELS[readiness]} · {Math.round(overall)}/100 capital
            readiness
          </p>
        </Card>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Category scores
          </h2>
          <CategoryGrid categories={categories} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Improvement roadmap
          </h2>
          <RoadmapList recommendations={recommendations} />
        </div>
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Biggest risks
          </h2>
          {risks.length === 0 ? (
            <Card className="p-6 text-sm text-muted-foreground">
              No material risks detected.
            </Card>
          ) : (
            <div className="space-y-3">
              {risks.map((r) => (
                <Card key={r.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{r.title}</p>
                    <Badge
                      variant={
                        r.severity === "high"
                          ? "danger"
                          : r.severity === "medium"
                            ? "warning"
                            : "info"
                      }
                    >
                      {r.severity}
                    </Badge>
                  </div>
                  {r.detail ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {r.detail}
                    </p>
                  ) : null}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {assessment.analysisSections && assessment.analysisSections.length > 0 ? (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Sparkles className="size-3.5 text-brand" />
            Analysis
          </h2>
          <AnalysisSections sections={assessment.analysisSections} />
        </div>
      ) : null}
    </div>
  );
}
