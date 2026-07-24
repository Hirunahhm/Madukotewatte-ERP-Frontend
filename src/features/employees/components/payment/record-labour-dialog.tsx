"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { getEmployeesSummary } from "@/features/employees/services/employee-service";
import { useCreateLabour } from "@/features/employees/hooks/use-labour-mutations";
import type { PaymentType } from "@/features/employees/types/labour.types";

const WORK_TYPES = ["Weeding", "Clearing", "Spraying", "Maintenance", "Other"];

const PAYMENT_TYPES: { value: PaymentType; label: string }[] = [
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "cash", label: "Cash" },
];

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RecordLabourDialog({ open, onOpenChange }: Props) {
    const [employeeId, setEmployeeId] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [workedHours, setWorkedHours] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [workType, setWorkType] = useState("");
    const [description, setDescription] = useState("");
    const [isPaid, setIsPaid] = useState(false);
    const [paymentType, setPaymentType] = useState<PaymentType | "">("");
    const [error, setError] = useState<string | null>(null);

    const { data: employees } = useQuery({ queryKey: ["employees", "summary"], queryFn: getEmployeesSummary });
    const createLabour = useCreateLabour();

    const amount = useMemo(() => {
        const hours = Number(workedHours);
        const rate = Number(hourlyRate);
        return hours > 0 && rate > 0 ? hours * rate : 0;
    }, [workedHours, hourlyRate]);

    function handleClose() {
        setEmployeeId("");
        setDate(new Date().toISOString().split("T")[0]);
        setWorkedHours("");
        setHourlyRate("");
        setWorkType("");
        setDescription("");
        setIsPaid(false);
        setPaymentType("");
        setError(null);
        onOpenChange(false);
    }

    async function handleSubmit(paid: boolean) {
        setError(null);
        if (!employeeId || !workedHours || !hourlyRate || !workType) {
            setError("Employee, worked hours, hourly rate, and work type are required.");
            return;
        }
        if (paid && !paymentType) {
            setError("Payment type is required to mark this as paid.");
            return;
        }
        try {
            await createLabour.mutateAsync({
                employeeId,
                workedHours: Number(workedHours),
                hourlyRate: Number(hourlyRate),
                amount,
                workType,
                description: description || undefined,
                timestamp: `${date}T00:00:00`,
                isPaid: paid,
                paymentType: paid ? (paymentType as PaymentType) : undefined,
            });
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to record labour.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : handleClose())}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Record Labour</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    {error && (
                        <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label>Employee</Label>
                        <Select value={employeeId} onValueChange={(v) => { if (v !== null) setEmployeeId(v); }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees?.map((emp) => (
                                    <SelectItem key={emp.employeeId} value={emp.employeeId}>{emp.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Date</Label>
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Worked Hours</Label>
                            <Input type="number" placeholder="0" min={0} value={workedHours} onChange={(e) => setWorkedHours(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Hourly Rate (LKR)</Label>
                            <Input type="number" placeholder="0.00" min={0} value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
                        </div>
                    </div>

                    <div className="rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm">
                        Amount: <span className="font-semibold">LKR {amount.toLocaleString()}</span>
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
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                        />
                    </div>

                    {isPaid && (
                        <div className="space-y-1.5">
                            <Label>Payment Type</Label>
                            <Select value={paymentType} onValueChange={(v) => { if (v !== null) setPaymentType(v as PaymentType); }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAYMENT_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
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
                        disabled={createLabour.isPending}
                        onClick={() => { setIsPaid(false); handleSubmit(false); }}
                    >
                        {createLabour.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Add Record
                    </Button>
                    <Button
                        className="flex-1 bg-brand-500 hover:bg-brand-600 text-white"
                        disabled={createLabour.isPending}
                        onClick={() => {
                            if (!isPaid) {
                                setIsPaid(true);
                                return;
                            }
                            handleSubmit(true);
                        }}
                    >
                        {createLabour.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isPaid ? "Confirm Paid" : "Paid"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
