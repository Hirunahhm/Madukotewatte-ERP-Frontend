"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil, Trash2, Undo2, X } from "lucide-react";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    useExpenses, useUpdateExpense, useDeleteExpense, useUndoExpensePayment, useExpenseCategories,
} from "@/features/financials/hooks/use-financials";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { MarkExpensePaymentDialog } from "./mark-expense-payment-dialog";
import type { Expense } from "@/features/financials/types/financials.types";

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function EditExpenseForm({ expense, onClose }: { expense: Expense; onClose: () => void }) {
    const [type, setType] = useState(expense.type);
    const [amount, setAmount] = useState(String(expense.amount));
    const [date, setDate] = useState(expense.timestamp.split("T")[0]);
    const [payee, setPayee] = useState(expense.payee ?? "");
    const [description, setDescription] = useState(expense.description ?? "");
    const [dueDate, setDueDate] = useState(expense.dueDate ?? "");
    const [error, setError] = useState<string | null>(null);
    const { data: categories } = useExpenseCategories();
    const updateMutation = useUpdateExpense();

    async function handleSave() {
        if (!type || !amount || !date) return;
        setError(null);
        try {
            await updateMutation.mutateAsync({
                id: expense.expenseId,
                payload: {
                    type,
                    amount: parseFloat(amount),
                    timestamp: `${date}T00:00:00`,
                    payee: payee.trim() || undefined,
                    description: description.trim() || undefined,
                    dueDate: dueDate || undefined,
                },
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save the expense.");
        }
    }

    return (
        <div className="space-y-3 py-2">
            <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={type} onValueChange={(v) => { if (v) setType(v); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {(categories ?? [type]).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label>Amount (LKR)</Label>
                    <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Date</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
            </div>
            <div className="space-y-1.5">
                <Label>Payee</Label>
                <Input value={payee} onChange={(e) => setPayee(e.target.value)} />
            </div>
            <div className="space-y-1.5">
                <Label>Description</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-1.5">
                <Label>Payment due date</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                    <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
                </Button>
                <Button className="flex-1 bg-brand-500 hover:bg-brand-600 text-white" onClick={handleSave} disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                </Button>
            </div>
        </div>
    );
}

function EditExpenseDialog({ expense, onClose }: { expense: Expense | null; onClose: () => void }) {
    return (
        <Dialog open={expense !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Expense</DialogTitle>
                </DialogHeader>
                {expense && <EditExpenseForm key={expense.expenseId} expense={expense} onClose={onClose} />}
            </DialogContent>
        </Dialog>
    );
}

export function ExpensesTable() {
    const [type, setType] = useState("");
    const [payee, setPayee] = useState("");
    const [isPaid, setIsPaid] = useState<string>("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [page, setPage] = useState(0);
    const [editing, setEditing] = useState<Expense | null>(null);
    const [markingPaid, setMarkingPaid] = useState<Expense | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const { data: categories } = useExpenseCategories();
    const { data: accounts } = useAccounts();
    const accountName = (code: string | null) => accounts?.find((a) => a.code === code)?.name ?? code ?? "";

    const { data, isLoading } = useExpenses({
        type: type || undefined,
        payee: payee.trim() || undefined,
        isPaid: isPaid === "" ? undefined : isPaid === "true",
        from: from ? `${from}T00:00:00` : undefined,
        to: to ? `${to}T23:59:59` : undefined,
        page,
        size: 10,
    });
    const rows = data?.content ?? [];
    const totalPages = data?.totalPages ?? 1;

    const deleteMutation = useDeleteExpense();
    const undoMutation = useUndoExpensePayment();

    async function handleDelete(row: Expense) {
        if (!window.confirm("Delete this expense? Any payment already made will be reversed in the ledger.")) return;
        setActionError(null);
        try {
            await deleteMutation.mutateAsync(row.expenseId);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Failed to delete the expense.");
        }
    }

    async function handleUndo(row: Expense) {
        if (!window.confirm("Undo this payment? The money returns to the account and the expense becomes payable again.")) return;
        setActionError(null);
        try {
            await undoMutation.mutateAsync(row.expenseId);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Failed to undo the payment.");
        }
    }

    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <CardTitle className="text-base font-semibold">Expense Ledger</CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                    <Select value={type || "all"} onValueChange={(v) => { if (v !== null) setType(v === "all" ? "" : v); setPage(0); }}>
                        <SelectTrigger className="h-8 text-xs w-40"><SelectValue placeholder="Category" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {(categories ?? []).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input placeholder="Payee" value={payee} onChange={(e) => { setPayee(e.target.value); setPage(0); }} className="h-8 text-xs w-32" />
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
            {actionError && <p role="alert" className="text-sm text-red-500 mb-3">{actionError}</p>}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Payee</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin inline text-brand-500" />
                                </TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-sm text-gray-400">No expenses found.</TableCell>
                            </TableRow>
                        ) : rows.map((row) => (
                            <TableRow key={row.expenseId}>
                                <TableCell className="text-sm text-gray-600 dark:text-gray-400">{new Date(row.timestamp).toLocaleDateString()}</TableCell>
                                <TableCell className="text-sm font-medium">
                                    {row.type}
                                    {row.description && <span className="block text-[11px] font-normal text-gray-500">{row.description}</span>}
                                </TableCell>
                                <TableCell className="text-sm text-gray-600 dark:text-gray-400">{row.payee ?? "-"}</TableCell>
                                <TableCell className="text-sm font-medium">{formatLkr(row.amount)}</TableCell>
                                <TableCell className="text-sm text-gray-600 dark:text-gray-400">{row.dueDate ?? "-"}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 items-start">
                                        <Badge
                                            variant="outline"
                                            className={row.isPaid
                                                ? "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800"
                                                : "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800"
                                            }
                                        >
                                            {row.isPaid ? "Paid" : "Pending"}
                                        </Badge>
                                        {!row.isPaid && row.overdue && (
                                            <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800">Overdue</Badge>
                                        )}
                                        {row.systemManaged && (
                                            <Badge variant="outline" className="text-gray-600 dark:text-gray-300">System ({row.referenceType})</Badge>
                                        )}
                                        {row.isPaid && (
                                            <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                                {row.paymentDate ?? ""}{row.accountCode ? ` · ${accountName(row.accountCode)}` : ""}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    {row.systemManaged ? (
                                        <span className="text-[11px] text-gray-400">Managed by {row.referenceType?.toLowerCase()}</span>
                                    ) : (
                                        <div className="flex items-center justify-end gap-1">
                                            {row.isPaid ? (
                                                <Button variant="outline" size="sm" className="mr-1" onClick={() => handleUndo(row)} disabled={undoMutation.isPending}>
                                                    <Undo2 className="w-3.5 h-3.5 mr-1" /> Undo payment
                                                </Button>
                                            ) : (
                                                <Button variant="outline" size="sm" className="mr-1" onClick={() => setMarkingPaid(row)}>
                                                    Pay
                                                </Button>
                                            )}
                                            <button onClick={() => setEditing(row)} aria-label="Edit expense" className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20">
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => handleDelete(row)} aria-label="Delete expense" className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
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
