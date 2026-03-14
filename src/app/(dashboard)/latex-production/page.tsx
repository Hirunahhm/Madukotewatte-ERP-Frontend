"use client";

import { Calendar, Filter, Download, Plus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function LatexProductionPage() {
    const chartData = [
        { name: 'Mon', actual: 400, target: 450 },
        { name: 'Tue', actual: 380, target: 450 },
        { name: 'Wed', actual: 550, target: 450 },
        { name: 'Thu', actual: 480, target: 400 },
        { name: 'Fri', actual: 490, target: 400 },
        { name: 'Sat', actual: 320, target: 350 },
        { name: 'Sun', actual: 200, target: 250 },
    ];

    const loadTrackers = [
        { id: 'L-8821', status: 'Processing', name: 'John D.', time: '10:45 AM', metric: '32.4 mL', vol: '125 LITERS', statusColor: 'bg-yellow-100 text-yellow-700' },
        { id: 'L-8822', status: 'Ready', name: 'Sarah M.', time: '11:15 AM', metric: '31.8 mL', vol: '98 LITERS', statusColor: 'bg-emerald-100 text-brand-700' },
        { id: 'L-8823', status: 'Testing', name: 'Ahmad K.', time: '11:30 AM', metric: '33.1 mL', vol: '142 LITERS', statusColor: 'bg-gray-100 text-gray-700' },
        { id: 'L-8824', status: 'Ready', name: 'Ravi S.', time: '11:55 AM', metric: '32 mL', vol: '110 LITERS', statusColor: 'bg-emerald-100 text-brand-700' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Latex Production Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor quality, log daily intake, and analyze yield trends.</p>
                </div>
                <div className="flex gap-6 text-right">
                    <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">CURRENT PRICE (RSS 1)</span>
                        <p className="text-xl font-bold text-brand-600">$1.82 / kg</p>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">DAILY YIELD DELTA</span>
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">+12.4%</p>
                    </div>
                </div>
            </div>

            {/* Top Row: Chart & Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <Card className="lg:col-span-2 shadow-sm gap-0 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <CardTitle className="text-base font-semibold">Latex Volume Trends</CardTitle>
                            <CardDescription>Daily actual collection vs. weekly target forecasts</CardDescription>
                        </div>
                        <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-lg border border-gray-100 dark:border-gray-700">
                            <Button variant="ghost" size="sm" className="bg-white dark:bg-gray-700 shadow-sm h-7 text-xs text-gray-900 dark:text-gray-100">7 Days</Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">30 Days</Button>
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorO" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorO)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Load Tracker */}
                <Card className="shadow-sm gap-0 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-brand-500" />
                        <CardTitle className="text-base font-semibold">Load Tracker</CardTitle>
                    </div>
                    <CardDescription className="mb-6">Live quality monitoring (Metrolac)</CardDescription>

                    <div className="space-y-4 flex-1">
                        {loadTrackers.map((tracker) => (
                            <div key={tracker.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-50 dark:border-gray-700/30 bg-gray-50/50 dark:bg-gray-800/50">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{tracker.id}</span>
                                        <Badge variant="outline" className={cn("text-[10px] font-bold uppercase border-transparent", tracker.statusColor)}>{tracker.status}</Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{tracker.name} • {tracker.time}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-brand-600">{tracker.metric}</p>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">{tracker.vol}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button variant="outline" className="w-full mt-4 text-sm font-semibold text-gray-700">
                        View All History
                    </Button>
                </Card>
            </div>

            {/* Direct Data Entry */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-brand-500" /> Direct Data Entry
                    </h2>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Session logged as: <span className="font-bold text-gray-900 dark:text-gray-100">Clerk_04 (Main Weigh-in)</span></span>
                </div>
                <Card className="gap-0 p-2">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-12 h-12 shrink-0 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 font-light text-2xl">+</div>
                        <Input type="text" placeholder="Employee Name/ID" className="flex-1 bg-gray-50 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-brand-500" />
                        <Input type="text" placeholder="Liters (L)" className="flex-1 bg-gray-50 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-brand-500" />
                        <Input type="text" placeholder="Mass (kg)" className="flex-1 bg-gray-50 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-brand-500" />
                        <Input type="text" placeholder="Ammonia (CC)" className="flex-1 bg-gray-50 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-brand-500" />
                        <Button className="bg-brand-500 hover:bg-brand-600 font-bold px-8 shadow-sm">Add Record</Button>
                    </div>
                </Card>
            </div>

            {/* Production Chronology (Calendar) */}
            <Card className="shadow-sm gap-0 overflow-hidden p-0 mt-6">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700/40">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-brand-500" /> Production Chronology
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Rain Interference</span>
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500"><div className="w-2 h-2 rounded-full bg-red-400"></div> Public Holiday</span>
                            <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold text-gray-700 h-7">
                                <Filter className="w-3.5 h-3.5" /> Filter
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold text-gray-700 h-7">
                                <Download className="w-3.5 h-3.5" /> Export
                            </Button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">September 2024 Collection Overview</p>
                </div>

                {/* Mock Calendar Grid */}
                <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700/40 bg-gray-50/50 dark:bg-gray-800/50">
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                        <div key={day} className="py-2 text-center text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider border-r border-gray-100 dark:border-gray-700/40 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 grid-rows-4 auto-rows-[120px]">
                    {Array.from({ length: 28 }).map((_, i) => (
                        <div key={i} className="border-r border-b border-gray-100 dark:border-gray-700/40 last:border-r-0 p-2 flex flex-col hover:bg-gray-50 dark:hover:bg-gray-800 hover:cursor-pointer transition-colors">
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{i + 1}</span>
                            <div className="mt-auto">
                                {i % 3 === 0 ? <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 inline-block px-1.5 py-0.5 rounded">No collections</div> : <div className="w-6 h-6 rounded-full bg-brand-100 border border-brand-200"></div>}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
