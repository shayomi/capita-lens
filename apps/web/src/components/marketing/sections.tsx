"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Landmark,
  ShieldCheck,
  Scale,
  FileCheck2,
  Building2,
  Wallet,
  TrendingUp,
  History,
  Gavel,
  FileText,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Radar,
} from "lucide-react";
import { Card, Badge } from "@capita/ui";
import { Reveal, StaggerGroup, staggerItem } from "./motion";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

// Small helper: a colour-tinted icon chip (purge-safe inline styles).
function IconChip({
  color,
  children,
  className = "",
}: {
  color: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`flex size-10 items-center justify-center rounded-xl ${className}`}
      style={{ backgroundColor: `${color}1a`, color }}
    >
      {children}
    </span>
  );
}

// ── The problem ──────────────────────────────────────────────────────

const PROBLEMS = [
  { icon: Wallet, label: "Cash flow & affordability", meta: "Bank-led signal", color: "#10b981" },
  { icon: History, label: "Repayment & credit history", meta: "Risk history", color: "#0ea5e9" },
  { icon: Gavel, label: "CCJs & insolvency", meta: "Adverse events", color: "#f43f5e" },
  { icon: Building2, label: "Companies House compliance", meta: "Registry posture", color: "#6366f1" },
  { icon: FileText, label: "Governance & documentation", meta: "Evidence quality", color: "#8b5cf6" },
  { icon: Activity, label: "Sector & operational risk", meta: "Trading resilience", color: "#f59e0b" },
];

