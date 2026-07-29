"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { chartColors } from "@/lib/theme";
import { useMonetaryTransactions } from "@/features/assets/hooks/use-assets";
import { useUiStore } from "@/stores/ui-store";

const TIMEFRAME_DAYS: Record<string, number> = { monthly: 30, quarterly: 90, annually: 365 };

function lookbackFrom(timeframe: string): string {
    const days = TIMEFRAME_DAYS[timeframe] ?? 30;
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().slice(0, 10);
}

export function OutflowsCard() {
    const timeframe = useUiStore((state) => state.assetsTimeframe);
    const { data, isLoading } = useMonetaryTransactions({
        transactionType: "money out",
        from: lookbackFrom(timeframe),
        page: 0,
        size: 5,
    });
    const outflows = data?.content ?? [];

    return (
        <Card className="p-6 shadow-sm gap-0 flex flex-col h-full">
            <CardTitle className="text-base font-semibold mb-4">Recent Cash Outflows</CardTitle>
            <div className="flex-1 space-y-3">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                    </div>
                ) : outflows.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">No outflows recorded.</p>
                ) : outflows.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.assetType}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                        <p className="text-sm font-semibold ml-4 shrink-0" style={{ color: chartColors.danger }}>
                            − LKR {(item.lastAmount - item.newAmount).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
}
