"use client";

import { useEffect, useState } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { AccountSelect } from "@/features/accounts/components/account-select";
import { useCreateManualEntry } from "@/features/accounts/hooks/use-accounts";
import { CATEGORY_LABEL } from "@/features/accounts/utils/format";
import {
    MANUAL_ENTRY_CATEGORIES,
    type LedgerDirection, type ManualEntryCategory,
} from "@/features/accounts/types/accounts.types";
import { toLocalDateInputValue } from "@/lib/utils";

interface ManualEntryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultAccount?: string;
}

/** Fixed direction per category; null means the user picks (adjustments). */
const CATEGORY_DIRECTION: Record<ManualEntryCategory, LedgerDirection | null> = {
    OWNER_CAPITAL: "IN",
    OWNER_DRAWING: "OUT",
    OTHER_INCOME: "IN",
    INTEREST_INCOME: "IN",
    BANK_CHARGES: "OUT",
    ADJUSTMENT: null,
};

const CATEGORY_ITEMS = MANUAL_ENTRY_CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABEL[c] }));
const DIRECTION_ITEMS = [{ value: "IN", label: "Money in" }, { value: "OUT", label: "Money out" }];

/** Capital in, drawings, other income, interest income, bank charges and adjustments. */
export function ManualEntryDialog({ open, onOpenChange, defaultAccount }: ManualEntryDialogProps) {
    const [account, setAccount] = useState("");
    const [category, setCategory] = useState<ManualEntryCategory>("OWNER_CAPITAL");
    const [direction, setDirection] = useState<LedgerDirection>("IN");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(toLocalDateInputValue());
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);

    const create = useCreateManualEntry();
    const fixedDirection = CATEGORY_DIRECTION[category];
    const effectiveDirection = fixedDirection ?? direction;

    useEffect(() => {
        if (!open) return;
        setAccount(defaultAccount ?? "");
        setCategory("OWNER_CAPITAL");
        setDirection("IN");
        setAmount("");
        setDate(toLocalDateInputValue());
        setDescription("");
        setError(null);
    }, [open, defaultAccount]);

    async function handleSubmit() {
        setError(null);
        const value = Number(amount);
        if (!account || !value || value <= 0) {
            setError("Choose an account and enter an amount.");
            return;
        }
        try {
            await create.mutateAsync({
                code: account,
                payload: { direction: effectiveDirection, category, amount: value, date, description: description.trim() || undefined },
            });
            onOpenChange(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to record the entry.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Record account entry</DialogTitle>
                    <DialogDescription>
                        For money that does not come from a sale, expense or payroll: owner capital, drawings, interest, bank charges or a correction.
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
                        <Label>Account</Label>
                        <AccountSelect value={account} onValueChange={setAccount} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Type</Label>
                            <Select value={category} onValueChange={(v) => { if (v) setCategory(v as ManualEntryCategory); }} items={CATEGORY_ITEMS}>
                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {CATEGORY_ITEMS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Direction</Label>
                            <Select
                                value={effectiveDirection}
                                onValueChange={(v) => { if (v) setDirection(v as LedgerDirection); }}
                                items={DIRECTION_ITEMS}
                                disabled={fixedDirection !== null}
                            >
                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {DIRECTION_ITEMS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
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
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={create.isPending}>Cancel</Button>
                    <Button className="bg-brand-500 hover:bg-brand-600 text-white" onClick={handleSubmit} disabled={create.isPending}>
                        {create.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Record entry
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
