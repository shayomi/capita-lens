"use client";

import { motion } from "framer-motion";
import {
  Search,
  Layers,
  Clock3,
  RefreshCw,
  FileCheck2,
  Brain,
  ShieldCheck,
  Wallet,
  Scale,
  TrendingUp,
  Building2,
  Landmark,
  Target,
  ClipboardCheck,
  Gauge,
  ListChecks,
} from "lucide-react";
import { Card, Badge } from "@capita/ui";
import { Reveal, StaggerGroup, staggerItem } from "./motion";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

function IconChip({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className="flex size-10 items-center justify-center rounded-xl"
      style={{ backgroundColor: `${color}1a`, color }}
    >
      {children}
    </span>
  );
}

// ── 1. Why funding applications fail ─────────────────────────────────

const PROBLEMS = [
  {
    icon: Search,
    color: "#f43f5e",
    title: "You can't see what a lender sees",
    body: "Owners apply hoping for the best, with no view of how a lender will actually judge the business.",
  },
  {
    icon: Layers,
    color: "#6366f1",
    title: "It's never just the credit score",
    body: "Cash flow, affordability, governance, documentation and sector risk all weigh on the decision.",
  },
  {
    icon: Clock3,
    color: "#f59e0b",
    title: "Weaknesses surface too late",
    body: "By the time an application is declined, it's already too late to fix the gaps that caused it.",
  },
  {
    icon: RefreshCw,
    color: "#0ea5e9",
    title: "Readiness isn't a one-off",
    body: "Your fundability shifts every month. Preparing once, right before you apply, simply isn't enough.",
  },
];

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="relative overflow-hidden border-t border-border/60 bg-gradient-to-b from-muted/40 to-background"
    >
      <div className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="container relative py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="danger" className="mb-4">
            The problem
          </Badge>
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Why funding applications fail
          </h2>
          <p className="mt-4 text-muted-foreground">
            It&apos;s rarely the reason business owners expect. Lenders decline
            healthy-looking businesses every day, because fundability is about
            far more than profit and a credit score.
          </p>
        </Reveal>

        <StaggerGroup className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {PROBLEMS.map(({ icon: Icon, color, title, body }) => (
            <motion.div key={title} variants={staggerItem}>
              <Card className="flex h-full items-start gap-4 p-5">
                <IconChip color={color}>
                  <Icon className="size-5" />
                </IconChip>
                <div>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

// ── 2. What is capital readiness (educate) ───────────────────────────

const CONCEPTS = [
  {
    icon: FileCheck2,
    color: "#10b981",
    title: "Evidence-led assessment",
    body: "Every judgement is backed by the documents and answers a lender would actually ask for.",
  },
  {
    icon: Brain,
    color: "#6366f1",
    title: "Decision Intelligence",
    body: "A framework that weighs dozens of signals together, the way a credit committee does.",
  },
  {
    icon: ShieldCheck,
    color: "#0ea5e9",
    title: "Continuous self-due diligence",
    body: "Assess yourself before a lender does, and keep improving between applications.",
  },
];

export function CapitalReadinessSection() {
  return (
    <section id="readiness" className="border-t border-border/60">
      <div className="container py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="brand" className="mb-4">
            The idea
          </Badge>
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            What is capital readiness?
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Capital readiness is how prepared your business is to secure external
            funding, measured the way a lender would. It goes beyond credit to
            the full picture: your financials, evidence, governance and
            resilience.
          </p>
        </Reveal>

        <StaggerGroup className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-3">
          {CONCEPTS.map(({ icon: Icon, color, title, body }) => (
            <motion.div key={title} variants={staggerItem}>
              <Card className="h-full p-5">
                <IconChip color={color}>
                  <Icon className="size-5" />
                </IconChip>
                <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </Card>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

// ── 3. How lenders actually assess you ───────────────────────────────

const LENDER_AREAS = [
  { icon: Wallet, color: "#10b981", label: "Financial Health", ask: "Can the business generate and hold cash?" },
  { icon: Scale, color: "#0ea5e9", label: "Credit & Risk", ask: "What does the track record say about repayment?" },
  { icon: TrendingUp, color: "#14b8a6", label: "Affordability", ask: "Can it service new debt on top of what it owes?" },
  { icon: Building2, color: "#6366f1", label: "Governance", ask: "Is ownership clear and oversight sound?" },
  { icon: ShieldCheck, color: "#8b5cf6", label: "Compliance", ask: "Are filings, tax and policies in order?" },
  { icon: Landmark, color: "#f59e0b", label: "Operational Readiness", ask: "How resilient is it to shocks and dependencies?" },
  { icon: FileCheck2, color: "#f43f5e", label: "Documentation", ask: "Is the evidence there to prove it all?" },
];

export function LenderViewSection() {
  return (
    <section
      id="lenders"
      className="relative overflow-hidden border-t border-border/60 bg-gradient-to-b from-background to-muted/40"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-brand/5 blur-3xl" />
      <div className="container relative py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="brand" className="mb-4">
            The lender&apos;s lens
          </Badge>
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            How lenders actually assess you
          </h2>
          <p className="mt-4 text-muted-foreground">
            We mirror the real assessment. For every area you learn what lenders
            look for, where your evidence is thin, and what to do next.
          </p>
        </Reveal>

        <StaggerGroup className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LENDER_AREAS.map(({ icon: Icon, color, label, ask }) => (
            <motion.div key={label} variants={staggerItem}>
              <Card className="h-full p-5">
                <div className="flex items-center gap-3">
                  <IconChip color={color}>
                    <Icon className="size-5" />
                  </IconChip>
                  <span className="text-sm font-semibold">{label}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground/80">
                    Lenders ask:
                  </span>{" "}
                  {ask}
                </p>
              </Card>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

// ── 4. How it works (funding journey) ────────────────────────────────

const STEPS = [
  { icon: Target, color: "#6366f1", n: "01", title: "Set your funding goal", body: "Tell us what you're raising and why. Every assessment is framed around that objective." },
  { icon: ClipboardCheck, color: "#0ea5e9", n: "02", title: "Complete the guided assessment", body: "A conversational review that teaches you how lenders think as you answer." },
  { icon: Gauge, color: "#14b8a6", n: "03", title: "Get your Capital Readiness Profile", body: "See exactly where you stand, what's blocking funding and what evidence is missing." },
  { icon: ListChecks, color: "#10b981", n: "04", title: "Work the roadmap", body: "Fix the highest-impact gaps first and watch your readiness climb, month after month." },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-t border-border/60">
      <div className="container py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="brand" className="mb-4">
            How it works
          </Badge>
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Your path to funding-ready
          </h2>
        </Reveal>

        <div className="relative mt-14">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-gradient-to-r from-brand/40 via-sky-500/40 to-emerald-500/40 lg:block"
          />
          <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <motion.div key={s.n} variants={staggerItem}>
                <Card className="relative h-full p-6">
                  <span
                    className="relative z-10 flex size-12 items-center justify-center rounded-xl text-white shadow-sm"
                    style={{ backgroundColor: s.color }}
                  >
                    <s.icon className="size-5" />
                  </span>
                  <span className="mt-4 block font-mono text-xs text-muted-foreground">
                    {s.n}
                  </span>
                  <h3 className="mt-1 font-display text-base font-semibold">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </Card>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
