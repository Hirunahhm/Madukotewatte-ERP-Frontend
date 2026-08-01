"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDeleteLoad } from "@/features/production/hooks/use-production";
import { toLocalDateInputValue } from "@/lib/utils";

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
    defaultLoadType?: string;
}

export function LoadDialog({ open, onOpenChange, initialData, defaultLoadType }: LoadDialogProps) {
    const isEdit = initialData !== null;
    const queryClient = useQueryClient();

    const [startDate, setStartDate] = useState("");
    const [loadType, setLoadType] = useState("");
    const [loadId, setLoadId] = useState("");
    const [status, setStatus] = useState("");

    const mutation = useMutation({
        mutationFn: async ({ sDate, lType, lStatus }: { sDate: string; lType: string; lStatus: string }) => {
            const payload = {
                loadType: lType,
                startDate: `${sDate}T00:00:00`,
                status: lStatus,
            };
            const url = isEdit ? `/api/loads/${initialData!.id}` : "/api/loads";
            const response = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error("Failed to save load");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["loads"] });
            onOpenChange(false);
        }
    });

    const deleteMutation = useDeleteLoad();

    useEffect(() => {
        if (initialData) {
            setStartDate(initialData.startDate);
            setLoadType(initialData.loadType);
            setLoadId(initialData.id);
            setStatus(initialData.status);
        } else {
            setStartDate(toLocalDateInputValue());
            setLoadType(defaultLoadType ?? "");
            setLoadId("");
            setStatus("");
        }
    }, [initialData, open, defaultLoadType]);

    const handleSubmit = () => {
        mutation.mutate({ sDate: startDate, lType: loadType, lStatus: status });
    };

    async function handleDelete() {
        if (!initialData) return;
        if (!window.confirm(`Delete load ${initialData.id}? This cannot be undone.`)) return;
        await deleteMutation.mutateAsync(initialData.id);
        onOpenChange(false);
    }

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
                                <SelectItem value="manioc">Manioc</SelectItem>
                                <SelectItem value="coconut">Coconut</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
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
                                disabled
                                className="bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 cursor-not-allowed"
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
                        {isEdit && (
                            <Button
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                                onClick={handleDelete}
                                disabled={mutation.isPending || deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                            disabled={mutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-brand-500 hover:bg-brand-600 font-semibold"
                            onClick={handleSubmit}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? "Save Changes" : "Create Load"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
