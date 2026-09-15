import { useMemo, useState } from "react";
import type { Account } from "../types";
import { currency } from "../format";
import { Badge } from "./Badge";
import { HealthBar } from "./HealthBar";

type SortKey = "name" | "plan" | "region" | "owner" | "mrr" | "seats" | "status" | "health";
type SortState = { key: SortKey; dir: "asc" | "desc" } | null;

const COLUMNS: { key: SortKey; label: string; numeric?: boolean }[] = [
  { key: "name", label: "Account" },
  { key: "plan", label: "Plan" },
  { key: "region", label: "Region" },
  { key: "owner", label: "Owner" },
  { key: "mrr", label: "MRR", numeric: true },
  { key: "seats", label: "Seats", numeric: true },
  { key: "status", label: "Status" },
  { key: "health", label: "Health", numeric: true },
];

/** The five fields the acceptance test expects the filter to search. */
const FILTER_FIELDS: (keyof Account)[] = ["name", "owner", "plan", "region", "status"];

export function AccountsTable({
  accounts,
  onSelect,
}: {
  accounts: Account[];
  onSelect: (account: Account) => void;
}) {
  const [query, setQuery] = useState("");
  // Starts unsorted so the first click on a header sorts ascending.
  const [sort, setSort] = useState<SortState>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? accounts.filter((a) => FILTER_FIELDS.some((f) => String(a[f]).toLowerCase().includes(q)))
      : accounts;
    if (!sort) return filtered;

    const factor = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const x = a[sort.key];
      const y = b[sort.key];
      const cmp = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
      return cmp * factor;
    });
  }, [accounts, query, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((prev) => (prev?.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Accounts</h2>
          <p className="mt-1 text-sm text-muted">
            {rows.length} {rows.length === 1 ? "account" : "accounts"}
          </p>
        </div>
        <input
          data-testid="table-filter"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter accounts…"
          aria-label="Filter accounts by name, owner, plan, region or status"
          className="w-full max-w-xs rounded-xl border border-line bg-surface px-4 py-2.5 text-base outline-none placeholder:text-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table data-testid="accounts-table" className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={sort?.key === col.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                  className={`py-3 text-sm font-medium text-muted ${col.key === "health" ? "" : "pr-4"} ${
                    col.numeric ? "text-right" : ""
                  }`}
                >
                  <button
                    type="button"
                    data-testid={`sort-${col.key}`}
                    onClick={() => toggleSort(col.key)}
                    className={`inline-flex items-center gap-1 rounded transition hover:text-ink focus-visible:outline-2 focus-visible:outline-brand-600 ${
                      col.numeric ? "flex-row-reverse" : ""
                    } ${sort?.key === col.key ? "text-ink" : ""}`}
                  >
                    {col.label}
                    <span aria-hidden="true">{sort?.key === col.key ? (sort.dir === "asc" ? "↑" : "↓") : ""}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr
                key={a.id}
                data-testid="account-row"
                data-account-id={a.id}
                tabIndex={0}
                onClick={() => onSelect(a)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(a);
                  }
                }}
                className="cursor-pointer border-b border-line/70 transition last:border-0 hover:bg-brand-50/60 focus-visible:bg-brand-50"
              >
                <td className="py-3.5 pr-4 font-semibold">{a.name}</td>
                <td className="py-3.5 pr-4">{a.plan}</td>
                <td className="py-3.5 pr-4">{a.region}</td>
                <td className="py-3.5 pr-4">{a.owner}</td>
                <td data-testid="cell-mrr" className="py-3.5 pr-4 text-right tabular-nums">
                  {currency(a.mrr)}
                </td>
                <td className="py-3.5 pr-4 text-right tabular-nums">{a.seats}</td>
                <td className="py-3.5 pr-4">
                  <Badge label={a.status} />
                </td>
                <td className="py-3.5 text-right">
                  <HealthBar score={a.health} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td data-testid="table-empty" colSpan={COLUMNS.length} className="py-12 text-center text-muted">
                  No accounts match “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
