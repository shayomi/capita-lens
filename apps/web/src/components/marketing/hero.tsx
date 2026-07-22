"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Button, Badge } from "@capita/ui";
import { ReadinessPreview } from "./readiness-preview";

const TRUST_SIGNALS = [
  "Evidence-led scoring",
  "SME funding workflows",
  "Board-ready reporting",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-background">
      <div className="surface-grid pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

      <div className="container relative grid gap-12 pb-10 pt-16 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:pb-14 lg:pt-20">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="brand" className="mb-5">
              <ShieldCheck className="size-3" />
              Enterprise capital readiness
            </Badge>
            <h1 className="text-balance font-display text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
              Capita-Lens turns funding readiness into a live operating system.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Assess your business the way a lender, investor, or grant panel
              will: financial health, credit risk, governance, compliance,
              documentation, and operating resilience in one decision-grade view.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/auth/sign-up">
                  Run readiness assessment
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#product">Explore platform</Link>
              </Button>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {TRUST_SIGNALS.map((signal) => (
                <div key={signal} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>{signal}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <ReadinessPreview />
        </motion.div>
      </div>
    </section>
  );
}
