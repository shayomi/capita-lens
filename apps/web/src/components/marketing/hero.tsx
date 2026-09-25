"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { Button, Badge } from "@sadora/ui";
import { LenderLens } from "./lender-lens";
import { WaitlistForm } from "./waitlist-form";
import { DEMO_URL } from "@/lib/marketing";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-background">
      <div className="surface-grid pointer-events-none absolute inset-0 opacity-[0.32] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

      <div className="container relative grid gap-12 pb-16 pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pb-24 lg:pt-24">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="brand" className="mb-5">
              <Eye className="size-3" />
              Continuous capital readiness
            </Badge>
            <h1 className="text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              See your business the way a{" "}
              <span className="text-brand">lender</span> does, before you apply
              for funding.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Most funding applications fail for reasons owners never saw
              coming. Sadora-Lens assesses your business across key areas
              lenders, investors and grant providers commonly consider, then
              provides practical recommendations to help you become funding-ready.
            </p>
            <div className="mt-8 max-w-md">
              <WaitlistForm source="landing_hero" />
              <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                <span>Be first to get access.</span>
                <a
                  href={DEMO_URL}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Book a demo
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <LenderLens />
        </motion.div>
      </div>
    </section>
  );
}
