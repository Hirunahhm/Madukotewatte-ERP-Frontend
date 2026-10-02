"use client";

import { LiabilityKpis } from "./liability-kpis";
import { CreditCardsPanel } from "./credit-cards-panel";
import { CreateLoanForm } from "./create-loan-form";
import { LoansList } from "./loans-list";
import { BalanceTrendChart } from "@/features/assets/components/assets/balance-trend-chart";
import { AccountStatementCard } from "@/features/accounts/components/account-statement-card";

export function DebtScreen() {
    return (
        <div className="space-y-6">
            <LiabilityKpis />
            <CreditCardsPanel />
            <BalanceTrendChart series="cards" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <LoansList />
                </div>
                <CreateLoanForm />
            </div>
            <AccountStatementCard title="Credit card statement" allowedTypes={["CREDIT_CARD"]} />
        </div>
    );
}
