"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  LockKeyhole,
  TrendingUp,
} from "lucide-react";
import { Card, Badge } from "@capita/ui";
import { CountUp } from "./motion";

const OVERALL = 74;

const CATEGORIES = [
  {
    label: "Financial Health",
    score: 82,
    color: "#10b981",
    trend: "+9",
    status: "Healthy",
  },
  {
    label: "Compliance",
    score: 91,
    color: "#0ea5e9",
    trend: "+4",
    status: "Verified",
  },
  {
    label: "Credit & Risk",
    score: 77,
    color: "#6366f1",
    trend: "+6",
    status: "Improving",
  },
  {
    label: "Governance",
    score: 69,
    color: "#f59e0b",
    trend: "+11",
    status: "Needs board pack",
  },
  {
    label: "Documentation",
    score: 61,
    color: "#f43f5e",
    trend: "+18",
    status: "3 gaps",
  },
];

const EVIDENCE = [
  { label: "Bank statements", state: "Synced", icon: CheckCircle2 },
  { label: "Tax filings", state: "Verified", icon: LockKeyhole },
  { label: "Board minutes", state: "Missing", icon: AlertTriangle },
  { label: "Cash forecast", state: "Updated", icon: TrendingUp },
];

const SCENARIOS = [
  { label: "Debt", score: 74, delta: "+12" },
  { label: "Grant", score: 81, delta: "+8" },
  { label: "Equity", score: 68, delta: "+15" },
] as const;

const DEFAULT_SCENARIO = SCENARIOS[0];
type Scenario = (typeof SCENARIOS)[number];

// Ring geometry
const SIZE = 190;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/** Animated, colourful preview of the readiness dashboard for the hero. */
export function ReadinessPreview() {
  const [scenario, setScenario] = useState<Scenario>(DEFAULT_SCENARIO);

  const weightedCategories = useMemo(
    () =>
      CATEGORIES.map((category, index) => ({
        ...category,
        score: Math.min(96, category.score + (scenario.score - OVERALL) / 3 - index),
      })),
    [scenario],
  );

  const dashboardScore = Math.round(scenario.score);
  const ringOffset = CIRC - (dashboardScore / 100) * CIRC;

  return (
    <Card className="overflow-hidden rounded-lg border-border/70 bg-background shadow-2xl ring-1 ring-black/5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-secondary/50 px-4 py-3 sm:px-5">
        <div>
          <span className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Live readiness room
          </span>
          <p className="mt-1 text-sm font-semibold">Capital Readiness Profile</p>
        </div>
        <div className="flex rounded-md border border-border bg-background p-1">
          {SCENARIOS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setScenario(item)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition ${
                scenario.label === item.label
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 p-4 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
        <div className="flex flex-col items-center">
          <div className="relative" style={{ width: SIZE, height: SIZE }}>
            <svg width={SIZE} height={SIZE} className="-rotate-90">
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--brand))" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth={STROKE}
              />
              <motion.circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRC}
                initial={{ strokeDashoffset: CIRC }}
                animate={{ strokeDashoffset: ringOffset }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: EASE, delay: 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="tabular font-display text-4xl font-bold leading-none">
                <CountUp value={dashboardScore} duration={1} />
              </span>
              <span className="mt-1 text-2xs font-medium uppercase tracking-wider text-muted-foreground">
                Readiness
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <ArrowUpRight className="size-3" />
            {scenario.delta} points if gaps close
          </div>
        </div>

        <div className="space-y-3.5">
          {weightedCategories.map((c, i) => (
            <div key={c.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.label}
                </span>
                <span className="flex items-center gap-2">
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {c.status}
                  </span>
                  <CountUp
                    value={Math.round(c.score)}
                    duration={1}
                    className="tabular font-medium text-muted-foreground"
                  />
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: c.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${c.score}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.1,
                    ease: EASE,
                    delay: 0.25 + i * 0.1,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid border-t border-border/70 bg-muted/20 sm:grid-cols-4">
        {EVIDENCE.map(({ label, state, icon: Icon }) => (
          <div
            key={label}
            className="flex min-h-20 items-center gap-3 border-b border-border/60 px-4 py-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground ring-1 ring-border">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">{label}</p>
              <p className="mt-0.5 text-[0.7rem] text-muted-foreground">{state}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground sm:px-5">
        <span className="flex items-center gap-2">
          <FileText className="size-3.5" />
          Lender pack readiness
        </span>
        <Badge variant="warning">4 priority actions</Badge>
      </div>
    </Card>
  );
}
