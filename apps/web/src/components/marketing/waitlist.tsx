import { DEMO_URL } from "@/lib/marketing";
import { WaitlistForm } from "./waitlist-form";

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

        <div className="w-full max-w-md pt-2">
          <WaitlistForm source="landing_cta" tone="dark" />
        </div>

        <a
          href={DEMO_URL}
          className="text-sm text-primary-foreground/80 underline-offset-4 hover:underline"
        >
          or book a demo
        </a>
      </div>
    </section>
  );
}
