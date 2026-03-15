import { LiquidityOverview } from "@/features/assets/components/liquidity-overview";
import { AddAssetForm } from "@/features/assets/components/add-asset-form";
import { LiquidityHistoryChart } from "@/features/assets/components/liquidity-history-chart";
import { RecentInjectionsTable } from "@/features/assets/components/recent-injections-table";
import { AssetKpis } from "@/features/assets/components/asset-kpis";

export default function AssetsPage() {
    return (
        <div className="space-y-6">
            <LiquidityOverview />
            <AddAssetForm />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <LiquidityHistoryChart />
                <RecentInjectionsTable />
            </div>
            <AssetKpis />
        </div>
    );
}
