"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Pencil, Trash2, Undo2 } from "lucide-react";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useSalesLedger, useDeleteSale, useUndoSalePayment } from "@/features/financials/hooks/use-financials";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { saleCategoryLabel, formatLkr } from "@/features/financials/utils/sale-labels";
import type { SalesLedgerRow } from "@/features/financials/types/financials.types";

const CATEGORY_FILTERS: { id: string; label: string }[] = [
    { id: "latex", label: "Latex" },
    { id: "rubber-solid", label: "Rubber Solid" },
    { id: "manioc", label: "Manioc" },
    { id: "coconut", label: "Coconut" },
    { id: "banana", label: "Banana" },
    { id: "general", label: "Other products" },
];

interface SalesTableProps {
    onMarkPayment: (row: SalesLedgerRow) => void;
    onEdit: (row: SalesLedgerRow) => void;
}

export function SalesTable({ onMarkPayment, onEdit }: SalesTableProps) {
    const [category, setCategory] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [page, setPage] = useState(0);
    const [actionError, setActionError] = useState<string | null>(null);

    const { data, isLoading } = useSalesLedger({
        category: category || undefined,
        status: status || undefined,
        from: from || undefined,
        to: to || undefined,
        page,
        size: 10,
    });
    const { data: accounts } = useAccounts();
    const accountName = (code: string | null) => accounts?.find((a) => a.code === code)?.name ?? code ?? "";
    const rows = data?.content ?? [];
    const totalPages = data?.totalPages ?? 1;

    const deleteSale = useDeleteSale();
    const undoPayment = useUndoSalePayment();

    async function handleUndo(row: SalesLedgerRow) {
        if (!window.confirm("Undo this payment? The money received will be reversed out of the account and the sale returns to pending.")) return;
        setActionError(null);
        try {
            await undoPayment.mutateAsync({ type: row.saleType, id: row.saleId });
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Failed to undo the payment.");
        }
    }

    async function handleDelete(row: SalesLedgerRow) {
        if (!window.confirm("Delete this sale? This cannot be undone.")) return;
        setActionError(null);
        try {
            await deleteSale.mutateAsync({ type: row.saleType, id: row.saleId });
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Failed to delete the sale.");
        }
    }

    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <CardTitle className="text-base font-semibold">Sales Ledger</CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                    <Select value={category || "all"} onValueChange={(v) => { if (v !== null) setCategory(v === "all" ? "" : v); setPage(0); }}>
                        <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Category" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {CATEGORY_FILTERS.map((c) => (
                                <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={status || "all"} onValueChange={(v) => { if (v !== null) setStatus(v === "all" ? "" : v); setPage(0); }}>
                        <SelectTrigger className="h-8 text-xs w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
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
                            <TableHead>Buyer</TableHead>
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
                                <TableCell colSpan={7} className="text-center py-8 text-sm text-gray-400">No sales found.</TableCell>
                            </TableRow>
                        ) : rows.map((row) => {
                            const paid = row.status === "paid";
                            return (
                                <TableRow key={`${row.saleType}-${row.saleId}`}>
                                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">{row.saleDate}</TableCell>
                                    <TableCell className="text-sm">{saleCategoryLabel(row.category)}</TableCell>
                                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">{row.buyerName ?? "-"}</TableCell>
                                    <TableCell className="text-sm font-medium">{formatLkr(row.amount)}</TableCell>
                                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">{row.dueDate ?? "-"}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 items-start">
                                            <Badge
                                                variant="outline"
                                                className={paid
                                                    ? "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800"
                                                    : "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800"
                                                }
                                            >
                                                {paid ? "Paid" : "Pending"}
                                            </Badge>
                                            {!paid && row.overdue && (
                                                <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800">
                                                    Overdue
                                                </Badge>
                                            )}
                                            {paid && (
                                                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                                    {row.paymentDate ?? ""}{row.accountCode ? ` · ${accountName(row.accountCode)}` : ""}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {paid ? (
                                                <Button variant="outline" size="sm" className="mr-1" onClick={() => handleUndo(row)} disabled={undoPayment.isPending}>
                                                    <Undo2 className="w-3.5 h-3.5 mr-1" /> Undo payment
                                                </Button>
                                            ) : (
                                                <Button variant="outline" size="sm" className="mr-1" onClick={() => onMarkPayment(row)}>
                                                    Mark Payment
                                                </Button>
                                            )}
                                            <button
                                                onClick={() => onEdit(row)}
                                                disabled={paid}
                                                aria-label="Edit sale"
                                                title={paid ? "Undo the payment before editing" : "Edit sale"}
                                                className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 disabled:opacity-40 disabled:pointer-events-none"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(row)}
                                                disabled={paid}
                                                aria-label="Delete sale"
                                                title={paid ? "Undo the payment before deleting" : "Delete sale"}
                                                className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-40 disabled:pointer-events-none"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
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
        </Card>
    );
}
