"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useReceivables } from "@/features/financials/hooks/use-financials";
import { AgingPanel } from "@/features/financials/components/aging-panel";
import { saleCategoryLabel } from "@/features/financials/utils/sale-labels";

/** Money owed by buyers, aged from the sale date, as of a chosen day. */
export function ReceivablesCard() {
    const [asOf, setAsOf] = useState("");
    const { data, isLoading, error } = useReceivables(asOf || undefined);

    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                    <CardTitle className="text-base font-semibold">Receivables Ageing</CardTitle>
                    <CardDescription>Unpaid sales{data ? ` as of ${data.asOf}` : ""}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin text-brand-500" />}
                    <span className="text-xs text-gray-500">As of</span>
                    <Input type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} className="h-8 text-xs w-36" />
                </div>
            </div>
            {error && <p role="alert" className="text-sm text-red-500">{error instanceof Error ? error.message : "Failed to load receivables."}</p>}
            {data && (
                <AgingPanel
                    partyHeading="Buyer"
                    total={data.total}
                    overdueTotal={data.overdueTotal}
                    buckets={data.buckets}
                    byParty={data.byBuyer}
                    emptyText="No outstanding receivables."
                    rows={data.rows.map((r) => ({
                        key: `${r.saleType}-${r.saleId}`,
                        party: r.buyerName ?? "Unspecified",
                        label: `${saleCategoryLabel(r.product)} ${r.saleDate}`,
                        date: r.saleDate,
                        dueDate: r.dueDate,
                        amount: r.amount,
                        days: r.daysOutstanding,
                        bucket: r.bucket,
                        overdue: r.overdue,
                    }))}
                />
            )}
        </Card>
    );
}
