"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { chartColors } from "@/lib/theme";
import { NoSSR } from "@/components/ui/no-ssr";

const chartData = [
    { day: "Mon", scrap: 5.2 },
    { day: "Tue", scrap: 3.8 },
    { day: "Wed", scrap: 7.1 },
    { day: "Thu", scrap: 4.5 },
    { day: "Fri", scrap: 6.3 },
    { day: "Sat", scrap: 2.9 },
    { day: "Sun", scrap: 1.4 },
];

export function RubberCollectionChart() {
    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="mb-4">
                <CardTitle className="text-base font-semibold">Daily Scrap Collection</CardTitle>
                <CardDescription>Rubber solid scrap collected per day over the last 7 days</CardDescription>
            </div>
            <div className="h-64 w-full">
                <NoSSR>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--chart-axis)" }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--chart-axis)" }} domain={[0, 10]} />
                            <Tooltip />
                            <Bar dataKey="scrap" fill={chartColors.warning} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </NoSSR>
            </div>
        </Card>
    );
}
