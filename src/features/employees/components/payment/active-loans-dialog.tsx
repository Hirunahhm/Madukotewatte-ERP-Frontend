"use client";

import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

const loans = [
    { employee: "Arjun Das", date: "2026-01-10", amount: 25000, installment: 5000, balance: 15000, rate: 8, status: "Active" },
    { employee: "Siti Aminah", date: "2025-11-05", amount: 18000, installment: 3000, balance: 0, rate: 6, status: "Not Active" },
    { employee: "Karthik Raja", date: "2026-02-20", amount: 12000, installment: 2000, balance: 10000, rate: 5, status: "Active" },
    { employee: "Linh Pham", date: "2025-09-15", amount: 20000, installment: 4000, balance: 4000, rate: 7, status: "Active" },
    { employee: "Marcus Tan", date: "2025-07-01", amount: 30000, installment: 6000, balance: 0, rate: 9, status: "Not Active" },
];

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ActiveLoansDialog({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Employee Loans</DialogTitle>
                </DialogHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                            <TableRow className="border-gray-100 dark:border-gray-700/40">
                                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold">Employee</TableHead>
                                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold">Date</TableHead>
                                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold text-right">Loan Amount</TableHead>
                                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold text-right">Installment</TableHead>
                                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold text-right">Balance</TableHead>
                                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold text-right">Interest</TableHead>
                                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loans.map((loan, i) => (
                                <TableRow key={i} className="border-gray-50 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">{loan.employee}</TableCell>
                                    <TableCell className="text-gray-500 dark:text-gray-400 text-sm">{loan.date}</TableCell>
                                    <TableCell className="text-right text-gray-700 dark:text-gray-300">LKR {loan.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-gray-700 dark:text-gray-300">LKR {loan.installment.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-semibold text-gray-900 dark:text-gray-100">LKR {loan.balance.toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-gray-500 dark:text-gray-400">{loan.rate}%</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                            loan.status === "Active"
                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                        }`}>
                                            {loan.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
