"use client";

import { useState } from "react";
import { ExpenseKpis } from "./expense-kpis";
import { ExpenseChart } from "./expense-chart";
import { ExpenseDistribution } from "./expense-distribution";
import { RecordExpenseForm } from "./record-expense-form";
import { ExpensesTable, type ExpenseRow } from "./expenses-table";
import { MarkPaymentDialog } from "../sales/mark-payment-dialog";

export function ExpensesScreen() {
    const [markPaymentOpen, setMarkPaymentOpen] = useState(false);
    const [, setSelectedExpense] = useState<ExpenseRow | null>(null);

    function handleMarkPayment(row: ExpenseRow) {
        setSelectedExpense(row);
        setMarkPaymentOpen(true);
    }

    return (
        <div className="space-y-6">
            <ExpenseKpis />
            <ExpenseChart />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecordExpenseForm />
                </div>
                <ExpenseDistribution />
            </div>
            <ExpensesTable onMarkPayment={handleMarkPayment} />
            <MarkPaymentDialog
                open={markPaymentOpen}
                onOpenChange={(open) => {
                    setMarkPaymentOpen(open);
                    if (!open) setSelectedExpense(null);
                }}
            />
        </div>
    );
}
