"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
import { chartColors } from "@/lib/theme";
import { NoSSR } from "@/components/ui/no-ssr";
import { Loader2 } from "lucide-react";
import { useLoads, useLoadTrends } from "@/features/production/hooks/use-production";

export function YieldTrendChart() {
    const { data: loadsPage, isLoading: isLoadingLoads } = useLoads({ loadType: "field-latex", size: 1, sort: "startDate,desc" });
    const latestLoadId = loadsPage?.content?.[0]?.loadId ?? "";

    const { data: trendsData, isLoading: isLoadingTrends } = useLoadTrends(latestLoadId, 7);
    const isLoading = isLoadingLoads || isLoadingTrends;
    const chartData = Array.isArray(trendsData) ? trendsData : [];

    return (
        <Card className="shadow-sm gap-0 p-6 relative">
            {isLoading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-brand-500" /></div>}
            <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Production Yield Trend</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Daily latex collection, current load — last 7 days (Litres)</p>
            <div className="h-48 w-full">
                <NoSSR>
                    {!isLoading && chartData.length === 0 ? (
                        <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
                            No collection data for this period
                        </div>
                    ) : (
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
                                <Area type="monotone" dataKey="actual" stroke={chartColors.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </NoSSR>
            </div>
        </Card>
    );
}
