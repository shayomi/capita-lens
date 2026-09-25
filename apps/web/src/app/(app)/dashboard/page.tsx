import Link from "next/link";
import { Sparkles, RefreshCw, TrendingUp } from "lucide-react";
import { requireUser, type AppUser } from "@sadora/auth";
import { READINESS_LABELS } from "@sadora/core";
import { ScoreRing, Card, Badge, Button } from "@sadora/ui";
import { auth } from "@/lib/auth/server";
import { getDashboardData } from "@/lib/queries/dashboard";
import { EmptyAssessment } from "@/components/app/empty-assessment";
import { CategoryGrid } from "@/components/app/category-grid";
import { RoadmapList } from "@/components/app/roadmap-list";
import { FundingObjectiveBanner } from "@/components/app/funding-objective";
import { MissingEvidence } from "@/components/app/missing-evidence";
import { AnalysisSections } from "@/components/app/analysis-sections";

export const metadata = { title: "Dashboard" };

/** Numbered step heading that gives the dashboard its funding-story rhythm. */
function Step({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="tabular flex size-7 items-center justify-center rounded-full bg-secondary font-mono text-xs font-semibold text-muted-foreground">
        {n}
      </span>
      <h2 className="font-display text-lg font-semibold">{title}</h2>
    </div>
  );
}

export default async function DashboardPage() {
  const user: AppUser = await requireUser(auth);
  const data = await getDashboardData(user.id);

  if (!data) return <EmptyAssessment />;

  const {
    assessment,
    objective,
    categories,
    risks,
    recommendations,
    missingEvidence,
    potentialGain,
  } = data;

  const readiness = assessment.readinessStatus ?? "developing";
  const overall = assessment.overallScore ?? 0;
  const ringStatus =
    overall >= 80
      ? "excellent"
      : overall >= 65
        ? "on_track"
        : overall >= 45
          ? "attention"
          : "critical";

  return (
    <div className="w-full space-y-10">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            Your funding readiness
          </h1>
          <p className="text-sm text-muted-foreground">
            Last assessed{" "}
            {assessment.completedAt
              ? new Date(assessment.completedAt).toLocaleDateString("en-GB")
              : "recently"}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/assessment">
            <RefreshCw className="size-4" />
            Reassess
          </Link>
        </Button>
      </div>

      {/* 01 · Your goal */}
      <FundingObjectiveBanner objective={objective} />

      {/* 02 · How ready you are */}
      <section className="space-y-4">
        <Step n="01" title="How ready you are" />
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <Card className="flex flex-col items-center justify-center p-8">
            <ScoreRing
              value={overall}
              status={ringStatus}
              label="Readiness"
              size={200}
            />
            <Badge variant="brand" className="mt-4">
              {READINESS_LABELS[readiness]}
            </Badge>
          </Card>

          <Card className="flex flex-col justify-center p-6">
            {assessment.summary ? (
              <>
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand">
                  <Sparkles className="size-3.5" />
                  What this means
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed">
                  {assessment.summary}
                </p>
              </>
            ) : (
              <p className="text-[0.95rem] leading-relaxed text-muted-foreground">
                You scored {Math.round(overall)}/100. A lender would currently
                view you as{" "}
                <span className="font-medium text-foreground">
                  {READINESS_LABELS[readiness].toLowerCase()}
                </span>
                . Work the steps below to strengthen your position.
              </p>
            )}
          </Card>
        </div>
      </section>

      {/* 02 · Blockers + 03 · Missing evidence */}
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <Step n="02" title="Your biggest blockers" />
          {risks.length === 0 ? (
            <Card className="p-6 text-sm text-muted-foreground">
              No material blockers detected. You&apos;re in strong shape.
            </Card>
          ) : (
            <div className="space-y-3">
              {risks.map((r) => (
                <Card key={r.id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
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
        </section>

        <section className="space-y-4">
          <Step n="03" title="What evidence is missing" />
          <MissingEvidence items={missingEvidence} />
        </section>
      </div>

      {/* 04 · What to fix next */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Step n="04" title="What to fix next" />
          {potentialGain ? (
            <span className="flex items-center gap-1.5 text-sm font-medium text-success">
              <TrendingUp className="size-4" />+{potentialGain} readiness
              available
            </span>
          ) : null}
        </div>
        <RoadmapList recommendations={recommendations} />
      </section>

      {/* Lender's-lens category breakdown */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold">
            Seen through a lender&apos;s lens
          </h2>
          <p className="text-sm text-muted-foreground">
            How each area stacks up, and why it matters to a funder.
          </p>
        </div>
        <CategoryGrid categories={categories} />
      </section>

      {/* AI narrative sections */}
      {assessment.analysisSections && assessment.analysisSections.length > 0 ? (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Sparkles className="size-4 text-brand" />
            Deeper analysis
          </h2>
          <AnalysisSections sections={assessment.analysisSections} />
        </section>
      ) : null}
    </div>
  );
}
