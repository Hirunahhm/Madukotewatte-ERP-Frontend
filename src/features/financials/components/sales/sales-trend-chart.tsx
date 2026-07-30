"use client";

import { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { chartColors } from "@/lib/theme";
import { NoSSR } from "@/components/ui/no-ssr";
import { Loader2 } from "lucide-react";
import { useSalesTrend } from "@/features/financials/hooks/use-financials";
import type { TrendScale } from "@/features/financials/types/financials.types";

export function SalesTrendChart() {
    const [scale, setScale] = useState<TrendScale>("month");
    const { data, isLoading } = useSalesTrend(scale);
    const chartData = data ?? [];

    return (
        <Card className="shadow-sm gap-0 p-6 relative">
            {isLoading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-brand-500" /></div>}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <CardTitle className="text-base font-semibold">Sales Revenue Trend</CardTitle>
                    <CardDescription>Total sales across all estate products (LKR)</CardDescription>
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
            <div className="h-64 w-full">
                <NoSSR>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.02} />
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
                                formatter={(value: number | undefined) => [value != null ? `LKR ${value.toLocaleString()}` : "—", "Total Sales"]}
                                contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke={chartColors.primary}
                                strokeWidth={2}
                                fill="url(#salesGradient)"
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0, fill: chartColors.primary }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </NoSSR>
            </div>
        </Card>
    );
}
