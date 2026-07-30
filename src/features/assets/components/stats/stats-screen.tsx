"use client";

import { useMemo, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NoSSR } from "@/components/ui/no-ssr";
import { chartColors } from "@/lib/theme";
import { Wallet, TrendingDown, Landmark, Loader2 } from "lucide-react";
import {
    useAssetBalances, useLoanBalances, useMonetaryTrend, useLoanTrend, useFixedAssetSummary,
} from "@/features/assets/hooks/use-assets";
import { ReportGeneratorPanel } from "@/features/reports/components/report-generator-panel";
import type { TrendScale } from "@/features/assets/types/assets.types";

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function StatsScreen() {
    const [scale, setScale] = useState<TrendScale>("month");

    const { data: assetBalances } = useAssetBalances();
    const { data: loanBalances } = useLoanBalances();
    const { data: fixedAssetSummary } = useFixedAssetSummary();
    const { data: assetTrend, isLoading: isLoadingAssetTrend } = useMonetaryTrend(scale);
    const { data: loanTrend, isLoading: isLoadingLoanTrend } = useLoanTrend(scale);

    const totalCash = (assetBalances ?? []).reduce((sum, b) => sum + b.balance, 0);
    const totalDebt = (loanBalances ?? []).reduce((sum, b) => sum + b.balance, 0);
    const totalFixedAssets = fixedAssetSummary?.totalCurrentValue ?? 0;
    const netWorth = totalCash + totalFixedAssets - totalDebt;

    const chartData = useMemo(() => {
        const cash = assetTrend ?? [];
        const debt = loanTrend ?? [];
        return cash.map((point, i) => ({
            name: point.name,
            cash: point.total,
            debt: debt[i]?.total ?? 0,
        }));
    }, [assetTrend, loanTrend]);

    const isLoading = isLoadingAssetTrend || isLoadingLoanTrend;

    const kpis = [
        {
            label: "Total Cash & Bank",
            value: formatLkr(totalCash),
            icon: Wallet,
            iconClass: "text-emerald-600 dark:text-emerald-400",
            valueClass: "text-emerald-600 dark:text-emerald-400",
            bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
            label: "Total Debt",
            value: formatLkr(totalDebt),
            icon: TrendingDown,
            iconClass: "text-red-600 dark:text-red-400",
            valueClass: "text-red-600 dark:text-red-400",
            bgClass: "bg-red-50 dark:bg-red-900/20",
        },
        {
            label: "Total Fixed Assets",
            value: formatLkr(totalFixedAssets),
            icon: Landmark,
            iconClass: "text-amber-600 dark:text-amber-400",
            valueClass: "text-amber-600 dark:text-amber-400",
            bgClass: "bg-amber-50 dark:bg-amber-900/20",
        },
        {
            label: "Net Worth",
            value: formatLkr(netWorth),
            icon: Wallet,
            iconClass: netWorth >= 0 ? "text-gray-700 dark:text-gray-300" : "text-red-600 dark:text-red-400",
            valueClass: netWorth >= 0 ? "text-gray-900 dark:text-gray-100" : "text-red-600 dark:text-red-400",
            bgClass: "bg-gray-100 dark:bg-gray-700",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <Card key={kpi.label} className="p-5 shadow-sm gap-0">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">{kpi.label}</p>
                                <div className={`w-8 h-8 rounded-lg ${kpi.bgClass} flex items-center justify-center`}>
                                    <Icon className={`w-4 h-4 ${kpi.iconClass}`} />
                                </div>
                            </div>
                            <p className={`text-xl font-bold ${kpi.valueClass}`}>{kpi.value}</p>
                        </Card>
                    );
                })}
            </div>

            <Card className="shadow-sm gap-0 p-6 relative">
                {isLoading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-brand-500" /></div>}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <CardTitle className="text-base font-semibold">Cash vs. Debt</CardTitle>
                        <CardDescription>Balances over time (LKR)</CardDescription>
                    </div>
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
                        {(["week", "month", "year"] as TrendScale[]).map((s) => (
                            <Button
                                key={s}
                                size="sm"
                                variant="ghost"
                                onClick={() => setScale(s)}
                                className={`h-7 text-xs capitalize ${scale === s ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                {s === "week" ? "This Week" : s === "month" ? "Month" : "Year"}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="h-72 w-full">
                    <NoSSR>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.02} />
                                    </linearGradient>
                                    <linearGradient id="debtGradientStats" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColors.danger} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={chartColors.danger} stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--chart-axis)" }} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
                                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                                    width={44}
                                />
                                <Tooltip
                                    formatter={(value: number | undefined, name: string | undefined) => [value != null ? `LKR ${value.toLocaleString()}` : "—", name === "cash" ? "Cash & Bank" : "Debt"]}
                                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px" }}
                                />
                                <Legend
                                    formatter={(value) => (value === "cash" ? "Cash & Bank" : "Debt")}
                                    wrapperStyle={{ fontSize: "12px" }}
                                />
                                <Area type="monotone" dataKey="cash" stroke={chartColors.primary} strokeWidth={2} fill="url(#cashGradient)" dot={false} />
                                <Area type="monotone" dataKey="debt" stroke={chartColors.danger} strokeWidth={2} fill="url(#debtGradientStats)" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </NoSSR>
                </div>
            </Card>

            <ReportGeneratorPanel />
        </div>
    );
}
