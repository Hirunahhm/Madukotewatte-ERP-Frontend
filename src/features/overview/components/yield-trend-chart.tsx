"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
import { chartColors } from "@/lib/theme";

const chartData = [
    { name: 'Mon', uv: 400 },
    { name: 'Tue', uv: 300 },
    { name: 'Wed', uv: 550 },
    { name: 'Thu', uv: 480 },
    { name: 'Fri', uv: 620 },
    { name: 'Sat', uv: 320 },
    { name: 'Sun', uv: 200 },
];

export function YieldTrendChart() {
    return (
        <Card className="shadow-sm gap-0 p-6">
            <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Production Yield Trend</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Daily latex collection average across all tappers (Litres)</p>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="uv" stroke={chartColors.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
