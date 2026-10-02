"use client";

import { AssetKpis } from "./asset-kpis";
import { BalanceTrendChart } from "./balance-trend-chart";
import { RecentActivityCard } from "./recent-activity-card";
import { AccountsOverview } from "./accounts-overview";
import { AccountStatementCard } from "@/features/accounts/components/account-statement-card";

export function CashScreen() {
    return (
        <div className="space-y-6">
            <AssetKpis />
            <AccountsOverview />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <BalanceTrendChart series="cash" />
                </div>
                <RecentActivityCard />
            </div>
            <AccountStatementCard title="Account statement" />
        </div>
    );
}
