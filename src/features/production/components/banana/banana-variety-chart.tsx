"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { chartColors } from "@/lib/theme";
import { NoSSR } from "@/components/ui/no-ssr";
import { Loader2 } from "lucide-react";
import { useBananaVarietyBreakdown } from "@/features/production/hooks/use-banana-production";

export function BananaVarietyChart() {
    const { data, isLoading } = useBananaVarietyBreakdown();
    const chartData = (data ?? []).map((d) => ({ name: d.variety, actual: d.totalMassKg }));

    return (
        <Card className="shadow-sm gap-0 p-6 relative">
            {isLoading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-amber-500" /></div>}
            <CardTitle className="text-base font-semibold">Harvest by Variety</CardTitle>
            <CardDescription className="mb-4">Total mass collected per banana variety</CardDescription>
            <div className="h-64 w-full">
                <NoSSR>
                    {chartData.length === 0 && !isLoading ? (
                        <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
                            No harvest data yet
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--chart-axis)" }} />
                                <Tooltip formatter={(value: number | undefined) => [`${(value ?? 0).toLocaleString()} kg`, "Mass"]} />
                                <Bar dataKey="actual" fill={chartColors.warning} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </NoSSR>
            </div>
        </Card>
    );
}
