"use client";

import { useState } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { chartColors } from "@/lib/theme";
import { NoSSR } from "@/components/ui/no-ssr";
import { Loader2 } from "lucide-react";
import { useAccountTrend } from "@/features/accounts/hooks/use-accounts";
import type { AccountTrendScale } from "@/features/accounts/types/accounts.types";

interface BalanceTrendChartProps {
    /** "cash" charts cash + bank; "cards" charts the amount owed on credit cards. */
    series?: "cash" | "cards";
}

export function BalanceTrendChart({ series = "cash" }: BalanceTrendChartProps) {
    const [scale, setScale] = useState<AccountTrendScale>("month");
    const { data, isLoading } = useAccountTrend(scale);
    const isCash = series === "cash";
    const color = isCash ? chartColors.primary : chartColors.danger;
    const chartData = (data ?? []).map((p) => ({
        name: p.name,
        total: isCash ? p.cashAndBank : Math.abs(Math.min(p.creditCards, 0)),
    }));
    const gradientId = `trendGradient-${series}`;

    return (
        <Card className="shadow-sm gap-0 p-6 relative">
            {isLoading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-brand-500" /></div>}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <CardTitle className="text-base font-semibold">{isCash ? "Balance trend" : "Credit card balance trend"}</CardTitle>
                    <CardDescription>
                        {isCash ? "Total cash + bank balance over time (LKR)" : "Total owed on credit cards over time (LKR)"}
                    </CardDescription>
                </div>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
                    {(["week", "month", "year"] as AccountTrendScale[]).map((s) => (
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
                                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0.02} />
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
                                formatter={(value: number | undefined) => [value != null ? `LKR ${value.toLocaleString()}` : "-", isCash ? "Balance" : "Owed"]}
                                contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke={color}
                                strokeWidth={2}
                                fill={`url(#${gradientId})`}
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0, fill: color }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </NoSSR>
            </div>
        </Card>
    );
}
