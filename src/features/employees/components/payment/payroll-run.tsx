"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AccountSelect } from "@/features/accounts/components/account-select";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { toLocalDateInputValue } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useCreatePayslip, useCreatePayslipsBulk, usePayrollPreview } from "@/features/employees/hooks/use-payroll";
import { EmployeePaymentDialog } from "./employee-payment-dialog";
import { PAY_TYPE_LABELS } from "@/features/employees/types/employee.types";
import type { PayrollPreviewRow, PayslipRequest } from "@/features/employees/types/payroll.types";

type PeriodMode = "month" | "custom";

interface Edit {
    advance?: string;
    loan?: string;
    other?: string;
}

function fmt(value: number): string {
    return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function monthRange(month: string): { from: string; to: string } {
    const [y, m] = month.split("-").map(Number);
    const last = new Date(y, m, 0).getDate();
    return { from: `${month}-01`, to: `${month}-${String(last).padStart(2, "0")}` };
}

function round2(value: number): number {
    return Math.round(value * 100) / 100;
}

interface RowFigures {
    advance: number;
    loan: number;
    other: number;
    net: number;
    error: string | null;
}

function figures(row: PayrollPreviewRow, edit: Edit | undefined): RowFigures {
    const advance = Number(edit?.advance ?? row.suggestedAdvanceDeduction) || 0;
    const loan = Number(edit?.loan ?? row.suggestedLoanDeduction) || 0;
    const other = Number(edit?.other ?? 0) || 0;
    const net = round2(row.grossPay - advance - loan - other);
    let error: string | null = null;
    if (row.grossPay <= 0) error = "Nothing to pay for this period";
    else if (advance < 0 || loan < 0 || other < 0) error = "Deductions cannot be negative";
    else if (advance > row.outstandingAdvances) error = "Advance deduction is more than outstanding";
    else if (loan > 0 && !row.activeLoan) error = "No active loan";
    else if (row.activeLoan && loan > row.activeLoan.balance) error = "Loan deduction is more than the balance";
    else if (net < 0) error = "Deductions exceed gross pay";
    return { advance, loan, other, net, error };
}

export function PayrollRun() {
    const now = new Date();
    const [mode, setMode] = useState<PeriodMode>("month");
    const [month, setMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
    const [customFrom, setCustomFrom] = useState(monthRange(month).from);
    const [customTo, setCustomTo] = useState(toLocalDateInputValue());
    const [accountCode, setAccountCode] = useState("");
    const [paymentDate, setPaymentDate] = useState(toLocalDateInputValue());
    const [edits, setEdits] = useState<Record<string, Edit>>({});
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [confirmRows, setConfirmRows] = useState<PayrollPreviewRow[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [detailEmployeeId, setDetailEmployeeId] = useState<string | null>(null);

    const isAdmin = useAuthStore((s) => s.role) === "ROLE_ADMIN";
    const { from, to } = mode === "month" ? monthRange(month) : { from: customFrom, to: customTo };
    const { data: rows, isLoading, error: loadError } = usePayrollPreview(from, to);
    const { data: accounts } = useAccounts();
    const createPayslip = useCreatePayslip();
    const createBulk = useCreatePayslipsBulk();
    const busy = createPayslip.isPending || createBulk.isPending;

    function resetSelection() {
        setEdits({});
        setSelected(new Set());
        setSuccess(null);
        setError(null);
    }

    function setEdit(id: string, patch: Edit) {
        setEdits((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
    }

    const payable = useMemo(
        () => (rows ?? []).filter((r) => figures(r, edits[r.employeeId]).error === null),
        [rows, edits],
    );

    function toggle(id: string) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function toggleAll() {
        setSelected(selected.size === payable.length ? new Set() : new Set(payable.map((r) => r.employeeId)));
    }

    function requestFor(row: PayrollPreviewRow): PayslipRequest {
        const f = figures(row, edits[row.employeeId]);
        return {
            employeeId: row.employeeId,
            periodStart: from,
            periodEnd: to,
            advanceDeduction: f.advance,
            loanDeduction: f.loan,
            otherDeduction: f.other || undefined,
            accountCode,
            paymentDate,
        };
    }

    function openConfirm(list: PayrollPreviewRow[]) {
        setError(null);
        setSuccess(null);
        if (!accountCode) {
            setError("Choose the account to pay from.");
            return;
        }
        if (!paymentDate) {
            setError("Choose a payment date.");
            return;
        }
        if (list.length === 0) {
            setError("Select at least one employee with something to pay.");
            return;
        }
        setConfirmRows(list);
    }

    async function confirmPay() {
        if (!confirmRows) return;
        setError(null);
        try {
            const requests = confirmRows.map(requestFor);
            if (requests.length === 1) await createPayslip.mutateAsync(requests[0]);
            else await createBulk.mutateAsync(requests);
            const total = confirmRows.reduce((sum, r) => sum + figures(r, edits[r.employeeId]).net, 0);
            setSuccess(`Paid ${requests.length} payslip${requests.length > 1 ? "s" : ""} - LKR ${fmt(round2(total))} left ${accountCode}.`);
            setConfirmRows(null);
            setEdits({});
            setSelected(new Set());
        } catch (err) {
            setConfirmRows(null);
            setError(err instanceof Error ? err.message : "Payment failed.");
        }
    }

    const selectedRows = (rows ?? []).filter((r) => selected.has(r.employeeId));
    const selectedNet = selectedRows.reduce((sum, r) => sum + figures(r, edits[r.employeeId]).net, 0);
    const account = accounts?.find((a) => a.code === accountCode);

    return (
        <Card className="shadow-sm gap-0 overflow-hidden p-0">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 space-y-4">
                <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Payroll</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Earnings are calculated by the server: fixed salary, tapping (trees x rate) and unpaid labour hours. Review deductions, then pay.
                    </p>
                </div>

                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
                        {(["month", "custom"] as PeriodMode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => { setMode(m); resetSelection(); }}
                                className={`h-8 px-3 rounded-md text-xs font-medium transition-colors ${mode === m ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                {m === "month" ? "Month" : "Custom range"}
                            </button>
                        ))}
                    </div>
                    {mode === "month" ? (
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Month</Label>
                            <Input type="month" className="h-8 text-xs w-40" value={month}
                                onChange={(e) => { if (e.target.value) { setMonth(e.target.value); resetSelection(); } }} />
                        </div>
                    ) : (
                        <>
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">From</Label>
                                <Input type="date" className="h-8 text-xs w-36" value={customFrom}
                                    onChange={(e) => { setCustomFrom(e.target.value); resetSelection(); }} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">To</Label>
                                <Input type="date" className="h-8 text-xs w-36" value={customTo}
                                    onChange={(e) => { setCustomTo(e.target.value); resetSelection(); }} />
                            </div>
                        </>
                    )}

                    {isAdmin && (
                        <>
                            <div className="space-y-1 min-w-60">
                                <Label className="text-xs text-gray-500">Pay from</Label>
                                <AccountSelect value={accountCode} onValueChange={setAccountCode} allowedTypes={["CASH", "BANK"]} className="h-8 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">Payment date</Label>
                                <Input type="date" className="h-8 text-xs w-36" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
                            </div>
                            <Button
                                size="sm"
                                className="h-8 gap-1.5 bg-brand-500 hover:bg-brand-600 text-white"
                                disabled={selected.size === 0 || busy}
                                onClick={() => openConfirm(selectedRows)}
                            >
                                <Wallet className="w-3.5 h-3.5" />
                                Pay selected ({selected.size})
                            </Button>
                        </>
                    )}
                </div>

                {from > to && (
                    <p className="text-xs text-red-600">The period end is before its start.</p>
                )}
                {error && (
                    <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}
                {success && (
                    <div role="status" className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/30 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        {success}
                    </div>
                )}
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                        <TableRow className="border-gray-100 dark:border-gray-700/40">
                            {isAdmin && (
                                <TableHead className="px-3 w-8">
                                    <input type="checkbox" aria-label="Select all" checked={payable.length > 0 && selected.size === payable.length} onChange={toggleAll} />
                                </TableHead>
                            )}
                            <TableHead className="text-gray-500 dark:text-gray-400 font-semibold">Employee</TableHead>
                            <TableHead className="text-right text-gray-500 dark:text-gray-400 font-semibold">Fixed</TableHead>
                            <TableHead className="text-right text-gray-500 dark:text-gray-400 font-semibold">Tapping</TableHead>
                            <TableHead className="text-right text-gray-500 dark:text-gray-400 font-semibold">Hourly</TableHead>
                            <TableHead className="text-right text-gray-500 dark:text-gray-400 font-semibold">Gross</TableHead>
                            <TableHead className="text-right text-gray-500 dark:text-gray-400 font-semibold">Advance (owed / deduct)</TableHead>
                            <TableHead className="text-right text-gray-500 dark:text-gray-400 font-semibold">Loan (balance / deduct)</TableHead>
                            <TableHead className="text-right text-gray-500 dark:text-gray-400 font-semibold">Other deduct</TableHead>
                            <TableHead className="text-right text-gray-500 dark:text-gray-400 font-semibold">Net pay</TableHead>
                            {isAdmin && <TableHead />}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={11} className="py-10 text-center text-gray-400">
                                    <Loader2 className="w-5 h-5 animate-spin inline-block" />
                                </TableCell>
                            </TableRow>
                        )}
                        {loadError && (
                            <TableRow>
                                <TableCell colSpan={11} className="py-6 text-center text-sm text-red-600">
                                    {loadError instanceof Error ? loadError.message : "Failed to load payroll."}
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading && !loadError && (rows?.length ?? 0) === 0 && (
                            <TableRow>
                                <TableCell colSpan={11} className="py-8 text-center text-gray-400">No active employees.</TableCell>
                            </TableRow>
                        )}
                        {rows?.map((row) => {
                            const edit = edits[row.employeeId];
                            const f = figures(row, edit);
                            const canPay = f.error === null;
                            return (
                                <TableRow key={row.employeeId} className="border-gray-50 dark:border-gray-700/30">
                                    {isAdmin && (
                                        <TableCell className="px-3">
                                            <input type="checkbox" aria-label={`Select ${row.employeeName}`} disabled={!canPay}
                                                checked={selected.has(row.employeeId)} onChange={() => toggle(row.employeeId)} />
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <button className="font-semibold text-gray-900 dark:text-gray-100 text-sm hover:text-brand-600 hover:underline underline-offset-2 text-left"
                                            onClick={() => setDetailEmployeeId(row.employeeId)}>
                                            {row.employeeName}
                                        </button>
                                        <div className="flex flex-wrap items-center gap-1 mt-0.5">
                                            <Badge variant="outline" className="text-[10px] font-medium">{PAY_TYPE_LABELS[row.payType]}</Badge>
                                            {row.alreadyPaid.map((p) => (
                                                <Badge key={p.payslipId} variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                                                    Paid {p.periodStart} to {p.periodEnd}
                                                </Badge>
                                            ))}
                                        </div>
                                        {!canPay && row.grossPay > 0 && <p className="text-[11px] text-red-600 mt-0.5">{f.error}</p>}
                                    </TableCell>
                                    <TableCell className="text-right text-sm">{row.fixedSalary > 0 ? fmt(row.fixedSalary) : "-"}</TableCell>
                                    <TableCell className="text-right text-sm">
                                        {row.tapEarnings > 0 ? fmt(row.tapEarnings) : "-"}
                                        {row.tapRecordCount > 0 && <p className="text-[10px] text-gray-400">{row.tapRecordCount} days</p>}
                                    </TableCell>
                                    <TableCell className="text-right text-sm">
                                        {row.hourlyEarnings > 0 ? fmt(row.hourlyEarnings) : "-"}
                                        {row.labourHours > 0 && <p className="text-[10px] text-gray-400">{fmt(row.labourHours)} h</p>}
                                    </TableCell>
                                    <TableCell className="text-right text-sm font-semibold">{fmt(row.grossPay)}</TableCell>
                                    <TableCell className="text-right">
                                        <p className="text-[11px] text-gray-400">{row.outstandingAdvances > 0 ? fmt(row.outstandingAdvances) : "-"}</p>
                                        <Input type="number" min={0} className="h-7 w-24 text-xs text-right ml-auto"
                                            disabled={!isAdmin || row.outstandingAdvances <= 0}
                                            value={edit?.advance ?? String(row.suggestedAdvanceDeduction)}
                                            onChange={(e) => setEdit(row.employeeId, { advance: e.target.value })} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <p className="text-[11px] text-gray-400">{row.activeLoan ? fmt(row.activeLoan.balance) : "-"}</p>
                                        <Input type="number" min={0} className="h-7 w-24 text-xs text-right ml-auto"
                                            disabled={!isAdmin || !row.activeLoan}
                                            value={edit?.loan ?? String(row.suggestedLoanDeduction)}
                                            onChange={(e) => setEdit(row.employeeId, { loan: e.target.value })} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Input type="number" min={0} className="h-7 w-24 text-xs text-right ml-auto"
                                            disabled={!isAdmin || row.grossPay <= 0}
                                            value={edit?.other ?? ""} placeholder="0"
                                            onChange={(e) => setEdit(row.employeeId, { other: e.target.value })} />
                                    </TableCell>
                                    <TableCell className="text-right text-sm font-bold text-gray-900 dark:text-gray-100">{fmt(f.net)}</TableCell>
                                    {isAdmin && (
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="outline" className="h-7 text-xs" disabled={!canPay || busy}
                                                onClick={() => openConfirm([row])}>
                                                Pay
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {isAdmin && selected.size > 0 && (
                <div className="p-3 border-t border-gray-100 dark:border-gray-700/40 text-xs text-gray-600 dark:text-gray-300">
                    {selected.size} selected - total net LKR {fmt(round2(selectedNet))}
                    {account && account.type !== "CREDIT_CARD" && selectedNet > account.balance && (
                        <span className="ml-2 text-red-600">More than the {account.name} balance (LKR {fmt(account.balance)}).</span>
                    )}
                </div>
            )}

            <EmployeePaymentDialog
                open={detailEmployeeId !== null}
                onOpenChange={(o) => { if (!o) setDetailEmployeeId(null); }}
                employeeId={detailEmployeeId}
            />

            <Dialog open={confirmRows !== null} onOpenChange={(o) => { if (!o) setConfirmRows(null); }}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Confirm payment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 text-sm">
                        <p className="text-gray-600 dark:text-gray-300">
                            Period {from} to {to}, paid on {paymentDate} from <span className="font-semibold">{account?.name ?? accountCode}</span>.
                        </p>
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700/50 max-h-64 overflow-y-auto">
                            {confirmRows?.map((r) => {
                                const f = figures(r, edits[r.employeeId]);
                                return (
                                    <div key={r.employeeId} className="flex items-center justify-between px-3 py-2">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{r.employeeName}</p>
                                            <p className="text-[11px] text-gray-500">
                                                Gross {fmt(r.grossPay)} - advance {fmt(f.advance)} - loan {fmt(f.loan)} - other {fmt(f.other)}
                                            </p>
                                        </div>
                                        <p className="font-semibold">LKR {fmt(f.net)}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-between font-semibold">
                            <span>Total net</span>
                            <span>LKR {fmt(round2((confirmRows ?? []).reduce((s, r) => s + figures(r, edits[r.employeeId]).net, 0)))}</span>
                        </div>
                        <div className="flex gap-3 pt-1">
                            <Button variant="outline" className="flex-1" onClick={() => setConfirmRows(null)}>Cancel</Button>
                            <Button className="flex-1 bg-brand-500 hover:bg-brand-600 text-white" disabled={busy} onClick={confirmPay}>
                                {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Pay now
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
