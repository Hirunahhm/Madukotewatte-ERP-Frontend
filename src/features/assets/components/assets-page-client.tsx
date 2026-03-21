"use client";

import { useUiStore } from "@/stores/ui-store";
import { AssetsScreen } from "./assets/assets-screen";
import { LiabilitiesScreen } from "./liabilities/liabilities-screen";
import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export function AssetsPageClient() {
    const activeTab = useUiStore((state) => state.assetsTab);

    if (activeTab === "assets") return <AssetsScreen />;
    if (activeTab === "liabilities") return <LiabilitiesScreen />;

    return (
        <Card className="p-12 shadow-sm flex flex-col items-center justify-center text-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-gray-400" />
            </div>
            <div>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">Stats — Coming Soon</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Asset analytics and reporting dashboards are under construction.</p>
            </div>
        </Card>
    );
}
