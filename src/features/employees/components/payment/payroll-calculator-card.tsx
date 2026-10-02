"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, Loader2, AlertCircle } from "lucide-react";
import { useApplyLoanDeduction } from "@/features/employees/hooks/use-employee-mutations";
import { toLocalDateInputValue } from "@/lib/utils";
import type { EmployeeLoan } from "@/features/employees/types/loan.types";

function formatLkr(value: number) {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

interface Props {
    employeeId: string | null;
    latexTap: number;
    manualLabor: number;
    loans: EmployeeLoan[];
    isAdmin: boolean;
}

export function PayrollCalculatorCard({ employeeId, latexTap, manualLabor, loans, isAdmin }: Props) {
    const activeLoan = useMemo(() => loans.find((l) => l.isActive), [loans]);
    const [deduction, setDeduction] = useState(activeLoan?.installment ?? 0);
    const [error, setError] = useState<string | null>(null);
    const applyLoanDeduction = useApplyLoanDeduction();

    useEffect(() => {
        setDeduction(activeLoan?.installment ?? 0);
        setError(null);
    }, [activeLoan?.loanId, activeLoan?.installment, activeLoan?.currentBalance]);

    const totalEarned = latexTap + manualLabor;
    const balance = totalEarned - deduction;

    async function handleApply() {
        if (!employeeId || !activeLoan) return;
        setError(null);
        if (deduction <= 0) {
            setError("Enter a deduction amount greater than zero.");
            return;
        }
        if (deduction > activeLoan.currentBalance) {
            setError("Deduction exceeds the loan's outstanding balance.");
            return;
        }
        try {
            await applyLoanDeduction.mutateAsync({
                employeeId,
                amount: deduction,
                timestamp: `${toLocalDateInputValue()}T00:00:00`,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to apply loan deduction.");
        }
    }

    return (
        <Card className="p-4 shadow-sm gap-0 space-y-3">
            <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-brand-600" />
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Payroll Calculator</p>
            </div>

            {error && (
                <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
                <div>
                    <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Latex Tap</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{formatLkr(latexTap)}</p>
                </div>
                <div>
                    <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Labour</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{formatLkr(manualLabor)}</p>
                </div>
                <div>
                    <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Earned</p>
                    <p className="text-sm font-semibold text-brand-600 mt-1">{formatLkr(totalEarned)}</p>
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px] text-gray-500 uppercase tracking-wide">Loan Deduction</Label>
                    <Input
                        type="number"
                        min={0}
                        max={activeLoan?.currentBalance ?? 0}
                        step="0.01"
                        className="h-8 text-sm"
                        disabled={!activeLoan}
                        value={deduction}
                        onChange={(e) => setDeduction(Number(e.target.value))}
                    />
                    {!activeLoan && <p className="text-[10px] text-gray-400">No active loan</p>}
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700/40">
                <div>
                    <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Balance</p>
                    <p className={`text-lg font-bold ${balance < 0 ? "text-red-600" : "text-gray-900 dark:text-gray-100"}`}>{formatLkr(balance)}</p>
                </div>
                {isAdmin && (
                    <Button
                        size="sm"
                        className="gap-1.5 bg-brand-500 hover:bg-brand-600"
                        disabled={!activeLoan || deduction <= 0 || applyLoanDeduction.isPending}
                        onClick={handleApply}
                    >
                        {applyLoanDeduction.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Apply Loan Deduction
                    </Button>
                )}
            </div>
        </Card>
    );
}
