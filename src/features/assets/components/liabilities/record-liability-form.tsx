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
import { useRecordLiability } from "@/features/assets/hooks/use-assets";
import { LOAN_TYPES, ASSET_TYPES } from "@/features/assets/types/assets.types";

export function RecordLiabilityForm() {
    const [loanType, setLoanType] = useState("");
    const [amount, setAmount] = useState("");
    const [depositTo, setDepositTo] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { recordLiability, isPending } = useRecordLiability();

    async function handleSubmit() {
        setError(null);
        if (!loanType || !amount || !depositTo) return;
        try {
            await recordLiability(loanType, depositTo, parseFloat(amount));
            setLoanType("");
            setAmount("");
            setDepositTo("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to record liability.");
        }
    }

    return (
        <Card className="shadow-sm p-6 gap-0 flex flex-col h-full">
            <CardTitle className="text-base font-semibold mb-5">Record Liability</CardTitle>
            <div className="flex-1 space-y-4">
                <div className="space-y-1.5">
                    <Label>Type</Label>
                    <Select value={loanType} onValueChange={(v) => { if (v) setLoanType(v); }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {LOAN_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label>Amount (LKR)</Label>
                    <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Deposit To</Label>
                    <Select value={depositTo} onValueChange={(v) => { if (v) setDepositTo(v); }}>
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
            </div>
            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
            <Button
                className="w-full mt-6 bg-brand-500 hover:bg-brand-600 text-white"
                onClick={handleSubmit}
                disabled={isPending || !loanType || !amount || !depositTo}
            >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Record Liability"}
            </Button>
        </Card>
    );
}
