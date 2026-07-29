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
import { TrendingUp, TrendingDown, Wallet, Loader2 } from "lucide-react";
import { useSalesSummary, useExpenseSummary, useSalesTrend, useExpenseTrend } from "@/features/financials/hooks/use-financials";
import { RevenueDistribution } from "@/features/financials/components/sales/revenue-distribution";
import { ExpenseDistribution } from "@/features/financials/components/expenses/expense-distribution";
import type { TrendScale } from "@/features/financials/types/financials.types";

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function StatsScreen() {
    const [scale, setScale] = useState<TrendScale>("month");

    const { data: salesSummary } = useSalesSummary();
    const { data: expenseSummary } = useExpenseSummary();
    const { data: salesTrend, isLoading: isLoadingSalesTrend } = useSalesTrend(scale);
    const { data: expenseTrend, isLoading: isLoadingExpenseTrend } = useExpenseTrend(scale);

    const totalRevenue = salesSummary?.totalSales ?? 0;
    const totalExpenses = expenseSummary?.totalExpenses ?? 0;
    const netProfit = totalRevenue - totalExpenses;

    const chartData = useMemo(() => {
        const revenue = salesTrend ?? [];
        const expenses = expenseTrend ?? [];
        return revenue.map((point, i) => ({
            name: point.name,
            revenue: point.total,
            expenses: expenses[i]?.total ?? 0,
        }));
    }, [salesTrend, expenseTrend]);

    const isLoading = isLoadingSalesTrend || isLoadingExpenseTrend;

    const kpis = [
        {
            label: "Total Revenue",
            value: formatLkr(totalRevenue),
            icon: TrendingUp,
            iconClass: "text-emerald-600 dark:text-emerald-400",
            valueClass: "text-emerald-600 dark:text-emerald-400",
            bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
            label: "Total Expenses",
            value: formatLkr(totalExpenses),
            icon: TrendingDown,
            iconClass: "text-amber-600 dark:text-amber-400",
            valueClass: "text-amber-600 dark:text-amber-400",
            bgClass: "bg-amber-50 dark:bg-amber-900/20",
        },
        {
            label: "Net Profit",
            value: formatLkr(netProfit),
            icon: Wallet,
            iconClass: netProfit >= 0 ? "text-gray-700 dark:text-gray-300" : "text-red-600 dark:text-red-400",
            valueClass: netProfit >= 0 ? "text-gray-900 dark:text-gray-100" : "text-red-600 dark:text-red-400",
            bgClass: "bg-gray-100 dark:bg-gray-700",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                        <CardTitle className="text-base font-semibold">Revenue vs. Expenses</CardTitle>
                        <CardDescription>Estate-wide financial performance (LKR)</CardDescription>
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
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.02} />
                                    </linearGradient>
                                    <linearGradient id="expenseGradientStats" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColors.warning} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={chartColors.warning} stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--chart-axis)" }} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
                                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                                    width={40}
                                />
                                <Tooltip
                                    formatter={(value: number | undefined, name: string | undefined) => [value != null ? `LKR ${value.toLocaleString()}` : "—", name === "revenue" ? "Revenue" : "Expenses"]}
                                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px" }}
                                />
                                <Legend
                                    formatter={(value) => (value === "revenue" ? "Revenue" : "Expenses")}
                                    wrapperStyle={{ fontSize: "12px" }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke={chartColors.primary} strokeWidth={2} fill="url(#revenueGradient)" dot={false} />
                                <Area type="monotone" dataKey="expenses" stroke={chartColors.warning} strokeWidth={2} fill="url(#expenseGradientStats)" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </NoSSR>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueDistribution />
                <ExpenseDistribution />
            </div>
        </div>
    );
}
