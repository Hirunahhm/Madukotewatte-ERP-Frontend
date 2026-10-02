"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { AccountSelect } from "@/features/accounts/components/account-select";
import { useMarkSalePaid } from "@/features/financials/hooks/use-financials";
import { saleCategoryLabel } from "@/features/financials/utils/sale-labels";
import type { SalesLedgerRow } from "@/features/financials/types/financials.types";
import { toLocalDateInputValue } from "@/lib/utils";

interface MarkPaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    row: SalesLedgerRow | null;
}

export function MarkPaymentDialog({ open, onOpenChange, row }: MarkPaymentDialogProps) {
    const [accountCode, setAccountCode] = useState("");
    const [paymentDate, setPaymentDate] = useState(toLocalDateInputValue());
    const [error, setError] = useState<string | null>(null);

    const markPaid = useMarkSalePaid();
    const isSubmitting = markPaid.isPending;

    async function handleConfirm() {
        if (!row || !accountCode) return;
        setError(null);
        try {
            await markPaid.mutateAsync({ type: row.saleType, id: row.saleId, payload: { accountCode, paymentDate } });
            setAccountCode("");
            onOpenChange(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to record the payment.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Mark Payment Received</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    {row && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {saleCategoryLabel(row.category)} sale of {row.saleDate}
                            {row.buyerName ? ` to ${row.buyerName}` : ""} - LKR {row.amount.toLocaleString()}
                        </p>
                    )}
                    {error && (
                        <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <Label>Received into</Label>
                        <AccountSelect value={accountCode} onValueChange={setAccountCode} allowedTypes={["CASH", "BANK"]} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Payment date</Label>
                        <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
                    <Button
                        className="bg-brand-500 hover:bg-brand-600 text-white"
                        onClick={handleConfirm}
                        disabled={isSubmitting || !accountCode}
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark as Paid"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
