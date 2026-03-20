"use client";

import { useUiStore } from "@/stores/ui-store";
import { EmployeeHeader } from "./employee-header";
import { TopPerformers } from "./top-performers";
import { ProductivityChart } from "./productivity-chart";
import { EmployeeTable } from "./employee-table";
import { PaymentScreen } from "./payment/payment-screen";

export function EmployeesPageClient() {
    const activeTab = useUiStore((state) => state.employeesTab);

    return (
        <div className="space-y-6">
            <EmployeeHeader />

            {activeTab === "attendance" && (
                <>
                    <TopPerformers />
                    <ProductivityChart />
                    <EmployeeTable />
                </>
            )}

            {activeTab === "payment" && <PaymentScreen />}
        </div>
    );
}
