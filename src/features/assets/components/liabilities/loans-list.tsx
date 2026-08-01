"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { useEstateLoans, useRecordEstateLoanPayment } from "@/features/assets/hooks/use-assets";
import { ASSET_TYPES, type AssetType, type EstateLoan } from "@/features/assets/types/assets.types";

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function LoansList() {
    const { data: loans, isLoading } = useEstateLoans();
    const [payingLoan, setPayingLoan] = useState<EstateLoan | null>(null);
    const [amount, setAmount] = useState("");
    const [paymentType, setPaymentType] = useState<AssetType>("Cash");
    const [error, setError] = useState<string | null>(null);

    const recordPayment = useRecordEstateLoanPayment();

    function openPaymentDialog(loan: EstateLoan) {
        setPayingLoan(loan);
        setAmount("");
        setPaymentType("Cash");
        setError(null);
    }

    async function handleSubmitPayment() {
        if (!payingLoan) return;
        setError(null);
        if (!amount || Number(amount) <= 0) {
            setError("Enter a valid amount.");
            return;
        }
        try {
            await recordPayment.mutateAsync({
                loanId: payingLoan.loanId,
                payload: { amount: Number(amount), paymentType },
            });
            setPayingLoan(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to record payment.");
        }
    }

    return (
        <>
            <Card className="shadow-sm gap-0 p-6">
                <CardTitle className="text-base font-semibold mb-4">Loans</CardTitle>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <Table>
                        <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Issued</TableHead>
                                <TableHead className="text-right">Principal</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && (
                                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline-block" /></TableCell></TableRow>
                            )}
                            {!isLoading && (loans?.length ?? 0) === 0 && (
                                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-400">No loans recorded yet.</TableCell></TableRow>
                            )}
                            {loans?.map((loan) => (
                                <TableRow key={loan.loanId}>
                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">{loan.name}</TableCell>
                                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">{loan.issuedDate}</TableCell>
                                    <TableCell className="text-right text-sm">{formatLkr(loan.principalAmount)}</TableCell>
                                    <TableCell className="text-right text-sm font-semibold">{formatLkr(loan.currentBalance)}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                            loan.isActive
                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                        }`}>
                                            {loan.isActive ? "Active" : "Settled"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {loan.isActive && (
                                            <Button size="sm" variant="outline" onClick={() => openPaymentDialog(loan)}>
                                                Make Payment
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <Dialog open={!!payingLoan} onOpenChange={(o) => !o && setPayingLoan(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Make Payment — {payingLoan?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 pt-2">
                        {error && (
                            <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <Label>Amount (LKR)</Label>
                            <Input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Pay From</Label>
                            <Select value={paymentType} onValueChange={(v) => { if (v) setPaymentType(v as AssetType); }}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {ASSET_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" className="flex-1" onClick={() => setPayingLoan(null)}>Cancel</Button>
                            <Button
                                className="flex-1 bg-brand-500 hover:bg-brand-600"
                                disabled={recordPayment.isPending}
                                onClick={handleSubmitPayment}
                            >
                                {recordPayment.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Record Payment
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
