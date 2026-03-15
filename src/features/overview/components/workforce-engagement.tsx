"use client";

import { TreeDeciduous } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const workforceData = Array.from({ length: 28 }).map((_, i) => ({
    day: i + 1,
    attendance: i % 4,
}));

export function WorkforceEngagement() {
    return (
        <Card className="shadow-sm gap-0 p-6">
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
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">128 Tappers Active</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Current deployment: 92% capacity</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-6">
                {workforceData.map((d, i) => {
                    const bgColors = [
                        'bg-gray-100 dark:bg-gray-700',
                        'bg-green-200 dark:bg-green-800',
                        'bg-brand-400',
                        'bg-brand-500',
                    ];
                    return (
                        <div
                            key={i}
                            className={cn("w-full aspect-square rounded-sm", bgColors[d.attendance])}
                            title={`Day ${d.day} - Level ${d.attendance}`}
                        />
                    );
                })}
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-50 dark:border-gray-700/30">
                <span>Highest Attendance: <span className="text-brand-600 font-bold">May 14th</span></span>
                <span>Rain Disruption: <span className="text-red-500 font-bold">6 Days</span></span>
            </div>
        </Card>
    );
}
