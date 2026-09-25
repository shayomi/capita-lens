import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  ScoreRing,
  Separator,
} from "@sadora/ui";
import type { AnswerValue, AnalysisSectionResult } from "@sadora/db";
import { getSubmissionDetail, type SubmissionDetail } from "@/lib/queries";

export const metadata = { title: "Submission" };

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

const READINESS_LABEL: Record<string, string> = {
  emerging: "Emerging",
  developing: "Developing",
  strong: "Strong",
  investment_ready: "Investment-ready",
};

const SCORE_STATUS_VARIANT = {
  critical: "danger",
  attention: "warning",
  on_track: "info",
  excellent: "success",
} as const;

const SEVERITY_VARIANT = {
  low: "info",
  medium: "warning",
  high: "danger",
} as const;

/** Human-readable rendering of a stored answer value. */
function formatAnswer(value: AnswerValue | null): string {
  if (value == null) return "—";
  switch (value.kind) {
    case "text":
    case "single":
      return value.value || "—";
    case "number":
      return String(value.value);
    case "boolean":
      return value.value ? "Yes" : "No";
    case "multi":
      return value.value.length ? value.value.join(", ") : "—";
    case "date":
      return new Date(value.value).toLocaleDateString("en-GB");
    case "file":
      return `${value.documentIds.length} file${value.documentIds.length === 1 ? "" : "s"} uploaded`;
    default:
      return "—";
  }
}

function fmtDate(d: Date | string | null): string {
  return d
    ? new Date(d).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
}

