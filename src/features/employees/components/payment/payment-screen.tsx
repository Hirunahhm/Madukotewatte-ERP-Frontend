"use client";

import { useMemo, useState } from "react";
import { ClipboardList, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentKpis } from "./payment-kpis";
import { SalaryChart } from "./salary-chart";
import { GiveLoanForm } from "./give-loan-form";
import { RecordLabourDialog } from "./record-labour-dialog";
import { ActiveLoansDialog } from "./active-loans-dialog";
import { SalaryTable } from "./salary-table";
import { useActiveLoans } from "@/features/employees/hooks/use-loan-mutations";
import { useAuthStore } from "@/stores/auth-store";

export function PaymentScreen() {
    const [labourOpen, setLabourOpen] = useState(false);
    const [loansOpen, setLoansOpen] = useState(false);

    const role = useAuthStore((s) => s.role);
    const isAdmin = role === "ROLE_ADMIN";

    const { data: activeLoans } = useActiveLoans();
    const totalOutstanding = useMemo(
        () => activeLoans?.reduce((sum, loan) => sum + loan.currentBalance, 0) ?? 0,
        [activeLoans]
    );

    return (
        <div className="space-y-6">
            <PaymentKpis />
            <SalaryChart />

            {isAdmin && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GiveLoanForm />
                    <Card className="p-5 shadow-sm gap-0 flex flex-col justify-between">
                        <div>
                            <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">Loan Management</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{activeLoans?.length ?? 0}</span> active loans
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Total outstanding: <span className="font-semibold text-blue-600 dark:text-blue-400">LKR {totalOutstanding.toLocaleString()}</span>
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="mt-4 w-full gap-2"
                            onClick={() => setLoansOpen(true)}
                        >
                            <Eye className="w-4 h-4" />
                            View Current Employee Loans
                        </Button>
                    </Card>
                </div>
            )}

            <div className="flex justify-end">
                <Button
                    className="gap-2 bg-brand-500 hover:bg-brand-600 text-white shadow-sm"
                    onClick={() => setLabourOpen(true)}
                >
                    <ClipboardList className="w-4 h-4" />
                    Record Labour
                </Button>
            </div>

            <SalaryTable />

            <RecordLabourDialog open={labourOpen} onOpenChange={setLabourOpen} />
            {isAdmin && <ActiveLoansDialog open={loansOpen} onOpenChange={setLoansOpen} />}
        </div>
    );
}
