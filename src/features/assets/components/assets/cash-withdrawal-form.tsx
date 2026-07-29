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
import { useRecordWithdrawal } from "@/features/assets/hooks/use-assets";
import { ASSET_TYPES } from "@/features/assets/types/assets.types";

export function CashWithdrawalForm() {
    const [amount, setAmount] = useState("");
    const [assetType, setAssetType] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { withdraw, isPending } = useRecordWithdrawal();

    async function handleSubmit() {
        setError(null);
        if (!assetType || !amount) return;
        try {
            await withdraw(assetType, parseFloat(amount));
            setAmount("");
            setAssetType("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to record withdrawal.");
        }
    }

    return (
        <Card className="shadow-sm p-6 gap-0">
            <CardTitle className="text-base font-semibold mb-5">Record Withdrawal</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                    <Label>Amount (LKR)</Label>
                    <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Asset Type</Label>
                    <Select value={assetType} onValueChange={(v) => { if (v) setAssetType(v); }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                            {ASSET_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    className="bg-brand-500 hover:bg-brand-600 text-white"
                    onClick={handleSubmit}
                    disabled={isPending || !assetType || !amount}
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Record Withdrawal"}
                </Button>
            </div>
            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
        </Card>
    );
}
