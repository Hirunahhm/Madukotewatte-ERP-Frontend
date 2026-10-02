"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { X, Loader2, AlertCircle, ChevronLeft, ChevronRight, HandCoins } from "lucide-react";
import { cn, toLocalDateInputValue } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useEmployeePaymentDetail } from "@/features/employees/hooks/use-employee-detail";
import { useDeleteAdvance, useDeleteLoanRepayment, useEmployeePayrollPreview } from "@/features/employees/hooks/use-payroll";
import { PAY_TYPE_LABELS } from "@/features/employees/types/employee.types";
import type { EmployeeLoan } from "@/features/employees/types/loan.types";
import { GiveAdvanceDialog } from "./give-advance-dialog";
import { RepayLoanDialog } from "./repay-loan-dialog";
import { PayslipHistory } from "./payslip-history";

const TRANSACTION_LABELS: Record<string, string> = {
    Manual_Labor: "Labour (paid on the spot)",
    Advance: "Advance given",
    Advance_Recovery: "Advance recovered",
    Loan_Payment: "Loan deduction",
    Latex_Tap: "Tapping earnings",
    Salary_Payment: "Salary payment (legacy)",
};

const TRANSACTION_TYPES = ["Latex_Tap", "Manual_Labor", "Advance", "Advance_Recovery", "Loan_Payment", "Salary_Payment"];

type Tab = "transactions" | "payslips" | "loans";
type LoanFilter = "all" | "active" | "closed";

