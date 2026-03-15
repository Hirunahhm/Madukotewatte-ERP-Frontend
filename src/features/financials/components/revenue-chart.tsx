"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

const chartData = [
    { name: '01 May', uv: 2.1 },
    { name: '05 May', uv: 2.2 },
    { name: '10 May', uv: 2.15 },
    { name: '15 May', uv: 2.3 },
    { name: '20 May', uv: 2.4 },
    { name: '25 May', uv: 2.35 },
    { name: '30 May', uv: 2.5 },
];

export function RevenueChart() {
    return (
        <Card className="lg:col-span-2 shadow-sm gap-0 p-6">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                        Sales & Price History
                    </CardTitle>
                    <CardDescription className="mt-1 max-w-[200px]">Rubber Grade RSS1 Market Price Trends (USD/kg)</CardDescription>
                </div>
                <div className="flex gap-6">
                    <div>
                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Total Revenue</span>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$142,500 <span className="text-xs font-semibold text-brand-600">↗ +12.4%</span></p>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Avg Price</span>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$2.34 <span className="text-xs font-semibold text-brand-600">↗ +4.2%</span></p>
                    </div>
                </div>
            </div>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} />
                        <YAxis dataKey="uv" domain={[2, 6]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} />
                        <RechartsTooltip />
                        <Area type="monotone" dataKey="uv" stroke="#22c55e" strokeWidth={2} fill="transparent" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
