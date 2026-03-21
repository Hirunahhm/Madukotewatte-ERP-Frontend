"use client";

import { Card } from "@/components/ui/card";
import { Wallet, Building2, Clock } from "lucide-react";
import { useUiStore, type AssetsTimeframe } from "@/stores/ui-store";

const cashInHand: Record<AssetsTimeframe, string> = {
    monthly: "LKR 48,200",
    quarterly: "LKR 156,800",
    annually: "LKR 624,000",
};

const pendingCashFlows: Record<AssetsTimeframe, string> = {
    monthly: "LKR 124,500",
    quarterly: "LKR 318,200",
    annually: "LKR 1,248,000",
};

export function AssetKpis() {
    const timeframe = useUiStore((state) => state.assetsTimeframe);

    const kpis = [
        {
            label: "Cash In Hand",
            value: cashInHand[timeframe],
            icon: Wallet,
            iconClass: "text-gray-500 dark:text-gray-400",
            valueClass: "text-gray-900 dark:text-gray-100",
            bgClass: "bg-gray-100 dark:bg-gray-700",
        },
        {
            label: "Bank Balance",
            value: "LKR 842,300",
            icon: Building2,
            iconClass: "text-emerald-600 dark:text-emerald-400",
            valueClass: "text-emerald-600 dark:text-emerald-400",
            bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
            label: "Pending Cash Flows",
            value: pendingCashFlows[timeframe],
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
                        <p className={`text-xl font-bold ${kpi.valueClass}`}>{kpi.value}</p>
                    </Card>
                );
            })}
        </div>
    );
}
