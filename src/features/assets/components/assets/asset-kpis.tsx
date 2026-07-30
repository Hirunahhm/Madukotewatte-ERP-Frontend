"use client";

import { Card } from "@/components/ui/card";
import { Wallet, Building2, Clock, Loader2 } from "lucide-react";
import { useAssetBalances } from "@/features/assets/hooks/use-assets";
import { useSalesSummary, useExpenseSummary } from "@/features/financials/hooks/use-financials";

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function AssetKpis() {
    const { data: balances, isLoading } = useAssetBalances();
    const { data: salesSummary } = useSalesSummary();
    const { data: expenseSummary } = useExpenseSummary();

    const cashInHand = balances?.find((b) => b.assetType === "Cash")?.balance ?? 0;
    const bankBalance = (balances ?? [])
        .filter((b) => b.assetType !== "Cash")
        .reduce((sum, b) => sum + b.balance, 0);
    const pendingCashFlows = (salesSummary?.pending ?? 0) - (expenseSummary?.pending ?? 0);

    const kpis = [
        {
            label: "Cash In Hand",
            value: formatLkr(cashInHand),
            icon: Wallet,
            iconClass: "text-gray-500 dark:text-gray-400",
            valueClass: "text-gray-900 dark:text-gray-100",
            bgClass: "bg-gray-100 dark:bg-gray-700",
        },
        {
            label: "Bank Balance",
            value: formatLkr(bankBalance),
            icon: Building2,
            iconClass: "text-emerald-600 dark:text-emerald-400",
            valueClass: "text-emerald-600 dark:text-emerald-400",
            bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
            label: "Pending Cash Flows",
            value: formatLkr(pendingCashFlows),
            icon: Clock,
            iconClass: "text-amber-600 dark:text-amber-400",
            valueClass: "text-amber-600 dark:text-amber-400",
            bgClass: "bg-amber-50 dark:bg-amber-900/20",
        },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                    <Card key={kpi.label} className="p-5 shadow-sm gap-0">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">{kpi.label}</p>
                            <div className={`w-8 h-8 rounded-lg ${kpi.bgClass} flex items-center justify-center`}>
                                <Icon className={`w-4 h-4 ${kpi.iconClass}`} />
                            </div>
                        </div>
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                        ) : (
                            <p className={`text-xl font-bold ${kpi.valueClass}`}>{kpi.value}</p>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
