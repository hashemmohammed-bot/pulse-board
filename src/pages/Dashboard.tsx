import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
import type { Account } from "@/types";
import { KpiRow } from "@/components/KpiRow";
import { RevenueChart } from "@/components/RevenueChart";
import { AccountsTable } from "@/components/AccountsTable";
import { AccountDialog } from "@/components/AccountDialog";
import { useAppState } from "@/app-context";
import { stack } from "@/styles/shared";

export function Dashboard() {
  const { data } = useAppState();
  const [selected, setSelected] = useState<Account | null>(null);

  return (
    <div {...stylex.props(stack)}>
      <KpiRow kpis={data.kpis} />
      <RevenueChart series={data.revenueSeries} />
      <AccountsTable accounts={data.accounts} onSelect={setSelected} />
      {selected && <AccountDialog account={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
