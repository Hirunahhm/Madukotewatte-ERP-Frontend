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
import { useMarkExpensePaid } from "@/features/financials/hooks/use-financials";
import type { Expense } from "@/features/financials/types/financials.types";
import { toLocalDateInputValue } from "@/lib/utils";

interface MarkExpensePaymentDialogProps {
    expense: Expense | null;
    onClose: () => void;
}

export function MarkExpensePaymentDialog({ expense, onClose }: MarkExpensePaymentDialogProps) {
    const [accountCode, setAccountCode] = useState("");
    const [paymentDate, setPaymentDate] = useState(toLocalDateInputValue());
    const [error, setError] = useState<string | null>(null);

    const markPaid = useMarkExpensePaid();
    const isSubmitting = markPaid.isPending;

    function handleClose() {
        setAccountCode("");
        setError(null);
        onClose();
    }

    async function handleConfirm() {
        if (!expense || !accountCode) return;
        setError(null);
        try {
            await markPaid.mutateAsync({ id: expense.expenseId, payload: { accountCode, paymentDate } });
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to record the payment.");
        }
    }

    return (
        <Dialog open={expense !== null} onOpenChange={(open) => { if (!open) handleClose(); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Mark Expense as Paid</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    {expense && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {expense.type} - LKR {expense.amount.toLocaleString()}
                        </p>
                    )}
                    {error && (
                        <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <Label>Pay from</Label>
                        <AccountSelect value={accountCode} onValueChange={setAccountCode} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Payment date</Label>
                        <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
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
