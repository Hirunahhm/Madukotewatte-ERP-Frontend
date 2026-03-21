"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { chartColors } from "@/lib/theme";
import { NoSSR } from "@/components/ui/no-ssr";

type Range = "week" | "month" | "year";

const weekData = [
    { name: "Mon", sales: 72000, costs: 28000 },
    { name: "Tue", sales: 58000, costs: 23000 },
    { name: "Wed", sales: 91000, costs: 35000 },
    { name: "Thu", sales: 84000, costs: 31000 },
    { name: "Fri", sales: 98000, costs: 33000 },
    { name: "Sat", sales: 42000, costs: 18000 },
    { name: "Sun", sales: 55000, costs: 21000 },
];

const monthData = [
    { name: "W1", sales: 386000, costs: 202000 },
    { name: "W2", sales: 341000, costs: 175000 },
    { name: "W3", sales: 312000, costs: 162000 },
    { name: "W4", sales: 284000, costs: 148000 },
];

const yearData = [
    { name: "Jan", sales: 1285000, costs: 621000 },
    { name: "Feb", sales: 1142000, costs: 574000 },
    { name: "Mar", sales: 1198000, costs: 591000 },
    { name: "Apr", sales: 1074000, costs: 532000 },
    { name: "May", sales: 1231000, costs: 608000 },
    { name: "Jun", sales: 1156000, costs: 567000 },
    { name: "Jul", sales: 1089000, costs: 519000 },
    { name: "Aug", sales: 1312000, costs: 614000 },
    { name: "Sep", sales: 1178000, costs: 583000 },
    { name: "Oct", sales: 1095000, costs: 541000 },
    { name: "Nov", sales: 912000, costs: 491000 },
    { name: "Dec", sales: 1264000, costs: 597000 },
];

const dataMap: Record<Range, typeof weekData> = {
    week: weekData,
    month: monthData,
    year: yearData,
};

export function CostsVsSalesChart() {
    const [range, setRange] = useState<Range>("week");
    const data = dataMap[range];

    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Costs vs Sales</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Financial health overview (LKR)</p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
                    {(["week", "month", "year"] as Range[]).map((r) => (
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
