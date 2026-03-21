"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { chartColors } from "@/lib/theme";
import { NoSSR } from "@/components/ui/no-ssr";

const workerData = [
    { name: "Arjun Das", trees: 842 },
    { name: "Siti Aminah", trees: 764 },
    { name: "Rajesh Kumar", trees: 718 },
    { name: "Linh Pham", trees: 692 },
    { name: "Elena Gilbert", trees: 651 },
    { name: "Karthik Raja", trees: 612 },
    { name: "Wong Kar Wai", trees: 438 },
];

export function WorkerTreesChart() {
    return (
        <Card className="shadow-sm gap-0 p-6">
            <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Trees Tapped — Last 7 Days</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Per worker productivity ranking</p>
            <div className="h-64 w-full">
                <NoSSR>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={workerData} margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--chart-grid)" />
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
                                tickFormatter={(v) => `${v}`}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={100}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
                            />
                            <Tooltip
                                formatter={(value) => [`${Number(value)} trees`, "Trees Tapped"]}
                                contentStyle={{ fontSize: 12 }}
                            />
                            <Bar dataKey="trees" fill={chartColors.primary} radius={[0, 3, 3, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </NoSSR>
            </div>
        </Card>
    );
}
