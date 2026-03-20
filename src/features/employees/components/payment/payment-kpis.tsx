"use client";

import { Card } from "@/components/ui/card";
import { DollarSign, Clock, CheckCircle, CreditCard } from "lucide-react";

const kpis = [
    {
        label: "Total Salary Cost",
        value: "LKR 284,500",
        icon: DollarSign,
        iconClass: "text-gray-500 dark:text-gray-400",
        valueClass: "text-gray-900 dark:text-gray-100",
        bgClass: "bg-gray-100 dark:bg-gray-700",
    },
    {
        label: "To Be Paid",
        value: "LKR 142,200",
        icon: Clock,
        iconClass: "text-amber-600 dark:text-amber-400",
        valueClass: "text-amber-600 dark:text-amber-400",
        bgClass: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
        label: "Paid Amount",
        value: "LKR 142,300",
        icon: CheckCircle,
        iconClass: "text-emerald-600 dark:text-emerald-400",
        valueClass: "text-emerald-600 dark:text-emerald-400",
        bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
        label: "Active Employee Loans",
        value: "LKR 68,000",
        icon: CreditCard,
        iconClass: "text-blue-600 dark:text-blue-400",
        valueClass: "text-blue-600 dark:text-blue-400",
        bgClass: "bg-blue-50 dark:bg-blue-900/20",
    },
];

export function PaymentKpis() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
