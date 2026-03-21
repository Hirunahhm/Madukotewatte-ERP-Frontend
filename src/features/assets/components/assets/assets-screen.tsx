"use client";

import { AssetKpis } from "./asset-kpis";
import { LiquidityHistoryChart } from "./liquidity-history-chart";
import { OutflowsCard } from "./outflows-card";
import { BankBalances } from "./bank-balances";
import { CashWithdrawalForm } from "./cash-withdrawal-form";
import { BankTransactionsTable } from "./bank-transactions-table";

export function AssetsScreen() {
    return (
        <div className="space-y-6">
            <AssetKpis />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <LiquidityHistoryChart />
                </div>
                <OutflowsCard />
            </div>
            <BankBalances />
            <CashWithdrawalForm />
            <BankTransactionsTable />
        </div>
    );
}
