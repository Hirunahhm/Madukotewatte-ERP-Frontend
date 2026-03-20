"use client";

import { useState } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EMPLOYEES = [
    "Arjun Das",
    "Siti Aminah",
    "Rajesh Kumar",
    "Linh Pham",
    "Karthik Raja",
    "Wong Kar Wai",
    "Elena Gilbert",
    "Marcus Tan",
];

const WORK_TYPES = ["Weeding", "Clearing", "Spraying", "Maintenance", "Other"];

const PAYMENT_TYPES = [
    "Bank Transfer - BOC",
    "Bank Transfer - Peoples",
    "Bank Transfer - Seylan",
    "Cash",
];

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RecordLabourDialog({ open, onOpenChange }: Props) {
    const [isPaid, setIsPaid] = useState(false);
    const [employee, setEmployee] = useState("");
    const [workType, setWorkType] = useState("");
    const [paymentType, setPaymentType] = useState("");

    function handleClose() {
        setIsPaid(false);
        setEmployee("");
        setWorkType("");
        setPaymentType("");
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Record Labour</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label>Employee Name</Label>
                        <Select value={employee} onValueChange={(v) => { if (v !== null) setEmployee(v); }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {EMPLOYEES.map((name) => (
                                    <SelectItem key={name} value={name}>{name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Date</Label>
                        <Input type="date" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Amount (LKR)</Label>
                            <Input type="number" placeholder="0.00" min={0} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Worked Hours</Label>
                            <Input type="number" placeholder="0" min={0} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Type of Work</Label>
                        <Select value={workType} onValueChange={(v) => { if (v !== null) setWorkType(v); }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select work type" />
                            </SelectTrigger>
                            <SelectContent>
                                {WORK_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Work Description</Label>
                        <textarea
                            rows={3}
                            placeholder="Describe the work performed..."
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                        />
                    </div>

                    {isPaid && (
                        <div className="space-y-1.5">
                            <Label>Payment Type</Label>
                            <Select value={paymentType} onValueChange={(v) => { if (v !== null) setPaymentType(v); }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAYMENT_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 pt-2">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setIsPaid(false)}
                    >
                        Add Record
                    </Button>
                    <Button
                        className="flex-1 bg-brand-500 hover:bg-brand-600 text-white"
                        onClick={() => setIsPaid(true)}
                    >
                        Paid
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
