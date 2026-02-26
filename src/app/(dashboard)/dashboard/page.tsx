"use client";

import { Droplet, Scale, Zap, CloudLightning, TreeDeciduous } from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    // Mock data for the heatmap-like "Workforce Engagement" (Latex Tapping)
    const workforceData = Array.from({ length: 28 }).map((_, i) => ({
        day: i + 1,
        attendance: Math.floor(Math.random() * 4) // 0-3 levels of green
    }));

    // Mock data for the Line/Area chart (Latex Collection Calendar)
    const chartData = [
        { name: 'Mon', uv: 400 },
        { name: 'Tue', uv: 300 },
        { name: 'Wed', uv: 550 },
        { name: 'Thu', uv: 480 },
        { name: 'Fri', uv: 620 },
        { name: 'Sat', uv: 320 },
        { name: 'Sun', uv: 200 },
    ];

    return (
        <div className="space-y-6">
            {/* Top Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500">Estate overview and daily operations</p>
                </div>
            </div>

            {/* KPI Cards Row (Based on Screenshot 1) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Latex */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50 text-brand-500">
                            <Droplet className="h-5 w-5" />
                        </div>
                        <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            +5.2%
                        </span>
                    </div>
                    <p className="mt-4 text-sm font-medium text-gray-500">Total Latex</p>
                    <p className="mt-1 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-gray-900">14,250</span>
                        <span className="text-sm font-medium text-gray-500">Liters</span>
                    </p>
                </div>

                {/* Total Mass */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-500">
                            <Scale className="h-5 w-5" />
                        </div>
                        <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            -1.8%
                        </span>
                    </div>
                    <p className="mt-4 text-sm font-medium text-gray-500">Total Mass</p>
                    <p className="mt-1 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-gray-900">4,820</span>
                        <span className="text-sm font-medium text-gray-500">kg</span>
                    </p>
                </div>

                {/* Avg Metrolac */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-100 text-zinc-900">
                            <Zap className="h-5 w-5" />
                        </div>
                        <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            +0.5%
                        </span>
                    </div>
                    <p className="mt-4 text-sm font-medium text-gray-500">Avg Metrolac</p>
                    <p className="mt-1 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-gray-900">32.4</span>
                        <span className="text-sm font-medium text-gray-500">% DRC</span>
                    </p>
                </div>
            </div>

            {/* Middle Row: Weather + Calendar */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Climate Outlook */}
                <div className="rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col">
                    <div className="p-6 pb-0">
                        <h2 className="text-base font-semibold leading-6 text-gray-900">Climate Outlook</h2>
                        <p className="text-sm text-gray-500">Weather conditions impacting tapping schedules</p>
                    </div>
                    <div className="flex-1 p-6">
                        <div className="flex h-full items-center justify-between rounded-lg border border-gray-100 p-6">
                            <div className="flex items-center gap-6">
                                <CloudLightning className="h-16 w-16 text-gray-400" />
                                <div>
                                    <p className="text-4xl font-bold text-gray-900">28°C</p>
                                    <p className="text-sm font-medium text-gray-900">Banting, Selangor</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <CloudLightning className="h-3 w-3" /> 12 km/h NW
                                    </p>
                                </div>
                            </div>

                            {/* 5-day forecast */}
                            <div className="hidden sm:flex items-center gap-4 text-center border-l border-gray-100 pl-6 ml-6">
                                {['MON', 'TUE', 'WED', 'THU', 'FRI'].map((day, i) => (
                                    <div key={day} className="flex flex-col items-center gap-2">
                                        <span className="text-xs font-semibold text-gray-500">{day}</span>
                                        <CloudLightning className="h-6 w-6 text-gray-400" />
                                        <span className="text-xs font-bold text-gray-900">{28 - i}°C</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Latex Collection Calendar / Line Chart */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="text-base font-semibold leading-6 text-gray-900">Production Yield Trend</h2>
                    <p className="text-sm text-gray-500 mb-6">Daily latex collection average across all tappers (Litres)</p>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="uv" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row - Charts & Stats */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Financial Health (Donut) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1 rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col items-center justify-center">
                        <h3 className="text-xs font-bold text-gray-500 tracking-wider mb-6 self-start w-full text-center">LIQUIDITY DISTRIBUTION</h3>
                        {/* Mock Donut Chart via SVG */}
                        <div className="relative w-32 h-32 mb-4">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                {/* Background Circle */}
                                <path
                                    className="text-gray-100"
                                    strokeWidth="4"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                {/* Progress Circle (65%) */}
                                <path
                                    className="text-brand-500"
                                    strokeDasharray="65, 100"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                        </div>
                        <div className="flex w-full justify-between text-xs font-medium mt-auto border-t border-gray-50 pt-4">
                            <div className="flex flex-col"><span className="flex items-center gap-1 before:w-2 before:h-2 before:bg-brand-500 before:rounded-full">Cash in Hand</span><span className="text-gray-500">(65%)</span></div>
                            <div className="flex flex-col"><span className="flex items-center gap-1 before:w-2 before:h-2 before:bg-gray-200 before:rounded-full">Credit</span><span className="text-gray-500">(35%)</span></div>
                        </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
                        <div className="rounded-xl border border-brand-100 bg-brand-50 p-6 flex-1 flex flex-col justify-center">
                            <span className="text-xs font-bold text-brand-700">TOTAL SALES (MTD)</span>
                            <p className="text-2xl font-bold text-brand-900 mt-2">$124,500.00</p>
                            <span className="text-xs text-brand-600 mt-2">↗ 12% growth vs last month</span>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-white p-6 flex-1 flex flex-col justify-center shadow-sm">
                            <span className="text-xs font-bold text-gray-900">OPERATIONAL EXPENSE</span>
                            <p className="text-2xl font-bold text-gray-900 mt-2">$42,320.00</p>
                            <div className="w-full bg-gray-100 h-1 mt-3 rounded-full overflow-hidden">
                                <div className="bg-red-500 h-full w-[45%] rounded-full"></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-2">45% of monthly budget utilized</span>
                        </div>
                    </div>
                </div>

                {/* Workforce Engagement (Heatmap) */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-base font-semibold leading-6 text-gray-900">Workforce Engagement</h2>
                            <p className="text-sm text-gray-500">Active tappers per day (Last 28 Days)</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-green-50 text-brand-600 flex items-center justify-center">
                                <TreeDeciduous className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">128 Tappers Active</p>
                                <p className="text-xs text-gray-500">Current deployment: 92% capacity</p>
                            </div>
                        </div>
                    </div>

                    {/* Simple Grid to mimic GitHub contribution graph / Heatmap */}
                    <div className="grid grid-cols-7 gap-2 mb-6">
                        {workforceData.map((d, i) => {
                            const bgColors = [
                                'bg-gray-100', // 0
                                'bg-green-200', // 1
                                'bg-brand-400', // 2
                                'bg-brand-500', // 3
                            ];
                            return (
                                <div
                                    key={i}
                                    className={cn("w-full aspect-square rounded-sm", bgColors[d.attendance])}
                                    title={`Day ${d.day} - Level ${d.attendance}`}
                                />
                            )
                        })}
                    </div>

                    <div className="flex items-center justify-between text-xs font-medium text-gray-500 pt-4 border-t border-gray-50">
                        <span>Highest Attendance: <span className="text-brand-600 font-bold">May 14th</span></span>
                        <span>Rain Disruption: <span className="text-red-500 font-bold">6 Days</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
