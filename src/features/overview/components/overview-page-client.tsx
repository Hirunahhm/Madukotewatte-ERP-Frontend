"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toLocalDateInputValue } from "@/lib/utils";
import { useDashboardOverview } from "@/features/overview/hooks/use-overview";
import { OverviewKpis } from "@/features/overview/components/overview-kpis";
import { AlertsPanel } from "@/features/overview/components/alerts-panel";
import { RevenueExpenseChart } from "@/features/overview/components/revenue-expense-chart";
import { PeriodSummaryCard } from "@/features/overview/components/period-summary-card";
import { ProductionCard } from "@/features/overview/components/production-card";
import { CashAccountsCard } from "@/features/overview/components/cash-accounts-card";
import { WorkforceCard } from "@/features/overview/components/workforce-card";
import { WeatherWidget } from "@/features/overview/components/weather-widget";

export function OverviewPageClient() {
    const currentMonth = toLocalDateInputValue().slice(0, 7);
    const [month, setMonth] = useState(currentMonth);
    const { data, isLoading, isError, error, isFetching } = useDashboardOverview(month === currentMonth ? undefined : month);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description="The estate at a glance: money, production, workforce and what needs attention"
                actions={
                    <div className="flex items-center gap-2">
                        {isFetching && <Loader2 className="h-4 w-4 animate-spin text-brand-500" />}
                        <label htmlFor="overview-month" className="text-sm text-gray-500 dark:text-gray-400">Month</label>
                        <Input
                            id="overview-month"
                            type="month"
                            value={month}
                            max={currentMonth}
                            onChange={(e) => e.target.value && setMonth(e.target.value)}
                            className="w-40"
                        />
                    </div>
                }
            />

            {isLoading ? (
                <Card className="flex items-center justify-center p-16 shadow-sm">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
                </Card>
            ) : isError || !data ? (
                <Card className="p-10 text-center text-sm text-red-500 shadow-sm">
                    {error instanceof Error ? error.message : "Unable to load the dashboard overview."}
                </Card>
            ) : (
                <>
                    <OverviewKpis data={data} />
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        <div className="space-y-6 xl:col-span-2">
                            <RevenueExpenseChart trend={data.trend} />
                            <PeriodSummaryCard periods={data.periods} />
                            <ProductionCard production={data.production} trend={data.trend} />
                        </div>
                        <div className="space-y-6">
                            <AlertsPanel alerts={data.alerts} />
                            <CashAccountsCard money={data.money} />
                            <WorkforceCard workforce={data.workforce} />
                        </div>
                    </div>
                    <WeatherWidget />
                </>
            )}
        </div>
    );
}
