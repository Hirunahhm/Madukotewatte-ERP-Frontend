"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateExpense } from "@/features/financials/hooks/use-financials";
import { AccountSelect } from "@/features/accounts/components/account-select";
import { toLocalDateInputValue } from "@/lib/utils";

const EXPENSE_TYPES = ["Fertilizer", "Labour", "Maintenance", "Chemicals", "Utilities", "Logistics", "Other"];

const today = () => toLocalDateInputValue();

export function RecordExpenseForm() {
    const [date, setDate] = useState(today());
    const [type, setType] = useState("");
    const [amount, setAmount] = useState("");
    const [isPaid, setIsPaid] = useState(false);
    const [accountCode, setAccountCode] = useState("");
    const [error, setError] = useState<string | null>(null);

    const createExpense = useCreateExpense();
    const isSubmitting = createExpense.isPending;

    async function handleSubmit() {
        if (!type || !amount || !date) return;
        if (isPaid && !accountCode) return;
        setError(null);

        try {
            await createExpense.mutateAsync({
                type,
                amount: parseFloat(amount),
                timestamp: `${date}T00:00:00`,
                isPaid,
                accountCode: isPaid ? accountCode : undefined,
                paymentDate: isPaid ? date : undefined,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to record the expense.");
            return;
        }

        setType("");
        setAmount("");
        setIsPaid(false);
        setAccountCode("");
    }

    return (
        <Card className="shadow-sm p-6 gap-0 flex flex-col h-full">
            <CardTitle className="text-base font-semibold mb-5">Record Expense</CardTitle>

            <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>Date</Label>
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Expense Type</Label>
                        <Select value={type} onValueChange={(v) => { if (v) setType(v); }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {EXPENSE_TYPES.map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label>Amount (LKR)</Label>
                    <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>

                {isPaid && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                        <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Payment Details</p>
                        <div className="space-y-1.5">
                            <Label>Pay from</Label>
                            <AccountSelect value={accountCode} onValueChange={setAccountCode} />
                        </div>
                    </div>
                )}
            </div>

            {error && <p role="alert" className="text-sm text-red-500 mt-3">{error}</p>}

            <div className="flex gap-3 mt-6">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !type || !amount}
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Record Expense"}
                </Button>
                <Button
                    className={`flex-1 text-white ${isPaid ? "bg-brand-600 hover:bg-brand-700" : "bg-brand-500 hover:bg-brand-600"}`}
                    onClick={() => setIsPaid((v) => !v)}
                >
                    {isPaid ? "Payment Entered" : "Paid"}
                </Button>
            </div>
        </Card>
    );
}
