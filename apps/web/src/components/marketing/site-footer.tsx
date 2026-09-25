import Link from "next/link";
import { Logo } from "@sadora/ui";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:justify-between">
        <div className="max-w-xs space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">
            The UK&apos;s capital readiness platform. Assess, improve and
            approach funding with confidence.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
          <FooterCol
            title="Learn"
            links={[
              ["Why applications fail", "#problem"],
              ["Capital readiness", "#readiness"],
              ["Common lender factors", "#lenders"],
            ]}
          />
          <FooterCol
            title="Get started"
            links={[
              ["Join the waitlist", "#waitlist"],
              ["Sign in", "/auth/sign-in"],
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              ["Privacy", "#"],
              ["Terms", "#"],
            ]}
          />
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container flex flex-col gap-2 py-6 text-xs text-muted-foreground lg:flex-row lg:justify-between">
          <span>© {new Date().getFullYear()} Sadora-Lens. All rights reserved.</span>
          <span className="max-w-3xl">
            Sadora-Lens helps businesses improve their funding readiness but
            does not guarantee funding approval. Lending and investment decisions
            remain solely at the discretion of the relevant funding provider.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
        {title}
      </p>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
