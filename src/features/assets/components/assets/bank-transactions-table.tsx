"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMonetaryTransactions } from "@/features/assets/hooks/use-assets";
import { ASSET_TYPES } from "@/features/assets/types/assets.types";

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function BankTransactionsTable() {
    const [assetType, setAssetType] = useState<string>("");
    const [transactionType, setTransactionType] = useState<string>("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [page, setPage] = useState(0);

    const { data, isLoading } = useMonetaryTransactions({
        assetType: assetType || undefined,
        transactionType: (transactionType || undefined) as "money in" | "money out" | undefined,
        from: from || undefined,
        to: to || undefined,
        page,
        size: 10,
    });
    const rows = data?.content ?? [];
    const totalPages = data?.totalPages ?? 1;

    return (
        <Card className="shadow-sm gap-0">
            <div className="p-6 pb-4 flex items-center justify-between gap-4 flex-wrap">
                <CardTitle className="text-base font-semibold">Account Transactions</CardTitle>
                <div className="flex items-center gap-3 flex-wrap">
                    <Select value={assetType || "all"} onValueChange={(v) => { if (v !== null) setAssetType(v === "all" ? "" : v); setPage(0); }}>
                        <SelectTrigger className="w-36 h-8 text-xs">
                            <SelectValue placeholder="All Accounts" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Accounts</SelectItem>
                            {ASSET_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={transactionType || "all"} onValueChange={(v) => { if (v !== null) setTransactionType(v === "all" ? "" : v); setPage(0); }}>
                        <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="money in">Credit</SelectItem>
                            <SelectItem value="money out">Debit</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(0); }} className="h-8 text-xs w-36" />
                    <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(0); }} className="h-8 text-xs w-36" />
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="dark:border-gray-700/40">
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Account</TableHead>
                        <TableHead className="text-xs text-right">Last Amount</TableHead>
                        <TableHead className="text-xs text-right">Amount</TableHead>
                        <TableHead className="text-xs text-right">New Amount</TableHead>
                        <TableHead className="text-xs text-center">Type</TableHead>
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
                            <TableCell colSpan={6} className="text-center py-8 text-sm text-gray-400">No transactions found.</TableCell>
                        </TableRow>
                    ) : rows.map((t) => (
                        <TableRow key={t.id} className="dark:border-gray-700/40">
                            <TableCell className="text-sm text-gray-500 dark:text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.assetType}</TableCell>
                            <TableCell className="text-sm text-right text-gray-500 dark:text-gray-400">{formatLkr(t.lastAmount)}</TableCell>
                            <TableCell className="text-sm text-right font-medium text-gray-800 dark:text-gray-200">
                                {formatLkr(Math.abs(t.newAmount - t.lastAmount))}
                            </TableCell>
                            <TableCell className="text-sm text-right text-gray-700 dark:text-gray-300">{formatLkr(t.newAmount)}</TableCell>
                            <TableCell className="text-center">
                                {t.transactionType === "money in" ? (
                                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-medium">Credit</Badge>
                                ) : (
                                    <Badge className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium">Debit</Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex items-center justify-between p-6 pt-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">Page {page + 1} of {Math.max(totalPages, 1)}</span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Prev</Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
            </div>
        </Card>
    );
}
