"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Undo2, AlertCircle } from "lucide-react";
import { AccountSelect } from "@/features/accounts/components/account-select";
import { useAccountStatement, useReverseEntry } from "@/features/accounts/hooks/use-accounts";
import { CATEGORY_LABEL, formatLkr } from "@/features/accounts/utils/format";
import { LEDGER_CATEGORIES, type AccountType, type LedgerCategory, type LedgerEntry } from "@/features/accounts/types/accounts.types";
import { toLocalDateInputValue } from "@/lib/utils";

interface AccountStatementCardProps {
    title?: string;
    /** Restrict the account picker (e.g. credit cards only on the Debt tab). */
    allowedTypes?: AccountType[];
    /** Pre-selected account code. */
    defaultAccount?: string;
}

const ALL = "all";
const CATEGORY_ITEMS = [
    { value: ALL, label: "All categories" },
    ...LEDGER_CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABEL[c] })),
];

function monthStart(): string {
    const now = new Date();
    return toLocalDateInputValue(new Date(now.getFullYear(), now.getMonth(), 1));
}

export function AccountStatementCard({ title = "Account statement", allowedTypes, defaultAccount }: AccountStatementCardProps) {
    const [account, setAccount] = useState(defaultAccount ?? "");
    const [from, setFrom] = useState(monthStart());
    const [to, setTo] = useState(toLocalDateInputValue());
    const [category, setCategory] = useState<string>(ALL);
    const [reversing, setReversing] = useState<LedgerEntry | null>(null);
    const [reason, setReason] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { data: statement, isLoading, error: loadError } = useAccountStatement(
        account, from, to, category === ALL ? undefined : (category as LedgerCategory),
    );
    const reverse = useReverseEntry();

    async function confirmReverse() {
        if (!reversing) return;
        setError(null);
        try {
            await reverse.mutateAsync({ id: reversing.id, reason: reason.trim() || undefined });
            setReversing(null);
            setReason("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to reverse the entry.");
        }
    }

    const rows = statement?.rows ?? [];

    return (
        <Card className="shadow-sm gap-0">
            <div className="p-6 pb-4 space-y-4">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="space-y-1.5 md:col-span-1">
                        <Label className="text-xs">Account</Label>
                        <AccountSelect value={account} onValueChange={setAccount} allowedTypes={allowedTypes} showBalance={false} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">From</Label>
                        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">To</Label>
                        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Category</Label>
                        <Select value={category} onValueChange={(v) => { if (v) setCategory(v); }} items={CATEGORY_ITEMS}>
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {CATEGORY_ITEMS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {statement && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        {[
                            { label: "Opening", value: statement.openingBalance },
                            { label: "Money in", value: statement.totalIn },
                            { label: "Money out", value: statement.totalOut },
                            { label: "Closing", value: statement.closingBalance },
                        ].map((s) => (
                            <div key={s.label} className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3">
                                <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-400">{s.label}</p>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">{formatLkr(s.value, 2)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="dark:border-gray-700/40">
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Category</TableHead>
                        <TableHead className="text-xs">Details</TableHead>
                        <TableHead className="text-xs text-right">Money in</TableHead>
                        <TableHead className="text-xs text-right">Money out</TableHead>
                        <TableHead className="text-xs text-right">Balance</TableHead>
                        <TableHead className="text-xs text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!account ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8 text-sm text-gray-400">Choose an account to see its statement.</TableCell></TableRow>
                    ) : isLoading ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin inline text-brand-500" /></TableCell></TableRow>
                    ) : loadError ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8 text-sm text-red-500">{loadError instanceof Error ? loadError.message : "Failed to load the statement."}</TableCell></TableRow>
                    ) : rows.length === 0 ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8 text-sm text-gray-400">No entries in this period.</TableCell></TableRow>
                    ) : rows.map((row) => (
                        <TableRow key={row.id} className="dark:border-gray-700/40">
                            <TableCell className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{row.transactionDate}</TableCell>
                            <TableCell className="text-sm">
                                <span className="font-medium text-gray-800 dark:text-gray-200">{CATEGORY_LABEL[row.category]}</span>
                                {row.reversed && <Badge variant="outline" className="ml-2 text-[10px]">Reversed</Badge>}
                                {row.reversalOfId && <Badge variant="outline" className="ml-2 text-[10px]">Reversal</Badge>}
                            </TableCell>
                            <TableCell className="text-xs text-gray-500 dark:text-gray-400 max-w-64 truncate">{row.description ?? row.referenceType ?? "-"}</TableCell>
                            <TableCell className="text-sm text-right text-emerald-600 dark:text-emerald-400">
                                {row.transactionType === "money in" ? formatLkr(row.amount, 2) : ""}
                            </TableCell>
                            <TableCell className="text-sm text-right text-red-500 dark:text-red-400">
                                {row.transactionType === "money out" ? formatLkr(row.amount, 2) : ""}
                            </TableCell>
                            <TableCell className="text-sm text-right font-medium text-gray-800 dark:text-gray-200">{formatLkr(row.balanceAfter, 2)}</TableCell>
                            <TableCell className="text-right">
                                {row.reversible && (
                                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setReversing(row); setReason(""); setError(null); }}>
                                        <Undo2 className="w-3.5 h-3.5 mr-1" /> Reverse
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={reversing !== null} onOpenChange={(o) => { if (!o) setReversing(null); }}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Reverse this entry?</DialogTitle>
                        <DialogDescription>
                            {reversing && `${CATEGORY_LABEL[reversing.category]} of ${formatLkr(reversing.amount, 2)} on ${reversing.transactionDate} will be cancelled by an opposite entry. The original stays in the ledger.`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        {error && (
                            <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <Label>Reason (optional)</Label>
                            <Input value={reason} onChange={(e) => setReason(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReversing(null)} disabled={reverse.isPending}>Keep entry</Button>
                        <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={confirmReverse} disabled={reverse.isPending}>
                            {reverse.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Reverse entry
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
