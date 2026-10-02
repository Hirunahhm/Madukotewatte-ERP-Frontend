"use client";

import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2 } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { NoSSR } from "@/components/ui/no-ssr";
import { chartColors } from "@/lib/theme";
import type { WeatherInsights } from "@/features/weather/types/weather-insights.types";

interface RainfallYieldChartProps {
    insights: WeatherInsights | undefined;
    isLoading: boolean;
}

export function RainfallYieldChart({ insights, isLoading }: RainfallYieldChartProps) {
    const data = (insights?.months ?? []).map((m) => ({
        month: m.month,
        rainfall: m.rainfallMm,
        avgPerTappingDay: m.avgLatexPerTappingDay,
    }));

    return (
        <Card className="shadow-sm gap-0 p-6 relative">
            {isLoading && <Loader2 className="absolute top-4 right-4 w-4 h-4 animate-spin text-brand-500" />}
            <CardTitle className="text-base font-semibold">Rainfall vs Yield</CardTitle>
            <CardDescription className="mb-4">
                Monthly rainfall (mm, bars) against average latex per tapping day ({insights?.latexUnit ?? "litres"}, line)
            </CardDescription>
            <div className="h-72 w-full">
                {data.length === 0 && !isLoading ? (
                    <p className="text-sm text-gray-500 py-12 text-center">No data for this period yet.</p>
                ) : (
                    <NoSSR>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} />
                                <YAxis yAxisId="rain" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} width={44} />
                                <YAxis yAxisId="yield" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} width={44} />
                                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px" }} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Bar yAxisId="rain" dataKey="rainfall" name="Rainfall (mm)" fill={chartColors.blue} radius={[4, 4, 0, 0]} />
                                <Line
                                    yAxisId="yield"
                                    type="monotone"
                                    dataKey="avgPerTappingDay"
                                    name="Avg latex / tapping day"
                                    stroke={chartColors.primary}
                                    strokeWidth={2}
                                    connectNulls
                                    dot={{ r: 3 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </NoSSR>
                )}
            </div>
        </Card>
    );
}
