"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useFixedAssetSummary } from "@/features/assets/hooks/use-assets";

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function FixedAssetKpis() {
    const { data: summary, isLoading } = useFixedAssetSummary();

    const stats = [
        { label: "Total Current Value", value: formatLkr(summary?.totalCurrentValue ?? 0) },
        { label: "Total Acquisition Value", value: formatLkr(summary?.totalAcquisitionValue ?? 0) },
        { label: "Asset Count", value: String(summary?.totalCount ?? 0) },
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="p-5 shadow-sm gap-0 relative">
                        {isLoading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-brand-500" /></div>}
                        <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">{stat.label}</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                    </Card>
                ))}
            </div>
            {summary && summary.byCategory.length > 0 && (
                <Card className="p-5 shadow-sm gap-0">
                    <CardTitle className="text-sm font-semibold mb-3">By Category</CardTitle>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {summary.byCategory.map((c) => (
                            <div key={c.category} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <p className="text-[10px] text-gray-400 uppercase">{c.category}</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatLkr(c.total)}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
