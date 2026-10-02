"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateFixedAsset } from "@/features/assets/hooks/use-assets";
import { FIXED_ASSET_CATEGORIES, type DepreciationMethod } from "@/features/assets/types/assets.types";
import { defaultUsefulLife } from "@/features/assets/utils/depreciation";
import { AccountSelect } from "@/features/accounts/components/account-select";

const METHOD_LABEL: Record<DepreciationMethod, string> = {
    STRAIGHT_LINE: "Straight line",
    NONE: "None (not depreciated)",
};

export function AddFixedAssetForm() {
    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [acquisitionDate, setAcquisitionDate] = useState("");
    const [acquisitionValue, setAcquisitionValue] = useState("");
    const [usefulLife, setUsefulLife] = useState("");
    const [residualValue, setResidualValue] = useState("");
    const [method, setMethod] = useState<DepreciationMethod>("STRAIGHT_LINE");
    const [paidFrom, setPaidFrom] = useState("");
    const [location, setLocation] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState<string | null>(null);
    const createAsset = useCreateFixedAsset();

    function handleCategoryChange(next: string) {
        setCategory(next);
        const life = defaultUsefulLife(next);
        setMethod(life === null ? "NONE" : "STRAIGHT_LINE");
        setUsefulLife(life === null ? "" : String(life));
    }

    async function handleSubmit() {
        setError(null);
        if (!category || !name || !acquisitionDate || !acquisitionValue) return;
        try {
            await createAsset.mutateAsync({
                category,
                name,
                acquisitionDate,
                acquisitionValue: parseFloat(acquisitionValue),
                depreciationMethod: method,
                usefulLifeYears: method === "NONE" || !usefulLife ? undefined : parseInt(usefulLife, 10),
                residualValue: residualValue ? parseFloat(residualValue) : undefined,
                paidFromAccountCode: paidFrom || undefined,
                location: location || undefined,
                notes: notes || undefined,
            });
            setCategory("");
            setName("");
            setAcquisitionDate("");
            setAcquisitionValue("");
            setUsefulLife("");
            setResidualValue("");
            setMethod("STRAIGHT_LINE");
            setPaidFrom("");
            setLocation("");
            setNotes("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add asset.");
        }
    }

    return (
        <Card className="shadow-sm p-6 gap-0">
            <CardTitle className="text-base font-semibold mb-5">Add Fixed Asset</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={(v) => { if (v) handleCategoryChange(v); }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {FIXED_ASSET_CATEGORIES.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label>Name</Label>
                    <Input placeholder="e.g. Toyota Hilux" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Acquisition Date</Label>
                    <Input type="date" value={acquisitionDate} onChange={(e) => setAcquisitionDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Cost (LKR)</Label>
                    <Input type="number" placeholder="0.00" value={acquisitionValue} onChange={(e) => setAcquisitionValue(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Depreciation Method</Label>
                    <Select value={method} items={Object.entries(METHOD_LABEL).map(([value, label]) => ({ value, label }))}
                        onValueChange={(v) => { if (v) setMethod(v as DepreciationMethod); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="STRAIGHT_LINE">{METHOD_LABEL.STRAIGHT_LINE}</SelectItem>
                            <SelectItem value="NONE">{METHOD_LABEL.NONE}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label>Useful Life (years)</Label>
                    <Input type="number" min={1} placeholder="Default by category" disabled={method === "NONE"}
                        value={method === "NONE" ? "" : usefulLife} onChange={(e) => setUsefulLife(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Residual Value (LKR)</Label>
                    <Input type="number" min={0} placeholder="0" disabled={method === "NONE"}
                        value={residualValue} onChange={(e) => setResidualValue(e.target.value)} />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                    <Label>Paid From</Label>
                    <div className="flex gap-2">
                        <AccountSelect value={paidFrom} onValueChange={setPaidFrom}
                            placeholder="Pre-existing asset (no payment recorded)" />
                        {paidFrom && (
                            <Button type="button" variant="outline" onClick={() => setPaidFrom("")}>Clear</Button>
                        )}
                    </div>
                    <p className="text-xs text-gray-400">
                        {paidFrom
                            ? "The cost is deducted from this account on the acquisition date."
                            : "Leave empty for an asset the estate already owned; it counts as opening equity."}
                    </p>
                </div>
                <div className="space-y-1.5">
                    <Label>Location</Label>
                    <Input placeholder="Optional" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="space-y-1.5 md:col-span-3">
                    <Label>Notes</Label>
                    <Input placeholder="Optional" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
            </div>
            {error && (
                <div role="alert" className="mt-3 flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
            )}
            <Button
                className="mt-5 bg-brand-500 hover:bg-brand-600 text-white"
                onClick={handleSubmit}
                disabled={createAsset.isPending || !category || !name || !acquisitionDate || !acquisitionValue}
            >
                {createAsset.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Asset"}
            </Button>
        </Card>
    );
}