export function ProblemSection() {
  return (
    <section
      id="product"
      className="relative overflow-hidden border-t border-border/60 bg-secondary/35"
    >
      <div className="container relative py-16 sm:py-20">
        <Reveal className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <Badge variant="brand" className="mb-4">
              Platform intelligence
            </Badge>
            <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Replace one-off funding panic with continuous readiness control.
            </h2>
          </div>
          <p className="text-muted-foreground lg:text-lg">
            Capita-Lens maps the signals lenders already care about, converts
            them into a scored operating profile, and keeps the next best action
            visible as your evidence changes.
          </p>
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map(({ icon: Icon, label, meta, color }) => (
            <motion.div key={label} variants={staggerItem}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="group grid min-h-28 gap-4 rounded-lg border border-border/70 bg-background p-4 shadow-sm transition-colors hover:border-foreground/20"
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <IconChip color={color} className="rounded-lg">
                    <Icon className="size-5" />
                  </IconChip>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[0.68rem] text-muted-foreground">
                    {meta}
                  </span>
                </div>
                <span className="text-sm font-semibold leading-5">{label}</span>
              </motion.div>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

// ── How it works ─────────────────────────────────────────────────────

const STEPS = [
  {
    n: "01",
    title: "Capture the operating truth",
    body: "Answer structured prompts, connect evidence, and expose the assumptions behind every readiness score.",
    color: "#6366f1",
  },
  {
    n: "02",
    title: "Model the funding objective",
    body: "Compare debt, grants, and equity scenarios with category-level risk, affordability, and documentation signals.",
    color: "#0ea5e9",
  },
  {
    n: "03",
    title: "Execute the readiness roadmap",
    body: "Prioritise fixes, upload proof, reassess continuously, and produce a cleaner lender pack when it matters.",
    color: "#10b981",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-t border-border/60">
      <div className="container py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="brand" className="mb-4">
            Workflow
          </Badge>
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            A capital readiness loop your team can keep running
          </h2>
        </Reveal>

        <div className="relative mt-14">
          {/* animated connecting line (md+) */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-gradient-to-r from-brand/40 via-sky-500/40 to-emerald-500/40 md:block"
          />
          <StaggerGroup className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <motion.div key={s.n} variants={staggerItem}>
                <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
                  <Card className="relative h-full p-6 transition-shadow hover:shadow-lg">
                    <span
                      className="relative z-10 flex size-12 items-center justify-center rounded-lg font-mono text-sm font-semibold text-white shadow-sm"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.n}
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {s.body}
                    </p>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}

// ── Readiness categories (7 dimensions) ──────────────────────────────

const CATEGORIES = [
  {
    icon: Wallet,
    label: "Financial Health",
    score: 82,
    weight: "High",
    status: "Strong",
    signal: "Revenue stability, cash runway, debtor concentration, margin resilience.",
    action: "Upload the latest management accounts and reconcile cash variance.",
    evidence: "6 checks",
    color: "#10b981",
  },
  {
    icon: Scale,
    label: "Credit & Risk",
    score: 77,
    weight: "High",
    status: "Improving",
    signal: "Repayment history, adverse events, director risk, and debt utilisation.",
    action: "Resolve two open credit explanations before lender outreach.",
    evidence: "8 checks",
    color: "#0ea5e9",
  },
  {
    icon: TrendingUp,
    label: "Affordability",
    score: 74,
    weight: "Critical",
    status: "Watch",
    signal: "Debt service cover, free cash flow, forecast confidence, and sensitivity.",
    action: "Add a downside forecast to prove repayment headroom.",
    evidence: "5 checks",
    color: "#14b8a6",
  },
  {
    icon: Building2,
    label: "Governance",
    score: 69,
    weight: "Medium",
    status: "Needs work",
    signal: "Ownership clarity, board cadence, authorities, policies, and control records.",
    action: "Create a board pack with decisions, approvals, and funding purpose.",
    evidence: "4 checks",
    color: "#6366f1",
  },
  {
    icon: ShieldCheck,
    label: "Compliance",
    score: 91,
    weight: "High",
    status: "Verified",
    signal: "Companies House standing, filings, registrations, tax posture, and licenses.",
    action: "Keep recurring filing reminders active for the next reporting cycle.",
    evidence: "9 checks",
    color: "#8b5cf6",
  },
  {
    icon: Landmark,
    label: "Operational Readiness",
    score: 72,
    weight: "Medium",
    status: "Developing",
    signal: "Customer dependency, supplier exposure, continuity, systems, and delivery risk.",
    action: "Document supplier fallback plans for your top two dependencies.",
    evidence: "7 checks",
    color: "#f59e0b",
  },
  {
    icon: FileCheck2,
    label: "Documentation",
    score: 61,
    weight: "Critical",
    status: "Gaps found",
    signal: "Lender pack completeness, financial evidence, contracts, IDs, and declarations.",
    action: "Complete three missing documents before submitting funding applications.",
    evidence: "11 checks",
    color: "#f43f5e",
  },
] as const;

const DEFAULT_CATEGORY = CATEGORIES[0];
type ReadinessCategory = (typeof CATEGORIES)[number];

export function ReadinessSection() {
  const [selected, setSelected] =
    useState<ReadinessCategory>(DEFAULT_CATEGORY);
  const SelectedIcon = selected.icon;

  return (
    <section
      id="readiness"
      className="relative overflow-hidden border-t border-border/60 bg-background"
    >
      <div className="container relative py-20">
        <Reveal className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <Badge variant="brand" className="mb-4">
              Seven-dimension model
            </Badge>
            <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Explore the readiness matrix behind every funding decision.
            </h2>
          </div>
          <p className="text-muted-foreground lg:text-lg">
            Each dimension is scored, weighted, and tied to evidence. Select a
            dimension to see the lender signal, current posture, and next action.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <StaggerGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              const active = selected.label === category.label;

              return (
                <motion.button
                  key={category.label}
                  type="button"
                  variants={staggerItem}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelected(category)}
                  className={`group grid gap-3 rounded-lg border p-4 text-left transition ${
                    active
                      ? "border-foreground/20 bg-secondary shadow-[0_18px_45px_rgba(15,23,42,0.12)] ring-1 ring-black/5 dark:shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
                      : "border-border/70 bg-background shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:border-foreground/20 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.22)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.34)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex min-w-0 items-center gap-3">
                      <IconChip color={category.color} className="rounded-lg">
                        <Icon className="size-5" />
                      </IconChip>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold leading-5">
                          {category.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {category.weight} weight · {category.evidence}
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 tabular text-lg font-semibold">
                      {category.score}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: category.color }}
                      initial={false}
                      animate={{ width: `${category.score}%` }}
                      transition={{ duration: 0.55, ease: EASE }}
                    />
                  </div>
                </motion.button>
              );
            })}
          </StaggerGroup>

          <Card className="overflow-hidden rounded-lg border-border/70 shadow-[0_24px_70px_rgba(15,23,42,0.12)] ring-1 ring-black/5 dark:shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
            <motion.div
              key={selected.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="p-4 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <IconChip color={selected.color} className="size-11 shrink-0 rounded-lg sm:size-12">
                    <SelectedIcon className="size-6" />
                  </IconChip>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Active dimension</p>
                    <h3 className="text-balance font-display text-xl font-semibold tracking-tight sm:text-2xl">
                      {selected.label}
                    </h3>
                  </div>
                </div>
                <Badge
                  variant={
                    selected.score >= 85
                      ? "success"
                      : selected.score >= 72
                        ? "info"
                        : selected.score >= 65
                          ? "warning"
                          : "danger"
                  }
                >
                  {selected.status}
                </Badge>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-[auto_1fr] md:items-center">
                <div
                  className="relative mx-auto size-36 rounded-full shadow-[0_18px_45px_rgba(15,23,42,0.12)] sm:size-40 dark:shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
                  style={{
                    background: `conic-gradient(${selected.color} ${selected.score * 3.6}deg, hsl(var(--secondary)) 0deg)`,
                  }}
                >
                  <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-background ring-1 ring-border">
                    <span className="tabular font-display text-3xl font-bold sm:text-4xl">
                      {selected.score}
                    </span>
                    <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Score
                    </span>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-lg border border-border/70 bg-secondary/35 p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.24)]">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <Radar className="size-4 text-brand" />
                      Lender signal
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {selected.signal}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-background p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.24)]">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <ClipboardCheck className="size-4 text-brand" />
                      Next best action
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {selected.action}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 border-t border-border/70 pt-5 sm:grid-cols-3">
                {[
                  ["Weight", selected.weight],
                  ["Evidence", selected.evidence],
                  ["Decision impact", selected.score >= 75 ? "Positive" : "Material"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg bg-secondary/40 p-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
                  >
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                      <CheckCircle2 className="size-4 text-emerald-500" />
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </Card>
        </div>
      </div>
    </section>
  );
}
