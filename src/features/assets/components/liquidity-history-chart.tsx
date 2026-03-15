"use client";

import { Filter } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const chartData = [
    { name: '2023-10', uv: 800000 },
    { name: '2023-11', uv: 850000 },
    { name: '2023-12', uv: 900000 },
    { name: '2024-01', uv: 890000 },
    { name: '2024-02', uv: 1050000 },
    { name: '2024-03', uv: 1150000 },
    { name: '2024-04', uv: 1248500 },
];

export function LiquidityHistoryChart() {
    return (
        <Card className="lg:col-span-2 shadow-sm gap-0 p-6 flex flex-col">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <CardTitle className="text-base font-semibold">Liquidity Growth</CardTitle>
                    <CardDescription className="mt-1">Visualizing capital accumulation over time</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold text-gray-700">
                        <Filter className="w-3.5 h-3.5" /> Filter
                    </Button>
                    <Button variant="secondary" size="sm" className="text-xs font-bold text-gray-700">1Y View</Button>
                </div>
            </div>

            <div className="h-72 w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorO" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--chart-axis)' }} dy={10} />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: 'var(--chart-axis)' }}
                            tickFormatter={(val) => `$${val / 1000}k`}
                        />
                        <Tooltip
                            formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Liquidity']}
                            contentStyle={{ borderRadius: '8px', border: '1px solid var(--chart-grid)' }}
                        />
                        <Area
                            type="stepAfter"
                            dataKey="uv"
                            stroke="#22c55e"
                            strokeWidth={2}
                            fill="url(#colorO)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
