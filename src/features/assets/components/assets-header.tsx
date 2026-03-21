"use client";

import { useUiStore, type AssetsTab, type AssetsTimeframe } from "@/stores/ui-store";
import { Button } from "@/components/ui/button";

const TIMEFRAME_OPTIONS: { id: AssetsTimeframe; label: string }[] = [
    { id: "monthly", label: "Monthly" },
    { id: "quarterly", label: "Quarterly" },
    { id: "annually", label: "Annually" },
];

const TAB_OPTIONS: { id: AssetsTab; label: string }[] = [
    { id: "assets", label: "Assets" },
    { id: "liabilities", label: "Liabilities" },
    { id: "stats", label: "Stats" },
];

export function AssetsHeader() {
    const assetsTimeframe = useUiStore((state) => state.assetsTimeframe);
    const setAssetsTimeframe = useUiStore((state) => state.setAssetsTimeframe);
    const assetsTab = useUiStore((state) => state.assetsTab);
    const setAssetsTab = useUiStore((state) => state.setAssetsTab);

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Assets &amp; Liabilities</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track bank balances, cash flows, loans, and credit card liabilities across the estate.</p>
            </div>

            {/* Timeframe toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1 w-fit">
                {TIMEFRAME_OPTIONS.map((opt) => (
                    <Button
                        key={opt.id}
                        size="sm"
                        variant="ghost"
                        onClick={() => setAssetsTimeframe(opt.id)}
                        className={`h-7 text-xs ${assetsTimeframe === opt.id ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                    >
                        {opt.label}
                    </Button>
                ))}
            </div>

            {/* Sub-nav */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1 w-fit">
                {TAB_OPTIONS.map((opt) => (
                    <Button
                        key={opt.id}
                        size="sm"
                        variant="ghost"
                        onClick={() => setAssetsTab(opt.id)}
                        className={`h-7 text-xs ${assetsTab === opt.id ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                    >
                        {opt.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
