"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEstateLoans } from "@/features/assets/hooks/use-assets";
import { formatLkr } from "@/features/accounts/utils/format";
import type { EstateLoan } from "@/features/assets/types/assets.types";
import { DrawdownDialog, EditLoanDialog, LoanHistoryDialog, RepaymentDialog } from "./loan-dialogs";

type DialogKind = "repay" | "drawdown" | "history" | "edit";

export function LoansList() {
    const { data: loans, isLoading } = useEstateLoans();
    const [active, setActive] = useState<{ kind: DialogKind; loan: EstateLoan } | null>(null);

    function open(kind: DialogKind, loan: EstateLoan) {
        setActive({ kind, loan });
    }
    const close = () => setActive(null);
    const forKind = (kind: DialogKind) => (active?.kind === kind ? active.loan : null);

    return (
        <>
            <Card className="shadow-sm gap-0 p-6">
                <CardTitle className="text-base font-semibold mb-4">Loans</CardTitle>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <Table>
                        <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Issued</TableHead>
                                <TableHead className="text-right">Borrowed</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                                <TableHead>Terms</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && (
                                <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline-block" /></TableCell></TableRow>
                            )}
                            {!isLoading && (loans?.length ?? 0) === 0 && (
                                <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-400">No loans recorded yet.</TableCell></TableRow>
                            )}
                            {loans?.map((loan) => (
                                <TableRow key={loan.loanId}>
                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                        {loan.name}
                                        {loan.lender && <div className="text-[11px] font-normal text-gray-400">{loan.lender}</div>}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">{loan.issuedDate}</TableCell>
                                    <TableCell className="text-right text-sm">{formatLkr(loan.principalAmount)}</TableCell>
                                    <TableCell className="text-right text-sm font-semibold">{formatLkr(loan.currentBalance)}</TableCell>
                                    <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                                        {loan.interestRate != null ? `${loan.interestRate}% p.a.` : "No interest"}
                                        {loan.termMonths ? `, ${loan.termMonths} mo` : ""}
                                        {loan.installmentAmount ? `, ${formatLkr(loan.installmentAmount)}/mo` : ""}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                            loan.isActive
                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                        }`}>
                                            {loan.isActive ? "Active" : "Settled"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex flex-wrap justify-end gap-2">
                                            {loan.isActive && (
                                                <Button size="sm" variant="outline" onClick={() => open("repay", loan)}>Repay</Button>
                                            )}
                                            <Button size="sm" variant="outline" onClick={() => open("drawdown", loan)}>Draw down</Button>
                                            <Button size="sm" variant="ghost" onClick={() => open("history", loan)}>History</Button>
                                            <Button size="sm" variant="ghost" onClick={() => open("edit", loan)}>Edit</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <RepaymentDialog loan={forKind("repay")} onClose={close} />
            <DrawdownDialog loan={forKind("drawdown")} onClose={close} />
            <LoanHistoryDialog loan={forKind("history") ? (loans?.find((l) => l.loanId === active?.loan.loanId) ?? active?.loan ?? null) : null} onClose={close} />
            <EditLoanDialog loan={forKind("edit")} onClose={close} />
        </>
    );
}
