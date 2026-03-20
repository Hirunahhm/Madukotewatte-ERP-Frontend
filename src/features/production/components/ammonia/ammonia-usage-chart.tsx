"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { chartColors } from "@/lib/theme";

const chartData = [
    { day: "Mon", usage: 45 },
    { day: "Tue", usage: 62 },
    { day: "Wed", usage: 38 },
    { day: "Thu", usage: 71 },
    { day: "Fri", usage: 55 },
    { day: "Sat", usage: 28 },
    { day: "Sun", usage: 18 },
];

export function AmmoniaUsageChart() {
    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="mb-4">
                <CardTitle className="text-base font-semibold">Daily Ammonia Usage</CardTitle>
                <CardDescription>Ammonia consumed per day over the last 7 days</CardDescription>
            </div>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="ammoniaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartColors.cyan} stopOpacity={0.15} />
                                <stop offset="95%" stopColor={chartColors.cyan} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--chart-axis)" }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--chart-axis)" }} domain={[0, 100]} />
                        <Tooltip />
                        <Area type="monotone" dataKey="usage" stroke={chartColors.cyan} strokeWidth={2} fillOpacity={1} fill="url(#ammoniaGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
