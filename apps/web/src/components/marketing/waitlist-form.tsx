"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button, Input, cn } from "@capita/ui";
import { joinWaitlist } from "@/app/(marketing)/actions";

interface Props {
  source: string;
  tone?: "light" | "dark";
  className?: string;
}

/** Email capture for the waitlist. Works on light surfaces and dark bands. */
export function WaitlistForm({ source, tone = "light", className }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);
  const dark = tone === "dark";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMessage(null);
    const res = await joinWaitlist({ email, source });
    if (res.ok) {
      setState("done");
    } else {
      setState("error");
      setMessage(res.error ?? "Something went wrong.");
    }
  }

  if (state === "done") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md px-4 py-3 text-sm",
          dark ? "bg-white/10 text-white" : "bg-success/10 text-success",
          className,
        )}
      >
        <Check className="size-4" />
        You&apos;re on the list. We&apos;ll be in touch soon.
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        {dark ? (
          <input
            type="email"
            required
            placeholder="you@business.co.uk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 flex-1 rounded-md border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
        ) : (
          <Input
            type="email"
            required
            placeholder="you@business.co.uk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 flex-1 text-sm"
          />
        )}
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
      </form>
      {message ? (
        <p className={cn("mt-2 text-xs", dark ? "text-rose-300" : "text-danger")}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
