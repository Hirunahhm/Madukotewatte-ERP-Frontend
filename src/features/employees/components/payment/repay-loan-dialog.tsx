"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AccountSelect } from "@/features/accounts/components/account-select";
import { toLocalDateInputValue } from "@/lib/utils";
import { useRepayLoan } from "@/features/employees/hooks/use-payroll";
import type { EmployeeLoan } from "@/features/employees/types/loan.types";

interface Props {
    loan: EmployeeLoan | null;
    onOpenChange: (open: boolean) => void;
}

/** The employee hands back part of the loan in cash / by bank transfer (outside payroll). */
export function RepayLoanDialog({ loan, onOpenChange }: Props) {
    const [amount, setAmount] = useState("");
    const [accountCode, setAccountCode] = useState("");
    const [date, setDate] = useState(toLocalDateInputValue());
    const [error, setError] = useState<string | null>(null);
    const repay = useRepayLoan();

    function handleClose() {
        setAmount("");
        setAccountCode("");
        setDate(toLocalDateInputValue());
        setError(null);
        onOpenChange(false);
    }

    async function handleSubmit() {
        if (!loan) return;
        setError(null);
        const value = Number(amount);
        if (!value || value <= 0) return setError("Enter a valid amount.");
        if (value > loan.currentBalance) return setError("The repayment is more than the loan balance.");
        if (!accountCode) return setError("Choose the account the money goes into.");
        try {
            await repay.mutateAsync({ loanId: loan.loanId, payload: { amount: value, accountCode, date } });
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to record the repayment.");
        }
    }

    return (
        <Dialog open={loan !== null} onOpenChange={(o) => (o ? undefined : handleClose())}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Record Loan Repayment</DialogTitle>
                </DialogHeader>
                {loan && (
                    <div className="space-y-3 pt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {loan.employeeName} - balance LKR {loan.currentBalance.toLocaleString()}
                        </p>
                        {error && (
                            <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <Label>Amount received (LKR)</Label>
                            <Input type="number" min={0} placeholder={String(loan.installment)} value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Received into</Label>
                            <AccountSelect value={accountCode} onValueChange={setAccountCode} allowedTypes={["CASH", "BANK"]} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Date</Label>
                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <div className="flex gap-3 pt-1">
                            <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
                            <Button className="flex-1 bg-brand-500 hover:bg-brand-600 text-white" disabled={repay.isPending} onClick={handleSubmit}>
                                {repay.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Record Repayment
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
