"use client";

import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import {
    useLoanMovements, useRecordEstateLoanDrawdown, useRecordEstateLoanPayment,
    useUndoLastLoanMovement, useUpdateEstateLoan,
} from "@/features/assets/hooks/use-assets";
import { AccountSelect } from "@/features/accounts/components/account-select";
import { formatLkr } from "@/features/accounts/utils/format";
import { toLocalDateInputValue } from "@/lib/utils";
import type { EstateLoan } from "@/features/assets/types/assets.types";

function ErrorBanner({ message }: { message: string | null }) {
    if (!message) return null;
    return (
        <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />{message}
        </div>
    );
}

interface LoanDialogProps {
    loan: EstateLoan | null;
    onClose: () => void;
}

function LoanDialogShell({ loan, onClose, wide, children }: LoanDialogProps & { wide?: boolean; children: (loan: EstateLoan) => ReactNode }) {
    return (
        <Dialog open={!!loan} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className={wide ? "sm:max-w-2xl" : "sm:max-w-sm"}>
                {loan && children(loan)}
            </DialogContent>
        </Dialog>
    );
}

// ─── Repayment (principal + interest) ───────────────────────────────────────

export function RepaymentDialog({ loan, onClose }: LoanDialogProps) {
    return (
        <LoanDialogShell loan={loan} onClose={onClose}>
            {(l) => <RepaymentForm key={l.loanId} loan={l} onClose={onClose} />}
        </LoanDialogShell>
    );
}

