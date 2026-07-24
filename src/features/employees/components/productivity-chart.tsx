"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { chartPalette } from "@/lib/theme";
import { NoSSR } from "@/components/ui/no-ssr";
import { Loader2 } from "lucide-react";
import { useProductivity } from "@/features/employees/hooks/use-productivity";
import { useBulkAttendance } from "@/features/employees/hooks/use-attendance-mutations";
import { getEmployeesSummary } from "@/features/employees/services/employee-service";
import { ABSENCE_REASONS, type NoWorkReason } from "@/features/employees/types/attendance.types";
import type { TimeScale } from "@/features/employees/utils/date-buckets";

export function ProductivityChart() {
    const [timeScale, setTimeScale] = useState<TimeScale>("week");
    const [noWorkReason, setNoWorkReason] = useState<NoWorkReason | null>(null);

    const { chartData, employeeNames, averageProductivity, isLoading } = useProductivity(timeScale);
    const bulkAttendance = useBulkAttendance();

    const { data: employeesSummary } = useQuery({
        queryKey: ["employees", "summary"],
        queryFn: getEmployeesSummary,
    });

    async function handleRecordNoWork() {
        if (!noWorkReason || !employeesSummary) return;
        const activeEmployees = employeesSummary.filter((e) => e.isActive);
        const today = new Date().toISOString().split("T")[0];
        await bulkAttendance.mutateAsync({
            attendances: activeEmployees.map((emp) => ({
                employeeId: emp.employeeId,
                timestamp: `${today}T06:00:00`,
                noOfTrees: 0,
                noWork: noWorkReason,
            })),
        });
        setNoWorkReason(null);
    }

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
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                    ) : (
                        <NoSSR>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} />
                                    <Tooltip cursor={{ fill: '#f0fdf4' }} />
                                    {employeeNames.map((name, i) => (
                                        <Bar key={name} dataKey={name} fill={chartPalette[i % chartPalette.length]} radius={[4, 4, 0, 0]} barSize={timeScale === "year" ? 8 : 14} />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </NoSSR>
                    )}
                </div>
            </Card>
            <div className="flex flex-col gap-6">
                {/* Record No Work Card */}
                <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 flex-1 shadow-sm gap-0">
                    <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-3">RECORD NO WORK (ALL STAFF)</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Mark every active employee as no-work today.</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {ABSENCE_REASONS.map((reason) => (
                            <button
                                key={reason.value}
                                onClick={() => setNoWorkReason(noWorkReason === reason.value ? null : reason.value)}
                                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${noWorkReason === reason.value
                                        ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                                        : "bg-slate-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent hover:border-gray-300 dark:hover:border-gray-500"
                                    }`}
                            >
                                {reason.label}
                            </button>
                        ))}
                    </div>
                    <Button
                        size="sm"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                        disabled={!noWorkReason || bulkAttendance.isPending}
                        onClick={handleRecordNoWork}
                    >
                        {bulkAttendance.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Apply to All Active Employees
                    </Button>
                </Card>
                {/* Average Productivity Card */}
                <Card className="shadow-sm p-6 flex-1 flex flex-col justify-center gap-0">
                    <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-2">AVERAGE PRODUCTIVITY</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{averageProductivity} <span className="text-sm font-medium text-gray-500 dark:text-gray-400">trees / tapper</span></p>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-1 mt-6 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full" style={{ width: `${Math.min((averageProductivity / 200) * 100, 100)}%` }}></div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
