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
import { useRecordRepayment } from "@/features/assets/hooks/use-assets";
import { CREDIT_CARD_TYPES, ASSET_TYPES } from "@/features/assets/types/assets.types";

export function RecurringPaymentForm() {
    const [loanType, setLoanType] = useState("");
    const [amount, setAmount] = useState("");
    const [payFrom, setPayFrom] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { recordRepayment, isPending } = useRecordRepayment();

    async function handleSubmit() {
        setError(null);
        if (!loanType || !amount || !payFrom) return;
        try {
            await recordRepayment(loanType, payFrom, parseFloat(amount));
            setLoanType("");
            setAmount("");
            setPayFrom("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to record payment.");
        }
    }

    return (
        <Card className="shadow-sm p-6 gap-0">
            <CardTitle className="text-base font-semibold mb-5">Log Recurring Payment</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                    <Label>Card</Label>
                    <Select value={loanType} onValueChange={(v) => { if (v) setLoanType(v); }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select card" />
                        </SelectTrigger>
                        <SelectContent>
                            {CREDIT_CARD_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>{type.replace("credit-card - ", "")}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label>Amount (LKR)</Label>
                    <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Pay From</Label>
                    <Select value={payFrom} onValueChange={(v) => { if (v) setPayFrom(v); }}>
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
                    disabled={isPending || !loanType || !amount || !payFrom}
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Record Payment"}
                </Button>
            </div>
            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
        </Card>
    );
}
