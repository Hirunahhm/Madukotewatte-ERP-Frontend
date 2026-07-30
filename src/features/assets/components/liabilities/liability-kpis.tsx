"use client";

import { Card } from "@/components/ui/card";
import { Landmark, CreditCard, AlertCircle, Loader2 } from "lucide-react";
import { useLoanBalances } from "@/features/assets/hooks/use-assets";

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function LiabilityKpis() {
    const { data: balances, isLoading } = useLoanBalances();

    const currentLoans = (balances ?? [])
        .filter((b) => b.loanType === "Loan-mom" || b.loanType === "Loan-other")
        .reduce((sum, b) => sum + b.balance, 0);
    const peoplesCard = balances?.find((b) => b.loanType === "credit-card - Peoples")?.balance ?? 0;
    const sampathCard = balances?.find((b) => b.loanType === "credit-card - Sampath")?.balance ?? 0;

    const kpis = [
        {
            label: "Current Loans",
            value: formatLkr(currentLoans),
            icon: Landmark,
            iconClass: "text-gray-500 dark:text-gray-400",
            valueClass: "text-gray-900 dark:text-gray-100",
            bgClass: "bg-gray-100 dark:bg-gray-700",
        },
        {
            label: "Peoples Credit Card",
            value: formatLkr(peoplesCard),
            icon: CreditCard,
            iconClass: "text-amber-600 dark:text-amber-400",
            valueClass: "text-amber-600 dark:text-amber-400",
            bgClass: "bg-amber-50 dark:bg-amber-900/20",
        },
        {
            label: "Sampath Credit Card",
            value: formatLkr(sampathCard),
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
