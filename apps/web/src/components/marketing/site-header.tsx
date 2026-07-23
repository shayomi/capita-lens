"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo, Button, cn } from "@capita/ui";
import { DEMO_URL } from "@/lib/marketing";

const NAV = [
  { label: "The problem", href: "#problem" },
  { label: "Capital readiness", href: "#readiness" },
  { label: "How lenders assess", href: "#lenders" },
  { label: "Why we're different", href: "#difference" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/auth/sign-in">Sign in</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={DEMO_URL}>Book a demo</a>
          </Button>
          <Button asChild size="sm">
            <Link href="/auth/sign-up">Start free assessment</Link>
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border/60 md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="container flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={DEMO_URL}>Book a demo</a>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/sign-up">Start free assessment</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
