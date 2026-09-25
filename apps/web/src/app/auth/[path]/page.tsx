import { AuthView } from "@neondatabase/auth-ui";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Badge, Logo } from "@sadora/ui";

export const dynamicParams = false;

const AUTH_COPY = {
  "sign-in": {
    badge: "Welcome back",
    title: "Pick up your readiness work exactly where you left it.",
    body: "Access your assessment, evidence gaps, and funding roadmap in one secure workspace.",
  },
  "sign-up": {
    badge: "Start your assessment",
    title: "Create your Capital Readiness Profile in minutes.",
    body: "See the signals lenders care about, then work through the actions that improve your position.",
  },
} as const;

const DEFAULT_COPY = {
  badge: "Secure access",
  title: "Manage your capital readiness workspace.",
  body: "Sign in securely to continue your assessment, evidence uploads, and funding preparation.",
};

const BENEFITS = [
  "Secure workspace",
  "Assessment progress saved",
  "Evidence stays organised",
];

/** Renders sign-in / sign-up / reset flows at /auth/sign-in, /auth/sign-up, … */
export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  const copy = AUTH_COPY[path as keyof typeof AUTH_COPY] ?? DEFAULT_COPY;

  return (
    <main className="relative min-h-screen overflow-hidden bg-muted/25">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

      <div className="container relative grid min-h-screen gap-8 py-6 lg:grid-cols-[0.82fr_1fr] lg:items-center lg:py-10">
        <section className="order-2 hidden max-w-md lg:block">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to overview
          </Link>

          <Badge variant="brand" className="mb-5">
            <ShieldCheck className="size-3" />
            {copy.badge}
          </Badge>
          <h1 className="text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight">
            {copy.title}
          </h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            {copy.body}
          </p>

          <div className="mt-8 grid gap-3">
            {BENEFITS.map((label) => (
              <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="order-1 flex min-h-[calc(100vh-3rem)] flex-col justify-center lg:order-2 lg:min-h-0">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <Link
              href="/"
              className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground shadow-sm transition hover:text-foreground"
              aria-label="Back to overview"
            >
              <ArrowLeft className="size-4" />
            </Link>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="mb-6 lg:hidden">
              <Badge variant="brand" className="mb-4">
                <ShieldCheck className="size-3" />
                {copy.badge}
              </Badge>
              <h1 className="text-balance font-display text-3xl font-bold leading-tight tracking-tight">
                {copy.title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {copy.body}
              </p>
            </div>

            <div className="rounded-lg border border-border/70 bg-background p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] ring-1 ring-black/5 sm:p-6 dark:shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
              <AuthView path={path} />
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:hidden">
              {BENEFITS.map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-md border border-border/70 bg-secondary/40 px-3 py-2 text-xs text-muted-foreground"
                >
                  <CheckCircle2 className="size-3.5 text-brand" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
