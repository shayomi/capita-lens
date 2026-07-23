"use client";

import { motion } from "framer-motion";
import { Card } from "@capita/ui";

/**
 * Calm hero visual: the business seen "through a lender's eyes". Deliberately
 * qualitative, not a wall of numbers: a single readiness read plus the
 * questions a lender is actually asking.
 */
const LENDER_QUESTIONS = [
  { q: "Can they afford to repay new debt?", verdict: "Likely", tone: "ok" },
  { q: "Is their cash flow well managed?", verdict: "Some concerns", tone: "warn" },
  { q: "Is the evidence there to back it up?", verdict: "Gaps found", tone: "risk" },
  { q: "Is the business well governed?", verdict: "On track", tone: "ok" },
] as const;

const TONE: Record<string, { dot: string; text: string }> = {
  ok: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  warn: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  risk: { dot: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
};

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

export function LenderLens() {
  return (
    <Card className="overflow-hidden shadow-2xl ring-1 ring-black/5">
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-5 py-3">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand/60" />
          <span className="relative inline-flex size-2 rounded-full bg-brand" />
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Through a lender&apos;s eyes
        </span>
      </div>

      <div className="space-y-1 p-5">
        <p className="mb-3 text-sm text-muted-foreground">
          Before they lend a penny, this is what they&apos;re really asking:
        </p>
        {LENDER_QUESTIONS.map((item, i) => {
          const tone = TONE[item.tone]!;
          return (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.15 + i * 0.12 }}
              className="flex items-center justify-between gap-4 rounded-lg px-3 py-3 odd:bg-muted/30"
            >
              <span className="text-sm font-medium">{item.q}</span>
              <span className={`flex shrink-0 items-center gap-1.5 text-xs font-medium ${tone.text}`}>
                <span className={`size-1.5 rounded-full ${tone.dot}`} />
                {item.verdict}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="border-t border-border/60 bg-brand-muted/40 px-5 py-4">
        <p className="text-sm">
          <span className="font-semibold text-brand">Capita-Lens</span> answers
          every one of these for you, and shows you how to turn a{" "}
          <span className="font-medium">no</span> into a{" "}
          <span className="font-medium">yes</span>.
        </p>
      </div>
    </Card>
  );
}
