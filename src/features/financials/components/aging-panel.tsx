"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatLkr } from "@/features/financials/utils/sale-labels";
import type { AgingBucket, PartyTotal } from "@/features/financials/types/financials.types";

export interface AgingRowView {
    key: string;
    party: string;
    label: string;
    date: string;
    dueDate: string | null;
    amount: number;
    days: number;
    bucket: string;
    overdue: boolean;
}

interface AgingPanelProps {
    partyHeading: string;
    total: number;
    overdueTotal: number;
    buckets: AgingBucket[];
    byParty: PartyTotal[];
    rows: AgingRowView[];
    emptyText: string;
}

/** Shared by receivables (per buyer) and payables (per payee): bucket totals, party totals, overdue list. */
export function AgingPanel({ partyHeading, total, overdueTotal, buckets, byParty, rows, emptyText }: AgingPanelProps) {
    const overdueRows = rows.filter((r) => r.overdue);

    if (rows.length === 0) {
        return <p className="text-sm text-gray-400 py-6 text-center">{emptyText}</p>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div className="rounded-lg border border-gray-100 dark:border-gray-800 p-3 md:col-span-1">
                    <p className="text-[11px] uppercase tracking-wider text-gray-500">Total</p>
                    <p className="text-base font-semibold">{formatLkr(total)}</p>
                </div>
                {buckets.map((b) => (
                    <div key={b.bucket} className="rounded-lg border border-gray-100 dark:border-gray-800 p-3">
                        <p className="text-[11px] uppercase tracking-wider text-gray-500">{b.bucket} days</p>
                        <p className="text-base font-semibold">{formatLkr(b.total)}</p>
                        <p className="text-[11px] text-gray-400">{b.count} item{b.count === 1 ? "" : "s"}</p>
                    </div>
                ))}
                <div className="rounded-lg border border-red-100 dark:border-red-900/40 p-3">
                    <p className="text-[11px] uppercase tracking-wider text-red-500">Overdue</p>
                    <p className="text-base font-semibold text-red-600 dark:text-red-400">{formatLkr(overdueTotal)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <p className="text-sm font-semibold mb-2">By {partyHeading.toLowerCase()}</p>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{partyHeading}</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Owing</TableHead>
                                <TableHead>Overdue</TableHead>
                                <TableHead>Oldest</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {byParty.map((p) => (
                                <TableRow key={p.name}>
                                    <TableCell className="text-sm font-medium">{p.name}</TableCell>
                                    <TableCell className="text-sm">{p.count}</TableCell>
                                    <TableCell className="text-sm">{formatLkr(p.total)}</TableCell>
                                    <TableCell className="text-sm text-red-600 dark:text-red-400">{p.overdueTotal > 0 ? formatLkr(p.overdueTotal) : "-"}</TableCell>
                                    <TableCell className="text-sm">{p.oldestDays}d</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <p className="text-sm font-semibold mb-2">Overdue ({overdueRows.length})</p>
                    {overdueRows.length === 0 ? (
                        <p className="text-sm text-gray-400">Nothing is past its due date.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{partyHeading}</TableHead>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Due</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Age</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {overdueRows.map((r) => (
                                    <TableRow key={r.key}>
                                        <TableCell className="text-sm">{r.party}</TableCell>
                                        <TableCell className="text-sm">{r.label}</TableCell>
                                        <TableCell className="text-sm">{r.dueDate}</TableCell>
                                        <TableCell className="text-sm font-medium">{formatLkr(r.amount)}</TableCell>
                                        <TableCell><Badge variant="outline" className="text-xs">{r.days}d · {r.bucket}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    );
}