function formatLkr(value: number) {
    return `LKR ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function toIsoStart(date: string) {
    return `${date}T00:00:00`;
}

function toIsoEnd(date: string) {
    return `${date}T23:59:59`;
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50/40 dark:bg-gray-800/30">
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
            <p className={cn("text-lg font-semibold mt-1", accent ? "text-brand-600" : "text-gray-900 dark:text-gray-100")}>{value}</p>
        </div>
    );
}

function ErrorBanner({ message }: { message: string }) {
    return (
        <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {message}
        </div>
    );
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employeeId: string | null;
}

/**
 * One employee: what they have earned this month and not yet been paid, outstanding advance and loan, the
 * transaction trail, their payslips and loans (with cash repayments).
 */
export function EmployeePaymentDialog({ open, onOpenChange, employeeId }: Props) {
    const [tab, setTab] = useState<Tab>("transactions");

    const [transactionsPage, setTransactionsPage] = useState(0);
    const [transactionsFrom, setTransactionsFrom] = useState("");
    const [transactionsTo, setTransactionsTo] = useState("");
    const [transactionsType, setTransactionsType] = useState("all");
    const [loansFilter, setLoansFilter] = useState<LoanFilter>("all");

    const [advanceOpen, setAdvanceOpen] = useState(false);
    const [repayLoan, setRepayLoan] = useState<EmployeeLoan | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const isAdmin = useAuthStore((s) => s.role) === "ROLE_ADMIN";
    const deleteAdvance = useDeleteAdvance();
    const deleteRepayment = useDeleteLoanRepayment();

    const { employee, transactions, loans } = useEmployeePaymentDetail(
        employeeId,
        {
            page: transactionsPage,
            from: transactionsFrom ? toIsoStart(transactionsFrom) : undefined,
            to: transactionsTo ? toIsoEnd(transactionsTo) : undefined,
            type: transactionsType !== "all" ? transactionsType : undefined,
        },
    );

    // earnings to date: this month so far, as the payroll run would compute them
    const today = toLocalDateInputValue();
    const monthStart = `${today.slice(0, 8)}01`;
    const preview = useEmployeePayrollPreview(employeeId, monthStart, today);
    const row = preview.data?.[0];

    const filteredLoans = useMemo(() => {
        const all = loans.data ?? [];
        if (loansFilter === "all") return all;
        return all.filter((l) => (loansFilter === "active" ? l.isActive : !l.isActive));
    }, [loans.data, loansFilter]);

    useEffect(() => {
        if (!open) {
            setTab("transactions");
            setTransactionsPage(0);
            setTransactionsFrom("");
            setTransactionsTo("");
            setTransactionsType("all");
            setLoansFilter("all");
            setConfirmDeleteId(null);
            setActionError(null);
        }
    }, [open]);

    async function handleDeleteAdvance(id: string) {
        setActionError(null);
        try {
            await deleteAdvance.mutateAsync(id);
            setConfirmDeleteId(null);
        } catch (err) {
            setConfirmDeleteId(null);
            setActionError(err instanceof Error ? err.message : "Failed to delete the advance.");
        }
    }

    async function handleDeleteRepayment(loanId: string, repaymentId: string) {
        setActionError(null);
        try {
            await deleteRepayment.mutateAsync({ loanId, repaymentId });
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Failed to delete the repayment.");
        }
    }

    const transactionFiltersActive = transactionsFrom || transactionsTo || transactionsType !== "all";
    const emp = employee.data;

    return (
        <>
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{emp?.name ?? "Employee Payments"}</DialogTitle>
                </DialogHeader>

                {employee.isLoading && (
                    <div className="py-10 flex justify-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                )}

                {emp && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Position</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{emp.position ?? "-"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{PAY_TYPE_LABELS[emp.payType]}</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                                    {emp.payType === "PER_TREE" && (emp.ratePerTree ? `${formatLkr(emp.ratePerTree)} / tree` : "Rate not set")}
                                    {emp.payType === "HOURLY" && (emp.hourlyRate ? `${formatLkr(emp.hourlyRate)} / hour` : "Rate not set")}
                                    {emp.payType === "FIXED_MONTHLY" && (emp.salary != null ? `${formatLkr(emp.salary)} / month` : "Salary not set")}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Joined</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{emp.joinedDate ?? "-"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</p>
                                <Badge variant="outline" className={cn(
                                    "text-[10px] font-bold uppercase border-transparent mt-1",
                                    emp.isActive ? "bg-emerald-50 text-brand-600" : "bg-gray-100 text-gray-500"
                                )}>
                                    {emp.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <StatCard label="Unpaid earnings (this month)" value={row ? formatLkr(row.grossPay) : "-"} accent />
                            <StatCard label="Outstanding advance" value={row ? formatLkr(row.outstandingAdvances) : "-"} />
                            <StatCard label="Loan balance" value={row ? formatLkr(row.activeLoan?.balance ?? 0) : "-"} />
                            <StatCard label="Suggested net pay" value={row ? formatLkr(row.netPay) : "-"} />
                        </div>

                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1 w-fit">
                                {([
                                    { id: "transactions", label: "Transactions" },
                                    { id: "payslips", label: "Payslips" },
                                    { id: "loans", label: "Loans" },
                                ] as { id: Tab; label: string }[]).map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTab(t.id)}
                                        className={`h-8 px-3 rounded-md text-xs font-medium transition-colors ${tab === t.id ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                            {isAdmin && emp.isActive && (
                                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setAdvanceOpen(true)}>
                                    <HandCoins className="w-3.5 h-3.5" /> Give Advance
                                </Button>
                            )}
                        </div>

                        {actionError && <ErrorBanner message={actionError} />}

                        {tab === "transactions" && (
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-end gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-gray-500">From</Label>
                                        <Input type="date" className="h-8 text-xs w-36" value={transactionsFrom}
                                            onChange={(e) => { setTransactionsFrom(e.target.value); setTransactionsPage(0); }} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-gray-500">To</Label>
                                        <Input type="date" className="h-8 text-xs w-36" value={transactionsTo}
                                            onChange={(e) => { setTransactionsTo(e.target.value); setTransactionsPage(0); }} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-gray-500">Type</Label>
                                        <Select value={transactionsType} onValueChange={(v) => { if (v) { setTransactionsType(v); setTransactionsPage(0); } }}>
                                            <SelectTrigger className="h-8 text-xs w-48"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                {TRANSACTION_TYPES.map((t) => <SelectItem key={t} value={t}>{TRANSACTION_LABELS[t]}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {transactionFiltersActive && (
                                        <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs text-gray-500"
                                            onClick={() => { setTransactionsFrom(""); setTransactionsTo(""); setTransactionsType("all"); setTransactionsPage(0); }}>
                                            <X className="w-3 h-3" /> Clear
                                        </Button>
                                    )}
                                </div>

                                <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Account</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                                <TableHead />
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {transactions.isLoading && (
                                                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline-block" /></TableCell></TableRow>
                                            )}
                                            {!transactions.isLoading && (transactions.data?.content.length ?? 0) === 0 && (
                                                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-400">No transactions match these filters.</TableCell></TableRow>
                                            )}
                                            {transactions.data?.content.map((tx) => (
                                                <TableRow key={tx.transactionRecordId}>
                                                    <TableCell className="text-sm">{new Date(tx.timestamp).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-sm">
                                                        {TRANSACTION_LABELS[tx.type] ?? tx.type}
                                                        {tx.note && <span className="block text-[11px] text-gray-400">{tx.note}</span>}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">{tx.accountCode ?? "-"}</TableCell>
                                                    <TableCell className="text-xs text-gray-500">
                                                        {tx.type === "Latex_Tap" && (tx.payslipId ? "On payslip" : "Unpaid")}
                                                        {(tx.type === "Advance_Recovery" || tx.type === "Loan_Payment") && tx.payslipId && "On payslip"}
                                                    </TableCell>
                                                    <TableCell className="text-right text-sm font-medium">{formatLkr(tx.amount)}</TableCell>
                                                    <TableCell className="text-right whitespace-nowrap">
                                                        {isAdmin && tx.type === "Advance" && (
                                                            confirmDeleteId === tx.transactionRecordId ? (
                                                                <Button size="sm" variant="ghost" className="h-7 text-xs text-red-600"
                                                                    disabled={deleteAdvance.isPending}
                                                                    onClick={() => handleDeleteAdvance(tx.transactionRecordId)}>
                                                                    Confirm delete
                                                                </Button>
                                                            ) : (
                                                                <Button size="sm" variant="ghost" className="h-7 text-xs text-gray-500"
                                                                    onClick={() => setConfirmDeleteId(tx.transactionRecordId)}>
                                                                    Delete
                                                                </Button>
                                                            )
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {transactions.data && transactions.data.totalPages > 1 && (
                                        <div className="flex items-center justify-end gap-2 p-2 border-t border-gray-100 dark:border-gray-700 text-xs">
                                            <button disabled={transactionsPage === 0} onClick={() => setTransactionsPage((p) => Math.max(0, p - 1))} className="w-6 h-6 rounded flex items-center justify-center border border-gray-200 dark:border-gray-700 disabled:opacity-40">
                                                <ChevronLeft className="w-3.5 h-3.5" />
                                            </button>
                                            <span>Page {transactionsPage + 1} of {transactions.data.totalPages}</span>
                                            <button disabled={transactions.data.last} onClick={() => setTransactionsPage((p) => p + 1)} className="w-6 h-6 rounded flex items-center justify-center border border-gray-200 dark:border-gray-700 disabled:opacity-40">
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {tab === "payslips" && employeeId && (
                            <PayslipHistory employeeId={employeeId} pageSize={5} title="Payslips" />
                        )}

                        {tab === "loans" && (
                            <div className="space-y-3">
                                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1 w-fit">
                                    {([
                                        { id: "all", label: "All" },
                                        { id: "active", label: "Active" },
                                        { id: "closed", label: "Closed" },
                                    ] as { id: LoanFilter; label: string }[]).map((f) => (
                                        <button
                                            key={f.id}
                                            onClick={() => setLoansFilter(f.id)}
                                            className={`h-7 px-2.5 rounded-md text-xs font-medium transition-colors ${loansFilter === f.id ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 hover:text-gray-700"}`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>

                                {loans.isLoading && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
                                {!loans.isLoading && filteredLoans.length === 0 && (
                                    <p className="text-sm text-gray-400 py-6 text-center">No loans match this filter.</p>
                                )}
                                {filteredLoans.map((loan) => (
                                    <div key={loan.loanId} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-sm">
                                                <div><p className="text-[10px] uppercase text-gray-500">Issued</p>{loan.issuedDate}</div>
                                                <div><p className="text-[10px] uppercase text-gray-500">Principal</p>{formatLkr(loan.principalAmount)}</div>
                                                <div><p className="text-[10px] uppercase text-gray-500">Installment</p>{formatLkr(loan.installment)}</div>
                                                <div><p className="text-[10px] uppercase text-gray-500">Balance</p><span className="font-semibold">{formatLkr(loan.currentBalance)}</span></div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={cn(
                                                    "text-[10px] font-bold uppercase border-transparent",
                                                    loan.isActive ? "bg-emerald-50 text-brand-600" : "bg-gray-100 text-gray-500"
                                                )}>
                                                    {loan.isActive ? "Active" : "Closed"}
                                                </Badge>
                                                {isAdmin && loan.isActive && (
                                                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setRepayLoan(loan)}>
                                                        Record repayment
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        {loan.repayments.length > 0 && (
                                            <Table>
                                                <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                                                    <TableRow>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Source</TableHead>
                                                        <TableHead>Account</TableHead>
                                                        <TableHead className="text-right">Amount</TableHead>
                                                        <TableHead />
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {loan.repayments.map((r) => (
                                                        <TableRow key={r.repaymentId}>
                                                            <TableCell className="text-sm">{r.repaymentDate}</TableCell>
                                                            <TableCell className="text-sm">{r.source === "PAYSLIP" ? "Payslip deduction" : "Cash / bank"}</TableCell>
                                                            <TableCell className="text-sm text-gray-500">{r.accountCode ?? "-"}</TableCell>
                                                            <TableCell className="text-right text-sm font-medium">{formatLkr(r.amount)}</TableCell>
                                                            <TableCell className="text-right">
                                                                {isAdmin && r.source === "CASH" && (
                                                                    <Button size="sm" variant="ghost" className="h-7 text-xs text-gray-500"
                                                                        disabled={deleteRepayment.isPending}
                                                                        onClick={() => handleDeleteRepayment(loan.loanId, r.repaymentId)}>
                                                                        Undo
                                                                    </Button>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>

        {isAdmin && employeeId && (
            <GiveAdvanceDialog open={advanceOpen} onOpenChange={setAdvanceOpen} employeeId={employeeId} />
        )}
        <RepayLoanDialog loan={repayLoan} onOpenChange={(o) => { if (!o) setRepayLoan(null); }} />
        </>
    );
}
