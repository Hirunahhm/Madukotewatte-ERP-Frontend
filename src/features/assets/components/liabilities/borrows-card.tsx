"use client";

import { Card, CardTitle } from "@/components/ui/card";
const stats = [
    { label: "Total Outstanding", value: "LKR 215,400", valueClass: "text-gray-900 dark:text-gray-100" },
    { label: "Interest Accrued MTD", value: "LKR 4,820", valueClass: "text-red-500 dark:text-red-400" },
    { label: "Repaid This Month", value: "LKR 28,000", valueClass: "text-emerald-600 dark:text-emerald-400" },
    { label: "Net Credit Change", value: "+ LKR 32,400", valueClass: "text-amber-500 dark:text-amber-400" },
];

export function BorrowsCard() {
    return (
        <Card className="p-6 shadow-sm gap-0 flex flex-col h-full">
            <CardTitle className="text-base font-semibold mb-4">Borrows &amp; Credit Growth</CardTitle>
            <div className="flex-1 grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="space-y-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <p className="text-[11px] font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase">{stat.label}</p>
                        <p className={`text-base font-bold ${stat.valueClass}`}>{stat.value}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
}
