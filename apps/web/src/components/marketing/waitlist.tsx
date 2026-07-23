"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@capita/ui";
import { joinWaitlist } from "@/app/(marketing)/actions";
import { DEMO_URL } from "@/lib/marketing";

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMessage(null);
    const res = await joinWaitlist({ email, source: "landing_cta" });
    if (res.ok) {
      setState("done");
    } else {
      setState("error");
      setMessage(res.error ?? "Something went wrong.");
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-sm text-white">
        <Check className="size-4" />
        You&apos;re on the list. We&apos;ll be in touch soon.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        placeholder="you@business.co.uk"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-11 flex-1 rounded-md border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
      />
      <Button
        type="submit"
        size="lg"
        variant="brand"
        disabled={state === "loading"}
      >
        {state === "loading" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            Join waitlist
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
      {message ? (
        <p className="mt-1 text-xs text-rose-300 sm:absolute">{message}</p>
      ) : null}
    </form>
  );
}

export function WaitlistSection() {
  return (
    <section
      id="waitlist"
      className="relative overflow-hidden border-t border-border/60 bg-primary text-primary-foreground"
    >
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(650px_circle_at_50%_-20%,hsl(var(--brand)),transparent)]" />
      <div className="container relative flex flex-col items-center gap-6 py-24 text-center">
        <h2 className="max-w-2xl text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Stop guessing whether you&apos;re fundable.
        </h2>
        <p className="max-w-xl text-primary-foreground/70">
          Understand exactly why funding applications succeed or fail, and become
          ready before you approach a lender. Join the waitlist for early access.
        </p>

        <div className="w-full pt-2">
          <WaitlistForm />
        </div>

        <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
          <Button asChild size="lg" variant="secondary">
            <Link href="/auth/sign-up">Start free assessment</Link>
          </Button>
          <a
            href={DEMO_URL}
            className="text-sm text-primary-foreground/80 underline-offset-4 hover:underline"
          >
            or book a demo
          </a>
        </div>
      </div>
    </section>
  );
}
