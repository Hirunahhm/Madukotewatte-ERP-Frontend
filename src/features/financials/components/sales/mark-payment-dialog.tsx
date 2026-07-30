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
import { useMarkSaleLatexPaid, useMarkSaleCropPaid, useSettlePayment } from "@/features/financials/hooks/use-financials";
import { SALE_PAYMENT_TYPES, type SalesLedgerRow } from "@/features/financials/types/financials.types";

interface MarkPaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    row: SalesLedgerRow | null;
}

export function MarkPaymentDialog({ open, onOpenChange, row }: MarkPaymentDialogProps) {
    const [paymentType, setPaymentType] = useState("");

    const markLatexPaid = useMarkSaleLatexPaid();
    const markCropPaid = useMarkSaleCropPaid();
    const { settle, isPending: isSettling } = useSettlePayment();

    const isSubmitting = markLatexPaid.isPending || markCropPaid.isPending || isSettling;

    async function handleConfirm() {
        if (!row || !paymentType) return;
        const { monetaryTransactionId } = await settle(paymentType, row.amount, "in");
        if (row.category === "latex") {
            await markLatexPaid.mutateAsync({ id: row.saleId, payload: { monetaryTransactionId } });
        } else {
            await markCropPaid.mutateAsync({ category: row.category, id: row.saleId, payload: { paymentType } });
        }
        setPaymentType("");
        onOpenChange(false);
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
                            Load <span className="font-mono">{row.loadId.slice(0, 8).toUpperCase()}</span> — LKR {row.amount.toLocaleString()}
                        </p>
                    )}
                    <div className="space-y-1.5">
                        <Label>Payment Type</Label>
                        <Select value={paymentType} onValueChange={(v) => { if (v) setPaymentType(v); }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                            <SelectContent>
                                {SALE_PAYMENT_TYPES.map((pt) => (
                                    <SelectItem key={pt} value={pt}>{pt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
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
