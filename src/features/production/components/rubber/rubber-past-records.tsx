"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Pencil, Trash2, X } from "lucide-react";
import {
    useRubberSolidRecords,
    useUpdateRubberSolidRecord,
    useDeleteRubberSolidRecord,
} from "@/features/production/hooks/use-production";
import type { RubberSolidRecord } from "@/features/production/types/production.types";

function EditRecordDialog({ record, onClose }: { record: RubberSolidRecord | null; onClose: () => void }) {
    const [massKg, setMassKg] = useState("");
    const [date, setDate] = useState("");
    const updateMutation = useUpdateRubberSolidRecord();

    useEffect(() => {
        if (record) {
            setMassKg(String(record.massKg));
            setDate(record.timestamp.split("T")[0]);
        }
    }, [record]);

    async function handleSave() {
        if (!record || !massKg || !date) return;
        await updateMutation.mutateAsync({
            id: record.recordId,
            payload: { loadId: record.loadId, massKg: parseFloat(massKg), timestamp: `${date}T00:00:00` },
        });
        setMassKg("");
        setDate("");
        onClose();
    }

    function handleClose() {
        setMassKg("");
        setDate("");
        onClose();
    }

    return (
        <Dialog open={record !== null} onOpenChange={(open) => { if (!open) handleClose(); }}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Scrap Record</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                    <div className="space-y-1.5">
                        <Label>Mass (kg)</Label>
                        <Input type="number" value={massKg} onChange={(e) => setMassKg(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Date</Label>
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1" onClick={handleClose}>
                            <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
                        </Button>
                        <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={handleSave} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function RubberPastRecords() {
    const [page, setPage] = useState(0);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [editing, setEditing] = useState<RubberSolidRecord | null>(null);

    const { data, isLoading } = useRubberSolidRecords({
        page,
        size: 10,
        from: from ? `${from}T00:00:00` : undefined,
        to: to ? `${to}T23:59:59` : undefined,
    });
    const records = data?.content ?? [];
    const totalPages = data?.totalPages ?? 1;

    const deleteMutation = useDeleteRubberSolidRecord();

    async function handleDelete(record: RubberSolidRecord) {
        if (!window.confirm("Delete this scrap record? This cannot be undone.")) return;
        await deleteMutation.mutateAsync(record.recordId);
    }

    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                <CardTitle className="text-base font-semibold">Past Scrap Records</CardTitle>
                <div className="flex flex-wrap items-end gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-gray-500">From</Label>
                        <Input type="date" className="h-8 text-xs w-36" value={from} onChange={(e) => { setFrom(e.target.value); setPage(0); }} />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-gray-500">To</Label>
                        <Input type="date" className="h-8 text-xs w-36" value={to} onChange={(e) => { setTo(e.target.value); setPage(0); }} />
                    </div>
                    {(from || to) && (
                        <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs text-gray-500" onClick={() => { setFrom(""); setTo(""); setPage(0); }}>
                            <X className="w-3 h-3" /> Clear
                        </Button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Load ID</TableHead>
                            <TableHead>Mass (kg)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin inline text-amber-500" />
                                </TableCell>
                            </TableRow>
                        ) : records.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-sm text-gray-400 py-6">No records found.</TableCell>
                            </TableRow>
                        ) : records.map((row) => (
                            <TableRow key={row.recordId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="text-sm">{new Date(row.timestamp).toLocaleDateString()}</TableCell>
                                <TableCell className="text-sm font-mono text-xs">{row.loadId.slice(0, 8).toUpperCase()}</TableCell>
                                <TableCell className="text-sm font-medium text-amber-600 dark:text-amber-400">{row.massKg} kg</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => setEditing(row)} className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => handleDelete(row)} className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">Page {page + 1} of {totalPages}</span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Prev</Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
            </div>

            <EditRecordDialog record={editing} onClose={() => setEditing(null)} />
        </Card>
    );
}
