"use client";

import { Card } from "@/components/ui/card";
import { Landmark, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { useEstateLoans } from "@/features/assets/hooks/use-assets";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { formatLkr } from "@/features/accounts/utils/format";

export function LiabilityKpis() {
    const { data: accounts, isLoading } = useAccounts();
    const { data: loans, isLoading: loansLoading } = useEstateLoans();

    const cards = (accounts ?? []).filter((a) => a.type === "CREDIT_CARD" && a.isActive);
    const currentLoans = (loans ?? [])
        .filter((l) => l.isActive)
        .reduce((sum, l) => sum + l.currentBalance, 0);
    const cardsOwed = cards.reduce((sum, c) => sum + Math.max(-c.balance, 0), 0);
    const availableCredit = cards.reduce((sum, c) => sum + (c.availableCredit ?? 0), 0);

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
            label: "Owed on Credit Cards",
            value: formatLkr(cardsOwed),
            icon: CreditCard,
            iconClass: "text-amber-600 dark:text-amber-400",
            valueClass: "text-amber-600 dark:text-amber-400",
            bgClass: "bg-amber-50 dark:bg-amber-900/20",
        },
        {
            label: "Available Card Credit",
            value: formatLkr(availableCredit),
            icon: ShieldCheck,
            iconClass: "text-emerald-600 dark:text-emerald-400",
            valueClass: "text-emerald-600 dark:text-emerald-400",
            bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
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
                        {isLoading || loansLoading ? (
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
