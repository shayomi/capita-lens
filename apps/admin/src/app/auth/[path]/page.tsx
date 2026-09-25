import { AuthView } from "@neondatabase/auth-ui";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Badge, Logo } from "@sadora/ui";

export const dynamicParams = false;

const AUTH_COPY = {
  "sign-in": {
    badge: "Admin access",
    title: "Sign in to manage Sadora-Lens operations.",
    body: "Review submissions, templates, users, and readiness data from the admin console.",
  },
  "sign-up": {
    badge: "Admin setup",
    title: "Create an authorised admin account.",
    body: "Admin access is restricted to approved operators and internal teams.",
  },
} as const;

const DEFAULT_COPY = {
  badge: "Secure admin",
  title: "Continue to the Sadora-Lens admin console.",
  body: "Use your authorised account to access operational controls and platform records.",
};

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  const copy = AUTH_COPY[path as keyof typeof AUTH_COPY] ?? DEFAULT_COPY;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="surface-grid pointer-events-none absolute inset-0 opacity-[0.22] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />

      <div className="container relative grid min-h-screen gap-8 py-6 lg:grid-cols-[0.82fr_1fr] lg:items-center lg:py-10">
        <section className="hidden max-w-md lg:block">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to admin
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

          <div className="mt-8 rounded-lg border border-border/70 bg-card/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.32)] ring-1 ring-white/5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-brand-muted text-brand">
                <LockKeyhole className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Protected operations</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Role-based access for internal workflows.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {["Template control", "Submission review", "User management"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="flex min-h-[calc(100vh-3rem)] flex-col justify-center lg:min-h-0">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <Link
              href="/"
              className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground shadow-sm transition hover:text-foreground"
              aria-label="Back to admin"
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

            <div className="rounded-lg border border-border/70 bg-card p-4 shadow-[0_24px_70px_rgba(0,0,0,0.42)] ring-1 ring-white/5 sm:p-6">
              <AuthView path={path} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
