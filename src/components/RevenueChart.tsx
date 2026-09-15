import { useTranslation } from "react-i18next";
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
import type { RevenuePoint } from "@/types";
import { compactCurrency, currency, monthLabel } from "@/format";
import { dateLocale } from "@/i18n";

/** Tick colour comes from CSS (see styles.css) so it follows the theme. */
const AXIS = { stroke: "transparent", tick: { fontSize: 13 } };

export function RevenueChart({ series }: { series: RevenuePoint[] }) {
  const { t, i18n } = useTranslation();
  const locale = dateLocale(i18n.resolvedLanguage ?? "en");

  const points = series.map((p) => ({ ...p, label: monthLabel(p.month, locale) }));
  const first = points[0]?.label ?? "";
  const last = points[points.length - 1]?.label ?? "";

  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="text-lg font-bold tracking-tight">{t("chart.title")}</h2>
      <p className="mt-1 text-sm text-muted">{t("chart.subtitle")}</p>

      <div className="mt-4 flex items-center gap-6 text-sm">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-brand-500" aria-hidden="true" />
          {t("chart.revenue")}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-chart-target" aria-hidden="true" />
          {t("chart.target")}
        </span>
      </div>

      {/*
        Fixed height on the wrapper: ResponsiveContainer warns to the console when
        its parent resolves to zero height, and the acceptance test fails on any
        console.error.
      */}
      <div
        data-testid="revenue-chart"
        aria-label={t("chart.ariaLabel", { first, last })}
        role="img"
        className="mt-4 h-[320px] w-full"
      >
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" {...AXIS} tickLine={false} axisLine={false} />
            <YAxis
              {...AXIS}
              tickLine={false}
              axisLine={false}
              width={60}
              tickFormatter={(v: number) => (v === 0 ? "0" : compactCurrency(v))}
            />
            <Tooltip
              cursor={{ fill: "color-mix(in srgb, var(--color-brand-500) 12%, transparent)" }}
              formatter={(value, name) => [currency(Number(value)), String(name)]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--color-line)",
                background: "var(--color-surface)",
                color: "var(--color-ink)",
                fontSize: 13,
              }}
              itemStyle={{ color: "var(--color-ink)" }}
              labelStyle={{ color: "var(--color-muted)" }}
            />
            <Bar
              dataKey="revenue"
              name={t("chart.revenue")}
              fill="var(--color-chart-bar)"
              radius={[4, 4, 0, 0]}
              maxBarSize={56}
            />
            <Line
              dataKey="target"
              name={t("chart.target")}
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
