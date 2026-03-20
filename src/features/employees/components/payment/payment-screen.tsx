"use client";

import { useState } from "react";
import { ClipboardList, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentKpis } from "./payment-kpis";
import { SalaryChart } from "./salary-chart";
import { GiveLoanForm } from "./give-loan-form";
import { RecordLabourDialog } from "./record-labour-dialog";
import { ActiveLoansDialog } from "./active-loans-dialog";
import { SalaryTable } from "./salary-table";

export function PaymentScreen() {
    const [labourOpen, setLabourOpen] = useState(false);
    const [loansOpen, setLoansOpen] = useState(false);

    return (
        <div className="space-y-6">
            <PaymentKpis />
            <SalaryChart />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GiveLoanForm />
                <Card className="p-5 shadow-sm gap-0 flex flex-col justify-between">
                    <div>
                        <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">Loan Management</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">3</span> active loans
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                            Total outstanding: <span className="font-semibold text-blue-600 dark:text-blue-400">LKR 29,000</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Next installment due: <span className="font-semibold text-amber-600 dark:text-amber-400">2026-04-01</span>
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
            <ActiveLoansDialog open={loansOpen} onOpenChange={setLoansOpen} />
        </div>
    );
}