/** Group answers by their section, preserving section + question order. */
function groupBySection(answers: SubmissionDetail["answers"]) {
  const map = new Map<
    string,
    { title: string; order: number; items: typeof answers }
  >();
  for (const a of answers) {
    const sec = a.question.section;
    const entry = map.get(sec.id) ?? {
      title: sec.title,
      order: sec.displayOrder,
      items: [] as typeof answers,
    };
    entry.items.push(a);
    map.set(sec.id, entry);
  }
  return [...map.values()]
    .sort((x, y) => x.order - y.order)
    .map((s) => ({
      ...s,
      items: [...s.items].sort(
        (a, b) => a.question.displayOrder - b.question.displayOrder,
      ),
    }));
}

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = await getSubmissionDetail(id);
  if (!s) notFound();

  const sections = groupBySection(s.answers);
  const scoreStatus =
    s.categoryScores.length && s.overallScore != null
      ? s.overallScore >= 75
        ? "excellent"
        : s.overallScore >= 55
          ? "on_track"
          : s.overallScore >= 35
            ? "attention"
            : "critical"
      : "on_track";
  const analysisSections = (s.analysisSections ?? []) as AnalysisSectionResult[];

  return (
    <div className="space-y-6">
      <Link
        href="/submissions"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All submissions
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-semibold">
              {s.user?.displayName ?? s.user?.email ?? "Unknown user"}
            </h1>
            <Badge variant={STATUS_VARIANT[s.status]}>
              {STATUS_LABEL[s.status] ?? s.status}
            </Badge>
            {s.readinessStatus ? (
              <Badge variant="brand">
                {READINESS_LABEL[s.readinessStatus] ?? s.readinessStatus}
              </Badge>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {s.template?.name}
            {s.user?.email ? ` · ${s.user.email}` : ""}
          </p>
        </div>
        {s.overallScore != null ? (
          <ScoreRing
            value={s.overallScore}
            status={scoreStatus}
            size={104}
            strokeWidth={9}
            label="Score"
          />
        ) : null}
      </div>

      {/* Meta strip */}
      <Card className="grid grid-cols-2 gap-x-6 gap-y-3 p-5 sm:grid-cols-4">
        <Meta label="Started" value={fmtDate(s.startedAt)} />
        <Meta label="Submitted" value={fmtDate(s.submittedAt)} />
        <Meta label="Completed" value={fmtDate(s.completedAt)} />
        <Meta label="Answers" value={String(s.answers.length)} />
        {s.business ? (
          <Meta label="Business" value={s.business.name ?? "—"} />
        ) : null}
        <Meta label="Template version" value={`v${s.templateVersion}`} />
        {s.aiModel ? <Meta label="AI model" value={s.aiModel} /> : null}
        {s.aiGeneratedAt ? (
          <Meta label="AI generated" value={fmtDate(s.aiGeneratedAt)} />
        ) : null}
      </Card>

      {/* AI summary + narrative */}
      {s.summary || analysisSections.length ? (
        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle className="text-base">AI analysis</CardTitle>
          </CardHeader>
          <CardContent className="mt-3 space-y-4 p-0 text-sm">
            {s.summary ? (
              <p className="leading-relaxed text-muted-foreground">
                {s.summary}
              </p>
            ) : null}
            {analysisSections.map((sec) => (
              <div key={sec.key}>
                <h4 className="font-medium">{sec.title}</h4>
                <p className="mt-1 leading-relaxed text-muted-foreground">
                  {sec.body}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Answers — the main event */}
        <div className="space-y-5 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Responses</h2>
          {sections.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">
              No answers recorded yet.
            </Card>
          ) : (
            sections.map((sec, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="tabular font-mono text-xs text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-sm font-semibold">
                      {sec.title}
                    </span>
                  </div>
                  <span className="text-2xs text-muted-foreground">
                    {sec.items.length} answers
                  </span>
                </div>
                <dl className="divide-y divide-border/60">
                  {sec.items.map((a) => (
                    <div key={a.id} className="px-5 py-3">
                      <dt className="flex items-center gap-2 text-sm font-medium">
                        {a.question.label}
                        {a.question.category?.label ? (
                          <Badge variant="outline">
                            {a.question.category.label}
                          </Badge>
                        ) : null}
                      </dt>
                      <dd className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                        {formatAnswer(a.value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Card>
            ))
          )}
        </div>

        {/* Scores / risks / recommendations */}
        <div className="space-y-5">
          {s.categoryScores.length ? (
            <Card className="p-5">
              <CardHeader className="p-0">
                <CardTitle className="text-base">Category scores</CardTitle>
              </CardHeader>
              <CardContent className="mt-3 space-y-3 p-0">
                {s.categoryScores.map((c) => (
                  <div key={c.id} className="flex items-center justify-between">
                    <span className="text-sm">{c.category?.label ?? "—"}</span>
                    <div className="flex items-center gap-2">
                      <span className="tabular text-sm font-medium">
                        {Math.round(c.score)}
                      </span>
                      <Badge variant={SCORE_STATUS_VARIANT[c.status]}>
                        {c.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {s.risks.length ? (
            <Card className="p-5">
              <CardHeader className="p-0">
                <CardTitle className="text-base">Risks</CardTitle>
                <CardDescription>{s.risks.length} flagged</CardDescription>
              </CardHeader>
              <CardContent className="mt-3 space-y-3 p-0">
                {s.risks.map((r) => (
                  <div key={r.id}>
                    <div className="flex items-center gap-2">
                      <Badge variant={SEVERITY_VARIANT[r.severity]}>
                        {r.severity}
                      </Badge>
                      <span className="text-sm font-medium">{r.title}</span>
                    </div>
                    {r.detail ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {r.detail}
                      </p>
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {s.recommendations.length ? (
            <Card className="p-5">
              <CardHeader className="p-0">
                <CardTitle className="text-base">Recommendations</CardTitle>
                <CardDescription>
                  {s.recommendations.length} actions
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-3 space-y-3 p-0">
                {s.recommendations.map((r, i) => (
                  <div key={r.id}>
                    {i > 0 ? <Separator className="mb-3" /> : null}
                    <p className="text-sm font-medium">{r.title}</p>
                    {r.why ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {r.why}
                      </p>
                    ) : null}
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <Badge variant="outline">{r.difficulty}</Badge>
                      {r.estimatedImpact != null ? (
                        <Badge variant="info">+{r.estimatedImpact} pts</Badge>
                      ) : null}
                      {r.timeToComplete ? (
                        <span className="text-2xs text-muted-foreground">
                          {r.timeToComplete}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  );
}
