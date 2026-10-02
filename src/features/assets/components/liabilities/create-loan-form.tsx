"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useCreateEstateLoanRecord } from "@/features/assets/hooks/use-assets";
import { AccountSelect } from "@/features/accounts/components/account-select";
import { toLocalDateInputValue } from "@/lib/utils";

export function CreateLoanForm() {
    const [name, setName] = useState("");
    const [lender, setLender] = useState("");
    const [principalAmount, setPrincipalAmount] = useState("");
    const [issuedDate, setIssuedDate] = useState(toLocalDateInputValue());
    const [interestRate, setInterestRate] = useState("");
    const [termMonths, setTermMonths] = useState("");
    const [installment, setInstallment] = useState("");
    const [notes, setNotes] = useState("");
    const [receivedInto, setReceivedInto] = useState("");
    const [error, setError] = useState<string | null>(null);

    const createLoan = useCreateEstateLoanRecord();

    async function handleSubmit() {
        setError(null);
        if (!name.trim() || !principalAmount || !issuedDate) {
            setError("Name, principal amount, and issued date are required.");
            return;
        }
        try {
            await createLoan.mutateAsync({
                name: name.trim(),
                principalAmount: Number(principalAmount),
                issuedDate,
                interestRate: interestRate ? Number(interestRate) : undefined,
                lender: lender.trim() || undefined,
                termMonths: termMonths ? parseInt(termMonths, 10) : undefined,
                installmentAmount: installment ? Number(installment) : undefined,
                notes: notes.trim() || undefined,
                receivedIntoAccountCode: receivedInto || undefined,
            });
            setName("");
            setLender("");
            setPrincipalAmount("");
            setIssuedDate(toLocalDateInputValue());
            setInterestRate("");
            setTermMonths("");
            setInstallment("");
            setNotes("");
            setReceivedInto("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create loan.");
        }
    }

    return (
        <Card className="p-5 shadow-sm gap-0">
            <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-4">Create Loan</p>
            <div className="space-y-3">
                {error && (
                    <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                <div className="space-y-1.5">
                    <Label>Loan Name</Label>
                    <Input placeholder="e.g. Seylan term loan" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                    <Label>Lender</Label>
                    <Input placeholder="Optional" value={lender} onChange={(e) => setLender(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                    <Label>Principal Amount (LKR)</Label>
                    <Input type="number" placeholder="0.00" min={0} value={principalAmount} onChange={(e) => setPrincipalAmount(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label>Issued Date</Label>
                        <Input type="date" value={issuedDate} onChange={(e) => setIssuedDate(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Interest Rate (%)</Label>
                        <Input type="number" placeholder="Optional" min={0} step={0.1} value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label>Term (months)</Label>
                        <Input type="number" placeholder="Optional" min={1} value={termMonths} onChange={(e) => setTermMonths(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Instalment (LKR)</Label>
                        <Input type="number" placeholder="Optional" min={0} value={installment} onChange={(e) => setInstallment(e.target.value)} />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label>Notes</Label>
                    <Input placeholder="Optional" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                    <Label>Received Into (optional)</Label>
                    <div className="flex gap-2">
                        <AccountSelect value={receivedInto} onValueChange={setReceivedInto} allowedTypes={["CASH", "BANK"]} placeholder="Already spent / not deposited" />
                        {receivedInto && <Button type="button" variant="outline" onClick={() => setReceivedInto("")}>Clear</Button>}
                    </div>
                </div>

                <Button
                    className="w-full bg-brand-500 hover:bg-brand-600 text-white mt-1"
                    disabled={createLoan.isPending}
                    onClick={handleSubmit}
                >
                    {createLoan.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create Loan
                </Button>
            </div>
        </Card>
    );
}