function RepaymentForm({ loan, onClose }: { loan: EstateLoan; onClose: () => void }) {
    const [principal, setPrincipal] = useState("");
    const [interest, setInterest] = useState("");
    const [accountCode, setAccountCode] = useState("");
    const [date, setDate] = useState(toLocalDateInputValue());
    const [error, setError] = useState<string | null>(null);
    const record = useRecordEstateLoanPayment();

    const principalValue = Number(principal) || 0;
    const interestValue = Number(interest) || 0;

    async function handleSubmit() {
        setError(null);
        if (principalValue <= 0 && interestValue <= 0) {
            setError("Enter a principal and/or interest amount.");
            return;
        }
        if (principalValue > loan.currentBalance) {
            setError("Principal is more than the outstanding balance.");
            return;
        }
        if (!accountCode) {
            setError("Choose the account to pay from.");
            return;
        }
        try {
            await record.mutateAsync({
                loanId: loan.loanId,
                payload: { principalAmount: principalValue, interestAmount: interestValue, accountCode, paymentDate: date || undefined },
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to record payment.");
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Repay {loan.name}</DialogTitle>
                <DialogDescription>
                    Outstanding {formatLkr(loan.currentBalance)}. Interest is recorded as an Interest expense.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-2">
                <ErrorBanner message={error} />
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label>Principal (LKR)</Label>
                        <Input type="number" min={0} value={principal} onChange={(e) => setPrincipal(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Interest (LKR)</Label>
                        <Input type="number" min={0} value={interest} onChange={(e) => setInterest(e.target.value)} />
                    </div>
                </div>
                {loan.installmentAmount ? (
                    <button type="button" className="text-xs text-brand-600 hover:underline"
                        onClick={() => setPrincipal(String(Math.min(loan.installmentAmount ?? 0, loan.currentBalance)))}>
                        Use instalment {formatLkr(loan.installmentAmount)} as principal
                    </button>
                ) : null}
                <div className="space-y-1.5">
                    <Label>Payment Date</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Pay From</Label>
                    <AccountSelect value={accountCode} onValueChange={setAccountCode} allowedTypes={["CASH", "BANK"]} />
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-sm flex justify-between">
                    <span className="text-gray-500">Total paid from account</span>
                    <span className="font-semibold">{formatLkr(principalValue + interestValue)}</span>
                </div>
                <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button className="flex-1 bg-brand-500 hover:bg-brand-600" disabled={record.isPending} onClick={handleSubmit}>
                        {record.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Record Repayment
                    </Button>
                </div>
            </div>
        </>
    );
}

// ─── Additional drawdown ────────────────────────────────────────────────────

export function DrawdownDialog({ loan, onClose }: LoanDialogProps) {
    return (
        <LoanDialogShell loan={loan} onClose={onClose}>
            {(l) => <DrawdownForm key={l.loanId} loan={l} onClose={onClose} />}
        </LoanDialogShell>
    );
}

function DrawdownForm({ loan, onClose }: { loan: EstateLoan; onClose: () => void }) {
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(toLocalDateInputValue());
    const [accountCode, setAccountCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const record = useRecordEstateLoanDrawdown();

    async function handleSubmit() {
        setError(null);
        if (!amount || Number(amount) <= 0) {
            setError("Enter a valid amount.");
            return;
        }
        try {
            await record.mutateAsync({
                loanId: loan.loanId,
                payload: { amount: Number(amount), date: date || undefined, accountCode: accountCode || undefined },
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to record drawdown.");
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Draw down more: {loan.name}</DialogTitle>
                <DialogDescription>Adds to the loan balance, now {formatLkr(loan.currentBalance)}.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-2">
                <ErrorBanner message={error} />
                <div className="space-y-1.5">
                    <Label>Amount (LKR)</Label>
                    <Input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Date</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Received Into (optional)</Label>
                    <div className="flex gap-2">
                        <AccountSelect value={accountCode} onValueChange={setAccountCode} allowedTypes={["CASH", "BANK"]}
                            placeholder="Already spent / not deposited" />
                        {accountCode && <Button type="button" variant="outline" onClick={() => setAccountCode("")}>Clear</Button>}
                    </div>
                </div>
                <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button className="flex-1 bg-brand-500 hover:bg-brand-600" disabled={record.isPending} onClick={handleSubmit}>
                        {record.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Record Drawdown
                    </Button>
                </div>
            </div>
        </>
    );
}

// ─── Movement history with undo of the latest movement ──────────────────────

export function LoanHistoryDialog({ loan, onClose }: LoanDialogProps) {
    return (
        <LoanDialogShell loan={loan} onClose={onClose} wide>
            {(l) => <HistoryBody key={l.loanId} loan={l} />}
        </LoanDialogShell>
    );
}

function HistoryBody({ loan }: { loan: EstateLoan }) {
    const { data, isLoading } = useLoanMovements(loan.loanId);
    const undo = useUndoLastLoanMovement();
    const [error, setError] = useState<string | null>(null);

    async function handleUndo() {
        if (!window.confirm("Undo the latest movement? Its account entries (and any interest expense) are reversed.")) return;
        setError(null);
        try {
            await undo.mutateAsync(loan.loanId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to undo.");
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>{loan.name}: movements</DialogTitle>
                <DialogDescription>Balance {formatLkr(loan.currentBalance)}. Only the latest repayment or drawdown can be undone.</DialogDescription>
            </DialogHeader>
            <ErrorBanner message={error} />
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Principal</TableHead>
                            <TableHead className="text-right">Interest</TableHead>
                            <TableHead className="text-right">Balance after</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && <TableRow><TableCell colSpan={6} className="text-center py-6"><Loader2 className="w-4 h-4 animate-spin inline" /></TableCell></TableRow>}
                        {(data ?? []).map((m, i) => (
                            <TableRow key={m.id}>
                                <TableCell className="text-sm">{m.transactionDate}</TableCell>
                                <TableCell className="text-sm">{m.type === "repay" ? "Repayment" : i === 0 ? "Loan received" : "Drawdown"}</TableCell>
                                <TableCell className="text-right text-sm">{formatLkr(m.amount)}</TableCell>
                                <TableCell className="text-right text-sm">{m.interestAmount > 0 ? formatLkr(m.interestAmount) : "-"}</TableCell>
                                <TableCell className="text-right text-sm">{formatLkr(m.balanceAfter)}</TableCell>
                                <TableCell className="text-right">
                                    {m.undoable && (
                                        <Button size="sm" variant="outline" disabled={undo.isPending} onClick={handleUndo}>Undo</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

// ─── Edit loan details ──────────────────────────────────────────────────────

export function EditLoanDialog({ loan, onClose }: LoanDialogProps) {
    return (
        <LoanDialogShell loan={loan} onClose={onClose}>
            {(l) => <EditLoanForm key={l.loanId} loan={l} onClose={onClose} />}
        </LoanDialogShell>
    );
}

function EditLoanForm({ loan, onClose }: { loan: EstateLoan; onClose: () => void }) {
    const [name, setName] = useState(loan.name);
    const [lender, setLender] = useState(loan.lender ?? "");
    const [rate, setRate] = useState(loan.interestRate != null ? String(loan.interestRate) : "");
    const [term, setTerm] = useState(loan.termMonths != null ? String(loan.termMonths) : "");
    const [installment, setInstallment] = useState(loan.installmentAmount != null ? String(loan.installmentAmount) : "");
    const [notes, setNotes] = useState(loan.notes ?? "");
    const [error, setError] = useState<string | null>(null);
    const update = useUpdateEstateLoan();

    async function handleSubmit() {
        setError(null);
        try {
            await update.mutateAsync({
                loanId: loan.loanId,
                payload: {
                    name: name.trim() || undefined,
                    lender,
                    interestRate: rate ? Number(rate) : undefined,
                    termMonths: term ? parseInt(term, 10) : undefined,
                    installmentAmount: installment ? Number(installment) : undefined,
                    notes,
                },
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update loan.");
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Edit loan details</DialogTitle>
                <DialogDescription>Money movements are changed by repaying, drawing down or undoing, not here.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-2">
                <ErrorBanner message={error} />
                <div className="space-y-1.5"><Label>Loan Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="space-y-1.5"><Label>Lender</Label><Input value={lender} onChange={(e) => setLender(e.target.value)} /></div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5"><Label>Rate (%)</Label><Input type="number" min={0} step={0.1} value={rate} onChange={(e) => setRate(e.target.value)} /></div>
                    <div className="space-y-1.5"><Label>Term (months)</Label><Input type="number" min={1} value={term} onChange={(e) => setTerm(e.target.value)} /></div>
                    <div className="space-y-1.5"><Label>Instalment</Label><Input type="number" min={0} value={installment} onChange={(e) => setInstallment(e.target.value)} /></div>
                </div>
                <div className="space-y-1.5"><Label>Notes</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
                <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button className="flex-1 bg-brand-500 hover:bg-brand-600" disabled={update.isPending} onClick={handleSubmit}>
                        {update.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save
                    </Button>
                </div>
            </div>
        </>
    );
}
