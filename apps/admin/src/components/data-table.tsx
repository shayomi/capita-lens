import * as React from "react";
import { cn } from "@capita/ui";

/** Minimal, dense enterprise table primitives shared across admin lists. */
export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
      {children}
    </thead>
  );
}

export function TH({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <th className={cn("px-4 py-3 font-medium", className)}>{children}</th>;
}

export function TRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={cn(
        "border-t border-border/60 transition-colors hover:bg-accent/40",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function TD({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>;
}

export function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <tr className="border-t border-border/60">
      <td
        colSpan={colSpan}
        className="px-4 py-12 text-center text-sm text-muted-foreground"
      >
        {label}
      </td>
    </tr>
  );
}
