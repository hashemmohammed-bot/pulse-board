import type { Kpi } from "./types";

/** `$85,370` — whole dollars, matching the acceptance test's expectation. */
export const currency = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

/** `3.2%` from a fraction. */
export const percent = (n: number) => `${(n * 100).toFixed(1)}%`;

/** `+5.5%` / `-0.4%` from a fraction. */
export const delta = (n: number) => `${n >= 0 ? "+" : "-"}${Math.abs(n * 100).toFixed(1)}%`;

export const compactCurrency = (n: number) =>
  n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;

export function kpiValue(kpi: Kpi): string {
  switch (kpi.format) {
    case "currency":
      return currency(kpi.value);
    case "percent":
      return percent(kpi.value);
    case "number":
    case "score":
      return kpi.value.toLocaleString("en-US");
  }
}

/** True when the KPI moved in the direction the business wants. */
export const isGoodDelta = (kpi: Kpi) => (kpi.delta >= 0) === kpi.higherIsBetter;

/**
 * `May 22, 2023`. Date-only strings are split by hand so they are not pulled a
 * day backwards by the UTC-midnight parse in local timezones behind UTC.
 */
export function formatDate(iso: string | null, locale = "en-US"): string {
  if (!iso) return "—";
  const [datePart] = iso.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** `2026-03` -> `Mar`, for the chart axis. */
export function monthLabel(month: string, locale = "en-US"): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(locale, { month: "short" });
}

/** `Priya Raman` -> `PR`, for the users table avatars. */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
