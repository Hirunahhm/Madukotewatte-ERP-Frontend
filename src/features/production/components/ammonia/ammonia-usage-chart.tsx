"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { chartColors } from "@/lib/theme";
import { NoSSR } from "@/components/ui/no-ssr";
import { Loader2 } from "lucide-react";
import { useAmmoniaUsage } from "@/features/production/hooks/use-production";

export function AmmoniaUsageChart() {
    const [days, setDays] = useState(7);
    const { data, isLoading } = useAmmoniaUsage(days);
    const chartData = Array.isArray(data) ? data : [];

    return (
        <Card className="shadow-sm gap-0 p-6 relative">
            {isLoading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-cyan-500" /></div>}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <CardTitle className="text-base font-semibold">Daily Ammonia Usage</CardTitle>
                    <CardDescription>Ammonia consumed per day</CardDescription>
                </div>
                <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-lg border border-gray-100 dark:border-gray-700">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDays(7)}
                        className={`h-7 text-xs ${days === 7 ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"}`}
                    >
                        7 Days
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDays(30)}
                        className={`h-7 text-xs ${days === 30 ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"}`}
                    >
                        30 Days
                    </Button>
                </div>
            </div>
            <div className="h-64 w-full">
                <NoSSR>
                    {chartData.length === 0 && !isLoading ? (
                        <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
                            No ammonia records for this period
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="ammoniaGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColors.cyan} stopOpacity={0.15} />
                                        <stop offset="95%" stopColor={chartColors.cyan} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--chart-axis)" }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--chart-axis)" }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="out" name="Usage" stroke={chartColors.cyan} strokeWidth={2} fillOpacity={1} fill="url(#ammoniaGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </NoSSR>
            </div>
        </Card>
    );
}
