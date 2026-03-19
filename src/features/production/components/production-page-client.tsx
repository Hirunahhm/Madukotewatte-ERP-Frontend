"use client";

import { useUiStore } from "@/stores/ui-store";
import { ProductionKpis } from "./production-kpis";
import { StockCapacityKpis } from "./stock-capacity-kpis";
import { VolumeTrendsChart } from "./volume-trends-chart";
import { LoadTracker } from "./load-tracker";
import { DirectDataEntry } from "./direct-data-entry";
import { MetrolacEntryForm } from "./metrolac-entry-form";
import { ProductionChronology } from "./production-chronology";

import { AmmoniaKpis } from "./ammonia/ammonia-kpis";
import { AmmoniaUsageChart } from "./ammonia/ammonia-usage-chart";
import { AmmoniaDataEntry } from "./ammonia/ammonia-data-entry";
import { AmmoniaPastRecords } from "./ammonia/ammonia-past-records";

import { RubberKpis } from "./rubber/rubber-kpis";
import { RubberCollectionChart } from "./rubber/rubber-collection-chart";
import { RubberLoadTracker } from "./rubber/rubber-load-tracker";
import { RubberDataEntry } from "./rubber/rubber-data-entry";
import { RubberPastRecords } from "./rubber/rubber-past-records";

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

            {activeTab === "ammonia" && (
                <>
                    <AmmoniaKpis />
                    <AmmoniaUsageChart />
                    <AmmoniaDataEntry />
                    <AmmoniaPastRecords />
                </>
            )}

            {activeTab === "rubber" && (
                <>
                    <RubberKpis />
                    <RubberCollectionChart />
                    <RubberLoadTracker />
                    <RubberDataEntry />
                    <RubberPastRecords />
                </>
            )}
        </div>
    );
}
