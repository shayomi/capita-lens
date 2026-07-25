"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

/** Semantic palette → HSL token, so charts inherit the design system. */
const TOKEN = {
  brand: "hsl(var(--brand))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  danger: "hsl(var(--danger))",
  info: "hsl(var(--info))",
  muted: "hsl(var(--muted-foreground))",
} as const;

export type ChartColor = keyof typeof TOKEN;

const AXIS = {
  fontSize: 11,
  stroke: "hsl(var(--muted-foreground))",
} as const;

const TOOLTIP_STYLE: React.CSSProperties = {
  borderRadius: 10,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--card))",
  fontSize: 12,
  boxShadow: "0 4px 16px -6px rgb(0 0 0 / 0.2)",
};

export interface TrendPoint {
  label: string;
  value: number;
}

/** Filled area chart for a single time series. */
export function TrendChart({
  data,
  color = "brand",
  height = 240,
  valueLabel = "Total",
}: {
  data: TrendPoint[];
  color?: ChartColor;
  height?: number;
  valueLabel?: string;
}) {
  const gradientId = React.useId();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={TOKEN[color]} stopOpacity={0.35} />
            <stop offset="100%" stopColor={TOKEN[color]} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="hsl(var(--border) / 0.6)"
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          {...AXIS}
          minTickGap={24}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={40}
          {...AXIS}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          labelStyle={{ color: "hsl(var(--muted-foreground))" }}
          formatter={(v: number) => [v, valueLabel]}
          cursor={{ stroke: "hsl(var(--border))" }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={TOKEN[color]}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export interface BreakdownDatum {
  label: string;
  value: number;
  color?: ChartColor;
}

/** Vertical bar chart for a small categorical breakdown. */
export function BarBreakdown({
  data,
  height = 240,
  defaultColor = "brand",
}: {
  data: BreakdownDatum[];
  height?: number;
  defaultColor?: ChartColor;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="hsl(var(--border) / 0.6)"
        />
        <XAxis dataKey="label" tickLine={false} axisLine={false} {...AXIS} />
        <YAxis
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={40}
          {...AXIS}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
          {data.map((d, i) => (
            <Cell key={i} fill={TOKEN[d.color ?? defaultColor]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
