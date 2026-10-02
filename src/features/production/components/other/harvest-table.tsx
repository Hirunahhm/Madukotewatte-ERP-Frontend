"use client";

import { useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    useCropHarvests, useCropHarvestOptions, useUpdateCropHarvest, useDeleteCropHarvest,
} from "@/features/production/hooks/use-crop-harvests";
import { HarvestForm } from "./harvest-form";
import type { CropHarvest } from "@/features/production/types/crop-harvest.types";

function EditHarvestDialog({ harvest, onClose }: { harvest: CropHarvest | null; onClose: () => void }) {
    const update = useUpdateCropHarvest();
    const [error, setError] = useState<string | null>(null);

    return (
        <Dialog open={harvest !== null} onOpenChange={(open) => { if (!open) { setError(null); onClose(); } }}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>Edit Harvest</DialogTitle></DialogHeader>
                {harvest && (
                    <HarvestForm
                        key={harvest.id}
                        initial={harvest}
                        submitLabel="Save"
                        isSubmitting={update.isPending}
                        error={error}
                        onCancel={onClose}
                        onSubmit={async (payload) => {
                            setError(null);
                            try {
                                await update.mutateAsync({ id: harvest.id, payload });
                                onClose();
                            } catch (err) {
                                setError(err instanceof Error ? err.message : "Failed to save the harvest.");
                            }
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

export function HarvestTable() {
    const [crop, setCrop] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [page, setPage] = useState(0);
    const [editing, setEditing] = useState<CropHarvest | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const { data: options } = useCropHarvestOptions();
    const { data, isLoading } = useCropHarvests({ crop: crop || undefined, from: from || undefined, to: to || undefined, page, size: 10 });
    const rows = data?.content ?? [];
    const totalPages = data?.totalPages ?? 1;
    const remove = useDeleteCropHarvest();

    async function handleDelete(row: CropHarvest) {
        if (!window.confirm(`Delete this ${row.crop} harvest record?`)) return;
        setDeleteError(null);
        try {
            await remove.mutateAsync(row.id);
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : "Failed to delete the harvest.");
        }
    }

    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <CardTitle className="text-base font-semibold">Harvest Records</CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                    <Select value={crop || "all"} onValueChange={(v) => { if (v !== null) setCrop(v === "all" ? "" : v); setPage(0); }}>
                        <SelectTrigger className="h-8 text-xs w-32"><SelectValue placeholder="Crop" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Crops</SelectItem>
                            {(options?.crops ?? []).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(0); }} className="h-8 text-xs w-36" />
                    <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(0); }} className="h-8 text-xs w-36" />
                </div>
            </div>
            {deleteError && <p role="alert" className="text-sm text-red-500 mb-2">{deleteError}</p>}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Crop</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Block</TableHead>
                            <TableHead>Harvested by</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin inline text-brand-500" /></TableCell></TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8 text-sm text-gray-400">No harvests found.</TableCell></TableRow>
                        ) : rows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="text-sm text-gray-600 dark:text-gray-400">{row.harvestDate}</TableCell>
                                <TableCell className="text-sm font-medium">{row.crop}</TableCell>
                                <TableCell className="text-sm">{Number(row.quantity).toLocaleString()} {row.unit}</TableCell>
                                <TableCell className="text-sm text-gray-600 dark:text-gray-400">{row.fieldBlock ?? "-"}</TableCell>
                                <TableCell className="text-sm text-gray-600 dark:text-gray-400">{row.employeeName ?? "-"}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => setEditing(row)} aria-label="Edit harvest" className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => handleDelete(row)} aria-label="Delete harvest" className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
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
                <span className="text-xs text-gray-500 dark:text-gray-400">Page {page + 1} of {Math.max(totalPages, 1)}</span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Prev</Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
            </div>
            <EditHarvestDialog harvest={editing} onClose={() => setEditing(null)} />
        </Card>
    );
}
