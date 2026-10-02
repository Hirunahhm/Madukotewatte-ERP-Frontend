"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { useCreateEmployee } from "@/features/employees/hooks/use-employee-mutations";
import { POSITIONS, defaultPayTypeForPosition } from "@/features/employees/utils/positions";
import { PayTypeFields, payFieldsError } from "./pay-type-fields";
import type { PayType } from "@/features/employees/types/employee.types";

interface AddEmployeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddEmployeeDialog({ open, onOpenChange }: AddEmployeeDialogProps) {
    const [name, setName] = useState("");
    const [dateOfJoining, setDateOfJoining] = useState("");
    const [salary, setSalary] = useState("");
    const [position, setPosition] = useState("");
    const [ratePerTree, setRatePerTree] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [payType, setPayType] = useState<PayType>("FIXED_MONTHLY");
    const [error, setError] = useState<string | null>(null);

    const createEmployee = useCreateEmployee();

    function handleClose() {
        setName("");
        setDateOfJoining("");
        setSalary("");
        setPosition("");
        setRatePerTree("");
        setHourlyRate("");
        setPayType("FIXED_MONTHLY");
        setError(null);
        onOpenChange(false);
    }

    async function handleSubmit() {
        setError(null);
        if (!name.trim() || !dateOfJoining) {
            setError("Name and date of joining are required.");
            return;
        }
        const payError = payFieldsError({ payType, salary, ratePerTree, hourlyRate });
        if (payError) {
            setError(payError);
            return;
        }
        try {
            await createEmployee.mutateAsync({
                name: name.trim(),
                joinedDate: dateOfJoining,
                payType,
                salary: payType === "FIXED_MONTHLY" ? Number(salary) : undefined,
                ratePerTree: payType === "PER_TREE" ? Number(ratePerTree) : undefined,
                hourlyRate: payType === "HOURLY" ? Number(hourlyRate) : undefined,
                position: position || undefined,
            });
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create employee.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : handleClose())}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                    {error && (
                        <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label htmlFor="emp-name">Name</Label>
                        <Input
                            id="emp-name"
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="emp-doj">Date of Joining</Label>
                        <Input
                            id="emp-doj"
                            type="date"
                            value={dateOfJoining}
                            onChange={(e) => setDateOfJoining(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Position</Label>
                        <Select value={position} onValueChange={(v) => { if (v !== null) { setPosition(v); setPayType(defaultPayTypeForPosition(v)); } }}>
                            <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectValue placeholder="Select position..." />
                            </SelectTrigger>
                            <SelectContent>
                                {POSITIONS.map((pos) => (
                                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <PayTypeFields
                        value={{ payType, salary, ratePerTree, hourlyRate }}
                        onChange={(patch) => {
                            if (patch.payType !== undefined) setPayType(patch.payType);
                            if (patch.salary !== undefined) setSalary(patch.salary);
                            if (patch.ratePerTree !== undefined) setRatePerTree(patch.ratePerTree);
                            if (patch.hourlyRate !== undefined) setHourlyRate(patch.hourlyRate);
                        }}
                    />

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
                        <Button
                            className="flex-1 bg-brand-500 hover:bg-brand-600"
                            disabled={createEmployee.isPending}
                            onClick={handleSubmit}
                        >
                            {createEmployee.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Add Employee
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
