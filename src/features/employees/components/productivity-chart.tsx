"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { chartPalette } from "@/lib/theme";
import { NoSSR } from "@/components/ui/no-ssr";

const TAPPERS = ["Arjun", "Siti", "Rajesh", "Elena", "Karthik"];

const weekData = [
    { name: "Mon", Arjun: 142, Siti: 128, Rajesh: 115, Elena: 130, Karthik: 45 },
    { name: "Tue", Arjun: 138, Siti: 120, Rajesh: 110, Elena: 125, Karthik: 50 },
    { name: "Wed", Arjun: 155, Siti: 135, Rajesh: 122, Elena: 140, Karthik: 40 },
    { name: "Thu", Arjun: 148, Siti: 130, Rajesh: 118, Elena: 135, Karthik: 55 },
    { name: "Fri", Arjun: 160, Siti: 142, Rajesh: 130, Elena: 150, Karthik: 60 },
    { name: "Sat", Arjun: 120, Siti: 100, Rajesh: 95, Elena: 110, Karthik: 30 },
    { name: "Sun", Arjun: 80, Siti: 70, Rajesh: 60, Elena: 75, Karthik: 20 },
];

const monthData = [
    { name: "W1", Arjun: 710, Siti: 640, Rajesh: 575, Elena: 650, Karthik: 225 },
    { name: "W2", Arjun: 740, Siti: 660, Rajesh: 590, Elena: 670, Karthik: 240 },
    { name: "W3", Arjun: 720, Siti: 650, Rajesh: 580, Elena: 660, Karthik: 230 },
    { name: "W4", Arjun: 760, Siti: 680, Rajesh: 610, Elena: 690, Karthik: 250 },
];

const yearData = [
    { name: "Jan", Arjun: 1840, Siti: 1640, Rajesh: 1480, Elena: 1680, Karthik: 920 },
    { name: "Feb", Arjun: 1760, Siti: 1580, Rajesh: 1420, Elena: 1620, Karthik: 880 },
    { name: "Mar", Arjun: 1900, Siti: 1700, Rajesh: 1540, Elena: 1740, Karthik: 960 },
    { name: "Apr", Arjun: 1820, Siti: 1640, Rajesh: 1480, Elena: 1660, Karthik: 900 },
    { name: "May", Arjun: 1950, Siti: 1750, Rajesh: 1580, Elena: 1790, Karthik: 980 },
    { name: "Jun", Arjun: 1800, Siti: 1620, Rajesh: 1460, Elena: 1640, Karthik: 870 },
    { name: "Jul", Arjun: 1880, Siti: 1680, Rajesh: 1520, Elena: 1720, Karthik: 940 },
    { name: "Aug", Arjun: 1920, Siti: 1720, Rajesh: 1560, Elena: 1760, Karthik: 960 },
    { name: "Sep", Arjun: 1860, Siti: 1660, Rajesh: 1500, Elena: 1700, Karthik: 920 },
    { name: "Oct", Arjun: 1940, Siti: 1740, Rajesh: 1580, Elena: 1780, Karthik: 970 },
    { name: "Nov", Arjun: 1780, Siti: 1600, Rajesh: 1440, Elena: 1640, Karthik: 890 },
    { name: "Dec", Arjun: 1700, Siti: 1520, Rajesh: 1380, Elena: 1560, Karthik: 840 },
];

const NO_WORK_REASONS = ["Rain", "Dry Season", "Religious Celebration", "Funeral", "All Sick", "Government Holiday", "Public Holiday"];

type TimeScale = "week" | "month" | "year";

export function ProductivityChart() {
    const [timeScale, setTimeScale] = useState<TimeScale>("week");
    const [noWorkReason, setNoWorkReason] = useState<string | null>(null);

    const data = timeScale === "week" ? weekData : timeScale === "month" ? monthData : yearData;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-sm gap-0 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <CardTitle className="text-base font-semibold">Production Yield Trend</CardTitle>
                        <CardDescription>Trees tapped per employee across the estate</CardDescription>
                    </div>
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
                        {(["week", "month", "year"] as TimeScale[]).map((scale) => (
                            <Button
                                key={scale}
                                size="sm"
                                variant="ghost"
                                onClick={() => setTimeScale(scale)}
                                className={`h-7 text-xs capitalize ${timeScale === scale ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                {scale === "week" ? "This Week" : scale === "month" ? "Month" : "Year"}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="h-64 w-full">
                    <NoSSR>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} />
                                <YAxis domain={[0, 2000]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} />
                                <Tooltip cursor={{ fill: '#f0fdf4' }} />
                                {TAPPERS.map((name, i) => (
                                    <Bar key={name} dataKey={name} fill={chartPalette[i]} radius={[4, 4, 0, 0]} barSize={timeScale === "year" ? 8 : 14} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </NoSSR>
                </div>
            </Card>
            <div className="flex flex-col gap-6">
                {/* Record No Work Card */}
                <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 flex-1 shadow-sm gap-0">
                    <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-3">RECORD NO WORK</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Select a reason why no tapping occurred today.</p>
                    <div className="flex flex-wrap gap-2">
                        {NO_WORK_REASONS.map((reason) => (
                            <button
                                key={reason}
                                onClick={() => setNoWorkReason(noWorkReason === reason ? null : reason)}
                                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${noWorkReason === reason
                                        ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                                        : "bg-slate-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent hover:border-gray-300 dark:hover:border-gray-500"
                                    }`}
                            >
                                {reason}
                            </button>
                        ))}
                    </div>
                </Card>
                {/* Average Productivity Card */}
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
