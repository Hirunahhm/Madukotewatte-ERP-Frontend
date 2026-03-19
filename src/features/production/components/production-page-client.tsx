"use client";

import { useUiStore } from "@/stores/ui-store";
import { ProductionKpis } from "./production-kpis";
import { StockCapacityKpis } from "./stock-capacity-kpis";
import { VolumeTrendsChart } from "./volume-trends-chart";
import { LoadTracker } from "./load-tracker";
import { DirectDataEntry } from "./direct-data-entry";
import { MetrolacEntryForm } from "./metrolac-entry-form";
import { ProductionChronology } from "./production-chronology";

function ComingSoon({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
            <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/40 flex items-center justify-center mb-4">
                <span className="text-2xl">🚧</span>
            </div>
            <p className="text-base font-semibold text-gray-700 dark:text-gray-300">{label}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This module is coming soon.</p>
        </div>
    );
}

export function ProductionPageClient() {
    const activeTab = useUiStore((state) => state.productionTab);

    return (
        <div className="space-y-6">
            {activeTab === "latex" && (
                <>
                    <ProductionKpis />
                    <StockCapacityKpis />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <VolumeTrendsChart />
                        <LoadTracker />
                    </div>
                    <DirectDataEntry />
                    <MetrolacEntryForm />
                    <ProductionChronology />
                </>
            )}

            {activeTab === "ammonia" && <ComingSoon label="Ammonia Tracking" />}
            {activeTab === "rubber" && <ComingSoon label="Rubber Solid Collection" />}
        </div>
    );
}
