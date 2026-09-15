import { useTranslation } from "react-i18next";
import * as stylex from "@stylexjs/stylex";
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
import { colors, radius } from "@/styles/tokens.stylex";
import { card, cardSubtitle, cardTitle } from "@/styles/shared";

const styles = stylex.create({
  legend: { display: "flex", alignItems: "center", gap: "24px", marginTop: "16px", fontSize: "14px" },
  legendItem: { display: "flex", alignItems: "center", gap: "8px" },
  swatchBar: { height: "12px", width: "12px", borderRadius: "3px", backgroundColor: colors.brand500 },
  swatchLine: {
    height: "12px",
    width: "12px",
    borderRadius: radius.full,
    backgroundColor: colors.chartTarget,
  },
  // Fixed height: ResponsiveContainer warns to the console when its parent
  // resolves to zero height, and the acceptance test fails on any console.error.
  chart: { marginTop: "16px", height: "320px", width: "100%" },
});

/** Tick colour comes from global.css so it follows the theme. */
const AXIS = { stroke: "transparent", tick: { fontSize: 13 } };

export function RevenueChart({ series }: { series: RevenuePoint[] }) {
  const { t, i18n } = useTranslation();
  const locale = dateLocale(i18n.resolvedLanguage ?? "en");

  const points = series.map((p) => ({ ...p, label: monthLabel(p.month, locale) }));
  const first = points[0]?.label ?? "";
  const last = points[points.length - 1]?.label ?? "";

  return (
    <section {...stylex.props(card)}>
      <h2 {...stylex.props(cardTitle)}>{t("chart.title")}</h2>
      <p {...stylex.props(cardSubtitle)}>{t("chart.subtitle")}</p>

      <div {...stylex.props(styles.legend)}>
        <span {...stylex.props(styles.legendItem)}>
          <span aria-hidden="true" {...stylex.props(styles.swatchBar)} />
          {t("chart.revenue")}
        </span>
        <span {...stylex.props(styles.legendItem)}>
          <span aria-hidden="true" {...stylex.props(styles.swatchLine)} />
          {t("chart.target")}
        </span>
      </div>

      <div
        data-testid="revenue-chart"
        aria-label={t("chart.ariaLabel", { first, last })}
        role="img"
        {...stylex.props(styles.chart)}
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
              cursor={{ fill: `color-mix(in srgb, ${colors.brand500} 12%, transparent)` }}
              formatter={(value, name) => [currency(Number(value)), String(name)]}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${colors.line}`,
                background: colors.surface,
                color: colors.ink,
                fontSize: 13,
              }}
              itemStyle={{ color: colors.ink }}
              labelStyle={{ color: colors.muted }}
            />
            <Bar
              dataKey="revenue"
              name={t("chart.revenue")}
              fill={colors.chartBar}
              radius={[4, 4, 0, 0]}
              maxBarSize={56}
            />
            <Line
              dataKey="target"
              name={t("chart.target")}
              stroke={colors.chartTarget}
              strokeWidth={2}
              dot={{ r: 4, fill: "#ffffff", stroke: colors.chartTarget, strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
