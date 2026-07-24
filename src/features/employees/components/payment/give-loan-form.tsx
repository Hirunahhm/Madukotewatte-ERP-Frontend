"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { getEmployeesSummary } from "@/features/employees/services/employee-service";
import { useCreateLoan } from "@/features/employees/hooks/use-loan-mutations";

export function GiveLoanForm() {
    const [employeeId, setEmployeeId] = useState("");
    const [principalAmount, setPrincipalAmount] = useState("");
    const [interest, setInterest] = useState("");
    const [installment, setInstallment] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { data: employees } = useQuery({ queryKey: ["employees", "summary"], queryFn: getEmployeesSummary });
    const createLoan = useCreateLoan();

    async function handleSubmit() {
        setError(null);
        if (!employeeId || !principalAmount || !interest || !installment) {
            setError("All fields are required.");
            return;
        }
        try {
            await createLoan.mutateAsync({
                employeeId,
                principalAmount: Number(principalAmount),
                interest: Number(interest),
                installment: Number(installment),
            });
            setEmployeeId("");
            setPrincipalAmount("");
            setInterest("");
            setInstallment("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to issue loan.");
        }
    }

    return (
        <Card className="p-5 shadow-sm gap-0">
            <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-4">Issue New Loan</p>
            <div className="space-y-3">
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
                    <Label>Loan Amount (LKR)</Label>
                    <Input type="number" placeholder="0.00" min={0} value={principalAmount} onChange={(e) => setPrincipalAmount(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label>Interest Rate (%)</Label>
                        <Input type="number" placeholder="% p.a." min={0} step={0.1} value={interest} onChange={(e) => setInterest(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Installment (LKR)</Label>
                        <Input type="number" placeholder="0.00" min={0} value={installment} onChange={(e) => setInstallment(e.target.value)} />
                    </div>
                </div>

                <Button
                    className="w-full bg-brand-500 hover:bg-brand-600 text-white mt-1"
                    disabled={createLoan.isPending}
                    onClick={handleSubmit}
                >
                    {createLoan.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Issue Loan
                </Button>
            </div>
        </Card>
    );
}
