"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useTopPerformers } from "@/features/employees/hooks/use-productivity";

const RANK_STYLES = [
    { badge: "bg-yellow-100 text-yellow-700", tier: "#1" },
    { badge: "bg-gray-100 text-gray-600", tier: "#2" },
    { badge: "bg-orange-100 text-orange-700", tier: "#3" },
];

export function TopPerformers() {
    const { topPerformers, isLoading } = useTopPerformers();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-10 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
            </div>
        );
    }

    if (topPerformers.length === 0) {
        return (
            <Card className="shadow-sm p-6 text-center text-sm text-gray-400">
                No attendance data recorded this week yet.
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topPerformers.map((performer, idx) => (
                <Card key={performer.employeeId} className="shadow-sm gap-0 p-6 relative">
                    <Badge className={`absolute top-4 right-4 border-transparent ${RANK_STYLES[idx].badge}`}>
                        {RANK_STYLES[idx].tier}
                    </Badge>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{performer.employeeName}</h3>
                            <p className="text-xs text-brand-600">This week&apos;s leaderboard</p>
                        </div>
                    </div>
                    <div className="flex items-end justify-between border-t border-gray-50 dark:border-gray-700/30 pt-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">TREES TAPPED (WEEK)</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{performer.trees}</p>
                        </div>
                        <Badge variant="secondary" className="text-[10px] font-bold text-gray-500">Elite Tier</Badge>
                    </div>
                </Card>
            ))}
        </div>
    );
}
