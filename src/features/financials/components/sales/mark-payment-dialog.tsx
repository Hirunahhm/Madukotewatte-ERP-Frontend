"use client";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface MarkPaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MarkPaymentDialog({ open, onOpenChange }: MarkPaymentDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Mark Payment Received</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="payment-date">Date</Label>
                        <Input id="payment-date" type="date" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="payment-amount">Amount (LKR)</Label>
                        <Input id="payment-amount" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Payment Type</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="bank-boc">Bank Transfer - BOC</SelectItem>
                                <SelectItem value="bank-peoples">Bank Transfer - Peoples</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button className="bg-brand-500 hover:bg-brand-600 text-white">Mark as Paid</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
