"use client";

import { Card } from "@/components/ui/card";
import { Landmark, CreditCard, AlertCircle } from "lucide-react";
import { useUiStore, type AssetsTimeframe } from "@/stores/ui-store";

const loanValues: Record<AssetsTimeframe, string> = {
    monthly: "LKR 124,800",
    quarterly: "LKR 374,400",
    annually: "LKR 1,497,600",
};

const peoplesCardValues: Record<AssetsTimeframe, string> = {
    monthly: "LKR 38,200",
    quarterly: "LKR 114,600",
    annually: "LKR 458,400",
};

const sampathCardValues: Record<AssetsTimeframe, string> = {
    monthly: "LKR 52,400",
    quarterly: "LKR 157,200",
    annually: "LKR 628,800",
};

export function LiabilityKpis() {
    const timeframe = useUiStore((state) => state.assetsTimeframe);

    const kpis = [
        {
            label: "Current Loans",
            value: loanValues[timeframe],
            icon: Landmark,
            iconClass: "text-gray-500 dark:text-gray-400",
            valueClass: "text-gray-900 dark:text-gray-100",
            bgClass: "bg-gray-100 dark:bg-gray-700",
        },
        {
            label: "Peoples Credit Card",
            value: peoplesCardValues[timeframe],
            icon: CreditCard,
            iconClass: "text-amber-600 dark:text-amber-400",
            valueClass: "text-amber-600 dark:text-amber-400",
            bgClass: "bg-amber-50 dark:bg-amber-900/20",
        },
        {
            label: "Sampath Credit Card",
            value: sampathCardValues[timeframe],
            icon: AlertCircle,
            iconClass: "text-red-500 dark:text-red-400",
            valueClass: "text-red-500 dark:text-red-400",
            bgClass: "bg-red-50 dark:bg-red-900/20",
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
