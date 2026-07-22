import * as React from "react";
import { cn } from "../lib/cn";

const STATUS_COLOR: Record<string, string> = {
  critical: "hsl(var(--danger))",
  attention: "hsl(var(--warning))",
  on_track: "hsl(var(--info))",
  excellent: "hsl(var(--success))",
};

export interface ScoreRingProps {
  /** 0–100 */
  value: number;
  size?: number;
  strokeWidth?: number;
  status?: "critical" | "attention" | "on_track" | "excellent";
  label?: string;
  className?: string;
}

/**
 * The signature Capital Readiness gauge. SVG ring with the score centred —
 * used large on the dashboard and small in cards. Color follows status band.
 */
export function ScoreRing({
  value,
  size = 200,
  strokeWidth = 14,
  status = "on_track",
  label,
  className,
}: ScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const color = STATUS_COLOR[status] ?? STATUS_COLOR.on_track;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tabular font-display text-4xl font-bold leading-none">
          {Math.round(clamped)}
        </span>
        {label ? (
          <span className="mt-1 text-2xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
