"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateFixedAsset } from "@/features/assets/hooks/use-assets";
import { FIXED_ASSET_CATEGORIES } from "@/features/assets/types/assets.types";

export function AddFixedAssetForm() {
    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [acquisitionDate, setAcquisitionDate] = useState("");
    const [acquisitionValue, setAcquisitionValue] = useState("");
    const [currentValue, setCurrentValue] = useState("");
    const [location, setLocation] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState<string | null>(null);
    const createAsset = useCreateFixedAsset();

    async function handleSubmit() {
        setError(null);
        if (!category || !name || !acquisitionDate || !acquisitionValue) return;
        try {
            await createAsset.mutateAsync({
                category,
                name,
                acquisitionDate,
                acquisitionValue: parseFloat(acquisitionValue),
                currentValue: currentValue ? parseFloat(currentValue) : undefined,
                location: location || undefined,
                notes: notes || undefined,
            });
            setCategory("");
            setName("");
            setAcquisitionDate("");
            setAcquisitionValue("");
            setCurrentValue("");
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
                    <Select value={category} onValueChange={(v) => { if (v) setCategory(v); }}>
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
                    <Label>Acquisition Value (LKR)</Label>
                    <Input type="number" placeholder="0.00" value={acquisitionValue} onChange={(e) => setAcquisitionValue(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Current Value (LKR)</Label>
                    <Input type="number" placeholder="Defaults to acquisition value" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} />
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
            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
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
