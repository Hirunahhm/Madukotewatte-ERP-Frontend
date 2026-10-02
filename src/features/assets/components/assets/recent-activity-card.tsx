"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { chartColors } from "@/lib/theme";
import { useLedger } from "@/features/accounts/hooks/use-accounts";
import { CATEGORY_LABEL, formatLkr } from "@/features/accounts/utils/format";

export function RecentActivityCard() {
    const { data, isLoading } = useLedger({ page: 0, size: 6 });
    const entries = data?.content ?? [];

    return (
        <Card className="p-6 shadow-sm gap-0 flex flex-col h-full">
            <CardTitle className="text-base font-semibold mb-4">Recent activity</CardTitle>
            <div className="flex-1 space-y-3">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                    </div>
                ) : entries.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">Nothing recorded yet.</p>
                ) : entries.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{CATEGORY_LABEL[item.category]}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.accountCode} - {item.transactionDate}</p>
                        </div>
                        <p
                            className="text-sm font-semibold ml-4 shrink-0"
                            style={{ color: item.transactionType === "money in" ? chartColors.primary : chartColors.danger }}
                        >
                            {item.transactionType === "money in" ? "+" : "-"} {formatLkr(item.amount)}
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
}
