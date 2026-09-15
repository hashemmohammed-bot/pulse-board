import type { Kpi } from "../types";
import { delta, isGoodDelta, kpiValue } from "../format";

export function KpiRow({ kpis }: { kpis: Kpi[] }) {
  return (
    <section
      data-testid="kpi-row"
      aria-label="Key performance indicators"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      {kpis.map((kpi) => {
        const good = isGoodDelta(kpi);
        return (
          <article
            key={kpi.id}
            data-testid="kpi-card"
            className="rounded-2xl border border-line bg-surface p-6"
          >
            <p className="text-base text-muted">{kpi.label}</p>
            <p className="mt-2 text-4xl font-bold tracking-tight">{kpiValue(kpi)}</p>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className={`font-semibold ${good ? "text-good" : "text-bad"}`}>
                <span aria-hidden="true">{kpi.delta >= 0 ? "▲" : "▼"}</span> {delta(kpi.delta)}
              </span>
              <span className="text-muted">vs last month</span>
            </p>
          </article>
        );
      })}
    </section>
  );
}
