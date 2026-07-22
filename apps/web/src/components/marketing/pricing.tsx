"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Card, Button, Badge, cn } from "@capita/ui";
import { Reveal, StaggerGroup, staggerItem } from "./motion";

const PLANS = [
  {
    name: "Starter",
    price: "£0",
    cadence: "/ forever",
    blurb: "Your first Capital Readiness assessment.",
    features: ["One assessment", "Overall & category scores", "Top risks"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Professional",
    price: "£49",
    cadence: "/ month",
    blurb: "For businesses actively preparing to raise.",
    features: [
      "Continuous reassessment",
      "Full improvement roadmap",
      "Evidence vault (uploads)",
      "Readiness trend over time",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Business",
    price: "£149",
    cadence: "/ month",
    blurb: "Deeper analysis and multiple objectives.",
    features: [
      "Everything in Professional",
      "Multiple funding objectives",
      "Priority recommendations",
      "Export funding-ready reports",
    ],
    cta: "Choose Business",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border/60">
      <div className="container py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            Pricing
          </Badge>
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Start free. Upgrade when you&apos;re serious about raising.
          </h2>
        </Reveal>
        <StaggerGroup className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <motion.div key={plan.name} variants={staggerItem}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Card
                  className={cn(
                    "flex h-full flex-col p-6 transition-shadow hover:shadow-xl",
                    plan.featured && "border-brand/50 ring-1 ring-brand/30",
                  )}
                >
                  {plan.featured ? (
                    <Badge variant="brand" className="mb-3 w-fit">
                      Most popular
                    </Badge>
                  ) : null}
                  <h3 className="font-display text-lg font-semibold">
                    {plan.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="tabular font-display text-3xl font-bold">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.cadence}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.blurb}
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="mt-6"
                    variant={plan.featured ? "default" : "outline"}
                  >
                    <Link href="/auth/sign-up">{plan.cta}</Link>
                  </Button>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-primary text-primary-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(600px_circle_at_50%_-20%,hsl(var(--brand)),transparent)]" />
      <Reveal className="container relative flex flex-col items-center gap-6 py-20 text-center">
        <h2 className="max-w-2xl text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Stop asking &ldquo;can I get funding?&rdquo; Start knowing
          you&apos;re ready.
        </h2>
        <Button asChild size="lg" variant="brand">
          <Link href="/auth/sign-up">Begin your assessment</Link>
        </Button>
      </Reveal>
    </section>
  );
}
