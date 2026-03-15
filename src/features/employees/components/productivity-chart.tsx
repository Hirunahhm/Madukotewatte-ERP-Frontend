"use client";

import { Droplet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export function ProductivityChart() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-sm gap-0 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <CardTitle className="text-base font-semibold">Production Yield Trend</CardTitle>
                        <CardDescription>Daily latex collection average across all tappers (Litres)</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs font-semibold text-gray-700">
                        Export PDF
                    </Button>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} />
                            <Tooltip cursor={{ fill: '#f0fdf4' }} />
                            <Bar dataKey="uv" fill={chartColors.primary} radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
            <div className="flex flex-col gap-6">
                {/* Total Yield Card */}
                <Card className="bg-brand-500 p-6 flex-1 text-white relative overflow-hidden gap-0">
                    <div className="relative z-10">
                        <p className="text-xs font-bold tracking-wider opacity-80 mb-2">TOTAL ESTATE YIELD</p>
                        <p className="text-4xl font-bold">12.4k <span className="text-xl">L</span></p>
                        <p className="text-xs font-medium bg-white/20 inline-block px-2 py-1 rounded mt-4">↗ 14% Above Target</p>
                    </div>
                    <Droplet className="absolute -right-4 -bottom-4 w-40 h-40 opacity-10" />
                </Card>
                {/* Productivity Card */}
                <Card className="shadow-sm p-6 flex-1 flex flex-col justify-center gap-0">
                    <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-2">AVERAGE PRODUCTIVITY</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">134 <span className="text-sm font-medium text-gray-500 dark:text-gray-400">trees / tapper</span></p>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-1 mt-6 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full w-[80%] rounded-full"></div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
