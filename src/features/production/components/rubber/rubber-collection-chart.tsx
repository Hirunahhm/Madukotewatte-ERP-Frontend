"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { chartColors } from "@/lib/theme";
import { NoSSR } from "@/components/ui/no-ssr";
import { Loader2 } from "lucide-react";
import { useLoads, useRubberLoadTrends } from "@/features/production/hooks/use-production";

export function RubberCollectionChart() {
    const [days, setDays] = useState(7);

    const { data: loadsPage, isLoading: isLoadingLoads } = useLoads({ loadType: "scrap", size: 1, sort: "startDate,desc" });
    const latestLoadId = loadsPage?.content?.[0]?.loadId ?? "";

    const { data: trendsData, isLoading: isLoadingTrends } = useRubberLoadTrends(latestLoadId, days);
    const isLoading = isLoadingLoads || isLoadingTrends;
    const chartData = Array.isArray(trendsData) ? trendsData : [];

    return (
        <Card className="shadow-sm gap-0 p-6 relative">
            {isLoading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-amber-500" /></div>}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <CardTitle className="text-base font-semibold">Daily Scrap Collection</CardTitle>
                    <CardDescription>Rubber solid scrap collected per day {latestLoadId && <span className="lowercase font-mono text-[9px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded ml-2 text-gray-500">load: {latestLoadId.slice(0, 8)}</span>}</CardDescription>
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
                            No collection data for this period
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--chart-axis)" }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--chart-axis)" }} />
                                <Tooltip />
                                <Bar dataKey="actual" fill={chartColors.warning} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </NoSSR>
            </div>
        </Card>
    );
}
