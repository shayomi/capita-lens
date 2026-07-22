import * as React from "react";
import { cn } from "../lib/cn";
import { Card } from "./card";

export interface StatProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  trend?: { value: string; direction: "up" | "down" | "flat" };
  icon?: React.ReactNode;
  className?: string;
}

const TREND_COLOR = {
  up: "text-success",
  down: "text-danger",
  flat: "text-muted-foreground",
} as const;

/** Compact KPI tile for dashboards (user + admin). */
export function Stat({ label, value, hint, trend, icon, className }: StatProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {icon ? <span className="text-muted-foreground">{icon}</span> : null}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="tabular font-display text-2xl font-semibold">
          {value}
        </span>
        {trend ? (
          <span className={cn("text-xs font-medium", TREND_COLOR[trend.direction])}>
            {trend.value}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </Card>
  );
}
