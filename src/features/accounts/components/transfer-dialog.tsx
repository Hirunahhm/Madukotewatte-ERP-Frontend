"use client";

import { useEffect, useState } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { AccountSelect } from "@/features/accounts/components/account-select";
import { useAccounts, useTransfer } from "@/features/accounts/hooks/use-accounts";
import { toLocalDateInputValue } from "@/lib/utils";

interface TransferDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Pre-select the destination, e.g. a credit card to pay. */
    defaultTo?: string;
}

/** Bank/cash to bank/cash transfers and bank/cash to credit-card payments. */
export function TransferDialog({ open, onOpenChange, defaultTo }: TransferDialogProps) {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(toLocalDateInputValue());
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { data: accounts } = useAccounts();
    const transfer = useTransfer();
    const target = accounts?.find((a) => a.code === to);

    useEffect(() => {
        if (!open) return;
        setFrom("");
        setTo(defaultTo ?? "");
        setAmount("");
        setDate(toLocalDateInputValue());
        setDescription("");
        setError(null);
    }, [open, defaultTo]);

    async function handleSubmit() {
        setError(null);
        const value = Number(amount);
        if (!from || !to || !value || value <= 0) {
            setError("Choose both accounts and enter an amount.");
            return;
        }
        try {
            await transfer.mutateAsync({
                fromAccountCode: from, toAccountCode: to, amount: value, date,
                description: description.trim() || undefined,
            });
            onOpenChange(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Transfer failed.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{target?.type === "CREDIT_CARD" ? "Pay credit card" : "Transfer money"}</DialogTitle>
                    <DialogDescription>
                        Moves money between your accounts. Paying a card from a bank reduces the amount owed on the card.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-1">
                    {error && (
                        <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <Label>From</Label>
                        <AccountSelect value={from} onValueChange={setFrom} allowedTypes={["CASH", "BANK"]} excludeCodes={to ? [to] : undefined} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>To</Label>
                        <AccountSelect value={to} onValueChange={setTo} excludeCodes={from ? [from] : undefined} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Amount (LKR)</Label>
                            <Input type="number" min={0} placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Date</Label>
                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Note (optional)</Label>
                        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={transfer.isPending}>Cancel</Button>
                    <Button className="bg-brand-500 hover:bg-brand-600 text-white" onClick={handleSubmit} disabled={transfer.isPending}>
                        {transfer.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {target?.type === "CREDIT_CARD" ? "Pay card" : "Transfer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
