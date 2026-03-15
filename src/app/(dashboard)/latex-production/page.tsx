import { ProductionKpis } from "@/features/production/components/production-kpis";
import { VolumeTrendsChart } from "@/features/production/components/volume-trends-chart";
import { LoadTracker } from "@/features/production/components/load-tracker";
import { DirectDataEntry } from "@/features/production/components/direct-data-entry";
import { ProductionChronology } from "@/features/production/components/production-chronology";

export default function LatexProductionPage() {
    return (
        <div className="space-y-6">
            <ProductionKpis />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <VolumeTrendsChart />
                <LoadTracker />
            </div>
            <DirectDataEntry />
            <ProductionChronology />
        </div>
    );
}
