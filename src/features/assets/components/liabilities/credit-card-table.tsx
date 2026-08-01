"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil, Check, X } from "lucide-react";
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
import { useCreditCardStatement, useCreditCardLimits, useUpdateCreditCardLimit } from "@/features/assets/hooks/use-assets";
import { CREDIT_CARD_TYPES } from "@/features/assets/types/assets.types";
import { toLocalDateInputValue } from "@/lib/utils";

function formatLkr(value: number): string {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function monthStart(): string {
    const now = new Date();
    return toLocalDateInputValue(new Date(now.getFullYear(), now.getMonth(), 1));
}

function today(): string {
    return toLocalDateInputValue();
}

function CreditCardLimitsRow() {
    const { data: limits, isLoading } = useCreditCardLimits();
    const updateLimit = useUpdateCreditCardLimit();
    const [editing, setEditing] = useState<string | null>(null);
    const [draft, setDraft] = useState("");

    function startEdit(loanType: string, current: number) {
        setEditing(loanType);
        setDraft(String(current));
    }

    async function save(loanType: string) {
        const value = parseFloat(draft);
        if (!Number.isNaN(value) && value > 0) {
            await updateLimit.mutateAsync({ loanType, creditLimit: value });
        }
        setEditing(null);
    }

    if (isLoading) {
        return <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-brand-500" /></div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {(limits ?? []).map((limit) => (
                <div key={limit.loanType} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
                            {limit.loanType.replace("credit-card - ", "")}
                        </p>
                        {editing !== limit.loanType && (
                            <button onClick={() => startEdit(limit.loanType, limit.creditLimit)} className="text-gray-400 hover:text-brand-600">
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase">Balance</p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{formatLkr(limit.balance)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase">Limit</p>
                            {editing === limit.loanType ? (
                                <div className="flex items-center gap-1">
                                    <Input
                                        type="number"
                                        value={draft}
                                        onChange={(e) => setDraft(e.target.value)}
                                        className="h-7 text-xs w-20"
                                    />
                                    <button onClick={() => save(limit.loanType)} className="text-emerald-600"><Check className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => setEditing(null)} className="text-gray-400"><X className="w-3.5 h-3.5" /></button>
                                </div>
                            ) : (
                                <p className="font-semibold text-gray-900 dark:text-gray-100">{formatLkr(limit.creditLimit)}</p>
                            )}
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase">Available</p>
                            <p className="font-semibold text-emerald-600 dark:text-emerald-400">{formatLkr(limit.availableCredit)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function CreditCardTable() {
    const [loanType, setLoanType] = useState<string>(CREDIT_CARD_TYPES[0]);
    const [from, setFrom] = useState(monthStart());
    const [to, setTo] = useState(today());

    const { data: statement, isLoading } = useCreditCardStatement(loanType, from, to);
    const transactions = statement?.transactions ?? [];

    return (
        <Card className="shadow-sm gap-0">
            <div className="p-6 pb-4 space-y-5">
                <CardTitle className="text-base font-semibold">Credit Cards</CardTitle>
                <CreditCardLimitsRow />

                <div className="flex items-end gap-4 flex-wrap pt-2">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Credit Card</Label>
                        <Select value={loanType} onValueChange={(v) => { if (v) setLoanType(v); }}>
                            <SelectTrigger className="w-36 h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CREDIT_CARD_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>{type.replace("credit-card - ", "")}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">From</Label>
                        <Input type="date" className="h-8 text-xs w-36" value={from} onChange={(e) => setFrom(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">To</Label>
                        <Input type="date" className="h-8 text-xs w-36" value={to} onChange={(e) => setTo(e.target.value)} />
                    </div>
                </div>

                {statement && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <p className="text-[10px] text-gray-400 uppercase">Opening Balance</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatLkr(statement.openingBalance)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <p className="text-[10px] text-gray-400 uppercase">Total Charges</p>
                            <p className="text-sm font-semibold text-red-500 dark:text-red-400">{formatLkr(statement.totalCharges)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <p className="text-[10px] text-gray-400 uppercase">Total Payments</p>
                            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatLkr(statement.totalPayments)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <p className="text-[10px] text-gray-400 uppercase">Closing Balance</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatLkr(statement.closingBalance)}</p>
                        </div>
                    </div>
                )}
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="dark:border-gray-700/40">
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs text-right">Last Amount</TableHead>
                        <TableHead className="text-xs text-right">Amount</TableHead>
                        <TableHead className="text-xs text-right">New Amount</TableHead>
                        <TableHead className="text-xs text-center">Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                                <Loader2 className="w-5 h-5 animate-spin inline text-brand-500" />
                            </TableCell>
                        </TableRow>
                    ) : transactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-sm text-gray-400">No transactions in this range.</TableCell>
                        </TableRow>
                    ) : transactions.map((t) => (
                        <TableRow key={t.id} className="dark:border-gray-700/40">
                            <TableCell className="text-sm text-gray-500 dark:text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-sm text-right text-gray-500 dark:text-gray-400">{formatLkr(t.lastAmount)}</TableCell>
                            <TableCell className="text-sm text-right font-medium text-gray-800 dark:text-gray-200">
                                {formatLkr(Math.abs(t.newAmount - t.lastAmount))}
                            </TableCell>
                            <TableCell className="text-sm text-right text-gray-700 dark:text-gray-300">{formatLkr(t.newAmount)}</TableCell>
                            <TableCell className="text-center">
                                {t.transactionType === "borrow" ? (
                                    <Badge className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium">Charge</Badge>
                                ) : (
                                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-medium">Payment</Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
