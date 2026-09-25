"use client";

import { motion } from "framer-motion";
import {
  Target,
  Gauge,
  FileCheck2,
  AlertTriangle,
  ListChecks,
  ArrowUpRight,
  Check,
  X,
} from "lucide-react";
import { Card, Badge } from "@sadora/ui";
import { Reveal, StaggerGroup, staggerItem } from "./motion";

// ── Dashboard as proof: the funding story ────────────────────────────

const STORY = [
  { icon: Target, label: "Funding goal", value: "£150k working capital", tone: "#6366f1" },
  { icon: Gauge, label: "Current readiness", value: "Developing", tone: "#0ea5e9" },
  { icon: FileCheck2, label: "Evidence strength", value: "Moderate, with missing management accounts", tone: "#14b8a6" },
  { icon: AlertTriangle, label: "Highest priority gap", value: "Thin financial evidence", tone: "#f59e0b" },
  { icon: ListChecks, label: "Recommended actions", value: "Add 3 months of management accounts", tone: "#8b5cf6" },
  { icon: ArrowUpRight, label: "Projected readiness confidence", value: "A materially stronger application", tone: "#10b981" },
];

export function DashboardProof() {
  return (
    <section id="product" className="border-t border-border/60 bg-muted/20">
      <div className="container py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            The proof
          </Badge>
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Your readiness, told as a funding story
          </h2>
          <p className="mt-4 text-muted-foreground">
            Not a wall of scores. A clear line from where you are today to
            stronger funding readiness, with the next step always clear.
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-2xl" delay={0.1}>
          <Card className="overflow-hidden shadow-xl ring-1 ring-black/5">
            <div className="border-b border-border/60 bg-muted/40 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Capital Readiness Profile
            </div>
            <div className="p-2 sm:p-4">
              {STORY.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.1 }}
                  className="relative flex items-center gap-4 rounded-lg px-3 py-3.5"
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${s.tone}1a`, color: s.tone }}
                  >
                    <s.icon className="size-4.5 size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-2xs uppercase tracking-wide text-muted-foreground">
                      {s.label}
                    </p>
                    <p className="text-sm font-medium">{s.value}</p>
                  </div>
                  {i < STORY.length - 1 ? (
                    <span className="absolute bottom-0 left-[2.15rem] h-3.5 w-px translate-y-full bg-border" />
                  ) : null}
                </motion.div>
              ))}
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

// ── Differentiation ──────────────────────────────────────────────────

const OTHERS = [
  { name: "Credit agencies (Experian, Creditsafe)", does: "Monitor your credit file" },
  { name: "Accounting software", does: "Track the books" },
  { name: "Loan marketplaces", does: "Match you to products" },
  { name: "Financial dashboards", does: "Report your KPIs" },
];

export function Differentiation() {
  return (
    <section id="difference" className="border-t border-border/60">
      <div className="container py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="brand" className="mb-4">
            Why we&apos;re different
          </Badge>
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Not a credit check. Not a dashboard.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Other tools show you one slice. Sadora-Lens measures your overall
            funding readiness continuously, using financial, operational,
            governance, documentation and behavioural signals together.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          <StaggerGroup className="space-y-3">
            {OTHERS.map((o) => (
              <motion.div key={o.name} variants={staggerItem}>
                <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background px-4 py-3">
                  <X className="size-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm font-medium">{o.name}</span>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {o.does}
                  </span>
                </div>
              </motion.div>
            ))}
          </StaggerGroup>

          <Reveal delay={0.15}>
            <div className="flex items-center gap-3 rounded-lg border border-brand/40 bg-brand-muted/50 px-4 py-4 ring-1 ring-brand/20">
              <Check className="size-5 shrink-0 text-brand" />
              <span className="font-semibold">Sadora-Lens</span>
              <span className="ml-auto text-right text-sm">
                Helps assess overall funding readiness and provides tailored
                guidance on how to improve it.
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
