"use client";

import { TrendingUp, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLoads } from "@/features/production/hooks/use-production";
import { useManiocLoadSummary, useManiocVarietyBreakdown } from "@/features/production/hooks/use-manioc-production";

export function ManiocKpis() {
    const { data: loadsPage, isLoading: isLoadingLoads } = useLoads({ loadType: "manioc", size: 1, sort: "startDate,desc" });
    const latestLoadId = loadsPage?.content?.[0]?.loadId ?? "";

    const { data: summary, isLoading: isLoadingSummary } = useManiocLoadSummary(latestLoadId);
    const { data: breakdown, isLoading: isLoadingBreakdown } = useManiocVarietyBreakdown();
    const isLoading = isLoadingLoads || isLoadingSummary || isLoadingBreakdown;

    const topVariety = [...(breakdown ?? [])].sort((a, b) => b.totalMassKg - a.totalMassKg)[0];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="shadow-sm p-5 gap-0 relative">
                {isLoading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-teal-500" /></div>}
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Current Harvest {latestLoadId && <span className="lowercase font-mono text-[9px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded ml-2 text-teal-600 dark:text-teal-400">load: {latestLoadId.slice(0, 8)}</span>}
                </p>
                <div className="flex items-end gap-3">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                        {(summary?.totalMassKg ?? 0).toLocaleString()} kg
                    </span>
                    <span className="mb-1 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Live
                    </span>
                </div>
            </Card>

            <Card className="shadow-sm p-5 gap-0 relative">
                {isLoading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-teal-500" /></div>}
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Top Variety
                </p>
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
                        {topVariety?.variety ?? "—"}
                    </span>
                </div>
            </Card>
        </div>
    );
}
