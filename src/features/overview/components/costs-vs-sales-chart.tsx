"use client";

import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { chartColors } from "@/lib/theme";
import { NoSSR } from "@/components/ui/no-ssr";
import { Loader2 } from "lucide-react";
import { useSalesTrend, useExpenseTrend } from "@/features/financials/hooks/use-financials";
import type { TrendScale } from "@/features/financials/types/financials.types";

export function CostsVsSalesChart() {
    const [range, setRange] = useState<TrendScale>("week");

    const { data: salesTrend, isLoading: isLoadingSales } = useSalesTrend(range);
    const { data: expenseTrend, isLoading: isLoadingExpenses } = useExpenseTrend(range);
    const isLoading = isLoadingSales || isLoadingExpenses;

    const data = useMemo(() => {
        const sales = salesTrend ?? [];
        const costs = expenseTrend ?? [];
        return sales.map((point, i) => ({
            name: point.name,
            sales: point.total,
            costs: costs[i]?.total ?? 0,
        }));
    }, [salesTrend, expenseTrend]);

    return (
        <Card className="shadow-sm gap-0 p-6 relative">
            {isLoading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-brand-500" /></div>}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Costs vs Sales</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Financial health overview (LKR)</p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
                    {(["week", "month", "year"] as TrendScale[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
                                range === r
                                    ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>
            <div className="h-64 w-full">
                <NoSSR>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--chart-axis)" }} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "var(--chart-axis)" }}
                                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                            />
                            <Tooltip
                                formatter={(value) => [`LKR ${Number(value).toLocaleString()}`, undefined]}
                                contentStyle={{ fontSize: 12 }}
                            />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Bar dataKey="sales" name="Sales" fill={chartColors.primary} radius={[3, 3, 0, 0]} />
                            <Bar dataKey="costs" name="Costs" fill={chartColors.warning} radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </NoSSR>
            </div>
        </Card>
    );
}
