"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil, Trash2, X } from "lucide-react";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useExpenses, useUpdateExpense, useDeleteExpense } from "@/features/financials/hooks/use-financials";
import { MarkExpensePaymentDialog } from "./mark-expense-payment-dialog";
import type { Expense } from "@/features/financials/types/financials.types";

const EXPENSE_TYPES = ["Fertilizer", "Labor", "Maintenance", "Chemicals", "Utilities", "Logistics", "Other"];

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function EditExpenseDialog({ expense, onClose }: { expense: Expense | null; onClose: () => void }) {
    const [type, setType] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const updateMutation = useUpdateExpense();

    useEffect(() => {
        if (expense) {
            setType(expense.type);
            setAmount(String(expense.amount));
            setDate(expense.timestamp.split("T")[0]);
        }
    }, [expense]);

    function handleClose() {
        setType("");
        setAmount("");
        setDate("");
        onClose();
    }

    async function handleSave() {
        if (!expense || !type || !amount || !date) return;
        await updateMutation.mutateAsync({
            id: expense.expenseId,
            payload: { type, amount: parseFloat(amount), timestamp: `${date}T00:00:00` },
        });
        handleClose();
    }

    return (
        <Dialog open={expense !== null} onOpenChange={(open) => { if (!open) handleClose(); }}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Expense</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                    <div className="space-y-1.5">
                        <Label>Expense Type</Label>
                        <Select value={type} onValueChange={(v) => { if (v) setType(v); }}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {EXPENSE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Amount (LKR)</Label>
                        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Date</Label>
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1" onClick={handleClose}>
                            <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
                        </Button>
                        <Button className="flex-1 bg-brand-500 hover:bg-brand-600 text-white" onClick={handleSave} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function ExpensesTable() {
    const [type, setType] = useState("");
    const [isPaid, setIsPaid] = useState<string>("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [page, setPage] = useState(0);
    const [editing, setEditing] = useState<Expense | null>(null);
    const [markingPaid, setMarkingPaid] = useState<Expense | null>(null);

    const { data, isLoading } = useExpenses({
        type: type || undefined,
        isPaid: isPaid === "" ? undefined : isPaid === "true",
        from: from ? `${from}T00:00:00` : undefined,
        to: to ? `${to}T23:59:59` : undefined,
        page,
        size: 10,
    });
    const rows = data?.content ?? [];
    const totalPages = data?.totalPages ?? 1;

    const deleteMutation = useDeleteExpense();

    async function handleDelete(row: Expense) {
        if (!window.confirm("Delete this expense? This cannot be undone.")) return;
        await deleteMutation.mutateAsync(row.expenseId);
    }

    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <CardTitle className="text-base font-semibold">Expense Ledger</CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                    <Select value={type || "all"} onValueChange={(v) => { if (v !== null) setType(v === "all" ? "" : v); setPage(0); }}>
                        <SelectTrigger className="h-8 text-xs w-32"><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {EXPENSE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={isPaid || "all"} onValueChange={(v) => { if (v !== null) setIsPaid(v === "all" ? "" : v); setPage(0); }}>
                        <SelectTrigger className="h-8 text-xs w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="true">Paid</SelectItem>
                            <SelectItem value="false">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(0); }} className="h-8 text-xs w-36" />
                    <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(0); }} className="h-8 text-xs w-36" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin inline text-brand-500" />
                                </TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-sm text-gray-400">No expenses found.</TableCell>
                            </TableRow>
                        ) : rows.map((row) => (
                            <TableRow key={row.expenseId}>
                                <TableCell className="text-sm text-gray-600 dark:text-gray-400">{new Date(row.timestamp).toLocaleDateString()}</TableCell>
                                <TableCell className="text-sm font-medium">{row.type}</TableCell>
                                <TableCell className="text-sm font-medium">{formatLkr(row.amount)}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={row.isPaid
                                            ? "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800"
                                            : "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800"
                                        }
                                    >
                                        {row.isPaid ? "Paid" : "Pending"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {!row.isPaid && (
                                            <Button variant="outline" size="sm" className="mr-1" onClick={() => setMarkingPaid(row)}>
                                                Mark Payment
                                            </Button>
                                        )}
                                        <button onClick={() => setEditing(row)} className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => handleDelete(row)} className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">Page {page + 1} of {Math.max(totalPages, 1)}</span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Prev</Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
            </div>

            <EditExpenseDialog expense={editing} onClose={() => setEditing(null)} />
            <MarkExpensePaymentDialog expense={markingPaid} onClose={() => setMarkingPaid(null)} />
        </Card>
    );
}
