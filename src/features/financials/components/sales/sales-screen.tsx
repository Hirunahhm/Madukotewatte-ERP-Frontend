"use client";

import { useState } from "react";
import { SalesKpis } from "./sales-kpis";
import { SalesTrendChart } from "./sales-trend-chart";
import { RevenueDistribution } from "./revenue-distribution";
import { RecordSaleForm } from "./record-sale-form";
import { SalesTable } from "./sales-table";
import { MarkPaymentDialog } from "./mark-payment-dialog";
import type { SalesLedgerRow } from "@/features/financials/types/financials.types";

export function SalesScreen() {
    const [markPaymentOpen, setMarkPaymentOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState<SalesLedgerRow | null>(null);

    function handleMarkPayment(row: SalesLedgerRow) {
        setSelectedSale(row);
        setMarkPaymentOpen(true);
    }

    return (
        <div className="space-y-6">
            <SalesKpis />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SalesTrendChart />
                </div>
                <RevenueDistribution />
            </div>
            <RecordSaleForm />
            <SalesTable onMarkPayment={handleMarkPayment} />
            <MarkPaymentDialog
                open={markPaymentOpen}
                onOpenChange={(open) => {
                    setMarkPaymentOpen(open);
                    if (!open) setSelectedSale(null);
                }}
                row={selectedSale}
            />
        </div>
    );
}
