"use client";

import { useUiStore } from "@/stores/ui-store";
import { CashScreen } from "./assets/assets-screen";
import { DebtScreen } from "./liabilities/liabilities-screen";
import { FixedAssetsScreen } from "./fixed-assets/fixed-assets-screen";
import { StatsScreen } from "./stats/stats-screen";

export function AssetsPageClient() {
    const activeTab = useUiStore((state) => state.assetsTab);

    if (activeTab === "cash") return <CashScreen />;
    if (activeTab === "debt") return <DebtScreen />;
    if (activeTab === "assets") return <FixedAssetsScreen />;

    return <StatsScreen />;
}
