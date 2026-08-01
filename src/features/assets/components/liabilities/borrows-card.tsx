"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { useLoanBalances, useLoanTransactions } from "@/features/assets/hooks/use-assets";
import { toLocalDateInputValue } from "@/lib/utils";

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function monthStart(): string {
    const now = new Date();
    return toLocalDateInputValue(new Date(now.getFullYear(), now.getMonth(), 1));
}

export function BorrowsCard() {
    const { data: balances } = useLoanBalances();
    const { data: borrowsThisMonth } = useLoanTransactions({ transactionType: "borrow", from: monthStart(), size: 200 });
    const { data: repaysThisMonth } = useLoanTransactions({ transactionType: "repay", from: monthStart(), size: 200 });

    const totalOutstanding = (balances ?? []).reduce((sum, b) => sum + b.balance, 0);
    const borrowedSum = (borrowsThisMonth?.content ?? []).reduce((sum, t) => sum + (t.newAmount - t.lastAmount), 0);
    const repaidSum = (repaysThisMonth?.content ?? []).reduce((sum, t) => sum + (t.lastAmount - t.newAmount), 0);
    const netChange = borrowedSum - repaidSum;

    const stats = [
        { label: "Total Outstanding", value: formatLkr(totalOutstanding), valueClass: "text-gray-900 dark:text-gray-100" },
        { label: "Repaid This Month", value: formatLkr(repaidSum), valueClass: "text-emerald-600 dark:text-emerald-400" },
        {
            label: "Net Credit Change",
            value: `${netChange >= 0 ? "+" : "−"} ${formatLkr(Math.abs(netChange))}`,
            valueClass: netChange >= 0 ? "text-amber-500 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400",
        },
    ];

    return (
        <Card className="p-6 shadow-sm gap-0 flex flex-col h-full">
            <CardTitle className="text-base font-semibold mb-4">Borrows &amp; Credit Growth</CardTitle>
            <div className="flex-1 grid grid-cols-1 gap-4">
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
