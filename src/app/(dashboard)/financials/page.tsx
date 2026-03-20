import { FinancialsHeader } from "@/features/financials/components/financials-header";
import { FinancialsPageClient } from "@/features/financials/components/financials-page-client";

export default function FinancialsPage() {
    return (
        <div className="space-y-6">
            <FinancialsHeader />
            <FinancialsPageClient />
        </div>
    );
}
