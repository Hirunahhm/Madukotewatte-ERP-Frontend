"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useSalesLedger } from "@/features/financials/hooks/use-financials";
import type { SalesLedgerRow } from "@/features/financials/types/financials.types";

const CATEGORY_LABELS: Record<string, string> = {
    "latex": "Latex",
    "rubber-solid": "Rubber Solid",
    "manioc": "Manioc",
    "coconut": "Coconut",
    "banana": "Banana",
};

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

interface SalesTableProps {
    onMarkPayment: (row: SalesLedgerRow) => void;
}

export function SalesTable({ onMarkPayment }: SalesTableProps) {
    const [category, setCategory] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [page, setPage] = useState(0);

    const { data, isLoading } = useSalesLedger({
        category: category || undefined,
        status: status || undefined,
        from: from || undefined,
        to: to || undefined,
        page,
        size: 10,
    });
    const rows = data?.content ?? [];
    const totalPages = data?.totalPages ?? 1;

    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <CardTitle className="text-base font-semibold">Sales Ledger</CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                    <Select value={category || "all"} onValueChange={(v) => { if (v !== null) setCategory(v === "all" ? "" : v); setPage(0); }}>
                        <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Category" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {Object.entries(CATEGORY_LABELS).map(([id, label]) => (
                                <SelectItem key={id} value={id}>{label}</SelectItem>
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
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Load ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin inline text-brand-500" />
                                </TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-sm text-gray-400">No sales found.</TableCell>
                            </TableRow>
                        ) : rows.map((row) => (
                            <TableRow key={`${row.category}-${row.saleId}`}>
                                <TableCell className="font-mono text-sm font-medium">{row.loadId.slice(0, 8).toUpperCase()}</TableCell>
                                <TableCell className="text-sm text-gray-600 dark:text-gray-400">{row.saleDate}</TableCell>
                                <TableCell className="text-sm">{CATEGORY_LABELS[row.category] ?? row.category}</TableCell>
                                <TableCell className="text-sm font-medium">{formatLkr(row.amount)}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={row.status === "paid"
                                            ? "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800"
                                            : "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800"
                                        }
                                    >
                                        {row.status === "paid" ? "Paid" : "Pending"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={row.status === "paid"}
                                        onClick={() => onMarkPayment(row)}
                                    >
                                        Mark Payment
                                    </Button>
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
        </Card>
    );
}
