"use client";

import { Card } from "@/components/ui/card";
import { TrendingDown, CheckCircle, Clock } from "lucide-react";
import { useExpenseSummary } from "@/features/financials/hooks/use-financials";

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function ExpenseKpis() {
    const { data } = useExpenseSummary();

    const kpis = [
        {
            label: "Total Expenses",
            value: formatLkr(data?.totalExpenses ?? 0),
            icon: TrendingDown,
            iconClass: "text-gray-500 dark:text-gray-400",
            valueClass: "text-gray-900 dark:text-gray-100",
            bgClass: "bg-gray-100 dark:bg-gray-700",
        },
        {
            label: "Paid Amount",
            value: formatLkr(data?.paid ?? 0),
            icon: CheckCircle,
            iconClass: "text-emerald-600 dark:text-emerald-400",
            valueClass: "text-emerald-600 dark:text-emerald-400",
            bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
            label: "To Be Paid",
            value: formatLkr(data?.pending ?? 0),
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
