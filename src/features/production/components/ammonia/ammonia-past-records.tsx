"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Pencil, Trash2, X } from "lucide-react";
import {
    useAmmoniaRecords,
    useUpdateAmmoniaRecord,
    useDeleteAmmoniaRecord,
} from "@/features/production/hooks/use-production";
import type { AmmoniaRecord } from "@/features/production/types/production.types";

function EditRecordDialog({ record, onClose }: { record: AmmoniaRecord | null; onClose: () => void }) {
    const [type, setType] = useState("refill");
    const [previousAmount, setPreviousAmount] = useState("");
    const [newAmount, setNewAmount] = useState("");
    const [date, setDate] = useState("");
    const updateMutation = useUpdateAmmoniaRecord();

    useEffect(() => {
        if (record) {
            setType(record.type);
            setPreviousAmount(String(record.previousAmount));
            setNewAmount(String(record.newAmount));
            setDate(record.timestamp.split("T")[0]);
        }
    }, [record]);

    async function handleSave() {
        if (!record || !previousAmount || !newAmount || !date) return;
        await updateMutation.mutateAsync({
            id: record.recordId,
            payload: {
                type,
                previousAmount: parseFloat(previousAmount),
                newAmount: parseFloat(newAmount),
                timestamp: `${date}T06:00:00`,
            },
        });
        onClose();
    }

    return (
        <Dialog open={record !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Ammonia Record</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                    <div className="space-y-1.5">
                        <Label>Type</Label>
                        <Select value={type} onValueChange={(v) => { if (v) setType(v); }}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="refill">Refill</SelectItem>
                                <SelectItem value="usage">Usage</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Prev. Amount (L)</Label>
                        <Input type="number" value={previousAmount} onChange={(e) => setPreviousAmount(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>New Amount (L)</Label>
                        <Input type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Date</Label>
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1" onClick={onClose}>
                            <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
                        </Button>
                        <Button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white" onClick={handleSave} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function AmmoniaPastRecords() {
    const [filterType, setFilterType] = useState("all");
    const [page, setPage] = useState(0);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [editing, setEditing] = useState<AmmoniaRecord | null>(null);

    const { data, isLoading } = useAmmoniaRecords({
        page,
        size: 10,
        type: filterType !== "all" ? filterType : undefined,
        from: from ? `${from}T00:00:00` : undefined,
        to: to ? `${to}T23:59:59` : undefined,
    });
    const records = data?.content ?? [];
    const totalPages = data?.totalPages ?? 1;

    const deleteMutation = useDeleteAmmoniaRecord();

    async function handleDelete(record: AmmoniaRecord) {
        if (!window.confirm("Delete this ammonia record? This cannot be undone.")) return;
        await deleteMutation.mutateAsync(record.recordId);
    }

    const filtersActive = filterType !== "all" || from || to;

    return (
        <Card className="shadow-sm gap-0 p-6">
            <CardTitle className="text-base font-semibold mb-4">Past Ammonia Records</CardTitle>

            <div className="flex flex-wrap items-end gap-3 mb-4">
                <div className="space-y-1 min-w-[140px]">
                    <Label className="text-xs text-gray-500">Type</Label>
                    <Select value={filterType} onValueChange={(v) => { if (v !== null) { setFilterType(v); setPage(0); } }}>
                        <SelectTrigger className="h-8 text-xs bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="refill">Refill</SelectItem>
                            <SelectItem value="usage">Usage</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-gray-500">From</Label>
                    <Input type="date" className="h-8 text-xs w-36" value={from} onChange={(e) => { setFrom(e.target.value); setPage(0); }} />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-gray-500">To</Label>
                    <Input type="date" className="h-8 text-xs w-36" value={to} onChange={(e) => { setTo(e.target.value); setPage(0); }} />
                </div>
                {filtersActive && (
                    <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs text-gray-500" onClick={() => { setFilterType("all"); setFrom(""); setTo(""); setPage(0); }}>
                        <X className="w-3 h-3" /> Clear
                    </Button>
                )}
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Prev (L)</TableHead>
                            <TableHead>New (L)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin inline text-cyan-500" />
                                </TableCell>
                            </TableRow>
                        ) : records.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-sm text-gray-400 py-6">No records found.</TableCell>
                            </TableRow>
                        ) : records.map((row) => (
                            <TableRow key={row.recordId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="text-sm">{new Date(row.timestamp).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge className={
                                        row.type === "refill"
                                            ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400 border-transparent text-[10px] font-bold uppercase"
                                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-transparent text-[10px] font-bold uppercase"
                                    }>
                                        {row.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm font-medium">{row.previousAmount}</TableCell>
                                <TableCell className="text-sm font-medium">{row.newAmount}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => setEditing(row)} className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20">
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
