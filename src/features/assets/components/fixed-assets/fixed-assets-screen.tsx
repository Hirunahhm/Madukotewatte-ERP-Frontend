"use client";

import { FixedAssetKpis } from "./fixed-asset-kpis";
import { AddFixedAssetForm } from "./add-fixed-asset-form";
import { FixedAssetsTable } from "./fixed-assets-table";
import { DepreciationScheduleCard } from "./depreciation-schedule-card";

export function FixedAssetsScreen() {
    return (
        <div className="space-y-6">
            <FixedAssetKpis />
            <AddFixedAssetForm />
            <FixedAssetsTable />
            <DepreciationScheduleCard />
        </div>
    );
}
