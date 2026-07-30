"use client";

import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useActiveLoans } from "@/features/employees/hooks/use-loan-mutations";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ActiveLoansDialog({ open, onOpenChange }: Props) {
    const { data: loans, isLoading } = useActiveLoans();

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
                                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold text-right">Loan Amount</TableHead>
                                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold text-right">Installment</TableHead>
                                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold text-right">Balance</TableHead>
                                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold text-right">Interest</TableHead>
                                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                                        <Loader2 className="w-5 h-5 animate-spin inline-block" />
                                    </TableCell>
                                </TableRow>
                            )}
                            {!isLoading && (loans?.length ?? 0) === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                                        No active loans.
                                    </TableCell>
                                </TableRow>
                            )}
                            {loans?.map((loan) => (
                                <TableRow key={loan.loanId} className="border-gray-50 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">{loan.employeeName}</TableCell>
                                    <TableCell className="text-right text-gray-700 dark:text-gray-300">LKR {loan.principalAmount.toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-gray-700 dark:text-gray-300">LKR {loan.installment.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-semibold text-gray-900 dark:text-gray-100">LKR {loan.currentBalance.toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-gray-500 dark:text-gray-400">{loan.interest}%</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                            loan.isActive
                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                        }`}>
                                            {loan.isActive ? "Active" : "Not Active"}
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
