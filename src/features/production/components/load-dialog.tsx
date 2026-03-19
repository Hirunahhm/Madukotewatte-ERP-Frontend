"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface LoadData {
    id: string;
    startDate: string;
    loadType: string;
    status: string;
}

interface LoadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: LoadData | null;
}

export function LoadDialog({ open, onOpenChange, initialData }: LoadDialogProps) {
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
                    <DialogTitle>{isEdit ? `Edit Load — ${initialData?.id}` : "Create New Load"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input
                            id="start-date"
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
                                <SelectItem value="field-latex">Field Latex</SelectItem>
                                <SelectItem value="processed">Processed</SelectItem>
                                <SelectItem value="scrap">Scrap</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {isEdit && (
                        <div className="space-y-1.5">
                            <Label htmlFor="load-id">Load ID</Label>
                            <Input
                                id="load-id"
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
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-brand-500 hover:bg-brand-600 font-semibold"
                            onClick={() => onOpenChange(false)}
                        >
                            {isEdit ? "Save Changes" : "Create Load"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
