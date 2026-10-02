"use client";

import { Card } from "@/components/ui/card";
import { DollarSign, Clock, CheckCircle, CreditCard, HandCoins, Loader2 } from "lucide-react";
import { usePaymentSummary } from "@/features/employees/hooks/use-payment-summary";

function formatLkr(value: number) {
    return `LKR ${Math.round(value).toLocaleString()}`;
}

export function PaymentKpis() {
    const { data, isLoading } = usePaymentSummary();

    const kpis = [
        {
            label: "Fixed Salary Cost / month",
            value: data ? formatLkr(data.totalSalaryCost) : "-",
            icon: DollarSign,
            iconClass: "text-gray-500 dark:text-gray-400",
            valueClass: "text-gray-900 dark:text-gray-100",
            bgClass: "bg-gray-100 dark:bg-gray-700",
        },
        {
            label: "Paid This Month (net)",
            value: data ? formatLkr(data.payrollPaidNet) : "-",
            hint: data ? `Gross ${formatLkr(data.payrollPaidGross)}` : undefined,
            icon: CheckCircle,
            iconClass: "text-emerald-600 dark:text-emerald-400",
            valueClass: "text-emerald-600 dark:text-emerald-400",
            bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
            label: "Unpaid Earnings (month to date)",
            value: data ? formatLkr(data.unpaidEarnings) : "-",
            icon: Clock,
            iconClass: "text-amber-600 dark:text-amber-400",
            valueClass: "text-amber-600 dark:text-amber-400",
            bgClass: "bg-amber-50 dark:bg-amber-900/20",
        },
        {
            label: "Outstanding Advances",
            value: data ? formatLkr(data.outstandingAdvances) : "-",
            icon: HandCoins,
            iconClass: "text-purple-600 dark:text-purple-400",
            valueClass: "text-purple-600 dark:text-purple-400",
            bgClass: "bg-purple-50 dark:bg-purple-900/20",
        },
        {
            label: "Employee Loans Outstanding",
            value: data ? formatLkr(data.activeEmployeeLoansTotal) : "-",
            icon: CreditCard,
            iconClass: "text-blue-600 dark:text-blue-400",
            valueClass: "text-blue-600 dark:text-blue-400",
            bgClass: "bg-blue-50 dark:bg-blue-900/20",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                    <Card key={kpi.label} className="p-5 shadow-sm gap-0">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[11px] font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">{kpi.label}</p>
                            <div className={`w-8 h-8 rounded-lg ${kpi.bgClass} flex items-center justify-center`}>
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : <Icon className={`w-4 h-4 ${kpi.iconClass}`} />}
                            </div>
                        </div>
                        <p className={`text-xl font-bold ${kpi.valueClass}`}>{kpi.value}</p>
                        {kpi.hint && <p className="text-[11px] text-gray-400 mt-0.5">{kpi.hint}</p>}
                    </Card>
                );
            })}
        </div>
    );
}
