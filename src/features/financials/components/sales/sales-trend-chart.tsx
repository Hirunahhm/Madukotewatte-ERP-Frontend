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

const weekData = [
    { name: "Mon", total: 42000 },
    { name: "Tue", total: 68500 },
    { name: "Wed", total: 51200 },
    { name: "Thu", total: 84300 },
    { name: "Fri", total: 97600 },
    { name: "Sat", total: 31800 },
    { name: "Sun", total: 18400 },
];

const monthData = [
    { name: "W1", total: 284000 },
    { name: "W2", total: 318500 },
    { name: "W3", total: 296400 },
    { name: "W4", total: 385600 },
];

const yearData = [
    { name: "Jan", total: 980000 },
    { name: "Feb", total: 912000 },
    { name: "Mar", total: 1048000 },
    { name: "Apr", total: 994000 },
    { name: "May", total: 1124000 },
    { name: "Jun", total: 1068000 },
    { name: "Jul", total: 1192000 },
    { name: "Aug", total: 1284500 },
    { name: "Sep", total: 1108000 },
    { name: "Oct", total: 1156000 },
    { name: "Nov", total: 1044000 },
    { name: "Dec", total: 968000 },
];

type TimeScale = "week" | "month" | "year";

export function SalesTrendChart() {
    const [timeScale, setTimeScale] = useState<TimeScale>("month");

    const data = timeScale === "week" ? weekData : timeScale === "month" ? monthData : yearData;

    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <CardTitle className="text-base font-semibold">Sales Revenue Trend</CardTitle>
                    <CardDescription>Total sales across all estate products (LKR)</CardDescription>
                </div>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
                    {(["week", "month", "year"] as TimeScale[]).map((scale) => (
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
                        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
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
