"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, Loader2 } from "lucide-react";
import { useLoads, useLoadSummary } from "@/features/production/hooks/use-production";

const CAPACITY = 8000;

export function StockCapacityKpis() {
    // 1. Fetch the latest field-latex load
    const { data: loadsPage, isLoading: isLoadingLoads } = useLoads({ loadType: "field-latex", size: 1, sort: "startDate,desc" });
    const latestLoad = loadsPage?.content?.[0];
    const latestLoadId = latestLoad?.loadId ?? "";

    // 2. Fetch stats for that load from the new backend endpoint
    const { data: summary, isLoading: isLoadingSummary } = useLoadSummary(latestLoadId);

    const isLoading = isLoadingLoads || isLoadingSummary;
    const currentStock = summary?.totalLatexCollected ?? 0;
    const fillPct = Math.round((currentStock / CAPACITY) * 100);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current Latex Stock */}
            <Card className="shadow-sm p-5 gap-0 relative">
                {isLoading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-brand-500" /></div>}
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Current Latex Stock {latestLoadId && <span className="lowercase font-mono text-[9px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded ml-2 text-brand-600 dark:text-brand-400">load: {latestLoadId.slice(0,8)}</span>}
                </p>
                <div className="flex items-end gap-3">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                        {currentStock.toLocaleString()} L
                    </span>
                    <span className="mb-1 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Live
                    </span>
                </div>
            </Card>

            {/* Current Latex Capacity */}
            <Card className="shadow-sm p-5 gap-0 relative">
                {isLoading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-brand-500" /></div>}
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Current Latex Capacity
                </p>
                <div className="flex items-end gap-2 mb-3">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                        {fillPct}%
                    </span>
                    <span className="mb-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {currentStock.toLocaleString()} / {CAPACITY.toLocaleString()} L
                    </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-brand-500 transition-all duration-500"
                        style={{ width: `${Math.min(100, fillPct)}%` }}
                    />
                </div>
            </Card>
        </div>
    );
}
