"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Pencil, Trash2, X } from "lucide-react";
import {
    useManiocRecords,
    useUpdateManiocRecord,
    useDeleteManiocRecord,
} from "@/features/production/hooks/use-manioc-production";
import { MANIOC_VARIETIES } from "@/features/production/types/manioc-production.types";
import type { ManiocRecord } from "@/features/production/types/manioc-production.types";

function EditRecordDialog({ record, onClose }: { record: ManiocRecord | null; onClose: () => void }) {
    const [variety, setVariety] = useState("");
    const [massKg, setMassKg] = useState("");
    const [date, setDate] = useState("");
    const updateMutation = useUpdateManiocRecord();

    useEffect(() => {
        if (record) {
            setVariety(record.variety);
            setMassKg(record.massKg != null ? String(record.massKg) : "");
            setDate(record.timestamp.split("T")[0]);
        }
    }, [record]);

    async function handleSave() {
        if (!record || !variety || !massKg || !date) return;
        await updateMutation.mutateAsync({
            id: record.recordId,
            payload: {
                loadId: record.loadId,
                employeeId: record.employeeId,
                variety,
                massKg: parseFloat(massKg),
                timestamp: `${date}T00:00:00`,
            },
        });
        onClose();
    }

    return (
        <Dialog open={record !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Manioc Record</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                    <div className="space-y-1.5">
                        <Label>Variety</Label>
                        <Select value={variety} onValueChange={(v) => { if (v) setVariety(v); }}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MANIOC_VARIETIES.map((v) => (
                                    <SelectItem key={v} value={v}>{v}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Mass (kg)</Label>
                        <Input type="number" value={massKg} onChange={(e) => setMassKg(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Date</Label>
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1" onClick={onClose}>
                            <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
                        </Button>
                        <Button className="flex-1 bg-teal-500 hover:bg-teal-600 text-white" onClick={handleSave} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function ManiocPastRecords() {
    const [page, setPage] = useState(0);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [editing, setEditing] = useState<ManiocRecord | null>(null);

    const { data, isLoading } = useManiocRecords({
        page,
        size: 10,
        from: from ? `${from}T00:00:00` : undefined,
        to: to ? `${to}T23:59:59` : undefined,
    });
    const records = data?.content ?? [];
    const totalPages = data?.totalPages ?? 1;

    const deleteMutation = useDeleteManiocRecord();

    async function handleDelete(record: ManiocRecord) {
        if (!window.confirm("Delete this manioc record? This cannot be undone.")) return;
        await deleteMutation.mutateAsync(record.recordId);
    }

    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                <CardTitle className="text-base font-semibold">Past Manioc Records</CardTitle>
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
                            <TableHead>Employee</TableHead>
                            <TableHead>Load ID</TableHead>
                            <TableHead>Variety</TableHead>
                            <TableHead>Mass (kg)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin inline text-teal-500" />
                                </TableCell>
                            </TableRow>
                        ) : records.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-sm text-gray-400 py-6">No records found.</TableCell>
                            </TableRow>
                        ) : records.map((row) => (
                            <TableRow key={row.recordId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="text-sm">{new Date(row.timestamp).toLocaleDateString()}</TableCell>
                                <TableCell className="text-sm">{row.employeeName}</TableCell>
                                <TableCell className="text-sm font-mono text-xs">{row.loadId.slice(0, 8).toUpperCase()}</TableCell>
                                <TableCell className="text-sm">{row.variety}{row.variety === "Other" && row.varietyNote ? ` (${row.varietyNote})` : ""}</TableCell>
                                <TableCell className="text-sm font-medium text-teal-600 dark:text-teal-400">{row.massKg != null ? `${row.massKg} kg` : "—"}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => setEditing(row)} className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20">
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
