"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccountSelect } from "@/features/accounts/components/account-select";
import { toLocalDateInputValue } from "@/lib/utils";
import { getEmployeesSummary } from "@/features/employees/services/employee-service";
import { useGiveAdvance } from "@/features/employees/hooks/use-payroll";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Pre-selects (and locks) the employee when opened from an employee view. */
    employeeId?: string;
}

export function GiveAdvanceDialog({ open, onOpenChange, employeeId: fixedEmployeeId }: Props) {
    const [employeeId, setEmployeeId] = useState("");
    const [amount, setAmount] = useState("");
    const [accountCode, setAccountCode] = useState("");
    const [date, setDate] = useState(toLocalDateInputValue());
    const [note, setNote] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { data: employees } = useQuery({ queryKey: ["employees", "summary"], queryFn: getEmployeesSummary });
    const giveAdvance = useGiveAdvance();
    const selectedId = fixedEmployeeId ?? employeeId;

    function handleClose() {
        setEmployeeId("");
        setAmount("");
        setAccountCode("");
        setDate(toLocalDateInputValue());
        setNote("");
        setError(null);
        onOpenChange(false);
    }

    async function handleSubmit() {
        setError(null);
        if (!selectedId) return setError("Choose an employee.");
        if (!amount || Number(amount) <= 0) return setError("Enter a valid amount.");
        if (!accountCode) return setError("Choose the account the advance is paid from.");
        try {
            await giveAdvance.mutateAsync({
                employeeId: selectedId,
                amount: Number(amount),
                accountCode,
                date,
                note: note.trim() || undefined,
            });
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to record the advance.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : handleClose())}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Give Advance</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-2">
                    {error && (
                        <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}
                    {!fixedEmployeeId && (
                        <div className="space-y-1.5">
                            <Label>Employee</Label>
                            <Select value={employeeId} onValueChange={(v) => { if (v !== null) setEmployeeId(v); }}>
                                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                                <SelectContent>
                                    {employees?.filter((e) => e.isActive).map((emp) => (
                                        <SelectItem key={emp.employeeId} value={emp.employeeId}>{emp.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <Label>Amount (LKR)</Label>
                        <Input type="number" min={0} placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Paid from</Label>
                        <AccountSelect value={accountCode} onValueChange={setAccountCode} allowedTypes={["CASH", "BANK"]} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Date</Label>
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Note (optional)</Label>
                        <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. medical, festival" />
                    </div>
                    <p className="text-xs text-gray-500">The advance is recovered from the next payslip.</p>
                    <div className="flex gap-3 pt-1">
                        <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
                        <Button className="flex-1 bg-brand-500 hover:bg-brand-600 text-white" disabled={giveAdvance.isPending} onClick={handleSubmit}>
                            {giveAdvance.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Give Advance
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
