"use client";

import { useUiStore } from "@/stores/ui-store";
import { EmployeeHeader } from "./employee-header";
import { TopPerformers } from "./top-performers";
import { ProductivityChart } from "./productivity-chart";
import { EmployeeTable } from "./employee-table";

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

            {activeTab === "payment" && (
                <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
                    <p className="text-4xl mb-4">💳</p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Payment Module Coming Soon</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Salary processing and payroll management will appear here.</p>
                </div>
            )}
        </div>
    );
}
