"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";
import { Button, Badge } from "@capita/ui";
import { LenderLens } from "./lender-lens";
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
              coming. Capita-Lens assesses your business across everything
              lenders, investors and grant providers actually look at, then
              shows you exactly how to become funding-ready.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/auth/sign-up">
                  Start free assessment
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={DEMO_URL}>Book a demo</a>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              No credit check. No obligation. Just an honest read on how fundable
              you really are.
            </p>
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
