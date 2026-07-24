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
import { useSalaryChart } from "@/features/employees/hooks/use-salary-chart";
import type { TimeScale } from "@/features/employees/utils/date-buckets";

export function SalaryChart() {
    const [timeScale, setTimeScale] = useState<TimeScale>("month");
    const { chartData, isLoading } = useSalaryChart(timeScale);

    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <CardTitle className="text-base font-semibold">Salary Disbursement Trend</CardTitle>
                    <CardDescription>Total salary paid out across the estate (LKR)</CardDescription>
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
                {isLoading ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                ) : (
                    <NoSSR>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
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
                                    formatter={(value: number | undefined) => [value != null ? `LKR ${value.toLocaleString()}` : "—", "Total Salary"]}
                                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke={chartColors.primary}
                                    strokeWidth={2}
                                    fill="url(#salaryGradient)"
                                    dot={false}
                                    activeDot={{ r: 4, strokeWidth: 0, fill: chartColors.primary }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </NoSSR>
                )}
            </div>
        </Card>
    );
}
