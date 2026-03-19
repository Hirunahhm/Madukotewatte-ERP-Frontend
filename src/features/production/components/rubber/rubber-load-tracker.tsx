"use client";

import { useState, useEffect } from "react";
import { Package, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface RubberBatchData {
    id: string;
    startDate: string;
    loadType: string;
    status: string;
}

interface RubberBatch extends RubberBatchData {
    weight: string;
    statusColor: string;
}

const STATUS_LABELS: Record<string, string> = {
    sorting: "Sorting",
    baled: "Baled",
    dispatched: "Dispatched",
};

const STATUS_COLORS: Record<string, string> = {
    sorting: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    baled: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    dispatched: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
};

const BATCHES: RubberBatch[] = [
    { id: "RB-001", startDate: "2026-03-19", loadType: "cup-coagulum", status: "sorting", weight: "42 kg", statusColor: STATUS_COLORS.sorting },
    { id: "RB-002", startDate: "2026-03-18", loadType: "slab", status: "baled", weight: "67 kg", statusColor: STATUS_COLORS.baled },
    { id: "RB-003", startDate: "2026-03-17", loadType: "mixed", status: "dispatched", weight: "55 kg", statusColor: STATUS_COLORS.dispatched },
];

function RubberLoadDialog({ open, onOpenChange, initialData }: { open: boolean; onOpenChange: (v: boolean) => void; initialData: RubberBatchData | null }) {
    const isEdit = initialData !== null;
    const [startDate, setStartDate] = useState("");
    const [loadType, setLoadType] = useState("");
    const [loadId, setLoadId] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (initialData) {
            setStartDate(initialData.startDate);
            setLoadType(initialData.loadType);
            setLoadId(initialData.id);
            setStatus(initialData.status);
        } else {
            setStartDate(new Date().toISOString().split("T")[0]);
            setLoadType("");
            setLoadId("");
            setStatus("");
        }
    }, [initialData, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? `Edit Batch — ${initialData?.id}` : "New Solid Batch"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="rb-start-date">Start Date</Label>
                        <Input
                            id="rb-start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Load Type</Label>
                        <Select value={loadType} onValueChange={(v) => { if (v !== null) setLoadType(v); }}>
                            <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectValue placeholder="Select type…" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cup-coagulum">Cup Coagulum</SelectItem>
                                <SelectItem value="slab">Slab</SelectItem>
                                <SelectItem value="mixed">Mixed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {isEdit && (
                        <div className="space-y-1.5">
                            <Label htmlFor="rb-load-id">Load ID</Label>
                            <Input
                                id="rb-load-id"
                                type="text"
                                value={loadId}
                                onChange={(e) => setLoadId(e.target.value)}
                                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            />
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <Label>Status</Label>
                        <Select value={status} onValueChange={(v) => { if (v !== null) setStatus(v); }}>
                            <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectValue placeholder="Select status…" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sorting">Sorting</SelectItem>
                                <SelectItem value="baled">Baled</SelectItem>
                                <SelectItem value="dispatched">Dispatched</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button className="flex-1 bg-amber-500 hover:bg-amber-600 font-semibold text-white" onClick={() => onOpenChange(false)}>
                            {isEdit ? "Save Changes" : "Create Batch"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function RubberLoadTracker() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<RubberBatchData | null>(null);

    function openCreate() {
        setSelectedBatch(null);
        setDialogOpen(true);
    }

    function openEdit(batch: RubberBatch) {
        setSelectedBatch({ id: batch.id, startDate: batch.startDate, loadType: batch.loadType, status: batch.status });
        setDialogOpen(true);
    }

    return (
        <Card className="shadow-sm gap-0 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-500" />
                    <CardTitle className="text-base font-semibold">Solid Batch Tracker</CardTitle>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold h-7" onClick={openCreate}>
                    <Plus className="w-3.5 h-3.5" /> New Load
                </Button>
            </div>
            <CardDescription className="mb-6">Rubber solid batch processing status</CardDescription>

            <div className="space-y-4 flex-1">
                {BATCHES.map((batch) => (
                    <div
                        key={batch.id}
                        onClick={() => openEdit(batch)}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-50 dark:border-gray-700/30 bg-gray-50/50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100/70 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{batch.id}</span>
                                <Badge variant="outline" className={cn("text-[10px] font-bold uppercase border-transparent", batch.statusColor)}>
                                    {STATUS_LABELS[batch.status] ?? batch.status}
                                </Badge>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{batch.startDate}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{batch.weight}</p>
                        </div>
                    </div>
                ))}
            </div>

            <RubberLoadDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={selectedBatch} />
        </Card>
    );
}
