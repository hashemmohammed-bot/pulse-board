import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenuePoint } from "../types";
import { compactCurrency, currency, monthLabel } from "../format";

const AXIS = { stroke: "transparent", tick: { fill: "#6b7280", fontSize: 13 } };

export function RevenueChart({ series }: { series: RevenuePoint[] }) {
  const points = series.map((p) => ({ ...p, label: monthLabel(p.month) }));
  const first = points[0]?.label ?? "";
  const last = points[points.length - 1]?.label ?? "";

  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="text-lg font-bold tracking-tight">Revenue vs target</h2>
      <p className="mt-1 text-sm text-muted">Monthly recurring revenue, last 12 months</p>

      <div className="mt-4 flex items-center gap-6 text-sm">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-brand-500" aria-hidden="true" />
          Revenue
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-chart-target" aria-hidden="true" />
          Target
        </span>
      </div>

      {/*
        Fixed height on the wrapper: ResponsiveContainer warns to the console when
        its parent resolves to zero height, and the acceptance test fails on any
        console.error.
      */}
      <div
        data-testid="revenue-chart"
        aria-label={`Revenue versus target, monthly recurring revenue from ${first} to ${last}`}
        role="img"
        className="mt-4 h-[320px] w-full"
      >
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <CartesianGrid vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="label" {...AXIS} tickLine={false} axisLine={false} />
            <YAxis
              {...AXIS}
              tickLine={false}
              axisLine={false}
              width={60}
              tickFormatter={(v: number) => (v === 0 ? "0" : compactCurrency(v))}
            />
            <Tooltip
              cursor={{ fill: "rgba(91,91,214,0.08)" }}
              formatter={(value, name) => [currency(Number(value)), String(name)]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e3e6ef",
                fontSize: 13,
              }}
            />
            <Bar dataKey="revenue" name="Revenue" fill="var(--color-chart-bar)" radius={[4, 4, 0, 0]} maxBarSize={56} />
            <Line
              dataKey="target"
              name="Target"
              stroke="var(--color-chart-target)"
              strokeWidth={2}
              dot={{ r: 4, fill: "#ffffff", stroke: "var(--color-chart-target)", strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
