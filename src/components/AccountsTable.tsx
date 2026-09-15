import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Account } from "@/types";
import { currency } from "@/format";
import { StatusBadge } from "@/components/StatusBadge";
import { HealthBar } from "@/components/HealthBar";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SortKey = "name" | "plan" | "region" | "owner" | "mrr" | "seats" | "status" | "health";
type SortState = { key: SortKey; dir: "asc" | "desc" } | null;

const COLUMNS: { key: SortKey; numeric?: boolean }[] = [
  { key: "name" },
  { key: "plan" },
  { key: "region" },
  { key: "owner" },
  { key: "mrr", numeric: true },
  { key: "seats", numeric: true },
  { key: "status" },
  { key: "health", numeric: true },
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
  const { t } = useTranslation();
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
      const cmp =
        typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
      return cmp * factor;
    });
  }, [accounts, query, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((prev) =>
      prev?.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
    );

  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">{t("accounts.title")}</h2>
          <p className="mt-1 text-sm text-muted">{t("accounts.count", { count: rows.length })}</p>
        </div>
        <Input
          data-testid="table-filter"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("accounts.filterPlaceholder")}
          aria-label={t("accounts.filterLabel")}
          className="h-11 w-full max-w-xs rounded-xl bg-surface text-base"
        />
      </div>

      <div className="mt-4">
        <Table data-testid="accounts-table" className="min-w-[820px] text-left">
          <TableHeader>
            <TableRow className="border-line hover:bg-transparent">
              {COLUMNS.map((col) => (
                <TableHead
                  key={col.key}
                  aria-sort={
                    sort?.key === col.key
                      ? sort.dir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className={`text-sm font-medium text-muted ${col.key === "health" ? "" : "pr-4"} ${
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
                    {t(`accounts.columns.${col.key}`)}
                    <span aria-hidden="true">
                      {sort?.key === col.key ? (sort.dir === "asc" ? "↑" : "↓") : ""}
                    </span>
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((a) => (
              <TableRow
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
                className="cursor-pointer border-line/70 hover:bg-brand-50/60 focus-visible:bg-brand-50"
              >
                <TableCell className="py-3.5 pr-4 font-semibold">{a.name}</TableCell>
                <TableCell className="py-3.5 pr-4">{a.plan}</TableCell>
                <TableCell className="py-3.5 pr-4">{a.region}</TableCell>
                <TableCell className="py-3.5 pr-4">{a.owner}</TableCell>
                <TableCell
                  data-testid="cell-mrr"
                  className="py-3.5 pr-4 text-right tabular-nums"
                >
                  {currency(a.mrr)}
                </TableCell>
                <TableCell className="py-3.5 pr-4 text-right tabular-nums">{a.seats}</TableCell>
                <TableCell className="py-3.5 pr-4">
                  <StatusBadge label={a.status} />
                </TableCell>
                <TableCell className="py-3.5 text-right">
                  <HealthBar score={a.health} />
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  data-testid="table-empty"
                  colSpan={COLUMNS.length}
                  className="py-12 text-center text-muted"
                >
                  {t("accounts.empty", { query })}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
