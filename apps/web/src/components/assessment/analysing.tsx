"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Logo } from "@sadora/ui";

const STEPS = [
  "Financial Health",
  "Credit & Risk",
  "Affordability",
  "Governance",
  "Compliance",
  "Operational Resilience",
  "Documentation",
  "Evidence Quality",
];

/** Full-screen "analysing" moment shown while the engine scores the answers. */
export function Analysing() {
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done >= STEPS.length) return;
    const t = setTimeout(() => setDone((d) => d + 1), 280);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="surface-grid pointer-events-none absolute inset-0 opacity-[0.3] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative w-full max-w-sm px-6 text-center">
        <div className="mb-6 flex justify-center">
          <Logo withWordmark={false} />
        </div>
        <h2 className="font-display text-xl font-semibold">
          Analysing your business
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The Decision Intelligence Framework is scoring your readiness.
        </p>

        <ul className="mt-8 space-y-2 text-left">
          {STEPS.map((label, i) => {
            const complete = i < done;
            const active = i === done;
            return (
              <motion.li
                key={label}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: complete || active ? 1 : 0.4 }}
                className="flex items-center gap-3 text-sm"
              >
                {complete ? (
                  <CheckCircle2 className="size-4 text-success" />
                ) : active ? (
                  <Loader2 className="size-4 animate-spin text-brand" />
                ) : (
                  <span className="size-4 rounded-full border border-muted-foreground/30" />
                )}
                <span className={complete || active ? "" : "text-muted-foreground"}>
                  {label}
                </span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
