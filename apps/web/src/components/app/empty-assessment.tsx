import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card, Button } from "@sadora/ui";

/** Shown on the dashboard before the user completes their first assessment. */
export function EmptyAssessment() {
  return (
    <Card className="mx-auto max-w-2xl p-10 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand-muted text-brand">
        <Sparkles className="size-6" />
      </span>
      <h2 className="mt-5 font-display text-2xl font-semibold">
        Let&apos;s measure your capital readiness
      </h2>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">
        Answer a guided assessment the way a lender would see you. It takes
        about 15 to 20 minutes, and you can save and continue anytime.
      </p>
      <Button asChild size="lg" className="mt-6">
        <Link href="/assessment">
          Start assessment
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </Card>
  );
}
