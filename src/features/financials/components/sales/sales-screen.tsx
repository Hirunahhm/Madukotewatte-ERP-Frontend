"use client";

import { useState } from "react";
import { SalesKpis } from "./sales-kpis";
import { RevenueDistribution } from "./revenue-distribution";
import { RecordSaleForm } from "./record-sale-form";
import { SalesTable, type SaleRow } from "./sales-table";
import { MarkPaymentDialog } from "./mark-payment-dialog";

export function SalesScreen() {
    const [markPaymentOpen, setMarkPaymentOpen] = useState(false);
    const [, setSelectedSale] = useState<SaleRow | null>(null);

    function handleMarkPayment(row: SaleRow) {
        setSelectedSale(row);
        setMarkPaymentOpen(true);
    }

    return (
        <div className="space-y-6">
            <SalesKpis />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecordSaleForm />
                </div>
                <RevenueDistribution />
            </div>
            <SalesTable onMarkPayment={handleMarkPayment} />
            <MarkPaymentDialog
                open={markPaymentOpen}
                onOpenChange={(open) => {
                    setMarkPaymentOpen(open);
                    if (!open) setSelectedSale(null);
                }}
            />
        </div>
    );
}
