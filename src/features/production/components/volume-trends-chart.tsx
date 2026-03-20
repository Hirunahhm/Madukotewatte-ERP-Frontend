"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { chartColors } from "@/lib/theme";
import { NoSSR } from "@/components/ui/no-ssr";

const chartData = [
    { name: 'Mon', actual: 220, target: 250 },
    { name: 'Tue', actual: 195, target: 250 },
    { name: 'Wed', actual: 270, target: 250 },
    { name: 'Thu', actual: 240, target: 220 },
    { name: 'Fri', actual: 245, target: 220 },
    { name: 'Sat', actual: 160, target: 175 },
    { name: 'Sun', actual: 100, target: 125 },
];

export function VolumeTrendsChart() {
    return (
        <Card className="lg:col-span-2 shadow-sm gap-0 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <CardTitle className="text-base font-semibold">Latex Volume Trends</CardTitle>
                    <CardDescription>Daily actual collection vs. weekly target forecasts</CardDescription>
                </div>
                <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-lg border border-gray-100 dark:border-gray-700">
                    <Button variant="ghost" size="sm" className="bg-white dark:bg-gray-700 shadow-sm h-7 text-xs text-gray-900 dark:text-gray-100">7 Days</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">30 Days</Button>
                </div>
            </div>
            <div className="h-64 w-full">
                <NoSSR>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorO" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColors.secondary} stopOpacity={0.15} />
                                    <stop offset="95%" stopColor={chartColors.secondary} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} domain={[0, 300]} />
                            <Tooltip />
                            <Area type="monotone" dataKey="actual" stroke={chartColors.primary} strokeWidth={2} fillOpacity={1} fill="url(#colorO)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </NoSSR>
            </div>
        </Card>
    );
}
