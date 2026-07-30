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
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMarkExpensePaid, useSettlePayment } from "@/features/financials/hooks/use-financials";
import { PAYMENT_TYPES, type Expense } from "@/features/financials/types/financials.types";

interface MarkExpensePaymentDialogProps {
    expense: Expense | null;
    onClose: () => void;
}

export function MarkExpensePaymentDialog({ expense, onClose }: MarkExpensePaymentDialogProps) {
    const [paymentType, setPaymentType] = useState("");

    const markPaid = useMarkExpensePaid();
    const { settle, isPending: isSettling } = useSettlePayment();
    const isSubmitting = markPaid.isPending || isSettling;

    function handleClose() {
        setPaymentType("");
        onClose();
    }

    async function handleConfirm() {
        if (!expense || !paymentType) return;
        const { monetaryTransactionId, estateLoanTransactionId } = await settle(paymentType, expense.amount, "out");
        await markPaid.mutateAsync({ id: expense.expenseId, payload: { paymentType, monetaryTransactionId, estateLoanTransactionId } });
        handleClose();
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
                            {expense.type} — LKR {expense.amount.toLocaleString()}
                        </p>
                    )}
                    <div className="space-y-1.5">
                        <Label>Payment Type</Label>
                        <Select value={paymentType} onValueChange={(v) => { if (v) setPaymentType(v); }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                            <SelectContent>
                                {PAYMENT_TYPES.map((pt) => (
                                    <SelectItem key={pt} value={pt}>{pt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
                    <Button
                        className="bg-brand-500 hover:bg-brand-600 text-white"
                        onClick={handleConfirm}
                        disabled={isSubmitting || !paymentType}
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark as Paid"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
