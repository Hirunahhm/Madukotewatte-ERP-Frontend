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
import { X, Loader2, AlertCircle, ChevronLeft, ChevronRight, Wallet } from "lucide-react";
import { cn, toLocalDateInputValue } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useEmployeePaymentDetail } from "@/features/employees/hooks/use-employee-detail";
import { useRecordSalaryPayment } from "@/features/employees/hooks/use-employee-mutations";
import { isTapperPosition } from "@/features/employees/utils/positions";

const TRANSACTION_LABELS: Record<string, string> = {
    Manual_Labor: "Labour Payment",
    Advance: "Advance",
    Loan_Payment: "Loan Payment",
    Latex_Tap: "Latex Tap Earnings",
    Salary_Payment: "Salary Payment",
};

const TRANSACTION_TYPES = ["Manual_Labor", "Advance", "Loan_Payment", "Latex_Tap", "Salary_Payment"];

type Tab = "transactions" | "loans";
type LoanFilter = "all" | "active" | "closed";

function formatLkr(value: number) {
    return `LKR ${value.toLocaleString()}`;
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

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employeeId: string | null;
}

export function EmployeePaymentDialog({ open, onOpenChange, employeeId }: Props) {
    const [tab, setTab] = useState<Tab>("transactions");

    // Transaction filters
    const [transactionsPage, setTransactionsPage] = useState(0);
    const [transactionsFrom, setTransactionsFrom] = useState("");
    const [transactionsTo, setTransactionsTo] = useState("");
    const [transactionsType, setTransactionsType] = useState("all");

    // Loans filter (client-side)
    const [loansFilter, setLoansFilter] = useState<LoanFilter>("all");

    // Salary payment dialog
    const [salaryPaymentOpen, setSalaryPaymentOpen] = useState(false);
    const [salaryPaymentAmount, setSalaryPaymentAmount] = useState("");
    const [salaryPaymentType, setSalaryPaymentType] = useState<"cash" | "bank_transfer">("cash");
    const [salaryPaymentDate, setSalaryPaymentDate] = useState(toLocalDateInputValue());
    const [salaryPaymentError, setSalaryPaymentError] = useState<string | null>(null);
    const recordSalaryPayment = useRecordSalaryPayment();

    const role = useAuthStore((s) => s.role);
    const isAdmin = role === "ROLE_ADMIN";

    const { employee, transactions, transactionStats, loans } = useEmployeePaymentDetail(
        employeeId,
        {
            page: transactionsPage,
            from: transactionsFrom ? toIsoStart(transactionsFrom) : undefined,
            to: transactionsTo ? toIsoEnd(transactionsTo) : undefined,
            type: transactionsType !== "all" ? transactionsType : undefined,
        },
    );

    const filteredLoans = useMemo(() => {
        const all = loans.data ?? [];
        if (loansFilter === "all") return all;
        return all.filter((l) => (loansFilter === "active" ? l.isActive : !l.isActive));
    }, [loans.data, loansFilter]);

    const loanStats = useMemo(() => {
        const all = loans.data ?? [];
        return {
            totalBorrowed: all.reduce((sum, l) => sum + l.principalAmount, 0),
            totalOutstanding: all.filter((l) => l.isActive).reduce((sum, l) => sum + l.currentBalance, 0),
            activeCount: all.filter((l) => l.isActive).length,
            totalCount: all.length,
        };
    }, [loans.data]);

    useEffect(() => {
        if (!open) {
            setTab("transactions");
            setTransactionsPage(0);
            setTransactionsFrom("");
            setTransactionsTo("");
            setTransactionsType("all");
            setLoansFilter("all");
        }
    }, [open]);

    function openSalaryPaymentDialog() {
        setSalaryPaymentAmount(employee.data?.salary ? String(employee.data.salary) : "");
        setSalaryPaymentType("cash");
        setSalaryPaymentDate(toLocalDateInputValue());
        setSalaryPaymentError(null);
        setSalaryPaymentOpen(true);
    }

    async function handleRecordSalaryPayment() {
        if (!employeeId) return;
        setSalaryPaymentError(null);
        if (!salaryPaymentAmount || Number(salaryPaymentAmount) <= 0) {
            setSalaryPaymentError("Enter a valid amount.");
            return;
        }
        try {
            await recordSalaryPayment.mutateAsync({
                employeeId,
                paymentType: salaryPaymentType,
                amount: Number(salaryPaymentAmount),
                timestamp: `${salaryPaymentDate}T00:00:00`,
            });
            setSalaryPaymentOpen(false);
        } catch (err) {
            setSalaryPaymentError(err instanceof Error ? err.message : "Failed to record salary payment.");
        }
    }

    const transactionFiltersActive = transactionsFrom || transactionsTo || transactionsType !== "all";

    return (
        <>
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{employee.data?.name ?? "Employee Payments"}</DialogTitle>
                </DialogHeader>

                {employee.isLoading && (
                    <div className="py-10 flex justify-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                )}

                {employee.data && (
                    <div className="space-y-5">
                        {/* Read-only info */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Position</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{employee.data.position ?? "-"}</p>
                            </div>
                            {isTapperPosition(employee.data.position) ? (
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Rate per Tree</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{employee.data.ratePerTree ? formatLkr(employee.data.ratePerTree) : "Not set"}</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Salary</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{employee.data.salary != null ? formatLkr(employee.data.salary) : "-"}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Joined</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{employee.data.joinedDate ?? "-"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</p>
                                <Badge variant="outline" className={cn(
                                    "text-[10px] font-bold uppercase border-transparent mt-1",
                                    employee.data.isActive ? "bg-emerald-50 text-brand-600" : "bg-gray-100 text-gray-500"
                                )}>
                                    {employee.data.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </div>

                        {/* Tab switcher */}
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1 w-fit">
                            {([
                                { id: "transactions", label: "Salary & Transactions" },
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

                        {/* Transactions tab */}
                        {tab === "transactions" && (
                            <div className="space-y-3">
                                {isAdmin && (
                                    <div className="flex justify-end">
                                        <Button size="sm" className="gap-1.5 bg-brand-500 hover:bg-brand-600" onClick={openSalaryPaymentDialog}>
                                            <Wallet className="w-3.5 h-3.5" /> Record Salary Payment
                                        </Button>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                                    <StatCard label="Total Earned" value={transactionStats.data ? formatLkr(transactionStats.data.totalAmount) : "-"} accent />
                                    <StatCard label="Latex Tap" value={transactionStats.data ? formatLkr(transactionStats.data.latexTap) : "-"} />
                                    <StatCard label="Salary Payments" value={transactionStats.data ? formatLkr(transactionStats.data.salaryPayments) : "-"} />
                                    <StatCard label="Labour" value={transactionStats.data ? formatLkr(transactionStats.data.manualLabor) : "-"} />
                                    <StatCard label="Advances" value={transactionStats.data ? formatLkr(transactionStats.data.advances) : "-"} />
                                    <StatCard label="Loan Deductions" value={transactionStats.data ? formatLkr(transactionStats.data.loanPayments) : "-"} />
                                </div>

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
                                            <SelectTrigger className="h-8 text-xs w-44"><SelectValue /></SelectTrigger>
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
                                                <TableHead>Payment Method</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {transactions.isLoading && (
                                                <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline-block" /></TableCell></TableRow>
                                            )}
                                            {!transactions.isLoading && (transactions.data?.content.length ?? 0) === 0 && (
                                                <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-400">No transactions match these filters.</TableCell></TableRow>
                                            )}
                                            {transactions.data?.content.map((tx) => (
                                                <TableRow key={tx.transactionRecordId}>
                                                    <TableCell className="text-sm">{new Date(tx.timestamp).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-sm">{TRANSACTION_LABELS[tx.type] ?? tx.type}</TableCell>
                                                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">{tx.paymentType ?? "-"}</TableCell>
                                                    <TableCell className="text-right text-sm font-medium">{formatLkr(tx.amount)}</TableCell>
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

                        {/* Loans tab */}
                        {tab === "loans" && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <StatCard label="Total Borrowed" value={formatLkr(loanStats.totalBorrowed)} />
                                    <StatCard label="Total Outstanding" value={formatLkr(loanStats.totalOutstanding)} accent />
                                    <StatCard label="Active Loans" value={loanStats.activeCount} />
                                    <StatCard label="Total Loans" value={loanStats.totalCount} />
                                </div>

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

                                <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                                            <TableRow>
                                                <TableHead>Principal</TableHead>
                                                <TableHead className="text-right">Installment</TableHead>
                                                <TableHead className="text-right">Balance</TableHead>
                                                <TableHead className="text-right">Interest</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loans.isLoading && (
                                                <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline-block" /></TableCell></TableRow>
                                            )}
                                            {!loans.isLoading && filteredLoans.length === 0 && (
                                                <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-400">No loans match this filter.</TableCell></TableRow>
                                            )}
                                            {filteredLoans.map((loan) => (
                                                <TableRow key={loan.loanId}>
                                                    <TableCell className="text-sm">{formatLkr(loan.principalAmount)}</TableCell>
                                                    <TableCell className="text-right text-sm">{formatLkr(loan.installment)}</TableCell>
                                                    <TableCell className="text-right text-sm font-medium">{formatLkr(loan.currentBalance)}</TableCell>
                                                    <TableCell className="text-right text-sm text-gray-500 dark:text-gray-400">{loan.interest}%</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={cn(
                                                            "text-[10px] font-bold uppercase border-transparent",
                                                            loan.isActive ? "bg-emerald-50 text-brand-600" : "bg-gray-100 text-gray-500"
                                                        )}>
                                                            {loan.isActive ? "Active" : "Closed"}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>

        <Dialog open={salaryPaymentOpen} onOpenChange={setSalaryPaymentOpen}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Record Salary Payment</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-2">
                    {salaryPaymentError && (
                        <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {salaryPaymentError}
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <Label>Amount (LKR)</Label>
                        <Input type="number" min={0} value={salaryPaymentAmount} onChange={(e) => setSalaryPaymentAmount(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Payment Type</Label>
                        <Select value={salaryPaymentType} onValueChange={(v) => { if (v) setSalaryPaymentType(v as "cash" | "bank_transfer"); }}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Date</Label>
                        <Input type="date" value={salaryPaymentDate} onChange={(e) => setSalaryPaymentDate(e.target.value)} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setSalaryPaymentOpen(false)}>Cancel</Button>
                        <Button
                            className="flex-1 bg-brand-500 hover:bg-brand-600"
                            disabled={recordSalaryPayment.isPending}
                            onClick={handleRecordSalaryPayment}
                        >
                            {recordSalaryPayment.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Record Payment
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
}
