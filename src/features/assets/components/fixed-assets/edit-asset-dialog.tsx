"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { useUpdateFixedAsset } from "@/features/assets/hooks/use-assets";
import type { DepreciationMethod, FixedAsset } from "@/features/assets/types/assets.types";

interface EditAssetDialogProps {
    asset: FixedAsset | null;
    onClose: () => void;
}

export function EditAssetDialog({ asset, onClose }: EditAssetDialogProps) {
    return (
        <Dialog open={!!asset} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-md">
                {asset && <EditForm key={asset.assetId} asset={asset} onClose={onClose} />}
            </DialogContent>
        </Dialog>
    );
}

function EditForm({ asset, onClose }: { asset: FixedAsset; onClose: () => void }) {
    const [name, setName] = useState(asset.name);
    const [method, setMethod] = useState<DepreciationMethod>(asset.depreciationMethod);
    const [life, setLife] = useState(asset.usefulLifeYears ? String(asset.usefulLifeYears) : "");
    const [residual, setResidual] = useState(String(asset.residualValue ?? 0));
    const [location, setLocation] = useState(asset.location ?? "");
    const [notes, setNotes] = useState(asset.notes ?? "");
    const [error, setError] = useState<string | null>(null);
    const update = useUpdateFixedAsset();

    async function handleSubmit() {
        setError(null);
        try {
            await update.mutateAsync({
                id: asset.assetId,
                payload: {
                    name: name.trim() || undefined,
                    depreciationMethod: method,
                    usefulLifeYears: method === "NONE" || !life ? undefined : parseInt(life, 10),
                    residualValue: residual ? Number(residual) : 0,
                    location,
                    notes,
                },
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update asset.");
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Edit {asset.name}</DialogTitle>
                <DialogDescription>Depreciation changes recalculate the schedule for every period.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-2">
                {error && (
                    <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0" />{error}
                    </div>
                )}
                <div className="space-y-1.5">
                    <Label>Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                        <Label>Method</Label>
                        <Select value={method} onValueChange={(v) => { if (v) setMethod(v as DepreciationMethod); }}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="STRAIGHT_LINE">Straight line</SelectItem>
                                <SelectItem value="NONE">None</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Life (years)</Label>
                        <Input type="number" min={1} disabled={method === "NONE"} value={method === "NONE" ? "" : life} onChange={(e) => setLife(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Residual (LKR)</Label>
                        <Input type="number" min={0} disabled={method === "NONE"} value={residual} onChange={(e) => setResidual(e.target.value)} />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label>Location</Label>
                    <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Notes</Label>
                    <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
                <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button className="flex-1 bg-brand-500 hover:bg-brand-600 text-white" disabled={update.isPending} onClick={handleSubmit}>
                        {update.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save
                    </Button>
                </div>
            </div>
        </>
    );
}
