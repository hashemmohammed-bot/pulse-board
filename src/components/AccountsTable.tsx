import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import * as stylex from "@stylexjs/stylex";
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
import { colors } from "@/styles/tokens.stylex";
import { card, cardSubtitle, cardTitle, numeric, pr, right, sectionHead } from "@/styles/shared";
import { useDataLabel } from "@/i18n/labels";

type SortKey = "name" | "plan" | "region" | "owner" | "mrr" | "seats" | "status" | "health";
type SortState = { key: SortKey; dir: "asc" | "desc" } | null;

const styles = stylex.create({
  filter: { maxWidth: "320px" },
  tableWrap: { marginTop: "16px" },
  table: { minWidth: "820px" },
  sortButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderStyle: "none",
    padding: 0,
    font: "inherit",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    color: { default: colors.muted, ":hover": colors.ink },
    outline: { default: "none", ":focus-visible": `2px solid ${colors.brand500}` },
  },
  sortActive: { color: colors.ink },
  sortNumeric: { flexDirection: "row-reverse" },
  row: {
    cursor: "pointer",
    backgroundColor: { default: null, ":hover": colors.brand50 },
  },
  name: { fontWeight: 600 },
  empty: { paddingBlock: "48px", textAlign: "center", color: colors.muted },
});

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
  const label = useDataLabel();
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
    <section {...stylex.props(card)}>
      <div {...stylex.props(sectionHead)}>
        <div>
          <h2 {...stylex.props(cardTitle)}>{t("accounts.title")}</h2>
          <p {...stylex.props(cardSubtitle)}>{t("accounts.count", { count: rows.length })}</p>
        </div>
        <Input
          data-testid="table-filter"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("accounts.filterPlaceholder")}
          aria-label={t("accounts.filterLabel")}
          sx={styles.filter}
        />
      </div>

      <div {...stylex.props(styles.tableWrap)}>
        <Table data-testid="accounts-table" sx={styles.table}>
          <TableHeader>
            <TableRow head>
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
                  sx={[col.key === "health" ? null : pr, col.numeric ? right : null]}
                >
                  <button
                    type="button"
                    data-testid={`sort-${col.key}`}
                    onClick={() => toggleSort(col.key)}
                    {...stylex.props(
                      styles.sortButton,
                      col.numeric && styles.sortNumeric,
                      sort?.key === col.key && styles.sortActive,
                    )}
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
                sx={styles.row}
              >
                <TableCell sx={[pr, styles.name]}>{a.name}</TableCell>
                <TableCell sx={pr}>{label("plan", a.plan)}</TableCell>
                <TableCell sx={pr}>{a.region}</TableCell>
                <TableCell sx={pr}>{a.owner}</TableCell>
                <TableCell data-testid="cell-mrr" sx={[pr, numeric]}>
                  {currency(a.mrr)}
                </TableCell>
                <TableCell sx={[pr, numeric]}>{a.seats}</TableCell>
                <TableCell sx={pr}>
                  <StatusBadge status={a.status} />
                </TableCell>
                <TableCell sx={right}>
                  <HealthBar score={a.health} />
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell data-testid="table-empty" colSpan={COLUMNS.length} sx={styles.empty}>
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
