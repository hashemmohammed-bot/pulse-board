import { useState } from "react";
import type { Account, DashboardData } from "../types";
import { KpiRow } from "../components/KpiRow";
import { RevenueChart } from "../components/RevenueChart";
import { AccountsTable } from "../components/AccountsTable";
import { DetailDrawer } from "../components/DetailDrawer";

export function Dashboard({ data }: { data: DashboardData }) {
  const [selected, setSelected] = useState<Account | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <KpiRow kpis={data.kpis} />
      <RevenueChart series={data.revenueSeries} />
      <AccountsTable accounts={data.accounts} onSelect={setSelected} />
      {selected && <DetailDrawer account={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
