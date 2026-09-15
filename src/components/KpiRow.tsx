import { useTranslation } from "react-i18next";
import * as stylex from "@stylexjs/stylex";
import type { Kpi } from "@/types";
import { delta, isGoodDelta, kpiValue } from "@/format";
import { colors, radius } from "@/styles/tokens.stylex";

const styles = stylex.create({
  row: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: {
      default: "1fr",
      "@media (min-width: 640px)": "repeat(2, minmax(0, 1fr))",
      "@media (min-width: 1024px)": "repeat(4, minmax(0, 1fr))",
    },
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.line,
    padding: "24px",
  },
  label: { margin: 0, fontSize: "16px", color: colors.muted },
  value: { margin: 0, marginTop: "8px", fontSize: "36px", fontWeight: 700, letterSpacing: "-0.02em" },
  deltaRow: {
    margin: 0,
    marginTop: "12px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
  },
  good: { fontWeight: 600, color: colors.good },
  bad: { fontWeight: 600, color: colors.bad },
  muted: { color: colors.muted },
});

export function KpiRow({ kpis }: { kpis: Kpi[] }) {
  const { t } = useTranslation();

  return (
    <section data-testid="kpi-row" aria-label={t("kpi.rowLabel")} {...stylex.props(styles.row)}>
      {kpis.map((kpi) => {
        const good = isGoodDelta(kpi);
        return (
          <article key={kpi.id} data-testid="kpi-card" {...stylex.props(styles.card)}>
            {/* The label comes from the dataset and is deliberately not translated. */}
            <p {...stylex.props(styles.label)}>{kpi.label}</p>
            <p {...stylex.props(styles.value)}>{kpiValue(kpi)}</p>
            <p {...stylex.props(styles.deltaRow)}>
              <span {...stylex.props(good ? styles.good : styles.bad)}>
                <span aria-hidden="true">{kpi.delta >= 0 ? "▲" : "▼"}</span> {delta(kpi.delta)}
              </span>
              <span {...stylex.props(styles.muted)}>{t("kpi.vsLastMonth")}</span>
            </p>
          </article>
        );
      })}
    </section>
  );
}
