"use client";

import { LiabilityKpis } from "./liability-kpis";
import { CreditGrowthChart } from "./credit-growth-chart";
import { RecordLiabilityForm } from "./record-liability-form";
import { BorrowsCard } from "./borrows-card";
import { RecurringPaymentForm } from "./recurring-payment-form";
import { CreditCardTable } from "./credit-card-table";
import { CreateLoanForm } from "./create-loan-form";
import { LoansList } from "./loans-list";

export function DebtScreen() {
    return (
        <div className="space-y-6">
            <LiabilityKpis />
            <CreditGrowthChart />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <RecordLiabilityForm />
                    <LoansList />
                </div>
                <div className="space-y-6">
                    <BorrowsCard />
                    <CreateLoanForm />
                </div>
            </div>
            <RecurringPaymentForm />
            <CreditCardTable />
        </div>
    );
}
