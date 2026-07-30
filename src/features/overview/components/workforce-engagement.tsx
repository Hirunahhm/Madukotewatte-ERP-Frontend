"use client";

import { TreeDeciduous, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useWorkforceEngagement } from "@/features/overview/hooks/use-overview";

const LEVEL_COLORS = [
    "bg-gray-100 dark:bg-gray-700",
    "bg-green-200 dark:bg-green-800",
    "bg-brand-400",
    "bg-brand-500",
];

function formatShortDate(dateStr: string): string {
    if (!dateStr) return "—";
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function WorkforceEngagement() {
    const { days, highestDay, rainDays, totalActiveTappers, isLoading } = useWorkforceEngagement();
    const today = days[days.length - 1];
    const deploymentPct = totalActiveTappers > 0 && today ? Math.round((today.presentCount / totalActiveTappers) * 100) : 0;

    return (
        <Card className="shadow-sm gap-0 p-6 relative">
            {isLoading && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-brand-500" /></div>}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Workforce Engagement</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active tappers per day (Last 28 Days)</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-green-50 dark:bg-green-950/40 text-brand-600 flex items-center justify-center">
                        <TreeDeciduous className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{totalActiveTappers} Tappers Active</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Today&apos;s deployment: {deploymentPct}% capacity</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-6">
                {days.map((d) => (
                    <div
                        key={d.date}
                        className={cn("w-full aspect-square rounded-sm", LEVEL_COLORS[d.level])}
                        title={`${d.date} — ${d.presentCount} present${d.rained ? " (rain)" : ""}`}
                    />
                ))}
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-50 dark:border-gray-700/30">
                <span>Highest Attendance: <span className="text-brand-600 font-bold">{formatShortDate(highestDay.date)}</span></span>
                <span>Rain Disruption: <span className="text-red-500 font-bold">{rainDays} Days</span></span>
            </div>
        </Card>
    );
}
