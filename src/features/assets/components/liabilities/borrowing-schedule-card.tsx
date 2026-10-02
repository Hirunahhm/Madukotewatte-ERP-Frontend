"use client";

import { useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useBorrowingSchedule } from "@/features/assets/hooks/use-assets";
import { PeriodPicker } from "@/features/assets/components/period-picker";
import { resolvePeriod, type DateRange } from "@/features/assets/utils/period";
import { formatLkr } from "@/features/accounts/utils/format";
import type { BorrowingRow } from "@/features/assets/types/assets.types";

function Row({ row, label, bold }: { row: BorrowingRow; label: string; bold?: boolean }) {
    return (
        <TableRow className={bold ? "bg-gray-50 dark:bg-gray-800/50 font-semibold" : ""}>
            <TableCell className="text-sm">{label}</TableCell>
            <TableCell className="text-right text-sm tabular-nums">{formatLkr(row.openingBalance)}</TableCell>
            <TableCell className="text-right text-sm tabular-nums">{formatLkr(row.drawdowns)}</TableCell>
            <TableCell className="text-right text-sm tabular-nums">{formatLkr(row.principalRepaid)}</TableCell>
            <TableCell className="text-right text-sm tabular-nums">{formatLkr(row.closingBalance)}</TableCell>
            <TableCell className="text-right text-sm tabular-nums">{formatLkr(row.interestPaid)}</TableCell>
        </TableRow>
    );
}

/** Borrowings schedule: opening + drawdowns - principal repaid = closing, plus interest paid, for a period. */
export function BorrowingScheduleCard() {
    const [range, setRange] = useState<DateRange>(() => resolvePeriod("this-year", { from: "", to: "" }));
    const { data, isLoading, error } = useBorrowingSchedule(range.from, range.to);

    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
                <div>
                    <CardTitle className="text-base font-semibold">Borrowings Schedule</CardTitle>
                    <CardDescription>{range.from} to {range.to}, by the date of each movement.</CardDescription>
                </div>
                <PeriodPicker onChange={setRange} />
            </div>
            {isLoading && <Loader2 className="w-5 h-5 animate-spin text-brand-500" />}
            {error && <p role="alert" className="text-sm text-red-500">{error instanceof Error ? error.message : "Failed to load schedule."}</p>}
            {data && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <Table>
                        <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                            <TableRow>
                                <TableHead>Loan</TableHead>
                                <TableHead className="text-right">Opening</TableHead>
                                <TableHead className="text-right">Drawdowns</TableHead>
                                <TableHead className="text-right">Principal repaid</TableHead>
                                <TableHead className="text-right">Closing</TableHead>
                                <TableHead className="text-right">Interest paid</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.loans.length === 0 && (
                                <TableRow><TableCell colSpan={6} className="text-center py-6 text-sm text-gray-400">No borrowings in this period.</TableCell></TableRow>
                            )}
                            {data.loans.map((l) => (
                                <Row key={l.loanId ?? l.name ?? ""} row={l} label={l.name ?? ""} />
                            ))}
                            {data.loans.length > 0 && <Row row={data.total} label="Total" bold />}
                        </TableBody>
                    </Table>
                </div>
            )}
        </Card>
    );
}
