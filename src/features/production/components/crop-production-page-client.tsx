"use client";

import { useUiStore } from "@/stores/ui-store";

import { BananaKpis } from "./banana/banana-kpis";
import { BananaTrendChart } from "./banana/banana-trend-chart";
import { BananaVarietyChart } from "./banana/banana-variety-chart";
import { BananaLoadTracker } from "./banana/banana-load-tracker";
import { BananaDataEntry } from "./banana/banana-data-entry";
import { BananaPastRecords } from "./banana/banana-past-records";

import { CoconutKpis } from "./coconut/coconut-kpis";
import { CoconutTrendChart } from "./coconut/coconut-trend-chart";
import { CoconutVarietyChart } from "./coconut/coconut-variety-chart";
import { CoconutLoadTracker } from "./coconut/coconut-load-tracker";
import { CoconutDataEntry } from "./coconut/coconut-data-entry";
import { CoconutPastRecords } from "./coconut/coconut-past-records";

import { ManiocKpis } from "./manioc/manioc-kpis";
import { ManiocTrendChart } from "./manioc/manioc-trend-chart";
import { ManiocVarietyChart } from "./manioc/manioc-variety-chart";
import { ManiocLoadTracker } from "./manioc/manioc-load-tracker";
import { ManiocDataEntry } from "./manioc/manioc-data-entry";
import { ManiocPastRecords } from "./manioc/manioc-past-records";

export function CropProductionPageClient() {
    const activeTab = useUiStore((state) => state.cropProductionTab);

    return (
        <div className="space-y-6">
            {activeTab === "banana" && (
                <>
                    <BananaKpis />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <BananaTrendChart />
                            <BananaVarietyChart />
                        </div>
                        <BananaLoadTracker />
                    </div>
                    <BananaDataEntry />
                    <BananaPastRecords />
                </>
            )}

            {activeTab === "coconut" && (
                <>
                    <CoconutKpis />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <CoconutTrendChart />
                            <CoconutVarietyChart />
                        </div>
                        <CoconutLoadTracker />
                    </div>
                    <CoconutDataEntry />
                    <CoconutPastRecords />
                </>
            )}

            {activeTab === "manioc" && (
                <>
                    <ManiocKpis />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <ManiocTrendChart />
                            <ManiocVarietyChart />
                        </div>
                        <ManiocLoadTracker />
                    </div>
                    <ManiocDataEntry />
                    <ManiocPastRecords />
                </>
            )}
        </div>
    );
}
