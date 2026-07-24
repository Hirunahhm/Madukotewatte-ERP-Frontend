"use client";

import { useState } from "react";
import { Calendar, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoadDialog, type LoadData } from "./load-dialog";
import { useLoads } from "@/features/production/hooks/use-production";

const STATUS_LABELS: Record<string, string> = {
    "in-progress": "Processing",
    "completed": "Ready",
    "scheduled": "Testing",
    "pending": "Pending",
};

const STATUS_COLORS: Record<string, string> = {
    "in-progress": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    "completed": "bg-emerald-100 text-brand-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    "scheduled": "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    "pending": "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

export function LoadTracker() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedLoad, setSelectedLoad] = useState<LoadData | null>(null);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyPage, setHistoryPage] = useState(0);

    const { data, isLoading } = useLoads({ loadType: "field-latex", size: 10, sort: "startDate,desc" });
    const loads = data?.content ?? [];

    const { data: historyData, isLoading: historyLoading } = useLoads({ loadType: "field-latex", page: historyPage, size: 10, sort: "startDate,desc" });
    const historyRows = historyData?.content ?? [];
    const historyTotalPages = historyData?.totalPages ?? 1;

    function openCreate() {
        setSelectedLoad(null);
        setDialogOpen(true);
    }

    function openEdit(load: typeof loads[0]) {
        setSelectedLoad({
            id: load.loadId,
            startDate: load.startDate.split("T")[0],
            loadType: load.loadType,
            status: load.status,
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
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                    </div>
                ) : loads.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No loads found. Create one to get started.</p>
                ) : (
                    loads.map((load) => (
                        <div
                            key={load.loadId}
                            onClick={() => openEdit(load)}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-50 dark:border-gray-700/30 bg-gray-50/50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100/70 dark:hover:bg-gray-700/50 transition-colors"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm text-gray-900 dark:text-gray-100 font-mono">{load.loadId.slice(0, 8).toUpperCase()}</span>
                                    <Badge variant="outline" className={cn("text-[10px] font-bold uppercase border-transparent", STATUS_COLORS[load.status] ?? STATUS_COLORS.pending)}>
                                        {STATUS_LABELS[load.status] ?? load.status}
                                    </Badge>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium capitalize">{load.loadType.replace("-", " ")} · {new Date(load.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-gray-400 mt-1 capitalize">{load.loadType}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Button
                variant="outline"
                className="w-full mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300"
                onClick={() => { setHistoryPage(0); setHistoryOpen(true); }}
            >
                View All History
            </Button>

            <LoadDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                initialData={selectedLoad}
                defaultLoadType="field-latex"
            />

            <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>All Latex Loads</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                        {historyLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                            </div>
                        ) : historyRows.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-8">No loads found.</p>
                        ) : historyRows.map((load) => (
                            <div
                                key={load.loadId}
                                className="flex items-center justify-between p-3 rounded-lg border border-gray-50 dark:border-gray-700/30 bg-gray-50/50 dark:bg-gray-800/50"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-sm text-gray-900 dark:text-gray-100 font-mono">{load.loadId.slice(0, 8).toUpperCase()}</span>
                                        <Badge variant="outline" className={cn("text-[10px] font-bold uppercase border-transparent", STATUS_COLORS[load.status] ?? STATUS_COLORS.pending)}>
                                            {STATUS_LABELS[load.status] ?? load.status}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium capitalize">{load.loadType.replace("-", " ")} · {new Date(load.startDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Page {historyPage + 1} of {historyTotalPages}</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={historyPage === 0} onClick={() => setHistoryPage((p) => p - 1)}>Prev</Button>
                            <Button variant="outline" size="sm" disabled={historyPage >= historyTotalPages - 1} onClick={() => setHistoryPage((p) => p + 1)}>Next</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
