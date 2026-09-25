import * as React from "react";
import { cn } from "../lib/cn";

export interface LogoProps {
  className?: string;
  /** Show the wordmark next to the mark. */
  withWordmark?: boolean;
}

/** Sadora-Lens mark: a lens aperture over a rising bar — readiness in focus. */
export function Logo({ className, withWordmark = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <rect width="26" height="26" rx="7" fill="hsl(var(--primary))" />
        <circle
          cx="13"
          cy="13"
          r="6.5"
          stroke="hsl(var(--brand))"
          strokeWidth="2"
        />
        <path
          d="M10 15.5V12M13 15.5V9.5M16 15.5v-2"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      {withWordmark ? (
        <span className="font-display text-[15px] font-semibold tracking-tight">
          Sadora<span className="text-brand">Lens</span>
        </span>
      ) : null}
    </span>
  );
}
