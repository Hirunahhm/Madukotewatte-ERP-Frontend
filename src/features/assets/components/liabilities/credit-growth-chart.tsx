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
import { useLoanTrend } from "@/features/assets/hooks/use-assets";
import type { TrendScale } from "@/features/assets/types/assets.types";

export function CreditGrowthChart() {
    const [timeScale, setTimeScale] = useState<TrendScale>("month");
    const { data, isLoading } = useLoanTrend(timeScale);
    const chartData = (data ?? []).map((p) => ({ name: p.name, total: p.total }));

    return (
        <Card className="shadow-sm gap-0 p-6 relative">
            {isLoading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-brand-500" /></div>}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <CardTitle className="text-base font-semibold">Credit Growth</CardTitle>
                    <CardDescription>Outstanding liabilities over time (LKR)</CardDescription>
                </div>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
                    {(["week", "month", "year"] as TrendScale[]).map((scale) => (
                        <Button
                            key={scale}
                            size="sm"
                            variant="ghost"
                            onClick={() => setTimeScale(scale)}
                            className={`h-7 text-xs capitalize ${timeScale === scale ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            {scale === "week" ? "This Week" : scale === "month" ? "Month" : "Year"}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="h-64 w-full">
                <NoSSR>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="creditGradient" x1="0" y1="0" x2="0" y2="1">
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
                                formatter={(value: number | undefined) => [value != null ? `LKR ${value.toLocaleString()}` : "—", "Outstanding"]}
                                contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke={chartColors.danger}
                                strokeWidth={2}
                                fill="url(#creditGradient)"
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0, fill: chartColors.danger }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </NoSSR>
            </div>
        </Card>
    );
}
