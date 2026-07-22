import Link from "next/link";
import { Logo } from "@capita/ui";

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
            title="Product"
            links={[
              ["How it works", "#how"],
              ["Readiness", "#readiness"],
              ["Pricing", "#pricing"],
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              ["About", "#"],
              ["Contact", "#"],
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
        <div className="container flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Capita-Lens. All rights reserved.</span>
          <span>Capita-Lens does not guarantee funding approval.</span>
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
