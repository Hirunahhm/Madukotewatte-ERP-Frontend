"use client";

import { useState } from "react";
import { Calendar, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadDialog, type LoadData } from "./load-dialog";

const loadTrackers: (LoadData & { name: string; time: string; metric: string; vol: string; statusColor: string })[] = [
    { id: "L-8821", startDate: "2026-03-19", loadType: "field-latex", status: "in-progress", name: "John D.", time: "10:45 AM", metric: "32.4 mL", vol: "125 LITERS", statusColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400" },
    { id: "L-8822", startDate: "2026-03-19", loadType: "processed", status: "completed", name: "Sarah M.", time: "11:15 AM", metric: "31.8 mL", vol: "98 LITERS", statusColor: "bg-emerald-100 text-brand-700 dark:bg-emerald-900/40 dark:text-emerald-400" },
    { id: "L-8823", startDate: "2026-03-18", loadType: "scrap", status: "scheduled", name: "Ahmad K.", time: "11:30 AM", metric: "33.1 mL", vol: "142 LITERS", statusColor: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" },
    { id: "L-8824", startDate: "2026-03-18", loadType: "field-latex", status: "completed", name: "Ravi S.", time: "11:55 AM", metric: "32 mL", vol: "110 LITERS", statusColor: "bg-emerald-100 text-brand-700 dark:bg-emerald-900/40 dark:text-emerald-400" },
];

const STATUS_LABELS: Record<string, string> = {
    "in-progress": "Processing",
    "completed": "Ready",
    "scheduled": "Testing",
};

export function LoadTracker() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedLoad, setSelectedLoad] = useState<LoadData | null>(null);

    function openCreate() {
        setSelectedLoad(null);
        setDialogOpen(true);
    }

    function openEdit(tracker: typeof loadTrackers[0]) {
        setSelectedLoad({
            id: tracker.id,
            startDate: tracker.startDate,
            loadType: tracker.loadType,
            status: tracker.status,
        });
        setDialogOpen(true);
    }

    return (
        <Card className="shadow-sm gap-0 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-brand-500" />
                    <CardTitle className="text-base font-semibold">Load Tracker</CardTitle>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs font-semibold h-7"
                    onClick={openCreate}
                >
                    <Plus className="w-3.5 h-3.5" /> Create New Load
                </Button>
            </div>
            <CardDescription className="mb-6">Live quality monitoring (Metrolac)</CardDescription>

            <div className="space-y-4 flex-1">
                {loadTrackers.map((tracker) => (
                    <div
                        key={tracker.id}
                        onClick={() => openEdit(tracker)}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-50 dark:border-gray-700/30 bg-gray-50/50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100/70 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{tracker.id}</span>
                                <Badge variant="outline" className={cn("text-[10px] font-bold uppercase border-transparent", tracker.statusColor)}>
                                    {STATUS_LABELS[tracker.status] ?? tracker.status}
                                </Badge>
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

            <Button variant="outline" className="w-full mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                View All History
            </Button>

            <LoadDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                initialData={selectedLoad}
            />
        </Card>
    );
}
