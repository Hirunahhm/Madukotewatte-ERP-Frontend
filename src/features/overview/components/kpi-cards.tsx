"use client";

import { Droplet, Users, Zap, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useDashboardKpis } from "@/features/overview/hooks/use-overview";

export function KpiCards() {
    const { isLoading, latestLoadId, totalLatex, avgMetrolac, presentEmployees, totalActiveEmployees } = useDashboardKpis();

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Latex */}
            <Card className="shadow-sm gap-0 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50 dark:bg-green-950/40 text-brand-500">
                        <Droplet className="h-5 w-5" />
                    </div>
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
                    ) : latestLoadId ? (
                        <span className="font-mono text-[10px] font-medium text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-full">
                            {latestLoadId.slice(0, 8).toUpperCase()}
                        </span>
                    ) : null}
                </div>
                <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">Total Latex (Current Load)</p>
                <p className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{totalLatex.toLocaleString()}</span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Liters</span>
                </p>
            </Card>

            {/* Today's Attendance */}
            <Card className="shadow-sm gap-0 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-500">
                        <Users className="h-5 w-5" />
                    </div>
                    <span className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        Today
                    </span>
                </div>
                <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">Today&apos;s Attendance</p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-brand-500" /> : `${presentEmployees.length} / ${totalActiveEmployees} Present`}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5 max-h-24 overflow-hidden">
                    {presentEmployees.map((name) => (
                        <span
                            key={name}
                            className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300"
                        >
                            {name}
                        </span>
                    ))}
                </div>
            </Card>

            {/* Avg Metrolac */}
            <Card className="shadow-sm gap-0 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                        <Zap className="h-5 w-5" />
                    </div>
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
                    ) : latestLoadId ? (
                        <span className="font-mono text-[10px] font-medium text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-full">
                            {latestLoadId.slice(0, 8).toUpperCase()}
                        </span>
                    ) : null}
                </div>
                <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">Avg Metrolac (Current Load)</p>
                <p className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        {avgMetrolac == null ? "—" : avgMetrolac.toFixed(1)}
                    </span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Reading</span>
                </p>
            </Card>
        </div>
    );
}
