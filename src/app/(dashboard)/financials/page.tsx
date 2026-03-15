import { FinancialsHeader } from "@/features/financials/components/financials-header";
import { RevenueChart } from "@/features/financials/components/revenue-chart";
import { ExpenditureBreakdown } from "@/features/financials/components/expenditure-breakdown";
import { TransactionLedger } from "@/features/financials/components/transaction-ledger";

export default function FinancialsPage() {
    return (
        <div className="space-y-6">
            <FinancialsHeader />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RevenueChart />
                <ExpenditureBreakdown />
            </div>
            <TransactionLedger />
        </div>
    );
}
