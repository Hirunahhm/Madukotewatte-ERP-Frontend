"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCropHarvestOptions } from "@/features/production/hooks/use-crop-harvests";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import type { CropHarvest, CropHarvestRequest } from "@/features/production/types/crop-harvest.types";
import { toLocalDateInputValue } from "@/lib/utils";

const NO_EMPLOYEE = "none";

interface HarvestFormProps {
    initial?: CropHarvest | null;
    submitLabel: string;
    isSubmitting: boolean;
    error: string | null;
    onSubmit: (payload: CropHarvestRequest) => void;
    onCancel?: () => void;
}

/** Shared by the "record harvest" card and the edit dialog. Crops/units come from the backend. */
export function HarvestForm({ initial, submitLabel, isSubmitting, error, onSubmit, onCancel }: HarvestFormProps) {
    const { data: options } = useCropHarvestOptions();
    const { data: employeesPage } = useEmployees({ size: 100 });
    const employees = employeesPage?.content ?? [];

    const [crop, setCrop] = useState(initial?.crop ?? "Cocoa");
    const [date, setDate] = useState(initial?.harvestDate ?? toLocalDateInputValue());
    const [quantity, setQuantity] = useState(initial ? String(initial.quantity) : "");
    const [unit, setUnit] = useState<string>(initial?.unit ?? "kg");
    const [fieldBlock, setFieldBlock] = useState(initial?.fieldBlock ?? "");
    const [employeeId, setEmployeeId] = useState(initial?.employeeId ?? NO_EMPLOYEE);
    const [notes, setNotes] = useState(initial?.notes ?? "");

    function handleSubmit() {
        if (!crop || !date || !quantity || !unit) return;
        onSubmit({
            crop,
            harvestDate: date,
            quantity: parseFloat(quantity),
            unit,
            fieldBlock: fieldBlock.trim() || undefined,
            employeeId: employeeId === NO_EMPLOYEE ? undefined : employeeId,
            notes: notes.trim() || undefined,
        });
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label>Crop</Label>
                    <Select value={crop} onValueChange={(v) => { if (v) setCrop(v); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {(options?.crops ?? [crop]).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label>Harvest date</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label>Quantity</Label>
                    <Input type="number" min={0} placeholder="0.00" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Unit</Label>
                    <Select value={unit} onValueChange={(v) => { if (v) setUnit(v); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {(options?.units ?? [unit]).map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label>Field / block</Label>
                    <Input placeholder="e.g. Block A" value={fieldBlock} onChange={(e) => setFieldBlock(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Harvested by (optional)</Label>
                    <Select value={employeeId} onValueChange={(v) => { if (v) setEmployeeId(v); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value={NO_EMPLOYEE}>Not recorded</SelectItem>
                            {employees.map((e) => <SelectItem key={e.employeeId} value={e.employeeId}>{e.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-1.5">
                <Label>Notes</Label>
                <Input placeholder="Optional" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-3">
                {onCancel && <Button variant="outline" className="flex-1" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>}
                <Button
                    className="flex-1 bg-brand-500 hover:bg-brand-600 text-white"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !quantity || !date}
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : submitLabel}
                </Button>
            </div>
        </div>
    );
}
