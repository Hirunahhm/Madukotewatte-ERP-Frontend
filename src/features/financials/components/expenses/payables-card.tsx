"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePayables } from "@/features/financials/hooks/use-financials";
import { AgingPanel } from "@/features/financials/components/aging-panel";

/** Money owed to suppliers, aged from the expense date, as of a chosen day. */
export function PayablesCard() {
    const [asOf, setAsOf] = useState("");
    const { data, isLoading, error } = usePayables(asOf || undefined);

    return (
        <Card className="shadow-sm gap-0 p-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                    <CardTitle className="text-base font-semibold">Payables Ageing</CardTitle>
                    <CardDescription>Unpaid expenses{data ? ` as of ${data.asOf}` : ""}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin text-brand-500" />}
                    <span className="text-xs text-gray-500">As of</span>
                    <Input type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} className="h-8 text-xs w-36" />
                </div>
            </div>
            {error && <p role="alert" className="text-sm text-red-500">{error instanceof Error ? error.message : "Failed to load payables."}</p>}
            {data && (
                <AgingPanel
                    partyHeading="Payee"
                    total={data.total}
                    overdueTotal={data.overdueTotal}
                    buckets={data.buckets}
                    byParty={data.byPayee}
                    emptyText="No unpaid expenses."
                    rows={data.rows.map((r) => ({
                        key: r.expenseId,
                        party: r.payee ?? "Unspecified",
                        label: `${r.category} ${r.expenseDate}`,
                        date: r.expenseDate,
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
