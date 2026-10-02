"use client";

import { useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useDepreciationSchedule } from "@/features/assets/hooks/use-assets";
import { PeriodPicker } from "@/features/assets/components/period-picker";
import { resolvePeriod, type DateRange } from "@/features/assets/utils/period";
import { formatLkr } from "@/features/accounts/utils/format";
import type { DepreciationRow } from "@/features/assets/types/assets.types";

const COLUMNS: { label: string; get: (r: DepreciationRow) => number }[] = [
    { label: "Cost at start", get: (r) => r.costAtStart },
    { label: "Additions", get: (r) => r.additions },
    { label: "Disposals", get: (r) => r.disposalCost },
    { label: "Cost at end", get: (r) => r.costAtEnd },
    { label: "Accum. at start", get: (r) => r.accumulatedAtStart },
    { label: "Charge", get: (r) => r.chargeForPeriod },
    { label: "On disposals", get: (r) => r.accumulatedOnDisposals },
    { label: "Accum. at end", get: (r) => r.accumulatedAtEnd },
    { label: "NBV at start", get: (r) => r.nbvAtStart },
    { label: "NBV at end", get: (r) => r.nbvAtEnd },
];

function ScheduleRow({ row, label, bold }: { row: DepreciationRow; label: string; bold?: boolean }) {
    return (
        <TableRow className={bold ? "bg-gray-50 dark:bg-gray-800/50 font-semibold" : ""}>
            <TableCell className="text-sm whitespace-nowrap">{label}</TableCell>
            {COLUMNS.map((c) => (
                <TableCell key={c.label} className="text-right text-xs tabular-nums whitespace-nowrap">{formatLkr(c.get(row))}</TableCell>
            ))}
            <TableCell className={`text-right text-xs tabular-nums whitespace-nowrap ${row.disposalGainLoss < 0 ? "text-red-600" : row.disposalGainLoss > 0 ? "text-emerald-600" : ""}`}>
                {row.disposalProceeds > 0 || row.disposalGainLoss !== 0 ? formatLkr(row.disposalGainLoss) : "-"}
            </TableCell>
        </TableRow>
    );
}

/** Fixed-asset and depreciation schedule for a chosen period, per asset and per category. */
export function DepreciationScheduleCard() {
    const [range, setRange] = useState<DateRange>(() => resolvePeriod("this-year", { from: "", to: "" }));
    const { data, isLoading, error } = useDepreciationSchedule(range.from, range.to);

    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
                <div>
                    <CardTitle className="text-base font-semibold">Depreciation Schedule</CardTitle>
                    <CardDescription>
                        {range.from} to {range.to}. A month is charged once it has ended; the acquisition and disposal months are charged in full.
                    </CardDescription>
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
                                <TableHead>Asset</TableHead>
                                {COLUMNS.map((c) => (
                                    <TableHead key={c.label} className="text-right text-xs whitespace-nowrap">{c.label}</TableHead>
                                ))}
                                <TableHead className="text-right text-xs whitespace-nowrap">Gain / (loss)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.assets.length === 0 && (
                                <TableRow><TableCell colSpan={COLUMNS.length + 2} className="text-center py-6 text-sm text-gray-400">No assets in this period.</TableCell></TableRow>
                            )}
                            {data.categories.map((cat) => (
                                <FragmentRows key={cat.category} category={cat} assets={data.assets.filter((a) => a.category === cat.category)} />
                            ))}
                            {data.assets.length > 0 && <ScheduleRow row={data.total} label="Total" bold />}
                        </TableBody>
                    </Table>
                </div>
            )}
        </Card>
    );
}

function FragmentRows({ category, assets }: { category: DepreciationRow; assets: DepreciationRow[] }) {
    return (
        <>
            {assets.map((a) => (
                <ScheduleRow key={a.assetId ?? a.name ?? ""} row={a} label={a.name ?? ""} />
            ))}
            <ScheduleRow row={category} label={`${category.category} total`} bold />
        </>
    );
}
